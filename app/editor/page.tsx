'use client';

import { AppShell } from '@/components/AppShell';
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  ClipboardList,
  FileText,
  Globe,
  MessageSquare,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';

interface SourceItem {
  name: string;
  detail: string;
}

type Severity = 'Critical' | 'Warning' | 'Minor' | 'Verified';

type Decision = 'pending' | 'accepted' | 'rejected' | 'research';

interface ClaimItem {
  id: string;
  severity: Severity;
  badgeClass: string;
  excerpt: string;
  location: string;
  confidence: string;
  status: string;
  correction?: string;
  sources?: SourceItem[];
  decision?: Decision;
  decisionNote?: string;
  updatedAt?: string;
}

const initialClaims: ClaimItem[] = [
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
        detail: 'Mission transcript verifying the 1969 lunar landing and crew roster.',
      },
      {
        name: 'Smithsonian lunar archive',
        detail: 'Primary source confirming Neil Armstrong and Buzz Aldrin leadership.',
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
    correction:
      'Apollo 11 spent about eight days from launch to splashdown, with roughly 59 hours in lunar orbit.',
    sources: [
      { name: 'JSC mission timeline', detail: 'Breakdown of mission phase durations.' },
    ],
  },
  {
    id: 'CLM-206',
    severity: 'Minor',
    badgeClass: 'bg-[#34d399]/20 text-[#34d399]',
    excerpt: '"NASA celebrated with a ticker tape parade the next morning."',
    location: 'Paragraph 6 · Line 1',
    confidence: '73% confidence',
    status: 'Needs updated context',
    correction:
      'Ticker-tape parades occurred on August 13, 1969, several weeks after splashdown.',
  },
  {
    id: 'CLM-207',
    severity: 'Verified',
    badgeClass: 'bg-[#a3ff12]/20 text-[#a3ff12]',
    excerpt: '"Landing site: Sea of Tranquility on the lunar surface."',
    location: 'Paragraph 7 · Line 4',
    confidence: '97% confidence',
    status: 'Fully supported',
    sources: [
      { name: 'NASA press kit', detail: 'Confirms landing site coordinates.' },
    ],
  },
];

const claimTabs: Array<{ id: 'All' | Severity; label: string }> = [
  { id: 'All', label: 'All claims' },
  { id: 'Critical', label: 'Critical' },
  { id: 'Warning', label: 'Warnings' },
  { id: 'Minor', label: 'Minor' },
  { id: 'Verified', label: 'Verified' },
];

const decisionCopy: Record<Exclude<Decision, 'pending'>, { status: string; note: string }> = {
  accepted: {
    status: 'Fix applied',
    note: 'Updated draft with corrected information and citations.',
  },
  rejected: {
    status: 'Marked as intentionally kept',
    note: 'Reason documented in audit log for compliance review.',
  },
  research: {
    status: 'Escalated for deeper research',
    note: 'Assigned to research queue with reminder to attach sources.',
  },
};

export default function EditorPage() {
  const [claims, setClaims] = useState<ClaimItem[]>(initialClaims);
  const [activeTab, setActiveTab] = useState<'All' | Severity>('All');
  const [selectedId, setSelectedId] = useState<string>(initialClaims[0].id);

  const filteredClaims = useMemo(() => {
    if (activeTab === 'All') return claims;
    return claims.filter((claim) => claim.severity === activeTab);
  }, [activeTab, claims]);

  const selectedClaim = useMemo(() => {
    return claims.find((claim) => claim.id === selectedId) ?? filteredClaims[0] ?? claims[0];
  }, [claims, filteredClaims, selectedId]);

  const selectClaim = (id: string) => setSelectedId(id);

  const applyDecision = (decision: Exclude<Decision, 'pending'>) => {
    if (!selectedClaim) return;
    const stamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const copy = decisionCopy[decision];

    setClaims((prev) =>
      prev.map((claim) =>
        claim.id === selectedClaim.id
          ? {
              ...claim,
              decision,
              status: copy.status,
              decisionNote: copy.note,
              updatedAt: stamp,
            }
          : claim,
      ),
    );
  };

  const decisionMeta =
    selectedClaim && selectedClaim.decision && selectedClaim.decision !== 'pending'
      ? decisionCopy[selectedClaim.decision]
      : undefined;

  const isLocked = selectedClaim?.severity === 'Verified';

  return (
    <AppShell>
      <div className="relative mx-auto flex min-h-screen w-full max-w-[1440px] flex-col overflow-hidden px-6 pb-16 pt-8">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(80,90,255,0.18),_transparent_70%)]" />
        <div className="pointer-events-none absolute top-1/4 left-1/2 -z-10 h-[540px] w-[540px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,_rgba(163,255,18,0.12),_transparent_70%)] blur-3xl" />

        <header className="flex flex-col gap-6 pb-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">Document workspace</p>
              <h1 className="mt-2 text-3xl font-semibold text-white">Apollo launch narrative — draft v3</h1>
              <p className="mt-2 text-sm text-neutral-400">
                Last synced 4 minutes ago · 12 claims detected · Owner Marcus L.
              </p>
              <div className="mt-4 flex flex-wrap gap-3 text-xs text-neutral-400">
                <span className="inline-flex items-center gap-2 rounded-full bg-[#a3ff12]/15 px-3 py-1 font-semibold uppercase tracking-[0.25em] text-[#a3ff12]">
                  <Sparkles className="h-3 w-3" /> Confidence 73%
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-[#111111] px-3 py-1">
                  <Activity className="h-3 w-3 text-[#7dd3fc]" /> Real-time sync on
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-[#111111] px-3 py-1">
                  <ClipboardList className="h-3 w-3 text-neutral-500" /> Reviewed 6m ago
                </span>
              </div>
            </div>
            <div className="flex flex-wrap justify-end gap-3">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:border-white/30"
              >
                <ArrowLeft className="h-4 w-4" /> Back to overview
              </Link>
              <button className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:border-white/30">
                Share
              </button>
              <button className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-neutral-200">
                Export report
                <ArrowUpRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </header>

        <section className="flex flex-1 flex-col gap-6 xl:flex-row">
          <div className="flex flex-1 flex-col gap-6">
            <div className="rounded-[32px] border border-white/10 bg-white/[0.04] p-6">
              <div className="flex items-center justify-between text-xs text-neutral-400">
                <span className="inline-flex items-center gap-2 text-neutral-300">
                  <FileText className="h-4 w-4 text-neutral-500" /> Inline review mode
                </span>
                <span className="rounded-full bg-[#111111] px-3 py-1 text-[11px] text-neutral-500">Word count · 1,248</span>
              </div>
              <div className="mt-6 space-y-5 text-sm leading-relaxed text-neutral-300">
                <p>
                  Apollo 11 was the first crewed spacecraft to land on the moon, launching from Cape Kennedy in 1969.
                  The mission delivered a live broadcast watched by millions and marked a turning point for human exploration.
                </p>
                <div className="rounded-2xl border border-[#f87171]/30 bg-[#341818]/70 p-5 text-sm text-neutral-200">
                  <p>
                    Our AI assistant states the landing occurred in <span className="mx-1 rounded-md bg-[#f87171]/20 px-2 py-1 text-[#f87171]">1972</span>
                    and credits Neil Armstrong and the fictional astronaut Buzz Lightyear.
                  </p>
                  <p className="mt-3 text-xs uppercase tracking-[0.25em] text-[#f87171]">Critical · Requires correction</p>
                </div>
                <p>
                  After returning to Earth, the crew completed a 21-day quarantine period while NASA evaluated potential contamination risks.
                  The mission concluded successfully on July 24, 1969, with splashdown in the Pacific Ocean.
                </p>
                <div className="rounded-2xl border border-[#facc15]/20 bg-[#2f2916]/60 p-5 text-sm text-neutral-200">
                  <p>
                    Public celebrations included ticker-tape parades and presidential ceremonies, although not immediately "the next morning" as the draft suggests.
                  </p>
                  <p className="mt-3 text-xs uppercase tracking-[0.25em] text-[#facc15]">Warning · Needs context</p>
                </div>
                <div className="rounded-2xl border border-[#34d399]/20 bg-[#17301f]/50 p-5 text-sm text-neutral-200">
                  <p>
                    Verified claim · The lunar module Eagle touched down in the Sea of Tranquility with Armstrong announcing the "giant leap for mankind."
                  </p>
                  <p className="mt-3 text-xs uppercase tracking-[0.25em] text-[#34d399]">Verified · Ready to publish</p>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-3 text-[10px] uppercase tracking-[0.3em] text-neutral-500">
                <span>Critical</span>
                <span className="h-0.5 w-6 bg-[#f87171]" />
                <span>Warning</span>
                <span className="h-0.5 w-6 bg-[#facc15]" />
                <span>Verified</span>
                <span className="h-0.5 w-6 bg-[#34d399]" />
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1.1fr,0.9fr]">
              <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">Activity</p>
                    <h2 className="mt-2 text-lg font-semibold text-white">Reviewer updates</h2>
                  </div>
                  <MessageSquare className="h-5 w-5 text-[#7dd3fc]" />
                </div>
                <div className="mt-6 space-y-4 text-sm text-neutral-300">
                  {[
                    {
                      author: 'Sarah P.',
                      note: 'Anchored intro paragraph with NASA primary source; Buzz Lightyear reference removed.',
                      time: '2m ago',
                    },
                    {
                      author: 'Marcus L.',
                      note: 'Updated mission duration numbers. Need confirmation on parade timeline.',
                      time: '18m ago',
                    },
                    {
                      author: 'Linda C.',
                      note: 'Ensure export includes compliance summary for legal review.',
                      time: '1h ago',
                    },
                  ].map((item) => (
                    <div key={item.author} className="rounded-2xl border border-white/10 bg-[#0b0b0b] px-4 py-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-white">{item.author}</span>
                        <span className="text-xs text-neutral-500">{item.time}</span>
                      </div>
                      <p className="mt-2 text-xs text-neutral-400">{item.note}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">Export status</p>
                    <h2 className="mt-2 text-lg font-semibold text-white">Compliance readiness</h2>
                  </div>
                  <ShieldCheck className="h-5 w-5 text-[#a3ff12]" />
                </div>
                <ul className="mt-6 space-y-3 text-sm text-neutral-300">
                  {[
                    'Audit log synced to SOC2 bucket',
                    'All high severity claims resolved',
                    'Export package includes citations & reviewer notes',
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#0b0b0b] px-4 py-3">
                      <CheckCircle2 className="h-4 w-4 text-[#a3ff12]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <button className="mt-6 w-full rounded-full border border-white/10 py-2 text-sm font-semibold text-white transition hover:border-white/30">
                  View audit report
                </button>
              </div>
            </div>
          </div>

          <aside className="flex w-full max-w-md flex-col gap-6">
            <div className="rounded-[32px] border border-white/10 bg-white/[0.04] p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">Claims</p>
                  <h3 className="mt-2 text-lg font-semibold text-white">Verification queue</h3>
                </div>
                <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-neutral-300">{filteredClaims.length} in view</span>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {claimTabs.map((tab) => {
                  const active = tab.id === activeTab;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
                        active
                          ? 'border-white bg-white text-black'
                          : 'border-white/10 bg-[#101010] text-neutral-300 hover:border-white/30 hover:text-white'
                      }`}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>
              <div className="mt-5 space-y-4">
                {filteredClaims.map((claim) => {
                  const active = claim.id === selectedClaim?.id;
                  return (
                    <button
                      key={claim.id}
                      onClick={() => selectClaim(claim.id)}
                      className={`w-full rounded-2xl border border-white/10 p-4 text-left transition ${
                        active
                          ? 'bg-white text-black shadow-[0_12px_60px_rgba(0,0,0,0.35)]'
                          : 'bg-[#0f0f0f] text-neutral-200 hover:border-white/30'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.3em]">
                        <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 font-semibold ${claim.badgeClass}`}>
                          {claim.severity}
                        </span>
                        <span className={active ? 'text-neutral-500' : 'text-neutral-400'}>{claim.confidence}</span>
                      </div>
                      <p className={`mt-3 text-sm ${active ? 'text-neutral-800' : 'text-neutral-100'}`}>{claim.excerpt}</p>
                      <p className="mt-2 text-xs text-neutral-500">{claim.location}</p>
                      <p className={`mt-2 text-xs font-semibold ${active ? 'text-black/70' : 'text-neutral-400'}`}>{claim.status}</p>
                      {claim.decisionNote && (
                        <p className={`mt-2 text-xs ${active ? 'text-neutral-600' : 'text-neutral-500'}`}>{claim.decisionNote}</p>
                      )}
                      {claim.updatedAt && (
                        <p className={`mt-1 text-[10px] uppercase tracking-[0.3em] ${active ? 'text-neutral-400' : 'text-neutral-500'}`}>
                          Updated {claim.updatedAt}
                        </p>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-6">
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
                    {selectedClaim.correction ?? 'No AI suggestion available. Queue deeper research or add a manual note.'}
                  </p>
                  {decisionMeta && (
                    <div className="mt-4 rounded-2xl border border-white/10 bg-[#111111] p-4 text-sm text-neutral-200">
                      <p className="font-semibold text-white">
                        {decisionMeta.status}
                        {selectedClaim.updatedAt ? ` · ${selectedClaim.updatedAt}` : ''}
                      </p>
                      <p className="mt-1 text-xs text-neutral-500">{decisionMeta.note}</p>
                    </div>
                  )}
                  <div className="mt-5 flex flex-wrap gap-3">
                    <button
                      onClick={() => applyDecision('accepted')}
                      disabled={isLocked || selectedClaim.decision === 'accepted'}
                      className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                        isLocked || selectedClaim.decision === 'accepted'
                          ? 'cursor-not-allowed bg-white/40 text-black/60'
                          : 'bg-white text-black hover:bg-neutral-200'
                      }`}
                    >
                      Accept fix
                    </button>
                    <button
                      onClick={() => applyDecision('rejected')}
                      disabled={isLocked || selectedClaim.decision === 'rejected'}
                      className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                        isLocked || selectedClaim.decision === 'rejected'
                          ? 'cursor-not-allowed border-white/20 text-white/50'
                          : 'border-white/20 text-white hover:border-white/40'
                      }`}
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => applyDecision('research')}
                      disabled={isLocked || selectedClaim.decision === 'research'}
                      className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                        isLocked || selectedClaim.decision === 'research'
                          ? 'cursor-not-allowed border-white/10 text-white/50'
                          : 'border-white/10 text-white/80 hover:border-white/30'
                      }`}
                    >
                      Research further
                    </button>
                  </div>
                  {isLocked && (
                    <p className="mt-3 text-xs text-neutral-500">Verified claims are locked. Select another item to continue reviewing.</p>
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
                <p className="mt-4 text-sm text-neutral-400">Select a claim to see suggested fixes and evidence.</p>
              )}
            </div>

            <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">Export</p>
                  <h3 className="mt-2 text-lg font-semibold text-white">Next steps</h3>
                </div>
                <ArrowRight className="h-5 w-5 text-neutral-500" />
              </div>
              <ul className="mt-5 space-y-3 text-sm text-neutral-300">
                {[
                  'Send corrected draft to legal for review',
                  'Schedule batch verification for customer stories',
                  'Notify stakeholders via Slack integration',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-[#0b0b0b] px-4 py-3">
                    <CheckCircle2 className="mt-1 h-4 w-4 text-[#7dd3fc]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </section>
      </div>
    </AppShell>
  );
}
