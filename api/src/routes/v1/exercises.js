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

router.get("/:id/ui", (req, res) => {
    const { id } = req.params;
    let lookupExercise = searchExerciseById(id);

    if (!lookupExercise) {
        return res.status(404).json({ error: true, message: "Exercise not found" });
    }

    return res.status(200).send(`
        <html>
            <head>
                <title>Exercise Preview - ${lookupExercise.name}</title>
            </head>
            <body>
                <h1>${lookupExercise.name}</h1>
                ${(() => {
                    const instr = (lookupExercise.instructions && lookupExercise.instructions.length)
                        ? "- " + lookupExercise.instructions.join("\n- ")
                        : "N/A";
                    return `<pre style="white-space: pre-wrap; font-family: inherit;">${instr}</pre>`;
                })()}
                <p>Muscles: ${lookupExercise.primaryMuscles ? lookupExercise.primaryMuscles.join(", ") : "N/A"}</p>
                <p>Secondary Muscles: ${lookupExercise.secondaryMuscles ? lookupExercise.secondaryMuscles.join(", ") : "N/A"}</p>
                <p>Level: ${lookupExercise.level || "N/A"}</p>
                <p>Equipment: ${lookupExercise.equipment ? lookupExercise.equipment : "N/A"}</p>
                <h2>Media</h2>
                ${(() => {
                    const media = lookupExercise.media || {};
                    // Support both array form and object form {"image1": "/v1/...", "gif": "/v1/...gif"}
                    const entries = Array.isArray(media)
                        ? media.map(m => ({ title: m.title || 'Image', url: m.url || m }))
                        : Object.entries(media).map(([key, url]) => ({ title: key, url }));
                    if (!entries.length) return '<p>No media available</p>';
                    return entries.reverse().map(item => {
                        const url = item.url;
                        const title = item.title || 'Image';
                        const ext = (url.split('.').pop() || '').toLowerCase();
                        // only jpg and gif expected
                        return `<div>
                                    <img src="${url}" alt="${title}" style="max-width: 400px;"/>
                                </div>`;
                    }).join('');
                })()}
            </body>
        </html>
    `);
});

module.exports = router;