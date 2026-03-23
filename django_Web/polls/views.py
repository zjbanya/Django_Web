from django.db.models import F
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render, get_object_or_404
from .models import Question, Choice
from django.template import loader
from django.http import Http404
from django.urls import reverse


################## python 语法
# 关键字参数：实参必须显示指定形参名，形式 -- 形参名 = 
# 
##################


# 视图函数必须至少有一个参数，通常命名为 request，它是 HttpRequest 的一个实例，包含请求的所有元信息。
def index(request):
    latest_question_list = Question.objects.order_by("-pub_date")[:5] # 取出数据库中最新的 5 个问题（Question 实例）。
    context = {"latest_question_list": latest_question_list} 
    return render(request, "polls/index.html", context) # 快捷函数，省略了下面注释的内容
    # template = loader.get_template("polls/index.html") # 加载模板文件，返回一个“模板对象”     
    # # HttpResponse 是 Django 提供的响应对象，它会把内容返回给浏览器。
    # # template.render(context, request) 把数据填充进模板，生成最终的 HTML 字符串, request：当前请求对象（可选，但推荐传）
    # return HttpResponse(template.render(context, request)) 


def index_root(request):
    return HttpResponse("欢迎来到首页！<br/>来看看有什么问题: <br/> <li><a href='http://127.0.0.1:8000/polls/'>问题</a>")

def detail(request, question_id):
    question = get_object_or_404(Question, pk=question_id); # 快捷函数，省略下面注释步骤
    # try: 
    #     question = Question.objects.get(pk=question_id) # 关键字参数 Django 的 pk 永远指向模型的主键字段 id
    # except Question.DoesNotExist:
    #     raise Http404("该问题不存在")
    return render(request, "polls/detail.html", {"question": question})


def results(request, question_id):
    question = get_object_or_404(Question, pk=question_id)
    return render(request, "polls/results.html", {"question": question})


def vote(request, question_id):
    question = get_object_or_404(Question, pk=question_id)
    try:
        selected_choice = question.choice_set.get(pk=request.POST["choice"])
    except (KeyError, Choice.DoesNotExist):
        # Redisplay the question voting form.
        return render(
            request,
            "polls/detail.html",
            {
                "question": question,
                "error_message": "你还没有选择哦。",
            },
        )
    else:
        selected_choice.votes = F("votes") + 1
        selected_choice.save()
        # 在成功处理完 POST 数据后，
        # 始终返回一个 HttpResponseRedirect。
        # 这样可以防止用户点击“后退”按钮时数据被重复提交。 
        # reverse() 可以根据 URL 名字，让 Django 算出实际访问路径
        return HttpResponseRedirect(reverse("polls:results", args=(question.id,)))






