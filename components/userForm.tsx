'use client';

import { useState, ChangeEvent, FormEvent } from 'react';
import { motion, Variants } from 'framer-motion';
import type { UserFormData, FormErrors } from '../types';

interface UserFormProps {
  onSubmit: (data: UserFormData) => void;
  loading: boolean;
}

export default function UserForm({ onSubmit, loading }: UserFormProps) {
  const [formData, setFormData] = useState<UserFormData>({
    name: '',
    age: 0,
    gender: 'Male',
    height: 0,
    weight: 0,
    goal: 'Weight Loss',
    level: 'Beginner',
    location: 'Home',
    diet: 'Vegetarian',
    medical: '',
    stress: undefined
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.age || formData.age < 10 || formData.age > 100) {
      newErrors.age = 'Age must be between 10 and 100';
    }
    if (!formData.gender) newErrors.gender = 'Gender is required';
    if (!formData.height) newErrors.height = 'Height is required';
    if (!formData.weight) newErrors.weight = 'Weight is required';
    if (!formData.goal) newErrors.goal = 'Fitness goal is required';
    if (!formData.level) newErrors.level = 'Fitness level is required';
    if (!formData.location) newErrors.location = 'Workout location is required';
    if (!formData.diet) newErrors.diet = 'Dietary preference is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'age' || name === 'height' || name === 'weight' 
        ? Number(value) 
        : value 
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Framer Motion Variants with proper typing
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeInOut" },
    },
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-background via-background to-background py-12 px-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ 
            x: [0, 100, 0],
            y: [0, 50, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ 
            x: [0, -100, 0],
            y: [0, -50, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear', delay: 1 }}
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-accent/20 to-primary/20 rounded-full blur-3xl"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto relative z-10"
      >
        <div className="glass-effect rounded-3xl p-8 md:p-12 border-2 border-transparent bg-gradient-to-br from-white/80 to-white/40 dark:from-slate-950/80 dark:to-slate-900/40">
          {/* Header */}
          <motion.div className="text-center mb-10" variants={containerVariants} initial="hidden" animate="visible">
            <motion.h2 
              variants={itemVariants}
              className="text-4xl md:text-5xl font-black gradient-text mb-3"
            >
              Your Fitness Profile
            </motion.h2>
            <motion.p 
              variants={itemVariants}
              className="text-lg text-muted-foreground dark:text-slate-300"
            >
              Tell us about yourself to unlock your personalized AI-powered fitness journey
            </motion.p>
          </motion.div>

          <form onSubmit={handleSubmit}>
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {/* Name */}
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-bold text-foreground dark:text-slate-100 mb-3">
                  Full Name <span className="text-accent">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-5 py-3 bg-background/50 dark:bg-slate-900/50 border-2 ${errors.name ? 'border-destructive' : 'border-primary/30 dark:border-primary/20'} rounded-xl focus:border-primary dark:focus:border-secondary focus:ring-2 focus:ring-primary/20 dark:focus:ring-primary/30 focus:outline-none dark:text-white transition-all duration-300 placeholder:text-muted-foreground`}
                  placeholder="John Doe"
                />
                {errors.name && <p className="text-destructive text-sm font-medium mt-2">{errors.name}</p>}
              </motion.div>

              {/* Age */}
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-bold text-foreground dark:text-slate-100 mb-3">
                  Age <span className="text-accent">*</span>
                </label>
                <input
                  type="number"
                  name="age"
                  value={formData.age || ''}
                  onChange={handleChange}
                  className={`w-full px-5 py-3 bg-background/50 dark:bg-slate-900/50 border-2 ${errors.age ? 'border-destructive' : 'border-primary/30 dark:border-primary/20'} rounded-xl focus:border-primary dark:focus:border-secondary focus:ring-2 focus:ring-primary/20 dark:focus:ring-primary/30 focus:outline-none dark:text-white transition-all duration-300 placeholder:text-muted-foreground`}
                  placeholder="25"
                  min="10"
                  max="100"
                />
                {errors.age && <p className="text-destructive text-sm font-medium mt-2">{errors.age}</p>}
              </motion.div>

              {/* Gender */}
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-bold text-foreground dark:text-slate-100 mb-3">
                  Gender <span className="text-accent">*</span>
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className={`w-full px-5 py-3 bg-background/50 dark:bg-slate-900/50 border-2 ${errors.gender ? 'border-destructive' : 'border-primary/30 dark:border-primary/20'} rounded-xl focus:border-primary dark:focus:border-secondary focus:ring-2 focus:ring-primary/20 dark:focus:ring-primary/30 focus:outline-none dark:text-white transition-all duration-300`}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                {errors.gender && <p className="text-destructive text-sm font-medium mt-2">{errors.gender}</p>}
              </motion.div>

              {/* Height */}
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-bold text-foreground dark:text-slate-100 mb-3">
                  Height (cm) <span className="text-accent">*</span>
                </label>
                <input
                  type="number"
                  name="height"
                  value={formData.height || ''}
                  onChange={handleChange}
                  className={`w-full px-5 py-3 bg-background/50 dark:bg-slate-900/50 border-2 ${errors.height ? 'border-destructive' : 'border-primary/30 dark:border-primary/20'} rounded-xl focus:border-primary dark:focus:border-secondary focus:ring-2 focus:ring-primary/20 dark:focus:ring-primary/30 focus:outline-none dark:text-white transition-all duration-300 placeholder:text-muted-foreground`}
                  placeholder="170"
                />
                {errors.height && <p className="text-destructive text-sm font-medium mt-2">{errors.height}</p>}
              </motion.div>

              {/* Weight */}
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-bold text-foreground dark:text-slate-100 mb-3">
                  Weight (kg) <span className="text-accent">*</span>
                </label>
                <input
                  type="number"
                  name="weight"
                  value={formData.weight || ''}
                  onChange={handleChange}
                  className={`w-full px-5 py-3 bg-background/50 dark:bg-slate-900/50 border-2 ${errors.weight ? 'border-destructive' : 'border-primary/30 dark:border-primary/20'} rounded-xl focus:border-primary dark:focus:border-secondary focus:ring-2 focus:ring-primary/20 dark:focus:ring-primary/30 focus:outline-none dark:text-white transition-all duration-300 placeholder:text-muted-foreground`}
                  placeholder="70"
                />
                {errors.weight && <p className="text-destructive text-sm font-medium mt-2">{errors.weight}</p>}
              </motion.div>

              {/* Fitness Goal */}
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-bold text-foreground dark:text-slate-100 mb-3">
                  Fitness Goal <span className="text-accent">*</span>
                </label>
                <select
                  name="goal"
                  value={formData.goal}
                  onChange={handleChange}
                  className={`w-full px-5 py-3 bg-background/50 dark:bg-slate-900/50 border-2 ${errors.goal ? 'border-destructive' : 'border-primary/30 dark:border-primary/20'} rounded-xl focus:border-primary dark:focus:border-secondary focus:ring-2 focus:ring-primary/20 dark:focus:ring-primary/30 focus:outline-none dark:text-white transition-all duration-300`}
                >
                  <option value="Weight Loss">Weight Loss</option>
                  <option value="Muscle Gain">Muscle Gain</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Athletic Performance">Athletic Performance</option>
                  <option value="General Fitness">General Fitness</option>
                </select>
                {errors.goal && <p className="text-destructive text-sm font-medium mt-2">{errors.goal}</p>}
              </motion.div>

              {/* Fitness Level */}
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-bold text-foreground dark:text-slate-100 mb-3">
                  Current Fitness Level <span className="text-accent">*</span>
                </label>
                <select
                  name="level"
                  value={formData.level}
                  onChange={handleChange}
                  className={`w-full px-5 py-3 bg-background/50 dark:bg-slate-900/50 border-2 ${errors.level ? 'border-destructive' : 'border-primary/30 dark:border-primary/20'} rounded-xl focus:border-primary dark:focus:border-secondary focus:ring-2 focus:ring-primary/20 dark:focus:ring-primary/30 focus:outline-none dark:text-white transition-all duration-300`}
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
                {errors.level && <p className="text-destructive text-sm font-medium mt-2">{errors.level}</p>}
              </motion.div>

              {/* Workout Location */}
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-bold text-foreground dark:text-slate-100 mb-3">
                  Workout Location <span className="text-accent">*</span>
                </label>
                <select
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className={`w-full px-5 py-3 bg-background/50 dark:bg-slate-900/50 border-2 ${errors.location ? 'border-destructive' : 'border-primary/30 dark:border-primary/20'} rounded-xl focus:border-primary dark:focus:border-secondary focus:ring-2 focus:ring-primary/20 dark:focus:ring-primary/30 focus:outline-none dark:text-white transition-all duration-300`}
                >
                  <option value="Home">Home</option>
                  <option value="Gym">Gym</option>
                  <option value="Outdoor">Outdoor</option>
                  <option value="Hybrid">Hybrid (Home + Gym)</option>
                </select>
                {errors.location && <p className="text-destructive text-sm font-medium mt-2">{errors.location}</p>}
              </motion.div>

              {/* Dietary Preference */}
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-bold text-foreground dark:text-slate-100 mb-3">
                  Dietary Preference <span className="text-accent">*</span>
                </label>
                <select
                  name="diet"
                  value={formData.diet}
                  onChange={handleChange}
                  className={`w-full px-5 py-3 bg-background/50 dark:bg-slate-900/50 border-2 ${errors.diet ? 'border-destructive' : 'border-primary/30 dark:border-primary/20'} rounded-xl focus:border-primary dark:focus:border-secondary focus:ring-2 focus:ring-primary/20 dark:focus:ring-primary/30 focus:outline-none dark:text-white transition-all duration-300`}
                >
                  <option value="Vegetarian">Vegetarian</option>
                  <option value="Non-Vegetarian">Non-Vegetarian</option>
                  <option value="Vegan">Vegan</option>
                  <option value="Keto">Keto</option>
                  <option value="Paleo">Paleo</option>
                  <option value="Mediterranean">Mediterranean</option>
                </select>
                {errors.diet && <p className="text-destructive text-sm font-medium mt-2">{errors.diet}</p>}
              </motion.div>

              {/* Stress Level */}
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-bold text-foreground dark:text-slate-100 mb-3">
                  Stress Level <span className="text-muted-foreground text-xs">(Optional)</span>
                </label>
                <select
                  name="stress"
                  value={formData.stress || ''}
                  onChange={handleChange}
                  className="w-full px-5 py-3 bg-background/50 dark:bg-slate-900/50 border-2 border-primary/30 dark:border-primary/20 rounded-xl focus:border-primary dark:focus:border-secondary focus:ring-2 focus:ring-primary/20 dark:focus:ring-primary/30 focus:outline-none dark:text-white transition-all duration-300"
                >
                  <option value="">Select Stress Level</option>
                  <option value="Low">Low</option>
                  <option value="Moderate">Moderate</option>
                  <option value="High">High</option>
                </select>
              </motion.div>

              {/* Medical History */}
              <motion.div variants={itemVariants} className="md:col-span-2">
                <label className="block text-sm font-bold text-foreground dark:text-slate-100 mb-3">
                  Medical History / Injuries <span className="text-muted-foreground text-xs">(Optional)</span>
                </label>
                <textarea
                  name="medical"
                  value={formData.medical}
                  onChange={handleChange}
                  className="w-full px-5 py-3 bg-background/50 dark:bg-slate-900/50 border-2 border-primary/30 dark:border-primary/20 rounded-xl focus:border-primary dark:focus:border-secondary focus:ring-2 focus:ring-primary/20 dark:focus:ring-primary/30 focus:outline-none dark:text-white transition-all duration-300 placeholder:text-muted-foreground resize-none"
                  placeholder="Any medical conditions, injuries, or physical limitations..."
                  rows={3}
                />
              </motion.div>
            </motion.div>

            {/* Submit Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <motion.button
                whileHover={{ scale: 1.02, boxShadow: '0 20px 60px rgba(139, 92, 246, 0.4)' }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full gradient-bg-primary text-primary-foreground py-4 md:py-5 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300 glow-primary"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-3">
                    <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                    </svg>
                    Generating Your Plan...
                  </span>
                ) : (
                  '✨ Generate My Fitness Plan'
                )}
              </motion.button>
            </motion.div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
