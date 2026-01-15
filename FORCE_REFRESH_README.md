# Force Refresh - Funcionalidade de Atualização de Tabs

## Visão Geral

O botão **Force Refresh** (🔄) permite que você atualize dinamicamente as tabs do catálogo de referência, verificando novamente a pasta `reference tables` e recriando as tabs de acordo com os arquivos presentes.

## Localização

O botão está localizado na barra de pesquisa do modal "Entitlements Catalog", ao lado do campo de busca.

## Funcionalidade

Quando você clica no botão Force Refresh, o sistema:

1. **Verifica a pasta** - Consulta o servidor ou usa a configuração em `csv-files-config.js` para obter a lista atualizada de arquivos CSV
2. **Remove tabs obsoletas** - Se algum arquivo foi removido da pasta, a tab correspondente é removida
3. **Adiciona novas tabs** - Se algum arquivo foi adicionado à pasta, uma nova tab é criada
4. **Atualiza dados** - Recarrega os dados da tab ativa ou ativa a primeira tab disponível

## Feedback Visual

Durante o processo de refresh, você verá:

- **Botão desabilitado** - O botão fica semi-transparente e não pode ser clicado novamente
- **Animação de rotação** - O ícone 🔄 gira continuamente
- **Mensagem de loading** - "🔄 Refreshing catalog..." aparece na área de conteúdo
- **Feedback de sucesso** - ✓ verde por 2 segundos quando concluído com sucesso
- **Feedback de erro** - ✗ vermelho por 2 segundos se houver algum problema

## Como Adicionar/Remover Arquivos

### Método 1: Adicionar arquivos diretamente na pasta

1. Coloque o arquivo CSV na pasta `reference tables`
2. Clique no botão Force Refresh (🔄)
3. A nova tab aparecerá automaticamente

### Método 2: Atualizar a configuração

1. Edite o arquivo `js/csv-files-config.js`
2. Adicione ou remova o nome do arquivo na lista `window.CSV_FILES_LIST`
3. Clique no botão Force Refresh (🔄)

Exemplo:
```javascript
window.CSV_FILES_LIST = [
    '2026_Master Entitlements_LIST.csv',
    'Training Catalog.csv',
    'Novo_Arquivo.csv'  // Adicione aqui
];
```

## Comportamento Automático

Além do refresh manual, o sistema também:

- **Verifica automaticamente** a cada 10 segundos quando o modal está aberto
- **Detecta mudanças** nos arquivos baseado na data de modificação
- **Marca tabs atualizadas** com um ponto azul (●) quando o conteúdo foi modificado

## Modo Offline

Se o servidor não estiver disponível, o sistema usa automaticamente a lista configurada em `csv-files-config.js` como fallback.

## Troubleshooting

**Problema**: A tab não aparece após adicionar um arquivo
- **Solução**: Verifique se o arquivo está na pasta `reference tables` e clique no Force Refresh

**Problema**: A tab não é removida após deletar um arquivo
- **Solução**: Clique no Force Refresh para forçar a atualização

**Problema**: Erro ao fazer refresh
- **Solução**: Verifique se o servidor está rodando ou se o arquivo está corretamente configurado em `csv-files-config.js`

## Código Técnico

O refresh é gerenciado pela função `refreshCatalogTabs()` no arquivo `js/referenceData.js`, que:

1. Tenta buscar a lista de arquivos do servidor via `/api/catalog`
2. Se falhar, usa `window.CSV_FILES_LIST` como fallback
3. Chama `processCatalogUpdate()` para sincronizar as tabs com a lista de arquivos
4. Remove tabs que não existem mais
5. Adiciona tabs para novos arquivos
6. Marca tabs com dados modificados
