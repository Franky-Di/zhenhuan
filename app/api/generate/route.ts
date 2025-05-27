import { NextResponse } from "next/server";
import OpenAI from "openai";

export const dynamic = 'force-dynamic';

// Initialize OpenAI client
const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY || "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",
});

export async function POST(request: Request) {
  try {
    const { opponentWords, characterPrompt } = await request.json();

    if (!opponentWords || !characterPrompt) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    const prompt = `
${characterPrompt}

对方说了：
"${opponentWords}"

请以《甄嬛传》中该角色的语气，回击对方的话。给我10句不同的、机智的、犀利的回击，每句话都要独立成段，不要使用序号。保持角色特点，语气要犀利到位。
`;

    const stream = await openai.chat.completions.create({
      model: "deepseek/deepseek-chat-v3-0324:free",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      stream: true,
    });

    // 创建一个 TransformStream 来处理流式响应
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    const transformStream = new TransformStream({
      async transform(chunk, controller) {
        const text = decoder.decode(chunk);
        const lines = text.split('\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') continue;
            
            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices[0]?.delta?.content || '';
              if (content) {
                controller.enqueue(encoder.encode(content));
              }
            } catch (e) {
              console.error('Error parsing JSON:', e);
            }
          }
        }
      },
    });

    return new Response(stream.body?.pipeThrough(transformStream), {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
      },
    });
  } catch (error: any) {
    console.error("Error generating responses:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate responses" },
      { status: 500 }
    );
  }
}