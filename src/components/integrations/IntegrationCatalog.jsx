import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, CheckCircle, ExternalLink, Lock, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const INTEGRATION_CATALOG = [
  // Productivity
  { id: 'google_workspace', name: 'Google Workspace', category: 'productivity', logo: '🔵', description: 'Gmail, Drive, Docs, Sheets, Calendar', status: 'available', labels: ['Recommended', 'Popular'] },
  { id: 'microsoft_365', name: 'Microsoft 365', category: 'productivity', logo: '◼️', description: 'Outlook, OneDrive, Teams, Excel', status: 'available', labels: ['Enterprise'] },
  { id: 'zoom', name: 'Zoom', category: 'communication', logo: '⚪', description: 'Video meetings and webinars', status: 'available', labels: ['Popular'] },
  
  // Communication
  { id: 'slack', name: 'Slack', category: 'communication', logo: '🟣', description: 'Team messaging and notifications', status: 'available', labels: ['Popular', 'Recommended'] },
  { id: 'mailchimp', name: 'Mailchimp', category: 'communication', logo: '🟡', description: 'Email marketing campaigns', status: 'available', labels: [] },
  
  // Payment
  { id: 'stripe', name: 'Stripe', category: 'payment', logo: '🔵', description: 'Payment processing', status: 'available', labels: ['Recommended', 'Payment'] },
  { id: 'square', name: 'Square', category: 'payment', logo: '⬜', description: 'Point of sale and payments', status: 'available', labels: ['Payment'] },
  { id: 'paypal', name: 'PayPal', category: 'payment', logo: '🔘', description: 'Payment and invoicing', status: 'available', labels: ['Payment'] },
  
  // Finance & Accounting
  { id: 'quickbooks', name: 'QuickBooks', category: 'finance_accounting', logo: '🟢', description: 'Accounting and financial management', status: 'available', labels: ['Finance', 'Enterprise'] },
  
  // HR & Payroll
  { id: 'gusto', name: 'Gusto', category: 'hr_payroll', logo: '🔴', description: 'Payroll and HR management', status: 'available', labels: ['HR', 'Enterprise'] },
  { id: 'adp', name: 'ADP', category: 'hr_payroll', logo: '⚫', description: 'Enterprise payroll solutions', status: 'available', labels: ['HR', 'Enterprise'] },
  
  // SIS/LMS
  { id: 'canvas', name: 'Canvas', category: 'sis_lms', logo: '🟠', description: 'Learning management system', status: 'available', labels: ['SIS/LMS', 'Student Data'] },
  { id: 'schoology', name: 'Schoology', category: 'sis_lms', logo: '🔷', description: 'Educational platform', status: 'available', labels: ['SIS/LMS'] },
  { id: 'clever', name: 'Clever', category: 'sis_lms', logo: '🟩', description: 'School data platform', status: 'available', labels: ['SIS/LMS', 'Recommended'] },
  { id: 'classlink', name: 'ClassLink', category: 'sis_lms', logo: '🔵', description: 'K-12 launchpad and SSO', status: 'available', labels: ['SIS/LMS'] },
  { id: 'powerschool', name: 'PowerSchool', category: 'sis_lms', logo: '🟪', description: 'School information system', status: 'available', labels: ['SIS/LMS', 'Enterprise'] },
  { id: 'infinite_campus', name: 'Infinite Campus', category: 'sis_lms', logo: '🔘', description: 'Student information system', status: 'available', labels: ['SIS/LMS'] },
  
  // CRM
  { id: 'salesforce', name: 'Salesforce', category: 'crm', logo: '☁️', description: 'Enterprise CRM platform', status: 'available', labels: ['CRM', 'Enterprise'] },
  { id: 'hubspot', name: 'HubSpot', category: 'crm', logo: '🟠', description: 'CRM and marketing automation', status: 'available', labels: ['CRM'] },
  
  // Automation
  { id: 'zapier', name: 'Zapier', category: 'automation', logo: '⚡', description: 'Automation and workflow builder', status: 'available', labels: ['Automation', 'Popular'] },
  
  // Developer
  { id: 'webhooks', name: 'Webhooks', category: 'automation', logo: '🪝', description: 'Custom webhooks and API', status: 'available', labels: ['Developer', 'Custom'] },
];

const CATEGORIES = [
  { id: 'all', label: 'All Integrations' },
  { id: 'productivity', label: 'Productivity' },
  { id: 'communication', label: 'Communication' },
  { id: 'payment', label: 'Payment' },
  { id: 'finance_accounting', label: 'Finance & Accounting' },
  { id: 'hr_payroll', label: 'HR & Payroll' },
  { id: 'sis_lms', label: 'SIS/LMS' },
  { id: 'crm', label: 'CRM' },
  { id: 'automation', label: 'Automation' },
];

export default function IntegrationCatalog({ onConnect }) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');

  const filtered = INTEGRATION_CATALOG.filter(int => {
    const matchesSearch = int.name.toLowerCase().includes(search.toLowerCase()) || int.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === 'all' || int.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8">
      {/* Search & Filter */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search integrations..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Category tabs */}
        <div className="flex flex-wrap gap-2 pb-4 border-b border-border overflow-x-auto">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                category === cat.id
                  ? 'bg-black text-white'
                  : 'bg-muted text-muted-foreground hover:text-black'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Integration Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((int, i) => (
          <motion.div
            key={int.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            className="group p-6 rounded-2xl border border-border bg-white hover:border-black/20 hover:shadow-sm transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="text-4xl">{int.logo}</div>
              <CheckCircle className="w-4 h-4 text-green-600 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            <h3 className="font-bold text-black mb-1">{int.name}</h3>
            <p className="text-xs text-muted-foreground mb-4 leading-relaxed">{int.description}</p>

            {/* Labels */}
            {int.labels.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-4">
                {int.labels.map(label => (
                  <span key={label} className="px-2 py-1 rounded text-[10px] font-bold bg-muted text-muted-foreground">
                    {label}
                  </span>
                ))}
              </div>
            )}

            <Button
              onClick={() => onConnect?.(int.id)}
              className="w-full h-8 bg-black text-white hover:bg-black/85 transition-all text-xs font-semibold"
            >
              Connect
            </Button>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
          <p className="text-muted-foreground">No integrations found. Try a different search.</p>
        </motion.div>
      )}
    </div>
  );
}