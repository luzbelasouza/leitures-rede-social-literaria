'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { BookOpen, Star, Mic, Image } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PostTypeSelectorProps {
  selectedType: 'excerpt' | 'review' | 'audio' | 'illustration'
  onTypeChange: (type: 'excerpt' | 'review' | 'audio' | 'illustration') => void
}

const POST_TYPES = [
  {
    type: 'excerpt' as const,
    label: 'Trecho',
    icon: BookOpen,
    description: 'Compartilhe um trecho marcante',
    color: 'text-blue-600 dark:text-blue-400'
  },
  {
    type: 'review' as const,
    label: 'Resenha',
    icon: Star,
    description: 'Escreva uma resenha curta',
    color: 'text-yellow-600 dark:text-yellow-400'
  },
  {
    type: 'audio' as const,
    label: 'Áudio',
    icon: Mic,
    description: 'Grave uma leitura ou comentário',
    color: 'text-green-600 dark:text-green-400'
  },
  {
    type: 'illustration' as const,
    label: 'Ilustração',
    icon: Image,
    description: 'Compartilhe uma ilustração ou arte',
    color: 'text-purple-600 dark:text-purple-400'
  }
]

export default function PostTypeSelector({ selectedType, onTypeChange }: PostTypeSelectorProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-foreground dark:text-foreground-dark">
        Tipo de Publicação
      </h3>
      <div className="grid grid-cols-2 gap-3">
        {POST_TYPES.map(({ type, label, icon: Icon, description, color }) => (
          <Button
            key={type}
            type="button"
            variant={selectedType === type ? "default" : "outline"}
            onClick={() => onTypeChange(type)}
            className={cn(
              "h-auto p-4 flex flex-col items-center gap-2 text-center transition-all duration-200",
              selectedType === type
                ? "bg-primary dark:bg-primary-dark text-primary-foreground dark:text-primary-foreground-dark border-primary dark:border-primary-dark"
                : "border-border dark:border-border-dark hover:bg-secondary dark:hover:bg-secondary-dark"
            )}
          >
            <Icon className={cn("h-6 w-6", selectedType === type ? "" : color)} />
            <div>
              <div className="font-medium text-sm">{label}</div>
              <div className="text-xs opacity-80 mt-1">{description}</div>
            </div>
          </Button>
        ))}
      </div>
    </div>
  )
}