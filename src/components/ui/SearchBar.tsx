
import React, { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  onFilterChange: (filters: { minPrice?: number; maxPrice?: number; category?: string }) => void;
  categories: string[];
  searchQuery: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  onSearch, 
  onFilterChange, 
  categories, 
  searchQuery 
}) => {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    category: ''
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(e.target.value);
  };

  const handleFilterSubmit = () => {
    onFilterChange({
      minPrice: filters.minPrice ? parseFloat(filters.minPrice) : undefined,
      maxPrice: filters.maxPrice ? parseFloat(filters.maxPrice) : undefined,
      category: filters.category || undefined
    });
  };

  const clearFilters = () => {
    setFilters({ minPrice: '', maxPrice: '', category: '' });
    onFilterChange({});
  };

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="relative max-w-md mx-auto">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-vintage-brown/60" size={20} />
        <input
          type="text"
          placeholder="Buscar produtos..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="w-full pl-10 pr-4 py-3 border border-vintage-beige/50 rounded-full focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300 bg-white/80 backdrop-blur-sm"
        />
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-full transition-all duration-300 ${
            showFilters ? 'bg-primary text-white' : 'text-vintage-brown/60 hover:bg-vintage-beige/30'
          }`}
        >
          <Filter size={18} />
        </button>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <div className="bg-white/90 backdrop-blur-sm border border-vintage-beige/50 rounded-lg p-4 animate-fade-in shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-vintage-brown mb-1">Preço mínimo</label>
              <input
                type="number"
                placeholder="R$ 0,00"
                value={filters.minPrice}
                onChange={(e) => setFilters(prev => ({ ...prev, minPrice: e.target.value }))}
                className="w-full px-3 py-2 border border-vintage-beige/50 rounded focus:ring-1 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-vintage-brown mb-1">Preço máximo</label>
              <input
                type="number"
                placeholder="R$ 1000,00"
                value={filters.maxPrice}
                onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: e.target.value }))}
                className="w-full px-3 py-2 border border-vintage-beige/50 rounded focus:ring-1 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-vintage-brown mb-1">Categoria</label>
              <select
                value={filters.category}
                onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-3 py-2 border border-vintage-beige/50 rounded focus:ring-1 focus:ring-primary/20"
              >
                <option value="">Todas</option>
                {categories.filter(cat => cat !== 'Todos').map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex justify-end space-x-2 mt-4">
            <button
              onClick={clearFilters}
              className="flex items-center px-3 py-1 text-sm text-vintage-brown hover:bg-vintage-beige/20 rounded transition-colors"
            >
              <X size={16} className="mr-1" />
              Limpar
            </button>
            <button
              onClick={handleFilterSubmit}
              className="vintage-button text-sm px-4 py-1"
            >
              Aplicar Filtros
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
