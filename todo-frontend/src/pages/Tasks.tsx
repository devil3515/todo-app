
import React, { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Plus, Search, X, Loader2 } from 'lucide-react';
import TaskCard from '@/components/TaskCard';
import TaskForm from '@/components/TaskForm';
import taskService, { Task, CreateTaskData, UpdateTaskData } from '@/services/taskService';
import { useAuth } from '@/context/AuthContext';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const Tasks = () => {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [deleteTaskId, setDeleteTaskId] = useState<number | null>(null);

  const {
    data: tasks = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['tasks', searchQuery],
    queryFn: () => searchQuery ? taskService.searchTasks(searchQuery) : taskService.getAllTasks(),
    enabled: isAuthenticated,
  });

  // Create task mutation
  const createTaskMutation = useMutation({
    mutationFn: (taskData: CreateTaskData) => taskService.createTask(taskData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Task created successfully!');
      closeTaskForm();
    },
    onError: () => {
      toast.error('Failed to create task');
    },
  });

  // Update task mutation
  const updateTaskMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateTaskData }) => 
      taskService.updateTask(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Task updated successfully!');
      closeTaskForm();
    },
    onError: () => {
      toast.error('Failed to update task');
    },
  });

  // Delete task mutation
  const deleteTaskMutation = useMutation({
    mutationFn: (id: number) => taskService.deleteTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Task deleted successfully!');
    },
    onError: () => {
      toast.error('Failed to delete task');
    },
  });

  // Complete task mutation
  const completeTaskMutation = useMutation({
    mutationFn: ({ id, completed }: { id: number; completed: boolean }) => 
      taskService.markAsCompleted(id, completed),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success(`Task marked as ${variables.completed ? 'completed' : 'incomplete'}`);
    },
    onError: () => {
      toast.error('Failed to update task status');
    },
  });

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  const openCreateTaskForm = () => {
    setSelectedTask(null);
    setIsTaskFormOpen(true);
  };

  const openEditTaskForm = (task: Task) => {
    setSelectedTask(task);
    setIsTaskFormOpen(true);
  };

  const closeTaskForm = () => {
    setIsTaskFormOpen(false);
    setSelectedTask(null);
  };

  const handleSubmitTask = (data: CreateTaskData) => {
    if (selectedTask) {
      updateTaskMutation.mutate({
        id: selectedTask.id,
        data,
      });
    } else {
      createTaskMutation.mutate(data);
    }
  };

  const handleDeleteTask = (id: number) => {
    setDeleteTaskId(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (deleteTaskId !== null) {
      deleteTaskMutation.mutate(deleteTaskId);
      setIsDeleteDialogOpen(false);
      setDeleteTaskId(null);
    }
  };

  const handleCompleteTask = (id: number, completed: boolean) => {
    completeTaskMutation.mutate({ id, completed });
  };

  if (error) {
    return <div className="text-center py-10 text-red-500">Error loading tasks</div>;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Tasks</h1>
        <Button onClick={openCreateTaskForm}>
          <Plus className="mr-2 h-4 w-4" /> Add Task
        </Button>
      </div>
      
      <div className="mb-6 relative">
        <Input
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={handleSearchInputChange}
          className="pr-10"
        />
        {searchQuery ? (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X size={16} />
          </button>
        ) : (
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        </div>
      ) : tasks.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          {searchQuery ? 'No matching tasks found' : 'No tasks yet. Create one to get started!'}
        </div>
      ) : (
        <div>
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onComplete={handleCompleteTask}
              onEdit={openEditTaskForm}
              onDelete={handleDeleteTask}
            />
          ))}
        </div>
      )}

      <TaskForm
        isOpen={isTaskFormOpen}
        onClose={closeTaskForm}
        onSubmit={handleSubmitTask}
        task={selectedTask || undefined}
      />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this task. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Tasks;
