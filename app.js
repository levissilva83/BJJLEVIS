// ====================================
// ACADEMY JIU JITSU - Frontend API
// ====================================

// COPIE SEU URL AQUI:
const API_URL = "https://script.googleusercontent.com/macros/echo?user_content_key=AehSKLhIJ4yP4hFFBeBc4I6ZagnSXOFxEU2oR40LP2cR3ZkkKTQyANr_K72NqY5-PTYrfEQ_2jexnwMuQReIGuSzvhk_z3YB26VMOQGpw3plMe3Z-TqLOZgj60X1dw0u1b4vn-neF3pzHB_Q-vJy6VZaJXK3F2blS7BP5pw_dvU9sW2S6gW86j-B3BTJiluxSGvIDIOhUsFb8CLYfgUKC3NYHDgdpwk9oWjhVOuNhx3fVeEx9volFIWFjBFTY0Cj95I1OgBk5aImUh_Sml_F3xgDAmgALO9Xsg&lib=MU--6-TMXQzT7iRyHl83dweuIr36Dget2";

// Função para chamar a API
function chamarAPI(action, data, callback) {
  const payload = {
    action: action,
    ...data
  };

  fetch(API_URL, {
    method: 'POST',
    contentType: 'application/json',
    payload: JSON.stringify(payload)
  })
  .then(response => response.text())
  .then(text => {
    try {
      const resultado = JSON.parse(text);
      callback(resultado);
    } catch (e) {
      console.error('Erro ao parsear resposta:', e);
      console.log('Resposta recebida:', text);
      callback({ sucesso: false, mensagem: 'Erro na comunicação com servidor' });
    }
  })
  .catch(error => {
    console.error('Erro na requisição:', error);
    callback({ sucesso: false, mensagem: 'Erro ao conectar ao servidor' });
  });
}

// Alternativa: Se a função anterior não funcionar, use esta:
function chamarAPIAlternativa(action, data, callback) {
  const payload = JSON.stringify({
    action: action,
    ...data
  });

  var options = {
    method: 'post',
    payload: payload,
    contentType: 'application/json',
    muteHttpExceptions: true
  };

  try {
    var response = UrlFetchApp.fetch(API_URL + "?action=" + action, options);
    var resultado = JSON.parse(response.getContentText());
    callback(resultado);
  } catch (error) {
    console.error('Erro:', error);
    callback({ sucesso: false, mensagem: 'Erro ao conectar ao servidor' });
  }
}

// Função alternativa usando XMLHttpRequest (RECOMENDADA)
function chamarAPIXMLHttpRequest(action, data, callback) {
  const xhr = new XMLHttpRequest();
  const url = API_URL + "?action=" + action;
  
  xhr.open('POST', url, true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        try {
          const resultado = JSON.parse(xhr.responseText);
          callback(resultado);
        } catch (e) {
          console.error('Erro ao parsear JSON:', e);
          callback({ sucesso: false, mensagem: 'Erro na resposta do servidor' });
        }
      } else {
        console.error('Erro HTTP:', xhr.status);
        callback({ sucesso: false, mensagem: 'Erro do servidor (HTTP ' + xhr.status + ')' });
      }
    }
  };
  
  xhr.onerror = function() {
    console.error('Erro de rede');
    callback({ sucesso: false, mensagem: 'Erro de conexão com servidor' });
  };
  
  try {
    xhr.send(JSON.stringify({ action: action, ...data }));
  } catch (error) {
    console.error('Erro ao enviar:', error);
    callback({ sucesso: false, mensagem: 'Erro ao enviar requisição' });
  }
}

// Use esta função (XMLHttpRequest é mais confiável para GitHub Pages)
function chamarAPI(action, data, callback) {
  return chamarAPIXMLHttpRequest(action, data, callback);
}
