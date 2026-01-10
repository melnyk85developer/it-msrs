import React from "react";
import { Col, Input, Row, Tooltip } from "antd";
import TextArea from "antd/es/input/TextArea";
import classes from './styles.module.scss'

type PropsType = {
    setCreatePages: React.Dispatch<React.SetStateAction<boolean>>
    setContentHome: React.Dispatch<React.SetStateAction<string>>
    setCtaLinkHome: React.Dispatch<React.SetStateAction<string>>
    setCtaTextHome: React.Dispatch<React.SetStateAction<string>>
    setSeoDescriptionHome: React.Dispatch<React.SetStateAction<string>>
    setSubtitleHome: React.Dispatch<React.SetStateAction<string>>
    setTitleHome: React.Dispatch<React.SetStateAction<string>>
    createPageForBlog: () => void;
}

export const HomeForm: React.FC<PropsType> = React.memo(({
    setTitleHome,
    setSubtitleHome,
    setContentHome,
    setCtaTextHome,
    setCtaLinkHome,
    setSeoDescriptionHome,

    setCreatePages,
    createPageForBlog
}) => {

    return (
        <Row className={classes.row}>
            <Col span={24} className={classes.wrapCentrBlockInputAddMessage}>
                <div className={classes.formContainer}>
                    <div className={classes.inputWrapper}>
                        <label className={classes.label}>Заголовок страницы (H1)</label>
                        <Input
                            placeholder="Например: Добро пожаловать в мой блог"
                            onChange={(e) => setTitleHome(e.target.value)}
                            className={classes.input}
                        />
                    </div>

                    <div className={classes.inputWrapper}>
                        <label className={classes.label}>Подзаголовок страницы</label>
                        <Input
                            placeholder="Короткое описание блога"
                            onChange={(e) => setSubtitleHome(e.target.value)}
                            className={classes.input}
                        />
                    </div>

                    <div className={classes.inputWrapper}>
                        <label className={classes.label}>Основной контент страницы</label>
                        <TextArea
                            placeholder="Основной текст главной страницы блога"
                            rows={4}
                            onChange={(e) => setContentHome(e.target.value)}
                            className={classes.textarea}
                        />
                    </div>

                    <div className={classes.inputWrapper}>
                        <label className={classes.label}>Текст кнопки (CTA)</label>
                        <Input
                            placeholder="Например: Читать блог"
                            onChange={(e) => setCtaTextHome(e.target.value)}
                            className={classes.input}
                        />
                    </div>

                    <div className={classes.inputWrapper}>
                        <label className={classes.label}>Ссылка кнопки (CTA URL)</label>
                        <Input
                            placeholder="https://example.com/posts"
                            onChange={(e) => setCtaLinkHome(e.target.value)}
                            className={classes.input}
                        />
                    </div>

                    <div className={classes.inputWrapper}>
                        <label className={classes.label}>SEO-описание страницы</label>
                        <TextArea
                            placeholder="Краткое описание страницы для поисковых систем (до ~160 символов)"
                            rows={2}
                            onChange={(e) => setSeoDescriptionHome(e.target.value)}
                            className={classes.textarea}
                        />
                    </div>
                </div>
            </Col>
        </Row>
    )
})