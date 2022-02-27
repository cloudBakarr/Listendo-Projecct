const { Storage } = require('@google-cloud/storage')
import Application from '@ioc:Adonis/Core/Application'

const VIDEO_BUCKET = Application.env.get('VIDEO_BUCKET', 'music-project-bucket')
const IMAGE_BUCKET = Application.env.get('IMAGE_BUCKET', 'music-project-images-bucket')

const store = new Storage({
  projectId: 'music-project-341316',
  keyFilename: Application.makePath('keyfile.json'),
})

export const upload = (
  filePath: string,
  destFileName: string,
  bucketName: string | null
): Promise<any> => {
  return store.bucket(bucketName).upload(filePath, {
    destination: destFileName,
  })
}

export const getLink = (bucketName: string | null, fileName: string) => {
  return `https://storage.googleapis.com/${bucketName}/${fileName}`
}

export const getVideoLink = (fileName: string) => {
  return `https://storage.googleapis.com/${VIDEO_BUCKET}/${fileName}`
}

export const getImageLink = (fileName: string) => {
  return `https://storage.googleapis.com/${IMAGE_BUCKET}/${fileName}`
}

export const uploadToVideos = (filePath: string, destFileName: string) => {
  return upload(filePath, destFileName, VIDEO_BUCKET)
}

export const uploadToImages = (filePath: string, destFileName: string) => {
  return upload(filePath, destFileName, IMAGE_BUCKET)
}

export const remove = (bucketName:string, fileName:string): Promise<any> => {
  return store.bucket(bucketName).file(fileName).delete()
}

export const removeVideo = (fileName:string): Promise<any> => {
  return remove(VIDEO_BUCKET,fileName);
}

export const removeImage = (fileName:string): Promise<any> => {
  return remove(IMAGE_BUCKET,fileName);
}
