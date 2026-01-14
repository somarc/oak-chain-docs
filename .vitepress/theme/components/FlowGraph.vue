<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'

interface Node {
  id: string
  type: string
  x: number
  y: number
  label: string
  icon: string
  color: string
  description?: string
  data?: Record<string, string>
  radius?: number
}

interface Edge {
  from: string
  to: string
  type: string
  color: string
  label?: string
  style?: string
  width?: number
}

const props = defineProps<{
  flow: 'write' | 'payment' | 'ipfs' | 'consensus' | 'architecture' | 'gc-overview' | 'gc-compaction' | 'gc-generations' | 'gc-cleanup' | 'gc-modes'
  height?: number
  interactive?: boolean
}>()

const emit = defineEmits(['nodeClick'])

const svgRef = ref<SVGSVGElement | null>(null)
const hoveredNode = ref<Node | null>(null)
const nodes = ref<Node[]>([])
const edges = ref<Edge[]>([])
const isAnimating = ref(false)
const animationPackets = ref<{ id: string; x: number; y: number; color: string }[]>([])

const NODE_TYPES: Record<string, { icon: string; color: string }> = {
  USER: { icon: '👤', color: '#627EEA' },
  WALLET: { icon: '👛', color: '#f0b429' },
  AUTHOR: { icon: '✍️', color: '#8C8DFC' },
  VALIDATOR: { icon: '⚡', color: '#4ade80' },
  CONSENSUS: { icon: '🔄', color: '#627EEA' },
  OAK_STORE: { icon: '🌳', color: '#4ade80' },
  ETHEREUM: { icon: '⟠', color: '#627EEA' },
  CONTRACT: { icon: '📜', color: '#f85149' },
  IPFS: { icon: '🌐', color: '#65c2cb' },
  SEGMENT: { icon: '📦', color: '#8b949e' },
  CONTENT: { icon: '📄', color: '#e6edf3' },
  SIGNATURE: { icon: '🔐', color: '#f0b429' },
  TRANSACTION: { icon: '💸', color: '#4ade80' },
}

const EDGE_COLORS: Record<string, string> = {
  DATA: '#627EEA',
  CONTROL: '#8C8DFC',
  PAYMENT: '#f0b429',
  ASYNC: '#65c2cb',
}

const width = computed(() => {
  switch (props.flow) {
    case 'architecture': return 800
    case 'consensus': return 700
    case 'gc-overview': return 900
    case 'gc-compaction': return 950
    case 'gc-generations': return 900
    case 'gc-cleanup': return 900
    case 'gc-modes': return 900
    default: return 850
  }
})

const height = computed(() => props.height || 400)

function initFlow() {
  switch (props.flow) {
    case 'write':
      initWriteFlow()
      break
    case 'payment':
      initPaymentFlow()
      break
    case 'ipfs':
      initIPFSFlow()
      break
    case 'consensus':
      initConsensusFlow()
      break
    case 'architecture':
      initArchitectureFlow()
      break
    case 'gc-overview':
      initGCOverviewFlow()
      break
    case 'gc-compaction':
      initGCCompactionFlow()
      break
    case 'gc-generations':
      initGCGenerationsFlow()
      break
    case 'gc-cleanup':
      initGCCleanupFlow()
      break
    case 'gc-modes':
      initGCModesFlow()
      break
  }
}

function addNode(id: string, type: string, x: number, y: number, options: Partial<Node> = {}) {
  const nodeType = NODE_TYPES[type] || NODE_TYPES.CONTENT
  nodes.value.push({
    id,
    type,
    x,
    y,
    label: options.label || type,
    icon: options.icon || nodeType.icon,
    color: options.color || nodeType.color,
    description: options.description,
    data: options.data,
    radius: options.radius || 28,
  })
}

function addEdge(from: string, to: string, type: string = 'DATA', options: Partial<Edge> = {}) {
  edges.value.push({
    from,
    to,
    type,
    color: options.color || EDGE_COLORS[type] || EDGE_COLORS.DATA,
    label: options.label,
    style: options.style,
    width: options.width || 2,
  })
}

function initWriteFlow() {
  nodes.value = []
  edges.value = []
  
  addNode('author', 'AUTHOR', 70, 200, { label: 'Sling Author', description: 'Content editor creates/modifies content' })
  addNode('wallet', 'WALLET', 200, 100, { label: 'Author Wallet', description: 'Signs content with secp256k1 key' })
  addNode('proposal', 'SIGNATURE', 200, 300, { label: 'Write Proposal', description: 'Signed content change request' })
  addNode('leader', 'VALIDATOR', 380, 200, { label: 'Raft Leader', description: 'Receives and validates proposals' })
  addNode('consensus', 'CONSENSUS', 520, 100, { label: 'Log Replication', description: 'Proposal replicated to followers' })
  addNode('followers', 'VALIDATOR', 520, 300, { label: 'Followers', description: 'Replicate and acknowledge' })
  addNode('commit', 'TRANSACTION', 660, 200, { label: 'Commit', description: 'Entry committed to log' })
  addNode('oak', 'OAK_STORE', 780, 200, { label: 'Oak Store', description: 'Content persisted to segments' })
  
  addEdge('author', 'wallet', 'DATA', { label: 'content' })
  addEdge('author', 'proposal', 'DATA', { label: 'changes' })
  addEdge('wallet', 'proposal', 'CONTROL', { label: 'sign' })
  addEdge('proposal', 'leader', 'DATA', { label: 'submit' })
  addEdge('leader', 'consensus', 'CONTROL', { label: 'append' })
  addEdge('leader', 'followers', 'DATA', { label: 'replicate' })
  addEdge('consensus', 'commit', 'CONTROL', { label: 'majority' })
  addEdge('followers', 'commit', 'ASYNC', { label: 'ack' })
  addEdge('commit', 'oak', 'DATA', { label: 'apply' })
}

function initPaymentFlow() {
  nodes.value = []
  edges.value = []
  
  addNode('user', 'USER', 70, 180, { label: 'End User', description: 'Initiates content write via UI' })
  addNode('metamask', 'WALLET', 200, 180, { label: 'MetaMask', description: 'Signs Ethereum transaction' })
  addNode('contract', 'CONTRACT', 380, 180, { label: 'ValidatorPayment', description: 'Smart contract on Ethereum' })
  addNode('event', 'ETHEREUM', 520, 100, { label: 'PaymentReceived', description: 'Event emitted on-chain' })
  addNode('validators', 'VALIDATOR', 520, 260, { label: 'Validators', description: 'Monitor contract events' })
  addNode('authorize', 'SIGNATURE', 680, 180, { label: 'Write Authorized', description: 'Payment verified, write allowed' })
  
  addEdge('user', 'metamask', 'CONTROL', { label: 'connect' })
  addEdge('metamask', 'contract', 'PAYMENT', { label: 'ETH' })
  addEdge('contract', 'event', 'DATA', { label: 'emit' })
  addEdge('contract', 'validators', 'ASYNC', { label: 'notify' })
  addEdge('event', 'validators', 'DATA', { label: 'verify' })
  addEdge('validators', 'authorize', 'CONTROL', { label: 'allow' })
}

function initIPFSFlow() {
  nodes.value = []
  edges.value = []
  
  addNode('binary', 'CONTENT', 70, 180, { label: 'Binary Asset', description: 'Image, PDF, video uploaded' })
  addNode('author', 'AUTHOR', 200, 180, { label: 'Author IPFS', description: 'Author runs local IPFS node' })
  addNode('pin', 'IPFS', 350, 100, { label: 'Pin Locally', description: 'Binary pinned to author node' })
  addNode('cid', 'SEGMENT', 350, 260, { label: 'CID Generated', description: 'Content-addressed hash' })
  addNode('oak', 'OAK_STORE', 520, 180, { label: 'Oak Reference', description: 'CID stored as blob reference' })
  addNode('dht', 'IPFS', 680, 100, { label: 'DHT Announce', description: 'CID announced to network' })
  addNode('retrieve', 'USER', 680, 260, { label: 'Global Retrieve', description: 'Anyone can fetch via CID' })
  
  addEdge('binary', 'author', 'DATA', { label: 'upload' })
  addEdge('author', 'pin', 'CONTROL', { label: 'ipfs add' })
  addEdge('author', 'cid', 'DATA', { label: 'hash' })
  addEdge('pin', 'oak', 'ASYNC', { label: 'reference' })
  addEdge('cid', 'oak', 'DATA', { label: 'store CID' })
  addEdge('oak', 'dht', 'ASYNC', { label: 'announce' })
  addEdge('dht', 'retrieve', 'DATA', { label: 'discover' })
  addEdge('cid', 'retrieve', 'CONTROL', { label: 'address' })
}

function initConsensusFlow() {
  nodes.value = []
  edges.value = []
  
  addNode('follower', 'VALIDATOR', 120, 140, { label: 'Follower', description: 'Initial state, receives heartbeats' })
  addNode('candidate', 'CONSENSUS', 350, 80, { label: 'Candidate', description: 'Election timeout, requests votes' })
  addNode('leader', 'VALIDATOR', 580, 140, { label: 'Leader', description: 'Sends heartbeats, handles writes' })
  addNode('heartbeat', 'SIGNATURE', 350, 260, { label: 'Heartbeat', description: 'AppendEntries RPC (empty)' })
  addNode('election', 'TRANSACTION', 120, 320, { label: 'Election', description: 'RequestVote RPC to all nodes' })
  
  addEdge('follower', 'candidate', 'CONTROL', { label: 'timeout' })
  addEdge('candidate', 'leader', 'CONTROL', { label: 'majority votes' })
  addEdge('candidate', 'follower', 'ASYNC', { label: 'higher term' })
  addEdge('leader', 'follower', 'ASYNC', { label: 'higher term' })
  addEdge('leader', 'heartbeat', 'DATA', { label: 'send' })
  addEdge('heartbeat', 'follower', 'DATA', { label: 'reset timer' })
  addEdge('follower', 'election', 'CONTROL', { label: 'no heartbeat' })
  addEdge('election', 'candidate', 'DATA', { label: 'start' })
}

function initArchitectureFlow() {
  nodes.value = []
  edges.value = []
  
  // Authoring layer
  addNode('sling', 'AUTHOR', 100, 60, { label: 'Sling Author', description: 'Content authoring via JCR API' })
  addNode('metamask', 'WALLET', 260, 60, { label: 'MetaMask', description: 'Wallet for signing & payment' })
  
  // Storage layer
  addNode('validator1', 'VALIDATOR', 80, 180, { label: 'Validator 1', description: 'Raft consensus node (Leader)' })
  addNode('validator2', 'VALIDATOR', 220, 180, { label: 'Validator 2', description: 'Raft consensus node (Follower)' })
  addNode('validator3', 'VALIDATOR', 360, 180, { label: 'Validator 3', description: 'Raft consensus node (Follower)' })
  addNode('ipfs', 'IPFS', 500, 180, { label: 'IPFS', description: 'Binary storage via content addressing' })
  addNode('ethereum', 'ETHEREUM', 620, 60, { label: 'Ethereum', description: 'Payment verification on Sepolia' })
  
  // Delivery layer
  addNode('eds', 'CONTENT', 220, 300, { label: 'Edge Delivery', description: 'CDN delivery with 100 Lighthouse score' })
  
  addEdge('sling', 'validator1', 'DATA', { label: 'write' })
  addEdge('metamask', 'ethereum', 'PAYMENT', { label: 'pay' })
  addEdge('ethereum', 'validator2', 'ASYNC', { label: 'verify' })
  addEdge('validator1', 'validator2', 'CONTROL', { label: 'replicate' })
  addEdge('validator2', 'validator3', 'CONTROL', { label: 'replicate' })
  addEdge('validator3', 'ipfs', 'ASYNC', { label: 'store CID' })
  addEdge('validator2', 'eds', 'DATA', { label: 'serve' })
}

// ============================================================================
// GC FLOW INITIALIZERS
// ============================================================================

function initGCOverviewFlow() {
  nodes.value = []
  edges.value = []
  
  addNode('trigger', 'CONSENSUS', 70, 220, { label: 'GC Trigger', description: 'Scheduled or manual GC start' })
  addNode('estimation', 'SEGMENT', 210, 110, { label: 'Estimation', description: 'Calculate garbage ratio in store' })
  addNode('generation', 'TRANSACTION', 210, 330, { label: 'New Generation', description: 'Create new generation number' })
  addNode('compaction', 'OAK_STORE', 400, 220, { label: 'Compaction', description: 'Copy live data to new generation' })
  addNode('concurrent', 'AUTHOR', 400, 70, { label: 'Concurrent Writes', description: 'System continues accepting writes' })
  addNode('force', 'SIGNATURE', 400, 370, { label: 'Force Compact', description: 'Block writes if needed' })
  addNode('cleanup', 'VALIDATOR', 590, 220, { label: 'Cleanup', description: 'Delete old generation TAR files' })
  addNode('reclaimed', 'CONTENT', 750, 220, { label: 'Space Reclaimed', description: 'Disk space freed' })
  
  addEdge('trigger', 'estimation', 'CONTROL', { label: 'start' })
  addEdge('trigger', 'generation', 'DATA', { label: 'create' })
  addEdge('estimation', 'compaction', 'CONTROL', { label: 'if >25%' })
  addEdge('generation', 'compaction', 'DATA', { label: 'target gen' })
  addEdge('compaction', 'concurrent', 'ASYNC', { label: 'parallel' })
  addEdge('concurrent', 'compaction', 'DATA', { label: 'catch-up' })
  addEdge('compaction', 'force', 'CONTROL', { label: 'if stuck' })
  addEdge('force', 'cleanup', 'CONTROL', { label: 'complete' })
  addEdge('compaction', 'cleanup', 'DATA', { label: 'success' })
  addEdge('cleanup', 'reclaimed', 'DATA', { label: 'delete' })
}

function initGCCompactionFlow() {
  nodes.value = []
  edges.value = []
  
  addNode('journal', 'CONTENT', 70, 240, { label: 'Journal Head', description: 'Current repository state reference' })
  addNode('traverse', 'CONSENSUS', 200, 140, { label: 'Tree Traversal', description: 'Walk content tree from root' })
  addNode('checkpoints', 'SIGNATURE', 200, 340, { label: 'Checkpoints', description: 'Async indexing save points' })
  addNode('old_gen', 'SEGMENT', 370, 90, { label: 'Old Generation', description: 'Segments in previous generation' })
  addNode('reachable', 'VALIDATOR', 370, 240, { label: 'Reachability Check', description: 'Is segment referenced?' })
  addNode('garbage', 'TRANSACTION', 370, 390, { label: 'Garbage', description: 'Unreachable segments (70-90%)' })
  addNode('copy', 'OAK_STORE', 540, 160, { label: 'Copy Live Data', description: 'Write to new generation segments' })
  addNode('new_gen', 'SEGMENT', 700, 160, { label: 'New Generation', description: 'Compacted segments (10-30%)' })
  addNode('new_journal', 'CONTENT', 700, 320, { label: 'New Journal', description: 'Updated head reference' })
  
  addEdge('journal', 'traverse', 'DATA', { label: 'root' })
  addEdge('journal', 'checkpoints', 'DATA', { label: 'refs' })
  addEdge('traverse', 'old_gen', 'CONTROL', { label: 'read' })
  addEdge('checkpoints', 'reachable', 'DATA', { label: 'mark' })
  addEdge('old_gen', 'reachable', 'DATA', { label: 'check' })
  addEdge('reachable', 'garbage', 'ASYNC', { label: 'unreachable' })
  addEdge('reachable', 'copy', 'DATA', { label: 'live' })
  addEdge('copy', 'new_gen', 'DATA', { label: 'write' })
  addEdge('new_gen', 'new_journal', 'CONTROL', { label: 'commit' })
  addEdge('traverse', 'copy', 'CONTROL', { label: 'compact' })
}

function initGCGenerationsFlow() {
  nodes.value = []
  edges.value = []
  
  addNode('gen1', 'SEGMENT', 90, 130, { label: 'Generation 1', description: 'Oldest generation (to be deleted)' })
  addNode('gen2', 'SEGMENT', 90, 320, { label: 'Generation 2', description: 'Previous generation (retained)' })
  addNode('gen3', 'OAK_STORE', 280, 225, { label: 'Generation 3', description: 'Current generation (active)' })
  addNode('gc_cycle', 'CONSENSUS', 470, 130, { label: 'GC Cycle', description: 'Compaction creates new generation' })
  addNode('gen4', 'OAK_STORE', 660, 225, { label: 'Generation 4', description: 'New generation after GC' })
  addNode('delete', 'TRANSACTION', 470, 320, { label: 'Delete Gen 1', description: 'Oldest generation removed' })
  addNode('retain', 'VALIDATOR', 660, 370, { label: 'Retain 2 Gens', description: 'Safety buffer for readers' })
  
  addEdge('gen1', 'gc_cycle', 'ASYNC', { label: 'mark old' })
  addEdge('gen2', 'gen3', 'DATA', { label: 'refs' })
  addEdge('gen3', 'gc_cycle', 'DATA', { label: 'compact' })
  addEdge('gc_cycle', 'gen4', 'DATA', { label: 'create' })
  addEdge('gc_cycle', 'delete', 'CONTROL', { label: 'cleanup' })
  addEdge('delete', 'gen1', 'CONTROL', { label: 'remove' })
  addEdge('gen2', 'retain', 'ASYNC', { label: 'keep' })
  addEdge('gen4', 'retain', 'DATA', { label: 'new current' })
}

function initGCCleanupFlow() {
  nodes.value = []
  edges.value = []
  
  addNode('tar_files', 'SEGMENT', 70, 205, { label: 'TAR Files', description: 'Segment archive files on disk' })
  addNode('scan', 'CONSENSUS', 210, 110, { label: 'Scan TAR', description: 'Check each segment in TAR' })
  addNode('live_segs', 'OAK_STORE', 210, 300, { label: 'Live Segments', description: 'Still referenced by current gen' })
  addNode('dead_segs', 'TRANSACTION', 390, 205, { label: 'Dead Segments', description: 'Not referenced, reclaimable' })
  addNode('rewrite', 'VALIDATOR', 390, 350, { label: 'Rewrite TAR', description: 'Copy live segments to new TAR' })
  addNode('mark', 'SIGNATURE', 560, 110, { label: 'Mark Deletable', description: 'TAR file marked for removal' })
  addNode('reaper', 'CONSENSUS', 560, 300, { label: 'File Reaper', description: 'Background deletion thread' })
  addNode('deleted', 'CONTENT', 730, 205, { label: 'Files Deleted', description: 'Disk space reclaimed' })
  
  addEdge('tar_files', 'scan', 'DATA', { label: 'iterate' })
  addEdge('tar_files', 'live_segs', 'DATA', { label: 'check refs' })
  addEdge('scan', 'dead_segs', 'CONTROL', { label: 'unreachable' })
  addEdge('live_segs', 'rewrite', 'DATA', { label: 'if partial' })
  addEdge('dead_segs', 'mark', 'CONTROL', { label: 'empty TAR' })
  addEdge('rewrite', 'mark', 'ASYNC', { label: 'old TAR' })
  addEdge('mark', 'reaper', 'CONTROL', { label: 'queue' })
  addEdge('reaper', 'deleted', 'DATA', { label: 'unlink' })
}

function initGCModesFlow() {
  nodes.value = []
  edges.value = []
  
  // Online GC path (top)
  addNode('online_start', 'CONSENSUS', 70, 120, { label: 'Online GC', description: 'Runs while system is live' })
  addNode('estimation', 'SEGMENT', 230, 70, { label: 'Estimation', description: 'Check if GC needed' })
  addNode('tail_compact', 'OAK_STORE', 400, 70, { label: 'Tail Compaction', description: 'Compact recent revisions only' })
  addNode('full_compact', 'OAK_STORE', 400, 180, { label: 'Full Compaction', description: 'Compact all revisions' })
  addNode('retry_loop', 'VALIDATOR', 560, 120, { label: 'Retry Loop', description: 'Handle concurrent writes' })
  
  // Offline GC path (bottom)
  addNode('offline_start', 'TRANSACTION', 70, 350, { label: 'Offline GC', description: 'Exclusive access to store' })
  addNode('no_estimation', 'SIGNATURE', 230, 350, { label: 'Skip Estimation', description: 'Human decided GC needed' })
  addNode('offline_compact', 'OAK_STORE', 400, 350, { label: 'Full Compaction', description: 'No concurrent writes' })
  addNode('single_gen', 'SEGMENT', 560, 350, { label: 'Single Generation', description: 'Only 1 gen retained' })
  
  // Shared cleanup
  addNode('cleanup', 'VALIDATOR', 730, 235, { label: 'Cleanup', description: 'Delete old TAR files' })
  
  addEdge('online_start', 'estimation', 'CONTROL', { label: 'check' })
  addEdge('estimation', 'tail_compact', 'CONTROL', { label: 'tail mode' })
  addEdge('estimation', 'full_compact', 'CONTROL', { label: 'full mode' })
  addEdge('tail_compact', 'retry_loop', 'DATA', { label: 'concurrent' })
  addEdge('full_compact', 'retry_loop', 'DATA', { label: 'concurrent' })
  addEdge('retry_loop', 'cleanup', 'CONTROL', { label: 'success' })
  addEdge('offline_start', 'no_estimation', 'CONTROL', { label: 'skip' })
  addEdge('no_estimation', 'offline_compact', 'DATA', { label: 'always full' })
  addEdge('offline_compact', 'single_gen', 'DATA', { label: 'exclusive' })
  addEdge('single_gen', 'cleanup', 'CONTROL', { label: 'max cleanup' })
}

function getEdgePath(edge: Edge): string {
  const fromNode = nodes.value.find(n => n.id === edge.from)
  const toNode = nodes.value.find(n => n.id === edge.to)
  if (!fromNode || !toNode) return ''
  
  const dx = toNode.x - fromNode.x
  const dy = toNode.y - fromNode.y
  const dist = Math.sqrt(dx * dx + dy * dy)
  
  const offsetFrom = (fromNode.radius || 28) + 5
  const offsetTo = (toNode.radius || 28) + 15
  
  const startX = fromNode.x + (dx / dist) * offsetFrom
  const startY = fromNode.y + (dy / dist) * offsetFrom
  const endX = toNode.x - (dx / dist) * offsetTo
  const endY = toNode.y - (dy / dist) * offsetTo
  
  const midX = (startX + endX) / 2
  const midY = (startY + endY) / 2
  const curvature = 0.15
  const ctrlX = midX - dy * curvature
  const ctrlY = midY + dx * curvature
  
  return `M ${startX} ${startY} Q ${ctrlX} ${ctrlY} ${endX} ${endY}`
}

function getEdgeLabelPosition(edge: Edge): { x: number; y: number } {
  const fromNode = nodes.value.find(n => n.id === edge.from)
  const toNode = nodes.value.find(n => n.id === edge.to)
  if (!fromNode || !toNode) return { x: 0, y: 0 }
  
  const dx = toNode.x - fromNode.x
  const dy = toNode.y - fromNode.y
  const midX = (fromNode.x + toNode.x) / 2
  const midY = (fromNode.y + toNode.y) / 2
  const curvature = 0.15
  
  return {
    x: midX - dy * curvature,
    y: midY + dx * curvature - 8
  }
}

function getEdgeStrokeDasharray(edge: Edge): string {
  if (edge.type === 'CONTROL') return '8 4'
  if (edge.type === 'ASYNC') return '4 4'
  return 'none'
}

async function playAnimation() {
  if (isAnimating.value) return
  isAnimating.value = true
  
  const sequences: { from: string; to: string; color: string }[][] = {
    write: [
      [{ from: 'author', to: 'wallet', color: '#627EEA' }],
      [{ from: 'author', to: 'proposal', color: '#627EEA' }],
      [{ from: 'wallet', to: 'proposal', color: '#8C8DFC' }],
      [{ from: 'proposal', to: 'leader', color: '#627EEA' }],
      [{ from: 'leader', to: 'consensus', color: '#8C8DFC' }, { from: 'leader', to: 'followers', color: '#627EEA' }],
      [{ from: 'consensus', to: 'commit', color: '#8C8DFC' }, { from: 'followers', to: 'commit', color: '#65c2cb' }],
      [{ from: 'commit', to: 'oak', color: '#627EEA' }],
    ],
    payment: [
      [{ from: 'user', to: 'metamask', color: '#8C8DFC' }],
      [{ from: 'metamask', to: 'contract', color: '#f0b429' }],
      [{ from: 'contract', to: 'event', color: '#627EEA' }, { from: 'contract', to: 'validators', color: '#65c2cb' }],
      [{ from: 'event', to: 'validators', color: '#627EEA' }],
      [{ from: 'validators', to: 'authorize', color: '#8C8DFC' }],
    ],
    ipfs: [
      [{ from: 'binary', to: 'author', color: '#627EEA' }],
      [{ from: 'author', to: 'pin', color: '#8C8DFC' }, { from: 'author', to: 'cid', color: '#627EEA' }],
      [{ from: 'pin', to: 'oak', color: '#65c2cb' }, { from: 'cid', to: 'oak', color: '#627EEA' }],
      [{ from: 'oak', to: 'dht', color: '#65c2cb' }],
      [{ from: 'dht', to: 'retrieve', color: '#627EEA' }, { from: 'cid', to: 'retrieve', color: '#8C8DFC' }],
    ],
    consensus: [
      [{ from: 'follower', to: 'election', color: '#8C8DFC' }],
      [{ from: 'election', to: 'candidate', color: '#627EEA' }],
      [{ from: 'follower', to: 'candidate', color: '#8C8DFC' }],
      [{ from: 'candidate', to: 'leader', color: '#8C8DFC' }],
      [{ from: 'leader', to: 'heartbeat', color: '#627EEA' }],
      [{ from: 'heartbeat', to: 'follower', color: '#627EEA' }],
    ],
    architecture: [
      [{ from: 'sling', to: 'validator1', color: '#627EEA' }],
      [{ from: 'metamask', to: 'ethereum', color: '#f0b429' }],
      [{ from: 'ethereum', to: 'validator2', color: '#65c2cb' }],
      [{ from: 'validator1', to: 'validator2', color: '#8C8DFC' }],
      [{ from: 'validator2', to: 'validator3', color: '#8C8DFC' }],
      [{ from: 'validator3', to: 'ipfs', color: '#65c2cb' }],
      [{ from: 'validator2', to: 'eds', color: '#627EEA' }],
    ],
    'gc-overview': [
      [{ from: 'trigger', to: 'estimation', color: '#8C8DFC' }, { from: 'trigger', to: 'generation', color: '#627EEA' }],
      [{ from: 'estimation', to: 'compaction', color: '#8C8DFC' }, { from: 'generation', to: 'compaction', color: '#627EEA' }],
      [{ from: 'compaction', to: 'concurrent', color: '#65c2cb' }],
      [{ from: 'concurrent', to: 'compaction', color: '#627EEA' }],
      [{ from: 'compaction', to: 'cleanup', color: '#627EEA' }],
      [{ from: 'cleanup', to: 'reclaimed', color: '#627EEA' }],
    ],
    'gc-compaction': [
      [{ from: 'journal', to: 'traverse', color: '#627EEA' }, { from: 'journal', to: 'checkpoints', color: '#627EEA' }],
      [{ from: 'traverse', to: 'old_gen', color: '#8C8DFC' }],
      [{ from: 'checkpoints', to: 'reachable', color: '#627EEA' }, { from: 'old_gen', to: 'reachable', color: '#627EEA' }],
      [{ from: 'reachable', to: 'garbage', color: '#f85149' }],
      [{ from: 'reachable', to: 'copy', color: '#627EEA' }, { from: 'traverse', to: 'copy', color: '#8C8DFC' }],
      [{ from: 'copy', to: 'new_gen', color: '#627EEA' }],
      [{ from: 'new_gen', to: 'new_journal', color: '#8C8DFC' }],
    ],
    'gc-generations': [
      [{ from: 'gen1', to: 'gc_cycle', color: '#65c2cb' }],
      [{ from: 'gen2', to: 'gen3', color: '#627EEA' }],
      [{ from: 'gen3', to: 'gc_cycle', color: '#627EEA' }],
      [{ from: 'gc_cycle', to: 'gen4', color: '#627EEA' }],
      [{ from: 'gc_cycle', to: 'delete', color: '#8C8DFC' }],
      [{ from: 'delete', to: 'gen1', color: '#f85149' }],
      [{ from: 'gen2', to: 'retain', color: '#65c2cb' }, { from: 'gen4', to: 'retain', color: '#627EEA' }],
    ],
    'gc-cleanup': [
      [{ from: 'tar_files', to: 'scan', color: '#627EEA' }, { from: 'tar_files', to: 'live_segs', color: '#627EEA' }],
      [{ from: 'scan', to: 'dead_segs', color: '#8C8DFC' }],
      [{ from: 'live_segs', to: 'rewrite', color: '#627EEA' }],
      [{ from: 'dead_segs', to: 'mark', color: '#8C8DFC' }, { from: 'rewrite', to: 'mark', color: '#65c2cb' }],
      [{ from: 'mark', to: 'reaper', color: '#8C8DFC' }],
      [{ from: 'reaper', to: 'deleted', color: '#627EEA' }],
    ],
    'gc-modes': [
      [{ from: 'online_start', to: 'estimation', color: '#8C8DFC' }],
      [{ from: 'estimation', to: 'tail_compact', color: '#8C8DFC' }],
      [{ from: 'tail_compact', to: 'retry_loop', color: '#627EEA' }],
      [{ from: 'retry_loop', to: 'cleanup', color: '#8C8DFC' }],
      [{ from: 'offline_start', to: 'no_estimation', color: '#8C8DFC' }],
      [{ from: 'no_estimation', to: 'offline_compact', color: '#627EEA' }],
      [{ from: 'offline_compact', to: 'single_gen', color: '#627EEA' }],
      [{ from: 'single_gen', to: 'cleanup', color: '#8C8DFC' }],
    ],
  }
  
  const seq = sequences[props.flow] || []
  
  for (const step of seq) {
    await Promise.all(step.map(s => animatePacket(s.from, s.to, s.color)))
    await new Promise(r => setTimeout(r, 200))
  }
  
  isAnimating.value = false
}

async function animatePacket(fromId: string, toId: string, color: string): Promise<void> {
  const fromNode = nodes.value.find(n => n.id === fromId)
  const toNode = nodes.value.find(n => n.id === toId)
  if (!fromNode || !toNode) return
  
  const packetId = `${fromId}-${toId}-${Date.now()}`
  const duration = 600
  const startTime = performance.now()
  
  const dx = toNode.x - fromNode.x
  const dy = toNode.y - fromNode.y
  const dist = Math.sqrt(dx * dx + dy * dy)
  const offsetFrom = (fromNode.radius || 28) + 5
  const offsetTo = (toNode.radius || 28) + 15
  
  const startX = fromNode.x + (dx / dist) * offsetFrom
  const startY = fromNode.y + (dy / dist) * offsetFrom
  const endX = toNode.x - (dx / dist) * offsetTo
  const endY = toNode.y - (dy / dist) * offsetTo
  
  const midX = (startX + endX) / 2
  const midY = (startY + endY) / 2
  const curvature = 0.15
  const ctrlX = midX - dy * curvature
  const ctrlY = midY + dx * curvature
  
  return new Promise(resolve => {
    function animate() {
      const elapsed = performance.now() - startTime
      const t = Math.min(elapsed / duration, 1)
      
      // Quadratic bezier
      const x = (1-t)*(1-t)*startX + 2*(1-t)*t*ctrlX + t*t*endX
      const y = (1-t)*(1-t)*startY + 2*(1-t)*t*ctrlY + t*t*endY
      
      const existing = animationPackets.value.find(p => p.id === packetId)
      if (existing) {
        existing.x = x
        existing.y = y
      } else {
        animationPackets.value.push({ id: packetId, x, y, color })
      }
      
      if (t < 1) {
        requestAnimationFrame(animate)
      } else {
        animationPackets.value = animationPackets.value.filter(p => p.id !== packetId)
        resolve()
      }
    }
    requestAnimationFrame(animate)
  })
}

onMounted(() => {
  initFlow()
})
</script>

<template>
  <div class="flow-graph-container">
    <div class="flow-controls">
      <button class="flow-btn play-btn" @click="playAnimation" :disabled="isAnimating">
        <span>{{ isAnimating ? '⏳' : '▶' }}</span>
        <span>{{ isAnimating ? 'Playing...' : 'Play Animation' }}</span>
      </button>
    </div>
    
    <div class="flow-wrapper">
      <svg 
        ref="svgRef"
        :viewBox="`0 0 ${width} ${height}`"
        class="flow-svg"
      >
        <!-- Defs -->
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#627EEA" />
          </marker>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        <!-- Edges -->
        <g class="edges">
          <g v-for="edge in edges" :key="`${edge.from}-${edge.to}`">
            <path
              :d="getEdgePath(edge)"
              fill="none"
              :stroke="edge.color"
              :stroke-width="edge.width || 2"
              :stroke-dasharray="getEdgeStrokeDasharray(edge)"
              marker-end="url(#arrowhead)"
              class="edge-path"
            />
            <text
              v-if="edge.label"
              :x="getEdgeLabelPosition(edge).x"
              :y="getEdgeLabelPosition(edge).y"
              text-anchor="middle"
              class="edge-label"
            >
              {{ edge.label }}
            </text>
          </g>
        </g>
        
        <!-- Nodes -->
        <g class="nodes">
          <g 
            v-for="node in nodes" 
            :key="node.id"
            :transform="`translate(${node.x}, ${node.y})`"
            class="node"
            :class="{ hovered: hoveredNode?.id === node.id }"
            @mouseenter="hoveredNode = node"
            @mouseleave="hoveredNode = null"
            @click="emit('nodeClick', node)"
          >
            <!-- Glow -->
            <circle
              :r="(node.radius || 28) + 8"
              fill="none"
              :stroke="node.color"
              stroke-width="1"
              class="node-glow"
            />
            <!-- Main circle -->
            <circle
              :r="node.radius || 28"
              fill="#1a1a2e"
              :stroke="node.color"
              stroke-width="2"
              class="node-circle"
            />
            <!-- Icon -->
            <text
              text-anchor="middle"
              dominant-baseline="central"
              font-size="18"
              class="node-icon"
            >
              {{ node.icon }}
            </text>
            <!-- Label -->
            <text
              text-anchor="middle"
              :y="(node.radius || 28) + 18"
              class="node-label"
            >
              {{ node.label }}
            </text>
          </g>
        </g>
        
        <!-- Animation packets -->
        <g class="packets">
          <circle
            v-for="packet in animationPackets"
            :key="packet.id"
            :cx="packet.x"
            :cy="packet.y"
            r="6"
            :fill="packet.color"
            filter="url(#glow)"
            class="packet"
          />
        </g>
      </svg>
      
      <!-- Info panel -->
      <div v-if="hoveredNode && interactive !== false" class="info-panel">
        <div class="info-header">
          <span class="info-icon">{{ hoveredNode.icon }}</span>
          <span class="info-title">{{ hoveredNode.label }}</span>
        </div>
        <p v-if="hoveredNode.description" class="info-desc">{{ hoveredNode.description }}</p>
        <div v-if="hoveredNode.data" class="info-data">
          <div v-for="(value, key) in hoveredNode.data" :key="key" class="info-row">
            <span>{{ key }}:</span>
            <code>{{ value }}</code>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.flow-graph-container {
  margin: 1.5rem 0;
}

.flow-controls {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.flow-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: #1a1a2e;
  border: 1px solid rgba(98, 126, 234, 0.3);
  border-radius: 8px;
  color: #e6edf3;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.flow-btn:hover:not(:disabled) {
  background: #16213e;
  border-color: #627EEA;
  transform: translateY(-2px);
}

.flow-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.flow-btn.play-btn {
  background: linear-gradient(135deg, #627EEA, #8C8DFC);
  border: none;
  color: #fff;
  font-weight: 600;
}

.flow-btn.play-btn:hover:not(:disabled) {
  box-shadow: 0 4px 20px rgba(98, 126, 234, 0.4);
}

.flow-wrapper {
  position: relative;
  background: #0f0f23;
  border: 1px solid rgba(98, 126, 234, 0.2);
  border-radius: 12px;
  overflow: hidden;
}

.flow-svg {
  display: block;
  width: 100%;
  height: auto;
  background-image: 
    linear-gradient(rgba(98, 126, 234, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(98, 126, 234, 0.03) 1px, transparent 1px);
  background-size: 20px 20px;
}

.edge-path {
  transition: stroke-width 0.2s ease;
}

.edge-label {
  fill: rgba(255, 255, 255, 0.5);
  font-size: 10px;
  font-family: 'JetBrains Mono', monospace;
}

.node {
  cursor: pointer;
  transition: transform 0.2s ease;
}

.node:hover {
  transform: scale(1.05);
}

.node-glow {
  opacity: 0.2;
  transition: opacity 0.3s ease;
}

.node.hovered .node-glow {
  opacity: 0.5;
}

.node.hovered .node-circle {
  filter: url(#glow);
}

.node-circle {
  transition: filter 0.2s ease;
}

.node-icon {
  pointer-events: none;
}

.node-label {
  fill: rgba(255, 255, 255, 0.7);
  font-size: 10px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  pointer-events: none;
}

.packet {
  pointer-events: none;
}

.info-panel {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 220px;
  background: #16213e;
  border: 1px solid rgba(98, 126, 234, 0.3);
  border-radius: 10px;
  padding: 14px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  z-index: 10;
}

.info-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(98, 126, 234, 0.2);
}

.info-icon {
  font-size: 22px;
}

.info-title {
  font-weight: 600;
  font-size: 13px;
  color: #8C8DFC;
}

.info-desc {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 10px;
  line-height: 1.5;
}

.info-data {
  background: #0f0f23;
  border-radius: 6px;
  padding: 8px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  padding: 3px 0;
}

.info-row span {
  color: rgba(255, 255, 255, 0.5);
}

.info-row code {
  font-family: 'JetBrains Mono', monospace;
  color: #8C8DFC;
  font-size: 10px;
}

@media (max-width: 768px) {
  .info-panel {
    position: static;
    width: 100%;
    margin-top: 16px;
  }
}
</style>
