import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import api from '../../config/api'

export const fetchWikis = createAsyncThunk(
    'wiki/getAll',
    async () => {
        return await api.get(process.env.REACT_APP_URL_BACK + "/wikis")
            .then(response => response.data)
            .catch(err => console.log("erreur dans la récupèration des wikis : ", err))
    }
)

export const fetchWiki = createAsyncThunk(
    'wiki/getOne',
    async (id) => {
        return await api.get(process.env.REACT_APP_URL_BACK + "/wikis/" + id)
            .then(response => response.data)
            .catch(err => 
                console.log("erreur dans la récupèration du wiki : ", err))
    }
)

export const addWiki = createAsyncThunk(
    'wiki/addOne',
    async ({ Name, Content }) => {

        return await api.post(process.env.REACT_APP_URL_BACK + "/wikis", {
            method: 'POST',
            body: JSON.stringify({
                Name: Name,
                Content: Content
            })
        })
        .then(wiki => 
            wiki.json()
         )
        .catch(err => console.log("erreur dans l'ajout du wiki : ", err))
    }
)

export const updateWiki = createAsyncThunk(
    'wiki/update',
    async ({ id, Name, Content }) => {
        return await fetch(process.env.REACT_APP_URL_BACK + "/wikis" + id, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                Name: Name,
                Content: Content
            })
        })
            .then(response => response.json())
            .then(wiki => wiki.data)
            .catch(err => console.log("erreur dans la modification du wiki : ", err))
    }
)

const WikiServices = createSlice({
    name: 'wikis',
    initialState: {
        wikisList: [],
        wikiInfo: {},
        status: 'idle'
    },
    reducers: {
        resetStatus(state) {
            state.status = 'idle'
        }
    },
    extraReducers: builder => {
        builder
            .addCase(fetchWikis.fulfilled, (state, action) => {
                state.wikisList.push(action.payload)
                state.status = 'idle'
            })
            .addCase(fetchWiki.fulfilled, (state, action) => {
                state.wikiInfo = action.payload
                state.status = action.meta.requestStatus
            })
            .addCase(addWiki.fulfilled, (state, action) => {
                fetchWikis()
                state.status = action.meta.requestStatus
            })
            .addCase(updateWiki.fulfilled, (state, action) => {
                fetchWikis()
                state.status = action.meta.requestStatus
            })
    }
})

export const wikiActions = { ...WikiServices.actions, ...WikiServices.extraActions }

export const wikiReducer = WikiServices.reducer