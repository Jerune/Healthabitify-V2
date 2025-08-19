import { createSlice } from '@reduxjs/toolkit'
import updateDbMetric from '../../firebase/firestore/metrics/updateMetric'

// Initial State

const defaultState = [
    {
        order: 0,
        id: '',
        name: '',
        active: true,
        onDashboard: true,
        dataType: '',
        unit: '',
        source: '',
        categoryId: '',
        categoryIcon: '',
        isFixed: true,
        frequency: '',
        goal: '',
        conditionsMode: '',
        good: {
            mode: '',
            value: '',
        },
        medium: {
            value1: '',
            value2: '',
        },
        bad: {
            mode: '',
            value: '',
        },
        decimals: 0,
    },
]

// Reducer

export const metricSlice = createSlice({
    name: 'metric',
    initialState: defaultState,
    reducers: {
        initMetrics: (state, action) => {
            return action.payload
        },
        updateMetric: (state, action) => {
            const updatedMetric = action.payload
            const remainingMetrics = state.filter(
                (metric) => metric.id !== updatedMetric.id
            )
            updateDbMetric(updatedMetric)
            return [...remainingMetrics, updatedMetric]
        },
        default: (state) => {
            return state
        },
    },
})

export const { initMetrics, updateMetric } = metricSlice.actions
export default metricSlice.reducer
