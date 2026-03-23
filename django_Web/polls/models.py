from django.db import models
from django.utils import timezone
import datetime
from django.contrib import admin
# 投标应用：需要两个模型 (类，并用继承写法：(models.Model))
# 问题 Question 
# 选项 Choice


class Question(models.Model):
    # id = models.AutoField(primary_key=True)  这段语句默认是自动加的
    def __str__(self):
        return self.question_text
    @admin.display(
        boolean=True,
        ordering="pub_date",
        description="Published recently?",
    )
    def was_published_recently(self):
        now = timezone.now()
        return now - datetime.timedelta(days=1) <= self.pub_date <= now
    question_text = models.CharField(max_length=200) # 返回字符串类型，限制长度为 200 
    pub_date = models.DateTimeField("date published") # 返回日期类型

    

class Choice(models.Model):
    def __str__(self):
        return self.choice_text
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    choice_text = models.CharField(max_length=200) 
    votes = models.IntegerField(default=0)  # int 类型，默认初始为 0 
