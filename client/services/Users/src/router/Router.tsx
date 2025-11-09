import { Route, Routes} from "react-router-dom";
import { Suspense } from "react";
import UsersContainer from "@/Users/UsersContainer";

const AppUsers = () => {
    return (
        <Routes>
            <Route index element={
                <Suspense fallback={'Loading...'}>
                     <UsersContainer />
                </Suspense>
            }/>
            
            {/* <Route path="page-a" element={<PageA />} />
            <Route path="page-b" element={<PageB />} /> */}
      </Routes>
    )
}

export default AppUsers