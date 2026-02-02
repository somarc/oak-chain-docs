---
prev: /guide/binaries
next: /segment-gc
---

# Real-Time Streaming

Oak Chain provides Server-Sent Events (SSE) for real-time content discovery.

## SSE Feed

Subscribe to the live event stream:

```bash
curl -N http://localhost:8090/v1/events/stream
```

### Event Format

```
event: content
data: {"id":"1704844800","type":"content","action":"write","path":"/oak-chain/74/2d/35/0xWALLET/org/content/page","wallet":"0x742d35Cc...","timestamp":1704844800}

event: delete
data: {"id":"1704844801","type":"delete","action":"delete","path":"/oak-chain/ab/cd/ef/0xOTHER/brand/content/article","wallet":"0xabcdef...","timestamp":1704844801}

event: binary
data: {"id":"1704844802","type":"binary","action":"write","path":"/oak-chain/...","wallet":"0x742d35Cc...","ipfsCid":"Qm..."}
```

### Event Types

| Event | Description |
|-------|-------------|
| `content` | Content writes |
| `delete` | Content deletions |
| `binary` | Binary/CID events |
| `wallet` | Wallet registration |
| `consensus` | Leader/commit events |

## JavaScript Client

```javascript
const eventSource = new EventSource('http://localhost:8090/v1/events/stream');

eventSource.addEventListener('content', (event) => {
  const data = JSON.parse(event.data);
  console.log('New content:', data.path);
  console.log('By wallet:', data.wallet);
  console.log('Action:', data.action);
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
curl -N "http://localhost:8090/v1/events/stream?wallets=0x742d35Cc..."
```

Only events from that wallet.

### By Organization

```bash
curl -N "http://localhost:8090/v1/events/stream?wallets=0x742d35Cc...&organizations=PixelPirates"
```

Only events from that wallet's organization.

### By Path Prefix

```bash
curl -N "http://localhost:8090/v1/events/stream?path=/oak-chain/74"
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
    const es = new EventSource('/v1/events/stream');
    es.addEventListener('content', (e) => {
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
const eventSource = new EventSource('http://localhost:8090/v1/events/stream');

eventSource.addEventListener('content', async (event) => {
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
