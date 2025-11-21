"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button-variants";
import { Card } from "@/components/ui/card";
import { Mic, Radio, Sparkles, Clock } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Radio className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold lowercase">briefly</span>
          </div>
          <Link href="/signup">
            <Button variant="outline" size="sm">Get Started</Button>
          </Link>
        </div>
      </nav>

      <section className="pt-32 pb-20 px-6 gradient-hero">
        <div className="container mx-auto max-w-5xl text-center">
          <div className="animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Your Daily Brief —{" "}
              <span className="text-primary">Stay Smart in Minutes</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto">
              Choose your topics. Get concise updates. Delivered as a short daily podcast.
            </p>
            <Link href="/signup">
              <Button variant="hero" className="animate-scale-in">
                Get Started — It's Free
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-background">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-4xl font-bold text-center mb-16">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Sparkles,
                title: "Choose Your Topics",
                description: "Pick from AI, startups, finance, politics, tech leaders, or add your own custom topics."
              },
              {
                icon: Clock,
                title: "We Track Updates Daily",
                description: "Our AI monitors news and updates across your selected topics every single day."
              },
               {
                icon: Mic,
                title: "Get Your Brief",
                description: "Receive a beautifully summarized 5, 10, or 15-minute podcast delivered to Spotify or RSS."
              }
            ].map((step, idx) => (
              <Card key={idx} className="p-8 text-center hover-lift border-0 shadow-soft gradient-card">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                  <step.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-semibold mb-4">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{step.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-4xl font-bold text-center mb-16">Example Episodes</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "AI & Machine Learning Digest", topics: "AI, ML, OpenAI", duration: "10m" },
              { title: "Startup & VC Weekly", topics: "Startups, Venture Capital", duration: "15m" },
              { title: "Tech Leaders Spotlight", topics: "Elon Musk, Sam Altman", duration: "5m" },
              { title: "Finance & Markets Brief", topics: "Stock Market, Finance", duration: "10m" },
              { title: "Climate & Science Update", topics: "Climate, Science", duration: "15m" },
              { title: "Global Politics Roundup", topics: "Politics, World Events", duration: "10m" }
            ].map((episode, idx) => (
              <Card key={idx} className="p-6 hover-lift border-0 shadow-soft">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Radio className="h-6 w-6 text-primary" />
                  </div>
                  <span className="px-3 py-1 rounded-full bg-accent text-accent-foreground text-sm font-medium">
                    {episode.duration}
                  </span>
                </div>
                <h3 className="text-lg font-semibold mb-2">{episode.title}</h3>
                <p className="text-sm text-muted-foreground">{episode.topics}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-background">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-4xl font-bold text-center mb-16">What People Say</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote: "Briefly saves me hours every week. I stay informed without doom-scrolling.",
                author: "Sarah Chen",
                role: "Product Manager"
              },
              {
                quote: "The perfect companion for my morning routine. Smart summaries in minutes.",
                author: "Michael Roberts",
                role: "Entrepreneur"
              },
              {
                quote: "Finally, a way to keep up with tech news that doesn't feel overwhelming.",
                author: "Emily Taylor",
                role: "Software Engineer"
              }
            ].map((testimonial, idx) => (
              <Card key={idx} className="p-8 border-0 shadow-soft gradient-card">
                <p className="text-lg mb-6 italic">"{testimonial.quote}"</p>
                <div>
                  <p className="font-semibold">{testimonial.author}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 gradient-hero">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Stay Smart in Minutes?
          </h2>
          <p className="text-xl text-muted-foreground mb-10">
            Join thousands who get concise daily briefs delivered as podcasts.
          </p>
          <Link href="/signup">
            <Button variant="hero">
              Start Your Free Brief
            </Button>
          </Link>
        </div>
      </section>

      <footer className="py-12 px-6 bg-background border-t border-border">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Radio className="h-5 w-5 text-primary" />
                <span className="font-bold lowercase">briefly</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Stay smart in minutes
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-smooth">Features</a></li>
                <li><a href="#" className="hover:text-foreground transition-smooth">Pricing</a></li>
                <li><a href="#" className="hover:text-foreground transition-smooth">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-smooth">About</a></li>
                <li><a href="#" className="hover:text-foreground transition-smooth">Blog</a></li>
                <li><a href="#" className="hover:text-foreground transition-smooth">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-smooth">Privacy</a></li>
                <li><a href="#" className="hover:text-foreground transition-smooth">Terms</a></li>
              </ul>
            </div>
          </div>
          <div className="text-center text-sm text-muted-foreground pt-8 border-t border-border">
            © 2025 Briefly. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
