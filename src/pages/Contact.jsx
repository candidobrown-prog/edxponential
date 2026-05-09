import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Contact() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Here you would send the form data
    setSubmitted(true);
    setTimeout(() => {
      navigate('/');
    }, 3000);
  };

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
          <h1 className="display-2 text-white mb-4">Get in Touch</h1>
          <p className="text-xl text-text-secondary">We'd love to hear from you. Send us a message.</p>
        </div>
      </div>

      {/* Content */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div>
            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="flex gap-4"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/25 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">Email</h3>
                  <p className="text-text-secondary">support@edxponential.com</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="flex gap-4"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/25 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">Phone</h3>
                  <p className="text-text-secondary">+1 (555) 123-4567</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="flex gap-4"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/25 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">Address</h3>
                  <p className="text-text-secondary">San Francisco, CA 94102</p>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Form */}
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="space-y-5"
          >
            {submitted ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full bg-primary/25 flex items-center justify-center mx-auto mb-4">
                  <Send className="w-8 h-8 text-primary" />
                </div>
                <h3 className="heading-2 text-white mb-2">Message Sent!</h3>
                <p className="text-text-secondary">Thanks for reaching out. We'll get back to you soon.</p>
              </div>
            ) : (
              <>
                <div>
                  <label className="label block mb-2">Name</label>
                  <input
                    type="text"
                    placeholder="Your name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="input-base"
                  />
                </div>

                <div>
                  <label className="label block mb-2">Email</label>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="input-base"
                  />
                </div>

                <div>
                  <label className="label block mb-2">Subject</label>
                  <input
                    type="text"
                    placeholder="What is this about?"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    required
                    className="input-base"
                  />
                </div>

                <div>
                  <label className="label block mb-2">Message</label>
                  <textarea
                    placeholder="Your message..."
                    rows={6}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                    className="input-base resize-none"
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  type="submit"
                  className="w-full py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition glow-crimson-sm flex items-center justify-center gap-2"
                >
                  Send Message <Send className="w-4 h-4" />
                </motion.button>
              </>
            )}
          </motion.form>
        </div>
      </section>
    </div>
  );
}