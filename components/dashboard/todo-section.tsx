"use client"

import React from 'react'
import { useRouter } from 'next/navigation'
import { DashboardCard } from '@/components/dashboard/dashboard-card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { useTodoContext } from '@/lib/todo-context'
import { toastSuccess, toastInfo } from '@/lib/use-toast'
import { formatTodoDate, getTodoStatusColor } from '@/lib/dashboard-utils'
import { TodoStatus } from '@/types'
import { AlertCircle, CheckCircle2, Clock, Star, Info } from 'lucide-react'

export function ToDoSection() {
  const router = useRouter()
  const { todos, initialized, wishTodo, remindTodo, completeTodo } = useTodoContext()
  
  // Filter out completed todos for display
  const activeTodos = todos.filter(todo => todo.status !== TodoStatus.Completed)
  
  const handleWish = (todoId: string, scheme?: string) => {
    wishTodo(todoId)
    if (scheme) {
      toastSuccess('Navigating to investors...', `Filtering by ${scheme}`)
      router.push(`/investors?scheme=${encodeURIComponent(scheme)}`)
    } else {
      toastSuccess('Marked as wished', 'You can view this in your wishlist')
    }
  }
  
  const handleRemind = (todoId: string) => {
    remindTodo(todoId)
    toastInfo("We'll remind you later", 'This task has been set for future reminder')
  }
  
  const handleComplete = (todoId: string) => {
    completeTodo(todoId)
    toastSuccess('Task completed', 'Great job on completing this task!')
  }
  
  const getStatusIcon = (status: TodoStatus) => {
    switch (status) {
      case TodoStatus.Open:
        return <AlertCircle className="h-4 w-4" />
      case TodoStatus.Completed:
        return <CheckCircle2 className="h-4 w-4" />
      case TodoStatus.Wished:
        return <Star className="h-4 w-4" />
      case TodoStatus.Reminded:
        return <Clock className="h-4 w-4" />
      default:
        return <Info className="h-4 w-4" />
    }
  }
  
  // Show loading skeletons while initializing
  if (!initialized) {
    return (
      <DashboardCard>
        <div className="p-6 space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-4 border rounded-lg">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-3 w-1/4" />
                </div>
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-20" />
                  <Skeleton className="h-8 w-20" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </DashboardCard>
    )
  }
  
  if (activeTodos.length === 0) {
    return (
      <DashboardCard>
        <div className="p-6">
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <CheckCircle2 className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">All caught up!</h3>
            <p className="text-sm text-muted-foreground">
              You have no pending tasks or alerts. Check back later for investment opportunities.
            </p>
          </div>
        </div>
      </DashboardCard>
    )
  }
  
  return (
    <DashboardCard>
      <div className="p-6 space-y-4">
        {activeTodos.map((todo) => (
          <Alert 
            key={todo.id} 
            className={`${getTodoStatusColor(todo.status)} border-l-4`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  {getStatusIcon(todo.status)}
                  <AlertTitle className="text-base font-semibold">
                    {todo.title}
                  </AlertTitle>
                  {todo.scheme && (
                    <Badge variant="outline" className="ml-2">
                      {todo.scheme}
                    </Badge>
                  )}
                </div>
                {todo.description && (
                  <AlertDescription className="text-sm text-muted-foreground mb-3">
                    {todo.description}
                  </AlertDescription>
                )}
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>{formatTodoDate(todo.createdAt)}</span>
                  {todo.status === TodoStatus.Reminded && todo.remindAt && (
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Reminder set
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {todo.status === TodoStatus.Open && (
                  <>
                    <Button
                      size="sm"
                      variant="default"
                      onClick={() => handleWish(todo.id, todo.scheme)}
                      className="min-w-[80px]"
                    >
                      Wish
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleRemind(todo.id)}
                      className="min-w-[80px]"
                    >
                      Remind
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleComplete(todo.id)}
                      className="px-2"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                    </Button>
                  </>
                )}
                {todo.status === TodoStatus.Reminded && (
                  <Button
                    size="sm"
                    variant="default"
                    onClick={() => handleWish(todo.id, todo.scheme)}
                    className="min-w-[80px]"
                  >
                    View Now
                  </Button>
                )}
                {todo.status === TodoStatus.Wished && (
                  <Badge variant="secondary">
                    <Star className="h-3 w-3 mr-1" />
                    Wished
                  </Badge>
                )}
              </div>
            </div>
          </Alert>
        ))}
      </div>
    </DashboardCard>
  )
}
