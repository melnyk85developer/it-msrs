import React, { useEffect } from 'react';
import { useAppSelector } from '../hooks/redux';
import { SIDEBAR_ON } from '../../store/PageElementsSlice/pageElementsSlice';
import classes from './styles.module.scss'

type PropsType = {
    children?: React.ReactNode[]
}

const LSidebar: React.FC<PropsType> = ({children}) => {
    const {isDarkTheme} = useAppSelector(state => state.authPage)
    const { Lsidebar } = useAppSelector(state => state.page_elements)
    const lSidebarNone: string | null = null

    // console.log('LSidebar: - ', LSidebar)

    return (
        <div className={
            `${classes.LshadowSidebar} 
                ${Lsidebar === SIDEBAR_ON
                    ? 
                    isDarkTheme !== "light" 
                        ? classes.dark 
                        : classes.light 
                    : classes.off}`
        }>
            <div className={
                `${classes.L_wrapper_Sidebar}
                ${Lsidebar === SIDEBAR_ON 
                ? ''
                : classes.off}`
            }>
                {children}
            </div>
        </div>
    )
}
export default LSidebar;