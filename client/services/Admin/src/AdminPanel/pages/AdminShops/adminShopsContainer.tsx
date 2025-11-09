import React, { useEffect, useState } from "react"
import AdminShops from "./adminShops";
import routeMain from './routes'
import classes from './styles.module.scss';

const AdminShopsContainer: React.FC = React.memo(() => {
    return (<AdminShops />)
})
export {routeMain};
export default AdminShopsContainer