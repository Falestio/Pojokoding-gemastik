<template>
    <div>
        <ProfilePictureDashboard></ProfilePictureDashboard>
    </div>
</template>

<script setup>
// import Cropper from "cropperjs";
// import "cropperjs/dist/cropper.css";

// // TODO trigger image crip when click button
// // user upload pictures -> validation -> open modal -> init cropper -> user crop image -> get cropped image -> upload cropped image

// const newImage = ref(null);
// const newImageCropped = ref(null);
// const cropper = ref(null);

// if (process.client) {
//     newImage.value = document.getElementById("new-image");
// }

// function initCropper() {
//     if (newImage.value) {
//         cropper.value = new Cropper(newImage.value, {
//             crop(event) {
//                 console.log(event.detail.x);
//                 console.log(event.detail.y);
//                 console.log(event.detail.width);
//                 console.log(event.detail.height);
//                 console.log(event.detail.rotate);
//                 console.log(event.detail.scaleX);
//                 console.log(event.detail.scaleY);
//             },
//         });
//     }
// }

// function handleCropImage() {
//     // Get the cropped canvas
//     const croppedCanvas = cropper.value.getCroppedCanvas();

//     // Convert the canvas to a Blob
//     croppedCanvas.toBlob((blob) => {
//         // Create a data URL from the Blob
//         const dataURL = URL.createObjectURL(blob);

//         // Store the data URL in newImageCropped
//         newImageCropped.value = dataURL;

//         // You can now use newImageCropped as needed
//         console.log("Cropped Image Data URL:", newImageCropped.value);
//     });
// }
</script>
  