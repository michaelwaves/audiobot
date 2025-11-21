"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button-variants";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Search, Check, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const SUGGESTED_TOPICS = [
  { id: "ai", name: "AI", icon: "🤖" },
  { id: "ml", name: "Machine Learning", icon: "🧠" },
  { id: "startups", name: "Startups", icon: "🚀" },
  { id: "vc", name: "Venture Capital", icon: "💰" },
  { id: "politics-us", name: "US Politics", icon: "🏛️" },
  { id: "politics-global", name: "Global Politics", icon: "🌍" },
  { id: "finance", name: "Finance", icon: "📈" },
  { id: "stock-market", name: "Stock Market", icon: "💹" },
  { id: "science", name: "Science", icon: "🔬" },
  { id: "health", name: "Health", icon: "⚕️" },
  { id: "climate", name: "Climate", icon: "🌱" },
  { id: "cybersecurity", name: "Cybersecurity", icon: "🔒" },
  { id: "elon-musk", name: "Elon Musk", icon: "🚗" },
  { id: "sam-altman", name: "Sam Altman", icon: "💡" },
  { id: "jensen-huang", name: "Jensen Huang", icon: "🎮" },
  { id: "space", name: "Space", icon: "🚀" },
  { id: "entertainment", name: "Entertainment", icon: "🎬" },
  { id: "celebrities", name: "Celebrities", icon: "⭐" },
];

export default function TopicSelection() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [customTopics, setCustomTopics] = useState<string[]>([]);

  const toggleTopic = (topicId: string) => {
    setSelectedTopics(prev =>
      prev.includes(topicId)
        ? prev.filter(id => id !== topicId)
        : [...prev, topicId]
    );
  };

  const addCustomTopic = () => {
    if (searchQuery.trim() && !customTopics.includes(searchQuery)) {
      setCustomTopics([...customTopics, searchQuery]);
      setSelectedTopics([...selectedTopics, searchQuery]);
      setSearchQuery("");
    }
  };

  const handleContinue = () => {
    localStorage.setItem("briefly_topics", JSON.stringify(selectedTopics));
    router.push("/onboarding/length");
  };

  const filteredTopics = SUGGESTED_TOPICS.filter(topic =>
    topic.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen py-12 px-6">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            What topics interest you?
          </h1>
          <p className="text-xl text-muted-foreground">
            Select at least 3 topics to personalize your daily brief
          </p>
        </div>

        <div className="mb-8 max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search topics or add your own..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addCustomTopic()}
              className="pl-12 h-14 text-lg rounded-2xl"
            />
            {searchQuery && (
              <Button
                onClick={addCustomTopic}
                size="sm"
                className="absolute right-2 top-1/2 -translate-y-1/2"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-12">
          {customTopics.map((topic) => (
            <Card
              key={topic}
              onClick={() => toggleTopic(topic)}
              className={cn(
                "p-6 cursor-pointer transition-smooth hover-lift border-2",
                selectedTopics.includes(topic)
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-3xl">✨</span>
                {selectedTopics.includes(topic) && (
                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                    <Check className="h-4 w-4 text-primary-foreground" />
                  </div>
                )}
              </div>
              <p className="font-semibold">{topic}</p>
            </Card>
          ))}

          {filteredTopics.map((topic) => (
            <Card
              key={topic.id}
              onClick={() => toggleTopic(topic.id)}
              className={cn(
                "p-6 cursor-pointer transition-smooth hover-lift border-2",
                selectedTopics.includes(topic.id)
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-3xl">{topic.icon}</span>
                {selectedTopics.includes(topic.id) && (
                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center animate-scale-in">
                    <Check className="h-4 w-4 text-primary-foreground" />
                  </div>
                )}
              </div>
              <p className="font-semibold">{topic.name}</p>
            </Card>
          ))}
        </div>

        <div className="flex justify-center">
          <Button
            onClick={handleContinue}
            disabled={selectedTopics.length < 3}
            size="lg"
            className="min-w-[200px]"
          >
            Continue ({selectedTopics.length} selected)
          </Button>
        </div>
      </div>
    </div>
  );
}
