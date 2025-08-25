export interface Post {
  id: string
  user_id: string
  user: {
    id: string
    name: string
    avatar_url?: string | null
    badges?: Badge[]
  }
  content: string
  book_title?: string
  book_link?: string
  image_url?: string
  post_type: 'excerpt' | 'review' | 'audio' | 'illustration'
  audio_url?: string
  tags: string[]
  created_at: string
  updated_at: string
  likes_count: number
  comments_count: number
  is_liked: boolean
  comments?: Comment[]
}

export interface Comment {
  id: string
  user_id: string
  post_id: string
  user: {
    id: string
    name: string
    avatar_url?: string
    badges?: Badge[]
  }
  content: string
  created_at: string
  updated_at: string
  likes_count: number
  is_liked: boolean
}

export interface UserProfile {
  id: string
  name: string
  bio: string
  avatar_url?: string
  created_at: string
  followers_count: number
  following_count: number
  posts_count: number
  is_following?: boolean
  badges: Badge[]
  reading_streak: number
  total_likes_received: number
}

export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  color: string
  earned_at: string
  category: 'engagement' | 'consistency' | 'quality' | 'community'
}

export interface Notification {
  id: string
  user_id: string
  type: 'like' | 'comment' | 'follow' | 'post' | 'badge'
  title: string
  message: string
  data: any
  read: boolean
  created_at: string
}

export interface BookInfo {
  title: string
  authors: string[]
  description: string
  imageUrl: string
  publisher: string
  publishedDate: string
  averageRating?: number
  ratingsCount?: number
  pageCount?: number
  categories: string[]
  isMock?: boolean
  source?: string
}

export interface Tag {
  id: string
  name: string
  color: string
  count: number
}

export const POST_TYPES = {
  excerpt: {
    label: 'Trecho',
    icon: 'BookOpen',
    description: 'Compartilhe um trecho marcante'
  },
  review: {
    label: 'Resenha',
    icon: 'Star',
    description: 'Escreva uma resenha curta'
  },
  audio: {
    label: 'Áudio',
    icon: 'Mic',
    description: 'Grave uma leitura ou comentário'
  },
  illustration: {
    label: 'Ilustração',
    icon: 'Image',
    description: 'Compartilhe uma ilustração ou arte'
  }
} as const

export const POPULAR_TAGS = [
  { name: 'ficção', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' },
  { name: 'poesia', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' },
  { name: 'história', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
  { name: 'romance', color: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200' },
  { name: 'fantasia', color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200' },
  { name: 'biografia', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' },
  { name: 'filosofia', color: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200' },
  { name: 'ciência', color: 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200' },
  { name: 'autoajuda', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' },
  { name: 'clássico', color: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200' }
]

export interface Challenge {
  id: string
  title: string
  description: string
  type: 'reading' | 'posting' | 'engagement'
  target: number
  current_progress: number
  start_date: string
  end_date: string
  reward_badge?: Badge
  participants_count: number
  is_participating: boolean
  created_by: string
  tags: string[]
}

export interface BookClub {
  id: string
  name: string
  description: string
  cover_image?: string
  current_book?: {
    title: string
    author: string
    cover_url: string
  }
  members_count: number
  is_member: boolean
  is_private: boolean
  created_by: string
  created_at: string
  next_meeting?: string
  reading_schedule?: {
    week: number
    chapters: string
    discussion_date: string
  }[]
}

export interface Quiz {
  id: string
  title: string
  description: string
  questions: QuizQuestion[]
  difficulty: 'easy' | 'medium' | 'hard'
  category: string
  created_by: string
  created_at: string
  attempts_count: number
  average_score: number
  user_best_score?: number
}

export interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correct_answer: number
  explanation?: string
}

export interface Event {
  id: string
  title: string
  description: string
  type: 'book_launch' | 'author_talk' | 'reading_session' | 'workshop'
  date: string
  duration: number // em minutos
  host: {
    id: string
    name: string
    avatar_url?: string
    bio?: string
  }
  cover_image?: string
  is_free: boolean
  price?: number
  max_participants?: number
  current_participants: number
  is_registered: boolean
  meeting_link?: string
  tags: string[]
  created_at: string
}