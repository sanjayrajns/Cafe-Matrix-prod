import { useState, useEffect } from "react";
import { Plus, Trash2, Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { orderCategories } from "@/data/orderMenuData";

interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  image_url: string | null;
  available: boolean;
  featured: boolean;
}

const AdminMenuItems = () => {
  const { toast } = useToast();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [newItem, setNewItem] = useState({
    name: "",
    price: "",
    category: "",
    image_url: "",
  });

  const fetchMenuItems = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("menu_items")
        .select("*")
        .order("category", { ascending: true })
        .order("name", { ascending: true });

      if (error) throw error;
      setMenuItems(data || []);
    } catch (error) {
      console.error("Error fetching menu items:", error);
      toast({ title: "Failed to load menu items", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.name || !newItem.price || !newItem.category) {
      toast({ title: "Please fill all required fields", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("menu_items").insert({
        name: newItem.name.trim(),
        price: parseFloat(newItem.price),
        category: newItem.category,
        image_url: newItem.image_url.trim() || null,
        available: true,
        featured: false,
      });

      if (error) throw error;

      toast({ title: "Menu item added successfully!" });
      setNewItem({ name: "", price: "", category: "", image_url: "" });
      setIsAddDialogOpen(false);
      fetchMenuItems();
    } catch (error) {
      console.error("Error adding menu item:", error);
      toast({ title: "Failed to add menu item", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteItem = async (id: string) => {
    try {
      const { error } = await supabase
        .from("menu_items")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({ title: "Menu item deleted" });
      fetchMenuItems();
    } catch (error) {
      console.error("Error deleting menu item:", error);
      toast({ title: "Failed to delete menu item", variant: "destructive" });
    }
  };

  const toggleAvailability = async (id: string, available: boolean) => {
    try {
      const { error } = await supabase
        .from("menu_items")
        .update({ available: !available })
        .eq("id", id);

      if (error) throw error;

      setMenuItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, available: !available } : item
        )
      );
    } catch (error) {
      console.error("Error updating availability:", error);
      toast({ title: "Failed to update item", variant: "destructive" });
    }
  };

  const filteredItems = menuItems.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const getCategoryLabel = (categoryId: string) => {
    return orderCategories.find((c) => c.id === categoryId)?.label || categoryId;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="font-display text-2xl text-foreground">Menu Management</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="hero">
              <Plus className="w-4 h-4 mr-2" />
              Add Item
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Menu Item</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddItem} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="itemName">Item Name *</Label>
                <Input
                  id="itemName"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  placeholder="e.g., Margherita Pizza"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="itemPrice">Price (₹) *</Label>
                <Input
                  id="itemPrice"
                  type="number"
                  min="0"
                  step="1"
                  value={newItem.price}
                  onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                  placeholder="e.g., 199"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="itemCategory">Category *</Label>
                <Select
                  value={newItem.category}
                  onValueChange={(value) => setNewItem({ ...newItem, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {orderCategories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="itemImage">Image URL (optional)</Label>
                <Input
                  id="itemImage"
                  type="url"
                  value={newItem.image_url}
                  onChange={(e) => setNewItem({ ...newItem, image_url: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <Button type="submit" variant="hero" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Adding..." : "Add Item"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {orderCategories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Items List */}
      {filteredItems.length === 0 ? (
        <div className="bg-card rounded-xl p-8 text-center">
          <p className="text-muted-foreground">
            {menuItems.length === 0
              ? "No menu items yet. Add your first item!"
              : "No items match your search."}
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-card rounded-xl p-4 flex items-center gap-4 shadow-soft"
            >
              {item.image_url && (
                <img
                  src={item.image_url}
                  alt={item.name}
                  className="w-16 h-16 rounded-lg object-cover"
                />
              )}
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-foreground truncate">{item.name}</h3>
                <p className="text-sm text-muted-foreground">{getCategoryLabel(item.category)}</p>
              </div>
              <p className="text-primary font-semibold">₹{item.price}</p>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={item.available}
                    onCheckedChange={() => toggleAvailability(item.id, item.available)}
                  />
                  <span className="text-xs text-muted-foreground hidden sm:inline">
                    {item.available ? "Available" : "Unavailable"}
                  </span>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Menu Item</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete "{item.name}"? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDeleteItem(item.id)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="text-sm text-muted-foreground text-center">
        Total: {filteredItems.length} items
      </p>
    </div>
  );
};

export default AdminMenuItems;
