'use client';

import { useState } from 'react';
import clsx from 'clsx';

interface PricingCardProps {
  plan: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  cta: string;
  ctaHref: string;
  highlighted: boolean;
}

export default function PricingCard({
  plan,
  price,
  period,
  description,
  features,
  cta,
  ctaHref,
  highlighted,
}: PricingCardProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (ctaHref.startsWith('/api/')) {
      e.preventDefault();
      setIsLoading(true);
      try {
        const sessionId = localStorage.getItem('changelog_session_id') || 'anonymous';
        const response = await fetch(ctaHref, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId }),
        });
        const data = await response.json();
        if (data.url) {
          window.location.href = data.url;
        }
      } catch (err) {
        console.error('Checkout error:', err);
        setIsLoading(false);
      }
    }
  };

  return (
    <div
      className={clsx(
        'relative rounded-2xl p-8 transition-shadow',
        highlighted
          ? 'bg-brand-600 text-white shadow-xl ring-2 ring-brand-600'
          : 'bg-white border border-gray-200 shadow-sm hover:shadow-md'
      )}
    >
      {highlighted && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <span className="bg-orange-500 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow">
            MOST POPULAR
          </span>
        </div>
      )}

      <div className="mb-6">
        <h3
          className={clsx(
            'text-lg font-semibold mb-1',
            highlighted ? 'text-brand-100' : 'text-gray-500'
          )}
        >
          {plan}
        </h3>
        <div className="flex items-end gap-2 mb-3">
          <span
            className={clsx(
              'text-5xl font-extrabold',
              highlighted ? 'text-white' : 'text-gray-900'
            )}
          >
            {price}
          </span>
          <span
            className={clsx(
              'text-sm mb-2',
              highlighted ? 'text-brand-200' : 'text-gray-500'
            )}
          >
            {period}
          </span>
        </div>
        <p
          className={clsx(
            'text-sm leading-relaxed',
            highlighted ? 'text-brand-100' : 'text-gray-600'
          )}
        >
          {description}
        </p>
      </div>

      <ul className="space-y-3 mb-8">
        {features.map((feature) => (
          <li key={feature} className="flex items-start gap-3">
            <span
              className={clsx(
                'flex-shrink-0 text-sm mt-0.5',
                highlighted ? 'text-brand-200' : 'text-green-500'
              )}
            >
              ✓
            </span>
            <span
              className={clsx(
                'text-sm',
                highlighted ? 'text-white' : 'text-gray-700'
              )}
            >
              {feature}
            </span>
          </li>
        ))}
      </ul>

      <a
        href={ctaHref}
        onClick={handleClick}
        className={clsx(
          'block text-center py-3 px-6 rounded-lg font-semibold text-sm transition-colors',
          highlighted
            ? 'bg-white text-brand-700 hover:bg-brand-50'
            : 'bg-brand-600 text-white hover:bg-brand-700',
          isLoading && 'opacity-50 pointer-events-none'
        )}
      >
        {isLoading ? 'Loading...' : cta}
      </a>
    </div>
  );
}
