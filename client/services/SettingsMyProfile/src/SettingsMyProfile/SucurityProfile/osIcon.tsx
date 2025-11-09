import { SiMacos, SiLinux, SiUbuntu, SiAndroid, SiIos } from 'react-icons/si';
import { FaWindows, FaApple, FaLinux, FaAndroid, FaQuestionCircle } from 'react-icons/fa';
import { 
    AndroidOutlined, 
    AppleOutlined, 
    ChromeOutlined, 
    FunctionOutlined, 
    LinuxOutlined, 
    LoginOutlined, 
    LogoutOutlined, 
    MoonOutlined, 
    QuestionCircleOutlined, 
    SunOutlined, 
    WindowsOutlined } from "@ant-design/icons";

type Props = {
    osName: string;
};

export const OsIcon: React.FC<Props> = ({ osName }) => {
    if(osName && osName !== null && osName !== undefined){
        const normalizedOs = osName.toLowerCase();

        switch (true) {
            case normalizedOs.includes('ubuntu'):
                return <><SiUbuntu /> {osName}</>;
    
            case normalizedOs.includes('windows'):
                return <><FaWindows /> {osName}</>;
    
            case normalizedOs.includes('mac'):
            case normalizedOs.includes('darwin'):
            case normalizedOs.includes('macintosh'):
                return <><SiMacos /> {osName}</>;
    
            case normalizedOs.includes('android'):
                return <><SiAndroid /> {osName}</>;
    
            case normalizedOs.includes('ios'):
            case normalizedOs.includes('iphone'):
                return <><SiIos /> {osName}</>;
    
            case normalizedOs.includes('linux'):
                return <><SiLinux /> {osName}</>;
    
            default:
                return <><FaQuestionCircle /> {osName}</>;
        }
    }else{
        return null
    }
};
