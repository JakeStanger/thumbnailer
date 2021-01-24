/*
This is a duplicate of the same file in /lib
to avoid the TS compiler adding external files
to the lambda project.
 */

import sharp, { Sharp } from 'sharp';

interface IGenerateOptions {
  quality?: number;
}

export interface IThumbnailGenerateOptions extends IGenerateOptions {
  width?: number;
}

export interface IMarkedGenerateOptions extends IGenerateOptions {
  overlay: string | Buffer;
}

export async function generateThumbnail(
  image: Sharp,
  options: IThumbnailGenerateOptions = { quality: 90, width: 360 }
) {
  return image.webp({ quality: options.quality }).resize(options.width, null);
}

export async function generateMarked(
  image: Sharp,
  width: number,
  height: number,
  options: IMarkedGenerateOptions
) {
  const portrait = height > width;

  let overlay = await sharp(options.overlay)
    .resize({
      withoutEnlargement: true,
      width: !portrait ? width : undefined,
      height: portrait ? height : undefined,
    })
    .toBuffer();

  return image
    .composite([
      {
        input: overlay,
        gravity: sharp.gravity.northwest,
        tile: true,
      },
    ])
    .webp({ quality: options.quality ?? 95, alphaQuality: options.quality ?? 95 });
}