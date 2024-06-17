'use client'
import { useToast } from '@/components/ui/use-toast'
import { Message } from '@/models/user.model'
import { acceptMessageSchema } from '@/schema/acceptMessageSchema'
import { ApiResponse } from '@/types/apiResponse'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import { useSession } from 'next-auth/react'
import React, { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

export default function Dashboard() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSwitching, setIsSwitching] = useState(false)
  const { toast } = useToast();
  const {data: session} = useSession()

  const {register, watch, setValue} = useForm({
    resolver: zodResolver(acceptMessageSchema),
  })

  const watchIsAccepting = watch('isAccepting')

  // Call's to backend
  const getIsAcceptingInBackend = useCallback(async() => {

    setIsSwitching(true)

    try {
      const response = await axios.get<ApiResponse>('/api/accept-messages')
      setValue('isAccepting', response.data.isAcceptingMessage)
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast({
        title: 'Error',
        description: axiosError.response?.data.message || 'Error accepting messages',
        variant: 'destructive'
      })
    } finally{
      setIsSwitching(false)
    }
  }, [setValue, toast])

  const getAllMessages = useCallback(async(refresh = false) => {
    try {
      setIsLoading(true)
      setIsSwitching(false)

      const response = await axios.get<ApiResponse>('/api/get-messages')
      setMessages(response.data.messages || [])

      if(refresh) {
        toast({
          title: 'Success',
          description: 'Refreshed messages',
          variant: 'default'
        })
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast({
        title: 'Error',
        description: axiosError.response?.data.message || 'Error accepting messages',
        variant: 'destructive'
      })
    }finally{
      setIsLoading(false)
    }
  }, [toast, setIsLoading, setMessages])

  useEffect(() => {
    if(!session || !session.user) return

    getIsAcceptingInBackend()
    getAllMessages()
    
  }, [getAllMessages, getIsAcceptingInBackend, session])
  

  const switchHandler = async() => {
  try {
      const response = await axios.post<ApiResponse>('/api/accept-messages', {
        isAcceptingMessage: !watchIsAccepting
      })
      setValue("isAccepting", !watchIsAccepting)
      toast({
        title: response.data.message
      })
  } catch (error) {
    const axiosError = error as AxiosError<ApiResponse>
      toast({
        title: 'Error',
        description: axiosError.response?.data.message || 'Error accepting messages',
        variant: 'destructive'
      })
    }
  }
  return (
    <div>dashboard</div>
  )
}
