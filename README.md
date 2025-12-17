# Frontend – Lógica++

Aplicativo frontend do projeto **Lógica++**, desenvolvido com **Expo** e **React Native**, compatível com Android, iOS e Web.

---

## 🛠 Tecnologias

* Expo
* React Native
* JavaScript

---

## 📁 Estrutura (resumida)

```
frontend/
├─ app.json
├─ App.js
└─ package.json
```

---

## ▶️ Executando o Aplicativo

Na raiz do projeto frontend, execute:

```bash
npx expo start --tunnel
```

---

## 📲 Testes

* Um **QR Code** será exibido no terminal
* Escaneie com o aplicativo **Expo Go** no celular
* Para abrir a versão web, pressione:

```text
w
```

---

## 🔗 Configuração da API

No arquivo `app.json`, configure a URL pública do backend (Cloudflare):

```json
{
  "expo": {
    "extra": {
      "apiUrl": "https://sua-url-publica.trycloudflare.com"
    }
  }
}
```

Essa URL deve ser a mesma configurada na variável `SERVER_URL` do backend.

---

## ⚠️ Observações Importantes

* O backend precisa estar rodando para o app funcionar corretamente
* Para testes fora da rede local, o **Cloudflare Tunnel** é obrigatório

---

🚀 Frontend desenvolvido com Expo e React Native
