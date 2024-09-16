import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../config/api';

const API_URL = process.env.REACT_APP_URL_BACK + "/api";

// Fetch all characters for a specific user or context
export const fetchCaracter = createAsyncThunk(
  'caracter/getOne',
  async (id) => {
    return await api.get(`${API_URL}/caracters/${id}`)
      .then(response => response.data)
      .catch(err => {
        console.log("Erreur dans la récupération du caractère :", err);
        throw err;
      });
  }
);

// Add a new character
export const addCaracter = createAsyncThunk(
  'caracter/addOne',
  async ({ name, content }) => {
    const body = { name, content };
    try {
      const response = await api.post(`${API_URL}/caracters`, body);
      return response.data;
    } catch (err) {
      console.log("Erreur dans l'ajout du caractère :", err);
      throw err;
    }
  }
);

// Update a character
export const updateCaracter = createAsyncThunk(
  'caracter/update',
  async ({ id, dataToUpdate }) => {
    return await api.put(`${API_URL}/caracters/${id}`, dataToUpdate)
      .then(response => response.data)
      .catch(err => {
        console.log("Erreur dans la modification du caractère :", err);
        throw err;
      });
  }
);

// Delete a character
export const deleteCaracter = createAsyncThunk(
  'caracter/delete',
  async (id) => {
    try {
      await api.delete(`${API_URL}/caracters/${id}`);
      return id;
    } catch (err) {
      console.log("Erreur dans la suppression du caractère :", err);
      throw err;
    }
  }
);

export const fetchUserProfile = createAsyncThunk(
    'caracter/fetchUserProfile',
    async () => {
      return await api.get(`${API_URL}/me`)
        .then(response => response.data)
        .catch(err => console.log("Erreur lors de la récupération du profil utilisateur :", err));
    }
  );

const CaracterServices = createSlice({
  name: 'caracters',
  initialState: {
    caracterList: [],
    caracterInfo: {},
    status: 'idle',
    error: null,
  },
  reducers: {
    resetStatus(state) {
      state.status = 'idle';
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch character
      .addCase(fetchCaracter.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
        state.status = 'idle';
      })
      .addCase(fetchCaracter.fulfilled, (state, action) => {
        state.caracterInfo = action.payload;
        state.status = 'succeeded';
      })
      .addCase(fetchCaracter.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      // Add character
      .addCase(addCaracter.fulfilled, (state, action) => {
        state.caracterList = [...state.caracterList, action.payload];
        state.status = 'succeeded';
      })
      .addCase(addCaracter.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      // Update character
      .addCase(updateCaracter.fulfilled, (state, action) => {
        state.caracterList = state.caracterList.map((caracter) =>
          caracter.id === action.payload.id ? action.payload : caracter
        );
        state.status = 'succeeded';
      })
      .addCase(updateCaracter.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      // Delete character
      .addCase(deleteCaracter.fulfilled, (state, action) => {
        state.caracterList = state.caracterList.filter((caracter) => caracter.id !== action.payload);
        state.status = 'succeeded';
      })
      .addCase(deleteCaracter.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const caracterActions = { ...CaracterServices.actions, ...CaracterServices.extraActions };
export const caracterReducer = CaracterServices.reducer;
