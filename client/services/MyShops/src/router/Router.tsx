import MyShopsList from "../MyShops/myShopsList"
import MyShopsContainer from "../MyShops/myShopsContainer"
import MyShopsDetail, { routeMain as routeMyShopsDetail } from "../MyShops/MyShopsDetail"
import ShopDetailContainer from "../UserShops/AllShopDetail/ShopDetailContainer"
import UsersShopsContainer from "../UserShops/userShopsContainer"
import { Suspense } from "react"
import { Routes, Route, Navigate } from "react-router-dom"
import MerchandiseItem from "@/MyShops/MyShopsDetail/MerchandiseItem/merchandiseItem"

const AppShops = () => {

    return (
        <Routes>
            <Route path="/" element={<MyShopsContainer />} >
                <Route index element={<Navigate to="list" />} />

                <Route path="list" element={
                    <Suspense fallback={'Loading...'}>
                        <MyShopsList />
                    </Suspense>
                } />
                {/* <Route path=":myshopId" element={
                    <Suspense fallback={'Loading...'}>
                        <MyShopsDetail />
                    </Suspense>
                } /> */}
                <Route path=":myshopId">
                    <Route index element={
                        <Suspense fallback={'Loading...'}>
                            <MyShopsDetail />
                        </Suspense>
                    } />
                    <Route path=":myshopId/merchandise/:merchandiseId" element={null} />
                </Route>
                <Route path="shops">
                    <Route index element={
                        <Suspense fallback={'Loading...'}>
                            <UsersShopsContainer />
                        </Suspense>
                    } />
                    <Route path=":shopId" element={
                        <Suspense fallback={'Loading...'}>
                            <ShopDetailContainer />
                        </Suspense>
                    } />
                </Route>
            </Route>
        </Routes>
    )
}
export default AppShops