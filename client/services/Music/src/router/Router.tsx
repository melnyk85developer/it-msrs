import { Route, Routes} from "react-router-dom";
import { Suspense } from "react";
import MusicContainer from "@/Music/MusicContainer";

const AppUsers = () => {
    return (
        <Routes>
            <Route index element={
                <Suspense fallback={'Loading...'}>
                     <MusicContainer />
                </Suspense>
            }/>
            
            {/* <Route path="page-a" element={<PageA />} />
            <Route path="page-b" element={<PageB />} /> */}
      </Routes>
    )
}

export default AppUsers