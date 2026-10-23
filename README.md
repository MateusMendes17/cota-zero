# Cota Zero — Atelier de Arquitetura

Website estático de demonstração para um atelier de arquitetura fictício no Porto.

> **Demonstração.** A Cota Zero é uma identidade fictícia. Pessoas, obras, prémios, contactos e dados legais são inventados. O formulário de contacto valida localmente e **não envia dados**. As imagens são fotografias de stock da Unsplash. Consulte `legal.html` para o aviso completo.

## Stack

- HTML5, CSS3 e JavaScript vanilla (ES modules)
- Sem framework, sem build step e sem backend
- Tipografia e imagens alojadas localmente
- Mapa do OpenStreetMap carregado apenas após clique
- Página `404.html` personalizada
- Configuração de headers e cache em `vercel.json`

## Estrutura

```text
.
├── index.html
├── projetos.html
├── projeto.html
├── processo.html
├── materiais.html
├── estudio.html
├── contacto.html
├── legal.html
├── 404.html
├── design-system.html
├── css/
├── js/
├── fonts/
├── images/
├── svg/
├── robots.txt
├── sitemap.xml
└── vercel.json
```

## Pré-visualizar localmente

```bash
python -m http.server 4173 --bind 127.0.0.1
```

Abrir `http://127.0.0.1:4173/`.

## Publicação

O site é publicado na Vercel a partir deste repositório. Qualquer push para o ramo principal pode gerar um novo deployment, se a integração Git estiver ativa.

```bash
vercel --prod
```

## Antes de uma versão de produção real

1. Substituir todos os `[placeholder]` e dados fictícios em `legal.html`, `estudio.html` e no rodapé.
2. Substituir as imagens de demonstração por fotografia própria, com direitos e créditos.
3. Ligar o formulário a um endpoint real, com validação no servidor e proteção anti-spam.
4. Rever o aviso legal, a política de privacidade e os cookies com apoio jurídico.
5. Confirmar o domínio final e atualizar canónicos, Open Graph, `robots.txt` e `sitemap.xml`.
6. Remover o aviso de demonstração e os `noindex` apenas quando o conteúdo estiver validado.

## Créditos

- Fotografias de demonstração: Unsplash
- Mapa: © OpenStreetMap contributors, sob Open Database License
- Tipografia: Archivo Black, JetBrains Mono e Caveat, alojadas localmente em WOFF2
