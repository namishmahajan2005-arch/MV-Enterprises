from django.urls import path
from .views import GoogleAuthView, RegisterView, MeView

urlpatterns = [
    path("register/",RegisterView.as_view()),
    path("google/", GoogleAuthView.as_view()),
    path("me/",MeView.as_view()),
]