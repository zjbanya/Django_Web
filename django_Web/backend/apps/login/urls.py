from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import LoginView, ProtectedProfileView, RegisterView

urlpatterns = [
    path("login/", LoginView.as_view(), name="api_login"),
    path("register/", RegisterView.as_view(), name="api_register"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("protected/", ProtectedProfileView.as_view(), name="api_protected"),
]
