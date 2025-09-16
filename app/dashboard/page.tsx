'use client';

import {
  Activity,
  AlertTriangle,
  ArrowUp,
  ArrowUpRight,
  BarChart3,
  BookOpen,
  CheckCircle2,
  ClipboardList,
  Clock3,
  FileText,
  Globe,
  Layers,
  Lock,
  MessageSquare,
  PlusCircle,
  ShieldCheck,
  Share2,
  Upload,
  UploadCloud,
  Users,
  Zap,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { AppShell } from '@/components/AppShell';

const responseTimes = [
  { label: 'LLM', value: '2.4s', trend: '+12%' },
  { label: 'Guardrail', value: '620ms', trend: '-8%' },
  { label: 'Human review', value: '14m', trend: '-21%' },
];

const automationPlaybooks = [
  'Rollback risky prompts automatically',
  'Escalate high severity hallucinations to Slack',
  'Request fresh citations when confidence < 80%',
];

type ClaimSeverity = 'Critical' | 'Warning' | 'Minor' | 'Verified';
type ClaimDecision = 'pending' | 'accepted' | 'rejected' | 'research';

interface ClaimRecord {
  id: string;
  severity: ClaimSeverity;
  badgeClass: string;
  excerpt: string;
  location: string;
  confidence: string;
  status: string;
  correction?: string;
  sources?: Array<{ name: string; detail: string }>;
  decision?: ClaimDecision;
  decisionNote?: string;
  updatedAt?: string;
}

const initialClaims: ClaimRecord[] = [
  {
    id: 'CLM-204',
    severity: 'Critical',
    badgeClass: 'bg-[#f87171]/20 text-[#f87171]',
    excerpt: '"Apollo 11 touched down in 1972 with Armstrong and Buzz Lightyear."',
    location: 'Paragraph 2 · Line 6',
    confidence: '18% confidence',
    status: 'Requires correction',
    correction:
      'Apollo 11 landed on July 20, 1969, with Neil Armstrong and Buzz Aldrin leading the mission.',
    sources: [
      {
        name: 'NASA mission log — 1969',
        detail: 'Mission transcript and capsule transcript verifying the 1969 landing.',
      },
      {
        name: 'Smithsonian lunar archive',
        detail: 'Curated exhibition on the Apollo program with corroborating details.',
      },
    ],
  },
  {
    id: 'CLM-205',
    severity: 'Warning',
    badgeClass: 'bg-[#facc15]/20 text-[#facc15]',
    excerpt: '"The mission lasted a full ten days in orbit."',
    location: 'Paragraph 4 · Line 3',
    confidence: '54% confidence',
    status: 'Partially unsupported',
  },
  {
    id: 'CLM-206',
    severity: 'Minor',
    badgeClass: 'bg-[#34d399]/20 text-[#34d399]',
    excerpt: '"NASA celebrated with a ticker tape parade the next morning."',
    location: 'Paragraph 6 · Line 1',
    confidence: '73% confidence',
    status: 'Needs updated context',
  },
  {
    id: 'CLM-207',
    severity: 'Verified',
    badgeClass: 'bg-[#a3ff12]/20 text-[#a3ff12]',
    excerpt: '"Landing site: Sea of Tranquility on the lunar surface."',
    location: 'Paragraph 7 · Line 4',
    confidence: '97% confidence',
    status: 'Fully supported',
  },
];

const claimTabs: Array<{ id: 'All' | ClaimSeverity; label: string }> = [
  { id: 'All', label: 'All claims' },
  { id: 'Critical', label: 'Critical' },
  { id: 'Warning', label: 'Warnings' },
  { id: 'Minor', label: 'Minor' },
  { id: 'Verified', label: 'Verified' },
];

const decisionCopy: Record<Exclude<ClaimDecision, 'pending'>, { status: string; note: string }> = {
  accepted: {
    status: 'Fix applied',
    note: 'Claim updated with verified correction.',
  },
  rejected: {
    status: 'Marked as intentionally kept',
    note: 'Reviewer chose to retain original copy.',
  },
  research: {
    status: 'Escalated for deeper research',
    note: 'Sent to research queue for follow-up context.',
  },
};

const commentThreads = [
  {
    author: 'Sarah P.',
    role: 'Content lead',
    message: 'Let’s anchor the opening paragraph with a NASA source and remove the Buzz Lightyear mention.',
    time: '2m ago',
    initials: 'SP',
  },
  {
    author: 'Marcus L.',
    role: 'Copywriter',
    message: 'Added context on mission duration. Need confirmation on the parade reference.',
    time: '18m ago',
    initials: 'ML',
  },
  {
    author: 'Linda C.',
    role: 'Comms director',
    message: 'Ensure export includes compliance summary for legal review.',
    time: '1h ago',
    initials: 'LC',
  },
];

const workflowStages = [
  {
    title: 'Draft imported',
    detail: 'Marcus uploaded v3 doc via Google Drive sync.',
    meta: 'Completed 1h ago',
  },
  {
    title: 'Claims extracted',
    detail: '12 factual assertions pending verification.',
    meta: 'Processing complete · 8m ago',
  },
  {
    title: 'Corrections pending',
    detail: '3 high-priority updates need approval.',
    meta: 'Assigned to Sarah',
  },
];

const batchQueue = [
  {
    title: 'Q3 product launch assets',
    documents: 18,
    status: 'Running',
    progressLabel: '68% complete',
    progressValue: 68,
    eta: 'ETA 12m',
  },
  {
    title: 'Customer case studies',
    documents: 9,
    status: 'Queued',
    progressLabel: 'Scheduled for 3:00 PM',
    progressValue: 0,
    eta: 'In queue',
  },
  {
    title: 'Compliance policy review',
    documents: 27,
    status: 'Completed',
    progressLabel: 'Finished 45m ago',
    progressValue: 100,
    eta: 'Report ready',
  },
];

const complianceChecklist = [
  {
    title: 'SOC2 audit logging',
    detail: 'Event-level decisions retained 180 days.',
    state: 'Enabled',
  },
  {
    title: 'HIPAA workspace controls',
    detail: 'PHI safeguard template applied.',
    state: 'Active',
  },
  {
    title: 'GDPR data residency',
    detail: 'EU data isolation enforced for enterprise tier.',
    state: 'Compliant',
  },
  {
    title: 'Role-based permissions',
    detail: 'Reviewer + approver segregation configured.',
    state: 'Locked',
  },
];

export default function Dashboard() {
  const [claims, setClaims] = useState<ClaimRecord[]>(initialClaims);
  const [activeTab, setActiveTab] = useState<'All' | ClaimSeverity>('All');
  const [selectedClaimId, setSelectedClaimId] = useState<string>(initialClaims[0]?.id ?? '');

  const filteredClaims = useMemo(() => {
    if (activeTab === 'All') {
      return claims;
    }
    return claims.filter((claim) => claim.severity === activeTab);
  }, [activeTab, claims]);

  useEffect(() => {
    if (!filteredClaims.length) {
      return;
    }
    const currentVisible = filteredClaims.some((claim) => claim.id === selectedClaimId);
    if (!currentVisible) {
      setSelectedClaimId(filteredClaims[0].id);
    }
  }, [filteredClaims, selectedClaimId]);

  const selectedClaim = useMemo(() => {
    return claims.find((claim) => claim.id === selectedClaimId) ?? filteredClaims[0] ?? claims[0];
  }, [claims, filteredClaims, selectedClaimId]);

  const handleSelectClaim = (id: string) => {
    setSelectedClaimId(id);
  };

  const applyDecision = (decision: Exclude<ClaimDecision, 'pending'>) => {
    if (!selectedClaim) return;

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const copy = decisionCopy[decision];

    setClaims((prev) =>
      prev.map((claim) =>
        claim.id === selectedClaim.id
          ? {
              ...claim,
              decision,
              status: copy.status,
              decisionNote: copy.note,
              updatedAt: timestamp,
            }
          : claim,
      ),
    );
  };

  const selectedDecisionMeta =
    selectedClaim && selectedClaim.decision && selectedClaim.decision !== 'pending'
      ? decisionCopy[selectedClaim.decision]
      : undefined;

  const isActionDisabled = !selectedClaim || selectedClaim.severity === 'Verified';

  const [showWorkspace, setShowWorkspace] = useState(false);

  return (
    <AppShell>
      <div className="relative mx-auto flex min-h-screen w-full max-w-[1440px] flex-col overflow-hidden px-6 pb-20 pt-10">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(80,90,255,0.18),_transparent_70%)]" />
        <div className="pointer-events-none absolute bottom-0 left-1/2 -z-10 h-[520px] w-[520px] -translate-x-1/2 translate-y-1/3 rounded-full bg-[radial-gradient(circle,_rgba(163,255,18,0.12),_transparent_70%)] blur-3xl" />

        {!showWorkspace ? (
          <section className="mt-10 flex flex-1 flex-col items-center justify-center gap-12 text-center">
            <div className="max-w-3xl space-y-4">
              <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">Start a fact-check</p>
              <h1 className="text-4xl font-semibold text-white sm:text-5xl">Upload or paste your content</h1>
              <p className="text-sm text-neutral-400">
                FactCheck AI extracts every claim, verifies it against Exa search, and suggests Groq-powered fixes. Choose how you’d like to bring your draft into the workspace.
              </p>
            </div>
            <div className="grid w-full max-w-4xl gap-6 md:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  title: 'Paste text',
                  description: 'Drop in copied content and jump straight into claim review.',
                  icon: FileText,
                  action: () => setShowWorkspace(true),
                },
                {
                  title: 'Upload document',
                  description: 'Import PDF, DOCX, or TXT and extract claims automatically.',
                  icon: Upload,
                  action: () => setShowWorkspace(true),
                },
                {
                  title: 'Import URL',
                  description: 'Pull web content via Exa crawl for instant verification.',
                  icon: Globe,
                  action: () => setShowWorkspace(true),
                },
                {
                  title: 'Start from prompt',
                  description: 'Generate a draft and fact-check it without leaving the workspace.',
                  icon: PlusCircle,
                  action: () => setShowWorkspace(true),
                },
              ].map((card) => (
                <button
                  key={card.title}
                  onClick={card.action}
                  className="group flex h-full flex-col items-start gap-4 rounded-3xl border border-white/10 bg-white/5 p-6 text-left transition hover:border-white/30 hover:bg-white/10"
                >
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#101010] text-white">
                    <card.icon className="h-5 w-5" />
                  </span>
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-white">{card.title}</h3>
                    <p className="text-sm text-neutral-400">{card.description}</p>
                  </div>
                  <span className="mt-auto inline-flex items-center gap-1 text-xs font-semibold text-neutral-300 group-hover:text-white">
                    Continue <ArrowUpRight className="h-3 w-3" />
                  </span>
                </button>
              ))}
            </div>
            <div className="text-xs text-neutral-500">
              Need inspiration?{' '}
              <button className="underline underline-offset-2" onClick={() => setShowWorkspace(true)}>
                Load sample workspace
              </button>
            </div>
          </section>
        ) : (
          <>
            <header className="flex flex-col gap-6 pb-10">
              <div className="flex flex-col gap-3 text-sm text-neutral-400 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">Operations console</p>
                  <h1 className="mt-2 text-3xl font-semibold text-white">Hallucination control center</h1>
                </div>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => setShowWorkspace(false)}
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:border-white/30"
                  >
                    Upload another draft
                    <ArrowUp className="h-4 w-4" />
                  </button>
                  <button className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-neutral-200">
                    Deploy guardrail
                    <ArrowUpRight className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="grid gap-6 lg:grid-cols-[2.2fr,1fr]">
                <div className="rounded-[32px] border border-white/10 bg-white/[0.04] p-6">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.3em] text-[#a3ff12]">Today</p>
                      <h2 className="mt-3 text-2xl font-semibold">Platform health</h2>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-neutral-300">
                      <span className="inline-flex h-3 w-3 rounded-full bg-[#a3ff12]" />
                      Systems nominal
                    </div>
                  </div>
                  <div className="mt-8 grid gap-4 md:grid-cols-3">
                    <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-[#141414] via-[#0d0d0d] to-[#050505] p-4">
                      <div className="flex items-center justify-between text-sm text-neutral-400">
                        <span>Flagged completions</span>
                        <Zap className="h-4 w-4 text-[#a3ff12]" />
                      </div>
                      <p className="mt-6 text-4xl font-semibold text-white">128</p>
                      <p className="mt-2 text-xs uppercase tracking-[0.2em] text-neutral-500">+32 vs yesterday</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-[#121212] via-[#0d0d0d] to-[#050505] p-4">
                      <div className="flex items-center justify-between text-sm text-neutral-400">
                        <span>Auto-corrected</span>
                        <ShieldCheck className="h-4 w-4 text-[#7dd3fc]" />
                      </div>
                      <p className="mt-6 text-4xl font-semibold text-white">87%</p>
                      <p className="mt-2 text-xs uppercase tracking-[0.2em] text-neutral-500">Precision mode</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-[#101010] via-[#0c0c0c] to-[#050505] p-4">
                      <div className="flex items-center justify-between text-sm text-neutral-400">
                        <span>Critical incidents</span>
                        <AlertTriangle className="h-4 w-4 text-[#fca5a5]" />
                      </div>
                      <p className="mt-6 text-4xl font-semibold text-white">02</p>
                      <p className="mt-2 text-xs uppercase tracking-[0.2em] text-neutral-500">Both mitigated</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">Response time</p>
                      <h3 className="mt-2 text-lg font-semibold text-white">Pipeline latency</h3>
                    </div>
                    <Clock3 className="h-5 w-5 text-neutral-500" />
                  </div>
                  <div className="mt-6 space-y-4 text-sm text-neutral-300">
                    {responseTimes.map((item) => (
                      <div key={item.label} className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#090909] px-4 py-3">
                        <div>
                          <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">{item.label}</p>
                          <p className="text-xl font-semibold text-white">{item.value}</p>
                        </div>
                        <span className="text-xs text-[#a3ff12]">{item.trend}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </header>

            <section className="mb-10 grid gap-6 xl:grid-cols-[2.1fr,0.9fr]">
              {/* existing workspace content */}

        <section className="mb-10 grid gap-6 xl:grid-cols-[2.1fr,0.9fr]">
          <div className="rounded-[36px] border border-white/10 bg-white/[0.04] p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">Document workspace</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">Apollo launch narrative — draft v3</h2>
                <p className="mt-2 text-sm text-neutral-400">Last synced 4 minutes ago · 12 claims detected · Owner Marcus L.</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <button className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:border-white/30">
                  <Share2 className="h-4 w-4" />
                  Share
                </button>
                <button className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-neutral-200">
                  <BookOpen className="h-4 w-4" />
                  Export report
                </button>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3 text-xs text-neutral-400">
              <span className="inline-flex items-center gap-2 rounded-full bg-[#a3ff12]/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-[#a3ff12]">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Confidence {selectedClaim?.confidence ?? '—'}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-[#1a1a1a] px-3 py-1 text-xs text-neutral-300">
                <Activity className="h-3.5 w-3.5 text-[#7dd3fc]" />
                Real-time sync on
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-[#1a1a1a] px-3 py-1 text-xs text-neutral-300">
                <Clock3 className="h-3.5 w-3.5 text-neutral-500" />
                Reviewed 6m ago
              </span>
            </div>

            <div className="mt-8 grid gap-6 xl:grid-cols-[1.15fr,0.85fr]">
              <div className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-gradient-to-br from-[#151515] via-[#0f0f0f] to-[#050505] p-6">
                <div className="flex items-center justify-between text-xs text-neutral-500">
                  <span className="inline-flex items-center gap-2 text-neutral-300">
                    <FileText className="h-4 w-4 text-neutral-500" />
                    Inline review mode
                  </span>
                  <span className="rounded-full bg-[#111111] px-3 py-1 text-[11px] text-neutral-500">Word count · 1,248</span>
                </div>
                <div className="space-y-4 text-sm leading-relaxed text-neutral-300">
                  <p>
                    Apollo 11 was the first crewed spacecraft to land on the moon, launching from Cape Kennedy in 1969.
                    The mission delivered a live broadcast watched by millions and marked a turning point for human exploration.
                  </p>
                  <div className="rounded-2xl border border-[#f87171]/30 bg-[#341818]/70 p-4 text-sm text-neutral-200">
                    <p>
                      Our AI assistant states the landing occurred in
                      <span className="mx-1 rounded-md bg-[#f87171]/20 px-2 py-1 text-[#f87171]">1972</span>
                      and credits Neil Armstrong and the fictional astronaut Buzz Lightyear.
                    </p>
                    <p className="mt-3 text-xs uppercase tracking-[0.25em] text-[#f87171]">Critical · Requires correction</p>
                  </div>
                  <p>
                    After returning to Earth, the crew completed a 21-day quarantine period while NASA evaluated potential
                    contamination risks. The mission concluded successfully on July 24, 1969, with splashdown in the Pacific Ocean.
                  </p>
                  <div className="rounded-2xl border border-[#facc15]/20 bg-[#2f2916]/60 p-4 text-sm text-neutral-200">
                    <p>
                      Public celebrations included ticker-tape parades and presidential ceremonies, although not immediately "the next
                      morning" as the draft suggests.
                    </p>
                    <p className="mt-3 text-xs uppercase tracking-[0.25em] text-[#facc15]">Warning · Needs context</p>
                  </div>
                  <div className="rounded-2xl border border-[#34d399]/20 bg-[#17301f]/50 p-4 text-sm text-neutral-200">
                    <p>
                      Verified claim · The lunar module Eagle touched down in the Sea of Tranquility with Armstrong announcing the
                      "giant leap for mankind."
                    </p>
                    <p className="mt-3 text-xs uppercase tracking-[0.25em] text-[#34d399]">Verified · Ready to publish</p>
                  </div>
                </div>
                <div className="mt-2 flex flex-wrap gap-3 text-[10px] uppercase tracking-[0.3em] text-neutral-500">
                  <span>Critical</span>
                  <span className="h-0.5 w-6 bg-[#f87171]" />
                  <span>Warning</span>
                  <span className="h-0.5 w-6 bg-[#facc15]" />
                  <span>Verified</span>
                  <span className="h-0.5 w-6 bg-[#34d399]" />
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-3xl border border-white/10 bg-[#090909] p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">Claims</p>
                      <h3 className="mt-2 text-lg font-semibold text-white">Verification queue</h3>
                    </div>
                    <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-neutral-300">{filteredClaims.length} in view</span>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {claimTabs.map((tab) => {
                      const isActive = tab.id === activeTab;
                      return (
                        <button
                          key={tab.id}
                          type="button"
                          onClick={() => setActiveTab(tab.id)}
                          className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
                            isActive
                              ? 'border-white bg-white text-black'
                              : 'border-white/10 bg-[#101010] text-neutral-300 hover:border-white/30'
                          }`}
                        >
                          {tab.label}
                        </button>
                      );
                    })}
                  </div>
                  <div className="mt-5 space-y-4">
                    {filteredClaims.length === 0 ? (
                      <div className="rounded-2xl border border-dashed border-white/10 bg-[#0b0b0b] p-6 text-center text-sm text-neutral-400">
                        No claims in this view. Adjust filters to continue reviewing.
                      </div>
                    ) : (
                      filteredClaims.map((claim) => {
                        const isSelected = claim.id === selectedClaim?.id;

                        return (
                          <button
                            key={claim.id}
                            type="button"
                            onClick={() => handleSelectClaim(claim.id)}
                            className={`w-full rounded-2xl border border-white/10 p-4 text-left transition ${
                              isSelected
                                ? 'bg-white text-black shadow-[0_12px_60px_rgba(0,0,0,0.35)]'
                                : 'bg-[#0f0f0f] text-neutral-200 hover:border-white/30'
                            }`}
                          >
                            <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.3em]">
                              <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 font-semibold ${claim.badgeClass}`}>
                                {claim.severity}
                              </span>
                              <span className={isSelected ? 'text-neutral-500' : 'text-neutral-400'}>{claim.confidence}</span>
                            </div>
                            <p className={`mt-3 text-sm ${isSelected ? 'text-neutral-800' : 'text-neutral-100'}`}>{claim.excerpt}</p>
                            <p className={`mt-2 text-xs ${isSelected ? 'text-neutral-500' : 'text-neutral-500'}`}>{claim.location}</p>
                            <p className={`mt-2 text-xs font-semibold ${isSelected ? 'text-black/70' : 'text-neutral-400'}`}>{claim.status}</p>
                            {claim.decisionNote && (
                              <p className={`mt-2 text-xs ${isSelected ? 'text-neutral-600' : 'text-neutral-500'}`}>{claim.decisionNote}</p>
                            )}
                            {claim.updatedAt && (
                              <p className={`mt-1 text-[10px] uppercase tracking-[0.3em] ${isSelected ? 'text-neutral-400' : 'text-neutral-500'}`}>
                                Updated {claim.updatedAt}
                              </p>
                            )}
                          </button>
                        );
                      })
                    )}
                  </div>
                </div>

                <div className="rounded-3xl border border-white/10 bg-[#0a0a0a] p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">Suggested fix</p>
                      <h3 className="mt-2 text-lg font-semibold text-white">{selectedClaim?.id ?? 'Select a claim'}</h3>
                    </div>
                    <span className="text-xs text-neutral-500">{selectedClaim?.severity ?? '—'} priority</span>
                  </div>

                  {selectedClaim ? (
                    <>
                      <p className="mt-4 text-sm text-neutral-200">
                        {selectedClaim.correction ?? 'No AI suggestion available yet. Queue deeper research or add a manual note.'}
                      </p>

                      {selectedDecisionMeta && (
                        <div className="mt-4 rounded-2xl border border-white/10 bg-[#111111] p-4 text-sm text-neutral-200">
                          <p className="font-semibold text-white">
                            {selectedDecisionMeta.status}
                            {selectedClaim.updatedAt ? ` · ${selectedClaim.updatedAt}` : ''}
                          </p>
                          <p className="mt-1 text-xs text-neutral-500">{selectedDecisionMeta.note}</p>
                        </div>
                      )}

                      <div className="mt-5 flex flex-wrap gap-3">
                        <button
                          type="button"
                          onClick={() => applyDecision('accepted')}
                          disabled={isActionDisabled || selectedClaim.decision === 'accepted'}
                          className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                            isActionDisabled || selectedClaim.decision === 'accepted'
                              ? 'cursor-not-allowed bg-white/40 text-black/60'
                              : 'bg-white text-black hover:bg-neutral-200'
                          }`}
                        >
                          Accept fix
                        </button>
                        <button
                          type="button"
                          onClick={() => applyDecision('rejected')}
                          disabled={isActionDisabled || selectedClaim.decision === 'rejected'}
                          className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                            isActionDisabled || selectedClaim.decision === 'rejected'
                              ? 'cursor-not-allowed border-white/20 text-white/50'
                              : 'border-white/20 text-white hover:border-white/40'
                          }`}
                        >
                          Reject
                        </button>
                        <button
                          type="button"
                          onClick={() => applyDecision('research')}
                          disabled={isActionDisabled || selectedClaim.decision === 'research'}
                          className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                            isActionDisabled || selectedClaim.decision === 'research'
                              ? 'cursor-not-allowed border-white/10 text-white/50'
                              : 'border-white/10 text-white/80 hover:border-white/30'
                          }`}
                        >
                          Research further
                        </button>
                      </div>

                      {isActionDisabled && (
                        <p className="mt-4 text-xs text-neutral-500">Verified claims are locked. Switch to another claim to take action.</p>
                      )}

                      <div className="mt-6 space-y-3 text-sm text-neutral-300">
                        {selectedClaim.sources?.length ? (
                          selectedClaim.sources.map((source) => (
                            <div key={source.name} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-[#111111] px-4 py-3">
                              <Globe className="mt-1 h-4 w-4 text-[#a3ff12]" />
                              <div>
                                <p className="text-sm font-semibold text-white">{source.name}</p>
                                <p className="mt-1 text-xs text-neutral-500">{source.detail}</p>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="rounded-2xl border border-dashed border-white/10 bg-[#111111] px-4 py-6 text-center text-xs text-neutral-500">
                            No sources attached yet. Launch a new search or upload supporting material.
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    <p className="mt-4 text-sm text-neutral-400">Select a claim from the queue to view suggested fixes and evidence.</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-[36px] border border-white/10 bg-white/[0.03] p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">Collaboration</p>
                  <h3 className="mt-2 text-lg font-semibold text-white">Comments & assignments</h3>
                </div>
                <MessageSquare className="h-5 w-5 text-[#7dd3fc]" />
              </div>
              <div className="mt-6 space-y-4">
                {commentThreads.map((comment) => (
                  <div key={comment.author} className="rounded-2xl border border-white/10 bg-[#0b0b0b] p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-sm font-semibold text-white">
                          {comment.initials}
                        </span>
                        <div>
                          <p className="text-sm font-semibold text-white">{comment.author}</p>
                          <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">{comment.role}</p>
                        </div>
                      </div>
                      <span className="text-xs text-neutral-500">{comment.time}</span>
                    </div>
                    <p className="mt-3 text-sm text-neutral-300">{comment.message}</p>
                  </div>
                ))}
              </div>
              <button className="mt-6 w-full rounded-full bg-white py-2 text-sm font-semibold text-black transition hover:bg-neutral-200">
                Add comment
              </button>
            </div>

            <div className="rounded-[36px] border border-white/10 bg-white/[0.03] p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">Workflow</p>
                  <h3 className="mt-2 text-lg font-semibold text-white">Review stages</h3>
                </div>
                <Users className="h-5 w-5 text-[#a3ff12]" />
              </div>
              <div className="mt-6 space-y-4">
                {workflowStages.map((stage) => (
                  <div key={stage.title} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#0b0b0b] px-4 py-3">
                    <CheckCircle2 className="h-5 w-5 text-[#a3ff12]" />
                    <div>
                      <p className="text-sm font-semibold text-white">{stage.title}</p>
                      <p className="text-xs text-neutral-400">{stage.detail}</p>
                      <p className="text-[11px] uppercase tracking-[0.3em] text-neutral-500">{stage.meta}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button className="mt-6 w-full rounded-full border border-white/10 py-2 text-sm font-semibold text-white transition hover:border-white/30">
                Configure approvals
              </button>
            </div>
          </aside>
        </section>

        <section className="mt-10 grid gap-6 xl:grid-cols-[1.3fr,0.7fr]">
          <div className="rounded-[36px] border border-white/10 bg-white/[0.03] p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">Batch processing</p>
                <h3 className="mt-2 text-xl font-semibold text-white">Automation queue</h3>
                <p className="mt-1 text-sm text-neutral-400">Schedule bulk document reviews and monitor completion in real time.</p>
              </div>
              <UploadCloud className="h-6 w-6 text-[#7dd3fc]" />
            </div>
            <div className="mt-6 space-y-4">
              {batchQueue.map((job) => (
                <div key={job.title} className="rounded-3xl border border-white/10 bg-[#090909] p-5">
                  <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-neutral-300">
                    <div>
                      <p className="text-sm font-semibold text-white">{job.title}</p>
                      <p className="text-xs text-neutral-500">{job.documents} documents · {job.status}</p>
                    </div>
                    <span className="rounded-full bg-[#111111] px-3 py-1 text-xs text-neutral-400">{job.eta}</span>
                  </div>
                  <p className="mt-3 text-xs uppercase tracking-[0.3em] text-neutral-500">{job.progressLabel}</p>
                  <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/10">
                    <div
                      className={`h-full rounded-full ${
                        job.progressValue >= 100
                          ? 'bg-[#34d399]'
                          : job.progressValue === 0
                          ? 'bg-[#7dd3fc]/30'
                          : 'bg-white'
                      }`}
                      style={{ width: `${job.progressValue}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <button className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-neutral-200">
                New batch job
              </button>
              <button className="rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:border-white/30">
                View reports
              </button>
            </div>
          </div>

          <div className="rounded-[36px] border border-white/10 bg-white/[0.03] p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">Compliance & security</p>
                <h3 className="mt-2 text-xl font-semibold text-white">Controls overview</h3>
                <p className="mt-1 text-sm text-neutral-400">Enterprise guardrails keep sensitive workspaces audit-ready.</p>
              </div>
              <Lock className="h-6 w-6 text-[#a3ff12]" />
            </div>
            <div className="mt-6 space-y-4">
              {complianceChecklist.map((item) => (
                <div key={item.title} className="flex items-center justify-between gap-3 rounded-3xl border border-white/10 bg-[#0b0b0b] px-4 py-4">
                  <div>
                    <p className="text-sm font-semibold text-white">{item.title}</p>
                    <p className="text-xs text-neutral-400">{item.detail}</p>
                  </div>
                  <span className="rounded-full bg-[#111111] px-3 py-1 text-xs uppercase tracking-[0.3em] text-[#a3ff12]">{item.state}</span>
                </div>
              ))}
            </div>
            <button className="mt-6 w-full rounded-full border border-white/10 py-2 text-sm font-semibold text-white transition hover:border-white/30">
              View audit trail
            </button>
          </div>
        </section>

        <section className="grid flex-1 gap-6 lg:grid-cols-[1.6fr,1fr]">
          <div className="grid gap-6 rounded-[32px] border border-white/10 bg-white/[0.04] p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">Investigation queue</p>
                <h2 className="mt-2 text-xl font-semibold text-white">Active reviews</h2>
              </div>
              <button className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1 text-xs font-semibold text-white transition hover:border-white/30">
                View all
                <ArrowUpRight className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#121212] via-[#0b0b0b] to-[#050505] p-6">
                <div className="flex items-center justify-between text-sm text-neutral-400">
                  <span>Conversation agent</span>
                  <Layers className="h-4 w-4 text-[#a3ff12]" />
                </div>
                <p className="mt-4 text-base text-neutral-300">
                  "The Eiffel Tower opened in 1920 to celebrate the Paris games."
                </p>
                <div className="mt-6 flex items-center justify-between text-xs text-neutral-500">
                  <span>Confidence 62%</span>
                  <span>Escalated · QA team</span>
                </div>
                <div className="mt-4 flex gap-3">
                  <button className="flex-1 rounded-full bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-neutral-200">
                    Approve correction
                  </button>
                  <button className="flex-1 rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:border-white/30">
                    Request rewrite
                  </button>
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#111111] via-[#0a0a0a] to-[#050505] p-6">
                <div className="flex items-center justify-between text-sm text-neutral-400">
                  <span>Search assistant</span>
                  <BarChart3 className="h-4 w-4 text-[#7dd3fc]" />
                </div>
                <p className="mt-4 text-base text-neutral-300">
                  "Venus completes a full orbit around the sun every 160 days."
                </p>
                <div className="mt-6 flex items-center justify-between text-xs text-neutral-500">
                  <span>Confidence 48%</span>
                  <span>Flagged · awaiting data</span>
                </div>
                <div className="mt-4 flex gap-3">
                  <button className="flex-1 rounded-full bg-[#161616] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#1f1f1f]">
                    Schedule review
                  </button>
                  <button className="flex-1 rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:border-white/30">
                    Add citation
                  </button>
                </div>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-[1.3fr,0.7fr]">
              <div className="rounded-3xl border border-white/10 bg-[#0b0b0b]/80 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">Review velocity</p>
                    <h3 className="mt-2 text-lg font-semibold text-white">Cycle analytics</h3>
                  </div>
                  <Activity className="h-5 w-5 text-[#a3ff12]" />
                </div>
                <div className="mt-6 h-48 rounded-3xl border border-white/10 bg-gradient-to-br from-[#161616] via-[#0d0d0d] to-[#050505]" />
                <p className="mt-4 text-xs text-neutral-500">
                  Updated 3 minutes ago · View historical trends in the analytics tab
                </p>
              </div>

              <div className="flex flex-col justify-between rounded-3xl border border-white/10 bg-[#090909] p-6">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">Automation</p>
                  <h3 className="mt-2 text-lg font-semibold text-white">Playbooks</h3>
                  <ul className="mt-5 space-y-4 text-sm text-neutral-300">
                    {automationPlaybooks.map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <span className="mt-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-[#a3ff12]/20 text-[10px] text-[#a3ff12]">
                          <CheckCircle2 className="h-3 w-3" />
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <button className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-neutral-200">
                  Manage automations
                  <ArrowUpRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          <aside className="flex flex-col gap-6">
            <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">Team focus</p>
                  <h3 className="mt-2 text-lg font-semibold text-white">Review leaderboard</h3>
                </div>
                <ShieldCheck className="h-5 w-5 text-[#a3ff12]" />
              </div>
              <div className="mt-6 space-y-3 text-sm text-neutral-300">
                {[
                  { name: 'Hayden M.', metric: '18 reviews · 99% confidence' },
                  { name: 'Priya C.', metric: '14 reviews · 2 escalations' },
                  { name: 'Samir L.', metric: '11 reviews · 97% satisfaction' },
                ].map((person) => (
                  <div key={person.name} className="rounded-2xl border border-white/10 bg-[#090909] px-4 py-3">
                    <p className="text-sm font-semibold text-white">{person.name}</p>
                    <p className="mt-1 text-xs text-neutral-500">{person.metric}</p>
                  </div>
                ))}
              </div>
              <button className="mt-5 w-full rounded-full border border-white/10 py-2 text-sm font-semibold text-white transition hover:border-white/30">
                Assign reviewers
              </button>
            </div>

            <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">Alerts</p>
              <h3 className="mt-2 text-lg font-semibold text-white">Recent activity</h3>
              <div className="mt-6 space-y-4 text-sm text-neutral-300">
                {[
                  {
                    title: 'Prompt "Knowledge base" spiked risk',
                    detail: 'Rolled back to stable guardrail · 2m ago',
                  },
                  {
                    title: 'Healthcare workspace imported 4 docs',
                    detail: 'Auto-citations enabled · 12m ago',
                  },
                  {
                    title: 'Finance chatbot shipped patch',
                    detail: 'Precision raised to 92% · 45m ago',
                  },
                ].map((event) => (
                  <div key={event.title} className="rounded-2xl border border-white/10 bg-[#090909] px-4 py-3">
                    <p className="text-sm font-semibold text-white">{event.title}</p>
                    <p className="mt-1 text-xs text-neutral-500">{event.detail}</p>
                  </div>
                ))}
              </div>
              <button className="mt-5 w-full rounded-full bg-white py-2 text-sm font-semibold text-black transition hover:bg-neutral-200">
                Configure alerts
              </button>
            </div>
          </aside>
        </section>
      </div>
    </AppShell>
  );
}
