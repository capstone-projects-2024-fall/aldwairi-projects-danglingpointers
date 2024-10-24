from django.db import models
from django.contrib.auth.models import User

class UserMetaData(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    security_question = models.CharField(max_length=255)
    security_answer = models.CharField(max_length=255)
    solo_games_played = models.IntegerField(default=0)
    solo_high_score = models.IntegerField(default=0)
    solo_high_time = models.IntegerField(default=0)  #seconds
    versus_games_played = models.IntegerField(default=0)
    versus_wins = models.IntegerField(default=0)
    versus_losses = models.IntegerField(default=0)
    total_games = models.IntegerField(default=0)
    versus_high_score = models.IntegerField(default=0)
    versus_high_time = models.IntegerField(default=0)
    items = models.ManyToManyField('Item')
    item_history = models.JSONField()  
    settings = models.JSONField()  #New field

    def __str__(self):
        return f"{self.user.username}'s metadata"

class Game(models.Model):
    mode = models.CharField(max_length=50)  # e.g., 'solo', 'versus'
    player_one = models.ForeignKey(User, related_name='player_one', on_delete=models.CASCADE)
    player_two = models.ForeignKey(User, related_name='player_two', on_delete=models.CASCADE, null=True, blank=True)
    public = models.BooleanField(default=True)
    date = models.DateTimeField(auto_now_add=True)
    link = models.URLField(max_length=200, blank=True, null=True)
    status = models.CharField(max_length=50)
    game_length = models.IntegerField()  #time in seconds
    player_one_score = models.IntegerField()
    player_two_score = models.IntegerField(null=True, blank=True)
    winner = models.ForeignKey(User, related_name='game_winner', on_delete=models.SET_NULL, null=True, blank=True)
    trajectories = models.JSONField()  

    def __str__(self):
        return f"Game {self.id}: {self.mode}"

class LeaderboardVersus(models.Model):
    game = models.ForeignKey(Game, on_delete=models.CASCADE)

class LeaderboardSolo(models.Model):
    game = models.ForeignKey(Game, on_delete=models.CASCADE)

class Item(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    cost = models.IntegerField()

    def __str__(self):
        return self.name
