const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

function gerarPDF(dados) {
    const nomeArquivo = `relatorio_${dados.cnpj.replace(/\//g, '_')}.pdf`;
    const pastaRelatorios = path.join(__dirname, 'Relatórios');

    // Criar a pasta "Relatórios" se não existir
    if (!fs.existsSync(pastaRelatorios)) {
        fs.mkdirSync(pastaRelatorios, { recursive: true });
    }

    // Caminho completo do arquivo
    const caminhoArquivo = path.join(pastaRelatorios, nomeArquivo);

    const doc = new PDFDocument();
    doc.pipe(fs.createWriteStream(caminhoArquivo));

    doc.fontSize(18).text('Relatório OSINT - CNPJ', { align: 'center' });
    doc.moveDown();

    doc.fontSize(12).text(`CNPJ: ${dados.cnpj}`);
    doc.text(`Razão Social: ${dados.nome}`);
    doc.text(`Nome Fantasia: ${dados.fantasia}`);
    doc.text(`Telefone: ${dados.telefone}`);
    doc.text(`E-mail: ${dados.email}`);
    doc.text(`Endereço: ${dados.logradouro}, ${dados.numero} - ${dados.bairro}, ${dados.municipio}/${dados.uf}`);
    doc.text(`Situação: ${dados.situacao}`);
    doc.moveDown();

    doc.text('Sócios:', { underline: true });
    dados.qsa.forEach(socio => {
        doc.text(`- ${socio.nome} (${socio.qual})`);
    });

    doc.end();
    console.log(`Relatório salvo em: ${caminhoArquivo}`);
}

module.exports = gerarPDF;
