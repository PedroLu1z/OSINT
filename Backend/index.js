document.getElementById('cnpjForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    
    const cnpj = document.getElementById("cnpjInput").value;
    const resultado = document.getElementById("resultado");

    // Limpa qualquer mensagem de erro anterior
    resultado.textContent = "";

    try {
        const response = await fetch("http://localhost:3000/buscar", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ cnpj }),
        });

        if (!response.ok) {
            throw new Error("Erro na consulta ao CNPJ.");
        }

        const data = await response.json();

        // Verifica se a URL de download foi retornada
        if (data.downloadUrl) {
            resultado.textContent = "Consulta realizada com sucesso! O download começou.";

            // Agora força o download do PDF
            const downloadResponse = await fetch(data.downloadUrl);
            if (downloadResponse.ok) {
                const blob = await downloadResponse.blob();
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = data.downloadUrl.split('/').pop(); // Nome do arquivo
                link.click(); // Força o download
            } else {
                throw new Error("Falha ao baixar o arquivo.");
            }
        } else {
            throw new Error("URL de download não encontrada.");
        }
    } catch (error) {
        // Exibe o erro de forma mais amigável
        resultado.textContent = `Erro: ${error.message}`;
    }
});