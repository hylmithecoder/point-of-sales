"use client";

import CreateProductModal from "@/components/features/adminpage/product/create-product-modal";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { CategoryService } from "@/services/category.service";
import { ProductService } from "@/services/product.service";
import { Category } from "@/types/entity/category";
import { Product } from "@/types/entity/product";
import { useQuery } from "@tanstack/react-query";
import { MoreVertical, Package } from "lucide-react";
import { useState } from "react";

type MenuItem = {
  id: number;
  name: string;
  sku: string;
  category: string;
  price: number;
  stock: number;
  image?: string;
  description?: string;
};

const dummyMenuItems: MenuItem[] = [
  {
    id: 1,
    name: "Cheeseburger",
    sku: "BUR001",
    category: "Food",
    price: 50000,
    stock: 20,
    image: "/images/burger.jpg",
    description: "Delicious cheeseburger with fresh ingredients",
  },
  {
    id: 2,
    name: "Coke",
    sku: "DRK001",
    category: "Drink",
    price: 15000,
    stock: 50,
    image: "/images/coke.jpg",
    description: "Refreshing cold drink",
  },
];

const ProductManagementPage = () => {
  const [search, setSearch] = useState("");
  const [menuItems, setMenuItems] = useState<MenuItem[]>(dummyMenuItems);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

  const filteredItems = menuItems.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase()),
  );

  const { data } = useQuery({
    queryKey: ["products"],
    queryFn: () => ProductService.findAllProducts(),
  });

  return (
    <div className="p-8 space-y-6 flex-1 w-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Product Management
          </h1>
          <p className="text-slate-600 mt-1">Manage your menu items</p>
        </div>
        <CreateProductModal
          isModalOpen={isCreateModalOpen}
          setIsModalOpen={setIsCreateModalOpen}
        />
      </div>

      <div className="flex items-center gap-4 max-w-md">
        <Input
          placeholder="Search product..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="w-full bg-white border rounded border-slate-200 shadow-sm overflow-x-auto">
        <Table>
          <TableHeader className="bg-slate-200">
            <TableRow>
              <TableHead className="px-6 py-3">ID</TableHead>
              <TableHead className="px-6 py-3">Name</TableHead>
              <TableHead className="px-6 py-3">SKU</TableHead>
              <TableHead className="px-6 py-3">Description</TableHead>
              <TableHead className="px-6 py-3">Price</TableHead>
              <TableHead className="px-6 py-3">Category</TableHead>
              <TableHead className="px-6 py-3">Image</TableHead>
              <TableHead className="px-6 py-3 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12">
                  <div className="flex flex-col items-center justify-center text-slate-500">
                    <Package size={48} className="mb-4 text-slate-300" />
                    <p className="font-medium">No product found</p>
                    Get started by adding a product
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              data?.map((product: Product) => (
                <TableRow key={product.id} className="hover:bg-slate-50">
                  <TableCell className="font-mono text-slate-600 px-6 py-4">
                    {product.id}
                  </TableCell>
                  <TableCell className="font-semibold text-slate-900 px-6 py-4">
                    {product.name}
                  </TableCell>
                  <TableCell className="text-slate-600 px-6 py-4">
                    {product.sku}
                  </TableCell>
                  <TableCell className="text-slate-600 px-6 py-4">
                    {product.description}
                  </TableCell>
                  <TableCell className="text-slate-600 px-6 py-4">
                    {product.price}
                  </TableCell>
                  <TableCell className="text-slate-600 px-6 py-4">
                    {product.category.name}
                  </TableCell>
                  <TableCell className=" px-6 py-4">
                    <img
                      src={
                        product.image?.url
                          ? `${process.env.NEXT_PUBLIC_API_URL}${product.image.url}`
                          : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSljKrqphYckKY5BewuAI5AFjnwORv5Mtxl7w&s"
                      }
                      alt={product.image?.altText || "category image"}
                      className="h-16 w-16 object-cover rounded"
                    />
                  </TableCell>
                  <TableCell className="px-6 py-3 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => {
                            setOpenDetail(true);
                          }}
                        >
                          Detail
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setOpenEdit(true);
                          }}
                        >
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-500">
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* MODALS */}
      {selectedItem && (
        <EditProductModal
          open={openEdit}
          setOpen={setOpenEdit}
          item={selectedItem}
        />
      )}
      {selectedItem && (
        <DetailProductModal
          open={openDetail}
          setOpen={setOpenDetail}
          item={selectedItem}
        />
      )}
    </div>
  );
};

export default ProductManagementPage;

/* ---------------- ADD MODAL ---------------- */

/* ---------------- EDIT MODAL ---------------- */
const EditProductModal = ({
  open,
  setOpen,
  item,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
  item: MenuItem;
}) => {
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: () => CategoryService.findAllCategories(),
  });
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
          <DialogDescription>Update product details</DialogDescription>
        </DialogHeader>

        <form className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Product Name</Label>
            <Input id="name" defaultValue={item.name} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sku">SKU</Label>
            <Input id="sku" defaultValue={item.sku} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select defaultValue={item.category}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {categories?.map((category: Category, index: number) => {
                    return (
                      <SelectItem key={index} value={category.id!.toString()}>
                        {category.name}
                      </SelectItem>
                    );
                  })}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Price</Label>
            <Input type="number" id="price" defaultValue={item.price} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="stock">Stock</Label>
            <Input type="number" id="stock" defaultValue={item.stock} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Product Image</Label>
            <Input type="file" id="image" accept="image/*" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" defaultValue={item.description} />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

/* ---------------- DETAIL MODAL ---------------- */
const DetailProductModal = ({
  open,
  setOpen,
  item,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
  item: MenuItem;
}) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Product Detail</DialogTitle>
          <DialogDescription>
            Complete information about the product
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <img
            src={item.image}
            alt={item.name}
            className="h-40 w-full object-cover rounded"
          />
          <p>
            <strong>Name:</strong> {item.name}
          </p>
          <p>
            <strong>SKU:</strong> {item.sku}
          </p>
          <p>
            <strong>Category:</strong> {item.category}
          </p>
          <p>
            <strong>Price:</strong> Rp {item.price.toLocaleString("id-ID")}
          </p>
          <p>
            <strong>Description:</strong> {item.description}
          </p>
        </div>

        <DialogFooter>
          <Button onClick={() => setOpen(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
