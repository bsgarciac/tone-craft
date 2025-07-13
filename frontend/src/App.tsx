import './App.css'
import TextTransformPanel from './components/TextTransformer'
function App() {
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold text-blue-400">🎨 ToneCraft</h1>
      <p className="mt-4 text-lg text-gray-300">
        Transform your text into multiple tones at once.
      </p>
      <TextTransformPanel />
    </div>
  );
}

export default App
