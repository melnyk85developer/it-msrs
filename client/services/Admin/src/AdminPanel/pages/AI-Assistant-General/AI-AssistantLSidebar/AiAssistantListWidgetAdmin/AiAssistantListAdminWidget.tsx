import React, { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@packages/shared/src/components/hooks/redux'
import AiAssistantAdminItemWidget from '../AiAssistantItemWidgetAdmin/AiAssistantItemWidgetAdmin'
import { getAiAssistantInterlocutorAC } from '@packages/shared/src/store/MyAdminReducers/myAiAssistantAdminSlice'
import classes from '../../styles.module.scss'

export const AiAssistantWidgetListAdmin: React.FC = React.memo(() => {
    const dispatch = useAppDispatch()
    const { isAuth, authorizedUser, isDarkTheme } = useAppSelector(state => state.authPage)
    const { users } = useAppSelector(state => state.usersPage)
    const { interlocutors } = useAppSelector(state => state.adminAdminAiAssistantPage);

    console.log('AiAssistantWidgetListAdmin: - interlocutors', interlocutors)

    useEffect(() => {
        dispatch(getAiAssistantInterlocutorAC())
    }, [users])

    return (
        <>
            <div className={classes.titleLTopWitgetAiAssistantInterlocutors}>
                <h3>
                    Ассистенты
                </h3>
            </div>
            <ul>
                {interlocutors && interlocutors.length
                    ? interlocutors.map(
                        (bot: any) => <AiAssistantAdminItemWidget
                            key={bot.userId}
                            assistantId={bot.userId}
                            avatar={bot.avatar}
                            name={bot.name}
                        />)
                    :
                    <span>Вы еще не переписывались ни с кем из Термиков! </span>
                }
            </ul>
        </>
    )
})