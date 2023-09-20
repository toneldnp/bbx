

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