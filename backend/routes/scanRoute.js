const express = require("express");
const router = express.Router();
const Attack = require("../models/Attack");

router.post("/scan", async (req, res) => {
    try {
        const { ip, url, responseCode } = req.body;

        let attackType = "Normal";
        let severity = "Low";

        // Basic Rule Detection
        if (url.includes("UNION SELECT") || url.includes("OR 1=1")) {
            attackType = "SQL Injection";
            severity = "High";
        } 
        else if (url.includes("<script>")) {
            attackType = "XSS";
            severity = "High";
        } 
        else if (url.includes("../")) {
            attackType = "Directory Traversal";
            severity = "Medium";
        }

        const newAttack = new Attack({
            ip,
            url,
            attackType,
            severity,
            responseCode,
            status: responseCode === 200 ? "Successful" : "Attempt"
        });

        await newAttack.save();

        res.json({
            message: "Scan Complete",
            attackType,
            severity
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
module.exports = router;