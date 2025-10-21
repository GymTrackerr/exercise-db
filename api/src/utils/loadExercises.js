const fs = require("fs");
const path = require("path");

// const { dataDir } = require("./dataDir");
const { makeGif } = require("./makeGif");

var foundExercises = false;
var exerciseCache = null;

const dataDir = path.join(process.cwd(), "../exercises");

function loadExercises() {
    if (foundExercises && exerciseCache) return exerciseCache;

    const files = fs.readdirSync(dataDir).filter(f => f.endsWith(".json"));
    exerciseCache = files.map(f => {
        const content = fs.readFileSync(path.join(dataDir, f), "utf8");
        console.log(`REMOVE: Loading exercise file: ${f}`);

        try {
            let exrData = {
                id: f.replace(".json", ""),
                ...JSON.parse(content)
            }
            return exrData;
        } catch (e) {
            console.error(`Error parsing ${f}:`, e.message);
            return null;
        }
    }).filter(Boolean);

    foundExercises = true;
    return exerciseCache;
}

function searchExerciseById(id) {
    const filePath = path.join(dataDir, `${id}.json`);

    if (!fs.existsSync(filePath))
        return null;

    const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
    const mediaPath = "/v1/static/" + id + "/";

    const mediaPaths = data.images ? {
        image1: mediaPath + "image1.jpg",
        image2: mediaPath + "image2.jpg",
        gif: mediaPath + "animation.gif"
    } : {};

    const exerciseData = {
        id: id,
        media: mediaPaths ? mediaPaths : null,
        ...data
    };
    return exerciseData;
}


async function loadStaticAssetByIdAndType(id, type) {
    const dir = path.join(process.cwd(), "../exercises", id);
    type = type.toLowerCase();
    type = type.replace(".jpg", "").replace(".gif", "");

    switch (type) {
        case "image1":
            return path.join(dir, "0.jpg")
        case "image2":
            return path.join(dir, "1.jpg")
        case "animation": 
            const getAndMakeGif = await makeGif(id)
            console.log("GIF Path:", getAndMakeGif);
            return getAndMakeGif ? getAndMakeGif.path ? getAndMakeGif.path : null : null;
        default:
            return null;
    }
}

module.exports = { loadExercises, searchExerciseById, loadStaticAssetByIdAndType };