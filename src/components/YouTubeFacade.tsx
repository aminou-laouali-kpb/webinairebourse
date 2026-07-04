import { useState } from "react";
import { Play } from "lucide-react";

interface YouTubeFacadeProps {
  videoId: string;
  title: string;
}

export const YouTubeFacade = ({ videoId, title }: YouTubeFacadeProps) => {
  const [isPlaying, setIsPlaying] = useState(false);

  if (isPlaying) {
    return (
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="absolute inset-0 w-full h-full"
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => setIsPlaying(true)}
      className="absolute inset-0 w-full h-full group cursor-pointer border-0 p-0 bg-transparent"
      aria-label={`Lire la vidéo : ${title}`}
    >
      <img
        src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
        loading="eager"
        decoding="async"
        fetchPriority="high"
        width={480}
        height={360}
      />
      <div className="absolute inset-0 bg-blue-dark/30 group-hover:bg-blue-dark/40 transition-colors" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-16 h-16 md:w-20 md:h-20 bg-gold rounded-full flex items-center justify-center shadow-cta group-hover:scale-110 transition-transform">
          <Play className="w-8 h-8 md:w-10 md:h-10 text-blue-dark ml-1" fill="currentColor" />
        </div>
      </div>
    </button>
  );
};
