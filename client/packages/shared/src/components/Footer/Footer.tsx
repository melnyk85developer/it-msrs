import React from "react";
import { Col, Row } from "antd";
import { useAppSelector } from "../hooks/redux";
import classes from './styles.module.scss'
import { FOOTER_ON } from "../../store/PageElementsSlice/pageElementsSlice";

type PropsType = {
    children?: React.ReactNode[]
}

const Footer: React.FC<PropsType> = ({ children }) => {
    const {isDarkTheme} = useAppSelector(state => state.authPage);
    const { FooterState } = useAppSelector(state => state.page_elements);

    return (
        <div className={`${classes.wrapper_footer} 
            ${FooterState === FOOTER_ON
                ? isDarkTheme !== "light" 
                    ? classes.dark 
                    : classes.light 
                : classes.off}`
            }>
            
            <Row className={`${classes.footer}`}>
                <Col span={24} className={classes.image_footer}>
                    <div className={classes.wrapper_sections_footer}>
                        {children}
                    </div>
                </Col>
            </Row>
            <Col className={`${classes.niz_footera}`}>	
                <p>Сайт работает на: <a href="/">NK_CMS</a> Все права защищены!</p>
            </Col>
        </div>
    )
}
export default Footer;