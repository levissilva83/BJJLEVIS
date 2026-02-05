// ============================================
// ACADEMY JIU JITSU - APP.JS v5
// Com suporte CORS para Google Apps Script
// ============================================

const API_URL = "https://script.google.com/macros/s/AKfycbz_BbGUbiG6OdN-GBXELYejvwMjDc9CXJhgesEhM1wP-HBUu9XPZmNmZ8KQheCchAGCjQ/exec";

console.log("📱 App.js iniciado");
console.log("🔗 API:", API_URL);

// ===== FUNÇÃO PRINCIPAL =====
function chamarAPI(action, data, callback) {
  console.group("🔵 chamarAPI - " + action);
  console.log("Data:", data);
  
  // Preparar URL com parâmetros
  let urlFinal = API_URL + "?action=" + encodeURIComponent(action);
  
  // Adicionar parâmetros de dados à URL
  for (let key in data) {
    urlFinal += "&" + encodeURIComponent(key) + "=" + encodeURIComponent(JSON.stringify(data[key]));
  }
  
  console.log("📤 URL Final:", urlFinal);
  
  // Preparar o payload para o body
  const payload = JSON.stringify({
    action: action,
    ...data
  });
  
  console.log("📦 Payload:", payload);
  
  // Tentativa com Fetch
  fetch(API_URL, {
    method: 'POST',
    body: payload,
    headers: {
      'Content-Type': 'text/plain;charset=utf-8'  // IMPORTANTE: text/plain evita CORS preflight
    }
  })
  .then(response => {
    console.log("📥 Status:", response.status);
    console.log("Headers:", response.headers);
    
    if (!response.ok) {
      throw new Error("HTTP " + response.status);
    }
    
    return response.text();
  })
  .then(text => {
    console.log("📋 Response text:", text);
    
    // Tentar parsear como JSON
    try {
      const resultado = JSON.parse(text);
      console.log("✅ JSON parsed:", resultado);
      console.groupEnd();
      callback(resultado);
    } catch (e) {
      console.error("❌ Erro ao parsear JSON:", e);
      console.log("Raw text:", text.substring(0, 200));
      
      // Se for HTML error, extrair mensagem
      if (text.includes("Error")) {
        callback({
          sucesso: false,
          mensagem: "Erro no servidor: " + text.substring(0, 100)
        });
      } else {
        callback({
          sucesso: false,
          mensagem: "Resposta inválida do servidor"
        });
      }
      console.groupEnd();
    }
  })
  .catch(error => {
    console.error("❌ Erro no fetch:", error.message);
    console.error("Stack:", error.stack);
    console.groupEnd();
    
    callback({
      sucesso: false,
      mensagem: "Erro de conexão: " + error.message + ". Verifique a URL da API em app.js"
    });
  });
}

// ===== FUNÇÃO DE TESTE =====
window.testarAPI = function() {
  console.log("🧪 INICIANDO TESTE DA API");
  console.log("API_URL:", API_URL);
  
  // Teste simples
  chamarAPI('login', {
    email: 'joao123@email.com',
    senha: 'Senha123'
  }, function(resultado) {
    console.log("📊 Resultado do teste:", resultado);
    
    // Mostrar no console
    if (resultado.sucesso) {
      console.log("✅ TEST PASSED - API está funcionando!");
      alert("✅ API está funcionando!\n\nResposta: " + JSON.stringify(resultado, null, 2));
    } else {
      console.log("❌ TEST FAILED - " + resultado.mensagem);
      alert("❌ Teste falhou\n\nMensagem: " + resultado.mensagem);
    }
  });
};

// ===== VERIFICAR URL =====
window.verificarURL = function() {
  console.log("🔍 Verificando URL...");
  console.log("API_URL:", API_URL);
  
  fetch(API_URL + "?action=ping")
    .then(r => r.text())
    .then(t => {
      console.log("✅ URL acessível");
      console.log("Resposta:", t);
      alert("✅ URL está acessível!\nResposta: " + t);
    })
    .catch(e => {
      console.log("❌ URL não acessível:", e.message);
      alert("❌ URL não está acessível\nErro: " + e.message);
    });
};

// ===== LOGS =====
console.log("✅ App.js carregado com sucesso!");
console.log("");
console.log("💡 COMANDOS DE TESTE (abra Console - F12):");
console.log("   - testarAPI()  : Testa login");
console.log("   - verificarURL() : Verifica se a URL está acessível");
console.log("");
