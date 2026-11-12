'use client';

import React, { useState, useEffect } from 'react';
import { FoodSearch } from '@/components/FoodSearch';
import { MainLayout } from '@/components/MainLayout';
import { Product, ProductCategory, CATEGORIES } from '@/types';
import { getProducts, saveProducts } from '@/utils/storage';
import { formatCurrencyBRL } from '@/utils/importHelper';
import { ImportModal } from '@/components/ImportModal';
import {
  Search,
  Filter,
  Star,
  Plus,
  Upload,
  Sparkles,
  Edit2,
  Trash2,
  Package,
  X,
} from 'lucide-react';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);

  useEffect(() => {
    setProducts(getProducts());
  }, []);

  const handleToggleFavorite = (id: string) => {
    const updated = products.map((p) =>
      p.id === id ? { ...p, isFavorite: !p.isFavorite } : p
    );
    setProducts(updated);
    saveProducts(updated);
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm('Tem certeza que deseja remover este produto do catálogo?')) {
      const updated = products.filter((p) => p.id !== id);
      setProducts(updated);
      saveProducts(updated);
    }
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct?.name || !editingProduct?.currentPrice) {
      alert('Preencha os campos obrigatórios (Nome e Preço).');
      return;
    }

    let updated: Product[];
    if (editingProduct.id) {
      updated = products.map((p) =>
        p.id === editingProduct.id ? ({ ...p, ...editingProduct } as Product) : p
      );
    } else {
      const newProd: Product = {
        id: `prod-${Date.now()}`,
        name: editingProduct.name,
        brand: editingProduct.brand || '',
        packageContent: editingProduct.packageContent || '',
        saleUnit: editingProduct.saleUnit || 'unidade',
        currentPrice: Number(editingProduct.currentPrice),
        category: (editingProduct.category as ProductCategory) || 'mercearia-basica',
        imageUrl: editingProduct.imageUrl || '',
        isFavorite: false,
        createdAt: new Date().toISOString(),
      };
      updated = [newProd, ...products];
    }

    setProducts(updated);
    saveProducts(updated);
    setIsEditModalOpen(false);
    setEditingProduct(null);
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.brand && p.brand.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory =
      selectedCategory === 'all' || p.category === selectedCategory;
    const matchesFav = onlyFavorites ? p.isFavorite : true;

    return matchesSearch && matchesCategory && matchesFav;
  });

  return (
    <MainLayout><div className="max-w-6xl mx-auto w-full px-4 pt-6"><FoodSearch onChoose={p=>{const updated=[p,...products.filter(item=>item.id!==p.id)];saveProducts(updated);setProducts(updated);}} /></div>
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Meus Produtos</h1>
            <p className="text-xs sm:text-sm font-medium text-slate-500">
              Gerencie seus itens cadastrados, fotos e preços de referência para os encartes.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsImportModalOpen(true)}
              className="inline-flex items-center gap-2 px-3.5 py-2.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-bold shadow-sm transition-colors"
            >
              <Upload className="w-4 h-4 text-purple-600" />
              <span>Importar planilha</span>
            </button>

            <button
              onClick={() => {
                setEditingProduct({
                  name: '',
                  brand: '',
                  packageContent: '',
                  saleUnit: 'unidade',
                  currentPrice: 0,
                  category: 'mercearia-basica',
                  imageUrl: '',
                });
                setIsEditModalOpen(true);
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-md shadow-purple-200 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Novo produto</span>
            </button>
          </div>
        </div>

        {/* Barra de Filtros e Busca */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por nome ou marca..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:border-purple-600 outline-none text-slate-900"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-56">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 outline-none focus:border-purple-600"
              >
                <option value="all">Todas as 12 categorias</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => setOnlyFavorites(!onlyFavorites)}
              className={`p-2 rounded-xl border transition-colors shrink-0 ${
                onlyFavorites
                  ? 'bg-amber-50 border-amber-300 text-amber-600'
                  : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-600'
              }`}
              title="Filtrar favoritos"
            >
              <Star className="w-4 h-4 fill-current" />
            </button>
          </div>
        </div>

        {/* Lista de Produtos em Grade */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
          {filteredProducts.map((prod) => (
            <div
              key={prod.id}
              className="bg-white rounded-2xl border border-slate-200/80 p-3 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group relative"
            >
              {/* Botão Favorito */}
              <button
                onClick={() => handleToggleFavorite(prod.id)}
                className="absolute top-2 right-2 z-10 p-1.5 rounded-lg bg-white/80 backdrop-blur-sm text-slate-300 hover:text-amber-500 transition-colors"
              >
                <Star
                  className={`w-4 h-4 ${
                    prod.isFavorite ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                  }`}
                />
              </button>

              {/* Imagem do Produto */}
              <div className="w-full h-28 rounded-xl bg-slate-50 flex items-center justify-center p-2 mb-2 overflow-hidden">
                {prod.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={prod.imageUrl}
                    alt={prod.name}
                    className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-slate-300">
                    <Package className="w-8 h-8 mb-1" />
                    <span className="text-[9px] font-bold uppercase text-slate-400">Sem foto</span>
                  </div>
                )}
              </div>

              {/* Textos */}
              <div className="space-y-1">
                {prod.brand && (
                  <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wide block truncate">
                    {prod.brand}
                  </span>
                )}
                <h3 className="text-xs font-bold text-slate-900 line-clamp-2 leading-tight">
                  {prod.name}
                </h3>
                <div className="flex items-center gap-1 text-[10px] text-slate-600 font-medium">
                  {prod.packageContent && <span>{prod.packageContent}</span>}
                  {prod.packageContent && prod.saleUnit && <span>•</span>}
                  {prod.saleUnit && <span>Por {prod.saleUnit}</span>}
                </div>
              </div>

              {/* Preço e Ações */}
              <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-sm font-black text-purple-700">
                  {formatCurrencyBRL(prod.currentPrice)}
                </span>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => {
                      setEditingProduct(prod);
                      setIsEditModalOpen(true);
                    }}
                    className="p-1 text-slate-400 hover:text-purple-600 rounded"
                    title="Editar"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(prod.id)}
                    className="p-1 text-slate-400 hover:text-red-600 rounded"
                    title="Excluir"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
            <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-slate-800">Nenhum produto encontrado</h3>
            <p className="text-xs text-slate-500 mt-1">
              Ajuste seus filtros de busca ou cadastre novos produtos.
            </p>
          </div>
        )}

        {/* Modal de Criação / Edição de Produto */}
        {isEditModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <h3 className="font-bold text-sm text-slate-900">
                  {editingProduct?.id ? 'Editar Produto' : 'Novo Produto'}
                </h3>
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveProduct} className="p-5 space-y-3.5 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nome do Produto *</label>
                  <input
                    type="text"
                    required
                    value={editingProduct?.name || ''}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, name: e.target.value })
                    }
                    placeholder="Ex: Arroz Branco Tipo 1"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-purple-600 outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Marca (Opcional)</label>
                    <input
                      type="text"
                      value={editingProduct?.brand || ''}
                      onChange={(e) =>
                        setEditingProduct({ ...editingProduct, brand: e.target.value })
                      }
                      placeholder="Ex: Tio João"
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-purple-600 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Conteúdo</label>
                    <input
                      type="text"
                      value={editingProduct?.packageContent || ''}
                      onChange={(e) =>
                        setEditingProduct({ ...editingProduct, packageContent: e.target.value })
                      }
                      placeholder="Ex: 5 kg, 900 ml"
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-purple-600 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Unidade de Venda</label>
                    <input
                      type="text"
                      value={editingProduct?.saleUnit || 'unidade'}
                      onChange={(e) =>
                        setEditingProduct({ ...editingProduct, saleUnit: e.target.value })
                      }
                      placeholder="Ex: unidade, kg, pct"
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-purple-600 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Preço Atual (R$) *</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={editingProduct?.currentPrice || ''}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          currentPrice: parseFloat(e.target.value) || 0,
                        })
                      }
                      placeholder="0,00"
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-purple-600 outline-none font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Categoria</label>
                  <select
                    value={editingProduct?.category || 'mercearia-basica'}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        category: e.target.value as ProductCategory,
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-purple-600 outline-none"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">URL da Imagem (Opcional)</label>
                  <input
                    type="url"
                    value={editingProduct?.imageUrl || ''}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, imageUrl: e.target.value })
                    }
                    placeholder="https://exemplo.com/foto.jpg"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-purple-600 outline-none"
                  />
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="px-4 py-2 border border-slate-200 rounded-xl font-bold text-slate-600"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold shadow-md shadow-purple-200"
                  >
                    Salvar Produto
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal Importar Planilha */}
        <ImportModal
          isOpen={isImportModalOpen}
          onClose={() => setIsImportModalOpen(false)}
          existingProducts={products}
          onImportConfirmed={(newProds) => {
            const updated = [...newProds, ...products];
            setProducts(updated);
            saveProducts(updated);
          }}
        />
      </div>
    </MainLayout>
  );
}
