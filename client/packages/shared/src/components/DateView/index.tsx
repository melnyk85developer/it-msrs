import React from "react";
import prepareDate from "utils/prepareDate";
import "./styles.scss";

type PropsType = {
    value: string | number | Date
}

const DateView: React.FC<PropsType> = (props) => {
    const {day, month} = prepareDate(props.value)
    return (
        <p className="dateView">
            <span className="day">{day}</span> / {" "}
            <span className="month">{month}</span>
        </p>
    )
}
export default DateView;