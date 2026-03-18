# Безопасность проекта

## Хранение приватного ключа релеера

### ⚠️ ВАЖНО: Никогда не коммитьте `.env` с ключом!

`.env` файл уже добавлен в `.gitignore`, но всегда проверяйте перед коммитом:
```bash
git status
# Убедитесь что .env не в списке
```

### Безопасное хранение на сервере

#### Способ 1: Файл вне проекта (рекомендуется)

1. На сервере создайте папку и файл:
```bash
sudo mkdir /etc/relayer
sudo nano /etc/relayer/secrets
```

2. Вставьте ключ в формате:
```
RELAYER_PRIVATE_KEY=0xваш_ключ_без_кавычек
```

3. Закройте доступ:
```bash
sudo chmod 600 /etc/relayer/secrets
sudo chown root:root /etc/relayer/secrets
```

4. Запускайте релеер с:
```bash
export $(cat /etc/relayer/secrets | xargs) && node relayer/server.js
```

Или с PM2:
```json
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'relayer',
    script: './relayer/server.js',
    env_file: '/etc/relayer/secrets'
  }]
}
```

#### Способ 2: Переменные окружения systemd

```ini
# /etc/systemd/system/relayer.service
[Unit]
Description=Token Airdrop Relayer
After=network.target

[Service]
Type=simple
User=relayer
Environment="RELAYER_PRIVATE_KEY=0xваш_ключ"
Environment="SPENDER_CONTRACT=0x..."
ExecStart=/usr/bin/node /home/relayer/relayer/server.js
Restart=always

[Install]
WantedBy=multi-user.target
```

### Проверка безопасности

Перед публикацией убедитесь что:
- [ ] `.env` не содержит реального ключа (только placeholder)
- [ ] `.gitignore` содержит `.env`
- [ ] В истории git нет ключа: `git log --all --full-history -- .env`
- [ ] Ключ используется только для релеера (не личный кошелёк)

### Если ключ случайно попал в git

1. Сразу смените ключ!
2. Используйте новый адрес для релеера
3. Удалите ключ из истории (BFG Repo-Cleaner или filter-branch)

---

## Контракт AirdropVault

### Деплой

```bash
cd contracts
npx hardhat run scripts/deploy.js --network baseMainnet
```

### Настройка токенов

После деплоя владелец должен:

1. Добавить токены в контракт:
```solidity
setToken(
  0xАдрес_токена,
  true,           // enabled
  1000000000000000000n  // claimAmount (1 токен с 18 decimals)
)
```

2. Задепозитировать токены:
```solidity
// Сначала approve для контракта
token.approve(airdropVaultAddress, amount)
// Затем deposit
airdropVault.deposit(tokenAddress, amount)
```

### Фронтенд

Настройте `.env`:
```
VITE_AIRDROP_VAULT=0xДеплоенный_Адрес_Контракта
```

Замените placeholder токены в `src/lib/tokens.ts` на реальные адреса ZORA токенов.
