import type {RegisteredComponent} from '@builder.io/sdk-react';
import Counter from './components/Counter/Counter';
import Hero from './components/Hero/Hero';
import ProductCard from './components/ProductCard/ProductCard';

export const CUSTOM_COMPONENTS: RegisteredComponent[] = [
  {
    component: Counter,
    name: 'Counter',
    inputs: [
      {
        name: 'initialCount',
        type: 'number',
      },
    ],
  },
  {
    component: Hero,
    name: 'Hero',
    inputs: [
      {name: 'title', type: 'text'},
      {name: 'subtitle', type: 'longText'},
      {name: 'imageUrl', type: 'file', allowedFileTypes: ['jpeg', 'jpg', 'png', 'webp']},
      {name: 'ctaText', type: 'text'},
      {name: 'ctaHref', type: 'url'},
      {name: 'align', type: 'text', enum: ['left', 'center', 'right']},
    ],
  },
  {
    component: ProductCard,
    name: 'ProductCard',
    inputs: [
      {name: 'title', type: 'text'},
      {name: 'imageUrl', type: 'file', allowedFileTypes: ['jpeg', 'jpg', 'png', 'webp']},
      {name: 'price', type: 'text'},
      {name: 'compareAtPrice', type: 'text'},
      {name: 'href', type: 'url'},
    ],
  },
];
