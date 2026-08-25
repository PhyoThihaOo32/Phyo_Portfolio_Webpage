// Portfolio content for Phyo Thiha Oo.
// Keep professional facts here so the page, metadata, and generated UI stay consistent.
window.PORTFOLIO = {
  profile: {
    name: "Phyo Thiha Oo",
    role: "Software Engineer",
    location: "Queens, NY",
    email: "phyothihaoottp@gmail.com",
    phone: "",
    website: "https://phyo-portfolio-webpage.onrender.com/",
    heroLead: "Building software that makes",
    heroAccent: "complex work feel simple.",
    summary:
      "I build practical full-stack, AI, automation, and desktop products with a focus on reliability, clear workflows, and real users.",
    headshot: "assets/avatar.svg",
    resume: "assets/resume.pdf",
    social: {
      github: "https://github.com/PhyoThihaOo32",
      linkedin: "https://www.linkedin.com/in/phyothihaoo"
    }
  },

  contact: {
    endpoint: "https://formsubmit.co/ajax/phyothihaoottp@gmail.com",
    subjectPrefix: "Portfolio message"
  },

  about: {
    background: [
      "Computer Science student at BMCC with a 4.0 GPA.",
      "Software engineering experience across fintech, education, AI safety, and internal tools.",
      "Former merchant marine officer who brings calm execution and operational discipline to engineering teams.",
      "Based in Queens, New York, and focused on building software that solves concrete problems."
    ],
    focus: [
      "Full-stack products with React, Node.js, and PostgreSQL",
      "AI-assisted workflows and responsible AI experiences",
      "C++ desktop applications with Qt",
      "Automation, testing, and reliable delivery"
    ],
    highlights: [
      "3rd Place - CUNY AI Innovation Challenge: Tech for Change",
      "Built an internal KPI platform serving 10+ users",
      "Created an AI resume builder used by 30+ BMCC students",
      "Dean's List every semester since Spring 2025"
    ]
  },

  skills: [
    {
      category: "Languages",
      items: ["C++", "JavaScript", "TypeScript", "Python", "Java", "SQL"].map(label => ({ label }))
    },
    {
      category: "Frameworks & UI",
      items: ["React", "Vite", "Node.js", "Express.js", "Qt", "Qt Widgets"].map(label => ({ label }))
    },
    {
      category: "Data & Delivery",
      items: ["PostgreSQL", "MongoDB", "Git", "Docker", "Postman", "Linux/Unix"].map(label => ({ label }))
    }
  ],

  projects: [
    {
      repoName: "SafeYork",
      name: "SafeYork (Guardian AI)",
      year: "2026",
      summary: "AI-powered personal safety app with one-tap and voice-triggered alerts, trusted contacts, live location sharing, safety timers, and privacy-aware danger classification.",
      tags: ["TypeScript", "AI Safety", "Product Design"],
      links: {
        repo: "https://github.com/PhyoThihaOo32/SafeYork"
      },
      featured: true
    },
    {
      repoName: "MindEase",
      name: "MindEase",
      year: "2026",
      summary: "C++17 and Qt 6 desktop wellness platform for BMCC students, combining campus resources, a private journal, mood tools, and guided support in a modular interface.",
      tags: ["C++", "Qt 6", "Desktop"],
      links: {
        demo: "https://mindease-demo.vercel.app/",
        repo: "https://github.com/PhyoThihaOo32/MindEase"
      },
      featured: true
    },
    {
      repoName: "code-memory-visualizer",
      name: "Code Memory Visualizer",
      year: "2026",
      summary: "Interactive browser tool that visualizes memory and execution step by step for Python, C++, and Java, with Python execution powered by Pyodide and WebAssembly.",
      tags: ["TypeScript", "Pyodide", "Education"],
      links: {
        demo: "https://code-memory-visualizer.vercel.app",
        repo: "https://github.com/PhyoThihaOo32/code-memory-visualizer"
      },
      featured: true
    },
    {
      repoName: "LogicDiagramAI",
      name: "LogicDiagramAI",
      year: "2026",
      summary: "AI-assisted digital logic circuit generator that turns written requirements into circuit designs and connects them with CircuitVerse for simulation.",
      tags: ["JavaScript", "AI", "CircuitVerse"],
      links: {
        repo: "https://github.com/PhyoThihaOo32/LogicDiagramAI"
      }
    },
    {
      repoName: "pathFinder_project",
      name: "PathFinder QA Framework",
      year: "2026",
      summary: "Behavior-driven UI automation framework covering a complete e-commerce flow with Selenium 4, Cucumber, TestNG, reusable page objects, and headless CI runs.",
      tags: ["Java", "Selenium", "Cucumber", "TestNG"],
      links: {
        repo: "https://github.com/PhyoThihaOo32/pathFinder_project"
      },
      image: "assets/projects/test-automation.svg"
    },
    {
      repoName: "Phyo_Portfolio_Webpage",
      name: "Personal Portfolio",
      year: "2026",
      summary: "Responsive, multi-theme portfolio built without a framework, with accessible navigation, project filtering, PWA support, gallery experiences, and custom interactive canvas features.",
      tags: ["JavaScript", "CSS", "PWA"],
      links: {
        demo: "https://phyo-portfolio-webpage.onrender.com/",
        repo: "https://github.com/PhyoThihaOo32/Phyo_Portfolio_Webpage"
      },
      image: "assets/projects/web-development.svg"
    }
  ],

  projectOverrides: {},

  passions: [
    "Astronomy",
    "Music",
    "Guitar",
    "Hiking",
    "Travel",
    "Art",
    "Poetry",
    "Gaming",
    "Stargazing",
    "Family",
    "Empathy",
    "Adventure"
  ],

  music: {
    applePlaylistUrl: "",
    country: "us",
    defaultLofi: "https://music.apple.com/us/playlist/lofi-chill/pl.6d0f5509eb7e4dfabe59cb2bdb9fee9f",
    presets: [
      { label: "Lofi Chill", url: "https://music.apple.com/us/playlist/lofi-chill/pl.6d0f5509eb7e4dfabe59cb2bdb9fee9f" },
      { label: "Lo-Fi Jazz", url: "https://music.apple.com/us/playlist/lo-fi-jazz/pl.70b7e5b2e0e2412a8b8dd3b3d8a3c0ab" },
      { label: "Chill Beats", url: "https://music.apple.com/us/playlist/chill-beats/pl.70ee3e4a1a6b4d4da26c3bdcdceefb2a" }
    ],
    externalEmbedUrl: "https://www.lofi.cafe/"
  },

  gallery: [],
  remoteGallery: {
    enabled: true,
    source: "met",
    query: "*",
    departmentId: 11
  },

  experience: [
    {
      company: "Universal Processing LLC",
      role: "Software Engineer Intern",
      start: "Jun 2026",
      end: "Present",
      location: "Manhattan, NY",
      summary: "Build and improve internal software used by marketing staff and administrators.",
      highlights: [
        "Built and deployed an internal KPI Tracker for 10+ users, centralizing submissions, scoring, category assignment, and admin review",
        "Implemented individual and shared-entry review flows with category assignment, point splitting, validation, and approval",
        "Used regression, integration, end-to-end, and user acceptance testing to improve data accuracy and workflow reliability"
      ]
    },
    {
      company: "PYE Education Center",
      role: "AI & Education Technology Intern",
      start: "Jul 2026",
      end: "Aug 2026",
      location: "New York, NY",
      summary: "Designed child-safe AI learning experiences and improved them through supervised user testing.",
      highlights: [
        "Defined guidelines for age-appropriate language, harmful-content prevention, and misuse protection",
        "Designed interactive AI lessons and translated observed confusion points into clearer flows and navigation"
      ]
    },
    {
      company: "CUNY 2x Tech @ BMCC",
      role: "AI & Software Innovation Intern",
      start: "Mar 2026",
      end: "May 2026",
      location: "Manhattan, NY",
      summary: "Built career-readiness tools and supported practical AI learning for BMCC students.",
      highlights: [
        "Built and deployed an AI-powered resume builder that helped 30+ BMCC students improve application materials",
        "Helped lead an AI and job-search workshop focused on resume improvement, job discovery, and applications"
      ]
    }
  ],

  education: [
    {
      school: "Borough of Manhattan Community College (CUNY)",
      degree: "A.S. in Computer Science",
      gpa: "4.0",
      start: "Jan 2025",
      end: "Jan 2027",
      location: "New York, NY"
    },
    {
      school: "Myanmar Maritime University",
      degree: "B.S. in Nautical Science",
      gpa: "",
      start: "2010",
      end: "2014",
      location: "Yangon, Myanmar"
    }
  ],

  achievements: [],
  preferences: { theme: "dark" },
  integrations: { githubSync: false, githubToken: "" }
};
