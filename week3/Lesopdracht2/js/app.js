let classifier;
const featureExtractor = ml5.featureExtractor('MobileNet', { numLabels: 3 }, modelLoaded)

const video = document.getElementById("webcam");
const label = document.getElementById("label");

const cubeBtn = document.querySelector('#cube');
const canBtn = document.querySelector("#can");
const bottleBtn = document.querySelector("#bottle");
const trainbtn = document.querySelector("#train");

cubeBtn.addEventListener("click", addCubeImage);
canBtn.addEventListener("click", addCanImage);
bottleBtn.addEventListener("click", addBottleImage);

trainbtn.addEventListener("click", trainModel);

function addCubeImage() {
    classifier.addImage(video, 'cube', () => {
        console.log("added Cube to model!")
    })
}

function addCanImage() {
    classifier.addImage(video, 'can', () => {
        console.log("added Can to model!")
    })
}

function addBottleImage() {
    classifier.addImage(video, 'bottle', () => {
        console.log("added Bottle to model!")
    })
}

function trainModel() {
    classifier.train((lossValue) => {
        console.log('Loss is', lossValue)
        if (lossValue == null) {

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
