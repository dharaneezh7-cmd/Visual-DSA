import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.patches as patches

def set_academic_font():
    plt.rcParams['font.sans-serif'] = 'Times New Roman'
    plt.rcParams['font.family'] = 'serif'

# =========================================================================
# REFINED ER DIAGRAM
# =========================================================================
def generate_academic_er():
    # Vertical portrait orientation fitting perfectly inside Word page
    fig, ax = plt.subplots(figsize=(8.5, 9.5), dpi=300)
    ax.set_xlim(0, 100)
    ax.set_ylim(0, 105)
    ax.axis('off')

    def draw_entity_card(x, y, w, h, title, fields):
        # Header bar
        hdr = patches.Rectangle((x, y + h - 4.5), w, 4.5, facecolor='#f1f5f9', edgecolor='#000000', linewidth=1.2)
        ax.add_patch(hdr)
        ax.text(x + w/2, y + h - 2.3, title, ha='center', va='center', fontsize=9.5, fontweight='bold', color='#000000')
        # Body box
        body = patches.Rectangle((x, y), w, h - 4.5, facecolor='#ffffff', edgecolor='#000000', linewidth=1.2)
        ax.add_patch(body)
        
        cur_y = y + h - 7.5
        for f in fields:
            is_pk = f.startswith('PK') or f.startswith('id') or f.startswith('_id')
            ax.text(x + 2, cur_y, f, ha='left', va='center', fontsize=8,
                    fontweight='bold' if is_pk else 'normal', color='#000000')
            cur_y -= 3.2

    def draw_diamond(cx, cy, w, h, text):
        diamond = patches.Polygon([
            [cx, cy + h/2],
            [cx + w/2, cy],
            [cx, cy - h/2],
            [cx - w/2, cy]
        ], closed=True, facecolor='#ffffff', edgecolor='#000000', linewidth=1.1)
        ax.add_patch(diamond)
        ax.text(cx, cy, text, ha='center', va='center', fontsize=8, color='#000000')

    # Entity 1: User (Top Left)
    user_fields = [
        "_id (PK)",
        "username",
        "email (unique)",
        "password (hash)",
        "tokenVersion",
        "failedLoginAttempts",
        "lockedUntil",
        "resetOtp (hash)",
        "resetOtpExpires"
    ]
    draw_entity_card(8, 62, 28, 38, "User", user_fields)

    # Entity 2: Progress (Top Right)
    prog_fields = [
        "_id (PK)",
        "userId (FK)",
        "topic",
        "concept",
        "completed",
        "completionPercentage",
        "timeSpent",
        "operationsPerformed",
        "lastAccessed"
    ]
    draw_entity_card(64, 62, 28, 38, "Progress", prog_fields)

    # Entity 3: Activity (Bottom Left)
    act_fields = [
        "_id (PK)",
        "userId (FK)",
        "topic",
        "activityType",
        "operation",
        "result",
        "duration",
        "timestamp"
    ]
    draw_entity_card(8, 6, 28, 35, "Activity", act_fields)

    # Entity 4: Practice (Bottom Right)
    prac_fields = [
        "_id (PK)",
        "userId (FK)",
        "topic",
        "questionId",
        "answer",
        "correct",
        "attempts",
        "timestamp"
    ]
    draw_entity_card(64, 6, 28, 35, "Practice", prac_fields)

    # Relationship 1: User -> Progress (records)
    # Line from User (36, 81) to Diamond (50, 81)
    ax.plot([36, 44], [81, 81], color='#000000', lw=1.1)
    ax.text(38, 83, "1", fontsize=8.5, color='#000000')
    draw_diamond(50, 81, 12, 6, "records")
    # Line from Diamond to Progress (64, 81)
    ax.plot([56, 64], [81, 81], color='#000000', lw=1.1)
    ax.text(61, 83, "N", fontsize=8.5, color='#000000')

    # Relationship 2: User -> Activity (performs)
    # Line from User bottom (22, 62) to Diamond (22, 51)
    ax.plot([22, 22], [62, 54], color='#000000', lw=1.1)
    ax.text(23.5, 58, "1", fontsize=8.5, color='#000000')
    draw_diamond(22, 51, 14, 6, "performs")
    # Line from Diamond to Activity top (22, 41)
    ax.plot([22, 22], [48, 41], color='#000000', lw=1.1)
    ax.text(23.5, 44, "N", fontsize=8.5, color='#000000')

    # Relationship 3: User -> Practice (attempts)
    # Diagonal line from User (36, 66) to Diamond (50, 48) to Practice (64, 30)
    ax.plot([36, 44.5], [66, 50.8], color='#000000', lw=1.1)
    ax.text(37, 60, "1", fontsize=8.5, color='#000000')
    draw_diamond(50, 48, 13, 6, "attempts")
    ax.plot([55.5, 64], [45.2, 30], color='#000000', lw=1.1)
    ax.text(61, 35, "N", fontsize=8.5, color='#000000')

    plt.tight_layout()
    plt.savefig('documentation/diagrams/page5_er.png', dpi=300, bbox_inches='tight')
    plt.close()
    print("Regenerated clean academic page5_er.png")

# =========================================================================
# REFINED USE CASE DIAGRAM
# =========================================================================
def generate_academic_use_case():
    fig, ax = plt.subplots(figsize=(8.5, 9.8), dpi=300)
    ax.set_xlim(0, 100)
    ax.set_ylim(0, 105)
    ax.axis('off')

    # System boundary box
    # Leaves clean 18% margin on left and right for stick actors
    boundary = patches.Rectangle((22, 4), 56, 96, facecolor='#ffffff', edgecolor='#000000', linewidth=1.4)
    ax.add_patch(boundary)
    ax.text(50, 97, "VISUAL DSA APPLICATION BOUNDARY", ha='center', va='center',
            fontsize=10.5, fontweight='bold', color='#000000')

    # Stick figure generator function with clear proportions
    def draw_stick_figure(cx, head_y, label):
        # Head
        head = patches.Circle((cx, head_y), 2.8, facecolor='#ffffff', edgecolor='#000000', lw=1.4)
        ax.add_patch(head)
        # Spine
        spine_top = head_y - 2.8
        spine_bottom = spine_top - 12
        ax.plot([cx, cx], [spine_top, spine_bottom], color='#000000', lw=1.4)
        # Arms
        arm_y = spine_top - 5
        ax.plot([cx - 5.5, cx + 5.5], [arm_y, arm_y], color='#000000', lw=1.4)
        # Legs
        leg_len = 10
        ax.plot([cx, cx - 5.5], [spine_bottom, spine_bottom - leg_len], color='#000000', lw=1.4)
        ax.plot([cx, cx + 5.5], [spine_bottom, spine_bottom - leg_len], color='#000000', lw=1.4)
        # Label below
        lbl_y = spine_bottom - leg_len - 4.5
        ax.text(cx, lbl_y, label, ha='center', va='center', fontsize=9.5, fontweight='bold', color='#000000', linespacing=1.1)
        # Return anchor point for connector lines
        return (cx, arm_y)

    # Actor 1: Learner / Student (Left)
    left_anchor = draw_stick_figure(10, 58, "LEARNER /\nSTUDENT")

    # Actor 2: System / AI Backend (Right)
    right_anchor = draw_stick_figure(90, 58, "SYSTEM /\nAI BACKEND")

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

    y_pos = 90
    for uc in use_cases:
        ellipse = patches.Ellipse((50, y_pos), 46, 6.2, facecolor='#ffffff', edgecolor='#000000', linewidth=1.1)
        ax.add_patch(ellipse)
        ax.text(50, y_pos, uc, ha='center', va='center', fontsize=8.2, color='#000000')

        # Connector from Learner anchor to left perimeter of ellipse
        ax.plot([left_anchor[0], 27], [left_anchor[1], y_pos], color='#000000', lw=0.9)

        # Connector to System/AI for system-participating use cases
        if any(keyword in uc for keyword in ["Authenticate", "AI", "Analytics", "Certificate"]):
            ax.plot([73, right_anchor[0]], [y_pos, right_anchor[1]], color='#000000', lw=0.9)

        y_pos -= 9.7

    plt.tight_layout()
    plt.savefig('documentation/diagrams/page6_use_case.png', dpi=300, bbox_inches='tight')
    plt.close()
    print("Regenerated clean academic page6_use_case.png")

if __name__ == '__main__':
    set_academic_font()
    generate_academic_er()
    generate_academic_use_case()
