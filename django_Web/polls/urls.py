from django.urls import path

from . import views

# python 原生的命名空间是 模块.
# Django 的 URL 命名空间 是 是必须变量名为 app_name 才能识别。语法: 'polls:index' (用冒号区分 app 名和 URL 名)
app_name = "polls"
urlpatterns = [
    # views.index → 当 URL 匹配成功时执行的函数
    #    views.index(request) 会被调用, 返回响应（HTML 页面、JSON 或其他）
    # name="index" → 给这个 URL 一个名字
    #    可以在模板或 reverse() 函数里引用, 好处：以后 URL 改了，模板里不用改，只要用名字引用即可
    path("", views.IndexView.as_view(), name="index"), # 当用户访问这个 URL 时，要执行哪个函数返回响应。
    path("<int:pk>/", views.DetailView.as_view(), name="detail"),
    path("<int:pk>/results/", views.ResultsView.as_view(), name="results"),
    path("<int:question_id>/vote/", views.vote, name="vote"),
    
]


