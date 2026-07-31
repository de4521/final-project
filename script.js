let model, maxPredictions;

// Teachable Machine Model Load karne ke liye
async function loadModel() {
  const urlInput = document.getElementById("model-url").value.trim();
  
  if (!urlInput) {
    alert("Kripya Teachable Machine Model ki URL paste karein!");
    return;
  }

  const modelURL = urlInput + "model.json";
  const metadataURL = urlInput + "metadata.json";

  try {
    document.getElementById("top-prediction").innerText = "Model Loading...";
    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();
    document.getElementById("top-prediction").innerText = "Model Loaded Successfully! Ab image upload karein.";
  } catch (error) {
    alert("Model load karne me issue aaya. Check karein URL sahi hai ya nahi.");
    document.getElementById("top-prediction").innerText = "Error loading model.";
  }
}

// Image preview dikhane aur predict karne ke liye
async function previewAndPredict(event) {
  const file = event.target.files[0];
  if (!file) return;

  const imgElement = document.getElementById("image-preview");
  imgElement.src = URL.createObjectURL(file);
  imgElement.style.display = "block";

  if (!model) {
    alert("Pehle Model URL daal kar Load Model par click karein!");
    return;
  }

  imgElement.onload = async function() {
    document.getElementById("top-prediction").innerText = "Analyzing Food Item...";
    
    // Model se prediction lena
    const predictions = await model.predict(imgElement);
    
    // Sabse ziada confidence wala class dhoondna
    let highestPrediction = predictions[0];
    for (let i = 1; i < predictions.length; i++) {
      if (predictions[i].probability > highestPrediction.probability) {
        highestPrediction = predictions[i];
      }
    }

    // Result Update karna
    const className = highestPrediction.className;
    const confidence = (highestPrediction.probability * 100).toFixed(1);

    document.getElementById("top-prediction").innerText = `Food Identified: ${className}`;
    document.getElementById("confidence-level").innerText = `Confidence: ${confidence}%`;
  };
}