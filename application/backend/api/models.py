from django.db import models
from django.contrib.auth.models import User


class SecurityQuestion(models.Model):
    question = models.CharField(max_length=255)


class Item(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    icon = models.CharField(max_length=1, null=True, blank=True)
    cost = models.IntegerField()

    def __str__(self):
        return self.name


class Friendship(models.Model):
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='target_user'
    )
    friend = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='target_user_friend'
    )
    requestor = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, blank=True, related_name='friendship_requests'
    )  # This tracks who initiated the request
    status = models.CharField(
        max_length=10,
        choices=(
            ('Pending', 'Pending'),
            ('Accepted', 'Accepted'),
            ('Rejected', 'Rejected'),
            ('Inactive', 'Inactive'),
        )
    )
    date_request = models.DateTimeField(auto_now_add=True)
    date_response = models.DateTimeField(null=True, blank=True)

    @property
    def friend_username(self):
        return self.friend.username

    @property
    def user_username(self):
        return self.user.username




class UserMetaData(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    security_question = models.ForeignKey(
        SecurityQuestion, on_delete=models.CASCADE)
    security_answer = models.CharField(max_length=255)
    solo_games_played = models.IntegerField(default=0)
    solo_high_score = models.IntegerField(default=0)
    solo_high_time = models.IntegerField(default=0)
    versus_games_played = models.IntegerField(default=0)
    versus_high_score = models.IntegerField(default=0)
    versus_high_time = models.IntegerField(default=0)
    versus_wins = models.IntegerField(default=0)
    versus_losses = models.IntegerField(default=0)
    items = models.JSONField(null=True, blank=True)
    settings = models.JSONField(null=True, blank=True)
    user_points = models.IntegerField(default=0)
    is_online = models.BooleanField(default=False)
    profile_picture = models.URLField(max_length=500, blank=True, null=True)

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


class ChatMessage(models.Model):
    sender = models.ForeignKey(
        User, related_name="sender", on_delete=models.CASCADE)
    recipient = models.ForeignKey(
        User, related_name="recipient", on_delete=models.CASCADE)
    message = models.TextField()
    date = models.DateTimeField(auto_now_add=True)




class Comment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    username = models.CharField(max_length=150, editable=False, default="")  # Add username field
    date = models.DateTimeField(auto_now_add=True)
    comment = models.TextField()
    comment_type = models.CharField(
        max_length=7, blank=True, choices=(('Game', 'Game'), ('User', 'User')))
    content_id = models.IntegerField()

    def save(self, *args, **kwargs):
        # Automatically set the username field from the linked user
        if not self.username:
            self.username = self.user.username
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.username}: {self.comment[:20]}..."



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
    game_length = models.IntegerField(default=0)
    player_one_score = models.IntegerField(default=0)
    player_two_score = models.IntegerField(null=True, blank=True)
    winner = models.ForeignKey(
        User, related_name='game_winner', on_delete=models.SET_NULL, null=True, blank=True)
    trajectories = models.JSONField(null=True, blank=True)

    def __str__(self):
        return f"Game {self.id}: {self.mode}"
