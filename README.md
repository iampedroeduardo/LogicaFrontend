# Lógica++ · Front-end

Aplicativo móvel e plataforma web do **Lógica++**, um app gamificado para praticar lógica de programação e raciocínio lógico, inspirado na ideia de praticar um pouco todo dia. Desenvolvido como Trabalho de Conclusão do curso Técnico em Informática para Internet do IFRS Campus Rio Grande (2025).

Um único código em React Native com Expo roda como **app no Android e no iOS** e como **plataforma web** para cadastro de questões.

> Back-end (API REST): [LogicaBackend](https://github.com/iampedroeduardo/LogicaBackend)


## Funcionalidades

**Aplicativo**
- Trilhas de exercícios aleatórias ou por categoria, com três tipos de questão: múltipla escolha, "Complete o código" e "Encontre o erro"
- XP, níveis e ranks ligados a cada conteúdo, de raciocínio lógico até funções e códigos avançados
- Ranking entre usuários, ofensiva de dias seguidos e animações de subida de rank e perda de XP
- Avatar personalizável com cores e acessórios desbloqueados conforme o progresso
- Cadastro com validação de e-mail, login e recuperação de senha por código

**Plataforma web**
- Área de trabalho com **janelas arrastáveis**, em que cada janela é uma questão sendo criada ou editada
- **Editor de código** com destaque de sintaxe, em que o usuário seleciona trechos para marcar como erro ou lacuna e cadastra as alternativas erradas
- Cadastro de questões de múltipla escolha com texto ou imagem e gabarito comentado
- "Minhas questões", com filtros por status. Administradores veem e aprovam as questões pendentes

## Tecnologias

![React Native](https://img.shields.io/badge/React_Native-20232A?style=flat&logo=react&logoColor=61DAFB)
![Expo](https://img.shields.io/badge/Expo_54-000020?style=flat&logo=expo&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![Figma](https://img.shields.io/badge/Figma-F24E1E?style=flat&logo=figma&logoColor=white)

- **React Native 0.81 + React 19 + Expo 54**, com um código para Android, iOS e web
- **React Navigation** e **React Native Paper** para navegação e componentes
- **Animated API** do React Native para as animações de progresso
- Componente próprio de **janelas arrastáveis**, feito com `PanResponder` e `Animated`
- **CodeMirror** para o editor de código da plataforma web
- **Axios** para consumir a API, com a sessão do usuário salva no **AsyncStorage**
- Interface prototipada no **Figma** antes da implementação

## Como rodar

**Pré-requisitos:** Node.js 18+, o app **Expo Go** no celular e o [back-end](https://github.com/iampedroeduardo/LogicaBackend) rodando.

```bash
git clone https://github.com/iampedroeduardo/LogicaFrontend.git
cd LogicaFrontend
npm install
```

No `app.json`, aponte para a URL da API (a mesma do `SERVER_URL` do back-end):

```json
{
  "expo": {
    "extra": {
      "apiUrl": "https://sua-url-publica.trycloudflare.com"
    }
  }
}
```

Inicie o projeto:

```bash
npx expo start --tunnel
```

Escaneie o QR Code com o Expo Go para abrir o app, ou pressione `w` no terminal para abrir a plataforma web.

## Autores

- **Pedro Eduardo dos Santos** · [@iampedroeduardo](https://github.com/iampedroeduardo)
- **Jéssica Villas Bôas** · [@JVillasBoas](https://github.com/JVillasBoas)

Orientação: Profª Drª Raquel de Miranda Barbosa · IFRS Campus Rio Grande
