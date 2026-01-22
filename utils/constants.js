const fileSizeLimit = 10 * 1024 * 1024; // 10 MB
const cloudinaryAssestFolderName = "nodejs-projects"
const cloudinaryCustomPublicId = `${cloudinaryAssestFolderName}_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`


export default {
    fileSizeLimit, 
    cloudinaryAssestFolderName,
    cloudinaryCustomPublicId
}