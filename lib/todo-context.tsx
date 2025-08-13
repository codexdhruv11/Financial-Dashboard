"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Todo, TodoStatus, TodoContextType } from '@/types'

const TodoContext = createContext<TodoContextType | undefined>(undefined)

export function TodoProvider({ children }: { children: ReactNode }) {
  const [todos, setTodos] = useState<Todo[]>([])

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
    }
  }, [])

  // Save todos to localStorage whenever they change
  useEffect(() => {
    if (todos.length > 0) {
      try {
        localStorage.setItem('financial-dashboard-todos', JSON.stringify(todos))
      } catch (error) {
        console.error('Error saving todos to localStorage:', error)
      }
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

// Utility functions
function generateTodoId(): string {
  return `todo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

function createSampleTodos(): Todo[] {
  return [
    {
      id: generateTodoId(),
      title: "Review HDFC Mid-Cap Fund Performance",
      description: "Quarterly review of HDFC Mid-Cap Opportunities Fund returns and rebalancing decision",
      scheme: "HDFC Mid-Cap",
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      status: TodoStatus.Open,
    },
    {
      id: generateTodoId(),
      title: "Market Alert: Tech Sector Correction",
      description: "Technology sector showing 10% correction - consider increasing allocation",
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      status: TodoStatus.Open,
    },
    {
      id: generateTodoId(),
      title: "ICICI Prudential Bluechip Fund - New NFO",
      description: "New fund offer closing on 15th March. Min investment ₹5,000",
      scheme: "ICICI Bluechip",
      createdAt: new Date().toISOString(),
      status: TodoStatus.Open,
    },
    {
      id: generateTodoId(),
      title: "Tax Saving Investment Deadline",
      description: "Invest in ELSS funds before March 31st for tax benefits under 80C",
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      status: TodoStatus.Open,
    },
    {
      id: generateTodoId(),
      title: "SIP Review for Axis Small Cap Fund",
      description: "Monthly SIP of ₹10,000 - Review performance after 6 months",
      scheme: "Axis Small Cap",
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      status: TodoStatus.Reminded,
      remindAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ]
}
