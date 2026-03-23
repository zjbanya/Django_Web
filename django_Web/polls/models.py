from django.db import models

# 投标应用：需要两个模型 (类，并用继承写法：(models.Model))
# 问题 Question 
# 选项 Choice


class Question(models.Model):
    # id = models.AutoField(primary_key=True)  这段语句默认是自动加的
    question_text = models.CharField(max_length=200) # 返回字符串类型，限制长度为 200 
    pub_date = models.DateTimeField("date published") # 返回日期类型


class Choice(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    choice_text = models.CharField(max_length=200) 
    votes = models.IntegerField(default=0)  # int 类型，默认初始为 0 
