import React, { useState } from 'react';

import voodooGraphics from "../../assets/s01g8/voodooGraphics.jpg";
import geforce256 from "../../assets/s01g8/geforce256.webp";
import cuda from "../../assets/s01g8/cuda.webp";
import rtx20 from "../../assets/s01g8/rtx20.webp";
import aiSuperComputer from "../../assets/s01g8/aiSuperComputer.webp";
import "../../styles/s01g8/architecture-explorer.css";

const gpuGenerations = [
  {
    id: 'voodoo',
    name: 'Voodoo Graphics (1996)',
    image: voodooGraphics.src,
    imageAlt: "3dfx Voodoo Graphics card, an early consumer 3D graphics accelerator.",
    purpose: '3D Graphics Acceleration',
    features: ['Fixed-function pipeline', 'Hardware rasterization', 'Single-cycle texture mapping'],
    workloads: ['Early 3D PC Games', 'Software-to-hardware rendering transition'],
    innovations: ['First widely successful consumer 3D accelerator']
  },
  {
    id: 'geforce256',
    name: 'GeForce 256 (1999)',
    image: geforce256.src,
    imageAlt: "NVIDIA GeForce 256 graphics card, one of the first GPUs marketed as a graphics processing unit.",
    purpose: 'Advanced 3D Rendering',
    features: ['Hardware Transform and Lighting (T&L)', 'Single-chip 2D/3D video accelerator'],
    workloads: ['Complex 3D games', 'Early CAD applications'],
    innovations: ['Introduction of the "GPU" concept', 'Offloaded geometry processing from the CPU']
  },
  {
    id: 'cuda',
    name: 'CUDA-era GPUs (2007)',
    image: cuda.src,
    imageAlt: "NVIDIA GeForce 8800 GTX, the first graphics card to support CUDA and general-purpose GPU computing.",
    purpose: 'General-Purpose Parallel Computing',
    features: ['Unified shader architecture', 'Streaming Multiprocessors (SMs)', 'SIMT execution'],
    workloads: ['Scientific simulations', 'Video rendering', 'Early deep learning'],
    innovations: ['Made GPUs programmable for non-graphics tasks using C/C++']
  },
  {
    id: 'rtx',
    name: 'RTX GPUs (2018)',
    image: rtx20.src,
    imageAlt: "NVIDIA GeForce RTX 2080 Founders Edition graphics card from the RTX 20 Series, introducing dedicated RT Cores for real-time ray tracing and Tensor Cores for AI acceleration.",
    purpose: 'Real-Time Ray Tracing and AI Rendering',
    features: ['RT Cores', 'Tensor Cores', 'Concurrent integer/floating-point execution'],
    workloads: ['Photorealistic gaming', '3D animation', 'AI upscaling (DLSS)'],
    innovations: ['First consumer GPUs capable of real-time ray tracing']
  },
  {
    id: 'ai',
    name: 'AI-Accelerated Architectures (2022-Present)',
    image: aiSuperComputer.src,
    imageAlt: "NVIDIA Eos AI supercomputer, a large-scale GPU cluster featuring NVIDIA H100 GPUs, representing the modern era of large-scale AI computing and GPU-accelerated supercomputing.",
    purpose: 'AI Training and Inference',
    features: ['Transformer Engines', 'High Bandwidth Memory (HBM)', 'Massive scale parallelism'],
    workloads: ['Large Language Models (LLMs)', 'Generative AI', 'Supercomputing'],
    innovations: ['Established GPUs as core infrastructure for large-scale AI computing']
  }
];

export default function ArchitectureExplorer() {
  const [activeGpu, setActiveGpu] = useState(gpuGenerations[0]);

  return (
    <div className="architecture-explorer">
    <div className="explorer-header"> 
      <h3>Interactive GPU Architecture Explorer</h3>
    </div>
      
      {/* Navigation Tabs */}
      <div className="gpu-tabs">
        {gpuGenerations.map((gpu) => (
          <button
            key={gpu.id}
            onClick={() => setActiveGpu(gpu)}
            className={
              activeGpu.id === gpu.id
                ? "gpu-tab active"
                : "gpu-tab"
            }
          >
            {gpu.name}
          </button>
        ))}
      </div>

      {/* Content Display Panel */}
        <div key={activeGpu.id} className="gpu-info-card">
        <img
            key={activeGpu.id + "-image"}
            src={activeGpu.image}
            alt={activeGpu.imageAlt}
            className="gpu-image"
        />

        <h4 key={activeGpu.id + "-title"} className="gpu-title">
          {activeGpu.name}
        </h4>
        
        <p className="gpu-purpose"><strong>Primary Purpose:</strong> {activeGpu.purpose}</p>
        
        <div className="gpu-details">
          <div>
            <strong style={{ color: '#8b949e' }}>Key Architectural Features:</strong>
            <ul style={{ paddingLeft: '1.2rem', marginTop: '0.5rem', lineHeight: '1.6' }}>
              {activeGpu.features.map((item, i) => <li key={i}>{item}</li>)}
            </ul>
          </div>
          
          <div>
            <strong style={{ color: '#8b949e' }}>Supported Workloads:</strong>
            <ul style={{ paddingLeft: '1.2rem', marginTop: '0.5rem', lineHeight: '1.6' }}>
              {activeGpu.workloads.map((item, i) => <li key={i}>{item}</li>)}
            </ul>
          </div>
          
          <div>
            <strong style={{ color: '#8b949e' }}>Major Innovations:</strong>
            <ul style={{ paddingLeft: '1.2rem', marginTop: '0.5rem', lineHeight: '1.6' }}>
              {activeGpu.innovations.map((item, i) => <li key={i}>{item}</li>)}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
