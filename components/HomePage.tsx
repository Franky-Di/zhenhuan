"use client";

import React, { useState } from "react";
import Header from "@/components/Header";
import ArgumentForm from "@/components/ArgumentForm";
import ResponseList from "@/components/ResponseList";
import Footer from "@/components/Footer";
import { Container } from "@/components/ui/container";

export default function HomePage() {
  const [responses, setResponses] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState("");
  const [opponentWords, setOpponentWords] = useState("");

  return (
    <div className="min-h-screen flex flex-col bg-[#EDEDED]">
      <Header />
      <main className="flex-grow">
        <Container>
          <ArgumentForm
            selectedCharacter={selectedCharacter}
            setSelectedCharacter={setSelectedCharacter}
            opponentWords={opponentWords}
            setOpponentWords={setOpponentWords}
            setResponses={setResponses}
            setLoading={setLoading}
          />
          <ResponseList 
            responses={responses} 
            loading={loading} 
            character={selectedCharacter}
          />
        </Container>
      </main>
      <Footer />
    </div>
  );
}