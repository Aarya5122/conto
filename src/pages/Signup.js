import React, { useContext, useState } from "react"

import {
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Col,
    Container,
    Form,
    FormGroup,
    Input,
    Label,
    Row
} from "reactstrap"

import UserContext from "../context/userContext/userContext"

import { getAuth, createUserWithEmailAndPassword } from "firebase/auth"

import { toast } from "react-toastify"

import { Navigate } from "react-router-dom"

import { ImLinkedin } from "react-icons/im"
import { AiFillGithub } from "react-icons/ai"

const Signup = () => {

    const { user, setUser } = useContext(UserContext)

    const [ email, setEmail ] = useState("")
    const [ password, setPassword ] = useState("")

    /** handleFirebase: This function creates a new user credentials and
     * stores it database and also stores the user details in user state
     * which was passed as parameters from user context. 
     */
    const handleFirebase = () => {
        const auth = getAuth()
        createUserWithEmailAndPassword(auth, email, password)
        .then( res => {
            setUser({
                email: res.user.email,
                uid: res.user.uid
            })
        })
        .catch(err => {
            console.error(err);
            toast(err.message, {type: "error"})
        })
    }

    /** handleSubmit: This function prevents the default submission of
     * form using event (e) and calls the function handle firebase.
     */
    const handleSubmit = (e) => {
        e.preventDefault();
        handleFirebase()
    }

    /** If user exist (logged in) it navigates to homepage or renders
     * the signup form.
     */
    if(user){
        return <Navigate replace to="/" /> 
    } else{
        return (
            <Container fluid>
                <Row>
                    <Col md={6} className="offset-md-3">
                        <Card>
                            <Form onSubmit={handleSubmit}>
                                <CardHeader className=" text-center text-warning text-uppercase">
                                    Conto Signup
                                </CardHeader>
                                <CardBody>
                                    <FormGroup row>
                                        <Label for="email" md={4}>Email</Label>
                                        <Col md={8}>
                                            <Input 
                                            type="email"
                                            id="email"
                                            name="email"
                                            placeholder="Enter email"
                                            value={email}
                                            onChange={e => setEmail(e.target.value)}
                                            />
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Label for="password" md={4}>
                                            Password
                                        </Label>
                                        <Col md={8}>
                                            <Input
                                            type="password"
                                            id="password"
                                            name="password"
                                            placeholder="Enter password"
                                            value={password}
                                            onChange={(e)=>setPassword(e.target.value)}
                                            />
                                        </Col>
                                    </FormGroup>
                                </CardBody>
                                <CardFooter>
                                    <Button 
                                    block
                                    color="warning" 
                                    className="text-white text-uppercase"
                                    type="submit">
                                        Signup
                                    </Button>
                                </CardFooter>
                            </Form>
                        </Card>
                    </Col>
                    <Col md={6} className="text-center text-warning mt-2 mb-5 offset-md-3 ">
                        <p>Save details of your network!
                        <br/>Conto - connects to your attached one's</p>
                        <span className="text-secondary">Let's Connect </span><br/>
                        <a href="https://www.linkedin.com/in/aarya-nanndaann-singh-m-n-800226191/"  rel="noreferrer" target="_blank">
                            <ImLinkedin className="text-primary fs-4 mx-1"/>
                        </a>
                        <a href="https://github.com/Aarya5122" target="_blank" rel="noreferrer">
                            <AiFillGithub className="text-dark fs-4 mx-2"/>
                        </a>
                </Col>
                </Row>
            </Container>
        )
    }
    
}

export default Signup