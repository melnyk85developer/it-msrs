import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@packages/shared/src/components/hooks/redux";
import { addPhotoMyProfileAC, addPostMyProfileAC } from "../../../../../../packages/shared/src/store/MyProfileReducers/myProfileSlice";
import { createUsersMyAdmin, deleteUserMyAdmin, fetchAvatarFile, getFtpFilesAdminAC, getUserMyAdminAC } from "@packages/shared/src/store/MyAdminReducers/myAdminSlice";
import { CheckOutlined, LoadingOutlined } from "@ant-design/icons";
import imageCompression from 'browser-image-compression';
import { IUser } from "../../../../../../packages/shared/src/types/IUser";
import classes from '../../styles.module.scss';
import routeMain from "./routes";

const BotsContainer = () => {
    const dispatch = useAppDispatch();
    const { isDarkTheme } = useAppSelector(state => state.authPage);
    const { users } = useAppSelector(state => state.usersPage);
    const { bots, bot, avatars, error } = useAppSelector(state => state.adminPage);
    const [isStart, setIsStart] = useState('');
    const [message, setMessage] = useState('');
    const [messagePosts, setMessagePosts] = useState('');
    const [messagePhotos, setMessagePhotos] = useState('');
    const [messageUsers, setMessageUsers] = useState('');
    const [progressUsersCount, setProgressUsersCount] = useState<number | null>(null);
    const [progressPhotosCount, setProgressPhotosCount] = useState<number | null>(null);
    const [progressPostsCount, setProgressPostsCount] = useState<number | null>(null);
    const [userCount, setUserCount] = useState<string>('0');
    const [postCount, setPostCount] = useState<string>('0');
    const [photoCount, setPhotoCount] = useState<string>('0');
    const [isCompletedPosts, setIsCompletedPosts] = useState(false);
    const [isCompletedPhotos, setIsCompletedPhotos] = useState(false);
    const [isCompletedUsers, setIsCompletedUsers] = useState(false);
    const [candincatPhotos, setCandincatPhotos] = useState(0);
    const [candincatPost, setCandincatPost] = useState(0);
    const [resFile, setResFile] = useState(null);

    const filterBots: IUser[] = users?.filter((b: { isBot: boolean; }) => b?.isBot === true);
    console.log('BotsContainer: - fileName: 😳 ', avatars)

    useEffect(() => {
        console.log('[BotsContainer] mount — загружаю 😡 ftpAvatars');
        dispatch(getFtpFilesAdminAC('avatars'));
    }, [dispatch]);

    const deleteUsers = async () => {
        for (let i = 0; i < users.length; i++) {
            if (users[i].isBot === true) {
                await dispatch(deleteUserMyAdmin(users[i].id));
            }
        }
        dispatch(getUserMyAdminAC());
    };

    // useEffect(() => {
    //     if (bot && bot.user) {
    //         sendPhotos(bot.user.id);
    //         sendPosts(bot.user.id);
    //     }
    // }, [bot]);

    useEffect(() => { }, [progressUsersCount, progressPhotosCount, progressPostsCount]);

    useEffect(() => {
        if ((Number(photoCount) * Number(userCount)) === candincatPhotos) {
            setMessagePhotos('Каждому пользователю добавлено фотографий: ');
            setIsCompletedPhotos(false);
        }
        if ((Number(postCount) * Number(userCount)) === candincatPost) {
            setMessagePosts('Каждому пользователю создано постов: ');
            setIsCompletedPosts(false);
        }
        if (isCompletedPhotos === false && isCompletedPosts === false && isCompletedUsers === false) {
            setUserCount('0');
            setPostCount('0');
            setPhotoCount('0');
        }
    }, [candincatPost, candincatPhotos, isCompletedPhotos, isCompletedPosts, isCompletedUsers]);

    // Получение случайного файла аватара с оригинальным именем
    const getRandomAvatarFile = async (): Promise<{ file: File; fileName: string }> => {
        if (!avatars || avatars.length === 0) {
            const defFile = new File([""], "defaultAvatar.png");
            setResFile(defFile);
            return { file: defFile, fileName: "defaultAvatar.png" };
        }

        const randomIndexFtpAvatars = Math.floor(Math.random() * avatars.files.length);
        const avatarServerFileName = avatars.files[randomIndexFtpAvatars];
        try {
            const file = await dispatch(fetchAvatarFile(avatarServerFileName, 'avatars')) as unknown as File;
            console.log('getRandomAvatarFile: - avatarServerFileName', avatarServerFileName)
            if (!file) throw new Error('File not loaded');
            setResFile(file);
            return { file, fileName: avatarServerFileName };
        } catch (e) {
            const defFile = new File([""], "defaultAvatar.png");
            setResFile(defFile);
            return { file: defFile, fileName: "defaultAvatar.png" };
        }
    };

    const autoCropImage = async (imageSrc: File, originalFileName: string): Promise<File> => {
        // console.log('autoCropImage: imageSrc, originalFileName', imageSrc, originalFileName)
        const image = new Image();
        image.src = URL.createObjectURL(imageSrc);
        // console.log('autoCropImage: image.src', image.src)
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        const cropWidth = 500;
        const cropHeight = 500;

        await new Promise<void>((resolve) => {
            image.onload = () => {
                let imgWidth = image.width;
                let imgHeight = image.height;

                canvas.width = cropWidth;
                canvas.height = cropHeight;

                const scaleX = cropWidth / imgWidth;
                const scaleY = cropHeight / imgHeight;
                const scale = Math.max(scaleX, scaleY);

                imgWidth *= scale;
                imgHeight *= scale;

                const x = (cropWidth - imgWidth) / 2;
                const y = (cropHeight - imgHeight) / 2;

                ctx!.clearRect(0, 0, canvas.width, canvas.height);
                ctx!.drawImage(image, x, y, imgWidth, imgHeight);

                resolve();
            };
        });

        return new Promise<File>((resolve) => {
            canvas.toBlob((blob) => {
                if (blob) {
                    // Создаем новый File с оригинальным именем
                    const file = new File([blob], originalFileName, { type: blob.type });
                    resolve(file);
                } else {
                    resolve(new File([""], "defaultCroppedAvatar.png"));
                }
            }, 'image/png');
        });
    };

    const sendUsers = async () => {
        setIsStart('start');
        setMessageUsers('Создается пользователь: ');
        for (let i = 0; i < Number(userCount); i++) {
            setIsCompletedUsers(true);
            setProgressUsersCount(i + 1);
            const { file, fileName } = await getRandomAvatarFile();
            console.log('BotsContainer: file, fileName', file, fileName)

            const croppedFile = await autoCropImage(file, fileName);
            console.log('BotsContainer: croppedFile', croppedFile)

            const compressedFile = await imageCompression(croppedFile, {
                maxSizeMB: 20,
                maxWidthOrHeight: 500,
                useWebWorker: true,
            });
            console.log('BotsContainer: compressedFile', compressedFile)
            // Восстанавливаем имя
            const finalFile = new File([compressedFile], fileName, { type: compressedFile.type });
            console.log('BotsContainer: finalFile', finalFile)

            const userData = {
                login: `Login${i}`,
                name: `MR ${i}`,
                surname: `ROBOT ${i}`,
                password: `qwerty${i}qwerty`,
                email: `qwerty${i}@mars.com`,
                isBot: true,
                avatar: finalFile,
            };
            console.log('BotsContainer: userData RES - ', userData)
            await dispatch(createUsersMyAdmin(userData));
        }
        setMessage('Выполнено!');
        setIsCompletedUsers(false);
        setMessageUsers('Создано пользователей: ');
    };

    // const sendPhotos = async (userId: string) => {
    //     setMessagePhotos('Создаются фотографии: ');
    //     for (let d = 0; d < Number(photoCount); d++) {
    //         setIsCompletedPhotos(true);
    //         setProgressPhotosCount(d + 1);
    //         if (userId) {
    //             const { file: photoFile, fileName } = await getRandomAvatarFile();
    //             const croppedFile = await autoCropImage(photoFile, fileName);
    //             const albumName = '';

    //             setCandincatPhotos((prev) => prev + 1);
    //             await dispatch(addPhotoMyProfileAC(userId, croppedFile, croppedFile, albumName));
    //         }
    //     }
    // };

    // const sendPosts = async (userId: string) => {
    //     setMessagePosts('Создаются посты: ');
    //     for (let b = 0; b < Number(postCount); b++) {
    //         setIsCompletedPosts(true);
    //         setProgressPostsCount(b + 1);
    //         if (userId) {
    //             const { file: postFile, fileName } = await getRandomAvatarFile();
    //             const croppedFile = await autoCropImage(postFile, fileName);
    //             const postData = {
    //                 image: croppedFile,
    //                 title: `Ячейка хакеров "Нахрен Общество" ${b} взломали мировой банк!`,
    //                 content: `Почему Мистер Робот — лучший сериал про IT-индустрию... ${b}`,
    //                 profileId: userId,
    //                 postedByUserId: userId,
    //             };
    //             setCandincatPost((prev) => prev + 1);
    //             await dispatch(addPostMyProfileAC(postData));
    //         }
    //     }
    // };

    return (
        <div className={`${classes.wrapAdminContent} ${isDarkTheme !== "light" ? classes.dark : classes.light}`}>
            <div className={classes.adminContent}>
                <h1 className={classes.title}>Генегатор ботов</h1>
                <div className={classes.content}>
                    <div className={classes.wrapCreateUsersBlock}>
                        <div className={classes.leftBlock}>
                            <h3>Введите количество пользователей:</h3>
                            <input
                                value={userCount}
                                onChange={(e) => setUserCount(e.target.value)}
                                type="number"
                                className={classes.inputUserCount}
                                placeholder="Колличество пользователей"
                            />
                        </div>
                        <div className={classes.rightBlock}>
                            <h3>{messageUsers}</h3>
                            <span>{progressUsersCount}</span>
                            <div className={classes.wrapIcon}>
                                {isStart === 'start' ? (
                                    isCompletedUsers ? (
                                        <LoadingOutlined className={classes.iconLoading} />
                                    ) : (
                                        <CheckOutlined className={classes.iconGreenCompleted} />
                                    )
                                ) : (
                                    ''
                                )}
                            </div>
                        </div>
                    </div>
                    <div className={classes.wrapCreateUsersBlock}>
                        <div className={classes.leftBlock}>
                            <h3>Введите количество постов:</h3>
                            <input
                                value={postCount}
                                onChange={(e) => setPostCount(e.target.value)}
                                type="number"
                                className={classes.inputUserCount}
                                placeholder="Колличество постов"
                            />
                        </div>
                        <div className={classes.rightBlock}>
                            {isStart === 'start' ? <h3>{messagePosts}</h3> : ''}
                            <span>{progressPostsCount}</span>
                            <div className={classes.wrapIcon}>
                                {isStart === 'start' ? (
                                    isCompletedPosts ? (
                                        <LoadingOutlined className={classes.iconLoading} />
                                    ) : (
                                        <CheckOutlined className={classes.iconGreenCompleted} />
                                    )
                                ) : (
                                    ''
                                )}
                            </div>
                        </div>
                    </div>
                    <div className={classes.wrapCreateUsersBlock}>
                        <div className={classes.leftBlock}>
                            <h3>Введите количество фотографий:</h3>
                            <input
                                value={photoCount}
                                onChange={(e) => setPhotoCount(e.target.value)}
                                type="number"
                                className={classes.inputUserCount}
                                placeholder="Колличество фото"
                            />
                        </div>
                        <div className={classes.rightBlock}>
                            {isStart === 'start' ? <h3>{messagePhotos}</h3> : ''}
                            <span>{progressPhotosCount}</span>
                            <div className={classes.wrapIcon}>
                                {isStart === 'start' ? (
                                    isCompletedPhotos ? (
                                        <LoadingOutlined className={classes.iconLoading} />
                                    ) : (
                                        <CheckOutlined className={classes.iconGreenCompleted} />
                                    )
                                ) : (
                                    ''
                                )}
                            </div>
                        </div>
                    </div>
                    <div className={classes.messageBottomBlock}>
                        <h3>
                            {isCompletedPosts === false && isCompletedPhotos === false && isCompletedUsers === false ? (
                                <strong>{message} </strong>
                            ) : (
                                ''
                            )}
                        </h3>
                    </div>
                    <h3>{'Всего ботов: '}{filterBots ? filterBots.length : 0}</h3>
                    <button onClick={sendUsers}>Start Users</button>
                    <div className={classes.wrapDeleteUsersBlock}>
                        <h2>Удалить всех ботов!</h2>
                        <button onClick={deleteUsers}>Deleted All Bots</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export { routeMain };
export default BotsContainer;
