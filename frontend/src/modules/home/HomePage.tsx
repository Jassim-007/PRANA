import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'
import { Reveal } from '../../ui/Reveal'

/* ------------------------------------------------------------------ */
/* Small inline icon set (no new dependency — kept intentionally tiny) */
/* ------------------------------------------------------------------ */

function Icon({ path, className = 'h-5 w-5' }: { path: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d={path} stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

const icons = {
  farmer: 'M3 21h18M5 21V10l7-6 7 6v11M9 21v-6h6v6',
  fieldWorker: 'M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11ZM12 13a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z',
  vet: 'M12 2v6M9 5h6M6 10h12l1 4a7 7 0 0 1-14 0l1-4ZM8 21h8',
  shield: 'M12 3l7 3v6c0 4.5-3 8-7 9-4-1-7-4.5-7-9V6l7-3Z',
  activity: 'M3 12h4l2 8 4-16 2 8h6',
  map: 'M9 3 3 5v16l6-2 6 2 6-2V3l-6 2-6-2Zm0 0v16m6-14v16',
  bell: 'M6 8a6 6 0 0 1 12 0c0 4 1.5 5.5 2 6H4c.5-.5 2-2 2-6ZM10 20a2 2 0 0 0 4 0',
  cluster: 'M6 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm12 3a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM8 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm2.2-15.2 4.8 3M9 18.3l6-6.6',
  arrow: 'M5 12h14M13 6l6 6-6 6',
  check: 'M5 13l4 4L19 7',
}

/* ------------------------------------------------------------ */
/* Shared building blocks                                       */
/* ------------------------------------------------------------ */

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string
  title: string
  description?: string
}) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      {eyebrow ? (
        <p className="font-serif text-sm italic text-emerald-800">{eyebrow}</p>
      ) : null}
      <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-[#262322] sm:text-3xl">{title}</h2>
      {description ? <p className="mt-3 font-body text-base leading-relaxed text-stone-600">{description}</p> : null}
    </div>
  )
}

function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-2xl border border-stone-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md ${className}`}
    >
      {children}
    </div>
  )
}

type Disease = { name: string; species: string; signs: string }

const DISEASES: { group: string; items: Disease[] }[] = [
  {
    group: 'Cattle & buffalo',
    items: [
      { name: 'Foot-and-Mouth Disease', species: 'Cattle, buffalo', signs: 'Mouth blisters, lameness, drooling' },
      { name: 'Lumpy Skin Disease', species: 'Cattle, buffalo', signs: 'Skin nodules, fever, swollen nodes' },
      { name: 'Brucellosis', species: 'Cattle, buffalo', signs: 'Abortion, retained placenta' },
      { name: 'Mastitis', species: 'Cattle, buffalo', signs: 'Swollen udder, abnormal milk' },
      { name: 'Bovine Respiratory Disease', species: 'Cattle, buffalo', signs: 'Coughing, nasal discharge, fever' },
    ],
  },
  {
    group: 'Goat & sheep',
    items: [
      { name: 'Peste des Petits Ruminants', species: 'Goat, sheep', signs: 'Fever, mouth sores, diarrhoea' },
      { name: 'Foot-and-Mouth Disease', species: 'Goat, sheep', signs: 'Mouth blisters, lameness' },
      { name: 'Contagious Ecthyma (Orf)', species: 'Goat, sheep', signs: 'Scabby sores on lips and muzzle' },
    ],
  },
  {
    group: 'Poultry',
    items: [
      { name: 'Avian Influenza', species: 'Poultry', signs: 'Sudden deaths, drop in egg production' },
      { name: 'Newcastle Disease', species: 'Poultry', signs: 'Respiratory signs, twisted neck' },
      { name: 'Infectious Bursal Disease', species: 'Poultry', signs: 'Depression, watery droppings' },
    ],
  },
]

const WORKFLOW = [
  { title: 'Farmer reports', body: 'A farmer notices something unusual and reports it in minutes.' },
  { title: 'Field surveillance', body: 'Field workers visit farms and log structured health observations.' },
  { title: 'AI analysis', body: 'Reports are screened against symptom and species patterns.' },
  { title: 'Risk intelligence', body: 'Reports are scored and mapped geographically for context.' },
  { title: 'Veterinary action', body: 'Veterinarians review, validate, and coordinate a response.' },
]

const CAPABILITIES = [
  { icon: icons.activity, title: 'Event-based reporting', body: 'Structured farmer and field-worker reports replace ad-hoc phone calls.' },
  { icon: icons.shield, title: 'AI-assisted analysis', body: 'Symptom patterns are screened for likely disease signatures.' },
  { icon: icons.cluster, title: 'Geospatial clustering', body: 'Nearby reports are grouped to surface emerging risk areas.' },
  { icon: icons.bell, title: 'Alerts', body: 'Veterinary teams are notified when risk signals cross a threshold.' },
  { icon: icons.map, title: 'Risk mapping', body: 'A live map gives field and veterinary teams geographic context.' },
  { icon: icons.check, title: 'Veterinary feedback', body: 'Vets confirm, adjust, or dismiss AI assessments, closing the loop.' },
]

/* ------------------------------------------------------------ */
/* Home page                                                     */
/* ------------------------------------------------------------ */

export function HomePage() {
  return (
    <div className="min-h-screen bg-white font-sans text-[#262322]">
      {/* Top bar */}
      <header className="sticky top-0 z-20 border-b border-stone-200/80 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
          <div className="flex items-center padding-0 gap-2">
            <img
              src="/prana.svg"
              alt="PRANA"
              className="h-8 w-auto max-w-full object-contain sm:h-9 md:h-10"
            />
            <span className="font-heading text-lg font-bold tracking-tight">PRANA</span>
          </div>
          <nav className="hidden items-center gap-6 font-ui text-sm font-medium text-stone-600 sm:flex">
            <a href="#workflow" className="hover:text-[#262322]">How it works</a>
            <a href="#diseases" className="hover:text-[#262322]">Disease awareness</a>
            <a href="#roles" className="hover:text-[#262322]">Get started</a>
          </nav>
        </div>
        <nav className="flex gap-4 overflow-x-auto border-t border-stone-100 px-5 py-2 font-ui text-xs font-medium text-stone-600 sm:hidden">
          <a href="#workflow" className="whitespace-nowrap">How it works</a>
          <a href="#diseases" className="whitespace-nowrap">Disease awareness</a>
          <a href="#roles" className="whitespace-nowrap">Get started</a>
        </nav>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-[#262322]">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, #C1EDCC 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />
        <div className="relative mx-auto max-w-6xl px-5 py-16 sm:py-24">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="animate-fade-up">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#C1EDCC]/30 bg-[#C1EDCC]/10 px-3 py-1 font-ui text-xs font-semibold uppercase tracking-wide text-[#C1EDCC]">
                Livestock health surveillance
              </span>
              <h1 className="mt-5 font-display text-4xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-5xl">
                Detect livestock health risks, earlier.
              </h1>
              <p className="mt-5 max-w-lg font-body text-lg leading-relaxed text-stone-300">
                PRANA connects farmer reports, field surveillance, and AI-assisted risk
                intelligence into one early-warning platform for animal health teams.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#roles"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#C1EDCC] px-6 py-3 font-heading text-sm font-semibold text-[#262322] transition hover:bg-white"
                >
                  Get started
                  <Icon path={icons.arrow} className="h-4 w-4" />
                </a>
                <a
                  href="#workflow"
                  className="inline-flex items-center justify-center rounded-lg border border-white/20 px-6 py-3 font-heading text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  See how it works
                </a>
              </div>
              <dl className="mt-10 grid max-w-md grid-cols-3 gap-4 border-t border-white/10 pt-6 text-white">
                <div>
                  <dt className="font-ui text-xs uppercase tracking-wide text-stone-400">Species covered</dt>
                  <dd className="mt-1 font-display text-xl font-bold">5+</dd>
                </div>
                <div>
                  <dt className="font-ui text-xs uppercase tracking-wide text-stone-400">Workflow roles</dt>
                  <dd className="mt-1 font-display text-xl font-bold">3</dd>
                </div>
                <div>
                  <dt className="font-ui text-xs uppercase tracking-wide text-stone-400">Response loop</dt>
                  <dd className="mt-1 font-display text-xl font-bold">Report → Act</dd>
                </div>
              </dl>
            </div>

            <div className="animate-fade-up [animation-delay:120ms]">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-2xl backdrop-blur">
                <div className="rounded-xl bg-white p-5 shadow-lg">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-stone-500">Regional risk overview</p>
                    <span className="rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-semibold text-red-700 ring-1 ring-red-200">
                      1 critical
                    </span>
                  </div>
                  <div className="mt-4 space-y-2.5">
                    {[
                      { label: 'Suspected cluster — Block A', level: 'HIGH', color: 'bg-orange-500' },
                      { label: 'New field report — Farm 214', level: 'MODERATE', color: 'bg-amber-500' },
                      { label: 'Vaccination visit logged', level: 'LOW', color: 'bg-emerald-500' },
                    ].map((row) => (
                      <div
                        key={row.label}
                        className="flex items-center justify-between rounded-lg border border-stone-100 bg-stone-50 px-3 py-2.5"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className={`h-2 w-2 rounded-full ${row.color}`} />
                          <span className="text-sm font-medium text-stone-700">{row.label}</span>
                        </div>
                        <span className="text-xs font-semibold text-stone-400">{row.level}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <p className="mt-3 text-center text-xs text-stone-400">Illustrative preview of the veterinary dashboard</p>
            </div>
          </div>
        </div>
      </section>

      

      

      {/* How it works */}
      <section id="workflow" className="mx-auto max-w-6xl px-5 py-16 sm:py-20">
        <SectionHeading
          eyebrow="How it works"
          title="From field signal to veterinary action"
          description="PRANA connects community reports and field observations into a structured review loop."
        />
        <div className="mt-10 grid gap-4 md:grid-cols-5">
          {WORKFLOW.map((step, index) => (
            <Reveal key={step.title} delay={index * 70}>
              <Card className="h-full">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#C1EDCC] font-display text-sm font-bold text-[#262322]">
                    {index + 1}
                  </span>
                  <span className="font-ui text-xs font-semibold uppercase tracking-wide text-stone-400">
                    Step {index + 1}
                  </span>
                </div>
                <h3 className="mt-4 font-heading text-base font-bold">{step.title}</h3>
                <p className="mt-2 font-body text-sm leading-relaxed text-stone-600">{step.body}</p>
              </Card>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Disease awareness */}
      <section id="diseases" className="mx-auto max-w-6xl px-5 py-16 sm:py-20">
        <SectionHeading
          eyebrow="Educational reference"
          title="Livestock disease awareness"
          description="Background information on diseases PRANA helps teams watch for — for awareness, not a substitute for veterinary diagnosis."
        />
        <div className="mt-10 space-y-8">
          {DISEASES.map((group, groupIndex) => (
            <Reveal key={group.group} delay={groupIndex * 80}>
              <h3 className="font-ui text-sm font-bold uppercase tracking-wide text-stone-500">{group.group}</h3>
              <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {group.items.map((disease) => (
                  <Card key={disease.name}>
                    <p className="font-ui text-xs font-semibold text-emerald-700">{disease.species}</p>
                    <h4 className="mt-1 font-heading text-base font-bold">{disease.name}</h4>
                    <p className="mt-2 font-body text-sm leading-relaxed text-stone-600">{disease.signs}</p>
                  </Card>
                ))}
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* How PRANA works + Surveillance intelligence */}
      <section id="how-it-works" className="bg-[#262322]">
        <div className="mx-auto max-w-6xl px-5 py-16 text-white sm:py-20">
          <SectionHeading
            eyebrow="Platform capabilities"
            title="Surveillance intelligence, end to end"
          />
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {CAPABILITIES.map((cap, index) => (
              <Reveal key={cap.title} delay={index * 70}>
                <div className="h-full rounded-2xl border border-white/10 bg-white/5 p-5 transition duration-200 hover:border-[#C1EDCC]/40 hover:bg-white/10">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#C1EDCC]/15 text-[#C1EDCC]">
                    <Icon path={cap.icon} className="h-4.5 w-4.5" />
                  </span>
                  <h3 className="mt-3 font-heading text-sm font-bold">{cap.title}</h3>
                  <p className="mt-1.5 font-body text-sm leading-relaxed text-stone-300">{cap.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>



      {/* Role entry */}
      <section id="roles" className="bg-stone-50">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:py-20">
          <SectionHeading eyebrow="Get started" title="Choose how you use PRANA" />
          <div className="mt-10 grid gap-5 sm:grid-cols-3">
            <Reveal delay={0}>
              <RoleCard
                to="/farmer"
                icon={icons.farmer}
                title="Farmer"
                description="Report livestock health concerns in a few simple steps."
              />
            </Reveal>
            <Reveal delay={90}>
              <RoleCard
                to="/field-worker"
                icon={icons.fieldWorker}
                title="Field worker"
                description="Conduct farm visits and log structured field surveillance."
              />
            </Reveal>
            <Reveal delay={180}>
              <RoleCard
                to="/vet"
                icon={icons.vet}
                title="Veterinarian"
                description="Monitor regional health intelligence and coordinate response."
              />
            </Reveal>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-stone-200 bg-white">
        <div className="mx-auto max-w-6xl px-5 py-10">
          <div className="grid gap-8 sm:grid-cols-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#C1EDCC] text-[#262322]">
                  <Icon path={icons.shield} className="h-4 w-4" />
                </span>
                <span className="text-base font-bold">PRANA</span>
              </div>
              <p className="mt-3 max-w-xs font-body text-sm leading-relaxed text-stone-500">
                A livestock health early-warning and decision-support platform connecting farmers, field
                workers, and veterinary teams.
              </p>
            </div>
            <div>
              <p className="font-ui text-xs font-semibold uppercase tracking-wide text-stone-400">Roles</p>
              <ul className="mt-3 space-y-2 font-body text-sm text-stone-600">
                <li><Link to="/farmer" className="hover:text-[#262322]">Farmer</Link></li>
                <li><Link to="/field-worker" className="hover:text-[#262322]">Field worker</Link></li>
                <li><Link to="/vet" className="hover:text-[#262322]">Veterinarian</Link></li>
              </ul>
            </div>
            <div>
              <p className="font-ui text-xs font-semibold uppercase tracking-wide text-stone-400">On this page</p>
              <ul className="mt-3 space-y-2 font-body text-sm text-stone-600">
                <li><a href="#how-it-works" className="hover:text-[#262322]">How it works</a></li>
                <li><a href="#diseases" className="hover:text-[#262322]">Disease awareness</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-stone-200 pt-6 font-serif text-xs leading-relaxed text-stone-400">
            PRANA is a decision-support tool. AI assessments indicate possible disease risk only and do
            not constitute a confirmed diagnosis; veterinary review remains part of every response.
            <span className="mt-1 block font-ui">© {new Date().getFullYear()} PRANA.</span>
          </div>
        </div>
      </footer>
    </div>
  )
}

function RoleCard({
  to,
  icon,
  title,
  description,
}: {
  to: string
  icon: string
  title: string
  description: string
}) {
  return (
    <Link
      to={to}
      className="group flex flex-col rounded-2xl border border-stone-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-[#8fd6a0] hover:shadow-lg"
    >
      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#C1EDCC] text-[#262322] transition group-hover:bg-[#262322] group-hover:text-[#C1EDCC]">
        <Icon path={icon} className="h-5 w-5" />
      </span>
      <h3 className="mt-4 font-heading text-lg font-bold">{title}</h3>
      <p className="mt-1.5 font-body text-sm leading-relaxed text-stone-600">{description}</p>
      <span className="mt-4 inline-flex items-center gap-1.5 font-heading text-sm font-semibold text-emerald-800">
        Continue
        <Icon path={icons.arrow} className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
      </span>
    </Link>
  )
}
