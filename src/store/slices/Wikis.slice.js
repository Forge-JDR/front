import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../config/api';

const API_URL = process.env.REACT_APP_URL_BACK + "/api";

export const fetchWikis = createAsyncThunk(
  'wiki/getAll',
  async () => {
    return await api.get(API_URL + "/wikis")
      .then(response => response.data)
      .catch(err => console.log("erreur dans la récupération des wikis :", err));
  }
);

export const fetchWiki = createAsyncThunk(
  'wiki/getOne',
  async (id) => {
    return await api.get(API_URL + "/wikis/" + id)
      .then(response => response.data)
      .catch(err => console.log("erreur dans la récupération du wiki :", err));
  }
);

export const addWiki = createAsyncThunk(
  'wiki/addOne',
  async ({ Name, Content }) => {
    const bdy = { name: Name, content: Content };
    try {
      const response = await api.post(API_URL + "/wikis", bdy);
      return response.data;
    } catch (err) {
      console.log("erreur dans l'ajout du wiki :", err);
      throw err;
    }
  }
);

export const updateWiki = createAsyncThunk(
  'wiki/update',
  async ({ id, dataToUpdate }) => {
    return await api.put(API_URL + "/wikis/" + id, dataToUpdate)
      .then(response => response.data)
      .catch(err => console.log("erreur dans la modification du wiki :", err));
  }
);

export const deleteWiki = createAsyncThunk(
  'wiki/delete',
  async (id) => {
    try {
      await api.delete(`${API_URL}/wikis/${id}`);
      return id;
    } catch (err) {
      console.log("Erreur dans la suppression du wiki :", err);
      throw err;
    }
  }
);

export const addBestiary = createAsyncThunk(
  'wiki/addBestiary',
  async ({ WikiId, Name, Content, Type }) => {
    const bdy = { name: Name, content: Content, type: Type };
    try {
      const response = await api.post(API_URL + "/wikis/" + WikiId + "/bestiaries", bdy);
      return response.data;
    } catch (err) {
      console.log("erreur dans l'ajout du bestiaire :", err);
      throw err;
    }
  }
);

export const updateBestiary = createAsyncThunk(
  'wiki/updateBestiary',
  async ({ WikiId, id, dataToUpdate }) => {
    return await api.put(API_URL + "/wikis/" + WikiId + "/bestiaries/" + id, dataToUpdate)
      .then(response => response.data)
      .catch(err => console.log("erreur dans la modification du bestiaire :", err));
  }
);

export const deleteBestiary = createAsyncThunk(
  'wiki/deleteBestiary',
  async ({ WikiId, id }) => {
    try {
      await api.delete(`${API_URL}/wikis/${WikiId}/bestiaries/${id}`);
      return id;
    } catch (err) {
      console.log("Erreur dans la suppression du bestiaire :", err);
      throw err;
    }
  }
);

export const addRace = createAsyncThunk(
  'wiki/addRace',
  async ({ WikiId, Name, Content }) => {
    const bdy = { name: Name, content: Content };
    try {
      const response = await api.post(API_URL + "/wikis/" + WikiId + "/races", bdy);
      return response.data;
    } catch (err) {
      console.log("erreur dans l'ajout de la race :", err);
      throw err;
    }
  }
);

export const updateRace = createAsyncThunk(
  'wiki/updateRace',
  async ({ WikiId, id, dataToUpdate }) => {
    return await api.put(API_URL + "/wikis/" + WikiId + "/races/" + id, dataToUpdate)
      .then(response => response.data)
      .catch(err => console.log("erreur dans la modification de la race :", err));
  }
);

export const deleteRace = createAsyncThunk(
  'wiki/deleteRace',
  async ({ WikiId, id }) => {
    try {
      await api.delete(`${API_URL}/wikis/${WikiId}/races/${id}`);
      return id;
    } catch (err) {
      console.log("Erreur dans la suppression de la race :", err);
      throw err;
    }
  }
);

// Job actions
export const addJob = createAsyncThunk(
    'wiki/addJob',
    async ({ WikiId, Name, Content }) => {
      const bdy = { name: Name, content: Content };
      try {
        const response = await api.post(`${API_URL}/wikis/${WikiId}/jobs`, bdy);
        return response.data;
      } catch (err) {
        console.log("Erreur dans l'ajout du job :", err);
        throw err;
      }
    }
  );
  
  export const updateJob = createAsyncThunk(
    'wiki/updateJob',
    async ({ WikiId, id, dataToUpdate }) => {
      return await api.put(`${API_URL}/wikis/${WikiId}/jobs/${id}`, dataToUpdate)
        .then(response => response.data)
        .catch(err => console.log("Erreur dans la modification du job :", err));
    }
  );
  
  export const deleteJob = createAsyncThunk(
    'wiki/deleteJob',
    async ({ WikiId, id }) => {
      try {
        await api.delete(`${API_URL}/wikis/${WikiId}/jobs/${id}`);
        return id;
      } catch (err) {
        console.log("Erreur dans la suppression du job :", err);
        throw err;
      }
    }
  );
  

const WikiServices = createSlice({
  name: 'wikis',
  initialState: {
    wikisList: [],
    wikiInfo: {},
    status: 'idle'
  },
  reducers: {
    resetStatus(state) {
      state.status = 'idle';
    }
  },
  extraReducers: builder => {
    builder
      .addCase(fetchWikis.fulfilled, (state, action) => {
        state.wikisList = action.payload;
        state.status = 'idle';
      })
      .addCase(fetchWiki.fulfilled, (state, action) => {
        state.wikiInfo = action.payload;
        state.wikiInfo.races = action.payload.Races || [];
        state.wikiInfo.bestiaries = action.payload.bestiaries || [];
        state.wikiInfo.jobs = action.payload.Jobs || [];
        state.status = action.meta.requestStatus;
      })
      .addCase(addWiki.fulfilled, (state, action) => {
        state.wikiInfo = action.payload;
        state.status = action.meta.requestStatus;
      })
      .addCase(updateWiki.fulfilled, (state, action) => {
        state.wikiInfo = { ...state.wikiInfo, ...action.payload };
        state.status = action.meta.requestStatus;
      })
      .addCase(deleteWiki.fulfilled, (state, action) => {
        state.wikisList = state.wikisList.filter(wiki => wiki.id !== action.payload);
      })
      // Bestiary management
      .addCase(addBestiary.fulfilled, (state, action) => {
        const newBeast = action.payload;
        if (newBeast && newBeast.id && newBeast.name) {
          state.wikiInfo.bestiaries = [...state.wikiInfo.bestiaries, newBeast];
        }
        state.status = 'idle';
      })
      .addCase(updateBestiary.fulfilled, (state, action) => {
        state.wikiInfo.bestiaries = state.wikiInfo.bestiaries.map(beast =>
          beast.id === action.payload.id ? action.payload : beast
        );
        state.status = 'idle';
      })
      .addCase(deleteBestiary.fulfilled, (state, action) => {
        state.wikiInfo.bestiaries = state.wikiInfo.bestiaries.filter(beast => beast.id !== action.payload);
        state.status = 'idle';
      })
      // Race management
      .addCase(addRace.fulfilled, (state, action) => {
        const newRace = action.payload;
        if (newRace && newRace.id && newRace.name) {
          state.wikiInfo.races = [...state.wikiInfo.races, newRace];
        }
        state.status = 'idle';
      })
      .addCase(updateRace.fulfilled, (state, action) => {
        state.wikiInfo.races = state.wikiInfo.races.map(race =>
          race.id === action.payload.id ? action.payload : race
        );
        state.status = 'idle';
      })
      .addCase(deleteRace.fulfilled, (state, action) => {
        state.wikiInfo.races = state.wikiInfo.races.filter(race => race.id !== action.payload);
        state.status = 'idle';
      })// Job management
      .addCase(addJob.fulfilled, (state, action) => {
        const newJob = action.payload;
        if (newJob && newJob.id && newJob.name) {
          state.wikiInfo.jobs = [...state.wikiInfo.jobs, newJob];
        }
        state.status = 'idle';
      })
      .addCase(updateJob.fulfilled, (state, action) => {
        state.wikiInfo.jobs = state.wikiInfo.jobs.map((job) =>
          job.id === action.payload.id ? action.payload : job
        );
        state.status = 'idle';
      })
      .addCase(deleteJob.fulfilled, (state, action) => {
        state.wikiInfo.jobs = state.wikiInfo.jobs.filter((job) => job.id !== action.payload);
        state.status = 'idle';
      });
  }
});

export const wikiActions = { ...WikiServices.actions, ...WikiServices.extraActions };
export const wikiReducer = WikiServices.reducer;
