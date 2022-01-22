import React, { useContext } from "react"

import { Row, Col, Card, CardBody, CardFooter, CardHeader, CardTitle } from "reactstrap"

import { ImBin } from "react-icons/im"
import { FaPenNib } from "react-icons/fa"
import { AiFillStar, AiOutlineStar } from "react-icons/ai"
import { IoCheckmarkDoneSharp, IoCheckmarkSharp } from "react-icons/io5"

import ContactContext from "../context/contactContext/contactContext"
import { UPDATE_CONTACT, VIEW_CONTACT } from "../context/contactContext/action.types"
import UserContext from "../context/userContext/userContext"

import { useNavigate } from "react-router-dom"
import { getDatabase, ref as refD, remove, update } from "firebase/database"
import { toast } from "react-toastify"
import { deleteObject, getStorage, ref as refS } from "firebase/storage"

import date from "date-and-time"

const Avatar = "https://firebasestorage.googleapis.com/v0/b/githubprojecttwo.appspot.com/o/contacts%2Fprofile.jpeg?alt=media&token=1d6063aa-c4bb-4b64-92d0-7941bce27a9a"

const ContactListItem = ({contact, contactKey}) => {
    
    const { user } = useContext(UserContext)
    const { dispatch } = useContext(ContactContext)
    const navigate = useNavigate()

    /** handleEdit: This function calls a dispatch of type UPDATE_CONTACT
     * and navigates the user to contact/add
     */
    const handleEdit = () => {
        dispatch({
            type: UPDATE_CONTACT,
            payload: contact,
            key: contactKey
        })
        navigate("/contact/add")
    }

    /** handleStar: updates the star value and update value in database */
    const handleStar = () => {
        const database = getDatabase()
        const databaseRef = refD(database, `contacts/${user.uid}/${contactKey}`)
        update(
            databaseRef,
            {
                star: !contact.star,
                update: date.format(new Date(), 'DD-MM-YYYY')
            },
            err =>{
                console.error("Error in updating star: "+err);
                toast("Error in updating star", {type: "error"})
            }
        )
        .then(
            () => toast("Contact Updated!", { type: "info" })
        )
        .catch(
            err => {
                console.error("Error in handle star: "+err);
                toast("Error in handle Star", { type: "error" })
            }
        )
    }
    
    /** handleActive: updates the active value and update value in database */
    const handleActive = () => {
        const database = getDatabase()
        const databaseRef = refD(database, `contacts/${user.uid}/${contactKey}`)
        update(
            databaseRef,
            {
                active: !contact.active,
                update: date.format(new Date(), 'DD-MM-YYYY')
            },
            err => {
                console.error("Error in updating active: "+err);
                toast("Error in updating active", {type: "error"})
            }
        )
        .then(()=>toast("Contact Updated!", {type: "info"}))
        .catch( err => {
            console.error("Error in handle active: "+err);
            toast("Error in handle active", {type:"error"})
        })
    }

    /** handleDelete:  if contacts avatar is not default avatar and
     * display id of contact is available then that image is deleted
     * from storage. It also updates the contacts collection in databse
     * by deleting that contact in database.
    */
    const handleDelete = () => {
        if(contact.avatar !== Avatar && contact.displayId){
            const storage = getStorage()
            const storageRef = refS(storage, `contacts/${user.uid}/${contact.displayId}`)
            deleteObject(storageRef)
            .then(console.log("Storage Updated"))
            .catch(err => {
                console.error("Error in handle delete storage: "+err);
                toast("Error in handle delete storage", {type: "error"})
            })
        }
        const database = getDatabase()
        const databaseRef = refD(database, `contacts/${user.uid}/${contactKey}`)
        remove(databaseRef)
        .then(toast("Contact Deleted!", {type:"warning"}))
        .catch(err => {
            console.error("Error in handle delete database: "+err)
            toast("Error in handle delete database", {type: "error"})
        })
    }

    /** handleViewContact: This function calls a dispatch of type
     * VIEW_CONTACT and navigates the user to contact/view
     */
    const handleViewContact = () => {
        dispatch({
            type:VIEW_CONTACT,
            payload: contact
        })
        navigate("/contact/view")
    }
    return(
        <Col md={6} className="my-2">
            <Card>
                <CardHeader className="text-secondary text-center">
                    <Row>
                        <Col xl={6}>Created on: {contact.create}</Col>
                        <Col xl={6}>Updated on: {contact.update}</Col>
                    </Row>
                </CardHeader>
                <CardBody  onClick={handleViewContact}>
                    <Row>
                        <Col md={4} className="Center">
                            <img width={115} height={120} className="border rounded-circle border-2 border-warning" src={contact.avatar} alt="avatar"/>
                        </Col>
                        <Col md={8} className="p-1">
                            <CardTitle className="text-uppercase text-warning fs-5 text-center" >{contact.name}</CardTitle>
                            <CardTitle className="text-secondary fs-05 text-center">
                                {contact.gender}<br/>
                                {contact.phoneNumber}<br/>
                                {contact.email}<br/>
                                {contact.address}
                            </CardTitle>
                        </Col>
                    </Row>
                </CardBody>
                <CardFooter className="d-flex justify-content-around fs-5 py-0">
                    <div className="pb-1 px-1" onClick={handleStar}>
                        {contact.star?
                        (
                            <AiFillStar className="text-warning" />
                        )
                        :
                        (
                            <AiOutlineStar className="text-warning" />
                        )}
                    </div>
                    <div className="pb-1 px-1" onClick={handleActive}>
                        {
                        contact.active?
                        (
                            <IoCheckmarkDoneSharp className="text-success"/>
                        )
                        :
                        (
                            <IoCheckmarkSharp className="text-danger" />
                        )}
                    </div>
                    <div className="pb-1 px-1" onClick={handleEdit}>
                        <FaPenNib className="text-primary"/>
                    </div>
                    <div className="pb-1 px-1" onClick={handleDelete}>
                        <ImBin className="text-danger"/>
                    </div>
                </CardFooter>
            </Card>
        </Col>
    )
}

export default ContactListItem