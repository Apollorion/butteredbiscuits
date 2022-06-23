import React from 'react';
import './App.css';
import {IData, IFormattedData, IFormattedWorkoutData} from './types';

function importAll(r: any) {
    return r.keys().map(r);
}

const dataPoints: IData[] = importAll(require.context('./data', false, /\.(json)$/));

function App() {

    function generateBottom() {

        let formattedData: IFormattedData = {};
        let formattedWorkoutData: IFormattedWorkoutData = {};
        let i = 0;
        for (let data of dataPoints) {
            if (i >= 30) {
                break;
            }

            const metrics = data.data.metrics;
            for (let metric of metrics) {
                for (let point of metric.data) {
                    let date = point.date.split(" ")[0]
                    if ("qty" in point) {
                        // only process weight_body_mass once
                        if (metric.name === "weight_body_mass") {
                            if (metric.data.length > 0) {
                                if(!(date in formattedData)){
                                    formattedData[date] = {};
                                }
                                formattedData[date][metric.name] = {unit: metric.units, qty: Math.round(point.qty)};
                            }
                        } else {
                            if (date in formattedData && metric.name in formattedData[date]) {
                                // @ts-ignore
                                formattedData[date][metric.name].qty = Math.round(formattedData[date][metric.name].qty + point.qty);
                            } else {
                                if(!(date in formattedData)){
                                    formattedData[date] = {};
                                }
                                formattedData[date][metric.name] = {unit: metric.units, qty: Math.round(point.qty)};
                            }
                        }
                    } else {
                        if (date in formattedData && metric.name in formattedData[date]) {
                            // @ts-ignore
                            if (point.Min < formattedData[date][metric.name].min) {
                                formattedData[date][metric.name].min = point.Min;
                            }

                            // @ts-ignore
                            if (point.Max < formattedData[date][metric.name].max) {
                                formattedData[date][metric.name].max = point.Max;
                            }
                        } else {
                            if(!(date in formattedData)){
                                formattedData[date] = {};
                            }
                            formattedData[date][metric.name] = {unit: metric.units, min: point.Min, max: point.Max};
                        }
                    }
                }
            }

            const workouts = data.data.workouts;
            for(let workout of workouts){
                let date = workout.start.split(" ")[0]

                if(!(date in formattedWorkoutData)){
                    formattedWorkoutData[date] = {};
                }
                formattedWorkoutData[date][workout.name] = workout;
            }



            i++;
        }

        let dates = Object.keys(formattedData).sort((a: string, b: string) => new Date(b).getTime() - new Date(a).getTime());
        let bottomArr = [];
        i = 0;
        for(let date of dates){
            let data = formattedData[date];

            let appendable = "";
            for(let key in data){
                let item = data[key];
                switch(key){
                    case "apple_exercise_time": {
                        appendable = appendable + `Time Exercising: ${item.qty} ${item.unit}\n`;
                        break;
                    }
                    case "apple_stand_time": {
                        appendable = appendable + `Time Standing: ${item.qty} ${item.unit}\n`;
                        break;
                    }
                    case "carbohydrates": {
                        appendable = appendable + `Carbs Eaten: ${item.qty} ${item.unit}\n`;
                        break;
                    }
                    case "number_of_times_fallen": {
                        appendable = appendable + `Times Fallen: ${item.qty}\n`;
                        break;
                    }
                    case "protein": {
                        appendable = appendable + `Protein Eaten: ${item.qty} ${item.unit}\n`;
                        break;
                    }
                    case "step_count": {
                        appendable = appendable + `Steps Taken: ${item.qty}\n`;
                        break;
                    }
                    case "weight_body_mass": {
                        appendable = appendable + `Weight: ${item?.qty} ${item.unit}\n`;
                        break;
                    }
                    case "heart_rate": {
                        appendable = appendable + `Heart Rate Min: ${item?.min} bpm\n`;
                        appendable = appendable + `Heart Rate Max: ${item?.max} bpm\n`;
                        break;
                    }
                    case "dietary_water": {
                        appendable = appendable + `Water Drank: ${item.qty} fl oz\n`;
                        break;
                    }
                    default: {
                        console.log("Default switch hit, this is a problem.");
                        break;
                    }
                }
            }

            let appendableWorkout: string[] = [];
            if(date in formattedWorkoutData){
                for(let workout in formattedWorkoutData[date]){
                    let workoutData = formattedWorkoutData[date][workout];

                    let thisWorkout = `${workoutData.name}\n`;

                    for(let item in workoutData) {
                        type ObjectKey = keyof typeof workoutData;
                        let individualData = workoutData[item as ObjectKey];

                        if (typeof individualData !== "string") {
                            switch (item) {
                                case "maxHeartRate": {
                                    thisWorkout = thisWorkout + `Max Heartrate: ${Math.round(individualData.qty)} bpm\n`;
                                    break;
                                }
                                case "avgHeartRate": {
                                    thisWorkout = thisWorkout + `Avg Heartrate: ${Math.round(individualData.qty)} bpm\n`;
                                    break;
                                }
                                case "intensity": {
                                    thisWorkout = thisWorkout + `Intensity: ${Math.round(individualData.qty)} ${individualData.units}\n`;
                                    break;
                                }
                                case "stepCount": {
                                    thisWorkout = thisWorkout + `Steps Taken: ${Math.round(individualData.qty)}\n`;
                                    break;
                                }
                            }
                        }
                    }

                    appendableWorkout.push(thisWorkout);
                }
            }


            bottomArr.push(
                <div key={i} style={{padding: "10px", display: "flex", flexDirection: "column"}}>
                    <u><b>Date: {date}</b></u>
                    {appendable.split('\n').map((str, it) => <div style={{display: "flex", justifyContent: "left"}} key={it}>{str}</div>)}
                    <br/><u><b>{appendableWorkout.length > 0 ? "Workouts":""}</b></u>
                    {appendableWorkout.map((workout, iw) => <div key={iw} style={{display: "flex", flexDirection: "column", justifyContent: "left", padding: "5px 0"}}> {workout.split('\n').map((str, it) => <div style={{display: "flex", justifyContent: "left"}} key={it}>{str}</div>)}</div>)}
                </div>
            )
            i++;
        }

        return bottomArr;
    }

    return (
        <div className="App">
            <h1>Buttered Biscuts!</h1>
            <p>
                Hi, I'm Joey and I'm on a journey to play hockey for the first time.
            </p>
            <p>
                I'm starting from zero; no experience skating, playing hockey, working out or caring about my body in
                general.
                From top down, I've been a couch potato nearly my entire life.
                I'm also a software engineer and I thought it would be cool to publish my journey in a machine readable
                format so it can be used for <i><b>science</b></i>!
            </p>
            <p>
                Download the datasets <a href="https://github.com/Apollorion/butteredbiscuits/tree/main/src/data">here</a>!<br/>
            </p>

            <div style={{display: "flex", flexWrap: "wrap", justifyContent: "center"}}>
                {generateBottom()}
            </div>

        </div>
    );
}

export default App;
