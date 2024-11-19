import json
from asgiref.sync import async_to_sync
from channels.generic.websocket import AsyncWebsocketConsumer

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        pass

    async def disconnect(self, close_code):
        pass

    async def receive(self, text_data):
        pass
class ItemConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        pass

    async def disconnect(self, close_code):
        pass

    async def receive(self, item_data):
        text_data_json = json.loads(item_data)
        if 'item_id' in text_data_json:
            item_id = text_data_json['item_id']

        if text_data_json['type'] == 'item':
            async_to_sync(self.channel_layer.group_send)(
                self.room_group_name,
                {
                    'type': 'item',
                    'message': item_id,
                }
            )
