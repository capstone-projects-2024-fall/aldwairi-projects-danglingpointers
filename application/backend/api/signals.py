from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import User, Game

@receiver(post_save, sender=User)
def send_user_update(sender, instance, created, **kwargs):
    if created:
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            "users",
            {
                "type": "user_message",
                "message": "New user created",
            }
        )

# @receiver(post_save, sender=Game)
# def send_game_update(sender, instance, created, **kwargs):
#     if created:
#         channel_layer = get_channel_layer()
#         async_to_sync(channel_layer.group_send)(
#             "users",
#             {
#                 "type": "game_message",
#                 "message": "New game created",
#             }
#         )
