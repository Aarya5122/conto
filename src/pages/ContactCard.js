import React, { useContext } from "react";

import ContactContext from "../context/contactContext/contactContext";
import UserContext from "../context/userContext/userContext";

import { Button, Card, CardBody, CardText, CardTitle, Col, Container, Row } from "reactstrap"

import { FiPhoneCall, FiMail, FiMapPin } from "react-icons/fi"

import { Navigate } from "react-router-dom"

const ContactCard = () => {

    const { user } = useContext(UserContext)
    const { contactState } = useContext(ContactContext)
    
    /** If user exist (logged in) and contact is truthy value in
     *  contact context then render the card else navigate the user to
     * signin page.
    */
    if(user && contactState.contact){
        const image = `border border-${contactState.contact.active?"success":"danger"} border-4 profile`
        const starBackground = `${contactState.contact.star?"warning":"dark"}`

        return(
            <Container fluid>
                <Row>
                    <Col md={6} className="offset-md-3 mt-3 mb-5">
                        <Card className="mt-5 text-center border border-3 border-warning">
                            <CardBody >
                                <img src={contactState.contact.avatar} alt="avatar" className={image}/>
                                <CardTitle className="text-warning fs-3">
                                    {contactState.contact.name}
                                </CardTitle>
                                <CardText className="fs-04">
                                    <span className="text-secondary">{contactState.contact.gender}</span><br/>
                                </CardText>
                                <div>
                                    <a 
                                        href={`tel:${contactState.contact.phoneNumber}`} 
                                        target="_blank" 
                                        rel="noreferrer"
                                        style={{
                                            textDecoration:"none"
                                        }}
                                    >
                                        <Button block className={`text-white fs-05 btn-lg btn-outline-${starBackground}`}>
                                            <FiPhoneCall className="pe-2 fs-4"/>{contactState.contact.phoneNumber}
                                        </Button>
                                    </a>
                                </div>
                                <div>
                                    <a 
                                        href={`mailto:${contactState.contact.email}`}
                                        target="_blank"
                                        style={{
                                            textDecoration:"none"
                                        }}
                                        rel="noreferrer"
                                    >
                                        <Button
                                        block
                                        className="text-white my-2 fs-05 btn btn-outline-dark btn-lg">
                                            <FiMail/> Mail
                                        </Button>
                                    </a>
                                    <a 
                                        href={`https://www.google.com/maps/place/${contactState.contact.address}`}
                                        target="_blank"
                                        style={{
                                            textDecoration:"none"
                                        }}
                                        rel="noreferrer"
                                    >
                                        <Button 
                                        block 
                                        className="text-white my-2 fs-05 btn btn-outline-dark btn-lg">
                                            <FiMapPin/> {contactState.contact.address}
                                        </Button>
                                    </a>
                                </div>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        )
    }

    return <Navigate replace to="/" />
}

export default ContactCard