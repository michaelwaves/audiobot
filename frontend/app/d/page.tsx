import { getUserSettings, getCategories } from "@/lib/actions/settings";
import Link from "next/link";
import { Button } from "@/components/ui/button-variants";
import { Card } from "@/components/ui/card";
import { Radio, Clock, Calendar, Settings, Play, Globe } from "lucide-react";
import { auth } from "@/auth";
import { GeneratePodcastButton } from "@/components/GeneratePodcastButton";

export default async function Dashboard() {
  const session = await auth();
  const settings = await getUserSettings();
  const allCategories = await getCategories();

  const selectedCategories = settings?.category_ids
    ? allCategories.filter(cat => settings.category_ids.includes(cat.id))
    : [];

  const length = settings?.length || 10;
  const language = settings?.language || "English";

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-6 py-12 max-w-5xl">
        <div className="mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">
            Good morning, {session?.user?.name?.split(' ')[0] || "there"}! 👋
          </h1>
          <p className="text-xl text-muted-foreground">
            Your daily brief is ready
          </p>
        </div>

        <Card className="p-8 mb-8 shadow-large border-0 gradient-card hover-lift">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0">
              <Radio className="h-16 w-16 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4 flex-wrap">
                <span className="px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium">
                  New Episode
                </span>
                <span className="px-4 py-1.5 rounded-full bg-accent text-accent-foreground text-sm font-medium flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {length} min
                </span>
                <span className="px-4 py-1.5 rounded-full bg-muted text-muted-foreground text-sm font-medium flex items-center gap-1">
                  <Globe className="h-4 w-4" />
                  {language}
                </span>
              </div>
              <h2 className="text-3xl font-bold mb-3">
                Your Daily Digest — {today.split(",")[0]}
              </h2>
              <p className="text-muted-foreground mb-4">
                {selectedCategories.length > 0 ? (
                  <>
                    {selectedCategories.length} topics covered including{" "}
                    {selectedCategories.slice(0, 3).map(c => c.name).join(", ")}
                    {selectedCategories.length > 3 && ` and ${selectedCategories.length - 3} more`}
                  </>
                ) : (
                  <>No topics selected yet. <Link href="/onboarding/topics" className="text-primary hover:underline">Select your topics</Link></>
                )}
              </p>
              <div className="flex gap-3">
                <Button variant="hero" className="shadow-medium">
                  <Play className="h-5 w-5 mr-2" />
                  Listen to Brief
                </Button>
                <GeneratePodcastButton />
              </div>
            </div>
          </div>
        </Card>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Link href="/onboarding/topics">
            <Card className="p-6 hover-lift cursor-pointer border-2 border-border hover:border-primary/50 transition-smooth">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Settings className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">Edit Topics</h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedCategories.length > 0
                      ? `${selectedCategories.length} topics selected`
                      : "Customize your interests"}
                  </p>
                </div>
              </div>
            </Card>
          </Link>

          <Link href="/onboarding/length">
            <Card className="p-6 hover-lift cursor-pointer border-2 border-border hover:border-primary/50 transition-smooth">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center">
                  <Clock className="h-6 w-6 text-secondary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">Change Length</h3>
                  <p className="text-sm text-muted-foreground">Currently {length} minutes</p>
                </div>
              </div>
            </Card>
          </Link>
        </div>

        <div>
          <h3 className="text-2xl font-bold mb-6">Recent Episodes</h3>
          <div className="space-y-4">
            {[
              { date: "Yesterday", topics: selectedCategories.slice(0, 3).map(c => c.name).join(", ") || "AI, Startups, Finance" },
              { date: "2 days ago", topics: selectedCategories.slice(1, 4).map(c => c.name).join(", ") || "Politics, Climate, Science" },
              { date: "3 days ago", topics: selectedCategories.slice(2, 5).map(c => c.name).join(", ") || "Tech Leaders, Stock Market" }
            ].map((episode, idx) => (
              <Card key={idx} className="p-6 hover-lift cursor-pointer border-0 shadow-soft">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl bg-muted flex items-center justify-center">
                    <Radio className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{episode.date}</span>
                      <span className="px-2 py-0.5 rounded-full bg-accent text-accent-foreground text-xs">
                        {length}m
                      </span>
                    </div>
                    <p className="font-medium">Daily Digest</p>
                    <p className="text-sm text-muted-foreground">{episode.topics}</p>
                  </div>
                  <Button variant="ghost" size="icon">
                    <Play className="h-5 w-5" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
