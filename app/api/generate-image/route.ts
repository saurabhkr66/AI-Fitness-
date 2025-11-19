import { NextResponse } from "next/server";
export async function POST(req: Request) {
  try {
    const { prompt, type } = await req.json();
    
    let enhancedPrompt = prompt;
    if (type === 'exercise') {
      enhancedPrompt = `fitness photography ${prompt} gym professional`;
    } else if (type === 'food') {
      enhancedPrompt = `food photography ${prompt} appetizing professional`;
    }

    // Pollinations.ai - FREE image generation
    const encodedPrompt = encodeURIComponent(enhancedPrompt);
    const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=1024&nologo=true`;

    return NextResponse.json({ 
      success: true, 
      imageUrl 
    });

  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message },
      { status: 500 }
    );
  }
}