---
prev: /guide/binaries
next: /segment-gc
---

# Real-Time Streaming

Oak Chain provides Server-Sent Events (SSE) for real-time content discovery.

## SSE Feed

Subscribe to the live feed of all writes:

```bash
curl -N http://localhost:8090/v1/feed
```

### Event Format

```
event: write
data: {"path":"/oak-chain/74/2d/35/0xWALLET/org/content/page","timestamp":1704844800,"wallet":"0x742d35Cc...","tier":"express"}

event: write
data: {"path":"/oak-chain/ab/cd/ef/0xOTHER/brand/content/article","timestamp":1704844801,"wallet":"0xabcdef...","tier":"standard"}

event: heartbeat
data: {"timestamp":1704844810}
```

### Event Types

| Event | Description |
|-------|-------------|
| `write` | New content written |
| `delete` | Content deleted |
| `heartbeat` | Keep-alive (every 30s) |

## JavaScript Client

```javascript
const eventSource = new EventSource('http://localhost:8090/v1/feed');

eventSource.addEventListener('write', (event) => {
  const data = JSON.parse(event.data);
  console.log('New content:', data.path);
  console.log('By wallet:', data.wallet);
  console.log('Tier:', data.tier);
});

eventSource.addEventListener('delete', (event) => {
  const data = JSON.parse(event.data);
  console.log('Deleted:', data.path);
});

eventSource.onerror = (error) => {
  console.error('SSE error:', error);
  // EventSource auto-reconnects
};
```

## Filtering

### By Wallet

```bash
curl -N "http://localhost:8090/v1/feed?wallet=0x742d35Cc..."
```

Only events from that wallet.

### By Organization

```bash
curl -N "http://localhost:8090/v1/feed?wallet=0x742d35Cc...&org=PixelPirates"
```

Only events from that wallet's organization.

### By Path Prefix

```bash
curl -N "http://localhost:8090/v1/feed?prefix=/oak-chain/74"
```

Only events under that path prefix.

## Use Cases

### Content Sync

Keep a local cache in sync:

```javascript
const cache = new Map();

eventSource.addEventListener('write', (event) => {
  const { path, timestamp } = JSON.parse(event.data);
  cache.set(path, { timestamp, dirty: true });
  // Fetch full content when needed
});

eventSource.addEventListener('delete', (event) => {
  const { path } = JSON.parse(event.data);
  cache.delete(path);
});
```

### Real-Time Dashboard

```javascript
// React component
function LiveFeed() {
  const [events, setEvents] = useState([]);
  
  useEffect(() => {
    const es = new EventSource('/v1/feed');
    es.addEventListener('write', (e) => {
      setEvents(prev => [JSON.parse(e.data), ...prev].slice(0, 100));
    });
    return () => es.close();
  }, []);
  
  return (
    <ul>
      {events.map((e, i) => (
        <li key={i}>{e.path} by {e.wallet.slice(0, 10)}...</li>
      ))}
    </ul>
  );
}
```

### Webhook Bridge

Forward SSE to webhooks:

```javascript
const eventSource = new EventSource('http://localhost:8090/v1/feed');

eventSource.addEventListener('write', async (event) => {
  const data = JSON.parse(event.data);
  
  await fetch('https://your-webhook.com/oak-chain', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
});
```

## Reconnection

SSE auto-reconnects on disconnect. The `Last-Event-ID` header enables resumption:

```javascript
// Browser handles this automatically
// For Node.js, use eventsource package with lastEventId
```

## Rate Limits

| Limit | Value |
|-------|-------|
| Connections per IP | 10 |
| Events per second | 1000 |
| Backpressure | Events queued, oldest dropped |

## Next Steps

- [Content Paths](/guide/paths) - Path structure
- [Economics](/guide/economics) - Payment tiers
