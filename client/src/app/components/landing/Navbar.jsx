import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Command, Moon, Sun, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar({ toggleTheme, isDark, loginHref = '/dashboard' }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
    const element = document.querySelector(href);
    if (element) {
      const offset = 80; // Navbar height
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-(--bg-main)/80 backdrop-blur-xl border-b border-(--border) shadow-sm py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3 group cursor-pointer" onClick={(e) => scrollToSection(e, 'body')}>
          <div className="w-10 h-10 rounded-xl bg-linear-to-br from-(--brand-accent) to-(--brand-accent-hover) flex items-center justify-center shadow-lg shadow-(--brand-accent)/20 group-hover:shadow-(--brand-accent)/40 transition-all duration-300">
            <Command className="w-5 h-5 text-black" />
          </div>
          <span className="font-bold text-xl text-(--text-primary) tracking-tight">
            Fleet<span className="text-(--brand-accent)">Flow</span>
          </span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <div className="flex items-center gap-6 bg-(--bg-surface)/50 backdrop-blur-md px-6 py-2.5 rounded-full border border-(--border) shadow-sm">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => scrollToSection(e, link.href)}
                className="text-sm font-medium text-(--text-secondary) hover:text-(--brand-accent) transition-colors"
              >
                {link.name}
              </a>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="hidden md:flex items-center gap-4">
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2.5 rounded-full text-(--text-secondary) hover:text-(--brand-accent) hover:bg-(--bg-surface) border border-transparent hover:border-(--border) transition-all shadow-sm"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <Link
            to={loginHref}
            className="relative group px-6 py-2.5 text-sm font-medium rounded-full overflow-hidden"
          >
            <span className="absolute inset-0 w-full h-full bg-linear-to-r from-(--brand-primary) to-(--brand-primary-hover) transition-all duration-300 ease-out group-hover:scale-105"></span>
            <span className="relative text-(--bg-surface) flex items-center gap-2">
              Open Dashboard
            </span>
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden flex items-center gap-4">
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 rounded-full text-(--text-secondary) hover:bg-(--bg-surface) transition-all"
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-(--text-primary)"
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
            className="absolute top-full left-0 w-full bg-(--bg-surface) border-b border-(--border) shadow-lg md:hidden"
          >
            <div className="flex flex-col px-6 py-4 gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => scrollToSection(e, link.href)}
                  className="text-base font-medium text-(--text-secondary) hover:text-(--brand-accent) transition-colors py-2 border-b border-(--border)/50"
                >
                  {link.name}
                </a>
              ))}
              <Link
                to={loginHref}
                className="mt-2 px-6 py-3 text-center text-sm font-medium text-(--bg-surface) bg-(--brand-primary) rounded-xl transition-colors"
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
