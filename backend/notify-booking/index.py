import json
import os
import smtplib
import urllib.request
import urllib.parse
from datetime import datetime
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

import psycopg2


def handler(event: dict, context) -> dict:
    """Сохраняет бронь в БД и отправляет email и SMS при новой заявке на консультацию или наставничество."""

    if event.get('httpMethod') == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400',
            },
            'body': '',
        }

    body = json.loads(event.get('body') or '{}')
    name = body.get('name', '').strip()
    phone = body.get('phone', '').strip()
    date_iso = body.get('dateIso', '').strip()
    time = body.get('time', '').strip()
    service_type = body.get('serviceType', 'consultation')
    date_label = body.get('date', date_iso).strip()

    # Сохранить в БД
    if date_iso and time:
        try:
            conn = psycopg2.connect(os.environ['DATABASE_URL'])
            cur = conn.cursor()
            schema = 't_p2327292_link_name_change_pro'
            cur.execute(
                f"INSERT INTO {schema}.bookings (booking_date, booking_time, name, phone, service_type) "
                f"VALUES (%s, %s, %s, %s, %s) ON CONFLICT (booking_date, booking_time) DO NOTHING",
                (date_iso, time, name, phone, service_type)
            )
            conn.commit()
            cur.close()
            conn.close()
        except Exception as e:
            pass

    service_label = 'наставничество' if service_type == 'mentoring' else 'консультацию'
    service_label_cap = 'Наставничество' if service_type == 'mentoring' else 'Консультацию'

    message_text = (
        f"Имеется заявка на {service_label_cap} от {name}, "
        f"{date_label}, {time}. "
        f"Свяжитесь с ним по телефону {phone}"
    )

    errors = []

    # EMAIL via Yandex SMTP
    smtp_password = os.environ.get('SMTP_PASSWORD', '')
    if smtp_password:
        try:
            msg = MIMEMultipart('alternative')
            msg['Subject'] = f'Новая заявка на {service_label} — Radiology Arts'
            msg['From'] = 'brainmodel@yandex.ru'
            msg['To'] = 'brainmodel@yandex.ru'
            msg.attach(MIMEText(message_text, 'plain', 'utf-8'))

            with smtplib.SMTP_SSL('smtp.yandex.ru', 465) as server:
                server.login('brainmodel@yandex.ru', smtp_password)
                server.sendmail('brainmodel@yandex.ru', 'brainmodel@yandex.ru', msg.as_string())
        except Exception as e:
            errors.append(f'email: {e}')

    # SMS via SMSC.ru
    smsc_login = os.environ.get('SMSC_LOGIN', 'brainmodel@yandex.ru')
    smsc_password = os.environ.get('SMSC_PASSWORD', '')
    if smsc_password:
        try:
            params = urllib.parse.urlencode({
                'login': smsc_login,
                'psw': smsc_password,
                'phones': '+79155835045',
                'mes': message_text,
                'charset': 'utf-8',
                'fmt': '3',
            })
            url = f'https://smsc.ru/sys/send.php?{params}'
            with urllib.request.urlopen(url, timeout=10) as resp:
                resp.read()
        except Exception as e:
            errors.append(f'sms: {e}')

    return {
        'statusCode': 200,
        'headers': {'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'ok': True, 'errors': errors}),
    }
