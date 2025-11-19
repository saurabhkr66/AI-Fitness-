
'use client'

import { Sparkles, ArrowRight, Play } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function Hero() {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden pt-12">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-1/4 w-96 h-96 gradient-primary rounded-full blur-3xl opacity-20 animate-float"></div>
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-gradient-to-r from-secondary to-primary rounded-full blur-3xl opacity-15 animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-gradient-to-r from-accent to-secondary rounded-full blur-3xl opacity-10 animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-primary/10 dark:bg-primary/20 border border-primary/20 dark:border-primary/30 rounded-full px-4 py-2 mb-6 backdrop-blur-sm glow-effect">
          <Sparkles className="w-4 h-4 text-accent animate-pulse-glow" />
          <span className="text-sm text-primary dark:text-accent font-semibold">AI-Powered Fitness Revolution</span>
        </div>

        {/* Main Heading */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground mb-6 text-balance leading-tight">
          Your Personal <span className="gradient-text">AI Fitness Coach</span>
        </h1>

        {/* Subheading */}
        <p className="text-lg sm:text-xl text-muted-foreground mb-8 text-balance max-w-2xl mx-auto leading-relaxed">
          Get personalized workout and diet plans tailored to your goals. Voice-guided sessions and AI-generated fitness content transform your fitness journey.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link href="/form">
  <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
    Start Your Journey <ArrowRight className="w-4 h-4" />
  </Button>
 </Link> 
          <Button size="lg" variant="outline" className="border-primary/30 text-foreground hover:bg-primary/10 gap-2">
            <Play className="w-4 h-4" /> Watch Demo
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-16">
          <div className="bg-gradient-to-br from-card to-card/50 border border-primary/20 rounded-2xl p-6 glow-effect backdrop-blur-sm hover:border-primary/40 transition-all">
            <div className="text-3xl font-bold gradient-text mb-2">500K+</div>
            <p className="text-sm text-muted-foreground">Active Users</p>
          </div>
          <div className="bg-gradient-to-br from-card to-card/50 border border-accent/20 rounded-2xl p-6 glow-accent backdrop-blur-sm hover:border-accent/40 transition-all">
            <div className="text-3xl font-bold text-accent mb-2">98%</div>
            <p className="text-sm text-muted-foreground">Success Rate</p>
          </div>
          <div className="bg-gradient-to-br from-card to-card/50 border border-secondary/20 rounded-2xl p-6 glow-effect backdrop-blur-sm hover:border-secondary/40 transition-all">
            <div className="text-3xl font-bold text-secondary mb-2">24/7</div>
            <p className="text-sm text-muted-foreground">AI Support</p>
          </div>
        </div>
      </div>
    </section>
  )
}

