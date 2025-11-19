'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import PlanDisplay from '@/components/PlainDisplay';
import UserForm from '@/components/userForm';
import { UserFormData, SavedPlanData } from '@/types';

export default function Home() {
  const [plan, setPlan] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserFormData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [darkMode, setDarkMode] = useState<boolean>(false);

  useEffect(() => {
    // Load saved plan from localStorage
    const savedPlan = localStorage.getItem('savedFitnessPlan');
    if (savedPlan) {
      const parsed: SavedPlanData = JSON.parse(savedPlan);
      setPlan(parsed.plan);
      setUserData(parsed.userData);
    }
    
    // Load theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setDarkMode(true);
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const handleSubmit = async (formData: UserFormData): Promise<void> => {
    setLoading(true);
    try {
      const response = await fetch('/api/generate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      const result = await response.json();
      
      if (result.success) {
        setPlan(result.plan);
        setUserData(formData);
        
        // Save to localStorage
        const savedData: SavedPlanData = {
          plan: result.plan,
          userData: formData,
          timestamp: result.timestamp
        };
        localStorage.setItem('savedFitnessPlan', JSON.stringify(savedData));
        
        // Scroll to plan
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        alert('Failed to generate plan. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please check your API keys and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerate = (): void => {
    setPlan(null);
    setUserData(null);
    localStorage.removeItem('savedFitnessPlan');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main className="relative min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50 dark:from-slate-950 dark:via-purple-950 dark:to-blue-950 py-8 px-4 transition-colors duration-300 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ 
            x: [0, 100, 0],
            y: [0, 50, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-20 -left-20 w-96 h-96 rounded-full blur-3xl opacity-20 bg-gradient-to-r from-primary to-accent"
        />
        <motion.div
          animate={{ 
            x: [0, -100, 0],
            y: [0, -50, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full blur-3xl opacity-20 bg-gradient-to-r from-accent to-secondary"
        />
      </div>

      <div className="container mx-auto max-w-7xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-6"
        >
          <div className="flex-1">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-block mb-4 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 dark:border-primary/40"
            >
              <span className="text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                ✨ AI-Powered Fitness Revolution
              </span>
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-black mb-4 leading-tight">
              <span className="gradient-text">Transform Your Body</span>
              <br />
              <span className="text-foreground">with AI</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed">
              Get personalized workout and diet plans powered by advanced AI, complete with voice guidance and AI-generated imagery for the ultimate fitness experience.
            </p>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setDarkMode(!darkMode)}
            className="p-3 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 backdrop-blur-xl border border-primary/30 hover:border-primary/50 shadow-lg hover:shadow-xl transition-all duration-300 text-2xl"
          >
            {darkMode ? '☀️' : '🌙'}
          </motion.button>
        </motion.div>

        {!plan ? (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <UserForm onSubmit={handleSubmit} loading={loading} />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {/* Feature 1: AI Plans */}
              <motion.div
                whileHover={{ translateY: -8 }}
                className="group relative"
              >
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300" />
                <div className="relative bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 rounded-2xl p-8 border border-primary/10 dark:border-primary/20 shadow-lg hover:shadow-2xl transition-all duration-300 backdrop-blur-xl">
                  <motion.div
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="text-5xl mb-4"
                  >
                    🤖
                  </motion.div>
                  <h3 className="text-2xl font-bold mb-3 text-foreground">
                    AI-Powered Plans
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Generated by Google Gemini AI based on your unique fitness profile and goals
                  </p>
                </div>
              </motion.div>
              
              {/* Feature 2: Voice Narration */}
              <motion.div
                whileHover={{ translateY: -8 }}
                className="group relative md:translate-y-6"
              >
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-accent/20 to-secondary/20 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300" />
                <div className="relative bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 rounded-2xl p-8 border border-accent/10 dark:border-accent/20 shadow-lg hover:shadow-2xl transition-all duration-300 backdrop-blur-xl">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2.5, repeat: Infinity }}
                    className="text-5xl mb-4"
                  >
                    🔊
                  </motion.div>
                  <h3 className="text-2xl font-bold mb-3 text-foreground">
                    Voice Narration
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Listen to your plans with OpenAI's natural-sounding voices for an immersive experience
                  </p>
                </div>
              </motion.div>
              
              {/* Feature 3: Image Generation */}
              <motion.div
                whileHover={{ translateY: -8 }}
                className="group relative"
              >
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-secondary/20 to-primary/20 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300" />
                <div className="relative bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 rounded-2xl p-8 border border-secondary/10 dark:border-secondary/20 shadow-lg hover:shadow-2xl transition-all duration-300 backdrop-blur-xl">
                  <motion.div
                    animate={{ rotate: [0, -5, 5, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="text-5xl mb-4"
                  >
                    🖼️
                  </motion.div>
                  <h3 className="text-2xl font-bold mb-3 text-foreground">
                    AI Image Generation
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Visualize exercises and meals with Gemini-generated images for better understanding
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </>
        ) : (
          userData && <PlanDisplay 
            plan={plan} 
            userData={userData}
            onRegenerate={handleRegenerate} 
          />
        )}

        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-20 pt-12 border-t border-primary/10 dark:border-primary/20 text-center"
        >
          <p className="text-muted-foreground mb-4">
            Powered by Google Gemini AI & OpenAI | Built with Next.js
          </p>
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="inline-block text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-secondary"
          >
            ✨ Transform Your Fitness Journey Today
          </motion.div>
        </motion.footer>
      </div>
    </main>
  );
}
