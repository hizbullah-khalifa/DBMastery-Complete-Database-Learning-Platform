// ── DBMastery · MongoDB Curriculum (Part 1: Fundamentals → CRUD) ──────────────
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

export const MONGO_CATEGORIES = [
  'Fundamentals',
  'CRUD Operations',
  'Data Modeling',
  'Aggregation',
  'Performance & Production',
]

export const mongoTopicsA = [
  // ── Fundamentals ───────────────────────────────────────────────────────────
  T('introduction', 'MongoDB Introduction', 'Fundamentals', 'Beginner', 9,
    'What MongoDB is, what NoSQL means, and why documents became the most popular alternative to tables.',

    [
      S('what-is-mongo', 'What is MongoDB?',
        P('**MongoDB** is a **document database**: instead of rows in rigid tables it stores flexible **JSON-like documents** grouped into collections. One document holds everything about one entity — including nested objects and arrays.'),
        C('js', 'a-mongodb-document.js', `// One user as a single MongoDB document
{
    _id: ObjectId("66c9f0f1e4b0a1f3c8d9e2b7"),
    name: "Ali",
    age: 22,
    email: "ali@example.com",
    skills: ["React", "Node.js"],
    address: { city: "Timergara", country: "Pakistan" }
}`),
        P('Everything the app needs about Ali lives together — no JOIN required to assemble his profile.')
      ),
      S('nosql', 'What is NoSQL?',
        P('“NoSQL” covers databases that abandon the strict relational model to gain flexibility and horizontal scale. Families include documents (MongoDB), key-value (Redis), wide-column (Cassandra) and graph (Neo4j).'),
        UL(
          '**Flexible schema** — documents in one collection may differ.',
          '**Horizontal scaling** — data spreads across many servers via sharding.',
          '**Developer-friendly** — JSON maps directly onto application objects.'
        )
      ),
      S('terminology-map', 'SQL world vs MongoDB world',
        DIA(`SQL                        MongoDB
─────────                  ───────────
Database                   Database
 └── Table                  └── Collection
      └── Row                    └── Document
           └── Column                 └── Field`),
        TB(['SQL', 'MongoDB'],
          [
            ['Table', 'Collection'],
            ['Row / Record', 'Document'],
            ['Column', 'Field'],
            ['Primary Key', '`_id` (automatic)'],
            ['JOIN', '$lookup / embedding'],
            ['Schema enforced by DB', 'Schema defined by your code'],
          ])
      ),
    ],
    { q: 'Which field does MongoDB automatically add as every document’s unique id?',
      accept: ['_id'],
      hint: 'It starts with an underscore.',
      solution: '_id' }),

  T('mongodb-vs-sql', 'MongoDB vs SQL', 'Fundamentals', 'Beginner', 8,
    'An honest comparison: where documents shine, where relations win, and how to choose for your project.',

    [
      S('philosophy', 'Two philosophies',
        P('**SQL** normalizes data into separate tables connected by keys — integrity first. **MongoDB** embeds related data inside one document — read-speed and shape-fit first. Both are mature; they simply optimize differently.'),
        TB(['Aspect', 'SQL (MySQL/Postgres)', 'MongoDB'],
          [
            ['Structure', 'Fixed schema per table', 'Flexible per document'],
            ['Relationships', 'JOINs across tables', 'Embedding or $lookup'],
            ['Scaling', 'Vertical (bigger box)', 'Horizontal (sharding built-in)'],
            ['Transactions', 'Mature, everywhere', 'Supported (replica sets), use sparingly'],
            ['Complex ad-hoc reports', 'Excellent', 'Good (aggregation pipeline)'],
          ])
      ),
      S('choose', 'How to choose',
        UL(
          '**Choose SQL** for banking-style integrity, heavy multi-entity reporting, deeply relational data.',
          '**Choose MongoDB** for rapidly evolving schemas, catalogs/CMS, user profiles, event logs, mobile backends.',
          '**Real apps mix both** — that is normal engineering, not betrayal.'
        ),
        NOTE('tip', 'If you cannot draw your entities without arrows crossing constantly, that is a hint SQL will serve you better.')
      ),
    ]),

  T('databases-collections', 'Databases & Collections', 'Fundamentals', 'Beginner', 7,
    'Navigate mongosh: list, create (implicitly!) and inspect databases and collections.',

    [
      S('database-commands', 'Database level commands',
        C('js', 'shell-database.js', `show dbs              // list existing databases
use school            // switch/create database "school"
db                    // confirm current database
db.dropDatabase()     // delete current database (careful!)`),
        NOTE('info', 'MongoDB creates things lazily: `use school` alone shows nothing until you insert the first document. Empty databases do not physically exist yet.')
      ),
      S('collections', 'Collections & their commands',
        C('js', 'shell-collections.js', `show collections                       // list collections in current db
db.createCollection("students")        // explicit creation
db.students.insertOne({ name: "Ali" }) // implicit creation too!
db.students.drop()                     // remove the whole collection`),
        P('Most of the time you skip `createCollection` — the first insert creates the collection automatically.')
      ),
      S('namespaces', 'Namespaces',
        P('The full name of a collection is `database.collection` — e.g. `school.students`. Tools and connection strings often reference this combined form.'),
        NOTE('warn', '`drop()` and `dropDatabase()` are instant and unrecoverable. Double-check `db` before dropping.')
      ),
    ]),

  T('documents-bson', 'Documents, BSON & ObjectId', 'Fundamentals', 'Beginner', 9,
    'Inside the document model: JSON-like fields, BSON binary storage, type richness and the anatomy of _id.',

    [
      S('anatomy', 'Document anatomy',
        C('js', 'document-anatomy.js', `{
    _id: ObjectId("66c9f0f1e4b0a1f3c8d9e2b7"),  // auto unique id
    name: "Ali",                    // string field
    age: 22,                        // number field
    isVerified: true,               // boolean
    enrolledAt: ISODate("2026-08-24T10:00:00Z"),  // date
    skills: ["HTML", "CSS"],        // array field
    address: { city: "Timergara" }  // embedded sub-document
}`)
      ),
      S('bson', 'Why BSON?',
        P('On disk MongoDB stores BSON (**Binary JSON**): JSON’s shape plus extra types real apps need — proper dates, 32/64-bit ints, decimals, binary blobs. You write JSON-ish syntax; the server stores efficient binary.'),
        TB(['BSON type', 'JS example'],
          [
            ['String / Boolean', "'ali' / true"],
            ['Int32 / Int64 / Double', '22 / NumberLong(5) / 19.99'],
            ['Date', 'ISODate("2026-08-24")'],
            ['ObjectId', 'ObjectId("…") — 12 bytes'],
            ['Array / Embedded doc', '[…] / {…}'],
          ])
      ),
      S('objectid', 'Anatomy of ObjectId',
        DIA(`66c9f0f1 | e4b0a1 | f3c8 | d9e2b7
timestamp  machine  proc   random
(4 bytes   (5 B)    (3 B)  counter part
 = created time)
→ _id encodes creation time! ObjectId("…").getTimestamp()`),
        P('Every document gets `_id` automatically unless you supply your own. It acts exactly like a primary key.')
      ),
      S('limits', 'Size limit & nesting guidance',
        NOTE('info', 'Documents max out at **16 MB**. That sounds tiny but fits ~thousands of pages of text. Design rule: if a document might grow unboundedly (chat messages!), keep that growing list in its own collection.'),
      ),
    ]),

  // ── CRUD Operations ────────────────────────────────────────────────────────
  T('insert-documents', 'Insert Documents', 'CRUD Operations', 'Beginner', 7,
    'Create data with insertOne and insertMany, understand returned ids and ordered inserts.',

    [
      S('insert-one', 'insertOne',
        C('js', 'insert-one.js', `// Insert a single student document
db.students.insertOne({
    name: "Ali",
    age: 22,
    course: "Web Development"
})`),
        LINES([
          { c: 'db.students', d: 'Current database + collection name (created automatically).' },
          { c: 'insertOne({ … })', d: 'Adds exactly one document.' },
          { c: '→ acknowledged: true', d: 'Response includes the generated insertedId.' },
        ])
      ),
      S('insert-many', 'insertMany',
        C('js', 'insert-many.js', `db.students.insertMany([
    { name: "Sara",  age: 27, course: "Data Science" },
    { name: "Ahmad", age: 19, course: "Web Development" },
    { name: "Zara",  age: 25, course: "Design" }
])`),
        P('Returns an array of all generated ids. Pass `{ ordered: false }` to continue inserting after an error instead of stopping at the first failure.')
      ),
      S('mistake-tip', 'Common mistake & quick tip',
        NOTE('warn', '`insertOne({ name }, { age })` throws — both helpers take ONE argument containing the document(s).'),
        NOTE('tip', 'You can force custom ids: `{ _id: "ali-01", name: "Ali" }` — handy for imports and idempotent seeding.')
      ),
    ],
    { q: 'Insert one document into db.users with name "Hina".',
      accept: ["db.users.insertone({name:'hina'})", "db.users.insertone({name:\"hina\"})"],
      hint: 'Method takes an object literal.',
      solution: 'db.users.insertOne({\n  name: "Hina"\n})' }),

  T('find-documents', 'Find Documents', 'CRUD Operations', 'Beginner', 8,
    'Read data with find() and findOne(), filter by any field, and format output.',

    [
      S('find-basics', 'find() basics',
        C('js', 'find.js', `db.users.find()                     // ALL documents
db.users.find({ status: "active" }) // filter by equality
db.users.findOne({ email: "ali@example.com" }) // first match only`),
        P('The object passed to find is the **query filter** — plain `field: value` pairs mean “equals”.')
      ),
      S('pretty-count', 'Reading results',
        C('js', 'helpers.js', `db.users.find().pretty()      // formatted output (legacy shell)
db.users.find().count()       // how many match?
db.users.find().limit(5)      // just the first 5`),
        NOTE('tip', 'Chaining is lazy: nothing executes until you iterate or call a terminal like count()/toArray() in drivers.')
      ),
      S('dot-notation', 'Querying nested fields',
        C('js', 'nested.js', `// Match a field INSIDE an embedded document using dot notation
db.users.find({ "address.city": "Timergara" })`),
        NOTE('warn', 'Put quotes around `"address.city"` — otherwise JavaScript parses the dot as an operator.'),
      ),
    ],
    { q: 'Find all users whose status equals active.',
      accept: ['db.users.find({status:"active"})', "db.users.find({status:'active'})"],
      hint: 'Pass the filter object to find().',
      solution: 'db.users.find({\n  status: "active"\n})' }),

  T('query-filters', 'Query Operators ($eq…$regex)', 'CRUD Operations', 'Intermediate', 11,
    'Master comparison, membership and existence operators: $gt, $in, $exists and friends.',

    [
      S('comparison', 'Comparison operators',
        TB(['Operator', 'Meaning'],
          [['$eq', 'equals (default when omitted)'],
           ['$ne', 'not equal'],
           ['$gt', 'greater than'],
           ['$gte', 'greater than or equal'],
           ['$lt', 'less than'],
           ['$lte', 'less than or equal']]),
        C('js', 'comparison.js', `// Users aged 18 or older
db.users.find({
    age: {
        $gte: 18
    }
})`)
      ),
      S('line-by-line', 'Line-by-line explanation',
        LINES([
          { c: 'db.users', d: 'The collection being queried.' },
          { c: '.find({ … })', d: 'Filter object decides which documents return.' },
          { c: 'age:', d: 'Field to test.' },
          { c: '{ $gte: 18 }', d: 'Condition object: “value ≥ 18”. Plain value would mean exact $eq.' },
        ]),
        C('js', 'combined.js', `// Range: between 18 and 30
db.users.find({
    age: { $gte: 18, $lte: 30 }
})`)
      ),
      S('membership-existence', '$in, $nin, $exists, $regex',
        C('js', 'membership.js', `// Status must be one of these values
db.users.find({ status: { $in: ["active", "pending"] } })

// Exclude several values
db.users.find({ role: { $nin: ["bot", "test"] } })

// Only documents that actually have a phone field
db.users.find({ phone: { $exists: true } })

// Names starting with A (case-insensitive i flag)
db.users.find({ name: { $regex: /^A/, $options: "i" } })`),
        NOTE('warn', 'Anchor regexes (`/^A/`) let indexes work; unanchored `/A/` scans every document.'),
        NOTE('tip', '$eq/$ne/$gt… also compare Dates and ObjectIds — great for “created this week” queries: `{ createdAt: { $gte: new Date("2026-08-01") } }`.')
      ),
    ],
    { q: 'Find all users older than 18.',
      accept: ['db.users.find({age:{$gt:18}})'],
      hint: 'age: { $gt: 18 }',
      solution: 'db.users.find({\n  age: {\n    $gt: 18\n  }\n})' }),

  T('logical-operators', 'Logical Operators ($and, $or, $not)', 'CRUD Operations', 'Intermediate', 8,
    'Combine conditions explicitly with $and/$or/$nor and know when MongoDB implies AND for you.',

    [
      S('implicit-and', 'Implicit AND (free of charge)',
        C('js', 'implicit-and.js', `// Multiple fields in one filter = AND
db.users.find({
    country: "Pakistan",
    age: { $gte: 18 }
})`)
      ),
      S('explicit-or', '$or and friends',
        C('js', 'or.js', `// Either condition matches
db.users.find({
    $or: [
        { status: "admin" },
        { status: "moderator" }
    ]
})

// NOT greater than 18 → includes missing age!
db.users.find({ age: { $not: { $gt: 18 } } })

// $nor: neither admin nor banned
db.users.find({ $nor: [{ role: "admin" }, { banned: true }] })`),
        P('$or takes an **array** of complete filter documents; each element uses full query syntax.')
      ),
      S('combining', 'Mixing them',
        C('js', 'combined.js', `-- Pakistanis who are adults OR admins
db.users.find({
    country: "Pakistan",
    $or: [ { age: { $gte: 18 } }, { role: "admin" } ]
})`),
        NOTE('tip', 'Prefer implicit AND for readability; reach for $and only when the SAME field needs multiple complex conditions.')
      ),
    ],
    { q: 'Find users aged under 18 OR over 65.',
      accept: ['db.users.find({$or:[{age:{$lt:18}},{age:{$gt:65}}]})'],
      hint: '$or takes an array of two filters.',
      solution: 'db.users.find({\n  $or: [\n    { age: { $lt: 18 } },\n    { age: { $gt: 65 } }\n  ]\n})' }),

  T('projection-sorting', 'Projection, Sort, Limit & Skip', 'CRUD Operations', 'Beginner', 8,
    'Shape exactly which fields return and control order and paging of results.',

    [
      S('projection', 'Projection — choosing fields',
        C('js', 'projection.js', `// Include name and email only (_id tags along by default)
db.users.find({}, { name: 1, email: 1 })

// Exclude sensitive fields instead
db.users.find({}, { passwordHash: 0, recoveryCodes: 0 })

// Silence _id too
db.users.find({}, { name: 1, _id: 0 })`),
        NOTE('warn', 'You may use inclusion (1s) OR exclusion (0s) — not both — except `_id`, which is always excludable.')
      ),
      S('sort-limit-skip', 'sort, limit & skip',
        C('js', 'sorting.js', `// Newest first
db.posts.find().sort({ createdAt: -1 })

// Page 3 with size 10
db.products.find()
    .sort({ price: 1 })   // 1 ascending, -1 descending
    .skip(20)
    .limit(10)`),
        P('Sort runs before skip/limit; chaining order in code does not matter but conceptually: sort → skip → limit.')
      ),
      S('mistake-tip', 'Common mistake & quick tip',
        NOTE('tip', 'Big skips get slow on deep pages (`skip(100000)`). For infinite feeds prefer range-based paging: remember last seen `_id`, then `{ _id: { $gt: lastId } }`.'),
      ),
    ],
    { q: 'Return only name and email fields from all users (exclude _id).',
      accept: ['db.users.find({},{name:1,email:1,_id:0})'],
      hint: 'Second argument of find() is the projection.',
      solution: 'db.users.find(\n  {},\n  { name: 1, email: 1, _id: 0 }\n)' }),

  T('update-documents', 'Update Documents', 'CRUD Operations', 'Beginner', 9,
    'Modify data safely with updateOne/updateMany, master $set, and understand upserts.',

    [
      S('update-one', 'updateOne + $set',
        C('js', 'update-one.js', `db.users.updateOne(
    { _id: userId },              // WHICH document(s)
    { $set: { name: "Ahmad" } }   // WHAT to change
)`),
        LINES([
          { c: '{ _id: userId }', d: 'Filter — targets exactly one document.' },
          { c: '{ $set: … }', d: 'Update operator: set/change these fields, leave others intact.' },
          { c: '→ result', d: 'matchedCount / modifiedCount tell you what happened.' },
        ]),
        C('js', 'update-many.js', `// Change EVERY matching document
db.users.updateMany(
    { status: "pending" },
    { $set: { status: "active" } }
)`)
      ),
      S('replace-upsert', 'replaceOne & upsert',
        C('js', 'replace-upsert.js', `// replaceOne swaps the WHOLE document (keep _id)
db.users.replaceOne({ _id: userId }, { name: "New Person" })

// Upsert: update if found, INSERT if not
db.counters.updateOne(
    { key: "visits" },
    { $inc: { total: 1 } },
    { upsert: true }
)`),
        NOTE('warn', 'Plain values in the second argument REPLACE the document (`{ name: "X" }` leaves only name!). To change fields you almost always want `$set`.'),
        NOTE('tip', 'updateOne touches the FIRST match only; updateMany hits all. Choosing wrong silently edits less/more than intended.')
      ),
    ],
    { q: 'Set city to "Peshawar" for the user with _id equal to 5 (use updateOne and $set).',
      accept: ['db.users.updateone({_id:5},{$set:{city:"peshawar"}})'],
      hint: 'updateOne(filter, { $set: { … } })',
      solution: 'db.users.updateOne(\n  { _id: 5 },\n  { $set: { city: "Peshawar" } }\n)' }),

  T('delete-documents', 'Delete Documents', 'CRUD Operations', 'Beginner', 6,
    'Remove precisely with deleteOne/deleteMany and know the nuclear options.',

    [
      S('delete-basics', 'deleteOne & deleteMany',
        C('js', 'delete.js', `db.users.deleteOne({ _id: userId })

// Remove every guest account
db.users.deleteMany({ status: "guest" })`),
        NOTE('warn', 'No WHERE-clause safety net here: an empty filter `{}` deletes EVERYTHING in the collection. Always double-check the filter before running deletes.')
      ),
      S('vs-drop', 'deleteMany({}) vs drop()',
        TB(['Goal', 'Command'],
          [
            ['Remove some documents', 'deleteMany(filter)'],
            ['Empty collection, keep indexes', 'db.coll.deleteMany({})'],
            ['Remove collection entirely', 'db.coll.drop()'],
          ]),
        NOTE('tip', 'Soft-delete pattern: `$set: { deletedAt: new Date() }` instead of physical deletion — lets you restore and audit.'),
      ),
    ],
    { q: 'Delete the user document whose _id is 42.',
      accept: ['db.users.deleteone({_id:42})'],
      hint: 'deleteOne takes a filter object.',
      solution: 'db.users.deleteOne({\n  _id: 42\n})' }),
]

export default null
