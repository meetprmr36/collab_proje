import React from 'react';
import { IoMdCheckmarkCircleOutline } from "react-icons/io";

const Action = (props) => {
    return (
        <div className="Action">
            {props.in !== "Missing" && props.out !== "Missing"
                ? <span className="MarkBtn"><IoMdCheckmarkCircleOutline /></span>
                : <button className="EditBtn">Edit</button>
            }
        </div>
    )
}
export default Action;