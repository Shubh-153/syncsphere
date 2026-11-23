/* ==========================================================================
   SyncSphere Realistic Demo Data
   Grounded in INT335 Design Thinking Project P14 ("The Disappearing Roster")
   ========================================================================== */

window.SYNCSPHERE_INITIAL_DATA = {
  persona: "student",
  activeBuddyId: "buddy-aman",
  rebalanced: false,

  tasks: [
    {
      id: "task-101",
      title: "Design 1 Instagram Story Slide",
      club: "Coding & Robotics Club · HackLPU",
      category: "Design",
      duration: 20,
      points: 15,
      dlMinutes: 20,
      level: "Good First Task",
      buddy: "Aman Singh",
      desc: "Create one keynote speaker reveal story using the pre-built HackLPU Canva template and official brand fonts.",
      checklist: [
        "Use the 1080×1920 HackLPU Canva template",
        "Include speaker name, time & Block 34 venue",
        "Export shareable design link with view access"
      ],
      status: "claimed",
      claimedAt: Date.now() - 42 * 60 * 1000,
      proofUrl: "",
      proofNote: ""
    },
    {
      id: "task-102",
      title: "Proofread 2-Page Hackathon Rules Doc",
      club: "Coding & Robotics Club · HackLPU",
      category: "Editorial",
      duration: 15,
      points: 10,
      dlMinutes: 15,
      level: "Beginner Friendly",
      buddy: "Sneha Patel",
      desc: "Check the participant handbook for typos, unclear judging criteria, and broken registration form links.",
      checklist: [
        "Review Section 1–4 for grammar & clarity",
        "Verify all QR & UMS registration links work",
        "Add comments directly in the shared doc"
      ],
      status: "open",
      claimedAt: null,
      proofUrl: "",
      proofNote: ""
    },
    {
      id: "task-103",
      title: "Update Sponsor Logos on Event Page",
      club: "Coding & Robotics Club · HackLPU",
      category: "Tech",
      duration: 25,
      points: 20,
      dlMinutes: 25,
      level: "Good First Task",
      buddy: "Rohan Verma",
      desc: "Swap 3 placeholder PNGs with crisp SVG sponsor logos in the HackLPU landing page repository and open a PR.",
      checklist: [
        "Place 3 SVG files inside /assets/sponsors",
        "Verify mobile responsiveness at 375px width",
        "Paste PR or preview link as proof"
      ],
      status: "open",
      claimedAt: null,
      proofUrl: "",
      proofNote: ""
    },
    {
      id: "task-104",
      title: "Curate 10-Track Lo-Fi Coding Playlist",
      club: "Design & UX Guild",
      category: "Media",
      duration: 15,
      points: 10,
      dlMinutes: 15,
      level: "Beginner Friendly",
      buddy: "Aman Singh",
      desc: "Assemble a clean, non-distracting instrumental playlist for the 24-hour overnight prototyping lounge.",
      checklist: [
        "Minimum 10 copyright-safe instrumental tracks",
        "Set playlist visibility to Public / Unlisted",
        "Share playlist link for sound desk testing"
      ],
      status: "open",
      claimedAt: null,
      proofUrl: "",
      proofNote: ""
    },
    {
      id: "task-105",
      title: "Format Volunteer Check-In Sheet (Block 34)",
      club: "Coding & Robotics Club · HackLPU",
      category: "Logistics",
      duration: 20,
      points: 15,
      dlMinutes: 20,
      level: "Beginner Friendly",
      buddy: "Priya Nair",
      desc: "Clean up 60 volunteer registrations into alphabetical shift blocks (9 AM–12 PM, 12 PM–3 PM) with shift columns.",
      checklist: [
        "Remove duplicate registration entries",
        "Color-code morning vs afternoon shift slots",
        "Share sheet link with edit access"
      ],
      status: "open",
      claimedAt: null,
      proofUrl: "",
      proofNote: ""
    },
    {
      id: "task-106",
      title: "Draft 3 LinkedIn Recap Captions",
      club: "Literary & Debate Society",
      category: "Editorial",
      duration: 20,
      points: 15,
      dlMinutes: 20,
      level: "Good First Task",
      buddy: "Sneha Patel",
      desc: "Write 3 punchy 80-word LinkedIn post drafts highlighting student winners from the Inter-Block Debate finals.",
      checklist: [
        "Include winner names and event hashtags",
        "Keep tone professional and campus-friendly",
        "Submit document link"
      ],
      status: "open",
      claimedAt: null,
      proofUrl: "",
      proofNote: ""
    },
    {
      id: "task-107",
      title: "Create 4 Directional Signage Printables",
      club: "Fine Arts Society",
      category: "Design",
      duration: 30,
      points: 25,
      dlMinutes: 30,
      level: "Intermediate",
      buddy: "Aman Singh",
      desc: "Design A4 high-contrast arrow signs for Shanti Devi Mittal Auditorium entry, registration desk, and refreshment zone.",
      checklist: [
        "Use high-contrast Deep Navy & Orange palette",
        "Export print-ready A4 PDF (300 DPI)",
        "Upload link for Campus Print Hub"
      ],
      status: "open",
      claimedAt: null,
      proofUrl: "",
      proofNote: ""
    },
    {
      id: "task-108",
      title: "Test Auditorium Projector & HDMI Adapter",
      club: "Coding & Robotics Club · HackLPU",
      category: "Logistics",
      duration: 15,
      points: 15,
      dlMinutes: 20,
      level: "Good First Task",
      buddy: "Priya Nair",
      desc: "Run a quick 10-minute AV check with the Block 34 lab attendant and upload a photo confirming slides display cleanly.",
      checklist: [
        "Test USB-C and HDMI cable connectivity",
        "Verify wireless mic battery level",
        "Upload quick confirmation link"
      ],
      status: "open",
      claimedAt: null,
      proofUrl: "",
      proofNote: ""
    },
    {
      id: "task-109",
      title: "Build QR Feedback Form for Closing Slide",
      club: "Design & UX Guild",
      category: "Tech",
      duration: 20,
      points: 15,
      dlMinutes: 20,
      level: "Beginner Friendly",
      buddy: "Rohan Verma",
      desc: "Create a 5-question post-workshop feedback form with auto-generated QR code for the closing slide.",
      checklist: [
        "Add 1–5 rating scale + open improvement field",
        "Enable campus email restriction to prevent spam",
        "Submit form + QR PNG link"
      ],
      status: "open",
      claimedAt: null,
      proofUrl: "",
      proofNote: ""
    }
  ],

  rebalanceTasks: [
    {
      id: "task-rb-1",
      title: "Prepare DSA Duty-Leave Attendance Sheet",
      club: "Coding & Robotics Club · HackLPU",
      category: "Logistics",
      duration: 20,
      points: 20,
      dlMinutes: 25,
      level: "Rebalanced from Lead",
      buddy: "Priya Nair",
      desc: "Export verified contributor names and registration numbers into the standard DSA Duty-Leave Excel template.",
      checklist: [
        "Verify all registration entries are complete",
        "Group students by School / Section",
        "Upload sheet link for Arjun's 1-tap sign-off"
      ],
      status: "open",
      claimedAt: null,
      proofUrl: "",
      proofNote: ""
    },
    {
      id: "task-rb-2",
      title: "Resize 3 Judge Profile Cards for Stage LED",
      club: "Coding & Robotics Club · HackLPU",
      category: "Design",
      duration: 15,
      points: 15,
      dlMinutes: 20,
      level: "Rebalanced from Lead",
      buddy: "Aman Singh",
      desc: "Adapt existing square Instagram judge graphics into 16:9 widescreen slides for the main auditorium LED wall.",
      checklist: [
        "Export 1920×1080 PNG slides",
        "Check text readability from back row",
        "Drop design link in submission"
      ],
      status: "open",
      claimedAt: null,
      proofUrl: "",
      proofNote: ""
    },
    {
      id: "task-rb-3",
      title: "Draft Speaker Thank-You Email Template",
      club: "Coding & Robotics Club · HackLPU",
      category: "Editorial",
      duration: 15,
      points: 15,
      dlMinutes: 15,
      level: "Rebalanced from Lead",
      buddy: "Sneha Patel",
      desc: "Write a warm, professional thank-you email for our 4 industry judges with placeholders for event photos.",
      checklist: [
        "Keep under 150 words",
        "Include club signature & social handle",
        "Submit document link"
      ],
      status: "open",
      claimedAt: null,
      proofUrl: "",
      proofNote: ""
    }
  ],

  pendingApprovals: [
    {
      id: "app-201",
      taskId: "ext-1",
      studentName: "Devansh Kulkarni",
      studentReg: "12219042",
      taskTitle: "Design Volunteer ID Lanyard Print File",
      club: "Coding & Robotics Club · HackLPU",
      duration: 25,
      points: 20,
      dlMinutes: 25,
      proofUrl: "#proof/hacklpu-lanyard-v2",
      note: "Exported with 3mm bleed marks as Aman suggested!",
      submittedAt: "18 mins ago",
      isRiya: false
    },
    {
      id: "app-202",
      taskId: "ext-2",
      studentName: "Meera Joshi",
      studentReg: "12217315",
      taskTitle: "Compile 15 Workshop FAQ Answers",
      club: "Design & UX Guild",
      duration: 20,
      points: 15,
      dlMinutes: 20,
      proofUrl: "#proof/hacklpu-faq-draft",
      note: "Added Wi-Fi, team size, and hostel entry timing FAQs.",
      submittedAt: "42 mins ago",
      isRiya: false
    }
  ],

  verifiedLedger: [
    {
      id: "ver-1",
      title: "Instagram Story Slide — Workshop Teaser",
      club: "Coding & Robotics Club",
      date: "Nov 18, 2026",
      duration: 30,
      dlMinutes: 30,
      points: 20,
      status: "Approved by Arjun"
    },
    {
      id: "ver-2",
      title: "Proofread Tech Fest Participant Rules",
      club: "Coding & Robotics Club",
      date: "Nov 14, 2026",
      duration: 20,
      dlMinutes: 20,
      points: 15,
      status: "Approved by Arjun"
    },
    {
      id: "ver-3",
      title: "Design Figma Wireframe Feedback Summary",
      club: "Design & UX Guild",
      date: "Nov 10, 2026",
      duration: 25,
      dlMinutes: 25,
      points: 15,
      status: "Approved by Aman"
    },
    {
      id: "ver-4",
      title: "Fresher Orientation Check-in QR Sheet",
      club: "Design & UX Guild",
      date: "Nov 05, 2026",
      duration: 20,
      dlMinutes: 20,
      points: 15,
      status: "Approved by Priya"
    }
  ],

  coreTeam: [
    { name: "Arjun Mehta", role: "President", load: 88, tasks: 7, hours: [4, 4, 3, 4, 4, 3, 2] },
    { name: "Kabir Malhotra", role: "DSA & Logistics", load: 79, tasks: 5, hours: [3, 3, 4, 3, 2, 2, 1] },
    { name: "Rohan Verma", role: "Tech Ops", load: 62, tasks: 4, hours: [2, 2, 3, 2, 3, 1, 1] },
    { name: "Aman Singh", role: "Design & Buddies", load: 58, tasks: 4, hours: [2, 3, 2, 2, 2, 2, 1] },
    { name: "Sneha Patel", role: "Editorial Lead", load: 44, tasks: 3, hours: [1, 2, 2, 1, 2, 1, 1] },
    { name: "Priya Nair", role: "Vice President", load: 35, tasks: 2, hours: [1, 1, 2, 1, 1, 1, 1] }
  ],

  buddies: [
    {
      id: "buddy-aman",
      name: "Aman Singh",
      initials: "AS",
      avatarClass: "avatar-orange",
      role: "2nd Year CSE · Design & Media Lead",
      tags: ["Canva", "Figma", "HackLPU Ops"],
      mentored: 14,
      replyTime: "<12m",
      rating: "4.9★",
      bio: "Helps 1st-year students nail their first poster, UI slide, or brand asset without stress."
    },
    {
      id: "buddy-rohan",
      name: "Rohan Verma",
      initials: "RV",
      avatarClass: "avatar-navy",
      role: "3rd Year CSE · Full-Stack & GitHub Lead",
      tags: ["HTML/CSS", "GitHub PRs", "Web Ops"],
      mentored: 19,
      replyTime: "<15m",
      rating: "4.8★",
      bio: "Guides freshers through their first open-source style club PR and event website update."
    },
    {
      id: "buddy-sneha",
      name: "Sneha Patel",
      initials: "SP",
      avatarClass: "avatar-blue",
      role: "2nd Year BBA · Editorial & Content Lead",
      tags: ["Copywriting", "LinkedIn", "Docs"],
      mentored: 11,
      replyTime: "<10m",
      rating: "5.0★",
      bio: "Coaches newcomers on speaker bios, event handbooks, and crisp campus announcements."
    }
  ],

  buddyMessages: [
    {
      sender: "buddy",
      text: "Welcome to SyncSphere, Riya! I'm Aman, your 30-day buddy. Zero pressure here—just ping me whenever you claim a design micro-task.",
      time: "10:15 AM"
    },
    {
      sender: "me",
      text: "Thanks Aman! I just claimed the 20-min Instagram Story Slide task. Where do I find the HackLPU font and logo files?",
      time: "10:18 AM"
    },
    {
      sender: "buddy",
      text: "Awesome first pick! Grab the official brand font pack and transparent logo PNGs in Club Vault → Brand Kit SOP. Send me a screenshot if you want a quick check before submitting!",
      time: "10:20 AM"
    }
  ],

  badges: [
    {
      id: "b1",
      emoji: "🚀",
      name: "First 14-Day Activator",
      desc: "Completed first verified micro-task within 14 days of club induction.",
      earned: true,
      req: "1 Verified Task"
    },
    {
      id: "b2",
      emoji: "🎨",
      name: "Canva & Visual Creator",
      desc: "Delivered approved event design assets with zero revision rounds.",
      earned: true,
      req: "2 Design Tasks"
    },
    {
      id: "b3",
      emoji: "🛡️",
      name: "Zero-Ghost Streak",
      desc: "Maintained active contributor status across 3 consecutive weeks.",
      earned: true,
      req: "3 Weeks Active"
    },
    {
      id: "b4",
      emoji: "🏅",
      name: "DSA Duty-Leave Verified",
      desc: "Logged 90+ verified contribution minutes eligible for attendance proration.",
      earned: true,
      req: "90+ DL Mins"
    },
    {
      id: "b5",
      emoji: "🤝",
      name: "Future Peer Buddy",
      desc: "Unlock at 5 verified micro-tasks to mentor incoming freshers next semester.",
      earned: false,
      req: "5 Verified Tasks"
    },
    {
      id: "b6",
      emoji: "⚡",
      name: "Core Candidate Ready",
      desc: "Complete 6 verified micro-tasks across 2 domains to qualify for Core Team.",
      earned: false,
      req: "6 Verified Tasks"
    }
  ],

  vaultSops: [
    {
      id: "sop-1",
      tag: "Flagship Runbook",
      title: "500-Participant Hackathon Execution Playbook",
      updated: "Updated Nov 2026 by Arjun Mehta",
      summary: "Step-by-step T-30 to T-0 day checklist covering UMS event creation, auditorium booking, judge invites, and overnight shift handover.",
      steps: [
        "T-30 Days: Submit UMS Event Proposal & Faculty Facilitator sign-off.",
        "T-21 Days: Break work into 15+ SyncSphere micro-tasks (10–30 mins each) and assign 2nd-year buddies.",
        "T-14 Days: Lock Shanti Devi Mittal Auditorium / Block 34 labs & confirm AV vendor quote.",
        "T-3 Days: Run projector, HDMI, and Wi-Fi stress test via Logistics micro-task.",
        "T+1 Day: Export SyncSphere Verified Contribution Manifest for instant DSA Duty-Leave approval."
      ]
    },
    {
      id: "sop-2",
      tag: "Brand & Design",
      title: "Official Club Brand Kit & Canva Templates",
      updated: "Updated Nov 2026 by Aman Singh",
      summary: "Color codes (Deep Navy #152238, Vibrant Orange #F97316), typography pairings, logo safe-zones, and ready-to-duplicate Canva links.",
      steps: [
        "Primary Navy: #152238 | Accent Orange: #F97316 | Clean Surface: #F8FAFC.",
        "Headings: Space Grotesk Bold | Body & Captions: Plus Jakarta Sans.",
        "Always include DSA & University organisation seal on official posters.",
        "Export social slides as PNG (1080×1920) and print banners as 300 DPI PDF."
      ]
    },
    {
      id: "sop-3",
      tag: "DSA Admin",
      title: "DSA Duty-Leave & Hall Permission SOP",
      updated: "Updated Oct 2026 by Kabir Malhotra",
      summary: "Exact forms, cabin numbers, and turnaround times for getting rooms, audio clearance, and verified duty-leave approvals without last-minute panic.",
      steps: [
        "Upload event brief on UMS Events portal at least 14 days prior.",
        "Attach SyncSphere pre-filled permission packet before visiting DSA helpdesk.",
        "Only students with verified proof-of-work logs are included in the duty-leave manifest.",
        "Collect faculty facilitator digital sign-off within 48 hours post-event."
      ]
    },
    {
      id: "sop-4",
      tag: "Succession",
      title: "Annual Club Handover & Credential Checklist",
      updated: "Updated Oct 2026 by Priya Nair",
      summary: "Prevents institutional amnesia when 4th-year leads graduate: shared Drive ownership, Canva team access, vendor numbers, and budget ledger.",
      steps: [
        "Transfer shared Drive & Canva Pro team ownership to incoming Vice President.",
        "Audit and verify all 4 campus vendor contacts & rate cards.",
        "Promote top Tier 2 Contributors (6+ verified tasks) into Shadow Core roles.",
        "Archive semester post-mortem and SUS engagement metrics."
      ]
    }
  ],

  vaultVendors: [
    {
      name: "Uni-Mall Print & Flex Studio",
      category: "Banners, Standees & ID Lanyards",
      contact: "Block 15 Basement · Campus Desk 04",
      budget: "₹180 / standee · 4-hr rush turnaround",
      status: "DSA Approved Vendor"
    },
    {
      name: "Phagwara Stage & Pro Audio",
      category: "Wireless Mics, PA System & LED Wall",
      contact: "Near Main Gate · Vendor Booth 12",
      budget: "₹4,500 / full-day package",
      status: "Verified 3x Events"
    },
    {
      name: "Campus Brew & Snack Catering",
      category: "Judge Refreshments & Midnight Tea",
      contact: "Food Court Stall 8 · Event Counter",
      budget: "₹65 / participant box",
      status: "Pre-Negotiated Club Rate"
    },
    {
      name: "CraftEdge Trophies & Swag",
      category: "Acrylic Mementos, Stickers & Tees",
      contact: "Campus Partner Desk · Order Portal",
      budget: "₹240 / custom hoodie · 5-day lead time",
      status: "Verified 2x Events"
    }
  ],

  vaultPipeline: [
    {
      title: "Shanti Devi Mittal Auditorium Slot (HackLPU Opening)",
      owner: "Kabir Malhotra",
      office: "DSA Room 204",
      updated: "Approved Nov 20",
      status: "Approved"
    },
    {
      title: "Block 34 Labs (301–304) Overnight Access",
      owner: "Arjun Mehta",
      office: "School of CSE HOD",
      updated: "Approved Nov 21",
      status: "Approved"
    },
    {
      title: "Duty-Leave Pre-Approval Manifest (38 Active Contributors)",
      owner: "Priya Nair",
      office: "DSA Helpdesk · UMS Sync",
      updated: "In Review · Est. 24h",
      status: "In Review"
    },
    {
      title: "Stage Sound & External Vendor Gate Pass",
      owner: "Rohan Verma",
      office: "Campus Security Office",
      updated: "Ready to Submit",
      status: "Pending"
    }
  ]
};
