import React from 'react';
import { useAppSelector } from '../hooks/redux';
import { SIDEBAR_ON } from '../../store/PageElementsSlice/pageElementsSlice';
import classes from './styles.module.scss'

type PropsType = {
    children?: React.ReactNode[]
    item?: React.ReactNode[]
}

const RSidebar: React.FC<PropsType> = ({children}) => {
    const {isDarkTheme} = useAppSelector(state => state.authPage)
    const { Rsidebar } = useAppSelector(state => state.page_elements)
    // console.log('Rsidebar: - ', Rsidebar)

    return (
        <div className={
            `${classes.RshadowSidebar} 
                ${Rsidebar === SIDEBAR_ON
                ? 
                isDarkTheme !== "light" 
                    ? classes.dark 
                    : classes.light 
                : classes.off}`
            }>
            <div className={
                `${classes.R_wrapper_Sidebar}
                    ${Rsidebar === SIDEBAR_ON 
                    ? ''
                    : classes.off}`
            }>
                {children}
            </div>
        </div>
    )
}
export default RSidebar;