# S.L.I.D.E. hosted dashboard

This repository serves the S.L.I.D.E. monitoring website and its same-origin device API. The hosted website is the only monitoring dashboard. The ESP32 provides a protected Wi-Fi and endpoint setup page only.

The application targets the team's Orange Pi Zero 3 and `https://slide.akios.site`. The Node service binds to `127.0.0.1` by default; the existing TLS reverse proxy should route the website and `/api/v1/` requests to this service. This repository does not configure or deploy that production proxy.

## Run locally

Use Node.js 22.13 or newer. Copy `.env.example` to a private `.env`, replace both placeholder secrets with independently generated values, and configure the matching device ID/token in the firmware's ignored `src/slide_local_secret.h`.

```sh
npm start
```

The service listens on `http://127.0.0.1:8080` by default and creates `data/slide.sqlite` on first start. Open the service URL and sign in with `SLIDE_DASHBOARD_PASSWORD`. Never commit `.env`, `data/`, or a firmware secret header. See [API.md](API.md) for routes, payloads, and Orange Pi integration requirements.

## Storage and delivery behavior

The website checks received telemetry directly in the browser. MPU calibration and firmware Experimental Test mode are not prerequisites for browser alerts. Defaults are MPU CAUTION at 3°, WARNING at 5°, CRITICAL at 10°, and soil/rain CAUTION at raw ADC ≥ 3000. Limits are inclusive, checked on the first fresh reading, and editable in **Station settings**. ADC direction can be reversed to ≤ for sensors whose raw readings decrease when wet.

MPU angle is `max(abs(pitch_deg), abs(roll_deg))`, referenced to the sensor axes, not change from a mounted baseline. A tilted installation may trigger immediately. Overview cards and charts use this angle and raw ADC readings. Temperature/humidity provide context only.

Thresholds are stored per station in this browser's local storage. Other browsers have their own thresholds. If browser storage is blocked, edits apply only for the current page session. Keep the dashboard open, signed in, visible and connected for continued monitoring; this is not a background alarm service. Browser events are labeled **BROWSER**, kept for the current page session (up to 100), and can be acknowledged locally. Existing firmware events remain labeled **DEVICE** and retain their server history and acknowledgment flow. Browser alerts do not operate a device LCD or hardware alarm.

Only telemetry received within 15 seconds, from an online device with an ONLINE sensor and finite readings, is evaluated. Invalid or stale data cannot create or clear an alert. Existing conditions remain marked stale/unknown until fresh data arrives. Returning to the normal range clears an alert; acknowledgment alone does not. Repeated over-limit samples update the same event, and escalation creates a new notification.

- SQLite stores device state, readings, events, acknowledgments, and commands. Readings older than 30 days are pruned as new telemetry arrives.
- The ESP32 sends current telemetry every five seconds and coalesces it during outages rather than building an unbounded backlog.
- Event delivery uses a separate 24-entry RAM queue from the 12-item display history. It coalesces queued revisions per event, retries with capped jittered backoff, reports retry/drop counts, drops and counts the oldest queued event on overflow, and loses queued events on reboot.
- Commands are bound to the device's current boot ID and expire after 120 seconds. Only one pending maintenance command is accepted at a time.
- Dashboard API responses and controls are not cached by the service worker. The cached PWA shell can open offline, but it does not show cached sensor values as live.

## Development checks

Run `npm run check` for JavaScript syntax and `npm test` for threshold evaluation, freshness, event transitions, settings validation, and browser integration tests. No package installation is required; the project uses Node built-ins.

## Important limitation

The backend and API contract in this repository are the integration implementation for the workflow. They have not been installed on the Orange Pi or verified against the live domain. Preserve the existing host service and database while preparing a staging deployment; production routing and backups require the server owner to apply the documented configuration.

S.L.I.D.E. reports experimental sensor conditions; it does not predict landslides.
