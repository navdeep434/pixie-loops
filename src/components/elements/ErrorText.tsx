import { AlertCircle } from "lucide-react";

export default function ErrorText({ 
  message,
  showIcon = true,
}: { 
  message: string;
  showIcon?: boolean;
}) {
  return (
    <span className="flex items-center gap-1.5 text-xs text-rose-600 font-medium">
      {showIcon && <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />}
      {message}
    </span>
  );
}