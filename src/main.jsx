import React from 'react'
import ReactDOM from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './Components/Login';
import Error from "./Components/Error";
import InputForm from './Components/InputForm'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import "@fortawesome/fontawesome-free/css/all.min.css";
import './index.css';
import PageNotFound from './Components/PageNotFound';
import Success from './Components/Success';
import Prac from './Components/Prac';
<<<<<<< HEAD
import Deploy from './Components/Deploy';
import SelectOption from './Components/SelectOption';
import History from './Components/History';
=======
>>>>>>> a1938710be3a105b5143f81c8efabb4f515332ab

ReactDOM.createRoot(document.getElementById('root')).render(

  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path='/login' element={<Login />} />
        <Route path="/inputform" element={<InputForm />} />
        <Route path='/success' element={<Success />} />
        <Route path='/error' element={<Error />} />
        <Route path="/prac" element={<Prac/>} />
<<<<<<< HEAD
        <Route path="/deploy" element={<Deploy/>}/>
        <Route path="/selectoption" element={<SelectOption/>}/>
        <Route path="/history" element={<History/>}/>
=======
>>>>>>> a1938710be3a105b5143f81c8efabb4f515332ab
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>


)
