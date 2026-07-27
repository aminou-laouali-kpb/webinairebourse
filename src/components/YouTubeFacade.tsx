import { useState } from "react";
import { Play } from "lucide-react";

interface YouTubeFacadeProps {
  videoId: string;
  title: string;
  onPlay?: () => void;
}

export const YouTubeFacade = ({ videoId, title, onPlay }: YouTubeFacadeProps) => {
  const [playing, setPlaying] = useState(false);

  if (playing) {
    return (
      <iframe
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        referrerPolicy="strict-origin-when-cross-origin"
        className="absolute inset-0 w-full h-full"
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => {
        setPlaying(true);
        onPlay?.();
      }}
      className="group absolute inset-0 w-full h-full"
      aria-label={`Lancer la vidéo : ${title}`}
    >
      <img
        src={`https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`}
        alt={title}
        loading="lazy"
        width={1280}
        height={720}
        className="w-full h-full object-cover"
      />
      <span className="absolute inset-0 bg-blue-dark/30 group-hover:bg-blue-dark/20 transition-colors" />
      <span className="absolute inset-0 flex items-center justify-center">
        <span className="flex items-center justify-center w-20 h-20 rounded-full bg-gold shadow-cta group-hover:scale-110 transition-transform">
          <Play className="w-9 h-9 text-blue-dark fill-blue-dark ml-1" />
        </span>
      </span>
    </button>
  );
};
