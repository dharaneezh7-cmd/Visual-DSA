import os
import docx
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn

def set_cell_background(cell, fill_hex):
    tcPr = cell._tc.get_or_add_tcPr()
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{fill_hex}"/>')
    tcPr.append(shd)

def set_cell_margins(cell, top=40, bottom=40, left=65, right=65):
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = OxmlElement('w:tcMar')
    for m, val in [('top', top), ('bottom', bottom), ('left', left), ('right', right)]:
        node = OxmlElement(f'w:{m}')
        node.set(qn('w:w'), str(val))
        node.set(qn('w:type'), 'dxa')
        tcMar.append(node)
    tcPr.append(tcMar)

def set_table_borders(table, color="000000", sz="4", val="single"):
    tblPr = table._tbl.tblPr
    tblBorders = parse_xml(
        f'<w:tblBorders {nsdecls("w")}>'
        f'  <w:top w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>'
        f'  <w:bottom w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>'
        f'  <w:left w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>'
        f'  <w:right w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>'
        f'  <w:insideH w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>'
        f'  <w:insideV w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>'
        f'</w:tblBorders>'
    )
    tblPr.append(tblBorders)

def add_page_border(section):
    secPr = section._sectPr
    pgBorders = parse_xml(
        f'<w:pgBorders {nsdecls("w")} w:offsetFrom="page">'
        f'  <w:top w:val="single" w:sz="12" w:space="24" w:color="000000"/>'
        f'  <w:left w:val="single" w:sz="12" w:space="24" w:color="000000"/>'
        f'  <w:bottom w:val="single" w:sz="12" w:space="24" w:color="000000"/>'
        f'  <w:right w:val="single" w:sz="12" w:space="24" w:color="000000"/>'
        f'</w:pgBorders>'
    )
    secPr.append(pgBorders)

def format_row(row, is_header=False, bg_hex="F2F2F2"):
    for cell in row.cells:
        if is_header:
            set_cell_background(cell, bg_hex)
            for p in cell.paragraphs:
                p.paragraph_format.space_before = Pt(2)
                p.paragraph_format.space_after = Pt(2)
                p.paragraph_format.line_spacing = 1.05
                for r in p.runs:
                    r.bold = True
                    r.font.size = Pt(9.5)
        else:
            for p in cell.paragraphs:
                p.paragraph_format.space_before = Pt(1.5)
                p.paragraph_format.space_after = Pt(1.5)
                p.paragraph_format.line_spacing = 1.05
                for r in p.runs:
                    r.font.size = Pt(9)
        set_cell_margins(cell, top=35, bottom=35, left=55, right=55)

def build_15_page_doc():
    doc = Document()
    
    # Page setup - A4 with 0.65 inch margins
    section = doc.sections[0]
    section.page_width = Inches(8.27)
    section.page_height = Inches(11.69)
    section.top_margin = Inches(0.65)
    section.bottom_margin = Inches(0.65)
    section.left_margin = Inches(0.65)
    section.right_margin = Inches(0.65)
    add_page_border(section)

    # Styles
    style_normal = doc.styles['Normal']
    style_normal.font.name = 'Times New Roman'
    style_normal.font.size = Pt(10)
    style_normal.font.color.rgb = RGBColor(0x00, 0x00, 0x00)
    style_normal.paragraph_format.line_spacing = 1.15
    style_normal.paragraph_format.space_after = Pt(3)

    def add_page_header(num):
        p = doc.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.RIGHT
        p.paragraph_format.space_before = Pt(0)
        p.paragraph_format.space_after = Pt(2)
        r = p.add_run(str(num))
        r.bold = True
        r.font.size = Pt(11)

    def add_main_heading(text, space_before=4, space_after=5):
        p = doc.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.LEFT
        p.paragraph_format.space_before = Pt(space_before)
        p.paragraph_format.space_after = Pt(space_after)
        r = p.add_run(text)
        r.bold = True
        r.font.size = Pt(12)
        return p

    def add_subheading(text, space_before=3, space_after=2):
        p = doc.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.LEFT
        p.paragraph_format.space_before = Pt(space_before)
        p.paragraph_format.space_after = Pt(space_after)
        r = p.add_run(text)
        r.bold = True
        r.font.size = Pt(10.5)
        return p

    def add_bullet(text, space_after=2):
        p = doc.add_paragraph(style='List Bullet')
        p.paragraph_format.space_before = Pt(0)
        p.paragraph_format.space_after = Pt(space_after)
        p.paragraph_format.line_spacing = 1.12
        r = p.add_run(text)
        r.font.size = Pt(10)
        return p

    # =========================================================================
    # PAGE 1: COVER PAGE
    # =========================================================================
    p_inst = doc.add_paragraph()
    p_inst.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_inst.paragraph_format.space_before = Pt(18)
    p_inst.paragraph_format.space_after = Pt(10)
    r_inst = p_inst.add_run("COIMBATORE INSTITUTE OF TECHNOLOGY—641014\nMSC – SOFTWARE SYSTEMS")
    r_inst.bold = True
    r_inst.font.size = Pt(14)

    # CIT Logo
    cit_logo = 'documentation/extracted_p1_img0_Image18.png'
    if os.path.exists(cit_logo):
        p_logo = doc.add_paragraph()
        p_logo.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_logo.paragraph_format.space_before = Pt(8)
        p_logo.paragraph_format.space_after = Pt(16)
        run_logo = p_logo.add_run()
        run_logo.add_picture(cit_logo, width=Inches(1.55))

    p_proj = doc.add_paragraph()
    p_proj.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_proj.paragraph_format.space_after = Pt(8)
    r_pr = p_proj.add_run("PROJECT RECORD\nVISUAL DSA — INTERACTIVE DATA STRUCTURES AND ALGORITHMS VISUALIZATION PLATFORM")
    r_pr.bold = True
    r_pr.font.size = Pt(13)

    p_sub = doc.add_paragraph()
    p_sub.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_sub.paragraph_format.space_after = Pt(40)
    r_sub = p_sub.add_run("(Interactive Learning, Algorithm Tracing & AI Tutoring)\nA Full-Stack React & Python Web Application")
    r_sub.font.size = Pt(11)

    # Student Details Box
    tbl_cover = doc.add_table(rows=7, cols=2)
    tbl_cover.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(tbl_cover, color="000000", sz="6")

    cover_meta = [
        ("NAME", "DHARANEESH V"),
        ("REGISTER NUMBER", "2503717672621011"),
        ("COURSE", "M.Sc.SS"),
        ("SUBJECT CODE", "25SS322"),
        ("SUBJECT", "PYTHON PROGRAMMING LABORATORY"),
        ("SEMESTER", "III"),
        ("ACADEMIC YEAR", "2026 – 2027")
    ]

    for idx, (label, val) in enumerate(cover_meta):
        row = tbl_cover.rows[idx]
        c0, c1 = row.cells[0], row.cells[1]
        c0.width = Inches(2.2)
        c1.width = Inches(3.6)
        
        p0 = c0.paragraphs[0]
        p0.paragraph_format.space_before = Pt(4)
        p0.paragraph_format.space_after = Pt(4)
        r0 = p0.add_run(label)
        r0.bold = True
        r0.font.size = Pt(10)

        p1 = c1.paragraphs[0]
        p1.paragraph_format.space_before = Pt(4)
        p1.paragraph_format.space_after = Pt(4)
        r1 = p1.add_run(val)
        r1.bold = True
        r1.font.size = Pt(10)
        set_cell_margins(c0, top=45, bottom=45, left=75, right=75)
        set_cell_margins(c1, top=45, bottom=45, left=75, right=75)

    doc.add_page_break()

    # =========================================================================
    # PAGE 2: SYNOPSIS
    # =========================================================================
    add_page_header(1)
    add_main_heading("SYNOPSIS")

    p = doc.add_paragraph()
    r = p.add_run("Title: ")
    r.bold = True
    p.add_run("Visual DSA — Interactive Data Structures and Algorithms Visualization Platform")

    p = doc.add_paragraph()
    r = p.add_run("Background: ")
    r.bold = True
    p.add_run("Data structures and algorithms (DSA) are the foundation of computer science education and software engineering proficiency. However, abstract concepts such as dynamic pointer manipulation, recursive call-stack unwinding, tree balancing, and algorithmic step execution are notoriously difficult to master using static textbook diagrams and dry code snippets. Learners frequently struggle to mentalise dynamic memory states and time complexity transitions, resulting in high cognitive friction and retention challenges.")

    p = doc.add_paragraph()
    r = p.add_run("Proposed System: ")
    r.bold = True
    p.add_run("Visual DSA is a full-stack educational web application engineered with React 19, TypeScript, Node.js/Express, MongoDB, and a Python FastAPI microservice integrated with local Ollama LLMs. The platform digitizes the algorithm learning lifecycle through synchronized step-by-step canvas animations, real-time pseudocode line execution, live variable inspectors, interactive auto-graded quizzes, persistent mastery tracking, and an on-demand AI tutor (Lemmy Assistant) for natural language algorithmic guidance.")

    p = doc.add_paragraph()
    r = p.add_run("Key Features:\n")
    r.bold = True
    add_bullet("Interactive visualizers for Arrays, Linked Lists, Stacks, Queues, Circular Queues, Searching, and Sorting with step-by-step playback controls, speed adjustment, and custom input datasets.")
    add_bullet("Synchronized pseudocode execution panel that dynamically highlights active code lines alongside asymptotic complexity breakdowns (Best, Average, Worst Time and Space).")
    add_bullet("Intelligent AI Tutor (Lemmy Assistant) powered by a Python microservice with local LLMs (Ollama) providing code explanations, complexity analysis, and debugging tips.")
    add_bullet("Self-assessment practice suite featuring topic-specific multiple-choice quizzes, real-time scoring, answer explanations, and automated progress recording.")
    add_bullet("Persistent learner progress tracking with overall completion metrics, concept mastery meters, and cryptographically verifiable PDF Certificates of Completion.")

    p = doc.add_paragraph()
    r = p.add_run("Technologies Used: ")
    r.bold = True
    p.add_run("React 19 with Vite, TypeScript, and Tailwind CSS (frontend); Node.js and Express.js (REST API backend); MongoDB with Mongoose ODM (database); Python 3.10+, FastAPI, and Ollama LLM (AI service); JSON Web Tokens (JWT), bcryptjs, Canvas Confetti, and jsPDF.")

    p = doc.add_paragraph()
    r = p.add_run("Expected Outcome: ")
    r.bold = True
    p.add_run("An intuitive, pedagogically robust, and responsive web platform that bridges theoretical algorithmic principles with dynamic graphical execution, enabling students to master complex computational paradigms with confidence and clarity.")

    doc.add_page_break()

    # =========================================================================
    # PAGE 3: OBJECTIVE & SCOPE
    # =========================================================================
    add_page_header(2)
    add_main_heading("OBJECTIVE")

    p = doc.add_paragraph()
    p.add_run("The primary objective of this project is to design and develop an interactive, full-stack visualization and self-paced learning platform that demystifies data structures and algorithms through intuitive animations and intelligent tutoring. The specific objectives are:")

    objs = [
        "To develop interactive, graphical animations for fundamental data structures (Arrays, Singly Linked Lists, Stacks, Queues, Circular Queues) and core algorithms (Linear Search, Binary Search, Bubble, Selection, Insertion, Quick, and Merge Sort).",
        "To provide granular, bidirectional execution playback controls (Play, Pause, Step Forward, Step Backward, Reset, and Speed Slider) for detailed inspection of state transitions.",
        "To synchronize visual canvas transformations with real-time highlighted pseudocode lines and active variable states.",
        "To build an auto-graded practice assessment engine with randomized question pools, immediate feedback, and conceptual explanations.",
        "To engineer an AI-powered tutoring service using Python FastAPI and local Ollama LLMs for contextual explanations and algorithmic query resolution.",
        "To implement secure user authentication, bcrypt password hashing, and session persistence using JSON Web Tokens (JWT).",
        "To record learner progress, calculate topic mastery percentages, log activity sessions, and issue verifiable PDF Certificates of Completion."
    ]

    for idx, obj in enumerate(objs, 1):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(1)
        p.paragraph_format.space_after = Pt(2.5)
        p.paragraph_format.line_spacing = 1.12
        r = p.add_run(f"{idx}. ")
        r.bold = True
        p.add_run(obj)

    add_main_heading("SCOPE", space_before=5)
    p = doc.add_paragraph()
    p.add_run("The system is designed for computer science students, engineering faculty, coding bootcamp participants, and technical interview candidates seeking an intuitive, visual approach to mastering data structures and algorithms.")

    add_subheading("Scope of the Project")
    add_bullet("Interactive Data Structure Visualizers: Graphical representation of arrays with element shifting; linked lists with pointer redirection; stacks with LIFO push/pop; and linear/circular queues with wraparound buffer tracking.")
    add_bullet("Algorithm Animation Playground: Real-time execution of searching and sorting algorithms with color-coded comparison, swap, and sorted boundary highlights.")
    add_bullet("Synchronized Theory & Pseudocode: Collapsible instruction panels detailing formal definitions, asymptotic complexities, and line-by-line algorithm code.")
    add_bullet("Practice & Auto-Graded Assessments: Multiple-choice evaluations across all topics with instant score computation, performance statistics, and review summaries.")
    add_bullet("AI-Assisted Tutoring: Context-aware assistance via Lemmy AI, delivering code hints and time complexity breakdowns through a Python FastAPI microservice.")
    add_bullet("Learner Analytics & Certification: Persistent tracking of completed topics, operations count, study time, and client-side PDF certificate generation.")

    add_subheading("Limitations")
    add_bullet("The application operates as a modern web application requiring an active Node.js server and MongoDB connection.")

    doc.add_page_break()

    # =========================================================================
    # PAGE 4: PROJECT DESCRIPTION (Part 1) & SYSTEM ARCHITECTURE
    # =========================================================================
    add_page_header(3)
    
    add_bullet("AI Tutoring depends on an active local Ollama runtime; if the Python service is offline, fallback guidance is displayed.")
    add_bullet("Real-time collaborative whiteboarding and multi-user synchronized classrooms are outside the present implementation scope.")
    add_bullet("Advanced graph and dynamic programming visualizers (Dijkstra, Bellman-Ford, Floyd-Warshall) are planned for subsequent versions.")

    add_main_heading("PROJECT DESCRIPTION", space_before=4)
    add_subheading("1. Overview")
    p = doc.add_paragraph()
    p.add_run("Visual DSA is a multi-tier educational platform engineered to eliminate cognitive barriers in algorithmic learning. The React 19 frontend communicates with an Express.js REST API for authentication, user profiles, and progress metrics stored in MongoDB via Mongoose ODM. An auxiliary Python FastAPI microservice connects the frontend to a local Ollama LLM runtime, delivering low-latency, private, and contextual tutoring assistance.")

    add_subheading("2. System Architecture")
    arch_img = 'documentation/diagrams/new_p4_architecture.png'
    if os.path.exists(arch_img):
        p_img = doc.add_paragraph()
        p_img.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_img.paragraph_format.space_before = Pt(2)
        p_img.paragraph_format.space_after = Pt(2)
        r = p_img.add_run()
        r.add_picture(arch_img, width=Inches(6.2))
        
        p_cap = doc.add_paragraph()
        p_cap.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_cap.paragraph_format.space_after = Pt(3)
        r_cap = p_cap.add_run("System architecture of the Visual DSA Platform")
        r_cap.italic = True
        r_cap.font.size = Pt(9.5)

    add_subheading("3. Modules")
    tbl_mod1 = doc.add_table(rows=7, cols=2)
    tbl_mod1.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(tbl_mod1, color="000000", sz="4")

    tbl_mod1.rows[0].cells[0].paragraphs[0].add_run("Module")
    tbl_mod1.rows[0].cells[1].paragraphs[0].add_run("Description")
    format_row(tbl_mod1.rows[0], is_header=True)

    mods_p4 = [
        ("Array Visualizer", "Dynamic contiguous memory manipulation (Insert, Delete, Search, Update) with animated element shifting and index tracking."),
        ("Linked List Visualizer", "Singly linked list node insertion (Head, Tail, Index), deletion, and reversal with animated pointer redirection and null termination."),
        ("Stack Visualizer", "LIFO stack operations (Push, Pop, Peek, Clear) with top pointer tracking and overflow/underflow boundary protection."),
        ("Queue & Circular Queue", "FIFO linear queue and circular buffer visualizers with dynamic front/rear pointer tracking and modulo wraparound logic."),
        ("Searching Algorithms", "Step-by-step execution of Linear Search and Binary Search with low, mid, and high pointer indicators and comparison counts."),
        ("Sorting Algorithms", "Interactive sorting playground for Bubble, Selection, Insertion, Quick, and Merge sort with color-coded comparison and swap states.")
    ]

    for idx, (m, d) in enumerate(mods_p4, 1):
        row = tbl_mod1.rows[idx]
        row.cells[0].paragraphs[0].add_run(m)
        row.cells[1].paragraphs[0].add_run(d)
        row.cells[0].width = Inches(1.8)
        row.cells[1].width = Inches(5.1)
        format_row(row, is_header=False)

    doc.add_page_break()

    # =========================================================================
    # PAGE 5: PROJECT DESCRIPTION (Part 2), TECH STACK & WORKING
    # =========================================================================
    add_page_header(4)

    tbl_mod2 = doc.add_table(rows=6, cols=2)
    tbl_mod2.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(tbl_mod2, color="000000", sz="4")

    tbl_mod2.rows[0].cells[0].paragraphs[0].add_run("Module")
    tbl_mod2.rows[0].cells[1].paragraphs[0].add_run("Description")
    format_row(tbl_mod2.rows[0], is_header=True)

    mods_p5 = [
        ("Practice & Quiz Engine", "Topic-based multiple-choice assessment suite featuring auto-grading, randomized question pools, and detailed review feedback."),
        ("Progress & Dashboard", "Real-time dashboard displaying curriculum completion percentage, concept mastery meters, active study time, and activity history."),
        ("AI Tutor (Lemmy Assistant)", "FastAPI and Ollama LLM integration offering contextual algorithmic hints, code debugging, and theoretical explanations."),
        ("Certificate Generator", "Automated client-side PDF certificate creation with learner name, completion timestamp, and verification hash."),
        ("User Authentication", "Secure account registration, JWT session verification, bcrypt password hashing, and profile personalization.")
    ]

    for idx, (m, d) in enumerate(mods_p5, 1):
        row = tbl_mod2.rows[idx]
        row.cells[0].paragraphs[0].add_run(m)
        row.cells[1].paragraphs[0].add_run(d)
        row.cells[0].width = Inches(1.8)
        row.cells[1].width = Inches(5.1)
        format_row(row, is_header=False)

    add_subheading("4. Technology Stack", space_before=4)
    tbl_tech = doc.add_table(rows=7, cols=2)
    tbl_tech.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(tbl_tech, color="000000", sz="4")

    tbl_tech.rows[0].cells[0].paragraphs[0].add_run("Layer")
    tbl_tech.rows[0].cells[1].paragraphs[0].add_run("Technologies")
    format_row(tbl_tech.rows[0], is_header=True)

    techs = [
        ("Frontend", "React 19 (Vite), TypeScript, Tailwind CSS, Lucide icons, HTML5 Canvas, Canvas Confetti"),
        ("Backend API", "Node.js, Express.js, cors, dotenv"),
        ("Database", "MongoDB with Mongoose ODM 8.x"),
        ("Security", "JSON Web Tokens (jsonwebtoken), bcryptjs"),
        ("AI Microservice", "Python 3.10+, FastAPI, Uvicorn, httpx, Ollama LLM (Llama 3 / Mistral)"),
        ("PDF & Export", "jsPDF, html2canvas (Certificates), python-docx, docx2pdf")
    ]

    for idx, (l, t) in enumerate(techs, 1):
        row = tbl_tech.rows[idx]
        row.cells[0].paragraphs[0].add_run(l)
        row.cells[1].paragraphs[0].add_run(t)
        row.cells[0].width = Inches(1.8)
        row.cells[1].width = Inches(5.1)
        format_row(row, is_header=False)

    add_subheading("5. Software Requirements", space_before=4)
    add_bullet("Node.js v18.x or higher with npm package manager.")
    add_bullet("MongoDB Community Server (local) or MongoDB Atlas connection URI.")
    add_bullet("Python 3.10+ runtime with FastAPI and Uvicorn.")
    add_bullet("Ollama local AI runtime with llama3 or mistral pulled.")
    add_bullet("Modern web browser (Google Chrome, Microsoft Edge, or Firefox).")

    add_subheading("6. Working of the System", space_before=4)
    workings = [
        "The learner registers or logs in; the Express API verifies credentials using bcrypt and issues a signed JWT.",
        "The learner selects a data structure or algorithm module; frontend initializes data structures and pre-computes steps.",
        "The user triggers playback controls; the engine animates memory states synchronized with highlighted pseudocode lines.",
        "The learner completes practice quizzes; the client scores answers and submits results to the MongoDB progress collection.",
        "The learner queries Lemmy AI assistant; prompts are routed to the Python FastAPI microservice interfacing with Ollama.",
        "Upon completing curriculum topics, the learner generates and downloads a cryptographically verifiable PDF Certificate."
    ]
    for idx, w in enumerate(workings, 1):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(0)
        p.paragraph_format.space_after = Pt(1.5)
        r = p.add_run(f"{idx}. ")
        r.bold = True
        p.add_run(w)

    add_main_heading("DATABASE DESIGN", space_before=4)
    p = doc.add_paragraph()
    p.add_run("The platform uses MongoDB, a document database (database: visual_dsa). Data is structured into 6 schema-validated collections managed through Mongoose ODM 8.x. Compound indexes ensure rapid progress queries, quiz response logging, and user session verification.")

    doc.add_page_break()

    # =========================================================================
    # PAGE 6: DATABASE DESIGN (Collections 1, 2, 3)
    # =========================================================================
    add_page_header(5)

    def add_collection_table(coll_title, fields, compound_index=None):
        add_subheading(coll_title, space_before=3, space_after=2)
        tbl = doc.add_table(rows=len(fields) + 1, cols=3)
        tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
        set_table_borders(tbl, color="000000", sz="4")

        tbl.rows[0].cells[0].paragraphs[0].add_run("Field Name")
        tbl.rows[0].cells[1].paragraphs[0].add_run("Data Type")
        tbl.rows[0].cells[2].paragraphs[0].add_run("Description / Constraint")
        format_row(tbl.rows[0], is_header=True)

        for idx, (f, t, d) in enumerate(fields, 1):
            row = tbl.rows[idx]
            row.cells[0].paragraphs[0].add_run(f)
            row.cells[1].paragraphs[0].add_run(t)
            row.cells[2].paragraphs[0].add_run(d)
            row.cells[0].width = Inches(1.8)
            row.cells[1].width = Inches(1.4)
            row.cells[2].width = Inches(3.7)
            format_row(row, is_header=False)

        if compound_index:
            p_idx = doc.add_paragraph()
            p_idx.paragraph_format.space_before = Pt(1.5)
            p_idx.paragraph_format.space_after = Pt(3)
            r_idx = p_idx.add_run("Index: ")
            r_idx.bold = True
            p_idx.add_run(compound_index)

    # 1. users
    users_fields = [
        ("_id", "ObjectId", "Primary Key"),
        ("username", "String", "Unique login handle (Indexed, required)"),
        ("email", "String", "Unique user email address (Indexed, lowercase)"),
        ("password", "String", "bcrypt-hashed password (10 salt rounds)"),
        ("role", "String", "Access role: 'student' or 'admin' (Default: 'student')"),
        ("tokenVersion", "Number", "Session counter for token revocation"),
        ("failedAttempts", "Number", "Failed login attempts counter"),
        ("lockedUntil", "Date", "Account temporary lockout timestamp"),
        ("createdAt", "Date", "Account creation ISO timestamp")
    ]
    add_collection_table("1. users Collection", users_fields)

    # 2. progresses
    prog_fields = [
        ("_id", "ObjectId", "Primary Key"),
        ("userId", "ObjectId", "Foreign Key -> users._id (Indexed)"),
        ("topic", "String", "DSA module topic key ('array', 'sorting')"),
        ("concept", "String", "Specific algorithm name ('binary_search')"),
        ("completed", "Boolean", "Topic completion flag (Default: false)"),
        ("completionPct", "Number", "Mastery percentage score (0 to 100)"),
        ("timeSpent", "Number", "Total active learning duration in seconds"),
        ("operationsCount", "Number", "Count of visualizer operations executed"),
        ("lastAccessed", "Date", "Timestamp of most recent topic activity")
    ]
    add_collection_table("2. progresses Collection", prog_fields, "Compound Super key index on { userId: 1, topic: 1 }")

    # 3. practices
    prac_fields = [
        ("_id", "ObjectId", "Primary Key"),
        ("userId", "ObjectId", "Foreign Key -> users._id (Indexed)"),
        ("topicId", "String", "Target module identifier ('arrays', 'stack')"),
        ("score", "Number", "Total marks scored in quiz attempt"),
        ("totalQuestions", "Number", "Total number of questions in quiz"),
        ("accuracy", "Number", "Percentage accuracy scored (0 to 100)"),
        ("responses[]", "Array", "Array of selected option indices"),
        ("attemptedAt", "Date", "Quiz submission ISO timestamp")
    ]
    add_collection_table("3. practices Collection", prac_fields, "Compound Super key index on { userId: 1, topicId: 1, attemptedAt: -1 }")

    doc.add_page_break()

    # =========================================================================
    # PAGE 7: DATABASE DESIGN (Collections 4, 5, 6)
    # =========================================================================
    add_page_header(6)

    # 4. activities
    act_fields = [
        ("_id", "ObjectId", "Primary Key"),
        ("userId", "ObjectId", "Foreign Key -> users._id (Indexed)"),
        ("action", "String", "Action: 'LOGIN', 'VISUALIZE', 'QUIZ_SUBMIT'"),
        ("module", "String", "Associated topic key ('array', 'sorting', 'ai_tutor')"),
        ("details", "String", "Descriptive operation details"),
        ("durationSeconds", "Number", "Session duration spent on action"),
        ("timestamp", "Date", "Event occurrence ISO timestamp")
    ]
    add_collection_table("4. activities Collection", act_fields, "Compound index on { userId: 1, timestamp: -1 }")

    # 5. topics
    topic_fields = [
        ("_id", "ObjectId", "Primary Key"),
        ("topicId", "String", "Unique topic slug ('stack', 'bubble_sort')"),
        ("title", "String", "Full module title ('Bubble Sort Visualizer')"),
        ("category", "String", "Classification: 'Data Structures' or 'Algorithms'"),
        ("timeComplexity", "String", "Asymptotic bounds (Best, Average, Worst)"),
        ("spaceComplexity", "String", "Auxiliary memory complexity (e.g. O(1), O(n))"),
        ("pseudocode", "Array", "Line-by-line algorithm implementation statements"),
        ("orderIndex", "Number", "Display sorting order index")
    ]
    add_collection_table("5. topics Collection", topic_fields)

    # 6. certificates & settings
    cert_fields = [
        ("_id", "ObjectId", "Primary Key"),
        ("userId", "ObjectId", "Foreign Key -> users._id (Indexed)"),
        ("certificateNumber", "String", "Unique certificate identifier ('VDSA-2026-X892')"),
        ("issueDate", "Date", "Curriculum completion timestamp"),
        ("grade", "String", "Performance grade ('Distinction', 'Pass')"),
        ("verificationHash", "String", "SHA-256 cryptographic credential verification hash"),
        ("appVersion", "String", "Platform release version ('v2.4.0')"),
        ("aiModelEndpoint", "String", "FastAPI microservice endpoint URI"),
        ("quizPassThreshold", "Number", "Minimum passing score percentage (70%)")
    ]
    add_collection_table("6. certificates and settings Collections (Configuration)", cert_fields)

    doc.add_page_break()

    # =========================================================================
    # PAGE 8: DATA FLOW DIAGRAM (DFD)
    # =========================================================================
    add_page_header(7)
    add_main_heading("DATA FLOW DIAGRAM (DFD)")

    add_subheading("Level 0 – Context Diagram")
    p = doc.add_paragraph()
    p.paragraph_format.space_after = Pt(2)
    p.add_run("The context diagram shows the whole system as one process exchanging data with three external entities: the Administrator / Instructor, the Learner / Student, and the External AI Service (Ollama LLM).")

    dfd0_img = 'documentation/diagrams/new_p8_dfd_l0.png'
    if os.path.exists(dfd0_img):
        p_img = doc.add_paragraph()
        p_img.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_img.paragraph_format.space_before = Pt(1)
        p_img.paragraph_format.space_after = Pt(2)
        r = p_img.add_run()
        r.add_picture(dfd0_img, width=Inches(4.8))

    add_subheading("Level 1 DFD")
    p = doc.add_paragraph()
    p.paragraph_format.space_after = Pt(2)
    p.add_run("Level 1 splits the system into six processes: Authentication & Session Verification (1.0), Module Selection & Theory Explorer (2.0), Visualizer State Engine (3.0), Practice Quiz & Auto-Assessment (4.0), Progress Analytics & Certification (5.0), and AI Tutoring Assistant (6.0), coordinated with six persistent data stores (D1–D6).")

    dfd1_img = 'documentation/diagrams/new_p8_dfd_l1.png'
    if os.path.exists(dfd1_img):
        p_img = doc.add_paragraph()
        p_img.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_img.paragraph_format.space_before = Pt(1)
        p_img.paragraph_format.space_after = Pt(1)
        r = p_img.add_run()
        r.add_picture(dfd1_img, width=Inches(4.5))

    doc.add_page_break()

    # =========================================================================
    # PAGE 9: ER DIAGRAM
    # =========================================================================
    add_page_header(8)
    add_main_heading("ER DIAGRAM")

    p = doc.add_paragraph()
    p.paragraph_format.space_after = Pt(2)
    p.add_run("The entity-relationship diagram shows the collections and their relationships. One User maintains many Progress records (1 : N), one User attempts many Practice quizzes (1 : N), one User generates many ActivityLog entries (1 : N), and one User earns one Certificate (1 : 1). Topic tracks progress and evaluates quizzes, while SystemSetting provides platform configuration.")

    er_img = 'documentation/diagrams/new_p9_er.png'
    if os.path.exists(er_img):
        p_img = doc.add_paragraph()
        p_img.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_img.paragraph_format.space_before = Pt(1)
        p_img.paragraph_format.space_after = Pt(1)
        r = p_img.add_run()
        r.add_picture(er_img, width=Inches(4.7))

    doc.add_page_break()

    # =========================================================================
    # PAGE 10: USE CASE DIAGRAM
    # =========================================================================
    add_page_header(9)
    add_main_heading("USE CASE DIAGRAM")

    p = doc.add_paragraph()
    p.paragraph_format.space_after = Pt(2)
    p.add_run("Two actors interact with the system. The Learner / Student explores data structures, executes algorithm animations, attempts practice quizzes, queries the AI tutor, and downloads certificates. The Admin / Instructor inherits learner functionality and additionally manages topics, analytics, activity logs, and question banks.")

    uc_img = 'documentation/diagrams/new_p10_use_case.png'
    if os.path.exists(uc_img):
        p_img = doc.add_paragraph()
        p_img.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_img.paragraph_format.space_before = Pt(1)
        p_img.paragraph_format.space_after = Pt(1)
        r = p_img.add_run()
        r.add_picture(uc_img, width=Inches(5.4))

    doc.add_page_break()

    # =========================================================================
    # PAGE 11: CLASS DIAGRAM
    # =========================================================================
    add_page_header(10)
    add_main_heading("CLASS DIAGRAM")

    p = doc.add_paragraph()
    p.paragraph_format.space_after = Pt(2)
    p.add_run("The class diagram shows the core classes with attributes and methods. VisualizerEngine aggregates StepFrame instances via composition to manage animation state frames. User coordinates with ProgressTracker and PracticeSession, while LemmyAIAssistant manages conversational prompts with the AI microservice.")

    cls_img = 'documentation/diagrams/new_p11_class.png'
    if os.path.exists(cls_img):
        p_img = doc.add_paragraph()
        p_img.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_img.paragraph_format.space_before = Pt(1)
        p_img.paragraph_format.space_after = Pt(1)
        r = p_img.add_run()
        r.add_picture(cls_img, width=Inches(5.4))

    doc.add_page_break()

    # =========================================================================
    # PAGE 12: SEQUENCE DIAGRAM
    # =========================================================================
    add_page_header(11)
    add_main_heading("SEQUENCE DIAGRAM")

    p = doc.add_paragraph()
    p.paragraph_format.space_after = Pt(2)
    p.add_run("The sequence diagrams illustrate object interactions across three critical workflows: User login and session verification; algorithm visualization with pseudocode synchronization; and quiz assessment with persistent progress synchronization.")

    seq_img = 'documentation/diagrams/new_p12_sequence_stacked.png'
    if os.path.exists(seq_img):
        p_img = doc.add_paragraph()
        p_img.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_img.paragraph_format.space_before = Pt(1)
        p_img.paragraph_format.space_after = Pt(1)
        r = p_img.add_run()
        r.add_picture(seq_img, width=Inches(5.3))

    doc.add_page_break()

    # =========================================================================
    # PAGE 13: SCREENSHOTS (FORMS)
    # =========================================================================
    add_page_header(12)
    add_main_heading("SCREENSHOTS (FORMS)")

    p = doc.add_paragraph()
    p.paragraph_format.space_after = Pt(3)
    p.add_run("The following screenshots present key interfaces of the Visual DSA application: the Home Learning Dashboard, the Interactive Algorithm Visualizer with live tracing, the Self-Assessment Practice Quiz, and the Verifiable Certificate of Completion.")

    shots_img = 'documentation/screenshots/page13_screenshots_grid.png'
    if os.path.exists(shots_img):
        p_img = doc.add_paragraph()
        p_img.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_img.paragraph_format.space_before = Pt(2)
        p_img.paragraph_format.space_after = Pt(2)
        r = p_img.add_run()
        r.add_picture(shots_img, width=Inches(5.8))

    doc.add_page_break()

    # =========================================================================
    # PAGE 14: TEST REPORT & CONCLUSION (Part 1)
    # =========================================================================
    add_page_header(13)
    add_main_heading("TEST REPORT")

    p = doc.add_paragraph()
    p.paragraph_format.space_after = Pt(3)
    p.add_run("The following test cases were prepared to verify the functional operations, visualization fidelity, assessment logic, and AI tutor responsiveness of Visual DSA.")

    tbl_test = doc.add_table(rows=14, cols=5)
    tbl_test.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(tbl_test, color="000000", sz="4")

    tbl_test.rows[0].cells[0].paragraphs[0].add_run("TC ID")
    tbl_test.rows[0].cells[1].paragraphs[0].add_run("Module")
    tbl_test.rows[0].cells[2].paragraphs[0].add_run("Test Scenario")
    tbl_test.rows[0].cells[3].paragraphs[0].add_run("Expected Result")
    tbl_test.rows[0].cells[4].paragraphs[0].add_run("Status")
    format_row(tbl_test.rows[0], is_header=True)

    tcs = [
        ("TC01", "Authentication", "Login with valid credentials (student / pass123)", "Authentication successful, JWT stored, opens Dashboard", "Pass"),
        ("TC02", "Authentication", "Login with invalid password", "HTTP 401 returned; access denied with error banner", "Pass"),
        ("TC03", "Access Control", "Unauthorized access to protected route", "Request intercepted; redirect to Login modal", "Pass"),
        ("TC04", "Array Visualizer", "Insert value at index 2", "Array shifts elements right; visual animation executes", "Pass"),
        ("TC05", "Linked List", "Delete node at tail", "Pointer updates, node fades out; length decremented", "Pass"),
        ("TC06", "Stack Visualizer", "Push element when stack is full", "Overflow alert shown; element rejected cleanly", "Pass"),
        ("TC07", "Circular Queue", "Enqueue beyond buffer capacity", "Rear pointer wraps around to index 0 with alert", "Pass"),
        ("TC08", "Binary Search", "Search target in sorted array", "Low, mid, high pointers update step by step", "Pass"),
        ("TC09", "Sorting Engine", "Execute Bubble Sort on random array", "Comparative swaps animate; active pseudocode highlights", "Pass"),
        ("TC10", "Practice Quiz", "Submit quiz with 3 correct answers", "Score calculated as 100%; saved to database", "Pass"),
        ("TC11", "AI Tutor (Lemmy)", "Query time complexity of Merge Sort", "Context sent to FastAPI; Ollama streams O(n log n)", "Pass"),
        ("TC12", "Progress Tracker", "Complete all topics in module", "Overall curriculum completion % updates in real time", "Pass"),
        ("TC13", "Certificate Engine", "Generate certificate on completion", "High-resolution PDF created with unique verification ID", "Pass")
    ]

    for idx, (tcid, mod, scen, exp, stat) in enumerate(tcs, 1):
        row = tbl_test.rows[idx]
        row.cells[0].paragraphs[0].add_run(tcid)
        row.cells[1].paragraphs[0].add_run(mod)
        row.cells[2].paragraphs[0].add_run(scen)
        row.cells[3].paragraphs[0].add_run(exp)
        row.cells[4].paragraphs[0].add_run(stat)
        row.cells[0].width = Inches(0.65)
        row.cells[1].width = Inches(1.25)
        row.cells[2].width = Inches(2.2)
        row.cells[3].width = Inches(2.2)
        row.cells[4].width = Inches(0.6)
        format_row(row, is_header=False)

    add_main_heading("CONCLUSION AND FURTHER ENHANCEMENTS", space_before=4)
    add_subheading("Conclusion")
    p = doc.add_paragraph()
    p.add_run("The Visual DSA (Interactive Data Structures and Algorithms Visualization Platform) successfully replaces passive textbook learning with an automated, robust, and interactive full-stack architecture. By providing a centralized digital environment for algorithm animations, synchronized pseudocode execution, dynamic variable tracking across execution states, auto-graded quizzes, verifiable PDF completion certificates,")

    doc.add_page_break()

    # =========================================================================
    # PAGE 15: CONCLUSION (Part 2) & FURTHER ENHANCEMENTS
    # =========================================================================
    add_page_header(14)

    p = doc.add_paragraph()
    p.add_run("and conversational AI tutoring powered by local Ollama LLMs, the platform eliminates conceptual ambiguity and learning friction. It provides computer science students and educators with transparent, real-time insight into internal data structure mutations and asymptotic complexity analysis.")

    add_main_heading("Further Enhancements", space_before=5)
    enhancements = [
        "Advanced Graph & Dynamic Programming Visualizers: Direct integration of graph visualizers for Dijkstra’s shortest path, Bellman-Ford, Prim’s and Kruskal’s minimum spanning trees, and dynamic programming matrices (0/1 Knapsack, Longest Common Subsequence).",
        "Collaborative Multi-User Classrooms: WebSocket-assisted multi-user synchronization allowing university instructors to broadcast live algorithm execution traces and pointer mutations across student screens simultaneously.",
        "In-Browser Code Execution Sandbox: WebAssembly-powered C++, Java, and Python code compilers enabling students to write custom algorithm implementations and watch them animate in real time.",
        "Voice-Activated Conversational AI Tutoring: Hardware-accelerated speech-to-text and voice synthesis integration with Lemmy AI for natural conversational questions and hands-free code debugging.",
        "Mobile Native Applications: Cross-platform iOS and Android mobile versions developed with React Native and Canvas acceleration for self-paced algorithm practice on mobile devices.",
        "Enterprise University LMS Integration: Centralized institutional portal with LTI (Learning Tools Interoperability) protocol support for automated gradebook synchronization with Moodle, Canvas, and Blackboard."
    ]

    for enh in enhancements:
        add_bullet(enh, space_after=3.5)

    out_docx = 'documentation/Visual_DSA_Project_Documentation.docx'
    doc.save(out_docx)
    print(f"Document successfully created at {out_docx}")

if __name__ == '__main__':
    build_15_page_doc()
