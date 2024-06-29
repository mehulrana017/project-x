import React, { forwardRef, useImperativeHandle, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormField,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Textarea } from "../ui/textarea";
import { toast } from "../ui/use-toast";

const productSchema = z.object({
  name: z.string().min(1, "Please enter the product name."),
  description: z.string().min(1, "Please enter product description."),
  price: z.string().min(1, "Please enter product price."),
  rating: z.string().min(0).max(5).optional(),
  images: z.string().min(1, "Please enter a valid URL."),
  category: z.string().min(1, "Please enter the product category."),
  stock: z.string().min(1, "Please enter product stock."),
  numOfReviews: z.number().optional(),
  reviews: z
    .array(
      z.object({
        name: z.string().min(1, "Please enter reviewer's name."),
        rating: z.number().min(1).max(5, "Rating must be between 1 and 5."),
        comment: z.string().min(1, "Please enter review comment."),
      })
    )
    .optional(),
});

const AddDialog = forwardRef((props, ref) => {
  const [isOpen, setIsOpen] = useState(false);

  useImperativeHandle(ref, () => ({
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
  }));

  const methods = useForm({
    resolver: zodResolver(productSchema),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = methods;

  const onSubmit = async (data) => {
    const res = await fetch("http://localhost:3000/api/v1/product/new", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (res?.ok) {
      toast({
        title: "Status",
        description: "Furniture Added.",
      });
      setIsOpen(false)
    } 
    toast({
        title: "Status",
        description: res.statusText,
      });
      setIsOpen(false)
    // Handle form submission, e.g., send data to API
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogTitle>Add Product</DialogTitle>
        <DialogDescription>
          Fill out the form below to add a new product.
        </DialogDescription>
        <Form {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <FormField
              control={control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Product Name" {...field} />
                  </FormControl>
                  {errors.name && (
                    <FormMessage>{errors.name.message}</FormMessage>
                  )}
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Product Description" {...field} />
                  </FormControl>
                  {errors.name && (
                    <FormMessage>{errors.description.message}</FormMessage>
                  )}
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Product Price"
                      {...field}
                    />
                  </FormControl>
                  {errors.price && (
                    <FormMessage>{errors.price.message}</FormMessage>
                  )}
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Input placeholder="Product Category" {...field} />
                  </FormControl>
                  {errors.category && (
                    <FormMessage>{errors.category.message}</FormMessage>
                  )}
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="stock"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stock</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Product Stock"
                      {...field}
                    />
                  </FormControl>
                  {errors.stock && (
                    <FormMessage>{errors.stock.message}</FormMessage>
                  )}
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="images"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Images</FormLabel>
                  <FormControl>
                    <Input placeholder="Image URL" {...field} />
                  </FormControl>
                  {errors.images && (
                    <FormMessage>{errors.images.message}</FormMessage>
                  )}
                </FormItem>
              )}
            />
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
});

export default AddDialog;
