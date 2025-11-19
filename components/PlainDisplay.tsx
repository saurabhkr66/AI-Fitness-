'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import jsPDF from 'jspdf';
import ImageModal from './ImageModel';
import type { UserFormData, ImageData, AudioSection } from '../types/index';

interface PlanDisplayProps {
  plan: string;
  userData: UserFormData;
  onRegenerate: () => void;
}

type TabType = 'workout' | 'diet' | 'motivation';

export default function PlanDisplay({ plan, userData, onRegenerate }: PlanDisplayProps) {
  const [audioLoading, setAudioLoading] = useState<boolean>(false);
  const [audioPlaying, setAudioPlaying] = useState<AudioSection>(null);
  const [selectedImage, setSelectedImage] = useState<ImageData | null>(null);
  const [imageLoading, setImageLoading] = useState<boolean>(false);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('workout');
  
  // Extract sections from the plan
  const workoutSection: string = plan.split('═══════════════════════════════════════════════════════')[1]?.split('═══════════════════════════════════════════════════════')[1] || 
    plan.split('7-DAY WORKOUT PLAN')[1]?.split('COMPREHENSIVE DIET PLAN')[0] || 
    plan.split('WORKOUT PLAN')[1]?.split('DIET PLAN')[0] || '';
  
  const dietSection: string = plan.split('COMPREHENSIVE DIET PLAN')[1]?.split('EXPERT TIPS')[0] || 
    plan.split('DIET PLAN')[1]?.split('TIPS')[0] || 
    plan.split('DIET PLAN')[1]?.split('MOTIVATION')[0] || '';

  const motivationSection: string = plan.split('EXPERT TIPS')[1] || 
    plan.split('TIPS')[1] || 
    plan.split('MOTIVATION')[1] || 
    `💪 Stay Committed to Your Goals!\n\n• Consistency is key - small daily efforts lead to big results\n• Track your progress and celebrate small wins\n• Stay hydrated - drink at least 8 glasses of water daily\n• Get 7-8 hours of quality sleep each night\n• Listen to your body and rest when needed\n• Focus on progress, not perfection\n• Remember why you started\n• Believe in yourself - you've got this! 🌟`;

  const handleTextToSpeech = async (section: string, sectionName: AudioSection): Promise<void> => {
    if (currentAudio) {
      currentAudio.pause();
      setCurrentAudio(null);
      setAudioPlaying(null);
    }

    setAudioLoading(true);
    setAudioPlaying(sectionName);

    try {
      const response = await fetch("/api/text-to-speech", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: section,
        }),
      });

      if (!response.ok) throw new Error("TTS failed");

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);

      audio.onended = () => {
        setAudioPlaying(null);
        setCurrentAudio(null);
      };

      setCurrentAudio(audio);
      await audio.play();
    } catch (error) {
      console.error("TTS Error:", error);
      alert("Failed to generate audio. Please try again.");
      setAudioPlaying(null);
    } finally {
      setAudioLoading(false);
    }
  };

  const stopAudio = () => {
    if (currentAudio) {
      currentAudio.pause();
      setCurrentAudio(null);
      setAudioPlaying(null);
    }
  };

  const handleGenerateImage = async (itemText: string, type: 'exercise' | 'food'): Promise<void> => {
    setImageLoading(true);
    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: itemText,
          type: type
        }),
      });
      
      const data = await response.json();
      if (data.success) {
        setSelectedImage({ url: data.imageUrl, title: itemText });
      } else {
        alert('Failed to generate image. Please try again.');
      }
    } catch (error) {
      console.error('Image generation error:', error);
      alert('Failed to generate image. Please try again.');
    } finally {
      setImageLoading(false);
    }
  };

  const exportToPDF = (): void => {
    const doc = new jsPDF();
    const pageWidth: number = doc.internal.pageSize.getWidth();
    const pageHeight: number = doc.internal.pageSize.getHeight();
    const margin: number = 20;
    const lineHeight: number = 7;
    let yPosition: number = margin;

    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('💪 My Personalized Fitness Plan', margin, yPosition);
    yPosition += 15;

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Name: ${userData.name} | Age: ${userData.age} | Goal: ${userData.goal}`, margin, yPosition);
    yPosition += 10;

    doc.setLineWidth(0.5);
    doc.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 10;

    doc.setFontSize(10);
    const splitText: string[] = doc.splitTextToSize(plan, pageWidth - (margin * 2));
    
    splitText.forEach((line: string) => {
      if (yPosition > pageHeight - margin) {
        doc.addPage();
        yPosition = margin;
      }
      doc.text(line, margin, yPosition);
      yPosition += lineHeight;
    });

    doc.save(`${userData.name}_Fitness_Plan.pdf`);
  };

  const savePlan = (): void => {
    const planData = {
      plan,
      userData,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('savedFitnessPlan', JSON.stringify(planData));
    alert('✅ Plan saved successfully!');
  };

  // Check if line is an exercise (contains sets/reps or common exercise keywords)
  const isExerciseLine = (text: string): boolean => {
    const exerciseKeywords = ['sets', 'reps', 'push-up', 'squat', 'plank', 'lunge', 'crunch', 'press', 'curl', 'row', 'pull', 'lift', 'walk', 'run', 'jog', 'stretch', 'cardio', 'yoga'];
    const lowerText = text.toLowerCase();
    return exerciseKeywords.some(keyword => lowerText.includes(keyword));
  };

  // Check if line is a meal (contains calories, protein, or meal keywords)
  const isMealLine = (text: string): boolean => {
    const mealKeywords = ['calories', 'protein', 'carbs', 'fat', 'breakfast', 'lunch', 'dinner', 'snack', 'meal', 'g protein', 'kcal'];
    const lowerText = text.toLowerCase();
    return mealKeywords.some(keyword => lowerText.includes(keyword));
  };

  const highlightImportantText = (text: string) => {
    const highlightPatterns = [
      { pattern: /(\d+\s*sets?|\d+\s*reps?|\d+\s*x\s*\d+)/gi, color: 'bg-blue-200 dark:bg-blue-900/50', label: 'exercise' },
      { pattern: /(\d+\s*calories?|\d+g\s*protein|\d+g\s*carbs?|\d+g\s*fat)/gi, color: 'bg-green-200 dark:bg-green-900/50', label: 'nutrition' },
      { pattern: /(breakfast|lunch|dinner|snack|pre-workout|post-workout)/gi, color: 'bg-amber-200 dark:bg-amber-900/50', label: 'meal' },
      { pattern: /(monday|tuesday|wednesday|thursday|friday|saturday|sunday|day\s*\d+)/gi, color: 'bg-purple-200 dark:bg-purple-900/50', label: 'day' },
      { pattern: /(rest|recovery|important|note|tip|warning)/gi, color: 'bg-rose-200 dark:bg-rose-900/50', label: 'important' },
      { pattern: /(\d+\s*minutes?|\d+\s*hours?|\d+\s*seconds?)/gi, color: 'bg-cyan-200 dark:bg-cyan-900/50', label: 'time' },
    ];

    const highlights: Array<{ text: string; color: string; start: number; end: number }> = [];

    highlightPatterns.forEach(({ pattern, color }) => {
      const matches = [...text.matchAll(pattern)];
      matches.forEach((match) => {
        if (match.index !== undefined) {
          highlights.push({
            text: match[0],
            color,
            start: match.index,
            end: match.index + match[0].length,
          });
        }
      });
    });

    highlights.sort((a, b) => a.start - b.start);

    if (highlights.length === 0) {
      return <span>{text}</span>;
    }

    const elements = [];
    let lastIndex = 0;

    highlights.forEach((highlight, index) => {
      if (highlight.start > lastIndex) {
        elements.push(
          <span key={`text-${index}`}>{text.substring(lastIndex, highlight.start)}</span>
        );
      }

      elements.push(
        <mark
          key={`highlight-${index}`}
          className={`${highlight.color} px-1.5 py-0.5 rounded-md font-semibold transition-all duration-200 hover:scale-105 inline-block mx-0.5`}
        >
          {highlight.text}
        </mark>
      );

      lastIndex = highlight.end;
    });

    if (lastIndex < text.length) {
      elements.push(<span key="text-end">{text.substring(lastIndex)}</span>);
    }

    return <>{elements}</>;
  };

  const renderContent = (content: string, contentType: TabType) => {
    return content.split('\n').map((line: string, index: number) => {
      const isHeader: boolean = line.includes('═══') || line.startsWith('##') || line.startsWith('📅') || line.startsWith('🥗') || line.startsWith('💡') || line.startsWith('**Day') || line.includes('WORKOUT PLAN') || line.includes('DIET PLAN');
      const isBullet: boolean = line.trim().startsWith('•') || line.trim().startsWith('-') || line.trim().startsWith('*');
      
      // Check if this specific line is an exercise or meal
      const isExercise: boolean = contentType === 'workout' && isBullet && isExerciseLine(line);
      const isMeal: boolean = contentType === 'diet' && isBullet && isMealLine(line);

      if (line.trim() === '' || line.includes('═══')) return null;

      return (
        <motion.div 
          key={index} 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.01 }}
          className="mb-3"
        >
          {isHeader ? (
            <div className="relative my-8">
              <div className="absolute left-0 top-1/2 w-full h-1 bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200 dark:from-indigo-800 dark:via-purple-800 dark:to-pink-800 rounded-full"></div>
              <h3 className="relative inline-block pr-6 bg-white dark:bg-gray-800 text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400">
                {line.replace(/##/g, '').replace(/\*\*/g, '').trim()}
              </h3>
            </div>
          ) : isBullet ? (
            <div className="flex items-start gap-4 ml-5 mb-3 p-4 rounded-xl bg-gradient-to-r from-indigo-50/50 to-purple-50/50 dark:from-gray-700/30 dark:to-gray-600/30 hover:from-indigo-100/70 hover:to-purple-100/70 dark:hover:from-gray-700/50 dark:hover:to-gray-600/50 transition-all duration-300 border border-indigo-100/50 dark:border-gray-600/50 shadow-sm hover:shadow-md group">
              <motion.span 
                whileHover={{ scale: 1.2, rotate: 360 }}
                transition={{ duration: 0.3 }}
                className="text-indigo-600 dark:text-indigo-400 font-bold mt-1 text-xl flex-shrink-0"
              >
                •
              </motion.span>
              <div className="flex-1">
                <p className="text-gray-800 dark:text-gray-200 font-medium leading-relaxed mb-2">
                  {highlightImportantText(line.replace(/^[•\-\*]\s*/, '').replace(/\*\*/g, ''))}
                </p>
                
                {/* Image generation button for exercises and meals */}
                {(isExercise || isMeal) && (
                  <motion.button
                    whileHover={{ scale: 1.05, x: 5 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleGenerateImage(line.replace(/^[•\-\*]\s*/, '').replace(/\*\*/g, ''), isExercise ? 'exercise' : 'food')}
                    disabled={imageLoading}
                    className={`mt-2 inline-flex items-center gap-2 text-sm px-4 py-2 ${
                      isExercise 
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700' 
                        : 'bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700'
                    } text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-md hover:shadow-lg font-bold`}
                  >
                    <span className="text-lg">{isExercise ? '💪' : '🍽️'}</span>
                    <span>View {isExercise ? 'Exercise' : 'Meal'} Image</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </motion.button>
                )}
              </div>
            </div>
          ) : (
            <p className="text-gray-800 dark:text-gray-200 mb-3 px-2 font-medium leading-relaxed">
              {highlightImportantText(line.replace(/\*\*/g, ''))}
            </p>
          )}
        </motion.div>
      );
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-950 dark:via-indigo-950 dark:to-purple-950 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-4 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-96 h-96 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto relative z-10"
      >
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-3xl shadow-2xl p-8 sm:p-10 mb-8 relative overflow-hidden border-2 border-white/20"
        >
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-40 h-40 bg-white rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-10 right-10 w-56 h-56 bg-yellow-300 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          </div>

          <div className="absolute top-0 left-0 w-24 h-24 border-t-4 border-l-4 border-white/30 rounded-tl-3xl"></div>
          <div className="absolute bottom-0 right-0 w-24 h-24 border-b-4 border-r-4 border-white/30 rounded-br-3xl"></div>

          <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-white text-center md:text-left">
              <motion.h2 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="text-4xl sm:text-5xl font-black mb-3 drop-shadow-lg"
              >
                🎉 Your Personalized Plan
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="text-lg text-blue-100 font-medium"
              >
                Crafted specifically for <span className="font-bold text-yellow-200">{userData.name}</span> | Goal: <span className="font-bold text-green-200">{userData.goal}</span>
              </motion.p>
            </div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap gap-3 justify-center"
            >
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={savePlan}
                className="px-6 py-3 bg-white text-blue-600 rounded-xl font-bold shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center gap-2"
              >
                <span className="text-xl">💾</span>
                <span>Save Plan</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={exportToPDF}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center gap-2 border-2 border-white/20"
              >
                <span className="text-xl">📄</span>
                <span>Export PDF</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={onRegenerate}
                className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-600 text-white rounded-xl font-bold shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center gap-2 border-2 border-white/20"
              >
                <span className="text-xl">🔄</span>
                <span>Regenerate</span>
              </motion.button>
            </motion.div>
          </div>
        </motion.div>

        {/* Audio Controls */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-2xl p-6 sm:p-8 mb-8 border-2 border-indigo-100 dark:border-gray-700 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-purple-100 to-transparent dark:from-purple-900/20 rounded-full blur-3xl"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl shadow-lg">
                <span className="text-3xl">🔊</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">
                Listen to Your Plan
              </h3>
            </div>
            <div className="flex flex-wrap gap-4">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleTextToSpeech(workoutSection, 'workout')}
                disabled={audioLoading}
                className={`px-8 py-4 ${audioPlaying === 'workout' ? 'bg-gradient-to-r from-blue-700 to-blue-800 shadow-2xl shadow-blue-500/50' : 'bg-gradient-to-r from-blue-600 to-blue-700'} text-white rounded-2xl font-bold shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center gap-3 border-2 border-white/20`}
              >
                <span className="text-2xl">{audioPlaying === 'workout' ? '▶️' : '🏋️'}</span>
                <span>{audioPlaying === 'workout' ? 'Playing Workout...' : 'Read Workout Plan'}</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleTextToSpeech(dietSection, 'diet')}
                disabled={audioLoading}
                className={`px-8 py-4 ${audioPlaying === 'diet' ? 'bg-gradient-to-r from-orange-700 to-orange-800 shadow-2xl shadow-orange-500/50' : 'bg-gradient-to-r from-orange-600 to-orange-700'} text-white rounded-2xl font-bold shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center gap-3 border-2 border-white/20`}
              >
                <span className="text-2xl">{audioPlaying === 'diet' ? '▶️' : '🥗'}</span>
                <span>{audioPlaying === 'diet' ? 'Playing Diet...' : 'Read Diet Plan'}</span>
              </motion.button>
              {audioPlaying && (
                <motion.button
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={stopAudio}
                  className="px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-2xl font-bold shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center gap-3 border-2 border-white/20"
                >
                  <span className="text-2xl">⏹️</span>
                  <span>Stop</span>
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Quick Image Generation */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-2xl p-6 sm:p-8 mb-8 border-2 border-purple-100 dark:border-gray-700 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-pink-100 to-transparent dark:from-pink-900/20 rounded-full blur-3xl"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl shadow-lg">
                <span className="text-3xl">🖼️</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">
                Quick Image Generation
              </h3>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Exercise Examples */}
              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-2xl p-5 border border-purple-200 dark:border-gray-600">
                <h4 className="font-black text-lg text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <span className="text-2xl">💪</span>
                  Generate Exercise Images:
                </h4>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleGenerateImage("person doing push-ups in gym", 'exercise')}
                    disabled={imageLoading}
                    className="px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-700 hover:to-purple-800 disabled:opacity-50 transition-all duration-300 text-sm font-bold shadow-lg hover:shadow-xl hover:scale-105"
                  >
                    Push-ups
                  </button>
                  <button
                    onClick={() => handleGenerateImage("person doing squats in gym", 'exercise')}
                    disabled={imageLoading}
                    className="px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-700 hover:to-purple-800 disabled:opacity-50 transition-all duration-300 text-sm font-bold shadow-lg hover:shadow-xl hover:scale-105"
                  >
                    Squats
                  </button>
                  <button
                    onClick={() => handleGenerateImage("person doing plank exercise", 'exercise')}
                    disabled={imageLoading}
                    className="px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-700 hover:to-purple-800 disabled:opacity-50 transition-all duration-300 text-sm font-bold shadow-lg hover:shadow-xl hover:scale-105"
                  >
                    Plank
                  </button>
                  <button
                    onClick={() => handleGenerateImage("person doing cardio walking", 'exercise')}
                    disabled={imageLoading}
                    className="px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-700 hover:to-purple-800 disabled:opacity-50 transition-all duration-300 text-sm font-bold shadow-lg hover:shadow-xl hover:scale-105"
                  >
                    Cardio Walk
                  </button>
                  <button
                    onClick={() => handleGenerateImage("person jogging outdoors", 'exercise')}
                    disabled={imageLoading}
                    className="px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-700 hover:to-purple-800 disabled:opacity-50 transition-all duration-300 text-sm font-bold shadow-lg hover:shadow-xl hover:scale-105"
                  >
                    Jogging
                  </button>
                  <button
                    onClick={() => handleGenerateImage("person doing stretching exercises", 'exercise')}
                    disabled={imageLoading}
                    className="px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-700 hover:to-purple-800 disabled:opacity-50 transition-all duration-300 text-sm font-bold shadow-lg hover:shadow-xl hover:scale-105"
                  >
                    Stretching
                  </button>
                </div>
              </div>

              {/* Meal Examples */}
              <div className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 rounded-2xl p-5 border border-orange-200 dark:border-gray-600">
                <h4 className="font-black text-lg text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <span className="text-2xl">🍽️</span>
                  Generate Meal Images:
                </h4>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleGenerateImage("healthy breakfast with oats and fruits", 'food')}
                    disabled={imageLoading}
                    className="px-4 py-2 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-xl hover:from-orange-700 hover:to-orange-800 disabled:opacity-50 transition-all duration-300 text-sm font-bold shadow-lg hover:shadow-xl hover:scale-105"
                  >
                    Breakfast
                  </button>
                  <button
                    onClick={() => handleGenerateImage("grilled chicken with vegetables and rice", 'food')}
                    disabled={imageLoading}
                    className="px-4 py-2 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-xl hover:from-orange-700 hover:to-orange-800 disabled:opacity-50 transition-all duration-300 text-sm font-bold shadow-lg hover:shadow-xl hover:scale-105"
                  >
                    Lunch
                  </button>
                  <button
                    onClick={() => handleGenerateImage("healthy dinner plate with protein", 'food')}
                    disabled={imageLoading}
                    className="px-4 py-2 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-xl hover:from-orange-700 hover:to-orange-800 disabled:opacity-50 transition-all duration-300 text-sm font-bold shadow-lg hover:shadow-xl hover:scale-105"
                  >
                    Dinner
                  </button>
                  <button
                    onClick={() => handleGenerateImage("healthy snack with nuts and fruits", 'food')}
                    disabled={imageLoading}
                    className="px-4 py-2 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-xl hover:from-orange-700 hover:to-orange-800 disabled:opacity-50 transition-all duration-300 text-sm font-bold shadow-lg hover:shadow-xl hover:scale-105"
                  >
                    Snacks
                  </button>
                  <button
                    onClick={() => handleGenerateImage("grilled salmon with broccoli", 'food')}
                    disabled={imageLoading}
                    className="px-4 py-2 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-xl hover:from-orange-700 hover:to-orange-800 disabled:opacity-50 transition-all duration-300 text-sm font-bold shadow-lg hover:shadow-xl hover:scale-105"
                  >
                    Salmon
                  </button>
                  <button
                    onClick={() => handleGenerateImage("fresh salad with vegetables", 'food')}
                    disabled={imageLoading}
                    className="px-4 py-2 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-xl hover:from-orange-700 hover:to-orange-800 disabled:opacity-50 transition-all duration-300 text-sm font-bold shadow-lg hover:shadow-xl hover:scale-105"
                  >
                    Salad
                  </button>
                </div>
              </div>
            </div>

            {/* Custom Image Generation */}
            <div className="mt-6 p-5 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 dark:from-blue-900/20 dark:via-purple-900/20 dark:to-pink-900/20 rounded-2xl border-2 border-blue-200 dark:border-gray-600">
              <h4 className="font-black text-lg text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="text-2xl">✨</span>
                Custom Image:
              </h4>
              <div className="flex gap-3">
                <input
                  type="text"
                  id="customPrompt"
                  placeholder="e.g., 'grilled salmon with broccoli' or 'deadlift exercise'"
                  className="flex-1 px-5 py-3 border-2 border-purple-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white font-medium shadow-sm transition-all duration-300"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    const input = document.getElementById('customPrompt') as HTMLInputElement;
                    if (input.value.trim()) {
                      handleGenerateImage(input.value, 'food');
                      input.value = '';
                    }
                  }}
                  disabled={imageLoading}
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 transition-all duration-300 font-bold shadow-xl hover:shadow-2xl"
                >
                  Generate
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tabs Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-2xl border-2 border-indigo-100 dark:border-gray-700 relative overflow-hidden"
        >
          {/* Decorative gradient bars */}
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
          
          {/* Tab Navigation */}
          <div className="p-6 sm:p-8 pb-0">
            <div className="flex flex-wrap gap-3 border-b-2 border-gray-200 dark:border-gray-700">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setActiveTab('workout')}
                className={`px-8 py-4 font-black text-lg rounded-t-2xl transition-all duration-300 flex items-center gap-3 ${
                  activeTab === 'workout'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg -mb-0.5 border-b-2 border-transparent'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <span className="text-2xl">🏋️</span>
                <span>Exercise Plan</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setActiveTab('diet')}
                className={`px-8 py-4 font-black text-lg rounded-t-2xl transition-all duration-300 flex items-center gap-3 ${
                  activeTab === 'diet'
                    ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-lg -mb-0.5 border-b-2 border-transparent'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <span className="text-2xl">🥗</span>
                <span>Diet Plan</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setActiveTab('motivation')}
                className={`px-8 py-4 font-black text-lg rounded-t-2xl transition-all duration-300 flex items-center gap-3 ${
                  activeTab === 'motivation'
                    ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-lg -mb-0.5 border-b-2 border-transparent'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <span className="text-2xl">💪</span>
                <span>Motivation</span>
              </motion.button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6 sm:p-10">
            <AnimatePresence mode="wait">
              {activeTab === 'workout' && (
                <motion.div
                  key="workout"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="prose dark:prose-invert max-w-none"
                >
                  {renderContent(workoutSection, 'workout')}
                </motion.div>
              )}
              {activeTab === 'diet' && (
                <motion.div
                  key="diet"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="prose dark:prose-invert max-w-none"
                >
                  {renderContent(dietSection, 'diet')}
                </motion.div>
              )}
              {activeTab === 'motivation' && (
                <motion.div
                  key="motivation"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="prose dark:prose-invert max-w-none"
                >
                  {renderContent(motivationSection, 'motivation')}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500"></div>
        </motion.div>

        {/* Image Modal */}
        <AnimatePresence mode="wait">
          {selectedImage && (
            <ImageModal 
              image={selectedImage} 
              onClose={() => setSelectedImage(null)} 
            />
          )}
        </AnimatePresence>

        {/* Loading Overlay */}
        <AnimatePresence>
          {imageLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50"
            >
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="bg-white dark:bg-gray-800 p-12 rounded-3xl shadow-2xl border-2 border-purple-200 dark:border-gray-700 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-100 via-pink-100 to-indigo-100 dark:from-purple-900/20 dark:via-pink-900/20 dark:to-indigo-900/20 animate-gradient-xy"></div>
                
                <div className="relative z-10 flex flex-col items-center">
                  <div className="relative">
                    <svg className="animate-spin h-16 w-16 text-purple-600 mb-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                    </svg>
                  </div>
                  <motion.p 
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="text-2xl font-black text-gray-900 dark:text-white mb-2"
                  >
                    Generating Image...
                  </motion.p>
                  <p className="text-base text-gray-600 dark:text-gray-400 font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Powered by Gemini AI ✨
                  </p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        @keyframes gradient-xy {
          0%, 100% {
            background-position: 0% 0%;
          }
          50% {
            background-position: 100% 100%;
          }
        }
        .animate-gradient-xy {
          background-size: 400% 400%;
          animation: gradient-xy 3s ease infinite;
        }
        mark {
          display: inline-block;
          line-height: 0em;
          padding-bottom: 0.5em;
        }
      `}</style>
    </div>
  );
}
