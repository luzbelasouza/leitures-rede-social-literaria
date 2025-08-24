'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Brain, 
  Clock, 
  Users, 
  Star,
  Play,
  Trophy,
  CheckCircle
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Quiz, QuizQuestion } from '@/lib/types'

interface QuizCardProps extends Quiz {
  onStart: (quizId: string) => void
}

interface QuizPlayerProps {
  quiz: Quiz
  onComplete: (score: number) => void
  onClose: () => void
}

const DIFFICULTY_COLORS = {
  easy: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  hard: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
}

const DIFFICULTY_LABELS = {
  easy: 'Fácil',
  medium: 'Médio',
  hard: 'Difícil'
}

export function QuizPlayer({ quiz, onComplete, onClose }: QuizPlayerProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([])
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers]
    newAnswers[currentQuestion] = answerIndex
    setSelectedAnswers(newAnswers)
  }

  const handleNext = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      // Calcular pontuação
      let correctAnswers = 0
      quiz.questions.forEach((question, index) => {
        if (selectedAnswers[index] === question.correct_answer) {
          correctAnswers++
        }
      })
      const finalScore = Math.round((correctAnswers / quiz.questions.length) * 100)
      setScore(finalScore)
      setShowResult(true)
    }
  }

  const handleFinish = () => {
    onComplete(score)
    onClose()
  }

  const question = quiz.questions[currentQuestion]
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100

  if (showResult) {
    return (
      <Card className="w-full max-w-2xl mx-auto border-border dark:border-border-dark bg-card dark:bg-card-dark">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            {score >= 80 ? (
              <Trophy className="h-16 w-16 text-yellow-500" />
            ) : score >= 60 ? (
              <Star className="h-16 w-16 text-blue-500" />
            ) : (
              <Brain className="h-16 w-16 text-gray-500" />
            )}
          </div>
          <CardTitle className="text-2xl font-serif text-foreground dark:text-foreground-dark">
            Quiz Concluído!
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <div>
            <div className="text-4xl font-bold text-primary dark:text-primary-dark mb-2">
              {score}%
            </div>
            <p className="text-muted-foreground dark:text-muted-foreground-dark">
              Você acertou {selectedAnswers.filter((answer, index) => answer === quiz.questions[index].correct_answer).length} de {quiz.questions.length} questões
            </p>
          </div>

          <div className="space-y-2">
            {score >= 80 && (
              <p className="text-green-600 dark:text-green-400 font-medium">
                🎉 Excelente! Você é um verdadeiro conhecedor!
              </p>
            )}
            {score >= 60 && score < 80 && (
              <p className="text-blue-600 dark:text-blue-400 font-medium">
                👏 Muito bem! Bom conhecimento literário!
              </p>
            )}
            {score < 60 && (
              <p className="text-gray-600 dark:text-gray-400 font-medium">
                📚 Continue lendo e tente novamente!
              </p>
            )}
          </div>

          <div className="flex gap-3 justify-center">
            <Button onClick={handleFinish} className="bg-primary dark:bg-primary-dark text-primary-foreground dark:text-primary-foreground-dark">
              Finalizar
            </Button>
            <Button variant="outline" onClick={onClose} className="border-border dark:border-border-dark">
              Tentar Novamente
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-2xl mx-auto border-border dark:border-border-dark bg-card dark:bg-card-dark">
      <CardHeader>
        <div className="flex items-center justify-between mb-4">
          <Badge variant="outline" className="border-border dark:border-border-dark">
            Questão {currentQuestion + 1} de {quiz.questions.length}
          </Badge>
          <Button variant="ghost" size="sm" onClick={onClose}>
            ✕
          </Button>
        </div>
        <Progress value={progress} className="h-2 mb-4" />
        <CardTitle className="text-xl font-serif text-foreground dark:text-foreground-dark">
          {question.question}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {question.options.map((option, index) => (
            <Button
              key={index}
              variant="outline"
              onClick={() => handleAnswerSelect(index)}
              className={cn(
                "w-full text-left justify-start p-4 h-auto border-border dark:border-border-dark",
                selectedAnswers[currentQuestion] === index && "bg-primary/10 dark:bg-primary-dark/10 border-primary dark:border-primary-dark"
              )}
            >
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-6 h-6 rounded-full border-2 flex items-center justify-center",
                  selectedAnswers[currentQuestion] === index 
                    ? "border-primary dark:border-primary-dark bg-primary dark:bg-primary-dark" 
                    : "border-border dark:border-border-dark"
                )}>
                  {selectedAnswers[currentQuestion] === index && (
                    <CheckCircle className="h-4 w-4 text-primary-foreground dark:text-primary-foreground-dark" />
                  )}
                </div>
                <span className="text-foreground dark:text-foreground-dark">{option}</span>
              </div>
            </Button>
          ))}
        </div>

        <div className="flex justify-end pt-4">
          <Button
            onClick={handleNext}
            disabled={selectedAnswers[currentQuestion] === undefined}
            className="bg-primary dark:bg-primary-dark text-primary-foreground dark:text-primary-foreground-dark"
          >
            {currentQuestion < quiz.questions.length - 1 ? 'Próxima' : 'Finalizar'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default function QuizCard({
  id,
  title,
  description,
  questions,
  difficulty,
  category,
  attempts_count,
  average_score,
  user_best_score,
  onStart
}: QuizCardProps) {
  const difficultyColor = DIFFICULTY_COLORS[difficulty]
  const difficultyLabel = DIFFICULTY_LABELS[difficulty]

  return (
    <Card className="hover-lift border-border dark:border-border-dark bg-card dark:bg-card-dark">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <Brain className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <CardTitle className="text-lg font-serif text-foreground dark:text-foreground-dark">
                {title}
              </CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className={cn("text-xs", difficultyColor)}>
                  {difficultyLabel}
                </Badge>
                <Badge variant="outline" className="text-xs border-border dark:border-border-dark">
                  {category}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground dark:text-muted-foreground-dark leading-relaxed">
          {description}
        </p>

        {/* Estatísticas */}
        <div className="grid grid-cols-3 gap-4 py-3 bg-secondary/30 dark:bg-secondary-dark/30 rounded-lg">
          <div className="text-center">
            <div className="text-lg font-semibold text-foreground dark:text-foreground-dark">
              {questions.length}
            </div>
            <div className="text-xs text-muted-foreground dark:text-muted-foreground-dark">
              Questões
            </div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-foreground dark:text-foreground-dark">
              {Math.round(average_score)}%
            </div>
            <div className="text-xs text-muted-foreground dark:text-muted-foreground-dark">
              Média
            </div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-foreground dark:text-foreground-dark">
              {attempts_count}
            </div>
            <div className="text-xs text-muted-foreground dark:text-muted-foreground-dark">
              Tentativas
            </div>
          </div>
        </div>

        {/* Melhor pontuação do usuário */}
        {user_best_score !== undefined && (
          <div className="flex items-center gap-2 text-sm">
            <Trophy className="h-4 w-4 text-yellow-500" />
            <span className="text-muted-foreground dark:text-muted-foreground-dark">
              Sua melhor pontuação: 
            </span>
            <span className="font-semibold text-foreground dark:text-foreground-dark">
              {user_best_score}%
            </span>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-border dark:border-border-dark">
          <div className="flex items-center gap-2 text-sm text-muted-foreground dark:text-muted-foreground-dark">
            <Clock className="h-4 w-4" />
            <span>~{questions.length * 2} min</span>
          </div>

          <Button
            onClick={() => onStart(id)}
            size="sm"
            className="bg-primary dark:bg-primary-dark text-primary-foreground dark:text-primary-foreground-dark"
          >
            <Play className="h-4 w-4 mr-2" />
            {user_best_score !== undefined ? 'Jogar Novamente' : 'Começar Quiz'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}