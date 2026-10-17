# S.L.I.D.E. Monitoring Dashboard

Responsive progressive web app prototype for the **Soil Movement Landslide Indication and Detection** system. It presents current environmental readings, slope movement indicators, alert history, site context, and field-device health.

> S.L.I.D.E. indicates risky conditions. It does not predict landslides.

## Local preview

Service workers require an HTTP origin. From the project directory, run:

```bash
python3 -m http.server 8000 --directory dist
```

Open `http://localhost:8000`.

## PWA support

- Installable manifest with standard and maskable icons
- Offline application-shell cache
- Online/offline state feedback
- Standalone-mode safe-area handling
- Responsive layouts for phones, tablets, laptops, and desktop screens

The displayed readings and interactions are prototype data. Hardware, ThingSpeak, GSM, authentication, and alert-delivery integrations are not implemented.

See [UI-UX-AUDIT.md](UI-UX-AUDIT.md) for the complete usability, accessibility, frontend, and production-readiness audit.
