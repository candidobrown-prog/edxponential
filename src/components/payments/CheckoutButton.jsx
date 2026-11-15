/**
 * CheckoutButton — Universal payment trigger for any product across edXponential
 * Usage: <CheckoutButton productType="coaching_session" amount={150} productName="1-on-1 Coaching" brand="coaching" />
 */
import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Lock, CreditCard, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function CheckoutButton({
  productType,
  priceId,
  amount,
  productName,
  brand = 'edxponential_core',
  description,
  metadata = {},
  children,
  className = '',
  variant = 'default',
  size = 'default',
  showSecureBadge = true,
}) {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    // Block checkout inside iframe (Base44 preview)
    if (window.self !== window.top) {
      alert('Checkout is only available from the published app. Please open the app in a new tab.');
      return;
    }

    setLoading(true);
    try {
      const isAuthenticated = await base44.auth.isAuthenticated();
      if (!isAuthenticated) {
        base44.auth.redirectToLogin(window.location.pathname);
        return;
      }

      const response = await base44.functions.invoke('createCheckout', {
        product_type: productType,
        price_id: priceId,
        amount,
        product_name: productName,
        brand,
        description,
        metadata,
      });

      if (response.data?.url) {
        window.location.href = response.data.url;
      } else {
        throw new Error(response.data?.error || 'Failed to create checkout session');
      }
    } catch (error) {
      toast.error('Payment unavailable: ' + (error.message || 'Please try again'));
      console.error('CheckoutButton error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <Button
        onClick={handleCheckout}
        disabled={loading}
        variant={variant}
        size={size}
        className={`gap-2 ${className}`}
      >
        {loading ? (
          <><Loader2 className="w-4 h-4 animate-spin" /> Processing…</>
        ) : (
          <>{children || <><CreditCard className="w-4 h-4" /> Pay Now</>}</>
        )}
      </Button>
      {showSecureBadge && (
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Lock className="w-3 h-3" />
          <span className="text-[10px] font-semibold">Secure checkout · PCI Compliant · Encrypted</span>
        </div>
      )}
    </div>
  );
}