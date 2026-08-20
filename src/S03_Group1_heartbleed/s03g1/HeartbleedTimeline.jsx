const DEFAULT_EVENTS = [
    {
        date: "Dec 2011",
        title: "Vulnerable Heartbeat Logic Introduced",
        description: "A missing bounds check entered production OpenSSL code.",
        significance: "Bug seeded",
    },
    {
        date: "Apr 2014",
        title: "Discovery and Public Disclosure",
        description:
            "The vulnerability was disclosed and rapidly patched in 1.0.1g.",
        significance: "Emergency response",
    },
];

export default function HeartbleedTimeline({ events = DEFAULT_EVENTS }) {
    return (
        <section className="hb-timeline mt-6 rounded-xl border border-s03g1-hb-secondary/35 bg-s03g1-hb-bg px-5 py-6 font-s03g1-body text-white shadow-[0_10px_24px_rgba(23,14,61,0.32)] sm:px-8 sm:py-8">
            <header className="mb-6 border-b border-s03g1-hb-primary/25 pb-4">
                <p className="font-s03g1-heading text-xs uppercase tracking-[0.22em] text-s03g1-hb-secondary">
                    Timeline View
                </p>
                <h3 className="mt-2 font-s03g1-heading text-xl text-s03g1-hb-primary sm:text-2xl">
                    Heartbleed Key Events
                </h3>
            </header>

            <ol className="space-y-3" aria-label="Heartbleed historical timeline">
                {events.map((event, idx) => (
                    <li
                        key={`${event.date}-${event.title}`}
                        className="group relative flex items-stretch gap-0 rounded-lg border border-s03g1-hb-primary/20 bg-[linear-gradient(135deg,rgba(255,39,158,0.08),rgba(118,198,215,0.06))] overflow-hidden"
                    >
                        {/* Pink accent left bar */}
                        <div
                            className="w-1 shrink-0 bg-s03g1-hb-primary/60 transition-colors group-hover:bg-s03g1-hb-red"
                            aria-hidden="true"
                        />

                        {/* Date column — fixed width so all content aligns */}
                        <div className="flex w-32 shrink-0 flex-col justify-center gap-1 border-r border-s03g1-hb-primary/15 px-4 py-4">
                            <p className="font-s03g1-heading text-sm font-bold leading-snug tracking-wide text-s03g1-hb-cyan">
                                {event.date}
                            </p>
                            <p className="font-s03g1-heading text-[0.6rem] uppercase tracking-[0.18em] text-s03g1-hb-secondary/70">
                                Event {String(idx + 1).padStart(2, "0")}
                            </p>
                        </div>

                        {/* Content column */}
                        <div className="flex min-w-0 flex-1 flex-col justify-center gap-2 px-4 py-4">
                            <h4 className="font-s03g1-heading text-sm font-semibold leading-snug text-white sm:text-base">
                                {event.title}
                            </h4>
                            <p className="text-sm leading-6 text-white/80 sm:text-[0.92rem]">
                                {event.description}
                            </p>
                            <span className="inline-flex w-fit items-center rounded-full border border-s03g1-hb-cyan/30 bg-s03g1-hb-cyan/10 px-2.5 py-0.5 font-s03g1-heading text-[0.62rem] uppercase tracking-[0.15em] text-s03g1-hb-cyan">
                                {event.significance}
                            </span>
                        </div>
                    </li>
                ))}
            </ol>
        </section>
    );
}
