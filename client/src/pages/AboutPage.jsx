import React from 'react';
import { Sparkles, Users, Target, ShieldCheck, Zap, Heart, Mail, Github, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

const AboutPage = () => {
  const coreValues = [
    {
      icon: Target,
      title: 'Decentralized Authorship',
      description:
        'Every user operates independently without a single editorial gatekeeper. Writers maintain total control over their publications, updates, and interactions.'
    },
    {
      icon: Zap,
      title: 'Performance & Image Optimization',
      description:
        'Images are automatically compressed and processed with Sharp into optimized WebP formats (600x400 cards, 1200w detail views) for lightning-fast delivery.'
    },
    {
      icon: ShieldCheck,
      title: 'Community-Driven Ratings',
      description:
        'A transparent 1-to-5 star evaluation system that allows the reading community to elevate high-signal technical analysis and frameworks.'
    },
    {
      icon: Users,
      title: 'Open Dialogue',
      description:
        'Constructive, real-time discussions on every post so authors and readers can exchange technical feedback, caveats, and practical insights.'
    }
  ];

  const team = [
    {
      role: 'Platform & Infrastructure',
      title: 'Systems & Reliability',
      description: 'Maintaining robust database performance, low-latency API routes, and automated media optimization.',
      avatar: 'P'
    },
    {
      role: 'Editorial & Community',
      title: 'Open Standards & Culture',
      description: 'Fostering inclusive community guidelines, accessibility standards, and high-signal engineering dialogue.',
      avatar: 'E'
    }
  ];

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-16">
        {/* Hero Section */}
        <section className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-50 border border-brand-200 text-xs font-bold text-brand-700">
            <Sparkles className="w-3.5 h-3.5 text-brand-600" />
            <span>About Blog TK</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            An open platform for sharing engineering craft and design vision.
          </h1>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Blog TK was conceived as a distraction-free, light-themed sanctuary for software engineers, UX leaders, and tech writers to share actionable technical wisdom.
          </p>
        </section>

        {/* What is Blog TK & Our Mission */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-soft p-8 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-brand-600 uppercase tracking-wider block mb-2">Our Mission</span>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                Democratizing technical knowledge sharing.
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                In a web crowded with paywalls, sponsored clutter, and algorithmic clickbait, Blog TK keeps the focus strictly on quality content and peer review.
              </p>
              <p className="text-sm text-slate-600 leading-relaxed">
                Whether you're debugging distributed database queries, establishing design tokens, or leading engineering teams through scale, Blog TK provides the stage for your knowledge.
              </p>
            </div>
            <div className="mt-6 pt-6 border-t border-slate-100 flex items-center gap-2 text-xs font-semibold text-brand-600">
              <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
              <span>Created for engineers by engineers</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl shadow-soft p-8 text-white flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider block mb-2">Why Blog TK?</span>
              <h2 className="text-2xl font-bold text-white mb-4">
                Autonomy, Speed, and Direct Connection.
              </h2>
              <ul className="space-y-3 text-sm text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-brand-400 font-bold">&#10003;</span>
                  <span><strong>Zero Gatekeeping:</strong> Any registered user can publish instantly.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-brand-400 font-bold">&#10003;</span>
                  <span><strong>Direct Contact:</strong> Readers can reach out to authors via provided phone and email directly.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-brand-400 font-bold">&#10003;</span>
                  <span><strong>Instant Search & Filter:</strong> Real-time discovery by keyword, date, and rating.</span>
                </li>
              </ul>
            </div>
            <div className="mt-6 pt-6 border-t border-slate-700/60 flex items-center justify-between">
              <span className="text-xs text-slate-400">Ready to contribute?</span>
              <Link
                to="/register"
                className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs transition-colors"
              >
                Join Blog TK &rarr;
              </Link>
            </div>
          </div>
        </section>

        {/* Core Architecture Values */}
        <section className="space-y-8">
          <div className="text-center max-w-xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Core Architectural Pillars
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-2">
              How our modern MERN stack delivers speed and reliability.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {coreValues.map((val, idx) => {
              const IconComp = val.icon;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs hover:shadow-soft-hover transition-all"
                >
                  <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center mb-4">
                    <IconComp className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2">{val.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{val.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Leadership & Editorial Team */}
        <section className="space-y-8 pt-6 border-t border-slate-200">
          <div className="text-center max-w-xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Community & Editorial Principles
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-2">
              Dedicated to maintaining an open, accessible, and high-quality environment for all creators.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {team.map((member, idx) => (
              <div
                key={idx}
                className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-soft flex items-start gap-4"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-600 text-white font-extrabold text-xl flex items-center justify-center shadow-md shadow-brand-500/20 shrink-0">
                  {member.avatar}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">{member.role}</h3>
                  <p className="text-xs font-semibold text-brand-600 mb-1">{member.title}</p>
                  <p className="text-xs text-slate-600 leading-relaxed">{member.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Contact & Support Section */}
        <section className="bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-10 shadow-soft text-center max-w-2xl mx-auto">
          <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mx-auto mb-4">
            <Mail className="w-6 h-6" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">
            Have questions or feedback?
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto mb-6">
            We are always listening. Get in touch with our team for questions about publishing, formatting, or feature suggestions.
          </p>
          <div className="inline-flex items-center gap-3">
            <a
              href="mailto:contact@blogtk.com"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors"
            >
              <Mail className="w-4 h-4" />
              <span>contact@blogtk.com</span>
            </a>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutPage;
