import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Command, Moon, Sun, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar({ toggleTheme, isDark, loginHref = '/dashboard' }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Features', href: '#features' },
    { name: 'Modules', href: '#modules' },
    { name: 'Workflow', href: '#workflow' },
    { name: 'Metrics', href: '#metrics' },
  ];

  const scrollToSection = (e, href) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);

    if (location.pathname !== '/') {
      window.location.href = `/${href}`;
      return;
    }

    const element = document.querySelector(href);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    } else if (href === 'body') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled
          ? 'bg-(--bg-surface)/80 backdrop-blur-xl border-b border-(--border) shadow-sm py-3'
          : 'bg-transparent py-5'
        }`}
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3 group cursor-pointer" onClick={(e) => scrollToSection(e, 'body')}>
          <div className="w-10 h-10 rounded-xl bg-linear-to-br from-(--brand-accent) to-(--brand-accent-hover) flex items-center justify-center shadow-lg shadow-(--brand-accent)/20 group-hover:shadow-(--brand-accent)/40 transition-all duration-300">
            <Command className="w-5 h-5 text-black" />
          </div>
          <span className="font-bold text-xl text-(--text-primary) tracking-tight">
            Nexus<span className="text-(--brand-accent)">Fleet</span>
          </span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <div className={`flex items-center gap-8 ${isScrolled ? '' : 'bg-(--bg-surface)/50 backdrop-blur-md px-8 py-3 rounded-full border border-(--border)/50 shadow-sm-token'}`}>
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => scrollToSection(e, link.href)}
                className="relative text-sm font-medium text-(--text-secondary) hover:text-(--text-primary) transition-colors py-1 group"
              >
                {link.name}
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-(--brand-accent) scale-x-0 group-hover:scale-x-100 transition-transform origin-left rounded-full" />
              </a>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="hidden md:flex items-center gap-4">
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2.5 rounded-full text-(--text-secondary) hover:text-(--brand-accent) hover:bg-(--bg-main) border border-transparent hover:border-(--border) transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-(--brand-accent)"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <Link
            to={loginHref}
            className="btn-primary"
          >
            Open Dashboard
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden flex items-center gap-3">
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 rounded-full text-(--text-secondary) hover:bg-(--bg-main) transition-all"
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-(--text-primary) hover:bg-(--bg-main) rounded-lg transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 w-full bg-(--bg-surface) border-b border-(--border) shadow-xl md:hidden"
          >
            <div className="flex flex-col px-6 py-4 gap-2">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => scrollToSection(e, link.href)}
                  className="text-base font-semibold text-(--text-secondary) hover:bg-(--bg-main) hover:text-(--brand-accent) transition-all p-3 rounded-xl"
                >
                  {link.name}
                </a>
              ))}
              <div className="h-px bg-(--border) my-2 w-full" />
              <Link
                to={loginHref}
                className="w-full text-center btn-primary py-3"
              >
                Open Dashboard
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
