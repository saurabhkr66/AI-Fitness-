'use client'

import { Dumbbell } from 'lucide-react'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t border-border/40 bg-card/50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Dumbbell className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-foreground">FitAI</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Your AI-powered fitness coach for personalized training and nutrition.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Product</h4>
            <ul className="space-y-2">
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition">Features</Link></li>
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition">Pricing</Link></li>
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition">API</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Company</h4>
            <ul className="space-y-2">
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition">About</Link></li>
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition">Blog</Link></li>
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition">Careers</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition">Privacy</Link></li>
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition">Terms</Link></li>
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition">Contact</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border/40 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © 2025 FitAI. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="#" className="text-muted-foreground hover:text-foreground transition">Twitter</Link>
            <Link href="#" className="text-muted-foreground hover:text-foreground transition">GitHub</Link>
            <Link href="#" className="text-muted-foreground hover:text-foreground transition">LinkedIn</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
