    // More API functions here:
    // https://github.com/googlecreativelab/teachablemachine-community/tree/master/libraries/image
    //const URL = "https://teachablemachine.withgoogle.com/models/sx4-6ZMhS/";
    const URL = "https://teachablemachine.withgoogle.com/models/fa6CmYcOv/"
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
        // labelContainer = document.getElementById("label-container");
        // for (let i = 0; i < maxPredictions; i++) { // and class labels
        //     labelContainer.appendChild(document.createElement("div"));
        // }
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
        const prediction = await model.predict(canvas);
        let highest = -1, classPrediction = ""
        for (let i = 0; i < maxPredictions; i++) {
          if (prediction[i].probability > highest){
            highest = prediction[i].probability
            classPrediction = prediction[i].className
          }
        }
        document.getElementById("pTitle").innerHTML = classPrediction + " - Hold for 2 Seconds"
    }