let classifier;
const featureExtractor = ml5.featureExtractor('MobileNet', modelLoaded)

const video = document.getElementById("webcam");
const label = document.getElementById("label");

const maskBtn = document.querySelector('#mask');
const labelOneBtn = document.querySelector("#labelOne");
const labelTwoBtn = document.querySelector("#labelTwo");
const labelThreeBtn = document.querySelector("#labelThree");
const trainbtn = document.querySelector("#train");

maskBtn.addEventListener("click", () => addMaskImage());
labelOneBtn.addEventListener("click", () => addBottleImage());
labelTwoBtn.addEventListener("click", () => addCupsImage());
labelThreeBtn.addEventListener("click", () => addEmptyImage());

trainbtn.addEventListener("click", () => trainModel());

function addMaskImage() {
    classifier.addImage(video, 'wearing a mask', () => {
        console.log("added image to model!")
    })
}

function addBottleImage() {
    classifier.addImage(video, 'bottle', () => {
        console.log("added image to model!")
    })
}

function addCupsImage() {
    classifier.addImage(video, 'cups', () => {
        console.log("added image to model!")
    })
}

function addEmptyImage() {
    classifier.addImage(video, 'empty', () => {
        console.log("added image to model!")
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
