# Используем официальный Node.js образ
FROM node:20

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем все файлы проекта
COPY . .

# Копируем wait-for-it.sh
COPY wait-for-it.sh /app/wait-for-it.sh

# Делаем скрипт исполняемым
RUN chmod +x /app/wait-for-it.sh

# Указываем команду по умолчанию
CMD ["sh", "-c", "/app/wait-for-it.sh postgres:5432 -- npm run db:migrate && npm run start:dev"]
