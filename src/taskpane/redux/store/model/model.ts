/* eslint-disable no-undef */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { stolog } from "../log";
import { SheetStatus } from "./dtypes";

export interface ModelState {
  // Model setup
  model: string | undefined;
  version: string | undefined;
  debugMode: boolean;

  sheets: SheetStatus[];
  currentSheet: SheetStatus | undefined;
  workbookOption: { displayLanguage: string };
  calculationType: Excel.CalculationType;
}

const modelInit: ModelState = {
  model: undefined,
  version: undefined,
  debugMode: true,
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
    // Sheet controlling actions
    addSheet: (state, action: PayloadAction<{ name: string }>) => {
      stolog(state, `Adding sheet ${action.payload.name}`);
      state.sheets.push(action.payload);
    },
    removeSheet: (state, action: PayloadAction<{ name?: string; id?: string }>) => {
      if (action.payload.name) {
        stolog(state, `Removing sheet ${action.payload.name}`);
        state.sheets = state.sheets.filter((sheet) => sheet.name !== action.payload.name);
      }
    },
  },
});

export const modelSliceAction = modelSlice.actions;
