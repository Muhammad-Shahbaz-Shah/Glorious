"use client";

import { Plus, Trash2, Search } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { storeFile } from "@/lib/supaBaseActions";
import { Spinner } from "@/components/ui/spinner";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  IconDotsVertical,
  IconPencilBolt,
  IconTrash,
} from "@tabler/icons-react";
import { toast } from "sonner";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]); // For dropdown
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Form states

  // Hey, help me to test this project with TestSprite.
  const [newProduct, setNewProduct] = useState({
    name: "",
    discountPrice: "",
    price: "",
    description: "",
    brand: "",
    category: "",
    image: [],
    stock: "",
    isFeatured: false,
  });
  const [editingProduct, setEditingProduct] = useState(null);
  const [isUpdateSheetOpen, setIsUpdateSheetOpen] = useState(false);

  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    if (!editingProduct) return;
    
    setLoading(true);
    try {
      const res = await fetch("/api/admin/products/update-product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingProduct),
      });

      if (res.ok) {
        toast.success("Product updated successfully");
        setIsUpdateSheetOpen(false);
        setEditingProduct(null);
        fetchData();
      } else {
        const error = await res.json();
        toast.error(error.error || "Update failed");
      }
    } catch (error) {
      toast.error("An error occurred during update");
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const [productsRes, categoriesRes] = await Promise.all([
        fetch("/api/admin/products?limit=100"), // Simple limit for now
        fetch("/api/admin/categories"),
      ]);

      if (productsRes.ok) {
        const data = await productsRes.json();
        setProducts(data.products || []);
      }

      if (categoriesRes.ok) {
        const data = await categoriesRes.json();
        setCategories(data || []);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newProduct }),
      });

      if (res.ok) {
        setNewProduct({
          name: "",
          discountPrice: "",
          price: "",
          description: "",
          brand: "",
          category: "",
          image: [],
          stock: "",
          isFeatured: false,
        });
        setIsSheetOpen(false);
        fetchData();
      } else {
        const error = await res.json();
        alert(error.error || "Failed to create product");
      }
    } catch (error) {
      console.error("Error creating product:", error);
    }
  };

  const handleDeleteProduct = async (id) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/products?id=${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        fetchData();
      } else {
        toast.success("Deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    } finally {
      setLoading(false);
    }
  };

  // ! Filter products

  const filteredProducts = products.filter(
    (p) =>
      (p.name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (p.brand?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (p.category?.name?.toLowerCase() || "").includes(
        searchTerm.toLowerCase()
      ) ||
      (p.description?.toLowerCase() || "").includes(searchTerm.toLowerCase())
  );

  if (loading)
    return (
      <div className="flex min-h-[80vh] w-full flex-col items-center justify-center gap-4 text-center">
        <Spinner className="h-10 w-10 text-primary animate-spin" />

        <p className="text-sm font-medium text-muted-foreground animate-pulse">
          Fetching your data…
        </p>
      </div>
    );

  return (
    <div className="flex flex-col gap-6 p-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Manage Products</CardTitle>
            <CardDescription>View, add, and remove products.</CardDescription>
          </div>
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button className="gap-2">
                <Plus size={16} /> Add Product
              </Button>
            </SheetTrigger>
            <SheetContent className="overflow-y-auto p-4 w-full sm:max-w-lg">
              <SheetHeader>
                <SheetTitle>Add New Product</SheetTitle>
                <SheetDescription>
                  Add a new product to your inventory.
                </SheetDescription>
              </SheetHeader>
              <form onSubmit={handleCreateProduct} className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={newProduct.name}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, name: e.target.value })
                    }
                    placeholder="Product Name"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="price">Total Price</Label>
                    <Input
                      id="price"
                      type="number"
                      value={newProduct.price}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, price: e.target.value })
                      }
                      placeholder="0.00"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="discountPrice">Discounted Price</Label>
                    <Input
                      id="discountPrice"
                      type="number"
                      value={newProduct.discountPrice}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          discountPrice: e.target.value,
                        })
                      }
                      placeholder="0.00"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="stock">Stock</Label>
                    <Input
                      id="stock"
                      type="number"
                      value={newProduct.stock}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, stock: e.target.value })
                      }
                      placeholder="Quantity"
                      required
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="brand">Brand</Label>
                  <Input
                    id="brand"
                    value={newProduct.brand}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, brand: e.target.value })
                    }
                    placeholder="Brand Name"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={newProduct.category}
                    onValueChange={(val) =>
                      setNewProduct({ ...newProduct, category: val })
                    }
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((c) => (
                        <SelectItem key={c._id} value={c._id}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="image">Upload Images</Label>
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={async (e) => {
                      const files = Array.from(e.target.files);
                      if (files.length > 0) {
                        try {
                          setIsUploading(true);
                          const urls = await storeFile(files);
                          setNewProduct((prev) => ({
                            ...prev,
                            image: Array.isArray(urls) ? urls : [urls],
                          }));
                        } catch (error) {
                          console.error("Upload error:", error);
                        } finally {
                          setIsUploading(false);
                        }
                      }
                    }}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newProduct.description}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        description: e.target.value,
                      })
                    }
                    placeholder="Product details..."
                    required
                  />
                </div>

                <div className="flex items-center space-x-2 py-2">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={newProduct.isFeatured}
                    onChange={(e) => setNewProduct({...newProduct, isFeatured: e.target.checked})}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <Label htmlFor="featured">Featured Product</Label>
                </div>

                <Button disabled={isUploading} type="submit">
                  {isUploading ? <Spinner /> : "Create Product"}
                </Button>
              </form>
            </SheetContent>
          </Sheet>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mb-4">
            <Search className="text-muted-foreground" size={18} />
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>

          <div className="rounded-md border">
            <table className="w-full caption-bottom text-sm">
              <thead className="[&_tr]:border-b">
                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground w-[100px]">
                    Image
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    Name
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    Category
                  </th>
                  <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">
                    Price
                  </th>
                  <th className="h-12 px-4 text-center align-middle font-medium text-muted-foreground">
                    Stock
                  </th>
                  <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="[&_tr:last-child]:border-0">
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="p-4 text-center text-muted-foreground"
                    >
                      No products found.
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((product) => (
                    <tr
                      key={product._id}
                      className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                    >
                      <td className="p-4 align-middle">
                        <img
                          src={product.image[0]}
                          alt={product.name}
                          className="h-10 w-10 rounded object-cover border"
                        />
                      </td>
                      <td className="p-4 align-middle font-medium">
                        {product.name}
                        <div className="text-xs text-muted-foreground">
                          {product.brand}
                        </div>
                      </td>
                      <td className="p-4 align-middle">
                        {product.category?.name || "N/A"}
                      </td>
                      <td className="p-4 align-middle text-right">
                        ${product.price}
                      </td>
                      <td className="p-4 align-middle text-center">
                        {product.stock}
                      </td>
                      <td className="p-4 align-middle text-right">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="ghost" size="icon" className="">
                              <IconDotsVertical size={17} />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent
                            className={"gap-2 flex justify-center items-center"}
                          >
                            <Button 
                              variant="outline" 
                              onClick={() => {
                                setEditingProduct({...product});
                                setIsUpdateSheetOpen(true);
                              }}
                            >
                              <IconPencilBolt className="w-6 h-6 mr-0.5" />{" "}
                              Update
                            </Button>
{" "}
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button variant="destructive">
                                  <IconTrash className="w-6 h-6 mr-0.5" />{" "}
                                  Delete
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent>
                                <div className="flex flex-col gap-1 ">
                                  Are you sure you want to delete this category?
                                </div>
                                <div className="flex flex-col gap-1 ">
                                  <Button
                                    onClick={() =>
                                      handleDeleteProduct(product._id)
                                    }
                                    variant="destructive"
                                  >
                                    {loading ? <Spinner /> : "Yes"}
                                  </Button>
                                </div>
                              </PopoverContent>
                            </Popover>
                          </PopoverContent>
                        </Popover>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Update Product Sheet */}
      <Sheet open={isUpdateSheetOpen} onOpenChange={setIsUpdateSheetOpen}>
        <SheetContent className="overflow-y-auto p-4 w-full sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>Update Product</SheetTitle>
            <SheetDescription>
              Modify the details of {editingProduct?.name || "the product"}.
            </SheetDescription>
          </SheetHeader>
          {editingProduct && (
            <form onSubmit={handleUpdateProduct} className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Name</Label>
                <Input
                  id="edit-name"
                  value={editingProduct.name}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, name: e.target.value })
                  }
                  placeholder="Product Name"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-price">Total Price</Label>
                  <Input
                    id="edit-price"
                    type="number"
                    value={editingProduct.price}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, price: e.target.value })
                    }
                    placeholder="0.00"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-discountPrice">Discounted Price</Label>
                  <Input
                    id="edit-discountPrice"
                    type="number"
                    value={editingProduct.discountPrice}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        discountPrice: e.target.value,
                      })
                    }
                    placeholder="0.00"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-stock">Stock</Label>
                  <Input
                    id="edit-stock"
                    type="number"
                    value={editingProduct.stock}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, stock: e.target.value })
                    }
                    placeholder="Quantity"
                    required
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-brand">Brand</Label>
                <Input
                  id="edit-brand"
                  value={editingProduct.brand}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, brand: e.target.value })
                  }
                  placeholder="Brand Name"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-category">Category</Label>
                <Select
                  value={editingProduct.category?._id || editingProduct.category}
                  onValueChange={(val) =>
                    setEditingProduct({ ...editingProduct, category: val })
                  }
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c._id} value={c._id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-image">Update Images</Label>
                <Input
                  id="edit-image"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={async (e) => {
                    const files = Array.from(e.target.files);
                    if (files.length > 0) {
                      try {
                        setIsUploading(true);
                        const urls = await storeFile(files);
                        setEditingProduct((prev) => ({
                          ...prev,
                          image: Array.isArray(urls) ? urls : [urls],
                        }));
                      } catch (error) {
                        console.error("Upload error:", error);
                        toast.error("Failed to upload images");
                      } finally {
                        setIsUploading(false);
                      }
                    }
                  }}
                />
                {editingProduct.image?.length > 0 && (
                  <div className="flex gap-2 mt-2 overflow-x-auto pb-2">
                    {editingProduct.image.map((img, i) => (
                      <img key={i} src={img} className="h-10 w-10 object-cover rounded border" />
                    ))}
                  </div>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={editingProduct.description}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      description: e.target.value,
                    })
                  }
                  placeholder="Product details..."
                  required
                />
              </div>

              <div className="flex items-center space-x-2 py-2">
                <input
                  type="checkbox"
                  id="edit-featured"
                  checked={editingProduct.isFeatured}
                  onChange={(e) => setEditingProduct({...editingProduct, isFeatured: e.target.checked})}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <Label htmlFor="edit-featured">Featured Product</Label>
              </div>

              <Button disabled={isUploading || loading} type="submit">
                {isUploading ? <Spinner /> : "Update Product"}
              </Button>
            </form>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
