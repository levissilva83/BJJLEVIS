// ============================================
// ACADEMY JIU JITSU - APP.JS v4 FUNCIONAL
// ============================================

const API_URL = "https://script.google.com/macros/s/AKfycbz_BbGUbiG6OdN-GBXELYejvwMjDc9CXJhgesEhM1wP-HBUu9XPZmNmZ8KQheCchAGCjQ/exec";

console.log("📱 App.js Iniciado");
console.log("🔗 API URL:", API_URL);

// ===== FUNÇÃO PRINCIPAL =====
function chamarAPI(action, data, callback) {
  console.group("🔵 chamarAPI");
  console.log("Action:", action);
  console.log("Data:", data);
  
  const parametros = new URLSearchParams();
  parametros.append('action', action);
  
  // Preparar o payload
  const payload = {
    action: action,
    ...data
  };
  
  console.log("Payload completo:", payload);
  console.log("URL Final:", API_URL + "?action=" + action);

  // Usar fetch
  fetch(API_URL, {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(response => {
    console.log("📥 Status da resposta:", response.status);
    return response.text(); // Pegar como texto primeiro
  })
  .then(text => {
    console.log("📋 Texto bruto recebido:", text);
    
    try {
      // Tentar parsear como JSON
      const dados = JSON.parse(text);
      console.log("✅ JSON parsed com sucesso:", dados);
      console.groupEnd();
      callback(dados);
    } catch (e) {
      console.error("❌ Erro ao parsear JSON:", e);
      console.error("Texto recebido:", text);
      console.groupEnd();
      
      callback({
        sucesso: false,
        mensagem: "Erro na resposta do servidor: " + text.substring(0, 100)
      });
    }
  })
  .catch(error => {
    console.error("❌ Erro no fetch:", error);
    console.groupEnd();
    
    callback({
      sucesso: false,
      mensagem: "Erro de conexão: " + error.message
    });
  });
}

// ===== FUNÇÃO DE TESTE =====
window.testarAPI = function() {
  console.log("🧪 Iniciando teste da API...");
  console.log("API_URL:", API_URL);
  
  chamarAPI('login', {
    email: 'joao123@email.com',
    senha: 'Senha123'
  }, function(resultado) {
    console.log("📊 Resultado do teste:", resultado);
    alert("Resultado: " + JSON.stringify(resultado, null, 2));
  });
};

// ===== VALIDAÇÕES =====
window.validarEmail = function(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

window.validarSenha = function(senha) {
  if (senha.length < 8) return false;
  if (!/[A-Z]/.test(senha)) return false;
  if (!/[0-9]/.test(senha)) return false;
  return true;
};

console.log("✅ App.js carregado com sucesso!");
console.log("💡 Para testar, abra o console (F12) e digite: testarAPI()");
