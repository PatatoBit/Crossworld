import type { Puzzle } from "../types";

/**
 * Level 1 — North America (easy).
 * Clean transport vs. urban pollution. Short words, light 3-axis crossings.
 */
export const northAmericaPuzzle: Puzzle = {
  id: "north-america",
  title: "North America: Clean Transport",
  words: [
    {
      id: "train",
      answer: "TRAIN",
      start: [0, 0, 0],
      axis: "x",
      clue: "ยานพาหนะที่เชื่อมต่อกันเป็นขบวนและขับเคลื่อนไปตามรางด้วยกำลังจักรกล ใช้เพื่อขนส่งผู้โดยสารหรือสินค้าจำนวนมากในคราวเดียว",
    },
    {
      id: "rail",
      answer: "RAIL",
      start: [1, 0, 0],
      axis: "y",
      clue: "เส้นทางหรือโครงสร้างเหล็กกล้าขนานกันสองเส้นที่ขึงยึดกับพื้น เพื่อรองรับและบังคับทิศทางล้อของขบวนรถไฟ",
    },
    {
      id: "air",
      answer: "AIR",
      start: [2, 0, 0],
      axis: "z",
      clue: "มวลแก๊สที่ห่อหุ้มโลกและใช้เป็นตัวกลางในการพยุงเครื่องบินหรือยานพาหนะทางอากาศให้เคลื่อนที่ไปได้",
    },
    {
      id: "bike",
      answer: "BIKE",
      start: [3, 0, -1],
      axis: "z",
      clue: "ยานพาหนะสองล้อที่ขับเคลื่อนด้วยแรงกำลังขาของมนุษย์ผ่านการปั่นลูกบันได เป็นการเดินทางที่เป็นมิตรต่อสิ่งแวดล้อมและช่วยลดการปล่อยคาร์บอน",
    },
    {
      id: "bus",
      answer: "BUS",
      start: [3, 0, -1],
      axis: "y",
      clue: "รถยนต์โดยสารขนาดใหญ่สำหรับให้บริการสาธารณะตามเส้นทางที่กำหนด เพื่อรองรับผู้เดินทางจำนวนมากและช่วยลดความหนาแน่นของการจราจรบนท้องถนน",
    },
  ],
};
