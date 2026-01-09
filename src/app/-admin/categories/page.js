"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
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
import { ArrowUpRightIcon, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, Cell, LabelList, XAxis } from "recharts";

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { supabase } from "@/lib/supabaseClient";
import {
  IconCardsFilled,
  IconDotsVertical,
  IconPencilBolt,
  IconTrash,
} from "@tabler/icons-react";
import Link from "next/link";
import { toast } from "sonner";
import { storeFile } from "@/lib/supaBaseActions";
import { Spinner } from "@/components/ui/spinner";
import { useRouter } from "next/navigation";
// imports ending here

// bar chart config
const chartConfig = {
  count: {
    label: "Count",
    color: "var(--chart-1)",
  },
};

const GREEN_BARS = [
  "#065F46",
  "#047857",
  "#059669",
  "#10B981",
  "#34D399",
  "#6EE7B7",
  "#A7F3D0",
  "#14532D",
  "#166534",
  "#15803D",
  "#16A34A",
  "#22C55E",
  "#4ADE80",
  "#86EFAC",
  "#BBF7D0",
];
// config ends here

// main function of the page
export default function CategoriesPage() {
  // initilazing router
  const router  = useRouter()

  // states
  const [chartData, setChartData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingCat, setUpdatingCat] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [creatingCat, setCreatingCat] = useState(false);

  const [newCategory, setNewCategory] = useState({
    name: "",
    image: "",
    description: "",
    company: [],
  });
  const [editingCategory, setEditingCategory] = useState(null);
  const [isUpdateSheetOpen, setIsUpdateSheetOpen] = useState(false);

  // a functions that fetch stats and all categories for management

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsRes, categoriesRes] = await Promise.all([
        fetch("/api/admin/get-categories-stats"),
        fetch("/api/admin/categories"),
      ]);

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setChartData(statsData);
      }

      if (categoriesRes.ok) {
        const categoriesData = await categoriesRes.json();
        setCategories(categoriesData);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  // function ends here

  useEffect(() => {
    fetchData();
  }, []);

  // a function that creates a new category
  const handleCreateCategory = async (e) => {
    e.preventDefault();
    setCreatingCat(true)
    try {
      const imageUrl = await storeFile(imageFile);
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newCategory, image: imageUrl }),
      });

      if (res.ok) {
        setNewCategory({ name: "", image: "", description: "", company: [] });
        setImageFile(null);
        setIsSheetOpen(false);
        fetchData(); // Refresh data
      } else {
        const error = await res.json();
        toast.error(error.error || "Failed to create category");
      }
    } catch (error) {
      toast.error("Failed to create category");
    }finally{
      setCreatingCat(false)
    }
  };

  // ends here

  // this function delets the specific category
  const handleDeleteCategory = async (category) => {
    try {
      const imageUrl = category.image;
      const res = await fetch(`/api/admin/categories?id=${category._id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("Category deleted successfully");
        fetchData(); // Refresh data
      } else {
        toast.error("Failed to delete category");
      }
    } catch (error) {
      toast.error("Failed to delete category");
    }
  };

  // this function update the category
  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    if (!editingCategory) return;
    
    setUpdatingCat(true)
    try {
      let imageUrl = editingCategory.image;

      if (imageFile && typeof imageFile !== 'string') {
        imageUrl = await storeFile(imageFile);
      }
      
      const res = await fetch("/api/admin/categories/update-category", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...editingCategory, image: imageUrl }),
      });
      if (res.ok) {
        toast.success("Category updated successfully");
        setImageFile(null);
        setIsUpdateSheetOpen(false);
        setEditingCategory(null);
        fetchData();
      } else {
        const error = await res.json();
        toast.error(error.error || "Failed to update category");
      }
    } catch (error) {
      console.error("Update error:", error);
      toast.error("An error occurred during update");
    } finally {
        setUpdatingCat(false)
    }
  };

  if (loading) 
    return  <div className="flex min-h-[80vh] w-full flex-col items-center justify-center gap-4 text-center">
            <Spinner className="h-10 w-10 text-primary animate-spin" />
    
            <p className="text-sm font-medium text-muted-foreground animate-pulse">
              Fetching your data…
            </p>
          </div>

  return (
    <div className="flex flex-col gap-6 p-4">
      {/* Chart Section */}
      <Card>
        <CardHeader>
          <CardTitle>Category Statistics</CardTitle>
          <CardDescription>Products distribution by category</CardDescription>
        </CardHeader>

        <CardContent>
          <ChartContainer config={chartConfig} className="h-[360px] w-full">
            <BarChart
              accessibilityLayer
              data={chartData}
              margin={{ top: 30, left: 10, right: 10, bottom: 60 }}
            >
              <CartesianGrid vertical={false} />

              <XAxis
                dataKey="name"
                tickLine={false}
                axisLine={false}
                interval={0}
                angle={-35}
                textAnchor="end"
                height={60}
                tickFormatter={(value) =>
                  value && value.length > 12 ? `${value.slice(0, 12)}…` : value || ""
                }
              />

              <ChartTooltip
                cursor={{ fill: "hsl(var(--muted))" }}
                content={
                  <ChartTooltipContent
                    formatter={(value) => [`${value}`, " Products"]}
                  />
                }
              />

              <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                {chartData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={GREEN_BARS[index % GREEN_BARS.length]}
                  />
                ))}

                <LabelList
                  dataKey="count"
                  position="top"
                  className="fill-foreground text-xs font-medium"
                />
              </Bar>
            </BarChart>
          </ChartContainer>
        </CardContent>

        <CardFooter className="text-sm text-muted-foreground">
          Showing total products per category
        </CardFooter>
      </Card>

      {/* Management Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Manage Categories</CardTitle>
            <CardDescription>View, add, and remove categories.</CardDescription>
          </div>
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button className="gap-2">
                <Plus size={16} /> Add Category
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Add New Category</SheetTitle>
                <SheetDescription>
                  Create a new product category here.
                </SheetDescription>
              </SheetHeader>
              <form
                onSubmit={(e) => handleCreateCategory(e)}
                className="grid p-5 gap-4"
              >
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={newCategory.name}
                    onChange={(e) =>
                      setNewCategory({ ...newCategory, name: e.target.value })
                    }
                    placeholder="e.g., Electronics"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="image"> Select Image </Label>
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setImageFile(file);
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setNewCategory((prev) => ({
                            ...prev,
                            image: reader.result,
                          }));
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={newCategory.description}
                    onChange={(e) =>
                      setNewCategory({
                        ...newCategory,
                        description: e.target.value,
                      })
                    }
                    placeholder="Short description"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="company">Enter brands name you have</Label>
                  <Input
                    id="company"
                    value={newCategory.company}
                    onChange={(e) => {
                      const arr = e.target.value.split(",");
                      setNewCategory({
                        ...newCategory,
                        company: arr,
                      });
                    }}
                    placeholder="e.g Nike, Adidas, Puma, etc. sepreted by comma"
                    required
                  />
                </div>
                <Button disabled={creatingCat} type="submit">
                  {creatingCat ? <Spinner /> : "Create Category"}
                </Button>
              </form>
            </SheetContent>
          </Sheet>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <table className="w-full caption-bottom text-sm">
              <thead className="[&_tr]:border-b">
                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    Name
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground hidden md:table-cell">
                    Description
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    Image
                  </th>
                  <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="[&_tr:last-child]:border-0">
                {categories.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="p-4 text-center text-muted-foreground"
                    >
                      <div className="flex justify-center w-full">
                        <Empty>
                          <EmptyHeader>
                            <EmptyMedia variant="icon">
                              <IconCardsFilled />
                            </EmptyMedia>
                            <EmptyTitle>No Categories Found</EmptyTitle>
                            <EmptyDescription>
                              We couldn't find any categories at the moment.
                              Please check back later.
                            </EmptyDescription>
                          </EmptyHeader>
                          <Button
                            variant="link"
                            asChild
                            className="text-muted-foreground"
                            size="sm"
                          >
                            <Link href="/contact">
                              Contact Us{" "}
                              <ArrowUpRightIcon className="w-4 h-4 ml-1" />
                            </Link>
                          </Button>
                        </Empty>
                      </div>
                    </td>
                  </tr>
                ) : (
                  categories.map((category) => (
                    
                      <tr
                      key={category._id}
                      onClick={() => router.push(`/categories/${category._id}`)}
                        className="border-b cursor-pointer transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                      >
                        <td className="p-4 align-middle font-medium">
                          {category.name}
                        </td>
                        <td className="p-4 align-middle hidden md:table-cell">
                          {category.description}
                        </td>
                        <td className="p-4 align-middle">
                          <img
                            src={category.image}
                            alt={category.name}
                            className="h-10 w-10 rounded object-cover border"
                          />
                        </td>
                        <td className="p-4 align-middle text-right">
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button variant="ghost" size="icon" className="">
                                <IconDotsVertical size={17} />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent>
                              <div className="flex flex-col gap-1">
                                    <Button 
                                      variant="outline"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setEditingCategory({...category});
                                        setIsUpdateSheetOpen(true);
                                      }}
                                    >
                                      <IconPencilBolt className="w-6 h-6 mr-0.5" />{" "}
                                      Update
                                    </Button>

                                <Popover>
                                  <PopoverTrigger asChild>
                                    <Button variant="destructive">
                                      <IconTrash className="w-6 h-6 mr-0.5" />{" "}
                                      Delete
                                    </Button>
                                  </PopoverTrigger>
                                  <PopoverContent>
                                    <div className="flex flex-col gap-1 ">
                                      Are you sure you want to delete this
                                      category?
                                    </div>
                                    <div className="flex flex-col gap-1 ">
                                      <Button
                                        onClick={() =>
                                          handleDeleteCategory(category)
                                        }
                                        variant="destructive"
                                      >
                                        <IconTrash className="w-6 h-6 mr-0.5" />{" "}
                                        Yes
                                      </Button>
                                    </div>
                                  </PopoverContent>
                                </Popover>
                              </div>
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

      {/* Update Category Sheet */}
      <Sheet open={isUpdateSheetOpen} onOpenChange={setIsUpdateSheetOpen}>
        <SheetContent side="right" className="overflow-y-auto w-full sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>Update Category</SheetTitle>
            <SheetDescription>
              Modify the details for {editingCategory?.name || "the category"}.
            </SheetDescription>
          </SheetHeader>
          {editingCategory && (
            <form onSubmit={handleUpdateCategory} className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Name</Label>
                <Input
                  id="edit-name"
                  value={editingCategory.name}
                  onChange={(e) =>
                    setEditingCategory({ ...editingCategory, name: e.target.value })
                  }
                  placeholder="e.g., Electronics"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-image">Select Image</Label>
                <Input
                  id="edit-image"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setImageFile(file);
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setEditingCategory((prev) => ({
                          ...prev,
                          image: reader.result,
                        }));
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
                {editingCategory.image && (
                  <img src={editingCategory.image} className="h-20 w-20 object-cover rounded mt-2 border" />
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-description">Description</Label>
                <Input
                  id="edit-description"
                  value={editingCategory.description}
                  onChange={(e) =>
                    setEditingCategory({
                      ...editingCategory,
                      description: e.target.value,
                    })
                  }
                  placeholder="Short description"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-company">Brands (comma separated)</Label>
                <Input
                  id="edit-company"
                  value={Array.isArray(editingCategory.company) ? editingCategory.company.join(", ") : editingCategory.company || ""}
                  onChange={(e) => {
                    const arr = e.target.value.split(",").map(i => i.trim());
                    setEditingCategory({
                      ...editingCategory,
                      company: arr,
                    });
                  }}
                  placeholder="e.g Nike, Adidas, Puma"
                  required
                />
              </div>
              <Button disabled={updatingCat} type="submit">
                {updatingCat ? <Spinner /> : "Save Changes"}
              </Button>
            </form>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
