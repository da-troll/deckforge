import type { SeedPrompt } from './types';

export const SEEDS: SeedPrompt[] = [
  {
    label: 'Agent Household Overview',
    theme: 'midnight',
    prompt: `Create a technical presentation explaining the Trollefsen AI agent household system.
Cover these 5 agents: Eve (coordinator/orchestrator), Wilson (dev builder), Pepper (inbox/email guardian), Radar (signal/trend watcher), C-3PO (infra debugger).
Explain how they communicate via ClawDash (the webchat UI), how Eve routes tasks, and how Wilson owns the nightly MVP build pipeline.
Infrastructure: VPS on Hostinger, Docker/Caddy, n8n workflows, ClawDash React frontend, Ogham semantic memory (ChromaDB), Supabase.
Make it feel like a real architecture deck — technical but clear.`,
  },
  {
    label: 'ClawDash Architecture',
    theme: 'dark',
    prompt: `Create a technical architecture presentation for ClawDash — a multi-agent AI webchat dashboard.
Key concepts: React + TypeScript frontend, ClawBridge (Node.js WebSocket server), multiple agent sessions, session routing, model selection per agent, streaming responses, push notifications via FCM.
Cover: how a message flows from user → bridge → Claude API → back; how session keys work (agent:wilson:main etc); the mobile Capacitor wrapper; agent-to-agent messaging via send.sh.
Style: dark engineering deck, diagrams described as bullet points since we can't embed images.`,
  },
  {
    label: 'Podda App Pitch',
    theme: 'light',
    prompt: `Create a product pitch deck for Podda — a personal podcast app for power users.
Podda lets you subscribe to podcast feeds, stream or download episodes, track progress, and surface new content intelligently.
Built with React + TypeScript + Vite. Mobile-first with Capacitor Android wrapper. Self-hosted on VPS.
Cover: problem (existing podcast apps are bloated/ad-laden), solution (clean self-hosted alternative), key features, tech stack, roadmap.
Make it feel like a real startup pitch — punchy, visual, confident.`,
  },
  {
    label: 'Weekly Product Demo',
    theme: 'glass',
    prompt: `Create a weekly product demo deck template for an AI/automation product team.
Slides should cover: What shipped this week, what's in review, what's blocked, key metrics (use placeholder numbers), team velocity, next week's focus.
Make it feel energetic and forward-looking. Product-led, not engineering-led — focus on user outcomes not technical details.
Keep it concise — this is for a 15-minute standup.`,
  },
  {
    label: 'VPS Infrastructure Overview',
    theme: 'midnight',
    prompt: `Create an infrastructure overview presentation for a Linux VPS running a personal AI agent stack.
Cover: hardware specs (15GB RAM, 4-core AMD EPYC, 193GB SSD), OS (Ubuntu), networking (Cloudflare DNS, Caddy reverse proxy, UFW firewall).
Services: Docker Compose stack (n8n, Postgres 16, Caddy, Dockge), pm2-managed Node.js apps, systemd user services for agent bridges.
Security: basic auth, cookie-based auth flow, isolated agent workspaces.
Monitoring: ClawPulse integration, agent heartbeats, Caddy access logs.
Make it feel like a talk you'd give at a homelab meetup.`,
  },
  {
    label: 'Agentic Automation ROI',
    theme: 'light',
    prompt: `Create a business case presentation for investing in AI agent automation for enterprise product teams.
Cover: current state (manual work, context switching, slow feedback loops), proposed state (autonomous agents handling research, drafting, routing, monitoring), expected ROI.
Use concrete examples: automated inbox triage saves 2h/day, nightly trend monitoring surfaces opportunities 12h faster, automated PR summaries cut review time by 40%.
Audience: VP/C-suite who are skeptical but curious. Be direct, use numbers, anticipate objections.`,
  },
];
