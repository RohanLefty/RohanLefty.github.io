import { useState, useEffect } from 'react';
import { HeroSection } from './components/HeroSection';
import { ProjectsSection } from './components/ProjectsSection';
import { ResumeSection } from './components/ResumeSection';
import { SkillsSection } from './components/SkillsSection';
import { ScrollProgress } from './components/ScrollProgress';
import { DraftingTitleBlock } from './components/DraftingTitleBlock';
import { PhysicsFooter } from './components/PhysicsFooter';

export default function App() {
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
        <PhysicsFooter />
      </main>

      {/* Persistent Drafting Title Block */}
      <DraftingTitleBlock />
    </div>
  );
}