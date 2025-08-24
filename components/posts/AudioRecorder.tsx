'use client'

import React, { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Mic, Square, Play, Pause, Trash2, Upload } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AudioRecorderProps {
  audioUrl?: string
  onAudioChange: (audioUrl: string | null) => void
}

export default function AudioRecorder({ audioUrl, onAudioChange }: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder

      const chunks: BlobPart[] = []
      mediaRecorder.ondataavailable = (event) => {
        chunks.push(event.data)
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' })
        setAudioBlob(blob)
        const url = URL.createObjectURL(blob)
        onAudioChange(url)
        
        // Parar todas as tracks do stream
        stream.getTracks().forEach(track => track.stop())
      }

      mediaRecorder.start()
      setIsRecording(true)
      setRecordingTime(0)

      // Timer para mostrar tempo de gravação
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1)
      }, 1000)

    } catch (error) {
      console.error('Erro ao acessar microfone:', error)
      alert('Erro ao acessar o microfone. Verifique as permissões.')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
  }

  const playAudio = () => {
    if (audioRef.current) {
      audioRef.current.play()
      setIsPlaying(true)
    }
  }

  const pauseAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      setIsPlaying(false)
    }
  }

  const deleteAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause()
    }
    setIsPlaying(false)
    setAudioBlob(null)
    setRecordingTime(0)
    onAudioChange(null)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="space-y-4">
      <Label className="text-sm font-medium text-foreground dark:text-foreground-dark">
        Gravação de Áudio
      </Label>

      {/* Controles de gravação */}
      <div className="flex items-center gap-3 p-4 bg-secondary/50 dark:bg-secondary-dark/50 rounded-lg border border-border dark:border-border-dark">
        {!isRecording && !audioUrl ? (
          <Button
            type="button"
            onClick={startRecording}
            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white"
          >
            <Mic className="h-4 w-4" />
            Gravar
          </Button>
        ) : isRecording ? (
          <>
            <Button
              type="button"
              onClick={stopRecording}
              className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white animate-pulse"
            >
              <Square className="h-4 w-4" />
              Parar
            </Button>
            <div className="flex items-center gap-2 text-sm text-muted-foreground dark:text-muted-foreground-dark">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              Gravando... {formatTime(recordingTime)}
            </div>
          </>
        ) : (
          <div className="flex items-center gap-3 flex-1">
            <Button
              type="button"
              onClick={isPlaying ? pauseAudio : playAudio}
              variant="outline"
              size="sm"
              className="border-border dark:border-border-dark"
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            
            <div className="flex-1">
              <div className="text-sm text-foreground dark:text-foreground-dark">
                Áudio gravado
              </div>
              <div className="text-xs text-muted-foreground dark:text-muted-foreground-dark">
                Clique em play para ouvir
              </div>
            </div>

            <Button
              type="button"
              onClick={deleteAudio}
              variant="ghost"
              size="sm"
              className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Player de áudio oculto */}
      {audioUrl && (
        <audio
          ref={audioRef}
          src={audioUrl}
          onEnded={() => setIsPlaying(false)}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          className="hidden"
        />
      )}

      <p className="text-xs text-muted-foreground dark:text-muted-foreground-dark">
        💡 Grave uma leitura do trecho, comentário sobre o livro ou sua interpretação pessoal
      </p>
    </div>
  )
}