import OpenAI from "openai";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function generateViralScore(parsed: any) {
  let score = 40;

  const ideas = parsed?.ideas || [];
  const hooks = parsed?.hooks || [];
  const hashtags = parsed?.hashtags || [];
  const caption = parsed?.caption || "";

  // Hook strength
  hooks.forEach((hook: string) => {
    if (
      hook.includes("Nobody") ||
      hook.includes("POV") ||
      hook.includes("Stop") ||
      hook.includes("Don't") ||
      hook.includes("?")
    ) {
      score += 4;
    }
  });

  // Idea quality
  score += Math.min(15, ideas.length * 2);

  // Caption quality
  if (caption.length > 150) score += 10;
  else if (caption.length > 80) score += 7;
  else if (caption.length > 40) score += 4;

  // Hashtag quality
  score += Math.min(10, hashtags.length);

  // Variety bonus
  const uniqueWords = new Set(
    JSON.stringify(parsed)
      .toLowerCase()
      .split(/\W+/)
      .filter(Boolean)
  );

  score += Math.min(15, uniqueWords.size / 8);

  // Random variance
  score += Math.floor(Math.random() * 21) - 10;

  return Math.max(25, Math.min(100, Math.round(score)));
}
export async function POST(req: Request) {
  try {
    const { platform, topic, niche, user_id } = await req.json();

    if (!user_id) {
      return NextResponse.json({ error: "No user_id" }, { status: 400 });
    }

    const systemPrompt = `
You are a professional social media strategist.

Return ONLY valid JSON in this exact format:

{
  "ideas": ["idea 1", "idea 2", "idea 3", "idea 4", "idea 5"],
  "hooks": ["hook 1", "hook 2", "hook 3", "hook 4", "hook 5"],
  "caption": "one clean caption only",
  "hashtags": ["#tag1", "#tag2", "#tag3", "#tag4", "#tag5", "#tag6", "#tag7", "#tag8", "#tag9", "#tag10"]
}
`;

    const userPrompt = `
Platform: ${platform}
Topic: ${topic}
Niche: ${niche}
`;

    const ai = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.85, // slightly more variation
    });

    const raw = ai.choices[0].message.content || "{}";

    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch (err) {
      return NextResponse.json(
        { error: "AI returned invalid JSON", raw },
        { status: 500 }
      );
    }

    const viral_score = await generateViralScore(parsed);

    const { error } = await supabase.from("ai_generations").insert({
      user_id,
      prompt: `${platform} | ${topic} | ${niche}`,
      response: parsed,
      viral_score,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      result: parsed,
      viral_score,
    });

  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}