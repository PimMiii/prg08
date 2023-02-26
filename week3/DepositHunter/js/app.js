const featureExtractor = ml5.featureExtractor('MobileNet', extractorLoaded)
const synth = window.speechSynthesis;

let label = document.getElementById('label');
let lives = 3;
let score = 0;

const image = document.getElementById('output')
const fileButton = document.querySelector("#userInput")
const fileButtonLabel = document.querySelector("#userInputLabel")
const explainText = document.querySelector("#commandText")
const scoringText = document.querySelector("#scoringText")
const scoreNum = document.querySelector("#scoreNum");
const livesNum = document.querySelector("#livesNum");
const classifier = featureExtractor.classification(image);

fileButton.addEventListener("change", (event) => {
    image.src = URL.createObjectURL(event.target.files[0])
})

image.addEventListener('load', () => userImageUploaded())

function userImageUploaded() {
    console.log("The image is now visible in the DOM");
    makePrediction()
}

function extractorLoaded() {
    console.log('Model Loaded')
    featureExtractor.load('./model/model.json')
    fileButtonLabel.innerHTML = 'Capture or Upload Image'
    fileButton.disabled = false;
    let text = `${explainText.innerHTML}.`
    speak(text)
}

function makePrediction() {
    classifier.classify(image, (err, results) => {
        let text;
        console.log(err)
        console.log(results)
        label.innerHTML = ``
        if((results[0].confidence * 100).toFixed(2) >= 98){
        text = `This is a ${results[0].label}. I am ${results[0].confidence.toFixed(2) * 100}% confident.`
        } else {
            text = `Sorry, there is no deposit on this item. You've lost 1 life`
        }
        if (lives > 1) {
        speak(text)
        }
        label.innerHTML = text
        applyScore(results)
    })
}

function applyScore(results){
    // check confidence
    if((results[0].confidence *100).toFixed(2) >= 98) {
        switch(results[0].label){
            case 'aluminium can':
                score += 15
                break;
            case 'beer bottle':
                score += 10
                break;
            case 'plastic bottle ':
                score += 25
                break;
        }
        scoreNum.innerHTML = (score/100).toFixed(2)
    } else {
        lives --;
        livesNum.innerHTML = lives;
        if(lives < 1){
            endGame()
        }
    }
}

function endGame(){
    console.log('GAME OVER')
    let endtext = `Game Over! Your score is: €${(score/100).toFixed(2)}.`

    label.innerHTML = endtext
    speak(endtext)
    fileButton.disabled = true;
    fileButtonLabel.innerHTML = 'Game Over, please refresh the page to start a new game.'
}

function classifierReady() {
    console.log('ready')
}

function speak(text) {
    if (synth.speaking) {
        console.log('still speaking...')
        return
    }
    if (text !== '') {
        let utterThis = new SpeechSynthesisUtterance(text)
        synth.speak(utterThis)
    }
}