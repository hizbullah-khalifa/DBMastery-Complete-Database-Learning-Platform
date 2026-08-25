import DocsOverview from './DocsOverview.jsx'
import { mongoTopics } from '../data/index.js'
import { MONGO_CATEGORIES } from '../data/mongoTopics.js'
import useMeta from '../utils/meta.js'

export default function MongoDocs() {
  useMeta('MongoDB Documentation', 'Complete MongoDB course: documents, collections, CRUD, operators, aggregation, indexes, transactions, Atlas and Mongoose.')
  return <DocsOverview stack="mongo" topics={mongoTopics} categories={MONGO_CATEGORIES} />
}
