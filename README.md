# Para rodar o front

No terminal, dentro do projeto  use o comando 
```bash
npm install
```

Instale a lib de gerar pdfs.
```bash
npm install jspdf jspdf-autotable
```
Ele vai instalar a pasta node_modules com as dependencias necessárias para rodar o projeto.
Depois para startar o front e acessar pelo navegador rode:
```bash
npm run dev
```

packge.json
```bash
{
  "name": "onebus-dashboard",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  },
  "dependencies": {
    "axios": "1.11.0",
    "jspdf": "2.5.1",
    "jspdf-autotable": "3.8.2",
    "react": "^19.1.1",
    "react-dom": "^19.1.1",
    "react-icons": "^5.5.0",
    "react-router-dom": "^7.8.1"
  },
  "devDependencies": {
    "@eslint/js": "^9.33.0",
    "@types/react": "^19.1.10",
    "@types/react-dom": "^19.1.7",
    "@vitejs/plugin-react": "^5.0.0",
    "eslint": "^9.33.0",
    "eslint-plugin-react-hooks": "^5.2.0",
    "eslint-plugin-react-refresh": "^0.4.20",
    "globals": "^16.3.0",
    "vite": "^7.1.2"
  }
}
