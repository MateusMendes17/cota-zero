# Imagens — Cota Zero

O site usa imagens de demonstração locais, em `images/demo/`. Foram descarregadas
do Unsplash e convertidas para WebP; já não há pedidos de imagens a terceiros em
runtime. Todas as imagens têm legenda técnica, texto alternativo e proporção
declarada.

Cada fotografia tem duas versões: o ficheiro original (por exemplo,
`photo-…-1600x1200.webp`), usado no lightbox, e uma variante `-900.webp`, usada
nos cartões, na galeria e no comparador de corte. Ao substituir uma imagem,
atualize as duas versões ou ajuste a função `thumb()` em `js/project-page.js` e
`js/projects-table.js`.

## O que substituir

1. **Fotografia de projeto** — `js/data.js`, campo `capa` e array `imagens` de cada
   projeto. Manter 5 imagens por projeto: uma de capa (1800 × 1350 ou 1800 × 1200)
   e quatro de galeria (1200–1600 px no lado maior). A capa alimenta também a
   pré-visualização da tabela e os cartões relacionados.
2. **Estúdio** — `estudio.html`, figuras `FIG. E-01` a `FIG. E-03`.
3. **Open Graph** — cabeçalho de cada página (`meta property="og:image"`), com
   ficheiros de 1200 × 630 em `images/demo/`.

## Convenções

- Formato: WebP (ou AVIF), qualidade 72–82, sRGB.
- Nome sugerido: `projeto-casa-do-muro-01.webp`, `estudio-atelier-01.webp`.
- Guardar em `images/` e trocar o caminho em `js/data.js` ou no HTML.
- Texto alternativo: descrever o que se vê, não a intenção do arquiteto.
- Legenda: `FIG. 01 — Vista / elemento — ano`.
- Não usar imagens com pessoas identificáveis sem autorização.
- O tratamento P/B e o grão são aplicados por CSS; não os aplicar na imagem original.

## Estado atual

As imagens de `images/demo/` são placeholders editoriais obtidos no Unsplash,
não obra construída pela Cota Zero. O nome de cada ficheiro inclui o ID original
da fotografia e as dimensões, para facilitar a substituição e a auditoria.
Devem ser substituídas antes de qualquer publicação comercial.
