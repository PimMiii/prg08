import { DecisionTree } from "./libraries/decisiontree.js"
import { VegaTree } from "./libraries/vegatree.js"

let decisionTree;

//
// DOM
//
const mushroomDisplay = document.getElementById("mushroom");
const mushroomForm = document.getElementById("mushroomForm")
const predictionDisplay = document.getElementById("prediction")
const accuracyDisplay = document.getElementById("accuracyValue");
const eeDisplay = document.getElementById("eeCell");
const peDisplay = document.getElementById("peCell");
const epDisplay = document.getElementById("epCell");
const ppDisplay = document.getElementById("ppCell");


function loadSavedModel() {
    fetch("./model/model.json")
        .then((response) => response.json())
        .then((model) => modelLoaded(model))
}

function modelLoaded(model) {
    decisionTree = new DecisionTree(model)
    drawTree(decisionTree);

    // test om te zien of het werkt
    //
    // DATA LABELS
    // class: e/p (Prediction)
    //
    // cap-color: brown=n,buff=b,cinnamon=c,gray=g,green=r,pink=p,purple=u,red=e,white=w,yellow=y
    // habitat: grasses=g,leaves=l,meadows=m,paths=p,urban=u,waste=w,woods=d\
    // odor: almond=a,anise=l,creosote=c,fishy=y,foul=f,musty=m,none=n,pungent=p,spicy=s
    // ring-type: cobwebby=c,evanescent=e,flaring=f,large=l,none=n,pendant=p,sheathing=s,zone=z
    // spore-print-color: black=k,brown=n,buff=b,chocolate=h,green=r,orange=o,purple=u,white=w,yellow=y    
    //
    let mushroom = {"cap-color" : "y", "habitat": "g", "odor": "a", "ring-type": "p", "spore-print-color": "n"}
    makePrediction(mushroom)
}

function loadSavedResults() {
    fetch("./model/results.json")
        .then((response) => response.json())
        .then((results) => setDisplayValues(results))
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
function setDisplayValues(results) {

    accuracyDisplay.innerText = `Accuracy: ${(results.accuracy * 100).toFixed(2)}% (${results.accuracy})`;

    //set confusion matrix values
    eeDisplay.innerText = `${results.matrix.ee}`;
    epDisplay.innerText = `${results.matrix.ep}`;
    peDisplay.innerText = `${results.matrix.pe}`;
    ppDisplay.innerText = `${results.matrix.pp}`;
}

function makePrediction(mushroom) {
    let prediction = decisionTree.predict(mushroom)
    let status = 'Poisonous'
    predictionDisplay.style.color = "red"
    mushroomDisplay.innerText = `Mushroom: ${JSON.stringify(mushroom)}`
    if (prediction === 'e') {
        status = 'Edible'
        predictionDisplay.style.color = "green"
    }
    predictionDisplay.innerText = `Prediction: ${status} (${prediction})`
    console.log("predicted " + prediction)
}

function getMushroom(form) {
    let mushroom = {};
    mushroom["cap-color"] = form["cap-color"].value;
    mushroom["habitat"] = form["habitat"].value;
    mushroom["odor"] = form["odor"].value;
    mushroom["ring-type"] = form["ring-type"].value;
    mushroom["spore-print-color"] = form["spore-print-color"].value;
    console.log(mushroom)
    makePrediction(mushroom)
}

mushroomForm.addEventListener("submit", (e) => {
    e.preventDefault();
    getMushroom(e.target)
}
)
loadSavedResults()
loadSavedModel()