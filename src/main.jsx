import React from 'react'
import ReactDOM from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './Components/Login';
import Error from "./Components/Error";
import InputForm from './Components/InputForm'
import { BrowserRouter ,Routes,Route} from 'react-router-dom';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import "@fortawesome/fontawesome-free/css/all.min.css";
import './index.css'
ReactDOM.createRoot(document.getElementById('root')).render(

<React.StrictMode>
<BrowserRouter>
<Routes>
        <Route path = "/" element={<Login/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path = "/inputform" element={<InputForm/>}/>
        <Route path = "*" element={<Error/>}/>
  </Routes>
</BrowserRouter>
  </React.StrictMode>
  
  
)
