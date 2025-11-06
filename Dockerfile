# Base leve do Node
FROM node:22-alpine

# Define diretório de trabalho
WORKDIR /app

# Copia os arquivos de dependência primeiro
COPY package*.json ./

# Instala dependências de produção apenas
RUN npm ci --omit=dev

# Copia o restante do projeto
COPY . .

# Expõe a porta padrão do Vite
EXPOSE 5173

# Comando para rodar o front (modo desenvolvimento com host visível)
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
