import React, { Context, ReactNode, createContext, useEffect } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";

type PropsType = {
    children: ReactNode
}
export const ThemeContext = createContext([]) as Context<never[]> | any

export const ThemeProvider: React.FC<PropsType> = ({children})  => {

    const [theme, setTheme] = useLocalStorage("theme", "light")

    useEffect(() => {
        if(theme === 'dark'){
            document.body.classList.add('dark')
        }else{
            document.body.classList.remove('dark')
        }
    }, [theme])

    return (
        <div>
            <ThemeContext.Provider value={[theme, setTheme]}>
                {children}
            </ThemeContext.Provider>
        </div>
    )
}