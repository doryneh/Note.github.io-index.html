import React from "react";

const Alert = (props) => {
    return (
        <div className="alert-container">
            <ul>
                {props.validationMessage.map((message,index) => <li key={index}>{message}</li>)}
            </ul>
        </div>
    )
}

export default Alert;