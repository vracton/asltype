var time = 15

const constraints = {
  video: {
    facingMode: "user",
    width: {
      min: 1280,
      ideal: 1920,
      max: 2560,
    },
    height: {
      min: 720,
      ideal: 1080,
      max: 1440,
    },
  },
};

let canvas;
window.onload = () => {
  document.querySelector("video").style.marginLeft =
    -(document.querySelector("video").offsetWidth - 500) / 2;
  if ("mediaDevices" in navigator && navigator.mediaDevices.getUserMedia) {
    startStream(constraints);
  }
  canvas = document.getElementById("c");
};

window.onresize = () => {
  document.querySelector("video").style.marginLeft = -(document.querySelector("video").offsetWidth - 500) / 2;
};

const video = document.querySelector("video");
const startStream = async (constraints) => {
  let stream = await navigator.mediaDevices.getUserMedia(constraints);
  video.srcObject = stream;
  init();
};

const letters = "abcdefghiklnoqrsuvwxy".split("")
const numbers = "0123456789".split("")
let inGame = false
let curLetter

for (let i = 0;i<100;i++){
  let word = document.createElement("div")
  word.classList.add("word")
  for (let j = 0;j<Math.floor(Math.random()*5)+3;j++){
    let letter = document.createElement("div")
    letter.classList.add("letter")
    letter.innerHTML = letters[Math.floor(Math.random()*letters.length)]
    word.appendChild(letter)
    if (i==0&&j==0){
      curLetter = letter
    }
  }
  document.getElementById("typeText").appendChild(word)
}

document.getElementById("letters").onclick = () => {
  if (!document.getElementById("letters").classList.contains("enabled")&&!inGame) {
    document.getElementById("letters").classList.add("enabled");
    document.getElementById("numbers").classList.remove("enabled");
    isAlpha = true;
    document.getElementById("typeText").innerHTML=""
    for (let i = 0;i<100;i++){
      let word = document.createElement("div")
      word.classList.add("word")
      for (let j = 0;j<Math.floor(Math.random()*5)+3;j++){
        let letter = document.createElement("div")
        letter.classList.add("letter")
        letter.innerHTML = letters[Math.floor(Math.random()*letters.length)]
        word.appendChild(letter)
        if (i==0&&j==0){
          curLetter = letter
        }
      }
      document.getElementById("typeText").appendChild(word)
    }
  }
};

document.getElementById("numbers").onclick = () => {
  if (!document.getElementById("numbers").classList.contains("enabled")&&!inGame) {
    document.getElementById("numbers").classList.add("enabled");
    document.getElementById("letters").classList.remove("enabled");
    isAlpha = false;
    document.getElementById("typeText").innerHTML=""
    for (let i = 0;i<100;i++){
      let word = document.createElement("div")
      word.classList.add("word")
      for (let j = 0;j<Math.floor(Math.random()*5)+3;j++){
        let letter = document.createElement("div")
        letter.classList.add("letter")
        letter.innerHTML = numbers[Math.floor(Math.random()*numbers.length)]
        word.appendChild(letter)
        if (i==0&&j==0){
          curLetter = letter
        }
      }
      document.getElementById("typeText").appendChild(word)
    }
  }
};

let curTime = document.getElementById("15s")

document.getElementById("15s").onclick = () => {
  const e = document.getElementById("15s")
  if (!e.classList.contains("enabled")&&!inGame){
    curTime.classList.remove("enabled")
    e.classList.add("enabled")
    document.getElementById("time").innerHTML = "15s"
    curTime = e
    time = 15
  }
}

document.getElementById("30s").onclick = () => {
  const e = document.getElementById("30s")
  if (!e.classList.contains("enabled")&&!inGame){
    curTime.classList.remove("enabled")
    e.classList.add("enabled")
    document.getElementById("time").innerHTML = "30s"
    curTime = e
    time = 30
  }
}

document.getElementById("60s").onclick = () => {
  const e = document.getElementById("60s")
  if (!e.classList.contains("enabled")&&!inGame){
    curTime.classList.remove("enabled")
    e.classList.add("enabled")
    document.getElementById("time").innerHTML = "60s"
    curTime = e
    time = 60
  }
}

document.getElementById("120s").onclick = () => {
  const e = document.getElementById("120s")
  if (!e.classList.contains("enabled")&&!inGame){
    curTime.classList.remove("enabled")
    e.classList.add("enabled")
    document.getElementById("time").innerHTML = "120s"
    curTime = e
    time = 120
  }
}
var numchar = 0, numCor = 0;
document.getElementById("start").onclick = () => {
  if (!inGame){
    inGame = true
    document.getElementById("start").style.backgroundColor = "#292c2d"
    document.getElementById("time").style.fontWeight = "bold"
    document.getElementById("cpm").style.fontWeight = "bold"
    document.getElementById("acc").style.fontWeight = "bold"
    document.getElementById("time").style.color = "#8253da"
    document.getElementById("cpm").style.color = "#8253da"
    document.getElementById("acc").style.color = "#8253da"
    document.getElementById("cpm").innerText = "0cpm";
    document.getElementById("acc").innerText = "0%";
    let remainTime = time
    document.getElementById("time").innerHTML = time+"s"
    const interval = setInterval(function(){
      remainTime--
      document.getElementById("time").innerHTML = remainTime+"s"
      document.getElementById("cpm").innerText = Math.round(numchar*600/(time-remainTime))/10 + "cpm";
      let acc = Math.round(numCor*10/(numchar))/10
      if (isNaN(acc)){
        acc=0
      }
      //if (numCor > 0 ) {
        document.getElementById("acc").innerText = acc*100 + "%";
      //}
      if (remainTime==0){
        inGame = false
        clearInterval(interval)
        document.getElementById("start").style.backgroundColor = "#8253da"
        document.getElementById("time").style.fontWeight = "normal"
        document.getElementById("cpm").style.fontWeight = "normal"
        document.getElementById("acc").style.fontWeight = "normal"
        document.getElementById("time").style.color = "#474848"
        document.getElementById("cpm").style.color = "#474848"
        document.getElementById("acc").style.color = "#474848"
        numchar = 0
        numCor = 0
        document.getElementById("pBar").style.width = "0%"
      }
    },1000)
  }
}
let aModel,
  nModel,
  webcam,
  labelContainer,
  aMaxPredictions,
  nMaxPredictions,
  isAlpha;
async function init() {
  const NumberURL = "https://teachablemachine.withgoogle.com/models/33Jw6otUj/";
  const AlphaURL = "https://teachablemachine.withgoogle.com/models/fa6CmYcOv/";
  const aModelURL = AlphaURL + "model.json";
  const aMetadataURL = AlphaURL + "metadata.json";
  const nModelURL = NumberURL + "model.json";
  const nMetadataURL = NumberURL + "metadata.json";

  aModel = await tmImage.load(aModelURL, aMetadataURL);
  nModel = await tmImage.load(nModelURL, nMetadataURL);
  aMaxPredictions = aModel.getTotalClasses();
  nMaxPredictions = nModel.getTotalClasses();

  isAlpha = true;
  window.requestAnimationFrame(loop);
}

async function loop() {
  canvas.width = 500;
  canvas.height = 500;
  canvas.getContext("2d").translate(500, 0);
  canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
  canvas.getContext("2d").scale(-1, 1);
  canvas
    .getContext("2d")
    .drawImage(
      video,
      (document.querySelector("video").offsetWidth - 80) / 2,
      0,
      720,
      720,
      0,
      0,
      500,
      500
    );
  await predict();
  window.requestAnimationFrame(loop);
}
let lastLetter, numIters
async function predict() {
  try {
    const prediction = await (isAlpha ? aModel : nModel).predict(canvas);
    let highest = -1,
      classPrediction = "";
    for (let i = 0; i < (isAlpha ? aMaxPredictions : nMaxPredictions); i++) {
      if (prediction[i].probability > highest) {
        highest = prediction[i].probability;
        classPrediction = prediction[i].className;
      }
    }
    if (inGame){
      if (classPrediction == lastLetter){
        numIters++
      } else {
        lastLetter = classPrediction
        numIters = 1
      }
      if (numIters > 10 && classPrediction.toLowerCase()!="none"){
        document.getElementById("pBar").style.width = ((numIters<=30?numIters:30)/30)*100+"%"
        document.getElementById("pTitle").innerHTML = "hold for 0.5 seconds";
      } else {
        document.getElementById("pBar").style.width = "0%"
        document.getElementById("pTitle").innerHTML = "waiting for input";
      }
      if (numIters>=30 && classPrediction.toLowerCase()!="none"){
        console.log("h")
        if (curLetter.innerText.toLowerCase()==classPrediction.toLowerCase()){
          curLetter.classList.add("done")
          numCor++
        } else {
          curLetter.classList.add("wrong")
        }
        numchar++
        if (curLetter.nextSibling){
          curLetter = curLetter.nextSibling
          
        } else {
          curLetter = curLetter.parentElement.nextSibling.children[0]
        }
        numIters = 0
      }
    } else {
      document.getElementById("pTitle").innerHTML = "ready to go!";
    }
  } catch (e) {
    console.log(e);
  }
}
