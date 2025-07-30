const createImage = (url) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.setAttribute("crossOrigin", "anonymous");
    image.src = url;
  });

/**
 * @param {string} imageSrc - The source of the image to crop.
 * @param {Object} pixelCrop - The pixel crop values from react-easy-crop.
 * @returns {Promise<Blob>} - A promise that resolves with the cropped image as a Blob.
 */
export async function getCroppedImg(imageSrc, pixelCrop) {
  if (!pixelCrop || pixelCrop.width === 0 || pixelCrop.height === 0) {
    throw new Error("잘못된 자르기 영역입니다. 너비 또는 높이가 0입니다.");
  }

  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("캔버스 2d 컨텍스트를 가져올 수 없습니다.");
  }

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("캔버스가 비어있거나 Blob으로 변환할 수 없습니다."));
          return;
        }
        resolve(blob);
      },
      "image/jpeg",
      0.95 // 높은 품질을 유지합니다.
    );
  });
}
