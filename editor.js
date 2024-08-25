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
var objects = [];
var selected = null;
var color = "red";
var presenting = false;
function newSquare() {
    if (!presenting) {
        var dragging = false;
        var i = 0;
        objects.forEach(() => {
            i++;
        });
        objects.push({x: 10, y: 10, w: 100, h: 100, c: "red", t: "square"});
        ctx.fillStyle = objects[i].c;
        ctx.fillRect(objects[i].x, objects[i].y, objects[i].w, objects[i].h);
        canvas.addEventListener("mousedown", (event) => {
            var ogW = objects[i].w;
            var ogH = objects[i].h;
            var ogX = objects[i].x;
            var ogY = objects[i].y;
            const rect = canvas.getBoundingClientRect();
            const mouseX = event.clientX - rect.left;
            const mouseY = event.clientY - rect.top;
            if (objects[i] && mouseX >= objects[i].x+5 && mouseX <= objects[i].x+objects[i].w-5 && mouseY >= objects[i].y+5 && mouseY <= objects[i].y+objects[i].h-5) {
                if (i === objects.length-1) {
                    dragging = true;
                    selected = i;
                    objects[i].x = mouseX - (objects[i].w/2);
                    objects[i].y = mouseY - (objects[i].h/2);
                } else {
                    var collidingObjects = [];
                    var tempObjects = [...objects];
                    tempObjects.splice(i, 1);
                    dragging = true;
                    tempObjects.forEach((obj) => {
                        if (mouseX >= obj.x && mouseX <= obj.x+obj.w && mouseY >= obj.y && mouseY <= obj.y+obj.h) {
                            collidingObjects.push(obj);
                        }
                    });
                    collidingObjects.forEach((obj) => {
                        console.log(objects.indexOf(obj), i);
                        if (objects.indexOf(obj) > i) {
                            dragging = false;
                        }
                    });
                    if (dragging===true) {
                        selected = i;
                        objects[i].x = mouseX - (objects[i].w/2);
                        objects[i].y = mouseY - (objects[i].h/2);
                    }
                }
            }
            canvas.addEventListener("mousemove", (event) => {
                if (dragging) {
                    objects[i].x = event.clientX - rect.left - objects[i].w/2;
                    objects[i].y = event.clientY - rect.top - objects[i].h/2;
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    ctx.fillStyle = objects[i].c;
                    ctx.fillRect(objects[i].x, objects[i].y, objects[i].w, objects[i].h);
                    objects.forEach((obj) => {
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
                        ctx.strokeRect(objects[selected].x, objects[selected].y, objects[selected].w, objects[selected].h);
                        ctx.fillStyle = "blue";
                        ctx.beginPath();
                        ctx.arc(objects[i].x+objects[i].w/2, objects[i].y+objects[i].h/2, 5, 0, 2*Math.PI);
                        ctx.fill();
                    });
                    console.log(i ,objects[i].x, objects[i].y);
                }
            });
            canvas.addEventListener("mouseup", () => {
                if (dragging) {
                    dragging = false;
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    objects.forEach((obj) => {
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
                        ctx.strokeRect(objects[selected].x, objects[selected].y, objects[selected].w, objects[selected].h);
                        ctx.fillStyle = "blue";
                        ctx.beginPath();
                        ctx.arc(objects[i].x+objects[i].w/2, objects[i].y+objects[i].h/2, 5, 0, 2*Math.PI);
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
        objects.forEach(() => {
            i++;
        });
        objects.push({x: 10, y: 10, w: 100, h: 100, c: "blue", t: "circle"});
        ctx.fillStyle = objects[i].c;
        ctx.beginPath();
        ctx.arc(objects[i].x + objects[i].w/2, objects[i].y + objects[i].h/2, objects[i].w/2, 0, 2*Math.PI);
        ctx.fill();
        canvas.addEventListener("mousedown", (event) => {
            const rect = canvas.getBoundingClientRect();
            const mouseX = event.clientX - rect.left;
            const mouseY = event.clientY - rect.top;
            if (objects[i] && mouseX >= objects[i].x && mouseX <= objects[i].x+objects[i].w && mouseY >= objects[i].y && mouseY <= objects[i].y+objects[i].h) {
                if (i === objects.length-1) {
                    dragging = true;
                    selected = i;
                    objects[i].x = mouseX - (objects[i].w/2);
                    objects[i].y = mouseY - (objects[i].h/2);
                } else {
                    var collidingObjects = [];
                    var tempObjects = [...objects];
                    tempObjects.splice(i, 1);
                    dragging = true;
                    tempObjects.forEach((obj) => {
                        if (mouseX >= obj.x && mouseX <= obj.x+obj.w && mouseY >= obj.y && mouseY <= obj.y+obj.h) {
                            collidingObjects.push(obj);
                        }
                    });
                    collidingObjects.forEach((obj) => {
                        console.log(objects.indexOf(obj), i);
                        if (objects.indexOf(obj) > i) {
                            dragging = false;
                        }
                    });
                    if (dragging===true) {
                        selected = i;
                        objects[i].x = mouseX - (objects[i].w/2);
                        objects[i].y = mouseY - (objects[i].h/2);
                    }
                }
            }
            canvas.addEventListener("mousemove", (event) => {
                if (dragging) {
                    objects[i].x = event.clientX - rect.left - objects[i].w/2;
                    objects[i].y = event.clientY - rect.top - objects[i].h/2;
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    ctx.fillStyle = objects[i].c;
                    objects.forEach((obj) => {
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
                        ctx.strokeRect(objects[selected].x, objects[selected].y, objects[selected].w, objects[selected].h);
                        ctx.fillStyle = "blue";
                        ctx.beginPath();
                        ctx.arc(objects[i].x+objects[i].w/2, objects[i].y+objects[i].h/2, 5, 0, 2*Math.PI);
                        ctx.fill();
                    });
                    console.log(objects[i].x, objects[i].y);
                }
            });
            canvas.addEventListener("mouseup", () => {
                if (dragging) {
                    dragging = false;
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    objects.forEach((obj) => {
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
                        ctx.strokeRect(objects[selected].x, objects[selected].y, objects[selected].w, objects[selected].h);
                        ctx.fillStyle = "blue";
                        ctx.beginPath();
                        ctx.arc(objects[i].x+objects[i].w/2, objects[i].y+objects[i].h/2, 5, 0, 2*Math.PI);
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
        objects.forEach(() => {
            i++;
        });
        var img = new Image();
        img.src = url;
        objects.push({x: 10, y: 10, w: 100, h: 100, c: "green", t: "image", i: img});
        objects[i].i.onload = function() {
            ctx.drawImage(img, objects[i].x, objects[i].y, objects[i].w, objects[i].h);
        }
        canvas.addEventListener("mousedown", (event) => {
            const rect = canvas.getBoundingClientRect();
            const mouseX = event.clientX - rect.left;
            const mouseY = event.clientY - rect.top;
            if (objects[i] && mouseX >= objects[i].x && mouseX <= objects[i].x+objects[i].w && mouseY >= objects[i].y && mouseY <= objects[i].y+objects[i].h) {
                if (i === objects.length-1) {
                    dragging = true;
                    selected = i;
                    objects[i].x = mouseX;
                    objects[i].y = mouseY;
                } else {
                    var collidingObjects = [];
                    var tempObjects = [...objects];
                    tempObjects.splice(i, 1);
                    dragging = true;
                    tempObjects.forEach((obj) => {
                        if (mouseX >= obj.x && mouseX <= obj.x+obj.w && mouseY >= obj.y && mouseY <= obj.y+obj.h) {
                            collidingObjects.push(obj);
                        }
                    });
                    collidingObjects.forEach((obj) => {
                        console.log(objects.indexOf(obj), i);
                        if (objects.indexOf(obj) > i) {
                            dragging = false;
                        }
                    });
                    if (dragging===true) {
                        selected = i;
                        objects[i].x = mouseX - (objects[i].w/2);
                        objects[i].y = mouseY - (objects[i].h/2);
                    }
                }
            }
            canvas.addEventListener("mousemove", (event) => {
                if (dragging) {
                    objects[i].x = event.clientX - rect.left - objects[i].w/2;
                    objects[i].y = event.clientY - rect.top - objects[i].h/2;
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    objects.forEach((obj) => {
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
                        ctx.strokeRect(objects[selected].x, objects[selected].y, objects[selected].w, objects[selected].h);
                        ctx.fillStyle = "blue";
                        ctx.beginPath();
                        ctx.arc(objects[i].x+objects[i].w/2, objects[i].y+objects[i].h/2, 5, 0, 2*Math.PI);
                        ctx.fill();
                    });
                    console.log(objects[i].x, objects[i].y);
                }
            });
            canvas.addEventListener("mouseup", () => {
                if (dragging) {
                    dragging = false;
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    objects.forEach((obj) => {
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
                        ctx.strokeRect(objects[selected].x, objects[selected].y, objects[selected].w, objects[selected].h);
                        ctx.fillStyle = "blue";
                        ctx.beginPath();
                        ctx.arc(objects[i].x+objects[i].w/2, objects[i].y+objects[i].h/2, 5, 0, 2*Math.PI);
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
        objects.forEach(() => {
            i++;
        });
        objects.push({x: 10, y: 10, w: title.length*15, h: 30, t: "title", c: "black", v: title});
        ctx.fillStyle = objects[i].c;
        ctx.font = "30px Arial";
        ctx.fillText(objects[i].v, objects[i].x, objects[i].y+30);
        canvas.addEventListener("mousedown", (event) => {
            const rect = canvas.getBoundingClientRect();
            const mouseX = event.clientX - rect.left;
            const mouseY = event.clientY - rect.top;
            if (objects[i] && mouseX >= objects[i].x && mouseX <= objects[i].x+objects[i].w && mouseY >= objects[i].y && mouseY <= objects[i].y+objects[i].h) {
                if (i === objects.length-1) {
                    dragging = true;
                    selected = i;
                    objects[i].x = mouseX;
                    objects[i].y = mouseY;
                } else {
                    var collidingObjects = [];
                    var tempObjects = [...objects];
                    tempObjects.splice(i, 1);
                    dragging = true;
                    tempObjects.forEach((obj) => {
                        if (mouseX >= obj.x && mouseX <= obj.x+obj.w && mouseY >= obj.y && mouseY <= obj.y+obj.h) {
                            collidingObjects.push(obj);
                        }
                    });
                    collidingObjects.forEach((obj) => {
                        console.log(objects.indexOf(obj), i);
                        if (objects.indexOf(obj) > i) {
                            dragging = false;
                        }
                    });
                    if (dragging===true) {
                        selected = i;
                        objects[i].x = mouseX - (objects[i].w/2);
                        objects[i].y = mouseY - (objects[i].h/2);
                    }
                }
            }
            canvas.addEventListener("mousemove", (event) => {
                if (dragging) {
                    objects[i].x = event.clientX - rect.left - objects[i].w/2;
                    objects[i].y = event.clientY - rect.top - objects[i].h/2;
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    objects.forEach((obj) => {
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
                        ctx.strokeRect(objects[selected].x, objects[selected].y, objects[selected].w, objects[selected].h);
                        ctx.fillStyle = "blue";
                        ctx.beginPath();
                        ctx.arc(objects[i].x+objects[i].w/2, objects[i].y+objects[i].h/2, 5, 0, 2*Math.PI);
                        ctx.fill();
                    });
                    console.log(objects[i].x, objects[i].y);
                }
            });
            canvas.addEventListener("mouseup", () => {
                if (dragging) {
                    dragging = false;
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    objects.forEach((obj) => {
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
                        ctx.strokeRect(objects[selected].x, objects[selected].y, objects[selected].w, objects[selected].h);
                        ctx.fillStyle = "blue";
                        ctx.beginPath();
                        ctx.arc(objects[i].x+objects[i].w/2, objects[i].y+objects[i].h/2, 5, 0, 2*Math.PI);
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
    objects = [];
});
document.getElementById("titleConfirm").addEventListener("click", async () => {
    var title = document.getElementById("titleInput").value;
    newTitle(title);
});
document.getElementById("deselectBtn").addEventListener("click", async () => {
    selected = null;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    objects.forEach((obj) => {
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
        objects[selected].c = `rgb(${color.r}, ${color.g}, ${color.b})`;
    document.getElementById("colorPickerIcon").style.color = `rgb(${color.r}, ${color.g}, ${color.b})`;
    console.log(document.getElementById("colorPickerIcon").style.color);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    objects.forEach((obj) => {
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
        ctx.strokeRect(objects[selected].x, objects[selected].y, objects[selected].w, objects[selected].h);
        ctx.fillStyle = "blue";
        ctx.beginPath();
        ctx.arc(objects[i].x+objects[i].w/2, objects[i].y+objects[i].h/2, 5, 0, 2*Math.PI);
        ctx.fill();
    }
});
document.getElementById("presentBtn").addEventListener("click", async () => {
    if (selected!==null) {
        selected = null;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        objects.forEach((obj) => {
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
});
document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        if (presenting) {
            presenting = false;
            document.exitFullscreen();
        }
    }
});