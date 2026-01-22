import express from "express";
import path from "path"
import { fileURLToPath } from 'url';
import { dirname as pathDirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = pathDirname(__filename);
const router = express.Router()

router.get(['/', '/index.html', '/index'], (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'subdir', 'index.html'));
});

router.get(['/test.html', '/test'], (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'subdir', 'test.html'));
});

export default router;