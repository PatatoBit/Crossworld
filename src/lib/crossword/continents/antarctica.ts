import type { Puzzle } from "../types";

/**
 * Level 7 — Antarctica (hardest).
 * Ice melt, carbon, and global climate stability.
 */
export const antarcticaPuzzle: Puzzle = {
  id: "antarctica",
  title: "แอนตาร์กติกา: น้ำแข็งและภูมิอากาศ",
  words: [
    {
      id: "glacier",
      answer: "GLACIER",
      start: [0, 0, 0],
      axis: "x",
      clue: "ธารน้ำแข็งที่ละลายเร็วขึ้นจากภาวะโลกร้อน",
    },
    {
      id: "climate",
      answer: "CLIMATE",
      start: [1, -1, 0],
      axis: "y",
      clue: "ภูมิอากาศโลกที่เชื่อมโยงกับเสถียรภาพของขั้วโลก",
    },
    {
      id: "ice",
      answer: "ICE",
      start: [4, 0, 0],
      axis: "z",
      clue: "น้ำแข็งขั้วโลกที่สะท้อนแสงอาทิตย์กลับสู่อวกาศ",
    },
    {
      id: "melt",
      answer: "MELT",
      start: [5, -1, 0],
      axis: "y",
      clue: "การละลายที่ทำให้น้ำทะเลทั่วโลกสูงขึ้น",
    },
    {
      id: "carbon",
      answer: "CARBON",
      start: [3, 0, 0],
      axis: "y",
      clue: "คาร์บอนในบรรยากาศที่เร่งภาวะเรือนกระจก",
    },
    {
      id: "polar",
      answer: "POLAR",
      start: [2, 0, -3],
      axis: "z",
      clue: "เขตขั้วโลกที่อ่อนไหวต่อการเปลี่ยนแปลงอุณหภูมิ",
    },
    {
      id: "ozone",
      answer: "OZONE",
      start: [2, 0, -2],
      axis: "y",
      clue: "ชั้นโอโซนที่เคยบางลงเหนือแอนตาร์กติกา",
    },
    {
      id: "warm",
      answer: "WARM",
      start: [3, 1, -1],
      axis: "z",
      clue: "อากาศที่อุ่นขึ้นทำให้แผ่นน้ำแข็งไม่เสถียร",
    },
    {
      id: "sea",
      answer: "SEA",
      start: [4, -1, 2],
      axis: "y",
      clue: "ระดับน้ำทะเลที่สูงขึ้นเมื่อน้ำแข็งขั้วโลกละลาย",
    },
    {
      id: "freeze",
      answer: "FREEZE",
      start: [6, -1, 0],
      axis: "y",
      clue: "การแข็งตัวตามฤดูกาลที่สั้นลงทุกปี",
    },
    {
      id: "shelf",
      answer: "SHELF",
      start: [5, 1, -3],
      axis: "z",
      clue: "ชั้นน้ำแข็งลอยน้ำ (ice shelf) ที่พังทลายได้เมื่ออุ่นขึ้น",
    },
    {
      id: "cold",
      answer: "COLD",
      start: [1, 0, -2],
      axis: "x",
      clue: "ความเย็นของขั้วโลกที่ช่วยรักษาสมดุลอุณหภูมิโลก",
    },
  ],
};
