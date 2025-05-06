
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';
import { Task } from '@/services/taskService';
import { cn } from '@/lib/utils';

interface TaskCardProps {
  task: Task;
  onComplete: (id: number, completed: boolean) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onComplete, onEdit, onDelete }) => {
  return (
    <Card className="mb-3 hover:shadow-md transition-shadow">
      <CardContent className="p-4 flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          <Checkbox 
            checked={task.completed} 
            onCheckedChange={(checked) => onComplete(task.id, !!checked)}
            className="mt-1"
          />
          <div>
            <h3 className={cn(
              "font-medium text-base", 
              task.completed && "line-through text-gray-500"
            )}>
              {task.title}
            </h3>
            {task.description && (
              <p className={cn(
                "text-sm mt-1 text-gray-600", 
                task.completed && "line-through text-gray-400"
              )}>
                {task.description}
              </p>
            )}
          </div>
        </div>
        <div className="flex space-x-2 ml-3">
          <Button variant="outline" size="sm" onClick={() => onEdit(task)}>
            <Pencil size={16} />
          </Button>
          <Button variant="outline" size="sm" onClick={() => onDelete(task.id)}>
            <Trash2 size={16} />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskCard;
