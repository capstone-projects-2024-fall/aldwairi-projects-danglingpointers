import json
from channels.generic.websocket import AsyncWebsocketConsumer


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_group_name = 'chat'
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()
        await self.send(text_data=json.dumps({
            'type': 'connected',
            'message': 'Django ChatConsumer connected!',
        }))
    
    async def receive(self, text_data):
        chat_data_json = json.loads(text_data)
        if chat_data_json.get('type') == 'chat':
            user_id = chat_data_json.get('user_id')
            message = chat_data_json.get('message')
            await self.channel_layer.group_send (
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
    async def connect(self):
        self.room_group_name = 'game'
        
        await self.channel_layer.group_add (
            self.room_group_name,
            self.channel_name
        )

        await self.accept()
        await self.send(text_data=json.dumps({
            'type': 'connected',
            'message': 'Django ItemConsumer connected!',
        }))
        
    async def receive(self, text_data):
        game_data_json = json.loads(text_data)
        if game_data_json.get('type') == 'game':
            game_id = game_data_json.get('game_id')
            await self.channel_layer.group_send (
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
    async def connect(self):
        self.room_group_name = 'item'
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()
        await self.send(text_data=json.dumps({
            'type': 'connected',
            'message': 'Django ItemConsumer connected!',
        }))
        
    async def receive(self, text_data):
        item_data_json = json.loads(text_data)

        if item_data_json['type'] == 'item':
            item_id = item_data_json['item_id']
            await self.channel_layer.group_send(
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
