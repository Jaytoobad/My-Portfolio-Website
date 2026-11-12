import { useState } from "react";
import { ImageOff } from "lucide-react";

type Props = {
  src: string;
  alt: string;
  label: string;
};

/**
 * Lazy-loaded project image. Until a real screenshot is added to
 * `public/projects/`, a clearly labelled placeholder is shown instead of
 * stock imagery.
 */
export const ImageSlot = ({ src, alt, label }: Props) => {
  const [missing, setMissing] = useState(false);

  return (
    <figure className="slot">
      {missing ? (
        <div className="slot__placeholder" role="img" aria-label={`${label}, screenshot to be added`}>
          <ImageOff size={20} aria-hidden="true" />
          <span>Screenshot to be added</span>
          <small>{label}</small>
        </div>
      ) : (
        <img src={src} alt={alt} loading="lazy" decoding="async" onError={() => setMissing(true)} />
      )}
    </figure>
  );
};
