import React, { useContext, useState, Fragment } from "react";

import { Collapse, NavItem, Nav, Navbar, NavbarBrand, NavbarToggler, NavLink } from "reactstrap"

import { Link } from "react-router-dom"

import UserContext from "../context/userContext/userContext";

import { FaUser } from "react-icons/fa"

const Header = () => {

    const { user, setUser } = useContext(UserContext)
    const [ isOpen, setIsOpen ] = useState(false)

    /** toggle: This function convers the value of isOpen and store it
     * to isOpen state. It is used for NavbarToggler.
     */
    const toggle = () => {
        setIsOpen(!isOpen)
    }

    return(
        <Navbar color="warning" light expand="md" className="mb-3">
                <NavbarBrand tag={Link} to="/" className="text-white">
                    Conto
                </NavbarBrand>
                <NavbarToggler onClick={toggle}/>
                <Collapse navbar isOpen={isOpen}>
                    <Nav className="ms-auto" navbar>
                        { user ?
                        (
                            <Fragment>
                                <Fragment>
                                    <NavItem>
                                        <NavLink className="text-white"
                                        style={{cursor: "pointer"}}>
                                            <FaUser className="pe-1 text-white"/>
                                            {user.email}
                                        </NavLink>
                                    </NavItem>
                                </Fragment>
                                <Fragment>
                                    <NavItem>
                                        <NavLink onClick={()=>(
                                            setUser(null)
                                        )}  className=" text-white"
                                        style={{cursor: "pointer"}}
                                        >Logout</NavLink>
                                    </NavItem>
                                </Fragment>
                            </Fragment>
                        )
                        :
                        (<Fragment>
                            <NavItem>
                                <NavLink tag={Link} to="/signin"  className=" text-white">
                                    Signin
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink tag={Link} to="/signup"  className=" text-white">
                                    Signup
                                </NavLink>
                            </NavItem>
                        </Fragment>)
                        }
                    </Nav>
                </Collapse>
        </Navbar>
    )

}

export default Header;