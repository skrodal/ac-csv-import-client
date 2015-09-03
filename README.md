# ConnectImport (ac-csv-import)

Dette er en klient (front-end) som tar seg av autentisering og samling av nødvendig brukerinput for å opprette innhold i tjeneste Adobe Connect. 

Spesifikt:

- Opprette brukere i tjenesten
- Opprette innhold i 'Shared Meetings':
  - Mapper
  - Møterom
- Knytte brukere til innhold som 'host'

Tilgang i Shared Meetings folder er begrenset til pålogget brukers egen organisasjon, eks:

- fornavn.etternavn@lærested.no vil kun ha mulighet til å opprette innhold i mapper under /Shared Meetings/lærested/

Klienten er registrert i UNINETT Connect tjenesteplattform og benytter seg av følgende 3.parts APIer (også registrert i Connect):

- https://github.com/skrodal/ac-csv-import-api
  - Proxy mellom klient og Adobe Connect
- https://github.com/skrodal/uninett-ecampus-kind
  - Proxy mellom klient og Kind. Brukes for å etablere om pålogget brukers org abonnerer på tjenesten.

![Preview](/app/img/ConnectImport.png)
