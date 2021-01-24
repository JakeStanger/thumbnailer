import readExif, { IExif } from './readExif';
import * as imageGenerator from './imageGenerator';
import {
  IMarkedGenerateOptions,
  IThumbnailGenerateOptions,
} from './imageGenerator';
import sharp, { Sharp } from 'sharp';

interface IThumbnailerOptions {
  thumbnail: boolean | IThumbnailGenerateOptions;
  marked?: IMarkedGenerateOptions;
  exif: boolean;
}

interface IThumbnailerData {
  exifData?: IExif;
  thumbnail?: Sharp;
  marked?: Sharp;
}

async function thumbnailer(path: string, options: IThumbnailerOptions) {
  let returnData: IThumbnailerData = {};

  const image = sharp(path);

  const { width, height, exif } = await image.metadata();

  if(!width || !height) {
    throw new Error('Image metadata is missing width/height');
  }

  if (options.exif && exif) {
    const exifData = readExif(path);
    returnData = { ...returnData, ...exifData };
  }

  if (options.thumbnail) {
    returnData.thumbnail = await imageGenerator.generateThumbnail(
      image.clone(),
      typeof options.thumbnail !== 'boolean' ? options.thumbnail : undefined
    );
  }

  if (options.marked) {
    returnData.marked = await imageGenerator.generateMarked(
      image.clone(),
      width,
      height,
      options.marked
    );
  }

  return returnData;
}

export default thumbnailer;
