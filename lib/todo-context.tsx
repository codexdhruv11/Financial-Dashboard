"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Todo, TodoStatus, TodoContextType } from '@/types'
import { generateTodoId, createSampleTodos } from '@/lib/dashboard-utils'

const TodoContext = createContext<TodoContextType | undefined>(undefined)

export function TodoProvider({ children }: { children: ReactNode }) {
  const [todos, setTodos] = useState<Todo[]>([])
  const [initialized, setInitialized] = useState(false)

  // Load todos from localStorage on mount
  useEffect(() => {
    try {
      const storedTodos = localStorage.getItem('financial-dashboard-todos')
      if (storedTodos) {
        const parsedTodos = JSON.parse(storedTodos)
        setTodos(parsedTodos)
      } else {
        // Initialize with sample todos if none exist
        const sampleTodos = createSampleTodos()
        setTodos(sampleTodos)
        localStorage.setItem('financial-dashboard-todos', JSON.stringify(sampleTodos))
      }
    } catch (error) {
      console.error('Error loading todos from localStorage:', error)
      const sampleTodos = createSampleTodos()
      setTodos(sampleTodos)
    } finally {
      setInitialized(true)
    }
  }, [])

  // Save todos to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('financial-dashboard-todos', JSON.stringify(todos))
    } catch (error) {
      console.error('Error saving todos to localStorage:', error)
    }
  }, [todos])

  const addTodo = (title: string, description?: string, scheme?: string) => {
    const newTodo: Todo = {
      id: generateTodoId(),
      title,
      description,
      scheme,
      createdAt: new Date().toISOString(),
      status: TodoStatus.Open,
    }
    setTodos(prev => [newTodo, ...prev])
  }

  const completeTodo = (id: string) => {
    setTodos(prev => 
      prev.map(todo => 
        todo.id === id 
          ? { ...todo, status: TodoStatus.Completed }
          : todo
      )
    )
  }

  const wishTodo = (id: string) => {
    setTodos(prev => 
      prev.map(todo => 
        todo.id === id 
          ? { ...todo, status: TodoStatus.Wished }
          : todo
      )
    )
  }

  const remindTodo = (id: string) => {
    setTodos(prev => 
      prev.map(todo => 
        todo.id === id 
          ? { ...todo, status: TodoStatus.Reminded, remindAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() }
          : todo
      )
    )
  }

  const removeTodo = (id: string) => {
    setTodos(prev => prev.filter(todo => todo.id !== id))
  }

  return (
    <TodoContext.Provider value={{
      todos,
      initialized,
      addTodo,
      completeTodo,
      wishTodo,
      remindTodo,
      removeTodo,
    }}>
      {children}
    </TodoContext.Provider>
  )
}

export function useTodoContext() {
  const context = useContext(TodoContext)
  if (context === undefined) {
    throw new Error('useTodoContext must be used within a TodoProvider')
  }
  return context
}
