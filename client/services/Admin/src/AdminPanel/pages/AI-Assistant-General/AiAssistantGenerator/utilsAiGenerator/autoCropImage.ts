export const autoCropImage = async (imageSrc: File, originalFileName: string): Promise<File> => {
    // console.log('autoCropImage: imageSrc, originalFileName', imageSrc, originalFileName)
    const image = new Image();
    image.src = URL.createObjectURL(imageSrc);
    // console.log('autoCropImage: image.src', image.src)
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const cropWidth = 500;
    const cropHeight = 500;

    await new Promise<void>((resolve) => {
        image.onload = () => {
            let imgWidth = image.width;
            let imgHeight = image.height;

            canvas.width = cropWidth;
            canvas.height = cropHeight;

            const scaleX = cropWidth / imgWidth;
            const scaleY = cropHeight / imgHeight;
            const scale = Math.max(scaleX, scaleY);

            imgWidth *= scale;
            imgHeight *= scale;

            const x = (cropWidth - imgWidth) / 2;
            const y = (cropHeight - imgHeight) / 2;

            ctx!.clearRect(0, 0, canvas.width, canvas.height);
            ctx!.drawImage(image, x, y, imgWidth, imgHeight);

            resolve();
        };
    });

    return new Promise<File>((resolve) => {
        canvas.toBlob((blob) => {
            if (blob) {
                // Создаем новый File с оригинальным именем
                const file = new File([blob], originalFileName, { type: blob.type });
                resolve(file);
            } else {
                resolve(new File([""], "defaultCroppedAvatar.png"));
            }
        }, 'image/png');
    });
};