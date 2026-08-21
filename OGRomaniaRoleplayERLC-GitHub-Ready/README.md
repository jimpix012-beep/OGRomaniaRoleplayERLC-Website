# OG Romania — ERLC Hard Roleplay

Website oficial OG Romania, pregatit pentru GitHub + Cloudflare Pages.

## Structura
- index.html
- styles.css
- script.js
- logo.png
- functions/api/players.js
- _headers
- _redirects
- 404.html

## Live players
Endpoint-ul `/api/players` foloseste secretul Cloudflare `SERVER_KEY`.
Nu pune Server Key-ul in index.html sau script.js.

## Cloudflare
1. Urca toate fisierele din acest repository in branch-ul `main`.
2. In Cloudflare Pages conecteaza repository-ul si branch-ul `main`.
3. In Settings → Variables and Secrets adauga:
   - Name: `SERVER_KEY`
   - Type: `Secret`
   - Value: cheia ER:LC
4. Salveaza si fa deploy.

## Discord
https://discord.gg/nYnZEfFnF
