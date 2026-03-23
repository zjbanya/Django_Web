from django.db.models import F
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render, get_object_or_404
from .models import Question, Choice
from django.template import loader
from django.http import Http404
from django.urls import reverse
from django.views import generic

################## python 语法
# 关键字参数：实参必须显示指定形参名，形式 -- 形参名 = 
# 
##################

class IndexView(generic.ListView):
    template_name = "polls/index.html"
    context_object_name = "latest_question_list"

    def get_queryset(self):
        """Return the last five published questions."""
        return Question.objects.order_by("-pub_date")[:5]


class DetailView(generic.DetailView):
    model = Question
    template_name = "polls/detail.html"


class ResultsView(generic.DetailView):
    model = Question
    template_name = "polls/results.html"

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






