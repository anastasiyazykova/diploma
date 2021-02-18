from django.contrib import admin
from django.db.models.base import ModelBase
from . import models

def addSheets():
	sheets = dir(models)
	for sheet in sheets:
		obj = getattr(models, sheet)
		if isinstance(obj, ModelBase):
			try:
				admin.site.register(obj)
			except AttributeError:
				pass
	pass

addSheets()
