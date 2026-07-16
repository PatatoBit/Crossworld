import type { Puzzle } from "../types";

/**
 * Level 7 — Antarctica (hardest).
 * Ice melt, carbon, and global climate stability.
 */
export const antarcticaPuzzle: Puzzle = {
  id: "antarctica",
  title: "Antarctica: Ice & Climate",
  words: [
    {
      id: "glacier",
      answer: "GLACIER",
      start: [0, 0, 0],
      axis: "x",
      clue: "มวลน้ำแข็งขนาดใหญ่ที่เกิดจากการสะสมตัวของหิมะทับถมกันเป็นเวลานานจนกลายเป็นน้ำแข็ง",
    },
    {
      id: "climate",
      answer: "CLIMATE",
      start: [1, -1, 0],
      axis: "y",
      clue: "ภูมิอากาศ หรือ สภาพภูมิอากาศ",
    },
    {
      id: "ice",
      answer: "ICE",
      start: [4, 0, 0],
      axis: "z",
      clue: "สถานะของแข็งของน้ำ ",
    },
    {
      id: "melt",
      answer: "MELT",
      start: [5, -1, 0],
      axis: "y",
      clue: "ละลาย หรือ หลอมเหลว",
    },
    {
      id: "carbon",
      answer: "CARBON",
      start: [3, 0, 0],
      axis: "y",
      clue: "ธาตุเคมีที่มีสัญลักษณ์ C และมีเลขอะตอม 6 เป็นอโลหะที่เป็นองค์ประกอบพื้นฐานของสิ่งมีชีวิตทุกชนิด",
    },
    {
      id: "polar",
      answer: "POLAR",
      start: [2, 0, -3],
      axis: "z",
      clue: "เกี่ยวกับขั้วโลก",
    },
    {
      id: "ozone",
      answer: "OZONE",
      start: [2, 0, -2],
      axis: "y",
      clue: "แก๊สที่ทำหน้าที่เป็นเกราะป้องกันตามธรรมชาติ คอยดูดกลืนรังสีอัลตราไวโอเลต (UV)",
    },
    {
      id: "warm",
      answer: "WARM",
      start: [3, 1, -1],
      axis: "z",
      clue: "อบอุ่น อุ่น",
    },
    {
      id: "sea",
      answer: "SEA",
      start: [4, -1, 2],
      axis: "y",
      clue: "ผืนน้ำเค็มขนาดใหญ่ที่เชื่อมต่อกับมหาสมุทรและล้อมรอบด้วยแผ่นดิน",
    },
    {
      id: "freeze",
      answer: "FREEZE",
      start: [6, -1, 0],
      axis: "y",
      clue: "สภาวะที่ของเหลวเปลี่ยนสถานะเป็นของแข็งเนื่องจากอุณหภูมิลดต่ำลงจนถึงจุดเยือกแข็ง",
    },
    {
      id: "shelf",
      answer: "SHELF",
      start: [5, 1, -3],
      axis: "z",
      clue: "แผ่นน้ำแข็งหนาขนาดใหญ่ที่ลอยอยู่บนผิวน้ำทะเลโดยมีส่วนยึดติดอยู่กับชายฝั่งหรือธารน้ำแข็งบนบก",
    },
    {
      id: "cold",
      answer: "COLD",
      start: [1, 0, -2],
      axis: "x",
      clue: "สภาพที่มีอุณหภูมิต่ำมากเมื่อเทียบกับเกณฑ์ปกติหรืออุณหภูมิร่างกายมนุษย์",
    },
  ],
};
