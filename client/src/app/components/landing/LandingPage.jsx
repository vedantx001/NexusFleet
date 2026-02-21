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
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  const toggleTheme = () => setIsDark((v) => !v);

  const primaryCtaHref = '/dashboard';
  const primaryCtaLabel = 'Open Dashboard';
  const loginHref = '/dashboard';
  const finalCtaHref = '/dashboard';

  return (
    <div className="font-sans bg-(--bg-main) text-(--text-primary) min-h-screen transition-colors duration-300">
      <Navbar toggleTheme={toggleTheme} isDark={isDark} loginHref={loginHref} />
      <Hero primaryCtaHref={primaryCtaHref} primaryCtaLabel={primaryCtaLabel} />
      <ProblemSection />
      <ModulesSection />
      <WorkflowTimeline />
      <KPISection />
      <FinalCTA ctaHref={finalCtaHref} />
      <LandingFooter />
    </div>
  );
}
