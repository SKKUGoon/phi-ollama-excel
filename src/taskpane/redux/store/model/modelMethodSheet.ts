/* eslint-disable no-undef */
import { createAsyncThunk } from "@reduxjs/toolkit";
import { SheetStatus } from "./dtypes";
import { AppDispatch, RootState } from "../root";
import { modelSliceAction } from "./model";

interface SheetPayload {
  context?: Excel.RequestContext;
  name: string; // Sheet name
}

interface UpsertSheetPayload extends SheetPayload {
  config: { visibility?: Excel.SheetVisibility; tabColor?: string };
}

interface RemoveSheetPayload extends SheetPayload {}

interface FocusSheetPayload extends SheetPayload {
  address?: string;
}

const upsertSheetHandler = async (
  context: Excel.RequestContext,
  name: string,
  config: { visibility?: Excel.SheetVisibility; tabColor?: string }
): Promise<[boolean, SheetStatus]> => {
  try {
    const worksheets = context.workbook.worksheets;
    worksheets.load("items/name");
    await context.sync();

    let isNew = false;
    let mySheet: Excel.Worksheet;

    if (!worksheets.items.some((worksheets) => name === worksheets.name)) {
      mySheet = context.workbook.worksheets.add(name);
      mySheet.load("tabColor,visibility");
      await context.sync();

      isNew = true;
    } else {
      mySheet = context.workbook.worksheets.getItem(name.replace(/'/g, ""));
      mySheet.load("tabColor,visibility");
      await context.sync();
    }

    if (config.visibility) mySheet.visibility = config.visibility;
    if (config.tabColor) mySheet.tabColor = config.tabColor;

    return [isNew, { name: name, config: config }];
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const removeSheetHandler = async (context: Excel.RequestContext, name: string): Promise<void> => {
  try {
    const worksheets = context.workbook.worksheets;
    worksheets.load("items/name");
    await context.sync();

    if (worksheets.items.some((worksheets) => name === worksheets.name)) {
      const target = context.workbook.worksheets.getItem(name);
      await context.sync();
      target.delete();
    } else {
      throw new Error(`no sheet named ${name}`);
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const focusSheetHandler = async (context: Excel.RequestContext, name: string, focusAddr?: string): Promise<void> => {
  try {
    const worksheets = context.workbook.worksheets;
    worksheets.load("items/name");
    await context.sync();

    if (worksheets.items.some((worksheets) => name === worksheets.name)) {
      const target = context.workbook.worksheets.getItem(name);
      target.activate();

      if (focusAddr) {
        target.getRange(focusAddr).select();
        await context.sync();
      }
    } else {
      throw new Error(`no sheet named ${name}`);
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const addSheet = createAsyncThunk<void, UpsertSheetPayload, { dispatch: AppDispatch; state: RootState }>(
  "model/addSheet",
  async ({ context, name, config }, { dispatch }) => {
    if (context) {
      const [isNew, sheetInfo] = await upsertSheetHandler(context, name, config);
      dispatch(modelSliceAction.addSheet({ name: name }));

      if (isNew) {
        console.log(`[New sheet generated] >>> ${sheetInfo}`);
      } else {
        console.log(`[Existing sheet] >>> ${sheetInfo}. Updated config`);
      }
    } else {
      await Excel.run(async (context) => {
        const [isNew, sheetInfo] = await upsertSheetHandler(context, name, config);
        dispatch(modelSliceAction.addSheet({ name: name }));

        if (isNew) {
          console.log(`[New sheet generated] >>> ${sheetInfo}`);
        } else {
          console.log(`[Existing sheet] >>> ${sheetInfo}`);
        }
      });
    }
  }
);

export const removeSheet = createAsyncThunk<void, RemoveSheetPayload, { dispatch: AppDispatch; state: RootState }>(
  "model/removeSheet",
  async ({ context, name }, { dispatch }) => {
    if (context) {
      await removeSheetHandler(context, name);
      dispatch(modelSliceAction.removeSheet({ name: name }));
    } else {
      await Excel.run(async (context) => {
        await removeSheetHandler(context, name);
        dispatch(modelSliceAction.removeSheet({ name: name }));
      });
    }
  }
);

export const focusSheet = createAsyncThunk<void, FocusSheetPayload, { dispatch: AppDispatch; state: RootState }>(
  "model/focusSheet",
  async ({ context, name, address }, { dispatch }) => {
    if (context) {
      await focusSheetHandler(context, name, address);
      dispatch(modelSliceAction.focusSheet({ name: name }));
    }
  }
);
