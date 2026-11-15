import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronRight, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PremiumLanding() {
  const [scrolled, setScrolled] = useState(false);

  React.useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <motion.nav
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`fixed top-0 w-full z-40 transition-all ${
          scrolled ? 'bg-white/80 backdrop-blur-md border-b border-gray-200' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="font-bold text-2xl text-gray-900">edXponential</div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-gray-600 hover:text-gray-900">Features</a>
            <a href="#solutions" className="text-sm text-gray-600 hover:text-gray-900">Solutions</a>
            <a href="#pricing" className="text-sm text-gray-600 hover:text-gray-900">Pricing</a>
            <Link to="/welcome" className="text-sm text-gray-600 hover:text-gray-900">About</Link>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" className="text-gray-900">Log in</Button>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">Get Started</Button>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="pt-32 pb-24 px-6 bg-gradient-to-b from-white via-blue-50/30 to-white">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-orange-500" />
              <span className="text-sm font-semibold text-gray-600">The Future of Education Management</span>
            </div>
            <h1 className="text-6xl md:text-7xl font-black text-gray-900 leading-tight mb-6">
              Build Better Schools.
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-orange-500">
                Faster.
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              edXponential uses AI to personalize every educator's experience — giving leaders, teachers, founders, tutors, and school teams exactly what they need to succeed.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/onboarding">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8">
                Get the App
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-2 border-gray-900 text-gray-900 text-lg px-8">
              Request Access
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-black text-gray-900 mb-4">Why Educators Choose edXponential</h2>
            <p className="text-xl text-gray-600">The AI platform that understands your school</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: '🤖',
                title: 'AI-Powered Personalization',
                description: 'Eddy learns your role, goals, and challenges—then builds your perfect platform.',
              },
              {
                icon: '⚡',
                title: 'Enterprise Operations',
                description: 'Finance, HR, Facilities, Safety, Inventory—all in one intelligent command center.',
              },
              {
                icon: '📊',
                title: 'Real-Time Intelligence',
                description: 'AI-generated insights on student outcomes, operations, and strategic decisions.',
              },
              {
                icon: '🎓',
                title: 'Built for Every Role',
                description: 'Principals, teachers, founders, tutors, investors—each gets their perfect experience.',
              },
              {
                icon: '🌍',
                title: 'Connected Ecosystem',
                description: 'Courses, coaching, communities, and investor connections—everything in one place.',
              },
              {
                icon: '🔒',
                title: 'Enterprise Security',
                description: 'Bank-level security, FERPA compliance, SSO, and audit logs for peace of mind.',
              },
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="p-8 rounded-2xl bg-white border-2 border-gray-200 hover:border-blue-600 transition-all"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section id="solutions" className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-black text-gray-900 mb-4">Solutions for Every Role</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { role: '👔 School Leaders', apps: ['OperationX™', 'Graiedx™', 'Xschores™'] },
              { role: '📚 Teachers', apps: ['Graiedx™', 'Classifiedx™', 'PerSpEdxtives™'] },
              { role: '🚀 Founders', apps: ['Foundaitionx™', 'OperationX™', 'EduCartx™'] },
              { role: '✏️ Tutors', apps: ['TwotrX™', 'EdXportante™', 'Coaching'] },
            ].map((solution, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="p-8 rounded-2xl border-2 border-gray-200 hover:border-blue-600 transition-all"
              >
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{solution.role}</h3>
                <div className="space-y-2">
                  {solution.apps.map(app => (
                    <div key={app} className="flex items-center gap-2 text-gray-600">
                      <ChevronRight className="w-4 h-4 text-blue-600" />
                      {app}
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-black text-gray-900 mb-4">Simple, Transparent Pricing</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { tier: 'Essentials', price: 'Free', users: 'Solo educators' },
              { tier: 'Professional', price: '$99/mo', users: 'School teams' },
              { tier: 'Enterprise', price: 'Custom', users: 'Districts & organizations' },
            ].map((plan, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className={`p-8 rounded-2xl border-2 transition-all ${
                  idx === 1
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 bg-white hover:border-blue-600'
                }`}
              >
                <h3 className="text-2xl font-bold text-gray-900">{plan.tier}</h3>
                <div className="text-3xl font-black text-gray-900 mt-2 mb-1">{plan.price}</div>
                <p className="text-gray-600 text-sm mb-6">{plan.users}</p>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  Get Started
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="max-w-4xl mx-auto text-center text-white space-y-6">
          <h2 className="text-4xl font-black">Ready to Transform Your School?</h2>
          <p className="text-xl text-blue-100">Join hundreds of educators using edXponential</p>
          <Link to="/onboarding">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
              Get Started Now
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-6">
        <div className="max-w-6xl mx-auto text-center text-sm">
          <p>&copy; 2026 edXponential. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}