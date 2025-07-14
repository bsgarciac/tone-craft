import { Copy } from "lucide-react";

interface CopyButtonProps {
  onClick: () => void;
}

export function CopyButton({ onClick }: CopyButtonProps) {
  return (
    <button
      onClick={onClick}
      className="rounded-full p-2 bg-blue-600 hover:bg-blue-500 text-white shadow-sm transition-all cursor-pointer absolute right-2 top-2 z-10"
      title="Copy to clipboard"
    >
      <Copy className="w-4 h-4" />
    </button>
  );
}