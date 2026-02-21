import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import Hero from './Hero';
import ProblemSection from './ProblemSection';
import ModulesSection from './ModulesSection';
import WorkflowTimeline from './WorkflowTimeline';
import KPISection from './KPISection';
import FinalCTA from './FinalCTA';
import LandingFooter from './LandingFooter';

export default function LandingPage() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    // Force dark mode for enterprise landing page look
    document.documentElement.classList.add('dark');
  }, [isDark]);

  const toggleTheme = () => setIsDark((v) => !v);

  const primaryCtaHref = '/dashboard';
  const primaryCtaLabel = 'Launch Command Center';
  const loginHref = '/dashboard';
  const finalCtaHref = '/dashboard';

  return (
    <div className="font-sans bg-[#0B1220] text-(--text-primary) min-h-screen transition-colors duration-300 selection:bg-(--brand-accent)/30 selection:text-(--brand-accent)">
      <Navbar toggleTheme={toggleTheme} isDark={isDark} loginHref={loginHref} />

      <main>
        <Hero primaryCtaHref={primaryCtaHref} primaryCtaLabel={primaryCtaLabel} />
        <ProblemSection />
        <ModulesSection />
        <WorkflowTimeline />
        <KPISection />
        <FinalCTA ctaHref={finalCtaHref} />
      </main>

      <LandingFooter />
    </div>
  );
}
