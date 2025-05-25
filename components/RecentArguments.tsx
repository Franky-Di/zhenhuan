"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getCharacterById } from "@/lib/characters";
import { formatDistanceToNow } from "date-fns";
import { zhCN } from "date-fns/locale";

interface RecentArgument {
  opponentWords: string;
  character: string;
  date: string;
}

interface RecentArgumentsProps {
  setOpponentWords: (words: string) => void;
  setSelectedCharacter: (character: string) => void;
}

export default function RecentArguments({
  setOpponentWords,
  setSelectedCharacter,
}: RecentArgumentsProps) {
  const [recentArguments, setRecentArguments] = useState<RecentArgument[]>([]);
  const [showRecent, setShowRecent] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("recentArguments");
    if (stored) {
      setRecentArguments(JSON.parse(stored));
      if (JSON.parse(stored).length > 0) {
        setShowRecent(true);
      }
    }
  }, []);

  const handleUseAgain = (argument: RecentArgument) => {
    setOpponentWords(argument.opponentWords);
    setSelectedCharacter(argument.character);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (recentArguments.length === 0 || !showRecent) {
    return null;
  }

  return (
    <Card className="my-6">
      <CardHeader>
        <CardTitle className="text-lg flex items-center justify-between">
          <span>最近的吵架</span>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setShowRecent(false)}
          >
            隐藏
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {recentArguments.slice(0, 3).map((argument, index) => {
            const character = getCharacterById(argument.character);
            return (
              <div 
                key={index} 
                className="flex justify-between items-center p-2 rounded-md hover:bg-gray-50"
              >
                <div className="flex-1">
                  <div className="flex items-center">
                    <span className="mr-1">{character?.emoji}</span>
                    <span className="text-sm font-medium">{character?.name}</span>
                    <span className="text-xs text-gray-500 ml-2">
                      {formatDistanceToNow(new Date(argument.date), { 
                        addSuffix: true,
                        locale: zhCN 
                      })}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 truncate">
                    回应: "{argument.opponentWords}"
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleUseAgain(argument)}
                  className="ml-2"
                >
                  再次使用
                </Button>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}