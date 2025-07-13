import { useState } from "react";
import Loader from "./ui/Loader";

interface TextTransformPanelProps {
  onTransform: (text: string) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function TextTransformPanel({ onTransform, onCancel, isLoading = false }: TextTransformPanelProps) {
  const [text, setText] = useState("");

  const handleTransformClick = () => {
    if (!text.trim()) return;
    onTransform(text);
  };

  const handleCancelClick = () => {
    setText("");
    onCancel();
  };

  return (
    <div className="bg-gray-800 shadow-lg rounded-2xl p-8 w-full max-w-2xl mt-10 border border-gray-700">

      <textarea
        className="w-full h-40 p-4 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 text-gray-100 placeholder-gray-400"
        placeholder="Enter your text here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={isLoading}
      />

      <div className="mt-6 flex justify-end gap-4">
        <button
          onClick={handleTransformClick}
          disabled={isLoading}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center gap-2"
        >
          {isLoading && (
            <Loader />
          )}
          Transform
        </button>
        <button
          onClick={handleCancelClick}
          className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 disabled:opacity-50 transition-colors flex items-center gap-2"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
