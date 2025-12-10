import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X, Upload, Image as ImageIcon } from 'lucide-react';
import menuDataRaw from './data/versaillesCafeMenu.json';

interface MenuItem {
  code?: number;
  name: string;
  price?: number;
  prices?: { Said: number; Nutella: number };
  image: string;
}

interface Category {
  id: string;
  name: string;
  items: MenuItem[];
}

const AdminPanel: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [restaurantName, setRestaurantName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [newCategory, setNewCategory] = useState({ id: '', name: '' });
  const [newItem, setNewItem] = useState<MenuItem>({
    name: '',
    price: 0,
    image: ''
  });
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    loadMenuData();
  }, []);

  const loadMenuData = () => {
    setRestaurantName(menuDataRaw.restaurant.name);
    setCategories(menuDataRaw.restaurant.categories as Category[]);
  };

  const handleLogin = () => {
    if (password === 'admin123') {
      setIsAuthenticated(true);
    } else {
      alert('Mot de passe incorrect');
    }
  };

  const handleAddCategory = () => {
    if (!newCategory.name || !newCategory.id) {
      alert('Veuillez remplir tous les champs');
      return;
    }
    const category: Category = {
      id: newCategory.id,
      name: newCategory.name,
      items: []
    };
    setCategories([...categories, category]);
    setNewCategory({ id: '', name: '' });
    setIsAddingCategory(false);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory({ ...category });
  };

  const handleSaveCategory = () => {
    if (!editingCategory) return;
    setCategories(categories.map(cat => 
      cat.id === editingCategory.id ? editingCategory : cat
    ));
    setEditingCategory(null);
  };

  const handleDeleteCategory = (categoryId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette catégorie?')) {
      setCategories(categories.filter(cat => cat.id !== categoryId));
      if (selectedCategory === categoryId) {
        setSelectedCategory(null);
      }
    }
  };

  const handleAddItem = () => {
    if (!selectedCategory) {
      alert('Veuillez sélectionner une catégorie');
      return;
    }
    if (!newItem.name || !newItem.image) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }
    
    setCategories(categories.map(cat => {
      if (cat.id === selectedCategory) {
        return {
          ...cat,
          items: [...cat.items, { ...newItem }]
        };
      }
      return cat;
    }));
    
    setNewItem({ name: '', price: 0, image: '' });
    setIsAddingItem(false);
  };

  const handleEditItem = (item: MenuItem) => {
    setEditingItem({ ...item });
  };

  const handleSaveItem = () => {
    if (!editingItem || !selectedCategory) return;
    
    setCategories(categories.map(cat => {
      if (cat.id === selectedCategory) {
        return {
          ...cat,
          items: cat.items.map(item => 
            item.name === editingItem.name ? editingItem : item
          )
        };
      }
      return cat;
    }));
    
    setEditingItem(null);
  };

  const handleDeleteItem = (itemName: string) => {
    if (!selectedCategory) return;
    if (confirm('Êtes-vous sûr de vouloir supprimer cet article?')) {
      setCategories(categories.map(cat => {
        if (cat.id === selectedCategory) {
          return {
            ...cat,
            items: cat.items.filter(item => item.name !== itemName)
          };
        }
        return cat;
      }));
    }
  };

  const handleExportMenu = () => {
    const menuData = {
      restaurant: {
        name: restaurantName,
        currency: 'TND',
        categories: categories
      }
    };
    
    const dataStr = JSON.stringify(menuData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'versaillesCafeMenu.json';
    link.click();
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-800">Administration</h1>
            <p className="text-gray-600 mt-2">Panneau de gestion du menu</p>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mot de passe
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-amber-500 focus:outline-none transition"
                placeholder="Entrez le mot de passe"
              />
            </div>
            
            <button
              onClick={handleLogin}
              className="w-full bg-amber-500 text-white py-3 rounded-lg font-semibold hover:bg-amber-600 transition shadow-lg"
            >
              Se connecter
            </button>
            
            <p className="text-xs text-gray-500 text-center mt-4">
              Mot de passe par défaut: admin123
            </p>
          </div>
        </div>
      </div>
    );
  }

  const selectedCategoryData = categories.find(cat => cat.id === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-800">Panneau d'Administration</h1>
              <input
                type="text"
                value={restaurantName}
                onChange={(e) => setRestaurantName(e.target.value)}
                className="px-3 py-1 border rounded-lg text-lg font-semibold"
                placeholder="Nom du restaurant"
              />
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleExportMenu}
                className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
              >
                <Upload size={18} />
                <span>Exporter Menu</span>
              </button>
              <button
                onClick={() => setIsAuthenticated(false)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
              >
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Catégories */}
          <div className="lg:col-span-1 bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">Catégories</h2>
              <button
                onClick={() => setIsAddingCategory(true)}
                className="p-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition"
              >
                <Plus size={20} />
              </button>
            </div>

            {isAddingCategory && (
              <div className="mb-4 p-4 bg-gray-50 rounded-lg space-y-3">
                <input
                  type="text"
                  value={newCategory.id}
                  onChange={(e) => setNewCategory({ ...newCategory, id: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="ID (ex: pizzas)"
                />
                <input
                  type="text"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="Nom (ex: PIZZAS)"
                />
                <div className="flex space-x-2">
                  <button
                    onClick={handleAddCategory}
                    className="flex-1 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                  >
                    <Save size={18} className="inline" />
                  </button>
                  <button
                    onClick={() => setIsAddingCategory(false)}
                    className="flex-1 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                  >
                    <X size={18} className="inline" />
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-2 max-h-[70vh] overflow-y-auto">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className={`p-3 rounded-lg border-2 cursor-pointer transition ${
                    selectedCategory === category.id
                      ? 'border-amber-500 bg-amber-50'
                      : 'border-gray-200 hover:border-amber-300'
                  }`}
                >
                  {editingCategory?.id === category.id ? (
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={editingCategory.name}
                        onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                        className="w-full px-2 py-1 border rounded"
                      />
                      <div className="flex space-x-2">
                        <button
                          onClick={handleSaveCategory}
                          className="flex-1 py-1 bg-green-500 text-white rounded text-sm"
                        >
                          <Save size={14} className="inline" />
                        </button>
                        <button
                          onClick={() => setEditingCategory(null)}
                          className="flex-1 py-1 bg-gray-300 text-gray-700 rounded text-sm"
                        >
                          <X size={14} className="inline" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div onClick={() => setSelectedCategory(category.id)}>
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-800">{category.name}</h3>
                          <p className="text-sm text-gray-500">{category.items.length} articles</p>
                        </div>
                        <div className="flex space-x-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditCategory(category);
                            }}
                            className="p-1 hover:bg-blue-100 rounded"
                          >
                            <Edit2 size={16} className="text-blue-500" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteCategory(category.id);
                            }}
                            className="p-1 hover:bg-red-100 rounded"
                          >
                            <Trash2 size={16} className="text-red-500" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Articles */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
            {selectedCategoryData ? (
              <>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-800">
                    Articles - {selectedCategoryData.name}
                  </h2>
                  <button
                    onClick={() => setIsAddingItem(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition"
                  >
                    <Plus size={20} />
                    <span>Nouvel Article</span>
                  </button>
                </div>

                {isAddingItem && (
                  <div className="mb-6 p-6 bg-gray-50 rounded-lg space-y-4">
                    <h3 className="font-semibold text-gray-700 mb-3">Ajouter un article</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="number"
                        value={newItem.code || ''}
                        onChange={(e) => setNewItem({ ...newItem, code: parseInt(e.target.value) })}
                        className="px-3 py-2 border rounded-lg"
                        placeholder="Code (optionnel)"
                      />
                      <input
                        type="text"
                        value={newItem.name}
                        onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                        className="px-3 py-2 border rounded-lg"
                        placeholder="Nom *"
                      />
                      <input
                        type="number"
                        value={newItem.price || ''}
                        onChange={(e) => setNewItem({ ...newItem, price: parseInt(e.target.value) })}
                        className="px-3 py-2 border rounded-lg"
                        placeholder="Prix (millimes)"
                      />
                      <input
                        type="text"
                        value={newItem.image}
                        onChange={(e) => setNewItem({ ...newItem, image: e.target.value })}
                        className="px-3 py-2 border rounded-lg"
                        placeholder="URL de l'image *"
                      />
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={handleAddItem}
                        className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                      >
                        <Save size={18} />
                        <span>Ajouter</span>
                      </button>
                      <button
                        onClick={() => {
                          setIsAddingItem(false);
                          setNewItem({ name: '', price: 0, image: '' });
                        }}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                      >
                        Annuler
                      </button>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[70vh] overflow-y-auto">
                  {selectedCategoryData.items.map((item, index) => (
                    <div key={index} className="border-2 border-gray-200 rounded-lg p-4 hover:border-amber-300 transition">
                      {editingItem?.name === item.name ? (
                        <div className="space-y-3">
                          <input
                            type="text"
                            value={editingItem.name}
                            onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                            className="w-full px-3 py-2 border rounded-lg"
                            placeholder="Nom"
                          />
                          <input
                            type="number"
                            value={editingItem.code || ''}
                            onChange={(e) => setEditingItem({ ...editingItem, code: parseInt(e.target.value) })}
                            className="w-full px-3 py-2 border rounded-lg"
                            placeholder="Code"
                          />
                          <input
                            type="number"
                            value={editingItem.price || ''}
                            onChange={(e) => setEditingItem({ ...editingItem, price: parseInt(e.target.value) })}
                            className="w-full px-3 py-2 border rounded-lg"
                            placeholder="Prix (millimes)"
                          />
                          <input
                            type="text"
                            value={editingItem.image}
                            onChange={(e) => setEditingItem({ ...editingItem, image: e.target.value })}
                            className="w-full px-3 py-2 border rounded-lg"
                            placeholder="URL de l'image"
                          />
                          <div className="flex space-x-2">
                            <button
                              onClick={handleSaveItem}
                              className="flex-1 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                            >
                              <Save size={18} className="inline" />
                            </button>
                            <button
                              onClick={() => setEditingItem(null)}
                              className="flex-1 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                            >
                              <X size={18} className="inline" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="aspect-video bg-gray-100 rounded-lg mb-3 overflow-hidden">
                            {item.image ? (
                              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <ImageIcon size={40} className="text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div className="space-y-1 mb-3">
                            <h3 className="font-semibold text-gray-800">{item.name}</h3>
                            {item.code && <p className="text-sm text-gray-500">Code: {item.code}</p>}
                            {item.price && (
                              <p className="text-amber-600 font-semibold">
                                {(item.price / 1000).toFixed(3)} TND
                              </p>
                            )}
                            {item.prices && (
                              <div className="text-sm text-amber-600 font-semibold">
                                <p>Said: {(item.prices.Said / 1000).toFixed(3)} TND</p>
                                <p>Nutella: {(item.prices.Nutella / 1000).toFixed(3)} TND</p>
                              </div>
                            )}
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEditItem(item)}
                              className="flex-1 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                            >
                              <Edit2 size={16} className="inline" />
                            </button>
                            <button
                              onClick={() => handleDeleteItem(item.name)}
                              className="flex-1 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                            >
                              <Trash2 size={16} className="inline" />
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-20">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">Sélectionnez une catégorie</h3>
                <p className="text-gray-500">Choisissez une catégorie pour voir et gérer ses articles</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
