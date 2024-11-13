from django.urls import re_path
from . import consumers

'''
Path will be declared in frontend
let url = `ws://${window.location.host}/ws/socket-server/`;
const chatSocket = new WebSocket(url);
'''
websocket_urlpatterns = [
    re_path(r'ws/chat-server/', consumers.ChatConsumer.as_asgi()), 
    re_path(r'ws/item-server/', consumers.ItemConsumer.as_asgi()), 
    re_path(r'ws/game-server/', consumers.GameConsumer.as_asgi()) 
]