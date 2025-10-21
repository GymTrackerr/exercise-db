const path = require("path");
const fs = require("fs");
const { exec } = require('child_process');

const gifDir = path.join(process.cwd(), "../gifs");


function ifGifExists(id) {
    const gifPath = path.join(gifDir, `${id}.gif`);
    return fs.existsSync(gifPath) ? gifPath : null;
}

// function loadImages(id) {
//     const dir = path.join(process.cwd(), "../exercises", id);
//     const images = (exercise.images || []).map(img => path.join(dir, path.basename(img)));

//     if (!images.every(fs.existsSync))
//         return { error: "Images missing" };

//     return images;
// }

function loadImages(id) {
    const dir = path.join(process.cwd(), "../exercises", id);
    if (!fs.existsSync(dir)) throw new Error(`Exercise folder not found: ${id}`);

    const files = fs.readdirSync(dir)
        .filter(f => f.endsWith(".jpg"))
        .sort(); // ensure correct order

    return files.map(f => path.join(dir, f));
}


async function makeGif(id) {
    // Check if GIF already exists
    const existingGif = ifGifExists(id);
    if (existingGif) return {exists: true, path: existingGif};

    // Load images
    const images = loadImages(id);
    if (!images.length) throw new Error("No images found for GIF");

    // Ensure GIF directory exists
    fs.mkdirSync(gifDir, { recursive: true });

    const outputName = `${id}.gif`;
    const gifPath = path.join(gifDir, outputName);

    // FFmpeg temp input list
    const listPath = path.join(gifDir, `${id}.txt`);
    const listContent = images.map(img => `file '${img}'\nduration 1`).join("\n");
    fs.writeFileSync(listPath, listContent + "\n");

    // FFmpeg command
    const gifCommand = `ffmpeg -y -f concat -safe 0 -i "${listPath}" -vf "scale=600:-1:flags=lanczos,fps=1" "${gifPath}"`;

    // Execute FFmpeg
    await new Promise((resolve, reject) => {
        exec(gifCommand, (error, stdout, stderr) => {
            if (error) return reject(error);


            resolve();
        });
    });

    // delete temp list file 
    fs.unlinkSync(listPath);

    return {"created": true, "path": gifPath};
}

module.exports = {makeGif};