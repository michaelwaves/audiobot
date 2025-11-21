"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { updateUserLanguage } from "@/lib/actions/settings";

const LANGUAGE_OPTIONS = [
  { value: "English", code: "US", name: "English", subtitle: "United States" },
  { value: "Spanish", code: "ES", name: "Español", subtitle: "Spanish" },
  { value: "Portuguese", code: "PT", name: "Português", subtitle: "Portuguese" },
  { value: "French", code: "FR", name: "Français", subtitle: "French" },
  { value: "German", code: "DE", name: "Deutsch", subtitle: "German" },
  { value: "Italian", code: "IT", name: "Italiano", subtitle: "Italian" },
  { value: "Hindi", code: "IN", name: "हिन्दी", subtitle: "Hindi" },
  { value: "Japanese", code: "JP", name: "日本語", subtitle: "Japanese" },
  { value: "Chinese", code: "CN", name: "中文", subtitle: "Simplified Chinese" }
];

export default function LanguageSelection() {
  const router = useRouter();
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const handleSelect = async (value: string) => {
    setSelectedLanguage(value);
    setSaving(true);

    try {
      await updateUserLanguage(value);
      setTimeout(() => {
        router.push("/onboarding/delivery");
      }, 500);
    } catch (error) {
      console.error("Failed to save language:", error);
      alert("Failed to save language. Please try again.");
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-6 flex items-center">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Globe className="h-8 w-8 text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold">
              Choose Your Podcast Language
            </h1>
          </div>
          <p className="text-xl text-muted-foreground">
            Select the language you'd like your daily podcast summaries to be delivered in
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {LANGUAGE_OPTIONS.map((option) => (
            <Card
              key={option.value}
              onClick={() => !saving && handleSelect(option.value)}
              className={cn(
                "p-6 cursor-pointer transition-smooth hover-lift border-2 text-center",
                selectedLanguage === option.value
                  ? "border-primary bg-primary/5 shadow-large"
                  : "border-border hover:border-primary/50",
                saving && "opacity-50 cursor-not-allowed"
              )}
            >
              <div className="mb-3">
                <img
                  src={`https://flagsapi.com/${option.code}/flat/64.png`}
                  alt={option.name}
                  className="w-16 h-16 object-cover rounded-lg mx-auto"
                />
              </div>
              <h3 className="text-xl font-bold mb-1">{option.name}</h3>
              <p className="text-sm text-muted-foreground mb-4">{option.subtitle}</p>
              {selectedLanguage === option.value && (
                <div className="mt-4 w-10 h-10 rounded-full bg-primary flex items-center justify-center mx-auto animate-scale-in">
                  <svg className="h-5 w-5 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </Card>
          ))}
        </div>

        <div className="text-center mt-8 text-sm text-muted-foreground">
          Default: English • You can change this anytime in settings
        </div>
      </div>
    </div>
  );
}
