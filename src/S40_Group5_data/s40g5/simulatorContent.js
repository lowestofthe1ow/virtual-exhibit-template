export const simulatorStages = [
  {
    stage: 1,
    title: "Upload",
    description:
      "The user selects a file from their device and clicks the Upload button. The cloud storage application prepares the file by collecting its metadata, such as the file name, size, and type, before beginning transmission."
  },

  {
    stage: 2,
    title: "Network Transmission",
    description:
      "The file is divided into smaller data packets that travel through the Internet. These packets may follow different network routes before arriving at the cloud provider's servers, where they are reassembled."
  },

  {
    stage: 3,
    title: "Cloud Server Processing",
    description:
      "The cloud server authenticates the user's identity, verifies that the upload request is valid, processes the file's metadata, and determines where the file should be stored within the cloud infrastructure."
  },

  {
    stage: 4,
    title: "Storage",
    description:
      "The uploaded file is written to the cloud provider's distributed storage system inside one or more data centers. Although the file may be stored across multiple physical devices, it appears as a single file to the user."
  },

  {
    stage: 5,
    title: "Replication",
    description:
      "Additional copies of the uploaded file are automatically created and stored on different storage servers. Replication improves reliability, fault tolerance, and ensures that files remain available even if hardware fails."
  },

  {
    stage: 6,
    title: "Synchronization",
    description:
      "Once the upload is complete, the latest version of the file is synchronized across all devices connected to the user's account. Any future changes are automatically updated on every synchronized device."
  }
];

export default simulatorStages;