import { AlertCircle, CheckCircle, Info, AlertTriangle } from "lucide-react";

type AlertVariant = "success" | "error" | "warning" | "info";

type AlertProps = {
  title?: string;
  message: string | React.ReactNode;
  variant?: AlertVariant;
  className?: string;
};

export default function Alert({
  title,
  message,
  variant = "info",
  className = "",
}: AlertProps) {
  const variants: Record<AlertVariant, { style: string; icon: React.ReactNode }> = {
    success: {
      style: "bg-emerald-50 border-emerald-200 text-emerald-800",
      icon: <CheckCircle className="h-5 w-5 text-emerald-600" />,
    },
    error: {
      style: "bg-rose-50 border-rose-200 text-rose-800",
      icon: <AlertCircle className="h-5 w-5 text-rose-600" />,
    },
    warning: {
      style: "bg-amber-50 border-amber-200 text-amber-800",
      icon: <AlertTriangle className="h-5 w-5 text-amber-600" />,
    },
    info: {
      style: "bg-purple-50 border-purple-200 text-purple-800",
      icon: <Info className="h-5 w-5 text-purple-600" />,
    },
  };

  const { style, icon } = variants[variant];

  return (
    <div
      role="alert"
      className={`rounded-xl border-2 p-4 shadow-sm ${style} ${className}`}
    >
      <div className="flex gap-3">
        <div className="flex-shrink-0 mt-0.5">{icon}</div>
        <div className="flex-1">
          {title && (
            <p className="mb-1 font-semibold font-serif text-base">
              {title}
            </p>
          )}
          <div className="text-sm leading-relaxed">
            {message}
          </div>
        </div>
      </div>
    </div>
  );
}