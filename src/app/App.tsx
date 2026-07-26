import { useState, useEffect, useRef } from 'react';
import { HeroSection } from './components/HeroSection';
import { ProjectsSection } from './components/ProjectsSection';
import { ResumeSection } from './components/ResumeSection';
import { SkillsSection } from './components/SkillsSection';
import { ScrollProgress } from './components/ScrollProgress';
import { DraftingTitleBlock } from './components/DraftingTitleBlock';
import { PhysicsFooter } from './components/PhysicsFooter';

export default function App() {
  // The physics sandbox is hidden by default — the smiley at the very bottom
  // of the page is the easter egg that reveals it.
  const [showSandbox, setShowSandbox] = useState(false);
  const sandboxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (showSandbox) {
      sandboxRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [showSandbox]);

  return (
    <div className="min-h-screen bg-black text-white font-mono cursor-crosshair overflow-x-hidden relative">
      {/* Engineering Grid Background */}
      <div
        className="fixed inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(rgba(100, 100, 100, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(100, 100, 100, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px'
        }}
      />

      {/* Custom CAD Crosshair Cursor */}
      <style dangerouslySetInnerHTML={{__html: `
        * { cursor: crosshair !important; }
      `}} />

      {/* Scroll Progress Dimension Line */}
      <ScrollProgress />

      {/* Main Content */}
      <main className="relative z-10 pl-20">
        <HeroSection />
        <ProjectsSection />
        <ResumeSection />
        <SkillsSection />

        {showSandbox && (
          <div ref={sandboxRef}>
            <PhysicsFooter />
          </div>
        )}

        {/* Easter egg: reveals the interactive physics sandbox */}
        <div className="flex justify-center pt-12 pb-[240px]">
          <button
            onClick={() => setShowSandbox((v) => !v)}
            aria-label={showSandbox ? 'Hide the physics sandbox' : 'Show the physics sandbox'}
            aria-pressed={showSandbox}
            className="group p-2 opacity-40 hover:opacity-100 transition-opacity duration-300"
          >
            <svg width="26" height="26" viewBox="0 0 26 26" aria-hidden="true">
              <circle
                cx="13" cy="13" r="11"
                fill="none"
                className="stroke-gray-500 group-hover:stroke-blue-400 transition-colors"
                strokeWidth="1.5"
              />
              <circle cx="9.5" cy="10.5" r="1.4" className="fill-gray-500 group-hover:fill-blue-400 transition-colors" />
              <circle cx="16.5" cy="10.5" r="1.4" className="fill-gray-500 group-hover:fill-blue-400 transition-colors" />
              <path
                d={showSandbox ? 'M 7 14.5 Q 13 21 19 14.5' : 'M 8 15 Q 13 19.5 18 15'}
                fill="none"
                className="stroke-gray-500 group-hover:stroke-blue-400 transition-colors"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      </main>

      {/* Persistent Drafting Title Block */}
      <DraftingTitleBlock />
    </div>
  );
}