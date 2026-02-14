"use client";

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
import { EmployeeService } from "@/services/employee.service";
import { Employee } from "@/types/entity/employee";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { MoreVertical, Package, Pencil, Search, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const EmployeePage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ["employees"],
    queryFn: () => EmployeeService.findAllEmployees(),
  });

  const deleteEmployeeMutation = useMutation({
    mutationKey: ["delete_employee"],
    mutationFn: (id: number) => EmployeeService.deleteEmployee(id),
    onSuccess: () => toast.success("Employee deleted successfully"),
    onError: () => toast.error("Failed to delete employee"),
    onSettled: async () => {
      return await queryClient.invalidateQueries({ queryKey: ["employees"] });
    },
  });

  return (
    <div className="p-8 space-y-6 flex-1">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Employee</h1>
          <p className="text-slate-600 mt-1">Manage your employee</p>
        </div>
        {/* <CreateCategoryModal
          isModalOpen={isCreateModalOpen}
          setIsModalOpen={setIsCreateModalOpen}
        /> */}
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <Input
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="w-full bg-white border rounded border-slate-200 shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-200">
            <TableRow>
              <TableHead className="w-[100px] px-6 py-4">ID</TableHead>
              <TableHead className="px-6 py-4">Category Name</TableHead>
              <TableHead className="px-6 py-4">Description</TableHead>
              <TableHead className="px-6 py-4">Image</TableHead>
              <TableHead className="w-[80px] text-right px-6 py-4">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12">
                  <div className="flex flex-col items-center justify-center text-slate-500">
                    <Package size={48} className="mb-4 text-slate-300" />
                    <p className="font-medium">No Employees found</p>
                    <p className="text-sm mt-1">
                      {searchQuery
                        ? "Try adjusting your search"
                        : "Get started by adding an employee"}
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              data?.map((employee: Employee) => (
                <TableRow key={employee.id} className="hover:bg-slate-50">
                  <TableCell className="font-mono text-slate-600 px-6 py-4">
                    {employee.id}
                  </TableCell>
                  <TableCell className="font-semibold text-slate-900 px-6 py-4">
                    {employee.name}
                  </TableCell>
                  <TableCell className="text-slate-600 px-6 py-4">
                    {employee.email}
                  </TableCell>
                  <TableCell className="text-slate-600 px-6 py-4">
                    {employee.phone}
                  </TableCell>
                  <TableCell className="text-slate-600 px-6 py-4">
                    {employee.role}
                  </TableCell>
                  <TableCell className="text-slate-600 px-6 py-4">
                    {employee.isActive}
                  </TableCell>
                  <TableCell className="text-right px-6 py-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical size={16} />
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />

                        <DropdownMenuItem
                          onClick={() => {
                            setIsUpdateModalOpen(true);
                          }}
                          onSelect={(e) => e.preventDefault()}
                        >
                          <Pencil size={16} className="mr-2" />
                          Edit
                        </DropdownMenuItem>
                        {/* <UpdateCategoryModal
                          isModalOpen={isUpdateModalOpen}
                          setIsModalOpen={setIsUpdateModalOpen}
                          category={category}
                        /> */}

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
                                  deleteEmployeeMutation.mutate(employee.id!)
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
    </div>
  );
};

export default EmployeePage;
