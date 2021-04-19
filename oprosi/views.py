from django.shortcuts import redirect
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse
import json

from . import models as ms


@csrf_exempt
def api(request):
    txt = request.body.decode('utf-8')
    req = json.loads(txt)
    if req.get('action') is None:
        req['action'] = ''
    if req['action'] == 'saveQuestion':
        question = ms.MyQuestion()
        question.save()
        for field in req['fields']:
            qfield = ms.MyQuestionField(
                question_id=question.id,
                data=json.dumps(field)
            )
            qfield.save()
        res = {'questionId': question.id}
    elif req['action'] == 'saveAnswer':
        answer = ms.MyAnswer(
            question_id=req['questionId']
        )
        answer.save()
        for field in req['fields']:
            qfield = ms.MyAnswerField(
                answer_id=answer.id,
                field_id=field['id'],
                data=json.dumps(field['data'])
            )
            qfield.save()
        res = {'answerId': answer.id}
    elif req['action'] == 'getQuestion':
        fields = ms.MyQuestionField.objects.all().filter(
            question_id=req['questionId']
        )
        fields = [{'field': {
            'data': json.loads(field.data),
            'id': field.id
        }} for field in fields]
        for field in fields:
            field['count'] = ms.MyAnswerField.objects.all().filter(
                field_id=field['field']['id']
            ).count()
        fields = sorted(fields, key=lambda field: field['count'])
        fields = [field['field'] for field in fields]
        res = {'fields': fields}
    else:
        res = {'error': 'Unknown action'}
    txt = json.dumps(res, ensure_ascii=False)
    return HttpResponse(txt)


def redir(request):
    return redirect('/static/index.htm')
