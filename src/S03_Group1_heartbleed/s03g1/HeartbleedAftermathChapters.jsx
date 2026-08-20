import HeartbleedSimulation from "./HeartbleedSimulation.jsx";
import HeartbleedTimeline from "./HeartbleedTimeline.jsx";

export function Stage1HealthyServerChapter() {
    return (
        <section className="hb-card-reveal mt-5 rounded-2xl border border-s03g1-hb-primary/35 bg-[linear-gradient(160deg,rgba(255,39,158,0.10),rgba(118,198,215,0.06))] px-6 py-6 sm:px-8 sm:py-8">
            <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-s03g1-hb-primary/15 px-3 py-1 font-s03g1-heading text-[0.72rem] font-bold uppercase tracking-[0.2em] text-s03g1-hb-primary">
                <span aria-hidden="true">◆</span> Stage 1 Context
            </p>
            <p className="mt-3 text-[1rem] leading-8 text-[#2c2249]">
                The TLS heartbeat extension was designed as a lightweight
                keep-alive mechanism to maintain an active encrypted connection
                without renegotiation.
            </p>
            <p className="mt-3 text-[1rem] leading-8 text-[#2c2249]">
                In a proper implementation, the client sends a payload and
                declared length, and the server echoes exactly the same payload
                size back.
            </p>
            <div className="mt-6">
                <HeartbleedSimulation stage="healthy" />
            </div>
        </section>
    );
}

export function AnatomyHeartbeatChapter() {
    return (
        <section className="hb-card-reveal mt-4 rounded-2xl border border-s03g1-hb-cyan/35 bg-[linear-gradient(160deg,rgba(118,198,215,0.14),rgba(189,147,249,0.06))] px-6 py-6 sm:px-8 sm:py-8">
            <div className="rounded-xl bg-white/40 p-4 sm:p-5">
                <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-s03g1-hb-cyan/15 px-3 py-1 font-s03g1-heading text-[0.72rem] font-bold uppercase tracking-[0.2em] text-s03g1-hb-cyan">
                    <span aria-hidden="true">◆</span> Packet Anatomy
                </p>
                <p className="mt-3 text-[1rem] leading-8 text-[#1f3552]">
                    A standard heartbeat request contains:
                </p>
                <ol className="mt-3 list-decimal pl-6 text-[1rem] leading-8 text-[#1f3552] marker:font-s03g1-heading marker:text-[#2a6180]">
                    <li>
                        <strong>Type</strong>: A single byte indicating request
                        or response.
                    </li>
                    <li>
                        <strong>Payload Length</strong>: A 16-bit integer
                        specifying the expected payload size.
                    </li>
                    <li>
                        <strong>Payload</strong>: The actual data to be echoed
                        back.
                    </li>
                    <li>
                        <strong>Padding</strong>: Additional bytes used to align
                        the packet.
                    </li>
                </ol>
                <p className="mt-4 text-[1rem] leading-8 text-[#1f3552]">
                    The core flaw appears when the server trusts the declared
                    length even when actual payload bytes are shorter.
                </p>
            </div>
        </section>
    );
}

export function VulnerableCodePathChapter() {
    return (
        <section className="hb-card-reveal mt-5 rounded-2xl border border-s03g1-hb-secondary/35 bg-[linear-gradient(155deg,rgba(189,147,249,0.15),rgba(255,39,158,0.06))] px-6 py-6 sm:px-8 sm:py-8">
            <p className="label-story-glitch mb-4 inline-flex items-center gap-2 rounded-full bg-s03g1-hb-secondary/15 px-3 py-1 font-s03g1-heading text-[0.72rem] font-bold uppercase tracking-[0.2em] text-s03g1-hb-secondary">
                <span aria-hidden="true">◆</span> Vulnerable Implementation
            </p>
            <pre className="relative mt-4 rounded-xl border border-s03g1-hb-secondary/30 bg-[#130b2d] p-5 font-s03g1-heading text-[0.85rem] leading-7 text-white whitespace-pre-wrap break-words shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_0_18px_rgba(118,198,215,0.08)]">
                <code>{`/* Vulnerable Code - OpenSSL 1.0.1 (2011-2014) */
int dtls1_process_heartbeat(SSL *s) {
    unsigned char *p = &s->s3->rrec.data[0];
    unsigned short hbtype;
    unsigned int payload_length;

    hbtype = *p++;
    n2s(p, payload_length);  /* No validation */

    bp = OPENSSL_malloc(1 + 2 + payload_length + padding);
    memcpy(bp, p, payload_length);  /* Over-read */
}`}</code>
            </pre>
            <p className="mt-4 text-[1rem] leading-8 text-[#2f2550]">
                Without verifying payload_length against available bytes, memcpy
                reads beyond the heartbeat payload and leaks process memory.
            </p>
        </section>
    );
}

export function Stage2UnderAttackChapter() {
    return (
        <section className="hb-card-reveal mt-5 rounded-2xl border border-s03g1-hb-coral/45 bg-[linear-gradient(160deg,rgba(226,169,241,0.20),rgba(255,49,49,0.07))] px-6 py-6 sm:px-8 sm:py-8">
            <p className="label-story-alarm mb-4 inline-flex items-center gap-2 rounded-full bg-s03g1-hb-coral/20 px-3 py-1 font-s03g1-heading text-[0.72rem] font-bold uppercase tracking-[0.2em] text-s03g1-hb-coral">
                <span aria-hidden="true">◆</span> Attack Simulation
            </p>
            <p className="mt-3 text-[1rem] leading-8 text-[#3b2b49]">
                Attackers claim a maximum-size heartbeat payload while sending
                only a few bytes. The vulnerable server trusts the claim and
                returns a large memory slice.
            </p>
            <pre className="relative mt-4 rounded-xl border border-s03g1-hb-coral/30 bg-[#130b2d] p-5 font-s03g1-heading text-[0.85rem] leading-7 text-white whitespace-pre-wrap break-words shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_0_18px_rgba(226,169,241,0.08)]">
                <code>{`[Attacker] -- heartbeat(length=65536, payload="Hi") --> [Server]
[Server] -- returns 64KB memory including unrelated data --> [Attacker]`}</code>
            </pre>
            <div className="mt-6">
                <HeartbleedSimulation stage="attack" />
            </div>
        </section>
    );
}

export function AttackerCouldSeeChapter() {
    return (
        <section className="hb-card-reveal mt-4 rounded-2xl border border-s03g1-hb-cyan/30 bg-[linear-gradient(150deg,rgba(118,198,215,0.14),rgba(226,169,241,0.08))] px-6 py-6 sm:px-8 sm:py-8">
            <div className="rounded-xl border border-[#7dbecf]/30 bg-white/50 p-5">
                <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-s03g1-hb-cyan/15 px-3 py-1 font-s03g1-heading text-[0.72rem] font-bold uppercase tracking-[0.2em] text-s03g1-hb-cyan">
                    <span aria-hidden="true">◆</span> Likely Memory Exposure
                </p>
                <ul className="mt-3 list-disc pl-6 text-[1rem] leading-8 text-[#1f3650] marker:text-[#1d6f84]">
                    <li>Private TLS keys</li>
                    <li>Session cookies and authentication tokens</li>
                    <li>Passwords and user credentials</li>
                    <li>Email or message fragments in memory</li>
                    <li>API keys and operational secrets</li>
                </ul>
                <p className="mt-4 text-[1rem] leading-8 text-[#1f3650]">
                    Exploitation often left minimal forensic traces, which made
                    reliable incident confirmation difficult after the fact.
                </p>
            </div>
        </section>
    );
}

export function RaceToDisclosureChapter() {
    return (
        <section className="hb-card-reveal mt-5 rounded-2xl border border-s03g1-hb-secondary/35 bg-[linear-gradient(160deg,rgba(189,147,249,0.16),rgba(118,198,215,0.07))] px-6 py-6 sm:px-8 sm:py-8">
            <p className="label-story-glitch mb-4 inline-flex items-center gap-2 rounded-full bg-s03g1-hb-secondary/15 px-3 py-1 font-s03g1-heading text-[0.72rem] font-bold uppercase tracking-[0.2em] text-s03g1-hb-secondary">
                <span aria-hidden="true">◆</span> Coordinated Disclosure
            </p>
            <p className="mt-3 text-[1rem] leading-8 text-[#2e2550]">
                Researchers at Codenomicon and Google independently identified
                the bug and coordinated disclosure with OpenSSL maintainers.
            </p>
            <p className="mt-3 text-[1rem] leading-8 text-[#2e2550]">
                The OpenSSL 1.0.1g patch introduced strict bounds validation,
                but operators still needed certificate revocation, key rotation,
                and session invalidation.
            </p>
            <pre className="relative mt-4 rounded-xl border border-s03g1-hb-secondary/30 bg-[#130b2d] p-5 font-s03g1-heading text-[0.85rem] leading-7 text-white whitespace-pre-wrap break-words shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_0_18px_rgba(189,147,249,0.08)]">
                <code>{`if (1 + 2 + payload_length + 16 > s->s3->rrec.length)
    return 0;  /* Reject invalid heartbeat */`}</code>
            </pre>
        </section>
    );
}

export function Stage3AftermathChapter() {
    return (
        <section className="hb-card-reveal mt-5 rounded-2xl border border-s03g1-hb-primary/35 bg-[linear-gradient(165deg,rgba(255,39,158,0.10),rgba(118,198,215,0.08))] px-6 py-6 sm:px-8 sm:py-8">
            <p className="label-story-archival mb-4 inline-flex items-center gap-2 rounded-full bg-s03g1-hb-primary/15 px-3 py-1 font-s03g1-heading text-[0.72rem] font-bold uppercase tracking-[0.2em] text-s03g1-hb-primary">
                <span aria-hidden="true">◆</span> Global Fallout
            </p>
            <p className="mt-3 text-[1rem] leading-8 text-[#2c2249]">
                Heartbleed exposed systemic weaknesses in critical open-source
                maintenance and incident response readiness across the web.
            </p>
            <p className="mt-3 text-[1rem] leading-8 text-[#2c2249]">
                Even after patches were published, uncertainty remained because
                victims could not reliably prove whether memory had been
                exfiltrated.
            </p>
            <div className="mt-6">
                <HeartbleedSimulation stage="aftermath" />
            </div>
        </section>
    );
}

export function OpenSourceParadoxChapter() {
    return (
        <section className="hb-card-reveal mt-4 rounded-2xl border border-s03g1-hb-coral/40 bg-[linear-gradient(155deg,rgba(226,169,241,0.22),rgba(189,147,249,0.08))] px-6 py-6 sm:px-8 sm:py-8">
            <div className="rounded-xl border border-s03g1-hb-coral/45 bg-white/45 p-5 sm:p-6">
                <p className="label-story-alarm mb-3 inline-flex items-center gap-2 rounded-full bg-s03g1-hb-coral/20 px-3 py-1 font-s03g1-heading text-[0.72rem] font-bold uppercase tracking-[0.2em] text-s03g1-hb-coral">
                    <span aria-hidden="true">◆</span> Ecosystem Risk
                </p>
                <p className="mt-3 text-[1rem] leading-8 text-[#3a2f4a]">
                    OpenSSL secured a significant share of global encrypted
                    traffic while relying on limited staffing and constrained
                    funding.
                </p>
                <p className="mt-3 text-[1rem] leading-8 text-[#3a2f4a]">
                    The Core Infrastructure Initiative emerged in 2014 to
                    provide sustained financial and engineering support for
                    critical open-source projects.
                </p>
            </div>
        </section>
    );
}

export function LessonsLearnedChapter() {
    return (
        <section className="hb-card-reveal mt-4 rounded-2xl border border-s03g1-hb-cyan/35 bg-[linear-gradient(160deg,rgba(118,198,215,0.15),rgba(189,147,249,0.06))] px-6 py-6 sm:px-8 sm:py-8">
            <p className="label-story-archival mb-4 inline-flex items-center gap-2 rounded-full bg-s03g1-hb-cyan/15 px-3 py-1 font-s03g1-heading text-[0.72rem] font-bold uppercase tracking-[0.2em] text-s03g1-hb-cyan">
                <span aria-hidden="true">◆</span> Practical Security Lessons
            </p>
            <ol className="mt-3 list-decimal pl-6 text-[1rem] leading-8 text-[#1f3650] marker:font-s03g1-heading marker:text-[#31578a]">
                <li>
                    <strong>Validate every boundary</strong> before reading or
                    copying attacker-controlled lengths.
                </li>
                <li>
                    <strong>Adopt memory-safe defaults</strong> where practical
                    to reduce over-read classes of bugs.
                </li>
                <li>
                    <strong>Fund critical dependencies</strong> that underpin
                    production security.
                </li>
                <li>
                    <strong>Audit continuously</strong> with code review,
                    fuzzing, and incident playbooks.
                </li>
                <li>
                    <strong>Treat key exposure as full compromise</strong> and
                    rotate secrets accordingly.
                </li>
            </ol>
        </section>
    );
}

export function HistoricalTimelineChapter({ events }) {
    return (
        <section className="hb-card-reveal mt-5 rounded-2xl border border-s03g1-hb-secondary/35 bg-[linear-gradient(165deg,rgba(189,147,249,0.16),rgba(255,39,158,0.08))] px-6 py-6 sm:px-8 sm:py-8">
            <p className="label-story-archival mb-4 inline-flex items-center gap-2 rounded-full bg-s03g1-hb-secondary/15 px-3 py-1 font-s03g1-heading text-[0.72rem] font-bold uppercase tracking-[0.2em] text-s03g1-hb-secondary">
                <span aria-hidden="true">◆</span> Timeline Synthesis
            </p>
            <p className="mt-3 text-[1rem] leading-8 text-[#2e2750]">
                The Heartbleed story spans from a single flawed commit to an
                industry-wide security reckoning and long-term infrastructure
                reforms.
            </p>
            <div className="mt-5">
                <HeartbleedTimeline events={events} />
            </div>
        </section>
    );
}
