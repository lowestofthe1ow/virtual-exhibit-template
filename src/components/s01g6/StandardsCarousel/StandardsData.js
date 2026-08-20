export const StandardsData = [
    {
        id: "802-11b",
        title: "802.11b (Wi-Fi 1)",
        badges: [
            { label: "1999", className: "badge-year" },
            { label: "2.4 GHz", className: "badge-24" }
        ],
        band: "2.4 GHz",
        speed: "11 Mbps",
        range: 95,
        pen: 95,
        color: "text-[#93c5fd]",
        p1: "The first widely adopted commercial standard. It operated on the unlicensed 2.4 GHz ISM band using Complementary Code Keying (CCK) modulation.",
        p2: "While its 11 Mbps theoretical maximum speed is sluggish by today's standards, its 2.4 GHz frequency gave it excellent range and the ability to easily punch through drywall and furniture."
    },
    {
        id: "802-11a",
        title: "802.11a (Wi-Fi 2)",
        badges: [
            { label: "1999", className: "badge-year" },
            { label: "5 GHz", className: "badge-5" }
        ],
        band: "5 GHz",
        speed: "54 Mbps",
        range: 60,
        pen: 45,
        color: "text-[#c084fc]",
        p1: "Released concurrently with 802.11b, this standard took a radically different approach by utilizing the 5 GHz band and introducing Orthogonal Frequency Division Multiplexing (OFDM).",
        p2: "It offered nearly five times the speed of 802.11b and suffered from much less interference, but the shorter wavelength of 5 GHz meant it struggled to penetrate solid walls."
    },
    {
        id: "802-11g",
        title: "802.11g (Wi-Fi 3)",
        badges: [
            { label: "2003", className: "badge-year" },
            { label: "2.4 GHz", className: "badge-24" }
        ],
        band: "2.4 GHz",
        speed: "54 Mbps",
        range: 85,
        pen: 90,
        color: "text-[#93c5fd]",
        p1: "The best of both worlds at the time. It brought the high-speed OFDM modulation of 802.11a over to the crowded but resilient 2.4 GHz band.",
        p2: "Crucially, it maintained backward compatibility with legacy 802.11b hardware, triggering an absolute explosion in consumer wireless router adoption."
    },
    {
        id: "802-11n",
        title: "802.11n (Wi-Fi 4)",
        badges: [
            { label: "2009", className: "badge-year" },
            { label: "Dual-Band", className: "badge-dual" }
        ],
        band: "2.4 + 5 GHz",
        speed: "600 Mbps",
        range: 95,
        pen: 85,
        color: "text-[#a5b4fc]",
        p1: "A monumental leap forward that introduced MIMO (Multiple Input Multiple Output), allowing routers to transmit multiple data streams simultaneously using multiple antennas.",
        p2: "It was also the first standard to officially support dual-band operation, letting devices switch between 2.4 GHz for range and 5 GHz for throughput."
    },
    {
        id: "802-11ac",
        title: "802.11ac (Wi-Fi 5)",
        badges: [
            { label: "2013", className: "badge-year" },
            { label: "5 GHz Only", className: "badge-5" }
        ],
        band: "5 GHz",
        speed: "3.5 Gbps",
        range: 75,
        pen: 60,
        color: "text-[#c084fc]",
        p1: "The first standard to break the gigabit barrier. It focused exclusively on supercharging the 5 GHz band by introducing wider 80 MHz and 160 MHz channels.",
        p2: "It also introduced Multi-User MIMO (MU-MIMO), enabling access points to talk to multiple client devices at the exact same time rather than just queuing them up sequentially."
    },
    {
        id: "802-11ax",
        title: "802.11ax (Wi-Fi 6 & 6E)",
        badges: [
            { label: "2019 / 2021", className: "badge-year" },
            { label: "Tri-Band", className: "badge-tri" }
        ],
        band: "Tri-Band",
        speed: "9.6 Gbps",
        range: 85,
        pen: 75,
        color: "text-[#86efac]",
        p1: "Designed to combat extreme network congestion in stadiums and airports. It replaced OFDM with OFDMA, borrowing cellular scheduling tech to chop channels into smaller, highly efficient sub-carriers.",
        p2: "The subsequent Wi-Fi 6E revision unlocked the massive 6 GHz spectrum, adding up to 1,200 MHz of pristine, interference-free airspace for compatible devices."
    },
    {
        id: "802-11be",
        title: "802.11be (Wi-Fi 7)",
        badges: [
            { label: "Present", className: "badge-year" },
            { label: "Tri-Band MLO", className: "badge-tri" }
        ],
        band: "Tri-Band",
        speed: "46 Gbps",
        range: 80,
        pen: 70,
        color: "text-[#86efac]",
        p1: "The cutting edge of wireless engineering. It introduces ultra-wide 320 MHz channels and massive 4096-QAM packing to achieve staggering wired-like throughput.",
        p2: "Its marquee feature is Multi-Link Operation (MLO), which allows a device to simultaneously send and receive packets across 2.4 GHz, 5 GHz, and 6 GHz bands at the same time to eliminate latency."
    }
];