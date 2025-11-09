import React from 'react'
import classes from './styles.module.scss';
import { Button } from 'antd';

type PropsType = {
    error: string
    setReloadProfile: any
    setModalActiveError: any
}

const ErrorsContent: React.FC<PropsType> = React.memo(({ error, setReloadProfile, setModalActiveError }) => {
    const okReload = () => {
        setReloadProfile(true)
        setModalActiveError(false)
    }

    return (
        <div className={classes.wrapErrorContent}>
            <h2>{error}</h2>
            <Button className={classes.button} onClick={() => okReload()}>Понятно</Button>
        </div>
    )
})
export default ErrorsContent
