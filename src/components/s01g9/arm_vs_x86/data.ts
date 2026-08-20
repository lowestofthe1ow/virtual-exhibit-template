export interface ComparisonRow {
  attribute: string;
  arm: string;
  x86: string;
}

export interface ArchitectureData {
  name: string;
  tagline: string;
  gradientFrom: string;
  gradientTo: string;
  isa: string;
  overview: string;
  performance: { metric: string; arm: number; x86: number }[];
  useCases: string[];
  keyDevices: { name: string; description: string }[];
  pros: string[];
  cons: string[];
  comparisonTable: ComparisonRow[];
}

const comparisonTable: ComparisonRow[] = [
  { attribute: "Architecture Type", arm: "RISC (Reduced Instruction Set)", x86: "CISC (Complex Instruction Set)" },
  { attribute: "Power Consumption", arm: "lower, ideal for mobile devices", x86: "Higher, suited for desktops" },
  { attribute: "Performance Focus", arm: "Optimized for energy savings", x86: "Designed for high performance" },
  { attribute: "Hardware Complexity", arm: "Simpler, smaller chip designs", x86: "More complex, larger chip designs" },
  { attribute: "Software Ecosystem", arm: "Growing but smaller than x86", x86: "Extensive support for legacy applications" },
  { attribute: "Use Cases", arm: "Best for mobile and IoT", x86: "Dominates in desktops and servers" },
  { attribute: "Multitasking Capability", arm: "Efficient for parallel tasks", x86: "Strong with specialized features" },
  { attribute: "Heat Generation", arm: "Lower heat output", x86: "Higher heat output requiring cooling" },
  { attribute: "Future Trends", arm: "Increasing in PCs and servers", x86: "Maintaining dominance in HPC" },
];

export const armData: ArchitectureData = {
  name: "ARM",
  tagline: "RISC · Power Efficient · Mobile-First",
  gradientFrom: "from-s01g9-arm",
  gradientTo: "to-cyan-500",
  isa: "RISC",
  overview:
    "ARM (Advanced RISC Machine) is a family of processors based on the Reduced Instruction Set Computing (RISC) architecture, designed to deliver high performance while consuming low power. Originally developed by Acorn Computers and now designed by Arm Holdings, ARM processors are licensed to various companies, allowing manufacturers to customize them for different applications. Their energy efficiency, flexibility, and reliable performance have made them the dominant processor architecture in smartphones, tablets, embedded systems, Internet of Things (IoT) devices, and an increasing number of personal computers.",
  performance: [
  { metric: "Time per Request (ms)", arm: 2157.87, x86: 1633.80 },
  { metric: "Transfer Rate (KB/s)", arm: 711.27, x86: 870.12 },
  { metric: "Processing Time (ms)", arm: 2011.00, x86: 1512.00 },
  { metric: "Waiting Time (ms)", arm: 1722.00, x86: 1308.00 },
  { metric: "Total Time (ms)", arm: 2023.00, x86: 1522.00 },
],
  useCases: [
    "Mobile Devices (Modern smartphones, tablets, cameras, fingerprint recognition and other smartphone functions.",
    "Servers and Data Centers (AWS Graviton, Cloud computing and containerized workloads, Energy-efficient alternative to traditional x86 servers)",
    "Automotive and Autonomous Driving (In-vehicle computing systems, Driver assistance and self-driving technologies, ARM AVA platform with 32 Neoverse cores for autonomous vehicle development)",
    "Custom Silicon (Custom chips designed by companies like Apple, Amazon, and Microsoft, Reduces Reliance on traditional chip manufacturers, Enables specialized computer subsystems and integrated chip designs)",
    "Internet of Things (Smart devices and connected systems, Low-power embedded applications, and Efficient processing for always-on devices)",
  ],
  keyDevices: [
    { name: "Apple iPhone 16 Pro", description: "Apple A18 Pro chip - 6-core CPU, 6-core GPU, 16-core Neural Engine" },
    { name: "Apple Watch Series 10", description: "Apple S10 SiP - Dual-core CPU with 4-core Neural Engine" },
    { name: "Samsung Galaxy S25 Ultra", description: "Qualcomm Snapdragon 8 Elite for Galaxy - Custom ARM-based processor" },
    { name: "Google Pixel 10 Pro", description: "Google Tensor G5 - Custom ARM-based processor" },
    { name: "AWS Graviton 4", description: "ARM Neoverse V2-based processor for cloud computing" },
    { name: "NVIDIA Drive AGX", description: "Arm Neoverse V3AE CPU with Blackwell GPU for autonomous driving" },
    { name: "Tesla Model Y", description: "Tesla AI4 self-driving computer with custom ARM-based CPU" },
  ],
  pros: [
    "Power Efficient - Uses less power, extending battery life.",
    "Fast Performance - Low latency with efficient instruction execution.",
    "Cost Effective - Affordable to manufacture, reducing device costs.",
    "Compact Design - Small chip size fits smartphones, wearables, and IoT devices.",
    "Scalable - Powers everything from embedded systems to cloud servers.",
    "Load-Store Architecture - Improves efficiency by reducing memory access",
    "Multiprocessing Support - Supports multi-core processors for better performance.",
  ],
  cons: [
    "Limited x86 Compatibility - cannot run some x86 software natively.",
    "Lower Peak Performance - May be slower than high-end x86 processors in demanding workloads.",
    "Software Compatibility Issues - Some applications are not optimized for ARM.",
    "Complex Instruction Scheduling - Efficient Performance depends on optimized software.",
    "Limited Multitasking - Some ARM chips are less efficient at handling many intensive tasks simultaneously.",
  ],
  comparisonTable,
};

export const x86Data: ArchitectureData = {
  name: "x86",
  tagline: "CISC · High Performance · Desktop Dominant",
  gradientFrom: "from-s01g9-x86",
  gradientTo: "to-amber-500",
  isa: "CISC",
  overview:
    "x86 is a widely used Instruction Set Architecture (ISA) that defines how software communicates with the CPU. Based on the Complex Instruction Set Computing (CISC) design, x86 supports complex instructions that can perform multiple operations in a single command. This makes it well-suited for high-performance computing tasks and is why it is commonly used in desktops, laptops, workstations, and servers.",
  performance: [
  { metric: "Time per Request (ms)", arm: 2157.87, x86: 1633.80 },
  { metric: "Transfer Rate (KB/s)", arm: 711.27, x86: 870.12 },
  { metric: "Processing Time (ms)", arm: 2011.00, x86: 1512.00 },
  { metric: "Waiting Time (ms)", arm: 1722.00, x86: 1308.00 },
  { metric: "Total Time (ms)", arm: 2023.00, x86: 1522.00 },
],
  useCases: [
  "Personal Computers (Desktops, laptops, workstations, productivity software, web browsing, multimedia, and gaming)",
  "High-Performance Computing (CAD design, scientific simulations, 3D rendering, engineering, and other compute-intensive workloads)",
  "Servers and Data Centers (Cloud computing, enterprise servers, virtualization, databases, web hosting, and large-scale infrastructure)",
  "Enterprise Systems (Email servers, inventory management, supply chain logistics, customer databases, and business applications)",
  "AI and Machine Learning (Hosts AI frameworks, feeds GPUs with data, and powers AI servers and model deployment)",
  "Critical Infrastructure (ATMs, banking systems, payment processing, stock exchanges, weather forecasting, and cloud services)"
],
  keyDevices: [
  { name: "Dell XPS 15", description: "Intel Core Ultra processor - High-performance x86 laptop for productivity and creative workloads" },
  { name: "Lenovo ThinkPad X1 Carbon", description: "Intel Core Ultra processor - Business-focused x86 laptop with enterprise features" },
  { name: "ASUS ROG Strix G16", description: "Intel Core i9 processor - x86 gaming laptop paired with NVIDIA RTX graphics" },
  { name: "HP OMEN 45L", description: "AMD Ryzen 9 processor - High-performance x86 desktop for gaming and content creation" },
  { name: "Dell PowerEdge R760", description: "Intel Xeon Scalable processors - Enterprise x86 server for virtualization and data centers" },
  { name: "HPE ProLiant DL385 Gen11", description: "AMD EPYC processors - x86 server optimized for cloud, AI, and enterprise workloads" },
  { name: "Microsoft Azure HBv4", description: "AMD EPYC Genoa-based x86 virtual machines for high-performance computing" },
],
  pros: [
  "High Performance - Excels at gaming, content creation, scientific computing, and other demanding workloads.",
  "Wide Software Compatibility - Runs a massive ecosystem of operating systems, applications, and legacy software.",
  "Advanced Features - Supports virtualization, hyper-threading, and other powerful computing technologies.",
  "Highly Expandable - Easily upgraded with additional memory, storage, GPUs, and other hardware.",
  "Excellent Multitasking - Handles multiple resource-intensive applications efficiently.",
  "Well-Optimized Ecosystem - Decades of software and hardware optimization ensure reliable performance.",
],

cons: [
  "Higher Power Consumption - Uses more energy than ARM processors, reducing battery life.",
  "Greater Heat Output - Generates more heat, requiring larger cooling solutions.",
  "Less Efficient for Mobile Devices - Not ideal for smartphones, wearables, and other battery-powered devices.",
  "More Complex Architecture - CISC design increases hardware complexity and chip design costs.",
  "Security Challenges - More susceptible to certain hardware and memory-related vulnerabilities due to its complexity.",
],
  comparisonTable,
};
