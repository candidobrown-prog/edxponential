import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ShieldCheck, FileText, Lock, AlertCircle } from 'lucide-react';

const NDA_TEXT = `By proceeding, you acknowledge and agree to the following:

1. CONFIDENTIALITY — All information shared through the edXponential platform, including pitch materials, financial data, and personal introductions, is strictly confidential.

2. NON-DISCLOSURE — You agree not to disclose, reproduce, or distribute any materials received through this platform without the express written consent of the relevant founder.

3. NO SOLICITATION — You will not directly solicit the founder's team, investors, or partners identified through this platform.

4. OFF-PLATFORM INVESTMENT — All investment transactions are handled off-platform. edXponential is not a registered broker-dealer, investment advisor, or securities dealer. Nothing on this platform constitutes an offer to buy or sell securities.

5. INDEMNIFICATION — You agree to hold edXponential harmless from any disputes arising from your interactions with founders or other platform members.

This is an electronic acknowledgment. By clicking "I Agree & Continue," you confirm you have read and accept these terms.`;

export default function NDAModal({ open, onClose, onAccept, dealTitle }) {
  const [checked, setChecked] = useState(false);

  const handleAccept = () => {
    if (!checked) return;
    onAccept();
    setChecked(false);
  };

  const handleClose = () => {
    setChecked(false);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <Lock className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Confidential</span>
          </div>
          <DialogTitle className="font-heading text-xl">Confidentiality Agreement</DialogTitle>
          {dealTitle && <p className="text-sm text-muted-foreground">{dealTitle}</p>}
        </DialogHeader>

        {/* Trust signals */}
        <div className="flex flex-wrap gap-2 my-2">
          <span className="inline-flex items-center gap-1.5 text-[9px] uppercase tracking-widest font-medium rounded-full px-2.5 py-1 border bg-emerald-50 text-emerald-700 border-emerald-200">
            <ShieldCheck className="w-3 h-3" /> Reviewed by edXponential
          </span>
          <span className="inline-flex items-center gap-1.5 text-[9px] uppercase tracking-widest font-medium rounded-full px-2.5 py-1 border bg-muted text-muted-foreground">
            <FileText className="w-3 h-3" /> Non-Binding Agreement
          </span>
        </div>

        {/* NDA scroll box */}
        <div className="bg-muted rounded-xl p-4 max-h-52 overflow-y-auto text-xs text-muted-foreground leading-relaxed whitespace-pre-wrap font-mono border border-border/40">
          {NDA_TEXT}
        </div>

        {/* Off-platform notice */}
        <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-xs text-amber-800">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <p><strong>Investment handled off-platform.</strong> edXponential facilitates introductions only. Any investment decisions, agreements, and transactions occur independently between you and the founder.</p>
        </div>

        {/* Checkbox */}
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={checked}
            onChange={e => setChecked(e.target.checked)}
            className="mt-0.5 accent-foreground w-4 h-4"
          />
          <span className="text-xs text-muted-foreground leading-relaxed">
            I have read and agree to the Confidentiality Agreement. I understand that all investments are handled off-platform and edXponential is not a registered broker-dealer.
          </span>
        </label>

        <div className="flex gap-3 pt-1">
          <Button variant="outline" className="flex-1 rounded-xl" onClick={handleClose}>Cancel</Button>
          <Button
            className="flex-1 rounded-xl bg-foreground text-background hover:bg-foreground/85"
            disabled={!checked}
            onClick={handleAccept}
          >
            I Agree & Continue
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}