import React from "react";
import { UAParser } from 'ua-parser-js';
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@packages/shared/src/components/hooks/redux";
import { useAppContext } from "@packages/shared/src/components/contexts/AppContext";
import { formatLastActive } from "@packages/shared/src/components/utils/lastActiveDate";
import { routeMain as routeLogin } from "../../../../Auth/src/pages/Auth"
import { Navigate } from "react-router-dom";
import { deleteAllSessionsAC, deleteSessionAC, sessionsReceivedAC } from "@packages/shared/src/store/SettingsMyProfileReducers/settingsMyProfileSlice";
import { LogoutOutlined } from "@ant-design/icons";
import { OsIcon } from "./osIcon";
import { BrowserIcon } from "./browserIcon";
import { routeMain as routeAuth } from '../../../../Auth/src/pages/Auth';
import { ISessionsProfile } from "@packages/shared/src/types/IUser";
import routeMain from "./routes";
import classes from './styles.module.scss';

const SecurityProfileContainer: React.FC = React.memo(() => {
    const dispatch = useAppDispatch();
    const { content, setContent } = useAppContext();
    const { sessions, error } = useAppSelector(state => state.settingMyProfilePage);
    const { isAuth, authorizedUser, isDarkTheme } = useAppSelector(state => state.authPage);

    const [uaData, setUaData] = useState<UAParser.IResult | null>(null);
    const [currentBrowserName, setCurrentBrowserName] = useState<string>()
    const [currentBrowserVersion, setCurrentBrowserVersion] = useState<string>()
    const [currentOsName, setCurrentOsName] = useState<string>()
    const [currentOsVersion, setCurrentOsVersion] = useState<string>()
    const [filteredSessions, setFilteredSessions] = useState()

    useEffect(() => {
        dispatch(sessionsReceivedAC())
        const parser = new UAParser();
        const ua = parser.getResult();
        setUaData(ua);
    }, []);

    useEffect(() => {
        if (sessions.length && uaData) {
            const [currentBrowserName] = sessions.filter(item => item.browserName === uaData.browser.name);
            const [currentBrowserVersion] = sessions.filter(item => item.browserVersion === uaData.browser.version);
            const [currentOsName] = sessions.filter(item => item.osName === uaData.os.name);
            const [currentOsVersion] = sessions.filter(item => item.osVersion === uaData.os.version);

            setCurrentBrowserName(currentBrowserName && currentBrowserName.browserName !== undefined ? currentBrowserName.browserName : '');
            setCurrentBrowserVersion(currentBrowserVersion && currentBrowserVersion.browserVersion !== undefined ? currentBrowserVersion.browserVersion : '');
            setCurrentOsName(currentOsName && currentOsName.osName !== undefined ? currentOsName.osName : '');
            setCurrentOsVersion(currentOsVersion && currentOsVersion.osVersion !== undefined ? currentOsVersion.osVersion : '');
        }
    }, [sessions, uaData]);

    const finishedTheSession = (deviceId: string) => {
        dispatch(deleteSessionAC(deviceId))
    }
    const finishedAllSessions = () => {
        const [currentBrowserName] = sessions.filter(item => item.browserName === uaData.browser.name);
        console.log('currentBrowserName: - ', currentBrowserName)
        dispatch(deleteAllSessionsAC(currentBrowserName.deviceId))
    }
    return (
        <>
            {isAuth
                ?
                <div className={`${classes.wrapSecurityContainer} ${isDarkTheme !== "light" ? classes.dark : classes.light}`}>
                    <div className={classes.contentSecurity}>
                        <div className={classes.thisDevice}>
                            <h3>Это устройство</h3>
                            <div className={classes.device}>
                                <div className={classes.deviceName}>
                                    <span>
                                        OS: {' '}
                                        <OsIcon osName={currentOsName} />{' - '}{currentOsVersion}
                                        Browser: {' '}
                                        <BrowserIcon browserName={currentBrowserName} />{' v' + currentBrowserVersion}
                                    </span>
                                </div>
                            </div>
                            <h4 onClick={() => finishedAllSessions()}>
                                <LogoutOutlined className={classes.iconInputOutput} />
                                <span> Выйти из всех устройств </span>
                            </h4>
                        </div>
                        <h1>Активные сеансы</h1>
                        <div className={classes.wrapAllSessions}>
                            {sessions.length && sessions.map(item => (
                                <div key={item.deviceId} className={classes.wrapDevice}>
                                    <div className={classes.device}>
                                        <div className={classes.deviceName}>
                                            <OsIcon osName={item.osName} />
                                            {item.osVersion && item.osVersion !== 'unknown' ? ' ' + item.osVersion : ''}
                                        </div>
                                        <div className={classes.deviceName}>
                                            <BrowserIcon browserName={item.browserName} />
                                            {item.browserVersion ? ' v' + item.browserVersion : ''}
                                        </div>
                                        <div className={classes.ip}>
                                            {item.country && item.country !== 'unknown' ? <div><strong>Страна: </strong> {item.country}</div> : ''}
                                        </div>
                                        <div className={classes.ip}>
                                            {item.city && item.city !== 'unknown' ? <div><strong>Город: </strong> {item.city}</div> : ''}
                                        </div>
                                        <div className={classes.lastActiveDate}>
                                            <strong>Последняя активность: </strong>
                                            {formatLastActive(item.lastActiveDate)}
                                        </div>
                                    </div>
                                    <div className={classes.wrapExit}>
                                        <strong onClick={() => finishedTheSession(item.deviceId)}>
                                            <LogoutOutlined className={classes.iconInputOutput} />
                                            <span>Выход</span>
                                        </strong>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                :
                <Navigate to={routeAuth()} />
            }
        </>
    )
})
export { routeMain };
export default SecurityProfileContainer;