//
// DOM
//
const phoneDisplay = document.getElementById("phone");
const phoneForm = document.getElementById("phoneForm");
const predictionDisplay = document.getElementById("prediction");
const loadingDisplay = document.getElementById("loading");

const nn = ml5.neuralNetwork({ task: 'regression' })


function loadModel() {
    nn.load('./model/model.json', modelLoaded)
}

function modelLoaded() {

    loadingDisplay.hidden = true;
    phoneForm.hidden = false;
    phoneForm.addEventListener("submit", (e) => {
        e.preventDefault();
        getPhone(e.target)
    }
    )
}


function getPhone(form) {
    let phone = {};
    phone["battery"] = parseInt(form["battery"].value);
    phone["cores"] = parseInt(form["cores"].value);
    phone["cpu"] = parseInt(form["cpu"].value);
    phone["memory"] = parseInt(form["memory"].value);
    phone["ppi"] = parseInt(form["ppi"].value);
    phone["rearcam"] = parseInt(form["rearcam"].value);
    phone["storage"] = parseInt(form["storage"].value);
    phone["thickness"] = parseInt(form["thickness"].value);
    phoneDisplay.innerHTML = JSON.stringify(phone);
    console.log(phone)
    makePrediction(phone)
}

async function makePrediction(phone){
    predictionDisplay.innerText = "Price: Predicting ...."
    let prediction = await nn.predict({
                        ppi: phone.ppi,
                        battery: phone.battery,
                        cores: phone.cores,
                        cpu: phone.cpu,
                        memory: phone.memory,
                        storage: phone.storage,
                        rearcam: phone.rearcam,
                        thickness: phone.thickness
    })
    console.log(prediction)
    predictionDisplay.innerHTML = `Price: ${Math.floor(prediction[0].price)}`
    
}


loadModel()