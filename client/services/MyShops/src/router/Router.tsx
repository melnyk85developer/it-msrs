import MyShopsContainer from "@/Shop/myShopsContainer"
import { Suspense } from "react"
import { Routes, Route } from "react-router-dom"


const AppMyShops = () => {

    return (
      <Routes>
        <Route element={
          <Suspense fallback={'Loading...'}>
            <MyShopsContainer />
          </Suspense>
        }/>
        
        {/* <Route path="page-a" element={<PageA />} />
        <Route path="page-b" element={<PageB />} /> */}
      </Routes>
    )
  
  }
  
  export default AppMyShops