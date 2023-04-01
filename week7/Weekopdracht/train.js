import { createChart, updateChart } from "./scatterplot.js"


// DOM
const statusDisplay = document.getElementById("status");
const saveModelBtn = document.getElementById("saveModel");
saveModelBtn.disabled = true;

const nn = ml5.neuralNetwork({ task: 'regression', hiddenUnits: 32 , debug: true });
const csvFile = "./data/mobilephones.csv";
let trainingData;
let testData;
let chartdata;

function loadData() {
        Papa.parse(csvFile, {
                download: true,
                header: true,
                dynamicTyping: true,
                complete: results => prepareData(results.data)
        })
}

function prepareData(data) {
        data.sort(() => Math.random() > 0.5);

        trainingData = data.slice(0, Math.floor(data.length * 0.8));
        testData = data.slice(Math.floor(data.length * 0.8) + 1);

        trainModel(trainingData)


        //id,price,sale,weight,resolution,ppi,cores,cpu,memory,storage,rearcam,frontcam,battery,thickness
        //relevant:  battery, cores, cpu, memory, ppi, rearcam, storage, thickness
        chartdata = trainingData.map(phone => ({
                x: phone.cpu,
                y: phone.price,
        }))
        console.log(chartdata)
        createChart(chartdata, "cpu", "price")
}

function trainModel(trainingData) {
        for (let row of trainingData) {
                nn.addData({
                        ppi: row.ppi,
                        battery: row.battery,
                        cores: row.cores,
                        cpu: row.cpu,
                        memory: row.memory,
                        storage: row.storage,
                        rearcam: row.rearcam,
                        thickness: row.thickness
                }, { price: row.price })
        }

        nn.normalizeData()
        nn.train({ epochs: 32 }, () => validateModel())
}

async function validateModel() {
        statusDisplay.innerHTML= "Predicting, please wait..."
        let predictions = [];
        for (let row of testData) {
                const prediction = await nn.predict({
                        ppi: row.ppi,
                        battery: row.battery,
                        cores: row.cores,
                        cpu: row.cpu,
                        memory: row.memory,
                        storage: row.storage,
                        rearcam: row.rearcam,
                        thickness: row.thickness
                })
                predictions.push({x : row.cpu, y:prediction[0].price})
        }
        updateChart("Predictions", predictions)
        statusDisplay.innerHTML="All done..."        
        saveModelBtn.disabled = false;
        saveModelBtn.addEventListener("click", saveModel)
}

function saveModel() {
        nn.save()
}

loadData();

