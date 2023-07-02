export function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise(resolve => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image), { once: true });
    image.src = url;
  });
}

export async function loadJSON<T = unknown>(url: string): Promise<T> {
  const resp = await fetch(url);
  return resp.json();
}
