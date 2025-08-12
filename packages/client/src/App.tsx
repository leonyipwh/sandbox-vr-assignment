import './App.css'
import Wordle from './pages/wordle/wordle.tsx';
import { Toaster } from 'react-hot-toast';

function App() {

  return (
    <>
      <Toaster />
      <Wordle />
    </>
  )
}

export default App
