import { useState } from 'react'; 
import Game from './Game.jsx';
import Foundation from './Foundations.jsx';
import Structure from './Structures.jsx';
import Birth from './Birth.jsx';
import Breadcrumb from './Breadcrumb.jsx';
import '../../styles/s05g3/tailwind.css';

export default function App() {
  const [currentView, setCurrentView] = useState('start');

  return (
    <main className="min-h-screen bg-black grid-bg">  
      {currentView === 'start' && (
        <div className="flex flex-col items-center min-h-screen py-20 px-6 md:px-16">
          <div className="flex flex-col items-center justify-center h-[80vh]">
            <p className="px-6 py-4 text-white rounded-lg text-4xl md:text-5xl font-bold max-w-[600px] text-center tracking-tight mb-6">
              THE INTERNET'S JOURNEY
            </p>
            <button 
              onClick={() => setCurrentView('foundation')}
              className="px-8 py-4 bg-black text-white border-white border-2 rounded-lg text-xl font-bold hover:bg-gray-800 transition-all"
            >
              Let's Start
            </button>
          </div>
          <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-10 mt-10">    
            {/* About Box */}
            <div className="p-8 bg-black/40 border border-white/10 rounded-2xl backdrop-blur-sm">
              <h3 className="text-2xl font-bold text-white mb-4">About the Exhibit</h3>
              <p className="text-gray-400 leading-relaxed text-sm md:text-base">
                This virtual exhibit explores the fascinating evolution of the internet, tracing its roots from early academic packet-switching experiments like ARPANET, through structural protocol standards, all into the birth of the modern web.
              </p>
            </div>

            {/* Contributors Box */}
            <div className="p-8 bg-black/40 border border-white/10 rounded-2xl backdrop-blur-sm">
              <h3 className="text-2xl font-bold text-white mb-4">Meet the Contributors</h3>
              <p className="text-gray-400 leading-relaxed text-sm md:text-base mb-4">
                Built and curated with dedication for our final project in CSARCH2.
              </p>
              <ul className="text-gray-300 text-sm md:text-base space-y-2 font-mono">
                <li>• Ken Marthin H. Borbe</li>
                <li>• Harris Martin C. Garzon</li>
                <li>• David Angelo F. Obar</li>
                <li>• Ronin P. Zerna</li>
                
              </ul>
            </div>

          </div>
        </div>
      )}
      
      {currentView === 'foundation' && (
        <div className="flex flex-col">
          <Breadcrumb currentView={currentView} setCurrentView={setCurrentView} />
          <div className="flex-grow">
            <Foundation />
          </div>
          <div className="flex justify-between w-full px-16 pb-10 font-bold text-lg text-white">
            <button onClick={() => setCurrentView('start')}>&larr; Back</button>
            <button onClick={() => setCurrentView('structure')}>Next: Structure &rarr;</button>
          </div>
        </div>
      )}

      {currentView === 'structure' && (
        <div className="flex flex-col">
          <Breadcrumb currentView={currentView} setCurrentView={setCurrentView} />
          <div className="flex-grow">
            <Structure />
          </div>
          <div className="flex justify-between w-full px-16 pb-10 font-bold text-lg text-white">
            <button onClick={() => setCurrentView('foundation')}>&larr; Previous: Origins</button>
            <button onClick={() => setCurrentView('birth')}>Next: Birth &rarr;</button>
          </div>
        </div>
      )}

      {currentView === 'birth' && (
        <div className="flex flex-col">
          <Breadcrumb currentView={currentView} setCurrentView={setCurrentView} />
          <div className="flex-grow">
            <Birth />
          </div>
          <div className="flex justify-between w-full px-16 pb-10 font-bold text-lg text-white">
            <button onClick={() => setCurrentView('structure')}>&larr; Previous: Structure</button>
            <button onClick={() => setCurrentView('game')}>Next: Game &rarr;</button>
          </div>
        </div>
      )}
      
      {currentView === 'game' && (
        <div className="flex flex-col">
          <Breadcrumb currentView={currentView} setCurrentView={setCurrentView} />
          <div className="flex-grow">
            <Game />
          </div>
          <div className="flex justify-between w-full px-16 pb-10 font-bold text-lg text-white">
            <button onClick={() => setCurrentView('birth')}>&larr; Previous: Birth</button>
            <button onClick={() => setCurrentView('start')}>Next: Back to Home &rarr;</button>
          </div>
        </div>
      )}
    </main>
  );
}