// Subject to change
import voodooGraphics from "../../assets/s01g8/voodooGraphics.jpg";
import geforce256 from "../../assets/s01g8/geforce256.webp";
import cuda from "../../assets/s01g8/cuda.webp";
import rtx20 from "../../assets/s01g8/rtx20.webp";
import aiSuperComputer from "../../assets/s01g8/aiSuperComputer.webp";

const gpuTimeline = [
  {
    id: 1,
    year: 1996,
    title: "3DFX Voodoo Graphics",
    description: "One of the first widely successful consumer 3D accelerators. It handled graphics rendering tasks that were previously done by the CPU, significantly improving gaming performance. This marked an early shift toward dedicated hardware for visual computing.",
    image: voodooGraphics.src,
    imageAlt: "3dfx Voodoo Graphics card, an early consumer 3D graphics accelerator."
  },
  {
    id: 2,
    year: 1999,
    title: "GeForce 256",
    description: "Recognized as the first true GPU. It introduced hardware transform and lighting (T&L), moving complex geometric calculations from the CPU to the graphics card. This established the foundation for modern programmable graphics pipelines.",
    image: geforce256.src,
    imageAlt: "NVIDIA GeForce 256 graphics card, one of the first GPUs marketed as a graphics processing unit."
  },
  {
    id: 3,
    year: 2007,
    title: "CUDA",
    description: "Introduced a programming model that allowed developers to use GPUs for general-purpose computation. Instead of being limited to graphics workloads, GPUs could now execute massively parallel algorithms. This marked the beginning of the GPGPU era.",
    image: cuda.src,
    imageAlt: "NVIDIA GeForce 8800 GTX, the first graphics card to support CUDA and general-purpose GPU computing."
  },
  {
    id: 4,
    year: 2018,
    title: "RTX 20 Series",
    description: "Brought real-time ray tracing to consumer GPUs using dedicated RT cores. It also introduced Tensor cores for AI-accelerated graphics techniques like denoising and upscaling. Together, these changes significantly improved realism and performance in modern rendering.",
    image: rtx20.src,
    imageAlt: "NVIDIA GeForce RTX 2080 Founders Edition graphics card from the RTX 20 Series, introducing dedicated RT Cores for real-time ray tracing and Tensor Cores for AI acceleration."
  },
  {
    id: 5,
    year: "2022-Present",
    title: "AI Supercomputing Era",
    description: "GPUs have become central to large-scale artificial intelligence and scientific computing. They are widely used for training deep learning models, running inference at scale, and powering data centers. Modern GPU architectures are now designed primarily around AI and parallel throughput.",
    image: aiSuperComputer.src,
    imageAlt: "NVIDIA Eos AI supercomputer, a large-scale GPU cluster featuring NVIDIA H100 GPUs, representing the modern era of large-scale AI computing and GPU-accelerated supercomputing."
  }
];

export default gpuTimeline;