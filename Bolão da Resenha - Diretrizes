# Diretrizes Fixas do Projeto: Bolão da Resenha

## Objetivo

Este documento define as informações oficiais e obrigatórias do projeto **Bolão da Resenha**.

Sempre que qualquer agente, assistente, automação ou ambiente de desenvolvimento for executar tarefas relacionadas a este projeto, principalmente ações de **deploy**, **versionamento**, **publicação** ou **manutenção**, estas informações devem ser consultadas antes de qualquer comando ser executado.

---

## Identificação do Projeto

```yaml
nome_do_projeto: Bolão da Resenha
tipo_do_projeto: Aplicação web
ambiente_principal: Vercel
controle_de_versao: GitHub
```

---

## Caminho Oficial da Pasta Raiz

A pasta raiz oficial do projeto é:

```txt
C:\STUDIO LOGIN\PRODUTOS\Bolão da Resenha\BolaodaResenha
```

Esta é a única pasta que deve ser considerada como diretório principal do projeto.

Antes de executar qualquer comando como `npm install`, `npm run build`, `git status`, `git add`, `git commit`, `git push` ou `vercel deploy`, o agente deve confirmar que está trabalhando dentro desta pasta.

---

## Repositório Oficial do GitHub

O repositório oficial do projeto é:

```txt
https://github.com/manoelnetoarq-tech/BolaodaResenha.git
```

Este é o único repositório GitHub autorizado para este projeto.

Antes de realizar qualquer operação de Git, o agente deve verificar se o repositório remoto configurado corresponde exatamente ao link acima.

### Comando recomendado para verificação

```bash
git remote -v
```

O resultado esperado deve apontar para:

```txt
https://github.com/manoelnetoarq-tech/BolaodaResenha.git
```

Caso o repositório remoto seja diferente, o agente não deve realizar `push`, `pull`, `commit` ou qualquer alteração relacionada ao versionamento sem antes corrigir ou sinalizar o problema.

---

## Link Oficial do Projeto na Vercel

A URL oficial do projeto publicado na Vercel é:

```txt
https://bolaodaresenha.vercel.app/
```

Sempre que for necessário validar o projeto em produção, o agente deve considerar este como o link oficial de acesso público.

---

## Regra Obrigatória Antes de Fazer Deploy

Antes de qualquer deploy, o agente deve obrigatoriamente validar as seguintes informações:

```yaml
pasta_raiz_correta: C:\STUDIO LOGIN\PRODUTOS\Bolão da Resenha\BolaodaResenha
repositorio_github_correto: https://github.com/manoelnetoarq-tech/BolaodaResenha.git
url_vercel_correta: https://bolaodaresenha.vercel.app/
```

O deploy só pode ser realizado se todas as informações acima estiverem corretas.

---

## Checklist Antes do Deploy

Antes de publicar qualquer alteração, seguir este checklist:

* Confirmar que o terminal está aberto na pasta raiz oficial do projeto.
* Confirmar que o Git remoto aponta para o repositório correto.
* Confirmar que as alterações pertencem ao projeto **Bolão da Resenha**.
* Executar a instalação de dependências apenas dentro da pasta correta, se necessário.
* Executar o build do projeto antes do deploy, quando aplicável.
* Verificar se não existem erros de compilação.
* Fazer commit apenas das alterações relacionadas ao projeto.
* Enviar o código para o repositório GitHub correto.
* Realizar o deploy vinculado ao projeto correto da Vercel.
* Validar a publicação acessando a URL oficial do projeto.

---

## Comandos de Referência

### Acessar a pasta oficial do projeto

```bash
cd "C:\STUDIO LOGIN\PRODUTOS\Bolão da Resenha\BolaodaResenha"
```

### Verificar o repositório remoto

```bash
git remote -v
```

### Verificar o status do Git

```bash
git status
```

### Instalar dependências

```bash
npm install
```

### Rodar o projeto localmente

```bash
npm run dev
```

### Gerar build de produção

```bash
npm run build
```

### Fazer deploy

```bash
vercel deploy
```

Ou, caso o deploy de produção seja necessário:

```bash
vercel deploy --prod
```

---

## Restrições Importantes

O agente não deve:

* Fazer deploy a partir de outra pasta.
* Criar um novo projeto na Vercel sem necessidade.
* Usar outro repositório GitHub.
* Fazer push para um repositório diferente.
* Reconfigurar o projeto sem confirmar os dados oficiais.
* Rodar comandos de instalação, build ou deploy fora da pasta raiz definida.
* Assumir automaticamente outro diretório apenas porque existe um projeto com nome parecido.

---

## Regra de Segurança

Se houver qualquer divergência entre a pasta atual, o repositório remoto ou o projeto da Vercel, o agente deve interromper a ação e informar o problema antes de continuar.

A prioridade é evitar deploy em ambiente incorreto, perda de histórico Git, publicação em projeto errado ou alteração acidental em outra aplicação.

---

## Resumo Final

O projeto **Bolão da Resenha** deve sempre usar:

```yaml
pasta_raiz: C:\STUDIO LOGIN\PRODUTOS\Bolão da Resenha\BolaodaResenha
github: https://github.com/manoelnetoarq-tech/BolaodaResenha.git
vercel: https://bolaodaresenha.vercel.app/
```

Estas informações são consideradas a fonte oficial do projeto e devem ser consultadas antes de qualquer processo de deploy, manutenção ou versionamento.
