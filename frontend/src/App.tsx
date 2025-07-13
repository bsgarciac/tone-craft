import { useEffect, useState } from 'react';
import './App.css'
import TextTransformPanel from './components/TextTransformer'
import ToneCard from './components/ToneCard';
import professionalIcon from './assets/professional.svg';
import casualIcon from './assets/casual.svg';
import politeIcon from './assets/polite.svg';
import socialMediaIcon from './assets/social_media.svg';

type Style = 'professional' | 'casual' | 'polite' | 'social_media';
type Outputs = Record<Style, string>;
const backendUrl = import.meta.env.VITE_BACKEND_URL;

const styleMeta = [
  {
    key: "professional",
    title: "Professional",
    image: professionalIcon,
  },
  {
    key: "casual",
    title: "Casual",
    image: casualIcon,
  },
  {
    key: "polite",
    title: "Polite",
    image: politeIcon,
  },
  {
    key: "social_media",
    title: "Social Media",
    image: socialMediaIcon,
  },
];

function App() {

  const [eventSource, setEventSource] = useState<EventSource | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isTransformed, setIsTransformed] = useState(false);

  const [outputs, setOutputs] = useState<Outputs>({
    professional: "",
    casual: "",
    polite: "",
    social_media: "",
  });
  
  const handleTransformClick = (text: string) => {
    setIsLoading(true);
    setOutputs({
      professional: "",
      casual: "",
      polite: "",
      social_media: "",
    });

    const source = new EventSource(`${backendUrl}/process?text=${encodeURIComponent(text)}`);
    setEventSource(source);


    source.onmessage = (event) => {
      console.log(event.data)
      if (event.data === "[DONE]") {
        source.close();
        setEventSource(null);
        setIsLoading(false);
        return;
      }

      if (!isTransformed) {
        setIsTransformed(true);
      }

      const [style, word] = event.data.split('|');

      setOutputs((prev) => ({
        ...prev,
        [style as keyof Outputs]: prev[style as keyof Outputs] + word
      }));
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

    setOutputs({
      professional: "",
      casual: "",
      polite: "",
      social_media: "",
    });
    setIsTransformed(false);
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
    <div className='min-h-screen bg-gray-900'>
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-4xl font-bold text-blue-400">🎨 ToneCraft</h1>
        <p className="mt-4 text-lg text-gray-300">
          Transform your text into multiple tones at once.
        </p>

        <TextTransformPanel 
            onTransform={handleTransformClick} 
            onCancel={handleCancelClick}
            isLoading={isLoading}
          />
        
        { isTransformed && (
          <div className="space-y-6">
            <div className="text-center mt-10">
              <h2 className="text-2xl font-bold text-gray-300">Transformed Text Styles</h2>
              <p className="text-gray-300 mt-2">Choose the style that best fits your needs</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
              {styleMeta.map((style) => (
                <ToneCard 
                  key={style.key} 
                  imageUrl={style.image} 
                  title={style.title}
                  description={outputs[style.key as keyof Outputs]}
                  />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App
