import { useEffect, useState } from 'react';
import './App.css'
import TextTransformPanel from './components/TextTransformer'
import ToneCard from './components/ToneCard';

function App() {

  const [eventSource, setEventSource] = useState<EventSource | null>(null);
  const [output, setOutput] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleTransformClick = (text: string) => {
    setIsLoading(true);
    setOutput('');

    const source = new EventSource(`http://localhost:8000/process?text=${encodeURIComponent(text)}`);
    setEventSource(source);

    source.onmessage = (event) => {
      console.log(event.data)
      if (event.data === "[DONE]") {
        source.close();
        setEventSource(null);
        setIsLoading(false);
        return;
      }

      setOutput((prev) => prev + event.data);
    };

    source.onerror = () => {
      source.close();
      setEventSource(null);
      setIsLoading(false);
      console.error("Error in streaming");
    };
  };

  const handleCancelClick = () => {
    if (eventSource) {
      eventSource.close();
      setEventSource(null);
    }

    setOutput('');
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
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold text-blue-400">🎨 ToneCraft</h1>
      <p className="mt-4 text-lg text-gray-300">
        Transform your text into multiple tones at once.
      </p>

      <TextTransformPanel 
          onTransform={handleTransformClick} 
          onCancel={handleCancelClick}
          isLoading={isLoading}
        />
      
      { output && (
        <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground">Transformed Text Styles</h2>
          <p className="text-muted-foreground mt-2">Choose the style that best fits your needs</p>
        </div>
        <ToneCard imageUrl={output} title={output} description={output} /> 
        </div>
      )}
    </div>
  );
}

export default App
