'use client'

import { Card } from '@/components/ui/card'

const steps = [
  {
    number: '01',
    title: 'Create Your Profile',
    description: 'Tell us about your fitness level, goals, and preferences to get started.',
    highlight: true
  },
  {
    number: '02',
    title: 'AI Assessment',
    description: 'Our AI analyzes your data and creates a personalized fitness plan just for you.',
    highlight: false
  },
  {
    number: '03',
    title: 'Start Training',
    description: 'Follow voice-guided workouts with real-time form feedback and adjustments.',
    highlight: true
  },
  {
    number: '04',
    title: 'Track & Improve',
    description: 'Monitor your progress and get AI-powered recommendations for continuous improvement.',
    highlight: false
  }
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            How It Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get started in just a few simple steps and begin your transformation today
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {steps.map((step, idx) => (
            <Card 
              key={idx} 
              className={`p-8 border transition ${
                step.highlight 
                  ? 'bg-gradient-to-br from-primary/10 to-accent/10 border-primary/30' 
                  : 'bg-card border-border'
              }`}
            >
              <div className="text-4xl font-bold text-primary/30 mb-4">
                {step.number}
              </div>
              <h3 className="text-2xl font-semibold text-foreground mb-3">
                {step.title}
              </h3>
              <p className="text-muted-foreground">
                {step.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
