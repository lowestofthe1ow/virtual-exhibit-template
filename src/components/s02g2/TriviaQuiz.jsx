import { useState } from "react";

const questions = [
  {
    question:
      "In 1971, Masatoshi Shima co-designed a chip that shifted computing from multi-chip systems to single-chip logic. What was it?",
    answer: "Intel 4004",
    choices: [
      { text: "Intel 8080", info: "This followed in 1974." },
      { text: "Intel 4004", info: "This was the world's first commercial microprocessor, built for a Japanese calculator." },
      { text: "Zilog Z80", info: "This chip came from Zilog, a firm Shima later helped found after leaving Intel." },
      { text: "MOS 6502", info: "This powered machines like the Apple II, but is not related to Shima's work at Intel." },
    ],
  },
  {
    question:
      "TSMC's 'pure-play foundry' model let companies like Apple and Nvidia design chips without owning a factory. Which country pioneered this?",
    answer: "Taiwan",
    choices: [
      { text: "Taiwan", info: "TSMC separated chip design from chip manufacturing, letting the companies design silicon without a factory." },
      { text: "South Korea", info: "Better at making memory chips; for example, Samsung and SK Hynix are leaders with DRAM and NAND." },
      { text: "Japan", info: "Inventions like the NAND flash and the Intel 4004, not the foundry model" },
      { text: "China", info: "Focused on building independence from Western chips like the Sunway TaihuLight processors." },
    ],
  },
  {
    question: "Which Japanese company built the HX-20, credited as the world's first laptop computer, in 1981?",
    answer: "Epson",
    choices: [
      { text: "Sony", info: "Sony did not release a laptop until years later." },
      { text: "Sharp", info: "Sharp made calculators and early portables (not the HX-20)." },
      { text: "Epson", info: "Then known as Suwa Seikosha, this computer was built with two Hitachi processors and a battery that lasts up to 50 hours." },
      { text: "Toshiba", info: "Toshiba's laptop came four years later in 1985."},
    ],
  },
  {
    question: "Toshiba's T1100 was launched in 1985 and, despite not being the first laptop, was still incredibly significant. Why?",
    answer: "It was the first laptop fully compatible with IBM PC Software.",
    choices: [
      { text: "It was the first laptop with a colored screen.", info: "The T1100 has a black-and-white screen." },
      { text: "It was a cheap laptop.", info: "The T1100 cost around 2,000 USD." },
      { text: "It was the first laptop made outside Japan.", info: "Toshiba is a Japanese company." },
      { text: "It was the first laptop fully compatible with IBM PC Software.", info: "Preceding laptops could only run their own software, while this used the same as an IBM PC, allowing for the laptop industry to exist commercially."},
    ],
  },
  {
    question: "China's Sunway TaihuLight supercomputer made headlines for a specific reason. What was it?",
    answer: "It ran entirely on homegrown SW26010 processors, not Intel or AMD",
    choices: [
      { text: "It ran entirely on homegrown SW26010 processors, not Intel or AMD", info: "The SW26010 processors were built domestically, breaking China's reliance on Western chipmakers." },
      { text: "It was the first liquid-cooled supercomputer", info: "Liquid cooling isn't what made TaihuLight famous, but instead its SW26010 processors." },
      { text: "It was built entirely from recycled hardware", info: "TaihuLight wasn't built from recycled parts, but instead used entirely domestic processors." },
      { text: "It ran the first version of Linux ever released", info: "TaihuLight didn't debut Linux. Its significance was proving China could build many-core processors independently." },
    ],
  },
  {
    question: "China's Loongson processor line began in 2001 as an attempt to build a CPU independent of Intel, AMD, and ARM. What instruction set did they use?",
    answer: "MIPS",
    choices: [
      { text: "x86", info: "x86 is Intel and AMD's own architecture." },
      { text: "MIPS", info: "Developed at the Chinese Academy of Sciences, Loongson used this before building its own instruction set in 2020." },
      { text: "SPARC", info: "This was a Sun Microsystems architecture." },
      { text: "RISC-V", info: "RISC-V wasn't created until 2010."},
    ],
  },
  {
    question: "In 1986, South Korea's ETRI commercialized the TDX-1. This was the country's first fully domestic version of what system?",
    answer: "A digital telephone switching exchange",
    choices: [
      { text: "A home video game console", info: "The TDX-1 was a telecom infrastructure, not commercial." },
      { text: "A digital telephone switching exchange", info: "This allowed Korea to be the 10th country in the world to develop this kind of exchange system independently. It eventually became the basis of Korea's CDMA mobile network." },
      { text: "A word processor", info: "The TDX-1 was a telecom infrastructure, not for documents." },
      { text: "A weather forecasting computer", info: "The TDX-1 was a telecom infrastructure, not related to meteorology."},
    ],
  },

    {
    question:
      "Which South Korean companies are known as global leaders in DRAM, NAND flash, and high-bandwidth memory used in modern AI and GPU systems?",
    answer: "Samsung and SK Hynix",
    choices: [
      { text: "Samsung and SK Hynix", info: "These companies helped South Korea become a major force in memory technologies used by modern computers, GPUs, and AI systems." },
      { text: "Sony and Nintendo", info: "These are Japanese companies known more for entertainment hardware and gaming consoles." },
      { text: "ASUS and Acer", info: "These are Taiwanese companies known for PCs, motherboards, and consumer electronics." },
      { text: "Huawei and Lenovo", info: "These are Chinese technology companies, but they are not South Korea’s major memory chip leaders." },
    ],
  },
  {
    question:
      "Which Japanese company invented NAND flash memory, a storage technology used in SSDs, USB drives, and memory cards?",
    answer: "Toshiba",
    choices: [
      { text: "Toshiba", info: "Toshiba engineer Fujio Masuoka invented NAND flash memory, which became important for modern solid-state storage." },
      { text: "Samsung", info: "Samsung became a major producer of NAND flash, but Toshiba is credited with inventing it." },
      { text: "Acer", info: "Acer is a Taiwanese computer company, not the inventor of NAND flash memory." },
      { text: "Lenovo", info: "Lenovo is a Chinese computer company and is not credited with inventing NAND flash memory." },
    ],
  },
  {
    question:
      "Which open instruction set architecture has China strongly invested in to reduce dependence on proprietary Western processor standards?",
    answer: "RISC-V",
    choices: [
      { text: "RISC-V", info: "RISC-V is open-source, making it useful for countries and companies that want more independence in processor design." },
      { text: "x86", info: "x86 is a proprietary architecture mainly associated with Intel and AMD." },
      { text: "ARM", info: "ARM is widely used in mobile devices, but it is still a licensed architecture rather than a fully open standard." },
      { text: "PowerPC", info: "PowerPC was used in some older computers and consoles, but it is not the open architecture China is currently emphasizing." },
    ],
  }
];

export default function TriviaQuiz() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});

  const totalQuestions = questions.length;
  const isCompleted = currentIndex === totalQuestions;

  function handleAnswer(questionIndex, choiceText) {
    // Prevent changing the answer once selected
    if (selectedAnswers[questionIndex] !== undefined) return;

    setSelectedAnswers({
      ...selectedAnswers,
      [questionIndex]: choiceText,
    });
  }

  function handleNext() {
    setCurrentIndex((prevIndex) => prevIndex + 1);
  }

  function handlePrevious() {
    setCurrentIndex((prevIndex) => Math.max(0, prevIndex - 1));
  }

  function handleReset() {
    setSelectedAnswers({});
    setCurrentIndex(0);
  }

  // Calculate final score
  const correctAnswersCount = questions.reduce((score, item, index) => {
    return selectedAnswers[index] === item.answer ? score + 1 : score;
  }, 0);

  return (
    <section className="mia-trivia-panel">
      <h3>Quick Trivia: East Asia in Computing</h3>

      <p>
        Test your knowledge about East Asia’s contributions to computing and
        technology.
      </p>

      {!isCompleted ? (
        <div className="mia-trivia-card">
          <h4>
            Question {currentIndex + 1} of {totalQuestions}
          </h4>
          <p>{questions[currentIndex].question}</p>

          <div className="mia-options">
            {questions[currentIndex].choices.map((choice) => {
              const selected = selectedAnswers[currentIndex];
              const hasAnswered = selected !== undefined;
              let buttonClass = "";

              if (hasAnswered && choice.text === questions[currentIndex].answer) {
                buttonClass = "correct";
              } else if (hasAnswered && choice.text === selected) {
                buttonClass = "wrong";
              }

              return (
                <button
                  key={choice.text}
                  className={buttonClass}
                  disabled={hasAnswered}
                  onClick={() => handleAnswer(currentIndex, choice.text)}
                >
                  {choice.text}
                </button>
              );
            })}
          </div>

          {selectedAnswers[currentIndex] !== undefined && (
            <p className="mia-result">
              {selectedAnswers[currentIndex] === questions[currentIndex].answer
                ? "Correct!"
                : "Wrong answer."}{" "}
              {
                questions[currentIndex].choices.find(
                  (c) => c.text === selectedAnswers[currentIndex]
                )?.info
              }
            </p>
          )}

          <div className="mia-carousel-controls" style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
            <button
              onClick={handlePrevious}
              disabled={currentIndex === 0}
            >
              Previous
            </button>
            <button
              onClick={handleNext}
              disabled={selectedAnswers[currentIndex] === undefined}
            >
              {currentIndex === totalQuestions - 1 ? "Finish" : "Next"}
            </button>
          </div>
        </div>
      ) : (
        <div className="mia-trivia-results">
          <h4>Quiz Completed!</h4>
          <p>
            You scored {correctAnswersCount} out of {totalQuestions}.
          </p>
          <button onClick={handleReset}>Restart Quiz</button>
        </div>
      )}
    </section>
  );
}
