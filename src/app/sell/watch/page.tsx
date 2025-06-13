"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import WatchForm from "@/components/forms/WatchForm";
import { useToast } from "@/components/ui/use-toast";
import { Check } from "lucide-react";

const steps = [
  {
    id: 1,
    name: "Watch Details",
    description: "Basic information about your watch",
  },
  {
    id: 2,
    name: "Condition & Price",
    description: "Specify condition and set your price",
  },
  {
    id: 3,
    name: "Photos & Documents",
    description: "Add photos and supporting documents",
  },
];

export default function SellWatchPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      // Create FormData to handle file uploads
      const formData = new FormData();

      // Add all form fields to FormData
      Object.keys(data).forEach((key) => {
        if (key === "images" || key === "documents") {
          // Handle files separately
          return;
        }
        if (key === "diameter") {
          formData.append("diameter", JSON.stringify(data[key]));
        } else {
          formData.append(key, data[key]);
        }
      });

      // Add images
      data.images.forEach((image: File) => {
        formData.append("images", image);
      });

      // Add documents if any
      if (data.documents?.length > 0) {
        data.documents.forEach((doc: File) => {
          formData.append("documents", doc);
        });
      }

      // Send to API
      const response = await fetch("/api/listings", {
        method: "POST",
        body: formData,
      });

      const responseData = await response.json();

      if (!response.ok) {
        if (
          responseData.error === "Listing quota exceeded for this subscription"
        ) {
          toast({
            title: "Error",
            description:
              "You have reached the maximum number of listings for your subscription. Please upgrade to a higher plan.",
            variant: "destructive",
          });
          return;
        }
        throw new Error(responseData.error || "Failed to create listing");
      }

      router.push("/sell/success");
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to create listing. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
      <main className="container py-4 sm:py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-4 sm:mb-12">
            <h1 className="text-2xl sm:text-4xl font-bold tracking-tight mb-2 sm:mb-4">
              List a Watch for Sale
            </h1>
            <p className="text-muted-foreground text-sm sm:text-lg">
              Complete the information below to create your listing
            </p>
          </div>

          {/* Stepper */}
          <div className="mb-8">
            <nav aria-label="Progress">
              <ol role="list" className="space-y-4 md:flex md:space-x-8 md:space-y-0">
                {steps.map((step, index) => (
                  <li key={step.id} className="md:flex-1">
                    <div className="group flex flex-col border-l-4 border-primary py-2 pl-4 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4">
                      <span className="text-sm font-medium text-primary">{step.name}</span>
                      <span className="text-sm text-muted-foreground">{step.description}</span>
                    </div>
                  </li>
                ))}
              </ol>
            </nav>
          </div>

          <WatchForm onSubmit={onSubmit} isSubmitting={isSubmitting} />
        </div>
      </main>
  );
}
