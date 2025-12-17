import { ArrowRight } from 'lucide-react';

export const ServiceCard = ({ title, description, ctaText, href, secondaryCta, secondaryHref, imageUrl, imageClassName, tone = 'tanning', altText }) => {
  const toneGradients = {
    tanning: 'from-[hsl(43_96%_96%)] to-transparent',
    laundry: 'from-[hsl(183_45%_96%)] to-transparent',
    drinks: 'from-[hsl(172_45%_94%)] to-transparent',
    foodtruck: 'from-[hsl(24_100%_96%)] to-transparent'
  };
  
  // Generate descriptive alt text if not provided
  const imageAlt = altText || `${title} - ${description.substring(0, 60)} at Eastend Tanning & Laundry, Mt Vernon, OH`;

  return (
    <div 
      data-testid="service-card" 
      className="group relative overflow-hidden rounded-xl border bg-white shadow-sm transition-all duration-200 hover:shadow-md"
    >
      {/* Image */}
      <div className="relative h-48 w-full overflow-hidden bg-gray-50">
        <img 
          src={imageUrl} 
          alt={imageAlt}
          loading="lazy"
          className={imageClassName || "h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"} 
        />
        <div className={`absolute inset-0 bg-gradient-to-br ${toneGradients[tone]} opacity-60`}></div>
      </div>

      {/* Content */}
      <div className="p-5 space-y-3">
        <h3 className="font-serif font-semibold text-xl sm:text-2xl text-foreground leading-tight">{title}</h3>
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{description}</p>
        <div className="flex flex-col sm:flex-row gap-3">
          <a 
            data-testid="service-card-cta" 
            href={href} 
            className="inline-flex items-center gap-2 text-[hsl(var(--secondary))] font-semibold text-sm sm:text-base hover:underline transition-colors duration-200"
          >
            {ctaText}
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </a>
          {secondaryCta && secondaryHref && (
            <a 
              data-testid="service-card-secondary-cta" 
              href={secondaryHref} 
              className="inline-flex items-center gap-2 text-muted-foreground font-semibold text-sm sm:text-base hover:underline transition-colors duration-200"
            >
              {secondaryCta}
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};