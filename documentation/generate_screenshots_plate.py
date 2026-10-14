import os
from PIL import Image, ImageDraw, ImageFont

def generate_screenshots_plate():
    # Load 4 key screenshots
    s1 = Image.open('documentation/screenshots/01_home_dashboard.png')
    s2 = Image.open('documentation/screenshots/02_array_visualizer.png')
    s3 = Image.open('documentation/screenshots/04_practice_quiz.png')
    s4 = Image.open('documentation/screenshots/05_certificate_page.png')

    target_w, target_h = 1000, 625
    s1_r = s1.resize((target_w, target_h), Image.Resampling.LANCZOS)
    s2_r = s2.resize((target_w, target_h), Image.Resampling.LANCZOS)
    s3_r = s3.resize((target_w, target_h), Image.Resampling.LANCZOS)
    s4_r = s4.resize((target_w, target_h), Image.Resampling.LANCZOS)

    # Plate dimensions: 2 columns, 2 rows with margins and captions
    plate_w = target_w * 2 + 100
    plate_h = (target_h + 80) * 2 + 60

    plate = Image.new('RGB', (plate_w, plate_h), color='#ffffff')
    draw = ImageDraw.Draw(plate)

    try:
        font = ImageFont.truetype("arialbd.ttf", 26)
    except:
        font = ImageFont.load_default()

    # Position 1: Top Left
    x1, y1 = 35, 20
    draw.text((x1 + 10, y1 + 10), "Fig 1. Home Dashboard & Topic Catalog", fill="#000000", font=font)
    plate.paste(s1_r, (x1, y1 + 50))
    draw.rectangle([x1, y1 + 50, x1 + target_w, y1 + 50 + target_h], outline="#999999", width=2)

    # Position 2: Top Right
    x2, y2 = target_w + 65, 20
    draw.text((x2 + 10, y2 + 10), "Fig 2. Interactive Algorithm Visualizer & Tracing", fill="#000000", font=font)
    plate.paste(s2_r, (x2, y2 + 50))
    draw.rectangle([x2, y2 + 50, x2 + target_w, y2 + 50 + target_h], outline="#999999", width=2)

    # Position 3: Bottom Left
    x3, y3 = 35, target_h + 130
    draw.text((x3 + 10, y3 + 10), "Fig 3. Practice Quiz & Auto-Graded Assessment", fill="#000000", font=font)
    plate.paste(s3_r, (x3, y3 + 50))
    draw.rectangle([x3, y3 + 50, x3 + target_w, y3 + 50 + target_h], outline="#999999", width=2)

    # Position 4: Bottom Right
    x4, y4 = target_w + 65, target_h + 130
    draw.text((x4 + 10, y4 + 10), "Fig 4. Verifiable PDF Certificate of Completion", fill="#000000", font=font)
    plate.paste(s4_r, (x4, y4 + 50))
    draw.rectangle([x4, y4 + 50, x4 + target_w, y4 + 50 + target_h], outline="#999999", width=2)

    out_path = 'documentation/screenshots/page13_screenshots_grid.png'
    plate.save(out_path, dpi=(300, 300))
    print(f"Generated {out_path} ({plate_w}x{plate_h})")

if __name__ == '__main__':
    generate_screenshots_plate()
