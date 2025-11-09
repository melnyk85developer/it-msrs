import React from "react";
import { NavLink } from "react-router-dom";
import { routeMain as routeSucurityProfile } from "../SettingsMyProfile/SucurityProfile/securityProfile";
import classes from './styles.module.scss';

const NavSettings: React.FC = () => {

    return (
        <div className={classes.wrappContentNavbarSettings}>
            <div className={classes.title_nav}>
                <h3>Настройки:</h3>
            </div>
            <ul className={classes.ul}>
                <li><NavLink to={`/settings`}>Профиль</NavLink></li>
                <li><NavLink to={`/settings/${routeSucurityProfile()}`}>Безопасность</NavLink></li>
            </ul>
        </div>
    )
}
export default NavSettings;