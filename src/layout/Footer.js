import React from "react";

import { Container } from "reactstrap"

import { ImLinkedin } from "react-icons/im"
import { AiFillGithub } from "react-icons/ai"

const Footer = () => {
    return (
    <Container fluid className="mt-5 text-uppercase bg-warning text-white p-1 pb-2 text-center fixed-bottom d-flex justify-content-between align-items-center">
        <div className="ps-3">&copy; Conto 2022</div>
        <div className="pe-3">
            <a href="https://www.linkedin.com/in/aarya-nanndaann-singh-m-n-800226191/"  rel="noreferrer" target="_blank">
                <ImLinkedin className="text-secondary fs-05 ms-2 me-1"/>
            </a>
            <a href="https://github.com/Aarya5122" target="_blank" rel="noreferrer">
                <AiFillGithub className="text-secondary fs-05 mx-1"/>
            </a>
        </div>
    </Container>)
}

export default Footer;