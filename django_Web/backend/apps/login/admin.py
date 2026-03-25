from django.contrib import admin
from .models import LoginLog
from .models import User
# login/admin.py
from django.contrib.auth.admin import UserAdmin

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'is_staff', 'is_active')
    
    def get_fieldsets(self, request, obj=None):
        # 先获取父类的 fieldsets（作为 list）
        fieldsets = list(super().get_fieldsets(request, obj))
        # 添加自定义字段集
        fieldsets.append(('Extra', {'fields': ()}))
        return fieldsets

@admin.register(LoginLog)
class LoginLogAdmin(admin.ModelAdmin):
    list_display = ("user", "ip_address", "timestamp")
    search_fields = ("user__username", "ip_address")
    list_filter = ("timestamp",)
