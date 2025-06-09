import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

export interface Program {
  id: number;
  title: string;
  description: string;
  image: string;
  type: "movie" | "series";
  rating: string;
  genre: string;
  year: number;
  language: string;
}

interface ProgramsState {
  programs: {
    byIds: Record<string, Program>;
    ids: string[];
  };
  selectedProgram: Program | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: ProgramsState = {
  programs: {
    byIds: {},
    ids: [],
  },
  selectedProgram: null,
  status: "idle",
  error: null,
};

async function fetchProgramsNormalized() {
  const response = await fetch("/data.json");
  if (!response.ok) {
    throw new Error("Failed to fetch programs");
  }
  const data = await response.json();
  const programs = (data as Program[]).reduce<{
    byIds: Record<string, Program>;
    ids: string[];
  }>(
    (state, program) => {
      state.byIds[program.id.toString()] = program;
      state.ids.push(program.id.toString());
      return state;
    },
    {
      byIds: {},
      ids: [],
    }
  );
  return programs;
}

export const fetchPrograms = createAsyncThunk(
  "programs/fetchPrograms",
  async () => {
    const programs = await fetchProgramsNormalized().catch((e) => {
      throw e;
    });
    // Mocking for slow API request: 2s
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return programs;
  }
);

const programsSlice = createSlice({
  name: "programs",
  initialState,
  reducers: {
    setSelectedProgram: (state, action: PayloadAction<Program | null>) => {
      state.selectedProgram = action.payload;
    },
    clearSelectedProgram: (state) => {
      state.selectedProgram = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle fetchPrograms
      .addCase(fetchPrograms.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPrograms.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.programs = action.payload;
      })
      .addCase(fetchPrograms.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch programs";
      });
  },
});

export const { setSelectedProgram, clearSelectedProgram } =
  programsSlice.actions;
export default programsSlice.reducer;
