const fileSizeLimit = 2 * 1024 * 1024; // 2 MB
const cloudinaryAssestFolderName = "evo-mart"
const cloudinaryCustomPublicId = `${cloudinaryAssestFolderName}_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`
const allowedImageFormats  = ['image/jpeg', 'image/png', 'image/webp']

export  {
    fileSizeLimit, 
    cloudinaryAssestFolderName,
    cloudinaryCustomPublicId,
    allowedImageFormats
}