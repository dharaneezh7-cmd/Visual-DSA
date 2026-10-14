import { useState } from 'react';
import './ConceptDeepDive.css';

export type ConceptTopic =
  | 'array'
  | 'linked-list'
  | 'stack'
  | 'queue'
  | 'circular-queue'
  | 'linear-search'
  | 'binary-search'
  | 'bubble-sort'
  | 'selection-sort'
  | 'insertion-sort'
  | 'merge-sort'
  | 'quick-sort'
  | 'basics'
  | 'searching'
  | 'sorting';

interface ApplicationItem {
  title: string;
  domain: string;
  description: string;
}

interface ComparisonRow {
  name: string;
  timeBest: string;
  timeAvg: string;
  timeWorst: string;
  space: string;
  pros: string;
  cons: string;
  bestFor: string;
  highlight?: boolean;
}

interface DeepDiveData {
  title: string;
  summary: string;
  applications: ApplicationItem[];
  comparisons: ComparisonRow[];
  recommendation: string;
}

const CONCEPT_DATA: Record<ConceptTopic, DeepDiveData> = {
  array: {
    title: 'Array Applications & Comparisons',
    summary: 'Contiguous memory allocation with constant-time indexing, ideal for cache-friendly sequential storage.',
    applications: [
      {
        title: 'Image & Video Buffers',
        domain: 'Computer Vision & Multimedia',
        description: 'Raw pixel matrices (RGB/RGBA) and frame buffers map directly into contiguous 1D/2D arrays for GPU texture mapping.',
      },
      {
        title: 'CPU Cache Optimization',
        domain: 'System Programming & OS',
        description: 'Contiguous element addresses maximize L1/L2 cache prefetching line hits, dramatically outperforming pointer structures.',
      },
      {
        title: 'Lookup Tables (LUTs)',
        domain: 'Cryptography & Graphics',
        description: 'Direct O(1) index addressing powers precomputed trigonometric tables, color palettes, and cryptographic S-boxes.',
      },
      {
        title: 'Foundational Storage',
        domain: 'Data Structures Core',
        description: 'Forms the underlying storage engine for dynamic vectors, hash table buckets, binary heaps, and adjacency matrices.',
      },
    ],
    comparisons: [
      {
        name: 'Fixed Array (Static)',
        timeBest: 'O(1) access',
        timeAvg: 'O(n) search',
        timeWorst: 'O(n) insert/del',
        space: 'O(1) extra',
        pros: 'Zero pointer overhead, instant indexing, peak cache locality',
        cons: 'Fixed capacity, expensive middle insertions/deletions',
        bestFor: 'Known fixed datasets, high-throughput math matrices',
        highlight: true,
      },
      {
        name: 'Singly Linked List',
        timeBest: 'O(1) insert at head',
        timeAvg: 'O(n) search',
        timeWorst: 'O(n) access',
        space: 'O(n) pointers',
        pros: 'Dynamic growth, constant-time insertion at head',
        cons: 'No random access, cache misses from scattered heap nodes',
        bestFor: 'Frequent insertions/deletions with unpredictable size',
      },
      {
        name: 'Dynamic Array (Vector)',
        timeBest: 'O(1) access',
        timeAvg: 'Amortized O(1) push',
        timeWorst: 'O(n) resize',
        space: 'O(n) capacity',
        pros: 'Auto-resizing convenience, fast indexed lookups',
        cons: 'Occasional reallocation and memory copy spikes',
        bestFor: 'General-purpose collections where size grows dynamically',
      },
    ],
    recommendation: 'Choose Arrays when data size is known or random indexed access is frequent. Avoid when frequent insertions or deletions occur in the middle.',
  },

  'linked-list': {
    title: 'Linked List Applications & Comparisons',
    summary: 'Node-based structure where elements point to the next, enabling dynamic resizing and fast head insertions.',
    applications: [
      {
        title: 'OS Memory Management',
        domain: 'Operating Systems',
        description: 'Kernel free-lists (heap memory allocators such as malloc) use linked lists to track available memory blocks of varying sizes.',
      },
      {
        title: 'Music Playlists & Media Queues',
        domain: 'Audio/Video Applications',
        description: 'Track queues maintain next/previous song references, allowing instant reordering and non-contiguous insertion.',
      },
      {
        title: 'Hash Table Separate Chaining',
        domain: 'Database & Key-Value Stores',
        description: 'Resolves key hash collisions by chaining conflicting key-value pairs into a singly linked list per bucket.',
      },
      {
        title: 'Blockchain Transaction Blocks',
        domain: 'Distributed Ledgers',
        description: 'Each cryptographic block contains the cryptographic hash of the preceding block, mirroring a singly linked chain.',
      },
    ],
    comparisons: [
      {
        name: 'Singly Linked List',
        timeBest: 'O(1) insert head',
        timeAvg: 'O(n) access',
        timeWorst: 'O(n) search',
        space: '1 pointer / node',
        pros: 'Constant-time insertion at start, flexible dynamic memory',
        cons: 'Unidirectional traversal, pointer overhead, cache thrashing',
        bestFor: 'Simple queues, free lists, hash collision chains',
        highlight: true,
      },
      {
        name: 'Doubly Linked List',
        timeBest: 'O(1) insert/del given node',
        timeAvg: 'O(n) access',
        timeWorst: 'O(n) search',
        space: '2 pointers / node',
        pros: 'Bidirectional traversal, instant deletion if pointer known',
        cons: 'Higher memory consumption (prev + next pointers per node)',
        bestFor: 'Browser history (Back/Forward), LRU cache eviction',
      },
      {
        name: 'Contiguous Array',
        timeBest: 'O(1) access',
        timeAvg: 'O(n) search',
        timeWorst: 'O(n) insert/del',
        space: 'Zero pointer overhead',
        pros: 'Direct indexing, compact memory, cache friendly',
        cons: 'Fixed capacity, expensive element shifting on insert/delete',
        bestFor: 'Read-heavy workloads with known or static sizes',
      },
    ],
    recommendation: 'Use Linked Lists when frequent insertions and deletions occur at the boundaries or when memory allocations must be strictly incremental.',
  },

  stack: {
    title: 'Stack Applications & Comparisons',
    summary: 'LIFO (Last-In, First-Out) discipline where elements are inserted and removed exclusively from the top.',
    applications: [
      {
        title: 'Function Call Stack',
        domain: 'Compilers & CPU Architecture',
        description: 'Tracks activation records, local variables, return addresses, and recursive call frames during program execution.',
      },
      {
        title: 'Undo / Redo Buffers',
        domain: 'Productivity & Creative Software',
        description: 'Text editors and graphics software (Photoshop, VS Code) push state deltas onto an undo stack to revert changes.',
      },
      {
        title: 'Syntax & Bracket Validation',
        domain: 'Compilers & Parsers',
        description: 'Validates balanced matching delimiters like (), {}, and [] by pushing opening symbols and popping on matching closers.',
      },
      {
        title: 'Backtracking & DFS',
        domain: 'Graph Theory & AI Search',
        description: 'Maintains candidate paths in maze navigation, Sudoku solvers, and Depth-First Search graph traversals.',
      },
    ],
    comparisons: [
      {
        name: 'Stack (LIFO)',
        timeBest: 'O(1) push/pop',
        timeAvg: 'O(1) peek',
        timeWorst: 'O(n) search',
        space: 'O(n)',
        pros: 'Simple invariant, strict access control, optimal for recursion & reversal',
        cons: 'No random access to middle or bottom elements',
        bestFor: 'Expression evaluation, call stack, undo operations',
        highlight: true,
      },
      {
        name: 'Queue (FIFO)',
        timeBest: 'O(1) enqueue',
        timeAvg: 'O(1) dequeue',
        timeWorst: 'O(n) search',
        space: 'O(n)',
        pros: 'Fair order preservation, producer-consumer decoupling',
        cons: 'Cannot backtrack or easily reverse items',
        bestFor: 'Task scheduling, print spoolers, Breadth-First Search (BFS)',
      },
      {
        name: 'Double-Ended Queue (Deque)',
        timeBest: 'O(1) ends',
        timeAvg: 'O(1) ends',
        timeWorst: 'O(n) search',
        space: 'O(n)',
        pros: 'Dual-ended insertions and deletions, versatile API',
        cons: 'Slightly higher internal complexity and overhead',
        bestFor: 'Sliding window maximum, work-stealing thread pools',
      },
    ],
    recommendation: 'Choose a Stack when the most recently added item must be processed first (LIFO order), such as nested scopes or backtracking.',
  },

  queue: {
    title: 'Linear Queue Applications & Comparisons',
    summary: 'FIFO (First-In, First-Out) discipline preserving chronological order between producers and consumers.',
    applications: [
      {
        title: 'Message Queues & Microservices',
        domain: 'Distributed Cloud Systems',
        description: 'Systems like RabbitMQ, Apache Kafka, and Amazon SQS buffer incoming asynchronous requests between services.',
      },
      {
        title: 'OS Print & I/O Spoolers',
        domain: 'Operating Systems',
        description: 'Print jobs, disk read requests, and network packets are processed in the strict arrival sequence.',
      },
      {
        title: 'Graph BFS Traversal',
        domain: 'Algorithms & Routing',
        description: 'Breadth-First Search uses a queue to visit vertices level-by-level to discover the shortest unweighted path.',
      },
      {
        title: 'Round-Robin CPU Scheduling',
        domain: 'Kernel Process Management',
        description: 'The operating system allocates fixed time slices to ready processes queued in FIFO order.',
      },
    ],
    comparisons: [
      {
        name: 'Linear Queue (Array-based)',
        timeBest: 'O(1) enqueue',
        timeAvg: 'O(1) dequeue',
        timeWorst: 'O(n) if shifting',
        space: 'O(n)',
        pros: 'Simple concept, FIFO guarantee, predictable memory',
        cons: 'Front pointer drift causes false overflow (dead memory at front)',
        bestFor: 'Simple batch pipelines or linked list implementations',
        highlight: true,
      },
      {
        name: 'Circular Queue (Ring Buffer)',
        timeBest: 'O(1) enqueue',
        timeAvg: 'O(1) dequeue',
        timeWorst: 'O(1) front/rear',
        space: 'O(n) recycled',
        pros: 'Eliminates memory wastage via index wraparound, zero element shifting',
        cons: 'Fixed maximum capacity unless dynamic resize logic added',
        bestFor: 'Hardware drivers, audio/video streaming, high-frequency telemetry',
      },
      {
        name: 'Priority Queue (Heap)',
        timeBest: 'O(1) peek min/max',
        timeAvg: 'O(log n) insert',
        timeWorst: 'O(log n) delete',
        space: 'O(n)',
        pros: 'Dispatches highest-priority tasks regardless of arrival time',
        cons: 'Higher logarithmic overhead, not strict chronological FIFO',
        bestFor: 'Dijkstra shortest path, A* search, emergency task dispatch',
      },
    ],
    recommendation: 'Use Linear Queues when processing tasks strictly in arrival order. Prefer Circular Queues when implementing array-backed fixed-capacity buffers.',
  },

  'circular-queue': {
    title: 'Circular Queue Applications & Comparisons',
    summary: 'Ring buffer reusing memory by connecting the last index back to the first via modulo arithmetic.',
    applications: [
      {
        title: 'Audio & Video Streaming Buffers',
        domain: 'Digital Signal Processing',
        description: 'Media players stream raw audio/video frames into a continuous circular ring buffer to prevent playback jitter.',
      },
      {
        title: 'Keyboard & Interrupt Buffers',
        domain: 'Embedded Systems & BIOS',
        description: 'Hardware controllers write incoming keystroke scan codes into a circular buffer for the CPU to read asynchronously.',
      },
      {
        title: 'Financial Ticker Rolling Windows',
        domain: 'FinTech & High-Frequency Trading',
        description: 'Maintains the latest N price updates or moving-average windows by overwriting the oldest tick in constant time.',
      },
      {
        title: 'Automated Traffic Signal Controllers',
        domain: 'Embedded IoT & Automation',
        description: 'Cycles sequentially through predefined signal phases (Green -> Yellow -> Red -> Green) in a perpetual loop.',
      },
    ],
    comparisons: [
      {
        name: 'Circular Queue (Ring Buffer)',
        timeBest: 'O(1) enqueue',
        timeAvg: 'O(1) dequeue',
        timeWorst: 'O(1) access',
        space: 'O(n) optimal',
        pros: 'Zero wasted memory, constant time operations, modulo index wrap',
        cons: 'Full vs empty condition requires one slot gap or explicit size counter',
        bestFor: 'Streaming buffers, sensor telemetry, producer-consumer queues',
        highlight: true,
      },
      {
        name: 'Standard Linear Queue',
        timeBest: 'O(1) enqueue',
        timeAvg: 'O(1) dequeue',
        timeWorst: 'False overflow',
        space: 'O(n) wasted',
        pros: 'Elementary implementation',
        cons: 'Wastes memory as front pointer advances right without reset',
        bestFor: 'One-shot pipelines where capacity is never reused',
      },
      {
        name: 'Circular Linked List',
        timeBest: 'O(1) insert head',
        timeAvg: 'O(1) delete head',
        timeWorst: 'O(n) search',
        space: 'O(n) pointers',
        pros: 'Dynamic growth without fixed capacity limit',
        cons: 'Node pointer overhead, cache thrashing from scattered allocations',
        bestFor: 'Round-robin task schedulers needing dynamic process counts',
      },
    ],
    recommendation: 'Choose a Circular Queue whenever you need a bounded FIFO buffer in high-throughput or memory-constrained environments.',
  },

  'linear-search': {
    title: 'Linear Search Applications & Comparisons',
    summary: 'Sequential traversal comparing each item against the target until a match is found or the collection ends.',
    applications: [
      {
        title: 'Unsorted & Small Data Lookups',
        domain: 'General Programming',
        description: 'Fastest search method for small datasets (N < 30) due to low overhead, zero sorting requirement, and good cache locality.',
      },
      {
        title: 'Linked List Traversal',
        domain: 'Pointer-based Data Structures',
        description: 'The only generic search viable for singly linked lists where direct indexing is impossible.',
      },
      {
        title: 'Streaming Data Inspection',
        domain: 'IoT & Telemetry',
        description: 'Scans live sensor events or network packets on the fly where sorting in advance is unfeasible.',
      },
      {
        title: 'Multi-Condition Filtering',
        domain: 'Database Engines',
        description: 'Full-table scans when querying unindexed columns or searching for non-trivial predicate matches.',
      },
    ],
    comparisons: [
      {
        name: 'Linear Search',
        timeBest: 'O(1) first item',
        timeAvg: 'O(n)',
        timeWorst: 'O(n)',
        space: 'O(1)',
        pros: 'Works on any collection (sorted or unsorted), zero prep cost',
        cons: 'Inefficient for large N, scales linearly with data size',
        bestFor: 'Unsorted lists, small arrays (N < 30), linked lists',
        highlight: true,
      },
      {
        name: 'Binary Search',
        timeBest: 'O(1) middle item',
        timeAvg: 'O(log n)',
        timeWorst: 'O(log n)',
        space: 'O(1) iterative',
        pros: 'Ultra fast logarithmic time, cuts search space in half each step',
        cons: 'Requires data to be sorted beforehand (sorting takes O(n log n))',
        bestFor: 'Large sorted arrays, lookup tables, static datasets',
      },
      {
        name: 'Hash Table Lookup',
        timeBest: 'O(1)',
        timeAvg: 'O(1)',
        timeWorst: 'O(n) collisions',
        space: 'O(n) table',
        pros: 'Constant-time average search, key-value association',
        cons: 'High memory overhead, requires good hash function, no range queries',
        bestFor: 'Repeated lookups by unique key, dictionaries, caches',
      },
    ],
    recommendation: 'Use Linear Search when data is unsorted, accessed once, or small. For repeated queries on large datasets, sort first and use Binary Search or a Hash Table.',
  },

  'binary-search': {
    title: 'Binary Search Applications & Comparisons',
    summary: 'Divide-and-conquer search halving the search space each step on sorted contiguous datasets.',
    applications: [
      {
        title: 'Database B-Tree Indexing',
        domain: 'Relational & NoSQL Databases',
        description: 'Database engines use binary search on sorted index pages to quickly pinpoint record row IDs in logarithmic time.',
      },
      {
        title: 'Git Bisect Bug Hunting',
        domain: 'DevOps & Version Control',
        description: 'Binary searches commit history to isolate the exact commit that introduced a software regression in minimal test runs.',
      },
      {
        title: 'Standard Library Lower/Upper Bounds',
        domain: 'C++ STL, Java, Python',
        description: 'Powers functions like std::lower_bound, Arrays.binarySearch, and bisect_right for range and insertion point queries.',
      },
      {
        title: 'Monotonic Optimization Problems',
        domain: 'Competitive Programming & AI',
        description: 'Binary search on answer space to find minimum maximum thresholds (e.g., painter partition, capacity allocation).',
      },
    ],
    comparisons: [
      {
        name: 'Binary Search',
        timeBest: 'O(1)',
        timeAvg: 'O(log n)',
        timeWorst: 'O(log n)',
        space: 'O(1)',
        pros: 'Extremely fast (1 million items searched in ~20 steps), low memory',
        cons: 'Array must be sorted and support O(1) random access',
        bestFor: 'Sorted arrays, static catalogs, range query boundaries',
        highlight: true,
      },
      {
        name: 'Linear Search',
        timeBest: 'O(1)',
        timeAvg: 'O(n)',
        timeWorst: 'O(n)',
        space: 'O(1)',
        pros: 'Works on unsorted data and linked lists',
        cons: 'Very slow on millions of items (1 million checks vs 20)',
        bestFor: 'Unsorted arrays, one-off searches, small collections',
      },
      {
        name: 'Interpolation Search',
        timeBest: 'O(1)',
        timeAvg: 'O(log log n)',
        timeWorst: 'O(n)',
        space: 'O(1)',
        pros: 'Faster than binary search on uniformly distributed values',
        cons: 'Degrades to O(n) on skewed datasets; requires complex math',
        bestFor: 'Strictly uniform numerical datasets (e.g. phone books)',
      },
    ],
    recommendation: 'Binary Search is the gold standard for searching sorted collections. For dynamic data with frequent insertions, consider a Balanced BST or Hash Table.',
  },

  'bubble-sort': {
    title: 'Bubble Sort Applications & Comparisons',
    summary: 'Repeatedly compares and swaps adjacent out-of-order elements, bubbling the largest value to the end.',
    applications: [
      {
        title: 'Pedagogical & Computer Science Education',
        domain: 'Foundational CS',
        description: 'The standard baseline algorithm for teaching sorting mechanics, loop invariants, and algorithmic swap complexity.',
      },
      {
        title: 'Nearly Sorted Array Verification',
        domain: 'System Diagnostics',
        description: 'With an optimized swap flag, detects a fully sorted array in a single O(n) pass with zero extra space allocated.',
      },
      {
        title: 'Microcontroller Code with Tiny Footprint',
        domain: 'Embedded Systems',
        description: 'Used when code size (ROM) is strictly limited (e.g. under 100 bytes of program code) and N is very small (N < 10).',
      },
    ],
    comparisons: [
      {
        name: 'Bubble Sort',
        timeBest: 'O(n) with flag',
        timeAvg: 'O(n²)',
        timeWorst: 'O(n²)',
        space: 'O(1)',
        pros: 'Simple to understand, in-place, stable, fast O(n) best case',
        cons: 'Excessive swaps and comparisons make it the slowest quadratic sort',
        bestFor: 'Teaching sorting concepts, tiny datasets, checking if sorted',
        highlight: true,
      },
      {
        name: 'Insertion Sort',
        timeBest: 'O(n)',
        timeAvg: 'O(n²)',
        timeWorst: 'O(n²)',
        space: 'O(1)',
        pros: 'Stable, in-place, significantly fewer writes than Bubble Sort',
        cons: 'Quadratic worst case on reverse data',
        bestFor: 'Small arrays (N < 50), online streaming data, nearly sorted data',
      },
      {
        name: 'Quick Sort',
        timeBest: 'O(n log n)',
        timeAvg: 'O(n log n)',
        timeWorst: 'O(n²)',
        space: 'O(log n)',
        pros: 'Fastest general-purpose in-place sort, high cache efficiency',
        cons: 'Unstable, O(n²) worst case if pivot is poorly chosen',
        bestFor: 'Large in-memory datasets across general computing',
      },
    ],
    recommendation: 'Bubble Sort is primarily educational. In production code, replace it with Insertion Sort for small arrays or Quick/Merge Sort for large datasets.',
  },

  'selection-sort': {
    title: 'Selection Sort Applications & Comparisons',
    summary: 'Finds the minimum item from the unsorted region each pass and swaps it directly to the front.',
    applications: [
      {
        title: 'Flash / EEPROM Wear Reduction',
        domain: 'Embedded Firmware',
        description: 'Guarantees strictly at most O(n) swap writes, critical for Flash memory with limited write-erase cycle endurance.',
      },
      {
        title: 'Low Memory Hardware Devices',
        domain: 'Legacy Embedded Systems',
        description: 'Requires zero auxiliary memory allocations and has deterministic comparison counts regardless of input order.',
      },
      {
        title: 'K-Smallest Element Extraction',
        domain: 'Statistics & Reporting',
        description: 'Partial selection sort can retrieve the K smallest elements in O(k * n) time without fully sorting the entire array.',
      },
    ],
    comparisons: [
      {
        name: 'Selection Sort',
        timeBest: 'O(n²)',
        timeAvg: 'O(n²)',
        timeWorst: 'O(n²)',
        space: 'O(1)',
        pros: 'Strictly at most O(n) memory writes, predictable run time',
        cons: 'Always O(n²) comparisons even if array is already sorted, unstable',
        bestFor: 'Systems where write operations are dramatically costlier than reads',
        highlight: true,
      },
      {
        name: 'Insertion Sort',
        timeBest: 'O(n)',
        timeAvg: 'O(n²)',
        timeWorst: 'O(n²)',
        space: 'O(1)',
        pros: 'Adaptive O(n) best case, stable, fewer comparisons on average',
        cons: 'Performs more memory writes (shifts) on unsorted arrays',
        bestFor: 'Small or partially sorted datasets',
      },
      {
        name: 'Heap Sort',
        timeBest: 'O(n log n)',
        timeAvg: 'O(n log n)',
        timeWorst: 'O(n log n)',
        space: 'O(1)',
        pros: 'Selection sort generalized via a heap; guaranteed O(n log n) in-place',
        cons: 'Poor cache locality, unstable',
        bestFor: 'Guaranteed O(n log n) bound without auxiliary space',
      },
    ],
    recommendation: 'Use Selection Sort only when write operations to physical storage (like Flash/EEPROM) are extremely expensive compared to read cycles.',
  },

  'insertion-sort': {
    title: 'Insertion Sort Applications & Comparisons',
    summary: 'Builds the sorted sequence one element at a time by sliding each item into its correct relative position.',
    applications: [
      {
        title: 'Base Case in Hybrid Sorting (Timsort & Introsort)',
        domain: 'Standard Libraries (Python, Java, C++)',
        description: 'Modern standard libraries use Insertion Sort for partitions smaller than 32-64 elements because low constant factors beat O(n log n) recursion.',
      },
      {
        title: 'Online Streaming Data Ingestion',
        domain: 'Data Processing Pipelines',
        description: 'Can sort elements incrementally as they arrive in real-time without needing all data upfront.',
      },
      {
        title: 'Nearly Sorted Collections',
        domain: 'Transactional Databases',
        description: 'Runs in near-linear O(n) time when only a few items are displaced from their proper positions.',
      },
    ],
    comparisons: [
      {
        name: 'Insertion Sort',
        timeBest: 'O(n) sorted',
        timeAvg: 'O(n²)',
        timeWorst: 'O(n²)',
        space: 'O(1)',
        pros: 'Adaptive O(n) best case, stable, in-place, excellent cache performance on small N',
        cons: 'Slow O(n²) worst case on reversed datasets',
        bestFor: 'Small arrays (N < 50), nearly sorted datasets, online streaming data',
        highlight: true,
      },
      {
        name: 'Bubble Sort',
        timeBest: 'O(n)',
        timeAvg: 'O(n²)',
        timeWorst: 'O(n²)',
        space: 'O(1)',
        pros: 'Conceptually simple',
        cons: 'Performs far more swaps and comparisons than Insertion Sort',
        bestFor: 'Educational demos only',
      },
      {
        name: 'Merge Sort',
        timeBest: 'O(n log n)',
        timeAvg: 'O(n log n)',
        timeWorst: 'O(n log n)',
        space: 'O(n)',
        pros: 'Guaranteed O(n log n), stable',
        cons: 'Requires O(n) auxiliary memory, slower on tiny arrays due to overhead',
        bestFor: 'Large datasets, external sorting, linked lists',
      },
    ],
    recommendation: 'Insertion Sort is the premier quadratic sorting algorithm. It is actively utilized inside industry-grade hybrid sorts for small partitions.',
  },

  'merge-sort': {
    title: 'Merge Sort Applications & Comparisons',
    summary: 'Divide-and-conquer algorithm splitting the array into halves, sorting recursively, and merging in linear time.',
    applications: [
      {
        title: 'External Sorting on Huge Disk Files',
        domain: 'Big Data & Database Systems',
        description: 'Sorts multi-terabyte log files that cannot fit into RAM by sorting chunks in memory and performing multi-way merges from disk.',
      },
      {
        title: 'Sorting Linked Lists',
        domain: 'Pointer Data Structures',
        description: 'Achieves O(n log n) sort on linked lists with O(1) auxiliary pointer manipulation without allocating extra array buffers.',
      },
      {
        title: 'Guaranteed Worst-Case SLAs',
        domain: 'Mission-Critical & Real-Time Systems',
        description: 'Guarantees O(n log n) execution time under all input distributions, avoiding Quick Sort degradation.',
      },
      {
        title: 'Stable Sorting in Enterprise Java & Python',
        domain: 'Enterprise Applications',
        description: 'Powers object sorting where identical keys must retain original relative ordering (e.g. sorting employees by salary then name).',
      },
    ],
    comparisons: [
      {
        name: 'Merge Sort',
        timeBest: 'O(n log n)',
        timeAvg: 'O(n log n)',
        timeWorst: 'O(n log n)',
        space: 'O(n) auxiliary',
        pros: 'Deterministic O(n log n) in all cases, stable, excellent for sequential access',
        cons: 'Requires O(n) extra RAM for temporary merge arrays',
        bestFor: 'External disk sorting, linked lists, stability-mandated applications',
        highlight: true,
      },
      {
        name: 'Quick Sort',
        timeBest: 'O(n log n)',
        timeAvg: 'O(n log n)',
        timeWorst: 'O(n²)',
        space: 'O(log n)',
        pros: 'Faster in-memory cache constant factors, in-place',
        cons: 'Unstable, degraded O(n²) worst case on malicious inputs',
        bestFor: 'General in-memory sorting where stability is not required',
      },
      {
        name: 'Heap Sort',
        timeBest: 'O(n log n)',
        timeAvg: 'O(n log n)',
        timeWorst: 'O(n log n)',
        space: 'O(1)',
        pros: 'Guaranteed O(n log n) and strictly in-place (O(1) space)',
        cons: 'Unstable, poor cache locality due to jumping indices',
        bestFor: 'Embedded safety-critical systems with strict memory bounds',
      },
    ],
    recommendation: 'Choose Merge Sort when stability is required, when sorting linked lists, or when handling external datasets larger than available RAM.',
  },

  'quick-sort': {
    title: 'Quick Sort Applications & Comparisons',
    summary: 'Picks a pivot element and partitions the array into smaller and larger subarrays recursively.',
    applications: [
      {
        title: 'Standard Library Default Sort Engine',
        domain: 'C runtime (qsort), C++ std::sort, JavaScript V8',
        description: 'The standard choice for in-memory sorting due to tight inner loops and superior cache spatial locality.',
      },
      {
        title: 'High-Performance Numeric Computing',
        domain: 'Scientific Computing & Game Engines',
        description: 'Sorts geometric vertices, physics bodies, and financial transactions with minimal memory footprint.',
      },
      {
        title: 'Quickselect Algorithm (K-th Order Statistic)',
        domain: 'Data Analytics & Statistics',
        description: 'Partitions like Quick Sort to find medians or K-th smallest values in O(n) average time without full sorting.',
      },
    ],
    comparisons: [
      {
        name: 'Quick Sort',
        timeBest: 'O(n log n)',
        timeAvg: 'O(n log n)',
        timeWorst: 'O(n²)',
        space: 'O(log n) call stack',
        pros: 'Fastest practical in-memory sort, in-place, cache friendly',
        cons: 'Unstable, O(n²) worst case if pivot choice is adversarial',
        bestFor: 'General in-memory array sorting, high-performance engines',
        highlight: true,
      },
      {
        name: 'Merge Sort',
        timeBest: 'O(n log n)',
        timeAvg: 'O(n log n)',
        timeWorst: 'O(n log n)',
        space: 'O(n) extra RAM',
        pros: 'Guaranteed O(n log n), stable',
        cons: 'Higher memory allocation overhead',
        bestFor: 'Linked lists, external disk files, multi-criteria stable sorting',
      },
      {
        name: 'Timsort (Hybrid)',
        timeBest: 'O(n)',
        timeAvg: 'O(n log n)',
        timeWorst: 'O(n log n)',
        space: 'O(n)',
        pros: 'Stable, takes advantage of pre-existing ordered runs in real-world data',
        cons: 'Complex implementation combining merge and insertion sort',
        bestFor: 'Real-world data containing naturally sorted sub-sequences',
      },
    ],
    recommendation: 'Quick Sort is the top choice for fast in-memory sorting where stability is unnecessary and memory is limited.',
  },

  searching: {
    title: 'Searching Algorithms Applications & Comparisons',
    summary: 'Techniques for locating target values across linear collections and ordered search spaces.',
    applications: [
      {
        title: 'Full-Scan Filtering',
        domain: 'Information Retrieval',
        description: 'Unindexed attribute queries and stream filters execute linear scans across incoming events.',
      },
      {
        title: 'Indexed Database Lookups',
        domain: 'Database Engines',
        description: 'B-Tree leaf pages and clustered indices perform binary searches to fetch matching row pointers.',
      },
      {
        title: 'Routing & Address Resolution',
        domain: 'Networking',
        description: 'Longest prefix matching and subnet lookups use binary and trie searching for rapid packet forwarding.',
      },
    ],
    comparisons: [
      {
        name: 'Linear Search',
        timeBest: 'O(1)',
        timeAvg: 'O(n)',
        timeWorst: 'O(n)',
        space: 'O(1)',
        pros: 'No prerequisite, works on unsorted arrays and linked lists',
        cons: 'Slow for large datasets',
        bestFor: 'Small or unsorted collections, one-time queries',
      },
      {
        name: 'Binary Search',
        timeBest: 'O(1)',
        timeAvg: 'O(log n)',
        timeWorst: 'O(log n)',
        space: 'O(1)',
        pros: 'Extremely fast, logarithmic scaling',
        cons: 'Requires pre-sorted random-access array',
        bestFor: 'Sorted arrays, static catalogs, range boundaries',
        highlight: true,
      },
      {
        name: 'Hash Map Lookup',
        timeBest: 'O(1)',
        timeAvg: 'O(1)',
        timeWorst: 'O(n)',
        space: 'O(n)',
        pros: 'Near-instant constant time average lookup',
        cons: 'Cannot perform range queries or find min/max',
        bestFor: 'Direct key-value lookups, session stores, caches',
      },
    ],
    recommendation: 'For single lookups in unsorted data, use Linear Search. For repeated queries, sort the data and use Binary Search or index with a Hash Map.',
  },

  sorting: {
    title: 'Sorting Algorithms Master Comparison',
    summary: 'Comparison of all core sorting techniques across stability, complexity, and operational trade-offs.',
    applications: [
      {
        title: 'Database Query Optimization',
        domain: 'SQL & Database Systems',
        description: 'ORDER BY clauses and merge joins depend heavily on fast sorting algorithms.',
      },
      {
        title: 'Search Pre-requisite',
        domain: 'Algorithms & Search',
        description: 'Sorting enables Binary Search, duplicate detection, and convex hull calculations in geometry.',
      },
      {
        title: 'Analytics & Leaderboards',
        domain: 'Business Intelligence & Gaming',
        description: 'Ranks scores, financial transactions, and performance metrics in sorted order.',
      },
    ],
    comparisons: [
      {
        name: 'Bubble Sort',
        timeBest: 'O(n)',
        timeAvg: 'O(n²)',
        timeWorst: 'O(n²)',
        space: 'O(1)',
        pros: 'Educational, detect sorted input',
        cons: 'Slow, high swap count',
        bestFor: 'Teaching foundational mechanics',
      },
      {
        name: 'Selection Sort',
        timeBest: 'O(n²)',
        timeAvg: 'O(n²)',
        timeWorst: 'O(n²)',
        space: 'O(1)',
        pros: 'Minimal memory writes (<= n swaps)',
        cons: 'Quadratic comparisons always',
        bestFor: 'Flash/EEPROM storage devices',
      },
      {
        name: 'Insertion Sort',
        timeBest: 'O(n)',
        timeAvg: 'O(n²)',
        timeWorst: 'O(n²)',
        space: 'O(1)',
        pros: 'Adaptive, stable, fast for small N',
        cons: 'Quadratic on reverse data',
        bestFor: 'Small arrays (N < 50) and nearly sorted data',
      },
      {
        name: 'Merge Sort',
        timeBest: 'O(n log n)',
        timeAvg: 'O(n log n)',
        timeWorst: 'O(n log n)',
        space: 'O(n)',
        pros: 'Guaranteed O(n log n), stable',
        cons: 'O(n) auxiliary RAM required',
        bestFor: 'External disk sorting, linked lists',
        highlight: true,
      },
      {
        name: 'Quick Sort',
        timeBest: 'O(n log n)',
        timeAvg: 'O(n log n)',
        timeWorst: 'O(n²)',
        space: 'O(log n)',
        pros: 'Fastest average in-memory sort',
        cons: 'Unstable, bad pivot degrades to O(n²)',
        bestFor: 'General in-memory sorting',
        highlight: true,
      },
    ],
    recommendation: 'Use Quick Sort for general fast in-memory sorting, Merge Sort for stable/external sorting, and Insertion Sort for small partitions.',
  },

  basics: {
    title: 'DSA Foundational Matrix & Real-World Decision Guide',
    summary: 'Comprehensive comparison of foundational data structures and algorithm selection rules of thumb.',
    applications: [
      {
        title: 'Software System Architecture',
        domain: 'Enterprise Engineering',
        description: 'Every high-performance system (databases, browsers, OS kernels, game engines) relies on selecting the optimal data structure.',
      },
      {
        title: 'Technical Interviews & Coding Assessments',
        domain: 'Career & Industry Standard',
        description: 'Demonstrates deep understanding of trade-offs between time complexity, memory footprint, and engineering requirements.',
      },
      {
        title: 'Algorithmic Problem Solving',
        domain: 'Computer Science',
        description: 'Equips developers to reason systematically, recognize design patterns, and avoid quadratic anti-patterns.',
      },
    ],
    comparisons: [
      {
        name: 'Array',
        timeBest: 'O(1) access',
        timeAvg: 'O(n) search',
        timeWorst: 'O(n) insert',
        space: 'Contiguous',
        pros: 'Instant index access, optimal cache locality',
        cons: 'Fixed size, slow insertions/deletions',
        bestFor: 'Static collections, math matrices, pixel buffers',
        highlight: true,
      },
      {
        name: 'Linked List',
        timeBest: 'O(1) head insert',
        timeAvg: 'O(n) access',
        timeWorst: 'O(n) search',
        space: 'Non-contiguous',
        pros: 'Dynamic growth, constant-time boundary insert',
        cons: 'Pointer overhead, poor cache locality',
        bestFor: 'Frequent insertion/removal, free memory lists',
      },
      {
        name: 'Stack (LIFO)',
        timeBest: 'O(1) push',
        timeAvg: 'O(1) pop',
        timeWorst: 'O(1) peek',
        space: 'Contiguous/Node',
        pros: 'Strict LIFO discipline, simple invariant',
        cons: 'No random access to middle elements',
        bestFor: 'Call stack, undo/redo, bracket parsing, DFS',
      },
      {
        name: 'Queue (FIFO)',
        timeBest: 'O(1) enqueue',
        timeAvg: 'O(1) dequeue',
        timeWorst: 'O(1) front',
        space: 'Contiguous/Ring',
        pros: 'Strict FIFO discipline, fair ordering',
        cons: 'No random access to internal elements',
        bestFor: 'Asynchronous task pipelines, printer spooling, BFS',
      },
    ],
    recommendation: 'Match the data structure to access patterns: Contiguous Arrays for random access, Linked Lists for boundary churn, Stacks for LIFO reversal, and Queues for FIFO scheduling.',
  },
};

interface ConceptDeepDiveProps {
  topic: ConceptTopic;
  compact?: boolean;
}

export function ConceptDeepDive({ topic, compact = false }: ConceptDeepDiveProps) {
  const [activeTab, setActiveTab] = useState<'applications' | 'comparisons'>('applications');
  const data = CONCEPT_DATA[topic];

  if (!data) return null;

  return (
    <div className={`concept-deep-dive ${compact ? 'compact-mode' : ''}`}>
      <div className="cdd-header">
        <div className="cdd-title-row">
          <span className="cdd-badge">Deep Dive</span>
          <h3 className="cdd-title">{data.title}</h3>
        </div>
        <p className="cdd-summary">{data.summary}</p>
      </div>

      <div className="cdd-tabs">
        <button
          className={`cdd-tab-btn ${activeTab === 'applications' ? 'active' : ''}`}
          onClick={() => setActiveTab('applications')}
        >
          Real-World Applications ({data.applications.length})
        </button>
        <button
          className={`cdd-tab-btn ${activeTab === 'comparisons' ? 'active' : ''}`}
          onClick={() => setActiveTab('comparisons')}
        >
          Trade-offs &amp; Comparisons ({data.comparisons.length})
        </button>
      </div>

      {activeTab === 'applications' && (
        <div className="cdd-tab-content cdd-applications-view">
          <div className="cdd-apps-grid">
            {data.applications.map((app, idx) => (
              <div key={idx} className="cdd-app-card">
                <div className="cdd-app-header">
                  <div>
                    <h4 className="cdd-app-name">{app.title}</h4>
                    <span className="cdd-app-domain">{app.domain}</span>
                  </div>
                </div>
                <p className="cdd-app-desc">{app.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'comparisons' && (
        <div className="cdd-tab-content cdd-comparisons-view">
          <div className="cdd-table-container">
            <table className="cdd-comparison-table">
              <thead>
                <tr>
                  <th>Data Structure / Algorithm</th>
                  <th>Time Complexity</th>
                  <th>Aux Space</th>
                  <th>Key Strengths (Pros)</th>
                  <th>Trade-offs (Cons)</th>
                  <th>When to Choose</th>
                </tr>
              </thead>
              <tbody>
                {data.comparisons.map((row, idx) => (
                  <tr key={idx} className={row.highlight ? 'row-highlight' : ''}>
                    <td className="cdd-col-name">
                      <strong>{row.name}</strong>
                      {row.highlight && <span className="current-concept-pill">Current</span>}
                    </td>
                    <td className="cdd-col-time">
                      <div className="time-badge best">Best: {row.timeBest}</div>
                      <div className="time-badge avg">Avg: {row.timeAvg}</div>
                      <div className="time-badge worst">Worst: {row.timeWorst}</div>
                    </td>
                    <td className="cdd-col-space">
                      <code>{row.space}</code>
                    </td>
                    <td className="cdd-col-pros">{row.pros}</td>
                    <td className="cdd-col-cons">{row.cons}</td>
                    <td className="cdd-col-bestfor">
                      <span className="bestfor-text">{row.bestFor}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="cdd-recommendation-box">
        <div className="rec-body">
          <strong>Architectural Rule of Thumb:</strong>
          <p>{data.recommendation}</p>
        </div>
      </div>
    </div>
  );
}

export default ConceptDeepDive;
