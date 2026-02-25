const express = require("express");
const router = express.Router();
const Attack = require("../models/Attack");
const { spawn } = require("child_process");

router.post("/scan", async (req, res) => {
    try {
        const { ip, url, responseCode } = req.body;

        const python = spawn("python", ["../python-engine/scanner.py"]);

        let resultData = "";

        python.stdin.write(JSON.stringify({ url }));
        python.stdin.end();

        python.stdout.on("data", async (data) => {
            resultData += data.toString();
        });

        python.on("close", async () => {
            const result = JSON.parse(resultData);

            const newAttack = new Attack({
                ip,
                url,
                attackType: result.attackType,
                severity: result.severity,
                responseCode,
                status: responseCode === 200 ? "Successful" : "Attempt"
            });

            await newAttack.save();

            res.json({
                message: "Scan Complete",
                ...result
            });
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;