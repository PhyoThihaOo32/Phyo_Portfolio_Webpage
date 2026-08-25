#!/usr/bin/env python3
"""Build Phyo Thiha Oo's one-page, ATS-friendly software engineering resume."""

from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import (
    HRFlowable,
    KeepTogether,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "output" / "pdf" / "Phyo_Thiha_Oo_Resume.pdf"

INK = colors.HexColor("#12212f")
ACCENT = colors.HexColor("#155e75")
MUTED = colors.HexColor("#425466")
RULE = colors.HexColor("#94a3b8")


def p(text, style):
    return Paragraph(text, style)


def section(title, styles):
    return [
        Spacer(1, 4.5),
        p(title.upper(), styles["section"]),
        HRFlowable(width="100%", thickness=0.7, color=ACCENT, spaceBefore=0.5, spaceAfter=2.8),
    ]


def header_row(left, right, styles, space_after=0.5):
    table = Table(
        [[p(left, styles["entry_head"]), p(right, styles["entry_meta"])]],
        colWidths=[5.75 * inch, 1.25 * inch],
        hAlign="LEFT",
    )
    table.setStyle(
        TableStyle(
            [
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 0),
                ("RIGHTPADDING", (0, 0), (-1, -1), 0),
                ("TOPPADDING", (0, 0), (-1, -1), 0),
                ("BOTTOMPADDING", (0, 0), (-1, -1), space_after),
            ]
        )
    )
    return table


def bullets(items, styles):
    return [p(f"&bull; {item}", styles["bullet"]) for item in items]


def build():
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)

    doc = SimpleDocTemplate(
        str(OUTPUT),
        pagesize=letter,
        leftMargin=0.52 * inch,
        rightMargin=0.52 * inch,
        topMargin=0.35 * inch,
        bottomMargin=0.34 * inch,
        title="Phyo Thiha Oo - Software Engineer Resume",
        author="Phyo Thiha Oo",
        subject="Software engineering resume",
    )

    base = getSampleStyleSheet()
    styles = {
        "name": ParagraphStyle(
            "Name",
            parent=base["Normal"],
            fontName="Helvetica-Bold",
            fontSize=20,
            leading=22,
            alignment=TA_CENTER,
            textColor=INK,
            spaceAfter=2,
        ),
        "contact": ParagraphStyle(
            "Contact",
            parent=base["Normal"],
            fontName="Helvetica",
            fontSize=8.2,
            leading=10.2,
            alignment=TA_CENTER,
            textColor=MUTED,
            linkUnderline=True,
        ),
        "section": ParagraphStyle(
            "Section",
            parent=base["Normal"],
            fontName="Helvetica-Bold",
            fontSize=10,
            leading=11,
            textColor=ACCENT,
            letterSpacing=0.7,
        ),
        "entry_head": ParagraphStyle(
            "EntryHead",
            parent=base["Normal"],
            fontName="Helvetica",
            fontSize=9,
            leading=10.3,
            alignment=TA_LEFT,
            textColor=INK,
        ),
        "entry_meta": ParagraphStyle(
            "EntryMeta",
            parent=base["Normal"],
            fontName="Helvetica",
            fontSize=8.4,
            leading=10,
            alignment=TA_RIGHT,
            textColor=MUTED,
        ),
        "bullet": ParagraphStyle(
            "Bullet",
            parent=base["Normal"],
            fontName="Helvetica",
            fontSize=8.4,
            leading=10.35,
            leftIndent=10,
            firstLineIndent=-7,
            textColor=INK,
            spaceAfter=1.35,
        ),
        "compact": ParagraphStyle(
            "Compact",
            parent=base["Normal"],
            fontName="Helvetica",
            fontSize=8.5,
            leading=10.25,
            textColor=INK,
            spaceAfter=1.8,
        ),
        "summary": ParagraphStyle(
            "Summary",
            parent=base["Normal"],
            fontName="Helvetica",
            fontSize=8.7,
            leading=11.1,
            alignment=TA_CENTER,
            textColor=INK,
            leftIndent=18,
            rightIndent=18,
            spaceBefore=4,
            spaceAfter=0.5,
        ),
    }

    story = [
        p("PHYO THIHA OO", styles["name"]),
        p(
            'Queens, NY &nbsp;|&nbsp; <a href="mailto:phyothihaoottp@gmail.com">phyothihaoottp@gmail.com</a>'
            ' &nbsp;|&nbsp; 347-738-8708 &nbsp;|&nbsp; '
            '<a href="https://phyo-portfolio-webpage.onrender.com/">phyo-portfolio-webpage.onrender.com</a>',
            styles["contact"],
        ),
        p(
            '<a href="https://linkedin.com/in/phyothihaoo">linkedin.com/in/phyothihaoo</a>'
            ' &nbsp;|&nbsp; <a href="https://github.com/PhyoThihaOo32">github.com/PhyoThihaOo32</a>',
            styles["contact"],
        ),
        p(
            "Software engineer and 4.0 GPA Computer Science student with experience building internal business tools, "
            "AI safety experiences, full-stack applications, automation frameworks, and C++/Qt desktop software.",
            styles["summary"],
        ),
    ]

    story += section("Education", styles)
    story += [
        header_row(
            "<b>City University of New York, BMCC</b> | A.S. in Computer Science | GPA: <b>4.0</b>",
            "New York, NY<br/>Jan 2025 - Jan 2027",
            styles,
        ),
        header_row(
            "<b>Myanmar Maritime University</b> | B.S. in Nautical Science",
            "Yangon, Myanmar<br/>2010 - 2014",
            styles,
        ),
    ]

    story += section("Experience", styles)
    story.append(
        KeepTogether(
            [
                header_row(
                    "<b>Software Engineering Resident</b> | NYC Tech Talent Pipeline",
                    "New York, NY<br/>Jun 2026 - Present",
                    styles,
                ),
                *bullets(
                    [
                        "Completed a <b>12-week full-stack residency</b> focused on JavaScript, React, Express, PostgreSQL, REST APIs, Git, and Agile delivery.",
                        "Built and deployed <b>3 full-stack applications</b>, including a ranked-choice voting app processing <b>3,000+ sample records</b>, and contributed a JavaScript/Fluent localization fix to Mozilla Firefox.",
                    ],
                    styles,
                ),
            ]
        )
    )
    story.append(
        KeepTogether(
            [
                header_row(
                    "<b>Software Engineer Intern</b> | Universal Processing LLC",
                    "Manhattan, NY<br/>Jun 2026 - Present",
                    styles,
                ),
                *bullets(
                    [
                        "Built and deployed an internal <b>KPI Tracker for 10+ users</b>, centralizing work submissions, KPI scoring, category assignment, and admin review.",
                        "Implemented individual and shared-entry review flows with category assignment, point splitting, validation, and approval.",
                        "Used regression, integration, end-to-end, and user acceptance testing to improve KPI data accuracy and workflow reliability.",
                    ],
                    styles,
                ),
            ]
        )
    )
    story.append(
        KeepTogether(
            [
                header_row(
                    "<b>AI &amp; Education Technology Intern</b> | PYE Education Center",
                    "New York, NY<br/>Jul 2026 - Aug 2026",
                    styles,
                ),
                *bullets(
                    [
                        "Defined child-safe AI guidelines for age-appropriate language, harmful-content prevention, and misuse protection.",
                        "Designed interactive AI lessons and translated supervised user-testing observations into clearer lesson flows, navigation, and experiences for children.",
                    ],
                    styles,
                ),
            ]
        )
    )
    story.append(
        KeepTogether(
            [
                header_row(
                    "<b>AI &amp; Software Innovation Intern</b> | CUNY 2x Tech @ BMCC",
                    "Manhattan, NY<br/>Mar 2026 - May 2026",
                    styles,
                ),
                *bullets(
                    [
                        "Built and deployed an AI-powered resume builder that helped <b>30+ BMCC students</b> strengthen application materials.",
                        "Helped lead an AI and job-search workshop covering resume improvement, job discovery, and application preparation.",
                    ],
                    styles,
                ),
            ]
        )
    )

    story += section("Selected Projects", styles)
    story.append(
        KeepTogether(
            [
                header_row(
                    '<b>SafeYork (Guardian AI)</b> | TypeScript, AI Safety | <a href="https://github.com/PhyoThihaOo32/SafeYork">GitHub</a>',
                    "Apr 2026",
                    styles,
                ),
                *bullets(
                    [
                        "Led a 4-person team to win <b>3rd Place</b> in the Software Coding Track of the CUNY AI Innovation Challenge: Tech for Change.",
                        "Built an AI-powered safety app with SOS alerts, trusted contacts, location sharing, safety timers, and privacy-aware danger classification.",
                    ],
                    styles,
                ),
            ]
        )
    )
    story.append(
        KeepTogether(
            [
                header_row(
                    '<b>MindEase</b> | C++17, Qt 6, Qt Widgets | <a href="https://github.com/PhyoThihaOo32/MindEase">GitHub</a>',
                    "Spring 2026",
                    styles,
                ),
                *bullets(
                    [
                        "Developed a modular desktop wellness platform with journaling, mood tracking, campus resources, self-care tools, and guided support for BMCC students.",
                    ],
                    styles,
                ),
            ]
        )
    )

    story += section("Honors & Leadership", styles)
    story.append(
        p(
            "<b>3rd Place, CUNY AI Innovation Challenge</b> | Student Government Association Representative | "
            "Phi Theta Kappa | Dean's List every semester since Spring 2025",
            styles["compact"],
        )
    )

    story += section("Technical Skills", styles)
    story += [
        p("<b>Languages:</b> C++, Java, JavaScript, TypeScript, Python, SQL, HTML/CSS, PHP", styles["compact"]),
        p("<b>Frameworks &amp; Libraries:</b> React, Vite, Node.js, Express.js, Tailwind CSS, Qt, Qt Widgets", styles["compact"]),
        p("<b>Data &amp; Tools:</b> PostgreSQL, MongoDB, Git, GitHub, Docker, Postman, VS Code, Linux/Unix, Vercel", styles["compact"]),
        p("<b>Concepts:</b> REST APIs, Agile/Scrum, Object-Oriented Programming, Data Structures &amp; Algorithms, Software Testing", styles["compact"]),
    ]

    doc.build(story)
    print(OUTPUT)


if __name__ == "__main__":
    build()
