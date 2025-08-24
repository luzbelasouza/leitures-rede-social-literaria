'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Search, Filter, Plus, Users, Trophy, Brain, Calendar } from 'lucide-react'
import ChallengeCard from '@/components/community/ChallengeCard'
import BookClubCard from '@/components/community/BookClubCard'
import QuizCard, { QuizPlayer } from '@/components/community/QuizCard'
import EventCard from '@/components/community/EventCard'
import type { Challenge, BookClub, Quiz, Event } from '@/lib/types'

export default function ComunidadePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null)

  // Mock data para demonstração
  const mockChallenges: Challenge[] = [
    {
      id: '1',
      title: 'Leia 5 Livros de Autoras Brasileiras',
      description: 'Descubra a riqueza da literatura feminina brasileira lendo obras de autoras como Clarice Lispector, Carolina Maria de Jesus, Conceição Evaristo e outras.',
      type: 'reading',
      target: 5,
      current_progress: 2,
      start_date: new Date().toISOString(),
      end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      participants_count: 127,
      is_participating: true,
      created_by: 'admin',
      tags: ['literatura brasileira', 'autoras', 'diversidade']
    },
    {
      id: '2',
      title: 'Poste 10 Trechos Este Mês',
      description: 'Compartilhe suas passagens favoritas e inspire outros leitores com descobertas literárias incríveis.',
      type: 'posting',
      target: 10,
      current_progress: 7,
      start_date: new Date().toISOString(),
      end_date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
      participants_count: 89,
      is_participating: false,
      created_by: 'admin',
      tags: ['engajamento', 'compartilhamento']
    }
  ]

  const mockBookClubs: BookClub[] = [
    {
      id: '1',
      name: 'Clássicos Brasileiros',
      description: 'Exploramos os grandes clássicos da literatura nacional, desde Machado de Assis até autores contemporâneos.',
      current_book: {
        title: 'Dom Casmurro',
        author: 'Machado de Assis',
        cover_url: 'https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg?auto=compress&cs=tinysrgb&w=400'
      },
      members_count: 45,
      is_member: true,
      is_private: false,
      created_by: 'user1',
      created_at: new Date().toISOString(),
      next_meeting: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      reading_schedule: [
        { week: 1, chapters: 'Capítulos 1-5', discussion_date: new Date().toISOString() },
        { week: 2, chapters: 'Capítulos 6-10', discussion_date: new Date().toISOString() }
      ]
    },
    {
      id: '2',
      name: 'Ficção Científica Moderna',
      description: 'Discutimos as obras mais inovadoras da ficção científica contemporânea e suas implicações para o futuro.',
      members_count: 23,
      is_member: false,
      is_private: false,
      created_by: 'user2',
      created_at: new Date().toISOString()
    }
  ]

  const mockQuizzes: Quiz[] = [
    {
      id: '1',
      title: 'Literatura Brasileira Clássica',
      description: 'Teste seus conhecimentos sobre os grandes clássicos da literatura nacional.',
      questions: [
        {
          id: '1',
          question: 'Quem escreveu "Dom Casmurro"?',
          options: ['José de Alencar', 'Machado de Assis', 'Aluísio Azevedo', 'Raul Pompéia'],
          correct_answer: 1,
          explanation: 'Dom Casmurro foi escrito por Machado de Assis em 1899.'
        },
        {
          id: '2',
          question: 'Em que movimento literário se enquadra "O Cortiço"?',
          options: ['Romantismo', 'Realismo', 'Naturalismo', 'Parnasianismo'],
          correct_answer: 2,
          explanation: 'O Cortiço, de Aluísio Azevedo, é uma obra do Naturalismo brasileiro.'
        }
      ],
      difficulty: 'medium',
      category: 'Literatura Brasileira',
      created_by: 'admin',
      created_at: new Date().toISOString(),
      attempts_count: 234,
      average_score: 72,
      user_best_score: 85
    },
    {
      id: '2',
      title: 'Poesia Moderna',
      description: 'Desafie-se com questões sobre os grandes poetas modernos.',
      questions: [
        {
          id: '1',
          question: 'Quem escreveu "Vou-me embora pra Pasárgada"?',
          options: ['Carlos Drummond de Andrade', 'Manuel Bandeira', 'Mário de Andrade', 'Oswald de Andrade'],
          correct_answer: 1
        }
      ],
      difficulty: 'easy',
      category: 'Poesia',
      created_by: 'admin',
      created_at: new Date().toISOString(),
      attempts_count: 156,
      average_score: 68
    }
  ]

  const mockEvents: Event[] = [
    {
      id: '1',
      title: 'Lançamento: "Memórias de uma Leitora"',
      description: 'Participe do lançamento virtual do novo livro de memórias literárias da autora Maria Santos, com sessão de autógrafos digital.',
      type: 'book_launch',
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      duration: 90,
      host: {
        id: 'author1',
        name: 'Maria Santos',
        avatar_url: undefined,
        bio: 'Escritora e crítica literária'
      },
      cover_image: 'https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg?auto=compress&cs=tinysrgb&w=800',
      is_free: true,
      current_participants: 67,
      max_participants: 100,
      is_registered: false,
      tags: ['lançamento', 'memórias', 'literatura'],
      created_at: new Date().toISOString()
    },
    {
      id: '2',
      title: 'Workshop: Como Escrever Resenhas Literárias',
      description: 'Aprenda técnicas profissionais para escrever resenhas envolventes e analíticas com a crítica literária Ana Costa.',
      type: 'workshop',
      date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      duration: 120,
      host: {
        id: 'critic1',
        name: 'Ana Costa',
        avatar_url: undefined,
        bio: 'Crítica literária e professora'
      },
      is_free: false,
      price: 25,
      current_participants: 12,
      max_participants: 30,
      is_registered: true,
      tags: ['workshop', 'resenhas', 'escrita'],
      created_at: new Date().toISOString()
    }
  ]

  const handleJoinChallenge = (challengeId: string) => {
    console.log('Participar do desafio:', challengeId)
  }

  const handleLeaveChallenge = (challengeId: string) => {
    console.log('Sair do desafio:', challengeId)
  }

  const handleJoinBookClub = (clubId: string) => {
    console.log('Entrar no clube:', clubId)
  }

  const handleLeaveBookClub = (clubId: string) => {
    console.log('Sair do clube:', clubId)
  }

  const handleStartQuiz = (quizId: string) => {
    const quiz = mockQuizzes.find(q => q.id === quizId)
    if (quiz) {
      setActiveQuiz(quiz)
    }
  }

  const handleCompleteQuiz = (score: number) => {
    console.log('Quiz concluído com pontuação:', score)
  }

  const handleRegisterEvent = (eventId: string) => {
    console.log('Inscrever-se no evento:', eventId)
  }

  const handleUnregisterEvent = (eventId: string) => {
    console.log('Cancelar inscrição no evento:', eventId)
  }

  if (activeQuiz) {
    return (
      <div className="min-h-screen bg-background dark:bg-background-dark p-4">
        <QuizPlayer
          quiz={activeQuiz}
          onComplete={handleCompleteQuiz}
          onClose={() => setActiveQuiz(null)}
        />
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground dark:text-foreground-dark mb-2 tracking-tight">
          Comunidade Literária
        </h1>
        <p className="text-muted-foreground dark:text-muted-foreground-dark leading-relaxed">
          Participe de desafios, clubes de leitura, quizzes e eventos
        </p>
      </div>

      {/* Barra de busca */}
      <div className="mb-8">
        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground dark:text-muted-foreground-dark" />
          <Input
            type="text"
            placeholder="Buscar na comunidade..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-input dark:bg-input border-border dark:border-border-dark"
          />
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="challenges" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-8 bg-secondary dark:bg-secondary-dark">
          <TabsTrigger value="challenges" className="flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            <span className="hidden sm:inline">Desafios</span>
          </TabsTrigger>
          <TabsTrigger value="clubs" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Clubes</span>
          </TabsTrigger>
          <TabsTrigger value="quizzes" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            <span className="hidden sm:inline">Quizzes</span>
          </TabsTrigger>
          <TabsTrigger value="events" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span className="hidden sm:inline">Eventos</span>
          </TabsTrigger>
        </TabsList>

        {/* Desafios */}
        <TabsContent value="challenges" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-serif font-semibold text-foreground dark:text-foreground-dark">
              Desafios Literários
            </h2>
            <Button size="sm" variant="outline" className="border-border dark:border-border-dark">
              <Plus className="h-4 w-4 mr-2" />
              Criar Desafio
            </Button>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2">
            {mockChallenges.map((challenge) => (
              <ChallengeCard
                key={challenge.id}
                {...challenge}
                onJoin={handleJoinChallenge}
                onLeave={handleLeaveChallenge}
              />
            ))}
          </div>
        </TabsContent>

        {/* Clubes de Leitura */}
        <TabsContent value="clubs" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-serif font-semibold text-foreground dark:text-foreground-dark">
              Clubes de Leitura
            </h2>
            <Button size="sm" variant="outline" className="border-border dark:border-border-dark">
              <Plus className="h-4 w-4 mr-2" />
              Criar Clube
            </Button>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2">
            {mockBookClubs.map((club) => (
              <BookClubCard
                key={club.id}
                {...club}
                onJoin={handleJoinBookClub}
                onLeave={handleLeaveBookClub}
              />
            ))}
          </div>
        </TabsContent>

        {/* Quizzes */}
        <TabsContent value="quizzes" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-serif font-semibold text-foreground dark:text-foreground-dark">
              Quizzes Literários
            </h2>
            <Button size="sm" variant="outline" className="border-border dark:border-border-dark">
              <Plus className="h-4 w-4 mr-2" />
              Criar Quiz
            </Button>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2">
            {mockQuizzes.map((quiz) => (
              <QuizCard
                key={quiz.id}
                {...quiz}
                onStart={handleStartQuiz}
              />
            ))}
          </div>
        </TabsContent>

        {/* Eventos */}
        <TabsContent value="events" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-serif font-semibold text-foreground dark:text-foreground-dark">
              Eventos Online
            </h2>
            <Button size="sm" variant="outline" className="border-border dark:border-border-dark">
              <Plus className="h-4 w-4 mr-2" />
              Criar Evento
            </Button>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2">
            {mockEvents.map((event) => (
              <EventCard
                key={event.id}
                {...event}
                onRegister={handleRegisterEvent}
                onUnregister={handleUnregisterEvent}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}