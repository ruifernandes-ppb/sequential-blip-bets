/**
 * Dummy WebSocket service for POC demo purposes
 * Simulates real-time connection for live match updates
 */

class DummyWebSocketService {
  private ws: WebSocket | null = null;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private url: string;
  private isConnected: boolean = false;

  constructor(url: string = 'wss://api.sequentialbetting.demo/live') {
    this.url = url;
  }

  connect() {
    if (this.ws?.readyState === WebSocket.OPEN) {
      console.log('[WebSocket] Already connected');
      return;
    }

    console.log('[WebSocket] Attempting to connect to:', this.url);

    try {
      // Create a dummy WebSocket connection
      // In a real scenario, this would connect to an actual server
      // For demo purposes, we'll simulate the connection
      this.simulateConnection();
    } catch (error) {
      console.error('[WebSocket] Connection error:', error);
      this.scheduleReconnect();
    }
  }

  private simulateConnection() {
    // Simulate connection establishment
    setTimeout(() => {
      this.isConnected = true;
      console.log('[WebSocket] Connected successfully');
      this.onOpen();
      this.startHeartbeat();
    }, 100);
  }

  private onOpen() {
    console.log('[WebSocket] Connection opened');

    // Simulate sending authentication message
    setTimeout(() => {
      this.send({
        type: 'auth',
        token: 'demo_token_' + Date.now(),
      });
    }, 200);

    // Simulate receiving welcome message
    setTimeout(() => {
      this.onMessage({
        type: 'welcome',
        message: 'Connected to Sequential Betting Live Updates',
        timestamp: new Date().toISOString(),
      });
    }, 300);

    // Simulate subscribing to match updates
    setTimeout(() => {
      this.send({
        type: 'subscribe',
        channels: ['matches', 'bets', 'live_events'],
      });
    }, 500);

    // Simulate receiving upcoming matches data
    setTimeout(() => {
      this.onMessage({
        type: 'matches_update',
        data: {
          upcoming: [
            {
              id: 'chelsea-arsenal-2025',
              date: '2025-11-30T16:30:00Z',
              player1: 'Chelsea',
              player2: 'Arsenal',
              player1Sets: 0,
              player2Sets: 0,
              player1Games: 0,
              player2Games: 0,
              player1Points: '0',
              player2Points: '0',
              currentSet: 0,
              tournament: 'English Premier League',
              isLive: false,
            },
            {
              id: 'manchester-city-leeds-2025',
              date: '2025-12-01T15:00:00Z',
              player1: 'Manchester City',
              player2: 'Leeds United',
              player1Sets: 0,
              player2Sets: 0,
              player1Games: 0,
              player2Games: 0,
              player1Points: '0',
              player2Points: '0',
              currentSet: 0,
              tournament: 'English Premier League',
              isLive: false,
            },
          ],
          live: [],
        },
        timestamp: new Date().toISOString(),
      });
    }, 700);
  }

  private onMessage(data: any) {
    console.log('[WebSocket] Message received:', data);
  }

  private onError(error: any) {
    console.error('[WebSocket] Error:', error);
  }

  private onClose() {
    console.log('[WebSocket] Connection closed');
    this.isConnected = false;
    this.stopHeartbeat();
    this.scheduleReconnect();
  }

  send(data: any) {
    if (!this.isConnected) {
      console.warn('[WebSocket] Not connected, cannot send message');
      return;
    }

    console.log('[WebSocket] Sending message:', data);
    // In real implementation, this would be: this.ws?.send(JSON.stringify(data));
  }

  private startHeartbeat() {
    this.heartbeatInterval = setInterval(() => {
      if (this.isConnected) {
        console.log('[WebSocket] Sending heartbeat');
        this.send({ type: 'ping', timestamp: Date.now() });

        // Simulate receiving pong
        setTimeout(() => {
          this.onMessage({ type: 'pong', timestamp: Date.now() });
        }, 50);
      }
    }, 30000); // Every 30 seconds
  }

  private stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  private scheduleReconnect() {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }

    console.log('[WebSocket] Scheduling reconnect in 5 seconds...');
    this.reconnectTimeout = setTimeout(() => {
      console.log('[WebSocket] Attempting to reconnect...');
      this.connect();
    }, 5000);
  }

  disconnect() {
    console.log('[WebSocket] Disconnecting...');
    this.isConnected = false;
    this.stopHeartbeat();

    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }

    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  // Simulate receiving live match events
  simulateMatchEvent(matchId: string, event: any) {
    if (!this.isConnected) return;

    this.onMessage({
      type: 'match_event',
      matchId,
      event,
      timestamp: new Date().toISOString(),
    });
  }

  // Simulate receiving bet updates
  simulateBetUpdate(betId: string, status: string) {
    if (!this.isConnected) return;

    this.onMessage({
      type: 'bet_update',
      betId,
      status,
      timestamp: new Date().toISOString(),
    });
  }
}

// Export singleton instance
export const websocketService = new DummyWebSocketService();

// Auto-connect on module load (for demo purposes)
if (typeof window !== 'undefined') {
  setTimeout(() => {
    websocketService.connect();
  }, 1000);
}
