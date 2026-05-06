import React, { useState, useRef } from 'react';
import { Shield, Upload, Camera, CheckCircle, AlertCircle, Clock, RefreshCw, Lock, ChevronRight, X, Eye, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { base44 } from '@/api/base44Client';

const STATUS_CONFIG = {
  not_started: { label: 'Not Started', color: 'text-muted-foreground', bg: 'bg-muted', icon: Clock },
  in_progress: { label: 'In Progress', color: 'text-blue-600', bg: 'bg-blue-50', icon: RefreshCw },
  submitted: { label: 'Submitted', color: 'text-blue-700', bg: 'bg-blue-50', icon: Clock },
  under_review: { label: 'Under Review', color: 'text-yellow-600', bg: 'bg-yellow-50', icon: Eye },
  verified: { label: 'Verified', color: 'text-green-600', bg: 'bg-green-50', icon: CheckCircle },
  failed: { label: 'Failed', color: 'text-red-600', bg: 'bg-red-50', icon: AlertCircle },
  needs_resubmission: { label: 'Needs Resubmission', color: 'text-orange-600', bg: 'bg-orange-50', icon: AlertCircle },
};

const STEPS = [
  { id: 'email', label: 'Email Verification', description: 'Verify your email address', icon: Mail },
  { id: 'phone', label: 'Phone Verification', description: 'Verify your phone number', icon: Phone },
  { id: 'id_doc', label: 'Government ID', description: 'Upload a valid government-issued photo ID', icon: Upload },
  { id: 'selfie', label: 'Face Verification', description: 'Take a live selfie to match your ID', icon: Camera },
];

function StepCard({ step, status, onStart, isActive, isComplete }) {
  const Icon = step.icon;
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.not_started;
  const StatusIcon = cfg.icon;

  return (
    <div className={`bg-card border-2 rounded-2xl p-5 transition-all ${isActive ? 'border-primary shadow-sm' : 'border-border'}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isComplete ? 'bg-green-100' : 'bg-muted'}`}>
            <Icon className={`w-5 h-5 ${isComplete ? 'text-green-600' : 'text-muted-foreground'}`} />
          </div>
          <div>
            <p className="font-semibold text-sm">{step.label}</p>
            <p className="text-xs text-muted-foreground">{step.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-xs font-bold flex items-center gap-1 ${cfg.color}`}>
            <StatusIcon className="w-3.5 h-3.5" /> {cfg.label}
          </span>
          {!isComplete && (
            <Button size="sm" variant={isActive ? 'default' : 'outline'} className="rounded-xl" onClick={onStart}>
              {status === 'not_started' ? 'Start' : 'Continue'} <ChevronRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function IDUploadPanel({ onComplete }) {
  const [frontUploaded, setFrontUploaded] = useState(false);
  const [backUploaded, setBackUploaded] = useState(false);
  const [docType, setDocType] = useState('drivers_license');

  const DOC_TYPES = [
    { id: 'drivers_license', label: "Driver's License" },
    { id: 'state_id', label: 'State ID' },
    { id: 'passport', label: 'Passport' },
    { id: 'national_id', label: 'National ID' },
  ];

  const needsBack = docType !== 'passport';

  const canSubmit = frontUploaded && (!needsBack || backUploaded);

  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Document Type</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {DOC_TYPES.map(d => (
            <button key={d.id} onClick={() => setDocType(d.id)}
              className={`px-3 py-2 rounded-xl border-2 text-xs font-bold transition-all ${docType === d.id ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/40'}`}>
              {d.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div onClick={() => setFrontUploaded(true)}
          className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${frontUploaded ? 'border-green-400 bg-green-50' : 'border-border hover:border-primary/40'}`}>
          {frontUploaded
            ? <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
            : <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2 opacity-40" />}
          <p className="text-sm font-bold">{frontUploaded ? 'Front Uploaded' : 'Front of ID'}</p>
          <p className="text-xs text-muted-foreground mt-1">Click to upload or drag & drop</p>
        </div>
        {needsBack && (
          <div onClick={() => setBackUploaded(true)}
            className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${backUploaded ? 'border-green-400 bg-green-50' : 'border-border hover:border-primary/40'}`}>
            {backUploaded
              ? <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
              : <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2 opacity-40" />}
            <p className="text-sm font-bold">{backUploaded ? 'Back Uploaded' : 'Back of ID'}</p>
            <p className="text-xs text-muted-foreground mt-1">Click to upload or drag & drop</p>
          </div>
        )}
      </div>

      <div className="bg-muted/50 rounded-xl p-3 text-xs text-muted-foreground space-y-1">
        <p className="font-semibold text-foreground">Requirements:</p>
        <p>• Photo must be clear and unobstructed</p>
        <p>• Document must not be expired</p>
        <p>• Name on ID must match your account name</p>
        <p>• Encrypted upload — your ID is never publicly displayed</p>
      </div>

      <Button disabled={!canSubmit} className="w-full rounded-xl" onClick={onComplete}>
        Submit ID Documents
      </Button>
    </div>
  );
}

function SelfiePanel({ onComplete }) {
  const [captured, setCaptured] = useState(false);

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Please take a clear photo of your face. This helps us confirm that your account belongs to you.
      </p>
      <div className="bg-muted/50 rounded-2xl aspect-video flex items-center justify-center border-2 border-dashed border-border">
        {captured ? (
          <div className="text-center">
            <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-2" />
            <p className="text-sm font-bold">Selfie captured</p>
          </div>
        ) : (
          <div className="text-center">
            <Camera className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-40" />
            <p className="text-sm font-bold mb-1">Camera preview</p>
            <p className="text-xs text-muted-foreground">Center your face in the frame and click capture</p>
          </div>
        )}
      </div>
      <div className="bg-muted/50 rounded-xl p-3 text-xs text-muted-foreground space-y-1">
        <p>• Look directly at the camera</p>
        <p>• Ensure good lighting on your face</p>
        <p>• Remove glasses or hats if possible</p>
        <p>• Liveness detection will confirm you're present</p>
      </div>
      <div className="flex gap-3">
        {!captured
          ? <Button className="flex-1 rounded-xl" onClick={() => setCaptured(true)}>
              <Camera className="w-4 h-4 mr-2" /> Capture Selfie
            </Button>
          : <>
              <Button variant="outline" className="rounded-xl" onClick={() => setCaptured(false)}>
                <RefreshCw className="w-4 h-4 mr-2" /> Retake
              </Button>
              <Button className="flex-1 rounded-xl" onClick={onComplete}>
                Submit Selfie
              </Button>
            </>
        }
      </div>
    </div>
  );
}

function PhonePanel({ onComplete }) {
  const [phone, setPhone] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [code, setCode] = useState('');

  return (
    <div className="space-y-4">
      {!codeSent ? (
        <>
          <input placeholder="+1 (555) 000-0000" value={phone} onChange={e => setPhone(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-ring" />
          <Button className="w-full rounded-xl" disabled={!phone} onClick={() => setCodeSent(true)}>
            Send Verification Code
          </Button>
        </>
      ) : (
        <>
          <p className="text-sm text-muted-foreground">Enter the 6-digit code sent to {phone}</p>
          <input placeholder="000000" maxLength={6} value={code} onChange={e => setCode(e.target.value.replace(/\D/g,''))}
            className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-ring text-center text-xl tracking-widest font-bold" />
          <Button className="w-full rounded-xl" disabled={code.length !== 6} onClick={onComplete}>
            Verify Phone
          </Button>
        </>
      )}
    </div>
  );
}

function EmailPanel({ onComplete }) {
  const [sent, setSent] = useState(false);
  return (
    <div className="space-y-4 text-center">
      {!sent ? (
        <>
          <p className="text-sm text-muted-foreground">We'll send a verification link to your registered email address.</p>
          <Button className="w-full rounded-xl" onClick={() => { setSent(true); toast.success('Verification email sent!'); }}>
            Send Verification Email
          </Button>
        </>
      ) : (
        <>
          <CheckCircle className="w-12 h-12 text-green-600 mx-auto" />
          <p className="text-sm font-bold">Email sent! Check your inbox.</p>
          <Button variant="outline" className="rounded-xl" onClick={onComplete}>I've Verified My Email</Button>
        </>
      )}
    </div>
  );
}

export default function IdentityVerification() {
  const [activeStep, setActiveStep] = useState(null);
  const [statuses, setStatuses] = useState({
    email: 'not_started',
    phone: 'not_started',
    id_doc: 'not_started',
    selfie: 'not_started',
  });

  const allVerified = Object.values(statuses).every(s => s === 'verified');

  const handleComplete = (stepId) => {
    setStatuses(prev => ({ ...prev, [stepId]: stepId === 'id_doc' ? 'under_review' : 'verified' }));
    setActiveStep(null);
    if (stepId === 'id_doc') {
      toast.success('ID submitted for review. You\'ll be notified once approved.');
    } else {
      toast.success(`${STEPS.find(s => s.id === stepId)?.label} completed!`);
    }
  };

  const overallStatus = allVerified ? 'verified'
    : Object.values(statuses).some(s => s !== 'not_started') ? 'in_progress'
    : 'not_started';

  const cfg = STATUS_CONFIG[overallStatus];
  const StatusIcon = cfg.icon;

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="font-heading text-3xl font-bold">Identity Verification</h1>
        <p className="text-muted-foreground mt-1">Secure verification to unlock full platform trust and access.</p>
      </div>

      {/* Overall Status */}
      <div className={`flex items-center gap-3 p-4 rounded-2xl border border-border ${cfg.bg}`}>
        <StatusIcon className={`w-6 h-6 ${cfg.color} flex-shrink-0`} />
        <div>
          <p className={`font-bold text-sm ${cfg.color}`}>Verification Status: {cfg.label}</p>
          {allVerified
            ? <p className="text-xs text-green-700 mt-0.5">Identity verified. Your account is now more trusted across the edXponential community.</p>
            : <p className="text-xs text-muted-foreground mt-0.5">Complete all steps below to receive your Verified badge.</p>}
        </div>
        {allVerified && <Badge className="ml-auto bg-green-600 text-white">Verified Member</Badge>}
      </div>

      {/* Security Note */}
      <div className="flex items-start gap-2 p-3 bg-muted/50 rounded-xl border border-border text-xs text-muted-foreground">
        <Lock className="w-4 h-4 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-foreground mb-1">Security & Privacy</p>
          <p>All ID documents are encrypted at rest. They are never displayed publicly. Only authorized admins may access uploaded documents for verification purposes. Sensitive data is handled in accordance with FERPA-aligned privacy standards.</p>
        </div>
      </div>

      {/* Steps */}
      <div className="space-y-3">
        {STEPS.map(step => (
          <div key={step.id}>
            <StepCard
              step={step}
              status={statuses[step.id]}
              isActive={activeStep === step.id}
              isComplete={statuses[step.id] === 'verified' || statuses[step.id] === 'under_review'}
              onStart={() => setActiveStep(activeStep === step.id ? null : step.id)}
            />
            {activeStep === step.id && (
              <div className="mt-2 p-5 bg-card border border-border rounded-2xl">
                {step.id === 'email' && <EmailPanel onComplete={() => handleComplete('email')} />}
                {step.id === 'phone' && <PhonePanel onComplete={() => handleComplete('phone')} />}
                {step.id === 'id_doc' && <IDUploadPanel onComplete={() => handleComplete('id_doc')} />}
                {step.id === 'selfie' && <SelfiePanel onComplete={() => handleComplete('selfie')} />}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Accepted Documents */}
      <div className="bg-card border border-border/50 rounded-2xl p-5">
        <p className="text-xs font-black uppercase tracking-wider text-muted-foreground mb-3">Accepted Documents</p>
        <div className="grid grid-cols-2 gap-2">
          {["Driver's License", "State ID", "Passport", "National ID"].map(d => (
            <div key={d} className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle className="w-3.5 h-3.5 text-green-600" /> {d}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}