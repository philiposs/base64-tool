# Base64 Tool

Statyczny konwerter tekstu do i z Base64. Cała konwersja odbywa się lokalnie w przeglądarce.

Adres produkcyjny: [base64.chleb.app](https://base64.chleb.app)

## Uruchomienie

```bash
docker compose up -d --build
```

Kontener działa w zewnętrznej sieci Docker `chleb-apps` i jest dostępny dla reverse proxy pod adresem `http://base64-tool:80`.

Nginx Proxy Manager używa hosta `base64.chleb.app`, certyfikatu wildcard `*.chleb.app` oraz konfiguracji przechowywanej w `npm-proxy-host.conf`.
