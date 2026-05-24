import { useEffect, useRef } from 'react';
import { Client } from '@stomp/stompjs';

export function useWebSocket(userId, onFraudAlert) {
  const clientRef = useRef(null);

  useEffect(() => {
    if (!userId) return;

    const client = new Client({
      // Fix: use brokerURL instead of webSocketFactory + SockJS
      // avoids SockJS import issue in newer versions
      brokerURL: 'ws://localhost:8080/ws/websocket',
      
      onConnect: () => {
        console.log('WebSocket connected');
        client.subscribe(`/topic/fraud/${userId}`, (msg) => {
          try {
            const alert = JSON.parse(msg.body);
            if (onFraudAlert) onFraudAlert(alert);
          } catch (e) {
            console.error('WebSocket message parse error:', e);
          }
        });
      },

      onDisconnect: () => console.log('WebSocket disconnected'),
      onStompError: (frame) => console.error('STOMP error:', frame),
      reconnectDelay: 5000,
    });

    client.activate();
    clientRef.current = client;

    return () => {
      if (clientRef.current) {
        clientRef.current.deactivate();
      }
    };
  }, [userId]);
}