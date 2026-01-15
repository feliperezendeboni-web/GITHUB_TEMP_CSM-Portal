# 🔧 GUIA RÁPIDO - Adicionar/Remover Arquivos CSV

## ⚡ Modo Sem Servidor (file://)

Se você **não pode** usar o servidor Node.js, siga estes passos quando adicionar ou remover arquivos CSV:

### 📝 Passo a Passo

1. **Abra o arquivo**: `js/csv-files-config.js`

2. **Edite a lista** `window.CSV_FILES_LIST`:
   ```javascript
   window.CSV_FILES_LIST = [
       '2026_Master Entitlements_LIST.csv',
       'Training Catalog.csv',
       'Training Catalog - Copy.csv',  // ← Arquivo que você adicionou
       'novo_arquivo.csv'               // ← Adicione mais conforme necessário
   ];
   ```

3. **Salve o arquivo**

4. **Dê refresh** na página (F5 ou Ctrl+R)

5. **Pronto!** As novas tabs aparecerão

### ✅ Exemplo Prático

**Você tem na pasta:**
```
reference tables/
├── 2026_Master Entitlements_LIST.csv
├── Training Catalog.csv
└── Training Catalog - Copy.csv  ← NOVO
```

**Atualize o config:**
```javascript
window.CSV_FILES_LIST = [
    '2026_Master Entitlements_LIST.csv',
    'Training Catalog.csv',
    'Training Catalog - Copy.csv'  // ← Adicione esta linha
];
```

---

## 🚀 Modo Com Servidor (Recomendado)

Se você **instalar Node.js** e usar o servidor:

1. Duplo-clique em `START_SERVER.bat`
2. Acesse `http://localhost:3000`
3. **Adicione/remova arquivos** livremente na pasta `reference tables`
4. **Não precisa editar nada!** Tudo é automático
5. Refresh da página detecta mudanças automaticamente

---

## 📌 Resumo

| Modo | Adicionar Arquivo | Detecta Automaticamente? |
|------|-------------------|--------------------------|
| **file://** (sem servidor) | Editar `csv-files-config.js` | ❌ Não |
| **http://localhost:3000** (com servidor) | Só adicionar na pasta | ✅ Sim |

---

## 💡 Recomendação

**Instale Node.js** para ter a experiência completa! É rápido e fácil:
1. https://nodejs.org/ → Download LTS
2. Instalar
3. Duplo-clique em `START_SERVER.bat`
4. Nunca mais se preocupe com configuração manual!
