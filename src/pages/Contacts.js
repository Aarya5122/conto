import React, { useContext, useEffect, Fragment } from "react"

import { Navigate, useNavigate } from "react-router-dom"

import UserContext from "../context/userContext/userContext"
import ContactContext from "../context/contactContext/contactContext"
import { UPDATE_CONTACT, VIEW_CONTACT } from "../context/contactContext/action.types"

import { Col, Container, Row, Spinner } from "reactstrap"
import { FaNetworkWired, FaPlusCircle } from "react-icons/fa"

import ContactListItem from "../components/ContactListItem"

import { getDatabase, onValue, ref } from "firebase/database";
import { SET_CONTACTS, SET_LOADING } from "../context/contactContext/action.types";

const Contacts = () => {

    const { user } = useContext(UserContext)
    const { contactState, dispatch } = useContext(ContactContext)

    const navigate = useNavigate()

    /** getContacts: This functions fetches all the contacts in the
     * database but firstly we will set the loading as true by setting a
     * dispatch of type SET_LOADING and it checks if user exist i.e logged
     * in then create a database reference and fetch all values using 
     * onValue and in the snapshot retured by onValue call a dispatch of 
     * type SET_CONTACTS and assign the payload as snapshot.val() now 
     * again call a dispatch of type SET_LOADING to false.
     */
    const getContacts = () => {
        
        dispatch({
          type: SET_LOADING,
          payload: true
        })

        const database = getDatabase()
        if(user){
            const databaseRef = ref(database, `contacts/${user.uid}`)
            onValue(
            databaseRef,
            (snapshot) => {
                dispatch({
                type: SET_CONTACTS,
                payload: snapshot.val()
                })
                dispatch({
                type: SET_LOADING,
                payload: false
                })
            }
            )
        }
      }
    
      /** This useEffect will call getContacts everytime 
       * the route hits particular url it is called only once for a route
       * as it does not have dependencies. */
      useEffect(
        () => {
          console.log("Fetching Data")
          getContacts()
        },[]
      )

    /** This useEffect is used take care of a bug
     * BUG: When you visit update contact url and contact card url and hit
     * back button and come to contacts route now you again hit forward
     * button on browser then it should show which contact was updated
     * previosly and which contact was viewed.
     * Hence we call a dispatch of type UPDATE_CONTACT and set it to null.
     * Again we call a dispatch of type VIEW_CONTACT and set it to null.
     */
    useEffect(
        ()=>{
            dispatch({
                type: UPDATE_CONTACT,
                payload:null,
                key:null
            })
            console.log("Clearing Contact!");
            dispatch({
                type: VIEW_CONTACT,
                payload:null
            })
        },[]
    )

    /** handleAddContactButton: This function calls a dispatch of type 
     * UPDATE_CONTACT as sets it to null as we are not updating the 
     * contact we are creating a new one. Now we navigate it to 
     * contact/add route.
     */
    const handleAddContactButton = () => {
        dispatch({
            type: UPDATE_CONTACT,
            payload:null,
            key:null
        })
        navigate("/contact/add")
    }

    /** If user exist (logged in) then create a database reference and
     * fetch all the contact details from database and render it, else 
     * navigate it to signin route
     */
    if(user){
        if(contactState.isLoading){
            return(
                <Container fluid>
                    <Row className="text-warning fs-3">
                        <Col md={6} className="offset-md-3  mt-5 Center">
                            <Spinner color="warning" /><br/>
                            <span>Loading...</span>
                        </Col>
                    </Row>
                </Container>
            )
        }
        return(
            <Container fluid className="mb-5">
                <Row>
                { 
                    (contactState.contacts.length === 0 && !contactState.isLoading)?
                    (
                        <Col md={6} className="offset-md-3  Center mt-5">
                            <span className="text-warning fs-2 text-center">
                                Conto - connects to your attached one's<br/>
                                Let's build your network together!<FaNetworkWired/>
                            </span> 
                        </Col>
                    )
                    :
                    (
                        Object.entries(contactState.contacts).map(
                            ([key, contact]) => (
                                <Fragment key={key}>
                                    <ContactListItem contactKey={key} contact={contact} />
                                </Fragment>
                            )
                        )      
                    )
                }
                </Row>
                <FaPlusCircle className="fixed-bottom-right mb-5 fs-1 text-success " onClick={handleAddContactButton}/>
            </Container>
        )
            
    } 
    return <Navigate replace to="/signin"/>
}

export default Contacts