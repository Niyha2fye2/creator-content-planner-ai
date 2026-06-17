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

// 🔥 improved viral scoring (more realistic distribution)
function generateViralScore(parsed: any) {
  let score = 35; // lower base to allow real spread

  // ideas (soft scaling instead of guaranteed points)
  const ideas = parsed?.ideas?.length || 0;
  score += Math.min(18, ideas * 3.2);

  // hooks (highest weight, but not linear maxing)
  const hooks = parsed?.hooks?.length || 0;
  score += Math.min(25, hooks * 3.8);

  // hashtags (diminishing returns)
  const tags = parsed?.hashtags?.length || 0;
  score += Math.min(12, tags * 1.2);

  // caption quality (now more strict + realistic)
  const captionLength = parsed?.caption?.length || 0;

  if (captionLength >= 80 && captionLength <= 160) {
    score += 18;
  } else if (captionLength >= 40) {
    score += 10;
  } else if (captionLength >= 20) {
    score += 5;
  } else {
    score -= 5;
  }

  // 🔥 realism penalty (prevents everything hitting max)
  const imbalance =
    Math.abs(ideas - 5) +
    Math.abs(hooks - 5) +
    Math.abs(tags - 10);

  score -= Math.min(10, imbalance * 1.2);

  // small controlled variance (not too random)
  score += Math.floor(Math.random() * 6); // 0–5 only

  return Math.max(0, Math.min(100, Math.round(score)));
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

    const viral_score = generateViralScore(parsed);

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