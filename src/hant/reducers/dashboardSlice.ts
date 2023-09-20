import { createSlice } from "@reduxjs/toolkit";
import { format } from "date-fns";

 const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState: {
        date: format(new Date(), 'yyyy-MM-dd'),
        data: {
            customers: [],
            vendors: [],
            mtces: [],
            trucks: [],
            products: [],
        }
    },
    reducers: {
        setCustomers: (state, action) => {
            state.data.customers = action.payload
        },
        setDashboardVendors: (state, action) => {
            state.data.vendors = action.payload
        },
        setDashboardProducts: (state, action) => {
            state.data.products = action.payload
        },
        setDashboardMtces: (state, action) => {
            state.data.mtces = action.payload
        },
        setDashboardTrucks: (state, action) => {
            state.data.trucks = action.payload
        },
        setDashboardDate: (state, action) => {
            state.date = action.payload;
        }, 
    }
})


export const  dashboardReducer = dashboardSlice.reducer

export const {setCustomers: setDashboardCustomers, setDashboardDate, setDashboardVendors, setDashboardProducts, setDashboardMtces, setDashboardTrucks} = dashboardSlice.actions
export const dashboardSelector = state => state.dashboard