export const verifyImageFormat = async (file: File) => {
    const acceptedFormats = ["image/jpeg", "image/png", "image/jpg"];

    console.log("File type: ", file.type)
    console.log(file)

    if (!file || !file.type) {
        return false; // Unable to verify format
    }

    return acceptedFormats.includes(file.type);
};
