import React from "react";
import { characters } from "@/lib/characters";
import { cn } from "@/lib/utils";

interface CharacterSelectorProps {
  selectedCharacter: string;
  setSelectedCharacter: (character: string) => void;
}

export default function CharacterSelector({
  selectedCharacter,
  setSelectedCharacter,
}: CharacterSelectorProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {characters.map((character) => (
        <div
          key={character.id}
          className={cn(
            "cursor-pointer border rounded-lg p-3 transition-all",
            selectedCharacter === character.id
              ? "border-[#07C160] bg-[#E8F8F0] shadow-sm"
              : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
          )}
          onClick={() => setSelectedCharacter(character.id)}
        >
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-[#FAFAFA] flex items-center justify-center mb-2 overflow-hidden">
              {character.emoji}
            </div>
            <p className="text-sm font-medium">{character.name}</p>
            <p className="text-xs text-gray-500 mt-1">{character.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}