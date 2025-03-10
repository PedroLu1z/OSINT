function gerarPDF(dados) {
    const PDFDocument = require('pdfkit');
    const fs = require('fs');

    // Substituir '/' por '_'
    const nomeArquivo = `relatorio_${dados.cnpj.replace(/\//g, '_')}.pdf`;

    const doc = new PDFDocument();
    doc.pipe(fs.createWriteStream(nomeArquivo));

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
    console.log(`Relatório salvo como: ${nomeArquivo}`);
}

module.exports = gerarPDF;
