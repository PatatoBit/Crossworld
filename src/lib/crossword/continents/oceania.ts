import type { Puzzle } from "../types";

/**
 * Level 6 — Oceania.
 * Coral bleaching, marine life, and ocean plastic.
 */
export const oceaniaPuzzle: Puzzle = {
  id: "oceania",
  title: "โอเชียเนีย: แนวปะการังและมหาสมุทร",
  words: [
    {
      id: "coral",
      answer: "CORAL",
      start: [0, 0, 0],
      axis: "x",
      clue: "ปะการังที่ฟอกขาวเมื่อน้ำทะเลอุ่นเกินไป",
    },
    {
      id: "ocean",
      answer: "OCEAN",
      start: [1, 0, 0],
      axis: "y",
      clue: "มหาสมุทรที่เต็มไปด้วยขยะพลาสติกและสารเคมี",
    },
    {
      id: "reef",
      answer: "REEF",
      start: [2, 0, 0],
      axis: "z",
      clue: "แนวปะการัง — บ้านของสิ่งมีชีวิตทะเลนับไม่ถ้วน",
    },
    {
      id: "wave",
      answer: "WAVE",
      start: [3, -1, 0],
      axis: "y",
      clue: "คลื่นที่พัดพาขยะและสารอาหารไปตามชายฝั่ง",
    },
    {
      id: "fish",
      answer: "FISH",
      start: [2, 0, 3],
      axis: "y",
      clue: "ปลาที่สูญเสียที่อยู่อาศัยเมื่อปะการังเสื่อม",
    },
    {
      id: "blue",
      answer: "BLUE",
      start: [3, 2, -3],
      axis: "z",
      clue: "เศรษฐกิจสีน้ำเงินที่ดูแลมหาสมุทรอย่างยั่งยืน",
    },
    {
      id: "plastic",
      answer: "PLASTIC",
      start: [1, 3, -2],
      axis: "z",
      clue: "พลาสติกในทะเลที่ทำลายสิ่งมีชีวิตและห่วงโซ่อาหาร",
    },
    {
      id: "sea",
      answer: "SEA",
      start: [1, 3, 1],
      axis: "y",
      clue: "ทะเลที่ต้องได้รับการคุ้มครองจากมลพิษ",
    },
    {
      id: "turtle",
      answer: "TURTLE",
      start: [1, 3, 2],
      axis: "y",
      clue: "เต่าทะเลที่มักกินพลาสติกผิดคิดว่าเป็นอาหาร",
    },
    {
      id: "marine",
      answer: "MARINE",
      start: [1, 5, 0],
      axis: "z",
      clue: "ระบบนิเวศทางทะเลที่เชื่อมโยงกับชีวิตบนบก",
    },
  ],
};
