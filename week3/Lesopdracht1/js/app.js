const classifier = ml5.imageClassifier('MobileNet', modelLoaded);
const synth = window.speechSynthesis;

let label = document.getElementById('label');
let speakBtn = document.getElementById('speakBtn');
let tryBtn = document.getElementById('tryBtn');


function speakBtnHandler() {
    if(speakBtn.disabled){
        return
    }
    speak(label.innerHTML);

}

function tryBtnHandler() {
    if(tryBtn.disabled){
        return
    }
    tryBtn.disabled = true;
    speakBtn.disabled = true;
    makePrediction()
}

//add event listeners to buttons.
tryBtn.addEventListener('click', tryBtnHandler)
speakBtn.addEventListener('click',speakBtnHandler)


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

function modelLoaded() {
    makePrediction()
}

function makePrediction() {
    classifier.classify(document.getElementById('image'), (err, results) => {
        console.log(results)
       label.innerHTML = `` 
        label.innerHTML = `This is a ${results[0].label}. I am ${results[0].confidence.toFixed(2)*100}% confident.`
        speakBtn.disabled = false;
        tryBtn.disabled = false;
    })
}