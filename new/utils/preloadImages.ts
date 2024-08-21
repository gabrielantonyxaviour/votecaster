export default async function preloadImages(
  urls: string[]
): Promise<HTMLImageElement[]> {
  return Promise.all(
    urls.map((url) => {
      return new Promise<HTMLImageElement>((resolve) => {
        const img = new Image();
        img.src = url;
        img.onload = () => resolve(img);
      });
    })
  );
}
