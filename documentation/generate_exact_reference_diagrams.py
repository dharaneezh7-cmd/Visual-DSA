import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.patches as patches

def set_font():
    plt.rcParams['font.sans-serif'] = 'Arial'
    plt.rcParams['font.family'] = 'sans-serif'

# 1. PAGE 4: DATA FLOW DIAGRAM (DFD)
def generate_exact_dfd():
    fig, ax = plt.subplots(figsize=(8.5, 12), dpi=300)
    ax.set_xlim(0, 100)
    ax.set_ylim(0, 120)
    ax.axis('off')

    nodes = [
        {"y": 105, "title": "LEARNER / STUDENT", "sub": ""},
        {"y": 89,  "title": "REACT FRONTEND", "sub": "(Visualizer & Interactive UI)"},
        {"y": 73,  "title": "EXPRESS.JS REST API", "sub": "(/api/progress & /api/practice)"},
        {"y": 57,  "title": "INPUT & OPERATION VALIDATION", "sub": "(Boundary Checks & Parameter Validation)"},
        {"y": 41,  "title": "ALGORITHM STATE MACHINE", "sub": "(Step-by-Step State Transitions & Pseudocode Sync)"},
        {"y": 25,  "title": "MONGODB DATABASE", "sub": "(Progress, Practices & Activities Collections)"},
        {"y": 9,   "title": "ANALYTICS & CERTIFICATE SUMMARY", "sub": "(Mastery Index & Verified Canvas Output)"}
    ]

    for i, n in enumerate(nodes):
        # Rounded rectangle box like reference
        box = patches.FancyBboxPatch((15, n['y'] - 5.5), 70, 11, boxstyle="round,pad=1.2,rounding_size=3.5",
                                     facecolor='#f8fafc', edgecolor='#000000', linewidth=1.8)
        ax.add_patch(box)
        
        if n['sub']:
            ax.text(50, n['y'] + 1.2, n['title'], ha='center', va='center', fontsize=12, fontweight='bold', color='#000000')
            ax.text(50, n['y'] - 2.5, n['sub'], ha='center', va='center', fontsize=10, color='#000000')
        else:
            ax.text(50, n['y'], n['title'], ha='center', va='center', fontsize=13, fontweight='bold', color='#000000')

        if i < len(nodes) - 1:
            ax.annotate('', xy=(50, nodes[i+1]['y'] + 6.2), xytext=(50, n['y'] - 6.2),
                        arrowprops=dict(arrowstyle="-|>", color='#000000', lw=2, mutation_scale=18))

    # Side callout for Step Generator
    side_box = patches.Rectangle((0.5, 41 - 4), 13, 8, facecolor='#ffffff', edgecolor='#000000', lw=1.2)
    ax.add_patch(side_box)
    ax.text(7, 42.5, "syncEngine()", ha='center', fontsize=8.5, color='#000000')
    ax.text(7, 39.5, "Algorithm", ha='center', fontsize=8.5, color='#000000')
    ax.annotate('', xy=(14.5, 41), xytext=(13.5, 41), arrowprops=dict(arrowstyle="-|>", color='#000000', lw=1.5, mutation_scale=12))

    plt.tight_layout()
    plt.savefig('documentation/diagrams/page4_dfd.png', dpi=300, bbox_inches='tight')
    plt.close()
    print("Regenerated exact reference page4_dfd.png")

# 2. PAGE 5: ER DIAGRAM (Exact Reference Layout)
def generate_exact_er():
    fig, ax = plt.subplots(figsize=(8.5, 11), dpi=300)
    ax.set_xlim(0, 100)
    ax.set_ylim(0, 120)
    ax.axis('off')

    def draw_entity_table(x, y, w, h, title, fields):
        # Header bar
        hdr = patches.Rectangle((x, y + h - 6), w, 6, facecolor='#ffffff', edgecolor='#000000', linewidth=1.8)
        ax.add_patch(hdr)
        ax.text(x + w/2, y + h - 3, title, ha='center', va='center', fontsize=12, fontweight='bold', color='#000000')
        # Body box
        body = patches.Rectangle((x, y), w, h - 6, facecolor='#ffffff', edgecolor='#000000', linewidth=1.8)
        ax.add_patch(body)
        
        cur_y = y + h - 10
        for f in fields:
            ax.text(x + 2, cur_y, f, ha='left', va='center', fontsize=9.5, color='#000000')
            cur_y -= 4.2

    # Entity 1: USER (Left)
    user_fields = [
        "PK  _id : ObjectId",
        "username : String",
        "email : String",
        "password : String",
        "tokenVersion : Number",
        "failedAttempts : Number",
        "lockedUntil : Date",
        "resetOtp : String"
    ]
    draw_entity_table(2, 60, 30, 48, "USER", user_fields)

    # Entity 2: PROGRESS (Middle)
    prog_fields = [
        "PK  _id : ObjectId",
        "FK  userId : ObjectId",
        "topic : String",
        "concept : String",
        "completed : Boolean",
        "completionPct : Number",
        "timeSpent : Number",
        "operationsCount : Number",
        "lastAccessed : Date"
    ]
    draw_entity_table(35, 60, 30, 52, "PROGRESS", prog_fields)

    # Entity 3: PRACTICE (Right)
    prac_fields = [
        "PK  _id : ObjectId",
        "FK  userId : ObjectId",
        "topic : String",
        "questionId : String",
        "answer : String",
        "correct : Boolean",
        "attempts : Number",
        "timestamp : Date"
    ]
    draw_entity_table(68, 60, 30, 48, "PRACTICE", prac_fields)

    # Cardinality connect lines:
    # USER -> PROGRESS
    ax.plot([32, 35], [86, 86], color='#000000', lw=1.8)
    ax.text(33.5, 88.5, "1 : N", ha='center', fontsize=10, fontweight='bold', color='#000000')

    # PROGRESS -> PRACTICE
    ax.plot([65, 68], [86, 86], color='#000000', lw=1.8)
    ax.text(66.5, 88.5, "1 : N", ha='center', fontsize=10, fontweight='bold', color='#000000')

    # Vertical line down to MONGODB COLLECTIONS box
    ax.plot([50, 50], [60, 38], color='#000000', lw=1.8)
    ax.text(52, 48, "stored as documents", ha='left', fontsize=9, color='#000000')

    # Database Summary Box at bottom (Exact replica of Reference Page 5)
    db_box = patches.FancyBboxPatch((10, 8), 80, 30, boxstyle="round,pad=1.5,rounding_size=3",
                                    facecolor='#ffffff', edgecolor='#000000', linewidth=1.8)
    ax.add_patch(db_box)

    ax.text(50, 33, "MONGODB COLLECTIONS (Database: Visual_DSA)", ha='center', va='center',
            fontsize=12, fontweight='bold', color='#000000')
    
    # Separator line inside box
    ax.plot([14, 86], [29.5, 29.5], color='#d1d5db', lw=1)

    bullets = [
        "• users: Stores learner profiles, salted credentials, token versions, and security lockout states.",
        "• progresses: Stores topic mastery records, completion percentages, study time, and operations.",
        "• practices: Stores formative quiz attempts, selected options, correctness, and timestamped scores.",
        "• activities: Stores fine-grained operational event logs and visualizer step history."
    ]

    b_y = 25
    for b in bullets:
        ax.text(14, b_y, b, ha='left', va='center', fontsize=9.2, color='#000000')
        b_y -= 4.5

    plt.tight_layout()
    plt.savefig('documentation/diagrams/page5_er.png', dpi=300, bbox_inches='tight')
    plt.close()
    print("Regenerated exact reference page5_er.png")

# 3. PAGE 6: USE CASE DIAGRAM (Exact Reference Layout)
def generate_exact_use_case():
    fig, ax = plt.subplots(figsize=(8.5, 11), dpi=300)
    ax.set_xlim(0, 100)
    ax.set_ylim(0, 120)
    ax.axis('off')

    # Central boundary box
    boundary = patches.Rectangle((18, 5), 64, 110, facecolor='#ffffff', edgecolor='#000000', linewidth=2)
    ax.add_patch(boundary)
    ax.text(50, 111, "VISUAL DSA PLATFORM — MODULE 1", ha='center', va='center',
            fontsize=12, fontweight='bold', color='#000000')

    # Left Actor Box: USER / LEARNER
    user_box = patches.Rectangle((0.5, 52), 16.5, 14, facecolor='#ffffff', edgecolor='#000000', linewidth=2)
    ax.add_patch(user_box)
    ax.text(8.75, 60.5, "USER /", ha='center', va='center', fontsize=11, fontweight='bold', color='#000000')
    ax.text(8.75, 56.5, "LEARNER", ha='center', va='center', fontsize=11, fontweight='bold', color='#000000')

    # Right Actor Box: SYSTEM / ADMIN
    admin_box = patches.Rectangle((83, 52), 16.5, 14, facecolor='#ffffff', edgecolor='#000000', linewidth=2)
    ax.add_patch(admin_box)
    ax.text(91.25, 60.5, "SYSTEM /", ha='center', va='center', fontsize=11, fontweight='bold', color='#000000')
    ax.text(91.25, 56.5, "ADMIN", ha='center', va='center', fontsize=11, fontweight='bold', color='#000000')

    use_cases = [
        "View Data Structure & Algorithm Curriculum",
        "Select Visualizer Module (Array, Stack, Queue, Sort)",
        "Execute Interactive Operations (Insert, Delete, Search)",
        "Inspect Synchronized Pseudocode Steps",
        "Configure Animation Playback & Speed Controls",
        "Solve Formative Practice Quiz Questions",
        "Query Lemmy AI Mascot Learning Assistant",
        "View Aggregated Mastery Analytics Dashboard",
        "Generate & Download Verified Completion Certificate"
    ]

    y_pos = 101
    for uc in use_cases:
        ellipse = patches.Ellipse((50, y_pos), 50, 7.5, facecolor='#ffffff', edgecolor='#000000', linewidth=1.5)
        ax.add_patch(ellipse)
        ax.text(50, y_pos, uc, ha='center', va='center', fontsize=9.2, color='#000000')

        # Connect to Left Actor
        ax.plot([17, 25], [59, y_pos], color='#000000', lw=1.2)
        # Connect to Right Actor
        ax.plot([75, 83], [y_pos, 59], color='#000000', lw=1.2)

        y_pos -= 11.2

    plt.tight_layout()
    plt.savefig('documentation/diagrams/page6_use_case.png', dpi=300, bbox_inches='tight')
    plt.close()
    print("Regenerated exact reference page6_use_case.png")

# 4. PAGE 7: CLASS DIAGRAM (Exact Reference Layout)
def generate_exact_class():
    fig, ax = plt.subplots(figsize=(8.5, 11), dpi=300)
    ax.set_xlim(0, 100)
    ax.set_ylim(0, 120)
    ax.axis('off')

    def draw_class_table(x, y, w, h, title, attrs, methods):
        # Header
        hdr = patches.Rectangle((x, y + h - 6), w, 6, facecolor='#ffffff', edgecolor='#000000', linewidth=1.8)
        ax.add_patch(hdr)
        ax.text(x + w/2, y + h - 3, title, ha='center', va='center', fontsize=11, fontweight='bold', color='#000000')
        # Body
        body = patches.Rectangle((x, y), w, h - 6, facecolor='#ffffff', edgecolor='#000000', linewidth=1.8)
        ax.add_patch(body)

        # Attributes
        cur_y = y + h - 10
        for a in attrs:
            ax.text(x + 2, cur_y, a, ha='left', va='center', fontsize=8.8, color='#000000')
            cur_y -= 4
        
        # Horizontal divider
        mid_y = y + h/2 - 2
        ax.plot([x, x + w], [mid_y, mid_y], color='#000000', lw=1.2)

        # Methods
        cur_y = mid_y - 4
        for m in methods:
            ax.text(x + 2, cur_y, m, ha='left', va='center', fontsize=8.8, color='#000000')
            cur_y -= 4

    # Class 1: DSA_MODULE
    c1_attrs = [
        "- topicId: String",
        "- topicName: String",
        "- difficulty: String",
        "- operationsList: Array",
        "- theoryContent: String",
        "- pseudocode: Object",
        "- timeComplexity: String",
        "- spaceComplexity: String"
    ]
    c1_methods = [
        "+ getTopicDetails()",
        "+ loadPseudocode()",
        "+ getComplexity()",
        "+ filterByCategory()",
        "+ updateProgress()"
    ]
    draw_class_table(1, 10, 32, 100, "DSA_MODULE", c1_attrs, c1_methods)

    # Class 2: VISUALIZER_MANAGER
    c2_attrs = [
        "- elementsState: Array",
        "- activeOperation: String",
        "- animationSpeed: Number",
        "- currentStep: Number",
        "- isExecuting: Boolean",
        "- topPointer: Number",
        "- frontPointer: Number",
        "- rearPointer: Number"
    ]
    c2_methods = [
        "+ renderAnimation()",
        "+ handleOperationClick()",
        "+ stepForward()",
        "+ syncPseudocodeLine()",
        "+ checkBoundaryLimits()",
        "+ resetVisualizer()"
    ]
    draw_class_table(34, 10, 32, 100, "VISUALIZER_MANAGER", c2_attrs, c2_methods)

    # Class 3: PROGRESS_CONTROLLER
    c3_attrs = [
        "- userId: ObjectId",
        "- userToken: String",
        "- progressHistory: Array",
        "- accuracyScore: Number",
        "- timeElapsed: Number",
        "- activityLogs: Array",
        "- certificateStatus: Boolean",
        "- timestamp: Date"
    ]
    c3_methods = [
        "+ validateSession()",
        "+ saveProgressData()",
        "+ recordActivityEvent()",
        "+ submitQuizScore()",
        "+ computeMasteryIndex()",
        "+ generateCertificate()"
    ]
    draw_class_table(67, 10, 32, 100, "PROGRESS_CONTROLLER", c3_attrs, c3_methods)

    # Connector Arrows like reference
    # DSA_MODULE -> VISUALIZER_MANAGER (uses)
    ax.annotate('', xy=(34, 60), xytext=(33, 60), arrowprops=dict(arrowstyle="-|>", color='#000000', lw=2, mutation_scale=14))
    ax.text(33.5, 62, "uses", ha='center', fontsize=8.5, color='#000000')

    # VISUALIZER_MANAGER -> PROGRESS_CONTROLLER (submits)
    ax.annotate('', xy=(67, 60), xytext=(66, 60), arrowprops=dict(arrowstyle="-|>", color='#000000', lw=2, mutation_scale=14))
    ax.text(66.5, 62, "submits", ha='center', fontsize=8.5, color='#000000')

    plt.tight_layout()
    plt.savefig('documentation/diagrams/page7_class.png', dpi=300, bbox_inches='tight')
    plt.close()
    print("Regenerated exact reference page7_class.png")

# 5. PAGE 8: SEQUENCE DIAGRAM (Exact Reference Layout - Big & Bold)
def generate_exact_sequence():
    fig, ax = plt.subplots(figsize=(8.5, 11), dpi=300)
    ax.set_xlim(0, 100)
    ax.set_ylim(0, 120)
    ax.axis('off')

    cols = [
        {"x": 10, "title": "LEARNER"},
        {"x": 30, "title": "REACT UI\n(Visualizer)"},
        {"x": 52, "title": "EXPRESS API\n(/api/progress)"},
        {"x": 74, "title": "VALIDATION\nENGINE"},
        {"x": 92, "title": "MONGODB\nDATABASE"}
    ]

    # Draw header boxes like reference
    for c in cols:
        box = patches.FancyBboxPatch((c['x'] - 8, 108), 16, 8, boxstyle="round,pad=1,rounding_size=3",
                                     facecolor='#ffffff', edgecolor='#000000', linewidth=1.8)
        ax.add_patch(box)
        ax.text(c['x'], 112, c['title'], ha='center', va='center', fontsize=9.5, fontweight='bold', color='#000000')
        # Lifeline
        ax.plot([c['x'], c['x']], [108, 4], color='#000000', linestyle='--', lw=1.2)

    # Sequence steps (Numbered exactly like reference with large text and clear horizontal lines)
    seq = [
        (10, 30, 100, "1. Select Algorithm & View Visualizer"),
        (30, 52, 92,  "2. GET /api/progress/:topic"),
        (52, 92, 84,  "3. Progress.findOne({ userId, topic })"),
        (92, 52, 76,  "4. Return progress & mastery status", True),
        (30, 30, 68,  "5. Render interactive blocks & pseudocode", False, True),
        (10, 30, 60,  "6. Enter value(s) & click Operation (Push/Insert)"),
        (30, 74, 52,  "7. Validate bounds & input parameters"),
        (74, 30, 44,  "8. Validation OK (animation triggered)", True),
        (10, 30, 36,  "9. Click Save / Complete Topic"),
        (30, 52, 28,  "10. POST /api/progress (topic, timeSpent)"),
        (52, 92, 20,  "11. Progress.findOneAndUpdate(..., upsert=true)"),
        (92, 52, 14,  "12. Progress confirmed & activity logged", True),
        (52, 30, 8,   "13. Return 201 Created (Progress data)", True),
        (30, 10, 4,   "14. Display Mastery Summary & Badge update", True)
    ]

    for item in seq:
        frm, to, y, label = item[0], item[1], item[2], item[3]
        is_dash = len(item) > 4 and item[4]
        is_self = len(item) > 5 and item[5]

        if is_self:
            # Self arrow loop on React UI (30)
            ax.plot([30, 34, 34, 30], [y + 2.5, y + 2.5, y - 2.5, y - 2.5], color='#000000', lw=1.5)
            ax.annotate('', xy=(30, y - 2.5), xytext=(31, y - 2.5), arrowprops=dict(arrowstyle="-|>", color='#000000', lw=1.5, mutation_scale=14))
            ax.text(35, y, label, ha='left', va='center', fontsize=8.8, fontweight='bold', color='#000000')
        else:
            style = '--' if is_dash else '-'
            ax.annotate('', xy=(to, y), xytext=(frm, y),
                        arrowprops=dict(arrowstyle="-|>", color='#000000', lw=1.6, linestyle=style, mutation_scale=14))
            mid_x = (frm + to) / 2
            ax.text(mid_x, y + 1.8, label, ha='center', va='bottom', fontsize=8.8, fontweight='bold', color='#000000')

    plt.tight_layout()
    plt.savefig('documentation/diagrams/page8_sequence.png', dpi=300, bbox_inches='tight')
    plt.close()
    print("Regenerated exact reference page8_sequence.png")

if __name__ == '__main__':
    set_font()
    generate_exact_dfd()
    generate_exact_er()
    generate_exact_use_case()
    generate_exact_class()
    generate_exact_sequence()
