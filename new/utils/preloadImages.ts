export default function preloadImages(
  urls: string[],
  callback: (images: HTMLImageElement[]) => void
): void {
  let loadedCount = 0;
  const images: HTMLImageElement[] = [];

  urls.forEach((url, index) => {
    const img = new Image();
    img.src = url;
    img.onload = () => {
      loadedCount++;
      images[index] = img;
      if (loadedCount === urls.length) {
        callback(images);
      }
    };
  });
}
