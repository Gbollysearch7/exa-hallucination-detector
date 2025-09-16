import { ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';
import Link from 'next/link';

const navLinks = [
  { name: 'Platform', href: '#product' },
  { name: 'Workflow', href: '#solutions' },
  { name: 'Resources', href: '#resources' },
  { name: 'Pricing', href: '#pricing' },
  { name: 'Dashboard', href: '/dashboard' },
];

const stats = [
  { value: '95%', label: 'Reduction in factual errors after rollout' },
  { value: '70%', label: 'Less manual fact-checking time per doc' },
  { value: '80%', label: 'Return to review queue within 7 days' },
  { value: '100K', label: 'Monthly documents verified target' },
];

const featureCards = [
  {
    title: 'Claim extraction workspace',
    body:
      'Split-screen editing highlights risky passages, keeps context inline, and shows Groq-powered suggestions instantly.',
    pill: 'FactCheck editor',
  },
  {
    title: 'Verified corrections with sources',
    body:
      'Cross-check every statement against Exa search results and approve fixes backed by citations your legal team will trust.',
    pill: 'Cited responses',
  },
];

const timeline = [
  {
    eyebrow: 'Day 1',
    title: 'Import and analyse drafts',
    copy:
      'Drop in content via paste, upload, or API. FactCheck AI extracts every claim and builds an audit-ready workspace.',
  },
  {
    eyebrow: 'Week 1',
    title: 'Calibrate accuracy thresholds',
    copy:
      'Tune severity levels, automate batch jobs, and route high-risk claims to reviewers with one click.',
  },
  {
    eyebrow: 'Week 3',
    title: 'Ship compliant content',
    copy:
      'Export corrected copy, share verification reports, and keep audit logs synced with your compliance stack.',
  },
];

const testimonial = {
  quote:
    'FactCheck AI keeps our AI writers honest. Every launch now ships with citations, reviewer sign-off, and zero late-stage rewrites.',
  person: 'Amelia Byrne — Head of AI Ops, Northwind',
};

const ctaChecklist = [
  'Book a workflow audit with our AI safety engineers',
  'Run your own prompts through the FactCheck workspace',
  'Launch a verified content program this quarter',
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <div className="relative mx-auto flex min-h-screen w-full max-w-[1440px] flex-col overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(80,90,255,0.18),_transparent_60%)]" />
        <div className="pointer-events-none absolute top-1/3 left-1/2 -z-10 h-[480px] w-[480px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,_rgba(238,255,0,0.12),_transparent_60%)] blur-3xl" />

        <header className="sticky top-0 z-20 bg-[#050505]/80 backdrop-blur-md">
          <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
            <Link href="#" className="text-lg font-semibold tracking-tight">
              FactCheck<br />
              <span className="text-sm font-normal text-neutral-400">AI</span>
            </Link>
            <nav className="hidden items-center gap-10 text-sm text-neutral-300 md:flex">
              {navLinks.map((link) => (
                <Link key={link.name} href={link.href} className="transition-colors hover:text-white">
                  {link.name}
                </Link>
              ))}
            </nav>
            <div className="flex items-center gap-3">
              <button className="hidden rounded-full border border-neutral-700 px-4 py-2 text-sm font-medium text-neutral-200 transition hover:border-neutral-500 hover:text-white md:block">
                Sign in
              </button>
              <button className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-neutral-200">
                Book a demo
              </button>
            </div>
          </div>
        </header>

        <section className="relative z-10 flex flex-col items-center px-6 pb-24 pt-20 text-center md:pt-28">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2 text-sm text-neutral-200">
            <Sparkles className="h-4 w-4 text-[#a3ff12]" />
            <span>Now shipping • FactCheck AI control center</span>
          </div>

          <h1 className="text-balance font-serif text-4xl leading-tight text-white sm:text-5xl md:text-6xl">
            Publish AI content that stands up to scrutiny.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-neutral-300">
            FactCheck AI extracts every claim, verifies it against Exa search, and lets your team approve Groq-powered corrections in seconds. No more guesswork—every answer ships with proof.
          </p>

          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row">
            <button className="flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-neutral-200">
              Explore the dashboard
              <ArrowRight className="h-4 w-4" />
            </button>
            <button className="flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:border-white/40">
              Watch the product tour
            </button>
          </div>

          <div className="relative mt-16 flex w-full max-w-5xl flex-col items-center">
            <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle,_rgba(255,255,255,0.1),_transparent_65%)]" />
            <div className="grid w-full grid-cols-1 gap-8 md:grid-cols-[1fr_auto_1fr] md:items-center">
              <div className="flex flex-col gap-4 text-left text-neutral-300 md:pr-6">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <p className="text-sm text-neutral-400">Flagged completion</p>
                  <p className="mt-3 text-base text-neutral-200">“The Apollo 11 landing took place in 1972 and was led by Neil Armstrong and Buzz Lightyear.”</p>
                  <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#2b2b2b] px-3 py-1 text-xs text-[#ffb347]">
                    <span className="h-2 w-2 rounded-full bg-[#ffb347]" />
                    Potential hallucination
                  </div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <p className="text-sm text-neutral-400">Exa suggestions</p>
                  <p className="mt-3 text-base text-neutral-200">Buzz Aldrin co-piloted the lunar module with Armstrong in the 1969 mission.</p>
                  <p className="mt-2 text-xs text-neutral-500">Sourced via Exa • confidence 98%</p>
                </div>
              </div>

              <div className="relative mx-auto flex h-[520px] w-[260px] items-center justify-center rounded-[40px] border border-white/10 bg-[#0f0f0f] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.45)]">
                <div className="relative h-full w-full overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-b from-[#101010] via-[#141414] to-[#050505]">
                  <div className="flex h-full flex-col justify-between p-6">
                    <div className="space-y-4 text-left">
                      <div className="rounded-lg bg-white/5 p-3 text-xs text-neutral-300">
                        Risk summary
                        <p className="mt-2 text-base font-semibold text-white">2 hallucinations detected</p>
                      </div>
                      <div className="rounded-lg border border-white/10 bg-[#0b0b0b] p-4">
                        <p className="text-xs text-neutral-400">Confidence</p>
                        <p className="mt-1 flex items-baseline gap-1 text-3xl font-semibold text-white">
                          92%
                          <span className="text-xs font-normal text-neutral-500">verified</span>
                        </p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between rounded-lg bg-[#131313] p-3 text-xs text-neutral-300">
                        <span>Precision mode</span>
                        <span className="rounded-full bg-[#1f1f1f] px-2 py-1 text-[10px] text-[#a3ff12]">ON</span>
                      </div>
                      <button className="w-full rounded-full bg-white py-3 text-sm font-semibold text-black">
                        Push safe response
                      </button>
                    </div>
                  </div>
                </div>
                <div className="absolute -left-14 top-14 hidden w-40 rounded-2xl border border-white/10 bg-white/5 p-4 text-left text-sm text-neutral-200 md:block">
                  <p className="font-semibold text-white">LLM guardrail</p>
                  <p className="mt-2 text-xs text-neutral-400">Auto-correct hallucinations with human readable diffs.</p>
                </div>
                <div className="absolute -right-16 bottom-16 hidden w-44 rounded-2xl border border-white/10 bg-white/5 p-4 text-left text-sm text-neutral-200 md:block">
                  <p className="font-semibold text-white">Citations</p>
                  <p className="mt-2 text-xs text-neutral-400">Trusted sources appended directly to the completion.</p>
                </div>
              </div>

              <div className="flex flex-col gap-4 text-left text-neutral-300 md:pl-6">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <p className="text-sm text-neutral-400">Live metrics</p>
                  <p className="mt-3 text-base text-neutral-200">Track reviewer throughput, response latency, and model accuracy directly from the control center.</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <p className="text-sm text-neutral-400">Audit trail</p>
                  <p className="mt-3 text-base text-neutral-200">Every decision is logged with reviewer notes, timestamps, and exportable proof packs.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-6 border-t border-white/10 bg-[#050505] px-6 py-12" id="product">
          <p className="text-center text-xs uppercase tracking-[0.3em] text-neutral-500">Trusted by forward teams</p>
          <div className="mx-auto grid w-full max-w-5xl grid-cols-2 gap-4 text-neutral-400 sm:grid-cols-3 md:grid-cols-6">
            {['AssemblyAI', 'Vercel', 'Superhuman', 'Linear', 'Mercury', 'Zipline'].map((logo) => (
              <div key={logo} className="flex h-14 items-center justify-center rounded-xl border border-white/5 bg-white/[0.02] text-sm font-medium">
                {logo}
              </div>
            ))}
          </div>
        </section>

        <section className="border-y border-white/10 bg-[#050505] px-6 py-20" id="solutions">
          <div className="mx-auto grid w-full max-w-6xl gap-12 md:grid-cols-2">
            {featureCards.map((card) => (
              <div key={card.title} className="relative overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.04] p-10">
                <div className="absolute inset-x-6 top-6 h-8 rounded-full border border-white/10 bg-white/10 text-center text-xs font-medium uppercase tracking-[0.2em] text-[#a3ff12]/80">
                  <div className="flex h-full items-center justify-center">{card.pill}</div>
                </div>
                <div className="mt-16 space-y-6">
                  <h3 className="text-2xl font-semibold text-white">{card.title}</h3>
                  <p className="text-neutral-300">{card.body}</p>
                  <button className="flex items-center gap-2 text-sm font-semibold text-white">
                    Explore use case
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="border-b border-white/10 bg-[#050505] px-6 py-20">
          <div className="mx-auto grid w-full max-w-6xl gap-12 md:grid-cols-[1.1fr,0.9fr]">
            <div className="rounded-[32px] border border-white/10 bg-white/[0.05] p-10">
              <p className="text-sm uppercase tracking-[0.3em] text-[#a3ff12]">Numbers that matter</p>
              <div className="mt-10 grid gap-8 sm:grid-cols-2">
                {stats.map((stat) => (
                  <div key={stat.label} className="rounded-2xl border border-white/10 bg-[#0d0d0d] p-6">
                    <p className="text-4xl font-semibold text-white">{stat.value}</p>
                    <p className="mt-3 text-sm text-neutral-400">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex h-full flex-col justify-between gap-8">
              <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-8">
                <p className="text-sm uppercase tracking-[0.3em] text-neutral-500">Live dashboard</p>
                <div className="mt-6 h-64 rounded-2xl border border-white/10 bg-gradient-to-br from-[#101010] via-[#090909] to-[#050505]" />
                <p className="mt-6 text-sm text-neutral-400">
                  Ship dashboards to stakeholders with real-time hallucination benchmarks, detection accuracy, and trending topics.
                </p>
              </div>
              <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-8">
                <p className="text-sm uppercase tracking-[0.3em] text-neutral-500">Security</p>
                <p className="mt-4 text-neutral-300">SOC 2 Type II, end-to-end encryption, and granular user permissions keep sensitive prompts safe.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-white/10 bg-[#050505] px-6 py-20" id="resources">
          <div className="mx-auto flex w-full max-w-5xl flex-col items-center text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">Customer spotlight</p>
            <blockquote className="mt-8 max-w-3xl text-balance text-2xl text-neutral-100">“{testimonial.quote}”</blockquote>
            <p className="mt-6 text-sm text-neutral-400">{testimonial.person}</p>
          </div>
        </section>

        <section className="border-b border-white/10 bg-[#050505] px-6 py-20">
          <div className="mx-auto grid w-full max-w-6xl gap-12 md:grid-cols-2">
            <div className="space-y-8">
              <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">Path to production</p>
              <h2 className="text-3xl font-semibold text-white">Deploy guardrails without slowing teams down.</h2>
              <div className="space-y-6">
                {timeline.map((stop) => (
                  <div key={stop.title} className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
                    <p className="text-sm uppercase tracking-[0.25em] text-[#a3ff12]/80">{stop.eyebrow}</p>
                    <h3 className="mt-3 text-xl font-semibold text-white">{stop.title}</h3>
                    <p className="mt-3 text-sm text-neutral-300">{stop.copy}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative flex items-center justify-center">
              <div className="absolute inset-0 -z-10 rounded-[36px] bg-[radial-gradient(circle,_rgba(163,255,18,0.08),_transparent_70%)] blur-3xl" />
              <div className="h-[460px] w-full max-w-sm rounded-[36px] border border-white/10 bg-[#0f0f0f] p-10">
                <div className="space-y-6">
                  <div className="flex items-center justify-between text-sm text-neutral-400">
                    <span>Alert volume</span>
                    <span>Weekly</span>
                  </div>
                  <div className="h-40 rounded-2xl border border-white/10 bg-gradient-to-br from-[#121212] via-[#0a0a0a] to-[#050505]" />
                  <div className="space-y-4 text-sm text-neutral-300">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex h-3 w-3 rounded-full bg-[#a3ff12]" />
                      Guardrail patches shipped
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="inline-flex h-3 w-3 rounded-full bg-[#7dd3fc]" />
                      Risk reviews completed
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="inline-flex h-3 w-3 rounded-full bg-[#fca5a5]" />
                      Critical incidents prevented
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-white/10 bg-[#050505] px-6 py-20" id="pricing">
          <div className="mx-auto grid w-full max-w-5xl gap-12 md:grid-cols-[1.1fr,0.9fr]">
            <div className="rounded-[36px] border border-white/10 bg-gradient-to-br from-[#fafafa0d] via-[#fefefe05] to-transparent p-10">
              <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">Pricing that scales</p>
              <h2 className="mt-6 text-3xl font-semibold text-white">Usage-based plans for any AI org.</h2>
              <p className="mt-4 text-sm text-neutral-300">
                Start with our generous developer tier and grow into enterprise workflows with SSO, advanced analytics, and compliance-ready exports.
              </p>
              <div className="mt-10 grid gap-4 text-sm text-neutral-200">
                {['5k monitored completions free every month', 'Unlimited team seats & environments', 'SOC2, HIPAA, and GDPR compliant'].map((perk) => (
                  <div key={perk} className="flex items-center gap-3">
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#a3ff12]/20">
                      <CheckCircle2 className="h-4 w-4 text-[#a3ff12]" />
                    </span>
                    {perk}
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-[36px] border border-white/10 bg-white text-black">
              <div className="h-full rounded-[36px] bg-white p-10">
                <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">Enterprise</p>
                <h3 className="mt-6 text-3xl font-semibold text-black">Book a tailored tour</h3>
                <p className="mt-4 text-sm text-neutral-600">
                  Align FactCheck AI with your governance model, compliance needs, and editorial workflow.
                </p>
                <div className="mt-10 space-y-4 text-sm text-neutral-700">
                  {ctaChecklist.map((item) => (
                    <div key={item} className="flex items-start gap-3">
                      <span className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-black text-xs text-white">✓</span>
                      {item}
                    </div>
                  ))}
                </div>
                <button className="mt-10 w-full rounded-full bg-black py-3 text-sm font-semibold text-white">
                  Talk to sales
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-white/10 bg-[#050505] px-6 py-20">
          <div className="mx-auto flex w-full max-w-4xl flex-col items-center text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">Get started</p>
            <h2 className="mt-6 text-3xl font-semibold text-white">Launch trustworthy AI experiences today.</h2>
            <p className="mt-4 max-w-2xl text-sm text-neutral-300">
              Join teams who certify every AI answer before it publishes. FactCheck AI pairs Exa search with Groq inference to deliver verified copy at production speed.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <button className="flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-neutral-200">
                Try FactCheck AI
              </button>
              <button className="flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:border-white/40">
                Book a demo
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </section>

        <footer className="bg-[#050505] px-6 pb-16 pt-12">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 md:flex-row md:items-start md:justify-between">
            <div className="space-y-4 text-sm text-neutral-400">
              <p className="text-lg font-semibold text-white">FactCheck AI</p>
              <p>Verify every AI answer with real-time fact-checking, citations, and human oversight.</p>
              <div className="flex gap-4 text-sm text-neutral-500">
                <Link href="#">Privacy</Link>
                <Link href="#">Security</Link>
                <Link href="#">Status</Link>
              </div>
            </div>
            <div className="grid flex-1 grid-cols-2 gap-8 text-sm text-neutral-400 sm:grid-cols-3">
              <div>
                <p className="mb-4 text-sm font-semibold text-white">Product</p>
                <ul className="space-y-2">
                  <li><Link href="#product" className="hover:text-white">Overview</Link></li>
                  <li><Link href="#solutions" className="hover:text-white">Use cases</Link></li>
                  <li><Link href="#pricing" className="hover:text-white">Pricing</Link></li>
                </ul>
              </div>
              <div>
                <p className="mb-4 text-sm font-semibold text-white">Company</p>
                <ul className="space-y-2">
                  <li><Link href="#resources" className="hover:text-white">Blog</Link></li>
                  <li><Link href="#" className="hover:text-white">Careers</Link></li>
                  <li><Link href="#" className="hover:text-white">Press</Link></li>
                </ul>
              </div>
              <div>
                <p className="mb-4 text-sm font-semibold text-white">Support</p>
                <ul className="space-y-2">
                  <li><Link href="#" className="hover:text-white">Docs</Link></li>
                  <li><Link href="#" className="hover:text-white">Contact</Link></li>
                  <li><Link href="#" className="hover:text-white">Security</Link></li>
                </ul>
              </div>
            </div>
          </div>
          <p className="mx-auto mt-12 w-full max-w-6xl text-xs text-neutral-600">
            © {new Date().getFullYear()} Exa. All rights reserved.
          </p>
        </footer>
      </div>
    </main>
  );
}
