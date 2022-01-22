import React, { Fragment } from "react";
import { MdDoNotDisturbAlt } from "react-icons/md"

const PageNotFound = () => {
    return(
        <Fragment>
            <h1 className=" text-center text-warning fs-1"><MdDoNotDisturbAlt/> 404 Page Not Found</h1>
        </Fragment>
    )
}

export default PageNotFound