import express from "express";
import path from "path"
import { fileURLToPath } from 'url';
import { dirname as pathDirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = pathDirname(__filename);
const router = express.Router()

router.get(['/', '/index.html', '/index'], (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'index.html'));
});

router.get(['/new-page', 'new-page.html'], (req, res)=> {
    res.sendFile(path.join(__dirname, '..', 'views', 'new-page.html'))
})

router.get(['/old-page', 'old-page.html'], (req, res)=> {
    res.redirect(301, 'new-page.html') // 302 by default
})
export default router;