'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, MessageSquare, X, CheckCircle, ChevronRight, Zap } from 'lucide-react';

// Types
type Message = {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  isDisclaimer?: boolean;
};

// --- DATA ---
const INITIAL_MESSAGE: Message = {
  id: 'init-1',
  text: "Hi 👋, I am Bytechsol AI. How can I help you today? Please select one of the options below.",
  sender: 'bot',
  timestamp: new Date(),
};

const QUICK_ACTIONS = [
  "Web & ERP Service",
  "Design & Development",
  "E-Commerce",
  "Marketing",
  "Odoo Services",
  "Get a Quote"
];

// Knowledge Base
const KNOWLEDGE_BASE = [
  { "question": "what is bytechsol?", "answer": "Bytechsol is a software house that provides cutting-edge web development, chatbot integration, and digital solutions tailored for your business." },
  { "question": "what services does bytechsol offer?", "answer": "We offer web development, custom software solutions, chatbot creation, UI/UX design, and e-commerce development." },
  { "question": "how can I contact bytechsol?", "answer": "You can reach us at contact@bytechsol.com or through our contact page on bytechsol.com." },
  { "question": "do you offer project-based pricing?", "answer": "Yes, we offer both hourly and project-based pricing depending on your needs." },
  { "question": "do you build mobile apps?", "answer": "We currently focus on responsive web applications, but mobile app development is part of our future roadmap." },
  { "question": "can I request a custom chatbot?", "answer": "Absolutely! We specialize in building custom AI-powered chatbots tailored to your business requirements." },
  { "question": "how experienced is bytechsol?", "answer": "Our team has experience working with a range of technologies and has delivered quality software solutions for clients locally and internationally." },
  { "question": "what technologies do you use?", "answer": "We work with modern web technologies like React, Node.js, Django, Python, PHP, and more depending on project requirements." },
  { "question": "do you offer website maintenance?", "answer": "Yes, we offer ongoing support and maintenance services for all our clients." },
  { "question": "What services do you provide?", "answer": "We provide a range of services including Custom Website Solutions, ERP Deployment, Brand Building, E-Commerce Setup, Social Media Marketing, PPC (Pay Per Click), AI/ML, API Integration & Creations." },
  { "question": "Do you offer custom website solutions?", "answer": "Yes, we specialize in developing custom website solutions tailored to your business needs." },
  { "question": "Can you help with ERP deployment?", "answer": "Yes, we provide ERP deployment services to streamline and optimize your business processes." },
  { "question": "Do you offer brand building services?", "answer": "Yes, we help businesses grow with strong brand building strategies." },
  { "question": "What is included in your e-commerce setup services?", "answer": "Our e-commerce setup includes website development, payment gateway integration, product management, and more." },
  { "question": "Do you provide social media marketing services?", "answer": "Yes, we offer complete social media marketing services to grow your online presence." },
  { "question": "What is PPC and do you offer it?", "answer": "PPC stands for Pay Per Click. Yes, we manage PPC campaigns to help you get more leads and traffic." },
  { "question": "Do you work with AI and ML technologies?", "answer": "Yes, we provide solutions using Artificial Intelligence and Machine Learning to automate and improve processes." },
  { "question": "Can you do API integration and creation?", "answer": "Yes, we specialize in creating and integrating APIs for seamless software communication." },
  { "question": "how do i get started?", "answer": "Share your requirements (goals, features, timeline, budget) at contact@bytechsol.com or WhatsApp +92 309 229 0559. We’ll suggest scope and a quote." },
  { "question": "what’s your project process?", "answer": "Discovery → Proposal → Design (Figma) → Development → QA/UAT → Launch → Warranty/Support." },
  { "question": "how long does a website take?", "answer": "Typically 2–6 weeks depending on pages, features, and integrations." },
  { "question": "can you work on urgent timelines?", "answer": "Yes, we do rush projects where feasible; a rush fee may apply." },
  { "question": "how do you price projects?", "answer": "Fixed price for defined scope or hourly for ongoing work. Milestone-based payments." },
  { "question": "what is the payment schedule?", "answer": "Commonly 40% upfront, 40% after dev, 20% on delivery. Flexible per project." },
  { "question": "do you sign nda?", "answer": "Yes, we’re happy to sign an NDA before sharing sensitive info." },
  { "question": "do i own the source code?", "answer": "Yes, you own the final deliverables and source code after full payment." },
  { "question": "how do we communicate during the project?", "answer": "We use email/WhatsApp and optionally Slack. Weekly updates and demo links." },
  { "question": "which project management tools do you use?", "answer": "Jira, Trello, or ClickUp—your choice." },
  { "question": "do you provide hosting and domain?", "answer": "We can recommend and set up hosting (Vercel/AWS) and help with domain/DNS." },
  { "question": "will you deploy the project?", "answer": "Yes, we handle staging/production deployment and CI/CD setup where required." },
  { "question": "what cms do you use?", "answer": "Headless CMS (Strapi/Sanity) or WordPress, based on your needs." },
  { "question": "do you build on wordpress?", "answer": "Yes, when it’s the right fit; for apps we usually prefer Next.js/React." },
  { "question": "do you optimize performance?", "answer": "Yes, we target 90+ Lighthouse scores and pass Core Web Vitals where feasible." },
  { "question": "is seo included?", "answer": "On-page SEO basics: meta, sitemap, robots, schema, clean URLs, and speed best practices." },
  { "question": "do you follow accessibility standards?", "answer": "We follow WCAG best practices where applicable." },
  { "question": "what security practices do you follow?", "answer": "HTTPS, secure headers, input validation, RBAC, least-privilege, and audit logging as needed." },
  { "question": "do you set up backups?", "answer": "Yes, automated backups and rollback strategy on request." },
  { "question": "do you provide training?", "answer": "Yes, handover training with a short guide or walkthrough video." },
  { "question": "do you provide maintenance?", "answer": "Yes, monthly maintenance and SLA support plans are available." },
  { "question": "is there a bug-fix warranty?", "answer": "30-day post-launch bug-fix warranty. Extended support via SLA." },
  { "question": "what are your support hours?", "answer": "Mon–Sat, 10am–7pm PKT. Urgent support by arrangement." },
  { "question": "can you work in our timezone?", "answer": "Yes, we can align overlapping hours for standups and demos." },
  { "question": "do you write content?", "answer": "We can provide basic copy or collaborate with your content team." },
  { "question": "do you provide images?", "answer": "We can source licensed stock images/icons or use your brand assets." },
  { "question": "do you build multilingual sites?", "answer": "Yes, we support i18n with language switchers and SEO best practices." },
  { "question": "which e-commerce platforms do you support?", "answer": "Shopify (preferred), WooCommerce, or custom Next.js headless stores." },
  { "question": "what payments do you integrate?", "answer": "Stripe, PayPal, local gateways, and Cash on Delivery where applicable." },
  { "question": "can you integrate shipping and taxes?", "answer": "Yes, zones/rates, tax rules, and courier APIs." },
  { "question": "do you set up analytics and pixels?", "answer": "Yes, GA4, GTM, Meta/TikTok Pixels, and server-side conversions if needed." },
  { "question": "do you support abandoned cart flows?", "answer": "Yes, via Klaviyo/Mailchimp and platform-native automations." },
  { "question": "can you sync inventory with erp?", "answer": "Yes, real-time/near-real-time sync with Odoo or other ERPs." },
  { "question": "which odoo modules do you implement?", "answer": "Sales, Purchase, Inventory, Accounting, MRP, CRM, Website/e-Com, HR, and more." },
  { "question": "can you migrate data into odoo?", "answer": "Yes, CSV/Excel imports and legacy system migrations with validation." },
  { "question": "do you localize accounting and taxes?", "answer": "Yes, we configure localization (PK/US/UK) and tax rules per your region." },
  { "question": "do you build custom odoo reports?", "answer": "Yes, custom KPIs, dashboards, and PDF reports." },
  { "question": "do you train staff on odoo?", "answer": "Yes, role-based training and SOP documentation." },
  { "question": "can you train a chatbot on our documents?", "answer": "Yes, we build retrieval-augmented bots using your PDFs, URLs, or knowledge base." },
  { "question": "do you integrate whatsapp chatbots?", "answer": "Yes, WhatsApp Business API integration with human handoff and CRM tickets." },
  { "question": "can the bot support multiple languages?", "answer": "Yes, multi-language support with detection and fallback." },
  { "question": "do you provide chatbot analytics?", "answer": "Yes, conversation stats, lead capture, and satisfaction tracking." },
  { "question": "how does human handoff work?", "answer": "On triggers/keywords, bot creates a ticket or alerts your team via email/Slack/CRM." },
  { "question": "which apis do you integrate?", "answer": "QuickBooks Online, Shopify, payment gateways, shipping couriers, CRMs, and custom REST/GraphQL." },
  { "question": "do you handle webhooks and rate limits?", "answer": "Yes—idempotent handlers, retries/backoff, and signature verification." },
  { "question": "do you provide api documentation?", "answer": "Yes, OpenAPI/Swagger docs and Postman collections." },
  { "question": "can you expose an api for our app?", "answer": "Yes, secure REST/GraphQL APIs with JWT/OAuth2 and RBAC." },
  { "question": "will you show work in progress?", "answer": "Yes, staging links and milestone demos throughout the project." },
  { "question": "can you redesign an existing website?", "answer": "Yes, we can refresh UI/UX and migrate content safely." },
  { "question": "do you do mobile app development?", "answer": "We focus on responsive web apps; native apps can be scoped separately." },
  { "question": "can you integrate our crm or email tools?", "answer": "Yes, HubSpot, Pipedrive, Zoho, Mailchimp/Klaviyo, and others." },
  { "question": "what industries do you serve?", "answer": "E-commerce, services, manufacturing, logistics, education, healthcare, and startups." },
  { "question": "how do we share credentials securely?", "answer": "Use password managers or one-time links; we store secrets securely." },
  { "question": "do you comply with gdpr?", "answer": "We follow privacy best practices; formal compliance can be scoped if required." },
  { "question": "what happens after launch?", "answer": "Warranty period for fixes, optional maintenance/SLA, and a roadmap if needed." },
  { "question": "can you provide portfolio or references?", "answer": "Yes, we can share relevant examples on request." },
  { "question": "how do i request a quote?", "answer": "Email contact@bytechsol.com or WhatsApp +92 309 229 0559 with your scope and timeline." },
  { "question": "hi", "answer": "Hello! I’m Bytechsol Virtual Assistant. How can I help today? Choose a category or type your question. WhatsApp +92 309 229 0559 • contact@bytechsol.com." },
  { "question": "hello", "answer": "Hello! I’m Bytechsol Virtual Assistant. How can I help today? Choose a category or type your question. WhatsApp +92 309 229 0559 • contact@bytechsol.com." },
  { "question": "hey", "answer": "Hello! I’m Bytechsol Virtual Assistant. How can I help today? Choose a category or type your question. WhatsApp +92 309 229 0559 • contact@bytechsol.com." },
  { "question": "yo", "answer": "Hello! I’m Bytechsol Virtual Assistant. How can I help today? Choose a category or type your question. WhatsApp +92 309 229 0559 • contact@bytechsol.com." },
  { "question": "sup", "answer": "Hello! I’m Bytechsol Virtual Assistant. How can I help today? Choose a category or type your question. WhatsApp +92 309 229 0559 • contact@bytechsol.com." },
  { "question": "what's up", "answer": "Hello! I’m Bytechsol Virtual Assistant. How can I help today? Choose a category or type your question. WhatsApp +92 309 229 0559 • contact@bytechsol.com." },
  { "question": "whats up", "answer": "Hello! I’m Bytechsol Virtual Assistant. How can I help today? Choose a category or type your question. WhatsApp +92 309 229 0559 • contact@bytechsol.com." },
  { "question": "wassup", "answer": "Hello! I’m Bytechsol Virtual Assistant. How can I help today? Choose a category or type your question. WhatsApp +92 309 229 0559 • contact@bytechsol.com." },
  { "question": "hi there", "answer": "Hello there! I’m Bytechsol Virtual Assistant. How can I help today? Pick a category or type your question. WhatsApp +92 309 229 0559 • contact@bytechsol.com." },
  { "question": "hello there", "answer": "Hello there! I’m Bytechsol Virtual Assistant. How can I help today? Pick a category or type your question. WhatsApp +92 309 229 0559 • contact@bytechsol.com." },
  { "question": "hey there", "answer": "Hello there! I’m Bytechsol Virtual Assistant. How can I help today? Pick a category or type your question. WhatsApp +92 309 229 0559 • contact@bytechsol.com." },
  { "question": "hiya", "answer": "Hiya! How can I help today? Pick a category or type your question. WhatsApp +92 309 229 0559 • contact@bytechsol.com." },
  { "question": "howdy", "answer": "Howdy! How can I help today? Pick a category or type your question. WhatsApp +92 309 229 0559 • contact@bytechsol.com." },
  { "question": "good morning", "answer": "Good morning! How can I help today? Pick a category or type your question. WhatsApp +92 309 229 0559 • contact@bytechsol.com." },
  { "question": "gm", "answer": "Good morning! How can I help today? Pick a category or type your question. WhatsApp +92 309 229 0559 • contact@bytechsol.com." },
  { "question": "good afternoon", "answer": "Good afternoon! How can I help today? Pick a category or type your question. WhatsApp +92 309 229 0559 • contact@bytechsol.com." },
  { "question": "ga", "answer": "Good afternoon! How can I help today? Pick a category or type your question. WhatsApp +92 309 229 0559 • contact@bytechsol.com." },
  { "question": "good evening", "answer": "Good evening! How can I help today? Pick a category or type your question. WhatsApp +92 309 229 0559 • contact@bytechsol.com." },
  { "question": "ge", "answer": "Good evening! How can I help today? Pick a category or type your question. WhatsApp +92 309 229 0559 • contact@bytechsol.com." },
  { "question": "good night", "answer": "Good night! Need quick help before you go? Tell me your query or pick a category. WhatsApp +92 309 229 0559 • contact@bytechsol.com." },
  { "question": "gn", "answer": "Good night! Need quick help before you go? Tell me your query or pick a category. WhatsApp +92 309 229 0559 • contact@bytechsol.com." },
  { "question": "morning", "answer": "Good morning! How can I help today? Pick a category or type your question. WhatsApp +92 309 229 0559 • contact@bytechsol.com." },
  { "question": "evening", "answer": "Good evening! How can I help today? Pick a category or type your question. WhatsApp +92 309 229 0559 • contact@bytechsol.com." },
  { "question": "👋", "answer": "Hello! I’m Bytechsol Virtual Assistant. How can I help today? Pick a category to begin. WhatsApp +92 309 229 0559 • contact@bytechsol.com." },
  { "question": "✋", "answer": "Hello! I’m Bytechsol Virtual Assistant. How can I help today? Pick a category to begin. WhatsApp +92 309 229 0559 • contact@bytechsol.com." },
  { "question": "hey!", "answer": "Hello! I’m Bytechsol Virtual Assistant. How can I help today? Choose a category to get started. WhatsApp +92 309 229 0559 • contact@bytechsol.com." },
  { "question": "hi!", "answer": "Hello! I’m Bytechsol Virtual Assistant. How can I help today? Choose a category to get started. WhatsApp +92 309 229 0559 • contact@bytechsol.com." },
  { "question": "hello!", "answer": "Hello! I’m Bytechsol Virtual Assistant. How can I help today? Choose a category to get started. WhatsApp +92 309 229 0559 • contact@bytechsol.com." },
  { "question": "hye", "answer": "Hello! I’m Bytechsol Virtual Assistant. How can I help today? Choose a category or type your question. WhatsApp +92 309 229 0559 • contact@bytechsol.com." },
  { "question": "helo", "answer": "Hello! I’m Bytechsol Virtual Assistant. How can I help today? Choose a category or type your question. WhatsApp +92 309 229 0559 • contact@bytechsol.com." },
  { "question": "heloo", "answer": "Hello! I’m Bytechsol Virtual Assistant. How can I help today? Choose a category or type your question. WhatsApp +92 309 229 0559 • contact@bytechsol.com." },
  { "question": "helooo", "answer": "Hello! I’m Bytechsol Virtual Assistant. How can I help today? Choose a category or type your question. WhatsApp +92 309 229 0559 • contact@bytechsol.com." },
  { "question": "heyy", "answer": "Hello! I’m Bytechsol Virtual Assistant. How can I help today? Choose a category to get started. WhatsApp +92 309 229 0559 • contact@bytechsol.com." },
  { "question": "heyyy", "answer": "Hello! I’m Bytechsol Virtual Assistant. How can I help today? Choose a category to get started. WhatsApp +92 309 229 0559 • contact@bytechsol.com." },
  { "question": "hii", "answer": "Hello! I’m Bytechsol Virtual Assistant. How can I help today? Choose a category to get started. WhatsApp +92 309 229 0559 • contact@bytechsol.com." },
  { "question": "hiii", "answer": "Hello! I’m Bytechsol Virtual Assistant. How can I help today? Choose a category to get started. WhatsApp +92 309 229 0559 • contact@bytechsol.com." },
  { "question": "hey bro", "answer": "Hello! I’m Bytechsol Virtual Assistant. How can I help today? Tell me your need or pick a category. WhatsApp +92 309 229 0559 • contact@bytechsol.com." },
  { "question": "hey buddy", "answer": "Hello! I’m Bytechsol Virtual Assistant. How can I help today? Tell me your need or pick a category. WhatsApp +92 309 229 0559 • contact@bytechsol.com." },
  { "question": "hey team", "answer": "Hello! We’re Bytechsol. How can we help today? Choose a category to get started. WhatsApp +92 309 229 0559 • contact@bytechsol.com." },
  { "question": "hello bot", "answer": "Hello! I’m Bytechsol Virtual Assistant. How can I help today? Pick a category or type your question. WhatsApp +92 309 229 0559 • contact@bytechsol.com." },
  { "question": "hi bot", "answer": "Hello! I’m Bytechsol Virtual Assistant. How can I help today? Pick a category or type your question. WhatsApp +92 309 229 0559 • contact@bytechsol.com." },
  { "question": "anyone there", "answer": "Yes, I’m here to help. Tell me what you need or choose a category to begin. WhatsApp +92 309 229 0559 • contact@bytechsol.com." },
  { "question": "anyone there?", "answer": "Yes, I’m here to help. Tell me what you need or choose a category to begin. WhatsApp +92 309 229 0559 • contact@bytechsol.com." },
  { "question": "are you there", "answer": "Yes, I’m here. How can I assist you today? Choose a category or type your question. WhatsApp +92 309 229 0559 • contact@bytechsol.com." },
  { "question": "are you there?", "answer": "Yes, I’m here. How can I assist you today? Choose a category or type your question. WhatsApp +92 309 229 0559 • contact@bytechsol.com." },
  { "question": "is anyone there", "answer": "Yes, I’m here to help. Choose a category to get started or type your question. WhatsApp +92 309 229 0559 • contact@bytechsol.com." },
  { "question": "is anyone there?", "answer": "Yes, I’m here to help. Choose a category to get started or type your question. WhatsApp +92 309 229 0559 • contact@bytechsol.com." },
  { "question": "start", "answer": "Welcome! Choose a category to get started, or tell me what you need. WhatsApp +92 309 229 0559 • contact@bytechsol.com." },
  { "question": "start chat", "answer": "Welcome! Choose a category to get started, or tell me what you need. WhatsApp +92 309 229 0559 • contact@bytechsol.com." },
  { "question": "start conversation", "answer": "Welcome! Choose a category to get started, or tell me what you need. WhatsApp +92 309 229 0559 • contact@bytechsol.com." },
  { "question": "begin", "answer": "Welcome! Choose a category to get started, or tell me what you need. WhatsApp +92 309 229 0559 • contact@bytechsol.com." },
  { "question": "begin chat", "answer": "Welcome! Choose a category to get started, or tell me what you need. WhatsApp +92 309 229 0559 • contact@bytechsol.com." },
  { "question": "help", "answer": "I’m here to help. Tell me your question or pick a category (Web Dev, ERP, E-Commerce, Chatbots, AI/ML, API Integration). WhatsApp +92 309 229 0559 • contact@bytechsol.com." },
  { "question": "help!", "answer": "I’m here to help. Tell me your question or pick a category (Web Dev, ERP, E-Commerce, Chatbots, AI/ML, API Integration). WhatsApp +92 309 229 0559 • contact@bytechsol.com." },
  { "question": "menu", "answer": "Here to help! Choose a category to get started. Prefer WhatsApp? +92 309 229 0559 • contact@bytechsol.com." },
  { "question": "main menu", "answer": "Here to help! Choose a category to get started. Prefer WhatsApp? +92 309 229 0559 • contact@bytechsol.com." },
  { "question": "options", "answer": "Sure—choose a category to get started (Web Dev, ERP, E-Commerce, Chatbots, AI/ML, API Integration). Or message us at +92 309 229 0559." },
  { "question": "support", "answer": "You’ve reached support. Tell me what you need help with or choose a category to begin. WhatsApp +92 309 229 0559 • contact@bytechsol.com." },
  { "question": "agent", "answer": "I can help right away. Share your issue or choose a category. For a human handoff, drop your contact or WhatsApp +92 309 229 0559." },
  { "question": "talk to human", "answer": "No problem—share a brief about your issue and your contact. We’ll connect you to a human. WhatsApp +92 309 229 0559 • contact@bytechsol.com." },
  { "question": "talk to agent", "answer": "Sure—please share your name/issue and we’ll route to an agent. You can also WhatsApp +92 309 229 0559." },
  { "question": "human please", "answer": "Got it—share your issue and contact details. We’ll connect you to a human. Or WhatsApp +92 309 229 0559." },
  { "question": "operator", "answer": "I’ll connect you—please share your name/issue and preferred contact. WhatsApp +92 309 229 0559 • contact@bytechsol.com." },
  { "question": "assistance", "answer": "Happy to assist—choose a category or describe your need. WhatsApp +92 309 229 0559 • contact@bytechsol.com." },
  { "question": ".", "answer": "Hello! I’m here. How can I help? Choose a category or type your question. WhatsApp +92 309 229 0559 • contact@bytechsol.com." },
  { "question": "..", "answer": "Hello! I’m here. How can I help? Choose a category or type your question. WhatsApp +92 309 229 0559 • contact@bytechsol.com." },
  { "question": "...", "answer": "Hello! I’m here. How can I help? Choose a category or type your question. WhatsApp +92 309 229 0559 • contact@bytechsol.com." },
  { "question": "....", "answer": "Hello! I’m here. How can I help? Choose a category or type your question. WhatsApp +92 309 229 0559 • contact@bytechsol.com." },
  { "question": "?", "answer": "Hello! Ask me anything about our services or choose a category to begin. WhatsApp +92 309 229 0559 • contact@bytechsol.com." },
  { "question": "??", "answer": "Hello! Ask me anything about our services or choose a category to begin. WhatsApp +92 309 229 0559 • contact@bytechsol.com." },
  { "question": "???", "answer": "Hello! Ask me anything about our services or choose a category to begin. WhatsApp +92 309 229 0559 • contact@bytechsol.com." },
  { "question": "hey there!", "answer": "Hello! I’m Bytechsol Virtual Assistant. How can I help today? Pick a category to begin. WhatsApp +92 309 229 0559 • contact@bytechsol.com." },
  { "question": "hello there!", "answer": "Hello! I’m Bytechsol Virtual Assistant. How can I help today? Pick a category to begin. WhatsApp +92 309 229 0559 • contact@bytechsol.com." },
  { "question": "ok hello", "answer": "Hello! I’m here to help. Choose a category or tell me your requirement. WhatsApp +92 309 229 0559 • contact@bytechsol.com." },
  { "question": "ok hi", "answer": "Hello! I’m here to help. Choose a category or tell me your requirement. WhatsApp +92 309 229 0559 • contact@bytechsol.com." },
  { "question": "ok hey", "answer": "Hello! I’m here to help. Choose a category or tell me your requirement. WhatsApp +92 309 229 0559 • contact@bytechsol.com." }
];

// nested chips
const CHIP_TREE: Record<string, any> = {
  "Design & Development": {
    "UI/UX Design": `Figma-based UX/UI: wireframes, prototypes, design system & dev handoff.\n• Deliverables: design files, component library, specs\n• Handover: dev-ready assets + walkthrough`,
    "CMS Design & Development": {
      "React / Next.js": `Headless CMS sites (Next.js) with SEO & speed.\n• SSG/ISR/SSR, Core Web Vitals, image optimization\n• Integrations: Strapi/Sanity, GA4/GTM`,
      "Vue.js": `Nuxt (SSR) CMS frontends.\n• Pinia, Vue Router, i18n\n• Animations, charts, forms`,
      "Angular": `Enterprise Angular frontends for CMS-driven sites.\n• RxJS, guards, interceptors\n• Forms, a11y, testing`,
      "WordPress": `Custom themes/blocks, performance & security.\n• WooCommerce, multilingual, backups`,
      "Headless CMS (Strapi/Sanity)": `Content modeling, roles, workflows, webhooks/APIs & media mgmt.`
    },
    "Website Maintenance & Support": `Ongoing updates, bug fixes, security patches & performance tuning.\n• Monitoring, backups, uptime alerts\n• SLAs & monthly plans available`,
    "Web App Development": `Full-stack web apps (Next.js + Node/NestJS/Django).\n• Auth, dashboards, payments, reports\n• CI/CD, staging → production`,
    "Software Development": `Custom software/modules as per scope.\n• Frontend, backend or full-stack teams\n• Clean code, tests, docs & reviews`,
    "Progressive Web Apps (PWA)": `Installable, offline-ready apps.\n• Service Workers, precaching, background sync\n• A2HS & push notifications`,
    "AI / ML / LLM / NLP Solutions": `NLP/LLM (RAG), computer vision & forecasting.\n• Stack: Python, TensorFlow/PyTorch, LangChain\n• MLOps: MLflow, Docker, monitoring`,
    "AI Chatbots & Voice Assistants": `Website & WhatsApp chatbots, plus IVR voice bots.\n• Knowledge-base search, human handoff, analytics\n• CRM/email/Slack integrations`
  },
  "Web & ERP Service": {
    "Custom CMS Development": `Headless/Traditional CMS for ERP portals & content hubs.\n• Headless: Strapi/Sanity + Next.js/Nuxt (SSG/SSR, fast & SEO-ready)\n• Traditional: WordPress (custom themes/blocks), roles & workflows\n• Integrations: ERP/CRM, GA4/GTM, forms, search, media mgmt\n• Handover: docs + training`,
    "API Development & Integration": `Secure REST/GraphQL APIs for ERP connectivity.\n• Auth: OAuth2/JWT, scoped tokens; webhooks & signatures\n• Reliability: retries/backoff, idempotency, pagination\n• Docs & Quality: OpenAPI/Swagger, Postman, CI/CD, staging → prod\n• Observability: logs, metrics, alerting`,
    "Third-Party Service Integration": `Connect ERP with payment, shipping, e-commerce & finance.\n• Examples: Shopify/Woo, QuickBooks, Stripe/PayPal, couriers\n• Data mapping & sync (near real-time), error handling\n• Webhooks/events, reconciliations & audit trail`,
    "ERP Maintenance & Support": `Keep your ERP stable, secure & up-to-date.\n• Bug fixes, upgrades, module tuning, performance hardening\n• Backups/DR, monitoring, uptime alerts\n• SLA plans: monthly hours, response/resolve targets\n• Team training & small enhancements`,
    "Custom ERP Implementation & Development": `End-to-end ERP (e.g., Odoo) implementation & custom dev.\n• Discovery → GAP/Blueprint → Config + Customization → Migration → UAT → Go-Live\n• Modules: Sales, Purchase, Inventory, Accounting, MRP, CRM, HR\n• Customizations: workflows, reports/dashboards, roles/approvals, localization (PK/US/UK)\n• Hosting: Odoo.sh / on-prem / AWS (Docker) • Docs + training • Post-go-live support`
  },
  "E-Commerce": {
    "E-Commerce Store Setup": `End-to-end store setup (Shopify or custom Next.js headless).\n• Catalog/variants, collections, search/filters, reviews\n• Speed & SEO (Core Web Vitals), schema/meta, CDN\n• GA4/GTM + pixels, basic funnels\n• Handover: training + docs`,
    "Shopify Store Setup": `Theme setup/custom sections, products & collections, apps & automations.\n• Payments, shipping/taxes, locales\n• CRO add-ons: upsells, bundles, post-purchase flows\n• Analytics: GA4, Meta/TikTok Pixels, CAPI`,
    "WooCommerce Development": `Woo + custom theme/blocks, performance & security hardening.\n• Gateways, shipping, coupons, multilingual\n• Custom checkout, reporting, hooks/filters`,
    "Payment Gateway Integration": `Stripe/PayPal + local gateways, COD rules, taxes & refunds.\n• Secure auth (OAuth2/HMAC), webhooks, retries/backoff\n• PCI-aware best practices & logging`,
    "Marketplace Development": `Multi-vendor marketplace (commission, payouts, vendor portals).\n• Vendor onboarding/KYC, catalog moderation\n• Orders, disputes, notifications, dashboards`
  },
  "Marketing": {
    "Brand Strategy & Consulting": `Positioning, audience personas, value props & messaging pillars.\n• Competitive audit & brand voice\n• Go-to-market suggestions & KPI framework\n• Roadmap: 30/60/90 days`,
    "Logo Design & Visual Identity": `Logo/mark, color palette, typography, icon/illustration style.\n• Brand guidelines (PDF), usage rules\n• Social avatars, favicon set, basic stationery kit`,
    "Social Media Branding": `Profile/cover designs, post/story templates, highlight icons.\n• Monthly content calendar & copy angles\n• Starter ad creatives (static/reel scripts)\n• Setup: Meta/TikTok pixels & GA4`,
    "On-Page SEO": `Keyword mapping, titles/meta, headings & internal links.\n• Schema markup, clean URLs, sitemap/robots\n• Content optimization & basic CWV improvements`,
    "Off-Page SEO": `Backlink outreach (white-hat), digital PR & citations.\n• Niche directories & partnerships\n• Brand mentions tracking & reporting`,
    "Technical SEO Audit": `Crawlability/indexing, 404/redirects, canonicals, hreflang.\n• Core Web Vitals, lazy-load & image optimization\n• Pagination, structured data & logs review\n• Clear fixes with priority list`
  },
  "Odoo Services": {
    "Odoo Migration & Customization": `Migrate data & tailor workflows to newer Odoo versions.\n• Pre-migration audit, gap list, test sandbox\n• Data mapping: partners, products, inventory, invoices/GL\n• Customization: Studio/Python, views, reports, approvals\n• UAT → cutover plan → go-live + rollback/backups\n• Post-go-live fixes & tuning`,
    "Odoo Techno-Functional Consultancy": `End-to-end advisory for process design & success.\n• Discovery, GAP/Blueprint, KPI & dashboards\n• Roles/RBAC, approvals, audit trail, localization (PK/US/UK taxes)\n• SOPs, training & change management\n• Roadmap + effort estimates`,
    "Odoo Module Development": `Custom modules that follow Odoo standards.\n• Models, views, access rules, server actions, schedulers\n• QWeb/PDF & xlsx reports, wizards\n• Tests & code review, versioning & docs\n• Handover + support options`,
    "Odoo Integration Services": `Connect Odoo with stores, finance & ops.\n• Shopify/Woo, payment gateways (Stripe/PayPal), couriers\n• QuickBooks/Accounting, CRM, webhooks/APIs (REST/GraphQL)\n• OAuth2/JWT, signatures, idempotency, retries/backoff\n• Monitoring, logs & alerts\n• Contact: contact@bytechsol.com`
  }
};

// Enhanced Logic for Bot Responses
const getBotResponse = (input: string): { text: string; chips?: string[] } => {
  const lowerInput = input.toLowerCase();

  // 0. Helper: Normalize and Tokenize
  const normalize = (str: string) => str.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();
  const getTokens = (str: string) => new Set(normalize(str).split(/\s+/).filter(Boolean)); // Filter out empty strings from split

  // 1. Smart Knowledge Base Search (Token Overlap)
  let bestMatch = null;
  let maxMatchScore = 0;
  const inputTokens = getTokens(input);

  if (inputTokens.size > 0) { // Only proceed if input has valid tokens
    for (const item of KNOWLEDGE_BASE) {
      const kbTokens = getTokens(item.question);
      if (kbTokens.size === 0) continue; // Skip if KB question has no valid tokens

      let intersection = 0;
      inputTokens.forEach(t => { if (kbTokens.has(t)) intersection++; });

      // Score based on overlap ratio
      const score = intersection / Math.max(inputTokens.size, kbTokens.size);

      // Bonus for exact substring match
      if (normalize(item.question).includes(normalize(input)) || normalize(input).includes(normalize(item.question))) {
        if (score > 0.3) { // Lower threshold if substring matches
          if (score > maxMatchScore) { maxMatchScore = score + 0.2; bestMatch = item; }
          continue;
        }
      }

      if (score > maxMatchScore) {
        maxMatchScore = score;
        bestMatch = item;
      }
    }
  }

  // Threshold (0.5 means ~50% words matched)
  if (bestMatch && maxMatchScore > 0.4) {
    return { text: bestMatch.answer };
  }

  // 2. Chip Logic (Breadcrumb Navigation)
  if (CHIP_TREE[input]) {
    return {
      text: `Here are our ${input} options:`,
      chips: Object.keys(CHIP_TREE[input])
    };
  }

  // Check if input matches a sub-category/leaf and find its parent
  for (const [category, subcats] of Object.entries(CHIP_TREE)) {
    if (typeof subcats === 'object') {
      if (subcats[input]) {
        const node = subcats[input];
        if (typeof node === 'string') {
          return { text: node }; // Leaf node
        } else {
          return {
            text: `Here are specific options for ${input}:`,
            chips: Object.keys(node)
          }; // Sub-menu
        }
      }
      for (const [subName, subNode] of Object.entries(subcats)) {
        if (typeof subNode === 'object' && (subNode as Record<string, string>)[input]) {
          return { text: (subNode as Record<string, string>)[input] }; // Leaf node level 3
        }
      }
    }
  }

  // 3. Contact Info
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
  const phoneRegex = /\b\d{10,}\b|\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/;

  if (emailRegex.test(input) || phoneRegex.test(input)) {
    return { text: "Thank you! I've noted your contact details. A Bytechsol expert will reach out to you shortly. Is there anything else about your project you'd like to share?" };
  }

  // 4. Quick Actions Matching (Fallback to logic if chips don't catch it)
  if (lowerInput.includes('quote') || lowerInput.includes('price')) return { text: "We offer competitive pricing. To provide an accurate quote, could you briefly describe your project requirements?" };
  if (lowerInput.includes('web')) return { text: "Bytechsol offers premium Web Development (Next.js, React, Custom). We build high-performance, responsive sites. Need a new site or a redesign?", chips: ["Web & ERP Service", "Design & Development"] };
  if (lowerInput.includes('ai') || lowerInput.includes('ml')) return { text: "We specialize in AI Chatbots, NLP, and Process Automation. How do you envision AI helping your business?", chips: ["Design & Development"] };
  if (lowerInput.includes('odoo') || lowerInput.includes('erp')) return { text: "We are Odoo experts offering Migration, Customization, and Consultancy. Are you setting up a new ERP or upgrading?", chips: ["Odoo Services"] };
  if (lowerInput.includes('portfolio') || lowerInput.includes('case')) return { text: "You can view our extensive portfolio on our website bytechsol.com/portfolio, featuring our award-winning designs." };
  if (lowerInput.includes('support') || lowerInput.includes('contact')) return { text: "You can reach us at info@bytechsol.com or call us directly. How can we assist you right now?" };

  // 5. General & Fallback
  if (lowerInput.includes('hi') || lowerInput.includes('hello')) return { text: "Hello! Welcome to Bytechsol. Select an option above or type your question.", chips: QUICK_ACTIONS };
  if (lowerInput.includes('thank')) return { text: "You're welcome! Let me know if you need anything else." };

  return { text: "I can help with that. Bytechsol creates scalable digital solutions. Could you provide a bit more detail about your specific needs?", chips: QUICK_ACTIONS };
};

export default function Home() {
  const [messages, setMessages] = useState<(Message & { chips?: string[] })[]>([INITIAL_MESSAGE]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isOpen, setIsOpen] = useState(false); // Widget State
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isTyping, isOpen]);

  const toggleChat = () => setIsOpen(!isOpen);

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: text,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      const response = getBotResponse(userMessage.text);
      const botMessage: Message & { chips?: string[] } = {
        id: (Date.now() + 1).toString(),
        text: response.text,
        sender: 'bot',
        timestamp: new Date(),
        chips: response.chips
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 1200);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(inputText);
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        className={`chat-widget-btn ${isOpen ? 'open-state' : ''}`}
        onClick={toggleChat}
        aria-label="Toggle Chat"
      >
        {isOpen ? (
          <X color="white" size={28} />
        ) : (            // Using the 3D Robot Mascot (large size)
          <img
            src="/bot-icon.svg"
            alt="Chat with us"
            width="110"
            height="110"
          />
        )}
      </button>

      {/* Chat Container Widget */}
      <main className={`chat-container ${isOpen ? 'open' : 'closed'}`}>
        {/* Header */}
        <header className="header">
          <div className="bot-avatar-header" style={{ background: 'white', padding: '5px' }}>
            <img src="/logo.png" alt="Bytechsol Logo" width="30" height="30" />
          </div>
          <div className="header-info">
            <div className="header-title">
              Bytechsol AI <CheckCircle size={14} className="verified-badge" fill="#00d2ff" stroke="none" />
            </div>
            <div className="header-subtitle">Your 24/7 digital assistant</div>
          </div>
          <button className="close-btn" onClick={() => setIsOpen(false)}>
            <X size={18} />
          </button>
        </header>

        {/* Messages Area */}
        <div className="messages-area">

          {/* DISCLAIMER BLOCK */}
          <div className="disclaimer-box">
            <strong className="disclaimer-title">DISCLAIMER:</strong>
            While Bytechsol AI strives to provide accurate info, please verify specific project details with our human agents. Use this bot for general inquiries and lead submission.
          </div>

          {messages.map((msg, index) => (
            <div key={msg.id} className={`message-row ${msg.sender}`}>
              {msg.sender === 'bot' && (
                <div className="bot-avatar-small">
                  <Bot size={20} color="#fff" />
                </div>
              )}

              <div className="message-content">
                {msg.sender === 'bot' && <span className="message-sender-name">Bytechsol AI</span>}

                <div className={`message-bubble`}>
                  {msg.text.split('\n').map((line, i) => (
                    <div key={i}>{line}</div>
                  ))}
                </div>

                {/* Dynamically show chips for THIS message if they exist */}
                {msg.sender === 'bot' && (msg.chips || (index === 0 && QUICK_ACTIONS)) && (
                  <div className="quick-replies">
                    {(msg.chips || (index === 0 ? QUICK_ACTIONS : [])).map((action) => (
                      <button
                        key={action}
                        className="chip"
                        onClick={() => handleSendMessage(action)}
                      >
                        {action}
                      </button>
                    ))}
                  </div>
                )}

                <span className="timestamp">
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="message-row bot">
              <div className="bot-avatar-small">
                <Bot size={20} color="#fff" />
              </div>
              <div className="message-content">
                <span className="message-sender-name">Bytechsol AI</span>
                <div className="message-bubble typing-dots">
                  <span className="typing-dot"></span>
                  <span className="typing-dot"></span>
                  <span className="typing-dot"></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Footer / Input Area */}
        <footer className="footer">
          <form className="input-container" onSubmit={handleSubmit}>
            <input
              type="text"
              className="chat-input"
              placeholder="Type your message here..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={isTyping}
            />
            <button
              type="submit"
              className="send-icon-btn"
              disabled={!inputText.trim() || isTyping}
              aria-label="Send message"
            >
              <Send size={20} className={inputText.trim() ? "fill-current" : ""} />
            </button>
          </form>
          <div className="powered-by">
            Powered by Bytechsol
          </div>
        </footer>
      </main>
    </>
  );
}
