# Token Airdrop Relayer

Relayer service для отправки токенов через Permit2 на смарт-контракт. Релеер оплачивает газ и берет комиссию в токенах.

## Установка

```bash
cd relayer
npm install
```

## Настройка

1. Скопируйте `.env.example` в `.env`:
```bash
cp .env.example .env
```

2. Отредактируйте `.env`:
```env
RELAYER_PRIVATE_KEY=0xВАШ_ПРИВАТНЫЙ_КЛЮЧ
SPENDER_CONTRACT=0x2eB8cA2f4CCd8e4B069b9F599a740b0BB33Aa684
FEE_PERCENTAGE=0.5
MIN_FEE_USD=1.0
```

## Запуск

```bash
# Production
npm start

# Development (auto-reload)
npm run dev
```

Сервер запустится на порту 3001 (или указанном в PORT).

## API Endpoints

### Health Check
```
GET http://localhost:3001/health
```

### Get Relayer Balance
```
GET http://localhost:3001/balance
```

### Execute Single Transfer
```
POST http://localhost:3001/relay
Content-Type: application/json

{
  "tokenAddress": "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913",
  "owner": "0x...",
  "amount": "1000000",
  "nonce": "12345",
  "deadline": "1234567890",
  "signature": "0x..."
}
```

### Execute Batch Transfer
```
POST http://localhost:3001/relay-batch
Content-Type: application/json

{
  "transfers": [
    {
      "tokenAddress": "0x...",
      "owner": "0x...",
      "amount": "1000000",
      "signature": "0x..."
    }
  ]
}
```

## Как это работает

1. Пользователь подписывает Permit2 сообщение на фронтенде
2. Подпись и данные отправляются на релеер
3. Релеер проверяет баланс пользователя
4. Релеер вычисляет комиссию (процент или минимум в USD)
5. Релеер отправляет транзакцию через Permit2, платя газ своим ключом
6. На контракт отправляется сумма минус комиссия
7. Комиссия остается на кошельке релеера

## Требования к релееру

- Кошелек релеера должен иметь ETH на Base для оплаты газа
- Приватный ключ должен быть безопасно сохранен в .env
- Рекомендуется использовать выделенный кошелек только для релеера

## Безопасность

- Никогда не коммитьте `.env` с приватным ключом!
- Используйте `.env.example` как шаблон
- В продакшене используйте более сложную аутентификацию
- Рассмотрите rate limiting для API
