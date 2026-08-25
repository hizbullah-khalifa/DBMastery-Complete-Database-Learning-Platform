// ── DBMastery · SQL Cheatsheet ────────────────────────────────────────────────
export const sqlCheatCategories = [
  {
    name: 'Database',
    blurb: 'Create, switch, inspect and remove databases.',
    commands: [
      {
        cmd: 'CREATE DATABASE', diff: 'Beginner',
        syntax: 'CREATE DATABASE db_name;',
        desc: 'Creates a new empty database on the server.',
        example: 'CREATE DATABASE school;',
      },
      {
        cmd: 'USE', diff: 'Beginner',
        syntax: 'USE db_name;',
        desc: 'Selects which database subsequent statements run against.',
        example: 'USE school;',
      },
      {
        cmd: 'SHOW DATABASES', diff: 'Beginner',
        syntax: 'SHOW DATABASES;',
        desc: 'Lists every database available on the server.',
        example: 'SHOW DATABASES;',
      },
      {
        cmd: 'DROP DATABASE', diff: 'Beginner', danger: true,
        syntax: 'DROP DATABASE db_name;',
        desc: 'Permanently deletes a database and everything inside it.',
        example: 'DROP DATABASE school;',
      },
    ],
  },
  {
    name: 'Tables',
    blurb: 'Define and reshape table structure.',
    commands: [
      {
        cmd: 'CREATE TABLE', diff: 'Beginner',
        syntax: 'CREATE TABLE t (\n  id INT PRIMARY KEY,\n  col TYPE\n);',
        desc: 'Defines a new table with its columns and types.',
        example: `CREATE TABLE students (
    id INT PRIMARY KEY,
    name VARCHAR(100),
    age INT
);`,
      },
      {
        cmd: 'ALTER TABLE', diff: 'Intermediate',
        syntax: 'ALTER TABLE t ADD|MODIFY|DROP COLUMN …;',
        desc: 'Changes an existing table structure while keeping its rows.',
        example: 'ALTER TABLE students ADD email VARCHAR(150);',
      },
      {
        cmd: 'TRUNCATE TABLE', diff: 'Intermediate', danger: true,
        syntax: 'TRUNCATE TABLE t;',
        desc: 'Instantly deletes every row but keeps the table definition.',
        example: 'TRUNCATE TABLE students;',
      },
      {
        cmd: 'DROP TABLE', diff: 'Intermediate', danger: true,
        syntax: 'DROP TABLE t;',
        desc: 'Deletes all rows AND removes the table itself.',
        example: 'DROP TABLE students;',
      },
    ],
  },
  {
    name: 'CRUD',
    blurb: 'The four everyday write/read operations.',
    commands: [
      {
        cmd: 'INSERT INTO', diff: 'Beginner',
        syntax: "INSERT INTO t (cols) VALUES (vals);",
        desc: 'Adds one or more new rows.',
        example: "INSERT INTO users (name, email)\nVALUES ('Ali', 'ali@example.com');",
      },
      {
        cmd: 'SELECT', diff: 'Beginner',
        syntax: 'SELECT cols FROM t WHERE cond;',
        desc: 'Reads rows; supports filtering, sorting and aggregation.',
        example: 'SELECT name, age FROM users WHERE age >= 18;',
      },
      {
        cmd: 'UPDATE', diff: 'Beginner', danger: true,
        syntax: 'UPDATE t SET col = val WHERE cond;',
        desc: 'Modifies existing rows — always pair with WHERE!',
        example: "UPDATE users SET name = 'Ahmad' WHERE id = 1;",
      },
      {
        cmd: 'DELETE FROM', diff: 'Beginner', danger: true,
        syntax: 'DELETE FROM t WHERE cond;',
        desc: 'Removes matching rows; without WHERE it empties the table.',
        example: 'DELETE FROM users WHERE id = 1;',
      },
    ],
  },
  {
    name: 'Filtering',
    blurb: 'WHERE-clause building blocks.',
    commands: [
      { cmd: 'AND / OR / NOT', diff: 'Beginner', syntax: "… WHERE a = 1 AND b = 2;", desc: 'Combine boolean conditions.', example: "SELECT * FROM users WHERE status = 'active' AND age > 18;" },
      { cmd: 'IN', diff: 'Beginner', syntax: "WHERE col IN ('a','b');", desc: 'Matches any value from a list.', example: "SELECT * FROM users WHERE country IN ('PK','TR');" },
      { cmd: 'BETWEEN', diff: 'Beginner', syntax: 'WHERE col BETWEEN x AND y;', desc: 'Inclusive range check.', example: 'SELECT * FROM products WHERE price BETWEEN 10 AND 50;' },
      { cmd: 'LIKE', diff: 'Beginner', syntax: "WHERE col LIKE 'A%';", desc: 'Pattern match with % (any chars) and _ (one char).', example: "SELECT * FROM users WHERE name LIKE 'A%';" },
      { cmd: 'IS NULL', diff: 'Beginner', syntax: 'WHERE col IS NULL;', desc: 'Detects missing values (= NULL never works).', example: 'SELECT * FROM users WHERE phone IS NULL;' },
      { cmd: 'DISTINCT', diff: 'Beginner', syntax: 'SELECT DISTINCT col FROM t;', desc: 'Removes duplicate result rows.', example: 'SELECT DISTINCT country FROM users;' },
    ],
  },
  {
    name: 'Sorting & Paging',
    blurb: 'Order results and paginate them.',
    commands: [
      { cmd: 'ORDER BY', diff: 'Beginner', syntax: 'ORDER BY col [ASC|DESC];', desc: 'Sorts output rows.', example: 'SELECT * FROM users ORDER BY created_at DESC;' },
      { cmd: 'LIMIT', diff: 'Beginner', syntax: 'LIMIT n;', desc: 'Caps number of returned rows.', example: 'SELECT * FROM products LIMIT 5;' },
      { cmd: 'OFFSET', diff: 'Beginner', syntax: 'LIMIT n OFFSET m;', desc: 'Skips m rows first — pagination pairs it with LIMIT.', example: 'SELECT * FROM products LIMIT 10 OFFSET 20;' },
    ],
  },
  {
    name: 'Aggregation',
    blurb: 'Summarize many rows into answers.',
    commands: [
      { cmd: 'COUNT', diff: 'Beginner', syntax: 'COUNT(*) / COUNT(col)', desc: 'Counts rows (or non-NULL values).', example: 'SELECT COUNT(*) FROM orders;' },
      { cmd: 'SUM / AVG', diff: 'Beginner', syntax: 'SUM(col), AVG(col)', desc: 'Total and mean of a numeric column.', example: 'SELECT SUM(amount) AS revenue, AVG(amount) AS avg_order FROM orders;' },
      { cmd: 'MIN / MAX', diff: 'Beginner', syntax: 'MIN(col), MAX(col)', desc: 'Smallest and largest value.', example: 'SELECT MIN(price), MAX(price) FROM products;' },
      { cmd: 'GROUP BY', diff: 'Intermediate', syntax: 'GROUP BY col;', desc: 'Buckets rows so aggregates run per bucket.', example: 'SELECT user_id, COUNT(*) AS n FROM orders GROUP BY user_id;' },
      { cmd: 'HAVING', diff: 'Intermediate', syntax: 'HAVING COUNT(*) > n;', desc: 'Filters groups after aggregation.', example: 'SELECT country, COUNT(*) AS c FROM users GROUP BY country HAVING c > 100;' },
    ],
  },
  {
    name: 'Joins',
    blurb: 'Combine related tables.',
    commands: [
      { cmd: 'INNER JOIN', diff: 'Intermediate', syntax: 'FROM a INNER JOIN b ON a.x = b.y;', desc: 'Only rows present in both tables.', example: 'SELECT u.name, o.amount\nFROM users u INNER JOIN orders o ON u.id = o.user_id;' },
      { cmd: 'LEFT JOIN', diff: 'Intermediate', syntax: 'FROM a LEFT JOIN b ON …;', desc: 'All left rows + matches (NULL when none).', example: 'SELECT u.name, o.amount\nFROM users u LEFT JOIN orders o ON u.id = o.user_id;' },
      { cmd: 'RIGHT JOIN', diff: 'Intermediate', syntax: 'FROM a RIGHT JOIN b ON …;', desc: 'All right rows + matches (NULL when none).', example: 'SELECT u.name, o.amount\nFROM users u RIGHT JOIN orders o ON u.id = o.user_id;' },
      { cmd: 'FULL OUTER JOIN', diff: 'Advanced', syntax: 'FROM a FULL OUTER JOIN b ON …;', desc: 'Everything from both sides; MySQL needs UNION emulation.', example: 'SELECT u.name, o.amount\nFROM users u FULL OUTER JOIN orders o ON u.id = o.user_id;' },
      { cmd: 'SELF JOIN', diff: 'Advanced', syntax: 'FROM t x JOIN t y ON …;', desc: 'Joins a table to itself via aliases.', example: 'SELECT e.name AS employee, m.name AS manager\nFROM employees e JOIN employees m ON e.manager_id = m.id;' },
    ],
  },
  {
    name: 'Advanced',
    blurb: 'Power tools for complex problems.',
    commands: [
      { cmd: 'CASE', diff: 'Intermediate', syntax: 'CASE WHEN … THEN … ELSE … END', desc: 'Inline IF/ELSE logic inside queries.', example: "SELECT name,\n  CASE WHEN age >= 18 THEN 'adult' ELSE 'minor' END AS grp\nFROM users;" },
      { cmd: 'WITH (CTE)', diff: 'Intermediate', syntax: 'WITH name AS (SELECT …)', desc: 'Named temporary results for readable pipelines.', example: 'WITH totals AS (\n  SELECT user_id, SUM(amount) AS total\n  FROM orders GROUP BY user_id\n)\nSELECT * FROM totals WHERE total > 1000;' },
      { cmd: 'UNION ALL', diff: 'Beginner', syntax: 'q1 UNION ALL q2;', desc: 'Stacks results keeping duplicates (fast).', example: 'SELECT city FROM shipping\nUNION ALL\nSELECT city FROM billing;' },
      { cmd: 'EXISTS', diff: 'Advanced', syntax: 'WHERE EXISTS (subquery)', desc: 'True if subquery returns any row.', example: 'SELECT u.name FROM users u\nWHERE EXISTS (SELECT 1 FROM orders o WHERE o.user_id = u.id);' },
      { cmd: 'ROW_NUMBER()', diff: 'Advanced', syntax: 'OVER (PARTITION BY … ORDER BY …)', desc: 'Window ranking without collapsing rows.', example: 'SELECT name,\n  ROW_NUMBER() OVER (PARTITION BY category ORDER BY price DESC) AS rn\nFROM products;' },
      { cmd: 'CREATE INDEX', diff: 'Advanced', syntax: 'CREATE INDEX i ON t(col);', desc: 'Speeds up lookups at some write cost.', example: 'CREATE INDEX idx_users_email ON users(email);' },
      { cmd: 'TRANSACTION', diff: 'Advanced', syntax: 'START TRANSACTION; … COMMIT/ROLLBACK;', desc: 'All-or-nothing group of writes.', example: 'START TRANSACTION;\nUPDATE accounts SET balance = balance - 500 WHERE id = 1;\nUPDATE accounts SET balance = balance + 500 WHERE id = 2;\nCOMMIT;' },
      { cmd: 'CREATE VIEW', diff: 'Intermediate', syntax: 'CREATE VIEW v AS SELECT …;', desc: 'Saved query usable like a virtual table.', example: 'CREATE VIEW active_users AS\nSELECT * FROM users WHERE status = \'active\';' },
    ],
  },
]
