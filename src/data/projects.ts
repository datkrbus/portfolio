import { Project } from '@/types';

export const projectsData: Project[] = [
  {
    id: 1,
    title: "TicketBox — Event Ticketing Platform",
    category: "commerce",
    tags: ["Next.js", "NestJS", "PostgreSQL", "Redis", "BullMQ", "React Native"],
    description: "An Event-Driven Modular Monolith ticketing system handling high concurrency and offline-first mobile check-ins.",
    contributions: [
      "Designed an Event-Driven Modular Monolith architecture handling peak traffic of 80K reqs/5mins using Redis Rate Limiting.",
      "Prevented ticket over-selling (race conditions) during peak times by implementing Pessimistic Locking on PostgreSQL.",
      "Ensured payment data integrity and prevented double-charging by implementing Idempotency Keys.",
      "Improved system resilience by integrating a Circuit Breaker pattern for third-party payment gateways (VNPAY/MoMo).",
      "Offloaded heavy tasks (email sending, CSV imports, payments) to background workers using BullMQ, keeping API latency <100ms."
    ],
    github: "https://github.com/datkrb/TicketBox",
    live: "https://github.com/datkrb/TicketBox",
    colSpan: "bento-col-4"
  },
  {
    id: 2,
    title: "Smart Restaurant — Restaurant Management System",
    category: "saas",
    tags: ["Next.js", "Express", "PostgreSQL", "Prisma", "Socket.IO", "Stripe"],
    description: "A QR-based dine-in menu ordering system that digitizes menus and streamlines kitchen workflows with real-time tracking.",
    contributions: [
      "Architected a single-page application integrating QR code menu ordering.",
      "Implemented a real-time Kitchen Display System (KDS) using Socket.IO.",
      "Integrated Stripe for seamless payments and implemented role-based access control (RBAC)."
    ],
    github: "https://github.com/datkrb/Smart-Restaurant",
    live: "https://github.com/datkrb/Smart-Restaurant",
    colSpan: "bento-col-4"
  },
  {
    id: 3,
    title: "Xiangqi — Real-Time Online Chinese Chess",
    category: "realtime",
    tags: ["React", "Express", "TypeScript", "Socket.io", "PostgreSQL", "TailwindCSS"],
    description: "A multiplayer Chinese Chess game featuring real-time gameplay, AI opponents, user authentication, and an ELO rating system.",
    contributions: [
      "Developed a real-time game engine and synchronized player moves using WebSockets.",
      "Built a secure authentication system (JWT) and an ELO rating system for matchmaking.",
      "Designed a feature-sliced React frontend integrated with intelligent AI opponents."
    ],
    github: "https://github.com/datkrb/xiang-qi",
    live: "https://github.com/datkrb/xiang-qi",
    colSpan: "bento-col-4"
  },
  {
    id: 4,
    title: "ResFood App — Food Ordering & Restaurant Management",
    category: "mobile",
    tags: ["Kotlin", "Jetpack Compose", "Firebase", "Node.js", "MVVM"],
    description: "A native Android application for food ordering and restaurant management, built with Kotlin, Jetpack Compose, and Firebase.",
    contributions: [
      "Built native UI and navigation using Kotlin Jetpack Compose and MVVM architecture.",
      "Integrated Firebase for real-time data synchronization, authentication, and push notifications.",
      "Developed a Node.js backend to process and verify SePay QR payments via webhooks."
    ],
    github: "https://github.com/datkrb/ResFood-App",
    live: "https://github.com/datkrb/ResFood-App",
    colSpan: "bento-col-8"
  }
];
