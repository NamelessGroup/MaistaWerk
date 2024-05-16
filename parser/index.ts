import { Browser, HTMLElement } from "happy-dom";
import DomParser from "./domParser";
import parseFach from "./parseComponents/FachParser";
import Fach from "./model/Fach";

const MODULHANDBUCH_URL =
  "https://www.informatik.kit.edu/downloads/stud/SS24_MSc_2023_MHB_2024_04_03_de_html.html";
const RESULT_BASE_FOLDER_NAME = "result";
const VERTIEFUNGSFACH_FILE_NAME = "vertiefungsfach.json";
const WAHLBEREICH_FILE_NAME = "wahlbereich.json";
const ERGANZUNGFACH_FILE_NAME = "erganzungsfach.json";

const content = await fetch(MODULHANDBUCH_URL).then((r) => r.text());
const browser = new Browser();
const page = browser.newPage();
page.url = "https://example.com";
page.content = content;

let body = page.mainFrame.document.body.children[2];
body = body.children[body.childElementCount - 1];

const STRUCTURE_TABLE_HEADING = "Aufbau des Studiengangs";
const MODULE_HEADING = "Module";

const bodyParser = new DomParser(body);

const fachListeStart =
  bodyParser.findChildIdOfHeading(STRUCTURE_TABLE_HEADING) + 2;
const fachListeEnd = bodyParser.findChildIdOfHeading(MODULE_HEADING);
const fachListe = bodyParser
  .publicGetChildRange(fachListeStart, fachListeEnd)
  .map(parseFach);

const vertiefungsfacher = fachListe.filter((e) =>
  e.name.startsWith("Vertiefungsfach")
);
const erganzungsfach = fachListe.filter((e) =>
  e.name.startsWith("Ergängzungsfacg")
);
const wahlbereich = fachListe.filter((e) =>
  e.name.startsWith("Wahlbereich")
)[0];

const module = new DomParser(
  bodyParser.getChildAtId(fachListeEnd + 1)
).getAllChildren();
