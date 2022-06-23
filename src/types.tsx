export interface IDataQuantity {
    name: string,
    units: string,
    data: {
        date: string,
        qty: number,
    }[],
}

export interface IDataMinMax {
    name: string,
    units: string,
    data: {
        date: string,
        Avg: number,
        Min: number,
        Max: number,
    }[],
}

export interface IData {
    data: {
        metrics: (IDataMinMax | IDataQuantity)[]
    }
}

export interface IFormattedData {
    [date: string]: {
        [index: string]: {
            unit: string,
            qty?: number
            min?: number,
            max?: number
        }
    };
}
