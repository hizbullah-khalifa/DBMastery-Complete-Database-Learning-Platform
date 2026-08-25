// ── DBMastery · MongoDB Curriculum (Part 2: Modeling → Production) ────────────
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

export const mongoTopicsB = [
  // ── Data Modeling ──────────────────────────────────────────────────────────
  T('update-operators', 'Update Operators ($set…$rename)', 'Data Modeling', 'Intermediate', 10,
    'The full toolbox for mutating documents: set, unset, inc, push, pull, addToSet, pop and rename.',

    [
      S('field-ops', 'Field operators',
        C('js', 'fields.js', `db.users.updateOne({ _id: u }, {
    $set:   { city: "Peshawar" },     // create/change field
    $unset: { tempToken: "" },        // remove a field
    $inc:   { loginCount: 1 },        // atomic increment (+/-)
    $rename: { mobile: "phone" }      // rename a key
})`),
        TB(['Operator', 'Job'],
          [['$set', 'add or update fields'],
           ['$unset', 'delete a field'],
           ['$inc', 'increase/decrease numbers atomically'],
           ['$rename', 'give a field a new name']])
      ),
      S('array-ops', 'Array operators',
        C('js', 'arrays.js', `db.users.updateOne({ _id: u }, {
    $push:   { skills: "MongoDB" },          // append
    $addToSet:{ skills: "React" },           // append only if absent
    $pull:   { skills: "jQuery" },           // remove all matches
    $pop:    { skills: 1 }                   // remove last (-1 → first)
})`),
        NOTE('tip', '$inc is perfect for counters and views — it never races with concurrent updates because the server applies it atomically.'),
        NOTE('warn', '$set on an array index (`tags.0`) works but is fragile; prefer $push/$pull so intent stays clear.')
      ),
    ],
    { q: 'Increment views by 1 on the post with _id equal to 7.',
      accept: ['db.posts.updateone({_id:7},{$inc:{views:1}})'],
      hint: 'Use $inc in the update document.',
      solution: 'db.posts.updateOne(\n  { _id: 7 },\n  { $inc: { views: 1 } }\n)' }),

  T('arrays', 'Working With Arrays', 'Data Modeling', 'Intermediate', 9,
    'Store lists inside documents and query them: exact match, $all, $size and $elemMatch.',

    [
      S('storing', 'Arrays as first-class citizens',
        C('js', 'skills.js', `{
    name: "Ali",
    skills: ["React", "Node.js", "MongoDB"]
}`),
        C('js', 'querying.js', `// Contains "React" anywhere
db.users.find({ skills: "React" })

// Contains BOTH (any order)
db.users.find({ skills: { $all: ["React", "Node.js"] } })

// Exactly three skills
db.users.find({ skills: { $size: 3 } })`)
      ),
      S('elemmatch', '$elemMatch — objects inside arrays',
        C('js', 'objects-in-array.js', `{
    name: "Ali",
    grades: [ { course: "SQL", score: 88 },
              { course: "MongoDB", score: 74 } ]
}

// An element that satisfies BOTH conditions together
db.students.find({
    grades: {
        $elemMatch: { course: "SQL", score: { $gte: 80 } }
    }
})`),
        NOTE('info', 'Without $elemMatch, `{ "grades.course": "SQL", "grades.score": 88 }` could match conditions satisfied by *different* array elements.'),
        NOTE('tip', 'Update matching elements positionally: `db.coll.updateOne({ tags: "old" }, { $set: { "tags.$": "new" } })`.'),
      ),
    ]),

  T('embedded-documents', 'Embedded Documents', 'Data Modeling', 'Intermediate', 9,
    'Nest related data inside one document — when embedding beats referencing.',

    [
      S('embedding', 'One document = one whole entity',
        C('js', 'embed.js', `{
    name: "Ali",
    address: {
        city: "Timergara",
        country: "Pakistan"
    }
}`),
        P('Address has no life outside Ali — it is queried, displayed and updated *with* him. That co-dependency is exactly what embedding models best.'),
        C('js', 'query-nested.js', `db.users.find({ "address.city": "Timergara" })`)
      ),
      S('when-to-embed', 'Embed or reference?',
        TB(['Situation', 'Choice'],
          [
            ['Child data belongs only to parent (address, settings)', '**Embed**'],
            ['Reads always fetch both parts together', '**Embed**'],
            ['Child accessed standalone / huge / unbounded', '**Reference**'],
            ['Many-to-many relationships', '**Reference**'],
            ['Needs to be joined/queried independently often', '**Reference**'],
          ]),
        NOTE('tip', 'Rule of thumb: **“what gets queried together gets stored together.”** Start embedded; split out when a piece grows unbounded or needs its own lifecycle.'),
      ),
      S('limits', 'Watch the boundaries',
        NOTE('warn', 'Unbounded arrays (comments, likes) will eventually hit the 16 MB limit and slow every update. Move them to their own collection once “many” becomes possible.'),
      ),
    ]),

  T('references', 'References & Relationships', 'Data Modeling', 'Advanced', 10,
    'Connect documents manually with ObjectId references — the MongoDB way of doing JOINs.',

    [
      S('manual-ref', 'Manual references',
        C('js', 'reference.js', `// posts collection
{
    _id: ObjectId("66c9f0f1aaaa"),
    title: "My first post",
    authorId: ObjectId("66c8e0d1bbbb")   // ← points at users._id
}

// Two-step read: fetch post, then author
const post = db.posts.findOne({})
const author = db.users.findOne({ _id: post.authorId })`),
        P('Unlike SQL there is no enforced foreign key — your application owns referential integrity.')
      ),
      S('lookup-teaser', 'Server-side joins with $lookup',
        C('js', 'lookup.js', `db.orders.aggregate([
    {
        $lookup: {
            from: "users",              // foreign collection
            localField: "userId",
            foreignField: "_id",
            as: "user"
        }
    }
])`),
        P('Each matched user lands in the `user` array field. Full details live in the Aggregation lessons.')
      ),
      S('choosing-patterns', 'Choosing between embed vs reference',
        OL(
          'Default: **embed** small, exclusive, bounded data.',
          'Reference when data outgrows the parent or is shared.',
          'Hybrid: embed summaries + reference details (recent 5 reviews embedded, full history separate).'
        ),
        NOTE('tip', 'Keep referenced ids next to a denormalized display field (authorName) to skip lookups for list pages — sync it on change.')
      ),
    ]),

  // ── Aggregation ────────────────────────────────────────────────────────────
  T('aggregation-pipeline', 'Aggregation Pipeline', 'Aggregation', 'Intermediate', 12,
    'Think of aggregation as an assembly line: documents flow through stages, each transforming them further.',

    [
      S('concept', 'The pipeline mental model',
        DIA(`documents ─▶ $match ─▶ $group ─▶ $sort ─▶ results
             (filter)  (bucket)  (order)`),
        P('Each stage receives the previous stage’s output. Order matters enormously: filtering early shrinks work for every later stage.')
      ),
      S('full-example', 'A complete pipeline, line by line',
        C('js', 'pipeline.js', `db.orders.aggregate([
    {
        $match: {
            status: "completed"
        }
    },
    {
        $group: {
            _id: "$userId",
            total: {
                $sum: "$amount"
            }
        }
    }
])`),
        LINES([
          { c: '.aggregate([ … ])', d: 'Takes an ARRAY of stages executed in order.' },
          { c: '{ $match … }', d: 'Stage 1 keeps only completed orders (same syntax as find).' },
          { c: '{ $group … }', d: 'Stage 2 buckets remaining docs by userId.' },
          { c: '_id: "$userId"', d: 'Grouping key — "$" means “the value OF this field”.' },
          { c: 'total: { $sum: "$amount" }', d: 'Per-bucket accumulator summing amounts.' },
        ])
      ),
      S('stage-order', 'Why stage order matters',
        C('js', 'order-matters.js', `// GOOD: filter first, then group less data
$match → $group

// WASTEFUL: group everything, filter afterwards
$group → $match`),
        NOTE('tip', 'Most find() features map to stages: sort→$sort, limit→$limit, projection→$project. If you can do it in find(), you usually should — pipelines are for multi-step transformations.')
      ),
    ],
    { q: 'Count documents in orders using aggregation ($count stage named total).',
      accept: ['db.orders.aggregate([{$count:"total"}])'],
      hint: 'aggregate([{ $count: "total" }])',
      solution: 'db.orders.aggregate([\n  { $count: "total" }\n])' }),

  T('aggregation-stages', 'Core Aggregation Stages', 'Aggregation', 'Advanced', 13,
    'Deep-dive the stages you will use weekly: $project, $sort, $limit, $skip, $count, $unwind and $lookup.',

    [
      S('shaping-stages', 'Shaping: $project, $sort, $limit',
        C('js', 'shaping.js', `db.users.aggregate([
    { $project: { name: 1, age: 1, _id: 0 } }, // choose output fields
    { $sort: { age: -1 } },                    // oldest first
    { $limit: 5 }                              // top 5 only
])`)
      ),
      S('unwind', '$unwind — explode arrays',
        C('js', 'unwind.js', `// One output doc PER tag
{ tags: ["a","b"] }  ──$unwind──▶  { tags: "a" }, { tags: "b" }

db.products.aggregate([
    { $unwind: "$tags" },
    { $group: { _id: "$tags", n: { $sum: 1 } } }  // count per tag
])`),
        P('$unwind turns each array element into its own copy of the document — the gateway to per-item analytics.')
      ),
      S('lookup', '$lookup — join collections',
        C('js', 'lookup-full.js', `db.comments.aggregate([
    {
        $lookup: {
            from: "users",           // collection to join
            localField: "userId",    // this doc's field
            foreignField: "_id",     // target's field
            as: "author"             // output array field
        }
    },
    { $unwind: "$author" },          // usually 1 match → unwrap
    { $project: { text: 1, "author.name": 1, _id: 0 } }
])`),
        LINES([
          { c: 'from', d: 'Foreign collection brought into scope.' },
          { c: 'localField/foreignField', d: 'The two sides of the equality join.' },
          { c: 'as: "author"', d: 'Matches arrive as an ARRAY; unwind to object.' },
        ]),
        NOTE('warn', '$lookup cannot use indexes on `from` collections in older versions — check explain() before joining million-doc collections in hot paths.'),
        NOTE('tip', '$skip after $sort gives stable pagination inside pipelines; $count replaces a trailing group+sum combo.')
      ),
    ]),

  T('aggregation-operators', 'Accumulators & Expressions', 'Aggregation', 'Advanced', 10,
    'Inside $group and beyond: $sum, $avg, $min, $max, $push, $first, $last and conditional logic.',

    [
      S('accumulators', 'Group accumulators',
        C('js', 'accumulators.js', `db.sales.aggregate([
    {
        $group: {
            _id: "$region",
            revenue:   { $sum: "$amount" },
            avgTicket: { $avg: "$amount" },
            best:      { $max: "$amount" },
            worst:     { $min: "$amount" },
            buyers:    { $addToSet: "$customerId" }, // unique list
            samples:   { $first: "$productName" }    // first seen
        }
    }
])`),
        TB(['Operator', 'Produces'],
          [['$sum / $avg', 'totals and means'],
           ['$min / $max', 'extremes'],
           ['$push', 'array of ALL values'],
           ['$addToSet', 'array of UNIQUE values'],
           ['$first / $last', 'boundary values per bucket']])
      ),
      S('expressions', 'Computed expressions with $project',
        C('js', 'expressions.js', `db.products.aggregate([
    {
        $project: {
            name: 1,
            margin: { $subtract: ["$price", "$cost"] },
            label: {
                $cond: {
                    if:  { $gte: ["$stock", 10] },
                    then: "in stock",
                    else: "low stock"
                }
            }
        }
    }
])`),
        NOTE('tip', 'String helpers exist too: $concat, $toUpper, $split — enough to format report lines without leaving the database.'),
      ),
    ]),

  // ── Performance & Production ───────────────────────────────────────────────
  T('indexes-mongo', 'Indexes in MongoDB', 'Performance & Production', 'Intermediate', 10,
    'Single-field, compound, unique and text indexes — plus the tradeoffs every developer must know.',

    [
      S('why-index', 'Why indexes matter',
        P('Without an index every query is a COLLECTION SCAN — MongoDB inspects each document. An index builds a sorted structure that jumps directly to matches, turning O(n) into ~O(log n).'),
        C('js', 'create.js', `// Single-field ascending index
db.users.createIndex({ email: 1 })

// Compound: supports queries on email alone OR email+age
db.users.createIndex({ email: 1, age: -1 })

// Unique constraint backed by an index
db.users.createIndex({ username: 1 }, { unique: true })

// Text search across two fields
db.articles.createIndex({ title: "text", body: "text" })`)
      ),
      S('manage-inspect', 'Managing indexes',
        C('js', 'manage.js', `db.users.getIndexes()                       // what exists?
db.users.dropIndex("email_1")               // remove one
db.users.find({...}).explain("executionStats")  // did we use it?`),
        P('In explain output: IXSCAN = index used ✓, COLLSCAN = full scan ✗, and totalDocsExamined vs nReturned shows efficiency.')
      ),
      S('tradeoffs', 'Tradeoffs',
        TB(['Benefit', 'Cost'],
          [
            ['Fast reads & sorts', 'Slower writes (index maintenance)'],
            ['Enforced uniqueness', 'Extra storage/RAM (working set!)'],
            ['Covered queries (no fetch)', 'Too many indexes confuse planner'],
          ]),
        NOTE('tip', 'Index the fields in your WHERE filters, your SORT keys, and nothing speculative. Compound order: equality fields first, range/sort last.'),
      ),
    ]),

  T('transactions-mongo', 'Transactions in MongoDB', 'Performance & Production', 'Advanced', 9,
    'Multi-document ACID transactions with sessions — and why you should still design to avoid them.',

    [
      S('concept', 'What a transaction buys you',
        P('Single-document writes are already atomic. But moving money between TWO accounts spans two documents — a transaction makes both changes succeed or fail together (ACID).'),
        C('js', 'session.js', `// Node.js driver shape
const session = client.startSession()
try {
    session.startTransaction()

    await accounts.updateOne(
        { _id: from }, { $inc: { balance: -500 } }, { session }
    )
    await accounts.updateOne(
        { _id: to }, { $inc: { balance: 500 } }, { session }
    )

    await session.commitTransaction()   // both applied
} catch (err) {
    await session.abortTransaction()    // neither applied
} finally {
    session.endSession()
}`),
        LINES([
          { c: 'startSession()', d: 'Transactions ride on a client session.' },
          { c: 'startTransaction()', d: 'Opens the all-or-nothing boundary.' },
          { c: '{ session }', d: 'Every participating operation must join.' },
          { c: 'commit / abort', d: 'Publish or discard everything at once.' },
        ])
      ),
      S('requirements-when', 'Requirements & guidance',
        UL(
          'Requires a **replica set** (Atlas gives you one by default); classic single mongod cannot run them.',
          'Keep transactions short — they hold locks and block other writers.'
        ),
        NOTE('tip', 'Model data so related facts live in ONE document — then plain atomic updates replace transactions entirely. Transactions are a safety net, not a default design tool.'),
      ),
    ]),

  T('atlas-setup', 'MongoDB Atlas Setup', 'Performance & Production', 'Beginner', 10,
    'Go from zero to a cloud cluster: account, database user, network access and connecting from Node.js.',

    [
      S('steps', 'Setup in six steps',
        OL(
          'Create a free account at mongodb.com/atlas.',
          'Build a cluster (free M0 tier is plenty for learning).',
          'Database Access → add a **database user** with a strong password.',
          'Network Access → allow your IP (or 0.0.0.0/0 only for quick tests!).',
          'Connect → Drivers → copy the connection string.',
          'Paste it into your app’s environment file.'
        )
      ),
      S('connection-string', 'Reading the connection string',
        DIA(`mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/dbname
└── protocol ──┘└─user─┘└pass┘└──────── host ─────────┘└─db┘`),
        P('The URI carries everything: credentials, cluster host and default database name.'),
        C('env', '.env', `# Never commit this file — keep secrets in .env (gitignored)
MONGODB_URI=your_connection_string`),
        NOTE('warn', 'Credentials in code/screenshots/GitHub leak instantly. Rotate any secret that touched a public repo.'),
        C('js', 'connect.js', `import { MongoClient } from "mongodb"

const client = new MongoClient(process.env.MONGODB_URI)
await client.connect()
const users = client.db("app").collection("users")`),
        NOTE('tip', 'Choose the database name right in the URI (`/dbname`) so client.db() defaults to it.')
      ),
    ]),

  T('mongoose-basics', 'Mongoose Basics', 'Performance & Production', 'Intermediate', 11,
    'Add structure to MongoDB from Node.js: schemas, models, validation and everyday CRUD.',

    [
      S('why-mongoose', 'Why developers use Mongoose',
        P('MongoDB itself is schema-flexible; teams often still want **enforced shapes** in code. Mongoose provides schemas, validation, middleware and typed models on top of the driver.'),
        C('js', 'schema.js', `import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    name:  { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    age:   { type: Number, min: 0, max: 130 },
    skills:[String]
}, { timestamps: true })   // adds createdAt + updatedAt

const User = mongoose.model("User", userSchema)`)
      ),
      S('crud-mongoose', 'CRUD through the model',
        C('js', 'crud.js', `await User.create({ name: "Ali", email: "ali@example.com", age: 22 })

const adults = await User
    .find({ age: { $gte: 18 } })
    .select("name email")
    .sort({ name: 1 })
    .limit(10)

await User.updateOne({ _id }, { $set: { age: 23 } })
await User.deleteOne({ _id })`),
        NOTE('info', 'Queries return thenable objects; calling .exec() yields real promises if you prefer explicit style.'),
        NOTE('tip', '`unique: true` creates the index but does NOT validate duplicates in-app — handle the E11000 duplicate-key error from the server.')
      ),
    ]),
]

export default null
