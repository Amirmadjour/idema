import { analyzeCode } from "@/Utils/analyse";

export async function POST(request) {
  try {
    const { code } = await request.json();

    if (!code) {
      return new Response(JSON.stringify({ error: "No code provided" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const analysisResult = analyzeCode(code);

    return new Response(JSON.stringify(analysisResult), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Invalid input or internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
