/* eslint-disable no-undef */

import { createAsyncThunk } from "@reduxjs/toolkit";
import { SheetStatus } from "./dtypes";
import { AppDispatch, RootState } from "../root";
import { modelSliceAction } from "./model";

const addSheetHandler = async (
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

interface AddSheetPayload {
  context?: Excel.RequestContext;
  name: string;
  config: { visibility?: Excel.SheetVisibility; tabColor?: string };
}

export const addSheet = createAsyncThunk<void, AddSheetPayload, { dispatch: AppDispatch; state: RootState }>(
  "model/addSheet",
  async ({ context, name, config }, { dispatch }) => {
    if (context) {
      const [isNew, sheetInfo] = await addSheetHandler(context, name, config);
      dispatch(modelSliceAction.addSheet({ name: name }));

      if (isNew) {
        console.log(`[New sheet generated] >>> ${sheetInfo}`);
      } else {
        console.log(`[Existing sheet] >>> ${sheetInfo}`);
      }
    } else {
      await Excel.run(async (context) => {
        const [isNew, sheetInfo] = await addSheetHandler(context, name, config);
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
