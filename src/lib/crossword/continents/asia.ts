import type { Puzzle } from "../types";

/**
 * Level 5 — Asia.
 * Air pollution, fossil fuels, and renewable energy transition.
 */
export const asiaPuzzle: Puzzle = {
  id: "asia",
  title: "เอเชีย: อากาศบริสุทธิ์และพลังงานสะอาด",
  words: [
    {
      id: "solar",
      answer: "SOLAR",
      start: [0, 0, 0],
      axis: "x",
      clue: "พลังงานแสงอาทิตย์ที่แทนโรงไฟฟ้าถ่านหินได้",
    },
    {
      id: "coal",
      answer: "COAL",
      start: [1, -1, 0],
      axis: "y",
      clue: "ถ่านหิน — เชื้อเพลิงฟอสซิลที่ก่อมลพิษทางอากาศ",
    },
    {
      id: "air",
      answer: "AIR",
      start: [3, 0, 0],
      axis: "z",
      clue: "อากาศในเมืองใหญ่ที่หมอกควันปกคลุมบ่อยครั้ง",
    },
    {
      id: "smog",
      answer: "SMOG",
      start: [0, 0, 0],
      axis: "z",
      clue: "หมอกควันจากโรงงานและการจราจรหนาแน่น",
    },
    {
      id: "green",
      answer: "GREEN",
      start: [0, 0, 3],
      axis: "y",
      clue: "พลังงานสีเขียวที่ปล่อยคาร์บอนต่ำ",
    },
    {
      id: "clean",
      answer: "CLEAN",
      start: [1, -1, 0],
      axis: "z",
      clue: "อากาศสะอาดที่กลับมาเมื่อเลิกพึ่งเชื้อเพลิงสกปรก",
    },
    {
      id: "wind",
      answer: "WIND",
      start: [3, -1, 1],
      axis: "y",
      clue: "พลังงานลมจากกังหันที่หมุนได้ทั้งวันทั้งคืน",
    },
    {
      id: "heat",
      answer: "HEAT",
      start: [-1, -1, 3],
      axis: "x",
      clue: "ความร้อนใต้พิภพ (geothermal) ที่ใช้ผลิตไฟฟ้าได้",
    },
    {
      id: "fossil",
      answer: "FOSSIL",
      start: [0, -2, 0],
      axis: "y",
      clue: "เชื้อเพลิงฟอสซิลที่โลกต้องเลิกพึ่งพาทีละขั้น",
    },
  ],
};
