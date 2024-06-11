import "./App.css";
import { useRef, useState, useEffect } from "react";
import "./style.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRedoAlt } from "@fortawesome/fontawesome-free-solid";
import "./App.css";
function App() {
  //const randInp="A transcription service is a business which converts speech".split(' ').sort(()=>Math.random() > 0.5 ? 1 :-1) // +is decreasing, - is ascending

  const [userInput, setUserInput] = useState("");
  const [rerender, setRerender] = useState(true); //to make sure latest input ref is shown in the return since useref change doesnt cause rerender
  const isMounted = useRef(false); //extra to prevent useeffect from running twice
  const currRandomInput = useRef("");
  const [correctLettersCount, setCorrectLettersCount] = useState(0);
  const [currIndex, setCurrIndex] = useState(0);
  const [colorArray, setColorArray] = useState([]);
  const inputRef = useRef();
  const [accuracy, setAccuracy] = useState(0);
  const [typing, setTyping] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(30);
  const [wpm, setWpm] = useState(0);
  const [averageCharactersPerWord, setAverageCharactersPerWord] = useState(0);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    if (!isMounted.current) {
      console.log(rerender);
      isMounted.current = true;
      let getData = async () => {
        await fetch("https://api.quotable.io/random")
          .then((response) => response.json())
          .then(
            (data) => (currRandomInput.current = data.content.toLowerCase())
          );
        setRerender(!rerender);
        //setRandInput(currRandomInput.current);
        let wordsCount = currRandomInput.current.split(" ").length;
        setAverageCharactersPerWord(
          currRandomInput.current.length / wordsCount
        );
        for (let i = 0; i < currRandomInput.current.length; i++) {
          setColorArray[(colorArray[i] = "default")];
        }
        console.log(colorArray);
        console.log(currRandomInput.current);
      };

      getData();
      inputRef.current.focus();
    }
  }); // no dependecy array runs on every rerender. [] runs only on first rerender, [somevalue] runs only when this value changes.
  // useEffect(() => {
  //   // this hook will get called every time myArr has changed
  //   // perform some action every time myArr is updated
  //   getAccuracy();

  // }, [correctLettersCount]);

  useEffect(() => {
    if (typing & (timeRemaining > 0)) {
      timer();
    }
    if ((!typing) &(timeRemaining == 0)) {
      inputRef.current.blur();
      getAccuracy();
      getWpm();
      setShowResult(true)
    }
    if (timeRemaining == 0){
      setTyping(false)
      
    }
  }, [typing, timeRemaining]);
  // function changeCursor(e){
  //   setCursorPosition(cursorPosition+" ")
  // }
  // function reloadPage() {
  //   window.location.reload(false);
  // }
  function timer() {
    let interval = setTimeout(() => {
      setTimeRemaining(timeRemaining - 1);
    }, 1000);
  }
  function compareCharacters(e) {
    setTyping(true);

    if (e.keyCode != 8) {
      setCurrIndex(currIndex + 1);
      setUserInput(userInput + e.key);

      console.log(userInput + e.key);
      console.log(currRandomInput.current[currIndex], e.key);
    }

    // var ele=document.getElementById(currindex)
    // var eleValue=ele.value

    //console.log(e.target.value.slice(-1))
    else {
      console.log(currRandomInput.current[currIndex], e.key);
      if (document.getElementById(`${currIndex - 1}`).className === "correct") {
        setCorrectLettersCount(correctLettersCount - 1);

        // setAccuracy(correctLettersCount / currRandomInput.current.length)
      }

      if (currIndex >= 1) {
        setCurrIndex(currIndex - 1);
      }

      console.log(currRandomInput.current[currIndex], e.key);
      document.getElementById(`${currIndex}`).className = "defaultActive";
      for (let i = currIndex; i < currRandomInput.current.length; i++) {
        setColorArray[(colorArray[i] = "default")];
      }

      var prevInput = userInput.substring(0, userInput.length - 1);
      //console.log(prevInput)
      setUserInput(prevInput);

      return;
    }
    if (currRandomInput.current[currIndex] === e.key) {
      // document.getElementById(`${currindex}`).className = "correct";
      setCorrectLettersCount(correctLettersCount + 1);
      getAccuracy();
      getWpm();

      console.log(correctLettersCount);

      setColorArray[(colorArray[currIndex] = "correct")];

      console.log(document.getElementById(`${currIndex}`).className);
      // document.getElementById('myelement').className
      // var element = document.querySelector(`${currindex}`);
      // console.log(element)
      // element.classList.replace("default", "correct");
    } else {
      // document.getElementById(`${currindex}`).className = "wrong";
      setColorArray[(colorArray[currIndex] = "wrong")];
      getAccuracy();
      getWpm();
    }
    if (currIndex === currRandomInput.current.length - 1) {
      setShowResult(true);
      setTyping(false);
      inputRef.current.blur();
    }
  }
  function getAccuracy() {
    setAccuracy(
      Math.floor(
        (correctLettersCount / currRandomInput.current.length) * 1000
      ) / 1000
    );
  }
  function getWpm() {
    setWpm(
      Math.floor(
        (correctLettersCount /
          averageCharactersPerWord /
          (30 - timeRemaining)) *
          60 *
          1000
      ) / 1000
    );
  }
  return (
    <div className="container">
      <h1 className="typeHead">Typing Test</h1>
      <div className="timer">{timeRemaining}</div>
      {/* <button onClick={() => setRerender(!rerender)}>Click to generate new quote!</button> */}
      <div className="typingTest">
        <input
          ref={inputRef}
          type="text"
          className="userTypingArea"
          onKeyDown={compareCharacters}
        />
      </div>

      <div className="typingTest2">
        {/* <i onKeyUp={changeCursor} >{cursorPosition}</i> */}
        {currRandomInput.current.split("").map((char, index) => {
          return (
            <span
              className={
                index === currIndex ? "defaultActive" : colorArray[index]
              }
              id={index}
              key={index}
            >
              {char}
              {/* {console.log(char)} */}
            </span>
          );
        })}
      </div>

      <div>
        <button
          className="refreshPage"
          onClick={() => {
            isMounted.current = false;
            setCorrectLettersCount(0);
            setCurrIndex(0);
            setColorArray([]);
            setUserInput("");
            setTimeRemaining(30);
            setAccuracy(0);
            setWpm(0);
            setShowResult(false);
            
          }}
        >
          <FontAwesomeIcon icon={faRedoAlt} />
        </button>
        {/* <button className="refreshPage" onClick={reloadPage}>
            ↻
          </button> */}
      </div>

      <div
        className={!showResult ? "accuracy" : "showAccuracy"}
      >{`accuracy - ${accuracy}`}</div>

      <div className={!showResult ? "wpm" : "showWpm"}>{`wpm - ${wpm}`}</div>
      {/* wrong useEffect(() => {
      props.actions.something();
        }, [])
        correct useEffect(async () => 
          await props.actions.something();
        )  */}

      {/* <textarea
        autoFocus~
        rows={5}
        cols={100}
        name="typingContent"
        value={userInput}
        // onChange={(e) => showWord(e)}
        onKeyDown={showWord}
        onChange={(e)=>setUserInput(e.target.value)}
      /> */}
      {/* <input autoFocus type="text"
      value={userInput}
      onChange={(e)=>{return showWord(e)}}/> */}
    </div>
  );
}

export default App;
