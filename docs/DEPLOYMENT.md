# Инструкции по развертыванию Nexus Lottery v2.0

## 📦 Готовые файлы для развертывания

### Архивы:
1. **nexus-lottery-production.tar.gz** - Готовые собранные файлы для production
2. **nexus-lottery-ready.tar.gz** - Полный проект с исходным кодом

## 🚀 Развертывание на сервере

### Вариант 1: Быстрое развертывание (рекомендуется)

```bash
# 1. Загрузите архив на сервер
scp nexus-lottery-production.tar.gz user@your-server:/var/www/

# 2. Подключитесь к серверу
ssh user@your-server

# 3. Создайте директорию для приложения
sudo mkdir -p /var/www/nexus-lottery
cd /var/www/nexus-lottery

# 4. Распакуйте архив
sudo tar -xzf ../nexus-lottery-production.tar.gz

# 5. Установите права доступа
sudo chown -R www-data:www-data /var/www/nexus-lottery
sudo chmod -R 755 /var/www/nexus-lottery
```

### Вариант 2: Развертывание с исходным кодом

```bash
# 1. Загрузите полный архив
scp nexus-lottery-ready.tar.gz user@your-server:/var/www/

# 2. Распакуйте и установите зависимости
cd /var/www/
sudo tar -xzf nexus-lottery-ready.tar.gz
sudo mv nexus-lottery-v2 nexus-lottery
cd nexus-lottery

# 3. Установите Node.js и npm (если не установлены)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# 4. Установите зависимости и соберите проект
sudo npm install --legacy-peer-deps
sudo npm run build

# 5. Установите права доступа
sudo chown -R www-data:www-data /var/www/nexus-lottery
sudo chmod -R 755 /var/www/nexus-lottery
```

## ⚙️ Конфигурация Nginx

### Создайте конфигурационный файл:

```bash
sudo nano /etc/nginx/sites-available/nexus-lottery
```

### Содержимое файла конфигурации:

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    
    root /var/www/nexus-lottery;
    index index.html;
    
    # Отключаем кеширование для разработки
    add_header Cache-Control "no-cache, no-store, must-revalidate";
    add_header Pragma "no-cache";
    add_header Expires "0";
    
    # Основная локация
    location / {
        try_files $uri $uri/ /index.html;
        
        # CORS заголовки для Web3
        add_header Access-Control-Allow-Origin *;
        add_header Access-Control-Allow-Methods "GET, POST, OPTIONS";
        add_header Access-Control-Allow-Headers "DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range";
    }
    
    # Статические ресурсы с кешированием
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        try_files $uri =404;
    }
    
    # Логи
    access_log /var/log/nginx/nexus-lottery.access.log;
    error_log /var/log/nginx/nexus-lottery.error.log;
}
```

### Активируйте конфигурацию:

```bash
# Создайте символическую ссылку
sudo ln -s /etc/nginx/sites-available/nexus-lottery /etc/nginx/sites-enabled/

# Проверьте конфигурацию
sudo nginx -t

# Перезапустите Nginx
sudo systemctl reload nginx
```

## 🔒 SSL/HTTPS (рекомендуется)

### Установите Certbot для Let's Encrypt:

```bash
sudo apt update
sudo apt install certbot python3-certbot-nginx

# Получите SSL сертификат
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Автоматическое обновление
sudo crontab -e
# Добавьте строку:
0 12 * * * /usr/bin/certbot renew --quiet
```

## 🌐 Особенности Web3 интеграции

### Требования для работы с MetaMask:
1. **HTTPS обязательно** для production (MetaMask требует безопасное соединение)
2. **CORS заголовки** уже настроены в конфигурации Nginx
3. **Правильный домен** - избегайте IP адресов для MetaMask

### Тестирование подключения:
1. Откройте сайт в браузере с MetaMask
2. Нажмите "Connect Wallet"
3. MetaMask автоматически добавит Nexus Testnet III
4. Получите тестовые NEX через Faucet (ссылка в футере)
5. Протестируйте покупку билетов лотереи

## 🔧 Устранение неполадок

### Проблемы с MetaMask:
- Убедитесь, что используется HTTPS
- Проверьте CORS заголовки в браузере (F12 → Network)
- Очистите кеш браузера и MetaMask

### Проблемы с Nginx:
```bash
# Проверка статуса
sudo systemctl status nginx

# Проверка логов
sudo tail -f /var/log/nginx/nexus-lottery.error.log

# Перезапуск при необходимости
sudo systemctl restart nginx
```

### Проверка файлов:
```bash
# Убедитесь, что файлы на месте
ls -la /var/www/nexus-lottery/

# Проверьте права доступа
ls -la /var/www/nexus-lottery/index.html
```

## ✅ Финальная проверка

1. **Откройте сайт** в браузере
2. **Проверьте консоль** (F12) на отсутствие ошибок
3. **Протестируйте подключение MetaMask**
4. **Проверьте все ссылки** (Faucet, Explorer)
5. **Убедитесь в корректном отображении** на мобильных устройствах

## 📞 Поддержка

При возникновении проблем проверьте:
- Логи Nginx: `/var/log/nginx/nexus-lottery.error.log`
- Консоль браузера (F12)
- Статус сервисов: `sudo systemctl status nginx`

Приложение готово к использованию с полной Web3 функциональностью!

