'use client'

import React, { useEffect, useState } from 'react'
import PostCard from '@/components/posts/PostCard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Search, Shuffle, BookOpen, Filter } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function DescobrirPage() {
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [selectedType, setSelectedType] = useState<string>('all')

  const popularTags = [
    'ficção', 'poesia', 'história', 'romance', 'fantasia', 
    'biografia', 'filosofia', 'ciência', 'autoajuda', 'clássico'
  ]

  const postTypes = [
    { value: 'all', label: 'Todos' },
    { value: 'excerpt', label: 'Trechos' },
    { value: 'review', label: 'Resenhas' },
    { value: 'audio', label: 'Áudios' },
    { value: 'illustration', label: 'Ilustrações' }
  ]

  // Posts mock para descoberta
  const mockDiscoverPosts = [
    {
      id: '4',
      user: {
        id: '4',
        name: 'Carlos Mendes',
        avatar_url: null
      },
      content: 'Não importa o quanto você planeje, às vezes a vida tem outros planos para você.',
      book_title: 'O Código Da Vinci',
      book_link: 'https://www.amazon.com.br/Código-Vinci-Dan-Brown/dp/8575422827',
      image_url: 'https://images.pexels.com/photos/2041540/pexels-photo-2041540.jpeg?auto=compress&cs=tinysrgb&w=800',
      post_type: 'excerpt' as const,
      tags: ['ficção', 'mistério', 'história'],
      created_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
      likes_count: 18,
      comments_count: 4,
      is_liked: false
    },
    {
      id: '5',
      user: {
        id: '5',
        name: 'Lucia Costa',
        avatar_url: null
      },
      content: 'Uma obra-prima da literatura brasileira que nos ensina sobre perseverança e sonhos. Coelho consegue transmitir sabedoria universal através de uma narrativa simples e envolvente.',
      book_title: 'O Alquimista',
      book_link: null,
      image_url: 'https://images.pexels.com/photos/1029149/pexels-photo-1029149.jpeg?auto=compress&cs=tinysrgb&w=800',
      post_type: 'review' as const,
      tags: ['filosofia', 'autoajuda', 'espiritualidade'],
      created_at: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
      likes_count: 31,
      comments_count: 12,
      is_liked: true
    },
    {
      id: '6',
      user: {
        id: '6',
        name: 'Pedro Lima',
        avatar_url: null
      },
      content: 'Minha interpretação vocal deste trecho marcante sobre a passagem do tempo e as gerações...',
      book_title: 'O Tempo e o Vento',
      book_link: 'https://www.amazon.com.br/Tempo-Vento-Erico-Verissimo/dp/8535918329',
      image_url: 'https://images.pexels.com/photos/1029148/pexels-photo-1029148.jpeg?auto=compress&cs=tinysrgb&w=800',
      post_type: 'audio' as const,
      audio_url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
      tags: ['clássico', 'literatura brasileira', 'história'],
      created_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      likes_count: 7,
      comments_count: 2,
      is_liked: false
    },
    {
      id: '7',
      user: {
        id: '7',
        name: 'Fernanda Rocha',
        avatar_url: null
      },
      content: 'Arte digital inspirada na atmosfera mágica e melancólica de Macondo. Cada elemento visual representa um aspecto da narrativa.',
      book_title: 'Cem Anos de Solidão',
      book_link: null,
      image_url: 'https://images.pexels.com/photos/2041540/pexels-photo-2041540.jpeg?auto=compress&cs=tinysrgb&w=800',
      post_type: 'illustration' as const,
      tags: ['arte', 'realismo mágico', 'literatura'],
      created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      likes_count: 42,
      comments_count: 15,
      is_liked: false
    }
  ]

  useEffect(() => {
    loadRandomPosts()
  }, [])

  const loadRandomPosts = () => {
    setLoading(true)
    // Simular carregamento de posts aleatórios
    setTimeout(() => {
      const shuffled = [...mockDiscoverPosts].sort(() => Math.random() - 0.5)
      setPosts(shuffled)
      setLoading(false)
    }, 800)
  }

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    )
  }

  const getTagColor = (tagName: string) => {
    const colors = [
      'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
      'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200'
    ]
    return colors[tagName.length % colors.length]
  }

  return (
    <div className="max-w-2xl mx-auto px-4">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-serif font-bold text-foreground dark:text-foreground-dark mb-2">
          Descobrir Novos Livros
        </h1>
        <p className="text-muted-foreground dark:text-muted-foreground-dark mb-6">
          Explore conteúdos aleatórios e amplie seus horizontes literários
        </p>
        
        {/* Barra de busca */}
        <div className="relative max-w-md mx-auto mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground dark:text-muted-foreground-dark" />
          <Input
            type="text"
            placeholder="Buscar por livros, autores ou gêneros…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-input dark:bg-input border-border dark:border-border-dark"
          />
        </div>
        
        {/* Filtros por tipo de post */}
        <div className="mb-6">
          <div className="flex flex-wrap justify-center gap-2">
            {postTypes.map((type) => (
              <Button
                key={type.value}
                variant={selectedType === type.value ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedType(type.value)}
                className={cn(
                  "text-xs",
                  selectedType === type.value
                    ? "bg-primary dark:bg-primary-dark text-primary-foreground dark:text-primary-foreground-dark"
                    : "border-border dark:border-border-dark"
                )}
              >
                {type.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Tags populares */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-muted-foreground dark:text-muted-foreground-dark mb-3">
            Filtrar por tags:
          </h3>
          <div className="flex flex-wrap justify-center gap-2">
            {popularTags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                onClick={() => toggleTag(tag)}
                className={cn(
                  "cursor-pointer text-xs px-3 py-1 rounded-full transition-all duration-200 hover:scale-105",
                  selectedTags.includes(tag)
                    ? "ring-2 ring-primary dark:ring-primary-dark ring-offset-2 dark:ring-offset-background-dark"
                    : "",
                  getTagColor(tag)
                )}
              >
                #{tag}
              </Badge>
            ))}
          </div>
          {selectedTags.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedTags([])}
              className="mt-2 text-xs text-muted-foreground dark:text-muted-foreground-dark"
            >
              Limpar filtros
            </Button>
          )}
        </div>
        
        <Button 
          onClick={loadRandomPosts}
          disabled={loading}
          variant="outline"
          className="flex items-center gap-2 border-border dark:border-border-dark"
        >
          <Shuffle className="h-4 w-4" />
          {loading ? 'Carregando...' : 'Embaralhar Posts'}
        </Button>
      </div>

      {/* Posts */}
      <div>
        {loading ? (
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="post-card animate-pulse">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-12 w-12 bg-secondary dark:bg-secondary-dark rounded-full"></div>
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-secondary dark:bg-secondary-dark rounded w-24"></div>
                    <div className="h-3 bg-secondary dark:bg-secondary-dark rounded w-16"></div>
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="h-4 bg-secondary dark:bg-secondary-dark rounded"></div>
                  <div className="h-4 bg-secondary dark:bg-secondary-dark rounded w-3/4"></div>
                </div>
                <div className="h-48 bg-secondary dark:bg-secondary-dark rounded-lg"></div>
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-secondary dark:bg-secondary-dark w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="h-8 w-8 text-muted-foreground dark:text-muted-foreground-dark" />
            </div>
            <h3 className="text-xl font-semibold text-foreground dark:text-foreground-dark mb-2">
              Nenhum post para descobrir
            </h3>
            <p className="text-muted-foreground dark:text-muted-foreground-dark">
              Clique em "Embaralhar Posts" para ver conteúdos aleatórios
            </p>
          </div>
        ) : (
          posts.map((post) => (
            <PostCard key={post.id} {...post} showSimilar={false} />
          ))
        )}
      </div>

      {/* Carregar mais */}
      {posts.length > 0 && (
        <div className="text-center mt-8">
          <Button 
            onClick={loadRandomPosts}
            variant="outline"
            disabled={loading}
            className="border-border dark:border-border-dark"
          >
            {loading ? 'Carregando...' : 'Ver Mais Posts'}
          </Button>
        </div>
      )}
    </div>
  )
}