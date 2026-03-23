import React, { useEffect, useState } from "react"
import AdminAiAssistant from "./ai-assistant";
import { useOutletContext } from "react-router-dom";
import routeMain from './routes'
import StartMessage from "./StartMessage/startMessage";

const AdminAiAssistantContainer: React.FC = React.memo(() => {
    const { typePage, setTypePage } = useOutletContext<any>();

    useEffect(() => {
        if (typePage === 'BIG') {
            setTypePage('SMALL')
        }
    }, []);
    return (<StartMessage />)
})
export { routeMain };
export default AdminAiAssistantContainer