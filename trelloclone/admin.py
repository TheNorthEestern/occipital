from django.contrib import admin
from .models import Wall, Board, Card 

class BoardInline(admin.TabularInline):
    model = Board

class CardInline(admin.TabularInline):
    model = Card

class WallAdmin(admin.ModelAdmin):
    inlines = [BoardInline,]

class BoardAdmin(admin.ModelAdmin):
    inlines = [CardInline,]

class CardAdmin(admin.ModelAdmin):
    pass

admin.site.register(Wall,WallAdmin,)
admin.site.register(Board, BoardAdmin,)
admin.site.register(Card, CardAdmin,)
