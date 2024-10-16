import { useState } from 'react'
import './App.css'
import Stack from './components/Stack'
import RecyclingBin from './components/RecyclingBin'
import GarbageCollector from './components/GarbageCollector'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Stack />
      <GarbageCollector />
      <RecyclingBin />
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
    </>
  )
}

export default App
