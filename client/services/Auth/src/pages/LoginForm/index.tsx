import React, { useEffect } from "react";
import { loginAC } from "@packages/shared/src//store/AuthReducers/authSlice";
import { useAppDispatch, useAppSelector } from '@packages/shared/src/components/hooks/redux';
import { Button, Checkbox, Col, Form, Input } from "antd";
import { NavLink, Navigate, Outlet } from "react-router-dom";
import { routeMain as routeRegistration }  from '../Registration'
import { routeMain as routeRessedPassword }  from '../ResetPassword/sendMessagePage/sendMessageResetPassword'
import { LoginOutlined, LogoutOutlined, MoonOutlined, SunOutlined } from "@ant-design/icons";
import classes from './styles.module.scss'

type FieldType = {
    username?: string;
    password?: string;
    remember?: string;
};

const LoginForm: React.FC = React.memo(() => {
    const dispatch = useAppDispatch()

    const onFinish = async (values: any) => {
        let email = values.username
        let password = values.password
        dispatch(loginAC(email, password))
    }

    const onFinishFailed = (errorInfo: any) => {
        console.log('Отправить не удалось:', errorInfo);
    }

    return (
            <div className={classes.wrapLoginForm}>
                <Form
                    name="basic"
                    wrapperCol={{ span: 24 }}
                    style={{ width: '100%'}}
                    initialValues={{ remember: false }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >   
                    <h3>Введите ваш логин</h3>
                    <Form.Item<FieldType>
                        name="username"
                        rules={[{ required: true, message: 'Пожалуйста, введите свое имя пользователя!' }]}
                    >
                    <Input />
                    </Form.Item>
                    <h3>Введите ваш пароль</h3>
                    <Form.Item<FieldType>
                        name="password"
                        rules={[{ required: true, message: 'Пожалуйста, введите свой пароль!' }]}
                    >
                    <Input.Password />
                    </Form.Item>

                    <Col className={classes.wrapBottomBlockAuth}>
                        <Form.Item<FieldType>
                            name="remember"
                            valuePropName="checked"
                        >
                        <Checkbox>
                            <span>Запомнить меня</span>
                        </Checkbox>
                        </Form.Item>
                        <Form.Item wrapperCol={{ offset: 0, span: 16 }}>
                            <Button type="primary" htmlType="submit">
                                Войти
                            </Button>
                        </Form.Item>
                    </Col>
                    <div className={classes.wrapBottomBlockLoginForm}>
                        <div className={classes.noAkkauntBlock}>
                            <strong>Нет аккаунта?</strong>
                            <NavLink to={routeRegistration()}><LoginOutlined className={classes.icon}/>Быстрая Регистрация</NavLink>
                        </div>
                        <div className={classes.ressedPasswordBlock}>
                            <NavLink to={routeRessedPassword()}>Не помню пароль</NavLink>
                        </div>
                    </div>
                </Form>
            </div>
    );
});
export default LoginForm;