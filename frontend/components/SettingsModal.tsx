"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button-variants";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Globe } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { updateUserLanguage, getUserSettings } from "@/lib/actions/settings";
import { useRouter } from "next/navigation";

interface SettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const LANGUAGE_OPTIONS = [
  { value: "English", label: "English", name: "English", code: "US" },
  { value: "Spanish", label: "Español", name: "Spanish", code: "ES" },
  { value: "Portuguese", label: "Português", name: "Portuguese", code: "PT" },
  { value: "French", label: "Français", name: "French", code: "FR" },
  { value: "German", label: "Deutsch", name: "German", code: "DE" },
  { value: "Italian", label: "Italiano", name: "Italian", code: "IT" },
  { value: "Hindi", label: "हिन्दी", name: "Hindi", code: "IN" },
  { value: "Japanese", label: "日本語", name: "Japanese", code: "JP" },
  { value: "Chinese", label: "中文", name: "Chinese (Simplified)", code: "CN" }
];

export const SettingsModal = ({ open, onOpenChange }: SettingsModalProps) => {
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (open) {
      loadSettings();
    }
  }, [open]);

  const loadSettings = async () => {
    try {
      const settings = await getUserSettings();
      if (settings?.language) {
        setSelectedLanguage(settings.language);
      }
    } catch (error) {
      console.error("Failed to load settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateUserLanguage(selectedLanguage);
      toast({
        title: "Language updated!",
        description: `Your next podcast will be generated in ${selectedLanguage}.`,
      });
      onOpenChange(false);
      router.refresh();
    } catch (error) {
      console.error("Failed to save language:", error);
      toast({
        title: "Error",
        description: "Failed to update language. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
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
            {loading ? (
              <div className="h-12 flex items-center justify-center text-muted-foreground">
                Loading...
              </div>
            ) : (
              <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                <SelectTrigger id="language" className="h-12">
                  <SelectValue placeholder="Select a language...">
                    {selectedLanguage && (
                      <div className="flex items-center gap-2">
                        <img
                          src={`https://flagsapi.com/${LANGUAGE_OPTIONS.find(l => l.value === selectedLanguage)?.code}/flat/32.png`}
                          alt=""
                          className="w-6 h-6 object-cover rounded"
                        />
                        <span>{LANGUAGE_OPTIONS.find(l => l.value === selectedLanguage)?.label}</span>
                      </div>
                    )}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {LANGUAGE_OPTIONS.map((lang) => (
                    <SelectItem key={lang.value} value={lang.value}>
                      <div className="flex items-center gap-2">
                        <img
                          src={`https://flagsapi.com/${lang.code}/flat/32.png`}
                          alt=""
                          className="w-6 h-6 object-cover rounded"
                        />
                        <span>{lang.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            <p className="text-sm text-muted-foreground">
              Briefly can deliver your daily podcast in your preferred language.
            </p>
          </div>
        </div>

        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={handleCancel} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving || loading}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
