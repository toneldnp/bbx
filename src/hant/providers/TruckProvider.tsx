import { addDays, addMonths, addWeeks, addYears, endOfYear, format, intervalToDuration, parseISO, startOfWeek, startOfYear } from 'date-fns';
import { endOfMonth, endOfWeek, startOfMonth } from 'date-fns/esm';
import React, { createContext,  useContext,  useEffect,  useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { inventories } from '../../../../../../resources/js/src/domain/inventory/api';
import { createAsset, fetchAsset, fetchAssetMaintenances, fetchAssets, fetchInventorybySales, profit, updateAsset } from '../../../../../../resources/js/src/hant/components/maintenance/api';
import { assetSelector, setAsset, setDates, setInventoryBySales, setMtce, setProducts, setProfitData, setSelectedProduct, setSelectedTab } from '../../../../../../resources/js/src/hant/reducers/assetSlice';
import { assetsSelector, setAssets, setCreateAssets, setUpdateAssets} from '../../../../../../resources/js/src/hant/reducers/assetsSlice';
import { TruckForm, TruckContext } from '../../../../../../resources/js/src/hant/types';


const TruckContext = createContext <TruckContext>({
    trucks:[],
    modal:[],
    formData: {number: '', model: '', operator:'', phone:''},
    handleSubmit:()=>{},
    handleChange: ()=>{},
    formErrors: {number: '', model: '', operator:'', phone:''},
    setFormData: ()=>{},
    setFormErrors: ()=>{},
    updateTruck: ()=>{},
    createTruck: ()=>{},
    setEditing: ()=>{},
    initialData: {number: '', model: '', operator:'', phone:''},
    truck: {},
    isTruckLoading: false,
    handleSelectTab: ()=>{},
    selectedTab: '',
    dates: {startDate: '', endDate: ''},
    handlePrevNext: ()=>{},
    handleProductSelect: ()=>{},
    products: [],
    selectedProduct: '',
    inventoryBySales: [],
    profitData: {},
    handleChangeTruck: ()=>{},
    mtces: [],
})

const TruckProvider = ({children}) => {
    const initialData = {number: '', model: '', operator:'', phone:''}
    const dispatch = useDispatch()
    const [show, setShow] = useState<boolean>(false)
    const [editing, setEditing] = useState<boolean>(false)
    const {data: trucks} = useSelector(assetsSelector)
    const [formData, setFormData] = useState<TruckForm>(initialData)
    const [formErrors, setFormErrors] = useState<TruckForm>({number: '', model: '', operator:'', phone:''})
    const {dates, data: truck, selectedTab, products, selectedProduct, inventoryBySales, profitData, mtces} = useSelector(assetSelector)
    const {truckId} = useParams()
    const navigate = useNavigate()
  
    const {isLoading: isTruckLoading} = useQuery(['truck',truckId], ()=>fetchAsset(truckId, dates), {
            onSuccess: ({data: {data}}) => {
                const ageInterval = intervalToDuration({start: parseISO(data.created_at), end: new Date()})
                const age = `${ageInterval.years} Years, ${ageInterval.months} Months,  ${ageInterval.days} Days.`
                dispatch(setAsset({...data, age: age}))
            },
            onError: () => {

            },
            enabled: truckId != undefined,
        })

        const {isLoading: isProfitLoading} = useQuery(['profit',dates.startDate,dates.endDate], ()=>profit(truckId, dates), {
            onSuccess: ({data: {data}})=>{
                dispatch(setProfitData(data))
            },
            onError: (error) => {
                console.log(error)
            },
            enabled: truckId != undefined,
        })

        const {isLoading: isMtceLoading} = useQuery(['mtce',dates.startDate,dates.endDate], ()=>fetchAssetMaintenances(truckId, dates), {
            onSuccess: ({data: {data}})=>{
                const sum = data.map(d=>parseFloat(d.amount)).reduce((a,b)=> a+b, 0)
                dispatch(setMtce({data: data, sum: sum}))
            },
            onError: (error) => {
                console.log(error)
            },
            enabled: truckId != undefined,
        })

        const {isLoading: isInventoryLoading} = useQuery(['inventory',dates, selectedProduct, truck], ()=>fetchInventorybySales(dates, selectedProduct, truck), {
            onSuccess: ({data: {data}}) => {
               dispatch(setInventoryBySales(data))
            }, 
            onError: (error) => {
                console.log(error)
            },
            enabled: selectedProduct != '' && selectedProduct != undefined

        })

        const {isLoading: isProductLoading} = useQuery(['products'], ()=>inventories(), {
            onSuccess: ({data: {data}}) => {
                dispatch(setProducts(data))
            },
            onError: (error)=> {
                console.log(error)
            },
            enabled: truckId != undefined,
        })

        
        
        const handleChangeTruck = ({value}) => {
           navigate(`../${value}`, {
            replace: true
           })
        }

       
        const handlePrevNext =  (direction = 1) => {
            let newDates = {}
            switch (selectedTab) {
                case 'day':
                    newDates = {startDate: format(addDays(parseISO(dates.startDate), direction), 'yyyy-MM-dd'),
                    endDate:  format(addDays(parseISO(dates.startDate), direction), 'yyyy-MM-dd'),
                }

                    break;
                case 'week':
                    newDates = {startDate: format(startOfWeek(addWeeks(parseISO(dates.startDate), direction)), 'yyyy-MM-dd'),
                    endDate:  format(endOfWeek(addWeeks(parseISO(dates.startDate), direction)), 'yyyy-MM-dd'),
                }

                break;

                case 'month':
                    newDates = {startDate: format(startOfMonth(addMonths(parseISO(dates.startDate), direction)), 'yyyy-MM-dd'),
                    endDate:  format(endOfMonth(addMonths(parseISO(dates.startDate), direction)), 'yyyy-MM-dd')};
                    break;
                case 'year':
                    newDates = {startDate: format(startOfYear(addYears(parseISO(dates.startDate), direction)), 'yyyy-MM-dd'),
                    endDate:  format(endOfYear(addYears(parseISO(dates.startDate), direction)), 'yyyy-MM-dd')};
                    break;
            
                default:
                    newDates = dates
                    break;
            }
            dispatch(setDates(newDates))
        }

        const handleSelectTab = ({target: {dataset: {tab}}}) => {
            dispatch(setSelectedTab(tab))
            let newDates = {}
            switch (tab) {
                case 'day':
                    newDates = {
                        startDate: format(new Date(), 'yyyy-MM-dd'),
                        endDate: format(new Date(), 'yyyy-MM-dd'),
                    }
                    break;
                case 'week':
                    newDates = {
                        startDate: format(startOfWeek(new Date()), 'yyyy-MM-dd'),
                        endDate: format(endOfWeek(new Date()), 'yyyy-MM-dd'),
                    }
                    break;
                case 'month':
                    newDates = {
                        startDate: format(startOfMonth(new Date()), 'yyyy-MM-dd'),
                        endDate: format(endOfMonth(new Date()), 'yyyy-MM-dd'),
                    }
                    break;
                case 'year':
                    newDates = {
                        startDate: format(startOfYear(new Date()), 'yyyy-MM-dd'),
                        endDate: format(endOfYear(new Date()), 'yyyy-MM-dd'),
                    }
                    break;
            
                default:
                    newDates = {
                        startDate: format(new Date(), 'yyyy-MM-dd'),
                        endDate: format(new Date(), 'yyyy-MM-dd'),
                    }
                    break;
            }
            dispatch(setDates(newDates))

        }

    const handleProductSelect = (e) => {
       dispatch(setSelectedProduct(e.value))

    }
    


    const {mutate: createTruck} = useMutation(createAsset, {
        onSuccess: ({data: {data}}:any) => {
            dispatch(setCreateAssets(data))
            setFormData(initialData)
            setShow(false)
        },
        onError: ({response: {data: {errors}, status }}:any) => {
            if(status === 422){
                setFormErrors({...formErrors, ...errors})
            }
        }
    } );


    const {mutate: updateTruck} = useMutation(updateAsset, {
        onSuccess: ({data: {data}}:any) => {
            dispatch(setUpdateAssets(data))
            setFormData(initialData)
            setShow(false)
        },

        onError: ({response: {data: {errors}, status }}:any) => {
            if(status === 422){
                setFormErrors({...formErrors, ...errors})
            }
        }
    });


    const {isLoading: isTrucksLoading} = useQuery('trucks', ()=>fetchAssets(), {
        onSuccess: ({data: {data}}) => {
            dispatch(setAssets(data))
        },
        onError: (error) => {

        }, 
    } )

    const handleSubmit = (e) => {
        e.preventDefault()
        if(editing){
            updateTruck(formData)
        } else {
            createTruck(formData)
        }
    }

    const handleChange = ({target: {name, value}}) => {
        setFormData({...formData, [name]:value})
        setFormErrors({...formErrors, [name]:''})
    }

    const value: TruckContext =  {
        initialData: initialData,
        trucks: trucks,
        modal: [show, setShow],
        handleSubmit: handleSubmit,
        handleChange: handleChange,
        formData: formData,
        setFormData: setFormData,
        formErrors: formErrors,
        setFormErrors: setFormErrors,
        createTruck: createTruck,
        updateTruck: updateTruck,
        setEditing: setEditing,
        truck: truck,
        isTruckLoading: isTruckLoading,
        handleSelectTab: handleSelectTab,
        selectedTab: selectedTab,
        dates: dates,
        handlePrevNext: handlePrevNext,
        handleProductSelect: handleProductSelect,
        products: products,
        selectedProduct: selectedProduct,
        inventoryBySales: inventoryBySales,
        profitData: profitData,
        handleChangeTruck: handleChangeTruck,
        mtces: mtces,
    }

return (
    <TruckContext.Provider value={value} >
        {children}
    </TruckContext.Provider>
)

}

export const UseTruckContext = () => useContext(TruckContext)
export default TruckProvider