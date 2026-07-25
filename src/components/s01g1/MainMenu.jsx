/**
 * MainMenu.jsx
 *
 * Main Menu for the ride.
 * Users can start the interactive ride.
 */

// Astro handles routing natively — no react-router-dom needed.

const ERAS = [
  {
    id: "mail",
    title: "Mail Era",
    description: "Experience how handwritten letters traveled across land and sea.",
  },
  {
    id: "telephone",
    title: "Telephone Era",
    description: "Discover switchboards and the first live voice communication.",
  },
  {
    id: "internet",
    title: "Internet Era",
    description: "Connect through dial-up modems and early websites.",
  },
  {
    id: "fiber",
    title: "Fiber Optic Era",
    description: "Learn how light replaced electricity for faster data transfer.",
  },
  {
    id: "wifi",
    title: "Wi-Fi Era",
    description: "Explore modern wireless communication and mobile devices.",
  },
];

const s = {
  root: {
    maxWidth: "900px",
    margin: "0 auto",
    padding: "2rem 1rem",
  },

  heading: {
    fontSize: "2.5rem",
    fontWeight: "700",
    marginBottom: "0.5rem",
    color: "var(--text)",
  },

  subtitle: {
    color: "var(--muted)",
    lineHeight: "1.6",
    marginBottom: "2rem",
  },

  startButton: {
    display: "inline-block",
    padding: "0.8rem 1.5rem",
    border: "1px solid var(--accent)",
    borderRadius: "4px",
    background: "var(--accent)",
    color: "#fff",
    textDecoration: "none",
    fontWeight: "600",
    marginBottom: "2rem",
  },

  section: {
    borderTop: "1px solid var(--border)",
    paddingTop: "1.5rem",
  },

  label: {
    fontSize: "0.7rem",
    textTransform: "uppercase",
    letterSpacing: "0.1em",
    color: "var(--muted)",
    marginBottom: "1rem",
  },

  list: {
    listStyle: "none",
    padding: 0,
    margin: 0,
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
  },

  card: {
    display: "block",
    padding: "1rem",
    border: "1px solid var(--border)",
    borderRadius: "4px",
    textDecoration: "none",
    color: "inherit",
    background: "var(--bg1)",
  },

  title: {
    fontSize: "1rem",
    fontWeight: "600",
    marginBottom: "0.25rem",
  },

  description: {
    fontSize: "0.9rem",
    color: "var(--muted)",
    lineHeight: "1.5",
  },
};

export default function MainMenu() {
  return (
    <div style={s.root}>
      <h1 style={s.heading}>Journey of A Message</h1>

      <p style={s.subtitle}>
        Welcome to <strong>Journey of a Message</strong>, an interactive exhibit where you
        become a piece of data traveling through the evolution of communication.
        Begin the ride to discover how information moved from handwritten
        letters to today's wireless world.
      </p>

      <a href="/ride" style={s.startButton}>
        Start the Data Ride
      </a>

      <div style={s.section}>
        <div style={s.label}>Explore the Eras</div>

        <ul style={s.list}>
          {ERAS.map((era) => (
            <li key={era.id}>
              <a href={`/${era.id}`} style={s.card}>
                <div style={s.title}>{era.title}</div>
                <div style={s.description}>{era.description}</div>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
