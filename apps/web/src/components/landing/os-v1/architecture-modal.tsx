"use client";

import { useEffect } from "react";
import { ARCHITECTURE_LAYERS, type ArchitectureLayerId } from "./content";

interface ArchitectureModalProps {
  layerId: ArchitectureLayerId | null;
  onClose: () => void;
}

export function ArchitectureModal({ layerId, onClose }: ArchitectureModalProps) {
  const layer = layerId ? ARCHITECTURE_LAYERS.find((l) => l.id === layerId) : null;

  useEffect(() => {
    if (!layerId) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [layerId, onClose]);

  if (!layer) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="arch-modal-title"
      onClick={onClose}
    >
      <div
        className="landing-card max-h-[85vh] w-full max-w-lg overflow-y-auto p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="landing-eyebrow mb-3">{layer.subtitle}</p>
        <h2 id="arch-modal-title" className="text-xl font-medium text-white">
          {layer.title}
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-white/60">{layer.body}</p>
        {layer.points && (
          <ul className="mt-5 space-y-2">
            {layer.points.map((p) => (
              <li key={p} className="flex items-start gap-2 text-sm text-white/55">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                {p}
              </li>
            ))}
          </ul>
        )}
        <button
          type="button"
          onClick={onClose}
          className="landing-btn-primary mt-8 w-full sm:w-auto"
        >
          Close
        </button>
      </div>
    </div>
  );
}
