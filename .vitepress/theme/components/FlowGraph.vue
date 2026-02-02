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
  flow: 'write' | 'payment' | 'ipfs' | 'consensus' | 'architecture' | 'gc-overview' | 'gc-compaction' | 'gc-generations' | 'gc-cleanup' | 'gc-modes' | 'aem-integration' | 'binary-flow' | 'validator-auth' | 'two-models' | 'json-to-jcr'
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
  AEM: { icon: '🏢', color: '#fa0f00' },
  CDN: { icon: '🌍', color: '#f48120' },
  PASSKEY: { icon: '🔑', color: '#a855f7' },
  EDS: { icon: '⚡', color: '#00c7b7' },
  AZURE: { icon: '☁️', color: '#0078d4' },
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
    case 'aem-integration': return 900
    case 'binary-flow': return 950
    case 'validator-auth': return 800
    case 'two-models': return 950
    case 'json-to-jcr': return 900
    default: return 850
  }
})

const height = computed(() => props.height || 400)

function handleNodeEnter(node: Node) {
  hoveredNode.value = node
  // No scaling - nodes remain stationary
}

function handleNodeLeave(node: Node) {
  hoveredNode.value = null
}

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
    case 'aem-integration':
      initAEMIntegrationFlow()
      break
    case 'binary-flow':
      initBinaryFlow()
      break
    case 'validator-auth':
      initValidatorAuthFlow()
      break
    case 'two-models':
      initTwoModelsFlow()
      break
    case 'json-to-jcr':
      initJsonToJcrFlow()
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
  
  addNode('author', 'AUTHOR', 70, 200, { label: 'Author', description: 'Content editor (AEM Connector or SDK)' })
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
  addNode('sling', 'AUTHOR', 100, 60, { label: 'Author', description: 'AEM Connector or Oak Chain SDK' })
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
  
  // Consensus-based GC flow (Oak Chain specific)
  addNode('epoch', 'ETHEREUM', 70, 220, { label: 'Epoch Finalization', description: 'Ethereum epoch triggers GC check' })
  addNode('leader', 'VALIDATOR', 210, 120, { label: 'Raft Leader', description: 'Only leader can propose GC' })
  addNode('gc_proposal', 'SIGNATURE', 210, 320, { label: 'GC Proposal', description: 'Signed compaction proposal' })
  addNode('raft', 'CONSENSUS', 400, 220, { label: 'Raft Consensus', description: 'Proposal replicated to all validators' })
  addNode('deterministic', 'VALIDATOR', 400, 90, { label: 'Deterministic', description: 'All nodes apply same GC' })
  addNode('local_gc', 'OAK_STORE', 400, 350, { label: 'Local Compaction', description: 'Each validator compacts locally' })
  addNode('commit', 'TRANSACTION', 590, 220, { label: 'Raft Commit', description: 'GC committed to consensus log' })
  addNode('reclaimed', 'CONTENT', 750, 220, { label: 'Space Reclaimed', description: 'All validators reclaim same space' })
  
  addEdge('epoch', 'leader', 'CONTROL', { label: 'trigger' })
  addEdge('epoch', 'gc_proposal', 'DATA', { label: 'epoch ref' })
  addEdge('leader', 'gc_proposal', 'CONTROL', { label: 'create' })
  addEdge('gc_proposal', 'raft', 'DATA', { label: 'broadcast' })
  addEdge('raft', 'deterministic', 'CONTROL', { label: 'replicate' })
  addEdge('raft', 'local_gc', 'DATA', { label: 'apply' })
  addEdge('deterministic', 'commit', 'ASYNC', { label: 'verify' })
  addEdge('local_gc', 'commit', 'DATA', { label: 'complete' })
  addEdge('commit', 'reclaimed', 'DATA', { label: 'finalize' })
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
  
  // Consensus-based GC (only mode in Oak Chain)
  addNode('gc_trigger', 'VALIDATOR', 70, 160, { label: 'Leader Triggers GC', description: 'Raft leader initiates GC proposal' })
  addNode('gc_proposal', 'SIGNATURE', 210, 90, { label: 'GC Proposal', description: 'Signed proposal for compaction' })
  addNode('debt_check', 'TRANSACTION', 210, 230, { label: 'GC Debt Check', description: 'Check entity GC debt accounts' })
  addNode('raft_replicate', 'CONSENSUS', 390, 160, { label: 'Raft Replication', description: 'All validators receive GC proposal' })
  addNode('deterministic', 'VALIDATOR', 560, 90, { label: 'Deterministic Apply', description: 'All nodes compact identically' })
  addNode('local_compact', 'OAK_STORE', 560, 230, { label: 'Local Compaction', description: 'Each validator compacts locally' })
  addNode('commit', 'TRANSACTION', 730, 160, { label: 'Consensus Commit', description: 'GC committed to Raft log' })
  
  // GC Debt Economics (bottom)
  addNode('delete_op', 'AUTHOR', 70, 370, { label: 'Delete Operation', description: 'Content deletion creates GC debt' })
  addNode('debt_accrual', 'ETHEREUM', 260, 370, { label: 'Debt Accrual', description: 'GC cost attributed to entity' })
  addNode('debt_payment', 'WALLET', 450, 370, { label: 'Debt Payment', description: 'ETH payment clears GC debt' })
  addNode('writes_unblocked', 'CONTENT', 640, 370, { label: 'Writes Unblocked', description: 'Entity can write again' })
  
  addEdge('gc_trigger', 'gc_proposal', 'CONTROL', { label: 'create' })
  addEdge('gc_trigger', 'debt_check', 'DATA', { label: 'check' })
  addEdge('gc_proposal', 'raft_replicate', 'DATA', { label: 'broadcast' })
  addEdge('debt_check', 'raft_replicate', 'ASYNC', { label: 'include' })
  addEdge('raft_replicate', 'deterministic', 'CONTROL', { label: 'replicate' })
  addEdge('raft_replicate', 'local_compact', 'DATA', { label: 'apply' })
  addEdge('deterministic', 'commit', 'CONTROL', { label: 'verify' })
  addEdge('local_compact', 'commit', 'DATA', { label: 'complete' })
  addEdge('delete_op', 'debt_accrual', 'DATA', { label: 'incur' })
  addEdge('debt_accrual', 'debt_payment', 'PAYMENT', { label: 'pay ETH' })
  addEdge('debt_payment', 'writes_unblocked', 'CONTROL', { label: 'clear' })
}

// ============================================================================
// NEW PRODUCTION FLOWS
// ============================================================================

function initAEMIntegrationFlow() {
  nodes.value = []
  edges.value = []
  
  // Existing AEM instance
  addNode('aem', 'AEM', 70, 180, { label: 'Existing AEM', description: 'On-prem, AMS, AEMaaCS, or CQ variant' })
  addNode('composite', 'OAK_STORE', 220, 180, { label: 'Composite Mount', description: 'Oak CompositeNodeStore' })
  addNode('local', 'SEGMENT', 220, 80, { label: '/content (local)', description: 'Read-write local content' })
  addNode('http', 'CONSENSUS', 400, 180, { label: 'oak-segment-http', description: 'HTTP persistence layer' })
  addNode('validators', 'VALIDATOR', 580, 180, { label: 'Validators', description: 'Raft consensus cluster' })
  addNode('oakchain', 'OAK_STORE', 580, 80, { label: '/oak-chain (remote)', description: 'Read-only blockchain content' })
  addNode('ethereum', 'ETHEREUM', 750, 180, { label: 'Ethereum', description: 'Payment verification' })
  
  addEdge('aem', 'composite', 'DATA', { label: 'JCR API' })
  addEdge('composite', 'local', 'DATA', { label: 'read/write' })
  addEdge('composite', 'http', 'ASYNC', { label: 'read-only' })
  addEdge('http', 'validators', 'DATA', { label: 'segments' })
  addEdge('validators', 'oakchain', 'DATA', { label: 'serve' })
  addEdge('validators', 'ethereum', 'PAYMENT', { label: 'verify' })
}

function initBinaryFlow() {
  nodes.value = []
  edges.value = []
  
  // Truth → Provenance → Edge flow
  addNode('oakchain', 'OAK_STORE', 70, 200, { label: 'Oak-Chain', description: 'Source of truth: CIDs (46 bytes)' })
  addNode('cid', 'SIGNATURE', 220, 120, { label: 'CID', description: 'Content-addressed hash (provenance)' })
  addNode('author_storage', 'IPFS', 220, 280, { label: 'Author Storage', description: 'IPFS, Azure Blob, or Pinata' })
  addNode('binary', 'CONTENT', 400, 200, { label: 'Binary (5MB)', description: 'Actual file content' })
  addNode('edge', 'CDN', 580, 200, { label: 'Edge CDN', description: 'Cloudflare R2, Fastly, etc.' })
  addNode('user', 'USER', 750, 200, { label: 'End User', description: 'Verifies CID against oak-chain' })
  addNode('verify', 'SIGNATURE', 750, 100, { label: 'Verify', description: 'Hash binary = CID?' })
  
  addEdge('oakchain', 'cid', 'DATA', { label: 'stores' })
  addEdge('oakchain', 'author_storage', 'ASYNC', { label: 'references' })
  addEdge('author_storage', 'binary', 'DATA', { label: 'hosts' })
  addEdge('cid', 'binary', 'CONTROL', { label: 'addresses' })
  addEdge('binary', 'edge', 'DATA', { label: 'cache' })
  addEdge('edge', 'user', 'DATA', { label: 'serve' })
  addEdge('user', 'verify', 'CONTROL', { label: 'hash' })
  addEdge('cid', 'verify', 'ASYNC', { label: 'compare' })
}

function initValidatorAuthFlow() {
  nodes.value = []
  edges.value = []
  
  // Passkey authentication flow
  addNode('operator', 'USER', 70, 180, { label: 'Operator', description: 'Validator operator' })
  addNode('passkey', 'PASSKEY', 220, 180, { label: 'Passkey', description: 'WebAuthn credential (Face ID, Touch ID)' })
  addNode('challenge', 'SIGNATURE', 220, 80, { label: 'Challenge', description: 'Random nonce from server' })
  addNode('p256', 'CONSENSUS', 400, 180, { label: 'P-256 Signature', description: 'Signed challenge' })
  addNode('verify', 'VALIDATOR', 560, 180, { label: 'Verify', description: 'Server validates signature' })
  addNode('wallet', 'WALLET', 560, 80, { label: 'Derived Wallet', description: 'P-256 pubkey → ETH address' })
  addNode('dashboard', 'CONTENT', 700, 180, { label: 'Dashboard', description: 'Authenticated access' })
  
  addEdge('operator', 'passkey', 'CONTROL', { label: 'authenticate' })
  addEdge('passkey', 'challenge', 'DATA', { label: 'receive' })
  addEdge('passkey', 'p256', 'DATA', { label: 'sign' })
  addEdge('challenge', 'p256', 'CONTROL', { label: 'include' })
  addEdge('p256', 'verify', 'DATA', { label: 'submit' })
  addEdge('verify', 'wallet', 'ASYNC', { label: 'derive' })
  addEdge('verify', 'dashboard', 'CONTROL', { label: 'grant' })
}

function initTwoModelsFlow() {
  nodes.value = []
  edges.value = []
  
  // Model 1: Blockchain-Native (top)
  addNode('eds', 'EDS', 70, 80, { label: 'EDS (aem.live)', description: 'Edge Delivery Services' })
  addNode('validators1', 'VALIDATOR', 280, 80, { label: 'Validators', description: 'Raft consensus cluster' })
  addNode('ethereum1', 'ETHEREUM', 480, 80, { label: 'Ethereum', description: 'Payment & verification' })
  addNode('label1', 'CONTENT', 680, 80, { label: 'Model 1', description: 'Blockchain-Native (new apps)', radius: 20 })
  
  // Model 2: AEM Integration (bottom)
  addNode('aem', 'AEM', 70, 260, { label: 'Existing AEM', description: 'On-prem, AMS, AEMaaCS' })
  addNode('http', 'CONSENSUS', 280, 260, { label: 'oak-segment-http', description: 'HTTP segment transfer' })
  addNode('validators2', 'VALIDATOR', 480, 260, { label: 'Validators', description: 'Same cluster, different access' })
  addNode('label2', 'CONTENT', 680, 260, { label: 'Model 2', description: 'AEM Integration (existing)', radius: 20 })
  
  // Shared: Binary storage
  addNode('ipfs', 'IPFS', 280, 170, { label: 'Author IPFS', description: 'Binaries at source (CID only in validators)' })
  
  addEdge('eds', 'validators1', 'DATA', { label: 'HTTPS API' })
  addEdge('validators1', 'ethereum1', 'PAYMENT', { label: 'verify' })
  addEdge('aem', 'http', 'DATA', { label: 'mount' })
  addEdge('http', 'validators2', 'DATA', { label: 'segments' })
  addEdge('validators1', 'ipfs', 'ASYNC', { label: 'CID' })
  addEdge('validators2', 'ipfs', 'ASYNC', { label: 'CID' })
}

function initJsonToJcrFlow() {
  nodes.value = []
  edges.value = []

  // Top row: JSON -> JCR materialization
  addNode('json', 'CONTENT', 70, 110, { label: 'message JSON', description: 'Raw JSON payload' })
  addNode('parser', 'SEGMENT', 220, 110, { label: 'JSON Parser', description: 'Parse + validate' })
  addNode('mapper', 'CONTENT', 370, 110, { label: 'Mapping Rules', description: 'Scalars → props, objects → nodes' })
  addNode('jcr', 'OAK_STORE', 520, 110, { label: 'JCR Node', description: 'Materialized content node' })
  addNode('props', 'CONTENT', 700, 60, { label: 'Properties', description: 'Scalars + arrays of scalars', radius: 22 })
  addNode('children', 'CONTENT', 700, 160, { label: 'Child Nodes', description: 'Objects + arrays of objects', radius: 22 })

  // Bottom row: path derivation
  addNode('wallet', 'WALLET', 70, 300, { label: 'Wallet', description: '0x...' })
  addNode('org', 'AUTHOR', 220, 300, { label: 'Organization', description: 'Brand scope' })
  addNode('ctype', 'CONTENT', 370, 300, { label: 'Content Type', description: 'page, asset, ...' })
  addNode('time', 'TRANSACTION', 520, 300, { label: 'Timestamp', description: 'contentType-{timestamp}' })
  addNode('path', 'SEGMENT', 670, 300, { label: 'Path Builder', description: 'Shard + wallet + org' })
  addNode('pathOut', 'OAK_STORE', 820, 300, { label: 'Content Path', description: '/oak-chain/.../content/*', radius: 24 })

  addEdge('json', 'parser', 'DATA', { label: 'parse' })
  addEdge('parser', 'mapper', 'CONTROL', { label: 'apply rules' })
  addEdge('mapper', 'jcr', 'DATA', { label: 'materialize' })
  addEdge('jcr', 'props', 'DATA', { label: 'scalars' })
  addEdge('jcr', 'children', 'DATA', { label: 'objects' })

  addEdge('wallet', 'path', 'CONTROL', { label: 'wallet' })
  addEdge('org', 'path', 'CONTROL', { label: 'org' })
  addEdge('ctype', 'path', 'CONTROL', { label: 'type' })
  addEdge('time', 'path', 'CONTROL', { label: 'time' })
  addEdge('path', 'pathOut', 'DATA', { label: 'derive' })
  addEdge('pathOut', 'jcr', 'ASYNC', { label: 'location' })
}

function getEdgePath(edge: Edge): string {
  const fromNode = nodes.value.find(n => n.id === edge.from)
  const toNode = nodes.value.find(n => n.id === edge.to)
  if (!fromNode || !toNode) return ''
  
  const dx = toNode.x - fromNode.x
  const dy = toNode.y - fromNode.y
  const dist = Math.sqrt(dx * dx + dy * dy)
  
  const offsetFrom = (fromNode.radius || 28) + 8
  const offsetTo = (toNode.radius || 28) + 8
  
  const startX = fromNode.x + (dx / dist) * offsetFrom
  const startY = fromNode.y + (dy / dist) * offsetFrom
  const endX = toNode.x - (dx / dist) * offsetTo
  const endY = toNode.y - (dy / dist) * offsetTo
  
  const midX = (startX + endX) / 2
  const midY = (startY + endY) / 2
  const curvature = 0.2
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
  const curvature = 0.2
  
  return {
    x: midX - dy * curvature,
    y: midY + dx * curvature - 12
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
    'json-to-jcr': [
      [{ from: 'json', to: 'parser', color: '#627EEA' }],
      [{ from: 'parser', to: 'mapper', color: '#8C8DFC' }],
      [{ from: 'mapper', to: 'jcr', color: '#627EEA' }],
      [{ from: 'jcr', to: 'props', color: '#e6edf3' }, { from: 'jcr', to: 'children', color: '#e6edf3' }],
      [{ from: 'wallet', to: 'path', color: '#f0b429' }, { from: 'org', to: 'path', color: '#8C8DFC' }],
      [{ from: 'ctype', to: 'path', color: '#627EEA' }, { from: 'time', to: 'path', color: '#4ade80' }],
      [{ from: 'path', to: 'pathOut', color: '#627EEA' }],
      [{ from: 'pathOut', to: 'jcr', color: '#65c2cb' }],
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
      [{ from: 'epoch', to: 'leader', color: '#8C8DFC' }, { from: 'epoch', to: 'gc_proposal', color: '#627EEA' }],
      [{ from: 'leader', to: 'gc_proposal', color: '#8C8DFC' }],
      [{ from: 'gc_proposal', to: 'raft', color: '#627EEA' }],
      [{ from: 'raft', to: 'deterministic', color: '#8C8DFC' }, { from: 'raft', to: 'local_gc', color: '#627EEA' }],
      [{ from: 'deterministic', to: 'commit', color: '#65c2cb' }, { from: 'local_gc', to: 'commit', color: '#627EEA' }],
      [{ from: 'commit', to: 'reclaimed', color: '#627EEA' }],
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
      [{ from: 'gc_trigger', to: 'gc_proposal', color: '#8C8DFC' }, { from: 'gc_trigger', to: 'debt_check', color: '#627EEA' }],
      [{ from: 'gc_proposal', to: 'raft_replicate', color: '#627EEA' }, { from: 'debt_check', to: 'raft_replicate', color: '#65c2cb' }],
      [{ from: 'raft_replicate', to: 'deterministic', color: '#8C8DFC' }, { from: 'raft_replicate', to: 'local_compact', color: '#627EEA' }],
      [{ from: 'deterministic', to: 'commit', color: '#8C8DFC' }, { from: 'local_compact', to: 'commit', color: '#627EEA' }],
      [{ from: 'delete_op', to: 'debt_accrual', color: '#627EEA' }],
      [{ from: 'debt_accrual', to: 'debt_payment', color: '#f0b429' }],
      [{ from: 'debt_payment', to: 'writes_unblocked', color: '#8C8DFC' }],
    ],
    'aem-integration': [
      [{ from: 'aem', to: 'composite', color: '#fa0f00' }],
      [{ from: 'composite', to: 'local', color: '#627EEA' }],
      [{ from: 'composite', to: 'http', color: '#65c2cb' }],
      [{ from: 'http', to: 'validators', color: '#627EEA' }],
      [{ from: 'validators', to: 'oakchain', color: '#4ade80' }],
      [{ from: 'validators', to: 'ethereum', color: '#f0b429' }],
    ],
    'binary-flow': [
      [{ from: 'oakchain', to: 'cid', color: '#4ade80' }],
      [{ from: 'oakchain', to: 'author_storage', color: '#65c2cb' }],
      [{ from: 'author_storage', to: 'binary', color: '#627EEA' }],
      [{ from: 'cid', to: 'binary', color: '#8C8DFC' }],
      [{ from: 'binary', to: 'edge', color: '#627EEA' }],
      [{ from: 'edge', to: 'user', color: '#f48120' }],
      [{ from: 'user', to: 'verify', color: '#8C8DFC' }],
      [{ from: 'cid', to: 'verify', color: '#65c2cb' }],
    ],
    'validator-auth': [
      [{ from: 'operator', to: 'passkey', color: '#627EEA' }],
      [{ from: 'passkey', to: 'challenge', color: '#a855f7' }],
      [{ from: 'passkey', to: 'p256', color: '#a855f7' }],
      [{ from: 'challenge', to: 'p256', color: '#8C8DFC' }],
      [{ from: 'p256', to: 'verify', color: '#627EEA' }],
      [{ from: 'verify', to: 'wallet', color: '#65c2cb' }],
      [{ from: 'verify', to: 'dashboard', color: '#4ade80' }],
    ],
    'two-models': [
      [{ from: 'eds', to: 'validators1', color: '#00c7b7' }],
      [{ from: 'validators1', to: 'ethereum1', color: '#f0b429' }],
      [{ from: 'validators1', to: 'ipfs', color: '#65c2cb' }],
      [{ from: 'aem', to: 'http', color: '#fa0f00' }],
      [{ from: 'http', to: 'validators2', color: '#627EEA' }],
      [{ from: 'validators2', to: 'ipfs', color: '#65c2cb' }],
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
  const offsetFrom = (fromNode.radius || 28) + 8
  const offsetTo = (toNode.radius || 28) + 8
  
  const startX = fromNode.x + (dx / dist) * offsetFrom
  const startY = fromNode.y + (dy / dist) * offsetFrom
  const endX = toNode.x - (dx / dist) * offsetTo
  const endY = toNode.y - (dy / dist) * offsetTo
  
  const midX = (startX + endX) / 2
  const midY = (startY + endY) / 2
  const curvature = 0.2
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
            class="node-wrapper"
          >
            <g
              class="node"
              :class="{ hovered: hoveredNode?.id === node.id }"
              @mouseenter="handleNodeEnter(node)"
              @mouseleave="handleNodeLeave(node)"
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
  fill: rgba(255, 255, 255, 0.6);
  font-size: 11px;
  font-family: 'JetBrains Mono', monospace;
  font-weight: 500;
  pointer-events: none;
}

.node-wrapper {
  transform-origin: center;
}

.node {
  cursor: pointer;
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
