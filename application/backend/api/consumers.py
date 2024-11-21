import json
from asgiref.sync import async_to_sync
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async


class ChatConsumer(AsyncWebsocketConsumer):
    async def receive(self, chat_data):
        chat_data_json = json.loads(chat_data)
        if chat_data_json.get('type') == 'chat':
            user_id = chat_data_json.get('user_id')
            message = chat_data_json.get('message')
            async_to_sync(self.channel_layer.group_send)(
                self.room_group_name,
                {
                    'type': 'chat_message',
                    'user_id': user_id,
                    'message': message,
                }
            )

    async def chat_message(self, event):
        user_id = event['user_id']
        message = event['message']
        await self.send(text_data=json.dumps({
            'type': 'chat',
            'user_id': user_id,
            'message': message,
        }))


class GameConsumer(AsyncWebsocketConsumer):
    async def receive(self, game_data):
        game_data_json = json.loads(game_data)
        if game_data_json.get('type') == 'game':
            game_id = game_data_json.get('game_id')
            async_to_sync(self.channel_layer.group_send)(
                self.room_group_name,
                {
                    'type': 'game_message',
                    'game_id': game_id,
                }
            )

    async def game_message(self, event):
        game_id = event['game_id']
        await self.send(text_data=json.dumps({
            'type': 'game',
            'game_id': game_id,
        }))


class ItemConsumer(AsyncWebsocketConsumer):
    async def receive(self, item_data):
        item_data_json = json.loads(item_data)

        if item_data_json['type'] == 'item':
            item_id = item_data_json['item_id']
            async_to_sync(self.channel_layer.group_send)(
                self.room_group_name,
                {
                    'type': 'item_message',
                    'item_id': item_id,
                }
            )

    async def item_message(self, event):
        item_id = event['item_id']
        await self.send(text_data=json.dumps({
            'type': 'item',
            "item_id": item_id,
        }))
