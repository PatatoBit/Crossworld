import type { Puzzle } from "../types";

/**
 * Level 4 — Africa.
 * Drought, clean water access, and arid-land resilience.
 */
export const africaPuzzle: Puzzle = {
  id: "africa",
  title: "Africa: Water & Resilience",
  words: [
    {
      id: "water",
      answer: "WATER",
      start: [0, 0, 0],
      axis: "x",
      clue: "ของเหลวที่สิ่งมีชีวิตทุกสิื่่งต้องการ",
    },
    {
      id: "well",
      answer: "WELL",
      start: [0, 0, 0],
      axis: "y",
      clue: "หลุมที่ขุดลงไปเพื่อเอาน้ำใต้ดินขึ้นมาใช้",
    },
    {
      id: "rain",
      answer: "RAIN",
      start: [1, -1, 0],
      axis: "y",
      clue: "น้ำที่ตกจากท้องฟ้า ซึ่งเกิดจากการควบแน่นของไอน้ำในอากาศและกลั่ นตัวเป็นหยดน้ำเล็กๆ",
    },
    {
      id: "dam",
      answer: "DAM",
      start: [1, 0, -1],
      axis: "z",
      clue: "เขื่อน หรือทำนบกั้นน้ำ",
    },
    {
      id: "oasis",
      answer: "OASIS",
      start: [1, 1, -3],
      axis: "z",
      clue: "พื้นที่อุดมสมบูรณ์กลางทะเลทรายหรือพื้นที่กึ่งแห้งแล้ง ซึ่งเกิดจากน้ำใต้ดินที่ดันหรือซึมขึ้นมาบนผิวดิน",
    },
    {
      id: "arid",
      answer: "ARID",
      start: [1, 1, -2],
      axis: "x",
      clue: "แห้งแล้งมาก (ไม่มีความชื้น) หรือ จืดชืดและน่าเบื่อ",
    },
    {
      id: "desert",
      answer: "DESERT",
      start: [4, 1, -2],
      axis: "y",
      clue: "ทะเลทราย หรือพื้นที่แห้งแล้ง",
    },
    {
      id: "drip",
      answer: "DRIP",
      start: [4, -1, 0],
      axis: "y",
      clue: "วิธีการให้น้ำแก่พืชอย่างมีประสิทธิภาพ โดยส่งน้ำผ่านระบบท่อและปล่อยน้ำออกทีละหยดอย่างช้าๆ ไปยังบริเวณรากหรือโคนต้นพืชโดยตรง",
    },
  ],
};
