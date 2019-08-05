DROP TABLE IF EXISTS payments;
DROP TABLE IF EXISTS orders;

CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  description TEXT,
  total NUMERIC,
  balance_due NUMERIC
);

CREATE TABLE payments (
  id SERIAL PRIMARY KEY,
  amount NUMERIC,
  applied_at VARCHAR(63),
  note TEXT,
  order_id BIGINT,
  FOREIGN KEY (order_id) REFERENCES orders (id)
);
