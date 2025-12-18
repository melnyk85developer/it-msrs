

export const sendMessageActivationAccountHTMLDocument = (nameProjekt: string, to: string, text: any, link: string) => {
    return (`
        <section style="
            margin: 0;
            padding: 10px;
            background-color: #282828;
            border: 1px solid black;
            text-decoration: none !important;
            line-height: 1;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
            'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',sans-serif;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
        ">

            <div 
                style="
                    padding: 20px;
                    height: 55vh;
                    border: 1px solid black;
                    border-radius: 8px;
                    background-color: #282828;
                    text-align: center;
                "
            >

            <h1 
                style="
                    text-align: center;
                    margin-bottom: 20px;
                    font-weight: normal;
                    color: red;
                "
            >
                Внимание!
            </h1>
                <p 
                    style="
                        font-size: 1.375rem;
                        text-align: left;
                        color: #e2e2e2;
                        margin-bottom: 20px;
                    "
                >
                    Вы получили это сообщение по тому, что Ваш электронный адресс ${to} был указан при регистрации аккаунта на проекте ${nameProjekt}</span><br/>
                </p>
                
                <p                
                    style="
                        font-size: 18px;
                        text-align: left;
                        color: #e2e2e2;
                ">
                    <strong 
                        style="
                            margin-left: 20px;
                            margin-bottom: 18px;
                            color: #e2e2e2;
                            font-weight: normal;
                            font-style: italic;
                    ">
                    Если Вы не совершаете регистрацию аккаунта на проекте ${nameProjekt}, 
                    то это может означать: 
                    </strong><br/>
                </p                 
                    style="
                        font-size: 0.875rem;
                        text-align: left;
                        color: #e2e2e2;
                ">
                <p                
                    style="
                        font-size: 0.875rem;
                        text-align: left;
                        color: #e2e2e2;
                    ">
                    <strong 
                        style="
                            margin-left: 40px;
                            margin-bottom: 20px;
                            color: #e2e2e2;
                            font-weight: normal;
                    ">
                        1. Либо кто то по ошибке ввел Ваш E-Mail 
                        <span 
                            style="
                                text-decoration: none;
                                font-size: 16px;
                                color: #ff6600;
                        ">${to} </span>при регистрации аккаунта. </strong><br/>
                </p>
                <p                
                    style="
                        font-size: 0.875rem;
                        text-align: left;
                        color: #e2e2e2;
                ">
                    <strong 
                        style="
                            margin-left: 40px;
                            margin-bottom: 20px;
                            color: #e2e2e2;
                            font-weight: normal;
                    ">
                        2. Либо злоумышленники пытаются на Вашу электронную почту
                        <span 
                            style="
                                text-decoration: none;
                                font-size: 16px;
                                color: #ff6600;
                        ">${to}</span> зарегистрировать аккаунт на проекте ${nameProjekt}
                        
                    </strong><br/>
                
                    <strong 
                        style="
                            display: block;
                            margin-top: 20px;
                            margin-left: 20px;
                            color: #ff6600;
                            font-size: 20px;
                            font-weight: normal;
                            font-style: italic;
                            font-family: 'Roboto';
                    ">    
                    (В случае если это не Вы совершаете регистрацию, то настоятельно рекомендуем временно заблокировать регистрацию 
                    на Ваш E-Mail 
                    <span 
                        style="
                            text-decoration: none;
                            font-size: 16px;
                            color: #ff6600;
                    ">${to}${' '}</span>и по пытаться выяснить кто и с какой целью совершает эти действия от Вашего имени!)</strong><br/>

                <div                    
                    style="
                        display: flex;
                        justify-content: space-between;
                        margin-top: 20px;
                        font-weight: normal;
                        /* border: 1px solid red; */
                ">
                    <p
                        style="font-size: 0.875rem; color: #e2e2e2;"
                    >Я не совершаю регистрацию на проекте ${nameProjekt}, прошу временно заблокировать регистрацию с моего E-Mail 
                    </p >
                    <button
                        style="
                            margin: auto 10px;
                            padding: 7px 10px;
                            height: 33px;
                            color: red;
                            background-color: #282828;
                            font-weight: normal;
                            border-radius: 8px;

                    ">Заблокировать регистрацию</button>
                </div>
                <div                    
                    style="
                        display: flex;
                        color: #FFAC00;
                        font-weight: normal;
                        /* border: 1px solid red; */
                ">
                    <p 
                        style="font-size: 0.875rem; color: #e2e2e2; padding-bottom: 2px;"
                    >Это я совершаю регистрацию на проекте ${nameProjekt}, по этому:
                    </p>
                        <button
                            style="
                                display: flex;
                                margin: auto 10px;
                                padding: 7px 10px;
                                height: 33px;
                                color: #e2e2e2;
                                background-color: #282828;
                                font-weight: normal;
                                border-radius: 8px;

                        ">
                            <a 
                                href="${link}" 
                                target="_blank"
                                style="
                                    color: green;
                                    text-decoration: none;
                                "
                            >Подтверждаю регистрацию</a>
                        </button>
                    <p 
                        style="font-size: 0.875rem; color: #e2e2e2; padding-bottom: 2px;"
                    >Код активации: <span style="color: #ff6600;">${' '}${text}</span>
                    </p>
                </div>
            </div>
        </section> 
    `)
}