


export const  Naira = (value) => "\u20A6" + Math.round(value).toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");

export const get = (t, path) =>  path.split(".").reduce((r, k) => r?.[k], t)










