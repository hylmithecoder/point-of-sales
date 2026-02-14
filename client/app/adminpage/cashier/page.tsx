"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { CategoryService } from "@/services/category.service";
import { ProductService } from "@/services/product.service";
import { Category } from "@/types/entity/category";
import { Product } from "@/types/entity/product";
import { useQuery } from "@tanstack/react-query";
import {
  Check,
  CheckCircle,
  Clock,
  Loader2,
  Minus,
  Plus,
  QrCode,
  SearchIcon,
  ShoppingCart,
  Trash2,
  Wallet,
  XCircle,
} from "lucide-react";
import React from "react";

interface CartItems extends Product {
  quantity: number;
}

const Page = () => {
  const [selectedCategory, setSelectedCategory] =
    React.useState<string>("Sushi");
  const [paymentMethod, setPaymentMethod] = React.useState<"cash" | "qris">(
    "cash",
  );
  const [status, setStatus] = React.useState("new");
  const [showCalculator, setShowCalculator] = React.useState(false);
  const [cashAmount, setCashAmount] = React.useState("");
  const [displayValue, setDisplayValue] = React.useState("0");

  const statusOptions = [
    {
      value: "new",
      label: "New",
      color: "text-blue-600",
      icon: <Clock className="w-4 h-4" />,
    },
    {
      value: "pending",
      label: "Pending",
      color: "text-yellow-600",
      icon: <Loader2 className="w-4 h-4 animate-spin" />,
    },
    {
      value: "confirmed",
      label: "Confirmed",
      color: "text-green-600",
      icon: <CheckCircle className="w-4 h-4" />,
    },
    {
      value: "in_progress",
      label: "In Progress",
      color: "text-indigo-600",
      icon: <Loader2 className="w-4 h-4 animate-spin" />,
    },
    {
      value: "ready",
      label: "Ready",
      color: "text-teal-600",
      icon: <CheckCircle className="w-4 h-4" />,
    },
    {
      value: "served",
      label: "Served",
      color: "text-purple-600",
      icon: <CheckCircle className="w-4 h-4" />,
    },
    {
      value: "completed",
      label: "Completed",
      color: "text-green-800",
      icon: <CheckCircle className="w-4 h-4" />,
    },
    {
      value: "cancelled",
      label: "Cancelled",
      color: "text-red-600",
      icon: <XCircle className="w-4 h-4" />,
    },
  ];

  const [cartItems, setCartItems] = React.useState<CartItems[]>([]);

  const orders = [
    {
      id: "T6",
      name: "Mr. Willy",
      items: "2 items",
      status: "Ready",
      statusColor: "bg-emerald-500",
      details: "Ready to serve",
      color: "bg-emerald-100",
      textColor: "text-emerald-700",
    },
    {
      id: "T10",
      name: "Mr. Willy",
      items: "2 items",
      status: "Ready",
      statusColor: "bg-emerald-500",
      details: "Ready to serve",
      color: "bg-emerald-100",
      textColor: "text-emerald-700",
    },
    {
      id: "T7",
      name: "Mrs. Jane",
      items: "2 items",
      status: "Cooking",
      statusColor: "bg-blue-500",
      details: "In the kitchen",
      color: "bg-blue-100",
      textColor: "text-blue-700",
    },
    {
      id: "T8",
      name: "Mrs. Aishy",
      items: "2 items",
      status: "In progress",
      statusColor: "bg-amber-500",
      details: "In the kitchen",
      color: "bg-amber-100",
      textColor: "text-amber-700",
    },
    {
      id: "T9",
      name: "Mr. John",
      items: "3 items",
      status: "In progress",
      statusColor: "bg-amber-500",
      details: "Preparing",
      color: "bg-amber-100",
      textColor: "text-amber-700",
    },
  ];

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  const updateQty = (id: number, newQty: number) => {
    if (newQty === 0) {
      setCartItems(cartItems.filter((item) => item.id !== id));
    } else {
      setCartItems(
        cartItems.map((item) =>
          item.id === id ? { ...item, quantity: newQty } : item,
        ),
      );
    }
  };

  const colors = [
    "bg-orange-500",
    "bg-emerald-500",
    "bg-purple-500",
    "bg-green-500",
    "bg-red-500",
    "bg-pink-500",
    "bg-amber-500",
    "bg-cyan-500",
  ];

  const removeItem = (id: number) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  const addToCart = (product: Product) => {
    const existingItemIndex = cartItems.findIndex(
      (item) => item.id === product.id,
    );

    if (existingItemIndex > -1) {
      const updatedCart = [...cartItems];
      updatedCart[existingItemIndex].quantity += 1;
      setCartItems(updatedCart);
    } else {
      const newItem: CartItems = {
        ...product,
        quantity: 1,
      };
      setCartItems([...cartItems, newItem]);
    }
  };

  const handleProcessPayment = () => {
    if (paymentMethod === "cash") {
      setShowCalculator(true);
      setDisplayValue("0");
      setCashAmount("");
    } else {
      // Handle QRIS payment
      alert("Processing QRIS payment...");
    }
  };

  const handleCalculatorClick = (value: string) => {
    if (value === "C") {
      setDisplayValue("0");
      setCashAmount("");
    } else if (value === "⌫") {
      if (displayValue.length > 1) {
        setDisplayValue(displayValue.slice(0, -1));
        setCashAmount(displayValue.slice(0, -1));
      } else {
        setDisplayValue("0");
        setCashAmount("");
      }
    } else {
      const newValue = displayValue === "0" ? value : displayValue + value;
      setDisplayValue(newValue);
      setCashAmount(newValue);
    }
  };

  const quickAmounts = [
    { label: "Exact", value: total },
    { label: "50K", value: 50000 },
    { label: "100K", value: 100000 },
    { label: "200K", value: 200000 },
  ];

  const handleQuickAmount = (amount: number) => {
    setDisplayValue(amount.toString());
    setCashAmount(amount.toString());
  };

  const calculatorButtons = [
    "7",
    "8",
    "9",
    "4",
    "5",
    "6",
    "1",
    "2",
    "3",
    "C",
    "0",
    "⌫",
  ];

  const cashValue = parseFloat(cashAmount) || 0;
  const change = cashValue - total;

  const handleConfirmPayment = () => {
    if (cashValue >= total) {
      alert(`Payment confirmed! Change: Rp ${change.toLocaleString("id-ID")}`);
      setShowCalculator(false);
      setCartItems([]);
      setDisplayValue("0");
      setCashAmount("");
    } else {
      alert("Insufficient amount!");
    }
  };

  const { data: products } = useQuery({
    queryKey: ["products"],
    queryFn: () => ProductService.findAllProducts(),
  });

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: () => CategoryService.findAllCategories(),
  });

  return (
    <>
      <div className="flex flex-col xl:flex-row gap-3 sm:gap-4 xl:gap-x-5">
        <div className="space-y-6 flex-1">
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
                Active Orders
              </h2>
              <Select>
                <SelectTrigger className="w-full sm:max-w-xs shadow-2xl">
                  <SelectValue placeholder="Select order status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Status</SelectLabel>
                    {statusOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center gap-2">
                          {option.icon}
                          <span>{option.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <ScrollArea className="w-full max-w-[100%] sm:max-w-lg md:max-w-xl lg:max-w-2xl xl:max-w-6xl pb-2 rounded-md whitespace-nowrap">
              <div className="flex w-max gap-4">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="flex-shrink-0 bg-white border border-slate-200 rounded-xl p-4 hover:shadow-md transition-shadow min-w-80"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`${order.color} ${order.textColor} w-12 h-12 rounded-lg flex items-center justify-center font-bold text-lg shadow-sm`}
                        >
                          {order.id}
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-900">
                            {order.name}
                          </h3>
                          <p className="text-xs text-slate-500">
                            {order.items}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <Badge
                        className={`${order.statusColor} text-white text-xs px-3 py-1`}
                      >
                        <Check size={12} className="mr-1" />
                        {order.status}
                      </Badge>
                      <span className="text-xs text-slate-500">
                        {order.details}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>

          <div className="space-y-4">
            <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
              Categories
            </h2>
            <ScrollArea className="w-full max-w-full lg:max-w-6xl pb-2 rounded-md">
              <div className="grid grid-flow-col auto-cols-[160px] gap-3">
                {categories?.map((category: Category, index: number) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.name)}
                    className={`${colors[index % colors.length]} rounded-xl p-4 text-center text-white font-medium transition-all transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg ${
                      selectedCategory === category.name
                        ? "ring-4 ring-blue-300 ring-offset-2"
                        : ""
                    }`}
                  >
                    <div className="flex justify-center mb-2">
                      <img
                        src={
                          category.image?.url
                            ? `${process.env.NEXT_PUBLIC_API_URL}${category.image.url}`
                            : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSljKrqphYckKY5BewuAI5AFjnwORv5Mtxl7w&s"
                        }
                        alt={category.image?.altText || "category image"}
                        className="h-16 w-16 object-cover rounded"
                      />
                    </div>
                    <p className="text-sm font-semibold truncate">
                      {category.name}
                    </p>
                  </button>
                ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>

          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
                Menu
              </h2>
              <div className="relative w-full sm:max-w-sm">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input placeholder="Search Menu..." className="pl-10" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 md:gap-5">
              {products?.map((product: Product) => (
                <div
                  key={product.id}
                  className="bg-white/80 backdrop-blur rounded-2xl p-4 shadow hover:shadow-lg transition-all"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={
                        product.image?.url
                          ? `${process.env.NEXT_PUBLIC_API_URL}${product.image.url}`
                          : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSljKrqphYckKY5BewuAI5AFjnwORv5Mtxl7w&s"
                      }
                      alt={product.name}
                      className="w-24 h-20 sm:w-28 sm:h-24 rounded-xl object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate">{product.name}</p>
                      <p className="text-sm text-slate-500">
                        {product.category.name}
                      </p>
                      <p className="font-bold mt-1">
                        Rp {product.price.toLocaleString("id-ID")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-x-3 mt-4">
                    <Select>
                      <SelectTrigger className="w-full rounded-xl border border-slate-300 bg-white">
                        <SelectValue placeholder="Select Variant" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Variant</SelectLabel>
                          <SelectItem value="askdbjasd">kadbskjbads</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>

                    <button
                      className="w-10 h-10 shrink-0 rounded-xl bg-blue-600 text-white"
                      onClick={() => addToCart(product)}
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div
          className="
            w-full
            xl:w-[25rem]
            xl:sticky xl:right-8 xl:top-16
            h-auto xl:h-screen
            bg-white
            border-t xl:border-l border-slate-200
            flex flex-col shadow-xl
          "
        >
          <div className="border-b border-slate-200 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 flex-shrink-0">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                Checkout
              </h2>
              {cartItems.length > 0 && (
                <Badge className="bg-blue-600 text-white px-3 py-1">
                  {cartItems.length} item{cartItems.length !== 1 ? "s" : ""}
                </Badge>
              )}
            </div>
            <p className="text-sm text-slate-600">
              Review your order before checkout
            </p>
          </div>

          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full p-3 sm:p-5">
              <div className="space-y-3">
                {cartItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-64 text-center">
                    <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                      <ShoppingCart size={32} className="text-slate-400" />
                    </div>
                    <p className="text-slate-500 font-medium">Cart is empty</p>
                    <p className="text-sm text-slate-400 mt-1">
                      Add items to get started
                    </p>
                  </div>
                ) : (
                  cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="bg-slate-50 border border-slate-200 rounded-xl p-4 hover:bg-slate-100 transition-colors"
                    >
                      <div className="flex gap-4">
                        <img
                          src={
                            item.image?.url
                              ? `${process.env.NEXT_PUBLIC_API_URL}${item.image.url}`
                              : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSljKrqphYckKY5BewuAI5AFjnwORv5Mtxl7w&s"
                          }
                          alt={item.name}
                          className="w-20 h-20 rounded-lg object-cover flex-shrink-0 border border-slate-200"
                        />

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <p className="font-bold text-slate-900 leading-tight">
                                {item.name}
                              </p>
                              <p className="text-xs text-slate-500 mt-1">
                                {/* {item.variant} */}
                                Large
                              </p>
                            </div>
                            <button
                              onClick={() => removeItem(item.id!)}
                              className="text-slate-400 hover:text-red-500 transition-colors flex-shrink-0 ml-2 p-1 hover:bg-red-50 rounded"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>

                          <div className="flex items-center justify-between">
                            <p className="text-sm font-bold text-blue-600">
                              Rp {item.price.toLocaleString("id-ID")}
                            </p>

                            <div className="flex items-center gap-2 bg-white border border-slate-300 rounded-lg px-1 py-1">
                              <button
                                onClick={() =>
                                  updateQty(item.id, item.quantity - 1)
                                }
                                className="w-7 h-7 flex items-center justify-center rounded hover:bg-slate-100 transition-colors text-slate-700"
                              >
                                <Minus size={14} />
                              </button>
                              <span className="text-sm font-bold text-slate-900 min-w-[24px] text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  updateQty(item.id, item.quantity + 1)
                                }
                                className="w-7 h-7 flex items-center justify-center rounded hover:bg-slate-100 transition-colors text-slate-700"
                              >
                                <Plus size={14} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </div>

          {cartItems.length > 0 && (
            <div className="border-t border-slate-200 p-6 space-y-4 bg-slate-50 flex-shrink-0">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">
                  Payment Method
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setPaymentMethod("cash")}
                    className={`
                  flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-all
                  ${
                    paymentMethod === "cash"
                      ? "border-blue-600 bg-blue-50 text-blue-700"
                      : "border-slate-300 bg-white text-slate-700 hover:border-slate-400"
                  }
                `}
                  >
                    <Wallet size={18} />
                    <span className="font-semibold">Cash</span>
                  </button>
                  <button
                    onClick={() => setPaymentMethod("qris")}
                    className={`
                  flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-all
                  ${
                    paymentMethod === "qris"
                      ? "border-blue-600 bg-blue-50 text-blue-700"
                      : "border-slate-300 bg-white text-slate-700 hover:border-slate-400"
                  }
                `}
                  >
                    <QrCode size={18} />
                    <span className="font-semibold">QRIS</span>
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Subtotal</span>
                  <span className="font-semibold text-slate-900">
                    Rp {subtotal.toLocaleString("id-ID")}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Tax (10%)</span>
                  <span className="font-semibold text-slate-900">
                    Rp {tax.toLocaleString("id-ID")}
                  </span>
                </div>

                <div className="border-t border-slate-300 pt-2 flex justify-between items-center">
                  <span className="font-bold text-slate-900">Total</span>
                  <span className="text-xl font-bold text-blue-600">
                    Rp {total.toLocaleString("id-ID")}
                  </span>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button variant="destructive" className="flex-1 h-12">
                  Cancel
                </Button>
                <Button className="flex-1 h-12" onClick={handleProcessPayment}>
                  Process Payment
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      <Dialog open={showCalculator} onOpenChange={setShowCalculator}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              Process Payment
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="bg-slate-200 p-4 rounded-lg border ">
              <p className="text-sm text-slate-600 mb-1">Total Amount</p>
              <p className="text-2xl font-bold">
                Rp {total.toLocaleString("id-ID")}
              </p>
            </div>

            <div className="bg-slate-100 p-4 rounded-lg border-2 border-slate-300">
              <p className="text-sm text-slate-600 mb-1">Cash Received</p>
              <p className="text-3xl font-bold text-slate-900 text-right">
                Rp {parseFloat(displayValue || "0").toLocaleString("id-ID")}
              </p>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {quickAmounts.map((item) => (
                <button
                  key={item.label}
                  onClick={() => handleQuickAmount(item.value)}
                  className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-lg font-semibold text-sm transition-colors"
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-2">
              {calculatorButtons.map((btn) => (
                <button
                  key={btn}
                  onClick={() => handleCalculatorClick(btn)}
                  className={`
                    h-14 rounded-lg font-bold text-lg transition-all
                    ${
                      btn === "C"
                        ? "bg-slate-600 hover:bg-salte-700 text-white"
                        : btn === "⌫"
                          ? "bg-red-500 hover:bg-red-600 text-white"
                          : "bg-slate-200 hover:bg-slate-300 text-slate-900"
                    }
                  `}
                >
                  {btn}
                </button>
              ))}
            </div>

            <div className="rounded-xl border px-4 py-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide">
                    Change
                  </p>
                  <p className="mt-0.5 text-2xl font-semibold">
                    {cashValue >= total
                      ? `Rp ${change.toLocaleString("id-ID")}`
                      : "-"}
                  </p>
                </div>
                <div
                  className={cn(
                    "h-9 w-9 rounded-full flex items-center justify-center text-white text-sm font-bold",
                    cashValue >= total ? "bg-green-500" : "bg-red-500",
                  )}
                >
                  {cashValue >= total ? "✓" : "×"}
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowCalculator(false)}
              >
                Cancel
              </Button>
              <Button
                className="flex-1"
                onClick={handleConfirmPayment}
                disabled={cashValue < total}
              >
                Confirm Payment
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Page;
