import datetime
from django.db import models
from django.contrib.auth.models import User

class Board(models.Model):
    owner = models.ForeignKey(User)
    title = models.CharField(max_length=70)

    def __unicode__(self):
        return self.title

class Card(models.Model):
    board = models.ForeignKey(Board, null=False, related_name='cards')
    title = models.CharField(max_length=140)
    content = models.TextField()
    pub_date = models.DateTimeField(auto_now=True,editable=False)

    def save(self, *args, **kwargs):
        if not self.id:
            self.created = datetime.datetime.today()
        self.modified = datetime.datetime.today()
        super(Card, self).save(*args, **kwargs)

    def __unicode__(self):
        return "%s -> %s -- %s" % (self.board, self.title, self.content)

