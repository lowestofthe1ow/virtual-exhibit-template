export const simulatorStages = [
  {
    id: 'upload',
    title: 'Upload Begins',
    shortTitle: 'Upload',
    sceneClass: 'uploadStage',
    description:
      'The journey starts when a user selects a file and begins the upload process from a device.',
    tooltip:
      'The device prepares the file and sends an upload request to the cloud storage service.',
    details: [
      'The user chooses a file.',
      'The cloud app checks the account session.',
      'Basic metadata such as file name and size is prepared.',
    ],
  },
  {
    id: 'network',
    title: 'Network Transmission',
    shortTitle: 'Network',
    sceneClass: 'networkStage',
    description:
      'The file is divided into smaller packets that travel through the Internet toward the cloud provider.',
    tooltip:
      'Packets make transmission more manageable because networks can route smaller pieces of data efficiently.',
    details: [
      'Large files may be split into packets.',
      'Packets travel through network paths.',
      'Secure transfer protocols help protect data in transit.',
    ],
  },
  {
    id: 'auth',
    title: 'Authentication and Processing',
    shortTitle: 'Auth',
    sceneClass: 'authStage',
    description:
      'Cloud servers receive the upload request, verify the user, check permissions, and prepare the file for storage.',
    tooltip:
      'Authentication confirms identity, while access control checks whether the user is allowed to upload.',
    details: [
      'The server verifies the user account.',
      'The system checks upload permissions.',
      'Metadata helps decide where the file should be stored.',
    ],
  },
  {
    id: 'storage',
    title: 'Primary Storage',
    shortTitle: 'Storage',
    sceneClass: 'storageStage',
    description:
      'After processing, the uploaded file is written into a primary storage node inside the cloud infrastructure.',
    tooltip:
      'Cloud storage uses servers and storage systems inside data centers instead of saving files only on one device.',
    details: [
      'The file is assigned to storage infrastructure.',
      'Storage may be distributed across multiple systems.',
      'The cloud interface hides the physical storage location.',
    ],
  },
  {
    id: 'replication',
    title: 'Replication and Redundancy',
    shortTitle: 'Replication',
    sceneClass: 'replicationStage',
    description:
      'Copies of the file are created and stored on additional nodes to improve reliability and availability.',
    tooltip:
      'Replication prevents one failed server from becoming the only point of failure.',
    details: [
      'Extra copies are created automatically.',
      'Copies may be stored in different racks or locations.',
      'This improves fault tolerance and high availability.',
    ],
  },
  {
    id: 'sync',
    title: 'Synchronization Across Devices',
    shortTitle: 'Sync',
    sceneClass: 'syncStage',
    description:
      'Once the upload is complete, connected devices can access the updated file through the same cloud account.',
    tooltip:
      'Synchronization keeps the cloud copy and connected devices updated with the latest available version.',
    details: [
      'The uploaded file appears in the user account.',
      'Other devices can access the file.',
      'Updates can be reflected across connected devices.',
    ],
  },
];
