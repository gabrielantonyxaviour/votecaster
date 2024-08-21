export default async function preloadImages(
  url: string
): Promise<HTMLImageElement> {
  return new Promise<HTMLImageElement>((resolve) => {
    setTimeout(() => {
      const img = new Image();
      img.src = url;
      img.onload = () => {
        resolve(img);
      };
      img.onerror = () => {
        console.error(`Image failed to load: ${url}`);
        resolve(img);
      };
    }, 0);
  });
}
