import '../stylesheets/App.css';
import {BrowserRouter as Router,Routes,Route} from 'react-router-dom';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Chat from '../component/Chat';

function App() {
  return (
    <Router>  
        <Routes>
            <Route exact path='/login' element={<Login/>}></Route>
            <Route exact path='/' element={<Register/>}></Route>  
            <Route exact path='/chat' element={<Chat/>}></Route>  
        </Routes>
    </Router>
  );
}

export default App;
