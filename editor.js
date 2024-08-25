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
    t = type (square, circle, image, title)
    i = image (only for image)
    v = value (only for title)
*/
var slides = [[]];
var currentSlide = 0;
var selected = null;
var color = "red";
var presenting = false;
function newSquare() {
    if (!presenting) {
        var dragging = false;
        var i = 0;
        slides[currentSlide].forEach(() => {
            i++;
        });
        slides[currentSlide].push({x: 10, y: 10, w: 100, h: 100, c: "red", t: "square"});
        ctx.fillStyle = slides[currentSlide][i].c;
        ctx.fillRect(slides[currentSlide][i].x, slides[currentSlide][i].y, slides[currentSlide][i].w, slides[currentSlide][i].h);
        canvas.addEventListener("mousedown", (event) => {
            const rect = canvas.getBoundingClientRect();
            const mouseX = event.clientX - rect.left;
            const mouseY = event.clientY - rect.top;
            if (slides[currentSlide][i] && mouseX >= slides[currentSlide][i].x+5 && mouseX <= slides[currentSlide][i].x+slides[currentSlide][i].w-5 && mouseY >= slides[currentSlide][i].y+5 && mouseY <= slides[currentSlide][i].y+slides[currentSlide][i].h-5) {
                if (i === slides[currentSlide].length-1) {
                    dragging = true;
                    selected = i;
                    slides[currentSlide][i].x = mouseX - (slides[currentSlide][i].w/2);
                    slides[currentSlide][i].y = mouseY - (slides[currentSlide][i].h/2);
                } else {
                    var collidingObjects = [];
                    var tempObjects = [...slides[currentSlide]];
                    tempObjects.splice(i, 1);
                    dragging = true;
                    tempObjects.forEach((obj) => {
                        if (mouseX >= obj.x && mouseX <= obj.x+obj.w && mouseY >= obj.y && mouseY <= obj.y+obj.h) {
                            collidingObjects.push(obj);
                        }
                    });
                    collidingObjects.forEach((obj) => {
                        console.log("objects interfering with collision, ids:", slides[currentSlide].indexOf(obj), i);
                        if (slides[currentSlide].indexOf(obj) > i) {
                            dragging = false;
                        }
                    });
                    if (dragging===true) {
                        selected = i;
                        slides[currentSlide][i].x = mouseX - (slides[currentSlide][i].w/2);
                        slides[currentSlide][i].y = mouseY - (slides[currentSlide][i].h/2);
                    }
                }
            }
            canvas.addEventListener("mousemove", (event) => {
                if (dragging) {
                    slides[currentSlide][i].x = event.clientX - rect.left - slides[currentSlide][i].w/2;
                    slides[currentSlide][i].y = event.clientY - rect.top - slides[currentSlide][i].h/2;
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    ctx.fillStyle = slides[currentSlide][i].c;
                    ctx.fillRect(slides[currentSlide][i].x, slides[currentSlide][i].y, slides[currentSlide][i].w, slides[currentSlide][i].h);
                    slides[currentSlide].forEach((obj) => {
                        if (obj.t === "square") {
                            ctx.fillStyle = obj.c;
                            ctx.fillRect(obj.x, obj.y, obj.w, obj.h);
                        } else if (obj.t === "circle") {
                            ctx.fillStyle = obj.c;
                            ctx.beginPath();
                            ctx.arc(obj.x + obj.w/2, obj.y + obj.h/2, obj.w/2, 0, 2*Math.PI);
                            ctx.fill();
                        } else if (obj.t === "image") {
                            ctx.drawImage(obj.i, obj.x, obj.y, obj.w, obj.h);
                        } else if (obj.t === "title") {
                            ctx.fillStyle = obj.c;
                            ctx.font = "30px Arial";
                            ctx.fillText(obj.v, obj.x, obj.y+30);
                        }
                        ctx.strokeStyle = "blue";
                        ctx.lineWidth = 2;
                        ctx.strokeRect(slides[currentSlide][selected].x, slides[currentSlide][selected].y, slides[currentSlide][selected].w, slides[currentSlide][selected].h);
                        ctx.fillStyle = "blue";
                        ctx.beginPath();
                        ctx.arc(slides[currentSlide][i].x+slides[currentSlide][i].w/2, slides[currentSlide][i].y+slides[currentSlide][i].h/2, 5, 0, 2*Math.PI);
                        ctx.fill();
                    });
                    console.log("OBJ MOVE\n id:", i ,"\n x+y: ", slides[currentSlide][i].x, slides[currentSlide][i].y);
                }
            });
            canvas.addEventListener("mouseup", () => {
                if (dragging) {
                    dragging = false;
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    slides[currentSlide].forEach((obj) => {
                        if (obj.t === "square") {
                            ctx.fillStyle = obj.c;
                            ctx.fillRect(obj.x, obj.y, obj.w, obj.h);
                        } else if (obj.t === "circle") {
                            ctx.fillStyle = obj.c;
                            ctx.beginPath();
                            ctx.arc(obj.x + obj.w/2, obj.y + obj.h/2, obj.w/2, 0, 2*Math.PI);
                            ctx.fill();
                        } else if (obj.t === "image") {
                            ctx.drawImage(obj.i, obj.x, obj.y, obj.w, obj.h);
                        } else if (obj.t === "title") {
                            ctx.fillStyle = obj.c;
                            ctx.font = "30px Arial";
                            ctx.fillText(obj.v, obj.x, obj.y+30);
                        }
                        ctx.strokeStyle = "blue";
                        ctx.lineWidth = 2;
                        ctx.strokeRect(slides[currentSlide][selected].x, slides[currentSlide][selected].y, slides[currentSlide][selected].w, slides[currentSlide][selected].h);
                        ctx.fillStyle = "blue";
                        ctx.beginPath();
                        ctx.arc(slides[currentSlide][i].x+slides[currentSlide][i].w/2, slides[currentSlide][i].y+slides[currentSlide][i].h/2, 5, 0, 2*Math.PI);
                        ctx.fill();
                    });
                }
            });
        });
    }
}
function newCircle() {
    if (!presenting) {
        var dragging = false;
        var i = 0;
        slides[currentSlide].forEach(() => {
            i++;
        });
        slides[currentSlide].push({x: 10, y: 10, w: 100, h: 100, c: "blue", t: "circle"});
        ctx.fillStyle = slides[currentSlide][i].c;
        ctx.beginPath();
        ctx.arc(slides[currentSlide][i].x + slides[currentSlide][i].w/2, slides[currentSlide][i].y + slides[currentSlide][i].h/2, slides[currentSlide][i].w/2, 0, 2*Math.PI);
        ctx.fill();
        canvas.addEventListener("mousedown", (event) => {
            const rect = canvas.getBoundingClientRect();
            const mouseX = event.clientX - rect.left;
            const mouseY = event.clientY - rect.top;
            if (slides[currentSlide][i] && mouseX >= slides[currentSlide][i].x && mouseX <= slides[currentSlide][i].x+slides[currentSlide][i].w && mouseY >= slides[currentSlide][i].y && mouseY <= slides[currentSlide][i].y+slides[currentSlide][i].h) {
                if (i === slides[currentSlide].length-1) {
                    dragging = true;
                    selected = i;
                    slides[currentSlide][i].x = mouseX - (slides[currentSlide][i].w/2);
                    slides[currentSlide][i].y = mouseY - (slides[currentSlide][i].h/2);
                } else {
                    var collidingObjects = [];
                    var tempObjects = [...slides[currentSlide]];
                    tempObjects.splice(i, 1);
                    dragging = true;
                    tempObjects.forEach((obj) => {
                        if (mouseX >= obj.x && mouseX <= obj.x+obj.w && mouseY >= obj.y && mouseY <= obj.y+obj.h) {
                            collidingObjects.push(obj);
                        }
                    });
                    collidingObjects.forEach((obj) => {
                        console.log(slides[currentSlide].indexOf(obj), i);
                        if (slides[currentSlide].indexOf(obj) > i) {
                            dragging = false;
                        }
                    });
                    if (dragging===true) {
                        selected = i;
                        slides[currentSlide][i].x = mouseX - (slides[currentSlide][i].w/2);
                        slides[currentSlide][i].y = mouseY - (slides[currentSlide][i].h/2);
                    }
                }
            }
            canvas.addEventListener("mousemove", (event) => {
                if (dragging) {
                    slides[currentSlide][i].x = event.clientX - rect.left - slides[currentSlide][i].w/2;
                    slides[currentSlide][i].y = event.clientY - rect.top - slides[currentSlide][i].h/2;
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    ctx.fillStyle = slides[currentSlide][i].c;
                    slides[currentSlide].forEach((obj) => {
                        if (obj.t === "square") {
                            ctx.fillStyle = obj.c;
                            ctx.fillRect(obj.x, obj.y, obj.w, obj.h);
                        } else if (obj.t === "circle") {
                            ctx.fillStyle = obj.c;
                            ctx.beginPath();
                            ctx.arc(obj.x + obj.w/2, obj.y + obj.h/2, obj.w/2, 0, 2*Math.PI);
                            ctx.fill();
                        } else if (obj.t === "image") {
                            ctx.drawImage(obj.i, obj.x, obj.y, obj.w, obj.h);
                        } else if (obj.t === "title") {
                            ctx.fillStyle = obj.c;
                            ctx.font = "30px Arial";
                            ctx.fillText(obj.v, obj.x, obj.y+30);
                        }
                        ctx.strokeStyle = "blue";
                        ctx.lineWidth = 2;
                        ctx.strokeRect(slides[currentSlide][selected].x, slides[currentSlide][selected].y, slides[currentSlide][selected].w, slides[currentSlide][selected].h);
                        ctx.fillStyle = "blue";
                        ctx.beginPath();
                        ctx.arc(slides[currentSlide][i].x+slides[currentSlide][i].w/2, slides[currentSlide][i].y+slides[currentSlide][i].h/2, 5, 0, 2*Math.PI);
                        ctx.fill();
                    });
                    console.log("OBJ MOVE\n id:", i ,"\n x+y: ", slides[currentSlide][i].x, slides[currentSlide][i].y);
                }
            });
            canvas.addEventListener("mouseup", () => {
                if (dragging) {
                    dragging = false;
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    slides[currentSlide].forEach((obj) => {
                        if (obj.t === "square") {
                            ctx.fillStyle = obj.c;
                            ctx.fillRect(obj.x, obj.y, obj.w, obj.h);
                        } else if (obj.t === "circle") {
                            ctx.fillStyle = obj.c;
                            ctx.beginPath();
                            ctx.arc(obj.x + obj.w/2, obj.y + obj.h/2, obj.w/2, 0, 2*Math.PI);
                            ctx.fill();
                        } else if (obj.t === "image") {
                            ctx.drawImage(obj.i, obj.x, obj.y, obj.w, obj.h);
                        } else if (obj.t === "title") {
                            ctx.fillStyle = obj.c;
                            ctx.font = "30px Arial";
                            ctx.fillText(obj.v, obj.x, obj.y+30);
                        }
                        ctx.strokeStyle = "blue";
                        ctx.lineWidth = 2;
                        ctx.strokeRect(slides[currentSlide][selected].x, slides[currentSlide][selected].y, slides[currentSlide][selected].w, slides[currentSlide][selected].h);
                        ctx.fillStyle = "blue";
                        ctx.beginPath();
                        ctx.arc(slides[currentSlide][i].x+slides[currentSlide][i].w/2, slides[currentSlide][i].y+slides[currentSlide][i].h/2, 5, 0, 2*Math.PI);
                        ctx.fill();
                    });
                }
            });
        });
    }
}
function newImage(url) {
    if (!presenting) {
        var dragging = false;
        var i = 0;
        slides[currentSlide].forEach(() => {
            i++;
        });
        var img = new Image();
        img.src = url;
        slides[currentSlide].push({x: 10, y: 10, w: 100, h: 100, c: "green", t: "image", i: img});
        slides[currentSlide][i].i.onload = function() {
            ctx.drawImage(img, slides[currentSlide][i].x, slides[currentSlide][i].y, slides[currentSlide][i].w, slides[currentSlide][i].h);
        }
        canvas.addEventListener("mousedown", (event) => {
            const rect = canvas.getBoundingClientRect();
            const mouseX = event.clientX - rect.left;
            const mouseY = event.clientY - rect.top;
            if (slides[currentSlide][i] && mouseX >= slides[currentSlide][i].x && mouseX <= slides[currentSlide][i].x+slides[currentSlide][i].w && mouseY >= slides[currentSlide][i].y && mouseY <= slides[currentSlide][i].y+slides[currentSlide][i].h) {
                if (i === slides[currentSlide].length-1) {
                    dragging = true;
                    selected = i;
                    slides[currentSlide][i].x = mouseX;
                    slides[currentSlide][i].y = mouseY;
                } else {
                    var collidingObjects = [];
                    var tempObjects = [...slides[currentSlide]];
                    tempObjects.splice(i, 1);
                    dragging = true;
                    tempObjects.forEach((obj) => {
                        if (mouseX >= obj.x && mouseX <= obj.x+obj.w && mouseY >= obj.y && mouseY <= obj.y+obj.h) {
                            collidingObjects.push(obj);
                        }
                    });
                    collidingObjects.forEach((obj) => {
                        console.log(slides[currentSlide].indexOf(obj), i);
                        if (slides[currentSlide].indexOf(obj) > i) {
                            dragging = false;
                        }
                    });
                    if (dragging===true) {
                        selected = i;
                        slides[currentSlide][i].x = mouseX - (slides[currentSlide][i].w/2);
                        slides[currentSlide][i].y = mouseY - (slides[currentSlide][i].h/2);
                    }
                }
            }
            canvas.addEventListener("mousemove", (event) => {
                if (dragging) {
                    slides[currentSlide][i].x = event.clientX - rect.left - slides[currentSlide][i].w/2;
                    slides[currentSlide][i].y = event.clientY - rect.top - slides[currentSlide][i].h/2;
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    slides[currentSlide].forEach((obj) => {
                        if (obj.t === "square") {
                            ctx.fillStyle = obj.c;
                            ctx.fillRect(obj.x, obj.y, obj.w, obj.h);
                        } else if (obj.t === "circle") {
                            ctx.fillStyle = obj.c;
                            ctx.beginPath();
                            ctx.arc(obj.x + obj.w/2, obj.y + obj.h/2, obj.w/2, 0, 2*Math.PI);
                            ctx.fill();
                        } else if (obj.t === "image") {
                            ctx.drawImage(obj.i, obj.x, obj.y, obj.w, obj.h);
                        } else if (obj.t === "title") {
                            ctx.fillStyle = obj.c;
                            ctx.font = "30px Arial";
                            ctx.fillText(obj.v, obj.x, obj.y+30);
                        }
                        ctx.strokeStyle = "blue";
                        ctx.lineWidth = 2;
                        ctx.strokeRect(slides[currentSlide][selected].x, slides[currentSlide][selected].y, slides[currentSlide][selected].w, slides[currentSlide][selected].h);
                        ctx.fillStyle = "blue";
                        ctx.beginPath();
                        ctx.arc(slides[currentSlide][i].x+slides[currentSlide][i].w/2, slides[currentSlide][i].y+slides[currentSlide][i].h/2, 5, 0, 2*Math.PI);
                        ctx.fill();
                    });
                    console.log("OBJ MOVE\n id:", i ,"\n x+y: ", slides[currentSlide][i].x, slides[currentSlide][i].y);
                }
            });
            canvas.addEventListener("mouseup", () => {
                if (dragging) {
                    dragging = false;
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    slides[currentSlide].forEach((obj) => {
                        if (obj.t === "square") {
                            ctx.fillStyle = obj.c;
                            ctx.fillRect(obj.x, obj.y, obj.w, obj.h);
                        } else if (obj.t === "circle") {
                            ctx.fillStyle = obj.c;
                            ctx.beginPath();
                            ctx.arc(obj.x + obj.w/2, obj.y + obj.h/2, obj.w/2, 0, 2*Math.PI);
                            ctx.fill();
                        } else if (obj.t === "image") {
                            ctx.drawImage(obj.i, obj.x, obj.y, obj.w, obj.h);
                        }  else if (obj.t === "title") {
                            ctx.fillStyle = obj.c;
                            ctx.font = "30px Arial";
                            ctx.fillText(obj.v, obj.x, obj.y+30);
                        }
                        ctx.strokeStyle = "blue";
                        ctx.lineWidth = 2;
                        ctx.strokeRect(slides[currentSlide][selected].x, slides[currentSlide][selected].y, slides[currentSlide][selected].w, slides[currentSlide][selected].h);
                        ctx.fillStyle = "blue";
                        ctx.beginPath();
                        ctx.arc(slides[currentSlide][i].x+slides[currentSlide][i].w/2, slides[currentSlide][i].y+slides[currentSlide][i].h/2, 5, 0, 2*Math.PI);
                        ctx.fill();
                    });
                }
            });
        });
    }
}
function newTitle(title) {
    if (!presenting) {
        var dragging = false;
        var i = 0;
        slides[currentSlide].forEach(() => {
            i++;
        });
        slides[currentSlide].push({x: 10, y: 10, w: title.length*15, h: 30, t: "title", c: "black", v: title});
        ctx.fillStyle = slides[currentSlide][i].c;
        ctx.font = "30px Arial";
        ctx.fillText(slides[currentSlide][i].v, slides[currentSlide][i].x, slides[currentSlide][i].y+30);
        canvas.addEventListener("mousedown", (event) => {
            const rect = canvas.getBoundingClientRect();
            const mouseX = event.clientX - rect.left;
            const mouseY = event.clientY - rect.top;
            if (slides[currentSlide][i] && mouseX >= slides[currentSlide][i].x && mouseX <= slides[currentSlide][i].x+slides[currentSlide][i].w && mouseY >= slides[currentSlide][i].y && mouseY <= slides[currentSlide][i].y+slides[currentSlide][i].h) {
                if (i === slides[currentSlide].length-1) {
                    dragging = true;
                    selected = i;
                    slides[currentSlide][i].x = mouseX;
                    slides[currentSlide][i].y = mouseY;
                } else {
                    var collidingObjects = [];
                    var tempObjects = [...slides[currentSlide]];
                    tempObjects.splice(i, 1);
                    dragging = true;
                    tempObjects.forEach((obj) => {
                        if (mouseX >= obj.x && mouseX <= obj.x+obj.w && mouseY >= obj.y && mouseY <= obj.y+obj.h) {
                            collidingObjects.push(obj);
                        }
                    });
                    collidingObjects.forEach((obj) => {
                        console.log(slides[currentSlide].indexOf(obj), i);
                        if (slides[currentSlide].indexOf(obj) > i) {
                            dragging = false;
                        }
                    });
                    if (dragging===true) {
                        selected = i;
                        slides[currentSlide][i].x = mouseX - (slides[currentSlide][i].w/2);
                        slides[currentSlide][i].y = mouseY - (slides[currentSlide][i].h/2);
                    }
                }
            }
            canvas.addEventListener("mousemove", (event) => {
                if (dragging) {
                    slides[currentSlide][i].x = event.clientX - rect.left - slides[currentSlide][i].w/2;
                    slides[currentSlide][i].y = event.clientY - rect.top - slides[currentSlide][i].h/2;
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    slides[currentSlide].forEach((obj) => {
                        if (obj.t === "square") {
                            ctx.fillStyle = obj.c;
                            ctx.fillRect(obj.x, obj.y, obj.w, obj.h);
                        } else if (obj.t === "circle") {
                            ctx.fillStyle = obj.c;
                            ctx.beginPath();
                            ctx.arc(obj.x + obj.w/2, obj.y + obj.h/2, obj.w/2, 0, 2*Math.PI);
                            ctx.fill();
                        } else if (obj.t === "image") {
                            ctx.drawImage(obj.i, obj.x, obj.y, obj.w, obj.h);
                        } else if (obj.t === "title") {
                            ctx.fillStyle = obj.c;
                            ctx.font = "30px Arial";
                            ctx.fillText(obj.v, obj.x, obj.y+30);
                        }
                        ctx.strokeStyle = "blue";
                        ctx.lineWidth = 2;
                        ctx.strokeRect(slides[currentSlide][selected].x, slides[currentSlide][selected].y, slides[currentSlide][selected].w, slides[currentSlide][selected].h);
                        ctx.fillStyle = "blue";
                        ctx.beginPath();
                        ctx.arc(slides[currentSlide][i].x+slides[currentSlide][i].w/2, slides[currentSlide][i].y+slides[currentSlide][i].h/2, 5, 0, 2*Math.PI);
                        ctx.fill();
                    });
                    console.log("OBJ MOVE\n id:", i ,"\n x+y: ", slides[currentSlide][i].x, slides[currentSlide][i].y);
                }
            });
            canvas.addEventListener("mouseup", () => {
                if (dragging) {
                    dragging = false;
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    slides[currentSlide].forEach((obj) => {
                        if (obj.t === "square") {
                            ctx.fillStyle = obj.c;
                            ctx.fillRect(obj.x, obj.y, obj.w, obj.h);
                        } else if (obj.t === "circle") {
                            ctx.fillStyle = obj.c;
                            ctx.beginPath();
                            ctx.arc(obj.x + obj.w/2, obj.y + obj.h/2, obj.w/2, 0, 2*Math.PI);
                            ctx.fill();
                        } else if (obj.t === "image") {
                            ctx.drawImage(obj.i, obj.x, obj.y, obj.w, obj.h);
                        }  else if (obj.t === "title") {
                            ctx.fillStyle = obj.c;
                            ctx.font = "30px Arial";
                            ctx.fillText(obj.v, obj.x, obj.y+30);
                        }
                        ctx.strokeStyle = "blue";
                        ctx.lineWidth = 2;
                        ctx.strokeRect(slides[currentSlide][selected].x, slides[currentSlide][selected].y, slides[currentSlide][selected].w, slides[currentSlide][selected].h);
                        ctx.fillStyle = "blue";
                        ctx.beginPath();
                        ctx.arc(slides[currentSlide][i].x+slides[currentSlide][i].w/2, slides[currentSlide][i].y+slides[currentSlide][i].h/2, 5, 0, 2*Math.PI);
                        ctx.fill();
                    });
                }
            });
        });
    }
}
document.getElementById("squareBtn").addEventListener("click", async () => {
    newSquare();
});
document.getElementById("circleBtn").addEventListener("click", async () => {
    newCircle();
});
document.getElementById("urlConfirm").addEventListener("click", async () => {
    var url = document.getElementById("urlInput").value;
    newImage(url);
});
document.getElementById("clearBtn").addEventListener("click", async () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    slides[currentSlide] = [];
});
document.getElementById("titleConfirm").addEventListener("click", async () => {
    var title = document.getElementById("titleInput").value;
    newTitle(title);
});
document.getElementById("deselectBtn").addEventListener("click", async () => {
    selected = null;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    slides[currentSlide].forEach((obj) => {
        if (obj.t === "square") {
            ctx.fillStyle = obj.c;
            ctx.fillRect(obj.x, obj.y, obj.w, obj.h);
        } else if (obj.t === "circle") {
            ctx.fillStyle = obj.c;
            ctx.beginPath();
            ctx.arc(obj.x + obj.w/2, obj.y + obj.h/2, obj.w/2, 0, 2*Math.PI);
            ctx.fill();
        } else if (obj.t === "image") {
            ctx.drawImage(obj.i, obj.x, obj.y, obj.w, obj.h);
        } else if (obj.t === "title") {
            ctx.fillStyle = obj.c;
            ctx.font = "30px Arial";
            ctx.fillText(obj.v, obj.x, obj.y+30);
        }
    });
});
// snatched from https://gist.github.com/krabs-github/ec56e4f1c12cddf86ae9c551aa9d9e04
// thanks lol :))))))))))))
function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}
document.getElementById("colorPickerConfirm").addEventListener("click", async () => {
    color = document.getElementById("colorPickerInput").value;
    color = hexToRgb(color);
    if (selected!==null)
        slides[currentSlide][selected].c = `rgb(${color.r}, ${color.g}, ${color.b})`;
    document.getElementById("colorPickerIcon").style.color = `rgb(${color.r}, ${color.g}, ${color.b})`;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    slides[currentSlide].forEach((obj) => {
        if (obj.t === "square") {
            ctx.fillStyle = obj.c;
            ctx.fillRect(obj.x, obj.y, obj.w, obj.h);
        } else if (obj.t === "circle") {
            ctx.fillStyle = obj.c;
            ctx.beginPath();
            ctx.arc(obj.x + obj.w/2, obj.y + obj.h/2, obj.w/2, 0, 2*Math.PI);
            ctx.fill();
        } else if (obj.t === "image") {
            ctx.drawImage(obj.i, obj.x, obj.y, obj.w, obj.h);
        } else if (obj.t === "title") {
            ctx.fillStyle = obj.c;
            ctx.font = "30px Arial";
            ctx.fillText(obj.v, obj.x, obj.y+30);
        }
    });
    if (selected!==null) {
        ctx.strokeStyle = "blue";
        ctx.lineWidth = 2;
        ctx.strokeRect(slides[currentSlide][selected].x, slides[currentSlide][selected].y, slides[currentSlide][selected].w, slides[currentSlide][selected].h);
        ctx.fillStyle = "blue";
        ctx.beginPath();
        ctx.arc(slides[currentSlide][selected].x+slides[currentSlide][selected].w/2, slides[currentSlide][selected].y+slides[currentSlide][selected].h/2, 5, 0, 2*Math.PI);
        ctx.fill();
    }
    console.log("%c COLOR CHANGE", `color: rgb(${color.r}, ${color.g}, ${color.b});`);
});
document.getElementById("presentBtn").addEventListener("click", async () => {
    if (selected!==null) {
        selected = null;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        slides[currentSlide].forEach((obj) => {
            if (obj.t === "square") {
                ctx.fillStyle = obj.c;
                ctx.fillRect(obj.x, obj.y, obj.w, obj.h);
            } else if (obj.t === "circle") {
                ctx.fillStyle = obj.c;
                ctx.beginPath();
                ctx.arc(obj.x + obj.w/2, obj.y + obj.h/2, obj.w/2, 0, 2*Math.PI);
                ctx.fill();
            } else if (obj.t === "image") {
                ctx.drawImage(obj.i, obj.x, obj.y, obj.w, obj.h);
            } else if (obj.t === "title") {
                ctx.fillStyle = obj.c;
                ctx.font = "30px Arial";
                ctx.fillText(obj.v, obj.x, obj.y+30);
            }
        });
    }
    presenting = true;
    document.getElementById("editor").requestFullscreen();
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    console.log("PRESENT ENTER\n presenting:", presenting);
});
document.getElementById("editor").addEventListener("fullscreenchange", () => {
    if (!document.fullscreenElement) {
        presenting = false;
        console.log("PRESENT EXIT\n presenting:", presenting);
    }
});
document.getElementById("debugBtn").addEventListener("click", async () => {
    console.log("DEBUG INFO\n array: ", slides, "\n current slide: ", currentSlide, "\n selected: ", selected, "\n presenting: ", presenting);
    if (selected!==null) {
        console.log("SELECTED OBJ INFO\n x+y:",slides[currentSlide][selected].x, slides[currentSlide][selected].y, "\n w+h:", slides[currentSlide][selected].w, slides[currentSlide][selected].h, "\n color:", slides[currentSlide][selected].c, "\n type:", slides[currentSlide][selected].t);
        if (slides[currentSlide][selected].t === "title") {
            console.log("SELECTED OBJ IS OF TYPE TITLE\nTITLE INFO\n value:", slides[currentSlide][selected].v);
        }
    }
});