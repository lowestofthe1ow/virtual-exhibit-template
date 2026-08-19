/* 
    Disclosure on the use of AI/LLM:
    - AI was used to help separate the referenced entire map SVG (Due to large size) into only the east asian maps that the group is working on.
    - Countries taken: China, Japan, South Korea, and Taiwan only. North Korea is shown for geographic context and is not clickable. Hong Kong and Macau not included anymore.

    References:
    https://github.com/flekschas/simple-world-map by Al MacDonald (as the original artwork) and Fritz Lekschas as the editor of this work.
*/

import { useState } from "react";
import "../../styles/s02g2/made-in-asia.css";

import china_1 from "../../assets/s02g2/china_1.webp";
import china_2 from "../../assets/s02g2/china_2.webp";
import japan_1 from "../../assets/s02g2/japan_1.webp";
import japan_2 from "../../assets/s02g2/japan_2.webp";
import sk_1 from "../../assets/s02g2/sk_1.webp";
import sk_2 from "../../assets/s02g2/sk_2.webp";
import taiwan_1 from "../../assets/s02g2/taiwan_1.jpg";
import taiwan_2 from "../../assets/s02g2/taiwan_2.webp";

// Country Data with contributions and other future information if changes are needed
// Contributions are taken from Country Information and more will be added soon.
const countryData = {
    china: {
        name: "China",
        images: [
            { src: china_1, alt: "Sunway TaihuLight supercomputer" },
            { src: china_2, alt: "RISC-V open ISA development" },
        ],
        contribution:(
            <ul>
                <li> Developed the Sunway TaihuLight supercomputer using entirely native SW26010 processors to break reliance on Western silicon. Natively fusing 4 Management Processing Elements (MPEs) and 8x8 mesh of 256 Computing Processing Elements (CPEs) directly on a single 64-bit RISC die. Surpassing 100 Petaflops in performance in 2016.</li>
                <li> Leading the global adoption and development of RISC-V to build processors independent of proprietary x86 or ARM standards. One implementation is RiVAl Technologies' Lingyu CPU featuring 32 general-purpose cores and 8 specialized intelligent computing cores for large-scale data processing, energy efficiency, and AI inferences.</li>
            </ul>
        ),
    },

    japan: {
        name: "Japan",
        images: [
            { src: japan_1, alt: "Intel 4004 co-design" },
            { src: japan_2, alt: "NAND Flash Memory invention" },
        ],
        contribution: (
            <ul>
                <li>Co-designed the Intel 4004 (1971), shifting CPU execution units from multi-board to a single monolithic silicon die. It integrated a 4-bit ALU, 4-bit file, 12-bit address bus logic unit, and control mechanisms onto one IC. Shifting the paradigm for modern single-chip microprocessors.</li>
                <li>Invented NAND Flash Memory in the 1980s (Toshiba) which increased storage density and introduced page-write/block-erase cycles, changing the memory hierarchy and paving the way for modern Solid State Drives and DRAM.</li>
                <li>Integrated 64-bit architecture with dedicated graphics co-processing vector units in the Nintendo 64 and the 512-bit ARM SVE set in the Fugaku supercomputer.</li>
            </ul>
        ),
    },

    southkorea: {
        name: "South Korea",
        images: [
            { src: sk_1, alt: "Samsung and SK Hynix memory architecture" },
            { src: sk_2, alt: "High-Bandwidth Memory (HBM)" },
        ],
        contribution: (
            <ul>
                <li>Overcame 2D scaling limits by engineering 3D Vertical-NAND architecture (Samsung). It utilizes Charge Trap Flash (CTF) technology and Channel Hole structures to drastically increase storage density.</li>
                <li>Pioneered High-Bandwidth Memory 2.5D packaging, solving DRAM bottlenecks, and an ultra-wide 1024-bit data bus for Terabyte-per-second AI execution bandwidth.</li>
                <li>Popularized Heterogeneous Multi-Processing (HMP) in mobile System-on-Chips (SoCs) via the ARM big.LITTLE architecture (Samsung). Integrating high-performance out-of-order cores with energy-efficient in-order cores on a single die.</li>
            </ul>
        ),
    },

    taiwan: {
        name: "Taiwan",
        images: [
            { src: taiwan_1, alt: "TSMC chip fabrication" },
            { src: taiwan_2, alt: "PC motherboard standardization" },
        ],
        contribution: (
            <ul>
                <li>Established the Pure-Play Foundry model (TSMC), structurally separating IC architectural design from physical fabrication. Enabling global companies to execute logic block designs without owning physical factories.</li>
                <li>Standardized the structural topology of PC motherboards (ASUS, Gigabyte, Acer, etc.) in the 1990s by perfecting the two-part core logic chipset layout. Systematically routed Front-Side Bus (FSB) traces for high-speed CPU-to-Northbridge to communicate with lower-speed I/O peripheral buses like PCIe or SATA.</li>
            </ul>
        ),
    },
}

export default function Map() {
    const [selected, setSelected] = useState(null);
    const [expandedImage, setExpandedImage] = useState(null);

    const active = selected ? countryData[selected] : null;

    const select = (id) => () => {
        setSelected(id);
        setExpandedImage(null);
    };
    const selectOnKey = (id) => (e) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setSelected(id);
            setExpandedImage(null);
        }
    };

    const openImage = (img) => () => setExpandedImage(img);
    const openImageOnKey = (img) => (e) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setExpandedImage(img);
        }
    };

    const shapeProps = (id) => ({
        className: `country country-${id} ${selected === id ? 'country-active' : ''}`,
        onClick: select(id),
        onKeyDown: selectOnKey(id),
        role: "button",
        tabIndex: 0,
        'aria-label' : countryData[id].name,
        'aria-pressed' : selected === id,
    });

    return (
        <section className="exhibit-grid">
            <div className="map-container">
                <svg
                    className="map-svg"
                    viewBox="559.4 351.4 192.2 135.6"
                    xmlns="http://www.w3.org/2000/svg"
                    role="img"
                    aria-label="Map of China, Japan, South Korea, and Taiwan"
                >
                    {/* China */}
                    <path
                        d="M594.498,386.128l-2.99,7.521l-4.124-0.217l-4.349,9.518l3.691,4.701l-7.606,10.504l-3.907-0.658l-2.611,3.285l0.648,1.971l3.043,0.217l1.521,3.5l3.044,0.658l9.344,12.04v6.129l4.563,2.844l4.996-0.873l6.303,3.719l7.605,2.187l3.691-0.439l4.132-0.441l8.687-5.688l2.828,0.44l1.08,2.567l2.396,0.718l3.26,4.813l-2.17,4.814l1.306,3.285l3.69,1.312l0.647,3.942l4.35,0.439l0.647-1.971l6.302-3.285l3.907,0.217l4.563,5.03l3.043-1.312l1.954,0.216l0.873,2.412l1.521,0.216l2.169-3.06l8.688-3.285l7.823-9.413l2.61-8.974l-0.217-5.912l-3.259-0.656l1.953-2.188l-0.434-3.501l-8.255-8.314v-4.157l2.386-3.062l2.388-1.098l0.216-2.412h-6.085l-1.089,3.285l-2.828-0.656l-3.475-3.718l2.17-5.688l3.043-3.285l2.827,0.217l-0.434,5.031l1.521,1.313l3.691-3.717l1.306-0.216l-0.433-2.844l3.476-4.158l2.61,0.216l1.521-4.813l1.781-0.942l0.182-3l-1.729-1.815l-0.147-4.736l3.329-0.217l-0.216-12.214l-2.334,1.4L694.267,377l-3.897-0.009l-11.298-6.354l-8.16-9.837l-8.281-0.086l-2.107,1.833l2.68,6.137l-0.935,5.758l-3.335,1.383l-1.876-0.147l-0.139,5.696l1.954,0.441l3.476-1.53l4.563,2.187v2.188l-3.26,0.216l-2.611,5.688l-2.386,0.215l-8.472,11.16l-8.902,3.941l-6.086,0.441l-4.124-2.844l-5.869,3.068l-6.302-1.971l-1.521-4.158l-10.642-0.657l-5.646-9.188h-2.386l-1.92-4.262L594.498,386.128z"
                        {...shapeProps("china")}
                    >
                        <title>China</title>
                    </path>
 
                    <path
                        d="M671.802,472.655l-2.064,0.579l-1.487,1.833l1.236,2.411l1.814,0.163l2.066-1.832l0.492-2.411L671.802,472.655L671.802,472.655z"
                        {...shapeProps("china")}
                    >
                        <title>China</title>
                    </path>
 
                    {/* Japan */}
                    <path
                        d="M709.317,426.193l-1.41,1.418l0.579,1.996l1.236,0.086l0.83,4.332l0.993,1.08l1.738-1.582l0.151-4.773l-2-2.125L709.317,426.193L709.317,426.193z"
                        {...shapeProps("japan")}
                    >
                        <title>Japan</title>
                    </path>
 
                    <path
                        d="M716.688,422.188l-2.659,2.156l-0.591,2.719l1.812,1.25l2.625-2.75l0.37-3.062L716.688,422.188z"
                        {...shapeProps("japan")}
                    >
                        <title>Japan</title>
                    </path>
 
                    <path
                        d="M713.613,418.033l-4.219,4.832v2.322l2.604-0.312l4.085-3.592l2.731-0.502l0.663,0.779l0.015,2.377l0.688,1.25h1.255l1.763-2.158l0.743-2.836l3.552-0.086l3.476-4.166l-1.814-6.916l-0.83-3.664l1.815-1.496l-4.133-6.241l-0.944-0.744l-1.875,0.744l-0.481,2.584v2.083l0.994,1.167l0.328,5.498l-2.56,3.164l-1.485-0.917l-1.159,2.584l-0.251,2.412l0.909,1.418l-0.579,1.08l-1.902-1.582h-1.322l-1.157,0.666L713.613,418.033L713.613,418.033z"
                        {...shapeProps("japan")}
                    >
                        <title>Japan</title>
                    </path>
 
                    <path
                        d="M720.729,380.396l-1.321,1.168l0.665,2.498l1.158,1.166l-0.086,3.83l-1.487,0.578l-1.158,2.584l3.388,4.659l2.23-0.752l0.415-1.167l-2.396-2.161l1.487-1.919l1.572,0.25l3.43,2.305l0.37-2.584l1.63-2.979l2.281-2.312l-2.469-1.125l-0.944-1.801l-1.236,0.83l-1.071,1.331l-2.316-0.501l-2.396-1.582L720.729,380.396L720.729,380.396z"
                        {...shapeProps("japan")}
                    >
                        <title>Japan</title>
                    </path>
 
                    <path
                        d="M733.201,377.812l-2.317,3.25l0.164,1.582l1.158-0.502l2.723-3.414L733.201,377.812L733.201,377.812z"
                        {...shapeProps("japan")}
                    >
                        <title>Japan</title>
                    </path>
 
                    <path
                        d="M736.261,373.066l-0.829,2.248l0.086,1.496l1.409-0.918l1.322-2.662v-0.994L736.261,373.066L736.261,373.066z"
                        {...shapeProps("japan")}
                    >
                        <title>Japan</title>
                    </path>
 
                    {/* North Korea (NOT CLICKABLE) */}
                    <path
                        d="M687.751,407.047l1.59,0.666l0.484,5.566l3.155,0.183l2.974-3.483l-1.029-0.916l0.121-3.734l2.731-3.303l-1.392-2.506l0.908-1.039l0.501-2.592l-1.582-0.719l-1.35,0.684l-1.668,5.064l-2.697-0.232l-3.12,3.682L687.751,407.047L687.751,407.047z"
                        className="country-inert"
                        aria-hidden="true"
                    />
 
                    {/* South Korea */}
                    <path
                        d="M696.446,410.443l5.342,4.356l0.909,4.22l-0.183,2.264l-2.61,2.939l-2.248,0.12l-2.551-5.506l-0.968-2.629l1.028-0.795l-0.242-1.099l-1.271-0.569L696.446,410.443L696.446,410.443z"
                        {...shapeProps("southkorea")}
                    >
                        <title>South Korea</title>
                    </path>
 
                    {/* Taiwan */}
                    <path
                        d="M695.686,453.76l-3.06,2.334l-0.163,4.494l2.646,3.078l0.656-0.58L695.686,453.76L695.686,453.76z"
                        {...shapeProps("taiwan")}
                    >
                        <title>Taiwan</title>
                    </path>
                </svg>
            </div>
 
            <div className="country-info-panel">
                {active ? (
                    <div className="country-info">
                        <div className="country-info-text">
                            <h3>{active.name}</h3>
                            <div>{active.contribution}</div>
                        </div>

                        {active.images && active.images.length > 0 && (
                            <div className="country-info-gallery">
                                {active.images.slice(0, 3).map((img, i) => (
                                    <img
                                        key={i}
                                        src={img.src.src ?? img.src}
                                        alt={img.alt}
                                        className="country-thumb"
                                        role="button"
                                        tabIndex={0}
                                        onClick={openImage(img)}
                                        onKeyDown={openImageOnKey(img)}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="placeholder">
                        Click a country on the map to see its contribution
                    </div>
                )}
            </div>

            {expandedImage && (
                <div
                    className="image-lightbox"
                    onClick={() => setExpandedImage(null)}
                    role="button"
                    tabIndex={0}
                    aria-label="Close expanded image"
                    onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " " || e.key === "Escape") {
                            setExpandedImage(null);
                        }
                    }}
                >
                    <img
                        src={expandedImage.src.src ?? expandedImage.src}
                        alt={expandedImage.alt}
                    />
                </div>
            )}
        </section>
    );
}