import React, { useState } from 'react';
import { CreditCard, Plus, Trash2, CheckCircle, AlertCircle, Download, RefreshCw, Shield, Zap, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import AddCardModal from '../components/billing/AddCardModal';
import PaymentHistory from '../components/billing/PaymentHistory';
import SubscriptionPanel from '../components/billing/SubscriptionPanel';

const SAVED_METHODS = [
  { id: 'visa_1', type: 'visa', last4: '4242', expiry: '12/27', name: 'Jane Smith', isDefault: true },
  { id: 'mc_1', type: 'mastercard', last4: '8210', expiry: '09/26', name: 'Jane Smith', isDefault: false },
];

const CARD_LOGOS = {
  visa: 'VISA',
  mastercard: 'MC',
  amex: 'AMEX',
  discover: 'DISC',
};

const CARD_COLORS = {
  visa: 'bg-blue-600',
  mastercard: 'bg-red-600',
  amex: 'bg-green-700',
  discover: 'bg-orange-600',
};

function CardItem({ card, onSetDefault, onDelete }) {
  return (
    <div className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all ${card.isDefault ? 'border-primary bg-primary/5' : 'border-border bg-card'}`}>
      <div className="flex items-center gap-3">
        <div className={`w-10 h-7 rounded-md flex items-center justify-center text-white text-[9px] font-black ${CARD_COLORS[card.type] || 'bg-gray-600'}`}>
          {CARD_LOGOS[card.type] || 'CARD'}
        </div>
        <div>
          <p className="font-bold text-sm">•••• •••• •••• {card.last4}</p>
          <p className="text-xs text-muted-foreground">Expires {card.expiry} · {card.name}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {card.isDefault ? (
          <Badge variant="outline" className="text-xs font-bold">Default</Badge>
        ) : (
          <Button variant="ghost" size="sm" className="text-xs" onClick={() => onSetDefault(card.id)}>Set Default</Button>
        )}
        <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => onDelete(card.id)}>
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

export default function Billing() {
  const [cards, setCards] = useState(SAVED_METHODS);
  const [showAddCard, setShowAddCard] = useState(false);
  const [activeTab, setActiveTab] = useState('methods');
  const [paypalConnected, setPaypalConnected] = useState(false);

  const TABS = [
    { id: 'methods', label: 'Payment Methods' },
    { id: 'subscriptions', label: 'Subscriptions' },
    { id: 'history', label: 'Payment History' },
  ];

  const handleSetDefault = (id) => {
    setCards(cards.map(c => ({ ...c, isDefault: c.id === id })));
    toast.success('Default payment method updated');
  };

  const handleDelete = (id) => {
    setCards(cards.filter(c => c.id !== id));
    toast.success('Card removed');
  };

  const handleAddCard = (card) => {
    const newCard = { ...card, id: `card_${Date.now()}`, isDefault: cards.length === 0 };
    setCards([...cards, newCard]);
    setShowAddCard(false);
    toast.success('Card added successfully');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="font-heading text-3xl font-bold">Billing & Payments</h1>
        <p className="text-muted-foreground mt-1">Manage your payment methods, subscriptions, and receipts.</p>
      </div>

      {/* Security Badge */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 rounded-xl px-4 py-3 border border-border">
        <Shield className="w-4 h-4 text-green-600" />
        <span className="font-semibold">256-bit SSL encrypted · Tokenized payments only · PCI-DSS compliant</span>
        <span className="ml-auto font-bold text-foreground">All major cards accepted: Visa · Mastercard · Amex · Discover</span>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-muted/50 rounded-xl p-1 border border-border">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-bold transition-all ${activeTab === t.id ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Payment Methods Tab */}
      {activeTab === 'methods' && (
        <div className="space-y-6">
          {/* Saved Cards */}
          <div className="bg-card border border-border/50 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-heading text-lg font-semibold">Saved Cards</h3>
              <Button variant="outline" size="sm" className="gap-1.5 rounded-xl" onClick={() => setShowAddCard(true)}>
                <Plus className="w-4 h-4" /> Add Card
              </Button>
            </div>
            {cards.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <CreditCard className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="text-sm">No cards saved yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {cards.map(card => (
                  <CardItem key={card.id} card={card} onSetDefault={handleSetDefault} onDelete={handleDelete} />
                ))}
              </div>
            )}
          </div>

          {/* PayPal */}
          <div className="bg-card border border-border/50 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-heading text-lg font-semibold">PayPal</h3>
                <p className="text-sm text-muted-foreground mt-0.5">Pay securely with your PayPal account.</p>
              </div>
              {paypalConnected ? (
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-bold text-green-600">Connected</span>
                  <Button variant="ghost" size="sm" className="text-destructive" onClick={() => setPaypalConnected(false)}>Disconnect</Button>
                </div>
              ) : (
                <Button variant="outline" size="sm" className="rounded-xl" onClick={() => { setPaypalConnected(true); toast.success('PayPal connected'); }}>
                  Connect PayPal
                </Button>
              )}
            </div>
          </div>

          {/* Affirm */}
          <div className="bg-card border border-border/50 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-heading text-lg font-semibold flex items-center gap-2">
                  Affirm <Badge variant="outline" className="text-xs">Buy Now, Pay Later</Badge>
                </h3>
                <p className="text-sm text-muted-foreground mt-0.5">Pay over time with Affirm, subject to approval.</p>
              </div>
              <Button variant="outline" size="sm" className="rounded-xl" onClick={() => toast.info('Affirm eligibility check will run at checkout')}>
                Check Eligibility
              </Button>
            </div>
          </div>

          {/* Billing Address */}
          <div className="bg-card border border-border/50 rounded-2xl p-6 space-y-3">
            <h3 className="font-heading text-lg font-semibold">Billing Address</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {['Street Address', 'City', 'State', 'ZIP Code'].map(f => (
                <input key={f} placeholder={f} className="px-3 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-ring" />
              ))}
            </div>
            <Button variant="outline" size="sm" className="rounded-xl mt-1">Save Address</Button>
          </div>
        </div>
      )}

      {activeTab === 'subscriptions' && <SubscriptionPanel />}
      {activeTab === 'history' && <PaymentHistory />}

      {showAddCard && <AddCardModal onClose={() => setShowAddCard(false)} onAdd={handleAddCard} />}
    </div>
  );
}