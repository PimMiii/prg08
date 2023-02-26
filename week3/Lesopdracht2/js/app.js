let classifier;
const featureExtractor = ml5.featureExtractor('MobileNet', { numLabels: 3 }, modelLoaded)

const trainImg = document.getElementById("trainImage");
const video = document.getElementById("webcam");
const label = document.getElementById("label");

const beerBtn = document.querySelector('#beer');
const canBtn = document.querySelector("#can");
const smallBottleBtn = document.querySelector("#sbottle");

const loadImagesBtn = document.querySelector("#loadIMG");
const trainbtn = document.querySelector("#train");
const saveBtn = document.querySelector("#save");

beerBtn.addEventListener("click", addBeerImage);
canBtn.addEventListener("click", addCanImage);
smallBottleBtn.addEventListener("click", addSmallBottleImage);

trainbtn.addEventListener("click", trainModel);
saveBtn.addEventListener("click", saveModel);


function addBeerImage() {
    classifier.addImage(video, 'beer bottle', () => {
        let text = "added beer bottle to model!";
        console.log(text);
        label.innerHTML = text;
    })
}

function addCanImage() {
    classifier.addImage(video, 'aluminium can', () => {
        let text = "added aluminium can to model!";
        console.log(text);
        label.innerHTML = text;
    })
}

function addSmallBottleImage() {
    classifier.addImage(video, 'plastic bottle ', () => {
        let text = "added plastic bottle to model!";
        console.log(text);
        label.innerHTML = text;
    })
}


function trainModel() {
    classifier.train((lossValue) => {
        console.log('Loss is', lossValue)
        if (lossValue == null) {
            saveBtn.disabled = false;
            setInterval(() => {
                classifier.classify(video, (err, result) => {
                    if (err) console.log(err)
                    console.log(result)
                    label.innerHTML = result[0].label
                })
            }, 1000)
        }
    })
}

function saveModel() {
    if(saveBtn.disabled){
        return
    }
    featureExtractor.save()
}

function modelLoaded() {
    classifier = featureExtractor.classification(video, videoReady)
}
function videoReady() {
    console.log("the webcam is ready")
}

if (navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
            video.srcObject = stream;
        })
        .catch((err) => {
            console.log("Something went wrong!");
        });
}

label.innerText = "Ready when you are!";
