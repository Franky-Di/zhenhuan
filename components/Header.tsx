import React from "react";
import { Container } from "@/components/ui/container";
import { Crown } from "lucide-react";

export default function Header() {
  return (
    <header className="bg-[#07C160] text-white py-4 shadow-md">
      <Container>
        <div className="flex items-center justify-center">
          <Crown className="h-8 w-8 mr-2" />
          <h1 className="text-2xl font-bold text-center">甄嬛教你吵架</h1>
        </div>
        <p className="text-center text-sm mt-1 opacity-90">
          用《甄嬛传》角色的语气，回击对方的话语
        </p>
      </Container>
    </header>
  );
}