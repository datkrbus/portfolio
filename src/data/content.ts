import { SkillCategoryData } from '@/types';

export const heroData = {
  tagline: "Available for Software Engineer Internships 2026",
  titlePart1: "Hi, I'm ",
  titleHighlight: "Nguyen Ha Dat",
  titlePart2: ".",
  description: "A Software Engineering student at HCMUS - VNU, eager to build end-to-end applications with high-quality user experiences and explore how things work under the hood.",
  primaryButton: "View My Projects",
  secondaryButton: "Download My CV",
  cvLink: "/CV.pdf", // Đặt file CV vào thư mục public/ với tên CV_Nguyen Ha Dat.pdf
  codeWindow: {
    title: "datkrb_profile.ts",
    comment: "// Software Engineer Intern — Verified GitHub Data",
    name: "Nguyen Ha Dat",
    handle: "@datkrb",
    role: "Software Engineer Intern",
    stack: ["TypeScript", "Kotlin", "Docker", "JavaScript"],
    repos: [
      "xiang-qi",
      "Smart-Restaurant",
      "TicketBox",
      "ResFood-App"
    ],
    availability: "Open for Internship 2026"
  }
};

export const aboutData = {
  tagline: "About Me",

  // ====== THÔNG TIN CÁ NHÂN — Sửa ở đây ======
  name: "Nguyen Ha Dat" ,
  avatar: "/avatar.jpg", // Đặt ảnh đại diện vào thư mục public/ với tên avatar.jpg
  role: "Full-Stack Software Engineer",
  location: "Ho Chi Minh City, Vietnam",
  availability: "Open for Internship 2026",

  // ====== GIỚI THIỆU KỸ THUẬT — Sửa ở đây ======
  bio: "I've worked with Node.js, Express, NestJS, and TypeScript to build RESTful APIs, real-time features with WebSockets, and handled challenges like concurrency control with locking mechanisms. I'm comfortable with PostgreSQL, MongoDB, Redis, and Docker for containerized deployments.",
  bioExtra: "On the frontend, I build responsive interfaces using React and Next.js. I also have experience developing a native Android app with Kotlin, giving me a broader perspective on how users interact with software across platforms.",
  bioThird: "Currently, I'm diving deeper into design systems, DevOps practices, and CI/CD pipelines — always looking to improve my workflow and grow as an engineer.",

  // ====== SỐ LIỆU NỔI BẬT — Sửa ở đây ======
  stats: [
    { value: "4+", label: "Projects Built" },
    { value: "2+", label: "Years Coding" },
    { value: "6+", label: "Technologies" },
    { value: "3.43", label: "GPA / 4.0" },
  ],

  // ====== LIÊN KẾT MẠNG XÃ HỘI — Sửa ở đây ======
  socials: [
    { platform: "GitHub", url: "https://github.com/datkrb", icon: "github" },
    { platform: "LinkedIn", url: "https://www.linkedin.com/in/nhdat205/", icon: "linkedin" },
    { platform: "Email", url: "mailto:nguyenhadatkrb2k5@gmail.com", icon: "email" },
  ],

  // ====== ĐIỂM NỔI BẬT — Sửa ở đây ======
  highlights: [
    { icon: "🎓", text: "B.S. Software Engineering — HCMUS" },
    { icon: "💻", text: "Backend & Frontend Web Development" },
    { icon: "🐳", text: "Docker & DevOps Practice" },
    { icon: "🌐", text: "English: TOEIC 765" },
  ],
};

export const projectsSectionData = {
  tagline: "GitHub Repositories (@datkrb)",
  title: "Featured Projects",
  description: "A showcase of my full-stack web and mobile applications."
};

export const skillsData = {
  tagline: "Skills & Ecosystem",
  title: "Professional Skills",
  categories: [
    {
      title: "Programming Languages",
      icon: "💻",
      skills: ["Javascript/Typescript", "C++", "Python"],
      familiar: ["C#", "Java", "Kotlin"]
    },
    {
      title: "Frontend ",
      icon: "💻",
      skills: ["React / Next.js", "HTML5 & CSS3", "TailwindCSS"],
      familiar: []
    },
    {
      title: "Backend & Database",
      icon: "⚙️",
      skills: ["Node.js", "Express", "NestJS", "Prisma","JWT","Restful API", "Redis", "Socket.io", "SQL(MySQL/PostgreSQL)"],
      familiar: ["NoSQL(MongoDB)", "Firebase", "SpringBoot", "RabbitMQ"]
    },
    {
      title: "Tools & Workflow",
      icon: "🛠️",
      skills: ["Git / GitHub ", "Docker", "Postman API Testing", "Vite / Vercel", "WSL"],
    },
    {
      title: "Soft Skills",
      icon: "🤝",
      skills: ["Problem Solving", "Team Collaboration", "Agile/Scrum", "Time Management", "English Communication"],
    },
  ] as SkillCategoryData[]
};

export const educationData = {
  tagline: "Academic Background",
  title: "Education & Certificates",
  degree: "B.S. in Software Engineering",
  university: "University of Science - HCMUS",
  period: "2022 — 2027 (Expected Graduation)",
  achievements: [
    "GPA: 3.43/4.0 (8.1/10)",
  ]
};

export const certificatesData = {
  tagline: "Certificates",
  title: "Certificates",
  certificates: [
    {
      title: "Toeic 765 LR",
      date: "May 2026",
      description: "Achieved a score of 765/990, demonstrating professional working proficiency in English."
    },
  ]
};

export const contactData = {
  tagline: "Internship Contact",
  title: "Let's Connect & Discuss Opportunities.",
  description: "Looking for a Full-Stack Web Developer Intern skilled in JavaScript, TypeScript, React, Next.js, and Node.js? Get in touch with me directly.",
  emailLabel: "Direct Email Address:",
  email: "nguyenhadatkrb2k5@gmail.com",
  copySuccess: "Email Copied!",
  copyDefault: "Copy Email Address",
  form: {
    nameLabel: "Company Name / Recruiter Name",
    namePlaceholder: "Tech Company / HR Manager",
    emailLabel: "Contact Email",
    emailPlaceholder: "hr@company.com",
    messageLabel: "Internship Opportunity / Inquiry Details",
    messagePlaceholder: "Briefly describe the internship position or schedule an interview...",
    submitDefault: "Send Internship Message",
    submitLoading: "Sending Message...",
    submitSuccess: "Message Sent! ✓",
    successMessage: "Thank you! Your message has been routed to Dat Nguyen."
  }
};

export const navbarData = {
  logoInitials: "Đ",
  logoName: "Dat",
  links: [
    { href: "#about", label: "About Me" },
    { href: "#projects", label: "Projects" },
    { href: "#skills", label: "Skills" },
    { href: "#education", label: "Education" },
    { href: "#contact", label: "Contact" }
  ],
  githubText: "GitHub @datkrb"
};

export const footerData = {
  title: "Nguyen Ha Dat",
  copyright: "© 2026 Nguyen Ha Dat.",
  githubLinkText: "GitHub @datkrb"
};
