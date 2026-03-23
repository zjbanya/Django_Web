from re import A

from django.contrib import admin

from .models import Question, Choice
"""
1. QuestionAdmin → 自定义 Question 模型在后台的显示和操作方式
2. 不是创建数据库表 → 表是 Question 模型创建的
3. fieldsets → 控制编辑页面的字段分组
4. 注册时传给 admin.site.register → 后台使用这个自定义配置
"""
class ChoiceInline(admin.TabularInline):
    model = Choice
    extra = 3

class QuestionAdmin(admin.ModelAdmin):
    fieldsets = [
        (None, {"fields": ["question_text"]}),
        ("数据信息", {"fields": ["pub_date"], "classes": ["collapse"]}),
    ]
    inlines = [ChoiceInline]
    list_display = ["question_text", "pub_date", "was_published_recently"]
    list_filter = ["pub_date"] # 过滤器


admin.site.register(Question, QuestionAdmin)




