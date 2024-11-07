from django.urls import re_path
from . import consumers

'''
Path will be declared in frontend
let url = `ws://${window.location.host}/ws/socket-server/`;
const chatSocket = new WebSocket(url);
'''
websocket_urlpatterns = [
    re_path(r'ws/socket-server/', consumers.ChatConsumer.as_asgi()) 
]