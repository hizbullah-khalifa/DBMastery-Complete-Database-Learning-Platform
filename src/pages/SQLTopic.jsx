import { useParams } from 'react-router-dom'
import DocsLayout from '../components/DocsLayout.jsx'
import { sqlTopics } from '../data/index.js'
import { SQL_CATEGORIES } from '../data/sqlTopics.js'
import useMeta from '../utils/meta.js'

export default function SQLTopic() {
  const { slug = '' } = useParams()
  const topic = sqlTopics.find((t) => t.slug === slug)
  useMeta(topic ? `SQL ${topic.title}` : 'SQL Lesson', topic?.desc)
  return <DocsLayout stack="sql" topics={sqlTopics} categories={SQL_CATEGORIES} />
}
