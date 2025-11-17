// Optimized Image Component with lazy loading and alt text
import { useState } from 'react';

export const ImageWithAlt = ({ 
  src, 
  alt, 
  className = '', 
  loading = 'lazy',
  width,
  height,
  onError 
}) => {
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const handleError = () => {
    setError(true);
    if (onError) onError();
  };

  const handleLoad = () => {
    setLoaded(true);
  };

  if (error) {
    return (
      <div className={`bg-muted flex items-center justify-center ${className}`}>
        <span className="text-muted-foreground text-sm">Image unavailable</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={`${className} ${!loaded ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
      loading={loading}
      width={width}
      height={height}
      onError={handleError}
      onLoad={handleLoad}
    />
  );
};
