import './App.css';
import Button from './components/Button';
import GarbageCollector from './components/GarbageCollector';
import RecyclingBin from './components/RecyclingBin';
import Stack from './components/Stack';
import './styles/App.scss';

function App() {
    return (
        <>
            <section className="game">
                <Stack />
                <GarbageCollector />
                <RecyclingBin />
                <Button
                    text="Click Me"
                    onClick={() => console.log('First button clicked!')}
                    className="button-primary"
                />
                <Button
                    text="Another Button"
                    onClick={() => console.log('Second button clicked!')}
                    className="button-secondary"
                />
            </section>
        </>
    );
}

export default App;
