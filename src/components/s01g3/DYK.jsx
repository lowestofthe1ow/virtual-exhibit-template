import { useState } from 'react';

const info = [
    "The name \"Wi-Fi\" doesn't actually stand for anything! It is a common myth that it stands for \"Wireless Fidelity.\" In reality, the Wi-Fi Alliance hired a marketing firm to create a catchy, consumer-friendly name because the technical name, \"IEEE 802.11 b Direct Sequence,\" was far too boring for the public.", 
    "The core mathematical technology that makes Wi-Fi possible was co-invented by Hollywood actress Hedy Lamarr during World War II! She developed a \"frequency-hopping\" system to prevent enemy forces from jamming radio-controlled torpedoes. That exact concept of hopping across radio frequencies laid the structural groundwork for the original 1997 802.11 standard.",
    "Wi-Fi 4 brought us MIMO (Multiple-Input Multiple-Output), which uses multiple antennas to bounce signals off walls and furniture. Before Wi-Fi 4, indoor obstacles like concrete walls completely ruined your signal. With Wi-Fi 4, those reflections were actually turned into extra pathways to deliver data faster, using your home's layout to its advantage!",
    "Wi-Fi 5 introduced \"Beamforming,\" which acted like a mental upgrade for routers. Older routers broadcasted Wi-Fi signals in a massive, inefficient circle. Wi-Fi 5 routers learned to detect exactly where your phone or laptop was and focus the radio waves into a targeted beam directly at your device, similar to a spotlight.",
    "Wi-Fi 6 borrowed a clever trick from delivery trucks called OFDMA (which stands for Orthogonal Frequency-Division Multiple Access). In older generations, if three devices needed data, the router had to send three completely separate transmissions. OFDMA allows the router to split a single wireless channel into smaller sub-channels. This lets it pack data for multiple devices into a single transmission.",
    "Wi-Fi 7's Multi-Link Operation (MLO) completely destroys the old \"one lane at a time\" rule. On older routers, even if you had a dual-band router, your phone could only talk on 2.4 GHz or 5 GHz at any given split second. Wi-Fi 7 functions like downloading a massive file using two or three distinct highways at the exact same time, radically shortening wait time."
]

export default function DYK() {
  const [isOpen, setIsOpen] = useState(false);
  const [n, setN] = useState(0);

  const toggleFact = () => {
    if (!isOpen) {
      setN(Math.floor(Math.random() * info.length));
    }
    setIsOpen(prev => !prev);
  };

  return (
    <div>
      <button
        type="button"
        aria-expanded={isOpen}
        aria-label="Toggle Did You Know fact"
        onClick={toggleFact}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '16px',
          width: '52px',
          height: '52px',
          padding: 0,
          fontSize: '20px',
          backgroundColor: '#002170',
          color: '#fff',
          border: 'none',
          borderRadius: '50%',
          cursor: 'pointer',
          boxShadow: '0 2px 10px rgba(0,0,0,0.25)',
          zIndex: 9999,
        }}
      >
        ?
      </button>

      {isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: '82px',
            right: '16px',
            width: 'min(320px, calc(100vw - 2rem))',
            padding: '12px 15px',
            background: '#ffffff',
            border: '1px solid #ababab',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            zIndex: 10000,
            whiteSpace: 'normal',
            wordWrap: 'break-word',
            overflowWrap: 'break-word',
          }}
        >
          <strong style={{ display: 'block', marginBottom: '5px' }}>Did You Know?</strong>
          <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.4', color: '#333' }}>
            {info[n]}
          </p>
        </div>
      )}
    </div>
  );
}