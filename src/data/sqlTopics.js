// ── DBMastery · SQL Curriculum (Part 1: Fundamentals → Querying Data) ─────────
// Block helpers keep lesson content compact and consistent.
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

export const SQL_CATEGORIES = [
  'Getting Started',
  'Tables & Structure',
  'CRUD Operations',
  'Querying Data',
  'JOINs',
  'Functions',
  'Advanced SQL',
]

export const sqlTopicsA = [
  // ── Getting Started ────────────────────────────────────────────────────────
  T('introduction', 'SQL Introduction', 'Getting Started', 'Beginner', 8,
    'What SQL is, why it exists, and how relational databases organize data into tables, rows and columns.',

    [
      S('what-is-sql', 'What is SQL?', 
        P('**SQL (Structured Query Language)** is the standard language used to store, retrieve, update and delete data in a relational database. Instead of clicking around an app, you *ask* the database for exactly what you want using short, readable statements called **queries**.'),
        P('Think of a database as a smart spreadsheet on steroids: it holds huge amounts of data, enforces rules about that data, and can answer questions across millions of rows in milliseconds.'),
        C('sql', 'your-first-query.sql', `-- Ask the database for every user named "Ali"
SELECT * FROM users WHERE name = 'Ali';`),
        P('That single line is real SQL. You will understand every word of it by the end of this course.')
      ),
      S('why-sql-exists', 'Why does SQL exist?',
        P('Applications constantly need answers: *Which users are active? How many orders were placed today? What is the average cart size?* Storing files by hand cannot handle this at scale. Databases + SQL give you:'),
        UL(
          '**Reliable storage** — data survives crashes and restarts.',
          '**Fast lookups** — indexes find rows among millions instantly.',
          '**Rules & integrity** — invalid data can be rejected before it is saved.',
          '**Shared access** — many users and apps read/write safely at once.'
        )
      ),
      S('sql-vs-db', 'SQL vs Database vs DBMS',
        P('These three terms get mixed up constantly. Here is the clean separation:'),
        TB(['Term', 'What it is', 'Example'],
          [
            ['Database', 'The organized collection of data itself', '`school.db`'],
            ['DBMS', 'The software that manages the database', 'MySQL, PostgreSQL'],
            ['SQL', 'The language you use to talk to the DBMS', '`SELECT ... FROM ...`'],
          ]),
        P('So you write **SQL**, the **DBMS** executes it, and the result comes out of the **database**.')
      ),
      S('relational-concepts', 'The relational model: tables, rows, columns',
        P('A **relational database** stores data in **tables** (also called relations). Each table represents one type of thing — users, products, orders.'),
        DIA(`users table
┌────┬──────────┬───────────────────────┬────────┐
│ id │ name     │ email                 │ age    │   ← columns (fields)
├────┼──────────┼───────────────────────┼────────┤
│ 1  │ Ali      │ ali@example.com       │ 22     │   ← row (record)
│ 2  │ Sara     │ sara@example.com      │ 27     │
│ 3  │ Ahmad    │ ahmad@example.com     │ 19     │
└────┴──────────┴───────────────────────┴────────┘`),
        UL(
          '**Table** — one entity type (e.g. all users).',
          '**Row (record)** — one instance of that entity (one user).',
          '**Column (field)** — one attribute of every row (email, age…).',
          '**Schema** — the blueprint: which tables exist and which columns each has.'
        )
      ),
    ],
    { q: 'Write a query that retrieves every column from the users table.',
      accept: ['select * from users'],
      hint: 'Use SELECT with the “all columns” star, then name the table.',
      solution: "SELECT * FROM users;" }),

  T('dbms', 'DBMS & RDBMS', 'Getting Started', 'Beginner', 6,
    'Understand what a DBMS is, what makes it relational, and how servers, databases, tables, records and fields fit together.',

    [
      S('dbms-defined', 'What is a DBMS?',
        P('A **Database Management System (DBMS)** is software that sits between you and your data. It handles storage, memory, security, backups and concurrent access so your application never touches raw files.'),
        UL(
          '**MySQL / MariaDB** — extremely popular for web apps.',
          '**PostgreSQL** — powerful, standards-focused, loved by developers.',
          '**SQLite** — tiny embedded database, perfect for learning and mobile apps.',
          '**SQL Server / Oracle** — common in large enterprise systems.'
        )
      ),
      S('rdbms', 'What makes it an RDBMS?',
        P('An **RDBMS (Relational DBMS)** is a DBMS that stores data in related tables and enforces relationships between them using keys. MySQL and PostgreSQL are RDBMSs; MongoDB is not (it is document-oriented).'),
        P('The “relational” part matters because real data is connected: an *order* belongs to a *user*, which has an *address*. RDBMSs make those connections explicit and safe.')
      ),
      S('hierarchy', 'Server → Database → Table → Record → Field',
        DIA(`Database Server  (the running program)
 └── Database     school            ← groups related tables
      └── Table   students          ← one entity type
           └── Record  {1, Ali, 22} ← a single row
                └── Field  age = 22   ← one value in that row`),
        TB(['Term', 'Meaning'],
          [
            ['Server', 'The DBMS process listening for connections'],
            ['Database', 'Named container of tables inside the server'],
            ['Table', 'Grid of rows × columns for one entity'],
            ['Record / Row', 'One complete entry in a table'],
            ['Field / Column', 'One attribute shared by every record'],
          ])
      ),
    ]),

  T('create-database', 'Create, Use & Drop a Database', 'Getting Started', 'Beginner', 7,
    'Create your first database, switch to it, list databases, and safely remove one — understanding every keyword.',

    [
      S('create', 'CREATE DATABASE',
        C('sql', 'create-database.sql', `-- Create a new empty database named "school"
CREATE DATABASE school;`),
        LINES([
          { c: 'CREATE DATABASE', d: 'SQL keywords telling the server to make a new database.' },
          { c: 'school', d: 'The name you chose. Pick lowercase snake_case names to avoid quoting issues.' },
          { c: ';', d: 'Every SQL statement ends with a semicolon.' },
        ]),
        P('Nothing visible happens yet — you have created an empty container. List what exists:')
      ),
      S('use-show', 'SHOW DATABASES & USE',
        C('sql', 'use-database.sql', `SHOW DATABASES;   -- list every database on the server

USE school;       -- make "school" the active database`),
        P('After `USE school;`, every following statement runs against that database until you switch again.')
      ),
      S('drop', 'DROP DATABASE',
        C('sql', 'drop-database.sql', `DROP DATABASE school;`),
        NOTE('warn', 'DROP DATABASE deletes the database **and every table and row inside it** — permanently, with no undo. Never run it against a production system unless you truly mean it.'),
        OL(
          '`CREATE` — builds something new.',
          '`USE` — selects where your work happens.',
          '`DROP` — destroys completely. Treat it like a loaded tool.'
        )
      ),
    ],
    { q: 'Create a database named shop.',
      accept: ['create database shop'],
      hint: 'Two keywords plus the name.',
      solution: 'CREATE DATABASE shop;' }),

  // ── Tables & Structure ─────────────────────────────────────────────────────
  T('create-table', 'CREATE TABLE', 'Tables & Structure', 'Beginner', 9,
    'Define your first table with columns, data types and a primary key — and learn what each keyword does.',

    [
      S('first-table', 'Your first table',
        C('sql', 'create-table.sql', `CREATE TABLE students (
    id INT PRIMARY KEY,
    name VARCHAR(100),
    age INT,
    email VARCHAR(150)
);`),
        LINES([
          { c: 'CREATE TABLE students', d: 'Make a new table named students.' },
          { c: '( … )', d: 'Everything between the parentheses defines the columns.' },
          { c: 'id INT PRIMARY KEY', d: 'An integer column that uniquely identifies each student.' },
          { c: 'name VARCHAR(100)', d: 'Variable-length text up to 100 characters.' },
          { c: 'age INT', d: 'Whole numbers: 18, 21, 30…' },
          { c: 'email VARCHAR(150)', d: 'Text up to 150 characters — emails can be long.' },
        ])
      ),
      S('primary-key', 'What PRIMARY KEY means',
        P('The **primary key** is the column that makes every row unique. Two students may share the same name, but never the same `id`. The database will reject duplicate or missing primary key values automatically.'),
        NOTE('tip', 'Good primary keys never change and carry no meaning: use a plain number (`id`) rather than something editable like an email address.')
      ),
      S('inspect', 'Checking your work',
        C('sql', 'inspect-table.sql', `SHOW TABLES;             -- confirm the table exists
DESCRIBE students;       -- show its columns and types`),
        P('You now have a structured home for data. Next lessons teach how to reshape it (`ALTER`) and fill it (`INSERT`).')
      ),
    ],
    { q: 'Create a table named courses with id INT PRIMARY KEY and title VARCHAR(120).',
      accept: ['create table courses(id intprimary key,title varchar(120))'],
      hint: 'Follow the students example: CREATE TABLE name ( col type, … );',
      solution: 'CREATE TABLE courses (\n  id INT PRIMARY KEY,\n  title VARCHAR(120)\n);' }),

  T('alter-drop-truncate', 'ALTER, DROP & TRUNCATE TABLE', 'Tables & Structure', 'Beginner', 8,
    'Change existing tables safely: add or remove columns, rename things, empty a table, or delete it forever.',

    [
      S('alter', 'ALTER TABLE — change structure',
        C('sql', 'alter-table.sql', `-- Add a new column to an existing table
ALTER TABLE students ADD phone VARCHAR(20);

-- Remove a column
ALTER TABLE students DROP COLUMN phone;

-- Change a column's data type
ALTER TABLE students MODIFY age SMALLINT;

-- Rename the table itself
ALTER TABLE students RENAME TO learners;`),
        P('`ALTER TABLE` reshapes a table that already contains data — the rows survive the change.')
      ),
      S('truncate', 'TRUNCATE — empty but keep the table',
        C('sql', 'truncate.sql', `TRUNCATE TABLE students;`),
        P('`TRUNCATE` deletes **every row** instantly while keeping the table definition. It is fast and resets auto-increment counters, but it cannot be filtered — there is no `WHERE`.')
      ),
      S('drop-table', 'DROP TABLE — remove everything',
        C('sql', 'drop-table.sql', `DROP TABLE students;`),
        NOTE('warn', '`DROP TABLE` erases the rows **and** the table definition. There is no recycle bin.'),
        TB(['Command', 'Rows deleted', 'Structure kept', 'Can be filtered'],
          [
            ['`DELETE`', 'Yes — selected ones', 'Yes', 'Yes (`WHERE`)'],
            ['`TRUNCATE`', 'Yes — all, very fast', 'Yes', 'No'],
            ['`DROP`', 'Yes — all', '**No**', 'No'],
          ])
      ),
    ],
    { q: 'Remove every row from the logs table but keep the table itself.',
      accept: ['truncatetablelogs', 'deletefromlogs'],
      hint: 'One keyword between TRUNCATE and the table name.',
      solution: 'TRUNCATE TABLE logs;' }),

  T('data-types', 'SQL Data Types', 'Tables & Structure', 'Beginner', 10,
    'A practical reference for choosing the right column type: numbers, text, dates, booleans and JSON.',

    [
      S('numbers', 'Numeric types',
        TB(['Type', 'Stores', 'Example', 'When to use'],
          [
            ['`INT`', 'Whole numbers ±2.1 billion', '42', 'IDs, ages, quantities'],
            ['`BIGINT`', 'Huge whole numbers', '9000000000', 'Views, likes, snowflake IDs'],
            ['`DECIMAL(10,2)`', 'Exact decimals', '19.99', 'Money — always!'],
            ['`FLOAT`', 'Approximate decimals', '3.14159', 'Scientific values where tiny errors are OK'],
          ]),
        NOTE('tip', 'Never store money in `FLOAT`: rounding errors will eat cents. Use `DECIMAL`, always.')
      ),
      S('text', 'Text types',
        TB(['Type', 'Stores', 'Example', 'When to use'],
          [
            ['`VARCHAR(n)`', 'Variable text up to n chars', "'Ali'", 'Names, emails, titles'],
            ['`CHAR(n)`', 'Fixed-length text padded to n', "'PK'", 'Country codes, flags'],
            ['`TEXT`', 'Long unbounded text', 'an article body', 'Descriptions, blog posts'],
          ])
      ),
      S('dates-bools-json', 'Dates, Booleans & JSON',
        TB(['Type', 'Stores', 'Example', 'When to use'],
          [
            ['`DATE`', 'Calendar date only', "'2026-08-24'", 'Birthdays, deadlines'],
            ['`DATETIME`', 'Date + wall-clock time', "'2026-08-24 14:05:00'", 'Appointments'],
            ['`TIMESTAMP`', 'UTC point in time', 'auto `NOW()`', 'created_at / updated_at'],
            ['`BOOLEAN`', 'True / false', 'TRUE', 'is_active, is_deleted'],
            ['`JSON`', 'Structured JSON documents', '{"city":"Peshawar"}', 'Flexible metadata'],
          ]),
        NOTE('info', 'Exact names vary slightly per engine (e.g. PostgreSQL uses `BOOLEAN`, older MySQL uses `TINYINT(1)`). The concepts transfer everywhere.')
      ),
    ]),

  T('keys', 'SQL Keys', 'Tables & Structure', 'Intermediate', 11,
    'Primary, foreign, candidate, composite, alternate and unique keys — how rows stay unique and tables connect.',

    [
      S('key-types', 'The six keys you must know',
        TB(['Key', 'Purpose'],
          [
            ['**Primary Key**', 'The chosen unique identifier of a table. Never NULL, never duplicated.'],
            ['**Foreign Key**', 'A column pointing at another table’s primary key — creates the relationship.'],
            ['**Candidate Key**', 'Any column(s) that *could* serve as primary key (email, national ID…).'],
            ['**Composite Key**', 'A key made of two+ columns combined (e.g. student_id + course_id).'],
            ['**Alternate Key**', 'A candidate key that was *not* chosen as the primary key.'],
            ['**Unique Key**', 'Constraint enforcing no duplicates, but unlike PK it usually allows one NULL.'],
          ])
      ),
      S('relationship', 'How two tables connect',
        DIA(`users                 orders
──────────            ─────────────
id    PK              id        PK
name                  user_id   FK ───→ users.id
email                 amount`),
        P('Each order stores the `user_id` of whoever placed it. That foreign key is the glue of relational design: JOINs (later) follow exactly these links.'),
        C('sql', 'foreign-key.sql', `CREATE TABLE users (
    id INT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(150) UNIQUE
);

CREATE TABLE orders (
    id INT PRIMARY KEY,
    user_id INT,
    amount DECIMAL(10,2),
    FOREIGN KEY (user_id) REFERENCES users(id)
);`)
      ),
      S('choosing', 'Choosing good keys',
        UL(
          'Prefer a meaningless auto-increment `id` as primary key.',
          'Put `UNIQUE` on natural identifiers like email or username.',
          'Use composite keys only for junction tables (student ↔ course enrollment).'
        )
      ),
    ]),

  T('constraints', 'SQL Constraints', 'Tables & Structure', 'Beginner', 9,
    'Rules that protect your data automatically: NOT NULL, UNIQUE, PRIMARY KEY, FOREIGN KEY, CHECK and DEFAULT.',

    [
      S('overview', 'Constraints = automatic guardrails',
        P('A constraint tells the database which values are acceptable. If a statement breaks a rule, the database rejects the change instead of saving bad data.'),
        C('sql', 'constraints.sql', `CREATE TABLE accounts (
    id INT PRIMARY KEY,                       -- unique + not null
    owner VARCHAR(100) NOT NULL,              -- must have a value
    email VARCHAR(150) UNIQUE,                -- no duplicates allowed
    balance DECIMAL(10,2) DEFAULT 0,          -- starts at zero
    status VARCHAR(10) CHECK (status IN ('active','frozen')),
    branch_id INT,
    FOREIGN KEY (branch_id) REFERENCES branches(id)
);`)
      ),
      S('each-one', 'What each constraint does',
        UL(
          '**PRIMARY KEY** — unique row identity; implies NOT NULL.',
          '**FOREIGN KEY** — value must exist in the referenced table (no ghost orders).',
          '**UNIQUE** — no two rows share the value; one NULL typically permitted.',
          '**NOT NULL** — the field is required.',
          '**CHECK** — a custom boolean rule the value must satisfy.',
          '**DEFAULT** — used automatically when the column is omitted.'
        ),
        NOTE('tip', 'Name important constraints explicitly (`CONSTRAINT chk_status CHECK …`) so error messages tell you exactly which rule failed.')
      ),
    ],
    { q: 'Add a CHECK constraint style column definition ensuring quantity is greater than 0 for a column qty INT.',
      accept: ['qtyintcheck(qty>0)'],
      hint: 'column_name TYPE CHECK (condition)',
      solution: 'qty INT CHECK (qty > 0)' }),

  // ── CRUD Operations ────────────────────────────────────────────────────────
  T('insert', 'INSERT — Create data', 'CRUD Operations', 'Beginner', 7,
    'Add rows to a table with INSERT INTO, insert multiple rows at once, and avoid silent mistakes.',

    [
      S('insert-basic', 'INSERT INTO … VALUES',
        C('sql', 'insert.sql', `-- Add one user, naming the columns explicitly
INSERT INTO users (name, email)
VALUES ('Ali', 'ali@example.com');`),
        LINES([
          { c: 'INSERT INTO users', d: 'Target table.' },
          { c: '(name, email)', d: 'Columns being filled — any omitted column gets its DEFAULT (or NULL).' },
          { c: "VALUES ('Ali', …)", d: 'Values in the same order as the listed columns. Text needs quotes; numbers do not.' },
        ])
      ),
      S('multiple', 'Inserting several rows',
        C('sql', 'insert-many.sql', `INSERT INTO users (name, email) VALUES
    ('Sara',  'sara@example.com'),
    ('Ahmad', 'ahmad@example.com'),
    ('Zara',  'zara@example.com');`),
        P('One statement, three rows — faster than three separate inserts.')
      ),
      S('mistake', 'Common mistake',
        NOTE('warn', 'Writing `VALUES` in a different order than the column list silently puts data in wrong columns. Always list columns explicitly instead of relying on table order.')
      ),
    ],
    { q: "Insert a product named 'Laptop' priced 999.99 into products(name, price).",
      accept: ["insertinto products(name,price)values('laptop',999.99)", "insert into products (name,price) values ('laptop',999.99)"],
      hint: 'INSERT INTO products (name, price) VALUES (…);',
      solution: "INSERT INTO products (name, price)\nVALUES ('Laptop', 999.99);" }),

  T('select', 'SELECT — Read data', 'CRUD Operations', 'Beginner', 7,
    'Retrieve exactly the rows and columns you need, and rename outputs with aliases.',

    [
      S('select-all', 'Select everything',
        C('sql', 'select-all.sql', `SELECT * FROM users;`),
        P('`*` means “every column”. Great for exploring, wasteful in production — fetch only what you display.')
      ),
      S('select-columns', 'Choose specific columns + alias',
        C('sql', 'select-columns.sql', `SELECT name, email FROM users;

-- Rename a column in the output using AS
SELECT name AS customer_name, age FROM users;`),
        P('Listing columns makes queries faster, documents intent, and keeps working when the table gains new fields.')
      ),
      S('expressions', 'Computed columns',
        C('sql', 'select-expr.sql', `SELECT name, price, price * 0.9 AS discounted_price
FROM products;`),
        NOTE('tip', 'Aliases created with `AS` are also usable in `ORDER BY` later.')
      ),
    ],
    { q: 'Fetch only the name and price columns from products.',
      accept: ['selectname,pricefromproducts'],
      hint: 'List the columns after SELECT instead of using *.',
      solution: 'SELECT name, price FROM products;' }),

  T('update', 'UPDATE — Modify data', 'CRUD Operations', 'Beginner', 8,
    'Change existing rows safely, update several columns at once, and build the habit of protecting yourself with WHERE.',

    [
      S('update-basic', 'UPDATE … SET … WHERE',
        C('sql', 'update.sql', `UPDATE users
SET name = 'Ahmad'
WHERE id = 1;`),
        LINES([
          { c: 'UPDATE users', d: 'Which table to modify.' },
          { c: "SET name = 'Ahmad'", d: 'New value assignment — add commas to change more columns.' },
          { c: 'WHERE id = 1', d: 'Filter deciding exactly which rows change.' },
        ]),
        C('sql', 'update-multi.sql', `UPDATE users
SET name = 'Ahmad',
    age = 25,
    status = 'active'
WHERE id = 1;`)
      ),
      S('danger', '⚠ The missing-WHERE disaster',
        NOTE('warn', '`UPDATE users SET name = \'Ahmad\';` renames **every user in the table** to Ahmad. Without WHERE, the change hits all rows — and unlike code, there is no Ctrl+Z.'),
        P('Safe workflow: run the filter as a `SELECT` first, verify it returns exactly the rows you intend, then convert it to `UPDATE`.'),
        C('sql', 'safe-update.sql', `-- Step 1: preview the targets
SELECT * FROM users WHERE id = 1;
-- Step 2: only then update them
UPDATE users SET name = 'Ahmad' WHERE id = 1;`)
      ),
    ],
    { q: "Set price = 499.99 for the product whose id is 3.",
      accept: ['updateproductssetprice=499.99whereid=3'],
      hint: 'UPDATE table SET col = value WHERE …;',
      solution: "UPDATE products\nSET price = 499.99\nWHERE id = 3;" }),

  T('delete', 'DELETE — Remove data', 'CRUD Operations', 'Beginner', 7,
    'Delete precise rows with WHERE, and know when DELETE beats TRUNCATE.',

    [
      S('delete-basic', 'DELETE FROM … WHERE',
        C('sql', 'delete.sql', `DELETE FROM users
WHERE id = 1;`),
        P('Only rows matching the condition disappear; the table and its structure remain.')
      ),
      S('conditions', 'Deleting by any condition',
        C('sql', 'delete-where.sql', `-- Remove guests who never verified their email
DELETE FROM users
WHERE status = 'guest'
  AND email_verified = FALSE;`),
        NOTE('warn', 'Same rule as UPDATE: `DELETE FROM users;` with no WHERE empties the entire table. Preview with SELECT first.')
      ),
      S('vs-truncate', 'DELETE vs TRUNCATE',
        TB(['Need', 'Use'],
          [
            ['Remove specific rows', '`DELETE … WHERE`'],
            ['Reset a table fully but keep it', '`TRUNCATE TABLE`'],
            ['Remove the table itself', '`DROP TABLE`'],
          ])
      ),
    ],
    { q: 'Delete the order with id equal to 42.',
      accept: ['deletefromorderswhereid=42'],
      hint: 'DELETE FROM table WHERE …;',
      solution: 'DELETE FROM orders WHERE id = 42;' }),

  // ── Querying Data ──────────────────────────────────────────────────────────
  T('where', 'WHERE — Filtering Rows', 'Querying Data', 'Beginner', 8,
    'Return only the rows you care about using comparison operators.',

    [
      S('definition', 'Definition',
        P('`WHERE` filters rows *before* anything is returned. It accepts a boolean expression evaluated per row — if it is true, the row survives.')
      ),
      S('syntax', 'Syntax',
        C('sql', 'syntax.sql', `SELECT columns
FROM table
WHERE condition;`)
      ),
      S('operators', 'Comparison operators',
        TB(['Operator', 'Meaning', 'Example'],
          [
            ['=', 'equals', "`country = 'Pakistan'`"],
            ['<>, !=', 'not equal', '`status <> "banned"`'],
            ['>', '<', 'greater / less than', '`price > 100`'],
            ['>=', '<=', 'with equality', '`age >= 18`'],
          ]),
        C('sql', 'examples.sql', `SELECT * FROM users WHERE age >= 18;

SELECT name FROM products WHERE price < 50;

SELECT * FROM orders WHERE status <> 'cancelled';`)
      ),
      S('real-world', 'Real-world example',
        C('sql', 'dashboard.sql', `-- Admin dashboard: today's pending orders above 5000 rupees
SELECT *
FROM orders
WHERE status = 'pending'
  AND total > 5000;`)
      ),
      S('mistake-tip', 'Common mistake & quick tip',
        NOTE('warn', 'Comparing with NULL using `=` never works: `WHERE phone = NULL` matches nothing. Null checks need `IS NULL` (own lesson ahead).'),
        NOTE('tip', 'Filters run left-to-right but the optimizer reorders freely — write conditions in whatever order reads best for humans.')
      ),
    ],
    { q: 'Find all users older than 18.',
      accept: ['select*fromuserswhereage>18'],
      hint: 'SELECT * FROM users WHERE age > …;',
      solution: 'SELECT *\nFROM users\nWHERE age > 18;' }),

  T('and-or-not', 'AND, OR & NOT', 'Querying Data', 'Beginner', 7,
    'Combine multiple conditions into precise filters — and master operator precedence with parentheses.',

    [
      S('definition', 'Definition',
        P('Logical operators combine boolean conditions: **AND** requires both sides true, **OR** requires at least one, **NOT** flips a condition.')
      ),
      S('syntax-example', 'Syntax & examples',
        C('sql', 'logic.sql', `-- Both conditions must hold
SELECT * FROM users
WHERE country = 'Pakistan' AND age >= 18;

-- Either condition is enough
SELECT * FROM users
WHERE status = 'admin' OR status = 'moderator';

-- Exclude a group
SELECT * FROM users
WHERE NOT status = 'banned';`)
      ),
      S('precedence', 'Precedence: parentheses win',
        P('`AND` binds tighter than `OR`, so `a OR b AND c` means `a OR (b AND c)`. When mixing them, add parentheses even when optional — future-you will thank you.'),
        C('sql', 'parentheses.sql', `-- Clear intent: banned users, OR adults from Pakistan
SELECT * FROM users
WHERE status = 'banned'
   OR (country = 'Pakistan' AND age >= 18);`)
      ),
      S('mistake-tip', 'Common mistake & quick tip',
        NOTE('warn', 'Forgetting parentheses around OR blocks is the #1 logic bug in report queries — results quietly include rows you did not expect.'),
        NOTE('tip', '`BETWEEN`, `IN` and multiple `OR`s on one column are interchangeable — pick whichever reads clearest.')
      ),
    ],
    { q: "Find users from Pakistan who are also active.",
      accept: ["select*fromuserswherecountry='pakistan'andstatus='active'"],
      hint: 'Both conditions joined by AND.',
      solution: "SELECT * FROM users\nWHERE country = 'Pakistan'\n  AND status = 'active';" }),

  T('distinct', 'DISTINCT', 'Querying Data', 'Beginner', 5,
    'Eliminate duplicate rows from results with one keyword.',

    [
      S('definition-syntax', 'Definition & syntax',
        P('`DISTINCT` removes duplicate rows from the output — identical rows collapse into one.'),
        C('sql', 'syntax.sql', `SELECT DISTINCT country FROM users;`)
      ),
      S('multi-column', 'Multiple columns',
        C('sql', 'distinct-two.sql', `-- Unique combinations of city + country
SELECT DISTINCT city, country FROM users;`),
        P('Uniqueness applies to the **whole row combination**, not each column separately.')
      ),
      S('real-world-mistake', 'Real-world use & mistake',
        C('sql', 'report.sql', '-- Which countries do our customers actually live in?\nSELECT DISTINCT country FROM customers ORDER BY country;'),
        NOTE('warn', '`SELECT DISTINCT name, age FROM users;` does not give unique names — pairs like ("Ali",22) and ("Ali",30) are different rows and both appear.'),
        NOTE('tip', 'DISTINCT can hide messy joins producing accidental duplicates. Fix the join first, dedupe second.')
      ),
    ],
    { q: 'Get the list of unique cities from users.',
      accept: ['selectdistinctcityfromusers'],
      hint: 'Place DISTINCT right after SELECT.',
      solution: 'SELECT DISTINCT city FROM users;' }),

  T('in-operator', 'IN', 'Querying Data', 'Beginner', 6,
    'Match a column against a tidy list of values instead of chaining ORs.',

    [
      S('definition-syntax', 'Definition & syntax',
        P('`IN` checks whether a value appears in a provided set. It reads better and often performs faster than long `OR` chains.'),
        C('sql', 'syntax.sql', `SELECT * FROM users
WHERE country IN ('Pakistan', 'Turkey', 'Malaysia');`),
        P('Equivalent to three OR conditions — but shorter, clearer, easier to extend.')
      ),
      S('not-in-subquery', 'NOT IN and subqueries',
        C('sql', 'in-more.sql', `-- Everyone outside the banned list
SELECT * FROM users
WHERE status NOT IN ('banned', 'suspended');

-- Values coming from another query
SELECT * FROM products
WHERE category_id IN (SELECT id FROM categories WHERE featured = TRUE);`)
      ),
      S('mistake-tip', 'Common mistake & quick tip',
        NOTE('warn', '`NOT IN` with a subquery returning any NULL matches *nothing*, because `value NOT IN (NULL)` is unknown. Filter NULLs out of the subquery.'),
        NOTE('tip', 'Most engines optimize `IN` lists into fast lookups — do not fear lists with dozens of values.')
      ),
    ],
    { q: "Find products whose category is 'phones' or 'laptops'.",
      accept: ["select*fromproductswherecategoryin('phones','laptops')"],
      hint: 'WHERE category IN ( … , … )',
      solution: "SELECT * FROM products\nWHERE category IN ('phones', 'laptops');" }),

  T('between', 'BETWEEN', 'Querying Data', 'Beginner', 5,
    'Filter numeric and date ranges without writing two comparisons.',

    [
      S('definition-syntax', 'Definition & syntax',
        P('`BETWEEN a AND b` is inclusive on **both ends**: it means `value >= a AND value <= b`.'),
        C('sql', 'syntax.sql', `SELECT * FROM products
WHERE price BETWEEN 100 AND 500;`)
      ),
      S('dates', 'Ranges over dates',
        C('sql', 'between-dates.sql', `SELECT * FROM orders
WHERE created_at BETWEEN '2026-01-01' AND '2026-01-31';`),
        NOTE('info', "With datetime columns remember midnight boundaries: `'2026-01-31'` means Jan 31 **00:00:00**, so late-night orders slip out of range. Use `< '2026-02-01'` for clean month filters.")
      ),
      S('mistake-tip', 'Common mistake & quick tip',
        NOTE('warn', 'Assuming the end value is exclusive drops boundary rows — BETWEEN includes them.'),
        NOTE('tip', 'Negate with `NOT BETWEEN` to grab everything outside the range.')
      ),
    ],
    { q: 'Find users aged between 18 and 30.',
      accept: ['select*fromuserswhereagebetween18and30'],
      hint: 'WHERE age BETWEEN low AND high;',
      solution: 'SELECT * FROM users\nWHERE age BETWEEN 18 AND 30;' }),

  T('like', 'LIKE — Pattern Matching', 'Querying Data', 'Beginner', 7,
    'Match text patterns with % and _ wildcards for search-style filtering.',

    [
      S('definition-syntax', 'Definition & wildcards',
        P('`LIKE` compares strings against a pattern containing wildcards:'),
        TB(['Wildcard', 'Matches'],
          [['%', 'any sequence of characters (even empty)'],
           ['_', 'exactly one character']]),
        C('sql', 'patterns.sql', `SELECT * FROM users WHERE name LIKE 'A%';   -- starts with A
SELECT * FROM users WHERE name LIKE '%son';  -- ends with son
SELECT * FROM users WHERE name LIKE '%ali%'; -- contains ali
SELECT * FROM users WHERE name LIKE '_ara';  -- 4 letters ending ara`)
      ),
      S('real-world', 'Real-world example',
        C('sql', 'search-box.sql', `-- Autocomplete for a search box
SELECT name FROM products
WHERE name LIKE CONCAT('%', :user_input, '%')
LIMIT 10;`)
      ),
      S('mistake-tip', 'Common mistake & quick tip',
        NOTE('warn', "Leading `%` (`'%ali%'`) prevents index usage — on big tables it triggers slow full scans. Prefer suffix patterns or full-text search."),
        NOTE('tip', "In most engines LIKE is case-insensitive by default collation; use `ILIKE` (PostgreSQL) or LOWER() for guaranteed case-insensitivity.")
      ),
    ],
    { q: 'Find users whose name starts with A.',
      accept: ["select*fromuserswherenamelike'a%'"],
      hint: 'Percent wildcard goes after the letter.',
      solution: "SELECT * FROM users\nWHERE name LIKE 'A%';" }),

  T('is-null', 'IS NULL / IS NOT NULL', 'Querying Data', 'Beginner', 6,
    'Handle missing values correctly — the one case where = and != fail.',

    [
      S('definition', 'Definition: what NULL really means',
        P('`NULL` is not zero and not an empty string — it means **unknown/absent**. Any comparison with NULL yields “unknown”, which WHERE treats as false. That is why special operators exist.')
      ),
      S('syntax-example', 'Syntax & examples',
        C('sql', 'null-checks.sql', `-- Users who never added a phone number
SELECT * FROM users WHERE phone IS NULL;

-- Users who DID add one
SELECT * FROM users WHERE phone IS NOT NULL;

-- Provide fallbacks with COALESCE
SELECT name, COALESCE(phone, 'no phone') AS contact FROM users;`)
      ),
      S('mistake-tip', 'Common mistake & quick tip',
        NOTE('warn', '`WHERE phone = NULL` and `WHERE phone != NULL` return zero rows — always. Use IS NULL / IS NOT NULL.'),
        NOTE('tip', '`COUNT(*)` counts NULL-containing rows but `COUNT(column)` skips them — handy for “how many users lack email?”')
      ),
    ],
    { q: 'Find users who have no profile bio.',
      accept: ['select*fromuserswherebioisnull'],
      hint: 'WHERE bio IS NULL',
      solution: 'SELECT * FROM users\nWHERE bio IS NULL;' }),

  T('order-by', 'ORDER BY — Sorting Results', 'Querying Data', 'Beginner', 6,
    'Control the order of returned rows with ASC/DESC and multi-level sorting.',

    [
      S('definition', 'Definition',
        P('Without `ORDER BY`, SQL promises **no particular row order** — results may shuffle between runs. Sorting is explicit and happens near the end of query execution.')
      ),
      S('syntax-example', 'Syntax & examples',
        C('sql', 'sorting.sql', `-- Newest users first
SELECT * FROM users ORDER BY created_at DESC;

-- Country A→Z, then oldest first within each country
SELECT * FROM users ORDER BY country ASC, age DESC;

-- Sort by a computed/aliased column
SELECT name, price * 0.9 AS discounted
FROM products ORDER BY discounted ASC;`),
        UL('**ASC** — ascending (default, can be omitted).', '**DESC** — descending.')
      ),
      S('mistake-tip', 'Common mistake & quick tip',
        NOTE('warn', 'Relying on “natural” order without ORDER BY works until an index or parallel scan silently changes it — always sort explicitly for user-facing output.'),
        NOTE('tip', 'Sort by column position (`ORDER BY 2`) exists but hurts readability — prefer names or aliases.')
      ),
    ],
    { q: 'Show users sorted by age, youngest first.',
      accept: ['select*fromusersorderbyageasc', 'select*fromusersorderbyage'],
      hint: 'ASC is the default direction.',
      solution: 'SELECT * FROM users\nORDER BY age ASC;' }),

  T('limit-offset', 'LIMIT & OFFSET', 'Querying Data', 'Beginner', 6,
    'Cap result size and page through data like a feed or search results grid.',

    [
      S('definition-syntax', 'Definition & syntax',
        C('sql', 'syntax.sql', `SELECT * FROM users
ORDER BY created_at DESC
LIMIT 10 OFFSET 20;   -- skip 20, return next 10 → page 3`),
        P('`LIMIT` caps how many rows come back; `OFFSET` skips rows first. Together they power pagination.')
      ),
      S('pagination', 'Pagination formula',
        C('sql', 'page-formula.sql', `-- Page N with SIZE rows per page (N counts from 1)
SELECT * FROM products
ORDER BY id
LIMIT SIZE OFFSET (N - 1) * SIZE;

-- Concrete: page 3, 10 per page
SELECT * FROM products ORDER BY id LIMIT 10 OFFSET 20;`),
        NOTE('info', 'Dialect notes: SQL Server uses `TOP 10` / `OFFSET … FETCH NEXT`; Oracle uses `FETCH FIRST`. LIMIT/OFFSET covers MySQL, PostgreSQL and SQLite.')
      ),
      S('mistake-tip', 'Common mistake & quick tip',
        NOTE('warn', 'Paginating without ORDER BY gives unstable pages — rows may repeat or vanish between pages.'),
        NOTE('tip', 'Always pair LIMIT with a sort on an indexed, unique column for stable, fast paging.')
      ),
    ],
    { q: 'Return the first 5 newest orders (newest defined by created_at).',
      accept: ['select*fromordersorderbycreated_atdesclimit5'],
      hint: 'ORDER BY created_at DESC LIMIT 5;',
      solution: 'SELECT * FROM orders\nORDER BY created_at DESC\nLIMIT 5;' }),

  T('group-by', 'GROUP BY', 'Querying Data', 'Intermediate', 9,
    'Collapse rows into buckets per group and compute totals per bucket with aggregates.',

    [
      S('definition', 'Definition',
        P('`GROUP BY` partitions rows into groups sharing a column value, then aggregate functions summarize each group into **one output row**. This is how reports are born.')
      ),
      S('visual', 'How grouping looks',
        DIA(`orders                      grouped by user_id
┌─────────┬────────┐        ┌─────────┬───────────┐
│ user_id │ amount │        │ user_id │ SUM(...)  │
├─────────┼────────┤   ⇒    ├─────────┼───────────┤
│ 1       │ 250    │        │ 1       │ 550       │
│ 2       │ 400    │        │ 2       │ 400       │
│ 1       │ 300    │        └─────────┴───────────┘
└─────────┴────────┘`),
        C('sql', 'group-by.sql', `SELECT user_id, SUM(amount) AS total_spent
FROM orders
GROUP BY user_id;`)
      ),
      S('rules', 'The golden rule',
        P('Every column in `SELECT` must be either **inside an aggregate function** or **listed in GROUP BY**. Anything else is ambiguous — the database refuses to guess.'),
        NOTE('warn', '`SELECT name, COUNT(*) FROM users GROUP BY country;` fails: which `name` should represent a whole country? Aggregate it or group by it.')
      ),
      S('mistake-tip', 'Common mistake & quick tip',
        NOTE('tip', 'Typical pipeline: `WHERE` filters raw rows → `GROUP BY` buckets them → `HAVING` filters buckets → `ORDER BY` sorts output.')
      ),
    ],
    { q: 'Count orders per user: show user_id and the count as order_count.',
      accept: ['selectuser_id,count(*)asorder_countfromordersgroupbyuser_id'],
      hint: 'COUNT(*) inside SELECT, GROUP BY user_id at the end.',
      solution: 'SELECT user_id,\n       COUNT(*) AS order_count\nFROM orders\nGROUP BY user_id;' }),

  T('having', 'HAVING — Filtering Groups', 'Querying Data', 'Intermediate', 7,
    'Apply conditions to aggregated results — the WHERE clause for groups.',

    [
      S('definition-syntax', 'Definition & syntax',
        P('`WHERE` filters rows *before* grouping; `HAVING` filters groups *after* aggregation. That is why HAVING can see COUNT/SUM while WHERE cannot.'),
        C('sql', 'syntax.sql', `SELECT country, COUNT(*) AS users_count
FROM users
WHERE status = 'active'          -- 1) filter raw rows
GROUP BY country                 -- 2) bucket per country
HAVING COUNT(*) >= 100           -- 3) keep big buckets only
ORDER BY users_count DESC;       -- 4) sort the summary`)
      ),
      S('having-vs-where', 'HAVING vs WHERE',
        TB(['', 'WHERE', 'HAVING'],
          [
            ['Runs', 'before grouping', 'after grouping'],
            ['Sees aggregates?', 'No', 'Yes'],
            ['Filters', 'individual rows', 'whole groups'],
          ])
      ),
      S('mistake-tip', 'Common mistake & quick tip',
        NOTE('warn', 'Putting aggregate conditions in WHERE errors out (“aggregate not allowed”). If the condition mentions COUNT/SUM/AVG… it belongs in HAVING.'),
        NOTE('tip', 'Alias reuse in HAVING varies by engine — repeating `COUNT(*)` is the portable choice.')
      ),
    ],
    { q: 'Show categories having more than 5 products (table products, column category).',
      accept: ['selectcategory,count(*)fromproductsgroupbycategoryhavingcount(*)>5'],
      hint: 'GROUP BY first, then HAVING with COUNT(*) > 5.',
      solution: 'SELECT category, COUNT(*)\nFROM products\nGROUP BY category\nHAVING COUNT(*) > 5;' }),
]

export default null
