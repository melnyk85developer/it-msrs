import { API_URL } from "@packages/shared/src/http";
import React, { useEffect, useRef } from "react";
import { ITrack } from "@packages/shared/src/types/musicTypes";
import classes from './styles.module.scss';

type VisualBlockProps = {
  audioRef: React.RefObject<HTMLAudioElement>;
  active: ITrack | null;
  currentTime: number;
  duration: number;
  audioRefFromPlayBar?: React.RefObject<HTMLAudioElement>;
};

const VisualBlock: React.FC<VisualBlockProps> = ({ audioRef, active, currentTime, duration, audioRefFromPlayBar }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (canvas) {
      const context = canvas.getContext("2d");

      if (!context) {
        console.error("Canvas context is null");
        return;
      }

      // Очистка canvas
      context.clearRect(0, 0, canvas.width, canvas.height);

      if (audioRef.current && !analyserRef.current) {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        analyserRef.current = audioContext.createAnalyser();
        const source = audioContext.createMediaElementSource(audioRef.current);
        source.connect(analyserRef.current);
        analyserRef.current.connect(audioContext.destination);
      }

      if (analyserRef.current) {
        const bufferLength = analyserRef.current.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        analyserRef.current.getByteFrequencyData(dataArray);

        const barWidth = (canvas.width / bufferLength) * 2.5;
        let barHeight;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          barHeight = dataArray[i];

          context.fillStyle = `rgb(0, ${barHeight + 100}, 0)`; // Цвет зависит от высоты столбца
          context.fillRect(x, canvas.height - barHeight / 2, barWidth, barHeight / 2);

          x += barWidth + 1;
        }
      }
    }
  }, [currentTime, duration]);


  return (
    <div className={classes.wrapVisualBlockPlayer}>
      <canvas ref={canvasRef} />
    </div>
  );
};

export default VisualBlock;
