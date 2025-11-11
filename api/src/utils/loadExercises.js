const fs = require("fs");
const path = require("path");

// const { dataDir } = require("./dataDir");
const { makeGif } = require("./makeGif");

var foundExercises = false;
var exerciseCache = null;

const dataDir = path.join(process.cwd(), "../exercises");
const mediaPathBase = "/v1/static/"

function loadExercises() {
    if (foundExercises && exerciseCache) return exerciseCache;

    const files = fs.readdirSync(dataDir).filter(f => f.endsWith(".json"));
    exerciseCache = files.map(f => {
        var content = fs.readFileSync(path.join(dataDir, f), "utf8");
        console.log(`REMOVE: Loading exercise file: ${f}`);
        var id = f.replace(".json", "")
        var mediaPath = mediaPathBase + id;
        try {
            content = JSON.parse(content);
            
            const mediaPaths = content.images ? [
                
                mediaPath + "/image1.jpg",
                mediaPath + "/image2.jpg",
                mediaPath + "/animation.gif"
            ] : [];

            content.images = mediaPaths || [];

            let exrData = {
                id,
                ...content
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

    var data = JSON.parse(fs.readFileSync(filePath, "utf8"));
    // const mediaPath = "/v1/static/" + id + "/";
    var mediaPath = mediaPathBase + id;

    const mediaPaths = data.images ? {
        image1: mediaPath + "/image1.jpg",
        image2: mediaPath + "/image2.jpg",
        gif: mediaPath + "/animation.gif"
    } : {};

    data.images = mediaPaths || [];

    const exerciseData = {
        id: id,
        // media: mediaPaths ? mediaPaths : null,
        ...data
    };
    return exerciseData;
}


async function loadStaticAssetByIdAndType(id, type) {
    const dir = path.join(process.cwd(), "../exercises", id);
    type = type.toLowerCase();
    type = type.replace(".jpg", "").replace(".gif", "");

    switch (type) {
        case "0":
        case "image1":
            return path.join(dir, "0.jpg")
        case "1": 
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