import { useState } from 'react';
import { Button } from '../ui/button';
import { StandardsData } from '../StandardsCarousel/StandardsData.js';
import { GENERATIONS } from '../WifiHeatmapExplorer/lib/Generations.js';

const STANDARDS_FALLBACK_METRICS = {
    '802-11b':  { speed: 11,    range: 35, pen: 80 },
    '802-11a':  { speed: 54,    range: 20, pen: 40 },
    '802-11g':  { speed: 54,    range: 38, pen: 75 },
    '802-11n':  { speed: 600,   range: 70, pen: 65 },
    '802-11ac': { speed: 3500,  range: 50, pen: 45 },
    '802-11ax': { speed: 9600,  range: 60, pen: 60 },
    '802-11be': { speed: 46000, range: 45, pen: 90 },
};

const DISTANCE_COST = { '2.4GHz': 2.0, '5GHz': 3.5, 'dual': 2.5 };
const WIFI7_FALLBACK = { range: 45, penetration: 90, speed: 46000 };

function fmtSpeed(mbps) {
    if (!mbps) return '0 Mbps';
    if (mbps < 1000) return `${mbps} Mbps`;
    const gbps = mbps / 1000;
    return `${Number.isInteger(gbps) ? gbps : gbps.toFixed(1)} Gbps`;
}

function speedPct(mbps) {
    if (!mbps || mbps <= 0) return 0;
    const lo = Math.log10(11);
    const hi = Math.log10(46000);
    return ((Math.log10(mbps) - lo) / (hi - lo)) * 100;
}

function clampPct(val) {
    if (!Number.isFinite(val) || isNaN(val)) return 5;
    return Math.max(Math.min(val, 100), 5);
}

function getMetrics(id, std) {
    const key = id;
    const fallback = STANDARDS_FALLBACK_METRICS[key] || WIFI7_FALLBACK;

    let speed = fallback.speed;
    let range = fallback.range;
    let penetration = fallback.pen;

    const GENERATION_ID_MAP = {
        '802-11b': 'wifi1', '802-11a': 'wifi2', '802-11g': 'wifi3',
        '802-11n': 'wifi4', '802-11ac': 'wifi5', '802-11ax': 'wifi6', '802-11be': null,
    };

    // Use actual generation data if available
    if (GENERATIONS && Array.isArray(GENERATIONS)) {
        const genMatch = GENERATIONS.find(g => g.id === GENERATION_ID_MAP[key]);
        if (genMatch) {
            const cost = DISTANCE_COST[genMatch.frequencyBand] || 2.5;
            range = Math.round((genMatch.maxStrength || 100) / cost);
            penetration = Math.round((1 / (genMatch.wallPenetration || 0.02)) * 100);
        }
    } else if (std) {
        if (std.range) range = Math.round(std.range * 0.5);
        if (std.pen) penetration = std.pen;
    }

    return {
        speed,
        range,
        penetration,
        speedPct:       clampPct(speedPct(speed)),
        rangePct:       clampPct((range / 70) * 100),
        penetrationPct: clampPct(penetration / 1.2),
    };
}

export default function WifiComparison() {
    const [leftId,  setLeftId]  = useState(StandardsData[0]?.id || '802-11b');
    const [rightId, setRightId] = useState(StandardsData[StandardsData.length - 1]?.id || '802-11ax');

    const leftStd  = StandardsData.find(s => s.id === leftId)  || StandardsData[0];
    const rightStd = StandardsData.find(s => s.id === rightId) || StandardsData[StandardsData.length - 1];
    const leftMet  = getMetrics(leftId, leftStd);
    const rightMet = getMetrics(rightId, rightStd);

    const metrics = [
        {
            label:        'Max Speed',
            note:         'logarithmic scale',
            leftPct:      leftMet.speedPct,
            rightPct:     rightMet.speedPct,
            leftVal:      fmtSpeed(leftMet.speed),
            rightVal:     fmtSpeed(rightMet.speed),
            leftStdName:  leftStd.title,
            rightStdName: rightStd.title,
        },
        {
            label:        'Open-Space Range',
            note:         'simulated estimation',
            leftPct:      leftMet.rangePct,
            rightPct:     rightMet.rangePct,
            leftVal:      `~${leftMet.range} m`,
            rightVal:     `~${rightMet.range} m`,
            leftStdName:  leftStd.title,
            rightStdName: rightStd.title,
        },
        {
            label:        'Wall Penetration',
            note:         'higher score = better signal passing',
            leftPct:      leftMet.penetrationPct,
            rightPct:     rightMet.penetrationPct,
            leftVal:      `${leftMet.penetration} pts`,
            rightVal:     `${rightMet.penetration} pts`,
            leftStdName:  leftStd.title,
            rightStdName: rightStd.title,
        },
    ];

    return (
        <div className="wifi-explorer flex flex-col gap-6 w-full max-w-full">
            <div className="flex flex-col md:flex-row gap-5">
                <Panel
                    side="A"
                    accentColor="#38bdf8"
                    selectedId={leftId}
                    onSelect={setLeftId}
                    selectedStd={leftStd}
                />

                <div className="hidden md:block w-px self-stretch bg-white/10 shrink-0" />
                <div className="block md:hidden h-px w-full bg-white/10 shrink-0 my-1" />

                <Panel
                    side="B"
                    accentColor="#a78bfa"
                    selectedId={rightId}
                    onSelect={setRightId}
                    selectedStd={rightStd}
                />
            </div>

            <div className="flex flex-col gap-4 rounded-s01g6-xl p-4 sm:p-6 bg-white/[0.02] border border-white/10">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <p className="text-xs font-mono uppercase tracking-widest text-slate-400 m-0">
                        Side-by-Side Performance Analysis
                    </p>
                </div>
                <div className="grid grid-cols-1 gap-5 pt-1">
                    {metrics.map(m => <MetricRow key={m.label} {...m} />)}
                </div>
            </div>
        </div>
    );
}

function Panel({ side, accentColor, selectedId, onSelect, selectedStd }) {
    // Active text set to white with glowing box shadows
    const activeStyles = side === 'A'
        ? 'bg-[#0ea5e9] border-[#38bdf8] text-white font-bold shadow-[0_0_12px_rgba(56,189,248,0.35)] hover:bg-[#0284c7] hover:text-white'
        : 'bg-[#8b5cf6] border-[#c4b5fd] text-white font-bold shadow-[0_0_12px_rgba(167,139,250,0.35)] hover:bg-[#7c3aed] hover:text-white';

    const inactiveStyles = 'bg-white/[0.03] border-white/15 text-slate-300 font-normal hover:border-white/40 hover:text-white hover:bg-white/10';

    return (
        <div className="flex-1 flex flex-col gap-3 min-w-0">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <strong
                        className="text-xs font-black flex items-center justify-center rounded-s01g6-sm shrink-0 font-mono shadow-sm"
                        style={{ width: '1.5rem', height: '1.5rem', background: accentColor, color: '#020617' }}
                    >
                        {side}
                    </strong>
                    <span className="text-xs font-mono uppercase tracking-wider text-slate-300 font-semibold">
                        Generation {side}
                    </span>
                </div>
            </div>

            <div className="flex flex-wrap gap-1.5">
                {StandardsData.map(item => {
                    const isActive = item.id === selectedId;
                    return (
                        <Button
                            key={item.id}
                            variant="outline"
                            size="sm"
                            onClick={() => onSelect(item.id)}
                            className={`h-auto min-h-[26px] py-1 px-2.5 text-xs font-s01g6-sans whitespace-normal text-center leading-tight rounded-[4px] transition-all duration-150 shadow-none ${isActive ? activeStyles : inactiveStyles}`}
                        >
                            {/* Complete generation title rendered without splitting bugs */}
                            {item.title}
                        </Button>
                    );
                })}
            </div>

            {selectedStd && (
                /* Fixed height container (h-[220px] md:h-[240px]) prevents layout jumps */
                <div
                    className="h-[220px] sm:h-[200px] md:h-[240px] flex flex-col justify-between gap-3 rounded-s01g6-lg p-4 bg-white/[0.02] border border-white/10 transition-all duration-300 overflow-y-auto custom-scrollbar"
                    style={{ borderTop: `3px solid ${accentColor}` }}
                >
                    <div>
                        <h3 className="text-base sm:text-lg font-bold text-white m-0 leading-snug mb-2.5">
                            {selectedStd.title}
                        </h3>
                        <div className="flex flex-wrap gap-1.5 mb-3">
                            {selectedStd.badges?.map(b => (
                                <strong
                                    key={b.label}
                                    className={`badge ${b.className} tracking-wide uppercase text-[10px] px-2 py-0.5 rounded border border-white/10 font-normal`}
                                >
                                    {b.label}
                                </strong>
                            ))}
                        </div>
                        <p className="text-xs sm:text-sm leading-relaxed text-slate-300 m-0">
                            {selectedStd.p1}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}

function MetricRow({ label, note, leftPct, rightPct, leftVal, rightVal, leftStdName, rightStdName }) {
    return (
        <div className="flex flex-col gap-2.5 p-3 sm:p-4 rounded-s01g6-lg bg-white/[0.015] border border-white/5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between font-mono gap-0.5 sm:gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-200">{label}</span>
                {note && <small className="text-[11px] italic text-slate-400">{note}</small>}
            </div>

            <div className="flex flex-col gap-2 pt-1">
                {/* Bar A (Cyan) - Left-to-Right Progress */}
                <div className="flex items-center gap-2 sm:gap-3 font-mono text-xs">
                    <span className="w-20 sm:w-28 shrink-0 text-[11px] text-slate-300 truncate font-semibold" title={leftStdName}>
                        <span className="inline-block w-2 h-2 rounded-full bg-[#38bdf8] mr-1.5" />
                        {leftStdName}
                    </span>
                    <div className="flex-1 h-3 rounded-full bg-white/5 overflow-hidden border border-white/5 p-[1px]">
                        <div
                            style={{ width: `${leftPct}%`, background: 'linear-gradient(90deg, #0284c7, #38bdf8)' }}
                            className="h-full rounded-full transition-all duration-500 ease-out shadow-[0_0_8px_rgba(56,189,248,0.4)]"
                        />
                    </div>
                    <output className="w-20 sm:w-24 shrink-0 text-right font-bold tabular-nums text-[#38bdf8]" style={{ color: '#38bdf8' }}>
                        {leftVal}
                    </output>
                </div>

                {/* Bar B (Purple) - Left-to-Right Progress */}
                <div className="flex items-center gap-2 sm:gap-3 font-mono text-xs">
                    <span className="w-20 sm:w-28 shrink-0 text-[11px] text-slate-300 truncate font-semibold" title={rightStdName}>
                        <span className="inline-block w-2 h-2 rounded-full bg-[#a78bfa] mr-1.5" />
                        {rightStdName}
                    </span>
                    <div className="flex-1 h-3 rounded-full bg-white/5 overflow-hidden border border-white/5 p-[1px]">
                        <div
                            style={{ width: `${rightPct}%`, background: 'linear-gradient(90deg, #7c3aed, #a78bfa)' }}
                            className="h-full rounded-full transition-all duration-500 ease-out shadow-[0_0_8px_rgba(167,139,250,0.4)]"
                        />
                    </div>
                    <output className="w-20 sm:w-24 shrink-0 text-right font-bold tabular-nums text-[#a78bfa]" style={{ color: '#a78bfa' }}>
                        {rightVal}
                    </output>
                </div>
            </div>
        </div>
    );
}