import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CategoryService } from "@/services/category.service";
import { Category } from "@/types/entity/category";
import { CategoryRequest } from "@/types/payload/request/category.request";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";

type UpdateCategoryModalProps = {
  isModalOpen: boolean;
  setIsModalOpen: (isModalOpen: boolean) => void;
  category: Category;
};

const UpdateCategoryModal = ({
  isModalOpen,
  setIsModalOpen,
  category,
}: UpdateCategoryModalProps) => {
  const queryClient = useQueryClient();

  const updateCategoryMutation = useMutation({
    mutationKey: ["update_category"],
    mutationFn: (data: FormData) =>
      CategoryService.updateCategory(category.id!, data),
    onSuccess: () => {
      toast.success("Category updated successfully");
      setIsModalOpen(false);
    },
    onError: () => toast.error("Failed to update category"),
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CategoryRequest>({
    resolver: zodResolver(CategoryRequest),
    mode: "onSubmit",
    defaultValues: {
      name: category.name,
      description: category.description,
      image: category.image,
    },
  });

  useEffect(() => {
    reset({
      name: category.name,
      description: category.description,
    });
    const fileInput = document.getElementById("image") as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  }, [category, reset]);

  const onSubmit: SubmitHandler<CategoryRequest> = (data) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);

    const fileInput = data.image?.[0];
    if (fileInput) {
      formData.append("image", fileInput);
    }

    updateCategoryMutation.mutate(formData);
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Category</DialogTitle>
          <DialogDescription>Update category information</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="edit-name">Category Name</Label>
            <Input id="edit-name" {...register("name")} />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-description">Description</Label>
            <Textarea id="edit-description" {...register("description")} />
            {errors.description && (
              <p className="text-sm text-red-500">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Category Image</Label>

            {/* Preview current image */}
            {category.image?.url && (
              <img
                src={`${process.env.NEXT_PUBLIC_API_URL}${category.image.url}`}
                alt={category.image.altText || "Current category image"}
                className="h-24 w-24 object-cover mb-2 rounded"
              />
            )}

            {/* Input for new file */}
            <Input
              id="image"
              type="file"
              accept="image/*"
              {...register("image")}
            />

            {errors.image && (
              <p className="text-sm text-red-500">
                {errors.image.message as string}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateCategoryModal;
