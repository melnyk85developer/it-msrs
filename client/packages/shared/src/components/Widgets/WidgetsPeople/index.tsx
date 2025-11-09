import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import WidgetsPeopleList from "./WidgetsPeopleList";
import { useAppSelector } from "../../../components/hooks/redux";
import classes from './styles.module.scss'

const WidgetPeople: React.FC = () => {
    const {isDarkTheme} = useAppSelector(state => state.authPage)
    const { users } = useAppSelector(state => state.usersPage)

    // const pageSize = useSelector(getPageSize)
    // const filter = useSelector(getUsersFilter)
    // const currentPage = useSelector(getCurrentPage)

    // const [localStateUsers, setLocalStateUsers] = useState<UserType[]>([])

    let people = users.filter( item => {
        return item.avatar != null
    })

    // setLocalStateUsers(people)

    // console.log(users)

    // useEffect(() => {
    //     dispatch(requestUsers(currentPage, pageSize, filter))
    // }, [dispatch])
    
    return (
        <div className={`${classes.wrapPeople} ${isDarkTheme !== "light" ? classes.dark : classes.light}`}>
            <div className={classes.borderWidgets}>
            <div className={classes.wrapTitleWidgets}>
                <h4>Люди</h4>
            </div>
                <div className={classes.widgetFriends}>
                    <WidgetsPeopleList users={people.slice(0,6)} />
                </div>
            </div>
        </div>
    )
}

export default WidgetPeople;