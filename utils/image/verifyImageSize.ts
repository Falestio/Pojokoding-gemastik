export const verifyImageSize = async (file: File) => {
    console.log("File size: ", file.size)
    
    if (!file || !file.size) {
        return false; // Unable to verify size
    }

    return file.size < 10 * 1024 * 1024; // 10 MB
};
