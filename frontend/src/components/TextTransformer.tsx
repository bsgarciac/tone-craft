import { useState, useEffect } from "react";



export default function TextTransformPanel() {
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [eventSource, setEventSource] = useState<EventSource | null>(null);
  const [output, setOutput] = useState<string>('');

  const handleTransformClick = () => {
    if (!text.trim()) return;

    setIsLoading(true);
    setOutput('');

    const source = new EventSource(`http://localhost:8000/process?text=${encodeURIComponent(text)}`);
    setEventSource(source);


    source.onmessage = (event) => {
      console.log(event.data)
      if (event.data === "[DONE]") {
        source.close();
        setEventSource(null);
        return;
      }

      setOutput((prev) => prev + event.data);
    };

    source.onerror = () => {
      source.close();
      setEventSource(null);
      console.error("Error in streaming");
    };

  };

  const handleCancelClick = () => {
    if (eventSource) {
      eventSource.close();
      setEventSource(null);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    return () => {
      if (eventSource) {
        eventSource.close();
      }
    };
  }, [eventSource]);

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
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          Transform
        </button>
        <button
          onClick={handleCancelClick}
          disabled={!isLoading}
          className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 disabled:opacity-50 transition-colors"
        >
          Cancel
        </button>
      </div>

      <div className="mt-6">
        <pre className="text-gray-300 whitespace-pre-wrap">{output}</pre>
      </div>
    </div>
  );
}
