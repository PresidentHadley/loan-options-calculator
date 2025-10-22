"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface CopyButtonProps {
  text: string;
  label?: string;
  className?: string;
  variant?: "default" | "outline" | "ghost" | "link" | "destructive" | "secondary";
  size?: "default" | "sm" | "lg" | "icon";
}

export function CopyButton({ 
  text, 
  label = "Copy", 
  className,
  variant = "default",
  size = "sm"
}: CopyButtonProps) {
  const { toast } = useToast();

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Link copied to clipboard",
    });
  };

  return (
    <Button 
      onClick={handleCopy} 
      variant={variant} 
      size={size}
      className={className}
    >
      {label}
    </Button>
  );
}

