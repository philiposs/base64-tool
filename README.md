# Base64 Tool

A small, private Base64 encoder and decoder that runs entirely in the browser.

[Open the app](https://base64.chleb.app)

### Desktop

![Base64 Tool desktop interface](docs/screenshot.png)

### Mobile

<img src="docs/screenshot-mobile.png" alt="Base64 Tool mobile interface" width="390">

## Features

- Encode plain text to Base64 in real time.
- Decode Base64 back to UTF-8 text.
- Handle Unicode characters correctly.
- Generate and accept URL-safe Base64.
- Copy results to the clipboard with one click.
- Move the current result back to the input field.
- Clear both fields instantly.
- Work well on desktop and mobile screens.

## Privacy

All conversion happens locally in your browser. The app has no backend, sends no input to a server, and stores no conversion history. Anonymous page-view and performance telemetry does not include the content entered into the converter.

## Technology

The application is built with Vue 3 and Vite. It uses Lucide icons, Web Analytics, and Speed Insights. Nginx serves the production build when running the Docker image.

## Run locally

Install the dependencies and start the development server:

```bash
npm install
npm run dev
```

Vite will print the local development address in the terminal.

## Run with Docker

```bash
docker compose up -d --build
```

The app will be available at [localhost:8080](http://localhost:8080). Stop it with:

```bash
docker compose down
```

## Project structure

```text
.
├── compose.yaml    # Local Docker Compose setup
├── Dockerfile      # Nginx container image
├── index.html      # Page structure
├── nginx.conf      # Static server and security headers
├── public/          # Static assets and application icon
├── src/             # Vue application and conversion logic
├── styles.css       # Responsive interface styles
└── vite.config.js   # Vite and Vue configuration
```

## Security headers

The included server configurations set a restrictive Content Security Policy and disable access to the camera, microphone, and geolocation. They also prevent framing and MIME-type sniffing.

## Browser support

The app works in current versions of Chrome, Firefox, Safari, and Edge. It relies on standard browser APIs including `TextEncoder`, `TextDecoder`, and the Clipboard API.
