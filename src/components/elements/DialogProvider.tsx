"use client";

import React, {
  createContext, useCallback, useContext, useEffect, useState,
} from "react";
import { AlertTriangle, CheckCircle, Info, Trash2, X } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type DialogVariant = "success" | "danger" | "warning" | "info";

interface DialogOptions {
  title: string;
  message: React.ReactNode;
  variant?: DialogVariant;
  confirmLabel?: string;
  cancelLabel?: string;
  /** false = acknowledge only (no Cancel button) */
  confirm?: boolean;
}

interface DialogState extends DialogOptions {
  id: number;
  resolve: (confirmed: boolean) => void;
}

export interface DialogContextValue {
  show:    (options: DialogOptions) => Promise<boolean>;
  confirm: (message: React.ReactNode, title?: string) => Promise<boolean>;
  danger:  (message: React.ReactNode, title?: string) => Promise<boolean>;
  warn:    (message: React.ReactNode, title?: string) => Promise<boolean>;
  success: (message: React.ReactNode, title?: string) => Promise<boolean>;
  info:    (message: React.ReactNode, title?: string) => Promise<boolean>;
}

// ─── Variant config ───────────────────────────────────────────────────────────

const VARIANT: Record<DialogVariant, {
  Icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  btnClass: string;
}> = {
  success: { Icon: CheckCircle,   iconBg: "bg-green-100",  iconColor: "text-green-600",  btnClass: "bg-green-600 hover:bg-green-700 text-white"  },
  danger:  { Icon: Trash2,        iconBg: "bg-red-100",    iconColor: "text-red-600",    btnClass: "bg-red-600 hover:bg-red-700 text-white"      },
  warning: { Icon: AlertTriangle, iconBg: "bg-yellow-100", iconColor: "text-yellow-600", btnClass: "bg-yellow-600 hover:bg-yellow-700 text-white" },
  info:    { Icon: Info,          iconBg: "bg-blue-100",   iconColor: "text-blue-600",   btnClass: "bg-blue-600 hover:bg-blue-700 text-white"    },
};

// ─── Single dialog modal ──────────────────────────────────────────────────────

function DialogModal({ dialog, onResolve }: {
  dialog: DialogState;
  onResolve: (v: boolean) => void;
}) {
  const cfg = VARIANT[dialog.variant ?? "info"];
  const hasCancel = dialog.confirm !== false;

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onResolve(false);
      if (e.key === "Enter")  onResolve(true);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onResolve]);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  return (
    <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => onResolve(false)}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="dlg-title"
        className="relative w-full sm:max-w-md bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl p-6"
      >
        {/* Close X */}
        <button
          onClick={() => onResolve(false)}
          aria-label="Close"
          className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Icon + Title */}
        <div className="flex items-center gap-4 mb-3">
          <div className={`h-11 w-11 rounded-full flex items-center justify-center flex-shrink-0 ${cfg.iconBg}`}>
            <cfg.Icon className={`h-5 w-5 ${cfg.iconColor}`} />
          </div>
          <h2 id="dlg-title" className="text-lg font-semibold text-gray-900">
            {dialog.title}
          </h2>
        </div>

        {/* Message */}
        <div className="text-sm text-gray-600 leading-relaxed ml-[3.75rem]">
          {dialog.message}
        </div>

        {/* Actions */}
        <div className="mt-6 flex justify-end gap-3">
          {hasCancel && (
            <button
              onClick={() => onResolve(false)}
              className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
            >
              {dialog.cancelLabel ?? "Cancel"}
            </button>
          )}
          <button
            onClick={() => onResolve(true)}
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${cfg.btnClass}`}
          >
            {dialog.confirmLabel ?? (hasCancel ? "Confirm" : "OK")}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Context ──────────────────────────────────────────────────────────────────

const DialogContext = createContext<DialogContextValue | null>(null);

let _id = 0;

export function DialogProvider({ children }: { children: React.ReactNode }) {
  const [dialogs, setDialogs] = useState<DialogState[]>([]);

  const show = useCallback((options: DialogOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      const id = ++_id;
      setDialogs((prev) => [...prev, { ...options, id, resolve }]);
    });
  }, []);

  const resolve = useCallback((id: number, confirmed: boolean) => {
    setDialogs((prev) => {
      const d = prev.find((x) => x.id === id);
      d?.resolve(confirmed);
      return prev.filter((x) => x.id !== id);
    });
  }, []);

  const value: DialogContextValue = {
    show,
    confirm: (message, title = "Are you sure?") =>
      show({ title, message, variant: "danger",  confirm: true  }),
    danger:  (message, title = "Are you sure?") =>
      show({ title, message, variant: "danger",  confirm: true  }),
    warn:    (message, title = "Warning") =>
      show({ title, message, variant: "warning", confirm: true  }),
    success: (message, title = "Success") =>
      show({ title, message, variant: "success", confirm: false }),
    info:    (message, title = "Info") =>
      show({ title, message, variant: "info",    confirm: false }),
  };

  return (
    <DialogContext.Provider value={value}>
      {children}
      {dialogs.map((d) => (
        <DialogModal key={d.id} dialog={d} onResolve={(v) => resolve(d.id, v)} />
      ))}
    </DialogContext.Provider>
  );
}

export function useDialog(): DialogContextValue {
  const ctx = useContext(DialogContext);
  if (!ctx) throw new Error("useDialog must be used inside <DialogProvider>");
  return ctx;
}