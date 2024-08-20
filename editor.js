async function extractPictureFromZip(zipBlob) {
    const zip = new JSZip();
    const zipFile = await zip.loadAsync(zipBlob);

    const pictureFile = zipFile.file("picture.png");
    if (pictureFile) {
        const pictureBlob = await pictureFile.async("blob");
        return pictureBlob;
    } else {
        throw new Error("picture.png not found in the zip file");
    }
}
document.getElementById("uploadInput").addEventListener("change", async (event) => {
    const file = event.target.files[0];
    const pictureBlob = await extractPictureFromZip(file);
    console.log(pictureBlob);
    const downloadLink = document.createElement("a");
    downloadLink.href = URL.createObjectURL(pictureBlob);
    downloadLink.download = "picture.png";
    downloadLink.click();
    downloadLink.remove();
});
document.getElementById("downloadBtn").addEventListener("click", async () => {
    console.log("download button clicked");
    const downloadLink = document.createElement("a");
    downloadLink.href = URL.createObjectURL(new Blob([Math.random()], { type: "text/plain" }));
    downloadLink.download = "Hello.txt";
    downloadLink.click();
    downloadLink.remove();
});
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
/*
    x = x-coordinate
    y = y-coordinate
    w = width
    h = height
    c = color
    t = type (square, circle)
*/
var objects = [];
function newSquare() {
    var dragging = false;
    var i = 0;
    objects.forEach(() => {
        i++;
    });
    objects.push({x: 10, y: 10, w: 100, h: 100, c: "red", t: "square"});
    ctx.fillStyle = objects[i].c;
    ctx.fillRect(objects[i].x, objects[i].y, objects[i].w, objects[i].h);
    canvas.addEventListener("mousedown", (event) => {
        const rect = canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;
        if (mouseX >= objects[i].x && mouseX <= objects[i].x+objects[i].w && mouseY >= objects[i].y && mouseY <= objects[i].y+objects[i].h) {
            dragging = true;
            objects[i].x = mouseX-(objects[i].w/2);
            objects[i].y = mouseY-(objects[i].h/2);
        }
        canvas.addEventListener("mousemove", (event) => {
            if (dragging) {
                objects[i].x = event.clientX - rect.left - objects[i].w/2;
                objects[i].y = event.clientY - rect.top - objects[i].h/2;
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = objects[i].c;
                ctx.fillRect(objects[i].x, objects[i].y, objects[i].w, objects[i].h);
                console.log(objects[i].x, objects[i].y);
            }
        });
        canvas.addEventListener("mouseup", () => {
            dragging = false;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            objects.forEach((obj) => {
                if (obj.t === "square") {
                    ctx.fillStyle = obj.c;
                    ctx.fillRect(obj.x, obj.y, obj.w, obj.h);
                } else if (obj.t === "circle") {
                    ctx.fillStyle = obj.c;
                    ctx.beginPath();
                    ctx.arc(obj.x, obj.y, obj.w/2, 0, 2*Math.PI);
                    ctx.fill();
                }
            });
        });
        canvas.addEventListener("mouseup", () => {
            dragging = false;
        });
    });
    
}
document.getElementById("squareBtn").addEventListener("click", async () => {
    newSquare();
});
document.getElementById("circleBtn").addEventListener("click", async () => {
    newCircle();
});