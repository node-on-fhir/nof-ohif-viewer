# Node on FHIR — Radiology Information System (RIS) Integration

Step-by-step guide for setting up a Node on FHIR instance as the backend RIS for the NOF OHIF Viewer.

## 1. Run Node on FHIR (Honeycomb Edition)

Install Meteor 3.4, clone the Honeycomb starter, and run it:

```bash
curl https://install.meteor.com?release=3.4 | sh

git clone https://github.com/node-on-fhir/honeycomb nof

cd nof

meteor npm install
meteor run

open http://localhost:3000
Ctrl+C
```

## 2. Add USCore, International Patient Summary, Synthea, and Admin Tools

Re-run with the clinical packages loaded via `--extra-packages`:

```bash
meteor npm install

meteor run --extra-packages "clinical:us-core, clinical:international-patient-summary, clinical:synthea, clinical:admin-tools, clinical:data-importer"

open http://localhost:3000
Ctrl+C
```

## 3. Add a Settings File

Same as above, but point Meteor at a settings file with `--settings`:

```bash
meteor npm install

meteor run --settings settings/settings.nodeonfhir.localhost.json --extra-packages "clinical:us-core, clinical:international-patient-summary, clinical:synthea, clinical:admin-tools, clinical:data-importer"

open http://localhost:3000
Ctrl+C
```

## 4. Add the Radiology Workflow Package

Clone the `radiology-workflow` package into a local `npmPackages/` directory, then run with the `EXTRA_WORKFLOWS` environment variable and the radiology-workflow settings file on port 3200:

```bash
cd nof
mkdir npmPackages && cd npmPackages
git clone https://github.com/node-on-fhir/radiology-workflow
cd ..

meteor npm install

EXTRA_WORKFLOWS=@node-on-fhir/radiology-workflow meteor run --settings npmPackages/radiology-workflow/settings/settings.ohif.json --extra-packages "clinical:us-core, clinical:international-patient-summary, clinical:synthea, clinical:admin-tools, clinical:data-importer" --port 3200

open http://localhost:3200
Ctrl+C
```

## 5. Register an OAuth Client

The OHIF viewer authenticates against Node on FHIR using SMART on FHIR (OAuth 2.0). You need to register a client so the RIS knows which app is requesting access.

Navigate to `http://localhost:3200/oauth-clients` and click **"+ New Client"**. Fill in the following fields:

| Field | Value |
|---|---|
| **Client Name** | `OHIF FHIR Viewer` |
| **Redirect URIs** | `http://localhost:3200/fhir-viewer` |
| **Scopes** | `launch openid fhirUser patient/*.read` |
| **Grant Types** | `authorization_code` |
| **Response Types** | `code` |
| **Token Endpoint Auth Method** | `client_secret_basic` |

Alternatively, POST the equivalent JSON to the `/oauth/register` endpoint:

```json
{
  "client_name": "OHIF FHIR Viewer",
  "redirect_uris": ["http://localhost:3200/fhir-viewer"],
  "scope": "launch openid fhirUser patient/*.read",
  "grant_types": ["authorization_code"],
  "response_types": ["code"],
  "token_endpoint_auth_method": "client_secret_basic"
}
```

After registration, copy the generated `client_id`. The viewer defaults to `4YPEPzLr55w6roKCs`, but you can override it by setting the `smartClientId` field in the data source configuration.

## Next Steps

- Production deployment and HTTPS configuration
- External identity provider integration
