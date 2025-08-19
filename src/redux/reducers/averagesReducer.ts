import { createSlice } from '@reduxjs/toolkit'
import { AveragesData } from '../../features/_types'

// Initial State

const defaultState: AveragesData = {}

// Reducer

export const averagesSlice = createSlice({
    name: 'averages',
    initialState: defaultState,
    reducers: {
        initAverages: (state, action) => {
            return action.payload
        },
        default: (state) => {
            return state
        },
    },
})

export const { initAverages } = averagesSlice.actions
export default averagesSlice.reducer
