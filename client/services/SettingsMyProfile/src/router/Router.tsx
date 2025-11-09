import { Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import SettingMyProfileContainer from "../SettingsMyProfile/settingProfileContainer";
import SecurityProfileContainer, { routeMain as routeSecurity } from "../SettingsMyProfile/SucurityProfile/securityProfile";
import SettingMyProfile from "../SettingsMyProfile/SettingsProfile";

const AppSettings = () => {
  return (
    <Routes>
      <Route path="/" element={<SettingMyProfileContainer/>}>
          <Route index element={
            <Suspense fallback="Loading...">
              <SettingMyProfile />
            </Suspense>
          }/>
          <Route path={routeSecurity()} element={
            <Suspense fallback={'Loading...'}>
              <SecurityProfileContainer />
            </Suspense>
          }/>
      </Route>
    </Routes>
  )
}
export default AppSettings