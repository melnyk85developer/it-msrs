import React, { useState } from "react";
import { Col, Input, Row, Tooltip } from "antd";
import { BsEmojiSmile, BsEmojiSmileFill } from "react-icons/bs";
import { IoCloseOutline, IoCloseSharp } from "react-icons/io5";
import classes from './styles.module.scss'
import TextArea from "antd/es/input/TextArea";
import { HomeForm } from "./addFormHomePage";
import { AboutForm } from "./addFormAboutPage";

type PropsType = {
    setCreatePages: React.Dispatch<React.SetStateAction<boolean>>
    setContentHome: React.Dispatch<React.SetStateAction<string>>
    setCtaLinkHome: React.Dispatch<React.SetStateAction<string>>
    setCtaTextHome: React.Dispatch<React.SetStateAction<string>>
    setSeoDescriptionHome: React.Dispatch<React.SetStateAction<string>>
    setSubtitleHome: React.Dispatch<React.SetStateAction<string>>
    setTitleHome: React.Dispatch<React.SetStateAction<string>>

    setTitleAbout: React.Dispatch<React.SetStateAction<string>>
    setSubtitleAbout: React.Dispatch<React.SetStateAction<string>>
    setContentAbout: React.Dispatch<React.SetStateAction<string>>
    setMissionAbout: React.Dispatch<React.SetStateAction<string>>
    setSeoDescriptionAbout: React.Dispatch<React.SetStateAction<string>>

    createPageForBlog: () => void;
}

type Tab = 'home' | 'about';

const AddPagesForBlogFormModal: React.FC<PropsType> = React.memo(({
    setCreatePages,
    setContentHome,
    setCtaLinkHome,
    setCtaTextHome,
    setSeoDescriptionHome,
    setSubtitleHome,
    setTitleHome,
    createPageForBlog,

    setTitleAbout,
    setSubtitleAbout,
    setContentAbout,
    setMissionAbout,
    setSeoDescriptionAbout
}) => {
    const [tab, setTab] = useState<Tab>('home');
    const closeModal = () => {
        setCreatePages(false)
    }
    return (
        <Row className={classes.row}>
            <Col span={24} className={classes.headerBlockUpdateMsgModal}>
                <span className={classes.title}>Создать Cтраницу для Блога</span>
                <span className={classes.topIconWrapper}>
                    <IoCloseOutline
                        className={`${classes.topIcon} ${classes.topIconNormal}`}
                        onClick={closeModal}
                    />
                    <IoCloseSharp
                        className={`${classes.topIcon} ${classes.topIconHover}`}
                        onClick={closeModal}
                    />
                </span>
            </Col>
            <Col span={24} className={classes.wrapCentrBlockInputAddMessage}>
                <span className={classes.title}>
                    Во вкладках ниже выберите тип страницы которую Вы хотите создать.
                </span>
                <div className={classes.tabsModalAddPages}>
                    <div className={classes.wrapButtonTab}>
                        <div className={classes.buttonTabModal} onClick={() => setTab('home')}><p>Home</p></div>
                        <div className={classes.buttonTabModal} onClick={() => setTab('about')}><p>About</p></div>
                    </div>
                    {tab === 'home' && <HomeForm
                        setCreatePages={setCreatePages}
                        createPageForBlog={createPageForBlog}
                        setContentHome={setContentHome}
                        setCtaLinkHome={setCtaLinkHome}
                        setCtaTextHome={setCtaTextHome}
                        setSeoDescriptionHome={setSeoDescriptionHome}
                        setSubtitleHome={setSubtitleHome}
                        setTitleHome={setTitleHome}
                    />}
                    {tab === 'about' && <AboutForm
                        setCreatePages={setCreatePages}
                        setTitleAbout={setTitleAbout}
                        setSubtitleAbout={setSubtitleAbout}
                        setContentAbout={setContentAbout}
                        setMissionAbout={setMissionAbout}
                        setSeoDescriptionAbout={setSeoDescriptionAbout}
                    />}
                </div>
            </Col>
            <Col span={24} className={classes.futerBlockUpdateMsgModal}>
                <div onClick={closeModal} className={classes.leftBlock}>
                    <p>Отмена</p>
                </div>
                <div className={classes.centerBlock}>
                    <Tooltip destroyTooltipOnHide title="Оставить эмоцию">
                        <span className={classes.iconWrapper}>
                            <BsEmojiSmile className={`${classes.icon} ${classes.iconNormal}`} />
                            <BsEmojiSmileFill className={`${classes.icon} ${classes.iconHover}`} />
                        </span>
                    </Tooltip>
                </div>
                <div className={classes.rightBlock} onClick={() => createPageForBlog()}>
                    <p>Cоздать</p>
                </div>
            </Col>
        </Row>
    )
})
export default AddPagesForBlogFormModal;