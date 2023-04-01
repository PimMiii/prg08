//
// DOM
//
const phoneDisplay = document.getElementById("phone");
const phoneForm = document.getElementById("phoneForm")
const predictionDisplay = document.getElementById("prediction")

const nn = ml5.neuralNetwork({ task: 'regression' })


function loadModel() {
    nn.load('./model/model.json', modelLoaded)

    phoneForm.addEventListener("submit", (e) => {
        e.preventDefault();
        getPhone(e.target)
    }
    )
}


function getPhone(form) {
    let phone = {};
    phone["battery"] = form["battery"].value;
    phone["cores"] = form["cores"].value;
    phone["cpu"] = form["cpu"].value;
    phone["memory"] = form["memory"].value;
    phone["ppi"] = form["ppi"].value;
    phone["rearcam"] = form["rearcam"].value;
    phone["storage"] = form["storage"].value;
    phone["thickness"] = form["thickness"].value;
    console.log(phone)
    makePrediction(phone)
}


loadModel()