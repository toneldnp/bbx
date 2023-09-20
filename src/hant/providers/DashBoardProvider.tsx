import { addDays, format, parseISO, subDays } from 'date-fns';
import React, { createContext, useContext, useState } from 'react';
import {useQuery } from 'react-query';
import { fetchCustomers, fetchMtces, fetchTrucks, fetchVendors, fetchProducts } from '../api';
import { dashboardSelector, setDashboardCustomers, setDashboardDate, setDashboardMtces, setDashboardProducts, setDashboardTrucks, setDashboardVendors } from '../reducers/dashboardSlice';
import { DashboardContext } from '../../types';
import { useSelector, useDispatch } from 'react-redux';
import { useDebounce } from 'use-debounce';
import { Link } from 'react-router-dom';
import { Naira } from '../../utils';


const DashboardContext = createContext<DashboardContext>({
    handleSubmit: () =>{},
    handleClick: ()=>{},
    customerModal: [],
    vendorModal: [],
    inventoryModal: [],
    maintenanceModal: [],
    isCustomerLoading: false,
    customers: [],
    vendors: [],
    mtces: [],
    trucks: [],
    products: [],
    date: '',
    columns: {}
})



export const DashboardProvider = ({children}) => {
    const [showCustomers, setShowCustomers] = useState<boolean>(false)
    const [showInventory, setShowInventory] = useState<boolean>(false)
    const [showVendor, setShowVendor] = useState<boolean>(false)
    const [showMaintenance, setShowMaintenance] = useState<boolean>(false)
    const {data:{customers, vendors, products, mtces, trucks},  date} = useSelector(dashboardSelector)
    const debouncedDate = useDebounce(date, 1000)
    const dispatch = useDispatch()
    const columns = {
        customers: [
            {label: 'Name', name: 'name', formatter: (data,value)=> <Link to={`customers/statement/${data.id}`}>{value}</Link>},
            {label: 'Balance', name: 'accountBalance', formatter: (data, value) => Naira(value)}
        ],
        vendors: [
            {label: 'Name', name: 'name', formatter: (data,value)=> <Link to={`vendors/statement/${data.id}`}>{value}</Link>},
            {label: 'Balance', name: 'accountBalance', formatter: (id, value) => Naira(value)}
        ],

        products:  [
            {label: 'Product', name: 'name', formatter: (data,value)=> <Link state={data} to={`inventory/${data.id}`}>{value}</Link>},
            {label: 'Stock', name: 'stock', formatter: (id, value) => (value)}
        ],

        mtces: [
            {label: 'Maintenance', name: 'number', formatter: (data,value)=> <Link state={data} to={``}>{value}</Link>},
            {label: 'Total', name: 'amount', formatter: (id, value) => Naira(value)}
        ]


    }
    
    const {isLoading: isCustomerLoading} = useQuery(['customer',debouncedDate], ()=>fetchCustomers(date), {
        onSuccess: ({data: {data}}) => {
            dispatch(setDashboardCustomers(data))
        },
        onError: (error) => {
            console.log(error)
        }
    })

    const {isLoading: isVendorLoading} = useQuery(['vendors',debouncedDate], ()=>fetchVendors(date), {
        onSuccess: ({data: {data}})=>{
            dispatch(setDashboardVendors(data))
        },
        onError: ()=>{

        }
    })

    const {isLoading: isProductLoading} = useQuery(['products',debouncedDate], ()=>fetchProducts(date), {
        onSuccess: ({data: {data}})=>{
            dispatch(setDashboardProducts(data))
        },
        onError: ()=>{

        }
    })
    const {isLoading: isMtcesLoading} = useQuery(['mtces',debouncedDate], ()=>fetchMtces(date), {
        onSuccess: ({data: {data}})=>{
            dispatch(setDashboardMtces(data))
        },
        onError: ()=>{

        }
    })
    const {isLoading: isTrucksLoading} = useQuery(['trucks',debouncedDate], ()=>fetchTrucks(), {
        onSuccess: ({data:{data}})=>{
            dispatch(setDashboardTrucks(data))
        },
        onError: ()=>{

        }
    })

    const handleSubmit = () => {

    }

    const handleClick = (direction=1) => {
        const newDate = direction > 0 ? addDays(parseISO(date), 1):subDays(parseISO(date), 1)
        dispatch(setDashboardDate(format(newDate, 'yyyy-MM-dd'))) 
    }


const value: DashboardContext = {
    handleSubmit: handleSubmit,
    handleClick: handleClick,
    customerModal: [showCustomers, setShowCustomers],
    inventoryModal: [showInventory, setShowInventory],
    vendorModal: [showVendor, setShowVendor],
    maintenanceModal: [showMaintenance, setShowMaintenance],
    customers: customers,
    isCustomerLoading: isCustomerLoading,
    products: products,
    mtces: mtces,
    trucks: trucks,
    vendors: vendors,
    date: date,
    columns: columns
}

return (
    <DashboardContext.Provider value={value}>
        {children}
    </DashboardContext.Provider>
)

}

export const useDashboardContext = () => useContext(DashboardContext)
