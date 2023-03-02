import { useState } from "react";
import {mainLightOn, mainLightOff, nightLightOn, nightLightOff} from "../utils/api";

function Voice({ recognizer,mainLight, nightLight, setMainLight, setNightLight }) {
  const [active, setActive] = useState(false);

  if (!active) {
    return (
      <div
        className="rounded-full mic-btn border border-black p-3"
        onClick={() => {
          const classLabels = recognizer.wordLabels(); // get class labels
          console.log(classLabels);
          // listen() takes two arguments:
          // 1. A callback function that is invoked anytime a word is recognized.
          // 2. A configuration object with adjustable fields
          recognizer.listen(
            (result) => {
              const scores = result.scores; // probability of prediction for each class
              // render the probability scores per class
            //   console.log(scores);
              if (scores[2] > 0.9 && scores[2] > scores[1]) {
                console.log("Night Light");
                const mightLight = document.getElementById("night-light");
                
                if (mightLight.children[1].innerHTML == "OFF") {
                    mightLight.children[1].innerHTML = "ON"
                    nightLightOn();
                    
                }else{
                    mightLight.children[1].innerHTML = "OFF"
                    nightLightOff();
                    
                }
                // bulbOn();
              } else if (scores[1] > 0.9 && scores[1] > scores[2]) {
                console.log("Main Light");
                const mainLight = document.getElementById("main-light");
                
                if (mainLight.children[1].innerHTML == "OFF") {
                    mainLight.children[1].innerHTML = "ON"
                    mainLightOn();
                }else{
                    mainLight.children[1].innerHTML = "OFF"
                    mainLightOff();
                }
                
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
          setActive(!active);
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-8 w-8  text-white"
        >
          <path d="M8.25 4.5a3.75 3.75 0 117.5 0v8.25a3.75 3.75 0 11-7.5 0V4.5z" />
          <path d="M6 10.5a.75.75 0 01.75.75v1.5a5.25 5.25 0 1010.5 0v-1.5a.75.75 0 011.5 0v1.5a6.751 6.751 0 01-6 6.709v2.291h3a.75.75 0 010 1.5h-7.5a.75.75 0 010-1.5h3v-2.291a6.751 6.751 0 01-6-6.709v-1.5A.75.75 0 016 10.5z" />
        </svg>
      </div>
    );
  } else {
    return (
      <div
        className="rounded-full mic-btn border border-black p-3"
        onClick={() => {
          recognizer.stopListening();
          setActive(!active);
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-8 w-8 text-white"
        >
          <path
            fillRule="evenodd"
            d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </div>
    );
  }
}

export default Voice;
