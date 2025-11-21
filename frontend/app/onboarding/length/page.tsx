"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { updateUserLength } from "@/lib/actions/settings";

const LENGTH_OPTIONS = [
  {
    value: 5,
    title: "5 Minutes",
    subtitle: "Executive Summary",
    description: "Perfect for a quick morning briefing",
    icon: "⚡"
  },
  {
    value: 10,
    title: "10 Minutes",
    subtitle: "Mid-Length Digest",
    description: "Ideal for your commute or coffee break",
    icon: "☕"
  },
  {
    value: 15,
    title: "15 Minutes",
    subtitle: "Deep Brief",
    description: "Comprehensive coverage with analysis",
    icon: "📚"
  }
];

export default function LengthSelection() {
  const router = useRouter();
  const [selectedLength, setSelectedLength] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  const handleSelect = async (value: number) => {
    setSelectedLength(value);
    setSaving(true);

    try {
      await updateUserLength(value);
      setTimeout(() => {
        router.push("/onboarding/language");
      }, 500);
    } catch (error) {
      console.error("Failed to save length:", error);
      alert("Failed to save length. Please try again.");
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-6 flex items-center">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            How long should your brief be?
          </h1>
          <p className="text-xl text-muted-foreground">
            Choose the length that fits your daily routine
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {LENGTH_OPTIONS.map((option) => (
            <Card
              key={option.value}
              onClick={() => !saving && handleSelect(option.value)}
              className={cn(
                "p-8 cursor-pointer transition-smooth hover-lift border-2 text-center",
                selectedLength === option.value
                  ? "border-primary bg-primary/5 shadow-large"
                  : "border-border hover:border-primary/50",
                saving && "opacity-50 cursor-not-allowed"
              )}
            >
              <div className="text-5xl mb-4">{option.icon}</div>
              <div className="flex items-center justify-center gap-2 mb-2">
                <Clock className="h-5 w-5 text-primary" />
                <h3 className="text-2xl font-bold">{option.title}</h3>
              </div>
              <p className="text-primary font-semibold mb-4">{option.subtitle}</p>
              <p className="text-muted-foreground">{option.description}</p>
              {selectedLength === option.value && (
                <div className="mt-6 w-12 h-12 rounded-full bg-primary flex items-center justify-center mx-auto animate-scale-in">
                  <svg className="h-6 w-6 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </Card>
          ))}
        </div>

        <div className="text-center mt-8 text-sm text-muted-foreground">
          Don't worry, you can change this anytime
        </div>
      </div>
    </div>
  );
}
