from django.db import models
from django.db.models import Model as PreModel
from django.db.models import IntegerField as Int
from django.db.models import TextField as String

class Types:
	TEXT = 0

class MyQuestion(PreModel):
	id = models.AutoField(primary_key = True)
	def __str__(self):
		return f'<{self.id}>'

class MyQuestionField(PreModel):
	id = models.AutoField(primary_key = True)
	question = models.ForeignKey(MyQuestion, on_delete=models.CASCADE)
	name = String()
	type = Int(default = Types.TEXT)
	def __str__(self):
		return f'<{self.question_id}> {self.name} [{self.id}]'

class MyAnswer(PreModel):
	id = models.AutoField(primary_key = True)
	question = models.ForeignKey(MyQuestion, on_delete=models.CASCADE)
	def __str__(self):
		return f'<{self.question_id}> <<{self.id}>>'

class MyAnswerField(PreModel):
	id = models.AutoField(primary_key = True)
	answer = models.ForeignKey(MyAnswer, on_delete=models.CASCADE)
	field = models.ForeignKey(MyQuestionField, on_delete=models.CASCADE)
	data = String()
	def __str__(self):
		return f'<<{self.answer_id}>> [{self.field_id}] {self.data}'
