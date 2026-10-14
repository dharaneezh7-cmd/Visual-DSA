import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.patches as patches

def set_academic_font():
    plt.rcParams['font.sans-serif'] = 'Arial'
    plt.rcParams['font.family'] = 'sans-serif'

# 1. DFD (Page 4)
def generate_dfd():
    fig, ax = plt.subplots(figsize=(8.5, 11), dpi=200)
    ax.set_xlim(0, 100)
    ax.set_ylim(0, 130)
    ax.axis('off')
    
    # Title
    ax.text(50, 122, "DATA FLOW DIAGRAM (DFD)", ha='center', va='center', fontsize=15, fontweight='bold', color='#1e3a8a')
    desc = "A Data Flow Diagram (DFD) represents how data moves through the Visual DSA interactive platform.\nIt illustrates the interaction between learners, frontend visualizers, validation layers, Express API endpoints,\nMongoDB collections, the Python analysis service, and the local AI assistant runtime."
    ax.text(50, 114, desc, ha='center', va='center', fontsize=9.5, color='#334155', linespacing=1.3)

    nodes = [
        {"y": 100, "title": "LEARNER / STUDENT", "sub": "(Interactive Input, Operations & Quiz Answers)", "color": "#eff6ff", "edge": "#2563eb"},
        {"y": 86, "title": "REACT FRONTEND (VITE SPA)", "sub": "(Dynamic Visualizers, Pseudocode Sync, Audio & Local Cache)", "color": "#f8fafc", "edge": "#475569"},
        {"y": 72, "title": "EXPRESS.JS REST API GATEWAY", "sub": "(/api/auth, /api/progress, /api/activity, /api/practice, /api/assistant)", "color": "#f8fafc", "edge": "#475569"},
        {"y": 58, "title": "INPUT VALIDATION & AUTH GUARD", "sub": "(Express-Validator, Mongo-Sanitize, JWT Bearer Token Guard)", "color": "#fef2f2", "edge": "#dc2626"},
        {"y": 44, "title": "MONGODB REPOSITORY (DATABASE)", "sub": "(Users, Progress, Activity, and Practice Collections)", "color": "#f0fdf4", "edge": "#16a34a"},
        {"y": 30, "title": "PYTHON ANALYSIS & EMAIL SERVICE", "sub": "(FastAPI Microservice: Statistical Mastery & SMTP OTP Handler)", "color": "#faf5ff", "edge": "#9333ea"},
        {"y": 16, "title": "OLLAMA AI TUTOR RUNTIME", "sub": "(Local Llama-3.2:3B Inference Proxy for Lemmy Assistant)", "color": "#fffbeb", "edge": "#d97706"},
    ]

    for i, n in enumerate(nodes):
        rect = patches.FancyBboxPatch((15, n['y'] - 4.5), 70, 9, boxstyle="round,pad=1.2,rounding_size=2.5",
                                     facecolor=n['color'], edgecolor=n['edge'], linewidth=1.5)
        ax.add_patch(rect)
        ax.text(50, n['y'] + 1, n['title'], ha='center', va='center', fontsize=11, fontweight='bold', color='#0f172a')
        ax.text(50, n['y'] - 2, n['sub'], ha='center', va='center', fontsize=8.5, color='#475569')

        if i < len(nodes) - 1:
            ax.annotate('', xy=(50, nodes[i+1]['y'] + 5), xytext=(50, n['y'] - 5),
                        arrowprops=dict(arrowstyle="-|>", color='#0f172a', lw=1.5, mutation_scale=14))

    plt.tight_layout()
    plt.savefig('documentation/diagrams/page4_dfd.png', dpi=200, bbox_inches='tight')
    plt.close()
    print("Generated page4_dfd.png")

# 2. ER DIAGRAM (Page 5)
def generate_er():
    fig, ax = plt.subplots(figsize=(8.5, 11), dpi=200)
    ax.set_xlim(0, 100)
    ax.set_ylim(0, 130)
    ax.axis('off')

    ax.text(50, 122, "ER DIAGRAM", ha='center', va='center', fontsize=15, fontweight='bold', color='#1e3a8a')
    desc = "An Entity Relationship (ER) Diagram represents the document schema entities in the Visual DSA platform\nand the relationships between them. It outlines entity attributes, primary keys, foreign key references, and cardinality."
    ax.text(50, 114, desc, ha='center', va='center', fontsize=9.5, color='#334155', linespacing=1.3)

    # 3 entities at top: USER, PROGRESS, PRACTICE
    def draw_entity_table(x, y, w, h, title, fields):
        # Header
        hdr = patches.Rectangle((x, y + h - 5), w, 5, facecolor='#1e293b', edgecolor='#0f172a', linewidth=1.2)
        ax.add_patch(hdr)
        ax.text(x + w/2, y + h - 2.5, title, ha='center', va='center', fontsize=10, fontweight='bold', color='#ffffff')
        # Body
        body = patches.Rectangle((x, y), w, h - 5, facecolor='#ffffff', edgecolor='#0f172a', linewidth=1.2)
        ax.add_patch(body)
        cur_y = y + h - 8
        for f in fields:
            ax.text(x + 2, cur_y, f, ha='left', va='center', fontsize=7.5, color='#1e293b')
            cur_y -= 3.2

    user_fields = [
        "PK _id : ObjectId",
        "username : String",
        "email : String (Unique)",
        "password : String [Hash]",
        "tokenVersion : Number",
        "failedLoginAttempts : Number",
        "lockedUntil : Date",
        "resetOtp : String [SHA-256]",
        "resetOtpExpires : Date",
        "createdAt, updatedAt : Date"
    ]
    draw_entity_table(5, 68, 28, 42, "USER", user_fields)

    prog_fields = [
        "PK _id : ObjectId",
        "FK userId : ObjectId",
        "topic : String",
        "concept : String",
        "completed : Boolean",
        "completionPercentage : Number",
        "timeSpent : Number",
        "operationsPerformed : Number",
        "lastAccessed : Date",
        "createdAt, updatedAt : Date"
    ]
    draw_entity_table(36, 68, 28, 42, "PROGRESS", prog_fields)

    prac_fields = [
        "PK _id : ObjectId",
        "FK userId : ObjectId",
        "topic : String",
        "questionId : String",
        "answer : String",
        "correct : Boolean",
        "attempts : Number",
        "timestamp : Date",
        "createdAt, updatedAt : Date"
    ]
    draw_entity_table(67, 68, 28, 42, "PRACTICE", prac_fields)

    act_fields = [
        "PK _id : ObjectId",
        "FK userId : ObjectId",
        "topic : String",
        "activityType : String",
        "operation : String",
        "result : String",
        "duration : Number",
        "timestamp : Date",
        "createdAt, updatedAt : Date"
    ]
    draw_entity_table(36, 18, 28, 38, "ACTIVITY", act_fields)

    # Relationship connectors
    # User -> Progress (1:N)
    ax.annotate('', xy=(36, 88), xytext=(33, 88), arrowprops=dict(arrowstyle="-|>", color='#0f172a', lw=1.2))
    ax.text(34.5, 90, "1 : N", ha='center', fontsize=8, fontweight='bold', color='#2563eb')

    # Progress -> Practice
    ax.annotate('', xy=(67, 88), xytext=(64, 88), arrowprops=dict(arrowstyle="-|>", color='#0f172a', lw=1.2))
    ax.text(65.5, 90, "1 : N", ha='center', fontsize=8, fontweight='bold', color='#2563eb')

    # User -> Activity (1:N)
    ax.annotate('', xy=(36, 36), xytext=(19, 68), arrowprops=dict(arrowstyle="-|>", color='#0f172a', lw=1.2))
    ax.text(25, 52, "1 : N (tracks)", ha='center', fontsize=8, fontweight='bold', color='#2563eb')

    # Database Summary Box at bottom
    db_box = patches.FancyBboxPatch((10, 3), 80, 11, boxstyle="round,pad=1,rounding_size=2",
                                    facecolor='#f8fafc', edgecolor='#94a3b8', linewidth=1)
    ax.add_patch(db_box)
    ax.text(50, 11, "MONGODB COLLECTIONS (Database: Visual_DSA)", ha='center', fontsize=9, fontweight='bold', color='#0f172a')
    ax.text(50, 7.5, "• users: Stores user identities, salted bcrypt credentials, security lockout counters, and SHA-256 OTP hashes.", ha='center', fontsize=7.5, color='#475569')
    ax.text(50, 5, "• progresses / practices / activities: Compound indexed topic mastery, accuracy audit records, and operational event logs.", ha='center', fontsize=7.5, color='#475569')

    plt.tight_layout()
    plt.savefig('documentation/diagrams/page5_er.png', dpi=200, bbox_inches='tight')
    plt.close()
    print("Generated page5_er.png")

# 3. USE CASE DIAGRAM (Page 6)
def generate_use_case():
    fig, ax = plt.subplots(figsize=(8.5, 11), dpi=200)
    ax.set_xlim(0, 100)
    ax.set_ylim(0, 130)
    ax.axis('off')

    ax.text(50, 122, "USE CASE DIAGRAM", ha='center', va='center', fontsize=15, fontweight='bold', color='#1e3a8a')
    desc = "A Use Case Diagram shows how different actors interact with the system and represents the major functional operations\navailable to each actor within the Visual DSA interactive platform."
    ax.text(50, 114, desc, ha='center', va='center', fontsize=9.5, color='#334155', linespacing=1.3)

    # Actor Left: LEARNER / USER
    ax.text(10, 68, "LEARNER /\nSTUDENT", ha='center', va='center', fontsize=11, fontweight='bold', color='#0f172a')
    # Draw stick figure head & body
    head = patches.Circle((10, 77), 2.5, facecolor='#ffffff', edgecolor='#0f172a', lw=1.5)
    ax.add_patch(head)
    ax.plot([10, 10], [74.5, 63], color='#0f172a', lw=1.5) # spine
    ax.plot([4, 16], [70, 70], color='#0f172a', lw=1.5) # arms
    ax.plot([10, 5], [63, 56], color='#0f172a', lw=1.5) # left leg
    ax.plot([10, 15], [63, 56], color='#0f172a', lw=1.5) # right leg

    # Actor Right: SYSTEM / ADMIN & AI
    ax.text(90, 68, "SYSTEM /\nAI BACKEND", ha='center', va='center', fontsize=11, fontweight='bold', color='#0f172a')
    head2 = patches.Circle((90, 77), 2.5, facecolor='#ffffff', edgecolor='#0f172a', lw=1.5)
    ax.add_patch(head2)
    ax.plot([90, 90], [74.5, 63], color='#0f172a', lw=1.5)
    ax.plot([84, 96], [70, 70], color='#0f172a', lw=1.5)
    ax.plot([90, 85], [63, 56], color='#0f172a', lw=1.5)
    ax.plot([90, 95], [63, 56], color='#0f172a', lw=1.5)

    # System Boundary Box
    boundary = patches.Rectangle((22, 10), 56, 95, facecolor='#ffffff', edgecolor='#0f172a', linewidth=1.5)
    ax.add_patch(boundary)
    ax.text(50, 102, "VISUAL DSA APPLICATION BOUNDARY", ha='center', va='center', fontsize=10.5, fontweight='bold', color='#1e3a8a')

    use_cases = [
        "Register & Authenticate Account (JWT)",
        "Select Data Structure / Algorithm Module",
        "Execute Interactive Visualizer Operations",
        "Inspect Synchronized Pseudocode Steps",
        "Configure Animation Playback Speed",
        "Solve Formative Practice Quizzes",
        "Query Lemmy AI Mascot Assistant",
        "View Aggregated Mastery Analytics",
        "Generate & Export Verified Certificate"
    ]

    y_pos = 94
    for uc in use_cases:
        ellipse = patches.Ellipse((50, y_pos), 46, 6.5, facecolor='#f8fafc', edgecolor='#2563eb', linewidth=1.2)
        ax.add_patch(ellipse)
        ax.text(50, y_pos, uc, ha='center', va='center', fontsize=8.5, color='#0f172a')
        
        # Line from Learner
        ax.plot([16, 27], [68, y_pos], color='#64748b', lw=1, linestyle='-')
        # Line to System (for relevant system use cases)
        if "Analytics" in uc or "Certificate" in uc or "AI" in uc or "Authenticate" in uc:
            ax.plot([73, 84], [y_pos, 68], color='#64748b', lw=1, linestyle='-')

        y_pos -= 9.5

    plt.tight_layout()
    plt.savefig('documentation/diagrams/page6_use_case.png', dpi=200, bbox_inches='tight')
    plt.close()
    print("Generated page6_use_case.png")

# 4. CLASS / COMPONENT DIAGRAM (Page 7)
def generate_class():
    fig, ax = plt.subplots(figsize=(8.5, 11), dpi=200)
    ax.set_xlim(0, 100)
    ax.set_ylim(0, 130)
    ax.axis('off')

    ax.text(50, 122, "CLASS / COMPONENT DIAGRAM", ha='center', va='center', fontsize=15, fontweight='bold', color='#1e3a8a')
    desc = "A Class Diagram represents the structure of the software system by showing components, models, controllers, and services.\nIt illustrates how React client components, Express gateway controllers, and Mongoose document services collaborate."
    ax.text(50, 114, desc, ha='center', va='center', fontsize=9.5, color='#334155', linespacing=1.3)

    def draw_uml_class(x, y, w, h, name, attrs, methods):
        # Header
        hdr = patches.Rectangle((x, y + h - 6), w, 6, facecolor='#1e293b', edgecolor='#0f172a', linewidth=1.2)
        ax.add_patch(hdr)
        ax.text(x + w/2, y + h - 3, name, ha='center', va='center', fontsize=9.5, fontweight='bold', color='#ffffff')
        # Main Box
        box = patches.Rectangle((x, y), w, h - 6, facecolor='#ffffff', edgecolor='#0f172a', linewidth=1.2)
        ax.add_patch(box)
        
        # Attributes
        cur_y = y + h - 9
        for a in attrs:
            ax.text(x + 1.5, cur_y, a, ha='left', va='center', fontsize=7.2, color='#1e293b')
            cur_y -= 3
        # Separator line
        sep_y = y + h/2 - 2
        ax.plot([x, x + w], [sep_y, sep_y], color='#0f172a', lw=0.8)
        # Methods
        cur_y = sep_y - 3
        for m in methods:
            ax.text(x + 1.5, cur_y, m, ha='left', va='center', fontsize=7.2, color='#1e293b')
            cur_y -= 3

    # 3 major columns
    # 1. Frontend Visualizer Component
    vis_attrs = [
        "- elements: ArrItem[]",
        "- operation: Operation",
        "- isAnimating: boolean",
        "- speedMs: number",
        "- currentStep: number"
    ]
    vis_methods = [
        "+ handleInsert(idx, val)",
        "+ handleDelete(idx)",
        "+ handleTraverse()",
        "+ stepExecution()",
        "+ syncPseudocode()"
    ]
    draw_uml_class(4, 20, 28, 85, "VISUALIZER_VIEW\n(React Component)", vis_attrs, vis_methods)

    # 2. Service & Hook Layer
    hook_attrs = [
        "- token: string | null",
        "- progress: LearningProgress[]",
        "- activities: Activity[]",
        "- isAuthenticated: boolean",
        "- user: UserProfile | null"
    ]
    hook_methods = [
        "+ saveProgress(topic, data)",
        "+ recordActivity(act)",
        "+ login(email, pwd)",
        "+ request(endpoint, opt)",
        "+ exportCertificate(canvas)"
    ]
    draw_uml_class(36, 20, 28, 85, "API_CLIENT_HOOKS\n(useProgress / api.ts)", hook_attrs, hook_methods)

    # 3. Backend Gateway Controller
    be_attrs = [
        "- authLimiter: RateLimiter",
        "- jwtSecret: string",
        "- clientOrigins: string[]",
        "- pyServiceUrl: string",
        "- ollamaBaseUrl: string"
    ]
    be_methods = [
        "+ authenticateUser(req, res)",
        "+ upsertProgress(req, res)",
        "+ submitPractice(req, res)",
        "+ aggregateDashboard()",
        "+ proxyLemmyChat(req, res)"
    ]
    draw_uml_class(68, 20, 28, 85, "GATEWAY_CONTROLLER\n(Express Server API)", be_attrs, be_methods)

    # Connecting arrows
    ax.annotate('', xy=(36, 62), xytext=(32, 62), arrowprops=dict(arrowstyle="-|>", color='#0f172a', lw=1.5))
    ax.text(34, 64, "uses", ha='center', fontsize=7.5, color='#475569')

    ax.annotate('', xy=(68, 62), xytext=(64, 62), arrowprops=dict(arrowstyle="-|>", color='#0f172a', lw=1.5))
    ax.text(66, 64, "HTTP/REST", ha='center', fontsize=7.5, color='#475569')

    plt.tight_layout()
    plt.savefig('documentation/diagrams/page7_class.png', dpi=200, bbox_inches='tight')
    plt.close()
    print("Generated page7_class.png")

# 5. SEQUENCE DIAGRAM (Page 8)
def generate_sequence():
    fig, ax = plt.subplots(figsize=(8.5, 11), dpi=200)
    ax.set_xlim(0, 100)
    ax.set_ylim(0, 130)
    ax.axis('off')

    ax.text(50, 122, "SEQUENCE DIAGRAM", ha='center', va='center', fontsize=15, fontweight='bold', color='#1e3a8a')
    desc = "A Sequence Diagram shows the chronological execution sequence of interactions across system components.\nIt explains how visualizer operations are initiated by the learner, executed step-by-step in the React state machine,\nsynchronized with pseudocode, dispatched to backend controllers, and committed to MongoDB."
    ax.text(50, 114, desc, ha='center', va='center', fontsize=9.5, color='#334155', linespacing=1.3)

    participants = [
        {"x": 10, "name": "LEARNER"},
        {"x": 30, "name": "REACT UI\n(Visualizer)"},
        {"x": 50, "name": "API CLIENT\n(useProgress)"},
        {"x": 70, "name": "EXPRESS API\n(/api/progress)"},
        {"x": 90, "name": "MONGODB\n(Database)"}
    ]

    # Draw lifelines
    for p in participants:
        box = patches.FancyBboxPatch((p['x'] - 8, 100), 16, 6, boxstyle="round,pad=0.5,rounding_size=1.5",
                                     facecolor='#1e293b', edgecolor='#0f172a', lw=1)
        ax.add_patch(box)
        ax.text(p['x'], 103, p['name'], ha='center', va='center', fontsize=8, fontweight='bold', color='#ffffff')
        ax.plot([p['x'], p['x']], [100, 15], color='#94a3b8', linestyle='--', lw=1)

    steps = [
        {"from": 10, "to": 30, "y": 92, "label": "1. Enters value & clicks 'Push' / 'Insert'"},
        {"from": 30, "to": 30, "y": 84, "label": "2. State machine triggers visual animation", "self": True},
        {"from": 30, "to": 30, "y": 76, "label": "3. Highlights active line in Pseudocode Panel", "self": True},
        {"from": 30, "to": 50, "y": 68, "label": "4. saveProgress(topic, concept, data)"},
        {"from": 50, "to": 50, "y": 60, "label": "5. Optimistic write to localStorage", "self": True},
        {"from": 50, "to": 70, "y": 52, "label": "6. POST /api/progress (Bearer JWT)"},
        {"from": 70, "to": 70, "y": 44, "label": "7. validate() & verify JWT payload", "self": True},
        {"from": 70, "to": 90, "y": 36, "label": "8. findOneAndUpdate({userId, topic}, upsert=true)"},
        {"from": 90, "to": 70, "y": 28, "label": "9. Return updated Progress Document", "dash": True},
        {"from": 70, "to": 50, "y": 21, "label": "10. 201 Created { success: true, progress }", "dash": True},
        {"from": 50, "to": 30, "y": 14, "label": "11. Reconcile UI mastery badges", "dash": True}
    ]

    for s in steps:
        y = s['y']
        if s.get('self'):
            # Self-pointing loop
            x = s['from']
            ax.plot([x, x + 4, x + 4, x], [y + 2, y + 2, y - 2, y - 2], color='#0f172a', lw=1.1)
            ax.annotate('', xy=(x, y - 2), xytext=(x + 1, y - 2), arrowprops=dict(arrowstyle="-|>", color='#0f172a', lw=1.1))
            ax.text(x + 5, y, s['label'], ha='left', va='center', fontsize=7.5, color='#1e293b')
        else:
            style = '--' if s.get('dash') else '-'
            ax.annotate('', xy=(s['to'], y), xytext=(s['from'], y),
                        arrowprops=dict(arrowstyle="-|>", color='#0f172a', lw=1.2, linestyle=style))
            mid_x = (s['from'] + s['to']) / 2
            ax.text(mid_x, y + 1.8, s['label'], ha='center', va='bottom', fontsize=7.5, color='#1e293b')

    plt.tight_layout()
    plt.savefig('documentation/diagrams/page8_sequence.png', dpi=200, bbox_inches='tight')
    plt.close()
    print("Generated page8_sequence.png")

if __name__ == '__main__':
    set_academic_font()
    generate_dfd()
    generate_er()
    generate_use_case()
    generate_class()
    generate_sequence()
