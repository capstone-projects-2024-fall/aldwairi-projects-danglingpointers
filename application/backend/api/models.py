from django.db import models
from django.contrib.auth.models import User

class SecurityQuestion(models.Model):
    question = models.CharField(max_length=255)

class UserMetaData(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    security_question = models.ForeignKey(SecurityQuestion, on_delete=models.CASCADE)
    security_answer = models.CharField(max_length=255)
    solo_games_played = models.IntegerField(default=0)
    solo_high_score = models.IntegerField(default=0)
    solo_high_time = models.IntegerField(default=0)
    versus_games_played = models.IntegerField(default=0)
    versus_high_score = models.IntegerField(default=0)
    versus_high_time = models.IntegerField(default=0)
    versus_wins = models.IntegerField(default=0)
    versus_losses = models.IntegerField(default=0)
    items = models.ManyToManyField('Item')
    item_history = models.JSONField()
    settings = models.JSONField()
    user_points = models.IntegerField(default=0)

    @property
    def total_games_played(self):
        return self.solo_games_played + self.versus_games_played

    @property
    def success_rate(self):
        total_games = self.versus_games_played
        if total_games == 0:
            return 0
        return round((self.versus_wins / total_games) * 100, 2)

    @property
    def failure_rate(self):
        total_games = self.total_games_played
        if total_games == 0:
            return 0
        return round((self.versus_losses / total_games) * 100, 2)

    def __str__(self):
        return f"{self.user.username}'s metadata"


class Game(models.Model):
    mode = models.CharField(max_length=50, choices=(
        ('Solo', 'Solo'),
        ('Versus', 'Versus'),
    ))
    player_one = models.ForeignKey(
        User, related_name='player_one', on_delete=models.CASCADE)
    player_two = models.ForeignKey(
        User, related_name='player_two', on_delete=models.CASCADE, null=True, blank=True)
    public = models.BooleanField(default=True)
    date = models.DateTimeField(auto_now_add=True)
    link = models.URLField(max_length=200, blank=True, null=True)
    status = models.CharField(max_length=50, choices=(
        ('Active', 'Active'),
        ('Pending', 'Pending'),
        ('Complete', 'Complete'),
    ))
    game_length = models.IntegerField()
    player_one_score = models.IntegerField()
    player_two_score = models.IntegerField(null=True, blank=True)
    winner = models.ForeignKey(
        User, related_name='game_winner', on_delete=models.SET_NULL, null=True, blank=True)
    trajectories = models.JSONField(null=True, blank=True)

    def __str__(self):
        return f"Game {self.id}: {self.mode}"


class Item(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    cost = models.IntegerField()

    def __str__(self):
        return self.name