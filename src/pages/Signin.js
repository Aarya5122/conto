import React, { useContext, useState } from "react";

import { Navigate } from "react-router-dom";

import { Button, Card, CardBody, CardFooter, CardHeader, Col, Container, Form, FormGroup, Row, Label, Input } from "reactstrap";

import UserContext from "../context/userContext/userContext";

import { getAuth, signInWithEmailAndPassword } from "firebase/auth"
import { toast } from "react-toastify";

import { ImLinkedin } from "react-icons/im"
import { AiFillGithub } from "react-icons/ai"

const Signin = () => {

    const { user, setUser } = useContext(UserContext)

    const [ email, setEmail ]  = useState("")
    const [ password, setPassword ] = useState("")

    /** handleFirebase: This function will signin the user with the help
     * of firebase authentication and set the user state which is passed 
     * by user context. 
     */
    const handleFirebase = () => {
        const auth = getAuth()
        signInWithEmailAndPassword(auth, email, password)
        .then(res => setUser({
            email: res.user.email,
            uid: res.user.uid
        }))
        .catch(err => {
            console.error(err);
            toast(err.message, { type:"error" })
        })
    }

    /** handleSubmit: This function wil prevent the default submission of
     * the form with the help of event (e) and handleFirebase function is 
     * called.
     */
    const handleSubmit = (e) => {
        e.preventDefault()
        handleFirebase()
    }

    /** If user exist (logged in) it navigates them to main page else
     * render the signin page.
     */
    if(user){
        return <Navigate replace to="/" />
    } else {
        return(
            <Container fluid>
                <Row>
                    <Col md={6} className="offset-md-3">
                        <Card>
                            <Form onSubmit={handleSubmit}>
                                <CardHeader className="text-warning text-uppercase text-center">
                                    Conto Signin
                                </CardHeader>
                                <CardBody>
                                    <FormGroup row>
                                        <Label for="email" md={4}>
                                            Email
                                        </Label>
                                        <Col md={8}>
                                            <Input
                                            type="email"
                                            name="email"
                                            id="email"
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
                                            name="password"
                                            id="password"
                                            placeholder="Enter password"
                                            value={password}
                                            onChange={e => setPassword(e.target.value)}
                                            />
                                        </Col>
                                    </FormGroup>
                                </CardBody>
                                <CardFooter>
                                    <Button
                                    className="text-white"
                                    block
                                    color="warning"
                                    type="submit"
                                    >
                                        Signin
                                    </Button>
                                </CardFooter>
                            </Form>
                        </Card>
                    </Col>
                </Row>
                <Col md={6} className="text-center text-warning mt-2 mb-5 offset-md-3 ">
                    <p>Save details of your network!
                    <br/>Conto - connects to your attached one's</p>
                    <span className="text-secondary">Let's Connect</span><br/>
                    <a href="https://www.linkedin.com/in/aarya-nanndaann-singh-m-n-800226191/"  rel="noreferrer" target="_blank">
                        <ImLinkedin className="text-primary fs-4 mx-1"/>
                    </a>
                    <a href="https://github.com/Aarya5122" target="_blank" rel="noreferrer">
                        <AiFillGithub className="text-dark fs-4 mx-2"/>
                    </a>
                </Col>
            </Container>
        )    
    }

}

export default Signin