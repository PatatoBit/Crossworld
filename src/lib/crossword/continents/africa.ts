import type { Puzzle } from "../types";

/**
 * Level 4 — Africa.
 * Drought, clean water access, and arid-land resilience.
 */
export const africaPuzzle: Puzzle = {
  id: "africa",
  title: "แอฟริกา: น้ำและความยืดหยุ่น",
  words: [
    {
      id: "water",
      answer: "WATER",
      start: [0, 0, 0],
      axis: "x",
      clue: "น้ำสะอาด — ทรัพยากรพื้นฐานที่หลายพื้นที่ขาดแคลน",
    },
    {
      id: "well",
      answer: "WELL",
      start: [0, 0, 0],
      axis: "y",
      clue: "บ่อน้ำที่ชุมชนขุดเพื่อเข้าถึงน้ำบาดาล",
    },
    {
      id: "rain",
      answer: "RAIN",
      start: [1, -1, 0],
      axis: "y",
      clue: "ฝนที่เก็บกักได้ช่วยผ่านฤดูแล้ง",
    },
    {
      id: "dam",
      answer: "DAM",
      start: [1, 0, -1],
      axis: "z",
      clue: "เขื่อนหรือฝายกักเก็บน้ำสำหรับเกษตรและอุปโภค",
    },
    {
      id: "oasis",
      answer: "OASIS",
      start: [1, 1, -3],
      axis: "z",
      clue: "โอเอซิส — จุดชุ่มน้ำกลางทะเลทรายที่พึ่งพาได้",
    },
    {
      id: "arid",
      answer: "ARID",
      start: [1, 1, -2],
      axis: "x",
      clue: "สภาพแห้งแล้งที่ต้องการพืชและการจัดการน้ำที่เหมาะสม",
    },
    {
      id: "desert",
      answer: "DESERT",
      start: [4, 1, -2],
      axis: "y",
      clue: "ทะเลทรายที่ขยายตัวเมื่อดินเสื่อมและฝนน้อยลง",
    },
    {
      id: "drip",
      answer: "DRIP",
      start: [4, -1, 0],
      axis: "y",
      clue: "ระบบน้ำหยดที่ใช้น้ำน้อยแต่หล่อเลี้ยงพืชได้ตรงจุด",
    },
  ],
};
