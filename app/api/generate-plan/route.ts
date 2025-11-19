import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import type { UserFormData, GeneratePlanResponse } from "@/types";

export async function POST(req: NextRequest): Promise<NextResponse<GeneratePlanResponse>> {
  try {
    const userData: UserFormData = await req.json();
    
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash"
    });
    
    const prompt = `You are an expert fitness coach and nutritionist. Create a highly detailed, personalized fitness and nutrition plan.

USER PROFILE:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Name: ${userData.name}
• Age: ${userData.age} years | Gender: ${userData.gender}
• Height: ${userData.height} cm | Weight: ${userData.weight} kg
• Fitness Goal: ${userData.goal}
• Current Fitness Level: ${userData.level}
• Preferred Workout Location: ${userData.location}
• Dietary Preference: ${userData.diet}
${userData.medical ? `• Medical History: ${userData.medical}` : ''}
${userData.stress ? `• Stress Level: ${userData.stress}` : ''}

Generate a comprehensive plan with the following structure:

═══════════════════════════════════════════════════════
📅 7-DAY WORKOUT PLAN
═══════════════════════════════════════════════════════

For EACH day (Day 1 through Day 7), provide:
• Day name and primary focus area (e.g., Upper Body, Cardio, Legs)
• 5-6 specific exercises with:
  - Exercise name (e.g., "Barbell Bench Press", "Jump Squats")
  - Sets x Reps (e.g., "3 sets x 12 reps")
  - Rest time between sets (e.g., "60 seconds rest")
  - Brief form tip
• Total workout duration
• Intensity level (Moderate/High/Low)

Format each exercise as a bullet point with clear structure.

═══════════════════════════════════════════════════════
🥗 COMPREHENSIVE DIET PLAN
═══════════════════════════════════════════════════════

Provide meal options for each category:

**BREAKFAST OPTIONS** (Provide 3-4 options)
For each meal:
• Meal name (e.g., "Oatmeal with Berries and Almonds")
• Ingredients list
• Macros: Calories, Protein, Carbs, Fats
• Preparation time

**LUNCH OPTIONS** (Provide 3-4 options)
Same format as breakfast

**DINNER OPTIONS** (Provide 3-4 options)
Same format as breakfast

**SNACKS** (Provide 3-4 options)
Same format as breakfast

**HYDRATION & SUPPLEMENTS**
• Daily water intake recommendation
• Suggested supplements (if any)

═══════════════════════════════════════════════════════
💡 EXPERT TIPS & MOTIVATION
═══════════════════════════════════════════════════════

**LIFESTYLE TIPS**
• 3 practical tips for better results

**FORM & POSTURE TIPS**
• 2 critical form tips to prevent injury

**DAILY MOTIVATION**
• 1 powerful motivational quote

Format everything with clear headers, bullet points, and emojis for visual appeal.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const plan: string = await response.text();
    
    return NextResponse.json<GeneratePlanResponse>({ 
      success: true, 
      plan,
      userData,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Plan Generation Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json<GeneratePlanResponse>({ 
      success: false, 
      plan: '',
      userData: {} as UserFormData,
      timestamp: new Date().toISOString(),
      error: errorMessage
    } as any, { status: 500 });
  }
}
