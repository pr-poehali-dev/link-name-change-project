CREATE TABLE IF NOT EXISTS t_p2327292_link_name_change_pro.bookings (
    id SERIAL PRIMARY KEY,
    booking_date DATE NOT NULL,
    booking_time VARCHAR(5) NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    service_type VARCHAR(50) NOT NULL DEFAULT 'consultation',
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(booking_date, booking_time)
);