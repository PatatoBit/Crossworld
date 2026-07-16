import type { Puzzle } from "../types";

/**
 * Level 2 — South America.
 * Amazon rainforest, reforestation, and biodiversity.
 */
export const southAmericaPuzzle: Puzzle = {
  id: "south-america",
  title: "อเมริกาใต้: ป่าฝนและความหลากหลาย",
  words: [
    {
      id: "amazon",
      answer: "AMAZON",
      start: [0, 0, 0],
      axis: "x",
      clue: "ป่าฝนอเมซอน — ปอดสีเขียวของโลกที่ถูกตัดไม้ทำลาย",
    },
    {
      id: "rain",
      answer: "RAIN",
      start: [0, -1, 0],
      axis: "y",
      clue: "ฝนที่หล่อเลี้ยงระบบนิเวศป่าเขตร้อน",
    },
    {
      id: "leaf",
      answer: "LEAF",
      start: [2, 0, -2],
      axis: "z",
      clue: "ใบไม้ที่ดูดซับคาร์บอนไดออกไซด์และผลิตออกซิเจน",
    },
    {
      id: "tree",
      answer: "TREE",
      start: [2, -2, -1],
      axis: "y",
      clue: "ต้นไม้ — รากฐานของป่าและความหลากหลายทางชีวภาพ",
    },
    {
      id: "green",
      answer: "GREEN",
      start: [1, -1, -1],
      axis: "x",
      clue: "ความเขียวขจีที่กลับมาเมื่อปลูกป่าทดแทน",
    },
    {
      id: "bio",
      answer: "BIO",
      start: [4, 0, -2],
      axis: "z",
      clue: "คำนำหน้าแปลว่าสิ่งมีชีวิต เช่น ความหลากหลายทางชีวภาพ",
    },
  ],
};
