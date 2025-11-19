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

  // --- FIXED VARIANTS WITH TYPES ---
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.age || formData.age < 10 || formData.age > 100) newErrors.age = 'Age must be between 10 and 100';
    if (!formData.height) newErrors.height = 'Height is required';
    if (!formData.weight) newErrors.weight = 'Weight is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (validate()) onSubmit(formData);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>): void => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: ['age', 'height', 'weight'].includes(name) ? Number(value) : value,
    }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/80 py-12 px-4">
      
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-4xl mx-auto bg-white/20 dark:bg-slate-900/40 backdrop-blur-xl p-10 rounded-3xl shadow-2xl"
      >
        {/* HEADER */}
        <motion.h2
          variants={itemVariants}
          className="text-center text-4xl font-extrabold mb-2 gradient-text"
        >
          Your Fitness Profile
        </motion.h2>

        <motion.p
          variants={itemVariants}
          className="text-center text-muted-foreground mb-10"
        >
          Fill your details to generate your personalized AI fitness plan
        </motion.p>

        <form onSubmit={handleSubmit}>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            variants={containerVariants}
          >
            {/* NAME */}
            <motion.div variants={itemVariants}>
              <label className="font-bold mb-2 block">Full Name *</label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full p-3 rounded-xl border ${
                  errors.name ? 'border-red-500' : 'border-primary/30'
                }`}
              />
              {errors.name && <p className="text-red-500">{errors.name}</p>}
            </motion.div>

            {/* AGE */}
            <motion.div variants={itemVariants}>
              <label className="font-bold mb-2 block">Age *</label>
              <input
                type="number"
                name="age"
                value={formData.age || ''}
                onChange={handleChange}
                className={`w-full p-3 rounded-xl border ${
                  errors.age ? 'border-red-500' : 'border-primary/30'
                }`}
              />
              {errors.age && <p className="text-red-500">{errors.age}</p>}
            </motion.div>

            {/* GENDER */}
            <motion.div variants={itemVariants}>
              <label className="font-bold mb-2 block">Gender *</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full p-3 rounded-xl border border-primary/30"
              >
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </motion.div>

            {/* HEIGHT */}
            <motion.div variants={itemVariants}>
              <label className="font-bold mb-2 block">Height (cm) *</label>
              <input
                type="number"
                name="height"
                value={formData.height || ''}
                onChange={handleChange}
                className={`w-full p-3 rounded-xl border ${
                  errors.height ? 'border-red-500' : 'border-primary/30'
                }`}
              />
              {errors.height && <p className="text-red-500">{errors.height}</p>}
            </motion.div>

            {/* WEIGHT */}
            <motion.div variants={itemVariants}>
              <label className="font-bold mb-2 block">Weight (kg) *</label>
              <input
                type="number"
                name="weight"
                value={formData.weight || ''}
                onChange={handleChange}
                className={`w-full p-3 rounded-xl border ${
                  errors.weight ? 'border-red-500' : 'border-primary/30'
                }`}
              />
              {errors.weight && <p className="text-red-500">{errors.weight}</p>}
            </motion.div>

            {/* Medical History */}
            <motion.div variants={itemVariants} className="md:col-span-2">
              <label className="font-bold mb-2 block">Medical History</label>
              <textarea
                name="medical"
                value={formData.medical}
                onChange={handleChange}
                className="w-full p-3 rounded-xl border border-primary/30"
                rows={3}
              />
            </motion.div>
          </motion.div>

          {/* BUTTON */}
          <motion.button
            variants={itemVariants}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            disabled={loading}
            className="mt-10 w-full py-4 rounded-xl bg-primary text-primary-foreground font-bold text-lg shadow-lg"
          >
            {loading ? 'Generating...' : '✨ Generate My Fitness Plan'}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
