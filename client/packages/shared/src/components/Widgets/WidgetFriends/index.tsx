import React, { useEffect } from "react";
import WidgetFriendsList from "./WidgetFriendsList"
import Preloader from "../../Priloader";
import { IUser } from "@/types/IUser";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import classes from './styles.module.scss'
import { getUsersAC } from "../../../store/UsersReducers/usersSlice";

const WidgetFriends: React.FC = () => {
    const dispatch = useAppDispatch()
    const {isDarkTheme} = useAppSelector(state => state.authPage)
    const { users } = useAppSelector(state => state.usersPage)

    let friends = users
    // const [localStateMyFriends, setLocalStateMyFriends] = useState<UserType[]>([])
    let resultRendomFriends: IUser[] = []

    useEffect(() => {
        dispatch(getUsersAC())
    }, []);

    // useEffect(() => {
    //     // setTimeout(function run() {
    //     //     setLocalStateMyFriends(resultRendomFriends)
    //     // setTimeout(run, 10000);
    //     // }, 10000);
    // }, [resultRendomFriends])

    // for(let i = 0; i < 6; i++){resultRendomFriends.push(myFriends[Math.floor(Math.random() * myFriends.length)])}

    const randomFriends = (min: number, max: number, num: number, friends: IUser[]) => {
        let myFriends: IUser[] = friends
        resultRendomFriends = []

        let i, arr = [], res = [];
        for (i = min; i <= max; i++ ) arr.push(i);
    
        // for (i = 0; i < num; i++) res.push(arr.splice(Math.floor(Math.random() * (arr.length -1)), 1)[0])

        for (i = min; i < num; i++) {
            res.push(arr.splice(Math.ceil(Math.random() * (arr.length)), 1)[0])
            let a = res[i]

            if(myFriends[a] !== undefined){
                resultRendomFriends.push(myFriends[a])
            }
        }
        // setLocalStateMyFriends(resultRendomFriends)
        return resultRendomFriends
    }

    // setLocalStateMyFriends(randomFriends(0, friends.length -1, 10, friends))
    resultRendomFriends = randomFriends(0, friends.length -1, 10, friends)

    // const resultRendom = () => {
    //     return resultRendomFriends = randomFriends(0, localStateMyFriends.length, 10, friends)
    // }

    // =====

    // useEffect(() => {
    //     setInterval( () => {
    //         setLocalStateMyFriends(resultRendomFriends = randomFriends(0, friends.length -1, 10, friends))
    //     }, 4000);
    
    // }, [localStateMyFriends])

    // const resultRendom = () => {
    //     return resultRendomFriends = randomFriends(0, localStateMyFriends.length, 10)
    // }

    // setInterval(resultRendom, 4000);
    // randomFriends(0, localStateMyFriends.length, 10)
        
    // console.log(resultRendomFriends)
    
    // setTimeout(function run() {
    //     resultRendomFriends = randomFriends(0, localStateMyFriends.length, 10)
    // setTimeout(run, 10000);
    // }, 10000);

    return (
        <div className={`${classes.borderWidgets} ${isDarkTheme !== "light" ? classes.dark : classes.light}`}>
            <div className={classes.wrapTitleWidgets}>
                <h4>Друзья</h4>
            </div>
            <div className={classes.widgetFriends}>
                {
                    resultRendomFriends
                    ? <WidgetFriendsList friends={resultRendomFriends.slice(0,6)}/>
                    : <Preloader />
                }
            </div>
        </div>
    )
    // friends={friends.slice(0,6)}
    // setInterval(setResult, 4000);
}
export default WidgetFriends;
