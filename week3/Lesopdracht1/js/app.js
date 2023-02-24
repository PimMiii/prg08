const classifier = ml5.imageClassifier('MobileNet', modelLoaded)
let label = document.getElementById('label')


function modelLoaded() {
    makePrediction()
}

function makePrediction() {
    classifier.classify(document.getElementById('image'), (err, results) => {
        console.log(results)
       label.innerHTML = ` ` 
        label.innerHTML = `Dit is een ${results[0].label} ik weet het ${results[0].confidence.toFixed(2)*100}% zeker`
    })
}