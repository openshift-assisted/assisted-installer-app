# assisted-installer-app

Install npm dependencies and start the stage stable server

```
npm install
npm start
```

Visit https://stage.foo.redhat.com:1337/openshift/assisted-installer-app

## UHC-portal development

By default, uhc-portal proxies requests for `assisted-installer-app` to the production CDN at `https://console.redhat.com/apps/assisted-installer-app/`. To develop locally against your own copy of the micro-frontend instead, start both projects:

In assisted-installer-app, run:

```
npm install && npm run start:federated
```

This builds the Module Federation bundle and serves it on port 8003.

In uhc-portal, run:

```
LOCAL_APPS=assisted-installer-app:8003 LOCAL_APP_HOST=localhost yarn dev
```

This tells the uhc-portal dev server to load `assisted-installer-app` from your local machine instead of the CDN, so changes you make here are reflected immediately in the portal.
