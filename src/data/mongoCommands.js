// ── DBMastery · MongoDB Cheatsheet ────────────────────────────────────────────
export const mongoCheatCategories = [
  {
    name: 'Database',
    blurb: 'mongosh navigation at the database level.',
    commands: [
      { cmd: 'show dbs', diff: 'Beginner', syntax: 'show dbs', desc: 'List all databases on the server.', example: 'show dbs' },
      { cmd: 'use', diff: 'Beginner', syntax: 'use db_name', desc: 'Switch to (or lazily create) a database.', example: 'use school' },
      { cmd: 'db', diff: 'Beginner', syntax: 'db', desc: 'Print the currently selected database.', example: 'db' },
      { cmd: 'dropDatabase()', diff: 'Intermediate', danger: true, syntax: 'db.dropDatabase()', desc: 'Deletes the current database entirely.', example: 'use temp\ndb.dropDatabase()' },
    ],
  },
  {
    name: 'Collections',
    blurb: 'Create, list and remove collections.',
    commands: [
      { cmd: 'show collections', diff: 'Beginner', syntax: 'show collections', desc: 'List collections in the current database.', example: 'show collections' },
      { cmd: 'createCollection', diff: 'Beginner', syntax: 'db.createCollection(name)', desc: 'Explicitly create a collection (optional).', example: 'db.createCollection("students")' },
      { cmd: 'drop()', diff: 'Intermediate', danger: true, syntax: 'db.coll.drop()', desc: 'Remove the whole collection and its indexes.', example: 'db.students.drop()' },
    ],
  },
  {
    name: 'Insert',
    blurb: 'Create documents.',
    commands: [
      { cmd: 'insertOne', diff: 'Beginner', syntax: 'db.coll.insertOne(doc)', desc: 'Add a single document; returns its _id.', example: 'db.users.insertOne({\n  name: "Ali",\n  age: 22\n})' },
      { cmd: 'insertMany', diff: 'Beginner', syntax: 'db.coll.insertMany([docs])', desc: 'Insert an array of documents in one call.', example: 'db.users.insertMany([\n  { name: "Sara", age: 27 },\n  { name: "Ahmad", age: 19 }\n])' },
    ],
  },
  {
    name: 'Find',
    blurb: 'Read and filter documents.',
    commands: [
      { cmd: 'find()', diff: 'Beginner', syntax: 'db.coll.find(filter)', desc: 'Return matching documents ({} = all).', example: 'db.users.find({ status: "active" })' },
      { cmd: 'findOne()', diff: 'Beginner', syntax: 'db.coll.findOne(filter)', desc: 'First matching document only.', example: 'db.users.findOne({ email: "ali@example.com" })' },
      { cmd: 'count / countDocuments', diff: 'Beginner', syntax: 'db.coll.countDocuments(filter)', desc: 'Number of matching documents.', example: 'db.users.countDocuments({ age: { $gte: 18 } })' },
      { cmd: '$gt · $gte', diff: 'Beginner', syntax: '{ field: { $gt: v } }', desc: 'Greater than / greater-or-equal comparisons.', example: 'db.users.find({ age: { $gte: 18 } })' },
      { cmd: '$lt · $lte', diff: 'Beginner', syntax: '{ field: { $lt: v } }', desc: 'Less than / less-or-equal comparisons.', example: 'db.products.find({ price: { $lt: 500 } })' },
      { cmd: '$ne', diff: 'Beginner', syntax: '{ field: { $ne: v } }', desc: 'Field not equal to value.', example: 'db.users.find({ status: { $ne: "banned" } })' },
      { cmd: '$in · $nin', diff: 'Intermediate', syntax: '{ field: { $in: [...] } }', desc: 'Match any of a set — or exclude them.', example: 'db.users.find({ country: { $in: ["PK","TR"] } })' },
      { cmd: '$and · $or', diff: 'Intermediate', syntax: '{ $or: [cond1, cond2] }', desc: 'Combine conditions logically.', example: 'db.users.find({\n  $or: [\n    { age: { $lt: 18 } },\n    { role: "admin" }\n  ]\n})' },
      { cmd: '$exists', diff: 'Intermediate', syntax: '{ field: { $exists: true } }', desc: 'Require a field to be present (or absent).', example: 'db.users.find({ phone: { $exists: true } })' },
      { cmd: '$regex', diff: 'Advanced', syntax: '{ field: { $regex: /^A/ } }', desc: 'Pattern match; anchor patterns to use indexes.', example: 'db.users.find({ name: { $regex: /^A/ } })' },
    ],
  },
  {
    name: 'Projection & Sorting',
    blurb: 'Shape, order and page results.',
    commands: [
      { cmd: 'projection', diff: 'Beginner', syntax: 'find({}, { f1:1, f2:0 })', desc: 'Choose returned fields (1 include / 0 exclude).', example: 'db.users.find({}, { name: 1, email: 1, _id: 0 })' },
      { cmd: 'sort()', diff: 'Beginner', syntax: '.sort({ field: ±1 })', desc: 'Order results ascending (1) or descending (-1).', example: 'db.posts.find().sort({ createdAt: -1 })' },
      { cmd: 'limit()', diff: 'Beginner', syntax: '.limit(n)', desc: 'Cap number of returned documents.', example: 'db.posts.find().sort({_id:-1}).limit(10)' },
      { cmd: 'skip()', diff: 'Beginner', syntax: '.skip(n)', desc: 'Skip n docs first — pair with limit to paginate.', example: 'db.products.find().sort({price:1}).skip(20).limit(10)' },
    ],
  },
  {
    name: 'Update',
    blurb: 'Modify existing documents.',
    commands: [
      { cmd: 'updateOne', diff: 'Beginner', syntax: 'updateOne(filter, update)', desc: 'Change first matching document.', example: 'db.users.updateOne(\n  { _id: userId },\n  { $set: { name: "Ahmad" } }\n)' },
      { cmd: 'updateMany', diff: 'Beginner', syntax: 'updateMany(filter, update)', desc: 'Change every matching document.', example: 'db.users.updateMany(\n  { status: "pending" },\n  { $set: { status: "active" } }\n)' },
      { cmd: '$set / $unset', diff: 'Beginner', syntax: '{ $set: { f: v } }', desc: 'Create/change fields or remove them.', example: 'db.users.updateOne({_id:u},{\n  $set: { city: "Peshawar" },\n  $unset: { tempToken: "" }\n})' },
      { cmd: '$inc', diff: 'Intermediate', syntax: '{ $inc: { counter: n } }', desc: 'Atomic numeric increment/decrement.', example: 'db.videos.updateOne({_id:v},{$inc:{views:1}})' },
      { cmd: 'upsert', diff: 'Intermediate', syntax: 'updateOne(f, u, { upsert: true })', desc: 'Insert if no document matches the filter.', example: 'db.counters.updateOne(\n  { key: "visits" },\n  { $inc: { total: 1 } },\n  { upsert: true }\n)' },
    ],
  },
  {
    name: 'Delete',
    blurb: 'Remove documents.',
    commands: [
      { cmd: 'deleteOne', diff: 'Beginner', danger: true, syntax: 'deleteOne(filter)', desc: 'Remove first matching document.', example: 'db.users.deleteOne({ _id: userId })' },
      { cmd: 'deleteMany', diff: 'Beginner', danger: true, syntax: 'deleteMany(filter)', desc: 'Remove all matching documents — {} empties everything!', example: 'db.users.deleteMany({ status: "guest" })' },
    ],
  },
  {
    name: 'Arrays',
    blurb: 'Query and mutate array fields.',
    commands: [
      { cmd: '$push', diff: 'Beginner', syntax: '{ $push: { arr: v } }', desc: 'Append a value to an array field.', example: 'db.users.updateOne(\n  { _id: u },\n  { $push: { skills: "MongoDB" } }\n)' },
      { cmd: '$pull', diff: 'Intermediate', syntax: '{ $pull: { arr: cond } }', desc: 'Remove all matching elements from an array.', example: 'db.users.updateOne(\n  { _id: u },\n  { $pull: { skills: "jQuery" } }\n)' },
      { cmd: '$addToSet', diff: 'Intermediate', syntax: '{ $addToSet: { arr: v } }', desc: 'Append only if not already present (unique).', example: 'db.tags.updateOne(\n  {_id:t},\n  { $addToSet: { followers: userId } }\n)' },
      { cmd: '$all', diff: 'Intermediate', syntax: '{ arr: { $all: [...] } }', desc: 'Array must contain every listed element.', example: 'db.users.find({ skills: { $all: ["React","Node.js"] } })' },
      { cmd: '$size', diff: 'Beginner', syntax: '{ arr: { $size: n } }', desc: 'Exact array length match.', example: 'db.users.find({ skills: { $size: 3 } })' },
      { cmd: '$elemMatch', diff: 'Advanced', syntax: '{ arr: { $elemMatch: {...} } }', desc: 'One element satisfies multiple conditions.', example: 'db.students.find({\n  grades: {\n    $elemMatch: { course:"SQL", score:{ $gte:80 } }\n  }\n})' },
    ],
  },
  {
    name: 'Aggregation',
    blurb: 'Multi-stage data processing.',
    commands: [
      { cmd: 'aggregate()', diff: 'Intermediate', syntax: 'db.coll.aggregate([stages])', desc: 'Run documents through ordered transformation stages.', example: 'db.orders.aggregate([\n  { $match: { status: "completed" } },\n  { $group: { _id: "$userId", total: { $sum: "$amount" } } }\n])' },
      { cmd: '$match', diff: 'Beginner', syntax: '{ $match: { … } }', desc: 'Filter stage (same syntax as find filters).', example: '{ $match: { status: "completed" } }' },
      { cmd: '$group', diff: 'Intermediate', syntax: '{ $group: { _id: key, agg… } }', desc: 'Bucket by key with accumulators like $sum/$avg.', example: '{ $group: { _id: "$userId", total: { $sum: "$amount" } } }' },
      { cmd: '$project', diff: 'Intermediate', syntax: '{ $project: { f:1 } }', desc: 'Reshape output fields, add computed values.', example: '{ $project: { name: 1, _id: 0 } }' },
      { cmd: '$sort / $limit', diff: 'Beginner', syntax: '{ $sort: { f: ±1 } }, { $limit: n }', desc: 'Order then cap pipeline output.', example: '{ $sort: { total: -1 } }, { $limit: 5 }' },
      { cmd: '$unwind', diff: 'Advanced', syntax: '{ $unwind: "$arr" }', desc: 'Output one doc per array element.', example: 'db.products.aggregate([\n  { $unwind: "$tags" },\n  { $group: { _id: "$tags", n: { $sum: 1 } } }\n])' },
      { cmd: '$lookup', diff: 'Advanced', syntax: '{ $lookup: { from, localField, foreignField, as } }', desc: 'Left outer join with another collection.', example: 'db.orders.aggregate([\n  { $lookup: {\n      from: "users",\n      localField: "userId",\n      foreignField: "_id",\n      as: "user"\n  } }\n])' },
      { cmd: '$count', diff: 'Beginner', syntax: '{ $count: "name" }', desc: 'Stage returning one doc with the total count.', example: 'db.orders.aggregate([{ $count: "total" }])' },
    ],
  },
  {
    name: 'Indexes',
    blurb: 'Performance essentials.',
    commands: [
      { cmd: 'createIndex', diff: 'Intermediate', syntax: 'db.coll.createIndex({ f: 1 })', desc: 'Build an index for faster queries/sorts.', example: 'db.users.createIndex({ email: 1 })' },
      { cmd: 'compound index', diff: 'Advanced', syntax: 'createIndex({ a: 1, b: -1 })', desc: 'Multi-field index; equality fields go first.', example: 'db.orders.createIndex({ user_id: 1, createdAt: -1 })' },
      { cmd: 'unique index', diff: 'Intermediate', syntax: 'createIndex({...}, { unique: true })', desc: 'Index that rejects duplicate values.', example: 'db.users.createIndex({ username: 1 }, { unique: true })' },
      { cmd: 'text index', diff: 'Advanced', syntax: 'createIndex({ f: "text" })', desc: 'Enable $text word search over string fields.', example: 'db.articles.createIndex({ title: "text", body: "text" })' },
      { cmd: 'getIndexes / dropIndex', diff: 'Intermediate', syntax: 'getIndexes() · dropIndex(name)', desc: 'Inspect or remove indexes.', example: 'db.users.getIndexes()\ndb.users.dropIndex("email_1")' },
    ],
  },
  {
    name: 'Transactions',
    blurb: 'All-or-nothing multi-document writes.',
    commands: [
      { cmd: 'session transaction', diff: 'Advanced', syntax: 'startSession → startTransaction → commit/abort', desc: 'Group operations atomically across documents/collections.', example: 'const s = client.startSession()\ns.startTransaction()\ntry {\n  await a.updateOne(f1, u1, { session: s })\n  await b.updateOne(f2, u2, { session: s })\n  await s.commitTransaction()\n} catch (e) {\n  await s.abortTransaction()\n}' },
    ],
  },
]
