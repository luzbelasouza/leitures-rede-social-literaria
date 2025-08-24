'use client'

import React from 'react'
import Link from 'next/link'
import { useAuth } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { BookOpen, Heart, Users, Sparkles, ArrowRight } from 'lucide-react'
import { redirect } from 'next/navigation'

export default function HomePage() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    )
  }

  if (user) {
    window.location.href = '/feed'
    return null
  }

  return (
    <div className="min-h-screen bg-background dark:bg-background-dark">
      {/* Hero Section */}
      <section className="relative py-16 lg:py-20 px-4">
        <div className="editorial-container text-center">
          <BookOpen className="h-16 w-16 text-primary dark:text-primary-dark mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-foreground dark:text-foreground-dark mb-6 tracking-tight">
            Leitures
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl text-muted-foreground dark:text-muted-foreground-dark mb-8 max-w-2xl mx-auto leading-relaxed">
            Compartilhe os trechos mais marcantes dos seus livros e descubra novas histórias através da comunidade
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center px-4">
            <Button size="lg" asChild className="btn-editorial group touch-target">
              <Link href="/cadastro" className="flex items-center gap-2">
                Começar Agora
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="btn-editorial-outline touch-target">
              <Link href="/login">Já tenho conta</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 lg:py-16 px-4">
        <div className="feed-container">
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-center text-foreground dark:text-foreground-dark mb-12">
            Uma nova forma de compartilhar literatura
          </h2>
          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            <div className="text-center p-6 lg:p-8 hover-lift rounded-xl bg-card dark:bg-card-dark border border-border dark:border-border-dark shadow-card dark:shadow-card-dark">
              <div className="bg-accent/10 dark:bg-accent-dark/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-accent dark:text-accent-dark" />
              </div>
              <h3 className="text-xl font-serif font-semibold text-foreground dark:text-foreground-dark mb-3">
                Compartilhe Trechos
              </h3>
              <p className="text-muted-foreground dark:text-muted-foreground-dark leading-relaxed">
                Publique os trechos que mais te tocaram, com imagens e links para os livros originais
              </p>
            </div>

            <div className="text-center p-6 lg:p-8 hover-lift rounded-xl bg-card dark:bg-card-dark border border-border dark:border-border-dark shadow-card dark:shadow-card-dark">
              <div className="bg-primary/10 dark:bg-primary-dark/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-primary dark:text-primary-dark" />
              </div>
              <h3 className="text-xl font-serif font-semibold text-foreground dark:text-foreground-dark mb-3">
                Conecte-se com Leitores
              </h3>
              <p className="text-muted-foreground dark:text-muted-foreground-dark leading-relaxed">
                Interaja com outros apaixonados por livros através de curtidas e comentários
              </p>
            </div>

            <div className="text-center p-6 lg:p-8 hover-lift rounded-xl bg-card dark:bg-card-dark border border-border dark:border-border-dark shadow-card dark:shadow-card-dark">
              <div className="bg-secondary dark:bg-secondary-dark w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="h-8 w-8 text-muted-foreground dark:text-muted-foreground-dark" />
              </div>
              <h3 className="text-xl font-serif font-semibold text-foreground dark:text-foreground-dark mb-3">
                Descubra Novas Leituras
              </h3>
              <p className="text-muted-foreground dark:text-muted-foreground-dark leading-relaxed">
                Encontre seu próximo livro favorito através das descobertas da comunidade
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary dark:bg-primary-dark text-primary-foreground dark:text-primary-foreground-dark py-12 lg:py-16 px-4">
        <div className="editorial-container text-center">
          <h2 className="text-2xl md:text-3xl font-serif font-bold mb-6">
            Pronto para compartilhar suas leituras?
          </h2>
          <p className="text-lg md:text-xl opacity-90 mb-8 leading-relaxed">
            Junte-se à comunidade de leitores apaixonados do Leitures
          </p>
          <Button size="lg" className="bg-accent dark:bg-accent-dark hover:bg-accent/90 dark:hover:bg-accent-dark/90 text-accent-foreground dark:text-accent-foreground-dark touch-target" asChild>
            <Link href="/cadastro" className="flex items-center gap-2">
              Criar Minha Conta
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}