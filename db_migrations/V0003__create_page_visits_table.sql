CREATE TABLE IF NOT EXISTS t_p2327292_link_name_change_pro.page_visits (
    id SERIAL PRIMARY KEY,
    visited_at TIMESTAMP DEFAULT NOW(),
    user_agent TEXT,
    referrer TEXT
);