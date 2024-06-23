    // More API functions here:
    // https://github.com/googlecreativelab/teachablemachine-community/tree/master/libraries/image
    //const URL = "https://teachablemachine.withgoogle.com/models/sx4-6ZMhS/";
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
    let canvas
    window.onload = () => {
      document.querySelector("video").style.marginLeft = -(document.querySelector("video").offsetWidth-500)/2
      if ("mediaDevices" in navigator && navigator.mediaDevices.getUserMedia) {
        startStream(constraints);
      }
      canvas = document.getElementById("c")
    };

    window.onresize = () =>{
      document.querySelector("video").style.marginLeft = -(document.querySelector("video").offsetWidth-500)/2
    }

    const video = document.querySelector("video");
    const startStream = async (constraints) => {
      let stream = await navigator.mediaDevices.getUserMedia(constraints);
      video.srcObject = stream;
      init()
    }

    document.getElementById("letters").onclick = () => {
      if (!document.getElementById("letters").classList.contains("enabled")){
        document.getElementById("letters").classList.add("enabled")
        document.getElementById("numbers").classList.remove("enabled")
        isAlpha = true
      }
    }

    document.getElementById("numbers").onclick = () => {
      if (!document.getElementById("numbers").classList.contains("enabled")){
        document.getElementById("numbers").classList.add("enabled")
        document.getElementById("letters").classList.remove("enabled")
        isAlpha = false
      }
    }

    let aModel,nModel, webcam, labelContainer, aMaxPredictions, nMaxPredictions, isAlpha;
    async function init() {
      const NumberURL = "https://teachablemachine.withgoogle.com/models/33Jw6otUj/"
      const AlphaURL = "https://teachablemachine.withgoogle.com/models/fa6CmYcOv/"
      const aModelURL = AlphaURL + "model.json";
      const aMetadataURL = AlphaURL + "metadata.json";
      const nModelURL = NumberURL + "model.json";
      const nMetadataURL = NumberURL + "metadata.json";
        
      aModel = await tmImage.load(aModelURL, aMetadataURL);
      nModel = await tmImage.load(nModelURL, nMetadataURL);
      aMaxPredictions = aModel.getTotalClasses();
      nMaxPredictions = nModel.getTotalClasses();

      isAlpha = true
      window.requestAnimationFrame(loop);
    }

    async function loop() {
        //webcam.update(); // update the webcam frame
        canvas.width = 500;
    canvas.height = 500;
    canvas.getContext("2d").translate(500, 0);
    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
    canvas.getContext("2d").scale(-1, 1);
    canvas.getContext("2d").drawImage(video, (document.querySelector("video").offsetWidth-80)/2, 0, 720, 720, 0, 0, 500, 500)
        await predict();
        window.requestAnimationFrame(loop);
    }

    // run the webcam image through the image model
    async function predict() {
        // predict can take in an image, video or canvas html element
        try {
          const prediction = await (isAlpha?aModel:nModel).predict(canvas);
          let highest = -1, classPrediction = ""
          for (let i = 0; i < (isAlpha?aMaxPredictions:nMaxPredictions); i++) {
            if (prediction[i].probability > highest){
              highest = prediction[i].probability
              classPrediction = prediction[i].className
            }
          }
          document.getElementById("pTitle").innerHTML = classPrediction + " - Hold for 2 Seconds"
        } catch (e){
          console.log(e)
        }
    }