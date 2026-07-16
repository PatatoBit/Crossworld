import type { Puzzle } from "../types";

/**
 * Level 3 — Europe.
 * Circular economy: reduce, reuse, recycle, and waste sorting.
 */
export const europePuzzle: Puzzle = {
  id: "europe",
  title: "ยุโรป: เศรษฐกิจหมุนเวียน",
  words: [
    {
      id: "recycle",
      answer: "RECYCLE",
      start: [0, 0, 0],
      axis: "x",
      clue: "รีไซเคิล — นำวัสดุใช้แล้วกลับมาแปรรูปใช้ใหม่",
    },
    {
      id: "reduce",
      answer: "REDUCE",
      start: [0, 0, 0],
      axis: "y",
      clue: "ลดการใช้ — ขั้นตอนแรกของหลัก 3R",
    },
    {
      id: "reuse",
      answer: "REUSE",
      start: [0, 0, 0],
      axis: "z",
      clue: "ใช้ซ้ำก่อนทิ้ง เพื่อยืดอายุผลิตภัณฑ์",
    },
    {
      id: "scrap",
      answer: "SCRAP",
      start: [2, -1, 0],
      axis: "y",
      clue: "เศษวัสดุที่ยังนำกลับมาใช้ในกระบวนการผลิตได้",
    },
    {
      id: "waste",
      answer: "WASTE",
      start: [6, 0, -4],
      axis: "z",
      clue: "ขยะจากการบริโภคเกินจำเป็นที่ต้องจัดการอย่างถูกวิธี",
    },
    {
      id: "paper",
      answer: "PAPER",
      start: [2, 3, 0],
      axis: "z",
      clue: "กระดาษ — วัสดุรีไซเคิลได้ถ้าแยกทิ้งถูกต้อง",
    },
    {
      id: "sort",
      answer: "SORT",
      start: [2, -1, 0],
      axis: "x",
      clue: "การคัดแยกขยะก่อนส่งไปรีไซเคิลหรือฝังกลบ",
    },
  ],
};
