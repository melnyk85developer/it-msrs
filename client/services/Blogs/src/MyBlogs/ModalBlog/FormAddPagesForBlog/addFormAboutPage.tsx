import React from "react";
import { Col, Input, Row, Tooltip } from "antd";
import TextArea from "antd/es/input/TextArea";
import classes from './styles.module.scss'

type PropsType = {
    setCreatePages: React.Dispatch<React.SetStateAction<boolean>>
    setTitleAbout: React.Dispatch<React.SetStateAction<string>>
    setSubtitleAbout: React.Dispatch<React.SetStateAction<string>>
    setContentAbout: React.Dispatch<React.SetStateAction<string>>
    setMissionAbout: React.Dispatch<React.SetStateAction<string>>
    setSeoDescriptionAbout: React.Dispatch<React.SetStateAction<string>>
}

export const AboutForm: React.FC<PropsType> = React.memo(({
    setTitleAbout,
    setSubtitleAbout,
    setContentAbout,
    setMissionAbout,
    setSeoDescriptionAbout
}) => {

    return (
        <Row className={classes.row}>
            <Col span={24} className={classes.wrapCentrBlockInputAddMessage}>
                <div className={classes.formContainer}>

                    <div className={classes.inputWrapper}>
                        <label className={classes.label}>Заголовок страницы About</label>
                        <Input
                            placeholder="О нашем блоге"
                            onChange={(e) => setTitleAbout(e.target.value)}
                            className={classes.input}
                        />
                    </div>

                    <div className={classes.inputWrapper}>
                        <label className={classes.label}>Подзаголовок</label>
                        <Input
                            placeholder="Кто мы и зачем этот блог"
                            onChange={(e) => setSubtitleAbout(e.target.value)}
                            className={classes.input}
                        />
                    </div>

                    <div className={classes.inputWrapper}>
                        <label className={classes.label}>Миссия проекта</label>
                        <TextArea
                            placeholder="Наша цель, ценности и подход"
                            rows={3}
                            onChange={(e) => setMissionAbout(e.target.value)}
                            className={classes.textarea}
                        />
                    </div>

                    <div className={classes.inputWrapper}>
                        <label className={classes.label}>Основной контент страницы</label>
                        <TextArea
                            placeholder="Подробное описание блога"
                            rows={4}
                            onChange={(e) => setContentAbout(e.target.value)}
                            className={classes.textarea}
                        />
                    </div>

                    <div className={classes.inputWrapper}>
                        <label className={classes.label}>SEO-описание</label>
                        <TextArea
                            placeholder="Описание страницы для поисковых систем"
                            rows={2}
                            onChange={(e) => setSeoDescriptionAbout(e.target.value)}
                            className={classes.textarea}
                        />
                    </div>

                </div>
            </Col>
        </Row>
    )
})
