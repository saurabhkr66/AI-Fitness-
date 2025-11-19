'use client'

import { Dumbbell, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'border-b border-border bg-background/95 backdrop-blur-md shadow-lg shadow-primary/5 dark:shadow-primary/10' 
        : 'bg-background/50 backdrop-blur-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center glow-effect">
              <Dumbbell className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl gradient-text">FitAI</span>
          </div>
          
          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-muted-foreground hover:text-foreground transition duration-200">
              Features
            </Link>
            <Link href="#how-it-works" className="text-muted-foreground hover:text-foreground transition duration-200">
              How It Works
            </Link>
            <Link href="#testimonials" className="text-muted-foreground hover:text-foreground transition duration-200">
              Testimonials
            </Link>
          </nav>

          {/* Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Button variant="ghost" className="text-foreground hover:bg-primary/10">
              Sign In
            </Button>
            <Button className="gradient-primary text-primary-foreground hover:shadow-lg hover:shadow-primary/30 transition-all">
              Get Started
            </Button>
          </div>

          {/* Mobile Menu */}
          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Nav */}
        {isOpen && (
          <nav className="md:hidden pt-4 border-t border-border mt-4 flex flex-col gap-4">
            <Link href="#features" className="text-muted-foreground hover:text-foreground">
              Features
            </Link>
            <Link href="#how-it-works" className="text-muted-foreground hover:text-foreground">
              How It Works
            </Link>
            <Link href="#testimonials" className="text-muted-foreground hover:text-foreground">
              Testimonials
            </Link>
            <Button className="gradient-primary text-primary-foreground w-full mt-2">
              Get Started
            </Button>
          </nav>
        )}
      </div>
    </header>
  )
}
