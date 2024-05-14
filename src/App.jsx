import './App.css'
import { useRef, useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

//const randomInput="A transcription service is a business which converts speech".split(' ').sort(()=>Math.random() > 0.5 ? 1 :-1) // +is decreasing, - is ascending

function App() {
  const [userInput,setUserInput]=useState('')
  const [rerender, setRerender] = useState(true);
  const isMounted = useRef(false); 
  const currRandomInput= useRef(null)
  console.log(currRandomInput)

  useEffect(()=>{
    if (!isMounted.current){
      console.log(rerender)
      isMounted.current=true  
    let getData= async()=>{
    await  fetch('https://api.quotable.io/random')
    .then(response =>response.json())
    .then(data =>currRandomInput.current=data.content)
    setRerender(!rerender)
    }
    getData()
  }
  
    
  },[])




  return (
    <>
      <h1>Typing Test</h1>
      {/* <button onClick={() => setRerender(!rerender)}>Click to generate new quote!</button> */}
      <p>{currRandomInput.current}</p>
      
      <input autoFocus type="text"
      value={userInput}
      onChange={(e)=>{return setUserInput(e.target.value)}}/>
    </>
  )
}

export default App
