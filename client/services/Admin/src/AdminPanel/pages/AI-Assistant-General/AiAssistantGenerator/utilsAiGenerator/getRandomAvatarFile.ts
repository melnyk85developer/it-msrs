import { fetchAvatarFile } from "@packages/shared/src/store/MyAdminReducers/myAdminSlice";
import { AppDispatch } from "@packages/shared/src/store/redux-store";

// Получение случайного файла аватара с оригинальным именем
export const getRandomAvatarFile = async (
    dispatch: AppDispatch,
    avatars: any,
    setResFile: any
): Promise<{ file: File; fileName: string }> => {
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