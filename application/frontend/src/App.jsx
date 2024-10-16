import './App.css'
import './styles/App.scss'
import Stack from './components/Stack'
import RecyclingBin from './components/RecyclingBin'
import GarbageCollector from './components/GarbageCollector'

function App() {

  return (
    <>
      <section className="game">
        <Stack />
        <GarbageCollector />
        <RecyclingBin />
      </section>
    </>
  )
}

export default App
