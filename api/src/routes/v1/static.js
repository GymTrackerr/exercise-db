const router = require("express").Router();
const { loadStaticAssetByIdAndType } = require("../../utils/loadExercises");

router.get("/:id/:type", async (req, res) => {
    const { id, type } = req.params;
    console.log(`Requested static asset: ${id} - ${type}`);

    const foundAssetPath = await loadStaticAssetByIdAndType(id, type);

    console.log(`Found asset path: ${foundAssetPath}`);
    if (!foundAssetPath) {
        return res.status(404).json({ error: true, message: "Asset not found" });
    }

    return res.sendFile(foundAssetPath);
});

module.exports = router;