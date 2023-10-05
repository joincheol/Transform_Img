const imageInput = document.getElementById("imageInput");
const rotationInput = document.getElementById("rotationInput");
const rotateButton = document.getElementById("rotateButton");
const outputCanvas = document.getElementById("outputCanvas");
const ctx = outputCanvas.getContext("2d");

let currentRotation = 0; // 처음 회전 값

imageInput.addEventListener("change", handleImageUpload);

rotateButton.addEventListener("click", handleRotation);

function handleImageUpload(event) {
    const file = event.target.files[0];

    if (file) {
        const reader = new FileReader();

        reader.onload = function (e) {
            const image = new Image();
            image.src = e.target.result;

            image.onload = function () {
                // 원하는 각도로 이미지 회전
                ctx.clearRect(0, 0, outputCanvas.width, outputCanvas.height);
                ctx.save();
                ctx.translate(outputCanvas.width / 2, outputCanvas.height / 2);
                ctx.rotate((currentRotation * Math.PI) / 180);
                ctx.drawImage(image, -image.width / 2, -image.height / 2);
                ctx.restore();

                const imageData = ctx.getImageData(0, 0, outputCanvas.width, outputCanvas.height);
                const data = imageData.data;

                 // 이진화할때의 임계값 설정
                const threshold = 128;

                // 각 픽셀을 흑백으로 변환 후 이진화
                for (let i = 0; i < data.length; i += 4) {
                    const average = (data[i] + data[i + 1] + data[i + 2]) / 4;
                    if (average > threshold) {
                        data[i] = 255;  // 흰색
                        data[i + 1] = 255;
                        data[i + 2] = 255;
                    } else {
                        data[i] = 0;    // 검은색
                        data[i + 1] = 0;
                        data[i + 2] = 0;
                    }
                }

                ctx.putImageData(imageData, 0, 0);
            };
        };

        reader.readAsDataURL(file);
    }
}

function handleRotation() {
    // 사용자가 입력한 각도에 따라 이미지 회전
    const newRotation = parseFloat(rotationInput.value);
    if (!isNaN(newRotation)) {
        currentRotation = newRotation;
        handleImageUpload({ target: { files: [imageInput.files[0]] } });
    }
}