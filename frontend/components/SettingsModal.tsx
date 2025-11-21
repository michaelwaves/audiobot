"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button-variants";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Globe } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentLanguage: string;
  onLanguageUpdate: (language: string) => void;
}

const LANGUAGE_OPTIONS = [
  { value: "English", label: "🇺🇸 English", name: "English" },
  { value: "Spanish", label: "🇪🇸 Español", name: "Spanish" },
  { value: "Portuguese", label: "🇵🇹 Português", name: "Portuguese" },
  { value: "French", label: "🇫🇷 Français", name: "French" },
  { value: "German", label: "🇩🇪 Deutsch", name: "German" },
  { value: "Italian", label: "🇮🇹 Italiano", name: "Italian" },
  { value: "Hindi", label: "🇮🇳 हिन्दी", name: "Hindi" },
  { value: "Japanese", label: "🇯🇵 日本語", name: "Japanese" },
  { value: "Chinese", label: "🇨🇳 中文", name: "Chinese (Simplified)" }
];

export const SettingsModal = ({ open, onOpenChange, currentLanguage, onLanguageUpdate }: SettingsModalProps) => {
  const [selectedLanguage, setSelectedLanguage] = useState(currentLanguage);
  const { toast } = useToast();

  const handleSave = () => {
    localStorage.setItem("briefly_language", selectedLanguage);
    onLanguageUpdate(selectedLanguage);
    toast({
      title: "Language updated!",
      description: `Your next podcast will be generated in ${selectedLanguage}.`,
    });
    onOpenChange(false);
  };

  const handleCancel = () => {
    setSelectedLanguage(currentLanguage);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Globe className="h-6 w-6 text-primary" />
            Podcast Language
          </DialogTitle>
          <DialogDescription>
            Choose the language you'd like your future podcasts to be generated in.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="language" className="text-base">
              Select Language
            </Label>
            <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
              <SelectTrigger id="language" className="h-12">
                <SelectValue placeholder="Select a language..." />
              </SelectTrigger>
              <SelectContent>
                {LANGUAGE_OPTIONS.map((lang) => (
                  <SelectItem key={lang.value} value={lang.value}>
                    {lang.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              Briefly can deliver your daily podcast in your preferred language.
            </p>
          </div>
        </div>

        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
