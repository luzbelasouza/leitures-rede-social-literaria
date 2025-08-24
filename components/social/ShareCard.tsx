'use client'

import React, { useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { 
  Share2, 
  Instagram, 
  Download, 
  Copy,
  BookOpen,
  Quote
} from 'lucide-react'
import { toast } from 'react-hot-toast'
import { cn } from '@/lib/utils'

interface ShareCardProps {
  content: string
  bookTitle?: string
  authorName: string
  postType: 'excerpt' | 'review' | 'audio' | 'illustration'
  imageUrl?: string
}

export default function ShareCard({ 
  content, 
  bookTitle, 
  authorName, 
  postType,
  imageUrl 
}: ShareCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)

  const generateShareableCard = async () => {
    if (!cardRef.current) return

    try {
      // Usar html2canvas seria ideal, mas vamos simular com uma URL
      const shareData = {
        title: `${postType === 'excerpt' ? 'Trecho' : 'Resenha'} de ${bookTitle || 'um livro'}`,
        text: content.substring(0, 100) + '...',
        url: window.location.href
      }

      if (navigator.share) {
        await navigator.share(shareData)
      } else {
        await navigator.clipboard.writeText(
          `"${content}"\n\n— ${bookTitle || 'Livro'}\n\nCompartilhado via Leitures: ${window.location.href}`
        )
        toast.success('Texto copiado para área de transferência!')
      }
    } catch (error) {
      console.error('Erro ao compartilhar:', error)
      toast.error('Erro ao compartilhar')
    }
  }

  const downloadCard = async () => {
    // Simular download - em produção usaria html2canvas
    toast.success('Funcionalidade de download será implementada em breve!')
  }

  const shareToInstagram = () => {
    const text = encodeURIComponent(`"${content.substring(0, 100)}..."\n\n— ${bookTitle || 'Livro'}\n\n#leitures #literatura #livros`)
    window.open(`https://www.instagram.com/create/story/?text=${text}`, '_blank')
  }

  return (
    <div className="space-y-4">
      {/* Card de Preview */}
      <Card 
        ref={cardRef}
        className="w-full max-w-md mx-auto bg-gradient-to-br from-primary/5 to-accent/5 dark:from-primary-dark/10 dark:to-accent-dark/10 border-2 border-primary/20 dark:border-primary-dark/20"
      >
        <CardContent className="p-6 space-y-4">
          {/* Header */}
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="h-5 w-5 text-primary dark:text-primary-dark" />
            <span className="text-sm font-medium text-primary dark:text-primary-dark">
              Leitures
            </span>
          </div>

          {/* Imagem do livro */}
          {imageUrl && (
            <div className="w-full h-32 rounded-lg overflow-hidden mb-4">
              <img
                src={imageUrl}
                alt="Capa do livro"
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Conteúdo */}
          <div className="space-y-3">
            {postType === 'excerpt' ? (
              <div className="relative">
                <Quote className="absolute -top-2 -left-2 h-6 w-6 text-primary/30 dark:text-primary-dark/30" />
                <blockquote className="text-foreground dark:text-foreground-dark font-serif text-lg leading-relaxed italic pl-4">
                  "{content}"
                </blockquote>
              </div>
            ) : (
              <p className="text-foreground dark:text-foreground-dark leading-relaxed">
                {content}
              </p>
            )}

            {bookTitle && (
              <p className="text-muted-foreground dark:text-muted-foreground-dark font-medium text-right">
                — {bookTitle}
              </p>
            )}

            <p className="text-sm text-muted-foreground dark:text-muted-foreground-dark">
              Compartilhado por {authorName}
            </p>
          </div>

          {/* Footer */}
          <div className="pt-4 border-t border-border dark:border-border-dark">
            <p className="text-xs text-center text-muted-foreground dark:text-muted-foreground-dark">
              Descubra mais em leitures.com
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Botões de Ação */}
      <div className="flex flex-wrap gap-2 justify-center">
        <Button
          onClick={generateShareableCard}
          size="sm"
          className="bg-primary dark:bg-primary-dark text-primary-foreground dark:text-primary-foreground-dark"
        >
          <Share2 className="h-4 w-4 mr-2" />
          Compartilhar
        </Button>

        <Button
          onClick={shareToInstagram}
          size="sm"
          variant="outline"
          className="border-pink-300 text-pink-600 hover:bg-pink-50 dark:border-pink-700 dark:text-pink-400 dark:hover:bg-pink-900/20"
        >
          <Instagram className="h-4 w-4 mr-2" />
          Instagram
        </Button>

        <Button
          onClick={downloadCard}
          size="sm"
          variant="outline"
          className="border-border dark:border-border-dark"
        >
          <Download className="h-4 w-4 mr-2" />
          Download
        </Button>

        <Button
          onClick={() => {
            navigator.clipboard.writeText(window.location.href)
            toast.success('Link copiado!')
          }}
          size="sm"
          variant="outline"
          className="border-border dark:border-border-dark"
        >
          <Copy className="h-4 w-4 mr-2" />
          Copiar Link
        </Button>
      </div>
    </div>
  )
}