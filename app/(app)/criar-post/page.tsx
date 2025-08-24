'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Image, Link2, BookOpen, Loader2, AlertCircle, Star } from 'lucide-react'
import { toast } from 'react-hot-toast'

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

export default function CriarPostPage() {
  const [content, setContent] = useState('')
  const [bookTitle, setBookTitle] = useState('')
  const [bookLink, setBookLink] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [bookInfo, setBookInfo] = useState<BookInfo | null>(null)
  const [isLoadingBook, setIsLoadingBook] = useState(false)
  const [bookError, setBookError] = useState('')
  
  const { user } = useAuth()
  const router = useRouter()

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
      toast.error('Por favor, escreva o trecho que deseja compartilhar')
      return
    }

    if (content.length > 500) {
      toast.error('O trecho deve ter no máximo 500 caracteres')
      return
    }

    if (bookLink && !validateBookLink(bookLink)) {
      toast.error('Por favor, insira um link válido da Amazon, ISBN ou título do livro')
      return
    }

    setIsLoading(true)

    try {
      // Aqui implementaremos a lógica para salvar no Supabase
      // Por now, apenas simular o sucesso
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast.success('Post criado com sucesso!')
      router.push('/feed')
    } catch (error) {
      toast.error('Erro ao criar post. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  const characterCount = content.length
  const maxCharacters = 500

  return (
    <div className="min-h-screen bg-stone-50 lg:ml-64">
      <div className="max-w-2xl mx-auto px-3 md:px-4 py-4 md:py-8">
        <Card className="border-stone-200 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl md:text-2xl">
              <BookOpen className="h-6 w-6 text-amber-600" />
              Compartilhar Trecho
            </CardTitle>
            <p className="text-sm md:text-base text-stone-600">
              Compartilhe um trecho que marcou sua leitura
            </p>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Conteúdo do trecho */}
              <div className="space-y-2">
                <Label htmlFor="content">
                  Trecho do livro *
                </Label>
                <Textarea
                  id="content"
                  placeholder="Digite ou cole aqui o trecho que deseja compartilhar..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={5}
                  className="resize-none tap-highlight-none mobile-scroll bg-stone-50 border-stone-200 focus:border-amber-500 focus:ring-amber-500"
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

              {/* Link do livro */}
              <div className="space-y-2">
                <Label htmlFor="bookLink" className="flex items-center gap-2">
                  <Link2 className="h-4 w-4" />
                  Link do Livro ou ISBN
                </Label>
                <Input
                  id="bookLink"
                  type="text"
                  placeholder="Link da Amazon, ISBN ou título do livro..."
                  value={bookLink}
                  onChange={(e) => setBookLink(e.target.value)}
                  className="tap-highlight-none bg-stone-50 border-stone-200 focus:border-amber-500 focus:ring-amber-500"
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

              {/* Título do livro */}
              <div className="space-y-2">
                <Label htmlFor="bookTitle" className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Título do livro
                </Label>
                <Input
                  id="bookTitle"
                  type="text"
                  placeholder="Ex: Dom Casmurro, 1984, O Pequeno Príncipe..."
                  value={bookTitle}
                  onChange={(e) => setBookTitle(e.target.value)}
                  className="tap-highlight-none bg-stone-50 border-stone-200 focus:border-amber-500 focus:ring-amber-500"
                />
              </div>

              {/* URL da imagem */}
              <div className="space-y-2">
                <Label htmlFor="imageUrl" className="flex items-center gap-2">
                  <Image className="h-4 w-4" />
                  Imagem (opcional)
                </Label>
                <Input
                  id="imageUrl"
                  type="url"
                  placeholder="https://exemplo.com/capa-do-livro.jpg"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="tap-highlight-none bg-stone-50 border-stone-200 focus:border-amber-500 focus:ring-amber-500"
                />
                <p className="text-sm text-stone-500">
                  Cole a URL de uma imagem da capa do livro ou ilustração relacionada
                </p>
              </div>

              {/* Preview da imagem */}
              {imageUrl && (
                <div className="space-y-2">
                  <Label>Preview da imagem</Label>
                  <div className="border border-stone-200 rounded-lg overflow-hidden touch-action-none">
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

              {/* Botões */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline" 
                  onClick={() => router.back()}
                  className="flex-1 tap-highlight-none active:scale-95 transition-transform border-stone-300 text-stone-700 hover:bg-stone-50"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading || !content.trim() || characterCount > maxCharacters}
                  className="flex-1 bg-amber-600 hover:bg-amber-700 text-white tap-highlight-none active:scale-95 transition-transform"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Publicando...
                    </>
                  ) : (
                    'Publicar Trecho'
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}