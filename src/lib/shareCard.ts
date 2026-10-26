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

const font = (weight: number, size: number) =>
  `${weight} ${size}px -apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", Inter, sans-serif`;

function roundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + width, y, x + width, y + height, radius);
  ctx.arcTo(x + width, y + height, x, y + height, radius);
  ctx.arcTo(x, y + height, x, y, radius);
  ctx.arcTo(x, y, x + width, y, radius);
  ctx.closePath();
}

export function drawShareCard(
  ctx: CanvasRenderingContext2D,
  data: ShareCardData
) {
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, 1080, 1920);
  const glow = ctx.createRadialGradient(540, 0, 0, 540, 0, 1500);
  glow.addColorStop(0, 'rgba(120, 120, 140, 0.45)');
  glow.addColorStop(0.5, 'rgba(40, 40, 48, 0.25)');
  glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, 1080, 1920);

  ctx.fillStyle = 'rgba(235, 235, 245, 0.6)';
  ctx.font = font(500, 34);
  ctx.fillText(truncateText(ctx, data.user, 900), 90, 170);
  ctx.fillStyle = '#f5f5f7';
  ctx.font = font(600, 76);
  ctx.fillText(truncateText(ctx, data.title, 900), 90, 260);

  data.items.slice(0, 5).forEach((item, index) => {
    const y = 360 + index * 250;
    roundedRect(ctx, 70, y, 940, 210, 40);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.07)';
    ctx.fill();

    ctx.fillStyle = 'rgba(235, 235, 245, 0.35)';
    ctx.font = font(600, 44);
    ctx.textAlign = 'center';
    ctx.fillText(String(index + 1), 140, y + 122);
    ctx.textAlign = 'left';

    ctx.save();
    roundedRect(ctx, 200, y + 25, 160, 160, 24);
    ctx.clip();
    if (item.image) ctx.drawImage(item.image, 200, y + 25, 160, 160);
    else {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.fillRect(200, y + 25, 160, 160);
    }
    ctx.restore();

    ctx.fillStyle = '#f5f5f7';
    ctx.font = font(600, 42);
    ctx.fillText(
      truncateText(ctx, item.name, 580),
      400,
      item.subtitle ? y + 95 : y + 120
    );
    if (item.subtitle) {
      ctx.fillStyle = 'rgba(235, 235, 245, 0.6)';
      ctx.font = font(400, 30);
      ctx.fillText(truncateText(ctx, item.subtitle, 580), 400, y + 145);
    }
  });

  ctx.fillStyle = '#f5f5f7';
  ctx.font = font(600, 34);
  ctx.fillText('Wrapper', 90, 1800);
  ctx.fillStyle = 'rgba(235, 235, 245, 0.45)';
  ctx.font = font(400, 26);
  ctx.fillText('Data from Spotify', 90, 1845);
}
