/* eslint-disable no-undef */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { stolog } from "../log";
import { SheetStatus } from "./dtypes";

export interface ModelState {
  // Model setup
  model: string | undefined;
  version: string | undefined;
  debugMode: boolean;

  // Excel setup
  displayLang: string | undefined;

  sheets: SheetStatus[];
  currentSheet: SheetStatus | undefined;
  workbookOption: { displayLanguage: string };
  calculationType: Excel.CalculationType;
}

const modelInit: ModelState = {
  model: undefined,
  version: undefined,
  debugMode: true,
  displayLang: undefined,
  sheets: [],
  currentSheet: undefined,
  workbookOption: { displayLanguage: "EN" },
  calculationType: Excel.CalculationType.full,
};

export const modelSlice = createSlice({
  name: "model",
  initialState: modelInit,
  reducers: {
    // State management
    toggleDebug: (state) => {
      state.debugMode = !state.debugMode;
    },
    debug: (state) => {
      console.log(state);
    },
    // Excel status actions
    language: (state) => {
      const lang = Office.context.displayLanguage;
      stolog(state, `current display language is ${lang}`);
      state.displayLang = lang;
    },
    // Sheet controlling actions
    addSheet: (state, action: PayloadAction<{ name: string }>) => {
      stolog(state, `Adding sheet ${action.payload.name}`);
      state.sheets.push(action.payload);
    },
    removeSheet: (state, action: PayloadAction<{ name: string }>) => {
      stolog(state, `Removing sheet ${action.payload.name}`);
      state.sheets = state.sheets.filter((sheet) => sheet.name !== action.payload.name);
    },
    focusSheet: (state, action: PayloadAction<{ name: string }>) => {
      stolog(state, `Focused on ${action.payload.name}`);
    },
  },
});

export const modelSliceAction = modelSlice.actions;
