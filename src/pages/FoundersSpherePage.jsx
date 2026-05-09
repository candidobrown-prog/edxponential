import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, Rocket, Users, BarChart3, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function FoundersSpherePage() {
  const navigate = useNavigate();

  const features = [
    { title: 'Charter Builder', description: 'Build your school charter in hours, not months', icon: Rocket },
    { title: 'Founder Network', description: 'Connect with 500+ education founders', icon: Users },
    { title: 'Pitch Optimization', description: 'AI-powered pitch deck & investor readiness', icon: Zap },
    { title: 'Financial Planning', description: 'Budget templates & financial forecasting', icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground dark">
      {/* Header */}
      <div className="border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <button
            onClick={() => navigate(-1)}
            className="text-text-secondary hover:text-white mb-6 transition flex items-center gap-2"
          >
            ← Back
          </button>
          <h1 className="display-2 text-white mb-4">Founders Sphere</h1>
          <p className="text-xl text-text-secondary max-w-2xl">
            Everything you need to build, fund, and scale your school. From charter to classroom.
          </p>
        </div>
      </div>

      {/* Features Grid */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="p-8 rounded-xl bg-card border border-border hover:shadow-lg transition"
                >
                  <Icon className="w-8 h-8 text-primary mb-4" />
                  <h3 className="heading-2 text-white mb-2">{feature.title}</h3>
                  <p className="text-text-secondary">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>

          {/* CTA Section */}
          <div className="max-w-2xl mx-auto text-center py-16 border-t border-border">
            <h2 className="heading-1 text-white mb-4">Ready to Build Your School?</h2>
            <p className="text-text-secondary mb-8">
              Join 500+ founders building the future of education.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.02 }}
                onClick={() => navigate('/request-access?tier=founders-sphere')}
                className="px-8 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition glow-crimson-sm flex items-center justify-center gap-2"
              >
                Join Founders Sphere <ArrowRight className="w-4 h-4" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                onClick={() => navigate('/ask-eddy')}
                className="px-8 py-3 border border-border text-white rounded-lg font-semibold hover:bg-surface/50 transition"
              >
                Ask Eddy First
              </motion.button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}