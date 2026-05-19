CREATE TABLE IF NOT EXISTS t_p2327292_link_name_change_pro.questions (
    id SERIAL PRIMARY KEY,
    phone VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    question TEXT NOT NULL,
    answer TEXT,
    answered_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);