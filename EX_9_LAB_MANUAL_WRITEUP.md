# 25SS322 Python Programming Lab (Jun - Nov 2026)
# EXERCISE NO: 9 — PROJECT PROPOSAL, TOOL ALLOCATION & ENVIRONMENT SETUP

---

## 1. PROJECT PROPOSAL (Full 1.5 Page Long-Size Note Format)

### **Title of the Project:**
**Visual DSA – An Interactive, Full-Stack Data Structures and Algorithms Learning, Real-Time Simulation, and Skill Verification System**

---

### **1.1 Abstract & Problem Statement:**
Understanding Data Structures and Algorithms (DSA) is a foundational cornerstone of Computer Science and Software Engineering. However, traditional pedagogical methods rely heavily on static textbook diagrams, theoretical blackboard proofs, and abstract code snippets. Beginners frequently struggle to visualize how dynamic pointer shifts, memory allocations, recursive call stacks, and internal array mutations take place in real-time execution. Furthermore, existing online platforms either provide read-only animations or non-interactive code sandboxes with disconnected theory and no granular performance analysis.

**Visual DSA** bridges this critical gap by creating an interactive, hands-on learning environment. Users do not merely view pre-rendered GIFs; they actively trigger operations (e.g., `insert`, `delete`, `traverse`, `enqueue`, `dequeue`, `partition`, `merge`), control animation speed, inspect live memory pointers, and trace synchronized pseudocode step-by-step. The platform is paired with an intelligent analytical microservice in **Python (FastAPI)** that analyzes learner progression, computes mastery levels, and generates verified certification upon completion.

---

### **1.2 Objectives of the Project:**
1. **Interactive Visualization:** Develop responsive visualizers for fundamental linear and non-linear data structures (Arrays, Linked Lists, Stacks, FIFO Queues, Circular Queues) and core algorithms (Linear Search, Binary Search, Bubble Sort, Selection Sort, Insertion Sort, Merge Sort, Quick Sort).
2. **Synchronized Pseudocode Tracing:** Present clean, syntax-highlighted pseudocode alongside real-time memory state changes to reinforce conceptual mental models.
3. **Data-Driven Progress Analytics:** Utilize a high-performance Python analytics backend to compute learner performance, categorizing topics into "Strong Topics", "Needs Improvement", and "Recommended Next Steps".
4. **Self-Contained In-House Intelligence:** Integrate local AI assistance (Lemmy) powered by local Ollama acceleration (NVIDIA RTX 4050 GPU) with zero dependence on paid third-party external cloud APIs.
5. **Skill Verification & Certification:** Issue verifiable, tamper-evident Certificates of Completion exportable directly as vector PDF or high-resolution PNG documents.

---

### **1.3 Allocated Tools & Technology Stack:**

| Layer / Role | Technology Selected | Technical Justification |
|---|---|---|
| **Frontend UI & Visualization** | **React 19, TypeScript, Vite, React Router 7** | Component-driven reactivity, strict compile-time type safety (`tsc -b`), fast HMR via Vite, and efficient state synchronization across animation areas. |
| **Analytical & Microservice Engine** | **Python 3.12+, FastAPI, Pydantic, Uvicorn** | High-throughput asynchronous performance, typed validation through Pydantic schemas, and native mathematical/statistical capabilities for learning telemetry. |
| **API Orchestration & Gateway** | **Node.js, Express, Mongoose, JWT** | Robust session token security, rate limiting, and seamless MongoDB document transactions. |
| **Database Tier** | **MongoDB (NoSQL Document Store)** | Flexible document schema modeling for user credentials, nested topic operation checkpoints, and practice assessment logs. |
| **Local AI Engine** | **Ollama, CUDA v12 (NVIDIA RTX 4050)** | Ultra-fast local LLM inference for interactive contextual question-answering with 100% offline capability. |

---

### **1.4 Module Decomposition:**
1. **Module 1 — Linear Data Structures Visualizer:** Array contiguous allocation, Singly Linked List pointer rewiring, LIFO Stack operations, FIFO Linear Queue, and modulo-based Circular Queue with pointer wrap-around tracking.
2. **Module 2 — Algorithmic Simulators:** Divide-and-conquer partition exchange (Quick Sort), recursive sub-array merge (Merge Sort), quadratic comparisons (Bubble, Selection, Insertion Sort), and interval search (Binary & Linear Search).
3. **Module 3 — Synchronized Pseudocode Inspector:** Displays clean algorithmic logic positioned directly under the active canvas, highlighting loop conditions and pointer updates.
4. **Module 4 — Python Learning Analytics Engine:** FastAPI endpoints (`/analyze-progress`) parsing operational metrics to evaluate speed, attempts, and retention mastery.
5. **Module 5 — Practice & Self-Assessment:** Interactive multiple-choice questions reinforcing Big-O bounds, space complexity, and edge cases.
6. **Module 6 — Official Certification & Export Engine:** Live customizable certificate rendering with vector PDF printing and 2D canvas PNG generation.

---

### **1.5 Environment Setup & Configuration:**

#### **A. Python Analytics Service Environment Setup:**
```bash
# 1. Navigate to the Python microservice directory
cd python-service

# 2. Create isolated Python 3.12+ virtual environment
python -m venv .venv

# 3. Activate virtual environment (Windows PowerShell)
.\.venv\Scripts\Activate.ps1

# 4. Install production dependencies
pip install fastapi==0.110.0 uvicorn[standard]==0.29.0 pydantic==2.6.4 python-dotenv==1.0.1

# 5. Launch the FastAPI analytical service on port 8000
uvicorn app.main:app --reload --port 8000
```

#### **B. React 19 Frontend Environment Setup:**
```bash
# 1. Navigate to the React frontend directory
cd frontend

# 2. Install all npm modules (React 19, TypeScript, React Router 7)
npm install

# 3. Execute compile-time TypeScript type check
npm run build

# 4. Launch the local development server on port 5173
npm run dev
```

#### **C. Node.js & MongoDB Gateway Setup:**
```bash
cd node-backend
npm install
npm run dev
```

---
---

## 2. REPOSITORY FOLDER STRUCTURE FOR EVERY EXERCISE (Ex No 9 to Ex No 17)

Below is the clean directory layout showing how the codebase evolves progressively across each practical exercise:

```
Visual-DSA/
│
├── LAB_SCHEDULE_RECORD.md                  <-- [Ex 9] Master Lab Schedule & Exercise Mapping
├── STARTING_THE_ENGINE.md                  <-- [Ex 9] GPU & Environment Setup Guide
├── start-engine.bat                        <-- [Ex 9] 1-Click Launch Automation Script
│
├── python-service/                         <-- [Ex 9 & Ex 10] Python FastAPI Microservice
│   ├── .venv/                              <-- Virtual Environment
│   ├── requirements.txt                    <-- Python Dependencies (FastAPI, Uvicorn, Pydantic)
│   └── app/
│       ├── __init__.py
│       ├── main.py                         <-- [Ex 13] FastAPI Application Endpoints
│       ├── config.py                       <-- Environment Config & Security Keys
│       ├── analysis.py                     <-- [Ex 13 & 14] Data Analysis & Progress Mastery Math
│       └── emailing.py                     <-- In-house OTP & Notification Delivery
│
├── node-backend/                           <-- [Ex 10 & Ex 12] Express & MongoDB Gateway
│   ├── package.json
│   ├── server.mjs                          <-- Server Startup & Port Listener (Port 5000)
│   └── src/
│       ├── app.mjs                         <-- [Ex 13 & 15] Express App Configuration & Error Middleware
│       ├── db.mjs                          <-- [Ex 12] MongoDB Connection & Reconnect Handlers
│       ├── config.mjs                      <-- Environment Variables
│       ├── models/                         <-- [Ex 12] Mongoose Document Schemas
│       │   ├── User.mjs                    <-- User Credentials & Profile
│       │   ├── Progress.mjs                <-- Topic Completion Percentage
│       │   ├── Activity.mjs                <-- Operation Execution Audit Log
│       │   └── Practice.mjs                <-- Assessment Question Attempts
│       ├── routes/                         <-- [Ex 13] REST API Route Handlers
│       │   ├── auth.mjs                    <-- Login, Register, OTP Verification
│       │   ├── dashboard.mjs               <-- Dashboard Stats & Analytics Aggregation
│       │   ├── progress.mjs                <-- Topic Operations Checkpoints
│       │   ├── practice.mjs                <-- Quizzes & Scores
│       │   └── assistant.mjs               <-- Local Ollama RTX 4050 AI Proxy
│       └── middleware/                     <-- [Ex 13 & 15] Security & Error Handling
│           ├── auth.mjs                    <-- JWT Authentication Middleware
│           ├── validator.mjs               <-- [Ex 13] Input Validation Middleware
│           └── errorHandler.mjs            <-- [Ex 15] Global Exception & Error Interceptors
│
└── frontend/                               <-- [Ex 10 & Ex 11] React 19 Frontend SPA
    ├── package.json
    ├── vite.config.ts
    ├── tsconfig.json
    ├── index.html
    └── src/
        ├── main.tsx                        <-- Application Entrypoint
        ├── App.tsx                         <-- Root Router Provider
        ├── index.css                       <-- Global Typography & Slate Theme
        │
        ├── router/                         <-- [Ex 13] Navigation Flow & Route Tree
        │   └── router.tsx                  <-- React Router 7 Declarative Routes
        │
        ├── context/                        <-- [Ex 12 & 13] Global State Management
        │   └── AuthContext.tsx             <-- User Auth Session & LocalStorage Fallback
        │
        ├── hooks/                          <-- Custom React State Hooks
        │   ├── useAuth.ts                  <-- Auth Hook
        │   └── useProgress.ts              <-- [Ex 12] Progress Sync & Offline Store
        │
        ├── services/                       <-- [Ex 13] HTTP API Client Layer
        │   └── api.ts                      <-- Axios/Fetch In-House API Gateway Calls
        │
        ├── components/                     <-- [Ex 11] Reusable UI Components
        │   ├── Layout/
        │   │   ├── Layout.tsx              <-- Global Nav, Main & Footer Shell
        │   │   ├── TopicLayout.tsx         <-- 2-Column Responsive Visualizer Framework
        │   │   └── TopicLayout.css         <-- [Ex 11] Layout & Pseudocode Styling
        │   ├── Navigation/
        │   │   ├── Nav.tsx                 <-- Top Header Navigation & Dropdown
        │   │   └── Footer.tsx              <-- Footer Links & Certification Route
        │   ├── Visualization/              <-- [Ex 11 & Ex 14] Animated Memory Canvases
        │   │   ├── VisualizationComponents.tsx <-- Control Panel, Animation Area, Status
        │   │   ├── SortingPlayground.tsx   <-- [Ex 11 & 14] Animated Sorting Bar Canvas
        │   │   └── sortingAlgorithms.ts    <-- Async Frame Generator Algorithms
        │   ├── Certificate/                <-- [Ex 16 Enhancement] Certification Engine
        │   │   ├── CertificateModal.tsx    <-- Printable PDF & Canvas PNG Exporter
        │   │   └── CertificateModal.css    <-- Certificate Typography & Official Border
        │   ├── Assistant/                  <-- Cartoon Mascot AI Companion
        │   │   ├── DSAAssistant.tsx        <-- Lemmy Draggable Widget & Speech Bubble
        │   │   └── DSAAssistant.css        <-- Mascot Cartoon Animations & Actions
        │   └── Common/                     <-- [Ex 13 & 15] Core UI Atoms & Modals
        │       ├── Button.tsx
        │       ├── Modal.tsx
        │       ├── Loader.tsx
        │       └── RouteError.tsx          <-- [Ex 15] React Error Boundary Handler
        │
        └── pages/                          <-- [Ex 11 & Ex 16] Module Implementation Pages
            ├── Home/                       <-- Landing Page & Overview
            ├── Basics/                     <-- DSA Basics & Big-O Theory
            ├── Array/                      <-- Array Visualizer & Pseudocode Under Animation
            ├── LinkedList/                 <-- Linked List Visualizer & Pointer Updates
            ├── Stack/                      <-- Stack Overflow/Underflow Simulator
            ├── Queue/                      <-- FIFO Linear Queue Simulator
            ├── CircularQueue/              <-- Circular Queue Modulo Wrap-Around Simulator
            ├── Searching/                  <-- Linear & Binary Search Simulators
            ├── Sorting/                    <-- Bubble, Selection, Insertion, Merge, Quick Sort
            ├── Practice/                   <-- [Ex 14] Interactive Question Assessment Bank
            ├── Progress/                   <-- [Ex 12 & 15] Learning Analytics Dashboard
            ├── Certificate/                <-- [Ex 16] Dedicated Certificate Showcase & Download
            └── Authentication/             <-- [Ex 12 & 13] Login, Register, Forgot Password, OTP
```

---

### **3. Exercise Milestone Roadmap Summary (Ex 9 — Ex 17)**

- **Ex No 9 (18/8/26 - 19/8/26):** Project Allocation, Problem Definition, Tech Stack Decision (React + Python), Module Decomposition, and Environment Initialization.
- **Ex No 10 (25/8/26):** 3-Tier Architectural Blueprint & MongoDB Database Schema Modeling.
- **Ex No 11 (1/9/26 - 2/9/26):** Frontend Component Wireframes & Implementation of Interactive Visualizers for all 8 DSA modules.
- **Ex No 12 (8/9/26 - 9/9/26):** MongoDB Database Implementation & REST API Data Sync between React and Database.
- **Ex No 13 (15/9/26 - 16/9/26):** Strict Input Validation, Navigation Flow, and In-House Local Python/Node APIs (zero external third-party dependencies).
- **Ex No 14 (22/9/26 - 23/9/26):** White-box pointer mutation checks, Unit tests on sorting generators, Black-box UI testing, Stress testing, and Test Reports.
- **Ex No 15 (29/9/26 - 30/9/26):** Comprehensive System Trial Run, React Error Boundaries, and Global Exception Handling.
- **Ex No 16 (6/10/26 - 7/10/26):** Full Software Demonstration and Project Enhancements (Official Certificate Generator & GPU Acceleration).
- **Ex No 17 (13/10/26 - 14/10/26):** Final Code Freeze, Documentation, Lab Manual Finalization, and Viva Voce Submission.
