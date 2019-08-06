INSERT INTO orders(description, total, balance_due) VALUES('test order 1', 80.40, 40.40) RETURNING *;
INSERT INTO payments(amount, applied_at, order_id) VALUES('40', 'Tue, 06 Aug 2019 17:40:35 GMT', 1);
INSERT INTO orders(description, total, balance_due) VALUES('test order 2', 80.40, 80.40) RETURNING *;
INSERT INTO orders(description, total, balance_due) VALUES('test order 1', 80.40, 20.40) RETURNING *;
INSERT INTO payments(amount, applied_at, order_id) VALUES('20', 'Tue, 06 Aug 2019 17:40:35 GMT', 3);
INSERT INTO payments(amount, applied_at, order_id) VALUES('40', 'Tue, 06 Aug 2019 17:40:35 GMT', 3);
