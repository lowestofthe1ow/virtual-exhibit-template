import { useState, useEffect } from "react";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselPrevious,
    CarouselNext,
    useCarousel,
} from "../ui/carousel";
import {
    Card,
    CardHeader,
    CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "../ui/dialog";
import { ScrollArea } from "../ui/scroll-area";
import { Wifi, Activity, Signal, Shield, Info } from "lucide-react";
import { StandardsData } from "./StandardsData.js";

function NavigationFooter({ total }) {
    const { api } = useCarousel();
    const [selectedIndex, setSelectedIndex] = useState(0);

    useEffect(() => {
        if (!api) return;
        setSelectedIndex(api.selectedScrollSnap());
        const onSelect = () => setSelectedIndex(api.selectedScrollSnap());
        api.on("select", onSelect);
        api.on("reInit", onSelect);
        return () => {
            api.off("select", onSelect);
            api.off("reInit", onSelect);
        };
    }, [api]);

    return (
        <div className="flex flex-wrap items-center justify-between gap-4 mt-5 px-1 sm:px-2 border-t border-(--c-rule)/40 pt-4">
            <div className="flex items-center gap-2 sm:gap-3">
                <CarouselPrevious className="static translate-y-0 h-9 w-9 border-(--c-rule) bg-(--c-cream) text-(--c-ink) hover:bg-(--c-muted) transition-all" />
                <CarouselNext className="static translate-y-0 h-9 w-9 border-(--c-rule) bg-(--c-cream) text-(--c-ink) hover:bg-(--c-muted) transition-all" />
            </div>

            <div className="flex items-center justify-center gap-1.5 order-first w-full sm:order-0 sm:w-auto">
                {Array.from({ length: total }).map((_, i) => (
                    <button
                        key={i}
                        onClick={() => api?.scrollTo(i)}
                        className={`h-2 rounded-full transition-all duration-300 ${
                            i === selectedIndex
                                ? "bg-[#38bdf8] w-6 sm:w-8"
                                : "bg-(--c-rule) hover:bg-(--c-muted) w-2"
                        }`}
                        aria-label={`Go to slide ${i + 1}`}
                    />
                ))}
            </div>

            <div className="text-xs font-mono text-(--c-muted) ml-auto sm:ml-0">
                <span className="text-[#38bdf8] font-bold">{String(selectedIndex + 1).padStart(2, '0')}</span>
                {" / "}
                <span>{String(total).padStart(2, '0')}</span>
            </div>
        </div>
    );
}

export default function StandardsCarousel() {
    const [showInfo, setShowInfo] = useState(false);

    return (
        <div className="wifi-carousel w-full my-6 sm:my-8 px-4 sm:px-8 overflow-visible!">
            <Dialog open={showInfo} onOpenChange={setShowInfo}>
                <div className="max-w-2xl mx-auto mb-4 px-1 flex justify-end">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowInfo(true)}
                        className="flex items-center gap-2 text-xs font-mono text-[#38bdf8] bg-[#38bdf8]/10 hover:bg-[#38bdf8]/20 border-[#38bdf8]/30 hover:text-[#38bdf8] cursor-pointer h-8 transition-all shadow-sm"
                    >
                        <Info className="h-3.5 w-3.5 shrink-0 text-[#38bdf8]" />
                        <span>What do Range & Penetration mean?</span>
                    </Button>
                </div>

                <DialogContent className="bg-[#0f172a] border border-slate-800 text-slate-300 max-w-md sm:max-w-lg rounded-s01g6-xl shadow-2xl p-6">
                    <DialogHeader className="space-y-1.5">
                        <DialogTitle className="font-s01g6-heading text-white font-bold text-lg flex items-center gap-2">
                            <Info className="h-5 w-5 text-[#38bdf8] shrink-0" />
                            <span>Understanding Wireless Metrics</span>
                        </DialogTitle>
                        <DialogDescription className="text-xs text-slate-400">
                            Key performance indicators for how Wi-Fi signals behave in physical environments.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="mt-3 space-y-3 leading-relaxed text-xs">
                        <div className="bg-black/40 p-3.5 rounded-s01g6-lg border border-slate-800/80 space-y-1">
                            <span className="font-mono font-bold text-[#38bdf8] flex items-center gap-1.5 text-sm">
                                <Signal size={14} className="text-[#38bdf8] shrink-0" /> RANGE (Air Distance)
                            </span>
                            <p className="text-slate-300 leading-normal">
                                How far the physical radio wave can travel through open air before losing connection stability. Lower frequencies (like 2.4 GHz) travel significantly farther than higher frequencies.
                            </p>
                        </div>
                        <div className="bg-black/40 p-3.5 rounded-s01g6-lg border border-slate-800/80 space-y-1">
                            <span className="font-mono font-bold text-amber-400 flex items-center gap-1.5 text-sm">
                                <Shield size={14} className="text-amber-400 shrink-0" /> PENETRATION (Obstacles)
                            </span>
                            <p className="text-slate-300 leading-normal">
                                The signal&apos;s ability to punch through solid obstacles like drywall, brick, concrete, and furniture. Shorter, high-frequency waves (like 5 GHz &amp; 6 GHz) are easily absorbed or reflected by walls.
                            </p>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            <Carousel
                className="w-full max-w-2xl mx-auto relative overflow-visible! px-4 sm:px-6"
                opts={{ align: "start", loop: true }}
            >
                <CarouselContent className="ml-0 gap-4 py-2">
                    {StandardsData.map((standard) => (
                        <CarouselItem key={standard.id} className="basis-full pl-0 flex-none min-w-0 w-full">
                            <Card className="h-115 sm:h-110 flex flex-col justify-between border-(--c-rule) rounded-s01g6-xl shadow-none bg-linear-to-b from-(--c-cream) to-[#090e1a] overflow-hidden transform-gpu backface-hidden">
                                <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
                                    <div className="bg-white/3 border-b border-(--c-rule)/60 px-4 sm:px-5 py-2.5 flex items-center justify-between text-xs font-mono shrink-0">
                                        <div className="flex items-center gap-2 text-(--c-muted) truncate mr-2">
                                            <Wifi size={13} className={`${standard.color} shrink-0`} />
                                            <span className="truncate">BAND: <strong className="text-white">{standard.band}</strong></span>
                                        </div>
                                        <div className="flex items-center gap-1 bg-[#38bdf8]/10 text-[#38bdf8] px-2 py-0.5 rounded border border-[#38bdf8]/20 font-bold shrink-0">
                                            <Activity size={12} className="shrink-0" />
                                            <span>{standard.speed}</span>
                                        </div>
                                    </div>

                                    <CardHeader className="pt-4 pb-2 px-4 sm:px-5 mr-2 sm:mr-4 shrink-0 flex-none">
                                        <div className="flex flex-wrap gap-1 mb-2">
                                            {standard.badges.map((badge) => (
                                                <span
                                                    key={badge.label}
                                                    className={`badge ${badge.className} tracking-wide uppercase text-[10px] px-2 py-0.5`}
                                                >
                                                    {badge.label}
                                                </span>
                                            ))}
                                        </div>
                                        <CardTitle className="font-s01g6-heading text-lg sm:text-xl text-white leading-snug">
                                            {standard.title}
                                        </CardTitle>
                                    </CardHeader>

                                    <ScrollArea className="flex-1 w-full min-h-0 px-4 sm:px-5 pb-4">
                                        <div className="space-y-3 text-xs sm:text-sm leading-relaxed text-(--c-muted) pr-3 sm:pr-4 mr-3 sm:mr-5">
                                            <p className="border-l-2 border-[#38bdf8]/40 pl-3 text-slate-300 italic">{standard.p1}</p>
                                            <p>{standard.p2}</p>
                                        </div>
                                    </ScrollArea>
                                </div>

                                {/* Clicking either metric bar at the bottom now triggers the Dialog too! */}
                                <div className="bg-black/40 border-t border-(--c-rule)/60 p-3 sm:p-4 px-4 sm:px-5 grid grid-cols-2 gap-3 sm:gap-4 text-xs shrink-0 mt-auto">
                                    <div
                                        className="space-y-1.5 cursor-pointer group"
                                        title="Click to learn about Range"
                                        onClick={() => setShowInfo(true)}
                                    >
                                        <div className="flex justify-between items-center text-[11px] text-(--c-muted) font-mono group-hover:text-white transition-colors">
                                            <span className="flex items-center gap-1 truncate">
                                                <Signal size={11} className="text-[#38bdf8] shrink-0"/>
                                                <span>RANGE</span>
                                                <Info size={10} className="opacity-60 group-hover:opacity-100 group-hover:text-[#38bdf8] transition-all ml-0.5" />
                                            </span>
                                            <span className="text-slate-300 font-semibold ml-1">{standard.range}%</span>
                                        </div>
                                        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                            <div className="h-full bg-linear-to-r from-blue-500 to-[#38bdf8] rounded-full transition-all duration-500" style={{ width: `${standard.range}%` }} />
                                        </div>
                                    </div>

                                    <div
                                        className="space-y-1.5 cursor-pointer group"
                                        title="Click to learn about Penetration"
                                        onClick={() => setShowInfo(true)}
                                    >
                                        <div className="flex justify-between items-center text-[11px] text-(--c-muted) font-mono group-hover:text-white transition-colors">
                                            <span className="flex items-center gap-1 truncate">
                                                <Shield size={11} className="text-amber-400 shrink-0"/>
                                                <span>PENETRATION</span>
                                                <Info size={10} className="opacity-60 group-hover:opacity-100 group-hover:text-amber-400 transition-all ml-0.5" />
                                            </span>
                                            <span className="text-slate-300 font-semibold ml-1">{standard.pen}%</span>
                                        </div>
                                        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                            <div className="h-full bg-linear-to-r from-amber-600 to-amber-400 rounded-full transition-all duration-500" style={{ width: `${standard.pen}%` }} />
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </CarouselItem>
                    ))}
                </CarouselContent>

                <NavigationFooter total={StandardsData.length} />
            </Carousel>
        </div>
    );
}