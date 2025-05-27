"use client";

import React, { useState, useEffect } from "react";
import { getCharacterById } from "@/lib/characters";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Copy, Check, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ResponseListProps {
  responses: string[];
  isLoading: boolean;
  character: string;
}

export default function ResponseList({ responses, isLoading, character }: ResponseListProps) {
  const { toast } = useToast();
  const [displayedResponses, setDisplayedResponses] = useState<string[]>([]);
  const [currentResponseIndex, setCurrentResponseIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const selectedCharacter = getCharacterById(character);

  useEffect(() => {
    if (responses.length > 0 && !isLoading) {
      setDisplayedResponses([]);
      setCurrentResponseIndex(0);
      setCurrentText("");
      setIsTyping(true);
    }
  }, [responses, isLoading]);

  useEffect(() => {
    if (!isTyping || currentResponseIndex >= responses.length) return;

    const currentResponse = responses[currentResponseIndex];
    let charIndex = 0;

    const typingInterval = setInterval(() => {
      if (charIndex < currentResponse.length) {
        setCurrentText(prev => prev + currentResponse[charIndex]);
        charIndex++;
      } else {
        clearInterval(typingInterval);
        setDisplayedResponses(prev => [...prev, currentText]);
        setCurrentText("");
        setCurrentResponseIndex(prev => prev + 1);
        setIsTyping(currentResponseIndex + 1 < responses.length);
      }
    }, 30); // 调整这个数值可以改变打字速度

    return () => clearInterval(typingInterval);
  }, [isTyping, currentResponseIndex, responses]);

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedIndex(index);
      toast({
        title: "已复制到剪贴板",
        description: "你可以直接粘贴使用了",
      });
      setTimeout(() => setCopiedIndex(null), 2000);
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  if (responses.length === 0) {
    return null;
  }

  return (
    <div className="my-8 space-y-4">
      <h2 className="text-xl font-bold mb-4 flex items-center">
        {selectedCharacter && (
          <>
            <span className="mr-2">{selectedCharacter.emoji}</span>
            <span>{selectedCharacter.name}的回击：</span>
          </>
        )}
      </h2>
      
      {displayedResponses.map((response, index) => (
        <Card 
          key={index}
          className={`border-l-4 ${selectedCharacter?.colorClass || 'border-l-[#07C160]'}`}
        >
          <CardContent className="p-4 relative">
            <p className="pr-10">{response}</p>
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2"
              onClick={() => copyToClipboard(response, index)}
            >
              {copiedIndex === index ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </CardContent>
        </Card>
      ))}
      {currentText && (
        <Card className="bg-white shadow-sm">
          <CardContent className="p-4">
            <p className="text-gray-800">
              {currentText}
              <span className="animate-pulse">|</span>
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}