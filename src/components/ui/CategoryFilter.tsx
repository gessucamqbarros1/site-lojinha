
import React, { useMemo } from "react";

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onSelect: (category: string) => void;
  products?: { category: string }[]; // Para contar produtos por categoria (opcional)
  className?: string;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onSelect,
  products = [],
  className = "",
}) => {
  // Calcula a contagem de produtos por categoria
  const counts = useMemo(() => {
    const map: Record<string, number> = {};
    for (const cat of categories) map[cat] = 0;
    for (const p of products) {
      map[p.category] = (map[p.category] || 0) + 1;
    }
    // "Todos" é sempre o total
    map["Todos"] = products.length;
    return map;
  }, [categories, products]);

  return (
    <div className={`flex flex-wrap items-center justify-center gap-2 md:gap-4 ${className}`}>
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onSelect(category)}
          className={`relative px-4 py-2 rounded-full text-sm md:text-base font-medium transition-colors duration-200 hover:scale-105 focus:ring-2 focus:ring-primary/40  
            ${
              selectedCategory === category
                ? "bg-primary text-white shadow-lg"
                : "bg-vintage-beige/30 text-vintage-brown hover:bg-vintage-beige/50"
            }
            animate-fade-up
          `}
          aria-pressed={selectedCategory === category}
          aria-label={`Filtrar por ${category}`}
        >
          <span>{category}</span>
          {products.length > 0 && (
            <span className="ml-2 inline-block px-1.5 py-0.5 bg-vintage-brown/80 text-white rounded-full text-[10px] font-semibold animate-scale-in">
              {counts[category] ?? 0}
            </span>
          )}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;
