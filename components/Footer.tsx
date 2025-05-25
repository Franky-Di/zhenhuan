import React from "react";
import { Container } from "@/components/ui/container";

export default function Footer() {
  return (
    <footer className="bg-[#F5F5F5] py-3 border-t border-gray-200">
      <Container>
        <p className="text-center text-sm text-gray-500">
          © 2025 甄嬛教你吵架 · 所有"回击"仅供娱乐
        </p>
      </Container>
    </footer>
  );
}