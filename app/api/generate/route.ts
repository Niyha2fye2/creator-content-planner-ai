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

async function generateViralScore(parsed: any) {
  try {
    const scoreResponse = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
You are a viral content evaluator.

Score content from 0-100.

95-100 = Extremely viral
85-94 = Strong viral potential
70-84 = Good
50-69 = Average
30-49 = Weak
0-29 = Poor

Most content should fall between 60 and 85.
Only exceptional content should receive 90+.

Return ONLY JSON:

{
  "viral_score": 78
}
`,
        },
        {
          role: "user",
          content: JSON.stringify(parsed),
        },
      ],
      temperature: 0.3,
    });

    const raw =
      scoreResponse.choices[0].message.content || "{}";

    const scoreData = JSON.parse(raw);

    return Math.max(
      0,
      Math.min(100, Number(scoreData.viral_score) || 50)
    );
  } catch {
    return 50;
  }
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