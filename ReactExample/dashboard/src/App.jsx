import './App.css'
import Header from './Components/Header'
import StudentCard from './Components/StudentCard'
function App() {

  return (
    <>
      <Header/>
      <StudentCard name="adil" course = "MERN"/>
      <StudentCard name="ada" course = "MERN"/>
      <StudentCard name="zayan" course = "MERN"/>
    </>
  )
}

export default App
