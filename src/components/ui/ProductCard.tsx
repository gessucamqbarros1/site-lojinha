import React from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import ProductImageCarousel from './ProductImageCarousel';
import ProductBadge from './ProductBadge';
import { useFavorites } from '@/hooks/useFavorites';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  original_price?: number;
  discount_percentage?: number;
  image: string;
  images?: string[];
  category: string;
  purchaseLink?: string;
  badge?: 'new' | 'popular' | 'sale';
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const productImages = product.images && product.images.length > 0
    ? product.images
    : (product.image ? [product.image] : ["/placeholder.svg"]);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(product.id);
  };

  // Determinar se o produto está em oferta automaticamente
  const isOnSale = product.discount_percentage && product.discount_percentage > 0;
  const displayBadge = isOnSale ? "sale" : product.badge;

  // SEO: alt dinâmico
  const mainImageAlt = `${product.name} ${product.category ? "- " + product.category : ""} | Produto Minha Lojinha`;

  return (
    <Link to={`/product/${product.id}`} className="block group" aria-label={product.name}>
      <div className="vintage-card overflow-hidden flex flex-col h-full hover-lift animate-fade-up relative transform transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10">
        {/* Badge - Automático para ofertas */}
        {displayBadge && <ProductBadge type={displayBadge} />}

        {/* Mostrar percentual de desconto se estiver em oferta */}
        {isOnSale && (
          <div className="absolute top-0.5 right-8 z-20 bg-red-500 text-white text-[10px] font-bold px-1 py-0.5 rounded-full">
            -{product.discount_percentage}%
          </div>
        )}

        {/* Favorite Button */}
        <button
          onClick={handleFavoriteClick}
          className={`absolute top-0.5 right-0.5 z-20 p-1 rounded-full backdrop-blur-sm transition-all duration-300 ${
            isFavorite(product.id)
              ? "bg-red-500 text-white scale-110"
              : "bg-white/80 text-vintage-brown/60 hover:bg-white hover:text-red-500"
          }`}
          aria-label={isFavorite(product.id) ? "Remover dos favoritos" : "Adicionar aos favoritos"}
        >
          <Heart
            size={12}
            className={isFavorite(product.id) ? "fill-current" : ""}
          />
        </button>

        {/* Enhanced shimmer effect overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out z-10 pointer-events-none"></div>

        {/* Product image carousel com alt dinâmico */}
        <div className="relative overflow-hidden">
          {/* Se tiver só uma imagem, usa <img> para SEO. Senão, mantém carousel. */}
          {productImages.length === 1 ? (
            <img
              src={productImages[0]}
              alt={mainImageAlt}
              loading="lazy"
              className="aspect-square object-cover w-full h-full rounded-t-md"
              width={400}
              height={400}
            />
          ) : (
            <ProductImageCarousel
              images={productImages}
              productName={product.name}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        </div>

        {/* Product info with enhanced spacing and animations */}
        <div className="p-2 flex flex-col flex-grow relative z-20">
          <h3 className="font-playfair text-sm text-vintage-dark mb-1 line-clamp-1 group-hover:text-primary transition-colors duration-300">
            {product.name}
          </h3>
          <p className="text-[10px] text-vintage-dark/70 mb-2 line-clamp-2 flex-grow leading-relaxed">
            {product.description}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              {/* Preço atual */}
              <span className="text-black font-semibold text-sm">
                {new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(product.price)}
              </span>

              {/* Preço original riscado se estiver em oferta */}
              {isOnSale && product.original_price && (
                <span className="text-[10px] text-gray-500 line-through">
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(product.original_price)}
                </span>
              )}
            </div>

            <span className="text-[10px] px-1.5 py-0.5 bg-gradient-to-r from-vintage-beige/20 to-vintage-beige/30 backdrop-blur-sm rounded-full text-vintage-brown border border-vintage-beige/40 group-hover:scale-110 transition-transform duration-300">
              {product.category}
            </span>
          </div>

          {/* Enhanced bottom border effect */}
          <div className="absolute bottom-0 left-2 right-2 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
