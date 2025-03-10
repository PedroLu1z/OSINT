async function consultarCNPJ() {
    const cnpj = document.getElementById('cnpjInput').value.replace(/\D/g, ''); // Remove caracteres não numéricos
    if (!cnpj) {
        alert('Digite um CNPJ válido!');
        return;
    }

    const response = await fetch('http://localhost:3000/api/osint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cnpj })
    });

    const data = await response.json();
    document.getElementById('resultado').innerText = JSON.stringify(data, null, 2);
}