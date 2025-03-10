const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

async function getCNPJInfo(cnpj) {
    try {
        const response = await axios.get(`https://www.receitaws.com.br/v1/cnpj/${cnpj}`);
        return response.data;
    } catch (error) {
        return { error: 'Erro ao buscar informações do CNPJ. Verifique o número e tente novamente.' };
    }
}


const gerarPDF = require('./gerarPDF');
app.post('/api/osint', async (req, res) => {
    const { cnpj } = req.body;
    if (!cnpj) return res.status(400).json({ error: 'CNPJ é obrigatório' });

    const cnpjData = await getCNPJInfo(cnpj);

    if (!cnpjData.error) {
        gerarPDF(cnpjData);
    }

    res.json(cnpjData);
});
app.listen(3000, () => console.log('Servidor rodando na porta 3000'));
