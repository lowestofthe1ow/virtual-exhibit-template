import React, { useState } from 'react';

type TimelineEvent = {
  title: string;
  body: string;
  imageFile?: string;
  imageAlt?: string;
  caption?: string;
};

type EraId = 'classical' | 'mechanical' | 'wartime' | 'digital';

type EraDefinition = {
  id: EraId;
  label: string;
  description: string;
  eventIndices: number[];
  checkpointQuestion: string;
  checkpointOptions: string[];
  checkpointAnswer: string;
};

const timelineData: TimelineEvent[] = [
  {
    title: 'Caesar Cipher (c. 50 BCE)',
    body: 'The Caesar cipher is one of the earliest known substitution systems. By shifting letters by a fixed amount, it introduces a repeatable encryption rule. This idea, a rule-based transformation of symbols, is a conceptual ancestor of later algorithmic thinking in computing.',
    imageFile: 'caesar-cipher.webp',
    imageAlt: 'Roman inscription and shifted alphabet concept diagram',
    caption: 'Suggested image: Roman era cipher wheel or Caesar shift alphabet chart.'
  },
  {
    title: 'Al-Kindi And Frequency Analysis (c. 850)',
    body: 'Al-Kindi documented frequency analysis, using statistical patterns in language to break substitution ciphers. This transformed codebreaking from guesswork into methodical analysis, an idea that would later influence computation and algorithms.',
    imageFile: 'al-kindi-frequency.webp',
    imageAlt: 'Arabic manuscript with letter frequency notes',
    caption: 'Suggested image: historical manuscript or reconstructed frequency table.'
  },
  {
    title: 'Polyalphabetic Cipher Concepts (1467)',
    body: 'Leone Alberti described rotating alphabets, an idea that increased cipher complexity compared with single-shift methods. This shift from simple substitution to changing state is conceptually related to machine states and program variables.',
    imageFile: 'alberti-disk.webp',
    imageAlt: 'Alberti cipher disk illustration',
    caption: 'Suggested image: Alberti disk or rotating alphabet diagram.'
  },
  {
    title: 'Vigenere Cipher Popularized (1586)',
    body: 'The Vigenere method became a benchmark of stronger manual encryption by changing shifts through a keyword. It remained influential for centuries and pushed analysts to develop deeper pattern-recognition techniques.',
    imageFile: 'vigenere-table.webp',
    imageAlt: 'Tabula recta for Vigenere encryption',
    caption: 'Suggested image: tabula recta and keyword-based encryption example.'
  },
  {
    title: 'Babbage Breaks Vigenere (1854)',
    body: 'Charles Babbage applied systematic analysis to break the Vigenere cipher long before it became widely known. His approach reinforced the relationship between mathematical methods, data organization, and computation—themes that would define his design of the Analytical Engine.',
    imageFile: 'babbage-notes.webp',
    imageAlt: 'Babbage notebooks and analytical diagrams',
    caption: 'Suggested image: Babbage notes or historical cryptanalysis worksheet.'
  },
  {
    title: 'Rotor Machine Era (1917-1920s)',
    body: 'Rotor machines such as Hebern designs and Enigma mechanized complex substitution. Each keypress changed the internal state, creating large keyspaces and operational complexity that demanded automated analysis methods.',
    imageFile: 'rotor-machine.webp',
    imageAlt: 'Electromechanical rotor cipher machine',
    caption: 'Suggested image: Hebern/Enigma machine close-up with rotors visible.'
  },
  {
    title: 'Bletchley Park And Early Machines (1940s)',
    body: 'Codebreakers at Bletchley Park used electromechanical Bombe systems and the electronic Colossus machine to automate parts of cryptanalysis. Their work demonstrated that information problems could be solved by building special-purpose computing machines.',
    imageFile: 'bletchley-colossus.jpg',
    imageAlt: 'Bletchley Park room with Colossus/Bombe equipment',
    caption: 'Suggested image: Bletchley Park operations or Colossus reconstruction.'
  },
  {
    title: 'Information Theory (1948)',
    body: 'Claude Shannon formalized information theory and analyzed secrecy systems mathematically. His work connected communication, probability, and computation, becoming foundational for computing theory and cryptographic science.',
    imageFile: 'shannon-diagram.webp',
    imageAlt: 'Information source-channel-receiver model diagram',
    caption: 'Suggested image: Shannon communication model or entropy visualization.'
  },
  {
    title: 'Public-Key Breakthrough (1976-1977)',
    body: 'Diffie-Hellman introduced practical key exchange, and RSA provided scalable public-key encryption and signatures. These breakthroughs enabled secure communication between computers that had never met, transforming cryptography from a shared-secret model into a mathematical one.',
    imageFile: 'public-key.webp',
    imageAlt: 'Public-key encryption concept with key pairs',
    caption: 'Suggested image: public-key exchange flow diagram.'
  },
  {
    title: 'PGP And Personal Encryption (1991)',
    body: 'Pretty Good Privacy (PGP) brought strong cryptography to personal computers and email, making end-user security practical. It marked a social and technical shift where cryptography moved from state and military contexts into everyday civilian computing.',
    imageFile: 'pgp-email.webp',
    imageAlt: 'Encrypted email interface illustration',
    caption: 'Suggested image: PGP keyring screenshot or encrypted email demo.'
  },
  {
    title: 'SSL/TLS Secures The Web (1994-2001)',
    body: 'SSL and later TLS standardized encrypted web sessions, enabling secure shopping, banking, and authentication online. The padlock model became a familiar symbol of trust for mainstream internet users.',
    imageFile: 'ssl-tls-web.webp',
    imageAlt: 'Browser lock icon and HTTPS exchange diagram',
    caption: 'Suggested image: HTTPS handshake diagram or early browser security indicator.'
  },
  {
    title: 'Internet Security Age (1990s-Present)',
    body: 'From SSL/TLS to encrypted messaging, cryptography became a core layer of internet computing. Secure protocols now protect software updates, banking, cloud services, identity systems, and private communication across global networks.',
    imageFile: 'internet-security.webp',
    imageAlt: 'Modern network security dashboard and encrypted traffic',
    caption: 'Suggested image: modern network map with encrypted channels.'
  }
];

const eras: EraDefinition[] = [
  {
    id: 'classical',
    label: 'Classical Era',
    description: 'Manual ciphers and early codebreaking methods shaped the first cryptographic rules.',
    eventIndices: [0, 1, 2, 3],
    checkpointQuestion: 'Which early cipher shifted letters by a fixed amount?',
    checkpointOptions: ['Caesar Cipher', 'Vigenère Cipher', 'Enigma Machine', 'Atbash Cipher'],
    checkpointAnswer: 'Caesar Cipher'
  },
  {
    id: 'mechanical',
    label: 'Mechanical Era',
    description: 'Mechanical devices introduced changing states and made encryption more difficult to reverse by hand.',
    eventIndices: [4, 5],
    checkpointQuestion: 'Which machine used rotating rotors to make repeated letters encrypt differently?',
    checkpointOptions: ['The Bombe', 'The Enigma', 'The Colossus', 'The Mark I'],
    checkpointAnswer: 'The Enigma'
  },
  {
    id: 'wartime',
    label: 'Wartime Computing',
    description: 'Codebreaking machines accelerated cryptanalysis and helped turn cryptography into a computing problem.',
    eventIndices: [6, 7],
    checkpointQuestion: 'Which machine helped Allied codebreakers test Enigma settings automatically?',
    checkpointOptions: ['Bombe', 'ENIAC', 'UNIVAC', 'Harvard Mark I'],
    checkpointAnswer: 'Bombe'
  },
  {
    id: 'digital',
    label: 'Digital & Network Age',
    description: 'Modern mathematics and networked systems made cryptography a core part of everyday computing.',
    eventIndices: [8, 9, 10, 11],
    checkpointQuestion: 'Which protocol became the standard for secure web traffic?',
    checkpointOptions: ['SSL/TLS', 'PGP', 'RSA', 'ROT13'],
    checkpointAnswer: 'SSL/TLS'
  }
];

const Timeline: React.FC = () => {
  const [activeEra, setActiveEra] = useState<EraId>('classical');
  const [unlockedEras, setUnlockedEras] = useState<EraId[]>(['classical']);
  const [completedCheckpoints, setCompletedCheckpoints] = useState<Set<EraId>>(new Set());
  const [viewed, setViewed] = useState<Set<number>>(new Set());
  const [modalIndex, setModalIndex] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<{ text: string; tone: 'success' | 'info' | 'error' }>({ text: 'Begin with the Classical Era and answer its checkpoint to unlock the next era.', tone: 'info' });

  // filename is always a bare name living directly in this exhibit's own
  // public/s02g9/ (see the timelineData entries below), never a full
  // site-relative URL, so the merged site's base plus this exhibit's slug
  // always need to be spliced in ahead of it. (Merge note: this
  // literal-filename shape is invisible to the automated integration
  // rewriter, unlike the /-prefixed literals in data/rooms.ts, which the
  // rewriter does rewrite correctly.)
  const getAssetUrl = (filename: string) => {
  const base = import.meta.env.BASE_URL;
  const normalizedBase = base.endsWith('/') ? base : `${base}/`;
  const normalizedFilename = filename.startsWith('/') ? filename.slice(1) : filename;
  return `${normalizedBase}s02g9/${normalizedFilename}`;
};

  const total = timelineData.length;
  const currentEra = eras.find((era) => era.id === activeEra) ?? eras[0];
  const currentEraEvents = currentEra.eventIndices.map((index) => timelineData[index]);

  const openModal = (index: number) => {
    setViewed((prev) => new Set(prev).add(index));
    setModalIndex(index);
  };

  const closeModal = () => setModalIndex(null);

  const selectEra = (eraId: EraId) => {
    if (!unlockedEras.includes(eraId)) {
      setFeedback({ text: 'Complete the previous checkpoint first to unlock this era.', tone: 'info' });
      return;
    }

    setActiveEra(eraId);
    setFeedback({ text: `${eras.find((era) => era.id === eraId)?.label} is now active.`, tone: 'info' });
  };

  const checkCheckpoint = (eraId: EraId, choice: string) => {
    const era = eras.find((entry) => entry.id === eraId);
    if (!era || completedCheckpoints.has(eraId)) {
      setFeedback({ text: 'This checkpoint has already been completed.', tone: 'info' });
      return;
    }

    if (choice === era.checkpointAnswer) {
      setCompletedCheckpoints((prev) => new Set(prev).add(eraId));
      const nextEraIndex = eras.findIndex((entry) => entry.id === eraId) + 1;
      const nextEra = eras[nextEraIndex];

      if (nextEra) {
        setUnlockedEras((prev) => (prev.includes(nextEra.id) ? prev : [...prev, nextEra.id]));
        setActiveEra(nextEra.id);
        setFeedback({ text: `Correct. ${nextEra.label} is now unlocked.`, tone: 'success' });
      } else {
        setFeedback({ text: 'Correct. You completed the final era.', tone: 'success' });
      }
    } else {
      setFeedback({ text: 'Not quite — review the era and try again.', tone: 'error' });
    }
  };

  return (
    <section id="timeline" className="active">
      <h2 className="section-title">Interactive Historical Timeline</h2>
      <p className="section-description">Follow how cryptography evolved from manual ciphers to modern public-key systems, and how each leap influenced the development of computing.</p>

      <div className="timeline-container">
        <div className="timeline-filter" aria-label="Timeline Eras">
          {eras.map((era) => {
            const unlocked = unlockedEras.includes(era.id);
            const completed = completedCheckpoints.has(era.id);
            return (
              <button
                key={era.id}
                className={`filter-btn ${activeEra === era.id ? 'active' : ''} ${!unlocked ? 'locked-era' : ''}`}
                onClick={() => selectEra(era.id)}
                disabled={!unlocked}
              >
                {era.label}
                {completed ? ' ✓' : ''}
              </button>
            );
          })}
        </div>

        <div className="timeline-progress" aria-label="Timeline progress">
          <div className="progress-label">Timeline progress</div>
          <div className="progress-track">
            <div className="progress-fill" id="timelineProgressFill" style={{ width: `${Math.round((viewed.size / total) * 100)}%` }} />
          </div>
          <div className="progress-text" id="timelineProgressText">{viewed.size} of {total} events viewed</div>
          <div className="progress-text" id="checkpointProgressText">{completedCheckpoints.size} of {eras.length} checkpoints completed</div>
        </div>

        {feedback && (
          <div className={`timeline-notification visible ${feedback.tone}`} role="status" aria-live="polite">
            {feedback.text}
          </div>
        )}

        <div className="timeline">
          <div className="era-panel">
            <div className="era-header">
              <h3>{currentEra.label}</h3>
              <p>{currentEra.description}</p>
            </div>

            <div className={`checkpoint-card ${completedCheckpoints.has(currentEra.id) ? 'completed' : ''}`}>
              <div className="checkpoint-title">{currentEra.label} Checkpoint</div>
              <div className="checkpoint-question">{currentEra.checkpointQuestion}</div>
              <div className="checkpoint-options">
                {currentEra.checkpointOptions.map((option) => (
                  <button key={option} className="checkpoint-btn" onClick={() => checkCheckpoint(currentEra.id, option)}>
                    {option}
                  </button>
                ))}
              </div>
              <div className={`checkpoint-result ${completedCheckpoints.has(currentEra.id) ? 'correct' : ''}`}>
                {completedCheckpoints.has(currentEra.id)
                  ? 'Checkpoint complete. The next era is now available.'
                  : 'Answer correctly to unlock the next era.'}
              </div>
            </div>

            <div className="timeline-era-events">
              {currentEraEvents.map((event, index) => (
                <div key={`${currentEra.id}-${event.title}`} className="timeline-item">
                  <div className="timeline-dot" onClick={() => openModal(currentEra.eventIndices[index])} />
                  <div className="timeline-content" onClick={() => openModal(currentEra.eventIndices[index])}>
                    <div className="timeline-year">{event.title.match(/\((.*?)\)/)?.[1] ?? 'Milestone'}</div>
                    <div className="timeline-title">{event.title}</div>
                    <div className="timeline-description">{event.body.slice(0, 100)}{event.body.length > 100 ? '...' : ''}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="timeline-stats">
          <div className="stat-box">
            <div className="stat-number">12</div>
            <div className="stat-label">Key Milestones</div>
          </div>
          <div className="stat-box">
            <div className="stat-number">2000+</div>
            <div className="stat-label">Years Covered</div>
          </div>
          <div className="stat-box">
            <div className="stat-number">4</div>
            <div className="stat-label">Major Eras</div>
          </div>
          <div className="stat-box">
            <div className="stat-number">1</div>
            <div className="stat-label">Computing Storyline</div>
          </div>
        </div>
      </div>

      {modalIndex !== null && (
        <div id="timelineModal" className="modal active" onClick={closeModal} role="dialog" aria-modal="true">
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="modal-close" onClick={closeModal}>&times;</span>
            <h2 className="modal-title">{timelineData[modalIndex].title}</h2>
            <div className="timeline-modal-media">
              {timelineData[modalIndex].imageFile ? (
                <img id="modalImage" className="timeline-modal-image" src={getAssetUrl(timelineData[modalIndex].imageFile!)} alt={timelineData[modalIndex].imageAlt} />
              ) : (
                <div id="modalImagePlaceholder" className="timeline-modal-image-placeholder">Add Image Here</div>
              )}
              <div id="modalCaption" className="timeline-modal-caption">{timelineData[modalIndex].caption}</div>
            </div>
            <div className="modal-body">{timelineData[modalIndex].body}</div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Timeline;