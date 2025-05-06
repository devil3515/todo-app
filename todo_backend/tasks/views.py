from rest_framework import viewsets, permissions
from .models import Task
from .serializers import TaskSerializer

class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        queryset = Task.objects.filter(user=user).order_by('-created_at')
        query = self.request.query_params.get('q')
        if query:
            queryset = queryset.filter(title__icontains=query)
        return queryset

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
