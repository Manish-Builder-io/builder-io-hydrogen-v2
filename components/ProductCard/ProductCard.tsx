import React from 'react';

type ProductCardProps = {
  title?: string;
  imageUrl?: string;
  price?: string;
  compareAtPrice?: string;
  href?: string;
};

export default function ProductCard({
  title = 'Product',
  imageUrl,
  price,
  compareAtPrice,
  href = '#',
}: ProductCardProps) {
  return (
    <a href={href} className="block overflow-hidden rounded border hover:shadow-md">
      <div className="aspect-square w-full bg-gray-100">
        {imageUrl ? (
          <img src={imageUrl} alt={title} className="h-full w-full object-cover" />
        ) : null}
      </div>
      <div className="space-y-1 p-4">
        <h3 className="line-clamp-2 text-sm font-medium">{title}</h3>
        <div className="flex items-center gap-2 text-sm">
          {price ? <span className="font-semibold">{price}</span> : null}
          {compareAtPrice ? <span className="text-gray-500 line-through">{compareAtPrice}</span> : null}
        </div>
      </div>
    </a>
  );
}


