

export const fetchCustomers = (date) => {
    return (window as any).axios.get('/api/v1/hant/dashboard/customers', {
        params: {
            date: date
        }
    })
}

export const fetchVendors = (date) => {
    return (window as any).axios.get('/api/v1/hant/dashboard/vendors', {
        params: {
            date:date
        }
    })
}

export const fetchProducts = (date) => {
    return (window as any).axios.get('/api/v1/hant/dashboard/inventory', {
        params: {
            date:date
        }
    })
}

export const fetchMtces = (date) => {
    return (window as any).axios.get('/api/v1/hant/dashboard/mtces', {
        params: {
            date:date
        }
    })
}

export const fetchTrucks = () => {
    return (window as any).axios.get('/api/v1/hant/dashboard/trucks')
}

export const fetchCustomer = (id, dates) => {
    return (window as any).axios.get(`/api/v1/hant/customers/${id}`, {
        params: {
            filter : {
                between: `${dates.startDate},${dates.endDate}`,
            },
            include: 'product',
        }
        
    })
}

export const fetchVendor = (id, dates) => {
    return (window as any).axios.get(`/api/v1/hant/vendors/${id}`, {
        params: {
            filter : {
                between: `${dates.startDate},${dates.endDate}`,
            },
            include: 'product',
           
        }
        
    })
}


export const inventoryAccount = (options: any) => {
    return (window as any).axios.get(`/api/v1/products/${options.id}`, {
        params: {
            'filter[between]': `${options.startDate},${options.endDate}`,
        }
    })
}

export const fetchMaintenances = (data: {startDate: string, endDate: string, truckId?: string|number|undefined}) => {
    return (window as any).axios.get('/api/v1/hant/maintenances', {
        params: {
            filter: {
                between: `${data.startDate},${data.endDate}`,
                truck: data.truckId ?? null
            }
        }
    })
}

export const fetchAssets = (data = {}) => {
    return (window as any).axios.get("/api/v1/hant/assets", data)
}

export const fetchAsset = (id, dates) => {
    return (window as any).axios.get(`/api/v1/hant/assets/${id}`, {
        params: {
            filter : {
                between: `${dates.startDate},${dates.endDate}`,
            },
            include: 'product',
        }
    })
}

export const fetchInventorybySales = (dates, productId, assetId) => {
    return (window as any).axios.get(`/api/v1/hant/assets/inventorybysales/${assetId}/${productId}`, {
        params: {
            dates: dates,
        }
    })
}

export const createVendor = (data) => {
    return (window as any).axios.post('/api/v1/hant/vendors', data)
}
export const createAsset = (data) => {
    return (window as any).axios.post('/api/v1/hant/assets', data)
}


export const createMaintenance = (data) => {
    return (window as any).axios.post('/api/v1/hant/maintenances', data)
}

export const updateMaintenance = (data:any) => {
    return (window as any).axios.patch(`/api/v1/hant/maintenances/${data.id}`, data)
}
export const updateAsset = (data:any) => {
    return (window as any).axios.patch(`/api/v1/hant/assets/${data.id}`, data)
}

export const deleteMaintenance = (data:any) => {
    return (window as any).axios.delete(`/api/v1/hant/maintenances/${data.id}`)
}

export const deleteAsset = (data:any) => {
    return (window as any).axios.delete(`/api/v1/hant/assets/${data.id}`)
}

export const profit = (id, dates) => {
    return (window as any).axios.get(`/api/v1/hant/assets/profit/${id}`, {
        params: {
            dates: dates
        }
    })
}
export const fetchAssetMaintenances = (id, dates) => {
    return (window as any).axios.get(`/api/v1/hant/assets/maintenance/${id}`, {
        params: {
            dates: dates
        }
    })
}

export const fetchProductMaintenances = (data: {id:string|undefined, startDate: string, endDate: string} ) => {
    return (window as any).axios.get(`/api/v1/hant/dashboard/productmtces/${data.id}`, {
        params: {
            dates:{startDate: data.startDate, endDate: data.endDate}
        }
    })
}
