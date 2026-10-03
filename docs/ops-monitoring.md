# Ops monitoring (P8-02)

Free-tier setup the owner completes after deploy. No paid services.

## Uptime

1. Create a free [UptimeRobot](https://uptimerobot.com) account.
2. Monitor `https://www.syedbaqirali.com/` (HTTP, 5 minute interval).
3. Monitor `https://api.syedbaqirali.com/actuator/health` (keyword or HTTP 200).
4. Alert to an email you check.

## Errors

1. Create a free [Sentry](https://sentry.io) project for Next.js and one for Spring Boot if desired.
2. Set `SENTRY_DSN` / `NEXT_PUBLIC_SENTRY_DSN` only after the SDKs are wired.
3. Until then, rely on host logs and UptimeRobot downtime alerts.

## Note

Grafana Alloy already scrapes Spring metrics in some environments (`config/alloy`). That does not replace public uptime checks.
