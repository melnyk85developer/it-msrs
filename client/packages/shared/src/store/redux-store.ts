import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userProfileSlice from "./UserProfileReducers/userProfileSlice";
import usersSlice  from "./UsersReducers/usersSlice";
import authSlice from "./AuthReducers/authSlice";
import myProfileSlice from "./MyProfileReducers/myProfileSlice";
import myShopsSlice from "./MyShopsReducers/myShopsSlice";
import pageElementsSlice from "./PageElementsSlice/pageElementsSlice";
import playlistSlice from "./MusicReducers/playlistSlice";
import playerSlice from "./MusicReducers/playerSlice";
import trackSlice from "./MusicReducers/trackSlice";
import myAdminSlice from "./MyAdminReducers/myAdminSlice";
import messagesSlice from "./MessagesReducers/messagesSlice";
import settingMyProfileSlice  from "./SettingsMyProfileReducers/settingsMyProfileSlice";

// Корневой редюсер
const rootReducer = combineReducers({
    adminPage: myAdminSlice,
    usersPage: usersSlice,
    authPage: authSlice,
    myProfilePage: myProfileSlice,
    messagesPage: messagesSlice,
    settingMyProfilePage: settingMyProfileSlice,
    myShopsPage: myShopsSlice,
    userProfilePage: userProfileSlice,
    page_elements: pageElementsSlice,
    playlist: playlistSlice,
    player: playerSlice,
    track: trackSlice
});

export const setupStore = () => {
    return configureStore({
        reducer: rootReducer
    })
}

export type RootState = ReturnType<typeof rootReducer>
export type AppStore = ReturnType<typeof setupStore>
export type AppDispatch = AppStore['dispatch']