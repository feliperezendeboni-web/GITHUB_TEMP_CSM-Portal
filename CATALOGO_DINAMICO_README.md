# 📚 Catálogo Dinâmico de CSVs - Instruções

## ⚠️ IMPORTANTE: Limitação do Modo File://

Quando você abre o `index.html` diretamente no navegador (protocolo `file://`), o navegador **bloqueia o acesso à pasta** por questões de segurança (CORS). Isso significa que:

❌ **Não funciona em modo file://**:
- Detectar automaticamente novos arquivos CSV
- Remover tabs de arquivos deletados
- Atualizar quando você adiciona/remove arquivos

✅ **Funciona em modo file://**:
- Exibir dados dos arquivos hardcoded no fallback
- Navegar entre tabs existentes
- Buscar dentro dos dados

---

## 🚀 SOLUÇÃO: Usar o Servidor Node.js

### Opção 1: Duplo-clique no arquivo `START_SERVER.bat`

1. **Duplo-clique** em `START_SERVER.bat`
2. O servidor vai instalar dependências e iniciar automaticamente
3. Abra seu navegador em: **http://localhost:3000**
4. Pronto! Agora o catálogo é **100% dinâmico**

### Opção 2: Linha de comando manual

```bash
# 1. Instalar dependências (apenas primeira vez)
npm install

# 2. Iniciar servidor
npm start

# 3. Abrir navegador em http://localhost:3000
```

---

## ✨ Funcionalidades com Servidor Rodando

Quando você usa `http://localhost:3000`:

✅ **Detecção Automática**:
- Adicione um arquivo `.csv` na pasta `reference tables` → Nova tab aparece
- Delete um arquivo → Tab desaparece
- Modifique um arquivo → Dados atualizam automaticamente

✅ **Atualização em Tempo Real**:
- Polling a cada 10 segundos enquanto modal está aberto
- Botão de refresh manual (🔄)
- Indicador visual de arquivos modificados (●)

✅ **Sem Hardcoding**:
- Nenhum arquivo está hardcoded no código
- Tudo vem dinamicamente da pasta `reference tables`

---

## 📁 Estrutura de Arquivos

```
reference tables/
├── 2026_Master Entitlements_LIST.csv
├── Training Catalog.csv
└── [qualquer outro arquivo .csv que você adicionar]
```

**Qualquer arquivo `.csv` nesta pasta será automaticamente detectado!**

---

## 🔧 Troubleshooting

### "Node.js não está instalado"
- Baixe e instale de: https://nodejs.org/
- Escolha a versão LTS (recomendada)
- Reinicie o terminal após instalação

### "Porta 3000 já está em uso"
- Feche outros servidores rodando na porta 3000
- Ou edite `server.js` e mude `PORT` para outro número (ex: 3001)

### "Arquivos não aparecem"
- Verifique se os arquivos estão na pasta `reference tables`
- Verifique se têm extensão `.csv`
- Clique no botão 🔄 para forçar atualização

---

## 💡 Dica

**Deixe o servidor rodando** enquanto trabalha no portal. Assim você pode:
- Adicionar/remover arquivos CSV livremente
- Ver mudanças refletidas automaticamente
- Não precisar se preocupar com código

---

## 📞 Suporte

Se tiver problemas, verifique:
1. Node.js está instalado? (`node --version`)
2. Servidor está rodando? (veja mensagem "Server running on port 3000")
3. Está acessando `http://localhost:3000` (não `file://`)?
