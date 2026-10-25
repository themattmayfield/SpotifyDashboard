export type ShareCardItem = {
  name: string;
  subtitle?: string;
  image?: HTMLImageElement | null;
};
export type ShareCardData = {
  title: string;
  user: string;
  items: ShareCardItem[];
};

export function truncateText(
  ctx: CanvasRenderingContext2D,
  text: string,
  width: number
) {
  if (ctx.measureText(text).width <= width) return text;
  let value = text;
  while (value && ctx.measureText(`${value}…`).width > width)
    value = value.slice(0, -1);
  return `${value}…`;
}

export async function loadCardImage(url?: string | null, timeout = 5000) {
  if (!url) return null;
  return new Promise<HTMLImageElement | null>((resolve) => {
    const image = new Image();
    const timer = setTimeout(() => resolve(null), timeout);
    image.crossOrigin = 'anonymous';
    image.onload = () => {
      clearTimeout(timer);
      resolve(image);
    };
    image.onerror = () => {
      clearTimeout(timer);
      resolve(null);
    };
    image.src = url;
  });
}

export function drawShareCard(
  ctx: CanvasRenderingContext2D,
  data: ShareCardData
) {
  const gradient = ctx.createLinearGradient(0, 0, 1080, 1920);
  gradient.addColorStop(0, '#1DB954');
  gradient.addColorStop(0.45, '#18392a');
  gradient.addColorStop(1, '#121212');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 1080, 1920);
  ctx.fillStyle = 'white';
  ctx.font = 'bold 72px sans-serif';
  ctx.fillText(truncateText(ctx, data.title, 900), 90, 180);
  ctx.font = '34px sans-serif';
  ctx.fillStyle = '#d1d5db';
  ctx.fillText(truncateText(ctx, data.user, 900), 90, 245);
  data.items.slice(0, 5).forEach((item, index) => {
    const y = 390 + index * 245;
    ctx.fillStyle = 'rgba(0,0,0,.25)';
    ctx.fillRect(70, y - 80, 940, 205);
    ctx.fillStyle = 'white';
    ctx.font = 'bold 48px sans-serif';
    ctx.fillText(String(index + 1), 105, y + 35);
    if (item.image) ctx.drawImage(item.image, 190, y - 55, 160, 160);
    else {
      ctx.fillStyle = '#404040';
      ctx.fillRect(190, y - 55, 160, 160);
    }
    ctx.fillStyle = 'white';
    ctx.font = 'bold 40px sans-serif';
    ctx.fillText(truncateText(ctx, item.name, 570), 390, y + 5);
    if (item.subtitle) {
      ctx.fillStyle = '#d1d5db';
      ctx.font = '28px sans-serif';
      ctx.fillText(truncateText(ctx, item.subtitle, 570), 390, y + 55);
    }
  });
  ctx.fillStyle = 'white';
  ctx.font = 'bold 32px sans-serif';
  ctx.fillText('Spotify Profile', 90, 1810);
  ctx.fillStyle = '#d1d5db';
  ctx.font = '24px sans-serif';
  ctx.fillText('Data from Spotify', 90, 1850);
}
