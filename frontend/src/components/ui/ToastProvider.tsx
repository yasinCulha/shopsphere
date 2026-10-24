import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { Link } from "react-router-dom";
import { LuCheck, LuX } from "react-icons/lu";

type ToastKind = "success" | "error" | "info";

type ToastOptions = {
  title: string;
  message: string;
  kind?: ToastKind;
  duration?: number;
  action?: {
    label: string;
    to: string;
  };
};

type ToastItem = ToastOptions & {
  id: string;
  kind: ToastKind;
  duration: number;
};

type ToastContextValue = {
  showToast: (toast: ToastOptions) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

function ToastCard({
  toast,
  onDismiss,
}: {
  toast: ToastItem;
  onDismiss: (id: string) => void;
}) {
  useEffect(() => {
    const timer = window.setTimeout(() => onDismiss(toast.id), toast.duration);
    return () => window.clearTimeout(timer);
  }, [onDismiss, toast.duration, toast.id]);

  const accentColor =
    toast.kind === "error"
      ? "bg-red-700"
      : toast.kind === "info"
        ? "bg-[#A39480]"
        : "bg-emerald-700";

  return (
    <div
      role={toast.kind === "error" ? "alert" : "status"}
      className="overflow-hidden rounded-xl border border-[#E5DFD5] bg-[#F7F4EE] text-black shadow-xl"
    >
      <div className="flex gap-3 p-4">
        <span
          className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white ${accentColor}`}
          aria-hidden="true"
        >
          <LuCheck size={18} />
        </span>

        <div className="min-w-0 flex-1">
          <p className="font-semibold">{toast.title}</p>
          <p className="mt-1 text-sm text-stone-600">{toast.message}</p>
          {toast.action && (
            <Link
              to={toast.action.to}
              onClick={() => onDismiss(toast.id)}
              className="mt-3 inline-flex rounded-lg bg-black px-3 py-2 text-sm font-medium text-white transition hover:bg-stone-800"
            >
              {toast.action.label}
            </Link>
          )}
        </div>

        <button
          type="button"
          onClick={() => onDismiss(toast.id)}
          aria-label="Bildirimi kapat"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-stone-500 transition hover:bg-[#EFE9DF] hover:text-black"
        >
          <LuX size={18} />
        </button>
      </div>

      <div className="h-1 bg-[#EFE9DF]">
        <div
          className={`toast-progress h-full origin-left ${accentColor}`}
          style={{ animationDuration: `${toast.duration}ms` }}
          aria-hidden="true"
        />
      </div>
    </div>
  );
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismissToast = useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback((toast: ToastOptions) => {
    const newToast: ToastItem = {
      ...toast,
      id: `${Date.now()}-${Math.random()}`,
      kind: toast.kind ?? "success",
      duration: toast.duration ?? 4500,
    };

    setToasts((current) => [...current, newToast].slice(-4));
  }, []);

  const contextValue = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <div className="fixed right-4 top-4 z-[100] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-3">
        {toasts.map((toast) => (
          <ToastCard key={toast.id} toast={toast} onDismiss={dismissToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast, ToastProvider içinde kullanılmalı.");
  }

  return context;
}
