const express = require('express');
const cors = require('cors');
const ytdl = require('@distube/ytdl-core');
const app = express();

app.use(cors());

app.get('/download', async (req, res) => {
    try {
        const videoURL = req.query.url;
        const title = req.query.title || 'audio';
        
        res.header('Content-Disposition', `attachment; filename="${title}.mp3"`);
        
        ytdl(videoURL, { filter: 'audioonly', quality: 'highestaudio' })
            .pipe(res);
            
    } catch (err) {
        console.error(err);
        res.status(500).send('Error en la descarga');
    }
});

app.listen(4000, () => {
    console.log('✅ SERVIDOR LISTO EN PUERTO 4000');
});