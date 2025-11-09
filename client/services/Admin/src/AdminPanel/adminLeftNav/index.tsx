import React from "react";
import { NavLink } from "react-router-dom";
import { ControlOutlined, SettingOutlined, SlidersOutlined, ToolOutlined } from "@ant-design/icons";
import classes from './styles.module.scss';

const AdminLeftNav = () => {
    return (
        <div className={classes.wrappContentNavbarSettings}>
            <div className={classes.title_nav}>
                <h3>Навигиция:</h3>
            </div>
            <ul className={classes.ul}>
                {/* <li className={classes.shahtaButton}>
                    <NavLink to="/admin" className={({ isActive }) => `${isActive ? classes.active : classes.button}`}>
                        Главная
                    </NavLink>
                </li> */}
                <li className={classes.shahtaButton}>
                    <NavLink to="/admin/bots" className={({ isActive }) => `${isActive ? classes.active : classes.button}`}>
                        Боты
                    </NavLink>
                </li>
                <li className={classes.shahtaButton}>
                    <NavLink to="/admin/adminshops" className={({ isActive }) => `${isActive ? classes.active : classes.button}`}>
                        Магазины
                    </NavLink>
                </li>
            </ul>
        </div>
    )
}
export default AdminLeftNav