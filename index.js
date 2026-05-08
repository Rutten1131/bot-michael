const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

// CONFIGURACIÓN
const EVOLUTION_API_URL = "http://129.153.116.213:8080";
const EVOLUTION_API_KEY = "42a447c1-3d74-4b52-9571-042c174f7621";
const EVOLUTION_INSTANCE = "Bot michael";
const MY_NUMBER = "593983237491"; // Tu número sin el +

// FUNCIÓN PARA ENVIAR EL MENÚ DE LISTA
async function enviarMenu(remoteJid) {
    const number = remoteJid.split('@')[0];
    
    try {
        console.log(`Intentando enviar mensaje a: ${number}`);
        
        // PRUEBA 1: Enviar texto simple para confirmar conexión
        await axios.post(`${EVOLUTION_API_URL}/message/sendText/${EVOLUTION_INSTANCE}`, {
            "number": number,
            "text": "✅ Conexión exitosa. Ahora intentaré enviarte el menú..."
        }, { headers: { 'apikey': EVOLUTION_API_KEY } });

        // PRUEBA 2: Enviar la lista (formato ultra-simplificado)
        await axios.post(`${EVOLUTION_API_URL}/message/sendList/${EVOLUTION_INSTANCE}`, {
            "number": number,
            "title": "Menú Bot Michael",
            "description": "Elige una opción:",
            "buttonText": "Ver opciones",
            "sections": [
                {
                    "title": "Opciones",
                    "rows": [
                        { "title": "Precios", "rowId": "1" },
                        { "title": "Soporte", "rowId": "2" }
                    ]
                }
            ]
        }, {
            headers: { 'apikey': EVOLUTION_API_KEY }
        });
        
        console.log(`✅ Todo enviado correctamente a ${number}`);
    } catch (error) {
        console.error("❌ ERROR DETALLADO:");
        if (error.response) {
            console.error(JSON.stringify(error.response.data, null, 2));
        } else {
            console.error(error.message);
        }
    }
}

// WEBHOOK: Aquí llega el mensaje
app.post('/webhook', async (req, res) => {
    const data = req.body;

    // Solo nos interesan los mensajes nuevos (upsert)
    if (data.event === 'messages.upsert') {
        const remoteJid = data.data.key.remoteJid; // El ID del que envía
        
        // FILTRO DE SEGURIDAD CRÍTICO:
        // 1. Debe contener tu número
        // 2. NO debe ser un grupo (@g.us)
        if (remoteJid.includes(MY_NUMBER) && !remoteJid.includes('@g.us')) {
            await enviarMenu(remoteJid);
        }
    }

    res.sendStatus(200);
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`\n✅ BOT CONFIGURADO CORRECTAMENTE`);
    console.log(`🎯 Solo responderá a: ${MY_NUMBER}`);
    console.log(`🤫 Para los demás, el bot será invisible.`);
});
