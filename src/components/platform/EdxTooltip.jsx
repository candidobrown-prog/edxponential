/**
 * EdxTooltip — Premium intelligent hover-explanation system
 * Apple × OpenAI × Linear inspired. Black-and-white luxury.
 */
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';

// ─── Shared tooltip state (singleton pattern to avoid z-fighting) ─────────────
let _setGlobalTooltip = null;

export function useTooltipController() {
  const [tooltip, setTooltip] = useState(null);
  useEffect(() => { _setGlobalTooltip = setTooltip; return () => { _setGlobalTooltip = null; }; }, []);
  return tooltip;
}

// ─── TooltipPortal — renders floating card ───────────────────────────────────
function TooltipCard({ data, anchor }) {
  const cardRef = useRef(null);
  const [pos, setPos] = useState({ top: 0, left: 0, placement: 'right' });

  useEffect(() => {
    if (!anchor) return;
    const rect = anchor.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const cardW = 280;
    const cardH = 160;
    const gap = 12;

    let left = rect.right + gap;
    let top = rect.top + rect.height / 2 - cardH / 2;
    let placement = 'right';

    // If too close to right edge → place left
    if (left + cardW > vw - 16) {
      left = rect.left - cardW - gap;
      placement = 'left';
    }
    // If too close to left edge → place below
    if (left < 16) {
      left = Math.max(16, rect.left + rect.width / 2 - cardW / 2);
      top = rect.bottom + gap;
      placement = 'bottom';
    }
    // Clamp vertically
    top = Math.max(12, Math.min(top, vh - cardH - 12));

    setPos({ top, left, placement });
  }, [anchor]);

  const originMap = {
    right: { originX: 0, originY: 0.5 },
    left: { originX: 1, originY: 0.5 },
    bottom: { originX: 0.5, originY: 0 },
  };
  const { originX, originY } = originMap[pos.placement] || originMap.right;

  return createPortal(
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, scale: 0.93, y: pos.placement === 'bottom' ? -4 : 0, x: pos.placement === 'right' ? -6 : pos.placement === 'left' ? 6 : 0 }}
      animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
      exit={{ opacity: 0, scale: 0.94, transition: { duration: 0.12 } }}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: 'fixed',
        top: pos.top,
        left: pos.left,
        width: 280,
        zIndex: 99999,
        pointerEvents: 'none',
        transformOrigin: `${originX * 100}% ${originY * 100}%`,
        fontFamily: 'Arial, Helvetica, sans-serif',
      }}
    >
      {/* Glass card */}
      <div style={{
        background: 'rgba(10, 10, 12, 0.92)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 16,
        boxShadow: '0 24px 64px rgba(0,0,0,0.5), 0 4px 16px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.07)',
        padding: '14px 16px',
        overflow: 'hidden',
      }}>
        {/* Subtle top shimmer */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)' }} />

        {/* Header row */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 8 }}>
          {data.icon && (
            <div style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ fontSize: 13 }}>{data.icon}</span>
            </div>
          )}
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ color: 'rgba(255,255,255,0.95)', fontWeight: 900, fontSize: 12, margin: 0, letterSpacing: '-0.01em', lineHeight: 1.3 }}>{data.name}</p>
            {data.tag && (
              <span style={{ display: 'inline-block', marginTop: 3, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 99, padding: '1px 7px', fontSize: 9, fontWeight: 900, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                {data.tag}
              </span>
            )}
          </div>
        </div>

        {/* Description */}
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, lineHeight: 1.55, margin: '0 0 10px 0' }}>
          {data.description}
        </p>

        {/* Why it matters */}
        {data.why && (
          <p style={{ color: 'rgba(255,255,255,0.28)', fontSize: 10, lineHeight: 1.5, margin: '0 0 10px 0', fontStyle: 'italic' }}>
            {data.why}
          </p>
        )}

        {/* CTA */}
        {data.cta && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <Sparkles style={{ width: 10, height: 10, color: 'rgba(255,255,255,0.3)', flexShrink: 0 }} />
            <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: 10, fontWeight: 700 }}>{data.cta}</span>
            <ArrowRight style={{ width: 9, height: 9, color: 'rgba(255,255,255,0.3)' }} />
          </div>
        )}
      </div>
    </motion.div>,
    document.body
  );
}

// ─── Global tooltip renderer — mount once in AppLayout ───────────────────────
export function EdxTooltipRenderer() {
  const tooltip = useTooltipController();
  return (
    <AnimatePresence>
      {tooltip && <TooltipCard key={tooltip.data.name} data={tooltip.data} anchor={tooltip.anchor} />}
    </AnimatePresence>
  );
}

// ─── EdxTooltip wrapper — wrap any element ───────────────────────────────────
export default function EdxTooltip({ children, data, delay = 400 }) {
  const timerRef = useRef(null);
  const anchorRef = useRef(null);

  const show = useCallback((e) => {
    const el = anchorRef.current || e.currentTarget;
    timerRef.current = setTimeout(() => {
      _setGlobalTooltip?.({ data, anchor: el });
    }, delay);
  }, [data, delay]);

  const hide = useCallback(() => {
    clearTimeout(timerRef.current);
    _setGlobalTooltip?.(null);
  }, []);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  return (
    <span ref={anchorRef} onMouseEnter={show} onMouseLeave={hide} onFocus={show} onBlur={hide} style={{ display: 'contents' }}>
      {children}
    </span>
  );
}