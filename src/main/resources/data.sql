--
-- PostgreSQL database dump
--

\restrict pLdSuhEVonwQVW4uEgUCoUgWcpNRZ6BgcqHU07lpPqdimwnecGmXzfM6f9xPwco

-- Dumped from database version 18.4
-- Dumped by pg_dump version 18.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: absence; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: competence; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO competence VALUES (1, 'Soft Skills', 'EEEEE', 'E', 'Débutant, Intermédiaire, Confirmé, Expert');
INSERT INTO competence VALUES (2, 'Technique', 'Technique', 'Comptabilité générale', 'Débutant, Intermédiaire, Confirmé, Expert');
INSERT INTO competence VALUES (3, 'Technique', 'Gestion de trésorerie', 'Gestion de trésorerie', 'Débutant, Intermédiaire, Confirmé, Expert');


--
-- Data for Name: conge; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO conge VALUES (1, '2026-07-12', '2026-07-31', 'dAVID ZOROM', 20, 'En attente', 'd');


--
-- Data for Name: contrat; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO contrat VALUES (1, '2026-07-13', '2026-07-31', 'dAVID ZOROM', 'Service RH', 'Actif', 'cdi');


--
-- Data for Name: department; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO department VALUES (1, 'ep', 'de5', NULL);
INSERT INTO department VALUES (2, 'd', 'd', NULL);
INSERT INTO department VALUES (52, 'DSI', 'DIRECTION SYSTEME DINFORMATION', NULL);


--
-- Data for Name: direction; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO direction VALUES (52, 'DR-G', 'DIRECTION GENERALE', 52, '');


--
-- Data for Name: emploi; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO emploi VALUES (52, 'e', 'ee');
INSERT INTO emploi VALUES (1, 'd', 'sss');
INSERT INTO emploi VALUES (2, 'EMP1', 'EMP1');


--
-- Data for Name: employe; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO employe VALUES ('459d7ace-27a2-4392-8350-fcc996beca1b', 'Bonhuer ville', '[]', '[]', 'boss', '', NULL, '[{"nom":"ZORO","prenom":"David","lien":"j","telephone":"62272569"}]', '2026-06-25 20:25:53.998469', '2002-02-02', '2002-05-08', '', '[]', '99', 'davidzorom9@gmail.com', '[]', '[]', '[]', '[]', 'Grade I', '[]', 'll', 'EMP-002', 'Virement bancaire', '2026-06-27 23:15:36.316619', 'Burkinabè', 'Niveau 1', 'ZOROM', 'David Faical ZOROM', 'b0000', '', 'Burkina Faso', '[]', 'rrr', 'David', 0, 0, 0, 0, 0, 'Service Test', 'M', 'Actif', '+22656213692', 'cdi', 'Ouagadougou', NULL, NULL, NULL);
INSERT INTO employe VALUES ('a94d351b-7e87-43ec-ac20-a59bf59f1b9f', 'Bonheur ville', '[]', '[]', 'A2', '', NULL, '[{"nom":"GENOL","prenom":"FoneStore","lien":"j","telephone":"62272569"}]', '2026-06-27 12:28:04.21219', '2000-08-08', '2002-02-02', 'h', '[]', '5', 'davidzorom35@gmail.com', '[]', '[]', '[{"libelle":"oo","montant":999}]', '[]', 'u', '[]', 'i', 'EMP-001', 'Virement bancaire', '2026-06-27 12:59:45.610763', 'Burkinabè', 'Niveau 4', 'ZOROM', 'PAGNAGNEWENDE ZOROM', 'nbbbb', '', 'Burkina Faso', '[]', 'h', 'PAGNAGNEWENDE', 777, 775, 77777, 10000, 1000, 'n', 'M', 'Actif', '+22656213692', 'CDI', 'Ouagadougou', '', '', NULL);
INSERT INTO employe VALUES ('2c522ffb-d34b-4425-819e-a168c881a615', 'DD', '[{"libelle":"r","montant":888888}]', '[]', 'Cadre', '225', '{"nom":"OUEDRAOGO","prenom":"ANGES","dateNaissance":"2002-04-04","profession":"COMPTABLE"}', '[{"nom":"ZOROM","prenom":"P","lien":"PERE","telephone":"33445566"}]', '2026-06-28 12:26:56.215554', '2002-04-04', '2002-03-03', 'Direction Test', '[]', 'Échelon 4', 'DD@gmail.com', '[]', '[]', '[]', '[]', 'Grade II', '[]', 'OUGA', 'EMP-004', 'Virement bancaire', '2026-06-28 12:29:53.91314', 'BURKINA', 'Niveau 3', 'ZOROM', '', 'B123456', '', 'BUKIRNA', '[]', 'rrr', 'FAICO', 9999999, 77776, 99999, 0, 0, 'Service Test', 'M', 'Actif', '+22656443322', 'cdi', 'OUGA', NULL, NULL, 'de5');
INSERT INTO employe VALUES ('3ffec0e1-9477-4b62-80f1-2082623478ca', '', '[]', '[]', '', '', NULL, '[{"nom":"","prenom":"","lien":"","telephone":""}]', '2026-06-28 18:50:19.24621', '', '', '', '[]', '', '', '[]', '[]', '[]', '[]', '', '[]', '', 'EMP-005', 'Virement bancaire', '2026-06-28 18:50:51.339943', '', '', 'TEST', '', '', '', '', '[]', '', 'User', 0, 0, 0, 0, 0, '', 'M', 'Actif', '', 'CDI', '', NULL, NULL, '');
INSERT INTO employe VALUES ('98b69a07-19ce-46dd-b900-0665c38ac411', 'Bonhuer ville', '[]', '[]', 'C1', '', '{"nom":"Z","prenom":"F","dateNaissance":"2002-04-05","profession":"CV"}', '[{"nom":"ZOROM","prenom":"PAGNAGNEWENDE","lien":"F","telephone":"56213692"}]', '2026-06-27 15:24:06.902319', '2002-03-03', '2002-06-07', '', '[]', '5', 'davidzorom9@gmail.com', '[{"nom":"ZOROM","prenom":"DD","dateNaissance":"2002-02-22","sexe":"M"}]', '[]', '[]', '[]', 'D', '[]', 'OUAGA', 'EMP-003', 'Virement bancaire', '2026-06-27 15:27:18.135669', 'BR', 'Niveau 4', 'ZOROM', 'David Faical ZOROM', 'B222222', 'F', 'Burkina Faso', '[]', 'RH', 'D', 100000, 10000, 10005, 100000000, 199999, 'Informatique', 'M', 'Actif', '+22656213692', 'CDI', 'Ouagadougou', '', '', NULL);
INSERT INTO employe VALUES ('dd59b741-1046-40d0-84e4-f38d066712ea', 'Ouagadougou', '[]', '[]', 'boss', NULL, NULL, '[]', '2026-06-25 20:24:43.943524', NULL, '1990-01-01', NULL, '[]', '99', 'b.ouedraogo@sirh.bf', '[]', '[]', '[]', '[]', 'Hors Classe', '[]', 'Ouagadougou', 'EMP-001', 'Virement bancaire', '2026-06-27 20:27:01.094675', 'Burkinabe', 'Niveau 2', 'Ouedraogo', NULL, 'CNI-001', NULL, 'Burkina Faso', '[]', NULL, 'Boureima', 0, 0, 0, 0, 0, NULL, 'M', 'Actif', '+226 70 00 00 01', NULL, 'Ouagadougou', NULL, NULL, NULL);
INSERT INTO employe VALUES ('97acc571-9772-4468-b0c2-cbeb30275f2f', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-06-27 22:59:36.799229', '2023-01-01', NULL, 'DSI', NULL, NULL, 'traore@sirh.bf', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'EMP001', NULL, '2026-06-27 22:59:36.799229', NULL, NULL, 'TRAORE', NULL, NULL, NULL, NULL, NULL, 'Developpeur', 'Ali', NULL, NULL, NULL, NULL, NULL, 'Informatique', NULL, 'Actif', NULL, 'CDI', NULL, NULL, NULL, NULL);


--
-- Data for Name: fonction; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO fonction VALUES (1, 'rr', 'rrr');
INSERT INTO fonction VALUES (2, 'DSI', 'DIRECTEUR SYSTEME IMFORMATIQUE');


--
-- Data for Name: service; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO service VALUES (102, 'SRV-DEP', 'SERVICE DEPANAGE', 52, 52, '');


--
-- Data for Name: employee; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO employee VALUES (1, 'davidzorom5@gmail.com', '{"id":1,"matricule":"EMP-001","nom":"OUEDRAOGO","prenom":"ISSA","nomJeuneFille":"PAGE MISSION","sexe":"M","dateNaissance":"2002-05-08","lieuNaissance":"Koupéla","nationalite":"BURKINA","numeroCNI":"B11111111","adresse":"École Nationale des Regies Financieres","ville":"Koupéla","codePostal":"","pays":"Burkina Faso","telephone":"+22656213692","email":"davidzorom5@gmail.com","contactsUrgenceJson":"[]","photo":null,"conjointJson":null,"enfantsJson":"[{\"nom\":\"OUEDRAOGO\",\"prenom\":\"ANGELL\",\"dateNaissance\":\"\",\"sexe\":\"M\"}]","personnesChargeJson":"[]","poste":"DIRECTEUR SYSTEME IMFORMATIQUE","service":"","direction":"","departement":"","dateEmbauche":"2025-03-03","statut":"Actif","typeContrat":"CDI","categoriePro":"Cadre Supérieur","echelon":"Échelon 3","grade":"Grade I","niveau":"Niveau 4","primeLogement":100000.0,"primeTransport":100000.0,"primeResponsabilite":1111111.0,"autresIndemnitesJson":"[{\"code\":\"t\",\"libelle\":\"r\",\"montant\":1000000}]","exonerationsFiscalesJson":"[]","exonerationsSocialesJson":"[]","avantagesParticuliersJson":"[]","salaireBase":35000.0,"salaireBrut":0.0,"modePaiement":"Virement bancaire","banque":null,"iban":null,"documentsJson":"[]","observations":"","evaluationsJson":"[]","historiqueActionsJson":"[]","name":"OUEDRAOGO ISSA","phone":"+22656213692","fonction_id":null,"emploi_id":null,"department_id":null,"direction_id":null,"service_id":null,"superviseur_id":null,"state":null}', 'EMP-001', 'OUEDRAOGO ISSA', 'OUEDRAOGO', '+22656213692', 'ISSA', NULL, '+22656213692', NULL, NULL, NULL, NULL, NULL, NULL);


--
-- Data for Name: evaluation_entretien; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: formation_catalogue; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO formation_catalogue VALUES (1, 'Cadre réglementaire de l''UEMOA applicable aux établissements financiers', 3, 'Initiation à la réglementation BCEAO');
INSERT INTO formation_catalogue VALUES (2, 'Approche commerciale adaptée aux produits de la BPBF', 2, 'Techniques de vente bancaire');


--
-- Data for Name: formation_session; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: generic_ref_data; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO generic_ref_data VALUES (1, true, 'KOUP', '', 'Koupéla', 'ville');
INSERT INTO generic_ref_data VALUES (2, true, 'DIR_PROJ', '', 'Directeur de Projet', 'profil');
INSERT INTO generic_ref_data VALUES (3, true, 'ADMIN', '', 'Administrateur', 'profil');
INSERT INTO generic_ref_data VALUES (5, true, 'comp', '', 'Comptables', 'profil');
INSERT INTO generic_ref_data VALUES (4, true, 'DRH', '', 'Directeur des ressources humaines', 'profil');
INSERT INTO generic_ref_data VALUES (6, true, 'Emp', '', 'Employe', 'profil');
INSERT INTO generic_ref_data VALUES (7, true, 'DR', '', 'Directeur départements', 'profil');
INSERT INTO generic_ref_data VALUES (8, true, 'DR-Metier', '', 'Directeur des postes et métiers', 'profil');

-- Catégories professionnelles (1..7, I..VIII)
INSERT INTO generic_ref_data VALUES (10, true, '1', 'Groupe I — Agent d''exécution', '1ÈRE CATEGORIE', 'categorie');
INSERT INTO generic_ref_data VALUES (11, true, '2', 'Groupe I — Agent d''exécution', '2ÈME CATEGORIE', 'categorie');
INSERT INTO generic_ref_data VALUES (12, true, '3', 'Groupe I — Agent d''exécution', '3ÈME CATEGORIE', 'categorie');
INSERT INTO generic_ref_data VALUES (13, true, '4', 'Groupe I — Employé qualifié', '4ÈME CATEGORIE', 'categorie');
INSERT INTO generic_ref_data VALUES (14, true, '5', 'Groupe I — Employé qualifié', '5ÈME CATEGORIE', 'categorie');
INSERT INTO generic_ref_data VALUES (15, true, '6', 'Groupe I — Employé principal', '6ÈME CATEGORIE', 'categorie');
INSERT INTO generic_ref_data VALUES (16, true, '7', 'Groupe I — Agent de maîtrise', '7ÈME CATEGORIE', 'categorie');
INSERT INTO generic_ref_data VALUES (17, true, 'I', 'Groupe II — Agent de maîtrise / Technicien', 'CLASSE I', 'categorie');
INSERT INTO generic_ref_data VALUES (18, true, 'II', 'Groupe II — Agent de maîtrise supérieur', 'CLASSE II', 'categorie');
INSERT INTO generic_ref_data VALUES (19, true, 'III', 'Groupe II — Cadre moyen', 'CLASSE III', 'categorie');
INSERT INTO generic_ref_data VALUES (20, true, 'IV', 'Groupe II — Cadre supérieur', 'CLASSE IV', 'categorie');
INSERT INTO generic_ref_data VALUES (21, true, 'V', 'Groupe III — Cadre de direction', 'CLASSE V', 'categorie');
INSERT INTO generic_ref_data VALUES (22, true, 'VI', 'Groupe III — Chef de Département', 'CLASSE VI', 'categorie');
INSERT INTO generic_ref_data VALUES (23, true, 'VII', 'Groupe III — Directeur', 'CLASSE VII', 'categorie');
INSERT INTO generic_ref_data VALUES (24, true, 'VIII', 'Groupe III — Directeur Général / Exécutif', 'CLASSE VIII', 'categorie');

-- Groupes (GROUPE I, GROUPE II, GROUPE III)
INSERT INTO generic_ref_data VALUES (30, true, 'GROUPE I', 'Agents et Employés (Catégories 1 à 7)', 'GROUPE I', 'grade');
INSERT INTO generic_ref_data VALUES (31, true, 'GROUPE II', 'Classes I à IV (Agents de Maîtrise et Cadres moyens)', 'GROUPE II', 'grade');
INSERT INTO generic_ref_data VALUES (32, true, 'GROUPE III', 'Classes V à VIII (Cadres et Cadres Supérieurs)', 'GROUPE III', 'grade');


--
-- Data for Name: grille_salariale; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO grille_salariale VALUES (1, NULL, NULL, NULL, NULL, NULL);
INSERT INTO grille_salariale VALUES (2, 150000.00, 'I', 'GS-1', '5', '3');
INSERT INTO grille_salariale VALUES (3, 0.00, 'III', 'GS-CI-E1', '<= 4 ans', '3');


--
-- Data for Name: mobilite_demande; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: parametre_rh; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO parametre_rh VALUES (1, true, 'FIN', 'Échéance du contrat CDD', 'Fin de contrat', 'motifsSortie');
INSERT INTO parametre_rh VALUES (2, true, 'SUSP', 'Contrat suspendu', 'Suspendu', 'statutsEmployes');
INSERT INTO parametre_rh VALUES (3, true, 'DEM', 'Départ volontaire', 'Démission', 'motifsSortie');
INSERT INTO parametre_rh VALUES (4, true, 'DEC', 'Décès du collaborateur', 'Décès', 'motifsSortie');
INSERT INTO parametre_rh VALUES (6, true, 'LIC', 'Licenciement employeur', 'Licenciement', 'motifsSortie');
INSERT INTO parametre_rh VALUES (5, true, 'INACTIF', 'Employé sans activité', 'Inactif', 'statutsEmployes');
INSERT INTO parametre_rh VALUES (7, true, 'MUT', 'Mutation vers une autre structure', 'Mutation', 'motifsSortie');
INSERT INTO parametre_rh VALUES (8, true, 'ACTIF', 'Employé en activité', 'Actif', 'statutsEmployes');
INSERT INTO parametre_rh VALUES (9, true, 'RET', 'Départ à la retraite', 'Retraite', 'motifsSortie');
INSERT INTO parametre_rh VALUES (10, true, 'MALADIE', 'En arrêt maladie', 'Congé maladie', 'statutsEmployes');
INSERT INTO parametre_rh VALUES (11, true, 'DETACHE', 'Détachement temporaire', 'Détaché', 'statutsEmployes');
INSERT INTO parametre_rh VALUES (12, true, 'ESSAI_CDI', '3 mois renouvelable 1 fois', 'Durée période essai (CDI)', 'paramsSpecifiques');
INSERT INTO parametre_rh VALUES (13, true, 'ESSAI_CDD', '1 mois', 'Durée période essai (CDD)', 'paramsSpecifiques');
INSERT INTO parametre_rh VALUES (14, true, 'ESSAI', 'En cours de période d''essai', 'Période d''essai', 'statutsEmployes');
INSERT INTO parametre_rh VALUES (15, true, 'CONGE_ANNUEL', '2,5 jours par mois travaillé', 'Congés annuels', 'paramsSpecifiques');
INSERT INTO parametre_rh VALUES (16, true, 'PREAVIS_DEM', '1 mois pour non-cadres, 3 mois pour cadres', 'Préavis démission', 'paramsSpecifiques');


--
-- Data for Name: type_absence_conge; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO type_absence_conge VALUES (1, 'maladi', 'd');


--
-- Data for Name: type_contrat; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO type_contrat VALUES (1, 'cdi', 'cdi');


--
-- Data for Name: type_indemnite; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO type_indemnite VALUES (1, 't', 'r');


--
-- Data for Name: utilisateur; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO utilisateur VALUES (1, true, 'davidzorom9@gmail.com', 'ZOROM', '5621', 'David', 'ADMIN', 'davidzorom9@gmail.com');
INSERT INTO utilisateur VALUES (3, true, 'davidzorom35@gmail.com', 'david Zorom', '5621', 'david', 'Emp', 'su');
INSERT INTO utilisateur VALUES (2, true, 'marie.dupont@entreprise.com', 'Dupont', '5621', 'Marie', 'DRH', 'marie.dupont');


--
-- Name: absence_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.absence_id_seq', 1, false);


--
-- Name: competence_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.competence_id_seq', 3, true);


--
-- Name: conge_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.conge_id_seq', 1, true);


--
-- Name: contrat_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.contrat_id_seq', 1, true);


--
-- Name: department_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.department_seq', 101, true);


--
-- Name: direction_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.direction_seq', 101, true);


--
-- Name: emploi_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.emploi_seq', 101, true);


--
-- Name: employee_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.employee_id_seq', 1, true);


--
-- Name: evaluation_entretien_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.evaluation_entretien_id_seq', 1, false);


--
-- Name: fonction_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.fonction_seq', 51, true);


--
-- Name: formation_catalogue_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.formation_catalogue_id_seq', 2, true);


--
-- Name: formation_session_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.formation_session_id_seq', 1, false);


--
-- Name: generic_ref_data_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.generic_ref_data_id_seq', 8, true);


--
-- Name: grille_salariale_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.grille_salariale_seq', 51, true);


--
-- Name: mobilite_demande_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.mobilite_demande_id_seq', 1, false);


--
-- Name: parametre_rh_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.parametre_rh_id_seq', 16, true);


--
-- Name: service_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.service_seq', 151, true);


--
-- Name: type_absence_conge_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.type_absence_conge_seq', 1, true);


--
-- Name: type_contrat_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.type_contrat_seq', 1, true);


--
-- Name: type_indemnite_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.type_indemnite_seq', 1, true);


--
-- Name: utilisateur_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.utilisateur_id_seq', 3, true);


--
-- PostgreSQL database dump complete
--

\unrestrict pLdSuhEVonwQVW4uEgUCoUgWcpNRZ6BgcqHU07lpPqdimwnecGmXzfM6f9xPwco

