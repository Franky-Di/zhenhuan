"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { getArgumentResponses } from "@/lib/api";
import CharacterSelector from "@/components/CharacterSelector";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ArgumentFormProps {
  selectedCharacter: string;
  setSelectedCharacter: (character: string) => void;
  opponentWords: string;
  setOpponentWords: (words: string) => void;
  setResponses: (responses: string[]) => void;
  setLoading: (loading: boolean) => void;
}

export default function ArgumentForm({
  selectedCharacter,
  setSelectedCharacter,
  opponentWords,
  setOpponentWords,
  setResponses,
  setLoading,
}: ArgumentFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!opponentWords.trim()) {
      toast({
        title: "请输入对方的话",
        description: "需要知道对方说了什么，才能帮你回击！",
        variant: "destructive",
      });
      return;
    }
    
    if (!selectedCharacter) {
      toast({
        title: "请选择角色",
        description: "选择一个《甄嬛传》中的角色来回击对方",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      setLoading(true);
      
      // Store in localStorage
      const recentArguments = JSON.parse(localStorage.getItem("recentArguments") || "[]");
      const newArgument = { opponentWords, character: selectedCharacter, date: new Date().toISOString() };
      localStorage.setItem(
        "recentArguments",
        JSON.stringify([newArgument, ...recentArguments.slice(0, 9)])
      );
      
      const responses = await getArgumentResponses(opponentWords, selectedCharacter);
      setResponses(responses);
    } catch (error) {
      console.error("Error generating responses:", error);
      toast({
        title: "生成回复失败",
        description: "请稍后再试",
        variant: "destructive",
      });
      setResponses([]);
    } finally {
      setIsSubmitting(false);
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-4 mb-6 mt-6">
      <div className="mb-4">
        <label htmlFor="opponentWords" className="block text-sm font-medium mb-2">
          对方说了什么？
        </label>
        <Textarea
          id="opponentWords"
          placeholder="输入对方的话..."
          value={opponentWords}
          onChange={(e) => setOpponentWords(e.target.value)}
          className="resize-none"
          rows={3}
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">
          选择回击的角色语气
        </label>
        <CharacterSelector
          selectedCharacter={selectedCharacter}
          setSelectedCharacter={setSelectedCharacter}
        />
      </div>

      <Button
        type="submit"
        className="w-full bg-[#07C160] hover:bg-[#06a050] text-white"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 生成中...
          </>
        ) : (
          "开始吵架"
        )}
      </Button>
    </form>
  );
}