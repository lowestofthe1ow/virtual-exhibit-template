import React, {
  Fragment,
  useMemo,
  useRef,
  useState
} from "react";

/* =========================================================
   MEMORY GENERATION DATA
   ========================================================= */

const generationsData = {
  SDRAM: {
    year: "1990s",
    title: "SDRAM",
    description:
      "Synchronized commands with the system clock, replacing older asynchronous memory to enable faster data retrieval and burst transfers.",
    url:
      "https://www.electronics-notes.com/articles/electronic_components/semiconductor-ic-memory/sdram-synchronous-dram-what-is.php",
    delay: 1500
  },

  DDR: {
    year: "2000",
    title: "DDR",
    description:
      "Transferred data on both the rising and falling edges of the clock signal, doubling the effective throughput over SDRAM.",
    url:
      "https://www.crucial.com/support/articles-faq-memory/differences-in-memory-speed-and-data-rate",
    delay: 1000
  },

  DDR2: {
    year: "2004",
    title: "DDR2",
    description:
      "Doubled bus speeds using an advanced 4-bit prefetch buffer while optimizing operational signaling and lowering overall power consumption.",
    url:
      "https://www.crucial.com/support/articles-faq-memory/differences-in-memory-speed-and-data-rate",
    delay: 850
  },

  DDR3: {
    year: "2007",
    title: "DDR3",
    description:
      "Reduced operating voltages down to 1.5V and introduced an 8-bit prefetch buffer to greatly improve signal integrity and multi-core processing.",
    url:
      "https://www.crucial.com/support/articles-faq-memory/differences-in-memory-speed-and-data-rate",
    delay: 650
  },

  DDR4: {
    year: "2014",
    title: "DDR4",
    description:
      "Increased bandwidth, density, and energy efficiency at lower operating voltages, making it the dominant standard for modern systems.",
    url:
      "https://www.corsair.com/us/en/explorer/diy-builder/memory/is-ddr5-better-than-ddr4/",
    delay: 450
  },

  DDR5: {
    year: "2020",
    title: "DDR5",
    description:
      "Introduced on-DIMM power management, dual independent 32-bit channels, and on-die ECC to shatter data rate and efficiency limits.",
    url:
      "https://www.crucial.com/support/memory-speeds-compatability",
    delay: 250
  }
};

/* =========================================================
   SAMPLE MEMORY CONTENT
   ========================================================= */

const basePokemon = [
  { name: "Bulbasaur", hp: 45, atk: 49, def: 49 },
  { name: "Ivysaur", hp: 60, atk: 62, def: 63 },
  { name: "Venusaur", hp: 80, atk: 82, def: 83 },
  { name: "Charmander", hp: 39, atk: 52, def: 43 },
  { name: "Charmeleon", hp: 58, atk: 64, def: 58 },
  { name: "Charizard", hp: 78, atk: 84, def: 78 },
  { name: "Squirtle", hp: 44, atk: 48, def: 65 },
  { name: "Wartortle", hp: 59, atk: 63, def: 80 },
  { name: "Blastoise", hp: 79, atk: 83, def: 100 },
  { name: "Caterpie", hp: 45, atk: 30, def: 35 },
  { name: "Metapod", hp: 50, atk: 20, def: 55 },
  { name: "Butterfree", hp: 60, atk: 45, def: 50 },
  { name: "Weedle", hp: 40, atk: 35, def: 30 },
  { name: "Kakuna", hp: 45, atk: 25, def: 50 },
  { name: "Beedrill", hp: 65, atk: 90, def: 40 }
];

/* =========================================================
   MEMORY GRID GENERATOR
   ========================================================= */

const generateMemoryGrid = () => {
  const memoryGrid = [];
  let currentAddress = 0x8000;

  for (
    let rowIndex = 0;
    rowIndex < 5;
    rowIndex += 1
  ) {
    const row = [];

    for (
      let columnIndex = 0;
      columnIndex < 12;
      columnIndex += 1
    ) {
      const pokemonIndex =
        rowIndex * 3 +
        Math.floor(columnIndex / 4);

      const statIndex =
        columnIndex % 4;

      const pokemon =
        basePokemon[pokemonIndex];

      let cellData = "";
      let dataType = "";

      switch (statIndex) {
        case 0:
          cellData = pokemon.name;
          dataType = "NAME";
          break;

        case 1:
          cellData = `HP:${pokemon.hp}`;
          dataType = "HP";
          break;

        case 2:
          cellData = `ATK:${pokemon.atk}`;
          dataType = "ATK";
          break;

        case 3:
          cellData = `DEF:${pokemon.def}`;
          dataType = "DEF";
          break;

        default:
          cellData = "UNKNOWN";
          dataType = "DATA";
      }

      row.push({
        rowId: rowIndex,
        colId: columnIndex,
        address:
          `0x${currentAddress
            .toString(16)
            .toUpperCase()}`,
        data: cellData,
        type: dataType,
        pokemon
      });

      currentAddress += 0x04;
    }

    memoryGrid.push(row);
  }

  return memoryGrid;
};

/* =========================================================
   SHARED DISPLAY COMPONENTS
   ========================================================= */

const PanelHeading = ({
  eyebrow,
  title,
  status
}) => {
  return (
    <div className="memory-panel-heading">
      <div className="memory-panel-heading-copy">
        {eyebrow && (
          <span className="memory-panel-eyebrow">
            {eyebrow}
          </span>
        )}

        <h3>{title}</h3>
      </div>

      {status && (
        <span className="memory-panel-status">
          {status}
        </span>
      )}
    </div>
  );
};

const TerminalLine = ({
  label,
  value,
  accent = false,
  muted = false
}) => {
  return (
    <div
      className={[
        "memory-terminal-line",
        accent
          ? "is-accent"
          : "",
        muted
          ? "is-muted"
          : ""
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
};

const SignalChannel = ({
  label,
  value,
  state = "idle"
}) => {
  return (
    <div
      className={[
        "memory-bus-channel",
        `memory-bus-${state}`
      ].join(" ")}
    >
      <div className="memory-bus-copy">
        <span>{label}</span>
        <strong>{value}</strong>
      </div>

      <div className="memory-bus-meter">
        {Array.from({
          length: 10
        }).map((_, index) => (
          <span
            key={`${label}-${index}`}
          ></span>
        ))}
      </div>
    </div>
  );
};

/* =========================================================
   MAIN COMPONENT
   ========================================================= */

const MemoryCommunication = () => {
  const [ras, setRas] =
    useState(null);

  const [cas, setCas] =
    useState(null);

  const [isAccessing, setIsAccessing] =
    useState(false);

  const [activeGen, setActiveGen] =
    useState("DDR4");

  const timeoutRef =
    useRef(null);

  const memoryGrid = useMemo(
    () => generateMemoryGrid(),
    []
  );

  const selectedCell =
    ras !== null &&
    cas !== null &&
    !isAccessing
      ? memoryGrid[ras][cas]
      : null;

  const currentGeneration =
    generationsData[activeGen];

  const currentOperation = (() => {
    if (isAccessing) {
      return "READING";
    }

    if (selectedCell) {
      return "READ COMPLETE";
    }

    if (ras !== null) {
      return "ROW ACTIVE";
    }

    return "IDLE";
  })();

  const transactionStatus = (() => {
    if (isAccessing) {
      return "ACCESSING";
    }

    if (selectedCell) {
      return "SUCCESS";
    }

    if (ras !== null) {
      return "WAITING FOR COLUMN";
    }

    return "AWAITING REQUEST";
  })();

  const addressValue = (() => {
    if (selectedCell) {
      return selectedCell.address;
    }

    if (isAccessing) {
      return "BUSY...";
    }

    if (ras !== null) {
      return `ROW R${ras}`;
    }

    return "[UNINITIALIZED]";
  })();

  const dataValue = (() => {
    if (selectedCell) {
      return selectedCell.data;
    }

    if (isAccessing) {
      return "FETCHING...";
    }

    return "[UNIDENTIFIED]";
  })();

  const rowValue =
    ras !== null
      ? `R${ras}`
      : "--";

  const columnValue = (() => {
    if (isAccessing) {
      return "...";
    }

    if (cas !== null) {
      return `C${cas}`;
    }

    return "--";
  })();

  const rasStatus = (() => {
    if (ras === null) {
      return "IDLE";
    }

    if (isAccessing) {
      return "ACTIVE";
    }

    return "ROW OPEN";
  })();

  const casStatus = (() => {
    if (isAccessing) {
      return "ACTIVE";
    }

    if (selectedCell) {
      return "COMPLETE";
    }

    if (ras !== null) {
      return "WAITING";
    }

    return "IDLE";
  })();

  const dataBusStatus = (() => {
    if (isAccessing) {
      return "SENDING";
    }

    if (selectedCell) {
      return "Sent";
    }

    return "IDLE";
  })();

  const rasState = (() => {
    if (isAccessing) {
      return "active";
    }

    if (ras !== null) {
      return "complete";
    }

    return "idle";
  })();

  const casState = (() => {
    if (isAccessing) {
      return "active";
    }

    if (selectedCell) {
      return "complete";
    }

    if (ras !== null) {
      return "pending";
    }

    return "idle";
  })();

  const dataBusState = (() => {
    if (isAccessing) {
      return "active";
    }

    if (selectedCell) {
      return "complete";
    }

    return "idle";
  })();

  const clearPendingTimeout = () => {
    if (timeoutRef.current) {
      window.clearTimeout(
        timeoutRef.current
      );

      timeoutRef.current = null;
    }
  };

  const resetMemorySelection = () => {
    clearPendingTimeout();

    setRas(null);
    setCas(null);
    setIsAccessing(false);
  };

  const handleGenerationClick = (
    generationName
  ) => {
    resetMemorySelection();
    setActiveGen(generationName);
  };

  const selectRow = (
    rowIndex
  ) => {
    if (isAccessing) {
      return;
    }

    clearPendingTimeout();

    setRas(rowIndex);
    setCas(null);
  };

  const triggerCasStrobe = (
    targetColumn
  ) => {
    if (
      ras === null ||
      isAccessing
    ) {
      return;
    }

    clearPendingTimeout();

    setCas(null);
    setIsAccessing(true);

    timeoutRef.current =
      window.setTimeout(() => {
        setCas(targetColumn);
        setIsAccessing(false);
        timeoutRef.current = null;
      }, currentGeneration.delay);
  };

  const handleCellClick = (
    rowIndex,
    columnIndex
  ) => {
    if (isAccessing) {
      return;
    }

    if (ras === rowIndex) {
      triggerCasStrobe(
        columnIndex
      );

      return;
    }

    selectRow(rowIndex);
  };

  const handleCellKeyDown = (
    event,
    rowIndex,
    columnIndex
  ) => {
    if (
      event.key !== "Enter" &&
      event.key !== " "
    ) {
      return;
    }

    event.preventDefault();

    handleCellClick(
      rowIndex,
      columnIndex
    );
  };

  const getCellAriaLabel = (
    cell
  ) => {
    return [
      `Memory cell row ${cell.rowId}`,
      `column ${cell.colId}`,
      `address ${cell.address}`,
      `stored data ${cell.data}`
    ].join(", ");
  };

  return (
    <Fragment>
      {/* =====================================================
          TOP DASHBOARD
          ===================================================== */}

      <div className="memory-dashboard">
        {/* -------------------------------------------------
            CPU TERMINAL
            ------------------------------------------------- */}

        <aside className="memory-terminal-panel memory-hud-panel">
          <PanelHeading
            eyebrow="REQUEST SOURCE"
            title="CPU TERMINAL"
            status={transactionStatus}
          />

          <div className="memory-terminal-screen">
            <div className="memory-terminal-command">
              <span>&gt;</span>

              <strong>
                {selectedCell
                  ? "READ REQUEST COMPLETE"
                  : ras !== null
                    ? "MEMORY READ REQUEST"
                    : "SYSTEM READY"}
              </strong>
            </div>

            <TerminalLine
              label="OPERATION"
              value={currentOperation}
              accent={
                isAccessing ||
                Boolean(selectedCell)
              }
            />

            <TerminalLine
              label="ADDRESS"
              value={addressValue}
              accent={Boolean(selectedCell)}
            />

            <TerminalLine
              label="DATA TYPE"
              value={
                selectedCell
                  ? selectedCell.type
                  : "--"
              }
              muted={!selectedCell}
            />

            <TerminalLine
              label="PAYLOAD"
              value={dataValue}
              accent={Boolean(selectedCell)}
            />

            <TerminalLine
              label="POKÉMON"
              value={
                selectedCell
                  ? selectedCell.pokemon.name
                  : "--"
              }
              accent={Boolean(selectedCell)}
              muted={!selectedCell}
            />

            <div className="memory-terminal-footer">
              <span>GEN</span>

              <strong>
                {currentGeneration.title}
              </strong>

              <span>LATENCY</span>

              <strong>
                {currentGeneration.delay}MS
              </strong>
            </div>

            <span
              className="memory-terminal-cursor"
              aria-hidden="true"
            ></span>
          </div>

          <div className="memory-terminal-instruction">
            <p>
              Select a row first, then choose a
              column to complete the simulated
              memory read.
            </p>
          </div>
        </aside>

        {/* -------------------------------------------------
            FULL-WIDTH MEMORY MATRIX
            ------------------------------------------------- */}

        <section className="memory-matrix-panel memory-hud-panel">
          <PanelHeading
            eyebrow="DRAM ADDRESS SPACE"
            title="MEMORY ACCESS MATRIX"
            status={
              isAccessing
                ? "BUSY"
                : "INTERACTIVE"
            }
          />

          <div className="memory-matrix-status">
            <div>
              <span>
                ROW
              </span>

              <strong>
                {rowValue}
              </strong>
            </div>

            <div>
              <span>
                COLUMN
              </span>

              <strong>
                {columnValue}
              </strong>
            </div>

            <div>
              <span>
                GENERATION
              </span>

              <strong>
                {currentGeneration.title}
              </strong>
            </div>
          </div>

          <div className="memory-grid-shell">
            <div className="memory-grid-header">
              <span
                className="memory-grid-corner"
                aria-hidden="true"
              ></span>

              {Array.from({
                length: 12
              }).map((_, columnIndex) => {
                const isColumnActive =
                  cas === columnIndex;

                const canSelectColumn =
                  ras !== null &&
                  !isAccessing;

                return (
                  <button
                    key={`column-${columnIndex}`}
                    type="button"
                    className={[
                      "memory-column-label",
                      isColumnActive
                        ? "active-column"
                        : "",
                      canSelectColumn
                        ? "is-available"
                        : ""
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    onClick={() =>
                      triggerCasStrobe(
                        columnIndex
                      )
                    }
                    disabled={
                      !canSelectColumn
                    }
                    aria-label={
                      canSelectColumn
                        ? `Select column C${columnIndex}`
                        : `Column C${columnIndex}`
                    }
                  >
                    C{columnIndex}
                  </button>
                );
              })}
            </div>

            <div
              className={[
                "memory-grid",
                isAccessing
                  ? "is-accessing"
                  : ""
              ]
                .filter(Boolean)
                .join(" ")}
            >
              {memoryGrid.map(
                (
                  row,
                  rowIndex
                ) => (
                  <Fragment
                    key={`row-${rowIndex}`}
                  >
                    <button
                      type="button"
                      className={[
                        "row-label",
                        ras === rowIndex
                          ? "active-row"
                          : ""
                      ]
                        .filter(Boolean)
                        .join(" ")}
                      onClick={() =>
                        selectRow(
                          rowIndex
                        )
                      }
                      disabled={
                        isAccessing
                      }
                      aria-label={`Select row R${rowIndex}`}
                    >
                      R{rowIndex}
                    </button>

                    {row.map(
                      (
                        cell,
                        columnIndex
                      ) => {
                        const isSelectedCell =
                          ras ===
                            rowIndex &&
                          cas ===
                            columnIndex;

                        const isActiveRow =
                          ras ===
                            rowIndex &&
                          !isSelectedCell;

                        const isActiveColumn =
                          cas ===
                            columnIndex &&
                          !isSelectedCell;

                        const isPendingCell =
                          isAccessing &&
                          ras ===
                            rowIndex;

                        const classNames = [
                          "memory-cell",
                          isSelectedCell
                            ? "selected-cell"
                            : "",
                          isActiveRow
                            ? "active-row"
                            : "",
                          isActiveColumn
                            ? "active-column"
                            : "",
                          isPendingCell
                            ? "pending-cell"
                            : ""
                        ]
                          .filter(Boolean)
                          .join(" ");

                        return (
                          <div
                            key={
                              cell.address
                            }
                            className={
                              classNames
                            }
                            role="button"
                            tabIndex={
                              isAccessing
                                ? -1
                                : 0
                            }
                            onClick={() =>
                              handleCellClick(
                                rowIndex,
                                columnIndex
                              )
                            }
                            onKeyDown={(
                              event
                            ) =>
                              handleCellKeyDown(
                                event,
                                rowIndex,
                                columnIndex
                              )
                            }
                            title={
                              `Address: ${cell.address} | ` +
                              `Data: ${cell.data} | ` +
                              `Pokémon: ${cell.pokemon.name}`
                            }
                            aria-label={getCellAriaLabel(
                              cell
                            )}
                            aria-pressed={
                              isSelectedCell
                            }
                          >
                            <span className="memory-cell-core"></span>

                            {isSelectedCell && (
                              <span className="memory-cell-pulse"></span>
                            )}
                          </div>
                        );
                      }
                    )}
                  </Fragment>
                )
              )}
            </div>
          </div>

          {/* -----------------------------------------------
              HORIZONTAL SIGNAL BUS
              ----------------------------------------------- */}

          <div className="memory-bus-panel">
            <SignalChannel
              label="RAS"
              value={rasStatus}
              state={rasState}
            />

            <SignalChannel
              label="CAS"
              value={casStatus}
              state={casState}
            />

            <SignalChannel
              label="DATA BUS"
              value={dataBusStatus}
              state={dataBusState}
            />
          </div>

          <button
            type="button"
            className="memory-reset-button"
            onClick={
              resetMemorySelection
            }
            disabled={
              ras === null &&
              cas === null &&
              !isAccessing
            }
          >
            RESET TRANSACTION
          </button>
        </section>
      </div>

      {/* =====================================================
          HOW MEMORY ACCESS WORKS
          ===================================================== */}

      <section className="memory-info-section memory-hud-panel">
        <PanelHeading
          eyebrow="ADDRESS DECODING PROCESS"
          title="HOW MEMORY ACCESS WORKS"
          status="RAS + CAS"
        />

        <div className="memory-info-layout">
          <div className="memory-info-introduction">
            <p>
              DRAM stores data in rows and
              columns. To access a memory
              location, the controller first
              selects the row using{" "}
              <strong>RAS</strong>, then the
              column using{" "}
              <strong>CAS</strong>. This
              two-step process reduces hardware
              complexity while allowing fast
              access to the requested data.
            </p>
          </div>

          <article className="memory-process-card">
            <div className="memory-process-card-header">
              <span>
                SIGNAL 01
              </span>

              <strong>
                RAS
              </strong>
            </div>

            <h4>
              Row Access Strobe
            </h4>

            <p>
              Activates the row containing the
              requested data and keeps it open
              for column selection.
            </p>

            <div className="memory-process-purpose">
              <span>
                PURPOSE
              </span>

              <strong>
                Opens the correct memory row.
              </strong>
            </div>
          </article>

          <div
            className="memory-process-arrow"
            aria-hidden="true"
          >
            <span>
              →
            </span>
          </div>

          <article className="memory-process-card">
            <div className="memory-process-card-header">
              <span>
                SIGNAL 02
              </span>

              <strong>
                CAS
              </strong>
            </div>

            <h4>
              Column Access Strobe
            </h4>

            <p>
              Selects the correct column within
              the open row and retrieves the
              stored value.
            </p>

            <div className="memory-process-purpose">
              <span>
                PURPOSE
              </span>

              <strong>
                Selects the exact memory cell.
              </strong>
            </div>
          </article>
        </div>
      </section>

      {/* =====================================================
          EVOLUTION AND DETAILS
          ===================================================== */}

      <div className="memory-bottom">
        <section className="memory-evolution memory-hud-panel">
          <PanelHeading
            eyebrow="COMMUNICATION STANDARDS"
            title="MEMORY COMMUNICATION EVOLUTION"
            status={`${Object.keys(generationsData).length} GENERATIONS`}
          />

          <p className="memory-evolution-intro">
            Select a generation to compare its
            simulated access delay and
            communication improvements.
          </p>

          <div className="generation-list">
            {Object.entries(
              generationsData
            ).map(
              ([
                generationKey,
                generation
              ]) => {
                const isActive =
                  activeGen ===
                  generationKey;

                return (
                  <button
                    key={
                      generationKey
                    }
                    type="button"
                    className={[
                      "generation-card",
                      isActive
                        ? "active-generation"
                        : ""
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    onClick={() =>
                      handleGenerationClick(
                        generationKey
                      )
                    }
                    aria-pressed={
                      isActive
                    }
                  >
                    <span className="generation-card-index">
                      {String(
                        Object.keys(
                          generationsData
                        ).indexOf(
                          generationKey
                        ) + 1
                      ).padStart(
                        2,
                        "0"
                      )}
                    </span>

                    <strong>
                      {generation.title}
                    </strong>

                    <small>
                      {generation.year}
                    </small>

                    <span className="generation-card-latency">
                      {generation.delay} MS
                    </span>

                    <span className="generation-card-status">
                      {isActive
                        ? "ACTIVE"
                        : "SELECT"}
                    </span>
                  </button>
                );
              }
            )}
          </div>
        </section>

        <section className="memory-details memory-hud-panel">
          <PanelHeading
            eyebrow="ACTIVE STANDARD"
            title="MEMORY COMMUNICATION DETAILS"
            status={
              currentGeneration.year
            }
          />

          <div className="memory-details-layout">
            <div className="memory-details-generation">
              <span className="memory-details-label">
                SELECTED GENERATION
              </span>

              <h2>
                {currentGeneration.title}
              </h2>

              <div className="memory-details-meta">
                <div>
                  <span>
                    INTRODUCED
                  </span>

                  <strong>
                    {currentGeneration.year}
                  </strong>
                </div>

                <div>
                  <span>
                    DELAY
                  </span>

                  <strong>
                    {currentGeneration.delay} MS
                  </strong>
                </div>
              </div>
            </div>

            <div className="memory-details-description">
              <span className="memory-details-label">
                COMMUNICATION IMPROVEMENT
              </span>

              <p>
                {currentGeneration.description}
              </p>
            </div>
          </div>

          <div className="memory-details-footer">
            <div className="memory-details-status">
              <span className="memory-details-status-dot"></span>

              <span>
                STANDARD LOADED
              </span>
            </div>

            <a
              href={
                currentGeneration.url
              }
              className="learn-more-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              LEARN MORE
              <span aria-hidden="true">
                ↗
              </span>
            </a>
          </div>
        </section>
      </div>
    </Fragment>
  );
};

export default MemoryCommunication;