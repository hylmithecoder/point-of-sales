import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CategoryService } from "@/services/category.service";
import { CategoryRequest } from "@/types/payload/request/category.request";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";

type CreateCategoryModalProps = {
  isModalOpen: boolean;
  setIsModalOpen: (isModalOpen: boolean) => void;
};

const CreateCategoryModal = ({
  isModalOpen,
  setIsModalOpen,
}: CreateCategoryModalProps) => {
  const queryClient = useQueryClient();

  const createCategoryMutation = useMutation({
    mutationKey: ["create_category"],
    mutationFn: (data: FormData) => CategoryService.createCategory(data),
    onSuccess: () => toast.success("Category created successfully"),
    onError: (e) => toast.error(e.message),
    onSettled: async () => {
      return await queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(CategoryRequest),
    mode: "onSubmit",
  });

  const onSubmit: SubmitHandler<CategoryRequest> = (data) => {
    const formData = new FormData();

    formData.append("name", data.name);
    formData.append("description", data.description);

    if (data.images && data.images.length > 0) {
      formData.append("images", data.images[0]);
    }

    const token = sessionStorage.getItem("session_token");
    if (token) {
      formData.append("token", token);
    }

    createCategoryMutation.mutate(formData);
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus size={18} />
          Add Category
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Category</DialogTitle>
          <DialogDescription>
            Create a new category for your products
          </DialogDescription>
        </DialogHeader>

        {/* ⬇️ FORM WRAPPER */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Category Name</Label>
            <Input
              id="name"
              {...register("name")}
              placeholder="e.g., Beverages"
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Brief description of the category"
            />
            {errors.description && (
              <p className="text-sm text-red-500">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Category Image</Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              {...register("images")}
            />
            {errors.images && (
              <p className="text-sm text-red-500">
                {errors.images.message as string}
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
            <Button type="submit" disabled={createCategoryMutation.isPending}>
              {createCategoryMutation.isPending ? "Saving..." : "Add Category"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCategoryModal;
