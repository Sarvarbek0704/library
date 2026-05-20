import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface ReadingProgress {
  bookId: number;
  currentPage: number;
  totalPages: number;
  lastReadDate: string;
  status: "not-started" | "reading" | "completed";
  notes?: string;
}

interface ReadingProgressState {
  progress: ReadingProgress[];
}

const initialState: ReadingProgressState = {
  progress: [],
};

const readingProgressSlice = createSlice({
  name: "readingProgress",
  initialState,
  reducers: {
    updateProgress: (state, action: PayloadAction<ReadingProgress>) => {
      const existingIndex = state.progress.findIndex(
        (p) => p.bookId === action.payload.bookId
      );
      if (existingIndex >= 0) {
        state.progress[existingIndex] = action.payload;
      } else {
        state.progress.push(action.payload);
      }
    },
    markAsCompleted: (state, action: PayloadAction<number>) => {
      const progress = state.progress.find((p) => p.bookId === action.payload);
      if (progress) {
        progress.status = "completed";
        progress.currentPage = progress.totalPages;
        progress.lastReadDate = new Date().toISOString();
      }
    },
    startReading: (
      state,
      action: PayloadAction<{ bookId: number; totalPages: number }>
    ) => {
      const existingIndex = state.progress.findIndex(
        (p) => p.bookId === action.payload.bookId
      );
      if (existingIndex >= 0) {
        state.progress[existingIndex].status = "reading";
        state.progress[existingIndex].lastReadDate = new Date().toISOString();
      } else {
        state.progress.push({
          bookId: action.payload.bookId,
          currentPage: 0,
          totalPages: action.payload.totalPages,
          lastReadDate: new Date().toISOString(),
          status: "reading",
        });
      }
    },
    addNote: (
      state,
      action: PayloadAction<{ bookId: number; note: string }>
    ) => {
      const progress = state.progress.find(
        (p) => p.bookId === action.payload.bookId
      );
      if (progress) {
        progress.notes = action.payload.note;
      }
    },
  },
});

export const { updateProgress, markAsCompleted, startReading, addNote } =
  readingProgressSlice.actions;
export default readingProgressSlice.reducer;
