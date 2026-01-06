'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FiltersProps {
    categories: any[];
    onFilterChange: (filters: FilterState) => void;
}

export interface FilterState {
    categoryId: string;
    minPrice: number;
    maxPrice: number;
    sortBy: string;
}

export default function Filters({ categories, onFilterChange }: FiltersProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [filters, setFilters] = useState<FilterState>({
        categoryId: '',
        minPrice: 0,
        maxPrice: 10000,
        sortBy: 'name',
    });

    const handleFilterChange = (key: keyof FilterState, value: any) => {
        const newFilters = { ...filters, [key]: value };
        setFilters(newFilters);
        onFilterChange(newFilters);
    };

    return (
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between w-full text-[#2C1810] font-semibold"
            >
                <span>Filtres</span>
                {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>

            {isOpen && (
                <div className="mt-4 space-y-4">
                    {/* Catégories */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Catégorie
                        </label>
                        <select
                            value={filters.categoryId}
                            onChange={(e) => handleFilterChange('categoryId', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#2C1810]"
                        >
                            <option value="">Toutes les catégories</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Prix */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Prix
                        </label>
                        <div className="flex gap-2 items-center">
                            <input
                                type="number"
                                placeholder="Min"
                                value={filters.minPrice || ''}
                                onChange={(e) => handleFilterChange('minPrice', parseInt(e.target.value) || 0)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#2C1810]"
                            />
                            <span>-</span>
                            <input
                                type="number"
                                placeholder="Max"
                                value={filters.maxPrice || ''}
                                onChange={(e) => handleFilterChange('maxPrice', parseInt(e.target.value) || 10000)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#2C1810]"
                            />
                        </div>
                    </div>

                    {/* Tri */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Trier par
                        </label>
                        <select
                            value={filters.sortBy}
                            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#2C1810]"
                        >
                            <option value="name">Nom (A-Z)</option>
                            <option value="price-asc">Prix croissant</option>
                            <option value="price-desc">Prix décroissant</option>
                            <option value="newest">Plus récents</option>
                        </select>
                    </div>

                    {/* Reset */}
                    <button
                        onClick={() => {
                            const defaultFilters = {
                                categoryId: '',
                                minPrice: 0,
                                maxPrice: 10000,
                                sortBy: 'name',
                            };
                            setFilters(defaultFilters);
                            onFilterChange(defaultFilters);
                        }}
                        className="w-full text-sm text-[#8B6F47] hover:text-[#2C1810] font-medium"
                    >
                        Réinitialiser les filtres
                    </button>
                </div>
            )}
        </div>
    );
}