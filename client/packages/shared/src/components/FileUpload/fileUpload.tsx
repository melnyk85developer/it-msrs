import React, { useRef } from "react";

type PropsType = {
    setFile: Function
    accept?: string
    children: any
    setNameTrack?: any
    setNameImg?: any
    setNewDuration?: any
}

const FileUpload: React.FC<PropsType> = ({setFile, accept, children, setNameTrack, setNameImg, setNewDuration}) => {
    const ref = useRef<HTMLInputElement | any>()

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if(e.target.files !== null){
            setFile(e.target.files[0])
            // console.log(e.target.files[0].name)
            if(setNameTrack !== undefined){
                setNameTrack(e.target.files[0].name)
            }
            if(setNameImg !== undefined){
                setNameImg(e.target.files[0].name)
            }
            // Получение длительности файла
            const file = e.target.files[0];
            const audio = document.createElement('audio');
            audio.src = URL.createObjectURL(file);
            audio.onloadedmetadata = () => {
            const duration = audio.duration;
            setNewDuration(duration)
            };
        }
    }

    return (
        <div onClick={() => ref.current.click()} >
            <input 
                type="file" 
                accept={accept}
                style={{display: "none"}}
                ref={ref}
                onChange={onChange}
            />
            {children}
        </div>
    )
}
export default FileUpload