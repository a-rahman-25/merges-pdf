import { useEffect, useRef } from 'react';

interface AdUnitProps {
  /** Ad slot ID from AdSense (leave empty for auto ads) */
  slot?: string;
  /** Ad format: auto, horizontal, vertical, rectangle */
  format?: 'auto' | 'horizontal' | 'vertical' | 'rectangle';
  /** Additional className for the wrapper */
  className?: string;
  /** Whether this is an in-feed or in-article ad */
  layout?: 'in-article' | 'in-feed' | '';
}

const AD_CLIENT = 'ca-pub-5661149285773520';

const AdUnit = ({ slot, format = 'auto', className = '', layout = '' }: AdUnitProps) => {
  const adRef = useRef<HTMLDivElement>(null);
  const pushed = useRef(false);

  useEffect(() => {
    if (pushed.current) return;
    try {
      const w = window as any;
      (w.adsbygoogle = w.adsbygoogle || []).push({});
      pushed.current = true;
    } catch {
      // AdSense not loaded or blocked
    }
  }, []);

  const formatStyles: Record<string, React.CSSProperties> = {
    auto: { display: 'block' },
    horizontal: { display: 'inline-block', width: '100%', height: '90px' },
    vertical: { display: 'inline-block', width: '160px', height: '600px' },
    rectangle: { display: 'inline-block', width: '336px', height: '280px' },
  };

  return (
    <div
      ref={adRef}
      className={`ad-unit flex items-center justify-center overflow-hidden ${className}`}
      aria-hidden="true"
    >
      <ins
        className="adsbygoogle"
        style={formatStyles[format] || formatStyles.auto}
        data-ad-client={AD_CLIENT}
        {...(slot ? { 'data-ad-slot': slot } : {})}
        data-ad-format={format === 'auto' ? 'auto' : undefined}
        data-full-width-responsive={format === 'auto' ? 'true' : undefined}
        {...(layout ? { 'data-ad-layout': layout } : {})}
      />
    </div>
  );
};

export default AdUnit;
