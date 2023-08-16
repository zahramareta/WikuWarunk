import React from "react";

const Middleware = ({children}) => {
    if (!localStorage.getItem('token')) {
        return window.location.href = '/login'
    }

    return children
}

export default Middleware