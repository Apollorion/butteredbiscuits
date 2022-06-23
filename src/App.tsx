import React from 'react';
import './App.css';
import {IData, IFormattedData} from './types';

function importAll(r: any) {
    return r.keys().map(r);
}

const dataPoints: IData[] = importAll(require.context('./data', false, /\.(json)$/));

function App() {

    function generateBottom() {

        let formattedData: IFormattedData = {};
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
                                formattedData[date] = {};
                                formattedData[date][metric.name] = {unit: metric.units, qty: Math.round(point.qty)};
                            }
                        } else {
                            if (date in formattedData && metric.name in formattedData[date]) {
                                // @ts-ignore
                                formattedData[date][metric.name].qty = Math.round(formattedData[date][metric.name].qty + point.qty);
                            } else {
                                if(date in formattedData){
                                    formattedData[date][metric.name] = {unit: metric.units, qty: Math.round(point.qty)};
                                } else {
                                    formattedData[date] = {};
                                    formattedData[date][metric.name] = {unit: metric.units, qty: Math.round(point.qty)};
                                }
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
                            if(date in formattedData){
                                formattedData[date][metric.name] = {unit: metric.units, min: point.Min, max: point.Max};
                            } else {
                                formattedData[date] = {};
                                formattedData[date][metric.name] = {unit: metric.units, min: point.Min, max: point.Max};
                            }
                        }
                    }
                }
            }
            i++;
        }

        let bottomArr = [];
        i = 0;
        for(let date in formattedData){
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
                    default: {
                        console.log("Default switch hit, this is a problem.");
                        break;
                    }
                }
            }
            bottomArr.push(
                <div key={i}>
                    <b>Date: {date}</b><br/>
                    {appendable.split('\n').map((str, it) => <div key={it}>{str}</div>)}<br/><br/>
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

            {generateBottom()}
        </div>
    );
}

export default App;
