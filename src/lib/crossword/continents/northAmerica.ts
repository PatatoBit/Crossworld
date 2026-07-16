import type { Puzzle } from "../types";

/**
 * Level 1 — North America (easy).
 * Clean transport vs. urban pollution. Short words, light 3-axis crossings.
 */
export const northAmericaPuzzle: Puzzle = {
  id: "north-america",
  title: "อเมริกาเหนือ: คมนาคมสะอาด",
  words: [
    {
      id: "train",
      answer: "TRAIN",
      start: [0, 0, 0],
      axis: "x",
      clue: "รถไฟ — ทางเลือกขนส่งที่ปล่อยคาร์บอนน้อยกว่ารถยนต์",
    },
    {
      id: "rail",
      answer: "RAIL",
      start: [1, 0, 0],
      axis: "y",
      clue: "รางรถไฟที่เชื่อมเมืองให้เดินทางร่วมกันได้",
    },
    {
      id: "air",
      answer: "AIR",
      start: [2, 0, 0],
      axis: "z",
      clue: "อากาศในเมืองที่มลพิษจากการจราจรทำให้แย่ลง",
    },
    {
      id: "bike",
      answer: "BIKE",
      start: [3, 0, -1],
      axis: "z",
      clue: "จักรยาน — การเดินทางระยะสั้นที่ไม่ใช้เชื้อเพลิง",
    },
    {
      id: "bus",
      answer: "BUS",
      start: [3, 0, -1],
      axis: "y",
      clue: "รถโดยสารสาธารณะที่ช่วยลดจำนวนรถส่วนตัว",
    },
  ],
};
