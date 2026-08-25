// ── DBMastery · SQL Curriculum (Part 2: JOINs → Advanced SQL) ─────────────────
const P = (x) => ({ t: 'p', x })
const C = (lang, title, src) => ({ t: 'code', lang, title, src })
const UL = (...items) => ({ t: 'ul', items })
const OL = (...items) => ({ t: 'ol', items })
const TB = (head, rows) => ({ t: 'table', head, rows })
const NOTE = (kind, x) => ({ t: 'note', kind, x })
const LINES = (rows) => ({ t: 'lines', rows })
const DIA = (src) => ({ t: 'dia', src })
const H3 = (x) => ({ t: 'h3', x })
const S = (id, heading, ...blocks) => ({ id, heading, blocks })
const T = (slug, title, category, diff, minutes, desc, sections, challenge) => ({
  slug, title, category, diff, minutes, desc, sections, challenge,
})

export const sqlTopicsB = [
  // ── JOINs ──────────────────────────────────────────────────────────────────
  T('joins', 'SQL JOINs', 'JOINs', 'Intermediate', 14,
    'Combine tables through their relationships: INNER, LEFT, RIGHT, FULL OUTER, CROSS and SELF joins — with visual results for each.',

    [
      S('sample-data', 'Our two example tables',
        DIA(`users                       orders
┌────┬───────┐              ┌────┬─────────┬────────┐
│ id │ name  │              │ id │ user_id │ amount │
├────┼───────┤              ├────┼─────────┼────────┤
│ 1  │ Ali   │              │ 10 │ 1       │ 250    │
│ 2  │ Sara  │              │ 11 │ 2       │ 400    │
│ 3  │ Ahmad │              │ 12 │ 1       │ 100    │
│ 4  │ Zara  │(no orders)   │ 13 │ 9       │(ghost!)│
└────┴───────┘              └────┴─────────┴────────┘`),
        P('Every join below answers a different question about how these tables overlap on `users.id = orders.user_id`.')
      ),
      S('inner', 'INNER JOIN — only matches',
        C('sql', 'inner-join.sql', `SELECT users.name, orders.amount
FROM users
INNER JOIN orders ON users.id = orders.user_id;`),
        DIA(`Result: only rows present in BOTH tables
Ali   | 250      ← user 1 has orders ✓
Sara  | 400      ← user 2 has orders ✓
Ali   | 100      ← user 1 again ✓
(order 13 dropped — no user 9)
(Zara dropped — no orders)`),
        P('Ahmad and Zara disappear because they have no orders; ghost order 13 disappears because user 9 does not exist.')
      ),
      S('left', 'LEFT JOIN — keep everyone from the left',
        C('sql', 'left-join.sql', `SELECT users.name, orders.amount
FROM users
LEFT JOIN orders ON users.id = orders.user_id;`),
        DIA(`Result: ALL users, orders attached where they exist
Ali   | 250
Ali   | 100
Sara  | 400
Ahmad | NULL     ← kept, no match
Zara  | NULL     ← kept, no match
(order 13 still dropped)`),
        P('Perfect for “show all X with or without Y” questions — like listing every customer alongside their possible orders.')
      ),
      S('right-full', 'RIGHT JOIN & FULL OUTER JOIN',
        C('sql', 'right-full.sql', `-- RIGHT JOIN: all orders, matched users where possible
SELECT users.name, orders.amount
FROM users
RIGHT JOIN orders ON users.id = orders.user_id;
-- includes order 13 with NULL name

-- FULL OUTER JOIN: everything from both sides
SELECT users.name, orders.amount
FROM users
FULL OUTER JOIN orders ON users.id = orders.user_id;
-- unmatched users AND unmatched orders all appear with NULLs`),
        TB(['Join', 'Keeps unmatched left rows', 'Keeps unmatched right rows'],
          [
            ['INNER', '✗', '✗'],
            ['LEFT', '✓', '✗'],
            ['RIGHT', '✗', '✓'],
            ['FULL OUTER', '✓', '✓'],
          ]),
        NOTE('info', 'MySQL lacks FULL OUTER JOIN — emulate it by LEFT JOIN `UNION ALL` RIGHT JOIN minus duplicates.')
      ),
      S('cross-self', 'CROSS JOIN & SELF JOIN',
        C('sql', 'cross-self.sql', `-- CROSS JOIN: every combination (cartesian product)
SELECT sizes.label, colors.name
FROM sizes CROSS JOIN colors;   -- 4 sizes × 5 colors = 20 rows

-- SELF JOIN: compare rows within the same table via aliases
SELECT e.name AS employee, m.name AS manager
FROM employees e
LEFT JOIN employees m ON e.manager_id = m.id;`),
        P('A self join is just a normal join where both sides happen to be the same table under different aliases.')
      ),
      S('choosing', 'Choosing the right join',
        OL(
          'Need only matching pairs? **INNER**.',
          'Keep all of table A regardless? **LEFT**.',
          'Audit both sides (data quality checks)? **FULL OUTER**.',
          'Generating combinations (variants, calendars)? **CROSS**.',
          'Hierarchy in one table? **SELF**.'
        ),
        NOTE('tip', 'Filter conditions for LEFT JOINs go in the `ON` clause if you want to keep unmatched rows — putting them in WHERE silently converts the join back to INNER.'),
        P('Notice Ali appears twice because he placed two orders — JOINs multiply rows per relationship, which is exactly what aggregates + GROUP BY then summarize.')
      ),
    ],
    { q: 'Show each order amount together with the buyer name using an inner join between users and orders.',
      accept: ['selectusers.name,orders.amountfromusersinnerjoinordersonusers.id=orders.user_id'],
      hint: 'FROM users INNER JOIN orders ON users.id = orders.user_id',
      solution: 'SELECT users.name, orders.amount\nFROM users\nINNER JOIN orders\n  ON users.id = orders.user_id;' }),

  // ── Functions ──────────────────────────────────────────────────────────────
  T('aggregate-functions', 'Aggregate Functions', 'Functions', 'Beginner', 8,
    'COUNT, SUM, AVG, MIN and MAX — turn thousands of rows into one meaningful number.',

    [
      S('the-five', 'The five essentials',
        C('sql', 'aggregates.sql', `SELECT COUNT(*)            AS total_orders,
       SUM(amount)         AS revenue,
       AVG(amount)         AS avg_order,
       MIN(amount)         AS smallest,
       MAX(amount)         AS biggest
FROM orders;`),
        TB(['Function', 'Answers'],
          [
            ['`COUNT(*)`', 'How many rows?'],
            ['`SUM(col)`', 'What is the total?'],
            ['`AVG(col)`', 'What is the mean?'],
            ['`MIN(col)` / `MAX(col)`', 'Smallest / largest value?'],
          ])
      ),
      S('with-group', 'Aggregates + GROUP BY = reports',
        C('sql', 'per-user.sql', `SELECT user_id,
       COUNT(*)     AS orders_count,
       SUM(amount)  AS total_spent,
       ROUND(AVG(amount), 2) AS avg_order
FROM orders
GROUP BY user_id;`)
      ),
      S('null-count', 'NULL & COUNT subtleties',
        NOTE('warn', '`AVG`/`SUM`/`MIN`/`MAX` ignore NULLs entirely. `COUNT(*)` counts rows; `COUNT(column)` counts non-NULL values only.'),
        NOTE('tip', 'Wrap AVG in ROUND(x, 2) for money — raw averages come with ugly floating tails.')
      ),
    ],
    { q: 'Get the average price of products as avg_price.',
      accept: ['selectavg(price)asavg_pricefromproducts'],
      hint: 'SELECT AVG(price) … FROM products;',
      solution: 'SELECT AVG(price) AS avg_price\nFROM products;' }),

  T('string-functions', 'String Functions', 'Functions', 'Beginner', 7,
    'CONCAT, LENGTH, LOWER, UPPER and SUBSTRING — clean and reshape text inside queries.',

    [
      S('catalog', 'The everyday five',
        C('sql', 'strings.sql', `SELECT CONCAT(first_name, ' ', last_name) AS full_name,
       LENGTH(email)              AS email_len,
       LOWER(email)               AS email_lower,
       UPPER(country_code)        AS code_upper,
       SUBSTRING(phone, 1, 4)     AS area_part
FROM users;`),
        TB(['Function', 'Does', 'Example → result'],
          [
            ['`CONCAT(a,b,…)`', 'Glues text together', "CONCAT('Ali',' Khan') → Ali Khan"],
            ['`LENGTH(s)`', 'Character count', "LENGTH('SQL') → 3"],
            ['`LOWER(s)` / `UPPER(s)`', 'Change case', "UPPER('pk') → PK"],
            ['`SUBSTRING(s,start,n)`', 'Slice text', "SUBSTRING('MongoDB',1,5) → Mongo"],
          ])
      ),
      S('real-world', 'Real-world example',
        C('sql', 'email-usernames.sql', `-- Derive suggested usernames from emails
SELECT email,
       LOWER(SUBSTRING_INDEX(email, '@', 1)) AS username_hint
FROM users;`)
      ),
      S('mistake-tip', 'Common mistake & quick tip',
        NOTE('warn', 'Function names differ across engines: SQL Server uses `LEN` and `SUBSTRING`, Oracle uses `SUBSTR`. Check your dialect docs.'),
        NOTE('tip', 'TRIM() strips accidental spaces — run it before comparisons to avoid “invisible” mismatches.')
      ),
    ]),

  T('date-functions', 'Date Functions', 'Functions', 'Beginner', 8,
    'NOW, YEAR, MONTH, DAY and DATE_FORMAT — work with time the way apps need.',

    [
      S('catalog', 'Core date functions (MySQL syntax)',
        C('sql', 'dates.sql', `SELECT NOW()                        AS right_now,
       YEAR(created_at)             AS yr,
       MONTH(created_at)            AS mon,
       DAY(created_at)              AS dy,
       DATE_FORMAT(created_at, '%Y-%m-%d') AS pretty_date
FROM orders;`),
        TB(['Function', 'Returns'],
          [
            ['`NOW()`', 'Current date + time'],
            ['`YEAR / MONTH / DAY(date)`', 'Individual parts as numbers'],
            ["`DATE_FORMAT(d,'%Y-%m-%d')`", 'Formatted string'],
          ])
      ),
      S('filtering', 'Filtering by time periods',
        C('sql', 'period-filters.sql', `-- Orders placed this year
SELECT * FROM orders
WHERE YEAR(created_at) = YEAR(NOW());

-- Better: range filter (index-friendly!)
SELECT * FROM orders
WHERE created_at >= '2026-01-01'
  AND created_at <  '2027-01-01';`),
        NOTE('warn', '`WHERE YEAR(created_at)=2026` wraps the column in a function so indexes cannot help — prefer direct date ranges on big tables.')
      ),
      S('dialect-tip', 'Dialect note & tip',
        NOTE('info', "PostgreSQL: `EXTRACT(YEAR FROM d)`, `CURRENT_TIMESTAMP`, `TO_CHAR(d,'YYYY-MM-DD')`. Concepts identical, spelling differs."),
        NOTE('tip', 'Store timestamps in UTC always; convert to local zones at display time.')
      ),
    ]),

  // ── Advanced SQL ───────────────────────────────────────────────────────────
  T('subqueries', 'Subqueries', 'Advanced SQL', 'Intermediate', 9,
    'Nest one query inside another to build answers step by step.',

    [
      S('where-subquery', 'Subquery in WHERE',
        C('sql', 'in-subquery.sql', `-- Products priced above the store-wide average
SELECT name, price
FROM products
WHERE price > (SELECT AVG(price) FROM products);

-- Users who have placed at least one order
SELECT name FROM users
WHERE id IN (SELECT user_id FROM orders);`)
      ),
      S('derived-tables', 'Derived tables (subquery in FROM)',
        C('sql', 'from-subquery.sql', `-- Top spenders using a derived table + join
SELECT u.name, t.total
FROM users u
INNER JOIN (
    SELECT user_id, SUM(amount) AS total
    FROM orders
    GROUP BY user_id
) t ON t.user_id = u.id
ORDER BY t.total DESC;`),
        LINES([
          { c: '( SELECT … GROUP BY ) t', d: 'An inline summary table that must be given an alias.' },
          { c: 'INNER JOIN … ON', d: 'Reconnect summaries to real user names.' },
          { c: 'ORDER BY t.total DESC', d: 'Biggest spenders first.' },
        ])
      ),
      S('mistake-tip', 'Common mistake & quick tip',
        NOTE('warn', 'Forgetting the alias after a FROM-subquery is a syntax error in most engines — always name it (`) t`).'),
        NOTE('tip', 'If a subquery runs per-row (correlated) consider rewriting as a JOIN — often dramatically faster.')
      ),
    ],
    { q: 'Find products whose price is above the average price (single statement).',
      accept: ['selectname,pricefromproductswhereprice>(selectavg(price)fromproducts)'],
      hint: 'WHERE price > ( SELECT AVG(price) FROM products )',
      solution: 'SELECT name, price\nFROM products\nWHERE price > (SELECT AVG(price) FROM products);' }),

  T('cte', 'CTEs — WITH Clauses', 'Advanced SQL', 'Intermediate', 8,
    'Name temporary result sets with WITH to make complex queries readable and reusable.',

    [
      S('definition-syntax', 'Definition & syntax',
        P('A **Common Table Expression** is a named, temporary result that exists only for the duration of one query. It replaces messy nested subqueries with readable steps.'),
        C('sql', 'cte.sql', `WITH monthly_totals AS (
    SELECT DATE_FORMAT(created_at, '%Y-%m') AS month,
           SUM(amount) AS total
    FROM orders
    GROUP BY month
)
SELECT * FROM monthly_totals
WHERE total > 10000
ORDER BY month;`)
      ),
      S('chaining', 'Chaining multiple CTEs',
        C('sql', 'multi-cte.sql', `WITH active_users AS (
    SELECT * FROM users WHERE status = 'active'
),
their_orders AS (
    SELECT user_id, COUNT(*) AS n
    FROM orders
    WHERE user_id IN (SELECT id FROM active_users)
    GROUP BY user_id
)
SELECT * FROM their_orders WHERE n > 3;`),
        NOTE('info', 'Recursive CTEs (`WITH RECURSIVE`) can walk trees — org charts, categories — by referencing themselves. A whole advanced topic of their own.')
      ),
      S('mistake-tip', 'Common mistake & quick tip',
        NOTE('tip', 'Think of CTEs as steps in a recipe: build small, well-named pieces, then combine. Debugging becomes trivial compared to nested subqueries.'),
        P('Engines may treat CTEs as optimization fences — for hot paths measure before assuming performance gains.')
      ),
    ]),

  T('case-expression', 'CASE Expressions', 'Advanced SQL', 'Intermediate', 7,
    'Add IF/ELSE logic directly inside SELECT, ORDER BY and aggregations.',

    [
      S('searched-case', 'Searched CASE (most common)',
        C('sql', 'case.sql', `SELECT name,
       CASE
           WHEN age < 13 THEN 'child'
           WHEN age < 20 THEN 'teenager'
           WHEN age < 60 THEN 'adult'
           ELSE 'senior'
       END AS age_group
FROM users;`),
        LINES([
          { c: 'CASE', d: 'Starts the conditional expression.' },
          { c: 'WHEN cond THEN value', d: 'First true condition wins.' },
          { c: 'ELSE value', d: 'Fallback when nothing matches (omit → NULL).' },
          { c: 'END', d: 'Required closer — alias the result after it.' },
        ])
      ),
      S('inside-aggregates', 'Conditional counting trick',
        C('sql', 'pivot-ish.sql', `SELECT country,
           SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) AS actives,
           SUM(CASE WHEN status = 'banned' THEN 1 ELSE 0 END) AS banned
FROM users
GROUP BY country;`),
        NOTE('tip', 'This “SUM(CASE…)” pattern builds pivot-style reports without any special syntax.')
      ),
    ],
    { q: "Label each user 'adult' when age >= 18 otherwise 'minor' in a column called group_label.",
      accept: ["selectname,case whenage>=18then'adult'else'minor'endasgroup_labelfromusers"],
      hint: 'CASE WHEN age >= 18 THEN … ELSE … END AS group_label',
      solution: "SELECT name,\n       CASE WHEN age >= 18 THEN 'adult'\n            ELSE 'minor'\n       END AS group_label\nFROM users;" }),

  T('union', 'UNION vs UNION ALL', 'Advanced SQL', 'Beginner', 6,
    'Stack results from multiple queries vertically — deduplicated or not.',

    [
      S('definition-rules', 'Definition & rules',
        P('`UNION` appends the rows of one query to another. Rules: same number of columns, compatible types, matching order.'),
        C('sql', 'union.sql', `-- One combined mailing list
SELECT name, 'customer' AS source FROM customers
UNION                          -- removes duplicates (slower sort)
SELECT name, 'lead' AS source FROM leads;

UNION ALL                      -- keeps duplicates (faster)
SELECT city FROM shipping_addresses
UNION ALL
SELECT city FROM billing_addresses;`)
      ),
      S('comparison', 'Which one?',
        TB(['', 'UNION', 'UNION ALL'],
          [
            ['Duplicates', 'removed', 'kept'],
            ['Performance', 'slower (dedupe pass)', 'faster'],
            ['Use when', 'you need distinct set', 'counts/logs matter or sources disjoint'],
          ]),
        NOTE('warn', 'Default habit should be UNION ALL — reach for plain UNION only when duplicates truly must go.')
      ),
    ]),

  T('exists', 'EXISTS & NOT EXISTS', 'Advanced SQL', 'Advanced', 8,
    'Test membership semantically — the professional alternative to IN for existence checks.',

    [
      S('definition-example', 'Definition & example',
        P('`EXISTS (subquery)` returns true the moment the inner query finds *any* row — it stops scanning immediately, which is why big systems prefer it.'),
        C('sql', 'exists.sql', `-- Customers who have ordered at least once
SELECT u.name
FROM users u
WHERE EXISTS (
    SELECT 1 FROM orders o WHERE o.user_id = u.id
);

-- Anti-join: users who NEVER ordered
SELECT u.name
FROM users u
WHERE NOT EXISTS (
    SELECT 1 FROM orders o WHERE o.user_id = u.id
);`)
      ),
      S('vs-in', 'EXISTS vs IN',
        TB(['Situation', 'Prefer'],
          [
            ['Outer side huge, inner small list', '`IN`'],
            ['Inner side huge / correlated check', '`EXISTS`'],
            ['NULLs possible in inner list', '`EXISTS` (immune)'],
          ]),
        NOTE('tip', '`SELECT 1` is convention inside EXISTS — the selected columns are irrelevant, only row existence matters.')
      ),
    ],
    { q: 'Select user names where a matching order row exists (orders.user_id references users.id).',
      accept: ['selectnamefromusersuwhereexists(select1fromordersowhereo.user_id=u.id)'],
      hint: 'WHERE EXISTS (SELECT 1 FROM orders o WHERE o.user_id = u.id)',
      solution: 'SELECT u.name\nFROM users u\nWHERE EXISTS (\n  SELECT 1 FROM orders o\n  WHERE o.user_id = u.id\n);' }),

  T('window-functions', 'Window Functions', 'Advanced SQL', 'Advanced', 12,
    'ROW_NUMBER, RANK and aggregates over PARTITION BY — rankings and running totals without collapsing rows.',

    [
      S('definition', 'Definition: aggregate without collapsing',
        P('Regular aggregates squash groups into single rows. Window functions keep every row while computing values **across** its partition — best of both worlds.'),
        C('sql', 'rank.sql', `-- Rank products by price within each category
SELECT name, category, price,
       ROW_NUMBER() OVER (PARTITION BY category ORDER BY price DESC) AS rn,
       RANK()       OVER (PARTITION BY category ORDER BY price DESC) AS rnk
FROM products;`),
        LINES([
          { c: 'OVER ( … )', d: 'Declares the window the function looks across.' },
          { c: 'PARTITION BY category', d: 'Restart numbering per category (like GROUP BY, but rows survive).' },
          { c: 'ORDER BY price DESC', d: 'Ordering inside each partition decides rank positions.' },
        ])
      ),
      S('numbering-diff', 'ROW_NUMBER vs RANK vs DENSE_RANK',
        DIA(`Scores sorted DESC:
score   ROW_NUMBER   RANK   DENSE_RANK
 95        1           1        1
 90        2           2        2
 90        3           2        2   ← tie
 85        4           4        3`),
        C('sql', 'running-total.sql', `-- Running revenue by day
SELECT day, revenue,
       SUM(revenue) OVER (ORDER BY day) AS running_total
FROM daily_sales;`)
      ),
      S('mistake-tip', 'Common mistake & quick tip',
        NOTE('warn', 'Window functions cannot appear in WHERE (they run after it). Wrap the ranked query in a CTE and filter outside — the classic “top-N per group” pattern.'),
        NOTE('tip', 'MySQL 8+, PostgreSQL, SQL Server and Oracle all support windows; MySQL 5.7 does not.')
      ),
    ]),

  T('views', 'Views', 'Advanced SQL', 'Intermediate', 6,
    'Save complex queries as virtual tables you can select from again and again.',

    [
      S('definition-create', 'Definition & creation',
        P('A **view** is a stored query pretending to be a table. It holds no data itself — every access re-runs the underlying SELECT against live data.'),
        C('sql', 'view.sql', `CREATE VIEW active_user_emails AS
SELECT id, name, email
FROM users
WHERE status = 'active';

-- Use it like any table
SELECT * FROM active_user_emails;

DROP VIEW active_user_emails;`)
      ),
      S('why-views', 'Why views help',
        UL(
          '**Security** — expose only safe columns to reporting tools.',
          '**Simplicity** — hide gnarly joins behind friendly names.',
          '**Consistency** — one definition of “active user” everywhere.'
        ),
        NOTE('info', 'Simple views are updatable in many engines; complex ones (aggregates, DISTINCT) are read-only. Materialized views pre-compute and store results for speed.')
      ),
    ]),

  T('stored-procedures-triggers', 'Stored Procedures & Triggers', 'Advanced SQL', 'Advanced', 10,
    'Run server-side program logic: reusable procedures you call, and triggers that fire automatically.',

    [
      S('procedures', 'Stored procedures',
        P('A stored procedure lives inside the database and executes multi-step logic with one call — great for encapsulating critical writes near the data.'),
        C('sql', 'procedure.sql', `DELIMITER //
CREATE PROCEDURE give_raise(IN emp_id INT, IN pct DECIMAL(5,2))
BEGIN
    UPDATE employees
    SET salary = salary * (1 + pct / 100)
    WHERE id = emp_id;
END //
DELIMITER ;

CALL give_raise(7, 5.0);   -- raise employee #7 by 5%`)
      ),
      S('triggers', 'Triggers — automatic reactions',
        C('sql', 'trigger.sql', `CREATE TRIGGER trg_audit_salary
AFTER UPDATE ON employees
FOR EACH ROW
INSERT INTO salary_audit (emp_id, old_salary, new_salary, changed_at)
VALUES (OLD.id, OLD.salary, NEW.salary, NOW());`),
        UL(
          '**BEFORE/AFTER INSERT/UPDATE/DELETE** define firing moments.',
          '`OLD` = previous row values, `NEW` = incoming ones.'
        ),
        NOTE('warn', 'Triggers run invisibly inside every write — powerful but easy to forget when debugging. Keep them small and documented.')
      ),
    ]),

  T('transactions-acid', 'Transactions & ACID', 'Advanced SQL', 'Advanced', 10,
    'Group writes into all-or-nothing units, and understand the guarantees behind reliable databases.',

    [
      S('bank-transfer', 'The classic bank transfer',
        C('sql', 'transfer.sql', `START TRANSACTION;

UPDATE accounts SET balance = balance - 500 WHERE id = 1;
UPDATE accounts SET balance = balance + 500 WHERE id = 2;

COMMIT;      -- make both changes permanent

-- or, if anything looked wrong:
ROLLBACK;    -- undo everything since START`),
        LINES([
          { c: 'START TRANSACTION', d: 'Opens a private sandbox for your changes.' },
          { c: 'UPDATE × 2', d: 'Both must succeed together or the money vanishes.' },
          { c: 'COMMIT', d: 'Publishes the changes to everyone atomically.' },
          { c: 'ROLLBACK', d: 'Discards them completely — safety net.' },
        ])
      ),
      S('acid', 'ACID explained simply',
        TB(['Letter', 'Guarantee', 'Meaning'],
          [
            ['A', 'Atomicity', 'All-or-nothing — no half-done transfers'],
            ['C', 'Consistency', 'Rules/constraints stay valid after every commit'],
            ['I', 'Isolation', 'Concurrent transactions don’t see each other’s drafts'],
            ['D', 'Durability', 'Committed data survives crashes instantly'],
          ]),
        NOTE('tip', 'Default autocommit treats every statement as its own tiny transaction — open explicit transactions whenever multiple writes belong together.')
      ),
    ]),

  T('indexes', 'Indexes', 'Advanced SQL', 'Advanced', 10,
    'Make lookups lightning fast, understand the write-time cost, and create the right kinds of indexes.',

    [
      S('concept', 'What an index really is',
        P('Without an index the database scans **every row** (full table scan). An index is a sorted lookup structure (B-tree) pointing straight to matching rows — like a book index instead of reading every page.'),
        C('sql', 'create-index.sql', `CREATE INDEX idx_users_email ON users(email);

-- Composite: helps filters/sorts using email then created_at
CREATE INDEX idx_orders_user_date ON orders(user_id, created_at);

-- Enforce uniqueness through an index
CREATE UNIQUE INDEX idx_products_slug ON products(slug);

SHOW INDEX FROM users;   -- inspect existing indexes`)
      ),
      S('tradeoffs', 'Benefits vs costs',
        TB(['Benefit', 'Cost'],
          [
            ['WHERE / JOIN / ORDER BY become much faster', 'Every INSERT/UPDATE/DELETE also updates indexes'],
            ['Uniqueness enforced cheaply', 'Extra disk space'],
            ['Range scans become seeks', 'Too many indexes confuse the planner'],
          ]),
        NOTE('warn', 'Composite index column order matters: `(user_id, created_at)` serves user+date queries but a query filtering only on `created_at` cannot use it efficiently (left-most prefix rule).')
      ),
      S('verify', 'Verify with EXPLAIN',
        C('sql', 'explain.sql', `EXPLAIN SELECT * FROM users WHERE email = 'ali@example.com';`),
        NOTE('tip', 'Look for type=ref/range plus a key name = index being used. Seeing type=ALL means a full scan — usually a missing index.')
      ),
    ]),

  T('query-optimization', 'Query Optimization', 'Advanced SQL', 'Advanced', 11,
    'A practical checklist for turning slow queries into fast ones — measure, index, trim, repeat.',

    [
      S('checklist', 'The optimization checklist',
        OL(
          '**Measure first** — `EXPLAIN` (or ANALYZE) before guessing.',
          '**Select only needed columns** — `SELECT *` drags extra I/O over the wire.',
          '**Index your WHERE/JOIN/ORDER BY columns** — biggest win, usually.',
          "**Avoid leading-wildcard LIKEs** — `'%'x%'` kills index use.",
          '**Filter early, paginate late** — push WHERE into subqueries/CTEs.',
          '**Batch giant writes** — chunk million-row updates into transactions.',
          '**Watch N+1 queries** — app loops issuing hundreds of tiny queries; replace with JOINs or IN lists.'
        )
      ),
      S('before-after', 'Before → after example',
        C('sql', 'slow.sql', `-- Slow: function wraps indexed column, leading wildcard
SELECT * FROM users
WHERE YEAR(created_at) = 2026
  AND name LIKE '%ali%'
ORDER BY RAND();`),
        C('sql', 'fast.sql', `-- Fast: sargable range, suffix pattern, deterministic sort
SELECT id, name, created_at
FROM users
WHERE created_at >= '2026-01-01' AND created_at < '2027-01-01'
  AND name LIKE 'ali%'
ORDER BY created_at DESC
LIMIT 20;`),
        NOTE('tip', '“Sargable” = written so the index can be used. Functions around columns, implicit casts and leading % are the usual suspects.')
      ),
    ]),

  T('normalization', 'Normalization (1NF–3NF)', 'Advanced SQL', 'Advanced', 12,
    'Design clean schemas step by step: atomic values, full-key dependence, nothing depending on non-keys.',

    [
      S('why', 'Why normalize?',
        P('Normalization removes redundancy and update anomalies. Bad designs store the same fact in many places — change one copy and the others lie. Each normal form fixes a specific disease.')
      ),
      S('1nf', '1NF — atomic values, no repeating groups',
        DIA(`Violates 1NF:                    Fixed:
┌────┬───────────────────┐       ┌────┬─────────┐
│ id │ phones            │       │ id │ phone   │
├────┼───────────────────┤  ⇒    ├────┼─────────┤
│ 1  │ 0300, 0311        │       │ 1  │ 0300    │
└────┴───────────────────┘       │ 1  │ 0311    │
(one cell, many values)          └────┴─────────┘`),
        P('Rule: every cell holds exactly one value; no comma-packed lists.')
      ),
      S('2nf', '2NF — no partial dependency',
        DIA(`order_items(order_id, product_id, product_name, qty)
                        └── depends only on product_id,
                            part of the composite key ✗

Fix: move product_name into products(id, name).`),
        P('Applies to composite keys: non-key columns must depend on the WHOLE key.')
      ),
      S('3nf', '3NF — no transitive dependency',
        DIA(`students(id, dept_id, dept_building)   ✗ building depends
                                          on dept, not student

Fix: departments(dept_id, building) + students.dept_id FK`),
        P('Non-key columns must depend on the key, the whole key, and nothing but the key.')
      ),
      S('denorm', 'When to denormalize',
        NOTE('tip', 'Real systems sometimes deliberately duplicate data (caching counts, read-heavy analytics) to trade storage for speed. Normalize by default; denormalize consciously, with reasons documented.'),
        OL(
          'Start normalized to 3NF — correctness first.',
          'Measure real slow queries.',
          'Introduce controlled duplication only where reads demand it.'
        )
      ),
    ]),
]

export default null
