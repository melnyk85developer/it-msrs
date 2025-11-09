import {
    FaChrome,
    FaFirefoxBrowser,
    FaSafari,
    FaEdge,
    FaOpera,
    FaInternetExplorer,
    FaQuestionCircle
} from 'react-icons/fa';
import { AndroidOutlined, AppleOutlined, ChromeOutlined, FunctionOutlined, LinuxOutlined, LoginOutlined, LogoutOutlined, MoonOutlined, QuestionCircleOutlined, SunOutlined, WindowsOutlined } from "@ant-design/icons";

type Props = {
    browserName: string;
};

export const BrowserIcon: React.FC<Props> = ({ browserName }) => {
    if(browserName && browserName !== null && browserName !== undefined){
        const normalizedBrowser = browserName.toLowerCase();

        switch (normalizedBrowser) {
            case 'chrome':
                return <><ChromeOutlined /> {browserName}</>;
            case 'chromium':
                return <><ChromeOutlined /> {browserName}</>;
            case 'firefox':
                return <><FaFirefoxBrowser /> {browserName}</>;
            case 'safari':
                return <><FaSafari /> {browserName}</>;
            case 'edge':
            case 'microsoft edge':
                return <><FaEdge /> {browserName}</>;
    
            case 'opera':
                return <><FaOpera /> {browserName}</>;
            case 'ie':
            case 'internet explorer':
                return <><FaInternetExplorer /> {browserName}</>;
            default:
                return <><FaQuestionCircle /> {browserName}</>;
        }
    }else{
        return null
    }
};
