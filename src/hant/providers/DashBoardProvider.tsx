import { addDays, format, parseISO, subDays } from 'date-fns';
import React, { createContext, useContext, useState } from 'react';
import {useQuery } from 'react-query';
import { fetchCustomers, fetchMtces, fetchTrucks, fetchVendors, fetchProducts } from '../api';
import { dashboardSelector, setDashboardCustomers, setDashboardDate, setDashboardMtces, setDashboardProducts, setDashboardTrucks, setDashboardVendors, setCustomerData, setSelectedCustomer, setTruckMtces, setVendorData, setSelectedProduct, setInventoryBySales, setSelectedVendor, setProductUsage, setSelectedTruck  } from '../reducers/dashboardSlice';
import { DashboardContext } from '../../types';
import { useSelector, useDispatch } from 'react-redux';
import { useDebounce } from 'use-debounce';
import { Link, useParams } from 'react-router-dom';
import { Naira } from '../../utils';
import { fetchCustomer, fetchVendor, inventoryAccount } from '../api';
import { fetchMaintenances } from '../api';
import { fetchInventorybySales } from '../api';
import { fetchProductMaintenances } from '../api';


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
    columns: {},
    dates: {
        startDate:'',
        endDate:''
    },
    productUsage: [],
    inventoryBySales: [],
    selectedProduct:'',
    selectedTruck:'',
    selectedVendor: '',
    selectedCustomer: '',
    customerData: [],
    vendorData: [],
    truckMtces: [],
})

export const DashboardProvider = ({children}) => {
    const [showCustomers, setShowCustomers] = useState<boolean>(false)
    const [showInventory, setShowInventory] = useState<boolean>(false)
    const [showVendor, setShowVendor] = useState<boolean>(false)
    const [showMaintenance, setShowMaintenance] = useState<boolean>(false)
    const {data:{customers, vendors, products, mtces, trucks, productUsage, inventoryBySales, customerData, vendorData, truckMtces},  date, dates, selectedProduct, selectedTruck, selectedCustomer, selectedVendor} = useSelector(dashboardSelector)
    const debouncedDate = useDebounce(date, 1000)
    const dispatch = useDispatch()
    const {truckId, productId, customerId, vendorId} = useParams()
    
    const columns = {
        customers: [
            {label: 'Name', name: 'name', formatter: (data,value)=> <Link onClick={()=>setShowCustomers(false)} to={`customer/${data.id}`}>{value}</Link>},
            {label: 'Balance', name: 'accountBalance', formatter: (data, value) => Naira(value)}
        ],
        vendors: [
            {label: 'Name', name: 'name', formatter: (data,value)=> <Link onClick={()=>setShowVendor(false)} to={`vendor/${data.id}`}>{value}</Link>},
            {label: 'Balance', name: 'accountBalance', formatter: (id, value) => Naira(value)}
        ],

        products:  [
            {label: 'Product', name: 'name', formatter: (data,value)=> <Link onClick={()=>setShowInventory(false) } state={data} to={`product-usage/${data.id}`}>{value}</Link>},
            {label: 'Stock', name: 'stock', formatter: (id, value) => (value)}
        ],

        mtces: [
            {label: 'Maintenance', name: 'number', formatter: (data,value)=> <Link onClick={()=>setShowMaintenance(false)} state={data} to={`maintenance/${data.id}`}>{value}</Link>},
            {label: 'Total', name: 'amount', formatter: (id, value) => Naira(value)}
        ]
    }

    const {isLoading: isCustomerLoading} = useQuery(['customer',customerId,date], ()=>fetchCustomer(customerId, {startDate: date, endDate: date}), {
        onSuccess: ({data: {data, client}})=> {
            dispatch(setCustomerData(data))
            dispatch(setSelectedCustomer(client))
        },
        onError: (error) => {
            console.log(error)
        },
        enabled: customerId != undefined
    })

    const {isLoading: isTruckMaintanenceLoading} = useQuery(['truck-mtce',truckId,date], ()=>fetchMaintenances({startDate:date, endDate: date, truckId: truckId}), {
        enabled: truckId != undefined,
        onSuccess: ({data: {data}}) => {
           dispatch(setTruckMtces(data)) 
        }, 
        onError: (error) => {
            console.log(error)

        }
    })

    const {isLoading: isVendorLoading} = useQuery(['vendor',vendorId,date], ()=>fetchVendor(vendorId, {startDate: date, endDate: date}), {
        enabled: vendorId != undefined,
        onSuccess: ({data: {data, client}}) => {
            dispatch(setVendorData(data))
            dispatch(setSelectedVendor(client))
        },
        onError: (error) => {
            console.log(error)
        }
    })

    
    const {isLoading: isCustomersLoading} = useQuery(['customer',debouncedDate], ()=>fetchCustomers(date), {
        onSuccess: ({data: {data}}) => {
            dispatch(setDashboardCustomers(data))
        },
        onError: (error) => {
            console.log(error)
        }
    })

    const {isLoading: isSelectedProductLoading} = useQuery(['product',productId], ()=>inventoryAccount({id: productId, startDate: date, endDate: date}), {
        enabled: productId != undefined,
        onSuccess: ({data: {product}}) => {
            dispatch(setSelectedProduct(product))
        },
        onError: (error) => {
            console.log(error)
        }
    })

    const {isLoading: isInventoryBySalesLoading} = useQuery(['inventory',dates.startDate, dates.endDate], ()=>fetchInventorybySales(dates, productId,truckId), {
        onSuccess: ({data: {data, asset, product}}) => {
            dispatch(setInventoryBySales(data))
            dispatch(setSelectedTruck(asset))
        },
        onError: (error) => {
            console.log(error)
        },
        enabled: productId != undefined && truckId != undefined
    })


    const {isLoading: isProductUsageLoading} = useQuery(['product-usage', productId,date], ()=>fetchProductMaintenances({startDate: date, endDate: date, id: productId}), {
        onSuccess: ({data: {data}}) => {
            dispatch(setProductUsage(data))
        },
        onError: () => {

        },
        enabled: productId != undefined
    })

    const {isLoading: isVendorsLoading} = useQuery(['vendors',debouncedDate], ()=>fetchVendors(date), {
        onSuccess: ({data: {data}})=>{
            dispatch(setDashboardVendors(data))
        },
        onError: ()=>{

        }
    })

    // Fetch the lists of products used on a selected date on the dashboard  
    const {isLoading: isProductLoading} = useQuery(['products',debouncedDate], ()=>fetchProducts(date), {
        onSuccess: ({data: {data}})=>{
            dispatch(setDashboardProducts(data))
        },
        onError: (error)=>{
            console.log(error)
        }
    })


    // / Fetch the lists of maintenances used within selected date period on the dashboard  
    const {isLoading: isMtcesLoading} = useQuery(['mtces',debouncedDate], ()=>fetchMtces(date), {
        onSuccess: ({data: {data}})=>{
            dispatch(setDashboardMtces(data))
        },
        onError: (error)=>{
            console.log(error)
        }
    })


    const {isLoading: isTrucksLoading} = useQuery(['trucks',debouncedDate], ()=>fetchTrucks(), {
        onSuccess: ({data:{data}})=>{
            dispatch(setDashboardTrucks(data))
        },
        onError: (error)=>{
            console.log(error)

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
    columns: columns,
    dates: dates,
    productUsage: productUsage,
    inventoryBySales: inventoryBySales,
    selectedProduct: selectedProduct,
    selectedTruck: selectedTruck,
    selectedCustomer: selectedCustomer,
    selectedVendor: selectedVendor,
    customerData: customerData,
    vendorData: vendorData,
    truckMtces: truckMtces,
}


return (
    <DashboardContext.Provider value={value}>
        {children}
    </DashboardContext.Provider>
)

}

export const useDashboardContext = () => useContext(DashboardContext)
