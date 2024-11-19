import json
import asyncio
from asgiref.sync import async_to_sync, sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        pass

    async def disconnect(self, close_code):
        pass

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        if 'message_id' in text_data_json:
            message_id = text_data_json['message_id']
        message = text_data_json['message']

        if text_data_json['type'] == 'approve':
            async_to_sync(self.channel_layer.group_send)(
                self.room_group_name,
                {
                    'type': 'approve_message',
                    'message_id': message_id,
                    'message': message
                }
            )
        elif text_data_json['type'] == 'reject':
            async_to_sync(self.channel_layer.group_send)(
                self.room_group_name,
                {
                    'type': 'reject_message',
                    'message': message
                }
            )
        elif text_data_json['type'] == 'complete':
            async_to_sync(self.channel_layer.group_send)(
                self.room_group_name,
                {
                    'type': 'complete_message',
                    'message_id': message_id,
                    'message': message
                }
            )
        else:
            async_to_sync(self.channel_layer.group_send)(
                self.room_group_name,
                {
                    'type': 'chat_message',
                    'message': message
                }
            )
        pass
class ItemConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        pass

    async def disconnect(self, close_code):
        pass

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        if 'message_id' in text_data_json:
            message_id = text_data_json['message_id']
        message = text_data_json['message']

        if text_data_json['type'] == 'approve':
            async_to_sync(self.channel_layer.group_send)(
                self.room_group_name,
                {
                    'type': 'approve_message',
                    'message_id': message_id,
                    'message': message
                }
            )
        elif text_data_json['type'] == 'reject':
            async_to_sync(self.channel_layer.group_send)(
                self.room_group_name,
                {
                    'type': 'reject_message',
                    'message': message
                }
            )
        elif text_data_json['type'] == 'complete':
            async_to_sync(self.channel_layer.group_send)(
                self.room_group_name,
                {
                    'type': 'complete_message',
                    'message_id': message_id,
                    'message': message
                }
            )
        else:
            async_to_sync(self.channel_layer.group_send)(
                self.room_group_name,
                {
                    'type': 'item_message',
                    'message': message
                }
            )
        pass