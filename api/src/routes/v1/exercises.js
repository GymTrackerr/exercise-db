const router = require("express").Router();
const { loadExercises, searchExerciseById } = require("../../utils/loadExercises");

router.get("/", (req, res) => {
    let allData = loadExercises();

    return res.status(200).json(allData);
});

router.get("/:id", (req, res) => {
    const { id } = req.params;
    let lookupExercise = searchExerciseById(id);

    if (!lookupExercise) {
        return res.status(404).json({ error: true, message: "Exercise not found" });
    }

    return res.status(200).json(lookupExercise);
});

module.exports = router;