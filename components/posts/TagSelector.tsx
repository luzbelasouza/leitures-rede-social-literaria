'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { X, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TagSelectorProps {
  selectedTags: string[]
  onTagsChange: (tags: string[]) => void
  maxTags?: number
}

const POPULAR_TAGS = [
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

export default function TagSelector({ selectedTags, onTagsChange, maxTags = 5 }: TagSelectorProps) {
  const [customTag, setCustomTag] = useState('')

  const addTag = (tag: string) => {
    const normalizedTag = tag.toLowerCase().trim()
    if (normalizedTag && !selectedTags.includes(normalizedTag) && selectedTags.length < maxTags) {
      onTagsChange([...selectedTags, normalizedTag])
    }
  }

  const removeTag = (tagToRemove: string) => {
    onTagsChange(selectedTags.filter(tag => tag !== tagToRemove))
  }

  const handleCustomTagSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (customTag.trim()) {
      addTag(customTag)
      setCustomTag('')
    }
  }

  const getTagColor = (tagName: string) => {
    const popularTag = POPULAR_TAGS.find(t => t.name === tagName)
    return popularTag?.color || 'bg-secondary dark:bg-secondary-dark text-foreground dark:text-foreground-dark'
  }

  return (
    <div className="space-y-4">
      <div>
        <Label className="text-sm font-medium text-foreground dark:text-foreground-dark">
          Tags ({selectedTags.length}/{maxTags})
        </Label>
        <p className="text-xs text-muted-foreground dark:text-muted-foreground-dark mt-1">
          Adicione tags para facilitar a descoberta do seu conteúdo
        </p>
      </div>

      {/* Tags selecionadas */}
      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedTags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className={cn(
                "flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full",
                getTagColor(tag)
              )}
            >
              #{tag}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeTag(tag)}
                className="h-4 w-4 p-0 hover:bg-transparent"
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
        </div>
      )}

      {/* Tags populares */}
      <div>
        <Label className="text-xs font-medium text-muted-foreground dark:text-muted-foreground-dark mb-2 block">
          Tags Populares
        </Label>
        <div className="flex flex-wrap gap-2">
          {POPULAR_TAGS.map(({ name, color }) => (
            <Button
              key={name}
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => addTag(name)}
              disabled={selectedTags.includes(name) || selectedTags.length >= maxTags}
              className={cn(
                "h-7 px-3 text-xs rounded-full transition-all duration-200",
                selectedTags.includes(name)
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:scale-105",
                color
              )}
            >
              #{name}
            </Button>
          ))}
        </div>
      </div>

      {/* Adicionar tag customizada */}
      {selectedTags.length < maxTags && (
        <form onSubmit={handleCustomTagSubmit} className="flex gap-2">
          <Input
            type="text"
            placeholder="Criar nova tag..."
            value={customTag}
            onChange={(e) => setCustomTag(e.target.value)}
            className="flex-1 h-9 text-sm bg-input dark:bg-input border-border dark:border-border-dark"
            maxLength={20}
          />
          <Button
            type="submit"
            size="sm"
            variant="outline"
            disabled={!customTag.trim() || selectedTags.includes(customTag.toLowerCase().trim())}
            className="h-9 px-3 border-border dark:border-border-dark"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </form>
      )}
    </div>
  )
}