"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button-variants";
import { RefreshCw } from "lucide-react";
import { generatePodcast } from "@/lib/actions/podcast";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

export function GeneratePodcastButton() {
  const [generating, setGenerating] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const result = await generatePodcast();
      toast({
        title: "Podcast generated!",
        description: "Your daily podcast is being created. This may take a few minutes.",
      });
      router.refresh();
    } catch (error) {
      console.error("Failed to generate podcast:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate podcast. Please try again.",
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
    }
  };

  return (
    <Button
      variant="outline"
      onClick={handleGenerate}
      disabled={generating}
    >
      <RefreshCw className={`h-5 w-5 mr-2 ${generating ? 'animate-spin' : ''}`} />
      {generating ? "Generating..." : "Generate"}
    </Button>
  );
}
