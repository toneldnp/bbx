import React, { Dispatch, SetStateAction } from 'react';
import { UseMutateFunction } from 'react-query';


export type PumpState = {
    data: Array<Pump>
    date: string,
}

export interface AuthState {
    user: any

}
export type TenantState = {

}

export type Store = {
    auth: AuthState,
    tenant: TenantState,
    pumps: PumpState

}

export type Pump = {
    id: string | null | undefined | number,
    name: string,
    product: any,
    amount: number|string,
    product_id?: string,
    reading?:Reading,
    visible?:boolean,
}

export interface Reading {
    id: string|null|undefined|number,
    pump?: Pump,
    initial: number|undefined,
    final: number|undefined,
    price: number|undefined,
    amount: number|undefined,
    date: string|undefined,
    quantity?: number,
    user_id?: number,
    user?: any,
    updatedAt?: string|any
}

export type Column = {
    label: string,
    name: string,
    getClass?: (value: number|string)=>string,
    classes?: string,
    formatter?: (value: number|string)=>number|string|any,
    search?: boolean,
}
export type Columns =  Array<Column>

export type DashboardContext = {
    handleSubmit: () => void,
    handleClick: (e:any) => void,
    // formData: string,
    customerModal: Array<any>
    vendorModal: Array<any>
    maintenanceModal: Array<any>
    inventoryModal: Array<any>
    // setFormData: Dispatch<SetStateAction<any>>,
    isCustomerLoading: boolean,
    vendors: Array<any>,
    customers: Array<any>,
    products: Array<any>,
    mtces: Array<any>,
    trucks: Array<any>,
    date: string,
    columns: any,
}

export type TruckForm = {number: string, model: string, operator: string, phone: string}

export type TruckContext = {
    trucks: Array<any>,
    truck: any
    modal:any,
    initialData: TruckForm,
    handleSubmit: (e:any, post:any) => void,
    handleChange: (e: any) => void,
    formData: TruckForm,
    formErrors: TruckForm,
    setFormData: Dispatch<SetStateAction<TruckForm>>,
    setFormErrors: Dispatch<SetStateAction<TruckForm>>,
    setEditing:  Dispatch<SetStateAction<boolean>>,
    createTruck: UseMutateFunction<unknown, unknown, any, unknown>,
    updateTruck: UseMutateFunction<unknown, unknown, any, unknown>,
    isTruckLoading: boolean,
    handleSelectTab: (data: any)=>void,
    handlePrevNext: (data: any)=>void,
    selectedTab: string,
    dates: {startDate: string, endDate: string},
    handleProductSelect: (data:any) => void,
    products: Array<any>,
    selectedProduct: any,
    inventoryBySales: any,
    profitData: any,
    handleChangeTruck: (e:any)=>void,
    mtces: any,
}