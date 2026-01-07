"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  ReactElement,
} from "react";
import { CheckCircle, XCircle, Info, X } from "lucide-react";

/* ---------------- TYPES ---------------- */

export type ToastType = "success" | "error" | "info";

type Toast = {
  id: number;
  message: string;
  type: ToastType;
};

type ToastContextType = {
  showToast: (message: string, type?: ToastType) => void;
};

/* --------------- CONTEXT --------------- */

const ToastContext = createContext<ToastContextType | undefined>(
  undefined
);

/* --------------- PROVIDER --------------- */

export function ToastProvider({
  children,
}: {
  children: ReactNode;
}): ReactElement {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: ToastType = "info") => {
    const id = Date.now();

    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const toastStyles = {
    success: {
      bg: "bg-emerald-500",
      icon: <CheckCircle className="h-5 w-5" />,
    },
    error: {
      bg: "bg-rose-500",
      icon: <XCircle className="h-5 w-5" />,
    },
    info: {
      bg: "bg-purple-600",
      icon: <Info className="h-5 w-5" />,
    },
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Toast UI */}
      <div className="fixed bottom-6 right-6 z-[100] space-y-3">
        {toasts.map((toast) => {
          const { bg, icon } = toastStyles[toast.type];
          
          return (
            <div
              key={toast.id}
              className={`flex items-center gap-3 rounded-xl ${bg} px-5 py-4 text-white shadow-2xl animate-in slide-in-from-right duration-300 min-w-[300px] max-w-md`}
            >
              <div className="flex-shrink-0">{icon}</div>
              <p className="flex-1 text-sm font-medium">{toast.message}</p>
              <button
                onClick={() => removeToast(toast.id)}
                className="flex-shrink-0 rounded-lg p-1 transition hover:bg-white/20"
                aria-label="Close toast"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

/* ----------------- HOOK ----------------- */

export function useToast(): ToastContextType {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error(
      "useToast must be used inside a ToastProvider"
    );
  }

  return context;
}