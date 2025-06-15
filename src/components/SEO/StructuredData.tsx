
import React from "react";

export interface ProductStructuredData {
  name: string;
  description: string;
  image: string | string[];
  price: number;
  original_price?: number;
  currency?: string;
  availability?: string;
  url: string;
  category?: string;
}

export const ProductJsonLd = ({
  product,
}: {
  product: ProductStructuredData;
}) => {
  const ld = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: Array.isArray(product.image) ? product.image : [product.image],
    category: product.category,
    url: product.url,
    offers: {
      "@type": "Offer",
      priceCurrency: product.currency || "BRL",
      price: product.price,
      availability: product.availability || "InStock",
      url: product.url,
      ...(product.original_price && {
        highPrice: product.original_price,
        lowPrice: product.price,
      }),
    },
  };
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
  );
};

export const BreadcrumbsJsonLd = ({
  items,
}: {
  items: { name: string; url: string }[];
}) => {
  const ld = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: item.name,
      item: item.url,
    })),
  };
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
  );
};
