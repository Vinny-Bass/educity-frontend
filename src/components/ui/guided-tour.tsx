"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

export type GuidedTourStep = {
  key: string;
  targetSelector: string;
  title: string;
  text: string;
};

type Rect = { top: number; left: number; width: number; height: number };

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function getRect(el: Element): Rect {
  const r = el.getBoundingClientRect();
  return { top: r.top, left: r.left, width: r.width, height: r.height };
}

function computeTooltipPosition(rect: Rect, tooltipSize: { width: number; height: number }) {
  const viewportW = window.innerWidth;
  const viewportH = window.innerHeight;
  const pad = 12;

  // Prefer placing the tooltip to the right of the target; if not possible, place to the left.
  // Fallback to below/above if neither side fits.
  const sideGap = 12;

  const rightLeft = rect.left + rect.width + sideGap;
  const leftLeft = rect.left - tooltipSize.width - sideGap;
  const sideTop = clamp(rect.top, pad, viewportH - tooltipSize.height - pad);

  const fitsRight = rightLeft + tooltipSize.width <= viewportW - pad;
  if (fitsRight) return { top: sideTop, left: rightLeft };

  const fitsLeft = leftLeft >= pad;
  if (fitsLeft) return { top: sideTop, left: leftLeft };

  // Prefer below; if not enough room, place above; otherwise clamp within viewport.
  const belowTop = rect.top + rect.height + 12;
  const aboveTop = rect.top - tooltipSize.height - 12;
  const top =
    belowTop + tooltipSize.height <= viewportH - pad
      ? belowTop
      : aboveTop >= pad
        ? aboveTop
        : clamp(viewportH - tooltipSize.height - pad, pad, viewportH - tooltipSize.height - pad);

  const left = clamp(rect.left, pad, viewportW - tooltipSize.width - pad);
  return { top, left };
}

export function GuidedTour({
  isOpen,
  steps,
  currentStepIndex,
  onStepChange,
  onClose,
}: {
  isOpen: boolean;
  steps: GuidedTourStep[];
  currentStepIndex: number;
  onStepChange: (nextIndex: number) => void;
  onClose: () => void;
}) {
  const [mounted, setMounted] = useState(false);
  const [targetRect, setTargetRect] = useState<Rect | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ top: number; left: number } | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);

  const step = useMemo(() => steps[currentStepIndex], [steps, currentStepIndex]);

  useEffect(() => setMounted(true), []);

  // Keep the rect/position in sync with scroll/resize and when step changes.
  useEffect(() => {
    if (!isOpen || !mounted) return;

    let raf = 0;
    const update = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = step?.targetSelector ? document.querySelector(step.targetSelector) : null;
        if (!step || !el) {
          setTargetRect(null);
          setTooltipPos(null);
          return;
        }

        const rect = getRect(el);
        setTargetRect(rect);

        // Ensure the tooltip has a measured size before positioning.
        const tooltipEl = tooltipRef.current;
        if (tooltipEl) {
          const tooltipSize = {
            width: tooltipEl.offsetWidth,
            height: tooltipEl.offsetHeight,
          };
          setTooltipPos(computeTooltipPosition(rect, tooltipSize));
        }
      });
    };

    update();

    window.addEventListener("resize", update, { passive: true });
    window.addEventListener("scroll", update, true);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
    };
  }, [isOpen, mounted, step]);

  // If the step target doesn't exist (e.g., responsive layout), auto-skip forward.
  useEffect(() => {
    if (!isOpen || !mounted) return;
    if (!step) return;

    const el = document.querySelector(step.targetSelector);
    if (el) return;

    // Skip to the next step that exists; if none exist, close.
    for (let i = currentStepIndex + 1; i < steps.length; i++) {
      if (document.querySelector(steps[i].targetSelector)) {
        onStepChange(i);
        return;
      }
    }
    onClose();
  }, [isOpen, mounted, step, steps, currentStepIndex, onStepChange, onClose]);

  // Recompute tooltip position once it mounts/measures.
  useEffect(() => {
    if (!isOpen || !mounted || !targetRect) return;
    const tooltipEl = tooltipRef.current;
    if (!tooltipEl) return;
    const tooltipSize = { width: tooltipEl.offsetWidth, height: tooltipEl.offsetHeight };
    setTooltipPos(computeTooltipPosition(targetRect, tooltipSize));
  }, [isOpen, mounted, targetRect]);

  if (!isOpen || !mounted || !step) return null;

  const isLast = currentStepIndex >= steps.length - 1;

  return createPortal(
    <div className="fixed inset-0 z-[1000]" role="dialog" aria-modal="true">
      {/* Click-catcher */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Highlight (darken outside using huge box-shadow) */}
      {targetRect && (
        <div
          className="absolute rounded-[12px] pointer-events-none"
          style={{
            top: Math.max(0, targetRect.top - 6),
            left: Math.max(0, targetRect.left - 6),
            width: Math.max(0, targetRect.width + 12),
            height: Math.max(0, targetRect.height + 12),
            boxShadow: "0 0 0 9999px rgba(14, 4, 32, 0.60)",
            border: "2px solid rgba(255,255,255,0.9)",
          }}
        />
      )}

      {/* Tooltip */}
      <div
        ref={tooltipRef}
        className="absolute w-[min(92vw,420px)] rounded-[14px] bg-white shadow-[0_10px_30px_rgba(14,4,32,0.22)] p-4"
        style={{
          top: tooltipPos?.top ?? 24,
          left: tooltipPos?.left ?? 24,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div
              className="text-[14px] font-extrabold text-[#0E0420]"
              style={{ fontFamily: "ABC Diatype Unlicensed Trial, sans-serif" }}
            >
              {step.title}
            </div>
          </div>
          <button
            type="button"
            className="text-[12px] font-bold text-[#87838F] hover:text-[#0E0420] transition-colors"
            style={{ fontFamily: "ABC Diatype Unlicensed Trial, sans-serif" }}
            onClick={onClose}
            aria-label="Close tour"
          >
            Skip
          </button>
        </div>

        <div
          className="mt-2 text-[13px] font-normal text-[#2F2A3B] leading-5"
          style={{ fontFamily: "ABC Diatype Unlicensed Trial, sans-serif" }}
        >
          {step.text}
        </div>

        <div className="mt-4 flex items-center justify-between gap-3">
          <div
            className="text-[12px] font-bold text-[#87838F]"
            style={{ fontFamily: "ABC Diatype Unlicensed Trial, sans-serif" }}
          >
            {currentStepIndex + 1}/{steps.length}
          </div>

          <button
            type="button"
            className="h-9 px-4 rounded-[10px] bg-[#9056F5] text-white text-[13px] font-extrabold hover:opacity-95 transition-opacity"
            style={{ fontFamily: "ABC Diatype Unlicensed Trial, sans-serif" }}
            onClick={() => (isLast ? onClose() : onStepChange(currentStepIndex + 1))}
          >
            {isLast ? "Done" : "Next"}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}


