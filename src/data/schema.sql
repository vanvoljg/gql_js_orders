DROP TABLE IF EXISTS payments;
DROP TABLE IF EXISTS orders;

CREATE TABLE orders (
  id SERIAL PRIMARY KEY UNIQUE,
  description TEXT NOT NULL,
  total NUMERIC NOT NULL,
  balance_due NUMERIC NOT NULL
);

CREATE TABLE payments (
  id SERIAL PRIMARY KEY UNIQUE,
  amount NUMERIC NOT NULL,
  applied_at VARCHAR(63) NOT NULL,
  note TEXT,
  order_id BIGINT NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders (id)
);

CREATE INDEX ON payments (order_id);
