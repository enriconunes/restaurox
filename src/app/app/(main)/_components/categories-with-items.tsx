'use client'

import { useState } from 'react'
import { Pencil, Trash2, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { RestaurantData } from '@/app/types'
import AddNewItemModal from './add-new-item-modal'

interface CategoriesWithItemsProps {
  data: RestaurantData | null;
}

export default function CategoriesWithItems({ data }: CategoriesWithItemsProps) {
  const [categories, setCategories] = useState(
    data?.itemCategories.map((category) => ({
      ...category,
      isEditing: false,
    })) || []
  );

  const handleEdit = (categoryId: string) => {
    setCategories(categories.map(category => 
      category.id === categoryId ? { ...category, isEditing: true } : category
    ));
  };

  const handleSave = (categoryId: string) => {
    setCategories(categories.map(category => 
      category.id === categoryId ? { ...category, isEditing: false } : category
    ));
  };

  const handleDelete = (categoryId: string) => {
    console.log('Category deleted:', categories.find(c => c.id === categoryId)?.name);
    // Implement actual delete logic here
  };

  const handleNameChange = (categoryId: string, newName: string) => {
    setCategories(categories.map(category => 
      category.id === categoryId ? { ...category, name: newName } : category
    ));
  };

  const handleAddItem = (categoryId: string, newItem: any) => {
    setCategories(categories.map(category => 
      category.id === categoryId
        ? { ...category, items: [...category.items, { ...newItem, id: Date.now().toString() }] }
        : category
    ));
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-6 space-y-6">
      {categories.map((category) => (
        <Card key={category.id} className="bg-background text-foreground">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            {category.isEditing ? (
              <Input
                value={category.name}
                onChange={(e) => handleNameChange(category.id, e.target.value)}
                className="font-semibold text-lg"
              />
            ) : (
              <CardTitle>{category.name}</CardTitle>
            )}
            <div className="flex space-x-2">
              {category.isEditing ? (
                <>
                  <Button size="icon" variant="ghost" onClick={() => handleSave(category.id)}>
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => handleDelete(category.id)}>
                    <Trash2 className="h-4 w-4 text-red-700" />
                  </Button>
                </>
              ) : (
                <Button size="icon" variant="ghost" onClick={() => handleEdit(category.id)}>
                  <Pencil className="h-4 w-4" />
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <AddNewItemModal onAddItem={(newItem: any) => handleAddItem(category.id, newItem)} />
            {category.items.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-4 flex items-center space-x-4">
                  <div className="w-16 h-16 flex-shrink-0">
                    <img
                      src={item.imageUrl || "https://utfs.io/f/1af4aa51-b003-476c-9c1d-d5d9b491058e-801omg.jpg"}
                      alt={item.name}
                      className="w-full h-full object-cover rounded"
                    />
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                    <p className="text-sm font-medium">{item.price}</p>
                  </div>
                  <Button size="icon" variant="ghost">
                    <Pencil className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}