import { Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import UserProfileContainer from "../UserProfile/UserProfileContainer";


const AppUserProfile = () => {

  return (
    <Routes>
      <Route index element={<UserProfileContainer />}/>

      {/* <Suspense fallback={'Loading...'}></Suspense> */}

      {/* <Route path="page-a" element={<PageA />} />
      <Route path="page-b" element={<PageB />} /> */}
    </Routes>
  )

}

export default AppUserProfile