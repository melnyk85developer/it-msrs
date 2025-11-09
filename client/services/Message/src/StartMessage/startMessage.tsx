import React, { useEffect } from "react";
import classes from './styles.module.scss';
import routeMain from './routes'

const StartMessage: React.FC = () => {
    // console.log('MessageContainer: - interlocutor & messages')
    
    return (
        <div className={classes.wrapStartMessages}>
            <div className={classes.wrapBlockOfNoPosts}>
                <div className={classes.blockOfNoPosts}>
                    <h1>Выберите кому вы хотите написать!</h1>
                    <h2>Если в левой колонке нет списка собеседников - значит Вы еще никому не писали. 
                        Напишите кому-нибудь из своих друзей или знакомых в этом проекте и тогда этот 
                        собеседник автоматически появится тут в списке собеседников!</h2>
                </div>
            </div>
        </div>
    )
};
export {routeMain};
export default StartMessage