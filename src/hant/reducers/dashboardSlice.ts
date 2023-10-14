import { createSlice } from "@reduxjs/toolkit";
import { endOfWeek, format, startOfWeek } from "date-fns";

export const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState: {
        date: format(new Date(), 'yyyy-MM-dd'),
        dates: {
            startDate: format(startOfWeek(new Date()), 'yyyy-MM-dd'),
            endDate: format(endOfWeek(new Date()), 'yyyy-MM-dd')
        }, 
        data: {
            customers: [],
            vendors: [],
            mtces: [],
            trucks: [],
            products: [],
            inventoryBySales:[],
            productUsage: [],
            customerData: [],
            vendorData: [],
            truckMtces: [],
        },
        selectedProduct:{name: 'Inventory'},
        selectedTruck: {number: 'None Selected'},
        selectedCustomer: {name: '-'},
        selectedVendor: {name: '-'},
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
        setDates: (state, action) =>  {
            state.dates = action.payload
        },
        setInventoryBySales: (state, action) => {
            state.data.inventoryBySales = action.payload
        },
        setProductUsage: (state, action) => {
            state.data.productUsage = action.payload
        },
        setCustomerData: (state, action) => {
            state.data.customerData = action.payload
        },
        setVendorData: (state, action) => {
            state.data.vendorData = action.payload
        },
        setTruckMtces: (state, action) => {
            state.data.truckMtces = action.payload
        },
        setSelectedProduct: (state, action) => {
            state.selectedProduct = action.payload
        },
        setSelectedTruck: (state, action) => {
            state.selectedTruck = action.payload
        },
        setSelectedCustomer: (state, action) => {
            state.selectedCustomer = action.payload
        },
        setSelectedVendor: (state, action) => {
            state.selectedVendor = action.payload
        },

    }
})

export default dashboardSlice.reducer

export const {setCustomers: setDashboardCustomers, setDashboardDate, setDashboardVendors, setDashboardProducts, setDashboardMtces, setDashboardTrucks, setDates, setInventoryBySales, setProductUsage, setSelectedProduct, setSelectedTruck, setSelectedCustomer, setSelectedVendor, setCustomerData, setVendorData, setTruckMtces} = dashboardSlice.actions

export const dashboardSelector = state => state.dashboard