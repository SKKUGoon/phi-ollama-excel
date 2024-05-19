/* eslint-disable no-undef */
export type ExcelSheet = string;
export type ExcelCellAddress = string;
export type ExcelRangeAddress = string;

export type ExcelCellIndex = [number, number];
export type ExcelRangeIndex = [number, number, number, number];

export const CellPropDefault = {
  // style:true,
  format: {
    autoIndent: true,
    borders: {
      style: true,
      color: true,
      weight: true,
      tintAndShade: true,
    },
    fill: {
      color: true,
      pattern: true,
      // patternColor:true,
      // patternTintAndShade:true,
      // tintAndShade:true
    },
    font: {
      bold: true,
      color: true,
      italic: true,
      name: true,
      // strikethrough:true,
      // subscript:true,
      // superscript:true,
      // tintAndShade:true,
      underline: true,
      size: true,
    },
    horizontalAlignment: true,
    indentLevel: true,
    // protection:true,
    // readingOrder:true,
    shrinkToFit: true,
    textOrientation: true,
    // useStandardHeight:true,
    // useStandardWidth:true,
    verticalAlignment: true,
    wrapText: true,
  },
};
