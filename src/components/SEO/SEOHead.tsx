
import React from "react";

interface SEOHeadProps {
  title: string;
  description: string;
  image?: string;
  url?: string;
}

const SEOHead: React.FC<SEOHeadProps> = ({ title, description, image, url }) => {
  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      {url && <link rel="canonical" href={url} />}

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      {image && <meta property="og:image" content={image} />}
      {url && <meta property="og:url" content={url} />}

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {image && <meta name="twitter:image" content={image} />}

      {/* Mobile-friendly */}
      <meta name="viewport" content="width=device-width,initial-scale=1.0" />
    </>
  );
};

export default SEOHead;
