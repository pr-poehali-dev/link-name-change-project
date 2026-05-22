import json
import os
from datetime import datetime

import psycopg2

SCHEMA = 't_p2327292_link_name_change_pro'
CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
}


def handler(event: dict, context) -> dict:
    """Управление вопросами, ответами и счётчиком посещений.
    GET  ?phone=...          — вопросы пользователя по телефону
    GET  ?token=...          — все вопросы + статистика посещений (только владелец)
    POST action=send         — отправить вопрос {phone, name, question}
    POST action=answer       — ответить на вопрос {token, id, answer}
    POST action=visit        — записать посещение {user_agent, referrer}
    """

    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS, 'body': ''}

    method = event.get('httpMethod', 'GET')
    owner_password = os.environ.get('OWNER_PASSWORD', '')

    if method == 'GET':
        params = event.get('queryStringParameters') or {}
        phone = (params.get('phone') or '').strip()
        token = (params.get('token') or '').strip()
        is_owner = bool(owner_password and token == owner_password)

        if not phone and not is_owner:
            return {'statusCode': 400, 'headers': CORS,
                    'body': json.dumps({'ok': False, 'error': 'Необходим phone или token'})}

        conn = psycopg2.connect(os.environ['DATABASE_URL'])
        cur = conn.cursor()

        if is_owner:
            cur.execute(
                f"""SELECT id, phone, name, question, answer, answered_at, created_at
                    FROM {SCHEMA}.questions ORDER BY created_at DESC"""
            )
        else:
            cur.execute(
                f"""SELECT id, phone, name, question, answer, answered_at, created_at
                    FROM {SCHEMA}.questions WHERE phone = %s ORDER BY created_at DESC""",
                (phone,)
            )

        rows = cur.fetchall()

        visits_stats = None
        if is_owner:
            cur.execute(f"SELECT COUNT(*) FROM {SCHEMA}.page_visits")
            total = cur.fetchone()[0]
            cur.execute(f"SELECT COUNT(*) FROM {SCHEMA}.page_visits WHERE visited_at >= NOW() - INTERVAL '7 days'")
            week = cur.fetchone()[0]
            cur.execute(f"SELECT COUNT(*) FROM {SCHEMA}.page_visits WHERE visited_at >= NOW() - INTERVAL '1 day'")
            today = cur.fetchone()[0]
            cur.execute(f"""
                SELECT DATE(visited_at) AS d, COUNT(*) AS cnt
                FROM {SCHEMA}.page_visits
                WHERE visited_at >= NOW() - INTERVAL '30 days'
                GROUP BY d ORDER BY d DESC LIMIT 30
            """)
            daily = [{'date': str(r[0]), 'count': r[1]} for r in cur.fetchall()]
            visits_stats = {'total': total, 'week': week, 'today': today, 'daily': daily}

        cur.close()
        conn.close()

        questions = [{
            'id': r[0],
            'phone': r[1] if is_owner else None,
            'name': r[2],
            'question': r[3],
            'answer': r[4],
            'answeredAt': r[5].isoformat() if r[5] else None,
            'createdAt': r[6].isoformat() if r[6] else None,
        } for r in rows]

        return {'statusCode': 200, 'headers': CORS,
                'body': json.dumps({'ok': True, 'questions': questions, 'isOwner': is_owner, 'visits': visits_stats})}

    if method == 'POST':
        body = json.loads(event.get('body') or '{}')
        action = body.get('action', '')

        if action == 'send':
            phone = body.get('phone', '').strip()
            name = body.get('name', '').strip()
            question = body.get('question', '').strip()

            if not phone or not name or not question:
                return {'statusCode': 400, 'headers': CORS,
                        'body': json.dumps({'ok': False, 'error': 'Необходимы phone, name, question'})}

            conn = psycopg2.connect(os.environ['DATABASE_URL'])
            cur = conn.cursor()
            cur.execute(
                f"INSERT INTO {SCHEMA}.questions (phone, name, question) VALUES (%s, %s, %s) RETURNING id",
                (phone, name, question)
            )
            new_id = cur.fetchone()[0]
            conn.commit()
            cur.close()
            conn.close()
            return {'statusCode': 200, 'headers': CORS,
                    'body': json.dumps({'ok': True, 'id': new_id})}

        if action == 'answer':
            token = body.get('token', '').strip()
            question_id = body.get('id')
            answer = body.get('answer', '').strip()

            if not owner_password or token != owner_password:
                return {'statusCode': 403, 'headers': CORS,
                        'body': json.dumps({'ok': False, 'error': 'Нет доступа'})}
            if not question_id or not answer:
                return {'statusCode': 400, 'headers': CORS,
                        'body': json.dumps({'ok': False, 'error': 'Необходимы id и answer'})}

            conn = psycopg2.connect(os.environ['DATABASE_URL'])
            cur = conn.cursor()
            cur.execute(
                f"UPDATE {SCHEMA}.questions SET answer = %s, answered_at = %s WHERE id = %s",
                (answer, datetime.now(), question_id)
            )
            conn.commit()
            cur.close()
            conn.close()
            return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({'ok': True})}

        if action == 'visit':
            user_agent = body.get('user_agent', '')[:512]
            referrer = body.get('referrer', '')[:512]
            conn = psycopg2.connect(os.environ['DATABASE_URL'])
            cur = conn.cursor()
            cur.execute(
                f"INSERT INTO {SCHEMA}.page_visits (user_agent, referrer) VALUES (%s, %s)",
                (user_agent, referrer)
            )
            conn.commit()
            cur.close()
            conn.close()
            return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({'ok': True})}

    return {'statusCode': 400, 'headers': CORS, 'body': json.dumps({'ok': False, 'error': 'Неверный запрос'})}