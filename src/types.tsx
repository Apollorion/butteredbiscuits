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

export interface IWorkout {
    start: string,
    end: string,
    name: string,
    maxHeartRate: {
        qty: number,
        units: string,
    },
    avgHeartRate: {
        qty: number,
        units: string,
    },
    intensity: {
        qty: number,
        units: string
    },
    stepCount: {
        qty: number,
        units: string
    }
}

export interface IData {
    data: {
        metrics: (IDataMinMax | IDataQuantity)[]
        workouts: IWorkout[]
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
