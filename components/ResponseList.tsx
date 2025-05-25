"use client";

import React from "react";
import { getCharacterById } from "@/lib/characters";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Copy, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ResponseListProps {
  responses: string[];
  loading: boolean;
  character: string;
}

export default function ResponseList({ 
  responses, 
  loading, 
  character 
}: ResponseListProps) {
  const { toast } = useToast();
  const [copiedIndex, setCopiedIndex] = React.useState<number | null>(null);

  const selectedCharacter = getCharacterById(character);

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

  if (loading) {
    return (
      <div className="my-8 space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
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
      
      {responses.map((response, index) => (
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
    </div>
  );
}