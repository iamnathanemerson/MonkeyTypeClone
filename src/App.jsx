import "./App.css";
import { useRef, useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./style.css";

function App() {
  //const randInp="A transcription service is a business which converts speech".split(' ').sort(()=>Math.random() > 0.5 ? 1 :-1) // +is decreasing, - is ascending
  const [randomInput, setRandInput] = useState("");
  const [userInput, setUserInput] = useState("");
  const [inputCompare, setInputCompare] = useState("");
  const [changeColor, setChangeColor] = useState("default");
  const [rerender, setRerender] = useState(true);
  const isMounted = useRef(false);
  const currRandomInput = useRef("");

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
        setRandInput(currRandomInput.current);
        console.log(currRandomInput.current);
      };

      getData();
    }
  }, []);

  function compareCharacters(e) {
    if (e.keyCode != 8) {
      setUserInput(userInput + e.key);
      console.log(userInput + e.key);
    }
    let currindex = userInput.length;
    // var ele=document.getElementById(currindex)
    // var eleValue=ele.value
    //console.log(currRandomInput.current[currindex],e.key)
    //console.log(e.target.value.slice(-1))
    if (e.keyCode === 8) {
      currindex -= 1;
      document.getElementById(`${currindex}`).className = "default";

      var prevInput = userInput.substring(0, userInput.length - 1);
      //console.log(prevInput)
      setUserInput(prevInput);
      return;
    }
    if (currRandomInput.current[currindex] === e.key) {
      document.getElementById(`${currindex}`).className = "correct";
      // document.getElementById('myelement').className
      // var element = document.querySelector(`${currindex}`);
      // console.log(element)
      // element.classList.replace("default", "correct");
    } else {
      document.getElementById(`${currindex}`).className = "wrong";
    }
  }
  return (
    <>
      <h1 className="typeHead">Typing Test</h1>
      {/* <button onClick={() => setRerender(!rerender)}>Click to generate new quote!</button> */}
      <div className="typingTest">
        <input
          autoFocus
          type="text"
          className="userTypingArea"
          onKeyDown={compareCharacters}
        />
        <div className="typingTest2">
        {currRandomInput.current.split("").map((char, index) => {
          return (
            <span className="default" id={index} key={index}>
              {char}
            </span>
          );
        })}
        </div>
      </div>
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
    </>
  );
}

export default App;
