import React, { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@packages/shared/src/components/hooks/redux'
import { getAiAssistantInterlocutorAC } from '@packages/shared/src/store/MyAdminReducers/myAiAssistantAdminSlice'
import { AiAssistantWidgetListAdmin } from '../pages/AI-Assistant-General/AI-AssistantLSidebar/AiAssistantListWidgetAdmin/AiAssistantListAdminWidget'
import classes from '../styles.module.scss'

export type AdminPagesTypeContent = 'HALLO_ADMIN' | 'ASSISTANTS' | 'SHOPS'

type PropsType = {
    typeContent: string;
    setTypeContent: React.Dispatch<React.SetStateAction<string>>
}
export const AdminLSidebar: React.FC<PropsType> = React.memo(({ typeContent, setTypeContent }) => {
    const { isDarkTheme } = useAppSelector(state => state.authPage)

    return (
        <div className={
            `${classes.wrapInterlocutors}
                    ${isDarkTheme !== "light"
                ? classes.dark
                : classes.light
            }`
        }>
            {
                typeContent === 'ASSISTANTS'
                    ?
                    <AiAssistantWidgetListAdmin/>
                    :
                    <span></span>
            }
        </div>
    )
})