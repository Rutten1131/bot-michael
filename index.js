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
    // Limpiamos el JID para que solo sea el número (Evolution v2 lo prefiere así)
    const number = remoteJid.split('@')[0];
    
    try {
        await axios.post(`${EVOLUTION_API_URL}/message/sendList/${EVOLUTION_INSTANCE}`, {
            "number": number,
            "title": "🤖 Menú Bot Michael",
            "description": "¡Hola! Este es el menú de prueba elegante.",
            "buttonText": "Haz clic para ver opciones",
            "footer": "Prueba Exclusiva",
            "sections": [
                {
                    "title": "Opciones de Prueba",
                    "rows": [
                        { "title": "💰 Ver Precios", "rowId": "op_precios", "description": "Consulta nuestras tarifas" },
                        { "title": "⚙️ Soporte", "rowId": "op_soporte", "description": "Ayuda técnica inmediata" },
                        { "title": "💬 DeepSeek AI", "rowId": "op_ai", "description": "Hablar con la inteligencia artificial" }
                    ]
                }
            ]
        }, {
            headers: { 'apikey': EVOLUTION_API_KEY }
        });
        console.log(`✅ Menú enviado a ${number}`);
    } catch (error) {
        console.error("❌ Error al enviar:", error.response ? error.response.data : error.message);
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
