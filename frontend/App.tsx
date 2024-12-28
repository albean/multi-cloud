import { useState } from 'react'
import reactLogo from './assets/react.svg'
// import viteLogo from './vite.svg'
import './App.css'
import { Button } from "flowbite-react";
import { EventList } from './views/EventList';
import { DarkThemeToggle, Flowbite } from "flowbite-react";

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Flowbite theme={{mode: "dark"}}>
        <div className="container mx-auto py-14">
        	<EventList />
        </div>
      </Flowbite>
		</>
  )
}

export default App
