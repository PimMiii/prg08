import { DecisionTree } from "../libraries/decisiontree.js"
import { VegaTree } from "../libraries/vegatree.js"

//
// DATA
//
const csvFile = "../data/mushrooms.csv"

// labels in data: "class","cap-shape","cap-surface","cap-color","bruises","odor","gill-attachment","gill-spacing","gill-size","gill-color","stalk-shape","stalk-root","stalk-surface-above-ring","stalk-surface-below-ring","stalk-color-above-ring","stalk-color-below-ring","veil-type","veil-color","ring-number","ring-type","spore-print-color","population","habitat"
const trainingLabel = "class"
const ignored = ["class","cap-surface","bruises","gill-attachment","gill-spacing","gill-size","stalk-root","stalk-surface-above-ring","stalk-surface-below-ring","stalk-color-above-ring","stalk-color-below-ring","veil-type","ring-number"]
let decisionTree;
let testData;
let validationData;
let calcResults = {
    "accuracy": "",
    "matrix": null
};

//
// DOM
//
const validateBtn = document.getElementById("validateBtn");
const saveBtn = document.getElementById("saveBtn");

const accuracyDisplay = document.getElementById("accuracyValue");
const eeDisplay = document.getElementById("eeCell");
const peDisplay = document.getElementById("peCell");
const epDisplay = document.getElementById("epCell");
const ppDisplay = document.getElementById("ppCell");


//
// shuffle data
//
function shuffleData(array) {
    return array.sort(() => Math.random() - 0.5);
}

//
// Make Predictions, and calculate accuracy and matrix
//
function calculatePredictions(data) {
    let results = {
        "accuracy": "",
        "matrix": null
    };
    let amountCorrect = 0;
    let matrix = { "ee": 0, "pe": 0, "ep": 0, "pp": 0 }
    for (let item in data) {
        const testableItem = { ...data[item] }
        delete testableItem.class

        let prediction = decisionTree.predict(testableItem)
        if (prediction == data[item].class) {
            amountCorrect++
            if (prediction === 'e') {
                matrix.ee++
            }
            else if (prediction === 'p') {
                matrix.pp++
            }
        } else {
            if (prediction === 'e') {
                matrix.ep++
            }
            else if (prediction === 'p') {
                matrix.pe++
            }
        }
    }

    results.accuracy = amountCorrect / data.length
    results.matrix = matrix
    return results
}

//
// draw decisiontree
//
function drawTree(tree) {
    let visual = new VegaTree('#view', 800, 400, tree.toJSON())
}


//
// Set correct values to display
//
function setDisplayValues(results, test = true) {
    //display accuracy value
    if (test) {
        accuracyDisplay.innerText = `Accuracy (testdata): ${(results.accuracy * 100).toFixed(2)}% (${results.accuracy})`;
    } else {
        accuracyDisplay.innerText = `Accuracy : ${(results.accuracy * 100).toFixed(2)}% (${results.accuracy})`;
    }
    //set confusion matrix values
    eeDisplay.innerText = `${results.matrix.ee}`;
    epDisplay.innerText = `${results.matrix.ep}`;
    peDisplay.innerText = `${results.matrix.pe}`;
    ppDisplay.innerText = `${results.matrix.pp}`;
}


//
// laad csv data als json
//
function loadData() {
    Papa.parse(csvFile, {
        download: true,
        header: true,
        dynamicTyping: true,
        complete: results => trainModel(results.data)   // gebruik deze data om te trainen
    })
}


//
// MACHINE LEARNING - Decision Tree
//
function trainModel(data) {
    data = shuffleData(data);

    // todo : splits data in traindata en testdata
    const trainData = data.slice(0, Math.floor(data.length * 0.6));
    testData = data.slice(Math.floor(data.length * 0.6) + 1, Math.floor(data.length * 0.8));
    validationData = data.slice(Math.floor(data.length * 0.8) + 1);


    // maak het algoritme aan
    decisionTree = new DecisionTree({
        ignoredAttributes: ignored,
        trainingSet: trainData,
        categoryAttr: trainingLabel,
        maxTreeDepth: 10
    })

    // Teken de boomstructuur - DOM element, breedte, hoogte, decision tree
    drawTree(decisionTree)

    calcResults = calculatePredictions(testData);
    //console.log(`Accuracy: ${results.accuracy}, Matrix: EE;${results.matrix.ee}, PE;${results.matrix.pe}, EP;${results.matrix.ep}, PP;${results.matrix.pp} `)
    setDisplayValues(calcResults);
    validateBtn.disabled = false;
}

//
// Save Model to use for predictions
//
function saveModel() {
 let json = decisionTree.stringify();
 console.log(json);
 console.log(JSON.stringify(calcResults));

 alert("model and results printed to console");

}

// Validate Model on the validation dataset
function validateModel() {
    calcResults = calculatePredictions(validationData, false);
    setDisplayValues(calcResults);
    saveBtn.disabled = false;
    validateBtn.disabled = true;
}


saveBtn.addEventListener("click", saveModel);
validateBtn.addEventListener("click", validateModel)
loadData()
