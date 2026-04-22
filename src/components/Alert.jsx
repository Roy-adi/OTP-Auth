import { AlertCircleIcon, CheckCircle2Icon, InfoIcon } from "lucide-react";

export default function Alert({ type = 'error', message }) {
  if (!message) return null


const styles = {
  error: 'bg-red-50 border-red-200 text-red-700',
  success: 'bg-green-50 border-green-200 text-green-700',
  info: 'bg-brand-50 border-brand-200 text-brand-700',
}

const icons = {
  error: <AlertCircleIcon className="w-4 h-4 shrink-0 mt-0.5" />,
  success: <CheckCircle2Icon className="w-4 h-4 shrink-0 mt-0.5" />,
  info: <InfoIcon className="w-4 h-4 shrink-0 mt-0.5" />,
}

  return (
    <div className={`flex items-start gap-2 text-sm border rounded-lg px-3 py-2.5 animate-fade-in ${styles[type]}`}>
      {icons[type]}
      <span>{message}</span>
    </div>
  )
}
