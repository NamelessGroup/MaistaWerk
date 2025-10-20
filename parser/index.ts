import { Browser } from "happy-dom";
import DomParser from "./domParser";
import parseFach from "./parseComponents/FachParser";
import parseModule from "./parseComponents/ModuleParser";
import parseTeilleistungen from "./parseComponents/TeilleistungParser";
import writeToFile from "./fileWriting";
import parseMetaData from "./parseComponents/MetaDataParser";

const MODULHANDBUCH_URL =
  "https://www.informatik.kit.edu/downloads/stud/88-079-H-2023_v1_2025-10-14_de.html";
const RESULT_BASE_FOLDER_NAME = "../website/src/data";
const VERTIEFUNGSFACH_FILE_NAME = "vertiefung.json";
const WAHLBEREICH_FILE_NAME = "wahlbereich.json";
const ERGANZUNGFACH_FILE_NAME = "erganzungsfach.json";
const MODULE_FILE_NAME = "module.json";
const TEILLEISTUNGEN_FILE_NAME = "teilleistungen.json";
const METADATA_FILE_NAME = "metadata.json";

console.log("Fetching content...");
const startTime = Date.now();
const content = await fetch(MODULHANDBUCH_URL).then((r) => r.text());
const browser = new Browser();
const page = browser.newPage();
page.content = content;

const document = page.mainFrame.document
let body = document.body.children[2];
body = body.children[body.childElementCount - 1];

const STRUCTURE_TABLE_HEADING = "Aufbau des Studiengangs";
const MODULE_HEADING = "Module";
const TEILLEISTUNGEN_HEADER = "Teilleistungen";

const bodyParser = new DomParser(body);
const postFetchTime = Date.now();
console.log(`Fetched content in ${postFetchTime - startTime}ms`);


console.log("Parsing Fach list...");
const fachListeStart =
  bodyParser.findChildIndexOfHeading(STRUCTURE_TABLE_HEADING) + 3;
const fachListeEnd = bodyParser.findChildIndexOfHeading(MODULE_HEADING);
const fachListe = bodyParser
  .publicGetChildRange(fachListeStart, fachListeEnd)
  .map(parseFach);

const vertiefungsfacher = fachListe.filter((e) =>
  e.name.startsWith("Vertiefungsfach")
);
const erganzungsfach = fachListe.filter((e) =>
  e.name.startsWith("Ergänzungsfach")
);
const wahlbereich = fachListe.filter((e) =>
  e.name.startsWith("Wahlbereich")
)[0];
const postParseFachlisteTime = Date.now();
console.log(`Parsed Fach list in ${postParseFachlisteTime - postFetchTime}ms`);

console.log("Parsing Modul list...");
const module = parseModule(bodyParser.getChildAtIndex(fachListeEnd + 1));
const postModuleParseTime = Date.now();
console.log(
  `Parsed Modul list in ${postModuleParseTime - postParseFachlisteTime}ms`
);

console.log("Parsing Teilleistungs list...");
const teilleistungen = parseTeilleistungen(
  bodyParser.getChildAfterHeading(TEILLEISTUNGEN_HEADER)
);
const postTeilleistungParseTime = Date.now();
console.log(
  `Parsed Teilleistungs list in ${postTeilleistungParseTime - postModuleParseTime}ms`
);

console.log("Parsing Metadata....");
const metadata = parseMetaData(document.getElementsByClassName("subtitle")[0]);
const postMetadataParseTime = Date.now();
console.log(
  `Parsed Metadata in ${postMetadataParseTime - postTeilleistungParseTime}ms`
);
const parseEndTime = postMetadataParseTime

console.log("Start writing files...");
writeToFile(vertiefungsfacher, [
  RESULT_BASE_FOLDER_NAME,
  VERTIEFUNGSFACH_FILE_NAME,
]);
writeToFile(wahlbereich, [RESULT_BASE_FOLDER_NAME, WAHLBEREICH_FILE_NAME]);
writeToFile(erganzungsfach, [RESULT_BASE_FOLDER_NAME, ERGANZUNGFACH_FILE_NAME]);
writeToFile(module, [RESULT_BASE_FOLDER_NAME, MODULE_FILE_NAME]);
writeToFile(teilleistungen, [
  RESULT_BASE_FOLDER_NAME,
  TEILLEISTUNGEN_FILE_NAME,
]);
writeToFile(metadata, [RESULT_BASE_FOLDER_NAME, METADATA_FILE_NAME])
const postWriteTime = Date.now();
console.log(`Wrote files in ${postWriteTime - parseEndTime}ms`);

console.log(
  `Process took ${postWriteTime - startTime}ms. Parsing took ${
    parseEndTime - postFetchTime
  }ms`
);

const temp = module.filter((e) => e.name.includes("Meteorology") || e.wahlbereiche.length >= 2);
writeToFile(temp, [RESULT_BASE_FOLDER_NAME, "temp.json"]);