'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { BookOpen, Loader2, AlertCircle, Star, Mic, Image as ImageIcon } from 'lucide-react'
import { toast } from 'react-hot-toast'
import PostTypeSelector from '@/components/posts/PostTypeSelector'
import TagSelector from '@/components/posts/TagSelector'
import AudioRecorder from '@/components/posts/AudioRecorder'

interface PublishModalProps {
  isOpen: boolean
  onClose: () => void
}

interface BookInfo {
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
}

export default function PublishModal({ isOpen, onClose }: PublishModalProps) {
  const [imageUrl, setImageUrl] = useState('')
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [content, setContent] = useState('')
  const [bookTitle, setBookTitle] = useState('')
  const [bookLink, setBookLink] = useState('')
  const [postType, setPostType] = useState<'excerpt' | 'review' | 'audio' | 'illustration'>('excerpt')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [bookInfo, setBookInfo] = useState<BookInfo | null>(null)
  const [isLoadingBook, setIsLoadingBook] = useState(false)
  const [bookError, setBookError] = useState('')

  // Debounce para busca de livros
  useEffect(() => {
    if (!bookLink.trim()) {
      setBookInfo(null)
      setBookError('')
      return
    }

    const timeoutId = setTimeout(() => {
      fetchBookInfo(bookLink)
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [bookLink])

  const fetchBookInfo = async (query: string) => {
    if (!query.trim()) return

    setIsLoadingBook(true)
    setBookError('')
    setBookInfo(null)

    try {
      const response = await fetch('/api/book-info', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      })

      const data = await response.json()

      if (!response.ok) {
        if (data.error === 'FETCH_FAILED') {
          setBookError('Erro de conexão. Tente novamente.')
        } else {
          setBookError(data.message || 'Livro não encontrado')
        }
        return
      }

      setBookInfo(data)
      
      // Auto-preencher campos se estiverem vazios
      if (!bookTitle && data.title) {
        setBookTitle(data.title)
      }
      if (!imageUrl && data.imageUrl) {
        setImageUrl(data.imageUrl)
      }

    } catch (error) {
      setBookError('Erro de conexão. Tente novamente.')
    } finally {
      setIsLoadingBook(false)
    }
  }

  const validateBookLink = (link: string) => {
    if (!link) return true
    
    // Validar URLs da Amazon, ISBN ou títulos
    const amazonRegex = /amazon\.(com|com\.br)/i
    const isbnRegex = /^\d{10}(\d{3})?$/
    const isUrl = /^https?:\/\//i
    
    return amazonRegex.test(link) || isbnRegex.test(link.replace(/[-\s]/g, '')) || !isUrl.test(link)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!content.trim()) {
      const contentLabels = {
        excerpt: 'trecho',
        review: 'resenha',
        audio: 'descrição do áudio',
        illustration: 'descrição da ilustração'
      }
      toast.error(`Por favor, escreva ${contentLabels[postType]} que deseja compartilhar`)
      return
    }

    const maxLength = postType === 'review' ? 1000 : 500
    if (content.length > maxLength) {
      toast.error(`O conteúdo deve ter no máximo ${maxLength} caracteres`)
      return
    }

    if (postType === 'audio' && !audioUrl) {
      toast.error('Por favor, grave um áudio para este tipo de post')
      return
    }

    if (postType === 'illustration' && !imageUrl) {
      toast.error('Por favor, adicione uma imagem para este tipo de post')
      return
    }

    if (bookLink && !validateBookLink(bookLink)) {
      toast.error('Por favor, insira um link válido da Amazon, ISBN ou título do livro')
      return
    }

    setIsLoading(true)

    try {
      // Simular criação do post
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast.success('Post criado com sucesso!')
      handleClose()
    } catch (error) {
      toast.error('Erro ao criar post. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setImageUrl('')
    setAudioUrl(null)
    setContent('')
    setBookTitle('')
    setBookLink('')
    setPostType('excerpt')
    setSelectedTags([])
    setBookInfo(null)
    setBookError('')
    onClose()
  }

  const characterCount = content.length
  const maxCharacters = postType === 'review' ? 1000 : 500

  const getContentPlaceholder = () => {
    switch (postType) {
      case 'excerpt':
        return 'Digite ou cole aqui o trecho que deseja compartilhar...'
      case 'review':
        return 'Escreva sua resenha sobre o livro...'
      case 'audio':
        return 'Descreva o conteúdo do seu áudio...'
      case 'illustration':
        return 'Descreva sua ilustração ou arte...'
      default:
        return 'Digite seu conteúdo...'
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold text-stone-800">
            <BookOpen className="h-5 w-5 text-amber-600" />
            Novo Post Literário
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Seletor de tipo de post */}
          <PostTypeSelector
            selectedType={postType}
            onTypeChange={setPostType}
          />

          {/* Trecho do livro */}
          <div className="space-y-2">
            <Label htmlFor="content" className="text-foreground dark:text-foreground-dark font-medium">
              {postType === 'excerpt' && 'Trecho do Livro *'}
              {postType === 'review' && 'Sua Resenha *'}
              {postType === 'audio' && 'Descrição do Áudio *'}
              {postType === 'illustration' && 'Descrição da Ilustração *'}
            </Label>
            <Textarea
              id="content"
              placeholder={getContentPlaceholder()}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={postType === 'review' ? 6 : 4}
              className="resize-none bg-stone-50 border-stone-200 focus:border-amber-500 focus:ring-amber-500"
              required
            />
            <div className="flex justify-between text-sm">
              <span className="text-stone-500">
                * Campo obrigatório
              </span>
              <span className={`${characterCount > maxCharacters ? 'text-red-500' : 'text-stone-500'}`}>
                {characterCount}/{maxCharacters}
              </span>
            </div>
          </div>

          {/* Gravador de áudio - apenas para posts de áudio */}
          {postType === 'audio' && (
            <AudioRecorder
              audioUrl={audioUrl}
              onAudioChange={setAudioUrl}
            />
          )}

          {/* Link do livro */}
          <div className="space-y-2">
            <Label htmlFor="bookLink" className="text-foreground dark:text-foreground-dark font-medium">
              Link do Livro ou ISBN
            </Label>
            <Input
              id="bookLink"
              type="text"
              placeholder="Link da Amazon, ISBN ou título do livro..."
              value={bookLink}
              onChange={(e) => setBookLink(e.target.value)}
              className="bg-stone-50 border-stone-200 focus:border-amber-500 focus:ring-amber-500"
            />
            <p className="text-sm text-stone-500">
              Cole um link da Amazon, digite o ISBN ou o título do livro para buscar informações automaticamente
            </p>
          </div>

          {/* Pré-visualização do livro */}
          {(isLoadingBook || bookInfo || bookError) && (
            <div className="space-y-2">
              <Label className="text-stone-700 font-medium">
                Pré-visualização do Livro
              </Label>
              
              <div className="bg-stone-50 border border-stone-200 rounded-lg p-4">
                {isLoadingBook && (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-amber-600 mr-2" />
                    <span className="text-stone-600">Buscando informações do livro...</span>
                  </div>
                )}

                {bookError && (
                  <div className="flex items-center gap-2 text-red-600 py-4">
                    <AlertCircle className="h-5 w-5" />
                    <span>{bookError}</span>
                  </div>
                )}

                {bookInfo && (
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <img
                        src={bookInfo.imageUrl}
                        alt={`Capa do livro ${bookInfo.title}`}
                        className="w-20 h-28 object-cover rounded-md shadow-sm"
                        onError={(e) => {
                          e.currentTarget.src = 'https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg?auto=compress&cs=tinysrgb&w=400'
                        }}
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-stone-800 mb-1 line-clamp-2">
                        {bookInfo.title}
                      </h3>
                      
                      <p className="text-sm text-stone-600 mb-2">
                        por {bookInfo.authors.join(', ')}
                      </p>

                      {bookInfo.averageRating && (
                        <div className="flex items-center gap-1 mb-2">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm text-stone-600">
                            {bookInfo.averageRating} ({bookInfo.ratingsCount} avaliações)
                          </span>
                        </div>
                      )}

                      <p className="text-xs text-stone-500 line-clamp-3 hidden sm:block">
                        {bookInfo.description}
                      </p>

                      {bookInfo.isMock && (
                        <div className="mt-2 text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded">
                          📚 Dados de demonstração - Configure a API para dados reais
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Nome do livro */}
          <div className="space-y-2">
            <Label htmlFor="bookTitle" className="text-foreground dark:text-foreground-dark font-medium">
              Nome do Livro
            </Label>
            <Input
              id="bookTitle"
              type="text"
              placeholder="Ex: Dom Casmurro, 1984, O Pequeno Príncipe..."
              value={bookTitle}
              onChange={(e) => setBookTitle(e.target.value)}
              className="bg-stone-50 border-stone-200 focus:border-amber-500 focus:ring-amber-500"
            />
          </div>

          {/* URL da imagem */}
          <div className="space-y-2">
            <Label htmlFor="imageUrl" className="text-foreground dark:text-foreground-dark font-medium">
              {postType === 'illustration' ? 'Imagem da Ilustração *' : 'Imagem (URL)'}
            </Label>
            <Input
              id="imageUrl"
              type="url"
              placeholder={postType === 'illustration' 
                ? "https://exemplo.com/sua-ilustracao.jpg" 
                : "https://exemplo.com/capa-do-livro.jpg"
              }
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="bg-stone-50 border-stone-200 focus:border-amber-500 focus:ring-amber-500"
              required={postType === 'illustration'}
            />
            <p className="text-sm text-stone-500">
              {postType === 'illustration' 
                ? 'Cole a URL da sua ilustração ou arte relacionada ao livro'
                : 'Cole a URL de uma imagem da capa do livro ou ilustração relacionada'
              }
            </p>
          </div>

          {/* Preview da imagem */}
          {imageUrl && (
            <div className="space-y-2">
              <Label className="text-foreground dark:text-foreground-dark font-medium">Preview da imagem</Label>
              <div className="border border-stone-200 rounded-lg overflow-hidden">
                <img
                  src={imageUrl}
                  alt="Preview"
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg?auto=compress&cs=tinysrgb&w=400'
                  }}
                />
              </div>
            </div>
          )}

          {/* Seletor de tags */}
          <TagSelector
            selectedTags={selectedTags}
            onTagsChange={setSelectedTags}
            maxTags={5}
          />

          {/* Botões */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1 border-stone-300 text-stone-700 hover:bg-stone-50"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={
                isLoading || 
                !content.trim() || 
                characterCount > maxCharacters ||
                (postType === 'audio' && !audioUrl) ||
                (postType === 'illustration' && !imageUrl)
              }
              className="flex-1 bg-amber-600 hover:bg-amber-700 text-white"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Publicando...
                </>
              ) : (
                'Publicar'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}