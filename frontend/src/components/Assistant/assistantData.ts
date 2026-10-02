export interface TopicCheatSheet {
  title: string;
  timeComplexity: {
    access?: string;
    search?: string;
    insertion?: string;
    deletion?: string;
    best?: string;
    average?: string;
    worst?: string;
  };
  spaceComplexity: string;
  keyRule: string;
  pros: string[];
  cons: string[];
}

export interface TopicChallenge {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface TopicAssistantInfo {
  topicName: string;
  greeting: string;
  eli5: string;
  funFact: string;
  interviewGotcha: string;
  cheatSheet: TopicCheatSheet;
  challenge: TopicChallenge;
  suggestedQuestions: { q: string; a: string }[];
}

export const TOPIC_DATA: Record<string, TopicAssistantInfo> = {
  home: {
    topicName: "Visual DSA Hub",
    greeting: "Yoohoo! I'm Lemmy, your furry DSA guide! Pick any topic from the nav bar, and let's make algorithms bounce!",
    eli5: "Data structures are like different boxes to pack your toys: some are easy to find things in, others are quick to pack away!",
    funFact: "Lemmings don't actually jump off cliffs! That's a myth. But recursive functions without a base case definitely jump off the stack cliff!",
    interviewGotcha: "Always ask your interviewer: Can the input be empty? Are there negative numbers? Is the data sorted?",
    cheatSheet: {
      title: "Big-O Quick Hierarchy (Fastest to Slowest)",
      timeComplexity: {
        best: "O(1) Constant",
        average: "O(log n) Logarithmic < O(n) Linear < O(n log n)",
        worst: "O(n²) Quadratic < O(2ⁿ) Exponential < O(n!) Factorial",
      },
      spaceComplexity: "Auxiliary space = extra memory used beyond the input!",
      keyRule: "Ignore constants and low-order terms as input size N grows toward infinity.",
      pros: ["Gives hardware-independent metric", "Helps predict scaling limits"],
      cons: ["Ignores cache locality and low constants for small N"],
    },
    challenge: {
      question: "Which of these Big-O complexities grows the SLOWEST as N gets huge?",
      options: ["O(n log n)", "O(log n)", "O(n)", "O(n²)"],
      correctIndex: 1,
      explanation: "O(log n) is logarithmic! Cutting the problem in half each time makes it blisteringly fast!",
    },
    suggestedQuestions: [
      { q: "What should I learn first?", a: "Start with Arrays and Basics! Once you understand contiguous memory, moving to Linked Lists and Stacks will feel like child's play!" },
      { q: "Why do we use Big-O notation?", a: "Because computers have different CPUs and RAM speeds. Big-O tells us how the algorithm scales regardless of what machine runs it!" },
      { q: "Tell me a programmer joke!", a: "Why did the developer go broke? Because they used up all their cache!" }
    ],
  },
  basics: {
    topicName: "DSA Basics & Big-O",
    greeting: "Big-O time! Don't let the Greek letters scare you—I survived a bear, you can survive Time Complexity!",
    eli5: "Big-O is like planning a birthday party. O(1) is flipping a light switch. O(n) is greeting each guest. O(n²) is making every guest high-five every other guest!",
    funFact: "If an algorithm runs in O(2ⁿ) with n=100, the universe will experience heat death before it finishes!",
    interviewGotcha: "Beware of hidden loops inside helper methods! For example, `String.indexOf()` or `Array.includes()` inside an outer loop silently turns your code into O(n²)!",
    cheatSheet: {
      title: "Asymptotic Notation Guide",
      timeComplexity: {
        best: "Ω (Omega) - Lower bound (Best case)",
        average: "Θ (Theta) - Tight bound (Average case)",
        worst: "O (Big-O) - Upper bound (Worst case guarantee)",
      },
      spaceComplexity: "Include recursive call stack frames when measuring memory!",
      keyRule: "Drop non-dominant terms: O(3n² + 100n + 50) simplifies directly to O(n²).",
      pros: ["Predicts behavior for large datasets", "Crucial standard in technical interviews"],
      cons: ["Constant factors can matter in practice for small N"],
    },
    challenge: {
      question: "What is the time complexity of searching an unsorted array of size N?",
      options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
      correctIndex: 2,
      explanation: "O(n) linear search! In the worst case, the item you are looking for is at the very last index or not present at all.",
    },
    suggestedQuestions: [
      { q: "What's the difference between Space Complexity and Auxiliary Space?", a: "Space complexity includes both the input size and the extra memory. Auxiliary space only counts the extra temporary memory your algorithm allocates!" },
      { q: "When is O(n²) acceptable?", a: "When N is tiny (e.g. N <= 50) and simplicity / low memory overhead is more important than complex divide-and-conquer code!" },
    ],
  },
  array: {
    topicName: "Arrays",
    greeting: "Arrays! Think of them as a row of lockers numbered 0 to N-1 glued tight in memory!",
    eli5: "An array is an egg carton! Every slot has an exact number (index). If you know the index, grabbing the egg is instant O(1)!",
    funFact: "Why do array indices start at 0? Because index is actually an OFFSET memory address: `Address = Base + (Index * ElementSize)`!",
    interviewGotcha: "Arrays have fixed sizes in memory. When a dynamic array (like JavaScript Array or Python List) grows full, it allocates DOUBLE memory and copies everything over (Amortized O(1))!",
    cheatSheet: {
      title: "Array Complexity Cheat Sheet",
      timeComplexity: {
        access: "O(1) - Instant via index offset",
        search: "O(n) - Unsorted / O(log n) if sorted",
        insertion: "O(n) - Needs to shift elements right",
        deletion: "O(n) - Needs to shift elements left",
      },
      spaceComplexity: "O(n) contiguous block",
      keyRule: "Contiguous in memory = exceptional CPU cache locality and hardware prefetching!",
      pros: ["Lightning-fast random access", "Compact memory without pointer overhead", "Cache-friendly"],
      cons: ["Costly insertions and deletions", "Fixed capacity in low-level arrays"],
    },
    challenge: {
      question: "If you insert an element at index 0 of an array with 1,000 items, how many shifts happen?",
      options: ["0 shifts", "1 shift", "1,000 shifts", "500 shifts"],
      correctIndex: 2,
      explanation: "All 1,000 existing elements must shift right by 1 position to make room for index 0! That's why insertion at head is O(n).",
    },
    suggestedQuestions: [
      { q: "Why is accessing an array element O(1)?", a: "Because the computer calculates `base_memory_address + index * size_of_type` with simple math in a single CPU instruction!" },
      { q: "What is cache locality?", a: "Because array items sit side-by-side in RAM, modern CPUs load nearby items into ultra-fast L1/L2 cache in advance!" },
      { q: "Array vs Linked List?", a: "Array wins on random access and memory density. Linked List wins on constant-time O(1) insertions at head or if you already hold a pointer!" }
    ],
  },
  linkedlist: {
    topicName: "Linked Lists",
    greeting: "Linked Lists! A treasure hunt where every node holds a value and a secret map to the next one!",
    eli5: "Think of a scavenger hunt! You start at Clue #1 (Head). Each clue tells you where to find the next clue. You can't skip ahead—you must follow the trail!",
    funFact: "Linked Lists were invented back in 1955 by Allen Newell, Cliff Shaw, and Herbert Simon for their Logic Theorist AI program!",
    interviewGotcha: "Always check for `null` pointers before doing `node.next.val`! The classic trap is losing the pointer to the rest of your list during an insert or reverse!",
    cheatSheet: {
      title: "Singly Linked List Cheat Sheet",
      timeComplexity: {
        access: "O(n) - Sequential traversal from Head",
        search: "O(n) - Must scan node by node",
        insertion: "O(1) at Head, O(n) at Tail without tail pointer",
        deletion: "O(1) if pointer is given, O(n) to find prev node",
      },
      spaceComplexity: "O(n) + pointer overhead (8 bytes per pointer in 64-bit systems)",
      keyRule: "Nodes can be scattered anywhere across heap memory connected solely by pointers.",
      pros: ["Dynamic sizing without reallocation", "Fast insertions and deletions once location is found"],
      cons: ["No random indexing", "Poor cache locality due to pointer chasing", "Extra memory per node"],
    },
    challenge: {
      question: "What happens if you execute `head = head.next` in a Singly Linked List?",
      options: ["Deletes the whole list", "Removes the head node", "Reverses the list", "Finds the middle node"],
      correctIndex: 1,
      explanation: "The original head is bypassed! In garbage-collected languages like JS, the orphaned first node is reclaimed automatically.",
    },
    suggestedQuestions: [
      { q: "How do you find the middle of a Linked List in one pass?", a: "Use the Fast & Slow Pointer (Tortoise and Hare) technique! Fast moves 2 steps, slow moves 1. When fast reaches the end, slow is in the middle!" },
      { q: "How do you detect a cycle?", a: "Floyd's Cycle-Finding Algorithm! If there's a loop, the fast pointer will eventually lap the slow pointer and they will collide." },
    ],
  },
  stack: {
    topicName: "Stack",
    greeting: "Stacks! LIFO: Last In, First Out! Don't let your pancakes topple over!",
    eli5: "A stack of yummy cafeteria trays! You put new trays on TOP, and whenever someone takes a tray, they take the TOP one first!",
    funFact: "Every time your code calls a function, your computer uses the Call Stack to remember where to return! Infinite recursion causes a 'Stack Overflow'!",
    interviewGotcha: "Watch out for popping an empty stack (`Stack Underflow`)! Always check `isEmpty()` before running `.pop()` or `.peek()`!",
    cheatSheet: {
      title: "Stack Operations Cheat Sheet",
      timeComplexity: {
        access: "O(n) - Stacks don't allow random access",
        search: "O(n) - Must pop items to inspect",
        insertion: "O(1) Push to top",
        deletion: "O(1) Pop from top",
      },
      spaceComplexity: "O(n) maximum elements pushed",
      keyRule: "LIFO: Last-In, First-Out. Only the top element is accessible at any given moment.",
      pros: ["Guaranteed O(1) push and pop", "Ideal for undo history, parsing syntax, and DFS"],
      cons: ["No random access to middle elements"],
    },
    challenge: {
      question: "Which real-world feature is typically implemented using a Stack?",
      options: ["Print queue", "Browser Back button", "CPU task scheduler", "Music playlist repeat"],
      correctIndex: 1,
      explanation: "Browser back history and text editor Ctrl+Z undo both use Stacks! The most recent action is always the first one undone.",
    },
    suggestedQuestions: [
      { q: "How do you check for balanced parentheses?", a: "Push every opening bracket `(`, `[`, `{` onto the stack. When you hit a closing bracket, pop and check if they match! If empty at the end, it's balanced!" },
      { q: "Can you implement a Queue using two Stacks?", a: "Yes! Push all elements into Stack 1. When popping, if Stack 2 is empty, pop everything from Stack 1 into Stack 2 to reverse the order!" },
    ],
  },
  queue: {
    topicName: "Queue",
    greeting: "Queues! FIFO: First In, First Out! Fair is fair, first in line gets the acorn!",
    eli5: "Standing in line for movie popcorn! The first person to arrive is the first person served and leaves first!",
    funFact: "Web servers use queues to handle thousands of requests without dropping traffic! Spikes sit patiently in the queue buffer.",
    interviewGotcha: "If you implement a queue with a standard array using `array.shift()` in JavaScript, dequeueing is O(n) because every element must slide down! Use a Linked List or Circular Array for true O(1)!",
    cheatSheet: {
      title: "Queue Operations Cheat Sheet",
      timeComplexity: {
        access: "O(n)",
        search: "O(n)",
        insertion: "O(1) Enqueue at Rear",
        deletion: "O(1) Dequeue from Front",
      },
      spaceComplexity: "O(n) queue elements",
      keyRule: "FIFO: First-In, First-Out. Insert at Rear, remove from Front.",
      pros: ["Fair order preservation", "Core foundation for BFS (Breadth-First Search) and message queues"],
      cons: ["No direct middle element access"],
    },
    challenge: {
      question: "In Breadth-First Search (BFS) graph traversal, which data structure is used?",
      options: ["Stack", "Queue", "Priority Heap", "Hash Table"],
      correctIndex: 1,
      explanation: "Queue! It processes nodes level-by-level in the order they were discovered.",
    },
    suggestedQuestions: [
      { q: "What's the difference between Queue and Stack?", a: "Stack is LIFO (last item in leaves first). Queue is FIFO (first item in leaves first). Stack is a stack of books; Queue is a ticket line!" },
      { q: "What is a Deque?", a: "A Double-Ended Queue! It allows O(1) push and pop from BOTH the front and the back." },
    ],
  },
  "circular-queue": {
    topicName: "Circular Queue",
    greeting: "Circular Queue! Modulo arithmetic `%` makes the end wrap around to the beginning like a carousel!",
    eli5: "Think of a pizza pan with numbered slices in a circle! When you reach the last slice, you spin right back to slice #0 without shifting anything!",
    funFact: "Circular ring buffers are used in audio streaming, keyboard input buffers, and video playback so memory is never wasted or shifted!",
    interviewGotcha: "How do you distinguish between Queue Full and Queue Empty? Either keep an explicit `count` variable, or leave 1 slot blank: `(rear + 1) % size === front`!",
    cheatSheet: {
      title: "Circular Ring Buffer Cheat Sheet",
      timeComplexity: {
        insertion: "O(1) via `rear = (rear + 1) % capacity`",
        deletion: "O(1) via `front = (front + 1) % capacity`",
        access: "O(1) if accessing front or rear",
      },
      spaceComplexity: "O(k) fixed capacity - zero memory reallocation",
      keyRule: "Avoids memory drift of linear queues by wrapping indices with modulo `%`.",
      pros: ["Fixed memory footprint", "Reuses freed slots automatically", "O(1) enqueue and dequeue"],
      cons: ["Fixed maximum capacity (cannot dynamically grow without reallocation)"],
    },
    challenge: {
      question: "If capacity is 5 and rear is at index 4, what is the next rear index?",
      options: ["5", "0", "4", "1"],
      correctIndex: 1,
      explanation: "`(4 + 1) % 5 = 5 % 5 = 0`! It wraps right around to index 0!",
    },
    suggestedQuestions: [
      { q: "Why use Circular Queue instead of standard Queue?", a: "In a standard array queue, dequeueing leaves empty slots at the start that can't be reused without expensive O(n) shifting. Circular Queue reuses them instantly in O(1)!" },
      { q: "What does the modulo `%` operator do here?", a: "It returns the remainder of division, ensuring indices stay strictly within `[0, capacity - 1]`!" },
    ],
  },
  searching: {
    topicName: "Searching Algorithms",
    greeting: "Searching for clues or acorns! Linear Search checks everyone, but Binary Search chops the world in half!",
    eli5: "Linear search is looking for your socks by checking every drawer one by one. Binary search is guessing a number 1-100 where your friend says 'higher' or 'lower'!",
    funFact: "With Binary Search, you can locate any person out of 8 BILLION people on Earth in just 33 guesses! `log2(8,000,000,000) ≈ 33`!",
    interviewGotcha: "Calculating middle as `(low + high) / 2` can cause 32-bit integer overflow in languages like C++/Java! Always write `low + (high - low) / 2`!",
    cheatSheet: {
      title: "Search Comparison",
      timeComplexity: {
        access: "Linear: O(n) worst / O(1) best",
        search: "Binary: O(log n) worst / O(1) best",
      },
      spaceComplexity: "Iterative Binary Search: O(1) auxiliary space",
      keyRule: "CRITICAL: Binary Search REQUIRES the dataset to be sorted first!",
      pros: ["Binary search scales to billions of records in milliseconds"],
      cons: ["Sorting beforehand costs O(n log n)"],
    },
    challenge: {
      question: "What is the maximum number of comparisons to find an element in a sorted list of 1,024 items using Binary Search?",
      options: ["1,024", "512", "11", "100"],
      correctIndex: 2,
      explanation: "Since 2¹⁰ = 1,024, at most 10 or 11 comparisons are needed in the worst case! Incredible logarithmic efficiency!",
    },
    suggestedQuestions: [
      { q: "When should I use Linear Search instead of Binary Search?", a: "When the array is unsorted and you only search once, or when the array is very short (e.g. less than 15 items)!" },
      { q: "Can Binary Search be used on a Linked List?", a: "No! Binary Search needs O(1) random access to jump to the middle. In a linked list, finding the middle requires O(n) traversal, ruining O(log n)!" },
    ],
  },
  sorting: {
    topicName: "Sorting Algorithms",
    greeting: "Sorting time! Let's arrange our nuts from smallest to biggest! Bubble, Selection, Insertion, Merge, and Quick Sort!",
    eli5: "Bubble sort is like bubbles floating up to the surface. Merge sort is splitting a messy deck of cards in half, sorting each half, and shuffling them together!",
    funFact: "Python's `sort()` and JavaScript's V8 engine both use hybrid sorting algorithms like Timsort (Merge + Insertion) or Introsort (Quick + Heap + Insertion)!",
    interviewGotcha: "QuickSort's worst-case is O(n²) if you pick bad pivots on an already sorted array! Randomized pivots or 3-way median-of-three solves this.",
    cheatSheet: {
      title: "Sorting Showdown",
      timeComplexity: {
        best: "Insertion Sort O(n) when nearly sorted",
        average: "Merge & Quick Sort: O(n log n)",
        worst: "Bubble, Selection, Insertion: O(n²)",
      },
      spaceComplexity: "Merge Sort: O(n) | Quick Sort: O(log n) | Bubble/Selection/Insertion: O(1)",
      keyRule: "Stability means duplicate elements preserve their original relative order.",
      pros: ["QuickSort is usually fastest in-place in real CPU caches", "MergeSort is guaranteed O(n log n) and stable"],
      cons: ["MergeSort requires O(n) auxiliary memory"],
    },
    challenge: {
      question: "Which sorting algorithm is GUARANTEED to run in O(n log n) even in the worst case?",
      options: ["Quick Sort", "Bubble Sort", "Merge Sort", "Selection Sort"],
      correctIndex: 2,
      explanation: "Merge Sort! It divides into halves recursively and merges in linear time, guaranteeing O(n log n) regardless of input ordering.",
    },
    suggestedQuestions: [
      { q: "What does an algorithm being 'stable' mean?", a: "If two items have the same sorting key, a stable sort guarantees their relative order won't change after sorting!" },
      { q: "Why is QuickSort faster than MergeSort in practice?", a: "QuickSort sorts in-place with minimal cache misses and lower constant factors, whereas MergeSort constantly copies elements to auxiliary arrays." },
    ],
  },
  practice: {
    topicName: "Practice & Quizzes",
    greeting: "Quiz Arena! Time to put your knowledge to the test! Lemmy is in your corner cheering you on!",
    eli5: "Practice is how algorithms become muscle memory! The more you see the visual patterns, the quicker you'll solve coding interviews!",
    funFact: "Studies show active recall (like answering quizzes) is 300% more effective for retention than passive reading alone!",
    interviewGotcha: "Don't jump straight to code! First clarify requirements, state your brute-force approach, calculate its Big-O, and then optimize!",
    cheatSheet: {
      title: "Interview Problem-Solving Framework",
      timeComplexity: {
        best: "Clarify inputs/outputs & constraints",
        average: "Propose brute force + Big-O",
        worst: "Optimize with Hash Table, Two Pointers, or Divide & Conquer",
      },
      spaceComplexity: "Always explain your trade-offs to the interviewer!",
      keyRule: "Communicate out loud before writing a single line of code.",
      pros: ["Demonstrates structured thinking", "Helps interviewer give you hints"],
      cons: ["Silent coding often leads down the wrong path"],
    },
    challenge: {
      question: "What should you do first when an interviewer gives you a complex problem?",
      options: ["Write code immediately", "Clarify edge cases & test inputs", "Ask for the answer", "Memorize the solution"],
      correctIndex: 1,
      explanation: "Clarify constraints and edge cases! Confirm whether values can be negative, null, empty, or duplicate.",
    },
    suggestedQuestions: [
      { q: "How do I spot when to use Two Pointers?", a: "Look for sorted arrays, palindrome checks, or problems asking for pairs that sum to a target!" },
      { q: "How do I spot when to use a Hash Map?", a: "Whenever you need O(1) lookups, counting frequencies, or checking if you've seen an element before!" },
    ],
  },
  progress: {
    topicName: "Learning Progress",
    greeting: "Look at your progress! Every topic you complete makes you stronger than a hungry grizzly bear!",
    eli5: "Consistent small steps beat giant cramming sessions! Even 15 minutes a day builds immense algorithm intuition!",
    funFact: "The human brain forms stronger neural pathways when learning with visual animations compared to plain text alone!",
    interviewGotcha: "Track your weak spots! If recursion trips you up, practice call-stack visualization until it clicks!",
    cheatSheet: {
      title: "Mastery Roadmap",
      timeComplexity: {
        best: "Arrays & Big-O",
        average: "Stacks, Queues, Linked Lists",
        worst: "Trees, Graphs, Dynamic Programming",
      },
      spaceComplexity: "Quality practice > quantity of problems",
      keyRule: "Review concepts periodically (spaced repetition) to make them permanent.",
      pros: ["Builds confidence for real coding challenges", "Prepares you for top-tier interviews"],
      cons: ["Skipping fundamentals makes advanced topics much harder"],
    },
    challenge: {
      question: "Which technique is proven to produce the highest long-term retention of algorithms?",
      options: ["Cramming all night", "Spaced repetition with visual testing", "Reading code without running it", "Copy-pasting solutions"],
      correctIndex: 1,
      explanation: "Spaced repetition and active visual testing create durable long-term neural connections!",
    },
    suggestedQuestions: [
      { q: "How often should I review completed topics?", a: "Review after 1 day, then 3 days, then 1 week, then 1 month! Spaced repetition locks it into long-term memory." },
    ],
  }
};

export const GENERAL_DSA_FAQS = [
  {
    keywords: ["recursion", "recursive", "call stack", "base case"],
    answer: "Recursion is when a function calls itself! Every recursive function MUST have two things: 1) A Base Case (to stop, otherwise stack overflow!) and 2) A Recursive Step that gets closer to the base case."
  },
  {
    keywords: ["hash", "map", "hashmap", "dictionary", "hash table"],
    answer: "Hash Maps use a hashing function to map keys to bucket indices! They provide average O(1) time complexity for insertion, deletion, and lookup. Watch out for hash collisions, which are handled via chaining or open addressing."
  },
  {
    keywords: ["tree", "binary tree", "bst"],
    answer: "A Binary Search Tree (BST) maintains the invariant: all nodes in the left subtree are smaller than the root, and all nodes in the right subtree are greater! In a balanced BST, search is O(log n)."
  },
  {
    keywords: ["graph", "bfs", "dfs"],
    answer: "Graphs are sets of vertices and edges! Use BFS (Breadth-First Search with a Queue) to find shortest paths in unweighted graphs. Use DFS (Depth-First Search with a Stack/Recursion) for pathfinding and cycle detection!"
  },
  {
    keywords: ["dynamic programming", "dp", "memoization"],
    answer: "Dynamic Programming (DP) is solving overlapping subproblems and remembering previous answers! 1) Memoization (Top-down recursion + cache), or 2) Tabulation (Bottom-up iterative table)!"
  },
  {
    keywords: ["big o", "complexity", "time complexity", "space complexity"],
    answer: "Big-O measures how time or memory grows as input size N grows toward infinity. Remember: O(1) < O(log n) < O(n) < O(n log n) < O(n²) < O(2ⁿ) < O(n!)!"
  },
  {
    keywords: ["who are you", "lemmy", "lemming", "cartoon", "mascot"],
    answer: "I'm Lemmy! The fluffiest, bluest, buck-toothed algorithm guide in the forest! I help you understand Data Structures & Algorithms visually without tears!"
  },
  {
    keywords: ["joke", "funny", "laugh"],
    answer: "There are only 10 types of people in the world: those who understand binary, and those who don't!"
  }
];
