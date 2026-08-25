import { useParams } from 'react-router-dom'
import DocsLayout from '../components/DocsLayout.jsx'
import { mongoTopics } from '../data/index.js'
import { MONGO_CATEGORIES } from '../data/mongoTopics.js'
import useMeta from '../utils/meta.js'

export default function MongoTopic() {
  const { slug = '' } = useParams()
  const topic = mongoTopics.find((t) => t.slug === slug)
  useMeta(topic ? `MongoDB ${topic.title}` : 'MongoDB Lesson', topic?.desc)
  return <DocsLayout stack="mongo" topics={mongoTopics} categories={MONGO_CATEGORIES} />
}
