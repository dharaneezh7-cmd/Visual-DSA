import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.patches as patches
import numpy as np

plt.rcParams['font.sans-serif'] = 'Arial'
plt.rcParams['font.family'] = 'sans-serif'

# ----------------------------------------------------
# 1. PAGE 4: SYSTEM ARCHITECTURE
# ----------------------------------------------------
def generate_p4_architecture():
    fig, ax = plt.subplots(figsize=(11, 4.4), dpi=300)
    ax.set_xlim(0, 100)
    ax.set_ylim(0, 44)
    ax.axis('off')

    b_fe = patches.Rectangle((3, 15), 23, 14, facecolor='#ffffff', edgecolor='#000000', linewidth=1.8)
    ax.add_patch(b_fe)
    ax.text(14.5, 23.5, "React 19 + Vite", ha='center', va='center', fontsize=12, fontweight='bold', color='#000000')
    ax.text(14.5, 20.5, "Frontend Client", ha='center', va='center', fontsize=11, fontweight='bold', color='#000000')
    ax.text(14.5, 17.5, "(TypeScript & Canvas)", ha='center', va='center', fontsize=9.5, color='#333333')

    b_api = patches.Rectangle((39, 15), 23, 14, facecolor='#ffffff', edgecolor='#000000', linewidth=1.8)
    ax.add_patch(b_api)
    ax.text(50.5, 23.5, "Express.js", ha='center', va='center', fontsize=12, fontweight='bold', color='#000000')
    ax.text(50.5, 20.5, "REST API Server", ha='center', va='center', fontsize=11, fontweight='bold', color='#000000')
    ax.text(50.5, 17.5, "(Node.js Engine)", ha='center', va='center', fontsize=9.5, color='#333333')

    ax.annotate('', xy=(39, 22), xytext=(26, 22),
                arrowprops=dict(arrowstyle="<->", color='#000000', lw=1.8))
    ax.text(32.5, 24.5, "REST API", ha='center', va='center', fontsize=10, fontweight='bold', color='#000000')
    ax.text(32.5, 19.5, "JSON", ha='center', va='center', fontsize=9.5, color='#000000')

    b_auth = patches.Rectangle((74, 33), 24, 8.5, facecolor='#ffffff', edgecolor='#000000', linewidth=1.6)
    ax.add_patch(b_auth)
    ax.text(86, 38.5, "Authentication &", ha='center', va='center', fontsize=10.5, fontweight='bold', color='#000000')
    ax.text(86, 35.5, "JWT Middleware", ha='center', va='center', fontsize=10.5, color='#000000')

    b_ai = patches.Rectangle((74, 22.5), 24, 8.5, facecolor='#ffffff', edgecolor='#000000', linewidth=1.6)
    ax.add_patch(b_ai)
    ax.text(86, 28, "Python AI Microservice", ha='center', va='center', fontsize=10.5, fontweight='bold', color='#000000')
    ax.text(86, 25, "(FastAPI & Ollama LLM)", ha='center', va='center', fontsize=9.5, color='#000000')

    b_pdf = patches.Rectangle((74, 12), 24, 8.5, facecolor='#ffffff', edgecolor='#000000', linewidth=1.6)
    ax.add_patch(b_pdf)
    ax.text(86, 17.5, "PDF Certificate Engine", ha='center', va='center', fontsize=10.5, fontweight='bold', color='#000000')
    ax.text(86, 14.5, "(jsPDF & Canvas)", ha='center', va='center', fontsize=9.5, color='#000000')

    cyl_x, cyl_y, cyl_w, cyl_h = 74, 1.5, 24, 7.5
    cyl_rect = patches.Rectangle((cyl_x, cyl_y + 1.2), cyl_w, cyl_h - 1.2, facecolor='#ffffff', edgecolor='#000000', linewidth=1.6)
    ax.add_patch(cyl_rect)
    top_el = patches.Ellipse((cyl_x + cyl_w/2, cyl_y + cyl_h), cyl_w, 2.4, facecolor='#ffffff', edgecolor='#000000', linewidth=1.6)
    ax.add_patch(top_el)
    bot_el = patches.Arc((cyl_x + cyl_w/2, cyl_y + 1.2), cyl_w, 2.4, angle=0, theta1=180, theta2=360, edgecolor='#000000', linewidth=1.6)
    ax.add_patch(bot_el)
    ax.text(cyl_x + cyl_w/2, cyl_y + 4.8, "MongoDB Database", ha='center', va='center', fontsize=10.5, fontweight='bold', color='#000000')
    ax.text(cyl_x + cyl_w/2, cyl_y + 2.4, "(Mongoose ODM)", ha='center', va='center', fontsize=9.5, color='#000000')

    ax.annotate('', xy=(74, 37.2), xytext=(62, 25), arrowprops=dict(arrowstyle="->", color='#000000', lw=1.6))
    ax.annotate('', xy=(74, 26.7), xytext=(62, 23), arrowprops=dict(arrowstyle="<->", color='#000000', lw=1.6))
    ax.annotate('', xy=(74, 16.2), xytext=(62, 20), arrowprops=dict(arrowstyle="->", color='#000000', lw=1.6))
    ax.annotate('', xy=(74, 5.2), xytext=(62, 17), arrowprops=dict(arrowstyle="<->", color='#000000', lw=1.6))
    ax.text(67.5, 9, "Mongoose", ha='center', va='center', fontsize=9.5, color='#000000')

    plt.tight_layout()
    plt.savefig('documentation/diagrams/new_p4_architecture.png', dpi=300, bbox_inches='tight')
    plt.close()


# ----------------------------------------------------
# 2. PAGE 8: DFD LEVEL 0 (Compact Height)
# ----------------------------------------------------
def generate_p8_dfd_l0():
    fig, ax = plt.subplots(figsize=(8.8, 5.0), dpi=300)
    ax.set_xlim(0, 100)
    ax.set_ylim(0, 70)
    ax.axis('off')

    b_adm = patches.Rectangle((2, 48), 26, 13, facecolor='#ffffff', edgecolor='#000000', linewidth=1.8)
    ax.add_patch(b_adm)
    ax.text(15, 56, "Admin /", ha='center', va='center', fontsize=11.5, fontweight='bold', color='#000000')
    ax.text(15, 51.5, "Instructor", ha='center', va='center', fontsize=11.5, fontweight='bold', color='#000000')

    b_lrn = patches.Rectangle((2, 27), 26, 13, facecolor='#ffffff', edgecolor='#000000', linewidth=1.8)
    ax.add_patch(b_lrn)
    ax.text(15, 35, "Learner /", ha='center', va='center', fontsize=11.5, fontweight='bold', color='#000000')
    ax.text(15, 30.5, "Student", ha='center', va='center', fontsize=11.5, fontweight='bold', color='#000000')

    b_ai = patches.Rectangle((2, 6), 26, 13, facecolor='#ffffff', edgecolor='#000000', linewidth=1.8)
    ax.add_patch(b_ai)
    ax.text(15, 14, "External AI Tutor", ha='center', va='center', fontsize=11.5, fontweight='bold', color='#000000')
    ax.text(15, 9.5, "(Ollama LLM)", ha='center', va='center', fontsize=10, color='#333333')

    sys_circle = patches.Circle((83, 33.5), radius=16, facecolor='#ffffff', edgecolor='#000000', linewidth=2.0)
    ax.add_patch(sys_circle)
    ax.text(83, 39, "0", ha='center', va='center', fontsize=14, fontweight='bold', color='#000000')
    ax.text(83, 34, "Visual DSA", ha='center', va='center', fontsize=12, fontweight='bold', color='#000000')
    ax.text(83, 29.5, "Platform", ha='center', va='center', fontsize=12, fontweight='bold', color='#000000')

    ax.annotate('', xy=(73, 45), xytext=(28, 56),
                arrowprops=dict(arrowstyle="-|>", connectionstyle="arc3,rad=0.20", color='#000000', lw=1.6, mutation_scale=14))
    ax.text(50, 63.5, "Curriculum topics, quiz banks, settings", ha='center', va='center', fontsize=8.5, color='#000000')

    ax.annotate('', xy=(28, 50), xytext=(68, 40),
                arrowprops=dict(arrowstyle="-|>", connectionstyle="arc3,rad=-0.12", color='#000000', lw=1.6, mutation_scale=14))
    ax.text(48, 47, "Student progress reports, audit logs", ha='center', va='center', fontsize=8.5, color='#000000')

    ax.annotate('', xy=(67, 34.5), xytext=(28, 35),
                arrowprops=dict(arrowstyle="-|>", connectionstyle="arc3,rad=0.04", color='#000000', lw=1.6, mutation_scale=14))
    ax.text(47, 37.5, "Login, algorithm inputs, playback, quiz answers", ha='center', va='center', fontsize=8.5, color='#000000')

    ax.annotate('', xy=(28, 30.5), xytext=(68, 29.5),
                arrowprops=dict(arrowstyle="-|>", connectionstyle="arc3,rad=-0.04", color='#000000', lw=1.6, mutation_scale=14))
    ax.text(47, 26, "Step animations, pseudocode traces, scores, certificates", ha='center', va='center', fontsize=8.5, color='#000000')

    ax.annotate('', xy=(28, 15), xytext=(70, 23.5),
                arrowprops=dict(arrowstyle="-|>", connectionstyle="arc3,rad=0.15", color='#000000', lw=1.6, mutation_scale=14))
    ax.text(50, 19.5, "Prompt tokens, code queries, DSA context", ha='center', va='center', fontsize=8.5, color='#000000')

    ax.annotate('', xy=(74, 20.5), xytext=(28, 9),
                arrowprops=dict(arrowstyle="-|>", connectionstyle="arc3,rad=-0.20", color='#000000', lw=1.6, mutation_scale=14))
    ax.text(50, 2.5, "AI explanations, complexity hints, debugging feedback", ha='center', va='center', fontsize=8.5, color='#000000')

    plt.tight_layout()
    plt.savefig('documentation/diagrams/new_p8_dfd_l0.png', dpi=300, bbox_inches='tight')
    plt.close()


# ----------------------------------------------------
# 3. PAGE 8: DFD LEVEL 1 (Compact Height)
# ----------------------------------------------------
def generate_p8_dfd_l1():
    fig, ax = plt.subplots(figsize=(8.8, 8.5), dpi=300)
    ax.set_xlim(0, 100)
    ax.set_ylim(0, 116)
    ax.axis('off')

    ent_adm = patches.Rectangle((2, 98), 22, 8.5, facecolor='#ffffff', edgecolor='#000000', linewidth=1.6)
    ax.add_patch(ent_adm)
    ax.text(13, 102.2, "Admin / Instructor", ha='center', va='center', fontsize=9.5, fontweight='bold', color='#000000')

    ent_lrn1 = patches.Rectangle((2, 77), 22, 8.5, facecolor='#ffffff', edgecolor='#000000', linewidth=1.6)
    ax.add_patch(ent_lrn1)
    ax.text(13, 81.2, "Learner / Student", ha='center', va='center', fontsize=9.5, fontweight='bold', color='#000000')

    ent_lrn2 = patches.Rectangle((2, 47), 22, 8.5, facecolor='#ffffff', edgecolor='#000000', linewidth=1.6)
    ax.add_patch(ent_lrn2)
    ax.text(13, 51.2, "Learner / Student", ha='center', va='center', fontsize=9.5, fontweight='bold', color='#000000')

    ent_ai = patches.Rectangle((2, 11), 22, 9, facecolor='#ffffff', edgecolor='#000000', linewidth=1.6)
    ax.add_patch(ent_ai)
    ax.text(13, 16.5, "External Ollama AI", ha='center', va='center', fontsize=9.5, fontweight='bold', color='#000000')
    ax.text(13, 13.5, "(LLM Service)", ha='center', va='center', fontsize=8.5, color='#333333')

    procs = [
        {"y": 102, "num": "1.0", "name1": "Authentication &", "name2": "Session Verification"},
        {"y": 83,  "num": "2.0", "name1": "Module Selection", "name2": "& Theory Explorer"},
        {"y": 64,  "num": "3.0", "name1": "Visualizer State", "name2": "Engine & Animation"},
        {"y": 45,  "num": "4.0", "name1": "Practice Quiz &", "name2": "Auto-Assessment"},
        {"y": 27,  "num": "5.0", "name1": "Progress Analytics", "name2": "& Certification"},
        {"y": 9,   "num": "6.0", "name1": "AI Tutoring", "name2": "Assistant (Lemmy)"}
    ]

    for p in procs:
        el = patches.Ellipse((51, p['y']), 26, 11, facecolor='#ffffff', edgecolor='#000000', linewidth=1.6)
        ax.add_patch(el)
        ax.text(51, p['y'] + 2.8, p['num'], ha='center', va='center', fontsize=10, fontweight='bold', color='#000000')
        ax.text(51, p['y'] - 0.2, p['name1'], ha='center', va='center', fontsize=9, fontweight='bold', color='#000000')
        ax.text(51, p['y'] - 3.2, p['name2'], ha='center', va='center', fontsize=8.5, color='#000000')

    stores = [
        {"y": 102, "id": "D1", "name": "users"},
        {"y": 83,  "id": "D5", "name": "topics"},
        {"y": 64,  "id": "D4", "name": "activities"},
        {"y": 45,  "id": "D3", "name": "practices"},
        {"y": 27,  "id": "D2", "name": "progresses"},
        {"y": 9,   "id": "D6", "name": "certificates"}
    ]

    for s in stores:
        sy = s['y']
        ax.plot([76, 98], [sy + 4.5, sy + 4.5], color='#000000', lw=1.6)
        ax.plot([76, 98], [sy - 4.5, sy - 4.5], color='#000000', lw=1.6)
        ax.plot([76, 76], [sy - 4.5, sy + 4.5], color='#000000', lw=1.6)
        ax.plot([82, 82], [sy - 4.5, sy + 4.5], color='#000000', lw=1.6)
        ax.text(79, sy, s['id'], ha='center', va='center', fontsize=9.5, fontweight='bold', color='#000000')
        ax.text(90, sy, s['name'], ha='center', va='center', fontsize=9.5, color='#000000')

    ax.annotate('', xy=(38, 102), xytext=(24, 102), arrowprops=dict(arrowstyle="-|>", color='#000000', lw=1.4))
    ax.text(31, 104, "credentials", ha='center', fontsize=8, color='#000000')

    ax.annotate('', xy=(39, 98), xytext=(24, 84), arrowprops=dict(arrowstyle="-|>", color='#000000', lw=1.4))
    ax.text(28, 93, "credentials", ha='center', fontsize=8, color='#000000')

    ax.annotate('', xy=(76, 102), xytext=(64, 102), arrowprops=dict(arrowstyle="<->", color='#000000', lw=1.4))
    ax.text(70, 104, "verify", ha='center', fontsize=8, color='#000000')

    ax.annotate('', xy=(38, 83), xytext=(24, 81), arrowprops=dict(arrowstyle="-|>", color='#000000', lw=1.4))
    ax.text(31, 84.5, "topic select", ha='center', fontsize=8, color='#000000')

    ax.annotate('', xy=(76, 83), xytext=(64, 83), arrowprops=dict(arrowstyle="<->", color='#000000', lw=1.4))
    ax.text(70, 85, "read theory", ha='center', fontsize=8, color='#000000')

    ax.annotate('', xy=(39, 66), xytext=(24, 78), arrowprops=dict(arrowstyle="-|>", color='#000000', lw=1.4))
    ax.text(30, 71.5, "inputs / steps", ha='center', fontsize=8, color='#000000')

    ax.annotate('', xy=(76, 64), xytext=(64, 64), arrowprops=dict(arrowstyle="-|>", color='#000000', lw=1.4))
    ax.text(70, 66, "log activity", ha='center', fontsize=8, color='#000000')

    ax.annotate('', xy=(38, 46), xytext=(24, 50), arrowprops=dict(arrowstyle="-|>", color='#000000', lw=1.4))
    ax.text(30, 49.5, "answers", ha='center', fontsize=8, color='#000000')

    ax.annotate('', xy=(76, 45), xytext=(64, 45), arrowprops=dict(arrowstyle="<->", color='#000000', lw=1.4))
    ax.text(70, 47, "save quiz", ha='center', fontsize=8, color='#000000')

    ax.annotate('', xy=(51, 32.5), xytext=(51, 39.5), arrowprops=dict(arrowstyle="-|>", color='#000000', lw=1.4))
    ax.text(57, 36, "update score", ha='left', fontsize=8, color='#000000')

    ax.annotate('', xy=(76, 27), xytext=(64, 27), arrowprops=dict(arrowstyle="<->", color='#000000', lw=1.4))
    ax.text(70, 29, "sync progress", ha='center', fontsize=8, color='#000000')

    ax.annotate('', xy=(76, 11), xytext=(62, 23), arrowprops=dict(arrowstyle="-|>", color='#000000', lw=1.4))
    ax.text(71, 19, "issue cert", ha='center', fontsize=8, color='#000000')

    ax.annotate('', xy=(39, 12), xytext=(24, 47), arrowprops=dict(arrowstyle="-|>", color='#000000', lw=1.4))
    ax.text(28, 30, "ask prompt", ha='center', fontsize=8, color='#000000')

    ax.annotate('', xy=(24, 15), xytext=(38, 9), arrowprops=dict(arrowstyle="<->", color='#000000', lw=1.4))
    ax.text(31, 14, "inference", ha='center', fontsize=8, color='#000000')

    plt.tight_layout()
    plt.savefig('documentation/diagrams/new_p8_dfd_l1.png', dpi=300, bbox_inches='tight')
    plt.close()


# ----------------------------------------------------
# 4. PAGE 9: ER DIAGRAM (Compact Height to fit Page 9)
# ----------------------------------------------------
def generate_p9_er():
    fig, ax = plt.subplots(figsize=(8.5, 12.0), dpi=300)
    ax.set_xlim(0, 100)
    ax.set_ylim(0, 140)
    ax.axis('off')

    def draw_entity(x, y, w, h, title, fields):
        hdr = patches.Rectangle((x, y + h - 5.5), w, 5.5, facecolor='#f0f2f5', edgecolor='#000000', linewidth=1.6)
        ax.add_patch(hdr)
        ax.text(x + w/2, y + h - 2.8, title, ha='center', va='center', fontsize=11, fontweight='bold', color='#000000')
        
        body = patches.Rectangle((x, y), w, h - 5.5, facecolor='#ffffff', edgecolor='#000000', linewidth=1.6)
        ax.add_patch(body)
        
        cur_y = y + h - 8.8
        for f in fields:
            if f.startswith('_id (PK)'):
                ax.text(x + 2, cur_y, f, ha='left', va='center', fontsize=9, fontweight='bold', color='#000000')
            elif '(FK)' in f:
                ax.text(x + 2, cur_y, f, ha='left', va='center', fontsize=8.5, fontstyle='italic', color='#000000')
            else:
                ax.text(x + 2, cur_y, f, ha='left', va='center', fontsize=8.5, color='#000000')
            cur_y -= 3.3

    def draw_diamond(cx, cy, w, h, text):
        pts = np.array([
            [cx, cy + h/2],
            [cx + w/2, cy],
            [cx, cy - h/2],
            [cx - w/2, cy]
        ])
        diamond = patches.Polygon(pts, closed=True, facecolor='#ffffff', edgecolor='#000000', linewidth=1.5)
        ax.add_patch(diamond)
        ax.text(cx, cy, text, ha='center', va='center', fontsize=9, color='#000000')

    # Top Row: y = 104..137
    u_fields = [
        "_id (PK)",
        "username",
        "email",
        "password (hash)",
        "role",
        "tokenVersion",
        "failedAttempts",
        "lockedUntil"
    ]
    draw_entity(6, 104, 28, 33, "User", u_fields)

    t_fields = [
        "_id (PK)",
        "topicId",
        "title",
        "category",
        "timeComplexity",
        "spaceComplexity",
        "pseudocode",
        "orderIndex"
    ]
    draw_entity(64, 104, 28, 33, "Topic", t_fields)

    # Middle Row: y = 56..91
    q_fields = [
        "_id (PK)",
        "userId (FK)",
        "topicId (FK)",
        "score",
        "totalQuestions",
        "accuracyPct",
        "responses[ ]",
        "attemptedAt"
    ]
    draw_entity(6, 56, 28, 33, "Practice", q_fields)

    p_fields = [
        "_id (PK)",
        "userId (FK)",
        "topicId (FK)",
        "concept",
        "completed",
        "completionPct",
        "timeSpentSeconds",
        "operationsCount",
        "lastAccessed"
    ]
    draw_entity(56, 54, 36, 36, "Progress", p_fields)

    # Bottom Row: y = 8..35
    a_fields = [
        "_id (PK)",
        "userId (FK)",
        "action",
        "module",
        "details",
        "timestamp"
    ]
    draw_entity(4, 8, 26, 27, "ActivityLog", a_fields)

    c_fields = [
        "_id (PK)",
        "userId (FK)",
        "certificateNumber",
        "issueDate",
        "grade",
        "verificationHash"
    ]
    draw_entity(36, 8, 30, 27, "Certificate", c_fields)

    s_fields = [
        "_id (PK)",
        "appVersion",
        "aiModelEndpoint",
        "quizPassThreshold",
        "themeDefault",
        "maintenanceMode"
    ]
    draw_entity(70, 8, 26, 27, "SystemSetting", s_fields)

    # Connectors
    draw_diamond(46, 103, 15, 7, "maintains")
    ax.plot([34, 38.5], [118, 103], color='#000000', lw=1.4)
    ax.text(35, 114, "1", fontsize=9.5, fontweight='bold')
    ax.plot([53.5, 66], [103, 90], color='#000000', lw=1.4)
    ax.text(64, 94, "N", fontsize=9.5, fontweight='bold')

    draw_diamond(78, 96, 13, 6, "tracks")
    ax.plot([78, 78], [104, 99], color='#000000', lw=1.4)
    ax.text(79.5, 101, "1", fontsize=9.5, fontweight='bold')
    ax.plot([78, 78], [93, 90], color='#000000', lw=1.4)
    ax.text(79.5, 91, "N", fontsize=9.5, fontweight='bold')

    draw_diamond(20, 96, 15, 7, "attempts")
    ax.plot([20, 20], [104, 99.5], color='#000000', lw=1.4)
    ax.text(21.5, 101.5, "1", fontsize=9.5, fontweight='bold')
    ax.plot([20, 20], [92.5, 89], color='#000000', lw=1.4)
    ax.text(21.5, 90.5, "N", fontsize=9.5, fontweight='bold')

    draw_diamond(10, 45, 13, 6, "generates")
    ax.plot([10, 10], [56, 48], color='#000000', lw=1.4)
    ax.text(11.5, 52, "1", fontsize=9.5, fontweight='bold')
    ax.plot([10, 10], [42, 35], color='#000000', lw=1.4)
    ax.text(11.5, 37, "N", fontsize=9.5, fontweight='bold')

    draw_diamond(42, 45, 13, 6, "earns")
    ax.plot([34, 42], [108, 48], color='#000000', lw=1.4)
    ax.text(35, 104, "1", fontsize=9.5, fontweight='bold')
    ax.plot([45, 49], [42, 35], color='#000000', lw=1.4)
    ax.text(49, 38, "1", fontsize=9.5, fontweight='bold')

    draw_diamond(64, 45, 13, 6, "qualifies")
    ax.plot([66, 66], [54, 48], color='#000000', lw=1.4)
    ax.text(67.5, 51, "1", fontsize=9.5, fontweight='bold')
    ax.plot([61, 56], [42, 35], color='#000000', lw=1.4)
    ax.text(58, 38, "1", fontsize=9.5, fontweight='bold')

    plt.tight_layout()
    plt.savefig('documentation/diagrams/new_p9_er.png', dpi=300, bbox_inches='tight')
    plt.close()


if __name__ == '__main__':
    generate_p4_architecture()
    generate_p8_dfd_l0()
    generate_p8_dfd_l1()
    generate_p9_er()
    print("Updated p4, p8 and p9 diagrams successfully!")
