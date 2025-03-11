const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const gerarPDF = require('./gerarPDF'); // Importa a função que gera o PDF

const app = express();
app.use(cors());
app.use(express.json());

const pastaRelatorios = path.join(__dirname, 'Relatórios');

// Criar a pasta "Relatórios" se ela não existir
if (!fs.existsSync(pastaRelatorios)) {
    fs.mkdirSync(pastaRelatorios, { recursive: true });
}

// Rota para processar o CNPJ e gerar o PDF
app.post('/buscar', async (req, res) => {
    let { cnpj } = req.body;

    if (!cnpj) {
        return res.status(400).json({ error: 'CNPJ é obrigatório!' });
    }

    // Remover caracteres especiais para garantir que a API aceite
    cnpj = cnpj.replace(/\D/g, '');

    try {
        // Faz a requisição à API ReceitaWS com um User-Agent
        const response = await axios.get(`https://www.receitaws.com.br/v1/cnpj/${cnpj}`, {
            headers: { 'User-Agent': 'Mozilla/5.0' }
        });

        // Se houver erro na resposta
        if (response.data.status === "ERROR") {
            return res.status(400).json({ error: response.data.message });
        }

        const dados = {
            cnpj: response.data.cnpj,
            nome: response.data.nome || "Não informado",
            fantasia: response.data.fantasia || "Não informado",
            telefone: response.data.telefone || "Não informado",
            email: response.data.email || "Não informado",
            logradouro: response.data.logradouro || "Não informado",
            numero: response.data.numero || "Não informado",
            bairro: response.data.bairro || "Não informado",
            municipio: response.data.municipio || "Não informado",
            uf: response.data.uf || "Não informado",
            situacao: response.data.situacao || "Não informado",
            qsa: response.data.qsa || []
        };

        // Nome do arquivo PDF
        const nomeArquivo = `relatorio_${cnpj}.pdf`;
        const caminhoArquivo = path.join(pastaRelatorios, nomeArquivo);

        // Gerar o relatório em PDF no caminho correto
        gerarPDF(dados, caminhoArquivo);

        res.json({ downloadUrl: `http://localhost:3000/download/${nomeArquivo}` });

    } catch (error) {
        console.error("Erro ao buscar dados:", error);
        res.status(500).json({ error: "Erro ao buscar informações do CNPJ." });
    }
});

// Rota para baixar o PDF gerado
app.get('/download/:nomeArquivo', (req, res) => {
    const { nomeArquivo } = req.params;
    const caminhoArquivo = path.join(pastaRelatorios, nomeArquivo);

    if (fs.existsSync(caminhoArquivo)) {
        res.download(caminhoArquivo);
    } else {
        res.status(404).json({ error: "Arquivo não encontrado" });
    }
});

// Iniciar o servidor na porta 3000
app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});
