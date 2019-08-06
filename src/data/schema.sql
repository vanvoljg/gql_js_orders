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

CREATE INDEX ON payments (order_id);

INSERT INTO orders(description, total, balance_due) VALUES('test order 1', 80.40, 40.40) RETURNING *;
INSERT INTO payments(amount, applied_at, order_id) VALUES('40', 'Tue, 06 Aug 2019 17:40:35 GMT', 1);
INSERT INTO orders(description, total, balance_due) VALUES('test order 2', 80.40, 80.40) RETURNING *;
INSERT INTO orders(description, total, balance_due) VALUES('test order 1', 80.40, 20.40) RETURNING *;
INSERT INTO payments(amount, applied_at, order_id) VALUES('20', 'Tue, 06 Aug 2019 17:40:35 GMT', 3);
INSERT INTO payments(amount, applied_at, order_id) VALUES('40', 'Tue, 06 Aug 2019 17:40:35 GMT', 3);
