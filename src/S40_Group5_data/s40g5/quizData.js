export const quizQuestions = [
  {
    id: "cloud-definition",
    text: "What is cloud storage?",
    options: [
      {
        id: "remote-servers",
        label: "Files stored on remote servers and accessed over the Internet.",
      },
      {
        id: "usb-drive",
        label: "Files stored only on a local USB drive or external hard disk.",
      },
      {
        id: "email-attachments",
        label: "Files sent as email attachments to other users.",
      },
      {
        id: "browser-cache",
        label: "Files temporarily saved in a web browser cache.",
      },
    ],
    correctOptionId: "remote-servers",
    explanation:
      "Cloud storage keeps data on remote provider servers so users can access files from multiple devices through an Internet connection.",
  },
  {
    id: "cloud-replication",
    text: "What is the main purpose of replication in cloud storage?",
    options: [
      {
        id: "faster-download",
        label: "To make downloads faster by copying files to the user's device.",
      },
      {
        id: "extra-copies",
        label: "To create extra copies across different servers for reliability.",
      },
      {
        id: "compress-data",
        label: "To compress files for saving storage space.",
      },
      {
        id: "archive-old",
        label: "To move old files to an offline archive automatically.",
      },
    ],
    correctOptionId: "extra-copies",
    explanation:
      "Replication stores multiple copies of data across servers so the cloud service remains available even if one server fails.",
  },
  {
    id: "cloud-encryption",
    text: "What does encryption in transit protect?",
    options: [
      {
        id: "stored-files",
        label: "Files stored on a hard disk inside a data center.",
      },
      {
        id: "data-transfer",
        label: "Data while it travels between your device and the cloud.",
      },
      {
        id: "application-code",
        label: "The cloud provider's software source code.",
      },
      {
        id: "user-passwords",
        label: "Only the user's login password on the website.",
      },
    ],
    correctOptionId: "data-transfer",
    explanation:
      "Encryption in transit protects information while it travels across the network, preventing attackers from reading it during transmission.",
  },
  {
    id: "cloud-dependency",
    text: "Which statement is NOT true about cloud storage?",
    options: [
      {
        id: "requires-internet",
        label: "It typically requires an Internet connection to access files.",
      },
      {
        id: "shared-resources",
        label: "It stores data on shared infrastructure managed by a provider.",
      },
      {
        id: "local-only",
        label: "It stores files only on a single local computer without remote copies.",
      },
      {
        id: "scalable",
        label: "It can scale storage capacity as needs change.",
      },
    ],
    correctOptionId: "local-only",
    explanation:
      "Cloud storage is not local-only; it stores data remotely and often keeps multiple copies rather than only one copy on a single computer.",
  },
  {
    id: "cloud-distributed",
    text: "What is a benefit of distributing data across multiple cloud servers?",
    options: [
      {
        id: "more-security",
        label: "It guarantees no one can ever access the data.",
      },
      {
        id: "better-reliability",
        label: "It improves reliability and availability of stored files.",
      },
      {
        id: "single-copy",
        label: "It keeps only one copy of the file to reduce costs.",
      },
      {
        id: "slower-access",
        label: "It always makes access much slower for the user.",
      },
    ],
    correctOptionId: "better-reliability",
    explanation:
      "Distributed storage improves reliability and availability by storing data across multiple servers instead of relying on a single device.",
  },
];
