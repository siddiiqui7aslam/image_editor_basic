let cropper; 
let croppedImageUrl; 
let originalCroppedUrl; 

function previewImage() {
  const input = document.getElementById('imageUpload');
  const preview = document.getElementById('imagePreview');
  const cropContainer = document.querySelector('.crop-container');
  const header = document.querySelector('.header');

  if (input.files && input.files[0]) {
    const reader = new FileReader();

    reader.onload = function(e) {
      preview.src = e.target.result;
      preview.style.display = 'block';

      document.querySelector('.container').style.display = 'none'; 
      header.style.display = 'none'; 
      cropContainer.style.display = 'flex'; 

      const image = document.createElement('img');
      image.src = e.target.result;
      cropContainer.insertBefore(image, cropContainer.firstChild);
      cropper = new Cropper(image, {
        aspectRatio: 1,
        viewMode: 1,
      });
    };

    reader.readAsDataURL(input.files[0]);
  }
}

function goBack() {

  document.querySelector('.crop-container').style.display = 'none'; 
  document.querySelector('.container').style.display = 'block'; 
  document.querySelector('.header').style.display = 'block';
}

function rotateImage() {
  cropper.rotate(90);
}

function toggleFlipMenu() {
  const flipMenu = document.querySelector('.flip-menu');
  flipMenu.style.display = flipMenu.style.display === 'none' ? 'block' : 'none';
}

function flipImage(direction) {
  if (direction === 'horizontal') {
    cropper.scaleX(-cropper.getData().scaleX);
  } else {
    cropper.scaleY(-cropper.getData().scaleY);
  }
}

function applyFrame(src) {
  const frameImage = new Image();
  frameImage.src = src;
  frameImage.onload = function() {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    
    canvas.width = cropper.getCroppedCanvas().width;
    canvas.height = cropper.getCroppedCanvas().height;

    // cropped image
    context.drawImage(cropper.getCroppedCanvas(), 0, 0);

    // frame
    context.drawImage(frameImage, 0, 0, canvas.width, canvas.height);

    croppedImageUrl = canvas.toDataURL();
    document.getElementById('smallCroppedImage').src = croppedImageUrl;
  };
}

function finalizeImage() {
  const preview = document.getElementById('imagePreview');
  preview.src = croppedImageUrl;
  preview.style.display = 'block';
  hideFloatingModal();
  document.getElementById('floatingModal').style.display = 'none'; // hide modal
  document.querySelector('.crop-container').style.display = 'none'; // hide crop 
  document.querySelector('.container').style.display = 'block'; // show home 
  document.querySelector('.header').style.display = 'block'; 
}

function applyShapeMask(maskSrc) {
  const maskImage = new Image();
  maskImage.src = maskSrc;

  maskImage.onload = function() {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    const croppedCanvas = cropper.getCroppedCanvas();

    canvas.width = croppedCanvas.width;
    canvas.height = croppedCanvas.height;

    context.drawImage(croppedCanvas, 0, 0);

    //  masking
    context.globalCompositeOperation = 'destination-in';
    context.drawImage(maskImage, 0, 0, canvas.width, canvas.height);

    croppedImageUrl = canvas.toDataURL();
    document.getElementById('smallCroppedImage').src = croppedImageUrl;
  };
}

function cropImage() {
  const canvas = cropper.getCroppedCanvas();
  if (canvas) {
    croppedImageUrl = canvas.toDataURL();
    originalCroppedUrl = croppedImageUrl;

    document.getElementById('smallCroppedImage').src = croppedImageUrl;

    document.getElementById('smallCroppedImage').style.display = 'block';

    document.querySelector('.crop-container').style.display = 'none';
    document.querySelector('.container').style.display = 'block';
    document.querySelector('.header').style.display = 'block';

    showFloatingModal();
  }
}

function showOriginalPhoto() {
  const smallCroppedImage = document.getElementById('smallCroppedImage');
  
  smallCroppedImage.src = originalCroppedUrl;
}

function showFloatingModal() {
  document.getElementById('floatingModal').style.display = 'block';
  
  document.getElementById('modalOverlay').style.display = 'block';
}

function hideFloatingModal() {
  document.getElementById('floatingModal').style.display = 'none';
  document.getElementById('modalOverlay').style.display = 'none';
}
