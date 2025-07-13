import { useState } from "react";



export default function TextTransformPanel() {
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleTransformClick = () => {
    if (!text.trim()) return;

    setIsLoading(true);
  };

  const handleCancelClick = () => {
    setIsLoading(false);
  };

  return (
    <div className="bg-white shadow-md rounded-2xl p-8 w-full max-w-2xl mt-10">

      <textarea
        className="w-full h-40 p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Enter your text here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={isLoading}
      />

      <div className="mt-6 flex justify-end gap-4">
        <button
          onClick={handleTransformClick}
          disabled={isLoading}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          Transform
        </button>
        <button
          onClick={handleCancelClick}
          disabled={!isLoading}
          className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 disabled:opacity-50"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
