import DocsOverview from './DocsOverview.jsx'
import { sqlTopics } from '../data/index.js'
import { SQL_CATEGORIES } from '../data/sqlTopics.js'
import useMeta from '../utils/meta.js'

export default function SQLDocs() {
  useMeta('SQL Documentation', 'Complete SQL course: fundamentals, tables, CRUD, queries, joins, functions and advanced topics with copy-ready examples.')
  return <DocsOverview stack="sql" topics={sqlTopics} categories={SQL_CATEGORIES} />
}
