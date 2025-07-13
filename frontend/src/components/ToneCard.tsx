interface ToneCardProps {
  imageUrl: string;
  title: string;
  description: string;
  altText?: string;
}

export default function ToneCard({ imageUrl, title, description, altText }: ToneCardProps) {
  return (
    <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-700 hover:border-gray-600 transition-all duration-300 hover:shadow-xl">
      <div className="relative">
        <img 
          src={imageUrl} 
          alt={altText || title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent"></div>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-semibold text-white mb-3">
          {title}
        </h3>
        <p className="text-gray-300 text-sm leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}