import * as tf from "@tensorflow/tfjs";
import * as speechCommands from "@tensorflow-models/speech-commands";
import axios from "axios";

const esp = axios.create({
    baseURL: "http://192.168.238.129",
  });

 export const mainLightOn = async () => {
    const res = await esp.get("/main_light/on");
    console.log(res);
  };
  
export const mainLightOff = async () => {
    const res = await esp.get("/main_light/off");
    console.log(res);
  };
 
  export const nightLightOn = async () => {
    const res = await esp.get("/night_light/on");
    console.log(res);
  };
  
export const nightLightOff = async () => {
    const res = await esp.get("/night_light/off");
    console.log(res);
  };

export const getDHTData = async () =>{
  const res = await esp.get("/get_dht");
  return res;
}
  
  



const URL = "https://teachablemachine.withgoogle.com/models/DtbajOPQC/";

export const createModel = async () => {
  const checkpointURL = URL + "model.json"; // model topology
  const metadataURL = URL + "metadata.json"; // model metadata

  const recognizer = speechCommands.create(
    "BROWSER_FFT", // fourier transform type, not useful to change
    undefined, // speech commands vocabulary feature, not useful for your models
    checkpointURL,
    metadataURL
  );

  // check that model and metadata are loaded via HTTPS requests.
  await recognizer.ensureModelLoaded();

  return recognizer;
};

export const init = async ()=> {
  const recognizer = await createModel();
  const classLabels = recognizer.wordLabels(); // get class labels
  console.log(classLabels);
  // listen() takes two arguments:
  // 1. A callback function that is invoked anytime a word is recognized.
  // 2. A configuration object with adjustable fields
  recognizer.listen(
    (result) => {
      const scores = result.scores; // probability of prediction for each class
      // render the probability scores per class
      console.log(scores);
      if (scores[2] > 0.9 && scores[2] > scores[1]) {
        console.log("Night Light");
        // bulbOn();
      } else if (scores[1] > 0.9 && scores[1] > scores[2]) {
        console.log("Main Light");
        // bulbOff();
      }
    },
    {
      includeSpectrogram: true, // in case listen should return result.spectrogram
      probabilityThreshold: 0.75,
      invokeCallbackOnNoiseAndUnknown: true,
      overlapFactor: 0.5, // probably want between 0.5 and 0.75. More info in README
    }
  );

  // Stop the recognition in 5 seconds.
  // setTimeout(() => recognizer.stopListening(), 2000);
}
