import { Project } from '@/types';

export const projectsData: Project[] = [
  {
    id: 1,
    title: "TicketBox — Event Ticketing Platform",
    category: "commerce",
    tags: ["TypeScript", "JavaScript", "CSS", "Handlebars", "Docker", "Lua"],
    description: "Full-stack event ticketing and seat reservation platform handling concurrent ticket purchasing workflows and event management.",
    contributions: [
      "Designed and implemented robust seat reservation logic to prevent double-booking using locking mechanisms.",
      "Built server-side templating with Handlebars for SEO-friendly and fast initial page loads.",
      "Containerized the application with Docker to ensure consistent deployment environments."
    ],
    github: "https://github.com/datkrb/TicketBox",
    live: "https://github.com/datkrb/TicketBox",
    colSpan: "bento-col-4"
  },
  {
    id: 2,
    title: "Smart Restaurant — Restaurant Management System",
    category: "saas",
    tags: ["TypeScript", "Docker", "JavaScript", "HTML", "CSS"],
    description: "End-to-end smart restaurant management system encompassing table ordering workflows and kitchen operations.",
    contributions: [
      "Architected the full-stack system allowing real-time order updates between customers and the kitchen.",
      "Implemented role-based access control (RBAC) for restaurant staff and administrators.",
      "Dockerized both frontend and backend services for streamlined CI/CD pipelines."
    ],
    github: "https://github.com/datkrb/Smart-Restaurant",
    live: "https://github.com/datkrb/Smart-Restaurant",
    colSpan: "bento-col-4"
  },
  {
    id: 3,
    title: "Xiangqi — Real-Time Online Chinese Chess",
    category: "realtime",
    tags: ["TypeScript", "Next.js", "React", "CSS", "JavaScript"],
    description: "A full-stack multiplayer Chinese Chess (Xiangqi) web application featuring interactive board UI and move validation.",
    contributions: [
      "Developed the real-time game engine and synchronized player moves using WebSockets.",
      "Implemented strict move validation logic for all Chinese chess pieces.",
      "Built a highly responsive and interactive game board UI with Next.js and React."
    ],
    github: "https://github.com/datkrb/xiang-qi",
    live: "https://github.com/datkrb/xiang-qi",
    colSpan: "bento-col-4"
  },
  {
    id: 4,
    title: "ResFood App — Food Ordering & Restaurant Management",
    category: "mobile",
    tags: ["Kotlin", "Android", "JavaScript"],
    description: "An Android mobile application for food ordering, table booking, and restaurant management, including both a customer app and an admin panel.",
    contributions: [
      "Built native Android interfaces and navigation flows using Kotlin.",
      "Integrated backend APIs for menu browsing, order placement, and table reservations.",
      "Developed a companion admin module for restaurant owners to manage incoming orders."
    ],
    github: "https://github.com/datkrb/ResFood-App",
    live: "https://github.com/datkrb/ResFood-App",
    colSpan: "bento-col-8"
  }
];
