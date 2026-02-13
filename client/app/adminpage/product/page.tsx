"use client";

import CreateProductModal from "@/components/features/adminpage/product/create-product-modal";
import { ProductDetailModal } from "@/components/features/adminpage/product/product-detail-modal";
import { EditProductModal } from "@/components/features/adminpage/product/update-product-modal";
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
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ProductService } from "@/services/product.service";
import { Product } from "@/types/entity/product";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Eye, MoreVertical, Package, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const ProductManagementPage = () => {
  const [search, setSearch] = useState("");
  const queryClient = useQueryClient();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Product | null>(null);

  const { data } = useQuery({
    queryKey: ["products"],
    queryFn: () => ProductService.findAllProducts(),
  });

  const deleteProductMutation = useMutation({
    mutationKey: ["delete_product"],
    mutationFn: (id: number) => ProductService.deleteProduct(id),
    onSuccess: () => {
      toast.success("Product deleted successfully");
    },
    onError: () => toast.error("Failed to delete product"),
    onSettled: async () => {
      return await queryClient.invalidateQueries({ queryKey: ["products"] });
    },
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
                            setSelectedItem(product);
                          }}
                        >
                          <Eye size={16} className="mr-2" />
                          Detail
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setOpenEdit(true);
                            setSelectedItem(product);
                          }}
                        >
                          <Pencil size={16} className="mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem
                              className="text-red-600 focus:text-red-600"
                              onSelect={(e) => e.preventDefault()}
                            >
                              <Trash2 size={16} className="mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </AlertDialogTrigger>

                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Are you absolutely sure?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will
                                permanently delete this category from our
                                servers.
                              </AlertDialogDescription>
                            </AlertDialogHeader>

                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() =>
                                  deleteProductMutation.mutate(product.id!)
                                }
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {selectedItem && (
        <EditProductModal
          isModalOpen={openEdit}
          setIsModalOpen={setOpenEdit}
          product={selectedItem}
        />
      )}
      {selectedItem && (
        <ProductDetailModal
          isModalOpen={openDetail}
          setIsModalOpen={setOpenDetail}
          product={selectedItem}
        />
      )}
    </div>
  );
};

export default ProductManagementPage;
