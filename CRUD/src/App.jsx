import './App.css'
import Crud from './components/Crud'
import Login from './components/Login'
import Signin from './components/Signin'
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Users from './components/Users';


function App() {
  

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/crud" element={<Users />} />
        <Route path='/todo' element={<Crud/>}/>
      </Routes>
    </Router>
    // <>
    // <Users/>
    // </>
  )
}

export default App
