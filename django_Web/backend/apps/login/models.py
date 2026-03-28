from django.conf import settings
from django.db import models
from django.contrib.auth.models import AbstractUser

# 自定义 User 模型 强制 邮箱唯一
class User(AbstractUser):
    email = models.EmailField(unique=True)


class LoginLog(models.Model):
    """Successful login audit row (visible in Django admin)."""

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="login_logs",
    )
    ip_address = models.GenericIPAddressField()
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-timestamp"]

    def __str__(self):
        return f"{self.user.username} @ {self.ip_address} ({self.timestamp})"

class Post(models.Model):
    """Simple blog post model for desktop blog window."""

    slug = models.SlugField(max_length=120, unique=True)
    title = models.CharField(max_length=200)
    summary = models.CharField(max_length=320, blank=True, default="")
    content = models.TextField(blank=True, default="")
    is_published = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.title



