import { DecisionTree } from "./libraries/decisiontree.js"
import { VegaTree } from "./libraries/vegatree.js"

//
// DATA
//
const csvFile = "./data/mushrooms.csv"

// labels in data: "class","cap-shape","cap-surface","cap-color","bruises","odor","gill-attachment","gill-spacing","gill-size","gill-color","stalk-shape","stalk-root","stalk-surface-above-ring","stalk-surface-below-ring","stalk-color-above-ring","stalk-color-below-ring","veil-type","veil-color","ring-number","ring-type","spore-print-color","population","habitat"
const trainingLabel = "class"
const ignored = ["class", "bruises", "gill-attachment", "gill-spacing", "gill-size", "stalk-root", "stalk-surface-above-ring", "stalk-surface-below-ring", "stalk-color-above-ring", "stalk-color-below-ring", "ring-number", "ring-type", "population"]

//
// shuffle data
//
function shuffleData(array) {
    return array.sort(() => Math.random() - 0.5);
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
    const testData = data.slice(Math.floor(data.length * 0.6) + 1, Math.floor(data.length * 0.8));
    const validationData = data.slice(Math.floor(data.length * 0.8) + 1);


    // maak het algoritme aan
    let decisionTree = new DecisionTree({
        ignoredAttributes: ignored,
        trainingSet: trainData,
        categoryAttr: trainingLabel,
        maxTreeDepth: 7
    })

    // Teken de boomstructuur - DOM element, breedte, hoogte, decision tree
    let visual = new VegaTree('#view', 800, 400, decisionTree.toJSON())


    // todo : maak een prediction met een sample uit de testdata
    //
    // Calculate accuracy and confusion Matrix
    //
    function calculatePredictions(data) {
        let results = {
            "accuracy": "",
            "matrix": null
        }
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


let results = calculatePredictions(testData);
console.log(`Accuracy: ${results.accuracy}, Matrix: EE;${results.matrix.ee}, PE;${results.matrix.pe}, EP;${results.matrix.ep}, PP;${results.matrix.pp} `)

}


loadData()