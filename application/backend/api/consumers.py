import json
from channels.generic.websocket import AsyncWebsocketConsumer
from api.models import Item
from asgiref.sync import sync_to_async


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        pass

    async def disconnect(self, close_code):
        pass

    async def receive(self, text_data):
        data = json.loads(text_data)
        type = data.get('type')
        message = data.get('message', '')
        user_id = data.get('user_id', None)

        if type == 'chat_message' and user_id:
            #create an event
            event = {
                'user_id': user_id,
                'message': message
            }
            await self.chat_message(event)
        else:
             await self.send(text_data=json.dumps({
                    'error': 'user_id or type is missing.'
                }))

    async def chat_message(self, event):
        message = event['message']
        user_id = event['user_id']
        await self.send(text_data=json.dumps({
            'type': 'chat',
            'message': message,
            'user_id': user_id,
        }))
    
class GameConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        pass

    async def disconnect(self, close_code):
        pass

    async def receive(self, text_data):
        data = json.loads(text_data)

        if data.get('type') == 'game_message':
            game_id = data.get('game_id', None)
            if game_id:
                await self.game_message({'message_id': game_id})
            else:
                await self.send(text_data=json.dumps({
                    'error': 'game_id is required for game_message type.'
                }))

    async def game_message(self, event):
        game_id = event['message_id']
        await self.send(text_data=json.dumps({
            'type': 'game',
            'game_id': game_id,
        }))

class ItemConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        pass

    async def disconnect(self, close_code):
        pass

    async def receive(self, text_data):
        pass
    async def item_message(self, event):
        item_id = event['item_id']
        item = await sync_to_async(self.get_item_by_id)(item_id)# fetch item from db

        if item:
            # Send item details
            await self.send(text_data=json.dumps({
                'type': 'item',
                'item': {
                    'id': item.id,
                    'name': item.name,
                    'description': item.description,
                    'icon': item.icon,
                    'cost': item.cost,
                },
            }))
        else:
                # Send error when item is not found
            await self.send(text_data=json.dumps({
                'error': f'Item with ID {item_id} not found.'
            }))

    def get_item_by_id(self, item_id):
        try:
            return Item.objects.get(id=item_id)
        except Item.DoesNotExist:
            return None
