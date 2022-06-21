import React, {useState, useEffect} from 'react';
import axios from 'axios';
import './App.css';

const csvLocation = "https://apollorion.com/butteredbiscuits/1nFpPN3mNeq1Wwk3rNZeSxYoVZCQ0xH4NO1wvevs6Y5w.csv";

interface CSVData {
    date: string,
    publish: string,
    what_i_ate: string,
    calories: string,
    weight: string,
    meal_type: string
}

function parseCSV(str: string): CSVData[] {
    let strArray = str.split("\r\n");
    let i = 0;
    let headers = [];
    let newArr = [];
    for(let item of strArray){
        let data = item.split(",");
        if(i === 0){
            for(let head of data){
                headers.push(head.toLowerCase().replaceAll(" ", "_"));
            }
        } else {
            let i2 = 0;
            let tempObject = {};
            for(let datapoint of data){
                // @ts-ignore
                tempObject[headers[i2]] = datapoint;
                i2++;
            }
            newArr.push(tempObject as CSVData);
        }
        i++;
    }
    return newArr.reverse();
}

function App() {
    const [data, setData] = useState<CSVData[] | undefined>(undefined);

    useEffect(() => {
        axios.get(csvLocation)
            .then((response) => {
                if (response.status === 200) {
                    // @ts-ignore
                    setData(parseCSV(response.data));
                }
            });
    }, []);

    if(data === undefined){
        return (
            <div className="App">
                <h1>Buttered Biscuts!</h1>
                loading data...
            </div>
        )
    }

    console.log(data);

    function generateBottom(){
        if(data === undefined){
            return [];
        }

        let bottomArr = [];
        let i = 0;
        for(let item of data){

            if(i === 30){
                return bottomArr;
            }

            if(item.publish === "yes"){
                bottomArr.push((
                    <p key={i}>
                        Date: {item.date}, Meal Type: {item.meal_type}<br/>
                        Food: {item.what_i_ate}, Calories: {item.calories}, Weight: {item.weight}
                    </p>
                ))
                i++;
            }
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
                I'm starting from zero; no experience skating, playing hockey, working out or caring about my body in general.
                From top down, I've been a couch potato nearly my entire life.
                I'm also a software engineer and I thought it would be cool to publish my journey in a machine readable format so it can be used for <i><b>science</b></i>!
            </p>
            <p>
                Download the dataset <a href={csvLocation}>here</a>!<br/>
            </p>

            {generateBottom()}
        </div>
    );
}

export default App;
