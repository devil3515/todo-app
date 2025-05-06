# # urls.py
# from django.urls import path
# from .views import register_view, login_view
# from . import views

# urlpatterns = [
#     path('register/', register_view, name='register'),
#     path('login/', login_view, name='login'),
#     path('', views.register_view, name='register-root'),
#     # Add other paths as needed
# ]
# accounts/urls.py (minimal version)
from django.urls import path, include
from .api_urls import urlpatterns as api_urls

urlpatterns = [
    path('api/auth/', include((api_urls, 'accounts_api'))),
]