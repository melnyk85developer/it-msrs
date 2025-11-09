import { Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import MyProfileContainer from "@/MyProfile/MyProfileContainer";


const AppProfile = () => {

  return (
    <Routes>
      <Route element={<MyProfileContainer />}/>
      <Suspense fallback={'Loading...'}></Suspense>
      {/* <Route path="page-a" element={<PageA />} />
      <Route path="page-b" element={<PageB />} /> */}
    </Routes>
  )

}

export default AppProfile