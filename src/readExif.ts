import fastExif from 'fast-exif';

export interface IExif {
  exposure?: number;
  focalLength?: number;
  aperture?: number;
  iso?: number;
  cameraModel?: string;
  timeTaken?: Date;
}

async function readExif(path: string): Promise<IExif> {
  const exif = await fastExif.read(path);

  const imageData: IExif = {};

  if (exif.exif) {
    const exifRaw = exif.exif;

    imageData.exposure = exifRaw.ExposureTime;
    imageData.focalLength = exifRaw.FocalLength;
    imageData.aperture = exifRaw.FNumber;
    imageData.iso = exifRaw.ISO;
    imageData.cameraModel = exif.image.Model;

    if (exifRaw.DateTimeOriginal) {
      imageData.timeTaken = new Date(exifRaw.DateTimeOriginal);
    }
  }

  return imageData;
}

export default readExif;
