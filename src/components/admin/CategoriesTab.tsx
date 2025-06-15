
import React, { useState } from 'react';
import { Plus, Trash2, Edit3, Check, X } from 'lucide-react';

interface CategoriesTabProps {
  categories: string[];
  setCategories: (categories: string[]) => void;
  toast: any;
}

const CategoriesTab: React.FC<CategoriesTabProps> = ({
  categories,
  setCategories,
  toast
}) => {
  const [newCategory, setNewCategory] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState('');

  const defaultCategories = ['Maquiagem', 'Skincare', 'Perfumaria', 'Acessórios'];

  const handleAddCategory = () => {
    if (!newCategory.trim()) {
      toast({
        title: "Erro",
        description: "Digite o nome da categoria",
        variant: "destructive",
      });
      return;
    }

    if (categories.includes(newCategory.trim())) {
      toast({
        title: "Erro",
        description: "Esta categoria já existe",
        variant: "destructive",
      });
      return;
    }

    setCategories([...categories, newCategory.trim()]);
    setNewCategory('');
    
    toast({
      title: "Categoria adicionada",
      description: `Categoria "${newCategory.trim()}" foi criada com sucesso`,
    });
  };

  const handleDeleteCategory = (categoryToDelete: string) => {
    if (defaultCategories.includes(categoryToDelete)) {
      toast({
        title: "Erro",
        description: "Não é possível excluir categorias padrão",
        variant: "destructive",
      });
      return;
    }

    setCategories(categories.filter(cat => cat !== categoryToDelete));
    
    toast({
      title: "Categoria removida",
      description: `Categoria "${categoryToDelete}" foi removida`,
    });
  };

  const handleStartEdit = (index: number, category: string) => {
    if (defaultCategories.includes(category)) {
      toast({
        title: "Erro",
        description: "Não é possível editar categorias padrão",
        variant: "destructive",
      });
      return;
    }
    
    setEditingIndex(index);
    setEditingValue(category);
  };

  const handleSaveEdit = () => {
    if (!editingValue.trim()) {
      toast({
        title: "Erro",
        description: "Digite o nome da categoria",
        variant: "destructive",
      });
      return;
    }

    if (categories.includes(editingValue.trim()) && editingIndex !== null) {
      const currentCategory = categories[editingIndex];
      if (currentCategory !== editingValue.trim()) {
        toast({
          title: "Erro",
          description: "Esta categoria já existe",
          variant: "destructive",
        });
        return;
      }
    }

    if (editingIndex !== null) {
      const updatedCategories = [...categories];
      updatedCategories[editingIndex] = editingValue.trim();
      setCategories(updatedCategories);
      
      toast({
        title: "Categoria atualizada",
        description: "Categoria foi editada com sucesso",
      });
    }

    setEditingIndex(null);
    setEditingValue('');
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditingValue('');
  };

  return (
    <div className="vintage-card p-6">
      <h2 className="font-playfair text-xl text-vintage-brown mb-6">
        Gerenciar Categorias
      </h2>
      
      {/* Add new category */}
      <div className="mb-6 p-4 bg-vintage-beige/10 rounded-md">
        <h3 className="text-sm font-medium text-vintage-dark mb-3">Adicionar Nova Categoria</h3>
        <div className="flex gap-2">
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
            placeholder="Nome da categoria..."
            className="vintage-input flex-1"
          />
          <button
            onClick={handleAddCategory}
            className="vintage-button-secondary flex items-center"
          >
            <Plus size={16} className="mr-1" />
            Adicionar
          </button>
        </div>
      </div>

      {/* Categories list */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-vintage-dark mb-3">Categorias Existentes</h3>
        {categories.map((category, index) => (
          <div key={category} className="flex items-center justify-between p-3 bg-vintage-beige/5 rounded-md border border-vintage-beige/20">
            {editingIndex === index ? (
              <div className="flex items-center gap-2 flex-1">
                <input
                  type="text"
                  value={editingValue}
                  onChange={(e) => setEditingValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSaveEdit()}
                  className="vintage-input flex-1"
                  autoFocus
                />
                <button
                  onClick={handleSaveEdit}
                  className="p-1 rounded-md hover:bg-vintage-beige/30 text-green-600"
                >
                  <Check size={16} />
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="p-1 rounded-md hover:bg-vintage-beige/30 text-red-600"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center">
                  <span className="font-medium">{category}</span>
                  {defaultCategories.includes(category) && (
                    <span className="ml-2 text-xs bg-vintage-beige/50 text-vintage-dark/70 px-2 py-1 rounded">
                      Padrão
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleStartEdit(index, category)}
                    className="p-1 rounded-md hover:bg-vintage-beige/30 text-vintage-dark/80"
                    disabled={defaultCategories.includes(category)}
                  >
                    <Edit3 size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(category)}
                    className="p-1 rounded-md hover:bg-vintage-beige/30 text-vintage-dark/80"
                    disabled={defaultCategories.includes(category)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {categories.length === 0 && (
        <div className="text-center py-8 text-vintage-dark/70">
          Nenhuma categoria criada ainda.
        </div>
      )}
    </div>
  );
};

export default CategoriesTab;
