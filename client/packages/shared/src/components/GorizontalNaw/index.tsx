import { Col, Row } from "antd";
import React from "react";
import { useAppSelector } from "../hooks/redux";
import classes from './styles.module.scss'

type PropsType = {
    children?: React.ReactNode[]
    item?: React.ReactNode[]
}


const GorizontalNaw: React.FC<PropsType> = ({children}) => {
    const {isDarkTheme} = useAppSelector(state => state.authPage)
    
    return (
        <Row gutter={0}>
            <Col span={22} className={`${classes.wrapper_nav} ${isDarkTheme !== "light" ? classes.dark : classes.light}`} style={{ padding: 0}}>
                <div className={classes.top_menu}>
                    <div className={classes.content_top_menu}>
                        {children}
                    </div>
                </div>
            </Col>
        </Row>
    )
}

export default GorizontalNaw;