import { getCharacterById } from "./characters";

interface ApiResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
}

export async function getArgumentResponses(
  opponentWords: string,
  characterId: string
): Promise<string[]> {
  const character = getCharacterById(characterId);
  if (!character) {
    throw new Error("Character not found");
  }

  try {
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        opponentWords,
        characterPrompt: character.prompt,
      }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data.responses;
  } catch (error) {
    console.error("Error calling API:", error);
    throw error;
  }
}