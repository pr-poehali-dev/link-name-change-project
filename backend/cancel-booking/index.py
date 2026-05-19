import json
import os

import psycopg2


def handler(event: dict, context) -> dict:
    """Отменяет бронь пользователя по номеру телефона, дате и времени."""

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
    phone = body.get('phone', '').strip()
    date_iso = body.get('dateIso', '').strip()
    time = body.get('time', '').strip()

    if not phone or not date_iso or not time:
        return {
            'statusCode': 400,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'ok': False, 'error': 'Необходимы phone, dateIso, time'}),
        }

    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()
    schema = 't_p2327292_link_name_change_pro'

    cur.execute(
        f"DELETE FROM {schema}.bookings WHERE phone = %s AND booking_date = %s AND booking_time = %s",
        (phone, date_iso, time)
    )
    deleted = cur.rowcount
    conn.commit()
    cur.close()
    conn.close()

    return {
        'statusCode': 200,
        'headers': {'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'ok': True, 'deleted': deleted}),
    }
