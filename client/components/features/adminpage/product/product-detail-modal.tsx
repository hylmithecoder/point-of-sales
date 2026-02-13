import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Product } from "@/types/entity/product";

type ProductDetailModalProps = {
  isModalOpen: boolean;
  setIsModalOpen: (isModalOpen: boolean) => void;
  product: Product;
};

export const ProductDetailModal = ({
  isModalOpen,
  setIsModalOpen,
  product,
}: ProductDetailModalProps) => {
  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Product Detail</DialogTitle>
          <DialogDescription>
            Complete information about the product
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <img
            src={
              product.image?.url
                ? `${process.env.NEXT_PUBLIC_API_URL}${product.image.url}`
                : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSljKrqphYckKY5BewuAI5AFjnwORv5Mtxl7w&s"
            }
            alt={product.name}
            className="h-40 w-full object-cover rounded"
          />
          <p>
            <strong>Name:</strong> {product.name}
          </p>
          <p>
            <strong>SKU:</strong> {product.sku}
          </p>
          <p>
            <strong>Category:</strong> {product.category.name}
          </p>
          <p>
            <strong>Price:</strong> Rp {product.price.toLocaleString("id-ID")}
          </p>
          <p>
            <strong>Description:</strong> {product.description}
          </p>
        </div>

        <DialogFooter>
          <Button onClick={() => setIsModalOpen(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
