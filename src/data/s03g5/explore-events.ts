export interface ExploreEvent {
    name: string;
    date: string;
    iso: string;
    yearsBefore: string;
    description: string;
    source: string;
    sourceLabel: string;
    icon: string;
}

export const exploreEvents: ExploreEvent[] = [
    {
        name: "HUMANS LAND ON THE MOON",
        date: "07/20/1969",
        iso: "1969-07-20T20:17:40Z",
        yearsBefore: "68 years",
        description:
            "Apollo 11 completed humanity’s first crewed landing on the Moon. The mission showed how increasingly powerful computers, networks, and timing systems could coordinate a complex operation across Earth and space, previewing a world that would become dependent on digital clocks and automation.",
        source: "https://www.nasa.gov/mission/apollo-11/",
        sourceLabel: "NASA — Apollo 11",
        icon: "moon",
    },
    {
        name: "THE UNIX EPOCH BEGINS",
        date: "01/01/1970",
        iso: "1970-01-01T00:00:00Z",
        yearsBefore: "68 years",
        description:
            "Unix-based systems adopted an agreed starting point: January 1, 1970 at 00:00:00 UTC. Instead of storing a calendar date directly, a computer can store the number of seconds before or after this moment. At the Epoch itself, the Unix timestamp is zero.",
        source: "https://man7.org/linux/man-pages/man2/time.2.html",
        sourceLabel: "Linux man-pages — time(2)",
        icon: "calendar",
    },
    {
        name: "THE INTEL 4004 MICROPROCESSOR",
        date: "11/15/1971",
        iso: "1971-11-15T00:00:00Z",
        yearsBefore: "66 years",
        description:
            "Intel announced the 4004, widely recognized as the first commercially available general-purpose programmable microprocessor. It helped make computing smaller, cheaper, and more widespread, eventually placing date-sensitive software inside appliances, vehicles, industrial machines, and infrastructure.",
        source: "https://timeline.intel.com/1971/the-first-programmable-microprocessor:-the-4004",
        sourceLabel: "Intel Timeline — The 4004",
        icon: "processor",
    },
    {
        name: "THE WORLD WIDE WEB",
        date: "03/12/1989",
        iso: "1989-03-12T00:00:00Z",
        yearsBefore: "48 years",
        description:
            "While working at CERN, Tim Berners-Lee proposed a system for linking and sharing information across different computers. The Web later made the Internet easier to navigate and moved banking, communication, retail, education, and public services into interconnected digital systems.",
        source: "https://home.cern/science/computing/birth-web/short-history-web",
        sourceLabel: "CERN — A short history of the Web",
        icon: "www",
    },
    {
        name: "THE WEB OPENS TO THE INTERNET",
        date: "08/06/1991",
        iso: "1991-08-06T00:00:00Z",
        yearsBefore: "46 years",
        description:
            "Tim Berners-Lee announced the World Wide Web software on Internet newsgroups, allowing interest in the project to spread beyond CERN. The Web connected documents through hyperlinks and gave users a practical way to find and share information online.",
        source: "https://home.cern/science/computing/birth-web/short-history-web",
        sourceLabel: "CERN — A short history of the Web",
        icon: "internet",
    },
    {
        name: "CERN RELEASES THE WEB PUBLICLY",
        date: "04/30/1993",
        iso: "1993-04-30T00:00:00Z",
        yearsBefore: "44 years",
        description:
            "CERN placed the World Wide Web software in the public domain, allowing anyone to use and develop it without a fee. As the Web grew, the consequences of software errors—including date and time errors—could spread across much larger, interconnected systems.",
        source: "https://home.cern/science/computing/birth-web/short-history-web",
        sourceLabel: "CERN — A short history of the Web",
        icon: "web",
    },
    {
        name: "WINDOWS 95",
        date: "08/24/1995",
        iso: "1995-08-24T00:00:00Z",
        yearsBefore: "42 years",
        description:
            "Microsoft launched Windows 95 as personal computers entered more homes, schools, and workplaces. Graphical computing and Internet access became mainstream while organizations discovered how much older business software still depended on two-digit years.",
        source: "https://news.microsoft.com/facts-about-microsoft/",
        sourceLabel: "Microsoft — Facts about Microsoft",
        icon: "windows",
    },
    {
        name: "THE UNITED STATES & Y2K",
        date: "02/06/1997",
        iso: "1997-02-06T00:00:00Z",
        yearsBefore: "40 years",
        description:
            "The U.S. Office of Management and Budget issued its initial federal Y2K report. Its strategy covered finding, repairing, testing, and tracking vulnerable systems, showing that the millennium bug could not be solved by changing a single clock.",
        source: "https://clintonwhitehouse4.archives.gov/OMB/inforeg/y2k5q.html",
        sourceLabel: "White House Archive — Federal Y2K report",
        icon: "us",
    },
    {
        name: "BIRTH OF THE PRESIDENTIAL Y2K COUNCIL",
        date: "02/04/1998",
        iso: "1998-02-04T00:00:00Z",
        yearsBefore: "39 years",
        description:
            "The President’s Council on Year 2000 Conversion coordinated federal, state, local, and private-sector preparation. Its creation reflected the scale of the problem: resilient infrastructure depended on cooperation across organizations, industries, and borders.",
        source: "https://clintonwhitehouse4.archives.gov/WH/New/Commerce/read.html",
        sourceLabel: "White House Archive — Y2K Council",
        icon: "y2k-council",
    },
    {
        name: "Y2K INFORMATION DISCLOSURE ACT",
        date: "10/19/1998",
        iso: "1998-10-19T00:00:00Z",
        yearsBefore: "39 years",
        description:
            "The Year 2000 Information and Readiness Disclosure Act became U.S. law. It encouraged companies and public organizations to exchange Y2K information, testing methods, repair strategies, and readiness reports across company and national borders.",
        source: "https://www.govinfo.gov/link/plaw/105/public/271",
        sourceLabel: "GovInfo — Public Law 105-271",
        icon: "y2k-act",
    },
    {
        name: "INTERNATIONAL Y2K COOPERATION CENTER",
        date: "02/01/1999",
        iso: "1999-02-01T00:00:00Z",
        yearsBefore: "38 years",
        description:
            "The International Y2K Cooperation Center promoted communication and strategic cooperation among governments, organizations, and the private sector. Global digital risks required shared status reports, contingency plans, and trusted communication—not isolated patches.",
        source: "https://digitallibrary.un.org/record/426168/files/A_55_387-EN.pdf",
        sourceLabel: "United Nations Digital Library",
        icon: "y2k-coop",
    },
    {
        name: "FIRST GPS WEEK NUMBER ROLLOVER",
        date: "08/21/1999",
        iso: "1999-08-21T23:59:47Z",
        yearsBefore: "38 years",
        description:
            "Legacy GPS navigation messages stored the week number using only 10 bits, allowing values from 0 to 1,023. The first rollover showed that calendar problems were not limited to Y2K: any fixed-width time counter can eventually run out of representable values.",
        source: "https://www.gps.gov/news/gps-week-number-rollover",
        sourceLabel: "GPS.gov — Week number rollover",
        icon: "gps",
    },
    {
        name: "THE MILLENNIUM ROLLOVER",
        date: "12/31/1999",
        iso: "1999-12-31T23:59:59Z",
        yearsBefore: "38 years",
        description:
            "As clocks approached the year 2000, years of inventories, code changes, equipment replacement, testing, coordination, and contingency planning faced their decisive moment. Governments and operators watched critical systems as the date rolled over worldwide.",
        source: "https://www.gao.gov/assets/aimd-00-290.pdf",
        sourceLabel: "U.S. GAO — Year 2000 computing challenge",
        icon: "warning",
    },
    {
        name: "Y2K PASSES WITHOUT A GLOBAL BREAKDOWN",
        date: "01/01/2000",
        iso: "2000-01-01T00:00:00Z",
        yearsBefore: "38 years",
        description:
            "The millennium rollover passed without the catastrophic worldwide failure many feared. Most reported problems were minor or quickly controlled. This did not prove the threat was imaginary; it showed the effect of years of preparation and remediation.",
        source: "https://www.gao.gov/assets/aimd-00-290.pdf",
        sourceLabel: "U.S. GAO — Year 2000 computing challenge",
        icon: "y2k-pass",
    },
    {
        name: "A SATELLITE GROUND SYSTEM FAILS",
        date: "01/01/2000",
        iso: "2000-01-01T00:01:00Z",
        yearsBefore: "38 years",
        description:
            "A U.S. Department of Defense satellite-based intelligence system experienced a Y2K failure in its ground-processing station shortly after the GMT rollover. Backup procedures maintained high-priority work at reduced capacity until full operation returned.",
        source: "https://www.gao.gov/assets/aimd-00-290.pdf",
        sourceLabel: "U.S. GAO — Year 2000 computing challenge",
        icon: "satellite",
    },
    {
        name: "FAA WEATHER SYSTEMS REPORT Y2K PROBLEMS",
        date: "01/01/2000",
        iso: "2000-01-01T00:02:00Z",
        yearsBefore: "38 years",
        description:
            "The U.S. Federal Aviation Administration reported several Y2K-related problems, including failures at eight wind-shear alert sites and a weather display that showed 2010. No issue affected aviation safety, service, or capacity.",
        source: "https://www.gao.gov/assets/aimd-00-290.pdf",
        sourceLabel: "U.S. GAO — Year 2000 computing challenge",
        icon: "weather",
    },
    {
        name: "JAPAN CONFIRMS 11 Y2K INCIDENTS",
        date: "01/03/2000",
        iso: "2000-01-03T00:00:00Z",
        yearsBefore: "38 years",
        description:
            "Japan’s Y2K Computer Problem Center confirmed 11 incidents, including anomalies in a nuclear reactor safety display, monitoring systems, a radioactive-waste facility time display, and fax services. The problems were resolved without a public emergency.",
        source: "https://www.mofa.go.jp/y2k/kinfo_00038.html",
        sourceLabel: "Ministry of Foreign Affairs of Japan",
        icon: "japan",
    },
    {
        name: "LEAP-DAY TEST",
        date: "02/29/2000",
        iso: "2000-02-29T00:00:00Z",
        yearsBefore: "37 years",
        description:
            "February 29, 2000 was another important test. Some older programs used oversimplified rules and failed to recognize that 2000 was a leap year because century years are leap years only when divisible by 400. Most disruptions were minor.",
        source: "https://www.gao.gov/assets/gao-01-263.pdf",
        sourceLabel: "U.S. GAO — Lessons learned from Y2K",
        icon: "calendar",
    },
    {
        name: "THE IPHONE",
        date: "01/09/2007",
        iso: "2007-01-09T17:00:00Z",
        yearsBefore: "31 years",
        description:
            "Apple introduced the original iPhone as a phone, widescreen media player, and Internet communication device. Smartphones became central to navigation, banking, healthcare, authentication, and communication—all dependent on reliable operating systems and timestamps.",
        source: "https://www.apple.com/newsroom/2007/01/09Apple-Reinvents-the-Phone-with-iPhone/",
        sourceLabel: "Apple Newsroom — iPhone introduction",
        icon: "iphone",
    },
    {
        name: "THE BITCOIN WHITE PAPER",
        date: "10/31/2008",
        iso: "2008-10-31T00:00:00Z",
        yearsBefore: "29 years",
        description:
            "The Bitcoin white paper described a peer-to-peer electronic cash system that records transactions in a distributed chain of timestamped blocks. It illustrates how deeply time is embedded in modern digital systems.",
        source: "https://bitcoin.org/bitcoin.pdf",
        sourceLabel: "Bitcoin — Bitcoin: A Peer-to-Peer Electronic Cash System",
        icon: "bitcoin",
    },
    {
        name: "GPS ROLLS OVER AGAIN",
        date: "04/06/2019",
        iso: "2019-04-06T23:59:42Z",
        yearsBefore: "18 years",
        description:
            "The legacy GPS week number returned to zero for the second time. Devices not designed to resolve the rollover could display incorrect dates or require firmware updates, reminding the world that old hardware can outlive its original time counter.",
        source: "https://www.gps.gov/news/gps-week-number-rollover",
        sourceLabel: "GPS.gov — Week number rollover",
        icon: "gps",
    },
    {
        name: "COVID-19",
        date: "03/11/2020",
        iso: "2020-03-11T00:00:00Z",
        yearsBefore: "17 years",
        description:
            "The World Health Organization characterized COVID-19 as a pandemic. The response highlighted society’s dependence on digital communication, remote work, online education, health databases, delivery platforms, and resilient automated services.",
        source: "https://www.who.int/director-general/speeches/detail/who-director-general-s-opening-remarks-at-the-media-briefing-on-covid-19---11-march-2020",
        sourceLabel: "World Health Organization",
        icon: "virus",
    },
    {
        name: "64-BIT SUPPORT EXTENDS ON 32-BIT SYSTEMS",
        date: "08/01/2021",
        iso: "2021-08-01T00:00:00Z",
        yearsBefore: "16 years",
        description:
            "GNU C Library 2.34 became available. On supported 32-bit platforms, developers could use the _TIME_BITS=64 feature to make time_t 64 bits wide and handle timestamps beyond 2038—part of the quiet work protecting older architectures.",
        source: "https://lists.gnu.org/archive/html/info-gnu/2021-08/msg00001.html",
        sourceLabel: "GNU — glibc 2.34 release announcement",
        icon: "64-bit",
    },
    {
        name: "THE LAST FULL STABLE YEAR",
        date: "12/31/2037",
        iso: "2037-12-31T23:59:59Z",
        yearsBefore: "0 years",
        description:
            "2037 is the final complete year before the signed 32-bit Unix clock reaches its limit. Most modern systems use safer formats, but unpatched embedded devices and legacy software can be difficult to locate and may remain quietly in service.",
        source: "https://man7.org/linux/man-pages/man3/time.3p.html",
        sourceLabel: "Linux man-pages — time(3p)",
        icon: "warning",
    },
    {
        name: "Y2K38 OVERFLOW",
        date: "01/19/2038 03:14:08 UTC",
        iso: "2038-01-19T03:14:08Z",
        yearsBefore: "0 years",
        description:
            "The correct 64-bit Unix timestamp becomes 2,147,483,648. In a signed 32-bit field, the bit pattern is interpreted as −2,147,483,648, sending the represented date back to December 13, 1901. Software may return an error, crash, reject data, or fail in another undefined way.",
        source: "https://man7.org/linux/man-pages/man2/time.2.html",
        sourceLabel: "Linux man-pages — time(2)",
        icon: "skull",
    },
];
