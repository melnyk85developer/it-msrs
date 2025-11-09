import { useAppDispatch, useAppSelector } from '@packages/shared/src/components/hooks/redux'
import CompanionItem from '../CompanionItem'
import { useEffect } from 'react'
import { getInterlocutorAC } from '@packages/shared/src/store/MessagesReducers/messagesSlice'
import { Interlocutor } from '@packages/shared/src/types/types'
import classes from '../styles.module.scss'

export const Interlocutors = () => {
    const dispatch = useAppDispatch()
    const { isAuth, authorizedUser, isDarkTheme } = useAppSelector(state => state.authPage)
    const { interlocutors, currentChat } = useAppSelector(state => state.messagesPage)

    useEffect(() => {
        dispatch(getInterlocutorAC())
    }, [currentChat])

    return (
        <div className={
            `${classes.wrapInterlocutors}
                    ${isDarkTheme !== "light"
                ? classes.dark
                : classes.light
            }`
        }>
            <ul>
                {!interlocutors.length
                    ? <span>Вы еще не переписывались ни с кем! </span>
                    : interlocutors.map(
                        (companion: Interlocutor) => <CompanionItem
                            key={companion.userId}
                            avatar={companion.avatar}
                            name={companion.name}
                            surname={companion.surname}
                            dialogId={Number(companion.chat.dialogId)}
                            msg={companion.lastMessage}
                            // read={companion.lastMessage.read}
                        />)
                }
            </ul>
        </div>
    )
}