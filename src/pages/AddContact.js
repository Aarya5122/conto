import React, { useContext, useEffect, useState } from "react"

import { Navigate, useNavigate } from "react-router-dom"

import { readAndCompressImage } from "browser-image-resizer"
import imageConfig from "../utils/imageConfig"

import { deleteObject, getDownloadURL, getStorage, ref as refS, uploadBytesResumable } from "firebase/storage"
import { getDatabase, ref as refD, set } from "firebase/database"

import { v4 } from "uuid"

import UserContext from "../context/userContext/userContext"
import ContactContext from "../context/contactContext/contactContext"
import { UPDATE_CONTACT } from "../context/contactContext/action.types"

import { toast } from "react-toastify"

import { Col, Container, Form, FormGroup, Input, Label, Row, Button, Spinner } from "reactstrap"

import date from "date-and-time"

import { ImBin } from "react-icons/im"

const Avatar = "https://firebasestorage.googleapis.com/v0/b/githubprojecttwo.appspot.com/o/contacts%2Fprofile.jpeg?alt=media&token=1d6063aa-c4bb-4b64-92d0-7941bce27a9a"

const AddContact = () => {

    const { user } = useContext(UserContext)
    const { contactState, dispatch } = useContext(ContactContext)

    const navigate = useNavigate()

    const [ name, setName ] = useState("")
    const [ gender, setGender ] = useState("Male")
    const [ email, setEmail ] = useState("")
    const [ phoneNumber, setPhoneNumber ] = useState("")
    const [ address, setAddress ] = useState("")
    const [ star, setStar ] = useState(false)
    const [ active, setActive ] = useState(false)
    const [ create, setCreate ] = useState(date.format(new Date(), 'DD-MM-YYYY'))
    const [ update, setUpdate ] = useState(date.format(new Date(), 'DD-MM-YYYY'))
    const [ isUpdate, setIsUpdate ] = useState(false)
    const [ isUploading, setIsUploading ] = useState(false)
    const [ downloadUrl, setDownloadUrl ] = useState(Avatar)
    const [ displayId, setDisplayId ] = useState(null)

    /** UseEffect:
     *  It checks if contactToUpdate (UPDATE_CONTACT) was 
     *  dispatched in ContactListItem. If it was dispatched and 
     *  contactToUpdate was set with a truthy value all those values of 
     *  that truthy value will be set to states (name, email, star, active
     *  create, phone number, location, avatar/download url, gender, 
     *  display id) above and set isupdate to true and update with 
     *  that days date.
     *
     *  If falsy value is set in dispatch then it does nothing. 
     *
     *  Here we also pass contactToUpdate as dependency to this useEffect.
    */
    useEffect(
        ()=>{
            if(contactState.contactToUpdate){ 
                setName(contactState.contactToUpdate.name) 
                setGender(contactState.contactToUpdate.gender) 
                setEmail(contactState.contactToUpdate.email) 
                setPhoneNumber(contactState.contactToUpdate.phoneNumber) 
                setAddress(contactState.contactToUpdate.address) 
                setStar(contactState.contactToUpdate.star) 
                setActive(contactState.contactToUpdate.active) 
                setDownloadUrl(contactState.contactToUpdate.avatar)
                setDisplayId(contactState.contactToUpdate.displayId)
                setCreate(contactState.contactToUpdate.create)
                setUpdate(date.format(new Date(), 'DD-MM-YYYY'))

                setIsUpdate(true)
            }
        },[contactState.contactToUpdate]
    )

    /** handleReUploadImage: 
     *  This function checks if download url of the contact is not equal
     *  default avatar and if it's true set the download url with default
     *  avatar and delete the previous picture from storage and also set 
     *  the display id of that contact as null.
    */
    const handleReuploadImage = () => {
        if(downloadUrl !== Avatar){
            setDownloadUrl(Avatar)
            const storage = getStorage()
            const storageRef = refS(storage, `contacts/${user.uid}/${displayId}`)
            setDisplayId(null)
            deleteObject(storageRef)
            .then(console.log("Re-Updated to avatar"))
            .catch(err => {
                console.error("Error in handle delete re-upload: "+err);
                toast("Error in handle delete re-upload", {type: "error"})
            })
        }
    }

    /** imagePicker:
     *  With the help of event we fetch the file from device and resize
     *  it with browser-image-resizer by passing image configuration and
     *  create the metadata of the image and create a unique id for the
     *  image using UUID and with the help of id create a reference. 
     *  Now store the image in firebase storage by passing the compressed
     *  image, metadata and reference. while storing the image is uploading
     *  is set to true and on successful storage we will fetch and set the 
     *  download url of the contact.
    */
    const imagePicker = async(e) => {
        try{
            const file = e.target.files[0]
            const replaced = await readAndCompressImage(file, imageConfig)
            const metadata = { contentType: file.type }
            const storage = getStorage()
            const id = v4()
            const storageRef = refS(storage, `contacts/${user.uid}/${id}`)
            setDisplayId(id)
            const uploadImage = uploadBytesResumable(storageRef, replaced, metadata)
            uploadImage.on(
                'state_changed',
                (snapshot)=>{
                    setIsUploading(true)
                    const progress = (snapshot.bytesTransferred/snapshot.totalBytes)*100
                    switch(snapshot.state){
                        case 'paused':
                            setIsUploading(false)
                            toast("Paused", {type:"warning"})
                            console.log("Paused");
                            break
                        case 'running':
                            console.log("uploading");
                            break
                        default:
                            toast("Other Issues", {type:"error"})
                            console.log("Others");
                    }
                    if(progress === 100){
                        setIsUploading(false)
                        toast("Uploaded", {type:"success"})
                    }
                },
                err => {
                    console.error("error inside imagepicker i.e snapshot:" + err );
                    toast("Error in snapshot", {type:"error"})
                },
                ()=>{
                    getDownloadURL(uploadImage.snapshot.ref)
                    .then(downloadURL => setDownloadUrl(downloadURL))
                    .catch(err=>{
                        console.error("Error in downloadURL: "+err)
                        toast("Error in getting download url", {type:"error"})
                    })
                }
            )
        } catch(err){
            console.error("Error in imagepicker: "+err);
            toast("Reupload Failed", {type:"error"})

        }
    }

    /** handleAddOrUpdate: here we create a new reference using UUID or 
     *  fetch the contact reference using contact key based on is update
     *  state and set the values of the contact accordingly.
    */
    const handleAddOrUpdate = () => {
        try{
            const database = getDatabase()
            const databaseRef = refD(database, `contacts/${user.uid}/${isUpdate?contactState.contactToUpdateKey:v4()}`)
            set(databaseRef,{
                name,
                gender,
                email,
                phoneNumber,
                address,
                star,
                active,
                avatar: downloadUrl,
                create,
                update,
                displayId
            })
        } catch(err){
            console.error(`Error while ${isUpdate?"updating":"adding"} data: `+err);
            toast(`Error ${isUpdate?"updating":"adding"} data: `, {type:"error"})
        }
    }

    /** handleSubmit: This function prevents the default submission of
     * form using event (e) parameter and calls handleAddOrUpdate function
     *  and dispatch is hit to set the contactToUpdate as null because 
     *  BUG: if click on back button after submitting the form it shouldnt 
     *  show which contact was updated previously. hence we call a dispatch
     *  for setting contactToUpdate as null and we navigate user to 
     *  homepage. 
    */
    const handleSubmit = (e) => {
        e.preventDefault()
        handleAddOrUpdate()
        toast( `Data ${isUpdate?"Updated":"Added"} Successfully`)
        dispatch({
            type: UPDATE_CONTACT,
            payload: null,
            key: null
        })
        navigate("/")
    }

    /** If user exist (logged in) show the form else 
     * navigate user to signin page.
    */
    if(user){
        return(
            <Container fluid>
                <Row>
                    <Col md={8} xl={6} className="offset-md-2 offset-xl-3 mb-5">
                        <Form onSubmit={handleSubmit}>
                            <div className="mb-1 Center">
                                <Label for="avatar" title="Reupload" >
                                    {isUploading?
                                    (
                                        <Spinner type="grow" color="warning" />
                                    )
                                    :
                                    (
                                        <img src={downloadUrl} alt="Avatar" width={100}
                                        className="border border-warning rounded-circle border-3"/>
                                    )
                                    }
                                    <input
                                    type="file"
                                    name="avatar"
                                    id="avatar"
                                    accept="images/*"
                                    onChange={(e)=>{
                                        imagePicker(e)
                                    }}
                                    onClick={handleReuploadImage}
                                    style={{display: "none"}}
                                    />
                                </Label>
                                {
                                    (downloadUrl !== Avatar )?
                                    (
                                        <ImBin className="text-danger ms-2" onClick={handleReuploadImage}/>
                                    )
                                    :
                                    ("")
                                }
                            </div>
                            <div>
                                <FormGroup>
                                    <Input
                                    type="text"
                                    name="name"
                                    id="name"
                                    placeholder="Enter Name"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    required
                                    />
                                </FormGroup>
                                <FormGroup check className="border border-1 rounded pt-2 mb-3" >
                                    <Row className="pe-5">
                                        <Col sm={3}className="offset-sm-1">
                                            <Label className="ps-2" check for="male">
                                                <Input
                                                type="radio"
                                                name="gender"
                                                id="male"
                                                checked={(gender==="Male")?true:false}
                                                value="Male"
                                                onChange={(e)=>setGender(e.target.value)}
                                                className="me-1"
                                                /> Male
                                            </Label>
                                        </Col>
                                        <Col sm={3} className="offset-sm-1">
                                            <Label className="ps-2" check for="female">
                                                <Input
                                                type="radio"
                                                name="gender"
                                                id="female"
                                                checked={(gender==="Female")?true:false}
                                                value="Female"
                                                onChange={(e)=>setGender(e.target.value)}
                                                className="me-1"
                                                /> Female
                                            </Label>
                                        </Col>
                                        <Col sm={3} className="offset-sm-1">
                                            <Label className="ps-2" check for="others">
                                                <Input
                                                type="radio"
                                                name="gender"
                                                id="others"
                                                checked={(gender==="Others")?true:false}
                                                value="Others"
                                                onChange={(e)=>setGender(e.target.value)}
                                                className="me-1"
                                                /> Others
                                            </Label>
                                        </Col>
                                    </Row>
                                </FormGroup>
                                <FormGroup>
                                    <Input
                                    type="tel"
                                    name="phoneNumber"
                                    id="phoneNumber"
                                    placeholder="Enter Phone Number"
                                    value={phoneNumber}
                                    onChange={e => setPhoneNumber(e.target.value)}
                                    required
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Input
                                    type="email"
                                    name="email"
                                    id="email"
                                    placeholder="Enter Email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    required
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Input
                                    type="textarea"
                                    name="address"
                                    id="address"
                                    placeholder="Enter Address"
                                    value={address}
                                    onChange={e => setAddress(e.target.value)}
                                    required
                                    />
                                </FormGroup>
                                <FormGroup check className="border rounded mb-2 pt-2"> 
                                    <Row>
                                        <Col sm={1} className="offset-sm-1">
                                            <Label className="ps-2" check for="star">
                                            <Input
                                            type="checkbox"
                                            name="star"
                                            id="star"
                                            checked={star}
                                            onChange={()=>setStar(!star)}
                                            />
                                            <span>Starred</span>
                                            </Label>
                                        </Col>
                                        <Col sm={1} className="offset-sm-6">
                                            <Label className="ps-2" check for="active">
                                            <Input
                                            type="checkbox"
                                            name="active"
                                            id="active"
                                            checked={active}
                                            onChange={()=>setActive(!active)}
                                            /> Active
                                            </Label>
                                        </Col>
                                    </Row>
                                </FormGroup>
                                <Button
                                block
                                color="secondary"
                                type="submit"
                                className="text-uppercase text-white"
                                >
                                    {isUpdate? "Update ":"Add " }Contact
                                </Button>
                            </div>
                        </Form>
                    </Col>
                </Row>
            </Container>
        )
    } 

    return <Navigate replace to="/signin"/>
}

export default AddContact