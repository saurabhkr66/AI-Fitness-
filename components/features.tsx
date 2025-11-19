'use client'

import { Zap, Mic2, ImageIcon, TrendingUp, Sparkles, Heart } from 'lucide-react'
import { Card } from '@/components/ui/card'

const features = [
  {
    icon: Zap,
    title: 'Personalized Workouts',
    description: 'AI-generated workout plans tailored to your fitness level, goals, and available equipment.',
    color: 'text-accent',
    borderColor: 'border-accent/20 dark:border-accent/30',
    bgGradient: 'from-accent/5 to-accent/0'
  },
  {
    icon: TrendingUp,
    title: 'Smart Diet Plans',
    description: 'Customized nutrition guidance based on your dietary preferences and fitness objectives.',
    color: 'text-primary',
    borderColor: 'border-primary/20 dark:border-primary/30',
    bgGradient: 'from-primary/5 to-primary/0'
  },
  {
    icon: Mic2,
    title: 'Voice Guidance',
    description: 'Real-time voice coaching during workouts with motivation and form corrections.',
    color: 'text-secondary',
    borderColor: 'border-secondary/20 dark:border-secondary/30',
    bgGradient: 'from-secondary/5 to-secondary/0'
  },
  {
    icon: ImageIcon,
    title: 'AI Image Generation',
    description: 'Visualize exercises with AI-generated form demonstrations and transformation content.',
    color: 'text-accent',
    borderColor: 'border-accent/20 dark:border-accent/30',
    bgGradient: 'from-accent/5 to-accent/0'
  },
  {
    icon: Sparkles,
    title: 'Progress Tracking',
    description: 'Advanced analytics showing your improvement over time with AI-powered insights.',
    color: 'text-primary',
    borderColor: 'border-primary/20 dark:border-primary/30',
    bgGradient: 'from-primary/5 to-primary/0'
  },
  {
    icon: Heart,
    title: 'Health Integration',
    description: 'Connect with your favorite health apps to sync metrics and optimize results.',
    color: 'text-secondary',
    borderColor: 'border-secondary/20 dark:border-secondary/30',
    bgGradient: 'from-secondary/5 to-secondary/0'
  }
]

export default function Features() {
  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4 text-balance">
            Powerful <span className="gradient-text">Features</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to achieve your fitness goals with AI-powered assistance
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => {
            const Icon = feature.icon
            return (
              <Card 
                key={idx} 
                className={`bg-gradient-to-br ${feature.bgGradient} border ${feature.borderColor} hover:border-primary/50 dark:hover:border-primary/60 transition-all duration-300 p-6 group cursor-pointer hover:shadow-xl hover:shadow-primary/10 dark:hover:shadow-primary/20 backdrop-blur-sm`}
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br from-card to-card/50 border border-border flex items-center justify-center mb-4 group-hover:shadow-lg transition-all ${feature.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
