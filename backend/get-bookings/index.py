import json
import os

import psycopg2


def handler(event: dict, context) -> dict:
    """Возвращает список предстоящих броней пользователя по номеру телефона."""

    if event.get('httpMethod') == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400',
            },
            'body': '',
        }

    params = event.get('queryStringParameters') or {}
    phone = (params.get('phone') or '').strip()

    if not phone:
        return {
            'statusCode': 400,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'ok': False, 'error': 'Необходим параметр phone'}),
        }

    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()
    schema = 't_p2327292_link_name_change_pro'

    cur.execute(
        f"""SELECT id, booking_date, booking_time, name, service_type
            FROM {schema}.bookings
            WHERE phone = %s AND booking_date >= CURRENT_DATE
            ORDER BY booking_date, booking_time""",
        (phone,)
    )
    rows = cur.fetchall()
    cur.close()
    conn.close()

    bookings = [
        {
            'id': row[0],
            'date': row[1].isoformat(),
            'time': row[2],
            'name': row[3],
            'serviceType': row[4],
        }
        for row in rows
    ]

    return {
        'statusCode': 200,
        'headers': {'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'ok': True, 'bookings': bookings}),
    }
