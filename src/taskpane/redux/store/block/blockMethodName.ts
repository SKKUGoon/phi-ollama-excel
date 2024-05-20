/* eslint-disable office-addins/no-navigational-load */
/* eslint-disable no-undef */
import { createAsyncThunk } from "@reduxjs/toolkit";
import { ExcelSheet } from "../../../util/address";
import { AppDispatch, RootState } from "../root";

interface BlockPayload {
  context?: Excel.RequestContext;
}

const setNamedObjectHandler = async (context: Excel.RequestContext, name: ExcelSheet) => {
  const sheet = context.workbook.worksheets.getItem(name);
  sheet.load("names/items");
  await context.sync();

  console.log(sheet);
};

export const setNamedObject = createAsyncThunk<void, BlockPayload, { dispatch: AppDispatch; state: RootState }>(
  "block/setNamedObject",
  async ({ context }) => {
    if (context) {
      await setNamedObjectHandler(context, "Sheet1");
    } else {
      await Excel.run(async (context) => await setNamedObjectHandler(context, "Sheet1"));
    }
  }
);
