import './App.css';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"; 
import SignIn from './components/Signin'; 
import SignUp from './components/Signup'; 
import Home  from './components/Home';
function App() {
  
  return (
    <Router>
        <Routes>
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/" element={<Home />} />
            {/* <Route path="/" element={<ChatApp />} /> */}
            {/* <Route path="*" element={<NotFound />} /> */}
        </Routes>
    </Router>
  );
}

export default App;
