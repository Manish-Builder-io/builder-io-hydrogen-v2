import React from 'react';

type HeroProps = {
  title?: string;
  subtitle?: string;
  imageUrl?: string;
  ctaText?: string;
  ctaHref?: string;
  align?: 'left' | 'center' | 'right';
};

export default function Hero({
  title = 'Hero Title',
  subtitle,
  imageUrl,
  ctaText,
  ctaHref = '#',
  align = 'center',
}: HeroProps) {
  const alignment =
    align === 'left' ? 'items-start text-left' : align === 'right' ? 'items-end text-right' : 'items-center text-center';

  return (
    <section className="relative overflow-hidden">
      {imageUrl ? (
        <img src={imageUrl} alt={title} className="absolute inset-0 h-full w-full object-cover" />
      ) : null}
      <div className="relative mx-auto max-w-5xl px-6 py-24">
        <div className={`flex flex-col gap-4 ${alignment}`}>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">{title}</h1>
          {subtitle ? <p className="max-w-2xl text-lg opacity-90">{subtitle}</p> : null}
          {ctaText ? (
            <a href={ctaHref} className="inline-flex h-11 items-center rounded bg-black px-5 text-white hover:bg-gray-800">
              {ctaText}
            </a>
          ) : null}
        </div>
      </div>
    </section>
  );
}


