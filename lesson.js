    // More API functions here:
    // https://github.com/googlecreativelab/teachablemachine-community/tree/master/libraries/image
    const URL = "https://teachablemachine.withgoogle.com/models/sx4-6ZMhS/";
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
    window.onload = () => {
      if ("mediaDevices" in navigator && navigator.mediaDevices.getUserMedia) {
        startStream(constraints);
      }
    };
    const video = document.querySelector("video");
    const startStream = async (constraints) => {
      let stream = await navigator.mediaDevices.getUserMedia(constraints);
      video.srcObject = stream;
      init()
    }
    let model, webcam, labelContainer, maxPredictions;
    async function init() {
        const modelURL = URL + "model.json";
        const metadataURL = URL + "metadata.json";
        
    
        // load the model and metadata
        // Refer to tmImage.loadFromFiles() in the API to support files from a file picker
        // or files from your local hard drive
        // Note: the pose library adds "tmImage" object to your window (window.tmImage)
        model = await tmImage.load(modelURL, metadataURL);
        maxPredictions = model.getTotalClasses();

        // Convenience function to setup a webcam
        const flip = true; // whether to flip the webcam
        // webcam = new tmImage.Webcam(200, 200, flip); // width, height, flip
        // await webcam.setup(); // request access to the webcam
        // await webcam.play();
        window.requestAnimationFrame(loop);

        // append elements to the DOM
        // document.getElementById("webcam-container").appendChild(webcam.canvas);
        labelContainer = document.getElementById("label-container");
        for (let i = 0; i < maxPredictions; i++) { // and class labels
            labelContainer.appendChild(document.createElement("div"));
        }
    }

    async function loop() {
        //webcam.update(); // update the webcam frame
        await predict();
        window.requestAnimationFrame(loop);
    }

    // run the webcam image through the image model
    async function predict() {
        // predict can take in an image, video or canvas html element
        const prediction = await model.predict(video);
        let highest = -1, classPrediction = ""
        for (let i = 0; i < maxPredictions; i++) {
          if (prediction[i].probability > highest){
            highest = prediction[i].probability
            classPrediction = prediction[i].className
          }
        }
        console.log(classPrediction);
    }