from django.contrib import admin
from trelloclone.models import Board, Card 

class CardInline(admin.TabularInline):
    model = Card

class BoardAdmin(admin.ModelAdmin):
    inlines = [CardInline,]

class CardAdmin(admin.ModelAdmin):
    pass

admin.site.register(Board, BoardAdmin)
admin.site.register(Card, CardAdmin)
