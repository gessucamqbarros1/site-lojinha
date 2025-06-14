
import React from 'react';
import { Product } from '@/components/ui/ProductCard';
import { Pencil, Trash, Plus } from 'lucide-react';

interface ProductListProps {
  productList: Product[];
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (id: string, imageUrl?: string) => void;
  onAddNewProduct: () => void;
}

const ProductList: React.FC<ProductListProps> = ({
  productList,
  onEditProduct,
  onDeleteProduct,
  onAddNewProduct
}) => {
  return (
    <div className="vintage-card p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-playfair text-xl text-vintage-brown">
          Gerenciar Produtos
        </h2>
        <button
          onClick={onAddNewProduct}
          className="vintage-button-secondary flex items-center"
        >
          <Plus size={16} className="mr-1" />
          Novo Produto
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-vintage-beige/30">
              <th className="text-left py-3 px-4">Nome</th>
              <th className="text-left py-3 px-4 hidden md:table-cell">Categoria</th>
              <th className="text-right py-3 px-4">Preço</th>
              <th className="text-right py-3 px-4">Ações</th>
            </tr>
          </thead>
          <tbody>
            {productList.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-8 text-center text-vintage-dark/70">
                  Nenhum produto cadastrado ainda.
                  <div className="mt-2">
                    <button
                      onClick={onAddNewProduct}
                      className="text-primary hover:text-primary-dark underline"
                    >
                      Adicionar primeiro produto
                    </button>
                  </div>
                </td>
              </tr>
            ) : (
              productList.map((product) => (
                <tr key={product.id} className="border-b border-vintage-beige/30 hover:bg-vintage-beige/5">
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 mr-3 bg-vintage-cream rounded-md overflow-hidden">
                        <img 
                          src={product.image || "/placeholder.svg"} 
                          alt={product.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="font-medium">{product.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 hidden md:table-cell">
                    {product.category}
                  </td>
                  <td className="py-3 px-4 text-right">
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    }).format(product.price)}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => onEditProduct(product)}
                        className="p-1 rounded-md hover:bg-vintage-beige/30 text-vintage-dark/80"
                        aria-label="Editar produto"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => onDeleteProduct(product.id, product.image)}
                        className="p-1 rounded-md hover:bg-vintage-beige/30 text-vintage-dark/80"
                        aria-label="Excluir produto"
                      >
                        <Trash size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductList;
