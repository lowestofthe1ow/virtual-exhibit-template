import '../../../styles/s03g7/S03_Group7_spectre.css';
import { useReveal } from "./Animation.jsx";

const REFERENCES = [
  {
    authors: "Aktas Aydin, H., & Yalcin Alkan, G.",
    year: "2023",
    title: "SPECTRE: Analysis of attacks and defense mechanisms against Spectre.",
    source:
      "In Proceedings of the International Congress on Advanced Research and Applications. Turkey. https://www.researchgate.net/publication/380897005_SPECTRE_ANALYSIS_OF_ATTACKS_AND_DEFENSE_MECHANISIMS_AGAINST_TO_SPECTRE",
  },
  {
    authors:
      "Kee, W. J., Abdul Kadir, M. F., Wahab, F. A., Zakaria-Mohamad, A. H., Mohamed, M. A., & Abidin-Bharun, A. F. A.",
    year: "2018",
    title:
      "A review on Spectre attacks and Meltdown with its mitigation techniques.",
    source:
      "International Journal of Engineering & Technology, 7(3.28), 209–213. https://www.researchgate.net/publication/329810347_A_Review_on_spectre_attacks_and_meltdown_with_its_mitigation_techniques",
  },
  {
    authors:
      "Lipp, M., Schwarz, M., Gruss, D., Prescher, T., Haas, W., Mangard, S., Kocher, P., Genkin, D., Yarom, Y., & Hamburg, M.",
    year: "2018",
    title: "Meltdown.",
    source:
      "arXiv:1801.01207. https://arxiv.org/abs/1801.01207",
  },
  {
    authors: "Smith, A. J.",
    year: "1982",
    title: "Cache memories.",
    source:
      "ACM Computing Surveys, 14(3), 473–530. https://doi.org/10.1145/356887.356892",
  },
  {
    authors:
      "Wahab, F. A., Zakaria, A. H., Mohamed, M. A., & Abdul Kadir, M. F.",
    year: "2020",
    title: "Mitigating risk of Spectre and Meltdown vulnerabilities.",
    source:
      "International Journal of Advanced Trends in Computer Science and Engineering, 9(5), 741–746. https://www.researchgate.net/publication/344411705_Mitigating_Risk_of_Spectre_and_Meltdown_Vulnerabilities",
  },
];

function ReferenceItem({ reference, index }) {
  const [ref, visible] = useReveal(0.3);
  return (
    <li
      ref={ref}
      tabIndex={0}
      className={`reference-item reveal-left ref-anim ${visible ? "is-visible" : ""}`}
      style={{ transitionDelay: `${index * 90}ms` }}
    >
      <span className={`reference-index ${visible ? "pulse" : ""}`}>
        {String(index + 1).padStart(2, "0")}
      </span>
      <p className="reference-text">
        <span className="reference-authors">{reference.authors}</span>{" "}
        <span className="reference-year">({reference.year}).</span>{" "}
        <span className="reference-title">{reference.title}</span>{" "}
        {reference.source && <span className="reference-source"> {reference.source}</span>}
      </p>
    </li>
  );
}

export default function References() {
  return (
    <div className="spectreTheme">
      <section className="section">
        <div className="section-inner">
          <div className="section-label">References</div>
          <h2 className="section-heading">Sources</h2>
          <p className="section-body">
            The research and reporting this exhibit draws from.
          </p>

          <ol className="reference-list">
            {REFERENCES.map((reference, index) => (
              <ReferenceItem reference={reference} index={index} key={reference.title} />
            ))}
          </ol>
        </div>
      </section>

      <style suppressHydrationWarning>{`
        .reference-list {
          list-style: none;
          margin: 2rem 0 0;
          padding: 0;
        }

        .reference-item {
          align-items: baseline;
          border-top: 1px solid var(--border-dim);
          border-radius: 6px;
          cursor: default;
          display: grid;
          gap: 1.25rem;
          grid-template-columns: 2.5rem minmax(0, 1fr);
          padding: 1.1rem 0.75rem;
          transition:
            background 0.3s ease,
            transform 0.3s cubic-bezier(0.22, 1, 0.36, 1),
            box-shadow 0.3s ease;
        }

        .reference-item:first-child {
          border-top: none;
        }

        .reference-item:hover,
        .reference-item:focus-visible {
          background: rgba(0, 255, 136, 0.05);
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.18);
          outline: none;
          transform: translateX(10px);
        }

        .reference-index {
          color: var(--green);
          font-family: var(--font-mono);
          font-size: 0.78rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .reference-item:hover .reference-index,
        .reference-item:focus-visible .reference-index {
          transform: translateX(2px) scale(1.08);
        }

        .reference-index.pulse {
          animation: refPulse 0.6s ease-out;
        }

        @keyframes refPulse {
          0% { text-shadow: 0 0 0 rgba(0, 255, 136, 0.6); }
          100% { text-shadow: 0 0 14px rgba(0, 255, 136, 0); }
        }

        .reference-text {
          color: var(--text-body);
          font-size: 0.88rem;
          line-height: 1.75;
          margin: 0;
        }

        .reference-authors {
          color: var(--text);
          font-weight: 500;
        }

        .reference-year {
          color: var(--text-body);
        }

        .reference-title {
          color: var(--text-body);
          font-style: italic;
        }

        .reference-source {
          color: var(--text-muted);
        }

        @media (max-width: 640px) {
          .reference-item {
            gap: 0.85rem;
            grid-template-columns: 2rem minmax(0, 1fr);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .reference-item,
          .reference-index,
          .reference-index.pulse {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>
    </div>
  );
}