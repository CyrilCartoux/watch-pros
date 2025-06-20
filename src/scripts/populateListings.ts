const { createClient } = require('@supabase/supabase-js');
const { faker } = require('@faker-js/faker');

const brands = [
    {
      "id": "42461112-f532-43a8-a727-d2df804d1940",
      "slug": "richard-mille",
      "label": "Richard Mille",
      "created_at": "2025-05-30 14:54:13.78928+00",
      "popular": false
    },
    {
      "id": "e42d3b7c-d1aa-4f5c-8736-94e8f6a00f13",
      "slug": "tag-heuer",
      "label": "Tag Heuer",
      "created_at": "2025-05-30 14:54:13.9654+00",
      "popular": false
    },
    {
      "id": "731ec105-c1a2-4a8b-9e16-c1885804ce55",
      "slug": "breitling",
      "label": "Breitling",
      "created_at": "2025-05-30 14:54:14.017367+00",
      "popular": false
    },
    {
      "id": "5ca76279-4b2d-4ad6-9b9c-58d16e3c0a94",
      "slug": "tudor",
      "label": "Tudor",
      "created_at": "2025-05-30 14:54:14.082006+00",
      "popular": false
    },
    {
      "id": "bb6d9e72-c952-4489-b218-a9f57fdcf8db",
      "slug": "hublot",
      "label": "Hublot",
      "created_at": "2025-05-30 14:54:14.169794+00",
      "popular": false
    },
    {
      "id": "4b528ab8-0b61-4a1a-bf17-3a936b57f424",
      "slug": "iwc",
      "label": "IWC",
      "created_at": "2025-05-30 14:54:14.230542+00",
      "popular": false
    },
    {
      "id": "267fb859-934a-47ad-b030-d6cdc3666c50",
      "slug": "jaeger-lecoultre",
      "label": "Jaeger-LeCoultre",
      "created_at": "2025-05-30 14:54:14.286542+00",
      "popular": false
    },
    {
      "id": "526c2d41-52d1-4525-8aec-5498bb15e249",
      "slug": "panerai",
      "label": "Panerai",
      "created_at": "2025-05-30 14:54:14.341362+00",
      "popular": false
    },
    {
      "id": "d32d40c0-7ea1-4b72-a282-6b86f07e61f2",
      "slug": "longines",
      "label": "Longines",
      "created_at": "2025-05-30 14:54:14.393344+00",
      "popular": false
    },
    {
      "id": "9ffe59c2-e6a8-4833-b544-e985066459c4",
      "slug": "zenith",
      "label": "Zenith",
      "created_at": "2025-05-30 14:54:14.443505+00",
      "popular": false
    },
    {
      "id": "313b1ebc-ab4f-41d8-8bb1-4d35b6ec8fc7",
      "slug": "vacheron-constantin",
      "label": "Vacheron Constantin",
      "created_at": "2025-05-30 14:54:14.516187+00",
      "popular": false
    },
    {
      "id": "27c95066-ebb0-47d8-9ea9-e5dc6561ca37",
      "slug": "seiko",
      "label": "Seiko",
      "created_at": "2025-05-30 14:54:14.570799+00",
      "popular": false
    },
    {
      "id": "d1aa02d2-bd20-4136-ad3e-c7ef36e11055",
      "slug": "breguet",
      "label": "Breguet",
      "created_at": "2025-05-30 14:54:14.618516+00",
      "popular": false
    },
    {
      "id": "ce0bab2f-2730-41da-8f94-bad32d6138c0",
      "slug": "chanel",
      "label": "Chanel",
      "created_at": "2025-05-30 14:54:14.664702+00",
      "popular": false
    },
    {
      "id": "32dd7f29-deb3-4885-bb15-7620c3491df3",
      "slug": "bell-and-ross",
      "label": "Bell & Ross",
      "created_at": "2025-05-30 14:54:14.716031+00",
      "popular": false
    },
    {
      "id": "2d1e9e98-9c4d-43d5-bbf0-19e0a3b692f7",
      "slug": "grand-seiko",
      "label": "Grand Seiko",
      "created_at": "2025-05-30 14:54:14.803922+00",
      "popular": false
    },
    {
      "id": "97858d23-05fe-4576-ae8c-581338b7a0df",
      "slug": "blancpain",
      "label": "Blancpain",
      "created_at": "2025-05-30 14:54:14.859699+00",
      "popular": false
    },
    {
      "id": "00001610-29b4-4b0d-b987-416fdbc196d2",
      "slug": "maurice-lacroix",
      "label": "Maurice Lacroix",
      "created_at": "2025-05-30 14:54:14.905695+00",
      "popular": false
    },
    {
      "id": "c0c7d48e-d577-4c9d-a32d-1d8b52813450",
      "slug": "nomos",
      "label": "Nomos",
      "created_at": "2025-05-30 14:54:14.956347+00",
      "popular": false
    },
    {
      "id": "f24149d5-852d-4de8-909d-a8729f85c0f0",
      "slug": "ulysse-nardin",
      "label": "Ulysse Nardin",
      "created_at": "2025-05-30 14:54:15.010232+00",
      "popular": false
    },
    {
      "id": "5cc76394-ecb4-4e13-ab35-f0bacd8b10df",
      "slug": "glashutte-original",
      "label": "Glashütte Original",
      "created_at": "2025-05-30 14:54:15.055863+00",
      "popular": false
    },
    {
      "id": "29692e6c-7d55-4a03-9ac9-2e50e8f455e8",
      "slug": "rolex",
      "label": "Rolex",
      "created_at": "2025-05-30 14:54:13.455145+00",
      "popular": true
    },
    {
      "id": "96f7bbb1-2a1c-4d4e-a163-70d9076734e9",
      "slug": "omega",
      "label": "Omega",
      "created_at": "2025-05-30 14:54:13.560491+00",
      "popular": true
    },
    {
      "id": "c926b996-58d0-430d-8b4c-17a6fc4fe8ea",
      "slug": "patek-philippe",
      "label": "Patek Philippe",
      "created_at": "2025-05-30 14:54:13.610438+00",
      "popular": true
    },
    {
      "id": "d421865e-5344-4b92-a8dd-ee525da88f1e",
      "slug": "audemars-piguet",
      "label": "Audemars Piguet",
      "created_at": "2025-05-30 14:54:13.707626+00",
      "popular": true
    },
    {
      "id": "a8ef4cfd-155c-47ec-ab26-7b5806288961",
      "slug": "cartier",
      "label": "Cartier",
      "created_at": "2025-05-30 14:54:13.880182+00",
      "popular": true
    },
    {
      "id": "618c6a35-ccb5-4aff-877e-c48b2101103a",
      "slug": "h-moser-&-cie",
      "label": "H. Moser & Cie.",
      "created_at": "2025-06-05 08:50:02.911819+00",
      "popular": false
    },
    {
      "id": "bf1a4585-e3db-4621-a33f-20c658bcd9e0",
      "slug": "bulgari",
      "label": "Bulgari",
      "created_at": "2025-06-05 08:51:38.130153+00",
      "popular": false
    },
    {
      "id": "92f07b61-6319-471e-b6af-0eb30ee6838c",
      "slug": "chopard",
      "label": "Chopard",
      "created_at": "2025-06-05 08:52:36.331312+00",
      "popular": false
    },
    {
      "id": "a9cfdd75-047e-4119-8db8-e33744e8c9b2",
      "slug": "corum",
      "label": "Corum",
      "created_at": "2025-06-05 08:53:30.386202+00",
      "popular": false
    },
    {
      "id": "0cb1dc50-62e4-4f6f-b6e3-0ef43c6609f1",
      "slug": "cvstos",
      "label": "Cvstos",
      "created_at": "2025-06-05 08:55:00.627734+00",
      "popular": false
    },
    {
      "id": "8ebb31e7-151c-49c6-b719-3d82f6294bd9",
      "slug": "franck-muller",
      "label": "Franck Muller",
      "created_at": "2025-06-05 08:56:20.92493+00",
      "popular": false
    },
    {
      "id": "fabf8fc3-739d-44ce-9039-ffa21ab7e587",
      "slug": "parmigiani",
      "label": "Parmigiani",
      "created_at": "2025-06-05 08:57:37.826519+00",
      "popular": false
    },
    {
      "id": "ead86a7d-9a6f-4ab5-935f-93621bf31df3",
      "slug": "piaget",
      "label": "Piaget",
      "created_at": "2025-06-05 08:57:52.03625+00",
      "popular": false
    },
    {
      "id": "3ea9490f-ad90-4f36-af5f-aeb130abbfea",
      "slug": "other",
      "label": "Other",
      "created_at": "2025-06-08 09:10:58.977056+00",
      "popular": false
    }
  ]

  const models = [
    {
      "id": "d6c265ae-2b12-4b94-b8ee-9d0b30fe94f9",
      "brand_id": "29692e6c-7d55-4a03-9ac9-2e50e8f455e8",
      "slug": "explorer",
      "label": "Explorer",
      "created_at": "2025-05-30 14:54:15.407635+00",
      "popular": false
    },
    {
      "id": "6ee3236d-70a4-4d76-8c65-1d2e784fb435",
      "brand_id": "29692e6c-7d55-4a03-9ac9-2e50e8f455e8",
      "slug": "sea-dweller",
      "label": "Sea-Dweller",
      "created_at": "2025-05-30 14:54:15.461075+00",
      "popular": false
    },
    {
      "id": "f80ec6e8-4619-4f9b-b9e2-49ecab009bb8",
      "brand_id": "29692e6c-7d55-4a03-9ac9-2e50e8f455e8",
      "slug": "sky-dweller",
      "label": "Sky-Dweller",
      "created_at": "2025-05-30 14:54:15.511891+00",
      "popular": false
    },
    {
      "id": "cbb47e72-b198-42f7-99b0-3213304b6beb",
      "brand_id": "29692e6c-7d55-4a03-9ac9-2e50e8f455e8",
      "slug": "oyster-perpetual",
      "label": "Oyster Perpetual",
      "created_at": "2025-05-30 14:54:15.559894+00",
      "popular": false
    },
    {
      "id": "23f4f021-e4d9-4ff9-a253-9f623fd02cca",
      "brand_id": "29692e6c-7d55-4a03-9ac9-2e50e8f455e8",
      "slug": "yacht-master",
      "label": "Yacht-Master",
      "created_at": "2025-05-30 14:54:15.613362+00",
      "popular": false
    },
    {
      "id": "78f6c54e-ff4a-4c0f-a70f-40999caf79df",
      "brand_id": "96f7bbb1-2a1c-4d4e-a163-70d9076734e9",
      "slug": "constellation",
      "label": "Constellation",
      "created_at": "2025-05-30 14:54:15.872858+00",
      "popular": false
    },
    {
      "id": "4cf017a9-fbf3-4cf3-983c-431d31e79492",
      "brand_id": "96f7bbb1-2a1c-4d4e-a163-70d9076734e9",
      "slug": "de-ville",
      "label": "De Ville",
      "created_at": "2025-05-30 14:54:15.920308+00",
      "popular": false
    },
    {
      "id": "bf780962-6196-4b1d-b2b2-839343c6515a",
      "brand_id": "96f7bbb1-2a1c-4d4e-a163-70d9076734e9",
      "slug": "railmaster",
      "label": "Railmaster",
      "created_at": "2025-05-30 14:54:15.968492+00",
      "popular": false
    },
    {
      "id": "97a4a502-3643-4eed-8d37-37271d31a10a",
      "brand_id": "96f7bbb1-2a1c-4d4e-a163-70d9076734e9",
      "slug": "seamaster-300",
      "label": "Seamaster 300",
      "created_at": "2025-05-30 14:54:16.01654+00",
      "popular": false
    },
    {
      "id": "e40e00b1-fc63-4550-8023-65c113de2b3c",
      "brand_id": "96f7bbb1-2a1c-4d4e-a163-70d9076734e9",
      "slug": "speedmaster-57",
      "label": "Speedmaster '57",
      "created_at": "2025-05-30 14:54:16.076297+00",
      "popular": false
    },
    {
      "id": "dd023069-3b82-46a1-814a-ead0810892b6",
      "brand_id": "96f7bbb1-2a1c-4d4e-a163-70d9076734e9",
      "slug": "seamaster-ploprof",
      "label": "Seamaster PloProf",
      "created_at": "2025-05-30 14:54:16.124524+00",
      "popular": false
    },
    {
      "id": "f7f08b4c-3161-4bd6-883e-d4b708619b18",
      "brand_id": "c926b996-58d0-430d-8b4c-17a6fc4fe8ea",
      "slug": "twenty-4",
      "label": "Twenty~4",
      "created_at": "2025-05-30 14:54:16.428097+00",
      "popular": false
    },
    {
      "id": "9af906e3-a684-45c4-bf48-d73ffa429049",
      "brand_id": "c926b996-58d0-430d-8b4c-17a6fc4fe8ea",
      "slug": "gondolo",
      "label": "Gondolo",
      "created_at": "2025-05-30 14:54:16.481476+00",
      "popular": false
    },
    {
      "id": "253c8b7c-7b9e-4a08-b912-49c66686c3dc",
      "brand_id": "c926b996-58d0-430d-8b4c-17a6fc4fe8ea",
      "slug": "ellipse-dor",
      "label": "Ellipse d'Or",
      "created_at": "2025-05-30 14:54:16.529337+00",
      "popular": false
    },
    {
      "id": "cc776071-e4e8-4c37-9345-0bd55b706c61",
      "brand_id": "42461112-f532-43a8-a727-d2df804d1940",
      "slug": "rm-011",
      "label": "RM 011",
      "created_at": "2025-05-30 14:54:16.828526+00",
      "popular": false
    },
    {
      "id": "6f42a58c-0f6b-4bdb-9958-f60fdf8754e0",
      "brand_id": "42461112-f532-43a8-a727-d2df804d1940",
      "slug": "rm-035",
      "label": "RM 035",
      "created_at": "2025-05-30 14:54:16.877135+00",
      "popular": false
    },
    {
      "id": "a2019338-29fe-4f40-8264-71c06529074f",
      "brand_id": "42461112-f532-43a8-a727-d2df804d1940",
      "slug": "rm-055",
      "label": "RM 055",
      "created_at": "2025-05-30 14:54:16.931446+00",
      "popular": false
    },
    {
      "id": "b342140c-7388-4ee9-83b2-16a302f77df6",
      "brand_id": "42461112-f532-43a8-a727-d2df804d1940",
      "slug": "rm-27-03",
      "label": "RM 27-03",
      "created_at": "2025-05-30 14:54:16.998405+00",
      "popular": false
    },
    {
      "id": "e025a4a4-e1e5-4912-8cb4-1df2a39e2413",
      "brand_id": "42461112-f532-43a8-a727-d2df804d1940",
      "slug": "rm-67-01",
      "label": "RM 67-01",
      "created_at": "2025-05-30 14:54:17.047119+00",
      "popular": false
    },
    {
      "id": "bfaa956e-9b79-4c5d-a78b-30d15a912517",
      "brand_id": "42461112-f532-43a8-a727-d2df804d1940",
      "slug": "rm-72-01",
      "label": "RM 72-01",
      "created_at": "2025-05-30 14:54:17.100181+00",
      "popular": false
    },
    {
      "id": "d7636f5f-7828-4bf1-87f7-f39bf98b1dcd",
      "brand_id": "42461112-f532-43a8-a727-d2df804d1940",
      "slug": "rm-88",
      "label": "RM 88",
      "created_at": "2025-05-30 14:54:17.14814+00",
      "popular": false
    },
    {
      "id": "61f9e0de-c217-4019-91c0-102b2e801ee5",
      "brand_id": "42461112-f532-43a8-a727-d2df804d1940",
      "slug": "rm-65-01",
      "label": "RM 65-01",
      "created_at": "2025-05-30 14:54:17.192084+00",
      "popular": false
    },
    {
      "id": "92c3120e-df43-4994-bf55-b785d0f3013f",
      "brand_id": "e42d3b7c-d1aa-4f5c-8736-94e8f6a00f13",
      "slug": "carrera",
      "label": "Carrera",
      "created_at": "2025-05-30 14:54:17.237747+00",
      "popular": false
    },
    {
      "id": "ac93d66a-4ea7-4423-8b7e-f81e155b47c4",
      "brand_id": "e42d3b7c-d1aa-4f5c-8736-94e8f6a00f13",
      "slug": "monaco",
      "label": "Monaco",
      "created_at": "2025-05-30 14:54:17.28343+00",
      "popular": false
    },
    {
      "id": "06edb108-8e44-471c-8f9f-eeabfb104c77",
      "brand_id": "e42d3b7c-d1aa-4f5c-8736-94e8f6a00f13",
      "slug": "aquaracer",
      "label": "Aquaracer",
      "created_at": "2025-05-30 14:54:17.331061+00",
      "popular": false
    },
    {
      "id": "ce6e1a29-676c-4cc2-9f6f-2266d3cf5fc4",
      "brand_id": "e42d3b7c-d1aa-4f5c-8736-94e8f6a00f13",
      "slug": "formula-1",
      "label": "Formula 1",
      "created_at": "2025-05-30 14:54:17.378461+00",
      "popular": false
    },
    {
      "id": "c5d10bcc-d520-4ddf-8bdf-dc9e6e0e01a1",
      "brand_id": "e42d3b7c-d1aa-4f5c-8736-94e8f6a00f13",
      "slug": "autavia",
      "label": "Autavia",
      "created_at": "2025-05-30 14:54:17.429939+00",
      "popular": false
    },
    {
      "id": "df7347db-4c4f-46f5-96b3-f35ad95c4cb0",
      "brand_id": "e42d3b7c-d1aa-4f5c-8736-94e8f6a00f13",
      "slug": "link",
      "label": "Link",
      "created_at": "2025-05-30 14:54:17.476444+00",
      "popular": false
    },
    {
      "id": "1e68cb63-9b77-4160-97b5-72559d5ca05f",
      "brand_id": "e42d3b7c-d1aa-4f5c-8736-94e8f6a00f13",
      "slug": "monza",
      "label": "Monza",
      "created_at": "2025-05-30 14:54:17.52023+00",
      "popular": false
    },
    {
      "id": "5385ace5-d645-48e0-9cfc-ea1aab84a771",
      "brand_id": "e42d3b7c-d1aa-4f5c-8736-94e8f6a00f13",
      "slug": "connected",
      "label": "Connected",
      "created_at": "2025-05-30 14:54:17.569235+00",
      "popular": false
    },
    {
      "id": "99691db4-ac4a-4934-8ea8-633536aa571f",
      "brand_id": "29692e6c-7d55-4a03-9ac9-2e50e8f455e8",
      "slug": "gmt-master-ii",
      "label": "GMT-Master II",
      "created_at": "2025-05-30 14:54:15.359065+00",
      "popular": true
    },
    {
      "id": "7f425a46-2f52-4453-9b52-e029287db4f2",
      "brand_id": "c926b996-58d0-430d-8b4c-17a6fc4fe8ea",
      "slug": "complications",
      "label": "Complications",
      "created_at": "2025-05-30 14:54:16.383559+00",
      "popular": true
    },
    {
      "id": "0d7703eb-33b2-46b2-a9ce-59d35823fc21",
      "brand_id": "a8ef4cfd-155c-47ec-ab26-7b5806288961",
      "slug": "pasha",
      "label": "Pasha",
      "created_at": "2025-05-30 14:54:17.876542+00",
      "popular": false
    },
    {
      "id": "64d1f038-d556-42b6-9ef1-f35a857ce1d1",
      "brand_id": "a8ef4cfd-155c-47ec-ab26-7b5806288961",
      "slug": "drive-de-cartier",
      "label": "Drive de Cartier",
      "created_at": "2025-05-30 14:54:17.925496+00",
      "popular": false
    },
    {
      "id": "85314ee7-e0d4-4d8a-a841-119de83fe353",
      "brand_id": "a8ef4cfd-155c-47ec-ab26-7b5806288961",
      "slug": "cle-de-cartier",
      "label": "Clé de Cartier",
      "created_at": "2025-05-30 14:54:17.978371+00",
      "popular": false
    },
    {
      "id": "edb6bef0-591c-47ca-acfd-ead3d54a05e9",
      "brand_id": "a8ef4cfd-155c-47ec-ab26-7b5806288961",
      "slug": "ronde-solo",
      "label": "Ronde Solo",
      "created_at": "2025-05-30 14:54:18.022388+00",
      "popular": false
    },
    {
      "id": "6dc8ad84-269d-4cbb-a32e-6e901c11c1f4",
      "brand_id": "731ec105-c1a2-4a8b-9e16-c1885804ce55",
      "slug": "navitimer",
      "label": "Navitimer",
      "created_at": "2025-05-30 14:54:18.074264+00",
      "popular": false
    },
    {
      "id": "f580f6bb-13c7-4bb2-8499-107e334a5625",
      "brand_id": "731ec105-c1a2-4a8b-9e16-c1885804ce55",
      "slug": "chronomat",
      "label": "Chronomat",
      "created_at": "2025-05-30 14:54:18.147604+00",
      "popular": false
    },
    {
      "id": "e20b6913-3952-46d4-8dd4-9ecda22741db",
      "brand_id": "731ec105-c1a2-4a8b-9e16-c1885804ce55",
      "slug": "superocean",
      "label": "Superocean",
      "created_at": "2025-05-30 14:54:18.195861+00",
      "popular": false
    },
    {
      "id": "14a5e431-d59e-4388-9a72-82bca6a1abb1",
      "brand_id": "731ec105-c1a2-4a8b-9e16-c1885804ce55",
      "slug": "avenger",
      "label": "Avenger",
      "created_at": "2025-05-30 14:54:18.25094+00",
      "popular": false
    },
    {
      "id": "c8ca89d7-bcb2-4cf3-b464-9d56bf451823",
      "brand_id": "731ec105-c1a2-4a8b-9e16-c1885804ce55",
      "slug": "premier",
      "label": "Premier",
      "created_at": "2025-05-30 14:54:18.302493+00",
      "popular": false
    },
    {
      "id": "96b36d4e-bc89-4ab3-94e8-f5206253bffc",
      "brand_id": "731ec105-c1a2-4a8b-9e16-c1885804ce55",
      "slug": "endurance-pro",
      "label": "Endurance Pro",
      "created_at": "2025-05-30 14:54:18.35209+00",
      "popular": false
    },
    {
      "id": "47f8aafe-ff3a-40d7-bf3f-5abb8cdfe623",
      "brand_id": "731ec105-c1a2-4a8b-9e16-c1885804ce55",
      "slug": "top-time",
      "label": "Top Time",
      "created_at": "2025-05-30 14:54:18.405698+00",
      "popular": false
    },
    {
      "id": "a9a23a8f-e3f2-456f-bb6e-9e630eb8ec6d",
      "brand_id": "731ec105-c1a2-4a8b-9e16-c1885804ce55",
      "slug": "colt",
      "label": "Colt",
      "created_at": "2025-05-30 14:54:18.462294+00",
      "popular": false
    },
    {
      "id": "bc2c9e3f-d9e8-4f68-90e2-4e29b9429270",
      "brand_id": "5ca76279-4b2d-4ad6-9b9c-58d16e3c0a94",
      "slug": "black-bay",
      "label": "Black Bay",
      "created_at": "2025-05-30 14:54:18.514463+00",
      "popular": false
    },
    {
      "id": "0226bcd6-dc94-4b83-b7cd-275d847e2776",
      "brand_id": "5ca76279-4b2d-4ad6-9b9c-58d16e3c0a94",
      "slug": "pelagos",
      "label": "Pelagos",
      "created_at": "2025-05-30 14:54:18.563543+00",
      "popular": false
    },
    {
      "id": "eabb4324-3944-4961-98b9-e7f96ba617da",
      "brand_id": "5ca76279-4b2d-4ad6-9b9c-58d16e3c0a94",
      "slug": "heritage-chrono",
      "label": "Heritage Chrono",
      "created_at": "2025-05-30 14:54:18.615399+00",
      "popular": false
    },
    {
      "id": "0d76791a-0ef1-4b81-9d84-e9c142cc5c01",
      "brand_id": "5ca76279-4b2d-4ad6-9b9c-58d16e3c0a94",
      "slug": "glamour",
      "label": "Glamour",
      "created_at": "2025-05-30 14:54:18.660664+00",
      "popular": false
    },
    {
      "id": "99a92515-3b22-47f4-b9cf-8d637802cc25",
      "brand_id": "5ca76279-4b2d-4ad6-9b9c-58d16e3c0a94",
      "slug": "style",
      "label": "Style",
      "created_at": "2025-05-30 14:54:18.713165+00",
      "popular": false
    },
    {
      "id": "865d20f5-4192-4f6c-a46c-261f7ad5b184",
      "brand_id": "5ca76279-4b2d-4ad6-9b9c-58d16e3c0a94",
      "slug": "1926",
      "label": "1926",
      "created_at": "2025-05-30 14:54:18.769658+00",
      "popular": false
    },
    {
      "id": "ed533cf3-9b00-4f79-9070-ec1de1b2d78d",
      "brand_id": "5ca76279-4b2d-4ad6-9b9c-58d16e3c0a94",
      "slug": "royal",
      "label": "Royal",
      "created_at": "2025-05-30 14:54:18.822016+00",
      "popular": false
    },
    {
      "id": "418be870-8c86-4e93-a57c-9e8250aba013",
      "brand_id": "bb6d9e72-c952-4489-b218-a9f57fdcf8db",
      "slug": "big-bang",
      "label": "Big Bang",
      "created_at": "2025-05-30 14:54:18.869381+00",
      "popular": false
    },
    {
      "id": "c2627ad4-1b45-4fb9-b0d1-750575170227",
      "brand_id": "bb6d9e72-c952-4489-b218-a9f57fdcf8db",
      "slug": "classic-fusion",
      "label": "Classic Fusion",
      "created_at": "2025-05-30 14:54:18.915808+00",
      "popular": false
    },
    {
      "id": "b010056f-b2eb-43a7-bfa2-2b705eff9476",
      "brand_id": "bb6d9e72-c952-4489-b218-a9f57fdcf8db",
      "slug": "spirit-of-big-bang",
      "label": "Spirit of Big Bang",
      "created_at": "2025-05-30 14:54:18.967672+00",
      "popular": false
    },
    {
      "id": "3f78d60c-ea0c-4cf9-aa58-e8066f5f576b",
      "brand_id": "bb6d9e72-c952-4489-b218-a9f57fdcf8db",
      "slug": "mp-collection",
      "label": "MP Collection",
      "created_at": "2025-05-30 14:54:19.01633+00",
      "popular": false
    },
    {
      "id": "7292cf40-4a1d-491d-b91d-038e8869e512",
      "brand_id": "bb6d9e72-c952-4489-b218-a9f57fdcf8db",
      "slug": "sang-bleu",
      "label": "Sang Bleu",
      "created_at": "2025-05-30 14:54:19.06529+00",
      "popular": false
    },
    {
      "id": "43240ad0-f109-4573-b7f4-b1cab09fb76b",
      "brand_id": "4b528ab8-0b61-4a1a-bf17-3a936b57f424",
      "slug": "portugieser",
      "label": "Portugieser",
      "created_at": "2025-05-30 14:54:19.110704+00",
      "popular": false
    },
    {
      "id": "d04fea0f-4c2c-4bc9-b5e7-f0261024c064",
      "brand_id": "4b528ab8-0b61-4a1a-bf17-3a936b57f424",
      "slug": "pilots-watch",
      "label": "Pilot’s Watch",
      "created_at": "2025-05-30 14:54:19.162641+00",
      "popular": false
    },
    {
      "id": "fb68ba5d-f6fd-4ef0-aa5c-b6cabf7157b3",
      "brand_id": "4b528ab8-0b61-4a1a-bf17-3a936b57f424",
      "slug": "portofino",
      "label": "Portofino",
      "created_at": "2025-05-30 14:54:19.229297+00",
      "popular": false
    },
    {
      "id": "ba990836-08e4-44e1-a33d-65ebd590559c",
      "brand_id": "4b528ab8-0b61-4a1a-bf17-3a936b57f424",
      "slug": "ingenieur",
      "label": "Ingenieur",
      "created_at": "2025-05-30 14:54:19.27749+00",
      "popular": false
    },
    {
      "id": "764f7b4d-c145-4572-92bc-867978530862",
      "brand_id": "4b528ab8-0b61-4a1a-bf17-3a936b57f424",
      "slug": "aquatimer",
      "label": "Aquatimer",
      "created_at": "2025-05-30 14:54:19.345547+00",
      "popular": false
    },
    {
      "id": "9310f0c0-96ba-4122-9338-495c7a0f93ef",
      "brand_id": "4b528ab8-0b61-4a1a-bf17-3a936b57f424",
      "slug": "da-vinci",
      "label": "Da Vinci",
      "created_at": "2025-05-30 14:54:19.394266+00",
      "popular": false
    },
    {
      "id": "969ec8f3-8d54-4f21-af10-5403ba4028c9",
      "brand_id": "267fb859-934a-47ad-b030-d6cdc3666c50",
      "slug": "reverso",
      "label": "Reverso",
      "created_at": "2025-05-30 14:54:19.438348+00",
      "popular": false
    },
    {
      "id": "69b2d05d-35a2-4f24-83c6-8e915661c805",
      "brand_id": "267fb859-934a-47ad-b030-d6cdc3666c50",
      "slug": "master-control",
      "label": "Master Control",
      "created_at": "2025-05-30 14:54:19.486563+00",
      "popular": false
    },
    {
      "id": "449bd4db-2f43-4518-a6e4-ae4522cea331",
      "brand_id": "267fb859-934a-47ad-b030-d6cdc3666c50",
      "slug": "polaris",
      "label": "Polaris",
      "created_at": "2025-05-30 14:54:19.533154+00",
      "popular": false
    },
    {
      "id": "cdc60817-35d0-48b4-b131-11182148ea8d",
      "brand_id": "267fb859-934a-47ad-b030-d6cdc3666c50",
      "slug": "rendez-vous",
      "label": "Rendez-Vous",
      "created_at": "2025-05-30 14:54:19.58509+00",
      "popular": false
    },
    {
      "id": "2e3e49dd-974b-4cb4-ac01-4c4b3eac5ffe",
      "brand_id": "d421865e-5344-4b92-a8dd-ee525da88f1e",
      "slug": "jules-audemars",
      "label": "Jules Audemars",
      "created_at": "2025-05-30 14:54:16.780899+00",
      "popular": true
    },
    {
      "id": "a6d09346-0965-458a-8161-a2db67811c91",
      "brand_id": "267fb859-934a-47ad-b030-d6cdc3666c50",
      "slug": "atmos",
      "label": "Atmos",
      "created_at": "2025-05-30 14:54:19.653658+00",
      "popular": false
    },
    {
      "id": "6e453314-6bb6-4e08-adce-b5440394b056",
      "brand_id": "526c2d41-52d1-4525-8aec-5498bb15e249",
      "slug": "luminor",
      "label": "Luminor",
      "created_at": "2025-05-30 14:54:19.713872+00",
      "popular": false
    },
    {
      "id": "8d45593a-3efe-4ab6-90dc-202439108002",
      "brand_id": "526c2d41-52d1-4525-8aec-5498bb15e249",
      "slug": "radiomir",
      "label": "Radiomir",
      "created_at": "2025-05-30 14:54:19.763771+00",
      "popular": false
    },
    {
      "id": "52e6bfe7-20ad-434c-ab9d-321e735a6466",
      "brand_id": "526c2d41-52d1-4525-8aec-5498bb15e249",
      "slug": "submersible",
      "label": "Submersible",
      "created_at": "2025-05-30 14:54:19.812653+00",
      "popular": false
    },
    {
      "id": "c3018e15-50c4-417f-b2e3-67cb78c1d970",
      "brand_id": "526c2d41-52d1-4525-8aec-5498bb15e249",
      "slug": "luminor-due",
      "label": "Luminor Due",
      "created_at": "2025-05-30 14:54:19.865353+00",
      "popular": false
    },
    {
      "id": "c4a83431-4437-4f39-af57-382404ac8ff5",
      "brand_id": "d32d40c0-7ea1-4b72-a282-6b86f07e61f2",
      "slug": "hydroconquest",
      "label": "HydroConquest",
      "created_at": "2025-05-30 14:54:19.908933+00",
      "popular": false
    },
    {
      "id": "8a0d668f-0727-497b-b7d4-4ea877d80798",
      "brand_id": "d32d40c0-7ea1-4b72-a282-6b86f07e61f2",
      "slug": "master-collection",
      "label": "Master Collection",
      "created_at": "2025-05-30 14:54:19.958831+00",
      "popular": false
    },
    {
      "id": "4d743c06-8a14-4e6e-915a-522f6430d688",
      "brand_id": "d32d40c0-7ea1-4b72-a282-6b86f07e61f2",
      "slug": "conquest",
      "label": "Conquest",
      "created_at": "2025-05-30 14:54:20.010756+00",
      "popular": false
    },
    {
      "id": "073aef5e-cbd0-4629-b3a1-54a92d9be4a5",
      "brand_id": "d32d40c0-7ea1-4b72-a282-6b86f07e61f2",
      "slug": "heritage",
      "label": "Heritage",
      "created_at": "2025-05-30 14:54:20.080668+00",
      "popular": false
    },
    {
      "id": "3164e261-444f-4f8f-b136-82ca8e340794",
      "brand_id": "d32d40c0-7ea1-4b72-a282-6b86f07e61f2",
      "slug": "dolcevita",
      "label": "DolceVita",
      "created_at": "2025-05-30 14:54:20.128134+00",
      "popular": false
    },
    {
      "id": "9e426942-3738-4f13-a575-42c7b8216036",
      "brand_id": "d32d40c0-7ea1-4b72-a282-6b86f07e61f2",
      "slug": "spirit",
      "label": "Spirit",
      "created_at": "2025-05-30 14:54:20.184654+00",
      "popular": false
    },
    {
      "id": "0a543d1f-2bed-41ca-9d11-840f6da1b833",
      "brand_id": "d32d40c0-7ea1-4b72-a282-6b86f07e61f2",
      "slug": "flagship",
      "label": "Flagship",
      "created_at": "2025-05-30 14:54:20.241786+00",
      "popular": false
    },
    {
      "id": "a965b62e-fce8-47cd-a725-b31ba976d76f",
      "brand_id": "9ffe59c2-e6a8-4833-b544-e985066459c4",
      "slug": "chronomaster",
      "label": "Chronomaster",
      "created_at": "2025-05-30 14:54:20.349218+00",
      "popular": false
    },
    {
      "id": "39854e0f-f55b-4863-b5f3-27147294d513",
      "brand_id": "9ffe59c2-e6a8-4833-b544-e985066459c4",
      "slug": "defy",
      "label": "Defy",
      "created_at": "2025-05-30 14:54:20.400638+00",
      "popular": false
    },
    {
      "id": "51d8d8db-0578-466c-adac-160bb9fec144",
      "brand_id": "9ffe59c2-e6a8-4833-b544-e985066459c4",
      "slug": "elite",
      "label": "Elite",
      "created_at": "2025-05-30 14:54:20.449836+00",
      "popular": false
    },
    {
      "id": "c8c432fa-f501-4a66-9491-cff37b669685",
      "brand_id": "9ffe59c2-e6a8-4833-b544-e985066459c4",
      "slug": "pilot",
      "label": "Pilot",
      "created_at": "2025-05-30 14:54:20.497202+00",
      "popular": false
    },
    {
      "id": "a7cad647-d02c-47d0-a418-852dde2791e0",
      "brand_id": "313b1ebc-ab4f-41d8-8bb1-4d35b6ec8fc7",
      "slug": "overseas",
      "label": "Overseas",
      "created_at": "2025-05-30 14:54:20.544429+00",
      "popular": false
    },
    {
      "id": "0064bd6a-cf51-4386-a9e6-5bf08a654652",
      "brand_id": "313b1ebc-ab4f-41d8-8bb1-4d35b6ec8fc7",
      "slug": "patrimony",
      "label": "Patrimony",
      "created_at": "2025-05-30 14:54:20.606125+00",
      "popular": false
    },
    {
      "id": "33304023-0cb1-424d-9a5a-e605d981f0b3",
      "brand_id": "313b1ebc-ab4f-41d8-8bb1-4d35b6ec8fc7",
      "slug": "historiques",
      "label": "Historiques",
      "created_at": "2025-05-30 14:54:20.653255+00",
      "popular": false
    },
    {
      "id": "ce0f5ba0-c9dc-4288-9132-8c33dda2a27b",
      "brand_id": "313b1ebc-ab4f-41d8-8bb1-4d35b6ec8fc7",
      "slug": "traditionnelle",
      "label": "Traditionnelle",
      "created_at": "2025-05-30 14:54:20.700071+00",
      "popular": false
    },
    {
      "id": "a2ca2242-aa40-4f58-8f7b-25a2490542d1",
      "brand_id": "313b1ebc-ab4f-41d8-8bb1-4d35b6ec8fc7",
      "slug": "egerie",
      "label": "Égérie",
      "created_at": "2025-05-30 14:54:20.753183+00",
      "popular": false
    },
    {
      "id": "c476d736-1c01-4b0b-908a-1331fee3a7fb",
      "brand_id": "a8ef4cfd-155c-47ec-ab26-7b5806288961",
      "slug": "21-chronoscaph",
      "label": "21 Chronoscaph",
      "created_at": "2025-06-07 18:04:00.960549+00",
      "popular": false
    },
    {
      "id": "2cf677bb-f601-4b17-be34-5f859f67aaed",
      "brand_id": "a8ef4cfd-155c-47ec-ab26-7b5806288961",
      "slug": "21-must-de-cartier",
      "label": "21 Must de Cartier",
      "created_at": "2025-06-07 18:04:00.960549+00",
      "popular": false
    },
    {
      "id": "66761449-e422-4b2d-8f37-75fe4748e959",
      "brand_id": "a8ef4cfd-155c-47ec-ab26-7b5806288961",
      "slug": "baignoire",
      "label": "Baignoire",
      "created_at": "2025-06-07 18:04:00.960549+00",
      "popular": false
    },
    {
      "id": "ae8e8574-063f-41ef-9b40-051ed0570bb9",
      "brand_id": "a8ef4cfd-155c-47ec-ab26-7b5806288961",
      "slug": "ballon-blanc",
      "label": "Ballon Blanc",
      "created_at": "2025-06-07 18:04:00.960549+00",
      "popular": false
    },
    {
      "id": "ca8c5e08-820f-40ec-8c78-2af184b644b6",
      "brand_id": "a8ef4cfd-155c-47ec-ab26-7b5806288961",
      "slug": "ballon-bleu-28-mm",
      "label": "Ballon Bleu 28 mm",
      "created_at": "2025-06-07 18:04:00.960549+00",
      "popular": false
    },
    {
      "id": "4d7f897c-4c8c-44f4-80a8-425317308102",
      "brand_id": "a8ef4cfd-155c-47ec-ab26-7b5806288961",
      "slug": "ballon-bleu-33-mm",
      "label": "Ballon Bleu 33 mm",
      "created_at": "2025-06-07 18:04:00.960549+00",
      "popular": false
    },
    {
      "id": "dc0a99b8-610d-4f00-ae96-666c00968956",
      "brand_id": "a8ef4cfd-155c-47ec-ab26-7b5806288961",
      "slug": "ballon-bleu-36-mm",
      "label": "Ballon Bleu 36 mm",
      "created_at": "2025-06-07 18:04:00.960549+00",
      "popular": false
    },
    {
      "id": "b8c4baff-4ee0-4abf-9454-0ddbd8342920",
      "brand_id": "a8ef4cfd-155c-47ec-ab26-7b5806288961",
      "slug": "ballon-bleu-40-mm",
      "label": "Ballon Bleu 40 mm",
      "created_at": "2025-06-07 18:04:00.960549+00",
      "popular": false
    },
    {
      "id": "3e47d0a1-2a77-4990-a5e4-7d6061160933",
      "brand_id": "a8ef4cfd-155c-47ec-ab26-7b5806288961",
      "slug": "ballon-bleu-42-mm",
      "label": "Ballon Bleu 42 mm",
      "created_at": "2025-06-07 18:04:00.960549+00",
      "popular": false
    },
    {
      "id": "2e8a6939-eb84-4cd2-b88f-452517cd9815",
      "brand_id": "a8ef4cfd-155c-47ec-ab26-7b5806288961",
      "slug": "ballon-bleu-44-mm",
      "label": "Ballon Bleu 44 mm",
      "created_at": "2025-06-07 18:04:00.960549+00",
      "popular": false
    },
    {
      "id": "8636d26e-167c-4142-86f6-c182eff74ac6",
      "brand_id": "a8ef4cfd-155c-47ec-ab26-7b5806288961",
      "slug": "calibre-de-cartier",
      "label": "Calibre de Cartier",
      "created_at": "2025-06-07 18:04:00.960549+00",
      "popular": false
    },
    {
      "id": "b6644e51-e55e-47a7-86e1-cdbc9f0aa216",
      "brand_id": "a8ef4cfd-155c-47ec-ab26-7b5806288961",
      "slug": "calibre-de-cartier-chronograph",
      "label": "Calibre de Cartier Chronograph",
      "created_at": "2025-06-07 18:04:00.960549+00",
      "popular": false
    },
    {
      "id": "a31c7665-ab4e-4333-a2ec-62fb804c3866",
      "brand_id": "a8ef4cfd-155c-47ec-ab26-7b5806288961",
      "slug": "calibre-de-cartier-diver",
      "label": "Calibre de Cartier Diver",
      "created_at": "2025-06-07 18:04:00.960549+00",
      "popular": false
    },
    {
      "id": "cda717cd-02b6-42a8-9a35-2a1b363f1e3c",
      "brand_id": "a8ef4cfd-155c-47ec-ab26-7b5806288961",
      "slug": "colisee",
      "label": "Colisée",
      "created_at": "2025-06-07 18:04:00.960549+00",
      "popular": false
    },
    {
      "id": "ccd07ed3-aa22-4429-b54a-65b81801aee2",
      "brand_id": "a8ef4cfd-155c-47ec-ab26-7b5806288961",
      "slug": "cougar",
      "label": "Cougar",
      "created_at": "2025-06-07 18:04:00.960549+00",
      "popular": false
    },
    {
      "id": "de1150a7-6758-4f75-b7c4-f872a77948b3",
      "brand_id": "a8ef4cfd-155c-47ec-ab26-7b5806288961",
      "slug": "diabolo",
      "label": "Diabolo",
      "created_at": "2025-06-07 18:04:00.960549+00",
      "popular": false
    },
    {
      "id": "2258f7da-ab48-46f6-b988-3db6dcca687c",
      "brand_id": "a8ef4cfd-155c-47ec-ab26-7b5806288961",
      "slug": "la-dona-de-cartier",
      "label": "La Dona de Cartier",
      "created_at": "2025-06-07 18:04:00.960549+00",
      "popular": false
    },
    {
      "id": "52577ff1-5511-456a-beac-799490eeaeeb",
      "brand_id": "a8ef4cfd-155c-47ec-ab26-7b5806288961",
      "slug": "pasha-c",
      "label": "Pasha C",
      "created_at": "2025-06-07 18:04:00.960549+00",
      "popular": false
    },
    {
      "id": "49caac9b-1145-4760-8bcc-02e42d53787c",
      "brand_id": "a8ef4cfd-155c-47ec-ab26-7b5806288961",
      "slug": "pasha-seatimer",
      "label": "Pasha Seatimer",
      "created_at": "2025-06-07 18:04:00.960549+00",
      "popular": false
    },
    {
      "id": "c6f6c783-99d7-4498-aede-0d0c106970aa",
      "brand_id": "a8ef4cfd-155c-47ec-ab26-7b5806288961",
      "slug": "roadster",
      "label": "Roadster",
      "created_at": "2025-06-07 18:04:00.960549+00",
      "popular": false
    },
    {
      "id": "af3a3ea7-ec0e-488c-9877-f7a4f2b04a51",
      "brand_id": "a8ef4cfd-155c-47ec-ab26-7b5806288961",
      "slug": "ronde-de-cartier",
      "label": "Ronde de Cartier",
      "created_at": "2025-06-07 18:04:00.960549+00",
      "popular": false
    },
    {
      "id": "b1b24785-b2cb-4dfa-bc5c-d0f318055f59",
      "brand_id": "a8ef4cfd-155c-47ec-ab26-7b5806288961",
      "slug": "ronde-louis-cartier",
      "label": "Ronde Louis Cartier",
      "created_at": "2025-06-07 18:04:00.960549+00",
      "popular": false
    },
    {
      "id": "349b7c79-5f80-42d9-9469-dc33e44122a1",
      "brand_id": "a8ef4cfd-155c-47ec-ab26-7b5806288961",
      "slug": "ronde-solo-de-cartier",
      "label": "Ronde Solo de Cartier",
      "created_at": "2025-06-07 18:04:00.960549+00",
      "popular": false
    },
    {
      "id": "3ae9fdfe-6de8-49e6-8abf-a93eb5f30793",
      "brand_id": "a8ef4cfd-155c-47ec-ab26-7b5806288961",
      "slug": "rotonde-de-cartier",
      "label": "Rotonde de Cartier",
      "created_at": "2025-06-07 18:04:00.960549+00",
      "popular": false
    },
    {
      "id": "6da247fd-3fac-4e06-993d-941d99daaa30",
      "brand_id": "a8ef4cfd-155c-47ec-ab26-7b5806288961",
      "slug": "santos-100",
      "label": "Santos 100",
      "created_at": "2025-06-07 18:04:00.960549+00",
      "popular": false
    },
    {
      "id": "b485fb0a-3fb8-4659-a043-2fe7b4915066",
      "brand_id": "a8ef4cfd-155c-47ec-ab26-7b5806288961",
      "slug": "santos-demoiselle",
      "label": "Santos Demoiselle",
      "created_at": "2025-06-07 18:04:01.196565+00",
      "popular": false
    },
    {
      "id": "f6a3f152-bcb1-45ad-b993-585562ec323e",
      "brand_id": "a8ef4cfd-155c-47ec-ab26-7b5806288961",
      "slug": "santos-dumont",
      "label": "Santos Dumont",
      "created_at": "2025-06-07 18:04:01.196565+00",
      "popular": false
    },
    {
      "id": "d26a40e4-2fab-42b0-89bc-f4a51012c299",
      "brand_id": "a8ef4cfd-155c-47ec-ab26-7b5806288961",
      "slug": "santos-galbee",
      "label": "Santos Galbée",
      "created_at": "2025-06-07 18:04:01.196565+00",
      "popular": false
    },
    {
      "id": "ada2c16b-c7c1-47fa-be6f-711b68311840",
      "brand_id": "a8ef4cfd-155c-47ec-ab26-7b5806288961",
      "slug": "tank-americaine",
      "label": "Tank Américaine",
      "created_at": "2025-06-07 18:04:01.196565+00",
      "popular": false
    },
    {
      "id": "5552f37d-7abe-40b1-bd52-8cbf2fda975f",
      "brand_id": "a8ef4cfd-155c-47ec-ab26-7b5806288961",
      "slug": "tank-anglaise",
      "label": "Tank Anglaise",
      "created_at": "2025-06-07 18:04:01.196565+00",
      "popular": false
    },
    {
      "id": "30d800d6-4eba-47e8-a527-9ab4eb4e320a",
      "brand_id": "a8ef4cfd-155c-47ec-ab26-7b5806288961",
      "slug": "tank-divan",
      "label": "Tank Divan",
      "created_at": "2025-06-07 18:04:01.196565+00",
      "popular": false
    },
    {
      "id": "8e508137-3562-43ec-b16b-76f6f7835207",
      "brand_id": "a8ef4cfd-155c-47ec-ab26-7b5806288961",
      "slug": "tank-francaise",
      "label": "Tank Française",
      "created_at": "2025-06-07 18:04:01.196565+00",
      "popular": false
    },
    {
      "id": "c1ceffb7-86b8-4e05-bdd0-bee81fa7144c",
      "brand_id": "a8ef4cfd-155c-47ec-ab26-7b5806288961",
      "slug": "tank-louis-cartier",
      "label": "Tank Louis Cartier",
      "created_at": "2025-06-07 18:04:01.196565+00",
      "popular": false
    },
    {
      "id": "81c21a57-25f7-447f-9de6-cbc31b45a958",
      "brand_id": "a8ef4cfd-155c-47ec-ab26-7b5806288961",
      "slug": "tank-mc",
      "label": "Tank MC",
      "created_at": "2025-06-07 18:04:01.196565+00",
      "popular": false
    },
    {
      "id": "19b48415-e74c-4b17-a179-b15e91382bab",
      "brand_id": "a8ef4cfd-155c-47ec-ab26-7b5806288961",
      "slug": "tank-solo",
      "label": "Tank Solo",
      "created_at": "2025-06-07 18:04:01.196565+00",
      "popular": false
    },
    {
      "id": "38d5e304-90d2-443c-8b5f-540a685fb13b",
      "brand_id": "a8ef4cfd-155c-47ec-ab26-7b5806288961",
      "slug": "tank-vermeil",
      "label": "Tank Vermeil",
      "created_at": "2025-06-07 18:04:01.196565+00",
      "popular": false
    },
    {
      "id": "801a1310-7e52-45b5-befb-4e73f7961705",
      "brand_id": "a8ef4cfd-155c-47ec-ab26-7b5806288961",
      "slug": "tonneau",
      "label": "Tonneau",
      "created_at": "2025-06-07 18:04:01.196565+00",
      "popular": false
    },
    {
      "id": "ad2fa691-c243-4c7a-84c4-5de27ace106d",
      "brand_id": "a8ef4cfd-155c-47ec-ab26-7b5806288961",
      "slug": "tortue",
      "label": "Tortue",
      "created_at": "2025-06-07 18:04:01.196565+00",
      "popular": false
    },
    {
      "id": "9afd5cc9-b422-478c-b04b-bf1b697e169e",
      "brand_id": "a8ef4cfd-155c-47ec-ab26-7b5806288961",
      "slug": "trinity",
      "label": "Trinity",
      "created_at": "2025-06-07 18:04:01.196565+00",
      "popular": false
    },
    {
      "id": "e45b7eed-9e8d-486e-8eeb-c93e42e55ba3",
      "brand_id": "a8ef4cfd-155c-47ec-ab26-7b5806288961",
      "slug": "vendome",
      "label": "Vendôme",
      "created_at": "2025-06-07 18:04:01.196565+00",
      "popular": false
    },
    {
      "id": "74f878dc-b6f7-43a1-abf7-3c60f87efc9c",
      "brand_id": "96f7bbb1-2a1c-4d4e-a163-70d9076734e9",
      "slug": "bumper",
      "label": "Bumper",
      "created_at": "2025-06-07 18:04:01.196565+00",
      "popular": false
    },
    {
      "id": "0c05b62d-f20b-4ea6-ab7e-4efac2aaec09",
      "brand_id": "96f7bbb1-2a1c-4d4e-a163-70d9076734e9",
      "slug": "classic",
      "label": "Classic",
      "created_at": "2025-06-07 18:04:01.196565+00",
      "popular": false
    },
    {
      "id": "0952f55d-5440-417d-9b02-528ae2449df2",
      "brand_id": "96f7bbb1-2a1c-4d4e-a163-70d9076734e9",
      "slug": "constellation-day-date",
      "label": "Constellation Day-Date",
      "created_at": "2025-06-07 18:04:01.196565+00",
      "popular": false
    },
    {
      "id": "f23bc7e1-a28b-46db-b23b-08bdc6ad0358",
      "brand_id": "96f7bbb1-2a1c-4d4e-a163-70d9076734e9",
      "slug": "constellation-double-eagle",
      "label": "Constellation Double Eagle",
      "created_at": "2025-06-07 18:04:01.196565+00",
      "popular": false
    },
    {
      "id": "f628c496-911f-46a6-89d5-04ce355c7271",
      "brand_id": "96f7bbb1-2a1c-4d4e-a163-70d9076734e9",
      "slug": "constellation-ladies",
      "label": "Constellation Ladies",
      "created_at": "2025-06-07 18:04:01.196565+00",
      "popular": false
    },
    {
      "id": "3be94452-bd20-41b3-bf06-eecae157640b",
      "brand_id": "96f7bbb1-2a1c-4d4e-a163-70d9076734e9",
      "slug": "constellation-men",
      "label": "Constellation Men",
      "created_at": "2025-06-07 18:04:01.196565+00",
      "popular": false
    },
    {
      "id": "f21b7e22-d86e-43fa-a3a0-af09b66d9fc5",
      "brand_id": "96f7bbb1-2a1c-4d4e-a163-70d9076734e9",
      "slug": "constellation-petite-seconde",
      "label": "Constellation Petite Seconde",
      "created_at": "2025-06-07 18:04:01.196565+00",
      "popular": false
    },
    {
      "id": "3d5bb8c6-76ce-4cc9-928b-5a15cc1d2acf",
      "brand_id": "96f7bbb1-2a1c-4d4e-a163-70d9076734e9",
      "slug": "constellation-quadra",
      "label": "Constellation Quadra",
      "created_at": "2025-06-07 18:04:01.196565+00",
      "popular": false
    },
    {
      "id": "9a03d7e4-a76f-4718-8dae-a9f0f8ea4d50",
      "brand_id": "96f7bbb1-2a1c-4d4e-a163-70d9076734e9",
      "slug": "constellation-quartz",
      "label": "Constellation Quartz",
      "created_at": "2025-06-07 18:04:01.196565+00",
      "popular": false
    },
    {
      "id": "5476bc83-bc23-4939-bb14-bce858694c7c",
      "brand_id": "96f7bbb1-2a1c-4d4e-a163-70d9076734e9",
      "slug": "de-ville-co-axial",
      "label": "De Ville Co-Axial",
      "created_at": "2025-06-07 18:04:01.196565+00",
      "popular": false
    },
    {
      "id": "db3de75e-7fa7-47d5-99d2-1b620f3919c5",
      "brand_id": "96f7bbb1-2a1c-4d4e-a163-70d9076734e9",
      "slug": "de-ville-hour-vision",
      "label": "De Ville Hour Vision",
      "created_at": "2025-06-07 18:04:01.196565+00",
      "popular": false
    },
    {
      "id": "957016ea-1a0c-4378-a659-9950d98c32ee",
      "brand_id": "96f7bbb1-2a1c-4d4e-a163-70d9076734e9",
      "slug": "de-ville-ladymatic",
      "label": "De Ville Ladymatic",
      "created_at": "2025-06-07 18:04:01.196565+00",
      "popular": false
    },
    {
      "id": "7faffe05-3f0e-4fda-867f-bdca1beddcfe",
      "brand_id": "96f7bbb1-2a1c-4d4e-a163-70d9076734e9",
      "slug": "de-ville-prestige",
      "label": "De Ville Prestige",
      "created_at": "2025-06-07 18:04:01.196565+00",
      "popular": false
    },
    {
      "id": "198d8b48-7436-4d8c-a689-4ccfa91f0006",
      "brand_id": "96f7bbb1-2a1c-4d4e-a163-70d9076734e9",
      "slug": "de-ville-tresor",
      "label": "De Ville Trésor",
      "created_at": "2025-06-07 18:04:01.196565+00",
      "popular": false
    },
    {
      "id": "57eed11b-8ea4-4f41-a378-d7e7ea45464e",
      "brand_id": "96f7bbb1-2a1c-4d4e-a163-70d9076734e9",
      "slug": "flightmaster",
      "label": "Flightmaster",
      "created_at": "2025-06-07 18:04:01.196565+00",
      "popular": false
    },
    {
      "id": "27e99b15-e212-46e6-ab2d-9cbd128ee6e4",
      "brand_id": "96f7bbb1-2a1c-4d4e-a163-70d9076734e9",
      "slug": "geneve",
      "label": "Genève",
      "created_at": "2025-06-07 18:04:01.196565+00",
      "popular": false
    },
    {
      "id": "a7f24c5a-e6e1-4dda-afdd-bb4b37e27943",
      "brand_id": "96f7bbb1-2a1c-4d4e-a163-70d9076734e9",
      "slug": "globemaster",
      "label": "Globemaster",
      "created_at": "2025-06-07 18:04:01.196565+00",
      "popular": false
    },
    {
      "id": "0f271dc7-1f99-4865-89b4-b6857e699c2c",
      "brand_id": "96f7bbb1-2a1c-4d4e-a163-70d9076734e9",
      "slug": "museum",
      "label": "Museum",
      "created_at": "2025-06-07 18:04:01.196565+00",
      "popular": false
    },
    {
      "id": "3230265d-5a99-4d18-9e16-063be642043b",
      "brand_id": "96f7bbb1-2a1c-4d4e-a163-70d9076734e9",
      "slug": "pocket-watch",
      "label": "Pocket Watch",
      "created_at": "2025-06-07 18:04:01.196565+00",
      "popular": false
    },
    {
      "id": "4db642d4-7b5a-4355-b3e3-378340208215",
      "brand_id": "96f7bbb1-2a1c-4d4e-a163-70d9076734e9",
      "slug": "seamaster-120-m",
      "label": "Seamaster 120 M",
      "created_at": "2025-06-07 18:04:01.196565+00",
      "popular": false
    },
    {
      "id": "afded921-ecf1-4215-adc9-f0c9d5f63368",
      "brand_id": "96f7bbb1-2a1c-4d4e-a163-70d9076734e9",
      "slug": "seamaster-aqua-terra-worldtimer",
      "label": "Seamaster Aqua Terra Worldtimer",
      "created_at": "2025-06-07 18:04:01.196565+00",
      "popular": false
    },
    {
      "id": "346564fd-85ef-499f-9952-a74ce814672e",
      "brand_id": "96f7bbb1-2a1c-4d4e-a163-70d9076734e9",
      "slug": "seamaster-chronograph",
      "label": "Seamaster Chronograph",
      "created_at": "2025-06-07 18:04:01.196565+00",
      "popular": false
    },
    {
      "id": "5c62ce24-8559-4d45-8b7a-cd5dda453633",
      "brand_id": "96f7bbb1-2a1c-4d4e-a163-70d9076734e9",
      "slug": "seamaster-cosmic",
      "label": "Seamaster Cosmic",
      "created_at": "2025-06-07 18:04:01.196565+00",
      "popular": false
    },
    {
      "id": "bdf024d4-0da3-42d3-a3ae-c00b291ecaee",
      "brand_id": "96f7bbb1-2a1c-4d4e-a163-70d9076734e9",
      "slug": "seamaster-deville",
      "label": "Seamaster DeVille",
      "created_at": "2025-06-07 18:04:01.196565+00",
      "popular": false
    },
    {
      "id": "47e91045-3dec-412a-86a2-ad1dbf360821",
      "brand_id": "96f7bbb1-2a1c-4d4e-a163-70d9076734e9",
      "slug": "seamaster-diver-300-m",
      "label": "Seamaster Diver 300 M",
      "created_at": "2025-06-07 18:04:01.196565+00",
      "popular": false
    },
    {
      "id": "35ae168e-fcbb-40b5-be6b-979afba04503",
      "brand_id": "96f7bbb1-2a1c-4d4e-a163-70d9076734e9",
      "slug": "seamaster-planet-ocean-chronograph",
      "label": "Seamaster Planet Ocean Chronograph",
      "created_at": "2025-06-07 18:04:01.196565+00",
      "popular": false
    },
    {
      "id": "b1de8ea7-5d4c-4b86-9d6e-5f9168567b32",
      "brand_id": "32dd7f29-deb3-4885-bb15-7620c3491df3",
      "slug": "br-s",
      "label": "BR S",
      "created_at": "2025-06-07 18:04:01.440984+00",
      "popular": false
    },
    {
      "id": "6b277338-4603-4aed-9fce-d4659d4b7366",
      "brand_id": "96f7bbb1-2a1c-4d4e-a163-70d9076734e9",
      "slug": "seamaster",
      "label": "Seamaster",
      "created_at": "2025-06-07 18:04:01.196565+00",
      "popular": true
    },
    {
      "id": "674b7f46-4e6c-42b6-9025-cd15d627dc11",
      "brand_id": "96f7bbb1-2a1c-4d4e-a163-70d9076734e9",
      "slug": "seamaster-polaris",
      "label": "Seamaster Polaris",
      "created_at": "2025-06-07 18:04:01.196565+00",
      "popular": false
    },
    {
      "id": "9998d3b9-f466-49e3-8025-78a1f359607d",
      "brand_id": "96f7bbb1-2a1c-4d4e-a163-70d9076734e9",
      "slug": "seamaster-railmaster",
      "label": "Seamaster Railmaster",
      "created_at": "2025-06-07 18:04:01.196565+00",
      "popular": false
    },
    {
      "id": "d9592dfe-421b-4d5c-a683-3ecbd19c6c65",
      "brand_id": "96f7bbb1-2a1c-4d4e-a163-70d9076734e9",
      "slug": "seamaster-ultra-deep-6000-m",
      "label": "Seamaster Ultra Deep 6000 M",
      "created_at": "2025-06-07 18:04:01.196565+00",
      "popular": false
    },
    {
      "id": "52f984f6-f20b-454d-8370-cd86b9609bed",
      "brand_id": "96f7bbb1-2a1c-4d4e-a163-70d9076734e9",
      "slug": "speedmaster-broad-arrow",
      "label": "Speedmaster Broad Arrow",
      "created_at": "2025-06-07 18:04:01.196565+00",
      "popular": false
    },
    {
      "id": "9b8c0f81-1e89-449b-8f27-eaaf355851ce",
      "brand_id": "96f7bbb1-2a1c-4d4e-a163-70d9076734e9",
      "slug": "speedmaster-chronoscope",
      "label": "Speedmaster Chronoscope",
      "created_at": "2025-06-07 18:04:01.196565+00",
      "popular": false
    },
    {
      "id": "7cc23ec7-01cd-486b-b8d3-aad0aec681f0",
      "brand_id": "96f7bbb1-2a1c-4d4e-a163-70d9076734e9",
      "slug": "speedmaster-date",
      "label": "Speedmaster Date",
      "created_at": "2025-06-07 18:04:01.196565+00",
      "popular": false
    },
    {
      "id": "bbd2d22d-fb62-418a-8362-e14eaf2ca78d",
      "brand_id": "96f7bbb1-2a1c-4d4e-a163-70d9076734e9",
      "slug": "speedmaster-day-date",
      "label": "Speedmaster Day Date",
      "created_at": "2025-06-07 18:04:01.196565+00",
      "popular": false
    },
    {
      "id": "ed20b8b6-620e-4011-9044-558a7ffc2367",
      "brand_id": "96f7bbb1-2a1c-4d4e-a163-70d9076734e9",
      "slug": "speedmaster-ladies-chronograph",
      "label": "Speedmaster Ladies Chronograph",
      "created_at": "2025-06-07 18:04:01.196565+00",
      "popular": false
    },
    {
      "id": "276be681-92d5-4eef-b5ce-205b57fb660f",
      "brand_id": "96f7bbb1-2a1c-4d4e-a163-70d9076734e9",
      "slug": "speedmaster-mark-ii",
      "label": "Speedmaster Mark II",
      "created_at": "2025-06-07 18:04:01.196565+00",
      "popular": false
    },
    {
      "id": "ea6b6277-fa92-45c2-bab6-dea52a7395ec",
      "brand_id": "96f7bbb1-2a1c-4d4e-a163-70d9076734e9",
      "slug": "speedmaster-mark-iii",
      "label": "Speedmaster Mark III",
      "created_at": "2025-06-07 18:04:01.196565+00",
      "popular": false
    },
    {
      "id": "395cc3d5-ebdc-438d-bb9b-2829fa060369",
      "brand_id": "96f7bbb1-2a1c-4d4e-a163-70d9076734e9",
      "slug": "speedmaster-mark-iv",
      "label": "Speedmaster Mark IV",
      "created_at": "2025-06-07 18:04:01.196565+00",
      "popular": false
    },
    {
      "id": "829b0ae4-7123-4bae-9dcb-3bb900eb8327",
      "brand_id": "96f7bbb1-2a1c-4d4e-a163-70d9076734e9",
      "slug": "speedmaster-moonphase",
      "label": "Speedmaster Moonphase",
      "created_at": "2025-06-07 18:04:01.196565+00",
      "popular": false
    },
    {
      "id": "509f70d2-5218-4391-9e6a-4a4d59068ab2",
      "brand_id": "96f7bbb1-2a1c-4d4e-a163-70d9076734e9",
      "slug": "speedmaster-professional-moonwatch",
      "label": "Speedmaster Professional Moonwatch",
      "created_at": "2025-06-07 18:04:01.196565+00",
      "popular": false
    },
    {
      "id": "2f1887a6-7da2-4948-885b-3c9affc6eb2b",
      "brand_id": "96f7bbb1-2a1c-4d4e-a163-70d9076734e9",
      "slug": "speedmaster-professional-moonwatch-moonphase",
      "label": "Speedmaster Professional Moonwatch Moonphase",
      "created_at": "2025-06-07 18:04:01.196565+00",
      "popular": false
    },
    {
      "id": "8915a841-2fe3-406f-b86c-9be7551b8257",
      "brand_id": "96f7bbb1-2a1c-4d4e-a163-70d9076734e9",
      "slug": "speedmaster-racing",
      "label": "Speedmaster Racing",
      "created_at": "2025-06-07 18:04:01.196565+00",
      "popular": false
    },
    {
      "id": "2a48ce04-11e3-4df4-8d0f-4ad5232cecc4",
      "brand_id": "96f7bbb1-2a1c-4d4e-a163-70d9076734e9",
      "slug": "speedmaster-reduced",
      "label": "Speedmaster Reduced",
      "created_at": "2025-06-07 18:04:01.196565+00",
      "popular": false
    },
    {
      "id": "0c5fef6a-f9bd-45e1-9036-3de35b89ed54",
      "brand_id": "32dd7f29-deb3-4885-bb15-7620c3491df3",
      "slug": "br-01",
      "label": "BR 01",
      "created_at": "2025-06-07 18:04:01.440984+00",
      "popular": false
    },
    {
      "id": "481562db-a84f-4d3b-825f-175a6a0a2155",
      "brand_id": "32dd7f29-deb3-4885-bb15-7620c3491df3",
      "slug": "br-01-92",
      "label": "BR 01-92",
      "created_at": "2025-06-07 18:04:01.440984+00",
      "popular": false
    },
    {
      "id": "0967595d-c6ba-4747-b891-67b8592c75d0",
      "brand_id": "32dd7f29-deb3-4885-bb15-7620c3491df3",
      "slug": "br-03",
      "label": "BR 03",
      "created_at": "2025-06-07 18:04:01.440984+00",
      "popular": false
    },
    {
      "id": "7c37763d-750f-4358-a38c-b466314ad6b7",
      "brand_id": "32dd7f29-deb3-4885-bb15-7620c3491df3",
      "slug": "br-03-92-ceramic",
      "label": "BR 03-92 Ceramic",
      "created_at": "2025-06-07 18:04:01.440984+00",
      "popular": false
    },
    {
      "id": "8457e711-831e-43de-87ba-9174192e9f1f",
      "brand_id": "32dd7f29-deb3-4885-bb15-7620c3491df3",
      "slug": "br-03-92-steel",
      "label": "BR 03-92 Steel",
      "created_at": "2025-06-07 18:04:01.440984+00",
      "popular": false
    },
    {
      "id": "bf5b02d7-d86a-4d38-a79b-c124cc85b33d",
      "brand_id": "32dd7f29-deb3-4885-bb15-7620c3491df3",
      "slug": "br-03-94-chronographe",
      "label": "BR 03-94 Chronographe",
      "created_at": "2025-06-07 18:04:01.440984+00",
      "popular": false
    },
    {
      "id": "3b576153-c23f-47cf-a21a-705209759319",
      "brand_id": "32dd7f29-deb3-4885-bb15-7620c3491df3",
      "slug": "br-05",
      "label": "BR 05",
      "created_at": "2025-06-07 18:04:01.440984+00",
      "popular": false
    },
    {
      "id": "f4173347-838a-4e84-af11-fda74edbafd6",
      "brand_id": "96f7bbb1-2a1c-4d4e-a163-70d9076734e9",
      "slug": "speedmaster",
      "label": "Speedmaster",
      "created_at": "2025-06-07 18:04:01.196565+00",
      "popular": true
    },
    {
      "id": "bc2b8b8a-aa87-4535-9cc4-fad16d10da0b",
      "brand_id": "32dd7f29-deb3-4885-bb15-7620c3491df3",
      "slug": "br-v1",
      "label": "BR V1",
      "created_at": "2025-06-07 18:04:01.440984+00",
      "popular": false
    },
    {
      "id": "b2c9a29a-492c-407b-a595-a8951d77ac87",
      "brand_id": "32dd7f29-deb3-4885-bb15-7620c3491df3",
      "slug": "br-v2",
      "label": "BR V2",
      "created_at": "2025-06-07 18:04:01.440984+00",
      "popular": false
    },
    {
      "id": "17f8b933-f9d9-4bab-a47e-26f52f4192d8",
      "brand_id": "32dd7f29-deb3-4885-bb15-7620c3491df3",
      "slug": "br-x1",
      "label": "BR-X1",
      "created_at": "2025-06-07 18:04:01.440984+00",
      "popular": false
    },
    {
      "id": "20b35118-6af8-4c50-a607-91cf5aa78585",
      "brand_id": "32dd7f29-deb3-4885-bb15-7620c3491df3",
      "slug": "vintage",
      "label": "Vintage",
      "created_at": "2025-06-07 18:04:01.440984+00",
      "popular": false
    },
    {
      "id": "f540745d-deed-42cf-9357-0ddfb1c8b193",
      "brand_id": "97858d23-05fe-4576-ae8c-581338b7a0df",
      "slug": "air-command",
      "label": "Air Command",
      "created_at": "2025-06-07 18:04:01.440984+00",
      "popular": false
    },
    {
      "id": "fbbd985c-d88c-4cd0-9d7a-ce5b3b226316",
      "brand_id": "97858d23-05fe-4576-ae8c-581338b7a0df",
      "slug": "fifty-fathoms",
      "label": "Fifty Fathoms",
      "created_at": "2025-06-07 18:04:01.440984+00",
      "popular": false
    },
    {
      "id": "c3a8c6cc-6d60-45e8-9975-cf959ad3d2bf",
      "brand_id": "97858d23-05fe-4576-ae8c-581338b7a0df",
      "slug": "fifty-fathoms-bathyscaphe",
      "label": "Fifty Fathoms Bathyscaphe",
      "created_at": "2025-06-07 18:04:01.440984+00",
      "popular": false
    },
    {
      "id": "e58d6c4e-b8e6-418a-badf-4303a7c199dd",
      "brand_id": "97858d23-05fe-4576-ae8c-581338b7a0df",
      "slug": "leman",
      "label": "Léman",
      "created_at": "2025-06-07 18:04:01.440984+00",
      "popular": false
    },
    {
      "id": "d40293e3-826c-4d54-bce8-112f3e1757ab",
      "brand_id": "97858d23-05fe-4576-ae8c-581338b7a0df",
      "slug": "leman-fly-back",
      "label": "Léman Fly-Back",
      "created_at": "2025-06-07 18:04:01.440984+00",
      "popular": false
    },
    {
      "id": "c67a540c-079a-4384-abbf-8b8d52a0b432",
      "brand_id": "97858d23-05fe-4576-ae8c-581338b7a0df",
      "slug": "leman-moonphase",
      "label": "Léman Moonphase",
      "created_at": "2025-06-07 18:04:01.440984+00",
      "popular": false
    },
    {
      "id": "bb3237c7-dbd1-4461-be5e-8bdbae2e825b",
      "brand_id": "97858d23-05fe-4576-ae8c-581338b7a0df",
      "slug": "leman-ultra-slim",
      "label": "Léman Ultra Slim",
      "created_at": "2025-06-07 18:04:01.440984+00",
      "popular": false
    },
    {
      "id": "31e4576a-2dac-4345-91cf-6d8e0465feb8",
      "brand_id": "97858d23-05fe-4576-ae8c-581338b7a0df",
      "slug": "l-evolution",
      "label": "L-Evolution",
      "created_at": "2025-06-07 18:04:01.440984+00",
      "popular": false
    },
    {
      "id": "4c04424c-b4df-4568-909b-865d71faa6c8",
      "brand_id": "97858d23-05fe-4576-ae8c-581338b7a0df",
      "slug": "villeret",
      "label": "Villeret",
      "created_at": "2025-06-07 18:04:01.440984+00",
      "popular": false
    },
    {
      "id": "05769bad-e62a-42d2-a2f0-54037e2d498a",
      "brand_id": "97858d23-05fe-4576-ae8c-581338b7a0df",
      "slug": "villeret-moonphase",
      "label": "Villeret Moonphase",
      "created_at": "2025-06-07 18:04:01.440984+00",
      "popular": false
    },
    {
      "id": "d26054a9-4616-46e8-b50b-aa21e6ca5657",
      "brand_id": "97858d23-05fe-4576-ae8c-581338b7a0df",
      "slug": "villeret-quantieme-complet",
      "label": "Villeret Quantième Complet",
      "created_at": "2025-06-07 18:04:01.440984+00",
      "popular": false
    },
    {
      "id": "be5a9242-aedc-472f-8afe-e22999adb14b",
      "brand_id": "97858d23-05fe-4576-ae8c-581338b7a0df",
      "slug": "villeret-ultra-plate",
      "label": "Villeret Ultra-Plate",
      "created_at": "2025-06-07 18:04:01.440984+00",
      "popular": false
    },
    {
      "id": "239a28b9-c095-4c2e-9fac-2d5b137581a8",
      "brand_id": "97858d23-05fe-4576-ae8c-581338b7a0df",
      "slug": "women",
      "label": "Women",
      "created_at": "2025-06-07 18:04:01.440984+00",
      "popular": false
    },
    {
      "id": "e99c735f-cdc0-46d7-bcb3-fe83c8a9c475",
      "brand_id": "d1aa02d2-bd20-4136-ad3e-c7ef36e11055",
      "slug": "classique",
      "label": "Classique",
      "created_at": "2025-06-07 18:04:01.440984+00",
      "popular": false
    },
    {
      "id": "61a65710-92ca-4edf-9bc5-31ab26647213",
      "brand_id": "d1aa02d2-bd20-4136-ad3e-c7ef36e11055",
      "slug": "classique-complications",
      "label": "Classique Complications",
      "created_at": "2025-06-07 18:04:01.440984+00",
      "popular": false
    },
    {
      "id": "a776270e-3056-4ce0-810d-7c72b0319d35",
      "brand_id": "d1aa02d2-bd20-4136-ad3e-c7ef36e11055",
      "slug": "heritage",
      "label": "Heritage",
      "created_at": "2025-06-07 18:04:01.440984+00",
      "popular": false
    },
    {
      "id": "415b1f3a-98b2-45ac-8e7f-91d9ce8f5f31",
      "brand_id": "d1aa02d2-bd20-4136-ad3e-c7ef36e11055",
      "slug": "marine",
      "label": "Marine",
      "created_at": "2025-06-07 18:04:01.440984+00",
      "popular": false
    },
    {
      "id": "62866bae-55c5-468d-8e5c-521006b6f96d",
      "brand_id": "d1aa02d2-bd20-4136-ad3e-c7ef36e11055",
      "slug": "reine-de-naples",
      "label": "Reine de Naples",
      "created_at": "2025-06-07 18:04:01.440984+00",
      "popular": false
    },
    {
      "id": "a7b43736-95b5-495d-a7c1-e5218c284d1d",
      "brand_id": "d1aa02d2-bd20-4136-ad3e-c7ef36e11055",
      "slug": "tradition",
      "label": "Tradition",
      "created_at": "2025-06-07 18:04:01.440984+00",
      "popular": false
    },
    {
      "id": "a29ef740-b042-4641-b0c9-40be8b587f10",
      "brand_id": "d1aa02d2-bd20-4136-ad3e-c7ef36e11055",
      "slug": "type-xx-xxi-xxii",
      "label": "Type XX - XXI - XXII",
      "created_at": "2025-06-07 18:04:01.440984+00",
      "popular": false
    },
    {
      "id": "c5004412-e5b4-401f-997c-d5ceaca9f0e8",
      "brand_id": "731ec105-c1a2-4a8b-9e16-c1885804ce55",
      "slug": "aerospace",
      "label": "Aerospace",
      "created_at": "2025-06-07 18:04:01.440984+00",
      "popular": false
    },
    {
      "id": "83dc4f5c-2f73-40ce-b786-e428061914a4",
      "brand_id": "731ec105-c1a2-4a8b-9e16-c1885804ce55",
      "slug": "avenger-hurricane",
      "label": "Avenger Hurricane",
      "created_at": "2025-06-07 18:04:01.440984+00",
      "popular": false
    },
    {
      "id": "b19a5514-0b25-481e-9b25-f38262ce450b",
      "brand_id": "731ec105-c1a2-4a8b-9e16-c1885804ce55",
      "slug": "avenger-ii",
      "label": "Avenger II",
      "created_at": "2025-06-07 18:04:01.440984+00",
      "popular": false
    },
    {
      "id": "5f597eea-7ca8-4bbc-aff7-14879f8b933a",
      "brand_id": "731ec105-c1a2-4a8b-9e16-c1885804ce55",
      "slug": "avenger-ii-gmt",
      "label": "Avenger II GMT",
      "created_at": "2025-06-07 18:04:01.440984+00",
      "popular": false
    },
    {
      "id": "cb9f0581-b328-4abb-ad52-325943ae980a",
      "brand_id": "731ec105-c1a2-4a8b-9e16-c1885804ce55",
      "slug": "avenger-ii-seawolf",
      "label": "Avenger II Seawolf",
      "created_at": "2025-06-07 18:04:01.440984+00",
      "popular": false
    },
    {
      "id": "c93bac57-ffd7-48bc-aa5b-ab572edc34da",
      "brand_id": "731ec105-c1a2-4a8b-9e16-c1885804ce55",
      "slug": "avenger-seawolf",
      "label": "Avenger Seawolf",
      "created_at": "2025-06-07 18:04:01.440984+00",
      "popular": false
    },
    {
      "id": "9ae506bb-9eb1-44f4-8ae9-5789f8928334",
      "brand_id": "731ec105-c1a2-4a8b-9e16-c1885804ce55",
      "slug": "avenger-skyland",
      "label": "Avenger Skyland",
      "created_at": "2025-06-07 18:04:01.440984+00",
      "popular": false
    },
    {
      "id": "159fe17b-44dd-45c5-97bd-353ea7900894",
      "brand_id": "731ec105-c1a2-4a8b-9e16-c1885804ce55",
      "slug": "aviator-8",
      "label": "Aviator 8",
      "created_at": "2025-06-07 18:04:01.440984+00",
      "popular": false
    },
    {
      "id": "47b2d908-3bac-476e-8744-ea7735b53d59",
      "brand_id": "731ec105-c1a2-4a8b-9e16-c1885804ce55",
      "slug": "bentley-6-75",
      "label": "Bentley 6.75",
      "created_at": "2025-06-07 18:04:01.440984+00",
      "popular": false
    },
    {
      "id": "a6af7e4d-1688-41e4-9c90-6babe20d62d4",
      "brand_id": "731ec105-c1a2-4a8b-9e16-c1885804ce55",
      "slug": "bentley-flying-b",
      "label": "Bentley Flying B",
      "created_at": "2025-06-07 18:04:01.440984+00",
      "popular": false
    },
    {
      "id": "64add81f-0e73-4486-999f-e773b84e2028",
      "brand_id": "731ec105-c1a2-4a8b-9e16-c1885804ce55",
      "slug": "bentley-gmt",
      "label": "Bentley GMT",
      "created_at": "2025-06-07 18:04:01.440984+00",
      "popular": false
    },
    {
      "id": "34fda9ad-7261-4e07-b5ab-83932d616d6a",
      "brand_id": "731ec105-c1a2-4a8b-9e16-c1885804ce55",
      "slug": "bentley-gt",
      "label": "Bentley GT",
      "created_at": "2025-06-07 18:04:01.440984+00",
      "popular": false
    },
    {
      "id": "33a5e411-d6d3-4ccc-b650-aa909685d3b3",
      "brand_id": "731ec105-c1a2-4a8b-9e16-c1885804ce55",
      "slug": "bentley-motors",
      "label": "Bentley Motors",
      "created_at": "2025-06-07 18:04:01.440984+00",
      "popular": false
    },
    {
      "id": "ad3d9f2f-8e2c-40e6-b0af-447b3f1ac10c",
      "brand_id": "731ec105-c1a2-4a8b-9e16-c1885804ce55",
      "slug": "blackbird",
      "label": "Blackbird",
      "created_at": "2025-06-07 18:04:01.440984+00",
      "popular": false
    },
    {
      "id": "9bd0f8be-3324-4771-a76b-7592b1d1b3fe",
      "brand_id": "731ec105-c1a2-4a8b-9e16-c1885804ce55",
      "slug": "callistino",
      "label": "Callistino",
      "created_at": "2025-06-07 18:04:01.440984+00",
      "popular": false
    },
    {
      "id": "58e9630f-446d-4f8b-bbfb-85fc6fddd9ac",
      "brand_id": "731ec105-c1a2-4a8b-9e16-c1885804ce55",
      "slug": "callisto",
      "label": "Callisto",
      "created_at": "2025-06-07 18:04:01.440984+00",
      "popular": false
    },
    {
      "id": "e3c58254-50fe-44ac-a867-53c9dfbad1e8",
      "brand_id": "731ec105-c1a2-4a8b-9e16-c1885804ce55",
      "slug": "chrono-cockpit",
      "label": "Chrono Cockpit",
      "created_at": "2025-06-07 18:04:01.440984+00",
      "popular": false
    },
    {
      "id": "1d64b55f-aa67-4f3d-9ff4-6341eaafb78f",
      "brand_id": "731ec105-c1a2-4a8b-9e16-c1885804ce55",
      "slug": "chronomat-36",
      "label": "Chronomat 36",
      "created_at": "2025-06-07 18:04:01.440984+00",
      "popular": false
    },
    {
      "id": "7e9f7597-27a0-4319-8efa-d1bf164ac1c9",
      "brand_id": "731ec105-c1a2-4a8b-9e16-c1885804ce55",
      "slug": "chronomat-38",
      "label": "Chronomat 38",
      "created_at": "2025-06-07 18:04:01.440984+00",
      "popular": false
    },
    {
      "id": "d18e9274-ff58-43a8-8415-a2df4a371310",
      "brand_id": "731ec105-c1a2-4a8b-9e16-c1885804ce55",
      "slug": "chronomat-41",
      "label": "Chronomat 41",
      "created_at": "2025-06-07 18:04:01.440984+00",
      "popular": false
    },
    {
      "id": "699727cd-a673-42fe-b35a-f61a266d3a9b",
      "brand_id": "731ec105-c1a2-4a8b-9e16-c1885804ce55",
      "slug": "chronomat-42",
      "label": "Chronomat 42",
      "created_at": "2025-06-07 18:04:01.440984+00",
      "popular": false
    },
    {
      "id": "58e19b52-556c-40ec-8db5-46c2d5d85f86",
      "brand_id": "731ec105-c1a2-4a8b-9e16-c1885804ce55",
      "slug": "chronomat-44",
      "label": "Chronomat 44",
      "created_at": "2025-06-07 18:04:01.440984+00",
      "popular": false
    },
    {
      "id": "eb88c3ec-f668-430d-9c77-c536b91b10be",
      "brand_id": "731ec105-c1a2-4a8b-9e16-c1885804ce55",
      "slug": "chronomat-44-gmt",
      "label": "Chronomat 44 GMT",
      "created_at": "2025-06-07 18:04:01.440984+00",
      "popular": false
    },
    {
      "id": "0773fd2b-11a3-419f-a136-93d5b33e61a1",
      "brand_id": "731ec105-c1a2-4a8b-9e16-c1885804ce55",
      "slug": "chronomat-colt",
      "label": "Chronomat Colt",
      "created_at": "2025-06-07 18:04:01.440984+00",
      "popular": false
    },
    {
      "id": "2cfad412-f888-4d9a-a08a-98ab523f9956",
      "brand_id": "731ec105-c1a2-4a8b-9e16-c1885804ce55",
      "slug": "chronomat-evolution",
      "label": "Chronomat Evolution",
      "created_at": "2025-06-07 18:04:01.440984+00",
      "popular": false
    },
    {
      "id": "ccaf9fdd-39a2-48a0-b727-4069539e654a",
      "brand_id": "731ec105-c1a2-4a8b-9e16-c1885804ce55",
      "slug": "chronomat-gmt",
      "label": "Chronomat GMT",
      "created_at": "2025-06-07 18:04:01.440984+00",
      "popular": false
    },
    {
      "id": "bcd361a2-55dd-4213-bf2a-eba2c105ad57",
      "brand_id": "731ec105-c1a2-4a8b-9e16-c1885804ce55",
      "slug": "chrono-matic",
      "label": "Chrono-Matic",
      "created_at": "2025-06-07 18:04:01.440984+00",
      "popular": false
    },
    {
      "id": "ee619882-0e6d-494b-a0a5-c697136fae93",
      "brand_id": "731ec105-c1a2-4a8b-9e16-c1885804ce55",
      "slug": "chronospace",
      "label": "Chronospace",
      "created_at": "2025-06-07 18:04:01.440984+00",
      "popular": false
    },
    {
      "id": "b5ff2cde-679a-421b-9b9e-bef0d7add88c",
      "brand_id": "731ec105-c1a2-4a8b-9e16-c1885804ce55",
      "slug": "cockpit",
      "label": "Cockpit",
      "created_at": "2025-06-07 18:04:01.440984+00",
      "popular": false
    },
    {
      "id": "8a078b6a-b7e7-475d-802d-f9c55e009786",
      "brand_id": "731ec105-c1a2-4a8b-9e16-c1885804ce55",
      "slug": "cockpit-lady",
      "label": "Cockpit Lady",
      "created_at": "2025-06-07 18:04:01.440984+00",
      "popular": false
    },
    {
      "id": "ee514730-8f3f-43d0-bf61-7c9cc5a95d0b",
      "brand_id": "731ec105-c1a2-4a8b-9e16-c1885804ce55",
      "slug": "colt-automatic",
      "label": "Colt Automatic",
      "created_at": "2025-06-07 18:04:01.440984+00",
      "popular": false
    },
    {
      "id": "55097e25-c9b6-434b-957c-b1bee91b26b3",
      "brand_id": "731ec105-c1a2-4a8b-9e16-c1885804ce55",
      "slug": "colt-chronograph",
      "label": "Colt Chronograph",
      "created_at": "2025-06-07 18:04:01.440984+00",
      "popular": false
    },
    {
      "id": "5d7f01f6-1ed1-4db1-967d-24fc87860ffa",
      "brand_id": "731ec105-c1a2-4a8b-9e16-c1885804ce55",
      "slug": "colt-chronograph-automatic",
      "label": "Colt Chronograph Automatic",
      "created_at": "2025-06-07 18:04:01.440984+00",
      "popular": false
    },
    {
      "id": "a6def432-cd8b-4cae-ac53-117b7d2f9683",
      "brand_id": "731ec105-c1a2-4a8b-9e16-c1885804ce55",
      "slug": "colt-oceane",
      "label": "Colt Océane",
      "created_at": "2025-06-07 18:04:01.440984+00",
      "popular": false
    },
    {
      "id": "542bbc53-481a-4fe5-a4b1-80c474f3ab21",
      "brand_id": "731ec105-c1a2-4a8b-9e16-c1885804ce55",
      "slug": "colt-quartz",
      "label": "Colt Quartz",
      "created_at": "2025-06-07 18:04:01.440984+00",
      "popular": false
    },
    {
      "id": "b532a670-2496-4098-b408-ee489b07aab8",
      "brand_id": "731ec105-c1a2-4a8b-9e16-c1885804ce55",
      "slug": "crosswind-chronograph",
      "label": "Crosswind Chronograph",
      "created_at": "2025-06-07 18:04:01.440984+00",
      "popular": false
    },
    {
      "id": "fd184e9b-6b64-41af-978c-13cbb6a938e2",
      "brand_id": "731ec105-c1a2-4a8b-9e16-c1885804ce55",
      "slug": "duograph",
      "label": "Duograph",
      "created_at": "2025-06-07 18:04:01.440984+00",
      "popular": false
    },
    {
      "id": "fa7115fe-93ce-4969-8546-437596717c63",
      "brand_id": "731ec105-c1a2-4a8b-9e16-c1885804ce55",
      "slug": "emergency",
      "label": "Emergency",
      "created_at": "2025-06-07 18:04:01.440984+00",
      "popular": false
    },
    {
      "id": "3b0ebf05-a6a5-4f58-a77b-a791bca6b34b",
      "brand_id": "731ec105-c1a2-4a8b-9e16-c1885804ce55",
      "slug": "for-bentley",
      "label": "for Bentley",
      "created_at": "2025-06-07 18:04:01.440984+00",
      "popular": false
    },
    {
      "id": "72b52b94-4287-45a5-b922-136d3cdd4a77",
      "brand_id": "731ec105-c1a2-4a8b-9e16-c1885804ce55",
      "slug": "galactic",
      "label": "Galactic",
      "created_at": "2025-06-07 18:04:01.679525+00",
      "popular": false
    },
    {
      "id": "a107750a-bb81-474e-8ab3-c44a6d48c186",
      "brand_id": "731ec105-c1a2-4a8b-9e16-c1885804ce55",
      "slug": "galactic-32",
      "label": "Galactic 32",
      "created_at": "2025-06-07 18:04:01.679525+00",
      "popular": false
    },
    {
      "id": "af5fdb3d-4a7b-418f-83d5-8642f8da68ed",
      "brand_id": "731ec105-c1a2-4a8b-9e16-c1885804ce55",
      "slug": "galactic-36",
      "label": "Galactic 36",
      "created_at": "2025-06-07 18:04:01.679525+00",
      "popular": false
    },
    {
      "id": "28b9a800-7ccd-45b6-af47-6e979709c1bc",
      "brand_id": "731ec105-c1a2-4a8b-9e16-c1885804ce55",
      "slug": "lady-j",
      "label": "Lady J",
      "created_at": "2025-06-07 18:04:01.679525+00",
      "popular": false
    },
    {
      "id": "3020e73e-8496-414b-86f3-67d83e2f17f1",
      "brand_id": "731ec105-c1a2-4a8b-9e16-c1885804ce55",
      "slug": "montbrillant",
      "label": "Montbrillant",
      "created_at": "2025-06-07 18:04:01.679525+00",
      "popular": false
    },
    {
      "id": "974bfbf1-d4cc-4562-984c-9024954e2e34",
      "brand_id": "731ec105-c1a2-4a8b-9e16-c1885804ce55",
      "slug": "montbrillant-datora",
      "label": "Montbrillant Datora",
      "created_at": "2025-06-07 18:04:01.679525+00",
      "popular": false
    },
    {
      "id": "9f00311e-2205-40bb-a04b-c7d571c503c4",
      "brand_id": "731ec105-c1a2-4a8b-9e16-c1885804ce55",
      "slug": "navitimer-01",
      "label": "Navitimer 01",
      "created_at": "2025-06-07 18:04:01.679525+00",
      "popular": false
    },
    {
      "id": "61ace6e5-c465-4281-97a7-5616addb5c52",
      "brand_id": "731ec105-c1a2-4a8b-9e16-c1885804ce55",
      "slug": "navitimer-1-b01-chronograph",
      "label": "Navitimer 1 B01 Chronograph",
      "created_at": "2025-06-07 18:04:01.679525+00",
      "popular": false
    },
    {
      "id": "d3b5da74-59dd-4087-b618-649cda10e151",
      "brand_id": "731ec105-c1a2-4a8b-9e16-c1885804ce55",
      "slug": "navitimer-8",
      "label": "Navitimer 8",
      "created_at": "2025-06-07 18:04:01.679525+00",
      "popular": false
    },
    {
      "id": "7aa99ed6-e0ca-4b2f-b0ce-d407664f536c",
      "brand_id": "731ec105-c1a2-4a8b-9e16-c1885804ce55",
      "slug": "navitimer-cosmonaute",
      "label": "Navitimer Cosmonaute",
      "created_at": "2025-06-07 18:04:01.679525+00",
      "popular": false
    },
    {
      "id": "489e9390-3b86-4bee-9a8b-1bb333aabfb0",
      "brand_id": "731ec105-c1a2-4a8b-9e16-c1885804ce55",
      "slug": "navitimer-gmt",
      "label": "Navitimer GMT",
      "created_at": "2025-06-07 18:04:01.679525+00",
      "popular": false
    },
    {
      "id": "66af0fa0-9222-497a-bd0a-5bf249fb852f",
      "brand_id": "731ec105-c1a2-4a8b-9e16-c1885804ce55",
      "slug": "navitimer-heritage",
      "label": "Navitimer Heritage",
      "created_at": "2025-06-07 18:04:01.679525+00",
      "popular": false
    },
    {
      "id": "e360e644-ec32-4abc-a826-d3f491efa4a3",
      "brand_id": "731ec105-c1a2-4a8b-9e16-c1885804ce55",
      "slug": "navitimer-world",
      "label": "Navitimer World",
      "created_at": "2025-06-07 18:04:01.679525+00",
      "popular": false
    },
    {
      "id": "19eed3bd-d49e-407f-aaf1-6565fdcfe08f",
      "brand_id": "731ec105-c1a2-4a8b-9e16-c1885804ce55",
      "slug": "old-navitimer",
      "label": "Old Navitimer",
      "created_at": "2025-06-07 18:04:01.679525+00",
      "popular": false
    },
    {
      "id": "4217e487-5fd3-456e-89f4-203cc92b5d9c",
      "brand_id": "731ec105-c1a2-4a8b-9e16-c1885804ce55",
      "slug": "professional",
      "label": "Professional",
      "created_at": "2025-06-07 18:04:01.679525+00",
      "popular": false
    },
    {
      "id": "12576cf6-1cdc-4eca-b4fe-78db6673407d",
      "brand_id": "731ec105-c1a2-4a8b-9e16-c1885804ce55",
      "slug": "super-avenger",
      "label": "Super Avenger",
      "created_at": "2025-06-07 18:04:01.679525+00",
      "popular": false
    },
    {
      "id": "14cd417b-6c39-4aa9-8430-7324a4866862",
      "brand_id": "731ec105-c1a2-4a8b-9e16-c1885804ce55",
      "slug": "super-avenger-ii",
      "label": "Super Avenger II",
      "created_at": "2025-06-07 18:04:01.679525+00",
      "popular": false
    },
    {
      "id": "88062bec-271a-4c40-8191-e66a4c0aa4e9",
      "brand_id": "731ec105-c1a2-4a8b-9e16-c1885804ce55",
      "slug": "super-avi",
      "label": "Super Avi",
      "created_at": "2025-06-07 18:04:01.679525+00",
      "popular": false
    },
    {
      "id": "757f08b4-c2e8-4d82-b0e4-e8577ae7da05",
      "brand_id": "731ec105-c1a2-4a8b-9e16-c1885804ce55",
      "slug": "superocean-36",
      "label": "Superocean 36",
      "created_at": "2025-06-07 18:04:01.679525+00",
      "popular": false
    },
    {
      "id": "2f7fd9d8-f629-4e25-a89d-db88b1250732",
      "brand_id": "731ec105-c1a2-4a8b-9e16-c1885804ce55",
      "slug": "superocean-42",
      "label": "Superocean 42",
      "created_at": "2025-06-07 18:04:01.679525+00",
      "popular": false
    },
    {
      "id": "ae1e347f-43f5-4d23-a7e8-4420fa6fa18c",
      "brand_id": "731ec105-c1a2-4a8b-9e16-c1885804ce55",
      "slug": "superocean-44",
      "label": "Superocean 44",
      "created_at": "2025-06-07 18:04:01.679525+00",
      "popular": false
    },
    {
      "id": "0e820e2a-f5ba-45b0-b40a-742c1d2a7561",
      "brand_id": "731ec105-c1a2-4a8b-9e16-c1885804ce55",
      "slug": "superocean-chronograph-ii",
      "label": "Superocean Chronograph II",
      "created_at": "2025-06-07 18:04:01.679525+00",
      "popular": false
    },
    {
      "id": "a8718a72-b20b-46df-84d0-dc4d473bfe97",
      "brand_id": "731ec105-c1a2-4a8b-9e16-c1885804ce55",
      "slug": "superocean-heritage",
      "label": "Superocean Heritage",
      "created_at": "2025-06-07 18:04:01.679525+00",
      "popular": false
    },
    {
      "id": "b0d14c3f-e619-4c0b-a098-8de36664b39b",
      "brand_id": "731ec105-c1a2-4a8b-9e16-c1885804ce55",
      "slug": "superocean-heritage-42",
      "label": "Superocean Heritage 42",
      "created_at": "2025-06-07 18:04:01.679525+00",
      "popular": false
    },
    {
      "id": "5c4393c3-fbad-41e7-aba6-96ed87559ed6",
      "brand_id": "731ec105-c1a2-4a8b-9e16-c1885804ce55",
      "slug": "superocean-heritage-46",
      "label": "Superocean Heritage 46",
      "created_at": "2025-06-07 18:04:01.679525+00",
      "popular": false
    },
    {
      "id": "59bab6d1-bec3-4bb0-82d6-f6dc2f61d0a1",
      "brand_id": "731ec105-c1a2-4a8b-9e16-c1885804ce55",
      "slug": "superocean-heritage-chronograph",
      "label": "Superocean Heritage Chronograph",
      "created_at": "2025-06-07 18:04:01.679525+00",
      "popular": false
    },
    {
      "id": "7cf4a3a9-30f0-487b-8509-27dc482fb2e5",
      "brand_id": "731ec105-c1a2-4a8b-9e16-c1885804ce55",
      "slug": "superocean-heritage-ii-42",
      "label": "Superocean Heritage II 42",
      "created_at": "2025-06-07 18:04:01.679525+00",
      "popular": false
    },
    {
      "id": "7f55fc4a-2c52-402a-9f31-8bfa3ed93540",
      "brand_id": "731ec105-c1a2-4a8b-9e16-c1885804ce55",
      "slug": "superocean-heritage-ii-46",
      "label": "Superocean Heritage II 46",
      "created_at": "2025-06-07 18:04:01.679525+00",
      "popular": false
    },
    {
      "id": "2fa0a6de-1029-43b8-b34d-fd2733e9e951",
      "brand_id": "731ec105-c1a2-4a8b-9e16-c1885804ce55",
      "slug": "superocean-heritage-ii-chronograph",
      "label": "Superocean Heritage II Chronograph",
      "created_at": "2025-06-07 18:04:01.679525+00",
      "popular": false
    },
    {
      "id": "61adf93f-65fa-41f0-b4ca-8442d9905ff5",
      "brand_id": "731ec105-c1a2-4a8b-9e16-c1885804ce55",
      "slug": "superocean-ii-44",
      "label": "Superocean II 44",
      "created_at": "2025-06-07 18:04:01.679525+00",
      "popular": false
    },
    {
      "id": "3a70faab-699f-4947-8dd7-5be5bcca9b4d",
      "brand_id": "731ec105-c1a2-4a8b-9e16-c1885804ce55",
      "slug": "transocean",
      "label": "Transocean",
      "created_at": "2025-06-07 18:04:01.679525+00",
      "popular": false
    },
    {
      "id": "ca5faa57-c637-48e5-a7a6-79f409f65a09",
      "brand_id": "731ec105-c1a2-4a8b-9e16-c1885804ce55",
      "slug": "transocean-chronograph",
      "label": "Transocean Chronograph",
      "created_at": "2025-06-07 18:04:01.679525+00",
      "popular": false
    },
    {
      "id": "3584a29d-bb17-49da-9f50-3fe235356377",
      "brand_id": "731ec105-c1a2-4a8b-9e16-c1885804ce55",
      "slug": "transocean-chronograph-unitime",
      "label": "Transocean Chronograph Unitime",
      "created_at": "2025-06-07 18:04:01.679525+00",
      "popular": false
    },
    {
      "id": "216a58d8-b538-4a99-89f4-0870b2f54e09",
      "brand_id": "731ec105-c1a2-4a8b-9e16-c1885804ce55",
      "slug": "windrider",
      "label": "Windrider",
      "created_at": "2025-06-07 18:04:01.679525+00",
      "popular": false
    },
    {
      "id": "aa36261c-2c37-4c69-908d-a2f2b5a7467d",
      "brand_id": "bf1a4585-e3db-4621-a33f-20c658bcd9e0",
      "slug": "assioma",
      "label": "Assioma",
      "created_at": "2025-06-07 18:04:01.679525+00",
      "popular": false
    },
    {
      "id": "8cab96d4-5167-4853-838d-5b4e7507decd",
      "brand_id": "bf1a4585-e3db-4621-a33f-20c658bcd9e0",
      "slug": "b-zero1",
      "label": "B.Zero1",
      "created_at": "2025-06-07 18:04:01.679525+00",
      "popular": false
    },
    {
      "id": "668409f8-5ae2-4624-a876-c7550f8dc6f9",
      "brand_id": "bf1a4585-e3db-4621-a33f-20c658bcd9e0",
      "slug": "bulgari",
      "label": "Bulgari",
      "created_at": "2025-06-07 18:04:01.679525+00",
      "popular": false
    },
    {
      "id": "db59ad48-5948-4fd1-8eba-385aee14da8c",
      "brand_id": "bf1a4585-e3db-4621-a33f-20c658bcd9e0",
      "slug": "diagono",
      "label": "Diagono",
      "created_at": "2025-06-07 18:04:01.679525+00",
      "popular": false
    },
    {
      "id": "c2740b25-00ea-4271-a608-8d357d9fc658",
      "brand_id": "bf1a4585-e3db-4621-a33f-20c658bcd9e0",
      "slug": "ergon",
      "label": "Ergon",
      "created_at": "2025-06-07 18:04:01.679525+00",
      "popular": false
    },
    {
      "id": "b54861d5-d21a-4b03-a176-880011c91099",
      "brand_id": "bf1a4585-e3db-4621-a33f-20c658bcd9e0",
      "slug": "lucea",
      "label": "Lucea",
      "created_at": "2025-06-07 18:04:01.679525+00",
      "popular": false
    },
    {
      "id": "e5543df3-a627-453f-b833-af4f907d9c52",
      "brand_id": "bf1a4585-e3db-4621-a33f-20c658bcd9e0",
      "slug": "octo",
      "label": "Octo",
      "created_at": "2025-06-07 18:04:01.679525+00",
      "popular": false
    },
    {
      "id": "c13c5bf8-2a42-44ed-82b4-f986a96a2b49",
      "brand_id": "bf1a4585-e3db-4621-a33f-20c658bcd9e0",
      "slug": "rettangolo",
      "label": "Rettangolo",
      "created_at": "2025-06-07 18:04:01.679525+00",
      "popular": false
    },
    {
      "id": "3b040135-ce2e-4ed9-8eb8-3c94b6feb2d1",
      "brand_id": "bf1a4585-e3db-4621-a33f-20c658bcd9e0",
      "slug": "serpenti",
      "label": "Serpenti",
      "created_at": "2025-06-07 18:04:01.679525+00",
      "popular": false
    },
    {
      "id": "c819ab4f-ff59-4a96-9f59-b99507fc69c1",
      "brand_id": "bf1a4585-e3db-4621-a33f-20c658bcd9e0",
      "slug": "solotempo",
      "label": "Solotempo",
      "created_at": "2025-06-07 18:04:01.679525+00",
      "popular": false
    },
    {
      "id": "234972d2-f51c-4e54-a1f3-8f6aabcf9848",
      "brand_id": "ce0bab2f-2730-41da-8f94-bad32d6138c0",
      "slug": "boyfriend",
      "label": "Boyfriend",
      "created_at": "2025-06-07 18:04:01.679525+00",
      "popular": false
    },
    {
      "id": "e2c0ed04-6cc1-40e4-809f-e4ecec4b02bc",
      "brand_id": "ce0bab2f-2730-41da-8f94-bad32d6138c0",
      "slug": "j12",
      "label": "J12",
      "created_at": "2025-06-07 18:04:01.679525+00",
      "popular": false
    },
    {
      "id": "d029d16e-a294-4e4b-9446-3923dd9d91a4",
      "brand_id": "ce0bab2f-2730-41da-8f94-bad32d6138c0",
      "slug": "mademoiselle",
      "label": "Mademoiselle",
      "created_at": "2025-06-07 18:04:01.679525+00",
      "popular": false
    },
    {
      "id": "ae3672eb-1099-4d46-9e18-3b97bbf641bd",
      "brand_id": "ce0bab2f-2730-41da-8f94-bad32d6138c0",
      "slug": "premiere",
      "label": "Première",
      "created_at": "2025-06-07 18:04:01.679525+00",
      "popular": false
    },
    {
      "id": "186a5d85-3189-4c33-8b3a-012f3215a169",
      "brand_id": "92f07b61-6319-471e-b6af-0eb30ee6838c",
      "slug": "alpine-eagle",
      "label": "Alpine Eagle",
      "created_at": "2025-06-07 18:04:01.679525+00",
      "popular": false
    },
    {
      "id": "4f649265-996c-443e-9f6b-7f8332f583ad",
      "brand_id": "92f07b61-6319-471e-b6af-0eb30ee6838c",
      "slug": "classic",
      "label": "Classic",
      "created_at": "2025-06-07 18:04:01.679525+00",
      "popular": false
    },
    {
      "id": "3771e80a-067e-4415-944f-54a36a90b06a",
      "brand_id": "92f07b61-6319-471e-b6af-0eb30ee6838c",
      "slug": "grand-prix-de-monaco-historique",
      "label": "Grand Prix de Monaco Historique",
      "created_at": "2025-06-07 18:04:01.679525+00",
      "popular": false
    },
    {
      "id": "0e3b244c-38e2-434a-b5b6-5cfcc1b74a88",
      "brand_id": "92f07b61-6319-471e-b6af-0eb30ee6838c",
      "slug": "happy-diamonds",
      "label": "Happy Diamonds",
      "created_at": "2025-06-07 18:04:01.679525+00",
      "popular": false
    },
    {
      "id": "c6f542f0-81dd-4e3a-a14c-f2404b8a6436",
      "brand_id": "92f07b61-6319-471e-b6af-0eb30ee6838c",
      "slug": "happy-sport",
      "label": "Happy Sport",
      "created_at": "2025-06-07 18:04:01.679525+00",
      "popular": false
    },
    {
      "id": "a65c89a7-f888-4ccb-a843-bddb2d1ff02b",
      "brand_id": "92f07b61-6319-471e-b6af-0eb30ee6838c",
      "slug": "imperiale",
      "label": "Imperiale",
      "created_at": "2025-06-07 18:04:01.679525+00",
      "popular": false
    },
    {
      "id": "ba590ba6-9cb6-4684-abed-bf333a91198b",
      "brand_id": "92f07b61-6319-471e-b6af-0eb30ee6838c",
      "slug": "l-u-c",
      "label": "L.U.C",
      "created_at": "2025-06-07 18:04:01.679525+00",
      "popular": false
    },
    {
      "id": "78bd0ee1-4eb2-43be-a211-c3028adb4420",
      "brand_id": "92f07b61-6319-471e-b6af-0eb30ee6838c",
      "slug": "la-strada",
      "label": "La Strada",
      "created_at": "2025-06-07 18:04:01.679525+00",
      "popular": false
    },
    {
      "id": "bdbc1b27-8a59-460c-bc11-7f7743e2e1d3",
      "brand_id": "92f07b61-6319-471e-b6af-0eb30ee6838c",
      "slug": "mille-miglia",
      "label": "Mille Miglia",
      "created_at": "2025-06-07 18:04:01.679525+00",
      "popular": false
    },
    {
      "id": "5d77ea56-0ae2-4113-8c66-89bab6938f34",
      "brand_id": "92f07b61-6319-471e-b6af-0eb30ee6838c",
      "slug": "st-moritz",
      "label": "St. Moritz",
      "created_at": "2025-06-07 18:04:01.679525+00",
      "popular": false
    },
    {
      "id": "5c5391ea-5967-4503-88a5-1d0c9fe12529",
      "brand_id": "92f07b61-6319-471e-b6af-0eb30ee6838c",
      "slug": "superfast",
      "label": "Superfast",
      "created_at": "2025-06-07 18:04:01.679525+00",
      "popular": false
    },
    {
      "id": "f393daa2-5b9c-4906-9f70-ce2e38fa8b18",
      "brand_id": "92f07b61-6319-471e-b6af-0eb30ee6838c",
      "slug": "your-hour",
      "label": "Your Hour",
      "created_at": "2025-06-07 18:04:01.679525+00",
      "popular": false
    },
    {
      "id": "07570ffb-6149-4de4-a908-1cb656766d1c",
      "brand_id": "a9cfdd75-047e-4119-8db8-e33744e8c9b2",
      "slug": "admirals-cup",
      "label": "Admiral's Cup",
      "created_at": "2025-06-07 18:04:01.679525+00",
      "popular": false
    },
    {
      "id": "e7b6bc52-0ced-4e9e-b83f-173a7a2e0aa7",
      "brand_id": "a9cfdd75-047e-4119-8db8-e33744e8c9b2",
      "slug": "admirals-cup-ac-one",
      "label": "Admiral's Cup AC-One",
      "created_at": "2025-06-07 18:04:01.679525+00",
      "popular": false
    },
    {
      "id": "14c15787-3efd-4101-a91d-eff31b2bc091",
      "brand_id": "a9cfdd75-047e-4119-8db8-e33744e8c9b2",
      "slug": "admirals-cup-challenger",
      "label": "Admiral's Cup Challenger",
      "created_at": "2025-06-07 18:04:01.679525+00",
      "popular": false
    },
    {
      "id": "f35f1092-6f76-40e9-956e-12b863b680a0",
      "brand_id": "a9cfdd75-047e-4119-8db8-e33744e8c9b2",
      "slug": "admirals-cup-competition-40",
      "label": "Admiral's Cup Competition 40",
      "created_at": "2025-06-07 18:04:01.679525+00",
      "popular": false
    },
    {
      "id": "70826119-8d3b-4653-b355-548c5e9e7257",
      "brand_id": "a9cfdd75-047e-4119-8db8-e33744e8c9b2",
      "slug": "admirals-cup-competition-48",
      "label": "Admiral's Cup Competition 48",
      "created_at": "2025-06-07 18:04:01.679525+00",
      "popular": false
    },
    {
      "id": "9b00e821-4502-4a9e-9574-067ab619e659",
      "brand_id": "a9cfdd75-047e-4119-8db8-e33744e8c9b2",
      "slug": "admirals-cup-gmt-44",
      "label": "Admiral's Cup GMT 44",
      "created_at": "2025-06-07 18:04:01.679525+00",
      "popular": false
    },
    {
      "id": "33f1f139-9208-46a3-b19d-df0559445614",
      "brand_id": "a9cfdd75-047e-4119-8db8-e33744e8c9b2",
      "slug": "admirals-cup-leap-second-48",
      "label": "Admiral's Cup Leap Second 48",
      "created_at": "2025-06-07 18:04:01.679525+00",
      "popular": false
    },
    {
      "id": "36b9b905-715b-4a94-8a6b-1ca215f807e8",
      "brand_id": "a9cfdd75-047e-4119-8db8-e33744e8c9b2",
      "slug": "admirals-cup-legend-38",
      "label": "Admiral's Cup Legend 38",
      "created_at": "2025-06-07 18:04:01.679525+00",
      "popular": false
    },
    {
      "id": "0459abe1-3b48-4e54-b244-5770b22e2164",
      "brand_id": "a9cfdd75-047e-4119-8db8-e33744e8c9b2",
      "slug": "admirals-cup-legend-42",
      "label": "Admiral's Cup Legend 42",
      "created_at": "2025-06-07 18:04:01.679525+00",
      "popular": false
    },
    {
      "id": "44db19b1-4ac1-4e79-8928-4dc7b80f6bfc",
      "brand_id": "a9cfdd75-047e-4119-8db8-e33744e8c9b2",
      "slug": "admirals-cup-seafender-50-chrono-lhs",
      "label": "Admiral's Cup Seafender 50 Chrono LHS",
      "created_at": "2025-06-07 18:04:01.679525+00",
      "popular": false
    },
    {
      "id": "553efd87-2f71-4965-b9b5-d89001edaa37",
      "brand_id": "a9cfdd75-047e-4119-8db8-e33744e8c9b2",
      "slug": "admirals-cup-seafender-centro",
      "label": "Admiral's Cup Seafender Centro",
      "created_at": "2025-06-07 18:04:01.679525+00",
      "popular": false
    },
    {
      "id": "21577ccb-e9d8-4c80-ac40-d263d3a63dcf",
      "brand_id": "a9cfdd75-047e-4119-8db8-e33744e8c9b2",
      "slug": "admirals-cup-seafender-deep-hull",
      "label": "Admiral's Cup Seafender Deep Hull",
      "created_at": "2025-06-07 18:04:01.679525+00",
      "popular": false
    },
    {
      "id": "23de602b-2cf6-4f4b-ab1c-7d9adb1d0ab5",
      "brand_id": "a9cfdd75-047e-4119-8db8-e33744e8c9b2",
      "slug": "admirals-cup-seafender-tides-48",
      "label": "Admiral's Cup Seafender Tides 48",
      "created_at": "2025-06-07 18:04:01.679525+00",
      "popular": false
    },
    {
      "id": "7946c2c3-c167-4004-9aee-1d3f154372fe",
      "brand_id": "a9cfdd75-047e-4119-8db8-e33744e8c9b2",
      "slug": "bubble",
      "label": "Bubble",
      "created_at": "2025-06-07 18:04:01.679525+00",
      "popular": false
    },
    {
      "id": "c652a6de-34c9-4f1a-9332-5aeb5e808c07",
      "brand_id": "a9cfdd75-047e-4119-8db8-e33744e8c9b2",
      "slug": "buckingham",
      "label": "Buckingham",
      "created_at": "2025-06-07 18:04:01.679525+00",
      "popular": false
    },
    {
      "id": "42e3c5b8-e044-4f0c-a0ed-4f5afe7c892c",
      "brand_id": "a9cfdd75-047e-4119-8db8-e33744e8c9b2",
      "slug": "coin-watch",
      "label": "Coin Watch",
      "created_at": "2025-06-07 18:04:01.679525+00",
      "popular": false
    },
    {
      "id": "af838d91-020a-4ba4-8d09-2d38374eaa5a",
      "brand_id": "a9cfdd75-047e-4119-8db8-e33744e8c9b2",
      "slug": "golden-bridge",
      "label": "Golden Bridge",
      "created_at": "2025-06-07 18:04:01.679525+00",
      "popular": false
    },
    {
      "id": "520576ba-2724-4424-899a-bfe931de8d73",
      "brand_id": "a9cfdd75-047e-4119-8db8-e33744e8c9b2",
      "slug": "heritage",
      "label": "Heritage",
      "created_at": "2025-06-07 18:04:01.679525+00",
      "popular": false
    },
    {
      "id": "d9b0e097-6b8b-441d-80b9-1792ebfeccdd",
      "brand_id": "a9cfdd75-047e-4119-8db8-e33744e8c9b2",
      "slug": "miss-golden-bridge",
      "label": "Miss Golden Bridge",
      "created_at": "2025-06-07 18:04:01.679525+00",
      "popular": false
    },
    {
      "id": "83783363-2bf2-4c6d-8af3-a1a2ed2f1f14",
      "brand_id": "a9cfdd75-047e-4119-8db8-e33744e8c9b2",
      "slug": "romvlvs",
      "label": "Romvlvs",
      "created_at": "2025-06-07 18:04:01.679525+00",
      "popular": false
    },
    {
      "id": "9b32d3ba-daed-48e5-b570-7603fb74d29e",
      "brand_id": "a9cfdd75-047e-4119-8db8-e33744e8c9b2",
      "slug": "tabogan",
      "label": "Tabogan",
      "created_at": "2025-06-07 18:04:01.679525+00",
      "popular": false
    },
    {
      "id": "d7ade9fa-ef59-444d-b048-700271a68823",
      "brand_id": "a9cfdd75-047e-4119-8db8-e33744e8c9b2",
      "slug": "ti-bridge",
      "label": "Ti-Bridge",
      "created_at": "2025-06-07 18:04:01.679525+00",
      "popular": false
    },
    {
      "id": "289ba2ee-b2b8-4e12-8c40-06538f09eb0e",
      "brand_id": "a9cfdd75-047e-4119-8db8-e33744e8c9b2",
      "slug": "trapeze",
      "label": "Trapeze",
      "created_at": "2025-06-07 18:04:01.679525+00",
      "popular": false
    },
    {
      "id": "8b83b19f-7868-4fc4-bb68-0f89d9b254d7",
      "brand_id": "0cb1dc50-62e4-4f6f-b6e3-0ef43c6609f1",
      "slug": "challenge",
      "label": "Challenge",
      "created_at": "2025-06-07 18:04:01.679525+00",
      "popular": false
    },
    {
      "id": "594bf658-c9d5-4903-ac83-34daf286655c",
      "brand_id": "0cb1dc50-62e4-4f6f-b6e3-0ef43c6609f1",
      "slug": "challenge-r",
      "label": "Challenge-R",
      "created_at": "2025-06-07 18:04:01.679525+00",
      "popular": false
    },
    {
      "id": "4aaa6414-fae2-4ef5-8137-eb55dbf35e36",
      "brand_id": "0cb1dc50-62e4-4f6f-b6e3-0ef43c6609f1",
      "slug": "evosquare",
      "label": "Evosquare",
      "created_at": "2025-06-07 18:04:01.679525+00",
      "popular": false
    },
    {
      "id": "c8172951-8bf6-4e7f-bac2-364ac9ca6f00",
      "brand_id": "8ebb31e7-151c-49c6-b719-3d82f6294bd9",
      "slug": "casablanca",
      "label": "Casablanca",
      "created_at": "2025-06-07 18:04:01.679525+00",
      "popular": false
    },
    {
      "id": "935bd8ec-eea7-4597-8d1d-e7f4ea5a67d5",
      "brand_id": "8ebb31e7-151c-49c6-b719-3d82f6294bd9",
      "slug": "cintree-curvex",
      "label": "Cintrée Curvex",
      "created_at": "2025-06-07 18:04:01.679525+00",
      "popular": false
    },
    {
      "id": "077c45db-59b3-4a02-b50c-ade518411285",
      "brand_id": "8ebb31e7-151c-49c6-b719-3d82f6294bd9",
      "slug": "color-dreams",
      "label": "Color Dreams",
      "created_at": "2025-06-07 18:04:01.679525+00",
      "popular": false
    },
    {
      "id": "52b58a35-c35c-4ed7-9a38-b7b2c531c475",
      "brand_id": "8ebb31e7-151c-49c6-b719-3d82f6294bd9",
      "slug": "conquistador",
      "label": "Conquistador",
      "created_at": "2025-06-07 18:04:01.679525+00",
      "popular": false
    },
    {
      "id": "103f351c-219d-4ea3-9112-4f5740712be5",
      "brand_id": "8ebb31e7-151c-49c6-b719-3d82f6294bd9",
      "slug": "conquistador-cortez",
      "label": "Conquistador Cortez",
      "created_at": "2025-06-07 18:04:01.679525+00",
      "popular": false
    },
    {
      "id": "33090577-b7fc-43d2-8bc5-9125ecb40220",
      "brand_id": "8ebb31e7-151c-49c6-b719-3d82f6294bd9",
      "slug": "conquistador-gpg",
      "label": "Conquistador GPG",
      "created_at": "2025-06-07 18:04:01.679525+00",
      "popular": false
    },
    {
      "id": "96c2ac4e-423f-4972-981f-9798271f75d9",
      "brand_id": "8ebb31e7-151c-49c6-b719-3d82f6294bd9",
      "slug": "crazy-hours",
      "label": "Crazy Hours",
      "created_at": "2025-06-07 18:04:01.679525+00",
      "popular": false
    },
    {
      "id": "2a082886-32eb-432d-8e5a-deb4890227a2",
      "brand_id": "8ebb31e7-151c-49c6-b719-3d82f6294bd9",
      "slug": "double-mystery",
      "label": "Double Mystery",
      "created_at": "2025-06-07 18:04:01.679525+00",
      "popular": false
    },
    {
      "id": "4bd6b154-d2ec-4db7-ade7-c502118c4e7c",
      "brand_id": "8ebb31e7-151c-49c6-b719-3d82f6294bd9",
      "slug": "evolution",
      "label": "Evolution",
      "created_at": "2025-06-07 18:04:01.679525+00",
      "popular": false
    },
    {
      "id": "b4714b6d-8aea-4db1-b831-92babf669744",
      "brand_id": "8ebb31e7-151c-49c6-b719-3d82f6294bd9",
      "slug": "heart",
      "label": "Heart",
      "created_at": "2025-06-07 18:04:01.679525+00",
      "popular": false
    },
    {
      "id": "ed2fdab8-5849-4cc5-ad8c-771a8433dab8",
      "brand_id": "8ebb31e7-151c-49c6-b719-3d82f6294bd9",
      "slug": "long-island",
      "label": "Long Island",
      "created_at": "2025-06-07 18:04:01.679525+00",
      "popular": false
    },
    {
      "id": "176b167a-63b4-4838-b2d2-50323fbf2546",
      "brand_id": "8ebb31e7-151c-49c6-b719-3d82f6294bd9",
      "slug": "mariner",
      "label": "Mariner",
      "created_at": "2025-06-07 18:04:01.928923+00",
      "popular": false
    },
    {
      "id": "c6c7652b-1a6a-4fcd-9fe8-d6ecc7e4804e",
      "brand_id": "8ebb31e7-151c-49c6-b719-3d82f6294bd9",
      "slug": "master-banker",
      "label": "Master Banker",
      "created_at": "2025-06-07 18:04:01.928923+00",
      "popular": false
    },
    {
      "id": "05d47407-840e-4804-a2b3-292b1c1617eb",
      "brand_id": "8ebb31e7-151c-49c6-b719-3d82f6294bd9",
      "slug": "master-square",
      "label": "Master Square",
      "created_at": "2025-06-07 18:04:01.928923+00",
      "popular": false
    },
    {
      "id": "4c95e91d-0c6a-4411-88bf-c39b419967f2",
      "brand_id": "8ebb31e7-151c-49c6-b719-3d82f6294bd9",
      "slug": "secret-hours",
      "label": "Secret Hours",
      "created_at": "2025-06-07 18:04:01.928923+00",
      "popular": false
    },
    {
      "id": "fa75790f-11c1-4165-aa86-59778cc3b011",
      "brand_id": "8ebb31e7-151c-49c6-b719-3d82f6294bd9",
      "slug": "vanguard",
      "label": "Vanguard",
      "created_at": "2025-06-07 18:04:01.928923+00",
      "popular": false
    },
    {
      "id": "7e9965e1-1f0c-4edb-84f8-c61ba047b205",
      "brand_id": "8ebb31e7-151c-49c6-b719-3d82f6294bd9",
      "slug": "vegas",
      "label": "Vegas",
      "created_at": "2025-06-07 18:04:01.928923+00",
      "popular": false
    },
    {
      "id": "be8eef8d-eff2-49c0-a55b-1c0f9153ac82",
      "brand_id": "5cc76394-ecb4-4e13-ab35-f0bacd8b10df",
      "slug": "julius-assmann",
      "label": "Julius Assmann",
      "created_at": "2025-06-07 18:04:01.928923+00",
      "popular": false
    },
    {
      "id": "4d47db7d-e4dc-467f-a49d-da83a930e2f7",
      "brand_id": "5cc76394-ecb4-4e13-ab35-f0bacd8b10df",
      "slug": "lady",
      "label": "Lady",
      "created_at": "2025-06-07 18:04:01.928923+00",
      "popular": false
    },
    {
      "id": "a554831c-b079-4702-9fa6-dea1c8a565f9",
      "brand_id": "5cc76394-ecb4-4e13-ab35-f0bacd8b10df",
      "slug": "lady-serenade",
      "label": "Lady Serenade",
      "created_at": "2025-06-07 18:04:01.928923+00",
      "popular": false
    },
    {
      "id": "90449dab-5bc3-47ac-bf10-db8e574b8776",
      "brand_id": "5cc76394-ecb4-4e13-ab35-f0bacd8b10df",
      "slug": "panograph",
      "label": "PanoGraph",
      "created_at": "2025-06-07 18:04:01.928923+00",
      "popular": false
    },
    {
      "id": "73b2554b-cb82-413e-9f1f-790684a68f4b",
      "brand_id": "5cc76394-ecb4-4e13-ab35-f0bacd8b10df",
      "slug": "panoinverse",
      "label": "PanoInverse",
      "created_at": "2025-06-07 18:04:01.928923+00",
      "popular": false
    },
    {
      "id": "4ede0229-1032-4ed3-8a0f-12169e7f4e64",
      "brand_id": "5cc76394-ecb4-4e13-ab35-f0bacd8b10df",
      "slug": "panoinverse-xl",
      "label": "PanoInverse XL",
      "created_at": "2025-06-07 18:04:01.928923+00",
      "popular": false
    },
    {
      "id": "4ec3c4fd-d2d9-421e-a976-9a5510f744e3",
      "brand_id": "5cc76394-ecb4-4e13-ab35-f0bacd8b10df",
      "slug": "panolunar-tourbillon",
      "label": "PanoLunar Tourbillon",
      "created_at": "2025-06-07 18:04:01.928923+00",
      "popular": false
    },
    {
      "id": "7b5dc57e-dac0-4704-a6aa-9a1d0084df46",
      "brand_id": "5cc76394-ecb4-4e13-ab35-f0bacd8b10df",
      "slug": "panomatic",
      "label": "PanoMatic",
      "created_at": "2025-06-07 18:04:01.928923+00",
      "popular": false
    },
    {
      "id": "ad844c22-7c61-4156-b7cd-a10fee32e4cf",
      "brand_id": "5cc76394-ecb4-4e13-ab35-f0bacd8b10df",
      "slug": "panomaticcentral-xl",
      "label": "PanoMaticCentral XL",
      "created_at": "2025-06-07 18:04:01.928923+00",
      "popular": false
    },
    {
      "id": "70782188-222d-433c-9477-67c6a378b951",
      "brand_id": "5cc76394-ecb4-4e13-ab35-f0bacd8b10df",
      "slug": "panomaticchrono",
      "label": "PanoMaticChrono",
      "created_at": "2025-06-07 18:04:01.928923+00",
      "popular": false
    },
    {
      "id": "80461a14-a93e-42d0-a6fa-2da74a08ab6a",
      "brand_id": "5cc76394-ecb4-4e13-ab35-f0bacd8b10df",
      "slug": "panomaticchrono-xl",
      "label": "PanoMaticChrono XL",
      "created_at": "2025-06-07 18:04:01.928923+00",
      "popular": false
    },
    {
      "id": "54634811-0143-4207-b927-02cb17417726",
      "brand_id": "5cc76394-ecb4-4e13-ab35-f0bacd8b10df",
      "slug": "panomaticdate",
      "label": "PanoMaticDate",
      "created_at": "2025-06-07 18:04:01.928923+00",
      "popular": false
    },
    {
      "id": "676dbb38-2be8-4780-b184-79a01beee101",
      "brand_id": "5cc76394-ecb4-4e13-ab35-f0bacd8b10df",
      "slug": "panomaticinverse",
      "label": "PanoMaticInverse",
      "created_at": "2025-06-07 18:04:01.928923+00",
      "popular": false
    },
    {
      "id": "9d848072-b52a-4bd7-a9dc-cd9bc6d906e6",
      "brand_id": "5cc76394-ecb4-4e13-ab35-f0bacd8b10df",
      "slug": "panomaticluna",
      "label": "PanoMaticLuna",
      "created_at": "2025-06-07 18:04:01.928923+00",
      "popular": false
    },
    {
      "id": "b20d9bef-100d-408a-ba23-786af084b0f8",
      "brand_id": "5cc76394-ecb4-4e13-ab35-f0bacd8b10df",
      "slug": "panomaticlunar",
      "label": "PanoMaticLunar",
      "created_at": "2025-06-07 18:04:01.928923+00",
      "popular": false
    },
    {
      "id": "5840e8f0-399b-4674-86ee-86a3c517343d",
      "brand_id": "5cc76394-ecb4-4e13-ab35-f0bacd8b10df",
      "slug": "panomaticlunar-xl",
      "label": "PanoMaticLunar XL",
      "created_at": "2025-06-07 18:04:01.928923+00",
      "popular": false
    },
    {
      "id": "4c0a4e14-8635-40bf-b131-a04c78cd5151",
      "brand_id": "5cc76394-ecb4-4e13-ab35-f0bacd8b10df",
      "slug": "panoreserve",
      "label": "PanoReserve",
      "created_at": "2025-06-07 18:04:01.928923+00",
      "popular": false
    },
    {
      "id": "6db95b36-ab33-412a-ae00-7e9b05a67ca9",
      "brand_id": "5cc76394-ecb4-4e13-ab35-f0bacd8b10df",
      "slug": "panoreserve-xl",
      "label": "PanoReserve XL",
      "created_at": "2025-06-07 18:04:01.928923+00",
      "popular": false
    },
    {
      "id": "cae3a292-77fe-4b5a-943d-68af74d3b743",
      "brand_id": "5cc76394-ecb4-4e13-ab35-f0bacd8b10df",
      "slug": "panotourbillon",
      "label": "PanoTourbillon",
      "created_at": "2025-06-07 18:04:01.928923+00",
      "popular": false
    },
    {
      "id": "36b72e90-00f6-4f5f-9c19-d3c75425c175",
      "brand_id": "5cc76394-ecb4-4e13-ab35-f0bacd8b10df",
      "slug": "panovenue",
      "label": "PanoVenue",
      "created_at": "2025-06-07 18:04:01.928923+00",
      "popular": false
    },
    {
      "id": "66e90c6d-2ef7-4d75-bc15-c545d3102ed0",
      "brand_id": "5cc76394-ecb4-4e13-ab35-f0bacd8b10df",
      "slug": "panoretrograph",
      "label": "PanoRetroGraph",
      "created_at": "2025-06-07 18:04:01.928923+00",
      "popular": false
    },
    {
      "id": "88176ba2-193f-4915-b217-0db4b63ab196",
      "brand_id": "5cc76394-ecb4-4e13-ab35-f0bacd8b10df",
      "slug": "pavonina",
      "label": "Pavonina",
      "created_at": "2025-06-07 18:04:01.928923+00",
      "popular": false
    },
    {
      "id": "676b668e-6a16-4234-ae8b-ebb0a4e77dc7",
      "brand_id": "2d1e9e98-9c4d-43d5-bbf0-19e0a3b692f7",
      "slug": "elegance-collection",
      "label": "Elegance Collection",
      "created_at": "2025-06-07 18:04:01.928923+00",
      "popular": false
    },
    {
      "id": "60f75d79-39ea-4145-b7d3-2c947ebd3d6c",
      "brand_id": "2d1e9e98-9c4d-43d5-bbf0-19e0a3b692f7",
      "slug": "evolution-9-collection",
      "label": "Evolution 9 Collection",
      "created_at": "2025-06-07 18:04:01.928923+00",
      "popular": false
    },
    {
      "id": "cf43d9e2-9b6e-463c-9a4e-4b6ef8cb8745",
      "brand_id": "2d1e9e98-9c4d-43d5-bbf0-19e0a3b692f7",
      "slug": "heritage-collection",
      "label": "Heritage Collection",
      "created_at": "2025-06-07 18:04:01.928923+00",
      "popular": false
    },
    {
      "id": "490d19b5-6f60-4895-86a6-57fdead6fab8",
      "brand_id": "2d1e9e98-9c4d-43d5-bbf0-19e0a3b692f7",
      "slug": "masterpiece-collection",
      "label": "Masterpiece Collection",
      "created_at": "2025-06-07 18:04:01.928923+00",
      "popular": false
    },
    {
      "id": "4313d85a-b1bb-4e0c-802b-2e3b94e011f2",
      "brand_id": "2d1e9e98-9c4d-43d5-bbf0-19e0a3b692f7",
      "slug": "sport-collection",
      "label": "Sport Collection",
      "created_at": "2025-06-07 18:04:01.928923+00",
      "popular": false
    },
    {
      "id": "3561dde1-7695-4b33-96a0-067db02f45a4",
      "brand_id": "618c6a35-ccb5-4aff-877e-c48b2101103a",
      "slug": "endeavour",
      "label": "Endeavour",
      "created_at": "2025-06-07 18:04:01.928923+00",
      "popular": false
    },
    {
      "id": "55fb5933-6183-4610-9b35-e6b715caf203",
      "brand_id": "618c6a35-ccb5-4aff-877e-c48b2101103a",
      "slug": "henry-double-spring",
      "label": "Henry Double Spring",
      "created_at": "2025-06-07 18:04:01.928923+00",
      "popular": false
    },
    {
      "id": "2ec901d1-1dc4-4dcf-a3ff-4af6c5dad7e2",
      "brand_id": "618c6a35-ccb5-4aff-877e-c48b2101103a",
      "slug": "venturer",
      "label": "Venturer",
      "created_at": "2025-06-07 18:04:01.928923+00",
      "popular": false
    },
    {
      "id": "18047dbf-4163-4f45-ac57-f5fa04741bf3",
      "brand_id": "bb6d9e72-c952-4489-b218-a9f57fdcf8db",
      "slug": "big-bang-38-mm",
      "label": "Big Bang 38 mm",
      "created_at": "2025-06-07 18:04:01.928923+00",
      "popular": false
    },
    {
      "id": "9eb7a24b-0d3d-48e7-832d-58c1dfee50ed",
      "brand_id": "bb6d9e72-c952-4489-b218-a9f57fdcf8db",
      "slug": "big-bang-41-mm",
      "label": "Big Bang 41 mm",
      "created_at": "2025-06-07 18:04:01.928923+00",
      "popular": false
    },
    {
      "id": "53b8f48f-7296-4864-b061-a435364b5e70",
      "brand_id": "bb6d9e72-c952-4489-b218-a9f57fdcf8db",
      "slug": "big-bang-44-mm",
      "label": "Big Bang 44 mm",
      "created_at": "2025-06-07 18:04:01.928923+00",
      "popular": false
    },
    {
      "id": "07fbfa1d-386d-4446-be66-4dd88fc93f66",
      "brand_id": "bb6d9e72-c952-4489-b218-a9f57fdcf8db",
      "slug": "big-bang-aero-bang",
      "label": "Big Bang Aero Bang",
      "created_at": "2025-06-07 18:04:01.928923+00",
      "popular": false
    },
    {
      "id": "bd0c49b7-60a8-456a-8d65-a55496d5d7c3",
      "brand_id": "bb6d9e72-c952-4489-b218-a9f57fdcf8db",
      "slug": "big-bang-broderie",
      "label": "Big Bang Broderie",
      "created_at": "2025-06-07 18:04:01.928923+00",
      "popular": false
    },
    {
      "id": "ad944743-e075-4480-a27e-a2a3cf7f8626",
      "brand_id": "bb6d9e72-c952-4489-b218-a9f57fdcf8db",
      "slug": "big-bang-caviar",
      "label": "Big Bang Caviar",
      "created_at": "2025-06-07 18:04:01.928923+00",
      "popular": false
    },
    {
      "id": "6d31df39-2ef8-4e85-aed5-d382e25127ef",
      "brand_id": "bb6d9e72-c952-4489-b218-a9f57fdcf8db",
      "slug": "big-bang-ferrari",
      "label": "Big Bang Ferrari",
      "created_at": "2025-06-07 18:04:01.928923+00",
      "popular": false
    },
    {
      "id": "e4a2f0e0-e4b8-47e6-979e-468187ad2a5f",
      "brand_id": "bb6d9e72-c952-4489-b218-a9f57fdcf8db",
      "slug": "big-bang-jeans",
      "label": "Big Bang Jeans",
      "created_at": "2025-06-07 18:04:01.928923+00",
      "popular": false
    },
    {
      "id": "1cec7a29-ba77-4367-b523-183363ffc29c",
      "brand_id": "bb6d9e72-c952-4489-b218-a9f57fdcf8db",
      "slug": "big-bang-king",
      "label": "Big Bang King",
      "created_at": "2025-06-07 18:04:01.928923+00",
      "popular": false
    },
    {
      "id": "4da8f2db-f6d5-4ac7-bc01-a7cf9db217f8",
      "brand_id": "bb6d9e72-c952-4489-b218-a9f57fdcf8db",
      "slug": "big-bang-meca-10",
      "label": "Big Bang Meca-10",
      "created_at": "2025-06-07 18:04:01.928923+00",
      "popular": false
    },
    {
      "id": "f967fb67-9662-45ff-a9e1-ced4fd1d0af9",
      "brand_id": "bb6d9e72-c952-4489-b218-a9f57fdcf8db",
      "slug": "big-bang-pop-art",
      "label": "Big Bang Pop Art",
      "created_at": "2025-06-07 18:04:01.928923+00",
      "popular": false
    },
    {
      "id": "6af29633-c490-4cf0-9463-ebab18c89660",
      "brand_id": "bb6d9e72-c952-4489-b218-a9f57fdcf8db",
      "slug": "big-bang-sang-bleu",
      "label": "Big Bang Sang Bleu",
      "created_at": "2025-06-07 18:04:01.928923+00",
      "popular": false
    },
    {
      "id": "e00a0134-095d-4afb-9b4f-6dc16b5f79ac",
      "brand_id": "bb6d9e72-c952-4489-b218-a9f57fdcf8db",
      "slug": "big-bang-tutti-frutti",
      "label": "Big Bang Tutti Frutti",
      "created_at": "2025-06-07 18:04:01.928923+00",
      "popular": false
    },
    {
      "id": "c02d4168-feda-44b5-99f0-3317e534caf3",
      "brand_id": "bb6d9e72-c952-4489-b218-a9f57fdcf8db",
      "slug": "big-bang-unico",
      "label": "Big Bang Unico",
      "created_at": "2025-06-07 18:04:01.928923+00",
      "popular": false
    },
    {
      "id": "68ddb330-55fb-4f32-a0bb-2593e13d80a1",
      "brand_id": "bb6d9e72-c952-4489-b218-a9f57fdcf8db",
      "slug": "bigger-bang",
      "label": "Bigger Bang",
      "created_at": "2025-06-07 18:04:01.928923+00",
      "popular": false
    },
    {
      "id": "6bc8a992-eb14-4277-ad53-e14ad0ff5814",
      "brand_id": "bb6d9e72-c952-4489-b218-a9f57fdcf8db",
      "slug": "classic",
      "label": "Classic",
      "created_at": "2025-06-07 18:04:01.928923+00",
      "popular": false
    },
    {
      "id": "b2681da7-1957-4147-91e5-7f96c7784f15",
      "brand_id": "bb6d9e72-c952-4489-b218-a9f57fdcf8db",
      "slug": "classic-fusion-aerofusion",
      "label": "Classic Fusion Aerofusion",
      "created_at": "2025-06-07 18:04:01.928923+00",
      "popular": false
    },
    {
      "id": "48c06812-8984-47ff-8f10-cff5bc1cc3dd",
      "brand_id": "bb6d9e72-c952-4489-b218-a9f57fdcf8db",
      "slug": "classic-fusion-blue",
      "label": "Classic Fusion Blue",
      "created_at": "2025-06-07 18:04:01.928923+00",
      "popular": false
    },
    {
      "id": "4950c8b6-70c2-4af3-8ef4-3bf6079fd0d0",
      "brand_id": "bb6d9e72-c952-4489-b218-a9f57fdcf8db",
      "slug": "classic-fusion-chronograph",
      "label": "Classic Fusion Chronograph",
      "created_at": "2025-06-07 18:04:01.928923+00",
      "popular": false
    },
    {
      "id": "e37adb03-2a9e-48c7-ae5d-9f266900e082",
      "brand_id": "bb6d9e72-c952-4489-b218-a9f57fdcf8db",
      "slug": "classic-fusion-quartz",
      "label": "Classic Fusion Quartz",
      "created_at": "2025-06-07 18:04:01.928923+00",
      "popular": false
    },
    {
      "id": "166db565-2ff7-4709-8332-916aa2476bca",
      "brand_id": "bb6d9e72-c952-4489-b218-a9f57fdcf8db",
      "slug": "classic-fusion-racing-grey",
      "label": "Classic Fusion Racing Grey",
      "created_at": "2025-06-07 18:04:01.928923+00",
      "popular": false
    },
    {
      "id": "df95b451-a60c-4163-acb9-4c581ee38896",
      "brand_id": "bb6d9e72-c952-4489-b218-a9f57fdcf8db",
      "slug": "classic-fusion-ultra-thin",
      "label": "Classic Fusion Ultra-Thin",
      "created_at": "2025-06-07 18:04:01.928923+00",
      "popular": false
    },
    {
      "id": "e13c605c-6eba-49a0-bcf9-4c91155bbb35",
      "brand_id": "bb6d9e72-c952-4489-b218-a9f57fdcf8db",
      "slug": "elegant",
      "label": "Elegant",
      "created_at": "2025-06-07 18:04:01.928923+00",
      "popular": false
    },
    {
      "id": "203d940a-4f23-43f9-9fab-27c19da51259",
      "brand_id": "bb6d9e72-c952-4489-b218-a9f57fdcf8db",
      "slug": "king-power",
      "label": "King Power",
      "created_at": "2025-06-07 18:04:01.928923+00",
      "popular": false
    },
    {
      "id": "e79d9faf-9475-4965-837d-ac3010cf55cd",
      "brand_id": "bb6d9e72-c952-4489-b218-a9f57fdcf8db",
      "slug": "mp-05-laferrari",
      "label": "MP-05 LaFerrari",
      "created_at": "2025-06-07 18:04:01.928923+00",
      "popular": false
    },
    {
      "id": "de9802b0-642e-49a6-856d-db46d86c7fe9",
      "brand_id": "bb6d9e72-c952-4489-b218-a9f57fdcf8db",
      "slug": "mp-09",
      "label": "MP-09",
      "created_at": "2025-06-07 18:04:01.928923+00",
      "popular": false
    },
    {
      "id": "6f30ad97-c372-40af-8786-e3fb58d86ccd",
      "brand_id": "bb6d9e72-c952-4489-b218-a9f57fdcf8db",
      "slug": "square-bang",
      "label": "Square Bang",
      "created_at": "2025-06-07 18:04:01.928923+00",
      "popular": false
    },
    {
      "id": "18e8eb53-82ab-4399-8a4e-fd84bb3b5b41",
      "brand_id": "bb6d9e72-c952-4489-b218-a9f57fdcf8db",
      "slug": "super-b",
      "label": "Super B",
      "created_at": "2025-06-07 18:04:01.928923+00",
      "popular": false
    },
    {
      "id": "dcb46e7c-8421-4683-883c-49f0d426f79a",
      "brand_id": "bb6d9e72-c952-4489-b218-a9f57fdcf8db",
      "slug": "techframe-ferrari-tourbillon-chronograph",
      "label": "Techframe Ferrari Tourbillon Chronograph",
      "created_at": "2025-06-07 18:04:01.928923+00",
      "popular": false
    },
    {
      "id": "d744d148-c741-4ea4-8ff1-9c274b518b42",
      "brand_id": "4b528ab8-0b61-4a1a-bf17-3a936b57f424",
      "slug": "aquatimer-automatic",
      "label": "Aquatimer Automatic",
      "created_at": "2025-06-07 18:04:01.928923+00",
      "popular": false
    },
    {
      "id": "dc9ec3e9-4576-4045-b4c3-ebfa1369c075",
      "brand_id": "4b528ab8-0b61-4a1a-bf17-3a936b57f424",
      "slug": "aquatimer-automatic-2000",
      "label": "Aquatimer Automatic 2000",
      "created_at": "2025-06-07 18:04:01.928923+00",
      "popular": false
    },
    {
      "id": "f7e56a96-acfd-4177-acea-4827dad260bb",
      "brand_id": "4b528ab8-0b61-4a1a-bf17-3a936b57f424",
      "slug": "aquatimer-chronograph",
      "label": "Aquatimer Chronograph",
      "created_at": "2025-06-07 18:04:01.928923+00",
      "popular": false
    },
    {
      "id": "3d6e208d-c166-4ee2-9809-b8b90f7af33d",
      "brand_id": "4b528ab8-0b61-4a1a-bf17-3a936b57f424",
      "slug": "aquatimer-deep-three",
      "label": "Aquatimer Deep Three",
      "created_at": "2025-06-07 18:04:01.928923+00",
      "popular": false
    },
    {
      "id": "a2402455-19f2-4733-9714-cf5663362a62",
      "brand_id": "4b528ab8-0b61-4a1a-bf17-3a936b57f424",
      "slug": "aquatimer-deep-two",
      "label": "Aquatimer Deep Two",
      "created_at": "2025-06-07 18:04:01.928923+00",
      "popular": false
    },
    {
      "id": "c63b074c-31db-457f-986d-2563e7925eb9",
      "brand_id": "4b528ab8-0b61-4a1a-bf17-3a936b57f424",
      "slug": "aquatimer-perpetual-calendar-digital-date-month",
      "label": "Aquatimer Perpetual Calendar Digital Date-Month",
      "created_at": "2025-06-07 18:04:01.928923+00",
      "popular": false
    },
    {
      "id": "ef9fb32b-7137-4d1b-99f6-3e0f3ce02d65",
      "brand_id": "4b528ab8-0b61-4a1a-bf17-3a936b57f424",
      "slug": "big-ingenieur",
      "label": "Big Ingenieur",
      "created_at": "2025-06-07 18:04:01.928923+00",
      "popular": false
    },
    {
      "id": "ee4ed869-c07a-4386-9e21-4b93e0a799e5",
      "brand_id": "4b528ab8-0b61-4a1a-bf17-3a936b57f424",
      "slug": "big-ingenieur-chronograph",
      "label": "Big Ingenieur Chronograph",
      "created_at": "2025-06-07 18:04:01.928923+00",
      "popular": false
    },
    {
      "id": "602ca366-8c2e-4035-803d-3580d7ca7936",
      "brand_id": "4b528ab8-0b61-4a1a-bf17-3a936b57f424",
      "slug": "big-pilot",
      "label": "Big Pilot",
      "created_at": "2025-06-07 18:04:01.928923+00",
      "popular": false
    },
    {
      "id": "5bdc3bd0-cd21-4c01-ba85-bf070a501017",
      "brand_id": "4b528ab8-0b61-4a1a-bf17-3a936b57f424",
      "slug": "big-pilot-top-gun",
      "label": "Big Pilot Top Gun",
      "created_at": "2025-06-07 18:04:01.928923+00",
      "popular": false
    },
    {
      "id": "b4395aec-3f5a-484e-bfea-af51f177e26e",
      "brand_id": "4b528ab8-0b61-4a1a-bf17-3a936b57f424",
      "slug": "big-pilot-top-gun-miramar",
      "label": "Big Pilot Top Gun Miramar",
      "created_at": "2025-06-07 18:04:01.928923+00",
      "popular": false
    },
    {
      "id": "1566e555-4223-49ad-b4cc-b80fb2c03261",
      "brand_id": "4b528ab8-0b61-4a1a-bf17-3a936b57f424",
      "slug": "da-vinci-automatic",
      "label": "Da Vinci Automatic",
      "created_at": "2025-06-07 18:04:01.928923+00",
      "popular": false
    },
    {
      "id": "b9d99bed-088a-45ca-816d-e019b2d77694",
      "brand_id": "4b528ab8-0b61-4a1a-bf17-3a936b57f424",
      "slug": "da-vinci-chronograph",
      "label": "Da Vinci Chronograph",
      "created_at": "2025-06-07 18:04:01.928923+00",
      "popular": false
    },
    {
      "id": "07011c61-1796-4a23-afbe-8526970439af",
      "brand_id": "4b528ab8-0b61-4a1a-bf17-3a936b57f424",
      "slug": "da-vinci-perpetual-calendar",
      "label": "Da Vinci Perpetual Calendar",
      "created_at": "2025-06-07 18:04:01.928923+00",
      "popular": false
    },
    {
      "id": "62a301f1-4ee6-4be5-92d6-55ade84310d0",
      "brand_id": "4b528ab8-0b61-4a1a-bf17-3a936b57f424",
      "slug": "da-vinci-perpetual-calendar-digital-date-month",
      "label": "Da Vinci Perpetual Calendar Digital Date-Month",
      "created_at": "2025-06-07 18:04:01.928923+00",
      "popular": false
    },
    {
      "id": "5135ec54-a434-459a-be57-760b9e2b2130",
      "brand_id": "4b528ab8-0b61-4a1a-bf17-3a936b57f424",
      "slug": "grande-complication",
      "label": "Grande Complication",
      "created_at": "2025-06-07 18:04:01.928923+00",
      "popular": false
    },
    {
      "id": "2b717f54-c2b4-4da0-86f6-9bbde516d204",
      "brand_id": "4b528ab8-0b61-4a1a-bf17-3a936b57f424",
      "slug": "gst",
      "label": "GST",
      "created_at": "2025-06-07 18:04:01.928923+00",
      "popular": false
    },
    {
      "id": "8171f57f-6913-499c-a6f1-f2881a13c038",
      "brand_id": "4b528ab8-0b61-4a1a-bf17-3a936b57f424",
      "slug": "ingenieur-amg",
      "label": "Ingenieur AMG",
      "created_at": "2025-06-07 18:04:01.928923+00",
      "popular": false
    },
    {
      "id": "63708408-84df-4b38-b8bf-12e6af808470",
      "brand_id": "4b528ab8-0b61-4a1a-bf17-3a936b57f424",
      "slug": "ingenieur-automatic",
      "label": "Ingenieur Automatic",
      "created_at": "2025-06-07 18:04:01.928923+00",
      "popular": false
    },
    {
      "id": "c4633c01-86e3-4f25-902c-3541b49d8db4",
      "brand_id": "4b528ab8-0b61-4a1a-bf17-3a936b57f424",
      "slug": "ingenieur-chronograph",
      "label": "Ingenieur Chronograph",
      "created_at": "2025-06-07 18:04:01.928923+00",
      "popular": false
    },
    {
      "id": "135f6036-6086-4300-9be0-af94f7d703eb",
      "brand_id": "4b528ab8-0b61-4a1a-bf17-3a936b57f424",
      "slug": "ingenieur-chronograph-racer",
      "label": "Ingenieur Chronograph Racer",
      "created_at": "2025-06-07 18:04:01.928923+00",
      "popular": false
    },
    {
      "id": "ac6b8bb7-33e3-4450-864c-e0bbbf62c646",
      "brand_id": "4b528ab8-0b61-4a1a-bf17-3a936b57f424",
      "slug": "ingenieur-double-chronograph-titanium",
      "label": "Ingenieur Double Chronograph Titanium",
      "created_at": "2025-06-07 18:04:01.928923+00",
      "popular": false
    },
    {
      "id": "ee589220-3494-4e08-8651-83ca84b41382",
      "brand_id": "4b528ab8-0b61-4a1a-bf17-3a936b57f424",
      "slug": "ingenieur-dual-time",
      "label": "Ingenieur Dual Time",
      "created_at": "2025-06-07 18:04:01.928923+00",
      "popular": false
    },
    {
      "id": "f49838e5-899b-4d4a-8fda-e85ac684be4b",
      "brand_id": "4b528ab8-0b61-4a1a-bf17-3a936b57f424",
      "slug": "ingenieur-jumbo",
      "label": "Ingenieur Jumbo",
      "created_at": "2025-06-07 18:04:01.928923+00",
      "popular": false
    },
    {
      "id": "1d225274-85f3-49d3-ade8-6ef84579e24a",
      "brand_id": "4b528ab8-0b61-4a1a-bf17-3a936b57f424",
      "slug": "ingenieur-perpetual-calendar-digital-date-month",
      "label": "Ingenieur Perpetual Calendar Digital Date-Month",
      "created_at": "2025-06-07 18:04:01.928923+00",
      "popular": false
    },
    {
      "id": "271c4295-3a30-4ae8-a0a5-91c98b0f0266",
      "brand_id": "4b528ab8-0b61-4a1a-bf17-3a936b57f424",
      "slug": "novecento",
      "label": "Novecento",
      "created_at": "2025-06-07 18:04:01.928923+00",
      "popular": false
    },
    {
      "id": "eb350cb7-b51c-4056-9910-aff89a5ed159",
      "brand_id": "4b528ab8-0b61-4a1a-bf17-3a936b57f424",
      "slug": "pilot",
      "label": "Pilot",
      "created_at": "2025-06-07 18:04:01.928923+00",
      "popular": false
    },
    {
      "id": "aaab79e4-b62c-49fe-8459-4e720072e7ae",
      "brand_id": "4b528ab8-0b61-4a1a-bf17-3a936b57f424",
      "slug": "pilot-chronograph",
      "label": "Pilot Chronograph",
      "created_at": "2025-06-07 18:04:01.928923+00",
      "popular": false
    },
    {
      "id": "1a93f181-0dc5-4548-b6c2-2d7151a45b8a",
      "brand_id": "4b528ab8-0b61-4a1a-bf17-3a936b57f424",
      "slug": "pilot-chronograph-top-gun",
      "label": "Pilot Chronograph Top Gun",
      "created_at": "2025-06-07 18:04:02.184281+00",
      "popular": false
    },
    {
      "id": "2bba773c-fe71-48b8-a012-3bbf5a3397fa",
      "brand_id": "4b528ab8-0b61-4a1a-bf17-3a936b57f424",
      "slug": "pilot-chronograph-top-gun-miramar",
      "label": "Pilot Chronograph Top Gun Miramar",
      "created_at": "2025-06-07 18:04:02.184281+00",
      "popular": false
    },
    {
      "id": "a85af7c9-356f-45e4-91ca-6a1c6faca43a",
      "brand_id": "4b528ab8-0b61-4a1a-bf17-3a936b57f424",
      "slug": "pilot-double-chronograph",
      "label": "Pilot Double Chronograph",
      "created_at": "2025-06-07 18:04:02.184281+00",
      "popular": false
    },
    {
      "id": "1dbee6cc-6e81-4712-98f7-65005deb1b3b",
      "brand_id": "4b528ab8-0b61-4a1a-bf17-3a936b57f424",
      "slug": "pilot-mark",
      "label": "Pilot Mark",
      "created_at": "2025-06-07 18:04:02.184281+00",
      "popular": false
    },
    {
      "id": "af014895-d676-4a20-99a1-28d64f9db8eb",
      "brand_id": "4b528ab8-0b61-4a1a-bf17-3a936b57f424",
      "slug": "pilot-spitfire-chronograph",
      "label": "Pilot Spitfire Chronograph",
      "created_at": "2025-06-07 18:04:02.184281+00",
      "popular": false
    },
    {
      "id": "ee1dd822-9db0-41bb-be80-5165335a2a62",
      "brand_id": "4b528ab8-0b61-4a1a-bf17-3a936b57f424",
      "slug": "pilot-spitfire-perpetual-calendar-digital-date-month",
      "label": "Pilot Spitfire Perpetual Calendar Digital Date-Month",
      "created_at": "2025-06-07 18:04:02.184281+00",
      "popular": false
    },
    {
      "id": "70ce4daa-f70b-4b8b-a8b1-007ee0f6fbae",
      "brand_id": "4b528ab8-0b61-4a1a-bf17-3a936b57f424",
      "slug": "pilot-spitfire-utc",
      "label": "Pilot Spitfire UTC",
      "created_at": "2025-06-07 18:04:02.184281+00",
      "popular": false
    },
    {
      "id": "3e5f36c7-db11-429a-b000-f60413795666",
      "brand_id": "4b528ab8-0b61-4a1a-bf17-3a936b57f424",
      "slug": "pilot-timezoner",
      "label": "Pilot Timezoner",
      "created_at": "2025-06-07 18:04:02.184281+00",
      "popular": false
    },
    {
      "id": "a44cbf1e-ece4-4b5b-bf80-ad4e01c0a1e1",
      "brand_id": "4b528ab8-0b61-4a1a-bf17-3a936b57f424",
      "slug": "pilot-worldtimer",
      "label": "Pilot Worldtimer",
      "created_at": "2025-06-07 18:04:02.184281+00",
      "popular": false
    },
    {
      "id": "004a2ed3-a243-421b-8acc-949a5d287cf1",
      "brand_id": "4b528ab8-0b61-4a1a-bf17-3a936b57f424",
      "slug": "porsche-design",
      "label": "Porsche Design",
      "created_at": "2025-06-07 18:04:02.184281+00",
      "popular": false
    },
    {
      "id": "ffa91cea-d9c5-43d1-979e-6581bee7cb4b",
      "brand_id": "4b528ab8-0b61-4a1a-bf17-3a936b57f424",
      "slug": "portofino-automatic",
      "label": "Portofino Automatic",
      "created_at": "2025-06-07 18:04:02.184281+00",
      "popular": false
    },
    {
      "id": "1a86d663-70d6-43b9-b5be-f3825cc46636",
      "brand_id": "4b528ab8-0b61-4a1a-bf17-3a936b57f424",
      "slug": "portofino-chronograph",
      "label": "Portofino Chronograph",
      "created_at": "2025-06-07 18:04:02.184281+00",
      "popular": false
    },
    {
      "id": "d99fb6a9-206d-4f90-a207-537f54435f4b",
      "brand_id": "4b528ab8-0b61-4a1a-bf17-3a936b57f424",
      "slug": "portofino-hand-wound",
      "label": "Portofino Hand-Wound",
      "created_at": "2025-06-07 18:04:02.184281+00",
      "popular": false
    },
    {
      "id": "d43504a0-640c-49d2-8abe-ce5a8a02ceab",
      "brand_id": "4b528ab8-0b61-4a1a-bf17-3a936b57f424",
      "slug": "portuguese",
      "label": "Portuguese",
      "created_at": "2025-06-07 18:04:02.184281+00",
      "popular": false
    },
    {
      "id": "7b6c1d68-40e1-4e04-9bad-58fa45215569",
      "brand_id": "4b528ab8-0b61-4a1a-bf17-3a936b57f424",
      "slug": "portuguese-annual-calendar",
      "label": "Portuguese Annual Calendar",
      "created_at": "2025-06-07 18:04:02.184281+00",
      "popular": false
    },
    {
      "id": "537675f0-dd29-49cc-8e1e-081b6785203c",
      "brand_id": "4b528ab8-0b61-4a1a-bf17-3a936b57f424",
      "slug": "portuguese-automatic",
      "label": "Portuguese Automatic",
      "created_at": "2025-06-07 18:04:02.184281+00",
      "popular": false
    },
    {
      "id": "0424e5c5-601f-45f4-9c34-002e99f8b807",
      "brand_id": "4b528ab8-0b61-4a1a-bf17-3a936b57f424",
      "slug": "portuguese-chronograph",
      "label": "Portuguese Chronograph",
      "created_at": "2025-06-07 18:04:02.184281+00",
      "popular": false
    },
    {
      "id": "7dd49793-64b0-4aca-bd50-e5e1e9b87ffa",
      "brand_id": "4b528ab8-0b61-4a1a-bf17-3a936b57f424",
      "slug": "portuguese-grande-complication",
      "label": "Portuguese Grande Complication",
      "created_at": "2025-06-07 18:04:02.184281+00",
      "popular": false
    },
    {
      "id": "6d438af4-9f3a-44b4-9bdb-11337c589d56",
      "brand_id": "4b528ab8-0b61-4a1a-bf17-3a936b57f424",
      "slug": "portuguese-hand-wound",
      "label": "Portuguese Hand-Wound",
      "created_at": "2025-06-07 18:04:02.184281+00",
      "popular": false
    },
    {
      "id": "57f266bc-1f07-4249-998e-aa62d7b9debe",
      "brand_id": "4b528ab8-0b61-4a1a-bf17-3a936b57f424",
      "slug": "portuguese-minute-repeater",
      "label": "Portuguese Minute Repeater",
      "created_at": "2025-06-07 18:04:02.184281+00",
      "popular": false
    },
    {
      "id": "35608002-4ad2-44b0-905f-e02565a7b068",
      "brand_id": "4b528ab8-0b61-4a1a-bf17-3a936b57f424",
      "slug": "portuguese-perpetual-calendar",
      "label": "Portuguese Perpetual Calendar",
      "created_at": "2025-06-07 18:04:02.184281+00",
      "popular": false
    },
    {
      "id": "92ae65f0-4eb5-4b22-8b13-766a5871e147",
      "brand_id": "4b528ab8-0b61-4a1a-bf17-3a936b57f424",
      "slug": "portuguese-perpetual-calendar-digital-date-month",
      "label": "Portuguese Perpetual Calendar Digital Date-Month",
      "created_at": "2025-06-07 18:04:02.184281+00",
      "popular": false
    },
    {
      "id": "a6e910ea-4191-48f3-b322-81e30f7685ff",
      "brand_id": "4b528ab8-0b61-4a1a-bf17-3a936b57f424",
      "slug": "portuguese-tourbillon",
      "label": "Portuguese Tourbillon",
      "created_at": "2025-06-07 18:04:02.184281+00",
      "popular": false
    },
    {
      "id": "0bf99a72-3f75-4839-bfcd-647b78cf89ec",
      "brand_id": "4b528ab8-0b61-4a1a-bf17-3a936b57f424",
      "slug": "portuguese-yacht-club-chronograph",
      "label": "Portuguese Yacht Club Chronograph",
      "created_at": "2025-06-07 18:04:02.184281+00",
      "popular": false
    },
    {
      "id": "81fe8970-a984-4244-933c-5c18caedde2e",
      "brand_id": "4b528ab8-0b61-4a1a-bf17-3a936b57f424",
      "slug": "yacht-club",
      "label": "Yacht Club",
      "created_at": "2025-06-07 18:04:02.184281+00",
      "popular": false
    },
    {
      "id": "4705b5d3-9180-4fb8-8c6b-12473b70d34a",
      "brand_id": "267fb859-934a-47ad-b030-d6cdc3666c50",
      "slug": "albatros",
      "label": "Albatros",
      "created_at": "2025-06-07 18:04:02.184281+00",
      "popular": false
    },
    {
      "id": "f5b9d873-eb59-459a-9fe6-7d4753c41096",
      "brand_id": "267fb859-934a-47ad-b030-d6cdc3666c50",
      "slug": "amvox",
      "label": "AMVOX",
      "created_at": "2025-06-07 18:04:02.184281+00",
      "popular": false
    },
    {
      "id": "6725b404-1cfb-450c-9fb3-7491c157175b",
      "brand_id": "267fb859-934a-47ad-b030-d6cdc3666c50",
      "slug": "deep-sea",
      "label": "Deep Sea",
      "created_at": "2025-06-07 18:04:02.184281+00",
      "popular": false
    },
    {
      "id": "9c66e185-3bae-4248-a93a-d4a655b54ea5",
      "brand_id": "267fb859-934a-47ad-b030-d6cdc3666c50",
      "slug": "deep-sea-chronograph",
      "label": "Deep Sea Chronograph",
      "created_at": "2025-06-07 18:04:02.184281+00",
      "popular": false
    },
    {
      "id": "31223b0d-276f-406e-a402-31ae036fd604",
      "brand_id": "267fb859-934a-47ad-b030-d6cdc3666c50",
      "slug": "duometre",
      "label": "Duomètre",
      "created_at": "2025-06-07 18:04:02.184281+00",
      "popular": false
    },
    {
      "id": "7aaf1fdf-8aa7-4f5f-8a7d-8ff3cc3d8d86",
      "brand_id": "267fb859-934a-47ad-b030-d6cdc3666c50",
      "slug": "geophysic",
      "label": "Geophysic",
      "created_at": "2025-06-07 18:04:02.184281+00",
      "popular": false
    },
    {
      "id": "e478f1d6-1088-44df-8d88-4fcd5f3a1a2d",
      "brand_id": "267fb859-934a-47ad-b030-d6cdc3666c50",
      "slug": "geophysic-1958",
      "label": "Geophysic 1958",
      "created_at": "2025-06-07 18:04:02.184281+00",
      "popular": false
    },
    {
      "id": "0045bfa6-c3c9-44e2-bc70-8a90da212b91",
      "brand_id": "267fb859-934a-47ad-b030-d6cdc3666c50",
      "slug": "geophysic-true-second",
      "label": "Geophysic True Second",
      "created_at": "2025-06-07 18:04:02.184281+00",
      "popular": false
    },
    {
      "id": "f5c4ed11-0ed1-4975-b209-8cd714a90f77",
      "brand_id": "267fb859-934a-47ad-b030-d6cdc3666c50",
      "slug": "geophysic-universal-time",
      "label": "Geophysic Universal Time",
      "created_at": "2025-06-07 18:04:02.184281+00",
      "popular": false
    },
    {
      "id": "aa6ff2d8-a9a9-47b2-82b8-aefffd646bc2",
      "brand_id": "267fb859-934a-47ad-b030-d6cdc3666c50",
      "slug": "grande-reverso",
      "label": "Grande Reverso",
      "created_at": "2025-06-07 18:04:02.184281+00",
      "popular": false
    },
    {
      "id": "4352f5f0-e022-46e8-a110-75ac528a2222",
      "brand_id": "267fb859-934a-47ad-b030-d6cdc3666c50",
      "slug": "grande-reverso-976",
      "label": "Grande Reverso 976",
      "created_at": "2025-06-07 18:04:02.184281+00",
      "popular": false
    },
    {
      "id": "87ca1d9f-a377-4b88-a9cc-aa9b3a184085",
      "brand_id": "267fb859-934a-47ad-b030-d6cdc3666c50",
      "slug": "grande-reverso-calendar",
      "label": "Grande Reverso Calendar",
      "created_at": "2025-06-07 18:04:02.184281+00",
      "popular": false
    },
    {
      "id": "e82e62f1-04e5-496d-b34f-f359f3907a2d",
      "brand_id": "267fb859-934a-47ad-b030-d6cdc3666c50",
      "slug": "grande-reverso-duo",
      "label": "Grande Reverso Duo",
      "created_at": "2025-06-07 18:04:02.184281+00",
      "popular": false
    },
    {
      "id": "cbb75c6a-cada-4162-9037-d2b99160a7a1",
      "brand_id": "267fb859-934a-47ad-b030-d6cdc3666c50",
      "slug": "grande-reverso-lady-ultra-thin",
      "label": "Grande Reverso Lady Ultra Thin",
      "created_at": "2025-06-07 18:04:02.184281+00",
      "popular": false
    },
    {
      "id": "d9fea739-3e2e-4524-8b98-3402fd3908f2",
      "brand_id": "267fb859-934a-47ad-b030-d6cdc3666c50",
      "slug": "grande-reverso-lady-ultra-thin-duetto-duo",
      "label": "Grande Reverso Lady Ultra Thin Duetto Duo",
      "created_at": "2025-06-07 18:04:02.184281+00",
      "popular": false
    },
    {
      "id": "18de30d9-5f4c-4fcc-b876-facb64d11df4",
      "brand_id": "267fb859-934a-47ad-b030-d6cdc3666c50",
      "slug": "grande-reverso-night-and-day",
      "label": "Grande Reverso Night & Day",
      "created_at": "2025-06-07 18:04:02.184281+00",
      "popular": false
    },
    {
      "id": "d5a35989-66ed-423f-abb3-b00f8f3c7c47",
      "brand_id": "267fb859-934a-47ad-b030-d6cdc3666c50",
      "slug": "grande-reverso-ultra-thin",
      "label": "Grande Reverso Ultra Thin",
      "created_at": "2025-06-07 18:04:02.184281+00",
      "popular": false
    },
    {
      "id": "aaa4947f-177f-4b0f-97d9-0f5b75634312",
      "brand_id": "267fb859-934a-47ad-b030-d6cdc3666c50",
      "slug": "grande-reverso-ultra-thin-1931",
      "label": "Grande Reverso Ultra Thin 1931",
      "created_at": "2025-06-07 18:04:02.184281+00",
      "popular": false
    },
    {
      "id": "4664f4a1-00a5-408e-bced-9c70156555fd",
      "brand_id": "267fb859-934a-47ad-b030-d6cdc3666c50",
      "slug": "grande-reverso-ultra-thin-duoface",
      "label": "Grande Reverso Ultra Thin Duoface",
      "created_at": "2025-06-07 18:04:02.184281+00",
      "popular": false
    },
    {
      "id": "1945538c-4256-4c39-b6b1-d3b22d5694ad",
      "brand_id": "267fb859-934a-47ad-b030-d6cdc3666c50",
      "slug": "ideale",
      "label": "Idéale",
      "created_at": "2025-06-07 18:04:02.184281+00",
      "popular": false
    },
    {
      "id": "97a1b509-5448-4470-8bef-d93080823f4a",
      "brand_id": "267fb859-934a-47ad-b030-d6cdc3666c50",
      "slug": "master-calendar",
      "label": "Master Calendar",
      "created_at": "2025-06-07 18:04:02.184281+00",
      "popular": false
    },
    {
      "id": "e14ddec7-6123-4618-9247-b587228e46f6",
      "brand_id": "267fb859-934a-47ad-b030-d6cdc3666c50",
      "slug": "master-chronograph",
      "label": "Master Chronograph",
      "created_at": "2025-06-07 18:04:02.184281+00",
      "popular": false
    },
    {
      "id": "927b8a73-724d-4a4e-aa49-b659bd9fb649",
      "brand_id": "267fb859-934a-47ad-b030-d6cdc3666c50",
      "slug": "master-compressor",
      "label": "Master Compressor",
      "created_at": "2025-06-07 18:04:02.184281+00",
      "popular": false
    },
    {
      "id": "1c99c3ef-16c6-4b0c-94f2-e6d5cbdeafa7",
      "brand_id": "267fb859-934a-47ad-b030-d6cdc3666c50",
      "slug": "master-compressor-chronograph",
      "label": "Master Compressor Chronograph",
      "created_at": "2025-06-07 18:04:02.184281+00",
      "popular": false
    },
    {
      "id": "1ffa6726-44de-49e0-8dfa-95379929dc85",
      "brand_id": "267fb859-934a-47ad-b030-d6cdc3666c50",
      "slug": "master-compressor-chronograph-2",
      "label": "Master Compressor Chronograph 2",
      "created_at": "2025-06-07 18:04:02.184281+00",
      "popular": false
    },
    {
      "id": "64d082c8-1889-42e7-a332-7369a4e19c9a",
      "brand_id": "267fb859-934a-47ad-b030-d6cdc3666c50",
      "slug": "master-compressor-chronograph-ceramic",
      "label": "Master Compressor Chronograph Ceramic",
      "created_at": "2025-06-07 18:04:02.184281+00",
      "popular": false
    },
    {
      "id": "a3ce04a8-941f-404f-9998-929a1855fa9d",
      "brand_id": "267fb859-934a-47ad-b030-d6cdc3666c50",
      "slug": "master-compressor-diving",
      "label": "Master Compressor Diving",
      "created_at": "2025-06-07 18:04:02.184281+00",
      "popular": false
    },
    {
      "id": "18578f60-d8e8-4cac-a77d-4c69ef413a66",
      "brand_id": "267fb859-934a-47ad-b030-d6cdc3666c50",
      "slug": "master-compressor-diving-alarm-navy-seals",
      "label": "Master Compressor Diving Alarm Navy SEALs",
      "created_at": "2025-06-07 18:04:02.184281+00",
      "popular": false
    },
    {
      "id": "f6ba5038-a17b-4a9d-b8a8-8abded89223f",
      "brand_id": "267fb859-934a-47ad-b030-d6cdc3666c50",
      "slug": "master-compressor-diving-automatic-navy-seals",
      "label": "Master Compressor Diving Automatic Navy SEALs",
      "created_at": "2025-06-07 18:04:02.184281+00",
      "popular": false
    },
    {
      "id": "0023337b-9850-4f82-a65d-478c5012c485",
      "brand_id": "267fb859-934a-47ad-b030-d6cdc3666c50",
      "slug": "master-compressor-diving-chronograph",
      "label": "Master Compressor Diving Chronograph",
      "created_at": "2025-06-07 18:04:02.184281+00",
      "popular": false
    },
    {
      "id": "ecfb82e6-5841-4cba-8122-2380a2d8b02d",
      "brand_id": "267fb859-934a-47ad-b030-d6cdc3666c50",
      "slug": "master-compressor-diving-chronograph-gmt-navy-seals",
      "label": "Master Compressor Diving Chronograph GMT Navy SEALs",
      "created_at": "2025-06-07 18:04:02.184281+00",
      "popular": false
    },
    {
      "id": "e6e27338-741b-413c-8cc1-55885406d4d3",
      "brand_id": "267fb859-934a-47ad-b030-d6cdc3666c50",
      "slug": "master-compressor-diving-gmt",
      "label": "Master Compressor Diving GMT",
      "created_at": "2025-06-07 18:04:02.184281+00",
      "popular": false
    },
    {
      "id": "dc599f2e-b94f-4be0-87fa-85b2037fc79f",
      "brand_id": "267fb859-934a-47ad-b030-d6cdc3666c50",
      "slug": "master-compressor-diving-pro-geographic",
      "label": "Master Compressor Diving Pro Geographic",
      "created_at": "2025-06-07 18:04:02.184281+00",
      "popular": false
    },
    {
      "id": "64fab3fe-806b-49e9-83a0-f17f2d7e4b93",
      "brand_id": "267fb859-934a-47ad-b030-d6cdc3666c50",
      "slug": "master-compressor-extreme",
      "label": "Master Compressor Extreme",
      "created_at": "2025-06-07 18:04:02.184281+00",
      "popular": false
    },
    {
      "id": "c7e03085-bd82-437f-8784-397fd21020e7",
      "brand_id": "267fb859-934a-47ad-b030-d6cdc3666c50",
      "slug": "master-compressor-extreme-lab-2-tribute-to-geophysic",
      "label": "Master Compressor Extreme LAB 2 Tribute to Geophysic",
      "created_at": "2025-06-07 18:04:02.184281+00",
      "popular": false
    },
    {
      "id": "100f6bf5-d3e8-4949-a51c-8403bee4407e",
      "brand_id": "267fb859-934a-47ad-b030-d6cdc3666c50",
      "slug": "master-compressor-extreme-tourbillon",
      "label": "Master Compressor Extreme Tourbillon",
      "created_at": "2025-06-07 18:04:02.184281+00",
      "popular": false
    },
    {
      "id": "f1d3c32c-501c-43e3-83d0-6d4a74a19215",
      "brand_id": "267fb859-934a-47ad-b030-d6cdc3666c50",
      "slug": "master-compressor-extreme-w-alarm",
      "label": "Master Compressor Extreme W-Alarm",
      "created_at": "2025-06-07 18:04:02.184281+00",
      "popular": false
    },
    {
      "id": "0b5065d8-bc78-4900-aba8-3d614940c7dd",
      "brand_id": "267fb859-934a-47ad-b030-d6cdc3666c50",
      "slug": "master-compressor-extreme-world-chronograph",
      "label": "Master Compressor Extreme World Chronograph",
      "created_at": "2025-06-07 18:04:02.184281+00",
      "popular": false
    },
    {
      "id": "2af4b606-7273-4110-ae4c-adb224b95713",
      "brand_id": "267fb859-934a-47ad-b030-d6cdc3666c50",
      "slug": "master-compressor-geographic",
      "label": "Master Compressor Geographic",
      "created_at": "2025-06-07 18:04:02.184281+00",
      "popular": false
    },
    {
      "id": "a556297c-6429-4453-8252-5712576a333e",
      "brand_id": "267fb859-934a-47ad-b030-d6cdc3666c50",
      "slug": "master-compressor-gmt",
      "label": "Master Compressor GMT",
      "created_at": "2025-06-07 18:04:02.184281+00",
      "popular": false
    },
    {
      "id": "b2a3616d-3ae0-4a9e-9c95-d9e6061c18ba",
      "brand_id": "267fb859-934a-47ad-b030-d6cdc3666c50",
      "slug": "master-compressor-lady-automatic",
      "label": "Master Compressor Lady Automatic",
      "created_at": "2025-06-07 18:04:02.184281+00",
      "popular": false
    },
    {
      "id": "91eeb583-837e-4bbe-8a58-8a993e8635a6",
      "brand_id": "267fb859-934a-47ad-b030-d6cdc3666c50",
      "slug": "master-control-date",
      "label": "Master Control Date",
      "created_at": "2025-06-07 18:04:02.184281+00",
      "popular": false
    },
    {
      "id": "db45149b-e9c8-4657-841d-5a1632cf85a3",
      "brand_id": "267fb859-934a-47ad-b030-d6cdc3666c50",
      "slug": "master-date-tourbillon-39",
      "label": "Master Date Tourbillon 39",
      "created_at": "2025-06-07 18:04:02.184281+00",
      "popular": false
    },
    {
      "id": "44d40c9f-7d8b-4f04-8f46-1aaa8fa227ce",
      "brand_id": "267fb859-934a-47ad-b030-d6cdc3666c50",
      "slug": "master-eight-days",
      "label": "Master Eight Days",
      "created_at": "2025-06-07 18:04:02.184281+00",
      "popular": false
    },
    {
      "id": "c303b97f-355e-4ab5-984e-39fe303975f0",
      "brand_id": "267fb859-934a-47ad-b030-d6cdc3666c50",
      "slug": "master-eight-days-perpetual",
      "label": "Master Eight Days Perpetual",
      "created_at": "2025-06-07 18:04:02.184281+00",
      "popular": false
    },
    {
      "id": "6315b333-ac32-42c2-8ca5-fd04812e8b62",
      "brand_id": "267fb859-934a-47ad-b030-d6cdc3666c50",
      "slug": "master-geographic",
      "label": "Master Geographic",
      "created_at": "2025-06-07 18:04:02.184281+00",
      "popular": false
    },
    {
      "id": "ae483379-129b-48ee-9cda-788ef961b564",
      "brand_id": "267fb859-934a-47ad-b030-d6cdc3666c50",
      "slug": "master-grande-tradition",
      "label": "Master Grande Tradition",
      "created_at": "2025-06-07 18:04:02.184281+00",
      "popular": false
    },
    {
      "id": "d9648376-ba23-4606-a86a-4aa199c3dc3e",
      "brand_id": "267fb859-934a-47ad-b030-d6cdc3666c50",
      "slug": "master-grande-ultra-thin",
      "label": "Master Grande Ultra Thin",
      "created_at": "2025-06-07 18:04:02.184281+00",
      "popular": false
    },
    {
      "id": "744870a3-cd89-4ea1-b508-c51236183782",
      "brand_id": "267fb859-934a-47ad-b030-d6cdc3666c50",
      "slug": "master-grand-reveil",
      "label": "Master Grand Réveil",
      "created_at": "2025-06-07 18:04:02.184281+00",
      "popular": false
    },
    {
      "id": "6f88c665-bade-42dd-94dc-4d5fe615ee5e",
      "brand_id": "267fb859-934a-47ad-b030-d6cdc3666c50",
      "slug": "master-grand-tourbillon",
      "label": "Master Grand Tourbillon",
      "created_at": "2025-06-07 18:04:02.184281+00",
      "popular": false
    },
    {
      "id": "c2a95f2f-8727-4b26-83e1-53c83af29ec0",
      "brand_id": "267fb859-934a-47ad-b030-d6cdc3666c50",
      "slug": "master-hometime",
      "label": "Master Hometime",
      "created_at": "2025-06-07 18:04:02.184281+00",
      "popular": false
    },
    {
      "id": "a899c621-e721-458b-b5b3-67cfabd2942e",
      "brand_id": "267fb859-934a-47ad-b030-d6cdc3666c50",
      "slug": "master-memovox",
      "label": "Master Memovox",
      "created_at": "2025-06-07 18:04:02.184281+00",
      "popular": false
    },
    {
      "id": "55a3d780-08e3-4f86-8bc9-725c855700f7",
      "brand_id": "267fb859-934a-47ad-b030-d6cdc3666c50",
      "slug": "master-memovox-tribute-to-deep-sea",
      "label": "Master Memovox Tribute to Deep Sea",
      "created_at": "2025-06-07 18:04:02.184281+00",
      "popular": false
    },
    {
      "id": "8ee94d56-4043-42b3-82ee-d7e0e2bb0655",
      "brand_id": "267fb859-934a-47ad-b030-d6cdc3666c50",
      "slug": "master-minute-repeater",
      "label": "Master Minute Repeater",
      "created_at": "2025-06-07 18:04:02.184281+00",
      "popular": false
    },
    {
      "id": "0ea1576e-9fd0-4def-8c67-0bdf91b7d193",
      "brand_id": "267fb859-934a-47ad-b030-d6cdc3666c50",
      "slug": "master-reserve-de-marche",
      "label": "Master Réserve de Marche",
      "created_at": "2025-06-07 18:04:02.184281+00",
      "popular": false
    },
    {
      "id": "3a2bd702-b41c-44cc-8315-344a1a13195c",
      "brand_id": "267fb859-934a-47ad-b030-d6cdc3666c50",
      "slug": "master-tourbillon",
      "label": "Master Tourbillon",
      "created_at": "2025-06-07 18:04:02.184281+00",
      "popular": false
    },
    {
      "id": "129acdc2-a35b-4834-8606-2e1ff1b0e9b0",
      "brand_id": "267fb859-934a-47ad-b030-d6cdc3666c50",
      "slug": "master-ultra-thin",
      "label": "Master Ultra Thin",
      "created_at": "2025-06-07 18:04:02.184281+00",
      "popular": false
    },
    {
      "id": "4b871509-cf93-4326-9934-5f3516ca3369",
      "brand_id": "267fb859-934a-47ad-b030-d6cdc3666c50",
      "slug": "master-ultra-thin-38",
      "label": "Master Ultra Thin 38",
      "created_at": "2025-06-07 18:04:02.184281+00",
      "popular": false
    },
    {
      "id": "52dad915-e013-41c7-8a3b-82f951bfe535",
      "brand_id": "267fb859-934a-47ad-b030-d6cdc3666c50",
      "slug": "master-ultra-thin-date",
      "label": "Master Ultra Thin Date",
      "created_at": "2025-06-07 18:04:02.184281+00",
      "popular": false
    },
    {
      "id": "20bc9bfe-e171-41fb-8892-9f6d62f415b8",
      "brand_id": "267fb859-934a-47ad-b030-d6cdc3666c50",
      "slug": "master-ultra-thin-moon",
      "label": "Master Ultra Thin Moon",
      "created_at": "2025-06-07 18:04:02.184281+00",
      "popular": false
    },
    {
      "id": "f7c9ed89-7879-4657-9c4e-5f877a1264df",
      "brand_id": "267fb859-934a-47ad-b030-d6cdc3666c50",
      "slug": "master-ultra-thin-perpetual",
      "label": "Master Ultra Thin Perpetual",
      "created_at": "2025-06-07 18:04:02.184281+00",
      "popular": false
    },
    {
      "id": "5363f219-6365-41ca-886f-265029d396b7",
      "brand_id": "267fb859-934a-47ad-b030-d6cdc3666c50",
      "slug": "master-ultra-thin-reserve-de-marche",
      "label": "Master Ultra Thin Réserve de Marche",
      "created_at": "2025-06-07 18:04:02.184281+00",
      "popular": false
    },
    {
      "id": "6fa488c3-beba-40f1-ba06-7a4f3480a277",
      "brand_id": "267fb859-934a-47ad-b030-d6cdc3666c50",
      "slug": "master-ultra-thin-tourbillon",
      "label": "Master Ultra Thin Tourbillon",
      "created_at": "2025-06-07 18:04:02.184281+00",
      "popular": false
    },
    {
      "id": "9c68a9c6-93dc-48cb-bedf-0767e9b46f45",
      "brand_id": "267fb859-934a-47ad-b030-d6cdc3666c50",
      "slug": "master-world-geographic",
      "label": "Master World Geographic",
      "created_at": "2025-06-07 18:04:02.184281+00",
      "popular": false
    },
    {
      "id": "d2301c67-9c6e-4ef1-8f5a-e17bc6047d3b",
      "brand_id": "267fb859-934a-47ad-b030-d6cdc3666c50",
      "slug": "memovox",
      "label": "Memovox",
      "created_at": "2025-06-07 18:04:02.184281+00",
      "popular": false
    },
    {
      "id": "f06cf369-729b-406e-ad90-135637bf635e",
      "brand_id": "267fb859-934a-47ad-b030-d6cdc3666c50",
      "slug": "memovox-tribute-to-deep-sea",
      "label": "Memovox Tribute to Deep Sea",
      "created_at": "2025-06-07 18:04:02.184281+00",
      "popular": false
    },
    {
      "id": "0e7fa9b4-df3e-4ebe-bdd9-b78472529c54",
      "brand_id": "267fb859-934a-47ad-b030-d6cdc3666c50",
      "slug": "odysseus",
      "label": "Odysseus",
      "created_at": "2025-06-07 18:04:02.184281+00",
      "popular": false
    },
    {
      "id": "b80cd38d-d7b3-4acb-bbe8-b2e7abe502dc",
      "brand_id": "267fb859-934a-47ad-b030-d6cdc3666c50",
      "slug": "reverso-classic-medium-duetto",
      "label": "Reverso Classic Medium Duetto",
      "created_at": "2025-06-07 18:04:02.184281+00",
      "popular": false
    },
    {
      "id": "8ed811f6-ef34-4c27-92d6-834bb4454e2a",
      "brand_id": "267fb859-934a-47ad-b030-d6cdc3666c50",
      "slug": "reverso-classic-small",
      "label": "Reverso Classic Small",
      "created_at": "2025-06-07 18:04:02.184281+00",
      "popular": false
    },
    {
      "id": "f9565dc9-c8ce-4b48-a361-89509fc5a01e",
      "brand_id": "267fb859-934a-47ad-b030-d6cdc3666c50",
      "slug": "reverso-classic-small-duetto",
      "label": "Reverso Classic Small Duetto",
      "created_at": "2025-06-07 18:04:02.417389+00",
      "popular": false
    },
    {
      "id": "c0a4b984-b723-43ff-aa46-ddc8a7de9e57",
      "brand_id": "267fb859-934a-47ad-b030-d6cdc3666c50",
      "slug": "reverso-classique",
      "label": "Reverso Classique",
      "created_at": "2025-06-07 18:04:02.417389+00",
      "popular": false
    },
    {
      "id": "924f122f-b0b6-4b3b-bdbd-4643140addcb",
      "brand_id": "267fb859-934a-47ad-b030-d6cdc3666c50",
      "slug": "reverso-duetto",
      "label": "Reverso Duetto",
      "created_at": "2025-06-07 18:04:02.417389+00",
      "popular": false
    },
    {
      "id": "15d24278-7111-4ba7-b0a7-020691f52243",
      "brand_id": "267fb859-934a-47ad-b030-d6cdc3666c50",
      "slug": "reverso-duetto-classique",
      "label": "Reverso Duetto Classique",
      "created_at": "2025-06-07 18:04:02.417389+00",
      "popular": false
    },
    {
      "id": "813b4128-b6d7-42cc-b818-546a5f72dfb3",
      "brand_id": "267fb859-934a-47ad-b030-d6cdc3666c50",
      "slug": "reverso-duetto-duo",
      "label": "Reverso Duetto Duo",
      "created_at": "2025-06-07 18:04:02.417389+00",
      "popular": false
    },
    {
      "id": "16a038a2-0ed9-49c4-9fe9-49a4a23fd8f5",
      "brand_id": "267fb859-934a-47ad-b030-d6cdc3666c50",
      "slug": "reverso-duoface",
      "label": "Reverso Duoface",
      "created_at": "2025-06-07 18:04:02.417389+00",
      "popular": false
    },
    {
      "id": "58fc1f77-f793-4f57-8975-8b8c6460e870",
      "brand_id": "267fb859-934a-47ad-b030-d6cdc3666c50",
      "slug": "reverso-grande-date",
      "label": "Reverso Grande Date",
      "created_at": "2025-06-07 18:04:02.417389+00",
      "popular": false
    },
    {
      "id": "4bc76cbb-a4d5-49d5-bab9-6f9aa338af7a",
      "brand_id": "267fb859-934a-47ad-b030-d6cdc3666c50",
      "slug": "reverso-grande-taille",
      "label": "Reverso Grande Taille",
      "created_at": "2025-06-07 18:04:02.417389+00",
      "popular": false
    },
    {
      "id": "aae817a9-bdc9-47a7-b785-6569d9e02716",
      "brand_id": "267fb859-934a-47ad-b030-d6cdc3666c50",
      "slug": "reverso-gyrotourbillon-2",
      "label": "Reverso Gyrotourbillon 2",
      "created_at": "2025-06-07 18:04:02.417389+00",
      "popular": false
    },
    {
      "id": "ea3c8bc5-0bd3-4a4a-b42e-fa9db1e3caa8",
      "brand_id": "267fb859-934a-47ad-b030-d6cdc3666c50",
      "slug": "reverso-lady",
      "label": "Reverso Lady",
      "created_at": "2025-06-07 18:04:02.417389+00",
      "popular": false
    },
    {
      "id": "e6447df1-1ae7-4e76-a26b-d749e122570b",
      "brand_id": "267fb859-934a-47ad-b030-d6cdc3666c50",
      "slug": "reverso-memory",
      "label": "Reverso Memory",
      "created_at": "2025-06-07 18:04:02.417389+00",
      "popular": false
    },
    {
      "id": "2dd9eaac-91d3-4632-bd6d-a59389344b08",
      "brand_id": "267fb859-934a-47ad-b030-d6cdc3666c50",
      "slug": "reverso-squadra",
      "label": "Reverso Squadra",
      "created_at": "2025-06-07 18:04:02.417389+00",
      "popular": false
    },
    {
      "id": "9a25d2e5-baf8-4da5-b058-6e00b4b9a12c",
      "brand_id": "267fb859-934a-47ad-b030-d6cdc3666c50",
      "slug": "reverso-squadra-chronograph-gmt",
      "label": "Reverso Squadra Chronograph GMT",
      "created_at": "2025-06-07 18:04:02.417389+00",
      "popular": false
    },
    {
      "id": "c8122fd0-54a5-4cc5-ba18-cec83de41730",
      "brand_id": "267fb859-934a-47ad-b030-d6cdc3666c50",
      "slug": "reverso-squadra-hometime",
      "label": "Reverso Squadra Hometime",
      "created_at": "2025-06-07 18:04:02.417389+00",
      "popular": false
    },
    {
      "id": "ec1c2b81-ba05-4db8-a2fa-5db1bec9f8f9",
      "brand_id": "267fb859-934a-47ad-b030-d6cdc3666c50",
      "slug": "reverso-squadra-lady",
      "label": "Reverso Squadra Lady",
      "created_at": "2025-06-07 18:04:02.417389+00",
      "popular": false
    },
    {
      "id": "a598faeb-e2fb-4945-9c90-1d76ffaf9744",
      "brand_id": "267fb859-934a-47ad-b030-d6cdc3666c50",
      "slug": "reverso-squadra-lady-duetto",
      "label": "Reverso Squadra Lady Duetto",
      "created_at": "2025-06-07 18:04:02.417389+00",
      "popular": false
    },
    {
      "id": "282d40ba-87b1-46ea-8dcb-174f2c56a305",
      "brand_id": "267fb859-934a-47ad-b030-d6cdc3666c50",
      "slug": "reverso-squadra-duoface",
      "label": "Reverso Squadra Duoface",
      "created_at": "2025-06-07 18:04:02.417389+00",
      "popular": false
    },
    {
      "id": "71563ef4-be59-4501-a4cb-ff2749a8130f",
      "brand_id": "267fb859-934a-47ad-b030-d6cdc3666c50",
      "slug": "reverso-squadra-world-chronograph",
      "label": "Reverso Squadra World Chronograph",
      "created_at": "2025-06-07 18:04:02.417389+00",
      "popular": false
    },
    {
      "id": "c1166f90-ff5c-44ff-a163-990ab1d597f0",
      "brand_id": "267fb859-934a-47ad-b030-d6cdc3666c50",
      "slug": "vintage",
      "label": "Vintage",
      "created_at": "2025-06-07 18:04:02.417389+00",
      "popular": false
    },
    {
      "id": "cb1d6b19-4122-4ff2-9074-8d8281521da1",
      "brand_id": "d32d40c0-7ea1-4b72-a282-6b86f07e61f2",
      "slug": "admiral",
      "label": "Admiral",
      "created_at": "2025-06-07 18:04:02.417389+00",
      "popular": false
    },
    {
      "id": "9d215705-b22d-4d29-b2ba-e763ad714c83",
      "brand_id": "d32d40c0-7ea1-4b72-a282-6b86f07e61f2",
      "slug": "avigation",
      "label": "Avigation",
      "created_at": "2025-06-07 18:04:02.417389+00",
      "popular": false
    },
    {
      "id": "632949b3-84c4-4ce7-a5a2-263839835df9",
      "brand_id": "d32d40c0-7ea1-4b72-a282-6b86f07e61f2",
      "slug": "bellearti",
      "label": "BelleArti",
      "created_at": "2025-06-07 18:04:02.417389+00",
      "popular": false
    },
    {
      "id": "cbac6df3-0a0b-43c7-a186-d60b5722d719",
      "brand_id": "d32d40c0-7ea1-4b72-a282-6b86f07e61f2",
      "slug": "column-wheel-chronograph",
      "label": "Column-Wheel Chronograph",
      "created_at": "2025-06-07 18:04:02.417389+00",
      "popular": false
    },
    {
      "id": "07b2177e-85fb-457f-b6fc-fb10ac27cd0e",
      "brand_id": "d32d40c0-7ea1-4b72-a282-6b86f07e61f2",
      "slug": "conquest-classic",
      "label": "Conquest Classic",
      "created_at": "2025-06-07 18:04:02.417389+00",
      "popular": false
    },
    {
      "id": "1bfb9dbb-a72c-428a-a7fb-87ae9491ef46",
      "brand_id": "d32d40c0-7ea1-4b72-a282-6b86f07e61f2",
      "slug": "conquest-heritage",
      "label": "Conquest Heritage",
      "created_at": "2025-06-07 18:04:02.417389+00",
      "popular": false
    },
    {
      "id": "f0e91fdd-0ea8-48f8-9556-e7b12ca03931",
      "brand_id": "d32d40c0-7ea1-4b72-a282-6b86f07e61f2",
      "slug": "elegant",
      "label": "Elegant",
      "created_at": "2025-06-07 18:04:02.417389+00",
      "popular": false
    },
    {
      "id": "68aacb17-7a59-446a-b925-e5928d8f31c8",
      "brand_id": "d32d40c0-7ea1-4b72-a282-6b86f07e61f2",
      "slug": "equestrian",
      "label": "Equestrian",
      "created_at": "2025-06-07 18:04:02.417389+00",
      "popular": false
    },
    {
      "id": "f31c26e6-1fce-4039-ab93-0471aad1cca3",
      "brand_id": "d32d40c0-7ea1-4b72-a282-6b86f07e61f2",
      "slug": "evidenza",
      "label": "Evidenza",
      "created_at": "2025-06-07 18:04:02.417389+00",
      "popular": false
    },
    {
      "id": "ef08a73e-c85d-446d-a36a-559817e51852",
      "brand_id": "d32d40c0-7ea1-4b72-a282-6b86f07e61f2",
      "slug": "flagship-heritage",
      "label": "Flagship Heritage",
      "created_at": "2025-06-07 18:04:02.417389+00",
      "popular": false
    },
    {
      "id": "51a17971-43dd-4530-bd13-e4f385158b68",
      "brand_id": "d32d40c0-7ea1-4b72-a282-6b86f07e61f2",
      "slug": "grande-vitesse",
      "label": "Grande Vitesse",
      "created_at": "2025-06-07 18:04:02.417389+00",
      "popular": false
    },
    {
      "id": "fab0c92e-1cc2-435a-bd10-77fc65abaeee",
      "brand_id": "d32d40c0-7ea1-4b72-a282-6b86f07e61f2",
      "slug": "la-grande-classique",
      "label": "La Grande Classique",
      "created_at": "2025-06-07 18:04:02.417389+00",
      "popular": false
    },
    {
      "id": "e5996ffc-a309-40a2-acdc-eaa12e744a99",
      "brand_id": "d32d40c0-7ea1-4b72-a282-6b86f07e61f2",
      "slug": "legend-diver",
      "label": "Legend Diver",
      "created_at": "2025-06-07 18:04:02.417389+00",
      "popular": false
    },
    {
      "id": "18ea4da6-d085-44ed-9dd7-cbe503c4437f",
      "brand_id": "d32d40c0-7ea1-4b72-a282-6b86f07e61f2",
      "slug": "lindbergh-hour-angle",
      "label": "Lindbergh Hour Angle",
      "created_at": "2025-06-07 18:04:02.417389+00",
      "popular": false
    },
    {
      "id": "9778b6f0-d5f6-4c6a-94c4-be6e15c479d1",
      "brand_id": "d32d40c0-7ea1-4b72-a282-6b86f07e61f2",
      "slug": "lyre",
      "label": "Lyre",
      "created_at": "2025-06-07 18:04:02.417389+00",
      "popular": false
    },
    {
      "id": "6209ccbb-fdb6-4b92-95f0-aa02bbfaa8c1",
      "brand_id": "d32d40c0-7ea1-4b72-a282-6b86f07e61f2",
      "slug": "oposition",
      "label": "Oposition",
      "created_at": "2025-06-07 18:04:02.417389+00",
      "popular": false
    },
    {
      "id": "551bbb4b-3374-445d-9b1b-a67aad2142ef",
      "brand_id": "d32d40c0-7ea1-4b72-a282-6b86f07e61f2",
      "slug": "presence",
      "label": "Présence",
      "created_at": "2025-06-07 18:04:02.417389+00",
      "popular": false
    },
    {
      "id": "a66d3e73-1fcd-40ad-813b-b452220b4c2e",
      "brand_id": "d32d40c0-7ea1-4b72-a282-6b86f07e61f2",
      "slug": "presence-heritage",
      "label": "Présence Heritage",
      "created_at": "2025-06-07 18:04:02.417389+00",
      "popular": false
    },
    {
      "id": "6bfcd892-d75b-44c0-9835-d63a4ffac49f",
      "brand_id": "d32d40c0-7ea1-4b72-a282-6b86f07e61f2",
      "slug": "primaluna",
      "label": "PrimaLuna",
      "created_at": "2025-06-07 18:04:02.417389+00",
      "popular": false
    },
    {
      "id": "0430a769-f6ee-416e-8ad2-f455c1de7061",
      "brand_id": "d32d40c0-7ea1-4b72-a282-6b86f07e61f2",
      "slug": "record",
      "label": "Record",
      "created_at": "2025-06-07 18:04:02.417389+00",
      "popular": false
    },
    {
      "id": "c828c47c-cde4-48eb-acde-d4b56dfde66a",
      "brand_id": "d32d40c0-7ea1-4b72-a282-6b86f07e61f2",
      "slug": "saint-imier",
      "label": "Saint-Imier",
      "created_at": "2025-06-07 18:04:02.417389+00",
      "popular": false
    },
    {
      "id": "56d4b772-9e81-4ff8-9665-6f258357f5c6",
      "brand_id": "d32d40c0-7ea1-4b72-a282-6b86f07e61f2",
      "slug": "symphonette",
      "label": "Symphonette",
      "created_at": "2025-06-07 18:04:02.417389+00",
      "popular": false
    },
    {
      "id": "1b582792-77e8-4032-a632-5cd93fdda260",
      "brand_id": "d32d40c0-7ea1-4b72-a282-6b86f07e61f2",
      "slug": "twenty-four-hours",
      "label": "Twenty-Four Hours",
      "created_at": "2025-06-07 18:04:02.417389+00",
      "popular": false
    },
    {
      "id": "e08409ef-a8be-418e-9183-6d1ebe90b282",
      "brand_id": "d32d40c0-7ea1-4b72-a282-6b86f07e61f2",
      "slug": "ultronic",
      "label": "Ultronic",
      "created_at": "2025-06-07 18:04:02.417389+00",
      "popular": false
    },
    {
      "id": "207ccf83-8535-449d-97d1-6cc5ea8ed051",
      "brand_id": "00001610-29b4-4b0d-b987-416fdbc196d2",
      "slug": "aikon",
      "label": "AIKON",
      "created_at": "2025-06-07 18:04:02.417389+00",
      "popular": false
    },
    {
      "id": "58bdf874-b6af-4af2-8090-1254369a4ba3",
      "brand_id": "00001610-29b4-4b0d-b987-416fdbc196d2",
      "slug": "calypso",
      "label": "Calypso",
      "created_at": "2025-06-07 18:04:02.417389+00",
      "popular": false
    },
    {
      "id": "92cbf294-1774-4592-b964-be92a4e73118",
      "brand_id": "00001610-29b4-4b0d-b987-416fdbc196d2",
      "slug": "divina",
      "label": "Divina",
      "created_at": "2025-06-07 18:04:02.417389+00",
      "popular": false
    },
    {
      "id": "b45db53a-6d5b-41c0-b134-3a79edb5af40",
      "brand_id": "00001610-29b4-4b0d-b987-416fdbc196d2",
      "slug": "eliros",
      "label": "Eliros",
      "created_at": "2025-06-07 18:04:02.417389+00",
      "popular": false
    },
    {
      "id": "c64738d7-be76-4013-a0c3-721cbd108c06",
      "brand_id": "00001610-29b4-4b0d-b987-416fdbc196d2",
      "slug": "fiaba",
      "label": "Fiaba",
      "created_at": "2025-06-07 18:04:02.417389+00",
      "popular": false
    },
    {
      "id": "532a6099-dc98-41b0-8656-95f844f0ddb3",
      "brand_id": "00001610-29b4-4b0d-b987-416fdbc196d2",
      "slug": "les-classiques",
      "label": "Les Classiques",
      "created_at": "2025-06-07 18:04:02.417389+00",
      "popular": false
    },
    {
      "id": "f04009d1-c0e0-4ea2-acc9-ae5d8d1333dc",
      "brand_id": "00001610-29b4-4b0d-b987-416fdbc196d2",
      "slug": "les-classiques-chronographe",
      "label": "Les Classiques Chronographe",
      "created_at": "2025-06-07 18:04:02.417389+00",
      "popular": false
    },
    {
      "id": "698ab051-0a08-4f51-9b39-7c4775554eeb",
      "brand_id": "00001610-29b4-4b0d-b987-416fdbc196d2",
      "slug": "les-classiques-date",
      "label": "Les Classiques Date",
      "created_at": "2025-06-07 18:04:02.417389+00",
      "popular": false
    },
    {
      "id": "0e90491e-987d-408d-9e7f-4718eaf74963",
      "brand_id": "00001610-29b4-4b0d-b987-416fdbc196d2",
      "slug": "les-classiques-phases-de-lune",
      "label": "Les Classiques Phases de Lune",
      "created_at": "2025-06-07 18:04:02.417389+00",
      "popular": false
    },
    {
      "id": "2a17598f-4a1b-443e-8a21-4bc5fe9ce7de",
      "brand_id": "00001610-29b4-4b0d-b987-416fdbc196d2",
      "slug": "les-classiques-tradition",
      "label": "Les Classiques Tradition",
      "created_at": "2025-06-07 18:04:02.417389+00",
      "popular": false
    },
    {
      "id": "f71d4661-05d3-4c6a-81e0-c869ed6cdb1b",
      "brand_id": "00001610-29b4-4b0d-b987-416fdbc196d2",
      "slug": "masterpiece",
      "label": "Masterpiece",
      "created_at": "2025-06-07 18:04:02.417389+00",
      "popular": false
    },
    {
      "id": "1f3bf091-a27c-40c3-be21-242287d75cfa",
      "brand_id": "00001610-29b4-4b0d-b987-416fdbc196d2",
      "slug": "masterpiece-cinq-aiguilles",
      "label": "Masterpiece Cinq Aiguilles",
      "created_at": "2025-06-07 18:04:02.417389+00",
      "popular": false
    },
    {
      "id": "2b2b6549-12d8-4a9a-9a97-0e590fcf2126",
      "brand_id": "00001610-29b4-4b0d-b987-416fdbc196d2",
      "slug": "masterpiece-gravity",
      "label": "Masterpiece Gravity",
      "created_at": "2025-06-07 18:04:02.417389+00",
      "popular": false
    },
    {
      "id": "da4247d9-c88e-47b6-9359-28ab06b62954",
      "brand_id": "00001610-29b4-4b0d-b987-416fdbc196d2",
      "slug": "masterpiece-phases-de-lune",
      "label": "Masterpiece Phases de Lune",
      "created_at": "2025-06-07 18:04:02.417389+00",
      "popular": false
    },
    {
      "id": "c05facb6-faf3-4c9f-b872-544c513e6b8c",
      "brand_id": "00001610-29b4-4b0d-b987-416fdbc196d2",
      "slug": "masterpiece-reserve-de-marche",
      "label": "Masterpiece Réserve de Marche",
      "created_at": "2025-06-07 18:04:02.417389+00",
      "popular": false
    },
    {
      "id": "8ff22c61-1fa0-4ba4-b5cd-cb9c258d06c7",
      "brand_id": "00001610-29b4-4b0d-b987-416fdbc196d2",
      "slug": "masterpiece-small-seconde",
      "label": "Masterpiece Small Seconde",
      "created_at": "2025-06-07 18:04:02.417389+00",
      "popular": false
    },
    {
      "id": "fae345c9-634a-4a25-b04b-9d1a6930c137",
      "brand_id": "00001610-29b4-4b0d-b987-416fdbc196d2",
      "slug": "masterpiece-squelette",
      "label": "Masterpiece Squelette",
      "created_at": "2025-06-07 18:04:02.417389+00",
      "popular": false
    },
    {
      "id": "e89aa9d6-7fb5-4904-bd6c-173b9a56b393",
      "brand_id": "00001610-29b4-4b0d-b987-416fdbc196d2",
      "slug": "masterpiece-worldtimer",
      "label": "Masterpiece Worldtimer",
      "created_at": "2025-06-07 18:04:02.417389+00",
      "popular": false
    },
    {
      "id": "7bddf4a5-dfd1-414d-9dd9-8d159a8d33ba",
      "brand_id": "00001610-29b4-4b0d-b987-416fdbc196d2",
      "slug": "miros",
      "label": "Miros",
      "created_at": "2025-06-07 18:04:02.417389+00",
      "popular": false
    },
    {
      "id": "0056a182-8bff-4870-b934-42fb98056dbd",
      "brand_id": "00001610-29b4-4b0d-b987-416fdbc196d2",
      "slug": "pontos",
      "label": "Pontos",
      "created_at": "2025-06-07 18:04:02.417389+00",
      "popular": false
    },
    {
      "id": "db65a7d7-0995-43df-93d7-663816a98956",
      "brand_id": "00001610-29b4-4b0d-b987-416fdbc196d2",
      "slug": "pontos-chronographe",
      "label": "Pontos Chronographe",
      "created_at": "2025-06-07 18:04:02.417389+00",
      "popular": false
    },
    {
      "id": "92b5e567-f109-4c5e-ade4-8e91e17fcd7c",
      "brand_id": "00001610-29b4-4b0d-b987-416fdbc196d2",
      "slug": "pontos-chronographe-retro",
      "label": "Pontos Chronographe Rétro",
      "created_at": "2025-06-07 18:04:02.417389+00",
      "popular": false
    },
    {
      "id": "975dee96-2c18-4c2f-ad8f-9fafdc1252de",
      "brand_id": "00001610-29b4-4b0d-b987-416fdbc196d2",
      "slug": "pontos-date",
      "label": "Pontos Date",
      "created_at": "2025-06-07 18:04:02.417389+00",
      "popular": false
    },
    {
      "id": "0664a516-02a4-4923-a261-995a369cd851",
      "brand_id": "00001610-29b4-4b0d-b987-416fdbc196d2",
      "slug": "pontos-day-date",
      "label": "Pontos Day Date",
      "created_at": "2025-06-07 18:04:02.417389+00",
      "popular": false
    },
    {
      "id": "bd55c7bc-654e-460d-934b-c184ff403804",
      "brand_id": "00001610-29b4-4b0d-b987-416fdbc196d2",
      "slug": "pontos-decentrique-gmt",
      "label": "Pontos Décentrique GMT",
      "created_at": "2025-06-07 18:04:02.417389+00",
      "popular": false
    },
    {
      "id": "9aef9469-941c-46c3-8513-b3fa687d6863",
      "brand_id": "00001610-29b4-4b0d-b987-416fdbc196d2",
      "slug": "pontos-s",
      "label": "Pontos S",
      "created_at": "2025-06-07 18:04:02.417389+00",
      "popular": false
    },
    {
      "id": "651ba7c5-563a-4d14-9af4-6959c96cd798",
      "brand_id": "00001610-29b4-4b0d-b987-416fdbc196d2",
      "slug": "pontos-s-diver",
      "label": "Pontos S Diver",
      "created_at": "2025-06-07 18:04:02.417389+00",
      "popular": false
    },
    {
      "id": "76ecbf4c-9b43-4821-9ce0-92fae0168fdf",
      "brand_id": "00001610-29b4-4b0d-b987-416fdbc196d2",
      "slug": "pontos-s-extreme",
      "label": "Pontos S Extreme",
      "created_at": "2025-06-07 18:04:02.417389+00",
      "popular": false
    },
    {
      "id": "5f63561e-ec4b-43db-a971-64df8e2c77c7",
      "brand_id": "00001610-29b4-4b0d-b987-416fdbc196d2",
      "slug": "pontos-s-supercharged",
      "label": "Pontos S Supercharged",
      "created_at": "2025-06-07 18:04:02.417389+00",
      "popular": false
    },
    {
      "id": "a91452ab-d872-4a36-80b2-558c129beb18",
      "brand_id": "c0c7d48e-d577-4c9d-a32d-1d8b52813450",
      "slug": "ahoi",
      "label": "Ahoi",
      "created_at": "2025-06-07 18:04:02.417389+00",
      "popular": false
    },
    {
      "id": "fbc6eab2-c331-4558-854b-0ee4fd979f9c",
      "brand_id": "c0c7d48e-d577-4c9d-a32d-1d8b52813450",
      "slug": "ahoi-atlantik",
      "label": "Ahoi Atlantik",
      "created_at": "2025-06-07 18:04:02.417389+00",
      "popular": false
    },
    {
      "id": "f10c3c7d-d4c4-486f-9be4-c5b46d826e99",
      "brand_id": "c0c7d48e-d577-4c9d-a32d-1d8b52813450",
      "slug": "ahoi-datum",
      "label": "Ahoi Datum",
      "created_at": "2025-06-07 18:04:02.417389+00",
      "popular": false
    },
    {
      "id": "11da942c-d8f1-4245-8e0a-c226cd3cf797",
      "brand_id": "c0c7d48e-d577-4c9d-a32d-1d8b52813450",
      "slug": "ahoi-neomatik",
      "label": "Ahoi Neomatik",
      "created_at": "2025-06-07 18:04:02.417389+00",
      "popular": false
    },
    {
      "id": "08969d7a-b031-42c7-befe-8c69a7eb1e6b",
      "brand_id": "c0c7d48e-d577-4c9d-a32d-1d8b52813450",
      "slug": "autobahn",
      "label": "Autobahn",
      "created_at": "2025-06-07 18:04:02.417389+00",
      "popular": false
    },
    {
      "id": "26f4af31-3146-4863-8fa2-3f34a4bf330f",
      "brand_id": "c0c7d48e-d577-4c9d-a32d-1d8b52813450",
      "slug": "club",
      "label": "Club",
      "created_at": "2025-06-07 18:04:02.417389+00",
      "popular": false
    },
    {
      "id": "639f3049-425d-4972-93d5-520c424f7124",
      "brand_id": "c0c7d48e-d577-4c9d-a32d-1d8b52813450",
      "slug": "club-automat",
      "label": "Club Automat",
      "created_at": "2025-06-07 18:04:02.417389+00",
      "popular": false
    },
    {
      "id": "fa0fe2a3-8a84-4fcc-ade7-8effabdc5d15",
      "brand_id": "c0c7d48e-d577-4c9d-a32d-1d8b52813450",
      "slug": "club-automat-datum",
      "label": "Club Automat Datum",
      "created_at": "2025-06-07 18:04:02.417389+00",
      "popular": false
    },
    {
      "id": "ef097598-2893-42ca-b8bd-da0a2e56ebec",
      "brand_id": "c0c7d48e-d577-4c9d-a32d-1d8b52813450",
      "slug": "club-campus",
      "label": "Club Campus",
      "created_at": "2025-06-07 18:04:02.417389+00",
      "popular": false
    },
    {
      "id": "ed4a8c85-353e-4bf4-8b4c-3550b27dec56",
      "brand_id": "c0c7d48e-d577-4c9d-a32d-1d8b52813450",
      "slug": "club-campus-neomatik",
      "label": "Club Campus Neomatik",
      "created_at": "2025-06-07 18:04:02.417389+00",
      "popular": false
    },
    {
      "id": "0d4ecd1e-aeaa-44ac-8709-efcdf0129175",
      "brand_id": "c0c7d48e-d577-4c9d-a32d-1d8b52813450",
      "slug": "club-datum",
      "label": "Club Datum",
      "created_at": "2025-06-07 18:04:02.417389+00",
      "popular": false
    },
    {
      "id": "b597d673-8a21-4fce-bb29-7ca362be4419",
      "brand_id": "c0c7d48e-d577-4c9d-a32d-1d8b52813450",
      "slug": "club-neomatik",
      "label": "Club Neomatik",
      "created_at": "2025-06-07 18:04:02.417389+00",
      "popular": false
    },
    {
      "id": "7d6f4e60-3c64-4e86-bae4-2004ee8ede6e",
      "brand_id": "c0c7d48e-d577-4c9d-a32d-1d8b52813450",
      "slug": "lambda",
      "label": "Lambda",
      "created_at": "2025-06-07 18:04:02.417389+00",
      "popular": false
    },
    {
      "id": "993d3627-a02b-4349-bf58-0abd77e88e5c",
      "brand_id": "c0c7d48e-d577-4c9d-a32d-1d8b52813450",
      "slug": "ludwig",
      "label": "Ludwig",
      "created_at": "2025-06-07 18:04:02.417389+00",
      "popular": false
    },
    {
      "id": "5d9dc789-1d6b-456a-948d-3f2abdebb1c4",
      "brand_id": "c0c7d48e-d577-4c9d-a32d-1d8b52813450",
      "slug": "ludwig-33",
      "label": "Ludwig 33",
      "created_at": "2025-06-07 18:04:02.417389+00",
      "popular": false
    },
    {
      "id": "78418c15-3233-4c4c-b2dc-25559790de0b",
      "brand_id": "c0c7d48e-d577-4c9d-a32d-1d8b52813450",
      "slug": "ludwig-38",
      "label": "Ludwig 38",
      "created_at": "2025-06-07 18:04:02.417389+00",
      "popular": false
    },
    {
      "id": "151380f6-c9b5-4805-b50a-59d1a932b337",
      "brand_id": "c0c7d48e-d577-4c9d-a32d-1d8b52813450",
      "slug": "ludwig-automatik",
      "label": "Ludwig Automatik",
      "created_at": "2025-06-07 18:04:02.417389+00",
      "popular": false
    },
    {
      "id": "234fd4fa-7234-45d2-9950-32727bcd7e7d",
      "brand_id": "c0c7d48e-d577-4c9d-a32d-1d8b52813450",
      "slug": "ludwig-neomatik",
      "label": "Ludwig Neomatik",
      "created_at": "2025-06-07 18:04:02.417389+00",
      "popular": false
    },
    {
      "id": "85f17211-b08a-4faf-aa2c-12573611fa1d",
      "brand_id": "c0c7d48e-d577-4c9d-a32d-1d8b52813450",
      "slug": "lux",
      "label": "Lux",
      "created_at": "2025-06-07 18:04:02.417389+00",
      "popular": false
    },
    {
      "id": "f490176c-48a0-4a72-bbea-c5171c2df447",
      "brand_id": "c0c7d48e-d577-4c9d-a32d-1d8b52813450",
      "slug": "metro",
      "label": "Metro",
      "created_at": "2025-06-07 18:04:02.417389+00",
      "popular": false
    },
    {
      "id": "55e4d94b-fc3b-4925-a211-185b9e59926b",
      "brand_id": "c0c7d48e-d577-4c9d-a32d-1d8b52813450",
      "slug": "metro-38",
      "label": "Metro 38",
      "created_at": "2025-06-07 18:04:02.417389+00",
      "popular": false
    },
    {
      "id": "e804eebd-59c1-4abf-b635-56e292e3921b",
      "brand_id": "c0c7d48e-d577-4c9d-a32d-1d8b52813450",
      "slug": "metro-38-datum",
      "label": "Metro 38 Datum",
      "created_at": "2025-06-07 18:04:02.649592+00",
      "popular": false
    },
    {
      "id": "d39daf8d-4d69-49cf-8a41-4cf9cec8f40f",
      "brand_id": "c0c7d48e-d577-4c9d-a32d-1d8b52813450",
      "slug": "metro-datum-gangreserve",
      "label": "Metro Datum Gangreserve",
      "created_at": "2025-06-07 18:04:02.649592+00",
      "popular": false
    },
    {
      "id": "b76f806a-8cf5-4c06-a0bd-4bff6160bc49",
      "brand_id": "c0c7d48e-d577-4c9d-a32d-1d8b52813450",
      "slug": "metro-neomatik",
      "label": "Metro Neomatik",
      "created_at": "2025-06-07 18:04:02.649592+00",
      "popular": false
    },
    {
      "id": "bbba0007-de7a-4239-bea0-48a668ff9c35",
      "brand_id": "c0c7d48e-d577-4c9d-a32d-1d8b52813450",
      "slug": "minimatik",
      "label": "Minimatik",
      "created_at": "2025-06-07 18:04:02.649592+00",
      "popular": false
    },
    {
      "id": "e8b5c6ed-d504-40f9-be40-1ba899a28e4f",
      "brand_id": "c0c7d48e-d577-4c9d-a32d-1d8b52813450",
      "slug": "orion",
      "label": "Orion",
      "created_at": "2025-06-07 18:04:02.649592+00",
      "popular": false
    },
    {
      "id": "5b5c19e0-d839-4af0-96f6-534c70254385",
      "brand_id": "c0c7d48e-d577-4c9d-a32d-1d8b52813450",
      "slug": "orion-1989",
      "label": "Orion 1989",
      "created_at": "2025-06-07 18:04:02.649592+00",
      "popular": false
    },
    {
      "id": "300de428-ae9c-48a3-b8ab-b6c04f44af55",
      "brand_id": "c0c7d48e-d577-4c9d-a32d-1d8b52813450",
      "slug": "orion-33",
      "label": "Orion 33",
      "created_at": "2025-06-07 18:04:02.649592+00",
      "popular": false
    },
    {
      "id": "e408f5ca-cdb8-49e5-a7cd-a45507f304d6",
      "brand_id": "c0c7d48e-d577-4c9d-a32d-1d8b52813450",
      "slug": "orion-38",
      "label": "Orion 38",
      "created_at": "2025-06-07 18:04:02.649592+00",
      "popular": false
    },
    {
      "id": "b6b747e4-7727-4099-b1a0-28ead8368f3d",
      "brand_id": "c0c7d48e-d577-4c9d-a32d-1d8b52813450",
      "slug": "orion-datum",
      "label": "Orion Datum",
      "created_at": "2025-06-07 18:04:02.649592+00",
      "popular": false
    },
    {
      "id": "fd93e2be-6a91-4631-ade3-838d0e3ca493",
      "brand_id": "c0c7d48e-d577-4c9d-a32d-1d8b52813450",
      "slug": "orion-neomatik",
      "label": "Orion Neomatik",
      "created_at": "2025-06-07 18:04:02.649592+00",
      "popular": false
    },
    {
      "id": "a72ec170-37d5-4446-9cb3-2feeb07c7204",
      "brand_id": "c0c7d48e-d577-4c9d-a32d-1d8b52813450",
      "slug": "tangente",
      "label": "Tangente",
      "created_at": "2025-06-07 18:04:02.649592+00",
      "popular": false
    },
    {
      "id": "fe8bc65a-bf30-4968-9944-629e9647293e",
      "brand_id": "c0c7d48e-d577-4c9d-a32d-1d8b52813450",
      "slug": "tangente-33",
      "label": "Tangente 33",
      "created_at": "2025-06-07 18:04:02.649592+00",
      "popular": false
    },
    {
      "id": "2eca0dbd-b436-4ed0-9bf9-9a90d7b85efb",
      "brand_id": "c0c7d48e-d577-4c9d-a32d-1d8b52813450",
      "slug": "tangente-38",
      "label": "Tangente 38",
      "created_at": "2025-06-07 18:04:02.649592+00",
      "popular": false
    },
    {
      "id": "3d61a9dc-c752-4b54-b3e2-c253fb374413",
      "brand_id": "c0c7d48e-d577-4c9d-a32d-1d8b52813450",
      "slug": "tangente-38-datum",
      "label": "Tangente 38 Datum",
      "created_at": "2025-06-07 18:04:02.649592+00",
      "popular": false
    },
    {
      "id": "3166fcd4-e11d-4ce9-b27f-10c6fb67b725",
      "brand_id": "c0c7d48e-d577-4c9d-a32d-1d8b52813450",
      "slug": "tangente-gangreserve",
      "label": "Tangente Gangreserve",
      "created_at": "2025-06-07 18:04:02.649592+00",
      "popular": false
    },
    {
      "id": "c02e8e9c-e4d4-4546-9fb7-cc65ed31a537",
      "brand_id": "c0c7d48e-d577-4c9d-a32d-1d8b52813450",
      "slug": "tangente-neomatik",
      "label": "Tangente Neomatik",
      "created_at": "2025-06-07 18:04:02.649592+00",
      "popular": false
    },
    {
      "id": "bfd65870-f36c-4934-98a3-b75366064e8a",
      "brand_id": "c0c7d48e-d577-4c9d-a32d-1d8b52813450",
      "slug": "tangomat",
      "label": "Tangomat",
      "created_at": "2025-06-07 18:04:02.649592+00",
      "popular": false
    },
    {
      "id": "b04ffb8f-1818-424d-be21-1c0a19223ac2",
      "brand_id": "c0c7d48e-d577-4c9d-a32d-1d8b52813450",
      "slug": "tangomat-datum",
      "label": "Tangomat Datum",
      "created_at": "2025-06-07 18:04:02.649592+00",
      "popular": false
    },
    {
      "id": "aac22d60-3786-4942-9277-3a4b3e918db7",
      "brand_id": "c0c7d48e-d577-4c9d-a32d-1d8b52813450",
      "slug": "tangomat-gmt",
      "label": "Tangomat GMT",
      "created_at": "2025-06-07 18:04:02.649592+00",
      "popular": false
    },
    {
      "id": "5e6afb3c-7c87-44dd-a0cb-0f1a7d70e54e",
      "brand_id": "c0c7d48e-d577-4c9d-a32d-1d8b52813450",
      "slug": "tangomat-ruthenium",
      "label": "Tangomat Ruthenium",
      "created_at": "2025-06-07 18:04:02.649592+00",
      "popular": false
    },
    {
      "id": "03e52fe0-56fc-4f73-a6dc-c93ba742b4a1",
      "brand_id": "c0c7d48e-d577-4c9d-a32d-1d8b52813450",
      "slug": "tetra",
      "label": "Tetra",
      "created_at": "2025-06-07 18:04:02.649592+00",
      "popular": false
    },
    {
      "id": "7508448e-7a6d-4e5c-b4a4-0f21b6b94631",
      "brand_id": "c0c7d48e-d577-4c9d-a32d-1d8b52813450",
      "slug": "tetra-27",
      "label": "Tetra 27",
      "created_at": "2025-06-07 18:04:02.649592+00",
      "popular": false
    },
    {
      "id": "c4207401-debc-45af-92ea-84b0c6e45733",
      "brand_id": "c0c7d48e-d577-4c9d-a32d-1d8b52813450",
      "slug": "tetra-neomatik",
      "label": "Tetra Neomatik",
      "created_at": "2025-06-07 18:04:02.649592+00",
      "popular": false
    },
    {
      "id": "069413d5-911a-4289-89bb-3952fc5ddb67",
      "brand_id": "c0c7d48e-d577-4c9d-a32d-1d8b52813450",
      "slug": "zurich",
      "label": "Zürich",
      "created_at": "2025-06-07 18:04:02.649592+00",
      "popular": false
    },
    {
      "id": "b7c8b1bb-ac85-4b93-9cdc-879b0e9ee46c",
      "brand_id": "c0c7d48e-d577-4c9d-a32d-1d8b52813450",
      "slug": "zurich-datum",
      "label": "Zürich Datum",
      "created_at": "2025-06-07 18:04:02.649592+00",
      "popular": false
    },
    {
      "id": "31512091-8c88-4ebc-8740-dd6008244bfb",
      "brand_id": "c0c7d48e-d577-4c9d-a32d-1d8b52813450",
      "slug": "zurich-weltzeit",
      "label": "Zürich Weltzeit",
      "created_at": "2025-06-07 18:04:02.649592+00",
      "popular": false
    },
    {
      "id": "14efabb4-dace-477a-a788-07393a0f013f",
      "brand_id": "526c2d41-52d1-4525-8aec-5498bb15e249",
      "slug": "ferrari",
      "label": "Ferrari",
      "created_at": "2025-06-07 18:04:02.649592+00",
      "popular": false
    },
    {
      "id": "f1c38a8b-8038-4764-8859-902d8d668b71",
      "brand_id": "526c2d41-52d1-4525-8aec-5498bb15e249",
      "slug": "luminor-1950",
      "label": "Luminor 1950",
      "created_at": "2025-06-07 18:04:02.649592+00",
      "popular": false
    },
    {
      "id": "7f7570db-3b13-4f62-8d9a-d923d0d466cc",
      "brand_id": "526c2d41-52d1-4525-8aec-5498bb15e249",
      "slug": "luminor-1950-10-days-gmt",
      "label": "Luminor 1950 10 Days GMT",
      "created_at": "2025-06-07 18:04:02.649592+00",
      "popular": false
    },
    {
      "id": "6d003b06-bf49-440f-bd26-364d430907d7",
      "brand_id": "526c2d41-52d1-4525-8aec-5498bb15e249",
      "slug": "luminor-1950-3-days-chrono-flyback",
      "label": "Luminor 1950 3 Days Chrono Flyback",
      "created_at": "2025-06-07 18:04:02.649592+00",
      "popular": false
    },
    {
      "id": "1e42f578-ad28-41ef-ab23-26d3aff86238",
      "brand_id": "526c2d41-52d1-4525-8aec-5498bb15e249",
      "slug": "luminor-1950-3-days-gmt-automatic",
      "label": "Luminor 1950 3 Days GMT Automatic",
      "created_at": "2025-06-07 18:04:02.649592+00",
      "popular": false
    },
    {
      "id": "d5efc81d-1369-4d78-beaf-e913917eb3a6",
      "brand_id": "526c2d41-52d1-4525-8aec-5498bb15e249",
      "slug": "luminor-1950-3-days-gmt-power-reserve-automatic",
      "label": "Luminor 1950 3 Days GMT Power Reserve Automatic",
      "created_at": "2025-06-07 18:04:02.649592+00",
      "popular": false
    },
    {
      "id": "18767237-d4fd-4874-9d86-05c318f2140d",
      "brand_id": "526c2d41-52d1-4525-8aec-5498bb15e249",
      "slug": "luminor-1950-3-days-power-reserve",
      "label": "Luminor 1950 3 Days Power Reserve",
      "created_at": "2025-06-07 18:04:02.649592+00",
      "popular": false
    },
    {
      "id": "c9f0fabc-f900-4878-8a0d-56a0cbb41a08",
      "brand_id": "526c2d41-52d1-4525-8aec-5498bb15e249",
      "slug": "luminor-1950-8-days-chrono-monopulsante-gmt",
      "label": "Luminor 1950 8 Days Chrono Monopulsante GMT",
      "created_at": "2025-06-07 18:04:02.649592+00",
      "popular": false
    },
    {
      "id": "669780c0-410a-4aa5-93d5-05e2ab5fb103",
      "brand_id": "526c2d41-52d1-4525-8aec-5498bb15e249",
      "slug": "luminor-1950-8-days-gmt",
      "label": "Luminor 1950 8 Days GMT",
      "created_at": "2025-06-07 18:04:02.649592+00",
      "popular": false
    },
    {
      "id": "f3446753-1df4-4cdf-a37f-af2a3354035f",
      "brand_id": "526c2d41-52d1-4525-8aec-5498bb15e249",
      "slug": "luminor-1950-rattrapante-8-days",
      "label": "Luminor 1950 Rattrapante 8 Days",
      "created_at": "2025-06-07 18:04:02.649592+00",
      "popular": false
    },
    {
      "id": "2c0cca23-ff39-4b6f-a9cb-125042d45577",
      "brand_id": "526c2d41-52d1-4525-8aec-5498bb15e249",
      "slug": "luminor-1950-regatta-3-days-chrono-flyback",
      "label": "Luminor 1950 Regatta 3 Days Chrono Flyback",
      "created_at": "2025-06-07 18:04:02.649592+00",
      "popular": false
    },
    {
      "id": "1457ceba-6861-46f9-b9e4-7b17023bccfb",
      "brand_id": "526c2d41-52d1-4525-8aec-5498bb15e249",
      "slug": "luminor-base",
      "label": "Luminor Base",
      "created_at": "2025-06-07 18:04:02.649592+00",
      "popular": false
    },
    {
      "id": "27b6a54e-2745-40e4-955a-2bc9e701d4c1",
      "brand_id": "526c2d41-52d1-4525-8aec-5498bb15e249",
      "slug": "luminor-base-8-days",
      "label": "Luminor Base 8 Days",
      "created_at": "2025-06-07 18:04:02.649592+00",
      "popular": false
    },
    {
      "id": "94ea4095-5b7a-4ff5-982b-ffc8cd0203ec",
      "brand_id": "526c2d41-52d1-4525-8aec-5498bb15e249",
      "slug": "luminor-base-logo",
      "label": "Luminor Base Logo",
      "created_at": "2025-06-07 18:04:02.649592+00",
      "popular": false
    },
    {
      "id": "3a0c6df3-4578-42c5-8d00-d34b4d78f531",
      "brand_id": "526c2d41-52d1-4525-8aec-5498bb15e249",
      "slug": "luminor-chrono",
      "label": "Luminor Chrono",
      "created_at": "2025-06-07 18:04:02.649592+00",
      "popular": false
    },
    {
      "id": "1d028024-bbfd-4112-b9ad-96cb45a0349c",
      "brand_id": "526c2d41-52d1-4525-8aec-5498bb15e249",
      "slug": "luminor-due-luna",
      "label": "Luminor Due Luna",
      "created_at": "2025-06-07 18:04:02.649592+00",
      "popular": false
    },
    {
      "id": "10db34f8-5c92-4bf1-a080-4d53e7578e2a",
      "brand_id": "526c2d41-52d1-4525-8aec-5498bb15e249",
      "slug": "luminor-equation-of-time",
      "label": "Luminor Equation Of Time",
      "created_at": "2025-06-07 18:04:02.649592+00",
      "popular": false
    },
    {
      "id": "a16413dc-bdd8-4262-b83b-4b630a102f96",
      "brand_id": "526c2d41-52d1-4525-8aec-5498bb15e249",
      "slug": "luminor-gmt-automatic",
      "label": "Luminor GMT Automatic",
      "created_at": "2025-06-07 18:04:02.649592+00",
      "popular": false
    },
    {
      "id": "974eb310-e2cf-423f-a44e-05ae2c55d38d",
      "brand_id": "526c2d41-52d1-4525-8aec-5498bb15e249",
      "slug": "luminor-luna-rossa",
      "label": "Luminor Luna Rossa",
      "created_at": "2025-06-07 18:04:02.649592+00",
      "popular": false
    },
    {
      "id": "4ee97186-d61b-44d1-8740-5e34a64a42d4",
      "brand_id": "526c2d41-52d1-4525-8aec-5498bb15e249",
      "slug": "luminor-marina",
      "label": "Luminor Marina",
      "created_at": "2025-06-07 18:04:02.649592+00",
      "popular": false
    },
    {
      "id": "28347317-7075-49d6-a686-0d0cd8fa72c2",
      "brand_id": "526c2d41-52d1-4525-8aec-5498bb15e249",
      "slug": "luminor-marina-1950-3-days",
      "label": "Luminor Marina 1950 3 Days",
      "created_at": "2025-06-07 18:04:02.649592+00",
      "popular": false
    },
    {
      "id": "a4f945b2-70de-41df-8a8a-b0c07d0ef2ee",
      "brand_id": "526c2d41-52d1-4525-8aec-5498bb15e249",
      "slug": "luminor-marina-1950-3-days-automatic",
      "label": "Luminor Marina 1950 3 Days Automatic",
      "created_at": "2025-06-07 18:04:02.649592+00",
      "popular": false
    },
    {
      "id": "77007b0d-e3c3-463b-acfc-123cf80eb83e",
      "brand_id": "526c2d41-52d1-4525-8aec-5498bb15e249",
      "slug": "luminor-marina-8-days",
      "label": "Luminor Marina 8 Days",
      "created_at": "2025-06-07 18:04:02.649592+00",
      "popular": false
    },
    {
      "id": "a520779d-eee6-4da2-8116-a532be78124e",
      "brand_id": "526c2d41-52d1-4525-8aec-5498bb15e249",
      "slug": "luminor-marina-automatic",
      "label": "Luminor Marina Automatic",
      "created_at": "2025-06-07 18:04:02.649592+00",
      "popular": false
    },
    {
      "id": "80494a50-6cf8-4b98-a6ce-d76ab4abaf5c",
      "brand_id": "526c2d41-52d1-4525-8aec-5498bb15e249",
      "slug": "luminor-north-pole",
      "label": "Luminor North Pole",
      "created_at": "2025-06-07 18:04:02.649592+00",
      "popular": false
    },
    {
      "id": "865c7d22-02ab-4762-a24d-d0dea73d7266",
      "brand_id": "526c2d41-52d1-4525-8aec-5498bb15e249",
      "slug": "luminor-power-reserve",
      "label": "Luminor Power Reserve",
      "created_at": "2025-06-07 18:04:02.649592+00",
      "popular": false
    },
    {
      "id": "961b81cd-6ec5-4b9f-8c7b-4da7c70fa606",
      "brand_id": "526c2d41-52d1-4525-8aec-5498bb15e249",
      "slug": "luminor-sealand",
      "label": "Luminor Sealand",
      "created_at": "2025-06-07 18:04:02.649592+00",
      "popular": false
    },
    {
      "id": "aa877f87-b73d-4e8a-a530-60face655f8b",
      "brand_id": "526c2d41-52d1-4525-8aec-5498bb15e249",
      "slug": "luminor-submersible",
      "label": "Luminor Submersible",
      "created_at": "2025-06-07 18:04:02.649592+00",
      "popular": false
    },
    {
      "id": "aeb2919e-3fc4-4352-931d-3af9d76e0672",
      "brand_id": "526c2d41-52d1-4525-8aec-5498bb15e249",
      "slug": "luminor-submersible-1950-3-days-automatic",
      "label": "Luminor Submersible 1950 3 Days Automatic",
      "created_at": "2025-06-07 18:04:02.649592+00",
      "popular": false
    },
    {
      "id": "3e00d310-1d70-46bd-bbf5-9e09703b75fc",
      "brand_id": "526c2d41-52d1-4525-8aec-5498bb15e249",
      "slug": "luminor-submersible-1950-depth-gauge",
      "label": "Luminor Submersible 1950 Depth Gauge",
      "created_at": "2025-06-07 18:04:02.649592+00",
      "popular": false
    },
    {
      "id": "f8c7de15-7480-462d-b880-41a6c585640c",
      "brand_id": "526c2d41-52d1-4525-8aec-5498bb15e249",
      "slug": "mare-nostrum",
      "label": "Mare Nostrum",
      "created_at": "2025-06-07 18:04:02.649592+00",
      "popular": false
    },
    {
      "id": "462d7a35-bb1c-4510-bf0c-460766e842e4",
      "brand_id": "526c2d41-52d1-4525-8aec-5498bb15e249",
      "slug": "radiomir-10-days-gmt",
      "label": "Radiomir 10 Days GMT",
      "created_at": "2025-06-07 18:04:02.649592+00",
      "popular": false
    },
    {
      "id": "d54153aa-134b-4933-a764-b494c11efeaf",
      "brand_id": "526c2d41-52d1-4525-8aec-5498bb15e249",
      "slug": "radiomir-1940",
      "label": "Radiomir 1940",
      "created_at": "2025-06-07 18:04:02.649592+00",
      "popular": false
    },
    {
      "id": "2d5b527f-47e5-4115-8752-2c85cb3cc914",
      "brand_id": "526c2d41-52d1-4525-8aec-5498bb15e249",
      "slug": "radiomir-1940-3-days",
      "label": "Radiomir 1940 3 Days",
      "created_at": "2025-06-07 18:04:02.649592+00",
      "popular": false
    },
    {
      "id": "5a3a0e97-4401-426f-9838-993bf18bd4ed",
      "brand_id": "526c2d41-52d1-4525-8aec-5498bb15e249",
      "slug": "radiomir-1940-3-days-automatic",
      "label": "Radiomir 1940 3 Days Automatic",
      "created_at": "2025-06-07 18:04:02.649592+00",
      "popular": false
    },
    {
      "id": "8a067b00-5f21-408c-824c-bcd5f4b8a77a",
      "brand_id": "526c2d41-52d1-4525-8aec-5498bb15e249",
      "slug": "radiomir-3-days-47-mm",
      "label": "Radiomir 3 Days 47 mm",
      "created_at": "2025-06-07 18:04:02.649592+00",
      "popular": false
    },
    {
      "id": "09dfd5b7-427a-4603-8de8-17c3aa7824e3",
      "brand_id": "526c2d41-52d1-4525-8aec-5498bb15e249",
      "slug": "radiomir-3-days-gmt",
      "label": "Radiomir 3 Days GMT",
      "created_at": "2025-06-07 18:04:02.649592+00",
      "popular": false
    },
    {
      "id": "bb7d2c80-0664-405b-affc-f6a4c6683e5d",
      "brand_id": "526c2d41-52d1-4525-8aec-5498bb15e249",
      "slug": "radiomir-8-days",
      "label": "Radiomir 8 Days",
      "created_at": "2025-06-07 18:04:02.649592+00",
      "popular": false
    },
    {
      "id": "0b7cffce-c68e-4c68-bbf4-0f06acc399b0",
      "brand_id": "526c2d41-52d1-4525-8aec-5498bb15e249",
      "slug": "radiomir-black-seal",
      "label": "Radiomir Black Seal",
      "created_at": "2025-06-07 18:04:02.649592+00",
      "popular": false
    },
    {
      "id": "ef261ab5-b645-4a8d-8771-43c8038a42da",
      "brand_id": "526c2d41-52d1-4525-8aec-5498bb15e249",
      "slug": "radiomir-black-seal-3-days-automatic",
      "label": "Radiomir Black Seal 3 Days Automatic",
      "created_at": "2025-06-07 18:04:02.649592+00",
      "popular": false
    },
    {
      "id": "2749da8e-31f6-4e36-8395-72dda3da4ec2",
      "brand_id": "526c2d41-52d1-4525-8aec-5498bb15e249",
      "slug": "radiomir-chronograph",
      "label": "Radiomir Chronograph",
      "created_at": "2025-06-07 18:04:02.649592+00",
      "popular": false
    },
    {
      "id": "d21dfb57-72a8-4886-a5e0-3802181014d7",
      "brand_id": "526c2d41-52d1-4525-8aec-5498bb15e249",
      "slug": "radiomir-gmt",
      "label": "Radiomir GMT",
      "created_at": "2025-06-07 18:04:02.649592+00",
      "popular": false
    },
    {
      "id": "4996a65b-dbb7-48cc-aef5-5c3598415c43",
      "brand_id": "526c2d41-52d1-4525-8aec-5498bb15e249",
      "slug": "radiomir-rattrapante",
      "label": "Radiomir Rattrapante",
      "created_at": "2025-06-07 18:04:02.649592+00",
      "popular": false
    },
    {
      "id": "0835c549-5692-45d9-929e-0d2024dc56c6",
      "brand_id": "526c2d41-52d1-4525-8aec-5498bb15e249",
      "slug": "radiomir-tourbillon-gmt",
      "label": "Radiomir Tourbillon GMT",
      "created_at": "2025-06-07 18:04:02.649592+00",
      "popular": false
    },
    {
      "id": "ce75f466-85ac-4c89-adb3-f45559e637f1",
      "brand_id": "526c2d41-52d1-4525-8aec-5498bb15e249",
      "slug": "special-editions",
      "label": "Special Editions",
      "created_at": "2025-06-07 18:04:02.649592+00",
      "popular": false
    },
    {
      "id": "98d1299a-fb30-4f37-8227-9d288a8fd235",
      "brand_id": "526c2d41-52d1-4525-8aec-5498bb15e249",
      "slug": "submersible-bmg-tech",
      "label": "Submersible BMG-Tech",
      "created_at": "2025-06-07 18:04:02.649592+00",
      "popular": false
    },
    {
      "id": "bbf61154-955a-4807-8b6c-8b96e4b1ce5c",
      "brand_id": "526c2d41-52d1-4525-8aec-5498bb15e249",
      "slug": "table-clock",
      "label": "Table Clock",
      "created_at": "2025-06-07 18:04:02.649592+00",
      "popular": false
    },
    {
      "id": "90ea7377-2997-4a5e-b520-3675fbcf1afd",
      "brand_id": "ead86a7d-9a6f-4ab5-935f-93621bf31df3",
      "slug": "altiplano",
      "label": "Altiplano",
      "created_at": "2025-06-07 18:04:02.649592+00",
      "popular": false
    },
    {
      "id": "4e9dd763-246b-48cd-a2fb-172740a4cafc",
      "brand_id": "ead86a7d-9a6f-4ab5-935f-93621bf31df3",
      "slug": "dancer",
      "label": "Dancer",
      "created_at": "2025-06-07 18:04:02.649592+00",
      "popular": false
    },
    {
      "id": "a894369d-b1b1-4a69-bb15-2d31e6184f3e",
      "brand_id": "ead86a7d-9a6f-4ab5-935f-93621bf31df3",
      "slug": "emperador",
      "label": "Emperador",
      "created_at": "2025-06-07 18:04:02.649592+00",
      "popular": false
    },
    {
      "id": "13cb1722-ec45-4df5-95bc-1421f309e552",
      "brand_id": "ead86a7d-9a6f-4ab5-935f-93621bf31df3",
      "slug": "gouverneur",
      "label": "Gouverneur",
      "created_at": "2025-06-07 18:04:02.649592+00",
      "popular": false
    },
    {
      "id": "61648871-09ae-493f-badc-7feeeb28e2b1",
      "brand_id": "ead86a7d-9a6f-4ab5-935f-93621bf31df3",
      "slug": "limelight",
      "label": "Limelight",
      "created_at": "2025-06-07 18:04:02.649592+00",
      "popular": false
    },
    {
      "id": "5d1b913f-1e36-4eaa-9577-cb4c98d75df6",
      "brand_id": "ead86a7d-9a6f-4ab5-935f-93621bf31df3",
      "slug": "polo",
      "label": "Polo",
      "created_at": "2025-06-07 18:04:02.649592+00",
      "popular": false
    },
    {
      "id": "0efb1828-c1ae-421b-9176-45e66f283c44",
      "brand_id": "ead86a7d-9a6f-4ab5-935f-93621bf31df3",
      "slug": "polo-fortyfive",
      "label": "Polo FortyFive",
      "created_at": "2025-06-07 18:04:02.649592+00",
      "popular": false
    },
    {
      "id": "c4b6e12e-29f4-4e58-9482-ca6b344301f7",
      "brand_id": "ead86a7d-9a6f-4ab5-935f-93621bf31df3",
      "slug": "polo-s",
      "label": "Polo S",
      "created_at": "2025-06-07 18:04:02.649592+00",
      "popular": false
    },
    {
      "id": "a2e19d40-c604-4945-9440-1fc8e0e20b14",
      "brand_id": "ead86a7d-9a6f-4ab5-935f-93621bf31df3",
      "slug": "possession",
      "label": "Possession",
      "created_at": "2025-06-07 18:04:02.649592+00",
      "popular": false
    },
    {
      "id": "4945c1af-7c1f-4727-9b01-b4aae3e2accf",
      "brand_id": "ead86a7d-9a6f-4ab5-935f-93621bf31df3",
      "slug": "protocole",
      "label": "Protocole",
      "created_at": "2025-06-07 18:04:02.649592+00",
      "popular": false
    },
    {
      "id": "242c5185-d14d-49e4-bdec-5160220e2907",
      "brand_id": "ead86a7d-9a6f-4ab5-935f-93621bf31df3",
      "slug": "tanagra",
      "label": "Tanagra",
      "created_at": "2025-06-07 18:04:02.649592+00",
      "popular": false
    },
    {
      "id": "bdcc59a8-e43b-4ac6-9238-ea92f854f990",
      "brand_id": "ead86a7d-9a6f-4ab5-935f-93621bf31df3",
      "slug": "upstream",
      "label": "Upstream",
      "created_at": "2025-06-07 18:04:02.649592+00",
      "popular": false
    },
    {
      "id": "2ed56505-4597-47e2-9837-e8574067364e",
      "brand_id": "42461112-f532-43a8-a727-d2df804d1940",
      "slug": "rm-005",
      "label": "RM 005",
      "created_at": "2025-06-07 18:04:02.649592+00",
      "popular": false
    },
    {
      "id": "aad22feb-664e-40e1-9847-5fad25430b25",
      "brand_id": "42461112-f532-43a8-a727-d2df804d1940",
      "slug": "rm-010",
      "label": "RM 010",
      "created_at": "2025-06-07 18:04:02.649592+00",
      "popular": false
    },
    {
      "id": "826c92d8-1a03-4fef-83df-9f9f1abfd077",
      "brand_id": "42461112-f532-43a8-a727-d2df804d1940",
      "slug": "rm-016",
      "label": "RM 016",
      "created_at": "2025-06-07 18:04:02.649592+00",
      "popular": false
    },
    {
      "id": "c73cac74-f045-4a8b-85e3-40b3187016be",
      "brand_id": "42461112-f532-43a8-a727-d2df804d1940",
      "slug": "rm-027",
      "label": "RM 027",
      "created_at": "2025-06-07 18:04:02.649592+00",
      "popular": false
    },
    {
      "id": "cafe516f-5e3b-4e69-b9aa-e41d43332562",
      "brand_id": "42461112-f532-43a8-a727-d2df804d1940",
      "slug": "rm-028",
      "label": "RM 028",
      "created_at": "2025-06-07 18:04:02.649592+00",
      "popular": false
    },
    {
      "id": "6134b0b7-25c5-4080-98e0-b624b816bd7c",
      "brand_id": "42461112-f532-43a8-a727-d2df804d1940",
      "slug": "rm-029",
      "label": "RM 029",
      "created_at": "2025-06-07 18:04:02.649592+00",
      "popular": false
    },
    {
      "id": "6a1c8925-8dfb-4926-b0b0-a1b999d16299",
      "brand_id": "42461112-f532-43a8-a727-d2df804d1940",
      "slug": "rm-030",
      "label": "RM 030",
      "created_at": "2025-06-07 18:04:02.649592+00",
      "popular": false
    },
    {
      "id": "4aa81776-3eb3-4954-aed0-ce740d8960b5",
      "brand_id": "42461112-f532-43a8-a727-d2df804d1940",
      "slug": "rm-032",
      "label": "RM 032",
      "created_at": "2025-06-07 18:04:02.649592+00",
      "popular": false
    },
    {
      "id": "f02f9e30-a830-434b-9ffd-1647c7503134",
      "brand_id": "42461112-f532-43a8-a727-d2df804d1940",
      "slug": "rm-037",
      "label": "RM 037",
      "created_at": "2025-06-07 18:04:02.649592+00",
      "popular": false
    },
    {
      "id": "1b6a9952-11eb-481d-9fc1-9d81fa6556ae",
      "brand_id": "42461112-f532-43a8-a727-d2df804d1940",
      "slug": "rm-052",
      "label": "RM 052",
      "created_at": "2025-06-07 18:04:02.907559+00",
      "popular": false
    },
    {
      "id": "2d163472-51e8-4698-ba19-83f0e7815a3b",
      "brand_id": "42461112-f532-43a8-a727-d2df804d1940",
      "slug": "rm-061",
      "label": "RM 061",
      "created_at": "2025-06-07 18:04:02.907559+00",
      "popular": false
    },
    {
      "id": "4e4615a0-4f3b-4799-8618-c6846dcf39ab",
      "brand_id": "42461112-f532-43a8-a727-d2df804d1940",
      "slug": "rm-07",
      "label": "RM 07",
      "created_at": "2025-06-07 18:04:02.907559+00",
      "popular": false
    },
    {
      "id": "2283144e-ec64-4b0f-bd12-fef04a874ccb",
      "brand_id": "42461112-f532-43a8-a727-d2df804d1940",
      "slug": "rm-43-01",
      "label": "RM 43-01",
      "created_at": "2025-06-07 18:04:02.907559+00",
      "popular": false
    },
    {
      "id": "69018055-cced-4f3b-abae-81a0718641f6",
      "brand_id": "42461112-f532-43a8-a727-d2df804d1940",
      "slug": "rm-63",
      "label": "RM 63",
      "created_at": "2025-06-07 18:04:02.907559+00",
      "popular": false
    },
    {
      "id": "c89f834f-8ddb-446d-917a-905cb9a15300",
      "brand_id": "42461112-f532-43a8-a727-d2df804d1940",
      "slug": "rm-67",
      "label": "RM 67",
      "created_at": "2025-06-07 18:04:02.907559+00",
      "popular": false
    },
    {
      "id": "dd29a3bc-c827-4921-a4f6-9d4d9cbc5f55",
      "brand_id": "42461112-f532-43a8-a727-d2df804d1940",
      "slug": "rm-69",
      "label": "RM 69",
      "created_at": "2025-06-07 18:04:02.907559+00",
      "popular": false
    },
    {
      "id": "212f782d-cc47-4ed2-bff2-953cd2eddcfa",
      "brand_id": "42461112-f532-43a8-a727-d2df804d1940",
      "slug": "rm-up-01",
      "label": "RM UP-01",
      "created_at": "2025-06-07 18:04:02.907559+00",
      "popular": false
    },
    {
      "id": "39bd0150-0e01-4d2f-9a76-209355df0a4a",
      "brand_id": "e42d3b7c-d1aa-4f5c-8736-94e8f6a00f13",
      "slug": "2000",
      "label": "2000",
      "created_at": "2025-06-07 18:04:02.907559+00",
      "popular": false
    },
    {
      "id": "345f3989-e9b4-42a1-a06f-f7a819f820c5",
      "brand_id": "e42d3b7c-d1aa-4f5c-8736-94e8f6a00f13",
      "slug": "6000",
      "label": "6000",
      "created_at": "2025-06-07 18:04:02.907559+00",
      "popular": false
    },
    {
      "id": "9b9a20e3-6909-4ef7-97f1-71f9e6e71881",
      "brand_id": "e42d3b7c-d1aa-4f5c-8736-94e8f6a00f13",
      "slug": "alter-ego",
      "label": "Alter Ego",
      "created_at": "2025-06-07 18:04:02.907559+00",
      "popular": false
    },
    {
      "id": "bfdfa971-2edb-4257-80dc-db102c16d889",
      "brand_id": "e42d3b7c-d1aa-4f5c-8736-94e8f6a00f13",
      "slug": "aquagraph",
      "label": "Aquagraph",
      "created_at": "2025-06-07 18:04:02.907559+00",
      "popular": false
    },
    {
      "id": "56b41347-6a52-4bef-adfe-e2dd9f85e15d",
      "brand_id": "e42d3b7c-d1aa-4f5c-8736-94e8f6a00f13",
      "slug": "aquaracer-300m",
      "label": "Aquaracer 300M",
      "created_at": "2025-06-07 18:04:02.907559+00",
      "popular": false
    },
    {
      "id": "3eb274fb-cb9f-4bc5-9b77-2bf3377e70e1",
      "brand_id": "e42d3b7c-d1aa-4f5c-8736-94e8f6a00f13",
      "slug": "aquaracer-500m",
      "label": "Aquaracer 500M",
      "created_at": "2025-06-07 18:04:02.907559+00",
      "popular": false
    },
    {
      "id": "0c24cfb2-d326-4f27-8813-3481865e3297",
      "brand_id": "e42d3b7c-d1aa-4f5c-8736-94e8f6a00f13",
      "slug": "aquaracer-lady",
      "label": "Aquaracer Lady",
      "created_at": "2025-06-07 18:04:02.907559+00",
      "popular": false
    },
    {
      "id": "adefca59-75ee-4f85-8976-ccd3126cfedc",
      "brand_id": "e42d3b7c-d1aa-4f5c-8736-94e8f6a00f13",
      "slug": "carrera-calibre-16",
      "label": "Carrera Calibre 16",
      "created_at": "2025-06-07 18:04:02.907559+00",
      "popular": false
    },
    {
      "id": "96539564-c399-4c02-b3db-236a4218ecdd",
      "brand_id": "e42d3b7c-d1aa-4f5c-8736-94e8f6a00f13",
      "slug": "carrera-calibre-17",
      "label": "Carrera Calibre 17",
      "created_at": "2025-06-07 18:04:02.907559+00",
      "popular": false
    },
    {
      "id": "5b6a31ee-771a-466b-b5cf-625f704e3d67",
      "brand_id": "e42d3b7c-d1aa-4f5c-8736-94e8f6a00f13",
      "slug": "carrera-calibre-18",
      "label": "Carrera Calibre 18",
      "created_at": "2025-06-07 18:04:02.907559+00",
      "popular": false
    },
    {
      "id": "c2e7eaa4-1ea7-4929-ab61-f97dffdbdb0e",
      "brand_id": "e42d3b7c-d1aa-4f5c-8736-94e8f6a00f13",
      "slug": "carrera-calibre-1887",
      "label": "Carrera Calibre 1887",
      "created_at": "2025-06-07 18:04:02.907559+00",
      "popular": false
    },
    {
      "id": "28bdb867-655b-4234-b26a-368ac5740bff",
      "brand_id": "e42d3b7c-d1aa-4f5c-8736-94e8f6a00f13",
      "slug": "carrera-calibre-36",
      "label": "Carrera Calibre 36",
      "created_at": "2025-06-07 18:04:02.907559+00",
      "popular": false
    },
    {
      "id": "6f68a3d7-6388-4831-b0cb-adb57e32990b",
      "brand_id": "e42d3b7c-d1aa-4f5c-8736-94e8f6a00f13",
      "slug": "carrera-calibre-5",
      "label": "Carrera Calibre 5",
      "created_at": "2025-06-07 18:04:02.907559+00",
      "popular": false
    },
    {
      "id": "ef262ab9-56d8-429f-85b0-17d6e4c5e244",
      "brand_id": "e42d3b7c-d1aa-4f5c-8736-94e8f6a00f13",
      "slug": "carrera-calibre-6",
      "label": "Carrera Calibre 6",
      "created_at": "2025-06-07 18:04:02.907559+00",
      "popular": false
    },
    {
      "id": "343daabc-2774-4e07-bbb4-41f07d4655a0",
      "brand_id": "e42d3b7c-d1aa-4f5c-8736-94e8f6a00f13",
      "slug": "carrera-calibre-7",
      "label": "Carrera Calibre 7",
      "created_at": "2025-06-07 18:04:02.907559+00",
      "popular": false
    },
    {
      "id": "47dddd91-321e-468b-bca7-2c7820a57a00",
      "brand_id": "e42d3b7c-d1aa-4f5c-8736-94e8f6a00f13",
      "slug": "carrera-calibre-8",
      "label": "Carrera Calibre 8",
      "created_at": "2025-06-07 18:04:02.907559+00",
      "popular": false
    },
    {
      "id": "87311bae-3b4a-4bd2-be27-0e4141ba2773",
      "brand_id": "e42d3b7c-d1aa-4f5c-8736-94e8f6a00f13",
      "slug": "carrera-heuer-01",
      "label": "Carrera HEUER 01",
      "created_at": "2025-06-07 18:04:02.907559+00",
      "popular": false
    },
    {
      "id": "1571c119-8dbe-4582-8254-11b29f3022c9",
      "brand_id": "e42d3b7c-d1aa-4f5c-8736-94e8f6a00f13",
      "slug": "carrera-heuer-02t",
      "label": "Carrera Heuer-02T",
      "created_at": "2025-06-07 18:04:02.907559+00",
      "popular": false
    },
    {
      "id": "0f81ef50-6f4a-4232-b069-52d0bea7bcc7",
      "brand_id": "e42d3b7c-d1aa-4f5c-8736-94e8f6a00f13",
      "slug": "carrera-lady",
      "label": "Carrera Lady",
      "created_at": "2025-06-07 18:04:02.907559+00",
      "popular": false
    },
    {
      "id": "de2c364f-2687-4bd2-9cce-c70abf6eb885",
      "brand_id": "e42d3b7c-d1aa-4f5c-8736-94e8f6a00f13",
      "slug": "carrera-mikrograph",
      "label": "Carrera Mikrograph",
      "created_at": "2025-06-07 18:04:02.907559+00",
      "popular": false
    },
    {
      "id": "ffef0544-9c14-448e-a380-a78c2d05f494",
      "brand_id": "e42d3b7c-d1aa-4f5c-8736-94e8f6a00f13",
      "slug": "carrera-porsche-chronograph-special-edition",
      "label": "Carrera Porsche Chronograph Special Edition",
      "created_at": "2025-06-07 18:04:02.907559+00",
      "popular": false
    },
    {
      "id": "ba996bf2-5b1e-4d56-b5b9-01903657863d",
      "brand_id": "e42d3b7c-d1aa-4f5c-8736-94e8f6a00f13",
      "slug": "formula-1-calibre-16",
      "label": "Formula 1 Calibre 16",
      "created_at": "2025-06-07 18:04:02.907559+00",
      "popular": false
    },
    {
      "id": "fca3bcbf-3d0d-4565-97e5-e493f3c908b6",
      "brand_id": "e42d3b7c-d1aa-4f5c-8736-94e8f6a00f13",
      "slug": "formula-1-calibre-5",
      "label": "Formula 1 Calibre 5",
      "created_at": "2025-06-07 18:04:02.907559+00",
      "popular": false
    },
    {
      "id": "e19ce8c2-fab8-4ad1-8473-a5c53ad58c99",
      "brand_id": "e42d3b7c-d1aa-4f5c-8736-94e8f6a00f13",
      "slug": "formula-1-calibre-6",
      "label": "Formula 1 Calibre 6",
      "created_at": "2025-06-07 18:04:02.907559+00",
      "popular": false
    },
    {
      "id": "bcb77250-4ca2-4955-a660-2b206d623b0d",
      "brand_id": "e42d3b7c-d1aa-4f5c-8736-94e8f6a00f13",
      "slug": "formula-1-calibre-7",
      "label": "Formula 1 Calibre 7",
      "created_at": "2025-06-07 18:04:02.907559+00",
      "popular": false
    },
    {
      "id": "fd8b9d0c-585e-416c-a395-c32944a9b827",
      "brand_id": "e42d3b7c-d1aa-4f5c-8736-94e8f6a00f13",
      "slug": "formula-1-lady",
      "label": "Formula 1 Lady",
      "created_at": "2025-06-07 18:04:02.907559+00",
      "popular": false
    },
    {
      "id": "7be2eb6e-0588-4c61-9fb9-acc193b23c84",
      "brand_id": "e42d3b7c-d1aa-4f5c-8736-94e8f6a00f13",
      "slug": "formula-1-quartz",
      "label": "Formula 1 Quartz",
      "created_at": "2025-06-07 18:04:02.907559+00",
      "popular": false
    },
    {
      "id": "ac789595-0aa5-4207-a9c1-7ccf989c8dd5",
      "brand_id": "e42d3b7c-d1aa-4f5c-8736-94e8f6a00f13",
      "slug": "formula-1-solargraph",
      "label": "Formula 1 Solargraph",
      "created_at": "2025-06-07 18:04:02.907559+00",
      "popular": false
    },
    {
      "id": "aecb410f-3468-4e74-98e3-09c902d9c15b",
      "brand_id": "e42d3b7c-d1aa-4f5c-8736-94e8f6a00f13",
      "slug": "grand-carrera",
      "label": "Grand Carrera",
      "created_at": "2025-06-07 18:04:02.907559+00",
      "popular": false
    },
    {
      "id": "dd6dd02b-f2db-4bae-b395-28e0f3c0598e",
      "brand_id": "e42d3b7c-d1aa-4f5c-8736-94e8f6a00f13",
      "slug": "kirium",
      "label": "Kirium",
      "created_at": "2025-06-07 18:04:02.907559+00",
      "popular": false
    },
    {
      "id": "f8918601-65b7-4a82-ba58-78d826a945f6",
      "brand_id": "e42d3b7c-d1aa-4f5c-8736-94e8f6a00f13",
      "slug": "link-calibre-16",
      "label": "Link Calibre 16",
      "created_at": "2025-06-07 18:04:02.907559+00",
      "popular": false
    },
    {
      "id": "6b78785a-5274-49ed-9993-be1c32030e22",
      "brand_id": "e42d3b7c-d1aa-4f5c-8736-94e8f6a00f13",
      "slug": "link-calibre-18",
      "label": "Link Calibre 18",
      "created_at": "2025-06-07 18:04:02.907559+00",
      "popular": false
    },
    {
      "id": "010204d6-89a5-4c03-8cb2-bf373b804dfd",
      "brand_id": "e42d3b7c-d1aa-4f5c-8736-94e8f6a00f13",
      "slug": "link-calibre-5",
      "label": "Link Calibre 5",
      "created_at": "2025-06-07 18:04:02.907559+00",
      "popular": false
    },
    {
      "id": "24f2e20c-7379-4fd9-8e69-fa06da8a6b5d",
      "brand_id": "e42d3b7c-d1aa-4f5c-8736-94e8f6a00f13",
      "slug": "link-calibre-6",
      "label": "Link Calibre 6",
      "created_at": "2025-06-07 18:04:02.907559+00",
      "popular": false
    },
    {
      "id": "89debdbd-d67f-4f7c-b104-dfef50fc7f14",
      "brand_id": "e42d3b7c-d1aa-4f5c-8736-94e8f6a00f13",
      "slug": "link-calibre-7",
      "label": "Link Calibre 7",
      "created_at": "2025-06-07 18:04:02.907559+00",
      "popular": false
    },
    {
      "id": "d7b6a6cd-021d-440f-8f3c-aad37c91e093",
      "brand_id": "e42d3b7c-d1aa-4f5c-8736-94e8f6a00f13",
      "slug": "link-lady",
      "label": "Link Lady",
      "created_at": "2025-06-07 18:04:02.907559+00",
      "popular": false
    },
    {
      "id": "0b13aed7-aa5f-4bec-aab9-e273668bb720",
      "brand_id": "e42d3b7c-d1aa-4f5c-8736-94e8f6a00f13",
      "slug": "link-quartz",
      "label": "Link Quartz",
      "created_at": "2025-06-07 18:04:02.907559+00",
      "popular": false
    },
    {
      "id": "6e511dd0-d2e2-4ec8-9430-dcd564580114",
      "brand_id": "e42d3b7c-d1aa-4f5c-8736-94e8f6a00f13",
      "slug": "microtimer",
      "label": "Microtimer",
      "created_at": "2025-06-07 18:04:02.907559+00",
      "popular": false
    },
    {
      "id": "bb99cb73-1976-4290-a394-594ffa45cdd5",
      "brand_id": "e42d3b7c-d1aa-4f5c-8736-94e8f6a00f13",
      "slug": "monaco-calibre-11",
      "label": "Monaco Calibre 11",
      "created_at": "2025-06-07 18:04:02.907559+00",
      "popular": false
    },
    {
      "id": "cd0ab9ec-8469-45ae-b1ba-e6a51d9acd15",
      "brand_id": "e42d3b7c-d1aa-4f5c-8736-94e8f6a00f13",
      "slug": "monaco-calibre-12",
      "label": "Monaco Calibre 12",
      "created_at": "2025-06-07 18:04:02.907559+00",
      "popular": false
    },
    {
      "id": "c28cb3ce-7cf4-4f01-828b-dce5b3e44808",
      "brand_id": "e42d3b7c-d1aa-4f5c-8736-94e8f6a00f13",
      "slug": "monaco-calibre-36",
      "label": "Monaco Calibre 36",
      "created_at": "2025-06-07 18:04:02.907559+00",
      "popular": false
    },
    {
      "id": "ef1131a6-f7b2-4d04-ac82-86e1bf9afcc8",
      "brand_id": "e42d3b7c-d1aa-4f5c-8736-94e8f6a00f13",
      "slug": "monaco-calibre-6",
      "label": "Monaco Calibre 6",
      "created_at": "2025-06-07 18:04:02.907559+00",
      "popular": false
    },
    {
      "id": "4970c89b-010f-4029-98ee-f4f7fa5515a4",
      "brand_id": "e42d3b7c-d1aa-4f5c-8736-94e8f6a00f13",
      "slug": "monaco-lady",
      "label": "Monaco Lady",
      "created_at": "2025-06-07 18:04:02.907559+00",
      "popular": false
    },
    {
      "id": "5c746600-7292-4d9a-b285-da9318b61092",
      "brand_id": "e42d3b7c-d1aa-4f5c-8736-94e8f6a00f13",
      "slug": "monaco-v4",
      "label": "Monaco V4",
      "created_at": "2025-06-07 18:04:02.907559+00",
      "popular": false
    },
    {
      "id": "67ad3396-5b60-46dc-8a55-53cc01057573",
      "brand_id": "e42d3b7c-d1aa-4f5c-8736-94e8f6a00f13",
      "slug": "professional-golf-watch",
      "label": "Professional Golf Watch",
      "created_at": "2025-06-07 18:04:02.907559+00",
      "popular": false
    },
    {
      "id": "cbbfb4dd-d0df-47e5-b441-36e401697fec",
      "brand_id": "e42d3b7c-d1aa-4f5c-8736-94e8f6a00f13",
      "slug": "silverstone",
      "label": "Silverstone",
      "created_at": "2025-06-07 18:04:02.907559+00",
      "popular": false
    },
    {
      "id": "d214166b-1648-430b-b72a-87bd8c9c6549",
      "brand_id": "e42d3b7c-d1aa-4f5c-8736-94e8f6a00f13",
      "slug": "slr",
      "label": "SLR",
      "created_at": "2025-06-07 18:04:02.907559+00",
      "popular": false
    },
    {
      "id": "799d3b34-cce8-45c6-86aa-0e0ec66804a6",
      "brand_id": "e42d3b7c-d1aa-4f5c-8736-94e8f6a00f13",
      "slug": "targa-florio",
      "label": "Targa Florio",
      "created_at": "2025-06-07 18:04:02.907559+00",
      "popular": false
    },
    {
      "id": "c2f5ad76-bd88-44ab-8f2a-8ef8893f1022",
      "brand_id": "27c95066-ebb0-47d8-9ea9-e5dc6561ca37",
      "slug": "5",
      "label": "5",
      "created_at": "2025-06-07 18:04:02.907559+00",
      "popular": false
    },
    {
      "id": "6c286a5e-bc45-4deb-80a3-27bf13d7056f",
      "brand_id": "27c95066-ebb0-47d8-9ea9-e5dc6561ca37",
      "slug": "5-sports",
      "label": "5 Sports",
      "created_at": "2025-06-07 18:04:02.907559+00",
      "popular": false
    },
    {
      "id": "32b16131-b53f-481e-a365-3bb192ac809d",
      "brand_id": "27c95066-ebb0-47d8-9ea9-e5dc6561ca37",
      "slug": "alpinist",
      "label": "Alpinist",
      "created_at": "2025-06-07 18:04:02.907559+00",
      "popular": false
    },
    {
      "id": "27845f7b-bf2e-4c19-a022-4a3b8eeef6f0",
      "brand_id": "27c95066-ebb0-47d8-9ea9-e5dc6561ca37",
      "slug": "ananta",
      "label": "Ananta",
      "created_at": "2025-06-07 18:04:02.907559+00",
      "popular": false
    },
    {
      "id": "129c9677-2f0d-4034-86e0-c9df95ea0019",
      "brand_id": "27c95066-ebb0-47d8-9ea9-e5dc6561ca37",
      "slug": "arctura",
      "label": "Arctura",
      "created_at": "2025-06-07 18:04:02.907559+00",
      "popular": false
    },
    {
      "id": "f61a35c7-48f7-431d-9bf5-4ccf7832308c",
      "brand_id": "27c95066-ebb0-47d8-9ea9-e5dc6561ca37",
      "slug": "astron",
      "label": "Astron",
      "created_at": "2025-06-07 18:04:02.907559+00",
      "popular": false
    },
    {
      "id": "7aae5611-f7ba-4d1d-a657-47980106f218",
      "brand_id": "27c95066-ebb0-47d8-9ea9-e5dc6561ca37",
      "slug": "astron-gps-solar",
      "label": "Astron GPS Solar",
      "created_at": "2025-06-07 18:04:02.907559+00",
      "popular": false
    },
    {
      "id": "ac4b9a16-7b6f-4b2e-9273-f016c89312ec",
      "brand_id": "27c95066-ebb0-47d8-9ea9-e5dc6561ca37",
      "slug": "astron-gps-solar-chronograph",
      "label": "Astron GPS Solar Chronograph",
      "created_at": "2025-06-07 18:04:02.907559+00",
      "popular": false
    },
    {
      "id": "0f802efe-4eba-471f-bd98-b4c1aa2f7660",
      "brand_id": "27c95066-ebb0-47d8-9ea9-e5dc6561ca37",
      "slug": "bell-matic",
      "label": "Bell Matic",
      "created_at": "2025-06-07 18:04:02.907559+00",
      "popular": false
    },
    {
      "id": "f261615e-7e7e-4ca6-a4ea-9561f6f832cb",
      "brand_id": "27c95066-ebb0-47d8-9ea9-e5dc6561ca37",
      "slug": "brightz",
      "label": "Brightz",
      "created_at": "2025-06-07 18:04:02.907559+00",
      "popular": false
    },
    {
      "id": "a55b8dfc-8320-4487-aba4-8bccea02d04c",
      "brand_id": "27c95066-ebb0-47d8-9ea9-e5dc6561ca37",
      "slug": "bullhead",
      "label": "Bullhead",
      "created_at": "2025-06-07 18:04:02.907559+00",
      "popular": false
    },
    {
      "id": "f8b07a59-f5fd-43c4-92f0-6dfb42cae5a2",
      "brand_id": "27c95066-ebb0-47d8-9ea9-e5dc6561ca37",
      "slug": "chronograph",
      "label": "Chronograph",
      "created_at": "2025-06-07 18:04:02.907559+00",
      "popular": false
    },
    {
      "id": "0222eace-82d0-4104-a7c4-f301f476c50a",
      "brand_id": "27c95066-ebb0-47d8-9ea9-e5dc6561ca37",
      "slug": "coutura",
      "label": "Coutura",
      "created_at": "2025-06-07 18:04:02.907559+00",
      "popular": false
    },
    {
      "id": "38c6426f-b491-4077-8bd7-3a28ff27e340",
      "brand_id": "27c95066-ebb0-47d8-9ea9-e5dc6561ca37",
      "slug": "credor",
      "label": "Credor",
      "created_at": "2025-06-07 18:04:02.907559+00",
      "popular": false
    },
    {
      "id": "9b1d93de-43de-4aac-b868-b15819a52060",
      "brand_id": "27c95066-ebb0-47d8-9ea9-e5dc6561ca37",
      "slug": "dolce",
      "label": "Dolce",
      "created_at": "2025-06-07 18:04:02.907559+00",
      "popular": false
    },
    {
      "id": "4c51b847-7d41-4d98-a081-bbc377d83d78",
      "brand_id": "27c95066-ebb0-47d8-9ea9-e5dc6561ca37",
      "slug": "galante",
      "label": "Galante",
      "created_at": "2025-06-07 18:04:02.907559+00",
      "popular": false
    },
    {
      "id": "49fc2da0-4345-4a7c-8201-b20d66722104",
      "brand_id": "27c95066-ebb0-47d8-9ea9-e5dc6561ca37",
      "slug": "grand-quartz",
      "label": "Grand Quartz",
      "created_at": "2025-06-07 18:04:02.907559+00",
      "popular": false
    },
    {
      "id": "7f483388-f752-4927-b038-86b13d8bcffd",
      "brand_id": "27c95066-ebb0-47d8-9ea9-e5dc6561ca37",
      "slug": "gs",
      "label": "GS",
      "created_at": "2025-06-07 18:04:02.907559+00",
      "popular": false
    },
    {
      "id": "efa42faf-21e5-4b48-a311-6e5b3294b747",
      "brand_id": "27c95066-ebb0-47d8-9ea9-e5dc6561ca37",
      "slug": "kinetic",
      "label": "Kinetic",
      "created_at": "2025-06-07 18:04:02.907559+00",
      "popular": false
    },
    {
      "id": "0ed277a5-94af-4aef-b729-4887604007a5",
      "brand_id": "27c95066-ebb0-47d8-9ea9-e5dc6561ca37",
      "slug": "king",
      "label": "King",
      "created_at": "2025-06-07 18:04:02.907559+00",
      "popular": false
    },
    {
      "id": "de7269db-5da5-447b-a049-4df80d1a5aeb",
      "brand_id": "27c95066-ebb0-47d8-9ea9-e5dc6561ca37",
      "slug": "lord-matic",
      "label": "Lord Matic",
      "created_at": "2025-06-07 18:04:02.907559+00",
      "popular": false
    },
    {
      "id": "0c7248c3-4fcd-4b18-b115-30faee2a823b",
      "brand_id": "27c95066-ebb0-47d8-9ea9-e5dc6561ca37",
      "slug": "lukia",
      "label": "Lukia",
      "created_at": "2025-06-07 18:04:02.907559+00",
      "popular": false
    },
    {
      "id": "225692e9-5640-476b-97af-3eeb3445189e",
      "brand_id": "27c95066-ebb0-47d8-9ea9-e5dc6561ca37",
      "slug": "marinemaster",
      "label": "MarineMaster",
      "created_at": "2025-06-07 18:04:02.907559+00",
      "popular": false
    },
    {
      "id": "9afd8eb0-2110-4b68-8eb9-64865ae919ce",
      "brand_id": "27c95066-ebb0-47d8-9ea9-e5dc6561ca37",
      "slug": "monster",
      "label": "Monster",
      "created_at": "2025-06-07 18:04:02.907559+00",
      "popular": false
    },
    {
      "id": "8daefa06-189b-4ee9-b1ab-2609489a810f",
      "brand_id": "27c95066-ebb0-47d8-9ea9-e5dc6561ca37",
      "slug": "neo-classic",
      "label": "Neo Classic",
      "created_at": "2025-06-07 18:04:02.907559+00",
      "popular": false
    },
    {
      "id": "5d10ad96-579a-4a1d-91a2-45e33097df8f",
      "brand_id": "27c95066-ebb0-47d8-9ea9-e5dc6561ca37",
      "slug": "premier",
      "label": "Premier",
      "created_at": "2025-06-07 18:04:02.907559+00",
      "popular": false
    },
    {
      "id": "0c7c82b9-9d50-44f9-90f3-d9b6046b4226",
      "brand_id": "27c95066-ebb0-47d8-9ea9-e5dc6561ca37",
      "slug": "premier-automatic",
      "label": "Premier Automatic",
      "created_at": "2025-06-07 18:04:02.907559+00",
      "popular": false
    },
    {
      "id": "8ae60678-be74-44e5-bf37-04d574a0a412",
      "brand_id": "27c95066-ebb0-47d8-9ea9-e5dc6561ca37",
      "slug": "premier-kinetic-direct-drive",
      "label": "Premier Kinetic Direct Drive",
      "created_at": "2025-06-07 18:04:02.907559+00",
      "popular": false
    },
    {
      "id": "89661d97-abf2-42fb-b5e2-dc402b48c790",
      "brand_id": "27c95066-ebb0-47d8-9ea9-e5dc6561ca37",
      "slug": "premier-kinetic-perpetual",
      "label": "Premier Kinetic Perpetual",
      "created_at": "2025-06-07 18:04:02.907559+00",
      "popular": false
    },
    {
      "id": "f6672e12-b641-424b-83f3-762fc282b5c8",
      "brand_id": "27c95066-ebb0-47d8-9ea9-e5dc6561ca37",
      "slug": "presage",
      "label": "Presage",
      "created_at": "2025-06-07 18:04:02.907559+00",
      "popular": false
    },
    {
      "id": "bd6956e2-d28a-4e6a-9814-2cded41aaf1f",
      "brand_id": "27c95066-ebb0-47d8-9ea9-e5dc6561ca37",
      "slug": "prospex",
      "label": "Prospex",
      "created_at": "2025-06-07 18:04:02.907559+00",
      "popular": false
    },
    {
      "id": "eb9c702b-a800-463b-b1b5-dc4ddad94bbb",
      "brand_id": "27c95066-ebb0-47d8-9ea9-e5dc6561ca37",
      "slug": "scuba",
      "label": "Scuba",
      "created_at": "2025-06-07 18:04:02.907559+00",
      "popular": false
    },
    {
      "id": "292402db-b501-4b1f-b107-ea47891d1755",
      "brand_id": "27c95066-ebb0-47d8-9ea9-e5dc6561ca37",
      "slug": "seikomatic",
      "label": "Seikomatic",
      "created_at": "2025-06-07 18:04:02.907559+00",
      "popular": false
    },
    {
      "id": "638745bb-8da5-4e33-a90f-07adf4ce8995",
      "brand_id": "27c95066-ebb0-47d8-9ea9-e5dc6561ca37",
      "slug": "selection",
      "label": "Selection",
      "created_at": "2025-06-07 18:04:02.907559+00",
      "popular": false
    },
    {
      "id": "111ba2c7-eb34-4293-a3df-669f278b0b18",
      "brand_id": "27c95066-ebb0-47d8-9ea9-e5dc6561ca37",
      "slug": "solar",
      "label": "Solar",
      "created_at": "2025-06-07 18:04:03.138118+00",
      "popular": false
    },
    {
      "id": "97b3eee8-4309-464a-8846-cb2bbaadf695",
      "brand_id": "27c95066-ebb0-47d8-9ea9-e5dc6561ca37",
      "slug": "spirit",
      "label": "Spirit",
      "created_at": "2025-06-07 18:04:03.138118+00",
      "popular": false
    },
    {
      "id": "32072ff8-6e20-46bf-af61-cdab26771efe",
      "brand_id": "27c95066-ebb0-47d8-9ea9-e5dc6561ca37",
      "slug": "sportura",
      "label": "Sportura",
      "created_at": "2025-06-07 18:04:03.138118+00",
      "popular": false
    },
    {
      "id": "63ba8905-5fb9-4166-b222-6839adbf0c6e",
      "brand_id": "27c95066-ebb0-47d8-9ea9-e5dc6561ca37",
      "slug": "superior",
      "label": "Superior",
      "created_at": "2025-06-07 18:04:03.138118+00",
      "popular": false
    },
    {
      "id": "e3f87881-2ca8-4042-bd28-efe2be339c5b",
      "brand_id": "27c95066-ebb0-47d8-9ea9-e5dc6561ca37",
      "slug": "velatura",
      "label": "Velatura",
      "created_at": "2025-06-07 18:04:03.138118+00",
      "popular": false
    },
    {
      "id": "6803630c-66b8-4d7e-9245-5b93c5a36c83",
      "brand_id": "27c95066-ebb0-47d8-9ea9-e5dc6561ca37",
      "slug": "velatura-chronograph",
      "label": "Velatura Chronograph",
      "created_at": "2025-06-07 18:04:03.138118+00",
      "popular": false
    },
    {
      "id": "776d6f45-d88e-40de-9319-4f8a40c67a22",
      "brand_id": "27c95066-ebb0-47d8-9ea9-e5dc6561ca37",
      "slug": "velatura-kinetic-direct-drive",
      "label": "Velatura Kinetic Direct Drive",
      "created_at": "2025-06-07 18:04:03.138118+00",
      "popular": false
    },
    {
      "id": "0461b6dc-3cf6-4fb0-a349-089d545addf1",
      "brand_id": "27c95066-ebb0-47d8-9ea9-e5dc6561ca37",
      "slug": "world-time",
      "label": "World Time",
      "created_at": "2025-06-07 18:04:03.138118+00",
      "popular": false
    },
    {
      "id": "b8791776-88b0-4dce-b1fd-03d82ab4cd34",
      "brand_id": "5ca76279-4b2d-4ad6-9b9c-58d16e3c0a94",
      "slug": "archeo",
      "label": "Archeo",
      "created_at": "2025-06-07 18:04:03.138118+00",
      "popular": false
    },
    {
      "id": "8497e494-19a5-4224-b8fb-cd2b8d5fce70",
      "brand_id": "5ca76279-4b2d-4ad6-9b9c-58d16e3c0a94",
      "slug": "black-bay-32",
      "label": "Black Bay 32",
      "created_at": "2025-06-07 18:04:03.138118+00",
      "popular": false
    },
    {
      "id": "243207b3-4741-481e-a4cb-20ae5efa8ddc",
      "brand_id": "5ca76279-4b2d-4ad6-9b9c-58d16e3c0a94",
      "slug": "black-bay-36",
      "label": "Black Bay 36",
      "created_at": "2025-06-07 18:04:03.138118+00",
      "popular": false
    },
    {
      "id": "9baab0b3-76cf-4d0b-be58-9e73a77b7054",
      "brand_id": "5ca76279-4b2d-4ad6-9b9c-58d16e3c0a94",
      "slug": "black-bay-41",
      "label": "Black Bay 41",
      "created_at": "2025-06-07 18:04:03.138118+00",
      "popular": false
    },
    {
      "id": "0d8316d1-a8c4-48f8-aeee-dcbe52e880ad",
      "brand_id": "5ca76279-4b2d-4ad6-9b9c-58d16e3c0a94",
      "slug": "black-bay-54",
      "label": "Black Bay 54",
      "created_at": "2025-06-07 18:04:03.138118+00",
      "popular": false
    },
    {
      "id": "f0f4c25e-24a2-4175-99e8-8b38357d534d",
      "brand_id": "5ca76279-4b2d-4ad6-9b9c-58d16e3c0a94",
      "slug": "black-bay-68",
      "label": "Black Bay 68",
      "created_at": "2025-06-07 18:04:03.138118+00",
      "popular": false
    },
    {
      "id": "424f3048-5c4f-45a5-9751-bc5f87756492",
      "brand_id": "5ca76279-4b2d-4ad6-9b9c-58d16e3c0a94",
      "slug": "black-bay-bronze",
      "label": "Black Bay Bronze",
      "created_at": "2025-06-07 18:04:03.138118+00",
      "popular": false
    },
    {
      "id": "8e580ca7-4374-4d07-bd73-c9b30dbac870",
      "brand_id": "5ca76279-4b2d-4ad6-9b9c-58d16e3c0a94",
      "slug": "black-bay-chrono",
      "label": "Black Bay Chrono",
      "created_at": "2025-06-07 18:04:03.138118+00",
      "popular": false
    },
    {
      "id": "fda5e55c-847c-434d-8363-28ecabe1e1a3",
      "brand_id": "5ca76279-4b2d-4ad6-9b9c-58d16e3c0a94",
      "slug": "black-bay-dark",
      "label": "Black Bay Dark",
      "created_at": "2025-06-07 18:04:03.138118+00",
      "popular": false
    },
    {
      "id": "27542e96-b1d7-4cc8-aaef-958276d5ca59",
      "brand_id": "5ca76279-4b2d-4ad6-9b9c-58d16e3c0a94",
      "slug": "black-bay-fifty-eight",
      "label": "Black Bay Fifty-Eight",
      "created_at": "2025-06-07 18:04:03.138118+00",
      "popular": false
    },
    {
      "id": "58fc857f-034b-4ea8-9d6d-96349a725bb1",
      "brand_id": "5ca76279-4b2d-4ad6-9b9c-58d16e3c0a94",
      "slug": "black-bay-gmt",
      "label": "Black Bay GMT",
      "created_at": "2025-06-07 18:04:03.138118+00",
      "popular": false
    },
    {
      "id": "1c4e6c7c-fe3e-4e25-9f59-0e999d94aab1",
      "brand_id": "5ca76279-4b2d-4ad6-9b9c-58d16e3c0a94",
      "slug": "black-bay-pro",
      "label": "Black Bay Pro",
      "created_at": "2025-06-07 18:04:03.138118+00",
      "popular": false
    },
    {
      "id": "5b87d06e-a894-4e1f-8d0c-cd296871762a",
      "brand_id": "5ca76279-4b2d-4ad6-9b9c-58d16e3c0a94",
      "slug": "black-bay-s-g",
      "label": "Black Bay S & G",
      "created_at": "2025-06-07 18:04:03.138118+00",
      "popular": false
    },
    {
      "id": "01b17732-3b98-4158-8009-3241a3e4c65e",
      "brand_id": "5ca76279-4b2d-4ad6-9b9c-58d16e3c0a94",
      "slug": "black-bay-steel",
      "label": "Black Bay Steel",
      "created_at": "2025-06-07 18:04:03.138118+00",
      "popular": false
    },
    {
      "id": "a757df0a-b56d-48b2-b291-b1c8156e0d26",
      "brand_id": "5ca76279-4b2d-4ad6-9b9c-58d16e3c0a94",
      "slug": "chronautic",
      "label": "Chronautic",
      "created_at": "2025-06-07 18:04:03.138118+00",
      "popular": false
    },
    {
      "id": "29723587-eb05-4b2a-a271-bfa1d973ac48",
      "brand_id": "5ca76279-4b2d-4ad6-9b9c-58d16e3c0a94",
      "slug": "clair-de-rose",
      "label": "Clair de Rose",
      "created_at": "2025-06-07 18:04:03.138118+00",
      "popular": false
    },
    {
      "id": "8d60e2f3-3cc2-47e8-91a4-ed4137bbee28",
      "brand_id": "5ca76279-4b2d-4ad6-9b9c-58d16e3c0a94",
      "slug": "classic",
      "label": "Classic",
      "created_at": "2025-06-07 18:04:03.138118+00",
      "popular": false
    },
    {
      "id": "253f0d0d-c433-44ad-8271-cd20c525ce94",
      "brand_id": "5ca76279-4b2d-4ad6-9b9c-58d16e3c0a94",
      "slug": "fastrider",
      "label": "Fastrider",
      "created_at": "2025-06-07 18:04:03.138118+00",
      "popular": false
    },
    {
      "id": "231e37c9-4e89-4416-be26-473449ef9dc3",
      "brand_id": "5ca76279-4b2d-4ad6-9b9c-58d16e3c0a94",
      "slug": "fastrider-black-shield",
      "label": "Fastrider Black Shield",
      "created_at": "2025-06-07 18:04:03.138118+00",
      "popular": false
    },
    {
      "id": "2998363e-e223-4425-8c26-a9f2f6a01e84",
      "brand_id": "5ca76279-4b2d-4ad6-9b9c-58d16e3c0a94",
      "slug": "fastrider-chrono",
      "label": "Fastrider Chrono",
      "created_at": "2025-06-07 18:04:03.138118+00",
      "popular": false
    },
    {
      "id": "b5a4edc0-884e-4b2d-9dcc-0be81c514ac4",
      "brand_id": "5ca76279-4b2d-4ad6-9b9c-58d16e3c0a94",
      "slug": "glamour-date",
      "label": "Glamour Date",
      "created_at": "2025-06-07 18:04:03.138118+00",
      "popular": false
    },
    {
      "id": "c5287dec-09b2-4028-8f51-9c89b2edb1ca",
      "brand_id": "5ca76279-4b2d-4ad6-9b9c-58d16e3c0a94",
      "slug": "glamour-date-day",
      "label": "Glamour Date-Day",
      "created_at": "2025-06-07 18:04:03.138118+00",
      "popular": false
    },
    {
      "id": "4f3aed16-db29-42f6-8c94-f44bca689909",
      "brand_id": "5ca76279-4b2d-4ad6-9b9c-58d16e3c0a94",
      "slug": "glamour-double-date",
      "label": "Glamour Double Date",
      "created_at": "2025-06-07 18:04:03.138118+00",
      "popular": false
    },
    {
      "id": "fe26a4e3-4da2-41c2-ab82-bc80c9381373",
      "brand_id": "5ca76279-4b2d-4ad6-9b9c-58d16e3c0a94",
      "slug": "grantour",
      "label": "Grantour",
      "created_at": "2025-06-07 18:04:03.138118+00",
      "popular": false
    },
    {
      "id": "9b0d9ea6-06d8-4327-9ec9-f2c3f83e15aa",
      "brand_id": "5ca76279-4b2d-4ad6-9b9c-58d16e3c0a94",
      "slug": "grantour-chrono",
      "label": "Grantour Chrono",
      "created_at": "2025-06-07 18:04:03.138118+00",
      "popular": false
    },
    {
      "id": "3a0cb73b-f8cb-45d1-8d5a-b6186d786fa2",
      "brand_id": "5ca76279-4b2d-4ad6-9b9c-58d16e3c0a94",
      "slug": "grantour-chrono-fly-back",
      "label": "Grantour Chrono Fly-Back",
      "created_at": "2025-06-07 18:04:03.138118+00",
      "popular": false
    },
    {
      "id": "adc9d362-5410-4147-bb42-f25079b45b70",
      "brand_id": "5ca76279-4b2d-4ad6-9b9c-58d16e3c0a94",
      "slug": "grantour-date",
      "label": "Grantour Date",
      "created_at": "2025-06-07 18:04:03.138118+00",
      "popular": false
    },
    {
      "id": "ac6547f3-aace-4c7f-b8e2-d8fe9a493186",
      "brand_id": "5ca76279-4b2d-4ad6-9b9c-58d16e3c0a94",
      "slug": "heritage",
      "label": "Heritage",
      "created_at": "2025-06-07 18:04:03.138118+00",
      "popular": false
    },
    {
      "id": "b7cdbc1c-169b-45cd-9564-dc5a5d680f35",
      "brand_id": "5ca76279-4b2d-4ad6-9b9c-58d16e3c0a94",
      "slug": "heritage-advisor",
      "label": "Heritage Advisor",
      "created_at": "2025-06-07 18:04:03.138118+00",
      "popular": false
    },
    {
      "id": "c39c311e-2d98-4a28-8b13-9c7bba3e4b5b",
      "brand_id": "5ca76279-4b2d-4ad6-9b9c-58d16e3c0a94",
      "slug": "heritage-chrono-blue",
      "label": "Heritage Chrono Blue",
      "created_at": "2025-06-07 18:04:03.138118+00",
      "popular": false
    },
    {
      "id": "c79a1c80-9ade-40f2-8868-4c6c4298e887",
      "brand_id": "5ca76279-4b2d-4ad6-9b9c-58d16e3c0a94",
      "slug": "heritage-ranger",
      "label": "Heritage Ranger",
      "created_at": "2025-06-07 18:04:03.138118+00",
      "popular": false
    },
    {
      "id": "e9819665-2533-465a-8b9a-12dcd7c5d5ed",
      "brand_id": "5ca76279-4b2d-4ad6-9b9c-58d16e3c0a94",
      "slug": "hydronaut",
      "label": "Hydronaut",
      "created_at": "2025-06-07 18:04:03.138118+00",
      "popular": false
    },
    {
      "id": "c0778224-6029-4882-9fe3-c039b7fea9a3",
      "brand_id": "5ca76279-4b2d-4ad6-9b9c-58d16e3c0a94",
      "slug": "hydronaut-ii",
      "label": "Hydronaut II",
      "created_at": "2025-06-07 18:04:03.138118+00",
      "popular": false
    },
    {
      "id": "62a6f18c-e085-42c8-bb39-80aca7a7e5ea",
      "brand_id": "5ca76279-4b2d-4ad6-9b9c-58d16e3c0a94",
      "slug": "iconaut",
      "label": "Iconaut",
      "created_at": "2025-06-07 18:04:03.138118+00",
      "popular": false
    },
    {
      "id": "023a3067-1c30-41df-9d89-c92989a0edd6",
      "brand_id": "5ca76279-4b2d-4ad6-9b9c-58d16e3c0a94",
      "slug": "le-royer",
      "label": "Le Royer",
      "created_at": "2025-06-07 18:04:03.138118+00",
      "popular": false
    },
    {
      "id": "d271be60-1b6b-49e2-9759-13fd45874787",
      "brand_id": "5ca76279-4b2d-4ad6-9b9c-58d16e3c0a94",
      "slug": "monarch",
      "label": "Monarch",
      "created_at": "2025-06-07 18:04:03.138118+00",
      "popular": false
    },
    {
      "id": "f715d595-7372-4e56-8844-61ca001079bf",
      "brand_id": "5ca76279-4b2d-4ad6-9b9c-58d16e3c0a94",
      "slug": "montecarlo",
      "label": "Montecarlo",
      "created_at": "2025-06-07 18:04:03.138118+00",
      "popular": false
    },
    {
      "id": "a07614b6-4fb7-49e9-afef-978af89f58f8",
      "brand_id": "5ca76279-4b2d-4ad6-9b9c-58d16e3c0a94",
      "slug": "north-flag",
      "label": "North Flag",
      "created_at": "2025-06-07 18:04:03.138118+00",
      "popular": false
    },
    {
      "id": "f29d6c04-0f1d-4d7c-9683-8ea296a8f5cd",
      "brand_id": "5ca76279-4b2d-4ad6-9b9c-58d16e3c0a94",
      "slug": "oysterdate-big-block",
      "label": "Oysterdate Big Block",
      "created_at": "2025-06-07 18:04:03.138118+00",
      "popular": false
    },
    {
      "id": "eed709b8-603f-4f8e-8968-715741d8f976",
      "brand_id": "5ca76279-4b2d-4ad6-9b9c-58d16e3c0a94",
      "slug": "oyster-prince",
      "label": "Oyster Prince",
      "created_at": "2025-06-07 18:04:03.138118+00",
      "popular": false
    },
    {
      "id": "590bb215-4423-4d0a-9fa3-3aa6fc0d208e",
      "brand_id": "5ca76279-4b2d-4ad6-9b9c-58d16e3c0a94",
      "slug": "pelagos-ultra",
      "label": "Pelagos Ultra",
      "created_at": "2025-06-07 18:04:03.138118+00",
      "popular": false
    },
    {
      "id": "9c59da5c-4a15-43c0-a2e9-663056c10610",
      "brand_id": "5ca76279-4b2d-4ad6-9b9c-58d16e3c0a94",
      "slug": "prince",
      "label": "Prince",
      "created_at": "2025-06-07 18:04:03.138118+00",
      "popular": false
    },
    {
      "id": "b97bd70b-1465-4417-b121-8689d471d358",
      "brand_id": "5ca76279-4b2d-4ad6-9b9c-58d16e3c0a94",
      "slug": "prince-date",
      "label": "Prince Date",
      "created_at": "2025-06-07 18:04:03.138118+00",
      "popular": false
    },
    {
      "id": "425dd237-b218-4dd1-8223-7e9c1c2ea45e",
      "brand_id": "5ca76279-4b2d-4ad6-9b9c-58d16e3c0a94",
      "slug": "prince-date-day",
      "label": "Prince Date Day",
      "created_at": "2025-06-07 18:04:03.138118+00",
      "popular": false
    },
    {
      "id": "2676da5e-cc94-4dbc-bd08-beb336e74f9e",
      "brand_id": "5ca76279-4b2d-4ad6-9b9c-58d16e3c0a94",
      "slug": "prince-oysterdate",
      "label": "Prince Oysterdate",
      "created_at": "2025-06-07 18:04:03.138118+00",
      "popular": false
    },
    {
      "id": "69ee6a72-83a4-4f14-989b-9b1b4ef7c6aa",
      "brand_id": "5ca76279-4b2d-4ad6-9b9c-58d16e3c0a94",
      "slug": "ranger",
      "label": "Ranger",
      "created_at": "2025-06-07 18:04:03.138118+00",
      "popular": false
    },
    {
      "id": "2d5fbe5e-3e5d-412f-8581-83a39a8fa2dd",
      "brand_id": "5ca76279-4b2d-4ad6-9b9c-58d16e3c0a94",
      "slug": "sport",
      "label": "Sport",
      "created_at": "2025-06-07 18:04:03.138118+00",
      "popular": false
    },
    {
      "id": "c3eea80b-98b1-420e-8979-3f91d0e9a870",
      "brand_id": "5ca76279-4b2d-4ad6-9b9c-58d16e3c0a94",
      "slug": "sport-aeronaut",
      "label": "Sport Aeronaut",
      "created_at": "2025-06-07 18:04:03.138118+00",
      "popular": false
    },
    {
      "id": "b4672a77-222a-4586-b9d2-eea5b4854467",
      "brand_id": "5ca76279-4b2d-4ad6-9b9c-58d16e3c0a94",
      "slug": "sport-chronograph",
      "label": "Sport Chronograph",
      "created_at": "2025-06-07 18:04:03.138118+00",
      "popular": false
    },
    {
      "id": "fdcbf4b0-332b-4f68-b4ce-02f8b860f0f5",
      "brand_id": "5ca76279-4b2d-4ad6-9b9c-58d16e3c0a94",
      "slug": "tiger-prince-date",
      "label": "Tiger Prince Date",
      "created_at": "2025-06-07 18:04:03.138118+00",
      "popular": false
    },
    {
      "id": "ef4cbdaa-770e-4025-bcd1-2d9f0600f5b3",
      "brand_id": "9ffe59c2-e6a8-4833-b544-e985066459c4",
      "slug": "academy",
      "label": "Academy",
      "created_at": "2025-06-07 18:04:03.138118+00",
      "popular": false
    },
    {
      "id": "b03f2097-1f5d-4e1b-881c-022b94f23da3",
      "brand_id": "9ffe59c2-e6a8-4833-b544-e985066459c4",
      "slug": "baby-star",
      "label": "Baby Star",
      "created_at": "2025-06-07 18:04:03.138118+00",
      "popular": false
    },
    {
      "id": "632d03f6-4022-4acd-b33e-00c199a19e1f",
      "brand_id": "9ffe59c2-e6a8-4833-b544-e985066459c4",
      "slug": "captain",
      "label": "Captain",
      "created_at": "2025-06-07 18:04:03.138118+00",
      "popular": false
    },
    {
      "id": "b2d52e4d-e23e-4367-9049-006b95469d49",
      "brand_id": "9ffe59c2-e6a8-4833-b544-e985066459c4",
      "slug": "captain-central-second",
      "label": "Captain Central Second",
      "created_at": "2025-06-07 18:04:03.138118+00",
      "popular": false
    },
    {
      "id": "27fdff01-939b-41da-8093-da1697c002e6",
      "brand_id": "9ffe59c2-e6a8-4833-b544-e985066459c4",
      "slug": "captain-chronograph",
      "label": "Captain Chronograph",
      "created_at": "2025-06-07 18:04:03.138118+00",
      "popular": false
    },
    {
      "id": "6887c021-201a-4867-aaaf-d86720c76156",
      "brand_id": "9ffe59c2-e6a8-4833-b544-e985066459c4",
      "slug": "captain-moonphase",
      "label": "Captain Moonphase",
      "created_at": "2025-06-07 18:04:03.138118+00",
      "popular": false
    },
    {
      "id": "1446e4d5-6aff-46d3-99a1-71213c79c282",
      "brand_id": "9ffe59c2-e6a8-4833-b544-e985066459c4",
      "slug": "captain-power-reserve",
      "label": "Captain Power Reserve",
      "created_at": "2025-06-07 18:04:03.138118+00",
      "popular": false
    },
    {
      "id": "78150a9c-4f6f-4ae2-afdd-fb4953c776ad",
      "brand_id": "9ffe59c2-e6a8-4833-b544-e985066459c4",
      "slug": "chronomaster-sport",
      "label": "Chronomaster Sport",
      "created_at": "2025-06-07 18:04:03.138118+00",
      "popular": false
    },
    {
      "id": "90c83012-a098-4dce-ae00-addd8868aa36",
      "brand_id": "9ffe59c2-e6a8-4833-b544-e985066459c4",
      "slug": "defy-el-primero",
      "label": "Defy El Primero",
      "created_at": "2025-06-07 18:04:03.138118+00",
      "popular": false
    },
    {
      "id": "2a501508-f11e-4fdc-be7a-5176c15e5f99",
      "brand_id": "9ffe59c2-e6a8-4833-b544-e985066459c4",
      "slug": "defy-skyline",
      "label": "Defy Skyline",
      "created_at": "2025-06-07 18:04:03.138118+00",
      "popular": false
    },
    {
      "id": "81be4772-43aa-442a-8867-891f7c4f3643",
      "brand_id": "9ffe59c2-e6a8-4833-b544-e985066459c4",
      "slug": "elite-6150",
      "label": "Elite 6150",
      "created_at": "2025-06-07 18:04:03.138118+00",
      "popular": false
    },
    {
      "id": "50fb7c03-06d9-4a29-87bf-9e93638431bf",
      "brand_id": "9ffe59c2-e6a8-4833-b544-e985066459c4",
      "slug": "elite-chronograph-classic",
      "label": "Elite Chronograph Classic",
      "created_at": "2025-06-07 18:04:03.138118+00",
      "popular": false
    },
    {
      "id": "11154c1e-c5f3-4d1a-8864-cac5d4d9bfef",
      "brand_id": "9ffe59c2-e6a8-4833-b544-e985066459c4",
      "slug": "elite-dual-time",
      "label": "Elite Dual Time",
      "created_at": "2025-06-07 18:04:03.138118+00",
      "popular": false
    },
    {
      "id": "883b6692-eba9-43fb-885a-dcad25616b48",
      "brand_id": "9ffe59c2-e6a8-4833-b544-e985066459c4",
      "slug": "elite-power-reserve",
      "label": "Elite Power Reserve",
      "created_at": "2025-06-07 18:04:03.138118+00",
      "popular": false
    },
    {
      "id": "7fd7c5e1-1d1e-455c-b544-31944f76063f",
      "brand_id": "9ffe59c2-e6a8-4833-b544-e985066459c4",
      "slug": "elite-tourbillon",
      "label": "Elite Tourbillon",
      "created_at": "2025-06-07 18:04:03.138118+00",
      "popular": false
    },
    {
      "id": "b5ea30ef-0c24-473c-ad9a-047427e72077",
      "brand_id": "9ffe59c2-e6a8-4833-b544-e985066459c4",
      "slug": "elite-ultra-thin",
      "label": "Elite Ultra Thin",
      "created_at": "2025-06-07 18:04:03.138118+00",
      "popular": false
    },
    {
      "id": "3564c9dd-5995-48c8-b88a-cbd41911dde1",
      "brand_id": "9ffe59c2-e6a8-4833-b544-e985066459c4",
      "slug": "el-primero",
      "label": "El Primero",
      "created_at": "2025-06-07 18:04:03.138118+00",
      "popular": false
    },
    {
      "id": "45f0426c-6c52-4dfb-972c-13a0f0ba20c9",
      "brand_id": "9ffe59c2-e6a8-4833-b544-e985066459c4",
      "slug": "el-primero-36-000-vph",
      "label": "El Primero 36 000 VpH",
      "created_at": "2025-06-07 18:04:03.138118+00",
      "popular": false
    },
    {
      "id": "70288e48-a52d-444a-968c-f93cde1dea38",
      "brand_id": "9ffe59c2-e6a8-4833-b544-e985066459c4",
      "slug": "el-primero-410",
      "label": "El Primero 410",
      "created_at": "2025-06-07 18:04:03.138118+00",
      "popular": false
    },
    {
      "id": "a23e9e54-126c-4678-a084-23b37aa95a90",
      "brand_id": "9ffe59c2-e6a8-4833-b544-e985066459c4",
      "slug": "el-primero-big-date-special",
      "label": "El Primero Big Date Special",
      "created_at": "2025-06-07 18:04:03.138118+00",
      "popular": false
    },
    {
      "id": "65a28bb4-5f34-4a72-a7cb-78522e83a478",
      "brand_id": "9ffe59c2-e6a8-4833-b544-e985066459c4",
      "slug": "el-primero-chronograph",
      "label": "El Primero Chronograph",
      "created_at": "2025-06-07 18:04:03.138118+00",
      "popular": false
    },
    {
      "id": "29ab4f69-7129-45f6-9955-9f4968b43638",
      "brand_id": "9ffe59c2-e6a8-4833-b544-e985066459c4",
      "slug": "el-primero-chronomaster",
      "label": "El Primero Chronomaster",
      "created_at": "2025-06-07 18:04:03.138118+00",
      "popular": false
    },
    {
      "id": "a2bb6138-6a42-4c25-876d-6a49d6cacada",
      "brand_id": "9ffe59c2-e6a8-4833-b544-e985066459c4",
      "slug": "el-primero-chronomaster-lady",
      "label": "El Primero Chronomaster Lady",
      "created_at": "2025-06-07 18:04:03.138118+00",
      "popular": false
    },
    {
      "id": "c246777f-b309-4f81-bd9b-2cfe14867c49",
      "brand_id": "9ffe59c2-e6a8-4833-b544-e985066459c4",
      "slug": "el-primero-doublematic",
      "label": "El Primero Doublematic",
      "created_at": "2025-06-07 18:04:03.138118+00",
      "popular": false
    },
    {
      "id": "ee82132f-6cf3-4285-9a13-31dcd79f1aaf",
      "brand_id": "9ffe59c2-e6a8-4833-b544-e985066459c4",
      "slug": "el-primero-espada",
      "label": "El Primero Espada",
      "created_at": "2025-06-07 18:04:03.138118+00",
      "popular": false
    },
    {
      "id": "a7c13aba-6511-4e4d-a99d-de72ccd51e9c",
      "brand_id": "9ffe59c2-e6a8-4833-b544-e985066459c4",
      "slug": "el-primero-lightweight",
      "label": "El Primero Lightweight",
      "created_at": "2025-06-07 18:04:03.138118+00",
      "popular": false
    },
    {
      "id": "7318ebf4-8703-4c8c-bcdb-429af89740d3",
      "brand_id": "9ffe59c2-e6a8-4833-b544-e985066459c4",
      "slug": "el-primero-new-vintage-1969",
      "label": "El Primero New Vintage 1969",
      "created_at": "2025-06-07 18:04:03.138118+00",
      "popular": false
    },
    {
      "id": "f4827905-16e2-4b21-84f0-0e4931b2c1cb",
      "brand_id": "9ffe59c2-e6a8-4833-b544-e985066459c4",
      "slug": "el-primero-original-1969",
      "label": "El Primero Original 1969",
      "created_at": "2025-06-07 18:04:03.138118+00",
      "popular": false
    },
    {
      "id": "1d814121-8c0a-4f73-b8e1-3fca203262f3",
      "brand_id": "9ffe59c2-e6a8-4833-b544-e985066459c4",
      "slug": "el-primero-sport",
      "label": "El Primero Sport",
      "created_at": "2025-06-07 18:04:03.138118+00",
      "popular": false
    },
    {
      "id": "706dd490-19ed-4bcb-86e5-184d4199f5f2",
      "brand_id": "9ffe59c2-e6a8-4833-b544-e985066459c4",
      "slug": "el-primero-stratos-flyback",
      "label": "El Primero Stratos Flyback",
      "created_at": "2025-06-07 18:04:03.138118+00",
      "popular": false
    },
    {
      "id": "dd3e7ff6-5953-423e-9ae5-652ded9ee619",
      "brand_id": "9ffe59c2-e6a8-4833-b544-e985066459c4",
      "slug": "el-primero-stratos-spindrift",
      "label": "El Primero Stratos Spindrift",
      "created_at": "2025-06-07 18:04:03.138118+00",
      "popular": false
    },
    {
      "id": "e5897cc8-bda8-4444-b3ce-5e263a244c39",
      "brand_id": "9ffe59c2-e6a8-4833-b544-e985066459c4",
      "slug": "el-primero-synopsis",
      "label": "El Primero Synopsis",
      "created_at": "2025-06-07 18:04:03.138118+00",
      "popular": false
    },
    {
      "id": "c06005c1-d41d-49c4-b4e9-9358d04501bf",
      "brand_id": "9ffe59c2-e6a8-4833-b544-e985066459c4",
      "slug": "el-primero-tourbillon",
      "label": "El Primero Tourbillon",
      "created_at": "2025-06-07 18:04:03.370899+00",
      "popular": false
    },
    {
      "id": "4756cd80-f5cf-41e2-a93a-d14b39d7f2a5",
      "brand_id": "9ffe59c2-e6a8-4833-b544-e985066459c4",
      "slug": "el-primero-winsor-annual-calendar",
      "label": "El Primero Winsor Annual Calendar",
      "created_at": "2025-06-07 18:04:03.370899+00",
      "popular": false
    },
    {
      "id": "78ce7fbf-1680-4d1e-8bf8-955da2dc2ed9",
      "brand_id": "9ffe59c2-e6a8-4833-b544-e985066459c4",
      "slug": "new-vintage-1965",
      "label": "New Vintage 1965",
      "created_at": "2025-06-07 18:04:03.370899+00",
      "popular": false
    },
    {
      "id": "3c6dfcd3-9d06-463f-ade9-66538b26793c",
      "brand_id": "9ffe59c2-e6a8-4833-b544-e985066459c4",
      "slug": "pilot-type-20-annual-calendar",
      "label": "Pilot Type 20 Annual Calendar",
      "created_at": "2025-06-07 18:04:03.370899+00",
      "popular": false
    },
    {
      "id": "bbf8cec0-ed37-4e42-b3d2-098a43a9315e",
      "brand_id": "9ffe59c2-e6a8-4833-b544-e985066459c4",
      "slug": "pilot-type-20-extra-special",
      "label": "Pilot Type 20 Extra Special",
      "created_at": "2025-06-07 18:04:03.370899+00",
      "popular": false
    },
    {
      "id": "bd016003-ca9e-436b-a3b2-8c731b5e7938",
      "brand_id": "9ffe59c2-e6a8-4833-b544-e985066459c4",
      "slug": "pilot-type-20-gmt",
      "label": "Pilot Type 20 GMT",
      "created_at": "2025-06-07 18:04:03.370899+00",
      "popular": false
    },
    {
      "id": "4a986f7b-f768-4db7-8bad-ee953e68b04b",
      "brand_id": "9ffe59c2-e6a8-4833-b544-e985066459c4",
      "slug": "pilot-type-20-lady",
      "label": "Pilot Type 20 Lady",
      "created_at": "2025-06-07 18:04:03.370899+00",
      "popular": false
    },
    {
      "id": "4364d619-b511-48a1-85db-9a84981906e7",
      "brand_id": "9ffe59c2-e6a8-4833-b544-e985066459c4",
      "slug": "pilot-type-20-tourbillon",
      "label": "Pilot Type 20 Tourbillon",
      "created_at": "2025-06-07 18:04:03.370899+00",
      "popular": false
    },
    {
      "id": "647219dd-8ae4-441e-b02f-3fc49cf8d7e5",
      "brand_id": "9ffe59c2-e6a8-4833-b544-e985066459c4",
      "slug": "port-royal",
      "label": "Port Royal",
      "created_at": "2025-06-07 18:04:03.370899+00",
      "popular": false
    },
    {
      "id": "71d25e44-8740-4dd8-911e-a6a33135d3eb",
      "brand_id": "9ffe59c2-e6a8-4833-b544-e985066459c4",
      "slug": "sporto",
      "label": "Sporto",
      "created_at": "2025-06-07 18:04:03.370899+00",
      "popular": false
    },
    {
      "id": "1aa1846f-2997-4fba-ba44-9d5e0d376aff",
      "brand_id": "9ffe59c2-e6a8-4833-b544-e985066459c4",
      "slug": "star",
      "label": "Star",
      "created_at": "2025-06-07 18:04:03.370899+00",
      "popular": false
    },
    {
      "id": "40f5272a-78ec-4f7f-ad5e-ff8a94f9b590",
      "brand_id": "9ffe59c2-e6a8-4833-b544-e985066459c4",
      "slug": "stellina",
      "label": "Stellina",
      "created_at": "2025-06-07 18:04:03.370899+00",
      "popular": false
    },
    {
      "id": "ca491085-48c3-49f9-8f22-0648b8d4c041",
      "brand_id": "313b1ebc-ab4f-41d8-8bb1-4d35b6ec8fc7",
      "slug": "1972",
      "label": "1972",
      "created_at": "2025-06-07 18:04:03.370899+00",
      "popular": false
    },
    {
      "id": "89d7f40a-e7ef-4953-92b4-3e733334cd03",
      "brand_id": "313b1ebc-ab4f-41d8-8bb1-4d35b6ec8fc7",
      "slug": "fiftysix",
      "label": "Fiftysix",
      "created_at": "2025-06-07 18:04:03.370899+00",
      "popular": false
    },
    {
      "id": "fa83b681-5c25-4c07-b46b-7a53800534c9",
      "brand_id": "313b1ebc-ab4f-41d8-8bb1-4d35b6ec8fc7",
      "slug": "harmony",
      "label": "Harmony",
      "created_at": "2025-06-07 18:04:03.370899+00",
      "popular": false
    },
    {
      "id": "9815160d-4c53-47ba-84fe-4f21ca056bbd",
      "brand_id": "313b1ebc-ab4f-41d8-8bb1-4d35b6ec8fc7",
      "slug": "malte",
      "label": "Malte",
      "created_at": "2025-06-07 18:04:03.370899+00",
      "popular": false
    },
    {
      "id": "bbf587ca-f480-4cb3-a7dc-20fa22f838c5",
      "brand_id": "313b1ebc-ab4f-41d8-8bb1-4d35b6ec8fc7",
      "slug": "metiers-dart",
      "label": "Métiers d’Art",
      "created_at": "2025-06-07 18:04:03.370899+00",
      "popular": false
    },
    {
      "id": "863f60ea-bec9-40f1-8b95-362d82865818",
      "brand_id": "313b1ebc-ab4f-41d8-8bb1-4d35b6ec8fc7",
      "slug": "overseas-chronograph",
      "label": "Overseas Chronograph",
      "created_at": "2025-06-07 18:04:03.370899+00",
      "popular": false
    },
    {
      "id": "21071f2d-f4bd-4f75-b23e-610e6db23889",
      "brand_id": "313b1ebc-ab4f-41d8-8bb1-4d35b6ec8fc7",
      "slug": "overseas-dual-time",
      "label": "Overseas Dual Time",
      "created_at": "2025-06-07 18:04:03.370899+00",
      "popular": false
    },
    {
      "id": "eae46508-f9a7-4acc-8e52-1827b8510c6c",
      "brand_id": "313b1ebc-ab4f-41d8-8bb1-4d35b6ec8fc7",
      "slug": "overseas-world-time",
      "label": "Overseas World Time",
      "created_at": "2025-06-07 18:04:03.370899+00",
      "popular": false
    },
    {
      "id": "7efbd468-7e45-4dc6-9782-0c45c3f00692",
      "brand_id": "313b1ebc-ab4f-41d8-8bb1-4d35b6ec8fc7",
      "slug": "quai-de-lile",
      "label": "Quai de l’Île",
      "created_at": "2025-06-07 18:04:03.370899+00",
      "popular": false
    },
    {
      "id": "cd38f497-5f55-4029-9f13-14500fc2a149",
      "brand_id": "313b1ebc-ab4f-41d8-8bb1-4d35b6ec8fc7",
      "slug": "royal-eagle",
      "label": "Royal Eagle",
      "created_at": "2025-06-07 18:04:03.370899+00",
      "popular": false
    },
    {
      "id": "35da7c8e-faef-4215-9672-1ee86bcf23fc",
      "brand_id": "f24149d5-852d-4de8-909d-a8729f85c0f0",
      "slug": "astrolabium",
      "label": "Astrolabium",
      "created_at": "2025-06-07 18:04:03.370899+00",
      "popular": false
    },
    {
      "id": "e1eb1d34-aee0-463f-af2f-2f1f1fcf5081",
      "brand_id": "f24149d5-852d-4de8-909d-a8729f85c0f0",
      "slug": "blue-seal",
      "label": "Blue Seal",
      "created_at": "2025-06-07 18:04:03.370899+00",
      "popular": false
    },
    {
      "id": "4e3a3a3d-b2df-48e1-b39c-008ba3ec14d0",
      "brand_id": "f24149d5-852d-4de8-909d-a8729f85c0f0",
      "slug": "caprice",
      "label": "Caprice",
      "created_at": "2025-06-07 18:04:03.370899+00",
      "popular": false
    },
    {
      "id": "707cecb1-c65d-4ea8-b8e3-81bced542873",
      "brand_id": "f24149d5-852d-4de8-909d-a8729f85c0f0",
      "slug": "classic",
      "label": "Classic",
      "created_at": "2025-06-07 18:04:03.370899+00",
      "popular": false
    },
    {
      "id": "99ca5085-7c3a-45ca-a172-cfcafc10b4c5",
      "brand_id": "f24149d5-852d-4de8-909d-a8729f85c0f0",
      "slug": "classico",
      "label": "Classico",
      "created_at": "2025-06-07 18:04:03.370899+00",
      "popular": false
    },
    {
      "id": "bdb3d6c6-ddcb-47dd-9a43-aa24cffe4bda",
      "brand_id": "f24149d5-852d-4de8-909d-a8729f85c0f0",
      "slug": "classico-luna",
      "label": "Classico Luna",
      "created_at": "2025-06-07 18:04:03.370899+00",
      "popular": false
    },
    {
      "id": "802d018b-dd7c-43f9-923b-343f475a2c1f",
      "brand_id": "f24149d5-852d-4de8-909d-a8729f85c0f0",
      "slug": "classic-skeleton-tourbillon",
      "label": "Classic Skeleton Tourbillon",
      "created_at": "2025-06-07 18:04:03.370899+00",
      "popular": false
    },
    {
      "id": "41c0f398-c406-4b5c-8bf9-fa6581fbd643",
      "brand_id": "f24149d5-852d-4de8-909d-a8729f85c0f0",
      "slug": "classic-ulysse-anchor-tourbillon",
      "label": "Classic Ulysse Anchor Tourbillon",
      "created_at": "2025-06-07 18:04:03.370899+00",
      "popular": false
    },
    {
      "id": "1c88491d-97c2-46f8-9575-2c6ef5f9a9b2",
      "brand_id": "f24149d5-852d-4de8-909d-a8729f85c0f0",
      "slug": "diver",
      "label": "Diver",
      "created_at": "2025-06-07 18:04:03.370899+00",
      "popular": false
    },
    {
      "id": "770687b5-1411-4a4d-be6f-2e0c10d6b594",
      "brand_id": "f24149d5-852d-4de8-909d-a8729f85c0f0",
      "slug": "diver-air",
      "label": "Diver AIR",
      "created_at": "2025-06-07 18:04:03.370899+00",
      "popular": false
    },
    {
      "id": "fa83c20b-b345-472f-bf35-45c6df1bf8bc",
      "brand_id": "f24149d5-852d-4de8-909d-a8729f85c0f0",
      "slug": "diver-black-sea",
      "label": "Diver Black Sea",
      "created_at": "2025-06-07 18:04:03.370899+00",
      "popular": false
    },
    {
      "id": "17a133cf-3049-4a87-977c-e4dd6a179d1c",
      "brand_id": "f24149d5-852d-4de8-909d-a8729f85c0f0",
      "slug": "diver-chronograph",
      "label": "Diver Chronograph",
      "created_at": "2025-06-07 18:04:03.370899+00",
      "popular": false
    },
    {
      "id": "4bcb4dcd-21a3-4107-af09-14969711254a",
      "brand_id": "f24149d5-852d-4de8-909d-a8729f85c0f0",
      "slug": "diver-chronometer",
      "label": "Diver Chronometer",
      "created_at": "2025-06-07 18:04:03.370899+00",
      "popular": false
    },
    {
      "id": "c02b8d6a-6a17-40f9-83ee-8907d3cbaf09",
      "brand_id": "f24149d5-852d-4de8-909d-a8729f85c0f0",
      "slug": "dual-time",
      "label": "Dual Time",
      "created_at": "2025-06-07 18:04:03.370899+00",
      "popular": false
    },
    {
      "id": "da010ca3-9363-4309-b937-2ab7da78caa6",
      "brand_id": "f24149d5-852d-4de8-909d-a8729f85c0f0",
      "slug": "el-toro-black-toro",
      "label": "El Toro / Black Toro",
      "created_at": "2025-06-07 18:04:03.370899+00",
      "popular": false
    },
    {
      "id": "9b301fd9-f7a9-443e-9c1a-02f37e8e69a1",
      "brand_id": "f24149d5-852d-4de8-909d-a8729f85c0f0",
      "slug": "executive",
      "label": "Executive",
      "created_at": "2025-06-07 18:04:03.370899+00",
      "popular": false
    },
    {
      "id": "90ac036d-f498-439f-b0c6-e2e778b27fd5",
      "brand_id": "f24149d5-852d-4de8-909d-a8729f85c0f0",
      "slug": "executive-dual-time",
      "label": "Executive Dual Time",
      "created_at": "2025-06-07 18:04:03.370899+00",
      "popular": false
    },
    {
      "id": "cabbcd86-77b1-451f-86fc-93df98e819d5",
      "brand_id": "f24149d5-852d-4de8-909d-a8729f85c0f0",
      "slug": "executive-dual-time-lady",
      "label": "Executive Dual Time Lady",
      "created_at": "2025-06-07 18:04:03.370899+00",
      "popular": false
    },
    {
      "id": "e71485cf-e82d-4084-8403-073d5f6767dc",
      "brand_id": "f24149d5-852d-4de8-909d-a8729f85c0f0",
      "slug": "executive-skeleton-tourbillon",
      "label": "Executive Skeleton Tourbillon",
      "created_at": "2025-06-07 18:04:03.370899+00",
      "popular": false
    },
    {
      "id": "41a59006-0fbe-4abf-8c61-6702b0838e5f",
      "brand_id": "f24149d5-852d-4de8-909d-a8729f85c0f0",
      "slug": "freak",
      "label": "Freak",
      "created_at": "2025-06-07 18:04:03.370899+00",
      "popular": false
    },
    {
      "id": "a71fda3a-8f2c-44e4-949f-cd15123f507f",
      "brand_id": "f24149d5-852d-4de8-909d-a8729f85c0f0",
      "slug": "freak-cruiser",
      "label": "Freak Cruiser",
      "created_at": "2025-06-07 18:04:03.370899+00",
      "popular": false
    },
    {
      "id": "819b5d93-ed07-4387-afc1-97f914cb5aee",
      "brand_id": "f24149d5-852d-4de8-909d-a8729f85c0f0",
      "slug": "genghis-khan",
      "label": "Genghis Khan",
      "created_at": "2025-06-07 18:04:03.370899+00",
      "popular": false
    },
    {
      "id": "5b229b30-11b5-4c4f-b878-5c05da7ad390",
      "brand_id": "f24149d5-852d-4de8-909d-a8729f85c0f0",
      "slug": "gmt-plusminus-perpetual",
      "label": "GMT ± Perpetual",
      "created_at": "2025-06-07 18:04:03.370899+00",
      "popular": false
    },
    {
      "id": "dcf14662-065a-4199-8611-47253567dd7c",
      "brand_id": "f24149d5-852d-4de8-909d-a8729f85c0f0",
      "slug": "hammerhead-shark",
      "label": "Hammerhead Shark",
      "created_at": "2025-06-07 18:04:03.370899+00",
      "popular": false
    },
    {
      "id": "5c74f3b2-7092-434f-988a-b2cfac67b1e5",
      "brand_id": "f24149d5-852d-4de8-909d-a8729f85c0f0",
      "slug": "hourstriker",
      "label": "Hourstriker",
      "created_at": "2025-06-07 18:04:03.370899+00",
      "popular": false
    },
    {
      "id": "0dd9f3d0-be77-4811-9998-2ca2e6a6ceff",
      "brand_id": "f24149d5-852d-4de8-909d-a8729f85c0f0",
      "slug": "jade",
      "label": "Jade",
      "created_at": "2025-06-07 18:04:03.370899+00",
      "popular": false
    },
    {
      "id": "37477b35-dc50-47af-bf82-7f8c5605be73",
      "brand_id": "f24149d5-852d-4de8-909d-a8729f85c0f0",
      "slug": "kremlin",
      "label": "Kremlin",
      "created_at": "2025-06-07 18:04:03.370899+00",
      "popular": false
    },
    {
      "id": "3e00731f-9d72-4996-bcd9-c5deecc12cdd",
      "brand_id": "f24149d5-852d-4de8-909d-a8729f85c0f0",
      "slug": "lady-diver",
      "label": "Lady Diver",
      "created_at": "2025-06-07 18:04:03.370899+00",
      "popular": false
    },
    {
      "id": "85b4915d-c6f1-462d-8bce-9c99b78d5405",
      "brand_id": "f24149d5-852d-4de8-909d-a8729f85c0f0",
      "slug": "lady-diver-starry-night",
      "label": "Lady Diver Starry Night",
      "created_at": "2025-06-07 18:04:03.370899+00",
      "popular": false
    },
    {
      "id": "a1836758-a300-46ae-b2b6-d9c23f22940e",
      "brand_id": "f24149d5-852d-4de8-909d-a8729f85c0f0",
      "slug": "macho-palladium-950",
      "label": "Macho Palladium 950",
      "created_at": "2025-06-07 18:04:03.370899+00",
      "popular": false
    },
    {
      "id": "b7c8d518-2c66-41d7-a849-5b0e7d7a442f",
      "brand_id": "f24149d5-852d-4de8-909d-a8729f85c0f0",
      "slug": "marine",
      "label": "Marine",
      "created_at": "2025-06-07 18:04:03.370899+00",
      "popular": false
    },
    {
      "id": "876a926e-c576-452e-b495-61f3e5acf4c6",
      "brand_id": "f24149d5-852d-4de8-909d-a8729f85c0f0",
      "slug": "marine-chronograph",
      "label": "Marine Chronograph",
      "created_at": "2025-06-07 18:04:03.370899+00",
      "popular": false
    },
    {
      "id": "5e961dca-d253-422f-84bb-b411dbc729e0",
      "brand_id": "f24149d5-852d-4de8-909d-a8729f85c0f0",
      "slug": "marine-chronometer-41-mm",
      "label": "Marine Chronometer 41 mm",
      "created_at": "2025-06-07 18:04:03.370899+00",
      "popular": false
    },
    {
      "id": "668090ee-25aa-4bae-9ec2-61500381d472",
      "brand_id": "f24149d5-852d-4de8-909d-a8729f85c0f0",
      "slug": "marine-chronometer-43-mm",
      "label": "Marine Chronometer 43 mm",
      "created_at": "2025-06-07 18:04:03.370899+00",
      "popular": false
    },
    {
      "id": "62cd4b33-ee28-4dca-8d4d-d7da0848c252",
      "brand_id": "f24149d5-852d-4de8-909d-a8729f85c0f0",
      "slug": "marine-chronometer-manufacture",
      "label": "Marine Chronometer Manufacture",
      "created_at": "2025-06-07 18:04:03.370899+00",
      "popular": false
    },
    {
      "id": "5cadad6c-9855-499c-bde1-dcf6aeacfa9e",
      "brand_id": "f24149d5-852d-4de8-909d-a8729f85c0f0",
      "slug": "marine-regatta",
      "label": "Marine Regatta",
      "created_at": "2025-06-07 18:04:03.370899+00",
      "popular": false
    },
    {
      "id": "cfa88cb0-f001-4eff-a152-0f8ca98cafc8",
      "brand_id": "f24149d5-852d-4de8-909d-a8729f85c0f0",
      "slug": "marine-torpilleur",
      "label": "Marine Torpilleur",
      "created_at": "2025-06-07 18:04:03.370899+00",
      "popular": false
    },
    {
      "id": "2740d7e0-d219-4c57-9623-0f72e0324c26",
      "brand_id": "f24149d5-852d-4de8-909d-a8729f85c0f0",
      "slug": "marine-tourbillon",
      "label": "Marine Tourbillon",
      "created_at": "2025-06-07 18:04:03.370899+00",
      "popular": false
    },
    {
      "id": "5940400d-4ba4-411d-9b82-42597660b577",
      "brand_id": "f24149d5-852d-4de8-909d-a8729f85c0f0",
      "slug": "maxi-marine-diver",
      "label": "Maxi Marine Diver",
      "created_at": "2025-06-07 18:04:03.370899+00",
      "popular": false
    },
    {
      "id": "7f76395d-9568-4c2d-a299-aec45277e08f",
      "brand_id": "f24149d5-852d-4de8-909d-a8729f85c0f0",
      "slug": "michelangelo",
      "label": "Michelangelo",
      "created_at": "2025-06-07 18:04:03.370899+00",
      "popular": false
    },
    {
      "id": "37eb7676-9e7a-4796-8c5a-1d43250825e0",
      "brand_id": "f24149d5-852d-4de8-909d-a8729f85c0f0",
      "slug": "moonstruck",
      "label": "Moonstruck",
      "created_at": "2025-06-07 18:04:03.370899+00",
      "popular": false
    },
    {
      "id": "c8083039-069c-45fc-862e-04a4d040e270",
      "brand_id": "f24149d5-852d-4de8-909d-a8729f85c0f0",
      "slug": "perpetual-manufacture",
      "label": "Perpetual Manufacture",
      "created_at": "2025-06-07 18:04:03.370899+00",
      "popular": false
    },
    {
      "id": "7f5d5113-b79a-4962-a300-00d6ea01f0f2",
      "brand_id": "f24149d5-852d-4de8-909d-a8729f85c0f0",
      "slug": "planetarium-copernicus",
      "label": "Planetarium Copernicus",
      "created_at": "2025-06-07 18:04:03.370899+00",
      "popular": false
    },
    {
      "id": "9944635d-1e4c-4c1f-85ea-bddc6f1ab16c",
      "brand_id": "f24149d5-852d-4de8-909d-a8729f85c0f0",
      "slug": "quadrato-dual-time",
      "label": "Quadrato Dual Time",
      "created_at": "2025-06-07 18:04:03.370899+00",
      "popular": false
    },
    {
      "id": "7752a4c2-c942-4716-ac72-05ce891d849c",
      "brand_id": "f24149d5-852d-4de8-909d-a8729f85c0f0",
      "slug": "quadrato-dual-time-perpetual",
      "label": "Quadrato Dual Time Perpetual",
      "created_at": "2025-06-07 18:04:03.370899+00",
      "popular": false
    },
    {
      "id": "c51319e1-a926-470d-93eb-94c9c8c9d870",
      "brand_id": "f24149d5-852d-4de8-909d-a8729f85c0f0",
      "slug": "royal-blue-tourbillon",
      "label": "Royal Blue Tourbillon",
      "created_at": "2025-06-07 18:04:03.370899+00",
      "popular": false
    },
    {
      "id": "404bcfc8-c487-4400-976f-dcc502d7028d",
      "brand_id": "f24149d5-852d-4de8-909d-a8729f85c0f0",
      "slug": "san-marco",
      "label": "San Marco",
      "created_at": "2025-06-07 18:04:03.370899+00",
      "popular": false
    },
    {
      "id": "3e3dc123-c51d-4bec-b544-0bc2e2f4a789",
      "brand_id": "f24149d5-852d-4de8-909d-a8729f85c0f0",
      "slug": "san-marco-big-date",
      "label": "San Marco Big Date",
      "created_at": "2025-06-07 18:04:03.370899+00",
      "popular": false
    },
    {
      "id": "109e753e-18a9-4496-96d2-2b2026f8b01e",
      "brand_id": "f24149d5-852d-4de8-909d-a8729f85c0f0",
      "slug": "san-marco-cloisonne",
      "label": "San Marco Cloisonné",
      "created_at": "2025-06-07 18:04:03.370899+00",
      "popular": false
    },
    {
      "id": "e2f5e518-f8c3-4f9c-a926-87de932f6c1a",
      "brand_id": "f24149d5-852d-4de8-909d-a8729f85c0f0",
      "slug": "sonata",
      "label": "Sonata",
      "created_at": "2025-06-07 18:04:03.370899+00",
      "popular": false
    },
    {
      "id": "24af70d6-1dc2-4b85-95b3-ba72aa3caaad",
      "brand_id": "f24149d5-852d-4de8-909d-a8729f85c0f0",
      "slug": "stranger",
      "label": "Stranger",
      "created_at": "2025-06-07 18:04:03.370899+00",
      "popular": false
    },
    {
      "id": "c091ee75-c7a4-45e6-986e-fe470386afae",
      "brand_id": "3ea9490f-ad90-4f36-af5f-aeb130abbfea",
      "slug": "other",
      "label": "Other",
      "created_at": "2025-06-08 09:12:06.352831+00",
      "popular": false
    },
    {
      "id": "acaeefcc-1340-4970-baf8-df519959f18e",
      "brand_id": "c926b996-58d0-430d-8b4c-17a6fc4fe8ea",
      "slug": "annual-calendar",
      "label": "Annual Calendar",
      "created_at": "2025-06-07 18:04:00.960549+00",
      "popular": false
    },
    {
      "id": "e6fe1e29-5945-4b34-b67b-b1ea193f23d1",
      "brand_id": "c926b996-58d0-430d-8b4c-17a6fc4fe8ea",
      "slug": "annual-calendar-chronograph",
      "label": "Annual Calendar Chronograph",
      "created_at": "2025-06-07 18:04:00.960549+00",
      "popular": false
    },
    {
      "id": "a92f259e-49e9-42be-a50b-70ea577b7ad0",
      "brand_id": "c926b996-58d0-430d-8b4c-17a6fc4fe8ea",
      "slug": "annual-calendar-travel-time",
      "label": "Annual Calendar Travel Time",
      "created_at": "2025-06-07 18:04:00.960549+00",
      "popular": false
    },
    {
      "id": "4b3d0a7b-5ae5-4662-a32c-ffa6848761a5",
      "brand_id": "c926b996-58d0-430d-8b4c-17a6fc4fe8ea",
      "slug": "beta-21",
      "label": "Beta 21",
      "created_at": "2025-06-07 18:04:00.960549+00",
      "popular": false
    },
    {
      "id": "e9344ad5-b5e8-4153-9866-791bee4f3a4d",
      "brand_id": "c926b996-58d0-430d-8b4c-17a6fc4fe8ea",
      "slug": "celestial",
      "label": "Celestial",
      "created_at": "2025-06-07 18:04:00.960549+00",
      "popular": false
    },
    {
      "id": "72154f35-363e-4a5c-97c8-727d6f2d5096",
      "brand_id": "c926b996-58d0-430d-8b4c-17a6fc4fe8ea",
      "slug": "chronograph",
      "label": "Chronograph",
      "created_at": "2025-06-07 18:04:00.960549+00",
      "popular": false
    },
    {
      "id": "cb2665eb-ba1c-4c07-b258-3384a9a356a5",
      "brand_id": "c926b996-58d0-430d-8b4c-17a6fc4fe8ea",
      "slug": "cubitus",
      "label": "Cubitus",
      "created_at": "2025-06-07 18:04:00.960549+00",
      "popular": false
    },
    {
      "id": "73404bc0-f459-4b4a-9057-34aef2afbdc8",
      "brand_id": "c926b996-58d0-430d-8b4c-17a6fc4fe8ea",
      "slug": "ellipse",
      "label": "Ellipse",
      "created_at": "2025-06-07 18:04:00.960549+00",
      "popular": false
    },
    {
      "id": "2de5a022-174e-4c68-8f52-dc3bdd75b0cf",
      "brand_id": "c926b996-58d0-430d-8b4c-17a6fc4fe8ea",
      "slug": "golden-ellipse",
      "label": "Golden Ellipse",
      "created_at": "2025-06-07 18:04:00.960549+00",
      "popular": false
    },
    {
      "id": "8b999bcf-60de-46d7-871e-a28c1246bdac",
      "brand_id": "c926b996-58d0-430d-8b4c-17a6fc4fe8ea",
      "slug": "grandmaster-chime",
      "label": "Grandmaster Chime",
      "created_at": "2025-06-07 18:04:00.960549+00",
      "popular": false
    },
    {
      "id": "394cba3b-7a5e-4229-9686-283bbb6e248a",
      "brand_id": "c926b996-58d0-430d-8b4c-17a6fc4fe8ea",
      "slug": "hour-glass",
      "label": "Hour Glass",
      "created_at": "2025-06-07 18:04:00.960549+00",
      "popular": false
    },
    {
      "id": "fd0f4de9-3846-4c75-858e-eff08be919cb",
      "brand_id": "c926b996-58d0-430d-8b4c-17a6fc4fe8ea",
      "slug": "jump-hour",
      "label": "Jump Hour",
      "created_at": "2025-06-07 18:04:00.960549+00",
      "popular": false
    },
    {
      "id": "dda19a7e-5ea5-4c9b-9814-8dac15bc7672",
      "brand_id": "c926b996-58d0-430d-8b4c-17a6fc4fe8ea",
      "slug": "la-flamme",
      "label": "La Flamme",
      "created_at": "2025-06-07 18:04:00.960549+00",
      "popular": false
    },
    {
      "id": "3518d1bb-c159-474d-a8d8-f44a0cdb1c98",
      "brand_id": "c926b996-58d0-430d-8b4c-17a6fc4fe8ea",
      "slug": "minute-repeater",
      "label": "Minute Repeater",
      "created_at": "2025-06-07 18:04:00.960549+00",
      "popular": false
    },
    {
      "id": "51e77d1c-60da-4c51-b72a-d388ae9b8cb4",
      "brand_id": "c926b996-58d0-430d-8b4c-17a6fc4fe8ea",
      "slug": "minute-repeater-perpetual-calendar",
      "label": "Minute Repeater Perpetual Calendar",
      "created_at": "2025-06-07 18:04:00.960549+00",
      "popular": false
    },
    {
      "id": "45e3e937-0851-4450-8937-3cb967127fbd",
      "brand_id": "c926b996-58d0-430d-8b4c-17a6fc4fe8ea",
      "slug": "neptune",
      "label": "Neptune",
      "created_at": "2025-06-07 18:04:00.960549+00",
      "popular": false
    },
    {
      "id": "67d2110d-f1c2-4967-8142-3d25f0ea5063",
      "brand_id": "c926b996-58d0-430d-8b4c-17a6fc4fe8ea",
      "slug": "pagoda",
      "label": "Pagoda",
      "created_at": "2025-06-07 18:04:00.960549+00",
      "popular": false
    },
    {
      "id": "e079ac5f-a69b-4ace-aa69-4e8c66ccd0b2",
      "brand_id": "c926b996-58d0-430d-8b4c-17a6fc4fe8ea",
      "slug": "perpetual-calendar",
      "label": "Perpetual Calendar",
      "created_at": "2025-06-07 18:04:00.960549+00",
      "popular": false
    },
    {
      "id": "f68f0ee5-f131-4325-9033-38df1df17679",
      "brand_id": "29692e6c-7d55-4a03-9ac9-2e50e8f455e8",
      "slug": "datejust",
      "label": "Datejust",
      "created_at": "2025-05-30 14:54:15.255531+00",
      "popular": false
    },
    {
      "id": "525e8d87-cab5-498b-acb9-10d0dd344037",
      "brand_id": "96f7bbb1-2a1c-4d4e-a163-70d9076734e9",
      "slug": "seamaster-diver-300m",
      "label": "Seamaster Diver 300M",
      "created_at": "2025-05-30 14:54:15.723539+00",
      "popular": false
    },
    {
      "id": "ae401ae5-00e9-4b00-9783-faec75c2b020",
      "brand_id": "96f7bbb1-2a1c-4d4e-a163-70d9076734e9",
      "slug": "seamaster-planet-ocean",
      "label": "Seamaster Planet Ocean",
      "created_at": "2025-05-30 14:54:15.776346+00",
      "popular": false
    },
    {
      "id": "8a0d893e-65e5-4ca2-95ec-91011fb97157",
      "brand_id": "96f7bbb1-2a1c-4d4e-a163-70d9076734e9",
      "slug": "speedmaster-moonwatch",
      "label": "Speedmaster Professional Moonwatch",
      "created_at": "2025-05-30 14:54:15.665338+00",
      "popular": false
    },
    {
      "id": "a86646d7-56b9-48e6-9dcf-30ddd794bcc8",
      "brand_id": "d421865e-5344-4b92-a8dd-ee525da88f1e",
      "slug": "code-11-59",
      "label": "Code 11.59",
      "created_at": "2025-05-30 14:54:16.673694+00",
      "popular": false
    },
    {
      "id": "15fc4061-1f35-4e40-8a24-d6933361ec83",
      "brand_id": "d421865e-5344-4b92-a8dd-ee525da88f1e",
      "slug": "millenary",
      "label": "Millenary",
      "created_at": "2025-05-30 14:54:16.728116+00",
      "popular": false
    },
    {
      "id": "4c7c6c2e-5ed4-43f0-a728-dddaec7b9828",
      "brand_id": "c926b996-58d0-430d-8b4c-17a6fc4fe8ea",
      "slug": "perpetual-calendar-chronograph",
      "label": "Perpetual Calendar Chronograph",
      "created_at": "2025-06-07 18:04:00.960549+00",
      "popular": false
    },
    {
      "id": "c3e22367-a9bd-4c2e-8489-95aa7b2a8f31",
      "brand_id": "c926b996-58d0-430d-8b4c-17a6fc4fe8ea",
      "slug": "pocket-watch",
      "label": "Pocket Watch",
      "created_at": "2025-06-07 18:04:00.960549+00",
      "popular": false
    },
    {
      "id": "332670da-75f5-45ce-89de-78ff12357fc1",
      "brand_id": "c926b996-58d0-430d-8b4c-17a6fc4fe8ea",
      "slug": "sculpture",
      "label": "Sculpture",
      "created_at": "2025-06-07 18:04:00.960549+00",
      "popular": false
    },
    {
      "id": "819487fa-b146-4403-9729-496a9882fa2f",
      "brand_id": "c926b996-58d0-430d-8b4c-17a6fc4fe8ea",
      "slug": "sky-moon-tourbillon",
      "label": "Sky Moon Tourbillon",
      "created_at": "2025-06-07 18:04:00.960549+00",
      "popular": false
    },
    {
      "id": "681778c9-7d0a-466f-8b1b-897cd9098531",
      "brand_id": "c926b996-58d0-430d-8b4c-17a6fc4fe8ea",
      "slug": "table-clock",
      "label": "Table Clock",
      "created_at": "2025-06-07 18:04:00.960549+00",
      "popular": false
    },
    {
      "id": "98b837dd-3d8c-4dd5-ad61-1238e8189bbc",
      "brand_id": "c926b996-58d0-430d-8b4c-17a6fc4fe8ea",
      "slug": "top-hat",
      "label": "Top Hat",
      "created_at": "2025-06-07 18:04:00.960549+00",
      "popular": false
    },
    {
      "id": "32e5f7e4-f051-417b-9a90-7fe1c8646c60",
      "brand_id": "c926b996-58d0-430d-8b4c-17a6fc4fe8ea",
      "slug": "travel-time",
      "label": "Travel Time",
      "created_at": "2025-06-07 18:04:00.960549+00",
      "popular": false
    },
    {
      "id": "785add65-5a06-4e48-ab80-52daa3ee0b19",
      "brand_id": "c926b996-58d0-430d-8b4c-17a6fc4fe8ea",
      "slug": "vintage",
      "label": "Vintage",
      "created_at": "2025-06-07 18:04:00.960549+00",
      "popular": false
    },
    {
      "id": "41365108-3598-4551-b610-430d596b96bb",
      "brand_id": "c926b996-58d0-430d-8b4c-17a6fc4fe8ea",
      "slug": "world-time",
      "label": "World Time",
      "created_at": "2025-06-07 18:04:00.960549+00",
      "popular": false
    },
    {
      "id": "b4267fe9-c557-4c32-ae0c-d36a584dba21",
      "brand_id": "c926b996-58d0-430d-8b4c-17a6fc4fe8ea",
      "slug": "world-time-chronograph",
      "label": "World Time Chronograph",
      "created_at": "2025-06-07 18:04:00.960549+00",
      "popular": false
    },
    {
      "id": "f94c8b87-a325-4b2c-a296-5c15025a20c9",
      "brand_id": "d421865e-5344-4b92-a8dd-ee525da88f1e",
      "slug": "cobra",
      "label": "Cobra",
      "created_at": "2025-06-07 18:04:00.960549+00",
      "popular": false
    },
    {
      "id": "aa873620-ff88-4d07-93c0-894d063cc040",
      "brand_id": "d421865e-5344-4b92-a8dd-ee525da88f1e",
      "slug": "edward-piguet",
      "label": "Edward Piguet",
      "created_at": "2025-06-07 18:04:00.960549+00",
      "popular": false
    },
    {
      "id": "bc520fbd-7acf-42c5-855b-6c119436b78c",
      "brand_id": "d421865e-5344-4b92-a8dd-ee525da88f1e",
      "slug": "haute-joaillerie",
      "label": "Haute Joaillerie",
      "created_at": "2025-06-07 18:04:00.960549+00",
      "popular": false
    },
    {
      "id": "544849e2-5db6-4534-9eff-b86bc31077a5",
      "brand_id": "d421865e-5344-4b92-a8dd-ee525da88f1e",
      "slug": "huitieme",
      "label": "Huitième",
      "created_at": "2025-06-07 18:04:00.960549+00",
      "popular": false
    },
    {
      "id": "5c08f609-8ec5-4334-9881-79bc9925a37d",
      "brand_id": "d421865e-5344-4b92-a8dd-ee525da88f1e",
      "slug": "millenary-4101",
      "label": "Millenary 4101",
      "created_at": "2025-06-07 18:04:00.960549+00",
      "popular": false
    },
    {
      "id": "b397f2e8-7b23-4f5a-95e3-7255e57adeca",
      "brand_id": "d421865e-5344-4b92-a8dd-ee525da88f1e",
      "slug": "millenary-chronograph",
      "label": "Millenary Chronograph",
      "created_at": "2025-06-07 18:04:00.960549+00",
      "popular": false
    },
    {
      "id": "6d9fbc7b-e9a2-41d0-8015-0e8745b3d34a",
      "brand_id": "d421865e-5344-4b92-a8dd-ee525da88f1e",
      "slug": "millenary-ladies",
      "label": "Millenary Ladies",
      "created_at": "2025-06-07 18:04:00.960549+00",
      "popular": false
    },
    {
      "id": "ac057da8-3d82-4445-97db-cc6227cdb5c5",
      "brand_id": "d421865e-5344-4b92-a8dd-ee525da88f1e",
      "slug": "promesse",
      "label": "Promesse",
      "created_at": "2025-06-07 18:04:00.960549+00",
      "popular": false
    },
    {
      "id": "64debe37-ee65-4618-8276-353eb7216d19",
      "brand_id": "d421865e-5344-4b92-a8dd-ee525da88f1e",
      "slug": "quantieme-perpetual-calendar",
      "label": "Quantième Perpetual Calendar",
      "created_at": "2025-06-07 18:04:00.960549+00",
      "popular": false
    },
    {
      "id": "fc278c93-e979-4b37-93a2-a87fd6b555b5",
      "brand_id": "d421865e-5344-4b92-a8dd-ee525da88f1e",
      "slug": "royal-oak-concept",
      "label": "Royal Oak Concept",
      "created_at": "2025-06-07 18:04:00.960549+00",
      "popular": false
    },
    {
      "id": "c53e3d70-16b0-4ced-b926-65ac815b2b18",
      "brand_id": "d421865e-5344-4b92-a8dd-ee525da88f1e",
      "slug": "royal-oak-day-date",
      "label": "Royal Oak Day-Date",
      "created_at": "2025-06-07 18:04:00.960549+00",
      "popular": false
    },
    {
      "id": "f9047607-67d1-4b8a-880d-fc5524a32b19",
      "brand_id": "d421865e-5344-4b92-a8dd-ee525da88f1e",
      "slug": "royal-oak-double-balance-wheel-openworked",
      "label": "Royal Oak Double Balance Wheel Openworked",
      "created_at": "2025-06-07 18:04:00.960549+00",
      "popular": false
    },
    {
      "id": "6e755b56-3497-409e-927a-52d864fcfd2a",
      "brand_id": "d421865e-5344-4b92-a8dd-ee525da88f1e",
      "slug": "royal-oak-dual-time",
      "label": "Royal Oak Dual Time",
      "created_at": "2025-06-07 18:04:00.960549+00",
      "popular": false
    },
    {
      "id": "dae430e8-1b78-45c7-82d8-8bf23a3cea7c",
      "brand_id": "d421865e-5344-4b92-a8dd-ee525da88f1e",
      "slug": "royal-oak-jumbo",
      "label": "Royal Oak Jumbo",
      "created_at": "2025-06-07 18:04:00.960549+00",
      "popular": false
    },
    {
      "id": "d4d9151d-e37a-407d-ad85-fef4e65ff198",
      "brand_id": "d421865e-5344-4b92-a8dd-ee525da88f1e",
      "slug": "royal-oak-lady",
      "label": "Royal Oak Lady",
      "created_at": "2025-06-07 18:04:00.960549+00",
      "popular": false
    },
    {
      "id": "43ba23b6-4e01-4fe2-a3a1-5eee5ae1f567",
      "brand_id": "d421865e-5344-4b92-a8dd-ee525da88f1e",
      "slug": "royal-oak-mini",
      "label": "Royal Oak Mini",
      "created_at": "2025-06-07 18:04:00.960549+00",
      "popular": false
    },
    {
      "id": "2d96b9e9-3186-4855-98c3-20f6dc9a9d25",
      "brand_id": "d421865e-5344-4b92-a8dd-ee525da88f1e",
      "slug": "royal-oak-offshore-chronograph",
      "label": "Royal Oak Offshore Chronograph",
      "created_at": "2025-06-07 18:04:00.960549+00",
      "popular": false
    },
    {
      "id": "7bac13bb-a6f9-4aae-aee0-c72a116061b9",
      "brand_id": "d421865e-5344-4b92-a8dd-ee525da88f1e",
      "slug": "royal-oak-offshore-chronograph-volcano",
      "label": "Royal Oak Offshore Chronograph Volcano",
      "created_at": "2025-06-07 18:04:00.960549+00",
      "popular": false
    },
    {
      "id": "584d5490-315b-480c-9def-af5ee8528206",
      "brand_id": "d421865e-5344-4b92-a8dd-ee525da88f1e",
      "slug": "royal-oak-offshore-diver",
      "label": "Royal Oak Offshore Diver",
      "created_at": "2025-06-07 18:04:00.960549+00",
      "popular": false
    },
    {
      "id": "1cdff934-19e7-4e57-a510-fbe5760d9c95",
      "brand_id": "d421865e-5344-4b92-a8dd-ee525da88f1e",
      "slug": "royal-oak-offshore-diver-chronograph",
      "label": "Royal Oak Offshore Diver Chronograph",
      "created_at": "2025-06-07 18:04:00.960549+00",
      "popular": false
    },
    {
      "id": "52dec6e9-0378-4337-9f95-3ccb86b58252",
      "brand_id": "d421865e-5344-4b92-a8dd-ee525da88f1e",
      "slug": "royal-oak-offshore-grand-prix",
      "label": "Royal Oak Offshore Grand Prix",
      "created_at": "2025-06-07 18:04:00.960549+00",
      "popular": false
    },
    {
      "id": "ab0d443c-a2f9-46b6-9d51-6e0691a9ef43",
      "brand_id": "d421865e-5344-4b92-a8dd-ee525da88f1e",
      "slug": "royal-oak-offshore-lady",
      "label": "Royal Oak Offshore Lady",
      "created_at": "2025-06-07 18:04:00.960549+00",
      "popular": false
    },
    {
      "id": "d674c341-d76f-4f27-bbb5-45ae8344389d",
      "brand_id": "d421865e-5344-4b92-a8dd-ee525da88f1e",
      "slug": "royal-oak-offshore-tourbillon-chronograph",
      "label": "Royal Oak Offshore Tourbillon Chronograph",
      "created_at": "2025-06-07 18:04:00.960549+00",
      "popular": false
    },
    {
      "id": "8b678b44-d975-4198-9372-2372968ea702",
      "brand_id": "d421865e-5344-4b92-a8dd-ee525da88f1e",
      "slug": "royal-oak-perpetual-calendar",
      "label": "Royal Oak Perpetual Calendar",
      "created_at": "2025-06-07 18:04:00.960549+00",
      "popular": false
    },
    {
      "id": "7da95c51-ea0c-44f1-9633-e7e890d01ead",
      "brand_id": "d421865e-5344-4b92-a8dd-ee525da88f1e",
      "slug": "royal-oak-selfwinding",
      "label": "Royal Oak Selfwinding",
      "created_at": "2025-06-07 18:04:00.960549+00",
      "popular": false
    },
    {
      "id": "ee8a07c9-19d5-43b7-9cea-d03e4e0056d7",
      "brand_id": "d421865e-5344-4b92-a8dd-ee525da88f1e",
      "slug": "royal-oak-tourbillon",
      "label": "Royal Oak Tourbillon",
      "created_at": "2025-06-07 18:04:00.960549+00",
      "popular": false
    },
    {
      "id": "24e92b6c-068b-45d7-a810-6f705bff7c88",
      "brand_id": "d421865e-5344-4b92-a8dd-ee525da88f1e",
      "slug": "star-wheel",
      "label": "Star Wheel",
      "created_at": "2025-06-07 18:04:00.960549+00",
      "popular": false
    },
    {
      "id": "5cdbee2f-d88d-41fb-9ec3-cee62508794c",
      "brand_id": "d421865e-5344-4b92-a8dd-ee525da88f1e",
      "slug": "tradition",
      "label": "Tradition",
      "created_at": "2025-06-07 18:04:00.960549+00",
      "popular": false
    },
    {
      "id": "d66002f5-3721-48e6-868f-01d0aed7045a",
      "brand_id": "29692e6c-7d55-4a03-9ac9-2e50e8f455e8",
      "slug": "day-date",
      "label": "Day-Date",
      "created_at": "2025-05-30 14:54:15.307336+00",
      "popular": true
    },
    {
      "id": "1736de0d-291e-49a0-9647-6255fb7aeb82",
      "brand_id": "29692e6c-7d55-4a03-9ac9-2e50e8f455e8",
      "slug": "submariner",
      "label": "Submariner",
      "created_at": "2025-05-30 14:54:15.162695+00",
      "popular": true
    },
    {
      "id": "091cdfb3-86da-4f18-8e35-1210d0ac7881",
      "brand_id": "c926b996-58d0-430d-8b4c-17a6fc4fe8ea",
      "slug": "nautilus",
      "label": "Nautilus",
      "created_at": "2025-05-30 14:54:16.173809+00",
      "popular": true
    },
    {
      "id": "0a05926a-e2ad-466f-b878-5f2f52664216",
      "brand_id": "c926b996-58d0-430d-8b4c-17a6fc4fe8ea",
      "slug": "calatrava",
      "label": "Calatrava",
      "created_at": "2025-05-30 14:54:16.269824+00",
      "popular": true
    },
    {
      "id": "73ed227f-b59d-4c91-a44d-01857e965509",
      "brand_id": "c926b996-58d0-430d-8b4c-17a6fc4fe8ea",
      "slug": "grand-complications",
      "label": "Grand Complications",
      "created_at": "2025-05-30 14:54:16.335561+00",
      "popular": true
    },
    {
      "id": "af60b1e8-05bd-4d18-8c9a-080860beca7a",
      "brand_id": "c926b996-58d0-430d-8b4c-17a6fc4fe8ea",
      "slug": "aquanaut",
      "label": "Aquanaut",
      "created_at": "2025-05-30 14:54:16.220908+00",
      "popular": true
    },
    {
      "id": "c3fea502-a5a1-4c2a-b3cf-bfeb2886ce32",
      "brand_id": "d421865e-5344-4b92-a8dd-ee525da88f1e",
      "slug": "royal-oak",
      "label": "Royal Oak",
      "created_at": "2025-05-30 14:54:16.574257+00",
      "popular": true
    },
    {
      "id": "e18df4cd-4744-4474-a928-425430ee56f0",
      "brand_id": "d421865e-5344-4b92-a8dd-ee525da88f1e",
      "slug": "royal-oak-chronograph",
      "label": "Royal Oak Chronograph",
      "created_at": "2025-06-07 18:04:00.960549+00",
      "popular": true
    },
    {
      "id": "eab6d189-2279-42e8-a9e7-483455e7f5ed",
      "brand_id": "a8ef4cfd-155c-47ec-ab26-7b5806288961",
      "slug": "santos",
      "label": "Santos",
      "created_at": "2025-05-30 14:54:17.683602+00",
      "popular": true
    },
    {
      "id": "b802b4f8-3fc0-4c87-8667-c59cf0fdad4a",
      "brand_id": "a8ef4cfd-155c-47ec-ab26-7b5806288961",
      "slug": "tank",
      "label": "Tank",
      "created_at": "2025-05-30 14:54:17.631467+00",
      "popular": true
    },
    {
      "id": "cebf42d5-746c-495d-ad64-792567c7c092",
      "brand_id": "a8ef4cfd-155c-47ec-ab26-7b5806288961",
      "slug": "panthere",
      "label": "Panthère",
      "created_at": "2025-05-30 14:54:17.831529+00",
      "popular": true
    },
    {
      "id": "f33300f9-6548-4b7c-a868-9773cf63fd47",
      "brand_id": "a8ef4cfd-155c-47ec-ab26-7b5806288961",
      "slug": "ballon-bleu",
      "label": "Ballon Bleu",
      "created_at": "2025-05-30 14:54:17.785776+00",
      "popular": true
    },
    {
      "id": "48315a4e-be85-4dca-9b7b-aa25c21ebcbf",
      "brand_id": "96f7bbb1-2a1c-4d4e-a163-70d9076734e9",
      "slug": "seamaster-aqua-terra",
      "label": "Seamaster Aqua Terra",
      "created_at": "2025-05-30 14:54:15.827776+00",
      "popular": true
    },
    {
      "id": "b3c2723d-fb03-49a0-87eb-9c3e58b1a9b4",
      "brand_id": "29692e6c-7d55-4a03-9ac9-2e50e8f455e8",
      "slug": "1908",
      "label": "1908",
      "created_at": "2025-06-07 18:04:01.196565+00",
      "popular": false
    },
    {
      "id": "6b2517d5-6378-4ac8-96ac-3b77dc20c932",
      "brand_id": "29692e6c-7d55-4a03-9ac9-2e50e8f455e8",
      "slug": "air-king",
      "label": "Air King",
      "created_at": "2025-06-07 18:04:01.196565+00",
      "popular": false
    },
    {
      "id": "b35682f3-d31e-41f2-b506-8a10bb0469f1",
      "brand_id": "29692e6c-7d55-4a03-9ac9-2e50e8f455e8",
      "slug": "cellini",
      "label": "Cellini",
      "created_at": "2025-06-07 18:04:01.196565+00",
      "popular": false
    },
    {
      "id": "54c9cb06-d2fe-4fb3-b7e8-39dafeeea999",
      "brand_id": "29692e6c-7d55-4a03-9ac9-2e50e8f455e8",
      "slug": "cellini-danaos",
      "label": "Cellini Danaos",
      "created_at": "2025-06-07 18:04:01.196565+00",
      "popular": false
    },
    {
      "id": "634c7d99-275d-44cb-92f1-c8bb126e6500",
      "brand_id": "29692e6c-7d55-4a03-9ac9-2e50e8f455e8",
      "slug": "cellini-date",
      "label": "Cellini Date",
      "created_at": "2025-06-07 18:04:01.196565+00",
      "popular": false
    },
    {
      "id": "dacf8323-3cfc-4d7a-a918-b9013c578628",
      "brand_id": "29692e6c-7d55-4a03-9ac9-2e50e8f455e8",
      "slug": "cellini-dual-time",
      "label": "Cellini Dual Time",
      "created_at": "2025-06-07 18:04:01.196565+00",
      "popular": false
    },
    {
      "id": "373da3fd-f9e2-4d46-9f86-ac77f973fd05",
      "brand_id": "29692e6c-7d55-4a03-9ac9-2e50e8f455e8",
      "slug": "cellini-moonphase",
      "label": "Cellini Moonphase",
      "created_at": "2025-06-07 18:04:01.196565+00",
      "popular": false
    },
    {
      "id": "8773b191-34a2-449e-a6ef-b8602ffa8c25",
      "brand_id": "29692e6c-7d55-4a03-9ac9-2e50e8f455e8",
      "slug": "cellini-prince",
      "label": "Cellini Prince",
      "created_at": "2025-06-07 18:04:01.196565+00",
      "popular": false
    },
    {
      "id": "6669a0f4-4728-433e-b3cb-d03ca2c71c4e",
      "brand_id": "29692e6c-7d55-4a03-9ac9-2e50e8f455e8",
      "slug": "cellini-time",
      "label": "Cellini Time",
      "created_at": "2025-06-07 18:04:01.196565+00",
      "popular": false
    },
    {
      "id": "18cf8fd9-5fcc-4cd1-a412-aa81aa039c28",
      "brand_id": "29692e6c-7d55-4a03-9ac9-2e50e8f455e8",
      "slug": "chronograph",
      "label": "Chronograph",
      "created_at": "2025-06-07 18:04:01.196565+00",
      "popular": false
    },
    {
      "id": "dbcc7bdd-0f25-4218-a352-98c7984dfb17",
      "brand_id": "29692e6c-7d55-4a03-9ac9-2e50e8f455e8",
      "slug": "datejust-31",
      "label": "Datejust 31",
      "created_at": "2025-06-07 18:04:01.196565+00",
      "popular": false
    },
    {
      "id": "48436d8e-cdc4-4b45-b092-02f3bc54924d",
      "brand_id": "29692e6c-7d55-4a03-9ac9-2e50e8f455e8",
      "slug": "datejust-36",
      "label": "Datejust 36",
      "created_at": "2025-06-07 18:04:01.196565+00",
      "popular": false
    },
    {
      "id": "2ee99c07-c8f9-4f91-9be4-86550d11a923",
      "brand_id": "29692e6c-7d55-4a03-9ac9-2e50e8f455e8",
      "slug": "datejust-41",
      "label": "Datejust 41",
      "created_at": "2025-06-07 18:04:01.196565+00",
      "popular": false
    },
    {
      "id": "14799939-9845-4c60-9eca-32fba0bacd55",
      "brand_id": "29692e6c-7d55-4a03-9ac9-2e50e8f455e8",
      "slug": "datejust-ii",
      "label": "Datejust II",
      "created_at": "2025-06-07 18:04:01.196565+00",
      "popular": false
    },
    {
      "id": "01c5088e-216f-40eb-a657-6a2ef15b32c1",
      "brand_id": "29692e6c-7d55-4a03-9ac9-2e50e8f455e8",
      "slug": "datejust-oysterquartz",
      "label": "Datejust Oysterquartz",
      "created_at": "2025-06-07 18:04:01.196565+00",
      "popular": false
    },
    {
      "id": "bbc8e7bf-fa59-4d04-9888-f48fb839f961",
      "brand_id": "29692e6c-7d55-4a03-9ac9-2e50e8f455e8",
      "slug": "datejust-turn-o-graph",
      "label": "Datejust Turn-O-Graph",
      "created_at": "2025-06-07 18:04:01.196565+00",
      "popular": false
    },
    {
      "id": "368a5783-7d6e-488f-bf6d-4d0ab9b32624",
      "brand_id": "29692e6c-7d55-4a03-9ac9-2e50e8f455e8",
      "slug": "day-date-36",
      "label": "Day-Date 36",
      "created_at": "2025-06-07 18:04:01.196565+00",
      "popular": false
    },
    {
      "id": "2f53dd45-de89-4ecc-a44e-ae35733f9b19",
      "brand_id": "29692e6c-7d55-4a03-9ac9-2e50e8f455e8",
      "slug": "day-date-40",
      "label": "Day-Date 40",
      "created_at": "2025-06-07 18:04:01.196565+00",
      "popular": false
    },
    {
      "id": "306ac7b2-8bc9-4842-85c4-8cd6a48425c4",
      "brand_id": "29692e6c-7d55-4a03-9ac9-2e50e8f455e8",
      "slug": "day-date-ii",
      "label": "Day-Date II",
      "created_at": "2025-06-07 18:04:01.196565+00",
      "popular": false
    },
    {
      "id": "e2ccaed2-cbd0-48d5-973b-8493eeacda99",
      "brand_id": "29692e6c-7d55-4a03-9ac9-2e50e8f455e8",
      "slug": "day-date-oysterquartz",
      "label": "Day-Date Oysterquartz",
      "created_at": "2025-06-07 18:04:01.196565+00",
      "popular": false
    },
    {
      "id": "ffdeadd0-e884-4170-b021-09ed61c3a33b",
      "brand_id": "29692e6c-7d55-4a03-9ac9-2e50e8f455e8",
      "slug": "explorer-ii",
      "label": "Explorer II",
      "created_at": "2025-06-07 18:04:01.196565+00",
      "popular": false
    },
    {
      "id": "4b1078d5-e667-42fa-99d4-84d7b65ed3e8",
      "brand_id": "29692e6c-7d55-4a03-9ac9-2e50e8f455e8",
      "slug": "gmt-master",
      "label": "GMT-Master",
      "created_at": "2025-06-07 18:04:01.196565+00",
      "popular": false
    },
    {
      "id": "8897bb6c-028b-48aa-a019-b8da82d56946",
      "brand_id": "29692e6c-7d55-4a03-9ac9-2e50e8f455e8",
      "slug": "lady-datejust",
      "label": "Lady-Datejust",
      "created_at": "2025-06-07 18:04:01.196565+00",
      "popular": false
    },
    {
      "id": "a3ad7c0f-040b-4c2d-8eff-43ce005eacfc",
      "brand_id": "29692e6c-7d55-4a03-9ac9-2e50e8f455e8",
      "slug": "lady-datejust-pearlmaster",
      "label": "Lady-Datejust Pearlmaster",
      "created_at": "2025-06-07 18:04:01.196565+00",
      "popular": false
    },
    {
      "id": "7b888486-c0a4-4f1a-9dd9-428fe3fffb1f",
      "brand_id": "29692e6c-7d55-4a03-9ac9-2e50e8f455e8",
      "slug": "milgauss",
      "label": "Milgauss",
      "created_at": "2025-06-07 18:04:01.196565+00",
      "popular": false
    },
    {
      "id": "9e6d810f-f95f-4e79-aa81-f4e890dd39a2",
      "brand_id": "29692e6c-7d55-4a03-9ac9-2e50e8f455e8",
      "slug": "oyster",
      "label": "Oyster",
      "created_at": "2025-06-07 18:04:01.196565+00",
      "popular": false
    },
    {
      "id": "5fbf263f-1216-4ebd-b0d1-b43206339673",
      "brand_id": "29692e6c-7d55-4a03-9ac9-2e50e8f455e8",
      "slug": "oysterdate-precision",
      "label": "Oysterdate Precision",
      "created_at": "2025-06-07 18:04:01.196565+00",
      "popular": false
    },
    {
      "id": "4639a22d-e71b-4373-8d1c-9a019888bc57",
      "brand_id": "29692e6c-7d55-4a03-9ac9-2e50e8f455e8",
      "slug": "oyster-perpetual-26",
      "label": "Oyster Perpetual 26",
      "created_at": "2025-06-07 18:04:01.440984+00",
      "popular": false
    },
    {
      "id": "26dd0a56-4274-482d-9b74-8a67bcbb75e7",
      "brand_id": "29692e6c-7d55-4a03-9ac9-2e50e8f455e8",
      "slug": "oyster-perpetual-28",
      "label": "Oyster Perpetual 28",
      "created_at": "2025-06-07 18:04:01.440984+00",
      "popular": false
    },
    {
      "id": "10248c69-96d6-472d-8aec-5560ebdd67ea",
      "brand_id": "29692e6c-7d55-4a03-9ac9-2e50e8f455e8",
      "slug": "oyster-perpetual-31",
      "label": "Oyster Perpetual 31",
      "created_at": "2025-06-07 18:04:01.440984+00",
      "popular": false
    },
    {
      "id": "03e3d593-38fa-44f0-aea2-44fd14250431",
      "brand_id": "29692e6c-7d55-4a03-9ac9-2e50e8f455e8",
      "slug": "oyster-perpetual-34",
      "label": "Oyster Perpetual 34",
      "created_at": "2025-06-07 18:04:01.440984+00",
      "popular": false
    },
    {
      "id": "f90b9d7d-c851-4b2f-92e2-94b926ed425a",
      "brand_id": "29692e6c-7d55-4a03-9ac9-2e50e8f455e8",
      "slug": "oyster-perpetual-36",
      "label": "Oyster Perpetual 36",
      "created_at": "2025-06-07 18:04:01.440984+00",
      "popular": false
    },
    {
      "id": "8cd45e30-e03a-420c-8378-55d186ba0673",
      "brand_id": "29692e6c-7d55-4a03-9ac9-2e50e8f455e8",
      "slug": "oyster-perpetual-39",
      "label": "Oyster Perpetual 39",
      "created_at": "2025-06-07 18:04:01.440984+00",
      "popular": false
    },
    {
      "id": "56a05e1c-f733-4480-9a32-9457b4ab5f21",
      "brand_id": "29692e6c-7d55-4a03-9ac9-2e50e8f455e8",
      "slug": "oyster-perpetual-41",
      "label": "Oyster Perpetual 41",
      "created_at": "2025-06-07 18:04:01.440984+00",
      "popular": false
    },
    {
      "id": "9ca92446-2a7c-4f36-827d-b50088a2b3be",
      "brand_id": "29692e6c-7d55-4a03-9ac9-2e50e8f455e8",
      "slug": "oyster-perpetual-date",
      "label": "Oyster Perpetual Date",
      "created_at": "2025-06-07 18:04:01.440984+00",
      "popular": false
    },
    {
      "id": "b8ea0568-0bb3-47ee-b32d-a76755d16a0d",
      "brand_id": "29692e6c-7d55-4a03-9ac9-2e50e8f455e8",
      "slug": "oyster-perpetual-lady-date",
      "label": "Oyster Perpetual Lady Date",
      "created_at": "2025-06-07 18:04:01.440984+00",
      "popular": false
    },
    {
      "id": "ea26545d-9f64-49b5-b822-d45029aff55c",
      "brand_id": "29692e6c-7d55-4a03-9ac9-2e50e8f455e8",
      "slug": "oyster-precision",
      "label": "Oyster Precision",
      "created_at": "2025-06-07 18:04:01.440984+00",
      "popular": false
    },
    {
      "id": "de153eb6-27ca-4ad5-b42c-d2fec90a0f93",
      "brand_id": "29692e6c-7d55-4a03-9ac9-2e50e8f455e8",
      "slug": "pearlmaster",
      "label": "Pearlmaster",
      "created_at": "2025-06-07 18:04:01.440984+00",
      "popular": false
    },
    {
      "id": "b17385de-3c51-4540-99a2-b31fdbf160fe",
      "brand_id": "29692e6c-7d55-4a03-9ac9-2e50e8f455e8",
      "slug": "precision",
      "label": "Precision",
      "created_at": "2025-06-07 18:04:01.440984+00",
      "popular": false
    },
    {
      "id": "23be40c1-a2c1-481e-8df1-647078ffc4db",
      "brand_id": "29692e6c-7d55-4a03-9ac9-2e50e8f455e8",
      "slug": "prince",
      "label": "Prince",
      "created_at": "2025-06-07 18:04:01.440984+00",
      "popular": false
    },
    {
      "id": "c68da120-337a-416a-9942-c5b95e06c403",
      "brand_id": "29692e6c-7d55-4a03-9ac9-2e50e8f455e8",
      "slug": "sea-dweller-4000",
      "label": "Sea-Dweller 4000",
      "created_at": "2025-06-07 18:04:01.440984+00",
      "popular": false
    },
    {
      "id": "00293c9e-dd4e-433a-9944-d8f29346652b",
      "brand_id": "29692e6c-7d55-4a03-9ac9-2e50e8f455e8",
      "slug": "sea-dweller-deepsea",
      "label": "Sea-Dweller Deepsea",
      "created_at": "2025-06-07 18:04:01.440984+00",
      "popular": false
    },
    {
      "id": "332d1586-3524-4f49-aa71-6d1d733081e4",
      "brand_id": "29692e6c-7d55-4a03-9ac9-2e50e8f455e8",
      "slug": "submariner-no-date",
      "label": "Submariner (No Date)",
      "created_at": "2025-06-07 18:04:01.440984+00",
      "popular": false
    },
    {
      "id": "f0c651d6-b25f-4d5e-b4d2-c78db77c1648",
      "brand_id": "29692e6c-7d55-4a03-9ac9-2e50e8f455e8",
      "slug": "submariner-date",
      "label": "Submariner Date",
      "created_at": "2025-06-07 18:04:01.440984+00",
      "popular": false
    },
    {
      "id": "fc99a5ae-c807-4421-96e4-d986175a4325",
      "brand_id": "29692e6c-7d55-4a03-9ac9-2e50e8f455e8",
      "slug": "yacht-master-37",
      "label": "Yacht-Master 37",
      "created_at": "2025-06-07 18:04:01.440984+00",
      "popular": false
    },
    {
      "id": "ed47c11d-9843-4432-a159-a2b6ec5d0fbf",
      "brand_id": "29692e6c-7d55-4a03-9ac9-2e50e8f455e8",
      "slug": "yacht-master-40",
      "label": "Yacht-Master 40",
      "created_at": "2025-06-07 18:04:01.440984+00",
      "popular": false
    },
    {
      "id": "e26edbd8-835b-4821-9e58-c9b1df3fb79e",
      "brand_id": "29692e6c-7d55-4a03-9ac9-2e50e8f455e8",
      "slug": "yacht-master-42",
      "label": "Yacht-Master 42",
      "created_at": "2025-06-07 18:04:01.440984+00",
      "popular": false
    },
    {
      "id": "6e610ca8-7cbe-48d0-8d8d-ca80da590e3a",
      "brand_id": "29692e6c-7d55-4a03-9ac9-2e50e8f455e8",
      "slug": "yacht-master-ii",
      "label": "Yacht-Master II",
      "created_at": "2025-06-07 18:04:01.440984+00",
      "popular": false
    },
    {
      "id": "43b8e0c9-4135-48e7-91b9-571106766e72",
      "brand_id": "29692e6c-7d55-4a03-9ac9-2e50e8f455e8",
      "slug": "daytona",
      "label": "Daytona",
      "created_at": "2025-05-30 14:54:15.209648+00",
      "popular": true
    },
    {
      "id": "36ddbacc-ab96-49bc-9bfa-2bb51a78a849",
      "brand_id": "5ca76279-4b2d-4ad6-9b9c-58d16e3c0a94",
      "slug": "submariner",
      "label": "Submariner",
      "created_at": "2025-06-07 18:04:03.138118+00",
      "popular": true
    },
    {
      "id": "6c9ad0e1-9561-4b34-9b71-0e3b71481fa9",
      "brand_id": "d421865e-5344-4b92-a8dd-ee525da88f1e",
      "slug": "royal-oak-offshore",
      "label": "Royal Oak Offshore",
      "created_at": "2025-05-30 14:54:16.627908+00",
      "popular": true
    },
    {
      "id": "0990b5f4-0f41-47a0-aa13-c3b7f1dbabe0",
      "brand_id": "00001610-29b4-4b0d-b987-416fdbc196d2",
      "slug": "other",
      "label": "Other",
      "created_at": "2025-06-19 08:25:35.666506+00",
      "popular": false
    },
    {
      "id": "b2eb339c-c8e5-42c5-8f13-d3400be74ffe",
      "brand_id": "0cb1dc50-62e4-4f6f-b6e3-0ef43c6609f1",
      "slug": "other",
      "label": "Other",
      "created_at": "2025-06-19 08:25:35.666506+00",
      "popular": false
    },
    {
      "id": "f719418a-641d-4d95-8e5e-44bf33940a15",
      "brand_id": "267fb859-934a-47ad-b030-d6cdc3666c50",
      "slug": "other",
      "label": "Other",
      "created_at": "2025-06-19 08:25:35.666506+00",
      "popular": false
    },
    {
      "id": "777a04ab-60a3-4cee-a70f-2babaf1b9ca7",
      "brand_id": "27c95066-ebb0-47d8-9ea9-e5dc6561ca37",
      "slug": "other",
      "label": "Other",
      "created_at": "2025-06-19 08:25:35.666506+00",
      "popular": false
    },
    {
      "id": "298f27e6-b1ec-4970-b582-ccfe7b4f2dbc",
      "brand_id": "29692e6c-7d55-4a03-9ac9-2e50e8f455e8",
      "slug": "other",
      "label": "Other",
      "created_at": "2025-06-19 08:25:35.666506+00",
      "popular": false
    },
    {
      "id": "8c78290b-ec56-4f31-9ca0-48811ce91a69",
      "brand_id": "2d1e9e98-9c4d-43d5-bbf0-19e0a3b692f7",
      "slug": "other",
      "label": "Other",
      "created_at": "2025-06-19 08:25:35.666506+00",
      "popular": false
    },
    {
      "id": "52191027-c96a-49a3-9609-f07f1ce7e97f",
      "brand_id": "313b1ebc-ab4f-41d8-8bb1-4d35b6ec8fc7",
      "slug": "other",
      "label": "Other",
      "created_at": "2025-06-19 08:25:35.666506+00",
      "popular": false
    },
    {
      "id": "6f78c299-092a-4f2f-b85b-5657696dccc3",
      "brand_id": "32dd7f29-deb3-4885-bb15-7620c3491df3",
      "slug": "other",
      "label": "Other",
      "created_at": "2025-06-19 08:25:35.666506+00",
      "popular": false
    },
    {
      "id": "7dd3ea2b-392a-40be-9a32-7dbed6b58b3a",
      "brand_id": "42461112-f532-43a8-a727-d2df804d1940",
      "slug": "other",
      "label": "Other",
      "created_at": "2025-06-19 08:25:35.666506+00",
      "popular": false
    },
    {
      "id": "0b692933-688d-4f8d-ad64-21d91f1e87fa",
      "brand_id": "4b528ab8-0b61-4a1a-bf17-3a936b57f424",
      "slug": "other",
      "label": "Other",
      "created_at": "2025-06-19 08:25:35.666506+00",
      "popular": false
    },
    {
      "id": "e0a1bd08-a172-4c8c-9011-b81a729d0126",
      "brand_id": "526c2d41-52d1-4525-8aec-5498bb15e249",
      "slug": "other",
      "label": "Other",
      "created_at": "2025-06-19 08:25:35.666506+00",
      "popular": false
    },
    {
      "id": "98014834-0ce6-4dbb-b896-c14c7a70d4ae",
      "brand_id": "5ca76279-4b2d-4ad6-9b9c-58d16e3c0a94",
      "slug": "other",
      "label": "Other",
      "created_at": "2025-06-19 08:25:35.666506+00",
      "popular": false
    },
    {
      "id": "338b2d13-6a6f-4afd-a550-7c3d1c4c7e55",
      "brand_id": "5cc76394-ecb4-4e13-ab35-f0bacd8b10df",
      "slug": "other",
      "label": "Other",
      "created_at": "2025-06-19 08:25:35.666506+00",
      "popular": false
    },
    {
      "id": "3696ef1b-2b59-47b1-ac00-09c05b2d79a5",
      "brand_id": "618c6a35-ccb5-4aff-877e-c48b2101103a",
      "slug": "other",
      "label": "Other",
      "created_at": "2025-06-19 08:25:35.666506+00",
      "popular": false
    },
    {
      "id": "73619379-8544-4b38-b964-3adf200e3f42",
      "brand_id": "731ec105-c1a2-4a8b-9e16-c1885804ce55",
      "slug": "other",
      "label": "Other",
      "created_at": "2025-06-19 08:25:35.666506+00",
      "popular": false
    },
    {
      "id": "beebea3d-c6e6-4765-aecc-995cb64182cb",
      "brand_id": "8ebb31e7-151c-49c6-b719-3d82f6294bd9",
      "slug": "other",
      "label": "Other",
      "created_at": "2025-06-19 08:25:35.666506+00",
      "popular": false
    },
    {
      "id": "907cf209-8893-427d-bba2-4935b082a803",
      "brand_id": "92f07b61-6319-471e-b6af-0eb30ee6838c",
      "slug": "other",
      "label": "Other",
      "created_at": "2025-06-19 08:25:35.666506+00",
      "popular": false
    },
    {
      "id": "86f9defc-980c-4119-8afe-8ac42b8e158f",
      "brand_id": "96f7bbb1-2a1c-4d4e-a163-70d9076734e9",
      "slug": "other",
      "label": "Other",
      "created_at": "2025-06-19 08:25:35.666506+00",
      "popular": false
    },
    {
      "id": "bf76abe1-39fd-4e4a-bf90-6206f6fa493f",
      "brand_id": "97858d23-05fe-4576-ae8c-581338b7a0df",
      "slug": "other",
      "label": "Other",
      "created_at": "2025-06-19 08:25:35.666506+00",
      "popular": false
    },
    {
      "id": "8eec47f8-0912-46bc-aaa8-dafd60a47a38",
      "brand_id": "9ffe59c2-e6a8-4833-b544-e985066459c4",
      "slug": "other",
      "label": "Other",
      "created_at": "2025-06-19 08:25:35.666506+00",
      "popular": false
    },
    {
      "id": "a2cb8f9f-59f5-43e3-96d3-a9f2b2cee739",
      "brand_id": "a8ef4cfd-155c-47ec-ab26-7b5806288961",
      "slug": "other",
      "label": "Other",
      "created_at": "2025-06-19 08:25:35.666506+00",
      "popular": false
    },
    {
      "id": "d0fa810e-5b19-450f-802e-3a500acb7b54",
      "brand_id": "a9cfdd75-047e-4119-8db8-e33744e8c9b2",
      "slug": "other",
      "label": "Other",
      "created_at": "2025-06-19 08:25:35.666506+00",
      "popular": false
    },
    {
      "id": "f01ad6a8-c6cd-45f5-a567-e156beca62f2",
      "brand_id": "bb6d9e72-c952-4489-b218-a9f57fdcf8db",
      "slug": "other",
      "label": "Other",
      "created_at": "2025-06-19 08:25:35.666506+00",
      "popular": false
    },
    {
      "id": "37a8988b-4982-4909-b6f1-56ead675e6f7",
      "brand_id": "bf1a4585-e3db-4621-a33f-20c658bcd9e0",
      "slug": "other",
      "label": "Other",
      "created_at": "2025-06-19 08:25:35.666506+00",
      "popular": false
    },
    {
      "id": "48e73e38-0488-475f-9594-cd4f3b11a1de",
      "brand_id": "c0c7d48e-d577-4c9d-a32d-1d8b52813450",
      "slug": "other",
      "label": "Other",
      "created_at": "2025-06-19 08:25:35.666506+00",
      "popular": false
    },
    {
      "id": "35149ede-7ed3-4127-95d6-f34759c6a779",
      "brand_id": "c926b996-58d0-430d-8b4c-17a6fc4fe8ea",
      "slug": "other",
      "label": "Other",
      "created_at": "2025-06-19 08:25:35.666506+00",
      "popular": false
    },
    {
      "id": "ce7cad2f-0653-46d8-913e-e4c5fc90aed6",
      "brand_id": "ce0bab2f-2730-41da-8f94-bad32d6138c0",
      "slug": "other",
      "label": "Other",
      "created_at": "2025-06-19 08:25:35.666506+00",
      "popular": false
    },
    {
      "id": "a2b70375-46c7-4a33-9612-6005e85bbf3f",
      "brand_id": "d1aa02d2-bd20-4136-ad3e-c7ef36e11055",
      "slug": "other",
      "label": "Other",
      "created_at": "2025-06-19 08:25:35.666506+00",
      "popular": false
    },
    {
      "id": "8898df9b-cfa7-4373-af23-567d09738dc2",
      "brand_id": "d32d40c0-7ea1-4b72-a282-6b86f07e61f2",
      "slug": "other",
      "label": "Other",
      "created_at": "2025-06-19 08:25:35.666506+00",
      "popular": false
    },
    {
      "id": "9c6b8e35-1434-4bb9-a2a4-f7e318932f43",
      "brand_id": "d421865e-5344-4b92-a8dd-ee525da88f1e",
      "slug": "other",
      "label": "Other",
      "created_at": "2025-06-19 08:25:35.666506+00",
      "popular": false
    },
    {
      "id": "b858c22a-26fc-41a0-8ca3-46913d69d1e4",
      "brand_id": "e42d3b7c-d1aa-4f5c-8736-94e8f6a00f13",
      "slug": "other",
      "label": "Other",
      "created_at": "2025-06-19 08:25:35.666506+00",
      "popular": false
    },
    {
      "id": "d3aa7a7f-b201-4c72-ba24-4d6a0356699c",
      "brand_id": "ead86a7d-9a6f-4ab5-935f-93621bf31df3",
      "slug": "other",
      "label": "Other",
      "created_at": "2025-06-19 08:25:35.666506+00",
      "popular": false
    },
    {
      "id": "2384bb88-be0a-46cb-bdc7-448bf308a101",
      "brand_id": "f24149d5-852d-4de8-909d-a8729f85c0f0",
      "slug": "other",
      "label": "Other",
      "created_at": "2025-06-19 08:25:35.666506+00",
      "popular": false
    },
    {
      "id": "d249042a-716e-45e4-bd13-d33bd9cdb8d7",
      "brand_id": "fabf8fc3-739d-44ce-9039-ffa21ab7e587",
      "slug": "other",
      "label": "Other",
      "created_at": "2025-06-19 08:25:35.666506+00",
      "popular": false
    }
  ]

  const sellers = [
    {
      "id": "3d6568fd-d2b5-4ca5-b3c3-ee1677cfa626",
      "company_name": "✅ Watch Pros",
      "watch_pros_name": "✅ Watch Pros",
      "company_status": "SAS",
      "first_name": "Watch",
      "last_name": "Pros",
      "email": "support@watch-pros.com",
      "country": "",
      "phone_prefix": "",
      "phone": "",
      "created_at": "2025-06-14 20:52:59.682421+00",
      "updated_at": "2025-06-14 20:52:59.682421+00",
      "id_card_front_url": "",
      "id_card_back_url": "",
      "proof_of_address_url": "",
      "user_id": "65ab2dae-dd18-493e-96f9-831d2b2312bc",
      "crypto_friendly": true,
      "search_vector": "'pros':2A,4A,6B 'support@watch-pros.com':7C 'watch':1A,3A,5B",
      "company_logo_url": "https://yxherqptduszoafpsapp.supabase.co/storage/v1/object/public/sellerdocuments/65ab2dae-dd18-493e-96f9-831d2b2312bc/companyLogo-1749934380838.png",
      "identity_verified": true,
      "identity_rejected": false
    },
    {
      "id": "b134afda-b6d1-4b5e-818b-726768185387",
      "company_name": "TEST ACCOUNT",
      "watch_pros_name": "TEST ACCOUNT",
      "company_status": "SAS",
      "first_name": "JOHN",
      "last_name": "DOE",
      "email": "cyrilcartoux@hotmail.fr",
      "country": "fr",
      "phone_prefix": "+33",
      "phone": "0693439483",
      "created_at": "2025-06-18 15:06:33.753396+00",
      "updated_at": "2025-06-18 15:06:33.753396+00",
      "id_card_front_url": "https://yxherqptduszoafpsapp.supabase.co/storage/v1/object/public/sellerdocuments/dc186bd5-6ad7-42bc-b443-1461a548d256/idCardFront-1750259193806.jpg",
      "id_card_back_url": "https://yxherqptduszoafpsapp.supabase.co/storage/v1/object/public/sellerdocuments/dc186bd5-6ad7-42bc-b443-1461a548d256/idCardBack-1750259194040.jpg",
      "proof_of_address_url": "https://yxherqptduszoafpsapp.supabase.co/storage/v1/object/public/sellerdocuments/dc186bd5-6ad7-42bc-b443-1461a548d256/proofOfAddress-1750259194248.jpg",
      "user_id": "dc186bd5-6ad7-42bc-b443-1461a548d256",
      "crypto_friendly": false,
      "search_vector": "'account':2A,4A 'cyrilcartoux@hotmail.fr':7C 'doe':6B 'john':5B 'test':1A,3A",
      "company_logo_url": "https://yxherqptduszoafpsapp.supabase.co/storage/v1/object/public/sellerdocuments/dc186bd5-6ad7-42bc-b443-1461a548d256/companyLogo-1750259194505.jpg",
      "identity_verified": true,
      "identity_rejected": false
    }
  ]
  
  const currencies = [
    { value: "EUR", label: "Euro", symbol: "€", flag: "🇪🇺" },
    { value: "USD", label: "US Dollar", symbol: "$", flag: "🇺🇸" },
    { value: "GBP", label: "British Pound", symbol: "£", flag: "🇬🇧" },
    { value: "CHF", label: "Swiss Franc", symbol: "CHF", flag: "🇨🇭" }
  ]

// Configuration
const BATCH_SIZE = 100; // Number of listings to insert at once
const TOTAL_LISTINGS = 1000; // Total number of listings to generate

// Initialize Supabase client
const supabaseUrl = 'https://yxherqptduszoafpsapp.supabase.co'; // TODO REPLACE
const supabaseKey = 'eyJhbGc' // TODO REPLACE WITH SERVICE ROLE KEY

const supabase = createClient(supabaseUrl, supabaseKey);

// Helper functions
const generateRandomPrice = () => {
  const min = 1000;
  const max = 100000;
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const generateRandomYear = () => {
  const min = 1950;
  const max = new Date().getFullYear();
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const generateRandomDiameter = () => {
  const min = 36;
  const max = 45;
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const conditions = ['new', 'like-new', 'very-good', 'good', 'fair', 'needs-service', 'for-parts'];
const dialColors = ['black', 'white', 'blue', 'silver', 'gold', 'green', 'grey'];
const caseMaterials = ['stainless-steel', 'gold', 'titanium', 'platinum', 'ceramic'];
const braceletMaterials = ['stainless-steel', 'leather', 'gold', 'rubber', 'fabric'];
const movements = ['automatic', 'manual', 'quartz', 'chronograph', 'tourbillon'];
const included = ['full-set', 'box-only', 'papers-only', 'watch-only'];
const shippingDelays = ['1-2 days', '3-5 days', '5-7 days', '7-10 days'];
const countries = ['fr', 'ch', 'us', 'gb', 'de', 'it', 'es', 'jp'];

// Helper function to get random model for a brand
const getRandomModelForBrand = (brand: {
  id:string,
  slug: string,
  label: string,
  created_at: string,
  popular: boolean
}) => {
  const brandModels = models.filter(model => model.brand_id === brand.id);
  return faker.helpers.arrayElement(brandModels);
};

async function generateListings() {
  console.log('Starting to generate listings...');
  
  for (let i = 0; i < TOTAL_LISTINGS; i += BATCH_SIZE) {
    const currentBatchSize = Math.min(BATCH_SIZE, TOTAL_LISTINGS - i);
    const listings = [];

    for (let j = 0; j < currentBatchSize; j++) {
      const brand = faker.helpers.arrayElement(brands);
      const model = getRandomModelForBrand(brand);
      const seller = faker.helpers.arrayElement(sellers);
      const year = generateRandomYear().toString();
      const diameter = generateRandomDiameter();
      const status = Math.random() < 0.25 ? 'sold' : 'active';
      const price = generateRandomPrice();
      const currency = faker.helpers.arrayElement(currencies);
      
      const listing = {
        reference_id: faker.string.uuid(),
        seller_id: seller.id,
        brand_id: brand.id,
        model_id: model.id,
        reference: faker.string.alphanumeric(8).toUpperCase(),
        title: `${brand.label} ${model.label} ${year}`,
        description: faker.commerce.productDescription(),
        year,
        serial_number: faker.string.alphanumeric(8).toUpperCase(),
        dial_color: faker.helpers.arrayElement(dialColors),
        diameter_min: diameter,
        diameter_max: diameter + 1,
        movement: faker.helpers.arrayElement(movements),
        case_material: faker.helpers.arrayElement(caseMaterials),
        bracelet_material: faker.helpers.arrayElement(braceletMaterials),
        bracelet_color: faker.helpers.arrayElement(dialColors),
        included: faker.helpers.arrayElements(included, { min: 1, max: 3 }).join(', '),
        condition: faker.helpers.arrayElement(conditions),
        price: generateRandomPrice(),
        shipping_delay: faker.helpers.arrayElement(shippingDelays),
        status,
        listing_type: 'watch',
        country: faker.helpers.arrayElement(countries),
        sold_at: status === 'sold' ? faker.date.between({ from: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000), to: new Date() }).toISOString() : null,
        final_price: status === 'sold' ? price - (price * 0.05) : null,
        currency: currency.value
      };

      listings.push(listing);
    }

    try {
      const { data, error } = await supabase
        .from('listings')
        .insert(listings);

      if (error) {
        console.error('Error inserting batch:', error);
        continue;
      }

      console.log(`Successfully inserted batch ${i / BATCH_SIZE + 1} of ${Math.ceil(TOTAL_LISTINGS / BATCH_SIZE)}`);
    } catch (error) {
      console.error('Error in batch insertion:', error);
    }
  }

  console.log('Finished generating listings!');
}

// Run the script
generateListings().catch(console.error); 