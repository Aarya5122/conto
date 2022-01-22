import React, { useState, useReducer } from "react";

//bootstrap, reactstrap
import "bootstrap/dist/css/bootstrap.min.css"

//react-toastify
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"

//Context
import UserContext from "./context/userContext/userContext";
import ContactContext from "./context/contactContext/contactContext";
import ContactReducer from "./context/contactContext/contactReducer";

//Firebase
import { initializeApp } from "firebase/app"
import firebaseConfig from "./utils/firebaseConfig";

//React-router-dom
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

//Components
import Footer from "./layout/Footer";
import Header from "./layout/Header";
import Signup from "./pages/Signup";
import Signin from "./pages/Signin";
import PageNotFound from "./pages/PageNotFound";
import Contacts from "./pages/Contacts";
import ContactCard from "./pages/ContactCard";
import AddContact from "./pages/AddContact";

import "./App.css"

const initialState = {
  contacts: [],
  contact: {},
  contactToUpdate: null,
  contactToUpdateKey: null,
  isLoading: false
};


//Initializing Firebase should be done after imports!
initializeApp(firebaseConfig)

const App = () => {

  const [user, setUser] = useState(null)
  const [contactState, dispatch] = useReducer(ContactReducer, initialState)
  
    return(
      <UserContext.Provider value={{user, setUser}}>
      <ContactContext.Provider value={{contactState, dispatch}}>
        <ToastContainer/>
        <Router>
          <Header/>
          <Routes>
            <Route path="/" element={<Contacts/>} />
            <Route path="/signup" element={<Signup/>}/>
            <Route path="/signin" element={<Signin/>}/>
            <Route path="/contact/view" element={<ContactCard/>}/>
            <Route path="/contact/add" element={<AddContact/>}/>
            <Route path="*" element={<PageNotFound/>}/>
          </Routes>
          <Footer/>
        </Router>
      </ContactContext.Provider>
      </UserContext.Provider>
    )

}

export default App