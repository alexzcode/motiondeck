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