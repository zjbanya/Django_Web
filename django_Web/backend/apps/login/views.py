# views.py
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.generics import ListAPIView, RetrieveAPIView
from rest_framework_simplejwt.tokens import RefreshToken
from .models import LoginLog, Post
from .serializers import LoginSerializer, RegisterSerializer, PostListSerializer, PostDetailSerializer
from django.contrib.auth import get_user_model

User = get_user_model()


def get_client_ip(request):
    forwarded = request.META.get("HTTP_X_FORWARDED_FOR")
    # 考虑了反向代理（如 Nginx）场景，避免拿到内网 IP。
    if forwarded:
        return forwarded.split(",")[0].strip()
    return request.META.get("REMOTE_ADDR") or "0.0.0.0"


class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response(
            {
                "message": "Registration successful.",
                "username": user.username,
                "email": user.email,
            },
            status=status.HTTP_201_CREATED,
        )
    
# 退出视图
class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist()  # 加入黑名单
            return Response({"message": "Successfully logged out."}, status=200)
        except Exception as e:
            return Response({"error": str(e)}, status=400)


# 登录视图
class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data["user"]

        refresh = RefreshToken.for_user(user)
        ip = get_client_ip(request)
        LoginLog.objects.create(user=user, ip_address=ip)

        return Response(
            {
                "access": str(refresh.access_token),
                "refresh": str(refresh),
                "username": user.username,
            },
            status=status.HTTP_200_OK,
        )


class ProtectedProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({"username": request.user.username})


class PostListView(ListAPIView):
    permission_classes = [AllowAny]
    serializer_class = PostListSerializer

    def get_queryset(self):
        return Post.objects.filter(is_published=True)


class PostDetailView(RetrieveAPIView):
    permission_classes = [AllowAny]
    serializer_class = PostDetailSerializer
    lookup_field = "slug"

    def get_queryset(self):
        return Post.objects.filter(is_published=True)