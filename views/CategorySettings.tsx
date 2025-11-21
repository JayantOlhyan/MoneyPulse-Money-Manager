import React, { useState } from 'react';
import { ArrowLeft, Check, Trash2, Plus } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { Category, TransactionType, ViewState } from '../types';
import { AVAILABLE_ICONS, AVAILABLE_COLORS } from '../constants';

interface CategorySettingsProps {
  categories: Category[];
  onUpdateCategories: (newCategories: Category[]) => void;
  onBack: () => void;
}

export const CategorySettings: React.FC<CategorySettingsProps> = ({ categories, onUpdateCategories, onBack }) => {
  const [selectedType, setSelectedType] = useState<TransactionType>(TransactionType.EXPENSE);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Form state
  const [editName, setEditName] = useState('');
  const [editIcon, setEditIcon] = useState('');
  const [editColor, setEditColor] = useState('');

  const filteredCategories = categories.filter(c => c.type === selectedType);

  const handleStartEdit = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      setEditName(category.name);
      setEditIcon(category.icon);
      setEditColor(category.color);
    } else {
      // New Category
      setEditingCategory(null);
      setEditName('');
      setEditIcon(AVAILABLE_ICONS[0]);
      setEditColor(AVAILABLE_COLORS[0]);
    }
    setIsEditing(true);
  };

  const handleSave = () => {
    if (!editName.trim()) return;

    let updatedCategories = [...categories];

    if (editingCategory) {
      // Update existing
      updatedCategories = updatedCategories.map(c => 
        c.id === editingCategory.id 
          ? { ...c, name: editName, icon: editIcon, color: editColor }
          : c
      );
    } else {
      // Create new
      const newCategory: Category = {
        id: Date.now().toString(),
        name: editName,
        icon: editIcon,
        color: editColor,
        type: selectedType
      };
      updatedCategories.push(newCategory);
    }

    onUpdateCategories(updatedCategories);
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (!editingCategory) return;
    const updatedCategories = categories.filter(c => c.id !== editingCategory.id);
    onUpdateCategories(updatedCategories);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="min-h-full bg-[#121212] text-white flex flex-col animate-slide-up">
        <div className="bg-[#1A1A1A] p-4 border-b border-gray-800 flex items-center justify-between">
          <button onClick={() => setIsEditing(false)} className="text-gray-400 hover:text-white">
             <ArrowLeft size={24} />
          </button>
          <h2 className="font-semibold">{editingCategory ? 'Edit Category' : 'New Category'}</h2>
          <button onClick={handleSave} className="text-[#FF5252] font-bold">
             Save
          </button>
        </div>

        <div className="p-6 space-y-6">
           {/* Preview */}
           <div className="flex justify-center mb-6">
              <div className="flex flex-col items-center gap-2">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center transition-colors duration-300" style={{ backgroundColor: editColor }}>
                      {(() => {
                          const Icon = (LucideIcons as any)[editIcon || 'HelpCircle'];
                          return <Icon size={32} className="text-white" />;
                      })()}
                  </div>
                  <span className="font-medium text-lg">{editName || 'Category Name'}</span>
              </div>
           </div>

           {/* Name Input */}
           <div className="space-y-2">
              <label className="text-xs text-gray-500 uppercase font-bold">Name</label>
              <input 
                type="text" 
                value={editName} 
                onChange={e => setEditName(e.target.value)}
                className="w-full bg-[#1E1E1E] text-white p-3 rounded-xl border border-gray-700 focus:border-[#FF5252] outline-none"
                placeholder="Enter name"
              />
           </div>

           {/* Colors */}
           <div className="space-y-2">
              <label className="text-xs text-gray-500 uppercase font-bold">Color</label>
              <div className="grid grid-cols-8 gap-3">
                 {AVAILABLE_COLORS.map(color => (
                    <button 
                        key={color}
                        onClick={() => setEditColor(color)}
                        className={`w-8 h-8 rounded-full transition-transform ${editColor === color ? 'scale-110 ring-2 ring-white' : 'opacity-80'}`}
                        style={{ backgroundColor: color }}
                    />
                 ))}
              </div>
           </div>

           {/* Icons */}
           <div className="space-y-2">
              <label className="text-xs text-gray-500 uppercase font-bold">Icon</label>
              <div className="grid grid-cols-6 gap-3 h-48 overflow-y-auto pr-2">
                 {AVAILABLE_ICONS.map(icon => {
                    const Icon = (LucideIcons as any)[icon];
                    return (
                        <button
                            key={icon}
                            onClick={() => setEditIcon(icon)}
                            className={`aspect-square rounded-lg flex items-center justify-center transition-colors ${editIcon === icon ? 'bg-[#FF5252] text-white' : 'bg-[#1E1E1E] text-gray-400 hover:bg-gray-800'}`}
                        >
                            <Icon size={20} />
                        </button>
                    )
                 })}
              </div>
           </div>

           {editingCategory && (
             <button onClick={handleDelete} className="w-full py-3 mt-4 flex items-center justify-center gap-2 text-red-500 bg-red-500/10 rounded-xl hover:bg-red-500/20 transition-colors">
                <Trash2 size={18} /> Delete Category
             </button>
           )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-full bg-[#121212] text-white pb-24 animate-slide-left">
      {/* Header */}
      <div className="sticky top-0 z-20 flex items-center gap-3 p-4 bg-[#1A1A1A] border-b border-gray-800 shadow-md">
        <button onClick={onBack} className="p-1 text-gray-400 hover:text-white transition-colors">
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-lg font-semibold">Category Settings</h2>
      </div>

      {/* Tabs */}
      <div className="flex p-2 bg-[#1A1A1A]">
         <button 
            onClick={() => setSelectedType(TransactionType.EXPENSE)}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${selectedType === TransactionType.EXPENSE ? 'bg-[#FF5252] text-white' : 'text-gray-400'}`}
         >
            Expense
         </button>
         <button 
            onClick={() => setSelectedType(TransactionType.INCOME)}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${selectedType === TransactionType.INCOME ? 'bg-[#4CAF50] text-white' : 'text-gray-400'}`}
         >
            Income
         </button>
      </div>

      {/* List */}
      <div className="p-4 space-y-2">
         {filteredCategories.map(cat => {
            const Icon = (LucideIcons as any)[cat.icon || 'HelpCircle'];
            return (
                <div key={cat.id} className="flex items-center justify-between bg-[#1E1E1E] p-3 rounded-xl border border-gray-800">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center text-white" style={{ backgroundColor: cat.color }}>
                            <Icon size={20} />
                        </div>
                        <span className="font-medium">{cat.name}</span>
                    </div>
                    <button onClick={() => handleStartEdit(cat)} className="px-4 py-1.5 bg-gray-800 text-xs font-medium rounded-lg hover:bg-gray-700 transition-colors">
                        Edit
                    </button>
                </div>
            );
         })}

         <button 
            onClick={() => handleStartEdit()} 
            className="w-full py-4 border border-dashed border-gray-700 rounded-xl text-gray-500 flex items-center justify-center gap-2 hover:bg-gray-900 transition-colors mt-4"
         >
            <Plus size={20} /> Add Custom Category
         </button>
      </div>
    </div>
  );
};