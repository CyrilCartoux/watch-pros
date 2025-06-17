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
      "label": "Pilot's Watch",
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
    }
  ]

  const sellers = [
    {
      "id": "3c0675a4-1d52-4072-aa6e-3d16c059a528",
      "company_name": "Arianee",
      "watch_pros_name": "Arianee",
      "company_status": "Sas",
      "first_name": "Arianee",
      "last_name": "Arianee",
      "email": "cyril@arianee.org",
      "country": "ch",
      "phone_prefix": "+33",
      "phone": "0612456113",
      "created_at": "2025-06-17 06:25:33.223706+00",
      "updated_at": "2025-06-17 06:25:33.223706+00",
      "id_card_front_url": "https://yxherqptduszoafpsapp.supabase.co/storage/v1/object/public/sellerdocuments/74689320-ad9e-421f-8b0a-723a0d7d9bca/idCardFront-1750141533661.jpg",
      "id_card_back_url": "https://yxherqptduszoafpsapp.supabase.co/storage/v1/object/public/sellerdocuments/74689320-ad9e-421f-8b0a-723a0d7d9bca/idCardBack-1750141534436.jpg",
      "proof_of_address_url": "https://yxherqptduszoafpsapp.supabase.co/storage/v1/object/public/sellerdocuments/74689320-ad9e-421f-8b0a-723a0d7d9bca/proofOfAddress-1750141535162.jpg",
      "user_id": "74689320-ad9e-421f-8b0a-723a0d7d9bca",
      "crypto_friendly": false,
      "search_vector": "'ariane':1A,2A,3B,4B 'cyril@arianee.org':5C",
      "company_logo_url": "https://yxherqptduszoafpsapp.supabase.co/storage/v1/object/public/sellerdocuments/74689320-ad9e-421f-8b0a-723a0d7d9bca/companyLogo-1750141535641.jpg",
      "identity_verified": true,
      "identity_rejected": false
    },
    {
      "id": "3d6568fd-d2b5-4ca5-b3c3-ee1677cfa626",
      "company_name": "Courtiers du temps",
      "watch_pros_name": "Courtiers du temps",
      "company_status": "SAS",
      "first_name": "Duncan",
      "last_name": "Cousin",
      "email": "cyrilcartoux13@gmail.com",
      "country": "fr",
      "phone_prefix": "+33",
      "phone": "0612457112",
      "created_at": "2025-06-14 20:52:59.682421+00",
      "updated_at": "2025-06-14 20:52:59.682421+00",
      "id_card_front_url": "https://yxherqptduszoafpsapp.supabase.co/storage/v1/object/public/sellerdocuments/65ab2dae-dd18-493e-96f9-831d2b2312bc/idCardFront-1749934379760.jpg",
      "id_card_back_url": "https://yxherqptduszoafpsapp.supabase.co/storage/v1/object/public/sellerdocuments/65ab2dae-dd18-493e-96f9-831d2b2312bc/idCardBack-1749934380257.jpg",
      "proof_of_address_url": "https://yxherqptduszoafpsapp.supabase.co/storage/v1/object/public/sellerdocuments/65ab2dae-dd18-493e-96f9-831d2b2312bc/proofOfAddress-1749934380608.jpg",
      "user_id": "65ab2dae-dd18-493e-96f9-831d2b2312bc",
      "crypto_friendly": true,
      "search_vector": "'courtier':1A,4A 'cousin':8B 'cyrilcartoux13@gmail.com':9C 'du':2A,5A 'duncan':7B 'temp':3A,6A",
      "company_logo_url": "https://yxherqptduszoafpsapp.supabase.co/storage/v1/object/public/sellerdocuments/65ab2dae-dd18-493e-96f9-831d2b2312bc/companyLogo-1749934380838.jpg",
      "identity_verified": true,
      "identity_rejected": false
    },
    {
      "id": "d9849077-8395-46f8-b729-f8aa7a0b0b96",
      "company_name": "lilou",
      "watch_pros_name": "lilou",
      "company_status": "pro",
      "first_name": "lison",
      "last_name": "cartoux",
      "email": "lison@gmail.Com",
      "country": "fr",
      "phone_prefix": "+33",
      "phone": "770970517",
      "created_at": "2025-06-15 11:31:46.823722+00",
      "updated_at": "2025-06-15 11:31:46.823722+00",
      "id_card_front_url": "https://yxherqptduszoafpsapp.supabase.co/storage/v1/object/public/sellerdocuments/55d613d0-f055-4ff6-8066-2bc6ed87a53e/idCardFront-1749987107024.jpg",
      "id_card_back_url": "https://yxherqptduszoafpsapp.supabase.co/storage/v1/object/public/sellerdocuments/55d613d0-f055-4ff6-8066-2bc6ed87a53e/idCardBack-1749987107535.jpg",
      "proof_of_address_url": "https://yxherqptduszoafpsapp.supabase.co/storage/v1/object/public/sellerdocuments/55d613d0-f055-4ff6-8066-2bc6ed87a53e/proofOfAddress-1749987107831.jpg",
      "user_id": "55d613d0-f055-4ff6-8066-2bc6ed87a53e",
      "crypto_friendly": false,
      "search_vector": "'cartoux':4B 'lilou':1A,2A 'lison':3B 'lison@gmail.com':5C",
      "company_logo_url": "https://yxherqptduszoafpsapp.supabase.co/storage/v1/object/public/sellerdocuments/55d613d0-f055-4ff6-8066-2bc6ed87a53e/companyLogo-1749987108053.jpg",
      "identity_verified": true,
      "identity_rejected": false
    }
  ]

// Configuration
const BATCH_SIZE = 1000; // Number of listings to insert at once
const TOTAL_LISTINGS = 5000; // Total number of listings to generate

// Initialize Supabase client
const supabaseUrl = 'https://yxherqptduszoafpsapp.supabase.co'; // TODO REPLACE
const supabaseKey = 'eyJ' // TODO REPLACE WITH SERVICE ROLE KEY

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
const genders = ['men', 'women', 'unisex'];
const dialColors = ['black', 'white', 'blue', 'silver', 'gold', 'green', 'grey'];
const caseMaterials = ['stainless-steel', 'gold', 'titanium', 'platinum', 'ceramic'];
const braceletMaterials = ['stainless-steel', 'leather', 'gold', 'rubber', 'fabric'];
const movements = ['automatic', 'manual', 'quartz', 'chronograph', 'tourbillon'];
const included = ['full-set', 'box-only', 'papers-only', 'watch-only'];
const shippingDelays = ['1-2 days', '3-5 days', '5-7 days', '7-10 days'];
const countries = ['fr', 'ch', 'us', 'gb', 'de', 'it', 'es', 'jp'];

// Helper function to get random model for a brand
const getRandomModelForBrand = (brandId: string) => {
  const brandModels = models.filter(model => model.brand_id === brandId);
  if (brandModels.length === 0) {
    // If no models found for this brand, get a random model from any brand
    return faker.helpers.arrayElement(models);
  }
  return faker.helpers.arrayElement(brandModels);
};

async function generateListings() {
  console.log('Starting to generate listings...');
  
  for (let i = 0; i < TOTAL_LISTINGS; i += BATCH_SIZE) {
    const currentBatchSize = Math.min(BATCH_SIZE, TOTAL_LISTINGS - i);
    const listings = [];

    for (let j = 0; j < currentBatchSize; j++) {
      const brand = faker.helpers.arrayElement(brands);
      const model = getRandomModelForBrand(brand.id);
      const seller = faker.helpers.arrayElement(sellers);
      const year = generateRandomYear().toString();
      const diameter = generateRandomDiameter();
      const status = Math.random() < 0.25 ? 'sold' : 'active';
      const price = generateRandomPrice();
      
      const listing = {
        reference_id: faker.string.uuid(),
        seller_id: seller.id,
        brand_id: brand.id,
        model_id: model.id,
        reference: faker.string.alphanumeric(8).toUpperCase(),
        title: `${brand.label} ${model.label} ${year}`,
        description: faker.commerce.productDescription(),
        year,
        gender: faker.helpers.arrayElement(genders),
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
        currency: 'EUR',
        shipping_delay: faker.helpers.arrayElement(shippingDelays),
        status,
        listing_type: 'watch',
        country: faker.helpers.arrayElement(countries),
        sold_at: status === 'sold' ? faker.date.between({ from: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000), to: new Date() }).toISOString() : null,
        final_price: status === 'sold' ? price - (price * 0.05) : null,
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