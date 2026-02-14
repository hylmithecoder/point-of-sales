import { AlertDialogHeader } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Textarea } from "@/components/ui/textarea";
import { CategoryService } from "@/services/category.service";
import { ProductService } from "@/services/product.service";
import { Category } from "@/types/entity/category";
import { Product } from "@/types/entity/product";
import { ProductRequest } from "@/types/payload/request/product.request";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";

type EditProductModalProps = {
  isModalOpen: boolean;
  setIsModalOpen: (isModalOpen: boolean) => void;
  product: Product;
};

export const EditProductModal = ({
  isModalOpen,
  setIsModalOpen,
  product,
}: EditProductModalProps) => {
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: () => CategoryService.findAllCategories(),
  });

  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(ProductRequest),
    mode: "onSubmit",
    defaultValues: {
      name: product.name,
      sku: product.sku,
      // categoryId: product.category.id,
      price: product.price,
      description: product.description,
    },
  });

  React.useEffect(() => {
    if (product) {
      reset({
        name: product.name,
        sku: product.sku,
        // categoryId: product.category.id,
        price: product.price,
        image: undefined,
        description: product.description,
      });
    }
  }, [product, reset]);

  const updateProductMutation = useMutation({
    mutationKey: ["update_product"],
    mutationFn: (data: FormData) =>
      ProductService.updateProduct(product.id!, data),
    onSuccess: () => {
      toast.success("Product updated successfully");
      setIsModalOpen(false);
      reset();
    },
    onError: () => toast.error("Failed to update product"),
    onSettled: async () => {
      return await queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  const onSubmit: SubmitHandler<ProductRequest> = (data) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("sku", data.sku);
    formData.append("description", data.description || "");
    formData.append("price", data.price.toString());
    formData.append("category", data.categoryId.toString());
    formData.append("isAvailable", "1");
    if (data.image?.length) {
      formData.append("images", data.image[0]);
    }

    formData.append("token", sessionStorage.getItem("session_token")!);
    formData.append("_method", "PUT");

    updateProductMutation.mutate(formData);
  };
  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogContent>
        <AlertDialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
          <DialogDescription>Update product details</DialogDescription>
        </AlertDialogHeader>

        <form className="space-y-4 py-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-2">
            <Label htmlFor="name">Product Name</Label>
            <Input
              id="name"
              placeholder="e.g., Cheeseburger"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Optional description"
              {...register("description")}
            />
            {errors.description && (
              <p className="text-red-500">{errors.description.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="sku">SKU</Label>
            <Input id="sku" placeholder="e.g., BUR001" {...register("sku")} />
            {errors.sku && <p className="text-red-500">{errors.sku.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="categoryId">Category</Label>
            <Controller
              name="categoryId"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={(value) => field.onChange(Number(value))}
                  value={field.value?.toString() || ""}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {categories?.data.map((category: Category) => (
                        <SelectItem
                          key={category.id}
                          value={category.id!.toString()}
                        >
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.categoryId && (
              <p className="text-red-500">{errors.categoryId.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Price</Label>
            <Input
              type="number"
              id="price"
              placeholder="e.g., 50000"
              {...register("price", { valueAsNumber: true })}
            />
            {errors.price && (
              <p className="text-red-500">{errors.price.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Product Image</Label>

            <Input
              type="file"
              id="image"
              accept="image/*"
              {...register("image")}
            />

            {product.imageUrl && (
              <img
                src={
                  product.imageUrl
                    ? `${process.env.NEXT_PUBLIC_API_URL}/uploads/${product.imageUrl}`
                    : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSljKrqphYckKY5BewuAI5AFjnwORv5Mtxl7w&s"
                }
                alt={product.name}
                className="h-16 w-16 object-cover rounded-md border"
              />
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={updateProductMutation.isPending}>
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
