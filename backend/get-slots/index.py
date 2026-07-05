import json
import os
from datetime import datetime, timedelta, timezone

import psycopg2


TIME_SLOTS = ["18:00", "18:30", "19:00", "19:30", "20:00", "20:30"]
MSK = timezone(timedelta(hours=3))


def handler(event: dict, context) -> dict:
    """Возвращает занятые слоты по дате и ближайший свободный слот."""

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
    query_date = params.get('date')

    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()

    schema = 't_p2327292_link_name_change_pro'

    if query_date:
        cur.execute(
            f"SELECT booking_time FROM {schema}.bookings WHERE booking_date = %s",
            (query_date,)
        )
        busy = [row[0] for row in cur.fetchall()]
        cur.close()
        conn.close()
        return {
            'statusCode': 200,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'busy': busy}),
        }

    # Ищем ближайший свободный слот начиная с текущего часа по Москве (с округлением вверх)
    now_msk = datetime.now(MSK)
    rounded_now = now_msk.replace(minute=0, second=0, microsecond=0)
    if now_msk.minute > 0 or now_msk.second > 0:
        rounded_now += timedelta(hours=1)

    today = rounded_now.date()
    nearest_date = None
    nearest_time = None

    for delta in range(60):
        check_date = today + timedelta(days=delta)
        cur.execute(
            f"SELECT booking_time FROM {schema}.bookings WHERE booking_date = %s",
            (check_date.isoformat(),)
        )
        busy_times = {row[0] for row in cur.fetchall()}

        for slot in TIME_SLOTS:
            slot_dt = datetime(check_date.year, check_date.month, check_date.day,
                               int(slot.split(':')[0]), int(slot.split(':')[1]), tzinfo=MSK)
            if slot_dt < rounded_now:
                continue
            if slot not in busy_times:
                nearest_date = check_date.isoformat()
                nearest_time = slot
                break
        if nearest_date:
            break

    cur.close()
    conn.close()

    return {
        'statusCode': 200,
        'headers': {'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({
            'nearest_date': nearest_date,
            'nearest_time': nearest_time,
        }),
    }