export const animationTiming = {
  fileAppear: 700,
  packetTravel: 1700,
  badgePulse: 900,
  nodePulse: 1350,
  syncAppear: 700,
};

export const stageAnimationNotes = {
  upload:
    'Shows the file appearing on the user device to represent the beginning of the upload.',
  network:
    'Shows packets moving from the device to the cloud server to represent Internet transmission.',
  auth:
    'Highlights the cloud server and authentication badge to represent identity and permission checks.',
  storage:
    'Highlights the primary storage node to represent the first stored cloud copy.',
  replication:
    'Highlights multiple storage nodes to represent redundant copies.',
  sync:
    'Shows additional devices appearing to represent synchronization across devices.',
};
