/**
 * Python OOP & UML Trainer - Complete Master Task Database
 * Contains all 104 original curriculum tasks + new interactive diagram tasks (110 total)
 */
(function() {
  const TOPICS = {
    1: { id: 1, title: "1. OOP-Theorie & Grundbegriffe", icon: "🧠" },
    2: { id: 2, title: "2. Konstruktor, self & Attribute", icon: "🏗️" },
    3: { id: 3, title: "3. Kapselung, Getter & Setter", icon: "🛡️" },
    4: { id: 4, title: "4. return vs print & Type Hints", icon: "🔄" },
    5: { id: 5, title: "5. Vererbung, super() & Polymorphie", icon: "🧬" },
    6: { id: 6, title: "6. UML: Klassen & Use-Cases", icon: "📐" }
  };

  const TASKS = [
  {
    "id": 1,
    "topic": 1,
    "type": "tf",
    "title": "Klasse vs. Objekt",
    "prompt": "Stimmt die Aussage: Eine Klasse ist das konkrete Exemplar, das zur Laufzeit im Speicher existiert, während das Objekt nur der Bauplan ist?",
    "answer": false,
    "hint": "Überlege, was die Backform ist und was das tatsächliche Plätzchen.",
    "explanation": "Falsch! Es ist genau umgekehrt: Die Klasse ist der abstrakte Bauplan (die Schablone). Das Objekt (die Instanz) ist das konkrete Exemplar im Speicher."
  },
  {
    "id": 2,
    "topic": 1,
    "type": "tf",
    "title": "Kapselung (Encapsulation)",
    "prompt": "Bedeutet Kapselung in der OOP, dass die inneren Datenstrukturen eines Objekts verborgen werden und der Zugriff nur über kontrollierte Methoden erfolgt?",
    "answer": true,
    "hint": "Denke an den Kaffeevollautomaten: Man drückt Knöpfe, greift aber nicht in das Mahlwerk.",
    "explanation": "Richtig! Kapselung (Information Hiding) schützt den internen Objektzustand vor unerlaubten Zugriffen von außen."
  },
  {
    "id": 3,
    "topic": 1,
    "type": "tf",
    "title": "Polymorphie überladener Operatoren",
    "prompt": "Der Ausdruck '42' + '3' führt in Python zum selben Ergebnis wie 42 + 3, weil der Plus-Operator polymorph ist.",
    "answer": false,
    "hint": "Was passiert, wenn zwei Strings mit + verkettet werden?",
    "explanation": "Falsch! '42' + '3' verkettet die Strings zu '423', während 42 + 3 die mathematische Summe 45 ergibt. Das unterschiedliche Verhalten bei unterschiedlichen Typen ist zwar Polymorphie, führt aber zu völlig anderen Ergebnissen!"
  },
  {
    "id": 4,
    "topic": 1,
    "type": "tf",
    "title": "Abstrakte Klasse (ABC)",
    "prompt": "Eine abstrakte Klasse kann in einem Programm direkt mit `obj = AbstrakteKlasse()` instanziiert werden.",
    "answer": false,
    "hint": "Kann man aus einem unvollständigen Bauplan ein fertiges Haus bauen?",
    "explanation": "Falsch! Abstrakte Klassen sind unvollständige Schablonen. Sie können nicht direkt instanziiert werden, sondern zwingen Subklassen dazu, abstrakte Methoden zu implementieren."
  },
  {
    "id": 5,
    "topic": 1,
    "type": "cloze",
    "title": "Generalisierung vs. Spezialisierung",
    "prompt": "Ergänze den zentralen Lehrplansatz mit den exakten Fachbegriffen (Groß-/Kleinschreibung beachten):",
    "codeTemplate": "Während die {{gap1}} die Subklassen generalisiert,\nspezialisieren die {{gap2}} die Superklasse.",
    "gaps": {
      "gap1": "Superklasse",
      "gap2": "Subklassen"
    },
    "hint": "Oben steht die allgemeine Superklasse, unten die spezifischen Subklassen.",
    "explanation": "Die Superklasse fasst Gemeinsamkeiten zusammen (Generalisierung nach oben). Die Subklassen erweitern und verfeinern das Verhalten (Spezialisierung nach unten)."
  },
  {
    "id": 6,
    "topic": 1,
    "type": "tf",
    "title": "Abstraktion",
    "prompt": "Unter Abstraktion versteht man in der Softwaremodellierung das Weglassen unwichtiger Details der Realität, um sich auf das Wesentliche zu konzentrieren.",
    "answer": true,
    "hint": "Denke an die Straßenkarte, die Straßennamen zeigt, aber Gartenzäune ignoriert.",
    "explanation": "Richtig! Abstraktion reduziert die reale Komplexität auf den für das Softwaresystem relevanten Zweck."
  },
  {
    "id": 7,
    "topic": 1,
    "type": "cloze",
    "title": "Definition von Klassenbestandteilen",
    "prompt": "Vervollständige die OOP-Definition:",
    "codeTemplate": "In einer Klasse nennt man die Daten {{gap1}}\nund die Funktionen nennt man {{gap2}}.",
    "gaps": {
      "gap1": "Attribute",
      "gap2": "Methoden"
    },
    "hint": "Attribute = Eigenschaften, Methoden = Operationen.",
    "explanation": "Daten werden in Attributen gespeichert; Verhalten und Logik werden in Methoden (Operationen) gekapselt."
  },
  {
    "id": 8,
    "topic": 1,
    "type": "tf",
    "title": "Ist-Ein-Beziehung (is-a)",
    "prompt": "Vererbung modelliert eine 'Hat-Ein'-Beziehung (z. B. ein Auto hat einen Motor), während Komposition eine 'Ist-Ein'-Beziehung beschreibt.",
    "answer": false,
    "hint": "Ist ein Wollwaschmittel ein Waschmittel oder hat es ein Waschmittel?",
    "explanation": "Falsch! Vererbung modelliert eine 'Ist-Ein'-Beziehung (Ein Hund ist ein Tier). Eine 'Hat-Ein'-Beziehung (Auto hat Motor) ist eine Aggregation bzw. Komposition."
  },
  {
    "id": 9,
    "topic": 1,
    "type": "tf",
    "title": "Dynamisches Binden & Polymorphie",
    "prompt": "Wenn eine Subklasse eine geerbte Methode überschreibt, entscheidet erst zur Laufzeit der konkrete Objekttyp, welche Methodenversion ausgeführt wird.",
    "answer": true,
    "hint": "Das ist die Kernidee von dynamischem Binden bei Vererbung.",
    "explanation": "Richtig! Dank dynamischem Binden (Dynamic Dispatch) wird immer die spezialisierte Methode des tatsächlichen Objekts aufgerufen."
  },
  {
    "id": 10,
    "topic": 1,
    "type": "bughunt",
    "title": "Bug-Hunter: Grundgerüst einer Tier-Klasse",
    "prompt": "Finde die genau 2 Fehler in dieser simplen Klassendefinition (Klicke auf die beiden Zeilen):",
    "codeLines": [
      "class Tier:",
      "    def __init__(self, name):",
      "        self.name = name",
      "    def laut_geben():",
      "        print(name)"
    ],
    "bugIndices": [
      3,
      4
    ],
    "hint": "Achte auf den ersten Methodenparameter und wie auf Instanzattribute zugegriffen werden muss.",
    "explanation": "Zeile 4: Es fehlt `self` als 1. Parameter (`def laut_geben(self):`).\nZeile 5: Zugriff auf das Attribut muss `self.name` lauten, da `name` sonst eine nicht existierende lokale Variable ist."
  },
  {
    "id": 11,
    "topic": 1,
    "type": "tf",
    "title": "Schnittstelle (Interface)",
    "prompt": "Ein Interface in der UML enthält vollständigen Programmiercode für alle seine Methoden.",
    "answer": false,
    "hint": "Ein Interface ist ein reiner Vertrag ohne eigene Implementierung.",
    "explanation": "Falsch! Ein Interface definiert lediglich Methodensignaturen (Namen, Parameter, Rückgabewerte), enthält aber absolut keinen Implementierungscode."
  },
  {
    "id": 12,
    "topic": 1,
    "type": "cloze",
    "title": "Instanziierung Begriff",
    "prompt": "Wie nennt man den Vorgang, wenn aus dem Bauplan einer Klasse ein echtes Objekt im Speicher erzeugt wird?",
    "codeTemplate": "Der Vorgang der Objekterzeugung heißt {{gap1}}.",
    "gaps": {
      "gap1": "Instanziierung"
    },
    "hint": "Kommt von Instanz.",
    "explanation": "Die Erzeugung eines konkreten Objekts aus einer Klasse heißt Instanziierung."
  },
  {
    "id": 13,
    "topic": 1,
    "type": "tf",
    "title": "Methoden überschreiben vs überladen",
    "prompt": "In Python kann man wie in Java Methoden mit gleichem Namen einfach mehrfach mit unterschiedlicher Parameteranzahl definieren (klassisches Überladen).",
    "answer": false,
    "hint": "Was passiert in Python, wenn du zwei Methoden mit demselben Namen in einer Klasse definierst?",
    "explanation": "Falsch! In Python überschreibt die zuletzt definierte Methode alle vorherigen gleichen Namens. Echtes Methodenüberladen wie in Java oder C++ gibt es nativ nicht; man nutzt stattdessen Standard-Parameter (`b=None`)."
  },
  {
    "id": 14,
    "topic": 1,
    "type": "tf",
    "title": "Zustand eines Objekts",
    "prompt": "Der Zustand eines Objekts zur Laufzeit wird durch die aktuellen Werte seiner Attribute definiert.",
    "answer": true,
    "hint": "Ändern sich die Werte, ändert sich der Zustand.",
    "explanation": "Richtig! Die Gesamtheit aller Variablen-/Attributwerte eines Objekts zu einem Zeitpunkt bildet seinen Zustand."
  },
  {
    "id": 15,
    "topic": 1,
    "type": "cloze",
    "title": "Polymorphie Übersetzung",
    "prompt": "Aus dem Griechischen übersetzt bedeutet das Wort Polymorphie wörtlich:",
    "codeTemplate": "Polymorphie bedeutet {{gap1}}.",
    "gaps": {
      "gap1": "Vielgestaltigkeit"
    },
    "hint": "Poly = viel, morph = Gestalt/Form.",
    "explanation": "Polymorphie bedeutet 'Vielgestaltigkeit' – ein Aufruf, viele unterschiedliche Gestalten der Ausführung."
  },
  {
    "id": 16,
    "topic": 1,
    "type": "tf",
    "title": "Superklasse & Subklasse Austauschbarkeit",
    "prompt": "Nach dem Liskovschen Substitutionsprinzip kann eine Subklasse überall dort eingesetzt werden, wo ihre Superklasse erwartet wird.",
    "answer": true,
    "hint": "Ein Cabrio kann überall dort fahren, wo ein allgemeines Fahrzeug fahren darf.",
    "explanation": "Richtig! Da die Subklasse alle Merkmale der Superklasse erbt, ist sie voll kompatibel und kann an deren Stelle treten."
  },
  {
    "id": 17,
    "topic": 1,
    "type": "write",
    "title": "Code-Writing: Abstrakte Vorlage gedanklich umsetzen",
    "prompt": "Erstelle eine Klasse `Rechteck`, deren Konstruktor `laenge` und `breite` (beide float) entgegennimmt und als Instanzattribute speichert. Ergänze die Methode `flaeche(self)`, die das Produkt beider Werte mit `return` zurückgibt.",
    "starterCode": "class Rechteck:\n    def __init__(self, laenge: float, breite: float):\n        # Hier Code\n        pass\n\n    def flaeche(self) -> float:\n        # Hier Code\n        pass",
    "expectedKeywords": [
      "self.laenge",
      "self.breite",
      "return",
      "self.laenge * self.breite"
    ],
    "solutionCode": "class Rechteck:\n    def __init__(self, laenge: float, breite: float):\n        self.laenge = laenge\n        self.breite = breite\n\n    def flaeche(self) -> float:\n        return self.laenge * self.breite",
    "hint": "Multipliziere `self.laenge * self.breite` und gib das Ergebnis mit `return` zurück.",
    "explanation": "Instanzattribute werden mit `self.` gebunden, und das Ergebnis der Flächenberechnung wird mit `return` an den Aufrufer übergeben."
  },
  {
    "id": 18,
    "topic": 2,
    "type": "tf",
    "title": "Der Parameter self",
    "prompt": "Der Parameter `self` in einer Instanzmethode verweist immer auf die Klasse selbst, niemals auf das konkrete Objekt.",
    "answer": false,
    "hint": "Steht self für 'ich selbst' (das Objekt) oder den Bauplan?",
    "explanation": "Falsch! `self` verweist immer auf die konkrete Instanz (das Objekt) im Speicher. Der Verweis auf die Klasse selbst heißt in Klassenmethoden üblicherweise `cls`."
  },
  {
    "id": 19,
    "topic": 2,
    "type": "cloze",
    "title": "Der Konstruktorname",
    "prompt": "Wie lautet der exakte Methodenname des Konstruktors in Python?",
    "codeTemplate": "def {{gap1}}(self, parameter):\n    self.x = parameter",
    "gaps": {
      "gap1": "__init__"
    },
    "hint": "Zwei führende und zwei nachfolgende Unterstriche.",
    "explanation": "Der Konstruktor heißt in Python immer `__init__` (kurz für initialize)."
  },
  {
    "id": 20,
    "topic": 2,
    "type": "bughunt",
    "title": "Bug-Hunter: Parameter vs. Zuweisung",
    "prompt": "Finde die 2 Fehler im folgenden Konstruktor:",
    "codeLines": [
      "class User:",
      "    def __init__(username, email):",
      "        username = username",
      "        self.email = email"
    ],
    "bugIndices": [
      1,
      2
    ],
    "hint": "Was fehlt als 1. Parameter und was fehlt vor der Variablen username in Zeile 3?",
    "explanation": "Zeile 2: `self` fehlt als erster Parameter (`def __init__(self, username, email):`).\nZeile 3: `self.` fehlt bei der Zuweisung (`self.username = username`), sonst stirbt der Wert mit Funktionsende."
  },
  {
    "id": 21,
    "topic": 2,
    "type": "tf",
    "title": "Klassenattribut vs. Instanzattribut",
    "prompt": "Ein Attribut, das direkt im Klassenrumpf (außerhalb von Methoden) definiert wird, existiert für jede Instanz separat und unabhängig.",
    "answer": false,
    "hint": "Das ist die Definition eines Klassenattributs (static).",
    "explanation": "Falsch! Das ist ein Klassenattribut. Es existiert nur genau einmal für die gesamte Klasse und wird von allen Instanzen geteilt."
  },
  {
    "id": 22,
    "topic": 2,
    "type": "cloze",
    "title": "Feste Startattribute",
    "prompt": "Ein Buch soll beim Erstellen immer den festen Startwert `ausgeliehen = False` erhalten, ohne dass dieser Wert übergeben werden muss. Ergänze die Zeile:",
    "codeTemplate": "class Buch:\n    def __init__(self, titel: str):\n        self.titel = titel\n        self.{{gap1}} = False",
    "gaps": {
      "gap1": "ausgeliehen"
    },
    "hint": "Der Attributname lautet ausgeliehen.",
    "explanation": "Feste Startzustände (wie ausgeliehen=False oder punktestand=0) werden direkt im Konstruktorrumpf an `self` gebunden und müssen nicht in der Parameterklammer stehen."
  },
  {
    "id": 23,
    "topic": 2,
    "type": "tf",
    "title": "Aufruf ohne self",
    "prompt": "Wenn wir `auto1.fahren()` aufrufen, übergibt Python das Objekt `auto1` automatisch als erstes Argument `self` an die Methode `fahren`.",
    "answer": true,
    "hint": "auto1.fahren() ist syntaktischer Zucker für Auto.fahren(auto1).",
    "explanation": "Richtig! Python transformiert `obj.methode()` intern in `Klasse.methode(obj)`. Daher muss in der Definition immer `self` stehen."
  },
  {
    "id": 24,
    "topic": 2,
    "type": "bughunt",
    "title": "Bug-Hunter: Instanziierung eines Objekts",
    "prompt": "Finde die 2 Fehler bei der Objekterzeugung und Methodenbenutzung:",
    "codeLines": [
      "class Lampe:",
      "    def __init__(self, watt: int):",
      "        self.watt = watt",
      "l = Lampe",
      "l.watt = 60",
      "print(watt)"
    ],
    "bugIndices": [
      3,
      5
    ],
    "hint": "Zeile 4 ruft den Konstruktor nicht auf (Klammern fehlen), und Zeile 6 versucht global auf watt zuzugreifen.",
    "explanation": "Zeile 4: Bei der Instanziierung müssen Argumentklammern angegeben werden: `l = Lampe(60)`.\nZeile 6: Der Zugriff muss über das Objekt erfolgen: `print(l.watt)`."
  },
  {
    "id": 25,
    "topic": 2,
    "type": "cloze",
    "title": "Standardparameter im Konstruktor",
    "prompt": "Ergänze den Standardwert 0 für den Kilometerstand im Methodenkopf:",
    "codeTemplate": "def __init__(self, marke: str, km: int = {{gap1}}):\n    self.marke = marke\n    self.km = km",
    "gaps": {
      "gap1": "0"
    },
    "hint": "Standardmäßig null Kilometer.",
    "explanation": "Standardparameter (`= 0`) erlauben es, beim Aufruf das Argument wegzulassen; dann greift der Standardwert."
  },
  {
    "id": 26,
    "topic": 2,
    "type": "tf",
    "title": "Attribute nachträglich anheften",
    "prompt": "In Python ist es syntaktisch möglich, einem existierenden Objekt außerhalb der Klasse neue Attribute zuzuweisen, z. B. `auto.farbe = 'blau'`.",
    "answer": true,
    "hint": "Python ist eine sehr dynamische Sprache.",
    "explanation": "Richtig! Python erlaubt dynamisches Hinzufügen von Attributen zur Laufzeit, auch wenn guter OOP-Stil verlangt, alle Attribute sauber in `__init__` zu deklarieren."
  },
  {
    "id": 27,
    "topic": 2,
    "type": "write",
    "title": "Code-Writing: Klasse Bankkunde erstellen",
    "prompt": "Schreibe die Klasse `Bankkunde`. Der Konstruktor soll `name` (str) und `kontostand` (float, Standardwert 0.0) entgegennehmen und an `self` binden.",
    "starterCode": "# Schreibe hier die vollständige Klasse Bankkunde:\n",
    "expectedKeywords": [
      "class Bankkunde",
      "def __init__",
      "self",
      "name",
      "kontostand"
    ],
    "solutionCode": "class Bankkunde:\n    def __init__(self, name: str, kontostand: float = 0.0):\n        self.name = name\n        self.kontostand = kontostand",
    "hint": "Achte auf `def __init__(self, name: str, kontostand: float = 0.0):`.",
    "explanation": "Klassenname großschreiben, `self` als 1. Parameter und Werte mit `self.attribut = wert` speichern."
  },
  {
    "id": 28,
    "topic": 2,
    "type": "tf",
    "title": "Mehrere Instanzen Unabhängigkeit",
    "prompt": "Wenn `k1` und `k2` zwei verschiedene Instanzen von `Konto` sind, verändert `k1.kontostand += 100` auch den `kontostand` von `k2`.",
    "answer": false,
    "hint": "Instanzattribute gehören exakt einem Objekt.",
    "explanation": "Falsch! Instanzattribute sind strikt getrennt im Speicher. Eine Änderung an `k1` hat keinerlei Auswirkung auf `k2`."
  },
  {
    "id": 29,
    "topic": 2,
    "type": "cloze",
    "title": "Zugriff auf Klassenattribut",
    "prompt": "Ergänze den Zugriff auf das Klassenattribut über den Klassennamen:",
    "codeTemplate": "class Config:\n    VERSION = 2.0\n\naktuelle_version = {{gap1}}.VERSION",
    "gaps": {
      "gap1": "Config"
    },
    "hint": "Der Name der Klasse.",
    "explanation": "Klassenattribute können direkt über den Klassennamen (`Config.VERSION`) abgerufen werden, ohne dass ein Objekt erzeugt werden muss."
  },
  {
    "id": 30,
    "topic": 2,
    "type": "tf",
    "title": "Vergessenes self bei Zuweisung",
    "prompt": "Schreibt man im Konstruktor nur `alter = alter` statt `self.alter = alter`, ist das Attribut trotzdem auf dem Objekt gespeichert.",
    "answer": false,
    "hint": "Was passiert mit lokalen Variablen nach dem Funktionsende?",
    "explanation": "Falsch! Ohne `self.` ist `alter` nur eine lokale Variable der Funktion `__init__` und wird beim Verlassen sofort gelöscht."
  },
  {
    "id": 31,
    "topic": 2,
    "type": "bughunt",
    "title": "Bug-Hunter: Methodenaufruf im Konstruktor",
    "prompt": "Finde die 2 Fehler in dieser Zähler-Klasse:",
    "codeLines": [
      "class Counter:",
      "    def __init__(self):",
      "        self.count = 0",
      "    def increment(self):",
      "        count += 1",
      "    def reset():",
      "        self.count = 0"
    ],
    "bugIndices": [
      4,
      5
    ],
    "hint": "Zeile 5 greift ohne self auf count zu; Zeile 6 fehlt der Parameter self.",
    "explanation": "Zeile 5: Muss `self.count += 1` heißen.\nZeile 6: `def reset(self):` benötigt zwingend `self` als Parameter."
  },
  {
    "id": 32,
    "topic": 2,
    "type": "tf",
    "title": "Konstruktor Rückgabewert",
    "prompt": "Die Methode `__init__` darf explizit einen String per `return 'Erfolg'` zurückgeben.",
    "answer": false,
    "hint": "Was darf der Konstruktor zurückliefern?",
    "explanation": "Falsch! `__init__` darf niemals einen expliziten Wert zurückgeben. Ein `return` mit Wert führt in Python zu einem schweren `TypeError`!"
  },
  {
    "id": 33,
    "topic": 2,
    "type": "cloze",
    "title": "Objekt erzeugen",
    "prompt": "Erzeuge ein Objekt der Klasse `Auto` mit dem Argument 'BMW' und speichere es in der Variable `mein_wagen`:",
    "codeTemplate": "mein_wagen = {{gap1}}(\"BMW\")",
    "gaps": {
      "gap1": "Auto"
    },
    "hint": "Klassenname als Funktion aufrufen.",
    "explanation": "Objekte werden erzeugt, indem der Klassenname wie eine Funktion aufgerufen wird: `mein_wagen = Auto('BMW')`."
  },
  {
    "id": 34,
    "topic": 2,
    "type": "tf",
    "title": "Parameter self Umbenennung",
    "prompt": "Theoretisch könnte man `self` in Python auch `this` nennen und der Code würde funktionieren, es verstößt aber gegen die offizielle PEP8-Konvention.",
    "answer": true,
    "hint": "Python achtet auf die Position des 1. Parameters, nicht auf das Wort.",
    "explanation": "Richtig! Technisch zählt nur, dass es der erste Parameter ist. Die Python-Konvention schreibt aber ausnahmslos das Wort `self` vor."
  },
  {
    "id": 35,
    "topic": 2,
    "type": "write",
    "title": "Code-Writing: Fester Startzustand",
    "prompt": "Erstelle eine Klasse `Server`. Der Konstruktor nimmt nur `ip` (str) entgegen. Im Rumpf soll automatisch `self.online = False` und `self.verbindungen = 0` initialisiert werden.",
    "starterCode": "class Server:\n    # Konstruktor hier implementieren:\n",
    "expectedKeywords": [
      "def __init__",
      "self",
      "ip",
      "self.online = False",
      "self.verbindungen = 0"
    ],
    "solutionCode": "class Server:\n    def __init__(self, ip: str):\n        self.ip = ip\n        self.online = False\n        self.verbindungen = 0",
    "hint": "Nur `ip` kommt in die Klammer `(self, ip: str)`. Die anderen beiden Werte setzt du fest im Rumpf.",
    "explanation": "Feste Vorgabewerte gehören nicht in die Parameterliste, sondern werden im Rumpf direkt an `self` zugewiesen."
  },
  {
    "id": 36,
    "topic": 3,
    "type": "tf",
    "title": "Private Attribute in Python",
    "prompt": "In Python kennzeichnet man ein privates Attribut, indem man zwei führende Unterstriche voranstellt, z. B. `self.__passwort`.",
    "answer": true,
    "hint": "Zwei Unterstriche lösen Name Mangling aus.",
    "explanation": "Richtig! Zwei führende Unterstriche (`__attribut`) signalisieren private Sichtbarkeit und verhindern den direkten Zugriff von außen."
  },
  {
    "id": 37,
    "topic": 3,
    "type": "cloze",
    "title": "Getter mit Return",
    "prompt": "Vervollständige die Getter-Methode, die das private Attribut `__gehalt` zurückliefert:",
    "codeTemplate": "def get_gehalt(self) -> float:\n    {{gap1}} self.__gehalt",
    "gaps": {
      "gap1": "return"
    },
    "hint": "Mit welchem Befehl gibt eine Funktion einen Wert zurück?",
    "explanation": "Ein Getter muss den Wert mit `return` an den Aufrufer übergeben."
  },
  {
    "id": 38,
    "topic": 3,
    "type": "tf",
    "title": "Zweck eines Setters",
    "prompt": "Der Hauptgrund für einen Setter ist, dass man vor dem Überschreiben eines Werts eine Validierung (Schutzprüfung) durchführen kann.",
    "answer": true,
    "hint": "Der Setter fungiert als 'Türsteher'.",
    "explanation": "Richtig! Ein Setter verhindert, dass ungültige oder zerstörerische Daten (z. B. negatives Alter oder Minus-Gehalt) ins Objekt gelangen."
  },
  {
    "id": 39,
    "topic": 3,
    "type": "bughunt",
    "title": "Bug-Hunter: Setter ohne Parameter",
    "prompt": "Finde die 2 Fehler in dieser Kapselungs-Implementierung:",
    "codeLines": [
      "class Konto:",
      "    def __init__(self):",
      "        self.__pin = 1234",
      "    def set_pin(self):",
      "        if neuer_pin > 0:",
      "            self.__pin = neuer_pin"
    ],
    "bugIndices": [
      3,
      4
    ],
    "hint": "Der Setter in Zeile 4 empfängt keinen neuen Wert in der Parameterliste, nutzt ihn aber in Zeile 5.",
    "explanation": "Zeile 4: Der Setter muss den neuen Wert empfangen: `def set_pin(self, neuer_pin):`.\nZeile 5: Da `neuer_pin` vorher nicht deklariert war, stürzt diese Zeile mit einem NameError ab."
  },
  {
    "id": 40,
    "topic": 3,
    "type": "cloze",
    "title": "Privates Attribut anlegen",
    "prompt": "Schütze das Attribut `kontostand` vor unbefugtem Direktzugriff, indem du die zwei Unterstriche einsetzt:",
    "codeTemplate": "def __init__(self, start: float):\n    self.{{gap1}}kontostand = start",
    "gaps": {
      "gap1": "__"
    },
    "hint": "Genau zwei Unterstriche.",
    "explanation": "Mit zwei Unterstrichen `self.__kontostand` wird das Attribut als privat deklariert."
  },
  {
    "id": 41,
    "topic": 3,
    "type": "tf",
    "title": "Direktzugriff auf Private",
    "prompt": "Wenn ein Attribut `self.__pin` heißt, kann man von außen problemlos `k.pin` schreiben, um den Wert zu lesen.",
    "answer": false,
    "hint": "Das Attribut heißt ja `__pin`, nicht `pin`.",
    "explanation": "Falsch! `k.pin` existiert nicht und `k.__pin` wirft einen AttributeError. Man benötigt den Getter `k.get_pin()`."
  },
  {
    "id": 42,
    "topic": 3,
    "type": "write",
    "title": "Code-Writing: Getter und Setter für Alter",
    "prompt": "Schreibe die Methoden `get_alter(self)` und `set_alter(self, wert: int)`. Der Setter darf das private Attribut `self.__alter` nur aktualisieren, wenn `wert >= 0` ist.",
    "starterCode": "class Person:\n    def __init__(self):\n        self.__alter = 0\n\n    # Implementiere hier get_alter und set_alter:\n",
    "expectedKeywords": [
      "def get_alter",
      "return self.__alter",
      "def set_alter",
      "if wert >= 0",
      "self.__alter = wert"
    ],
    "solutionCode": "class Person:\n    def __init__(self):\n        self.__alter = 0\n\n    def get_alter(self) -> int:\n        return self.__alter\n\n    def set_alter(self, wert: int) -> None:\n        if wert >= 0:\n            self.__alter = wert",
    "hint": "Vergiss das `return` im Getter nicht und prüfe im Setter mit `if wert >= 0:`.",
    "explanation": "Der Getter liest das private Feld aus; der Setter schützt es vor negativen Zahlen."
  },
  {
    "id": 43,
    "topic": 3,
    "type": "tf",
    "title": "Getter Rückgabetyp in Python",
    "prompt": "Ein Getter muss immer den Rückgabetyp `None` haben.",
    "answer": false,
    "hint": "Ein Getter liefert ja Daten zurück, also nicht None!",
    "explanation": "Falsch! Ein Getter liefert den Typ des Attributs zurück (z. B. `-> int` oder `-> str`). `None` wäre ein Hinweis darauf, dass gar nichts zurückgegeben wird."
  },
  {
    "id": 44,
    "topic": 3,
    "type": "cloze",
    "title": "Setter Rückgabetyp",
    "prompt": "Welcher Rückgabetyp wird üblicherweise für Setter notiert, da sie nur Daten verändern und nichts zurückgeben?",
    "codeTemplate": "def set_name(self, neuer_name: str) -> {{gap1}}:\n    self.__name = neuer_name",
    "gaps": {
      "gap1": "None"
    },
    "hint": "Entspricht dem englischen 'void'.",
    "explanation": "Setter geben typischerweise nichts zurück; in Python ist der Rückgabetyp daher `None` (in UML `void`)."
  },
  {
    "id": 45,
    "topic": 3,
    "type": "bughunt",
    "title": "Bug-Hunter: Getter mit print statt return",
    "prompt": "Finde die 2 Fehler in diesem Getter/Setter-Paar:",
    "codeLines": [
      "class Sensor:",
      "    def __init__(self):",
      "        self.__temp = 20.0",
      "    def get_temp(self):",
      "        print(self.__temp)",
      "    def set_temp(self, t):",
      "        self.__temp == t"
    ],
    "bugIndices": [
      4,
      6
    ],
    "hint": "Zeile 5 druckt nur auf den Bildschirm statt den Wert zurückzugeben; Zeile 7 vergleicht mit == statt zuzuweisen.",
    "explanation": "Zeile 5: Ein Getter muss `return self.__temp` verwenden, nicht `print`.\nZeile 7: Zuweisung erfordert ein einzelnes `=`. `==` ist ein Vergleich ohne Effekt!"
  },
  {
    "id": 46,
    "topic": 3,
    "type": "tf",
    "title": "Kapselung und Wartbarkeit",
    "prompt": "Kapselung sorgt dafür, dass man die interne Speicherung eines Werts (z. B. Umrechnung von Celsius in Kelvin) ändern kann, ohne dass der restliche Code, der Getter aufruft, kaputtgeht.",
    "answer": true,
    "hint": "Das ist einer der größten Software-Engineering-Vorteile von Gettern.",
    "explanation": "Richtig! Die Aufrufer nutzen die Schnittstelle `get_temp()`. Wie die Temperatur intern gespeichert wird, ist dem Aufrufer egal."
  },
  {
    "id": 47,
    "topic": 3,
    "type": "cloze",
    "title": "Read-Only Attribute durch Kapselung",
    "prompt": "Wie erzeugt man ein schreibgeschütztes (Read-Only) Attribut in einer Klasse?",
    "codeTemplate": "Man deklariert das Attribut privat und stellt nur einen {{gap1}} bereit, aber keinen Setter.",
    "gaps": {
      "gap1": "Getter"
    },
    "hint": "Mit welcher Methode kann man nur lesen?",
    "explanation": "Wenn es nur einen Getter, aber keinen Setter gibt, kann der Wert von außen nur gelesen, aber niemals überschrieben werden."
  },
  {
    "id": 48,
    "topic": 3,
    "type": "tf",
    "title": "Ein einzelner Unterstrich",
    "prompt": "Ein einzelner Unterstrich vor einem Namen (`self._wert`) ist in Python eine reine Konvention für 'protected', schützt technisch aber nicht vor Zugriff.",
    "answer": true,
    "hint": "Erst zwei Unterstriche lösen Name Mangling aus.",
    "explanation": "Richtig! Ein einzelner Unterstrich signalisiert Entwicklern 'bitte als intern/protected behandeln', blockiert den Zugriff zur Laufzeit jedoch nicht."
  },
  {
    "id": 49,
    "topic": 3,
    "type": "write",
    "title": "Code-Writing: Setter mit Grenzwertprüfung",
    "prompt": "Schreibe einen Setter `set_lautstaerke(self, wert: int)`, der das private Attribut `self.__lautstaerke` nur aktualisiert, wenn `wert` zwischen 0 und 100 liegt (einschließlich).",
    "starterCode": "class Radio:\n    def __init__(self):\n        self.__lautstaerke = 20\n\n    # Implementiere set_lautstaerke hier:\n",
    "expectedKeywords": [
      "def set_lautstaerke",
      "self",
      "wert",
      "if 0 <= wert <= 100",
      "self.__lautstaerke = wert"
    ],
    "solutionCode": "class Radio:\n    def __init__(self):\n        self.__lautstaerke = 20\n\n    def set_lautstaerke(self, wert: int) -> None:\n        if 0 <= wert <= 100:\n            self.__lautstaerke = wert",
    "hint": "Bedingung: `if 0 <= wert <= 100:` oder `if wert >= 0 and wert <= 100:`.",
    "explanation": "Der Türsteher stellt sicher, dass Lautstärken unter 0 oder über 100 ignoriert werden."
  },
  {
    "id": 50,
    "topic": 3,
    "type": "tf",
    "title": "Setter Name Konvention",
    "prompt": "Nach Namenskonvention sollte ein Setter immer mit dem Präfix `set_` gefolgt vom Attributnamen beginnen.",
    "answer": true,
    "hint": "Zum Beispiel set_gewicht oder set_alter.",
    "explanation": "Richtig! Das erleichtert die Lesbarkeit und das Zuordnen zu Klassendiagrammen enorm."
  },
  {
    "id": 51,
    "topic": 3,
    "type": "cloze",
    "title": "Private Methode",
    "prompt": "Kann man auch Methoden privat machen? Ja, indem man vor den Methodennamen ebenfalls {{gap1}} Unterstriche setzt.",
    "codeTemplate": "def {{gap1}}berechne_intern(self):\n    pass",
    "gaps": {
      "gap1": "__"
    },
    "hint": "Genauso viele wie bei privaten Attributen.",
    "explanation": "Auch Methoden können mit zwei Unterstrichen privatisiert werden, sodass sie nur intern von anderen Methoden der Klasse aufgerufen werden können."
  },
  {
    "id": 52,
    "topic": 3,
    "type": "tf",
    "title": "Setter ohne Wertprüfung",
    "prompt": "Ein Setter, der ohne jegliche Prüfung einfach `self.__x = x` macht, ist syntaktisch verboten und stürzt ab.",
    "answer": false,
    "hint": "Es ist syntaktisch erlaubt, auch wenn man sich fragen kann, warum x dann privat ist.",
    "explanation": "Falsch! Syntaktisch ist das völlig legal. Oft beginnt man mit einem einfachen Setter und baut später Prüfungen ein."
  },
  {
    "id": 53,
    "topic": 4,
    "type": "tf",
    "title": "return vs. print",
    "prompt": "Wenn eine Methode `print(42)` ausführt, kann der Aufrufer das Ergebnis in einer Variable fangen und damit weiterrechnen: `x = obj.methode() * 2`.",
    "answer": false,
    "hint": "Was liefert eine Funktion zurück, die kein return hat?",
    "explanation": "Falsch! `print()` gibt nur Text auf der Konsole aus. Der Rückgabewert der Methode ist `None`, wodurch `None * 2` mit einem TypeError abstürzt!"
  },
  {
    "id": 54,
    "topic": 4,
    "type": "cloze",
    "title": "Was liefert eine Funktion ohne return?",
    "prompt": "Welchen Wert hat eine Variable, wenn ihr der Aufruf einer Funktion ohne return-Befehl zugewiesen wird?",
    "codeTemplate": "def mache_etwas():\n    print(\"Hallo\")\n\nx = mache_etwas()\n# x hat jetzt den Wert: {{gap1}}",
    "gaps": {
      "gap1": "None"
    },
    "hint": "Pythons Schlüsselwort für 'Nichts'.",
    "explanation": "In Python geben Funktionen ohne explizites `return` automatisch den Wert `None` zurück."
  },
  {
    "id": 55,
    "topic": 4,
    "type": "tf",
    "title": "Type Hint -> None",
    "prompt": "Die Typangabe `-> None` am Ende eines Funktionskopfes bedeutet, dass die Funktion keinen Wert zurückgibt (entspricht `void` in UML).",
    "answer": true,
    "hint": "Vergleiche UML-Operationen: `fahren(): void`.",
    "explanation": "Richtig! `-> None` ist der Python Type Hint für Prozeduren ohne Rückgabewert."
  },
  {
    "id": 56,
    "topic": 4,
    "type": "bughunt",
    "title": "Bug-Hunter: Berechnungsfunktion",
    "prompt": "Finde die 2 Fehler in dieser Additions-Methode:",
    "codeLines": [
      "class Rechner:",
      "    def addiere(a, b) -> int:",
      "        ergebnis = a + b",
      "        print(ergebnis)",
      "r = Rechner()",
      "summe = r.addiere(5, 10)"
    ],
    "bugIndices": [
      1,
      3
    ],
    "hint": "In Zeile 2 fehlt self; in Zeile 4 fehlt das return, weshalb summe leer bleibt.",
    "explanation": "Zeile 2: `def addiere(self, a, b):` benötigt `self`.\nZeile 4: Die Methode muss `return ergebnis` ausführen, sonst ist `summe` gleich `None`."
  },
  {
    "id": 57,
    "topic": 4,
    "type": "cloze",
    "title": "Rückgabe erzwingen",
    "prompt": "Ergänze das Schlüsselwort, um die Summe an den Aufrufer zurückzugeben:",
    "codeTemplate": "def berechne_gesamtpreis(self) -> float:\n    {{gap1}} self.netto * 1.19",
    "gaps": {
      "gap1": "return"
    },
    "hint": "Englisch für zurückgeben.",
    "explanation": "Mit `return` wird der berechnete Wert aus der Funktion herausgereicht."
  },
  {
    "id": 58,
    "topic": 4,
    "type": "tf",
    "title": "Code nach return",
    "prompt": "Code-Zeilen, die direkt nach einem ausgeführten `return`-Befehl in derselben Funktion stehen, werden trotzdem noch abgearbeitet.",
    "answer": false,
    "hint": "Ein return beendet die Funktionsausführung sofort.",
    "explanation": "Falsch! Sobald `return` ausgeführt wird, verlässt Python die Funktion augenblicklich. Nachfolgende Zeilen werden ignoriert (Dead Code)."
  },
  {
    "id": 59,
    "topic": 4,
    "type": "tf",
    "title": "Type Hints Verbindlichkeit",
    "prompt": "Wenn in Python `def verdopple(x: int) -> int:` steht und man versehentlich einen String übergibt, stürzt Python sofort beim Start wegen des Type Hints ab.",
    "answer": false,
    "hint": "Type Hints sind in Python 'Hints' (Hinweise), keine starre Typbindung wie in C++.",
    "explanation": "Falsch! Type Hints sind optionale Hinweise für Entwickler und IDEs. Python prüft sie zur Laufzeit standardmäßig nicht und erzwingt keine Typen."
  },
  {
    "id": 60,
    "topic": 4,
    "type": "cloze",
    "title": "Type Hint für String-Rückgabe",
    "prompt": "Wie lautet der Type Hint für eine Methode, die Text zurückliefert?",
    "codeTemplate": "def get_beschreibung(self) -> {{gap1}}:\n    return self.beschreibung",
    "gaps": {
      "gap1": "str"
    },
    "hint": "Kurzform für String.",
    "explanation": "In Python wird der Datentyp für Text mit `str` angegeben."
  },
  {
    "id": 61,
    "topic": 4,
    "type": "write",
    "title": "Code-Writing: Methode mit Berechnung & Return",
    "prompt": "Schreibe eine Methode `ist_volljaehrig(self) -> bool` für eine Klasse mit dem Attribut `self.alter`. Sie soll `True` zurückgeben, wenn `alter >= 18`, andernfalls `False`.",
    "starterCode": "class Person:\n    def __init__(self, alter: int):\n        self.alter = alter\n\n    # Implementiere ist_volljaehrig hier:\n",
    "expectedKeywords": [
      "def ist_volljaehrig",
      "self",
      "return self.alter >= 18"
    ],
    "solutionCode": "class Person:\n    def __init__(self, alter: int):\n        self.alter = alter\n\n    def ist_volljaehrig(self) -> bool:\n        return self.alter >= 18",
    "hint": "Du kannst direkt `return self.alter >= 18` schreiben oder ein `if/else` verwenden.",
    "explanation": "Der Vergleich `self.alter >= 18` liefert direkt einen booleschen Wert (`True` oder `False`), der mit `return` zurückgegeben wird."
  },
  {
    "id": 62,
    "topic": 4,
    "type": "tf",
    "title": "Mehrere return Anweisungen",
    "prompt": "Eine Funktion darf mehrere `return`-Anweisungen enthalten (z. B. in unterschiedlichen if-else-Zweigen).",
    "answer": true,
    "hint": "Je nach Bedingung kann an unterschiedlichen Stellen zurückgekehrt werden.",
    "explanation": "Richtig! Häufig nutzt man `if bedingung: return a` und sonst `return b`."
  },
  {
    "id": 63,
    "topic": 4,
    "type": "bughunt",
    "title": "Bug-Hunter: Falscher Rückgabetyp",
    "prompt": "Finde die 2 Fehler in dieser Rabatt-Berechnung:",
    "codeLines": [
      "class Kasse:",
      "    def gewaehre_rabatt(self, preis: float) -> float:",
      "        if preis > 100:",
      "            return preis * 0.9",
      "        print(preis)"
    ],
    "bugIndices": [
      4
    ],
    "hint": "Wenn der Preis <= 100 ist, wird print statt return ausgeführt und die Funktion liefert None zurück!",
    "explanation": "Zeile 5: Wenn `preis <= 100` ist, muss die Methode `return preis` ausführen! Durch `print(preis)` gibt sie im else-Fall unabsichtlich `None` zurück."
  },
  {
    "id": 64,
    "topic": 4,
    "type": "cloze",
    "title": "Type Hint für Ganzzahl",
    "prompt": "Ergänze den Type Hint für eine Methode, die die Anzahl der Tage als ganze Zahl zurückliefert:",
    "codeTemplate": "def get_tage(self) -> {{gap1}}:\n    return self.tage",
    "gaps": {
      "gap1": "int"
    },
    "hint": "Kurzform für Integer.",
    "explanation": "Ganze Zahlen werden in Python als `int` deklariert."
  },
  {
    "id": 65,
    "topic": 4,
    "type": "tf",
    "title": "Rückgabe von Tupeln",
    "prompt": "In Python kann eine Methode mit `return x, y` zwei Werte auf einmal zurückgeben.",
    "answer": true,
    "hint": "Python packt sie automatisch in ein Tupel.",
    "explanation": "Richtig! `return x, y` liefert ein Tupel `(x, y)` zurück, das beim Aufrufer entpackt werden kann (`a, b = obj.coords()`)."
  },
  {
    "id": 66,
    "topic": 4,
    "type": "tf",
    "title": "UML void zu Python",
    "prompt": "Die UML-Signatur `pruefeStatus(): void` übersetzt man in Python sauber als `def pruefe_status(self) -> None:`.",
    "answer": true,
    "hint": "void = kein Rückgabewert = None.",
    "explanation": "Richtig! `void` bedeutet 'kein Rückgabewert', was in Python als `-> None` ausgedrückt wird."
  },
  {
    "id": 67,
    "topic": 4,
    "type": "write",
    "title": "Code-Writing: String-Repräsentation",
    "prompt": "Schreibe eine Methode `get_info(self) -> str`, die einen formatierten String im Format 'Produkt: [name], Preis: [preis] €' per `return` zurückgibt.",
    "starterCode": "class Produkt:\n    def __init__(self, name: str, preis: float):\n        self.name = name\n        self.preis = preis\n\n    # Implementiere get_info hier:\n",
    "expectedKeywords": [
      "def get_info",
      "self",
      "return",
      "self.name",
      "self.preis"
    ],
    "solutionCode": "class Produkt:\n    def __init__(self, name: str, preis: float):\n        self.name = name\n        self.preis = preis\n\n    def get_info(self) -> str:\n        return f\"Produkt: {self.name}, Preis: {self.preis} €\"",
    "hint": "Nutze einen f-String: `return f'Produkt: {self.name}, Preis: {self.preis} €'`.",
    "explanation": "Der formatierte String wird zusammengestellt und mit `return` nach draußen gereicht."
  },
  {
    "id": 68,
    "topic": 4,
    "type": "tf",
    "title": "Vergessenes Return in Suchfunktion",
    "prompt": "Wenn eine Schleife in einer Funktion ein gesuchtes Element findet, reicht es, `print('Gefunden')` zu schreiben, damit der Rest des Programms das Objekt hat.",
    "answer": false,
    "hint": "Hat das Programm das Objekt danach wirklich in einer Variable?",
    "explanation": "Falsch! Nur mit `return element` wird das gefundene Objekt an den Aufrufer übergeben."
  },
  {
    "id": 69,
    "topic": 5,
    "type": "tf",
    "title": "Syntax der Vererbung",
    "prompt": "Um in Python festzulegen, dass `Hund` von `Tier` erbt, schreibt man: `class Hund extends Tier:`.",
    "answer": false,
    "hint": "extends gibt es in Java, aber wie schreibt man es in Python?",
    "explanation": "Falsch! In Python wird die Elternklasse in runden Klammern hinter den Klassennamen gesetzt: `class Hund(Tier):`."
  },
  {
    "id": 70,
    "topic": 5,
    "type": "cloze",
    "title": "Elternkonstruktor mit super()",
    "prompt": "Ergänze den Aufruf des Elternkonstruktors in der Subklasse:",
    "codeTemplate": "class Manager(Mitarbeiter):\n    def __init__(self, name: str, gehalt: float, bonus: float):\n        {{gap1}}().__init__(name, gehalt)\n        self.bonus = bonus",
    "gaps": {
      "gap1": "super"
    },
    "hint": "Die Funktion zur Referenzierung der Superklasse.",
    "explanation": "`super()` delegiert den Aufruf an die Superklasse (Mitarbeiter)."
  },
  {
    "id": 71,
    "topic": 5,
    "type": "tf",
    "title": "Auslassen von super()",
    "prompt": "Wenn eine Subklasse `__init__` überschreibt und `super().__init__()` weglässt, werden die Attribute der Elternklasse trotzdem automatisch initialisiert.",
    "answer": false,
    "hint": "Python ruft den Elternkonstruktor nicht magisch von alleine auf.",
    "explanation": "Falsch! Wenn eine Subklasse einen eigenen `__init__` definiert, überschreibt sie den der Elternklasse komplett. Ohne `super().__init__()` fehlen alle Attribute der Basisklasse!"
  },
  {
    "id": 72,
    "topic": 5,
    "type": "bughunt",
    "title": "Bug-Hunter: Vererbung und super()",
    "prompt": "Finde die 2 Fehler in dieser Vererbungshierarchie:",
    "codeLines": [
      "class Fahrzeug:",
      "    def __init__(self, marke):",
      "        self.marke = marke",
      "class LKW: Fahrzeug",
      "    def __init__(self, marke, tonnen):",
      "        super.__init__(marke)",
      "        self.tonnen = tonnen"
    ],
    "bugIndices": [
      3,
      5
    ],
    "hint": "Zeile 4 nutzt Doppelpunkt statt Klammern; Zeile 6 vergisst die Klammern bei super().",
    "explanation": "Zeile 4: Vererbungssyntax lautet `class LKW(Fahrzeug):`.\nZeile 6: `super()` ist eine Funktion und muss mit Klammern aufgerufen werden: `super().__init__(marke)`."
  },
  {
    "id": 73,
    "topic": 5,
    "type": "cloze",
    "title": "Vererbungssyntax",
    "prompt": "Ergänze die Klammer, damit `PKW` von `Fahrzeug` erbt:",
    "codeTemplate": "class PKW({{gap1}}):\n    def hupen(self):\n        print(\"Hup!\")",
    "gaps": {
      "gap1": "Fahrzeug"
    },
    "hint": "Name der Elternklasse.",
    "explanation": "In den Klammern steht die Superklasse `Fahrzeug`."
  },
  {
    "id": 74,
    "topic": 5,
    "type": "tf",
    "title": "Polymorphie durch Überschreiben",
    "prompt": "Definiert eine Subklasse eine Methode mit exakt demselben Namen wie die Superklasse, nennt man diesen Vorgang 'Überschreiben' (Overriding).",
    "answer": true,
    "hint": "Die Subklasse liefert ihre eigene, spezialisierte Version.",
    "explanation": "Richtig! Beim Überschreiben ersetzt die Subklasse das geerbte Verhalten durch ihre eigene Logik."
  },
  {
    "id": 75,
    "topic": 5,
    "type": "write",
    "title": "Code-Writing: Vollständige Vererbung",
    "prompt": "Erstelle die Klasse `ElektroAuto`, die von `Auto` erbt. Der Konstruktor soll `marke` (str) und `batterie` (int) entgegennehmen. Rufe den Elternkonstruktor mit `super().__init__(marke)` auf und speichere `self.batterie = batterie`.",
    "starterCode": "class Auto:\n    def __init__(self, marke: str):\n        self.marke = marke\n\n# Schreibe hier die Klasse ElektroAuto:\n",
    "expectedKeywords": [
      "class ElektroAuto(Auto):",
      "def __init__",
      "super().__init__(marke)",
      "self.batterie = batterie"
    ],
    "solutionCode": "class ElektroAuto(Auto):\n    def __init__(self, marke: str, batterie: int):\n        super().__init__(marke)\n        self.batterie = batterie",
    "hint": "Achte auf `class ElektroAuto(Auto):` und `super().__init__(marke)`.",
    "explanation": "Saubere Vererbung: Elternklasse in Klammern und Basisattribute mit `super().__init__()` initialisieren."
  },
  {
    "id": 76,
    "topic": 5,
    "type": "tf",
    "title": "self bei super().__init__()",
    "prompt": "Beim Aufruf von `super().__init__(self, marke)` muss man `self` zwingend als erstes Argument in die Klammer von `__init__` schreiben.",
    "answer": false,
    "hint": "Überlege: Übergibt man bei super() noch extra self?",
    "explanation": "Falsch! `super()` bindet `self` bereits automatisch. Der Aufruf lautet schlicht `super().__init__(marke)` ohne `self`!"
  },
  {
    "id": 77,
    "topic": 5,
    "type": "cloze",
    "title": "Originalmethode erweitern",
    "prompt": "Wie ruft man die Methode der Elternklasse auf, um deren Ergebnis zu erweitern?",
    "codeTemplate": "def beschreibung(self) -> str:\n    basis = {{gap1}}().beschreibung()\n    return f\"{basis} [Spezialisiert]\"",
    "gaps": {
      "gap1": "super"
    },
    "hint": "Derselbe Befehl wie im Konstruktor.",
    "explanation": "Mit `super().methode()` kann man die Originalimplementierung der Elternklasse aufrufen und um zusätzliche Logik ergänzen."
  },
  {
    "id": 78,
    "topic": 5,
    "type": "tf",
    "title": "Mehrfachvererbung in Python",
    "prompt": "Python erlaubt es im Gegensatz zu Java, dass eine Klasse von mehr als einer Basisklasse gleichzeitig erbt (z. B. `class Smartphone(Telefon, Kamera):`).",
    "answer": true,
    "hint": "Python unterstützt echte Mehrfachvererbung.",
    "explanation": "Richtig! Python unterstützt Mehrfachvererbung (Multiple Inheritance). Die Reihenfolge der Auflösung wird über das MRO-Verfahren gesteuert."
  },
  {
    "id": 79,
    "topic": 5,
    "type": "bughunt",
    "title": "Bug-Hunter: Methoden überschreiben",
    "prompt": "Finde die 2 Fehler in dieser Überschreibung:",
    "codeLines": [
      "class Tier:",
      "    def laut(self):",
      "        return \"Geräusch\"",
      "class Katze(Tier):",
      "    def laut():",
      "        return super.laut() + \" -> Miau\""
    ],
    "bugIndices": [
      4,
      5
    ],
    "hint": "Zeile 5 fehlt self; Zeile 6 fehlen die Klammern bei super().",
    "explanation": "Zeile 5: Auch überschriebene Methoden brauchen `self`: `def laut(self):`.\nZeile 6: `super` muss als Funktion aufgerufen werden: `super().laut()`."
  },
  {
    "id": 80,
    "topic": 5,
    "type": "tf",
    "title": "Vererbung von privaten Attributen",
    "prompt": "Ein mit `__` geschütztes privates Attribut der Superklasse kann in der Subklasse direkt mit `self.__attribut` verändert werden.",
    "answer": false,
    "hint": "Private Attribute sind strikt auf ihre eigene definierende Klasse beschränkt.",
    "explanation": "Falsch! Private Attribute unterliegen dem Name Mangling der Superklasse. Die Subklasse kann nur über geerbte Getter/Setter darauf zugreifen."
  },
  {
    "id": 81,
    "topic": 5,
    "type": "cloze",
    "title": "DRY-Prinzip bei Vererbung",
    "prompt": "Vererbung verhindert redundanten Code. Wofür steht die Abkürzung DRY?",
    "codeTemplate": "DRY steht für: Don't {{gap1}} Yourself.",
    "gaps": {
      "gap1": "Repeat"
    },
    "hint": "Englisch für wiederholen.",
    "explanation": "Don't Repeat Yourself (Wiederhole dich nicht) – gemeinsame Logik wird zentral in der Superklasse gepflegt."
  },
  {
    "id": 82,
    "topic": 5,
    "type": "tf",
    "title": "isinstance Prüfung",
    "prompt": "Wenn `d = Dackel()` von `Hund` erbt, liefert der Aufruf `isinstance(d, Hund)` den Wert `True`.",
    "answer": true,
    "hint": "Ein Dackel ist ein Hund.",
    "explanation": "Richtig! `isinstance` prüft die gesamte Vererbungshierarchie ab. Ein Dackel-Objekt ist gleichzeitig eine Instanz von `Hund` und von `Tier`."
  },
  {
    "id": 83,
    "topic": 5,
    "type": "write",
    "title": "Code-Writing: Polymorphe Methode implementieren",
    "prompt": "Gegeben ist die Klasse `Mitarbeiter` mit der Methode `arbeite(self)`. Erstelle die Subklasse `Entwickler(Mitarbeiter)`, die `arbeite(self)` überschreibt und `'Schreibt Code'` per `return` zurückgibt.",
    "starterCode": "class Mitarbeiter:\n    def arbeite(self) -> str:\n        return \"Erledigt Aufgaben\"\n\n# Schreibe hier Entwickler:\n",
    "expectedKeywords": [
      "class Entwickler(Mitarbeiter):",
      "def arbeite(self)",
      "return \"Schreibt Code\""
    ],
    "solutionCode": "class Entwickler(Mitarbeiter):\n    def arbeite(self) -> str:\n        return \"Schreibt Code\"",
    "hint": "Erbe mit `class Entwickler(Mitarbeiter):` und definiere `def arbeite(self):` neu.",
    "explanation": "Die Subklasse überschreibt die geerbte Methode und gibt ihr eigenes, spezialisiertes Verhalten zurück."
  },
  {
    "id": 84,
    "topic": 5,
    "type": "tf",
    "title": "Subklasse erweitert Attribute",
    "prompt": "Eine Subklasse darf neben den geerbten Attributen beliebig viele eigene, neue Attribute deklarieren.",
    "answer": true,
    "hint": "Das ist das Wesen der Spezialisierung.",
    "explanation": "Richtig! Spezialisierung bedeutet genau das: Die Basis behalten und durch zusätzliche Attribute oder Methoden erweitern."
  },
  {
    "id": 85,
    "topic": 5,
    "type": "cloze",
    "title": "Oberklassen-Referenz",
    "prompt": "Wie nennt man die übergeordnete Klasse in der Fachterminologie noch?",
    "codeTemplate": "Andere Begriffe für Superklasse sind Basisklasse oder {{gap1}}.",
    "gaps": {
      "gap1": "Elternklasse"
    },
    "hint": "Gegenstück zur Kindklasse.",
    "explanation": "Superklasse, Basisklasse, Oberklasse und Elternklasse sind synonyme Begriffe."
  },
  {
    "id": 86,
    "topic": 5,
    "type": "tf",
    "title": "Polymorphe Schleife",
    "prompt": "Man kann Objekte unterschiedlicher Subklassen (z. B. `Hund`, `Katze`) in eine gemeinsame Liste packen und in einer for-Schleife für jedes Objekt dieselbe Methode aufrufen.",
    "answer": true,
    "hint": "for tier in tiere: tier.laut()",
    "explanation": "Richtig! Das ist das Paradebeispiel für Polymorphie: Der aufrufende Code muss den konkreten Untertyp nicht kennen."
  },
  {
    "id": 87,
    "topic": 6,
    "type": "tf",
    "title": "UML Sichtbarkeit Plus (+)",
    "prompt": "Im UML-Klassendiagramm steht das Pluszeichen `+` für private Sichtbarkeit.",
    "answer": false,
    "hint": "Was bedeutet das Minuszeichen?",
    "explanation": "Falsch! `+` bedeutet public (öffentlich). `-` steht für private und `#` für protected."
  },
  {
    "id": 88,
    "topic": 6,
    "type": "cloze",
    "title": "UML Sichtbarkeits-Symbol Protected",
    "prompt": "Welches Zeichen symbolisiert die Sichtbarkeit protected im UML-Klassendiagramm?",
    "codeTemplate": "Sichtbarkeit protected = {{gap1}}",
    "gaps": {
      "gap1": "#"
    },
    "hint": "Die Raute / das Doppelkreuz auf der Tastatur.",
    "explanation": "`#` steht für protected (nur in der eigenen Klasse und Subklassen sichtbar)."
  },
  {
    "id": 89,
    "topic": 6,
    "type": "tf",
    "title": "Abgeleitetes Attribut (/)",
    "prompt": "Ein Attribut mit einem vorangestellten Schrägstrich `/alter: int` wird dauerhaft als feste Spalte in der Datenbank gespeichert.",
    "answer": false,
    "hint": "Ein Schrägstrich kennzeichnet abgeleitete Attribute.",
    "explanation": "Falsch! Der Schrägstrich `/` kennzeichnet ein abgeleitetes Attribut. Es wird zur Laufzeit dynamisch berechnet (z. B. aus dem Geburtsdatum) und nicht persistent gespeichert."
  },
  {
    "id": 90,
    "topic": 6,
    "type": "tf",
    "title": "Klassenattribute im UML Diagramm",
    "prompt": "Statische Attribute (Klassenattribute) werden im Klassendiagramm durch Unterstreichung dargestellt.",
    "answer": true,
    "hint": "Vergleiche Folie 16 im Skript.",
    "explanation": "Richtig! Unterstrichene Attribute oder Operationen kennzeichnen Klassenattribute bzw. Klassenmethoden (`static`)."
  },
  {
    "id": 91,
    "topic": 6,
    "type": "cloze",
    "title": "Aggregation vs. Komposition Rauten",
    "prompt": "Ergänze die Rautenfarben: Eine leere (weiße) Raute bedeutet {{gap1}}, eine ausgefüllte (schwarze) Raute bedeutet {{gap2}}.",
    "codeTemplate": "Weiß = {{gap1}}\nSchwarz = {{gap2}}",
    "gaps": {
      "gap1": "Aggregation",
      "gap2": "Komposition"
    },
    "hint": "Aggregation ist lose, Komposition ist streng.",
    "explanation": "Leere Raute = Aggregation (Teile können ohne Ganzes leben). Ausgefüllte Raute = Komposition (Existenzabhängigkeit, Teile sterben mit dem Ganzen)."
  },
  {
    "id": 92,
    "topic": 6,
    "type": "tf",
    "title": "Komposition Lebensdauer",
    "prompt": "Bei einer Komposition (z. B. Tisch ◆── Tischbein) können die Beine ohne den Tisch weiter existieren, wenn der Tisch zerstört wird.",
    "answer": false,
    "hint": "Eine Komposition ist eine strenge Existenzabhängigkeit.",
    "explanation": "Falsch! Bei einer Komposition sind die Teile existenzabhängig vom Ganzen. Wird das Ganze zerstört, enden auch die Teile."
  },
  {
    "id": 93,
    "topic": 6,
    "type": "tf",
    "title": "Objektdiagramm Methoden",
    "prompt": "Im UML-Objektdiagramm werden alle Methoden der Klasse mit Parametern und Rückgabewerten gezeichnet.",
    "answer": false,
    "hint": "Achtung, Klausurfalle! Objektdiagramme zeigen nur Zustände.",
    "explanation": "Falsch! Im Objektdiagramm werden grundsätzlich KEINE Methoden dargestellt! Es zeigt ausschließlich konkrete Attributwerte zu einem Zeitpunkt."
  },
  {
    "id": 94,
    "topic": 6,
    "type": "cloze",
    "title": "Objektdiagramm Kopfzeile",
    "prompt": "Im Unterschied zum Klassendiagramm ist die Kopfzeile im Objektdiagramm (z. B. `maren : Gast`) immer:",
    "codeTemplate": "Der Kopfname im Objektdiagramm ist immer {{gap1}}.",
    "gaps": {
      "gap1": "unterstrichen"
    },
    "hint": "Visuelles Merkmal für Instanzen.",
    "explanation": "Instanznamen im Objektdiagramm werden immer unterstrichen notiert (`instanzName : KlassenName`)."
  },
  {
    "id": 95,
    "topic": 6,
    "type": "tf",
    "title": "Use-Case: Akteure Position",
    "prompt": "Im UML-Anwendungsfalldiagramm (Use-Case) dürfen Akteure sowohl innerhalb als auch außerhalb der Systemgrenze gezeichnet werden.",
    "answer": false,
    "hint": "Akteure interagieren von außen mit dem System.",
    "explanation": "Falsch! Akteure stehen ausnahmslos IMMER AUSSERHALB der Systemgrenze, da sie die externe Umwelt darstellen."
  },
  {
    "id": 96,
    "topic": 6,
    "type": "cloze",
    "title": "Use-Case: Include Beziehung",
    "prompt": "Welche Beziehung kennzeichnet einen obligatorischen Pflichtschritt, der bei jeder Ausführung des Basisfalls zwingend aufgerufen wird?",
    "codeTemplate": "Pflichtschritt = <<{{gap1}}>>",
    "gaps": {
      "gap1": "include"
    },
    "hint": "Englisch für einbinden.",
    "explanation": "`<<include>>` modelliert das unbedingte Aufrufen eines Teilschritts (z. B. 'Mit Karte zahlen' includes 'PIN prüfen')."
  },
  {
    "id": 97,
    "topic": 6,
    "type": "tf",
    "title": "Pfeilrichtung bei Extend",
    "prompt": "Bei einer `<<extend>>`-Beziehung zeigt die gestrichelte Pfeilspitze vom erweiternden Sonderfall ZURÜCK zum erweiterten Basisfall.",
    "answer": true,
    "hint": "Der Sonderfall klinkt sich rückwirkend am Extension Point ein.",
    "explanation": "Richtig! Der Pfeil bei `<<extend>>` zeigt immer vom optionalen Sonderfall ZUM Basisfall! (Gegenstück zu include, wo der Pfeil zum Teilschritt zeigt)."
  },
  {
    "id": 98,
    "topic": 6,
    "type": "tf",
    "title": "Use-Case: Reihenfolge der Ausführung",
    "prompt": "Ein Anwendungsfalldiagramm legt präzise fest, in welcher zeitlichen Reihenfolge die Use-Cases im Programmcode ausgeführt werden müssen.",
    "answer": false,
    "hint": "Ein Use-Case-Diagramm zeigt nur das WAS, nicht das WIE oder WANN.",
    "explanation": "Falsch! Anwendungsfalldiagramme zeigen keine Ablaufreihenfolgen. Zeitliche Abfolgen modelliert man in Aktivitäts- oder Sequenzdiagrammen."
  },
  {
    "id": 99,
    "topic": 6,
    "type": "cloze",
    "title": "Use-Case: Extend Bedingung",
    "prompt": "Ein `<<extend>>`-Fall wird nur ausgeführt, wenn an einem Extension Point eine bestimmte {{gap1}} erfüllt ist.",
    "codeTemplate": "Extend erfordert eine {{gap1}} (Condition).",
    "gaps": {
      "gap1": "Bedingung"
    },
    "hint": "Englisch: Condition.",
    "explanation": "Ein Extend-Fall ist konditional und wird nur ausgeführt, wenn die definierte Bedingung (Condition) zutrifft (z. B. 'erhaltener Betrag < Preis')."
  },
  {
    "id": 100,
    "topic": 6,
    "type": "tf",
    "title": "Vererbungspfeil im Klassendiagramm",
    "prompt": "Die geschlossene, leere Pfeilspitze der Generalisierungslinie zeigt im Klassendiagramm immer zur Subklasse nach unten.",
    "answer": false,
    "hint": "Zeigt der Pfeil zum Kind oder zur Mutter?",
    "explanation": "Falsch! Der Vererbungspfeil zeigt immer nach oben zur allgemeinen Superklasse (Elternklasse)!"
  },
  {
    "id": 101,
    "topic": 6,
    "type": "tf",
    "title": "Externes System als Akteur",
    "prompt": "Ein externes IT-System (z. B. Kreditkarten-Gesellschaft) kann im Use-Case-Diagramm als Akteur mit dem Stereotyp `<<Actor>>` modelliert werden.",
    "answer": true,
    "hint": "Akteure müssen keine echten Menschen sein.",
    "explanation": "Richtig! Externe Systeme, die mit unserer Software kommunizieren, werden als Kasten mit dem Stereotyp `<<Actor>>` außerhalb der Systemgrenze platziert."
  },
  {
    "id": 102,
    "topic": 6,
    "type": "cloze",
    "title": "Multiplizität Stern (*)",
    "prompt": "Was bedeutet das Multiplizitäts-Symbol `*` an einem Assoziationsende?",
    "codeTemplate": "Das Symbol * bedeutet beliebig {{gap1}}.",
    "gaps": {
      "gap1": "viele"
    },
    "hint": "Null bis unendlich.",
    "explanation": "`*` (oder `0..*`) bedeutet 'beliebig viele' Objekte."
  },
  {
    "id": 103,
    "topic": 6,
    "type": "tf",
    "title": "Position der Raute bei Aggregation",
    "prompt": "Die Raute einer Aggregation oder Komposition steht immer auf der Seite des Einzelteils, niemals beim Ganzen.",
    "answer": false,
    "hint": "Achtung Klausurfalle! Wo klebt die Raute?",
    "explanation": "Falsch! Die Raute steht ausnahmslos IMMER auf der Seite des GANZEN (des Aggregats/Besitzers)!"
  },
  {
    "id": 104,
    "topic": 6,
    "type": "write",
    "title": "Code-Writing: UML in Python umsetzen",
    "prompt": "Gegeben ist der UML-Kasten:\n--------------------------\nFahrrad\n--------------------------\n- rahmennummer : str\n+ gaenge : int = 7\n--------------------------\n+ get_rahmennummer() : str\n--------------------------\nImplementiere diese Klasse 1:1 in Python mit privater Rahmennummer.",
    "starterCode": "# Implementiere die Klasse Fahrrad gemäß UML-Vorgabe:\n",
    "expectedKeywords": [
      "class Fahrrad",
      "def __init__",
      "self.__rahmennummer",
      "self.gaenge = 7",
      "def get_rahmennummer",
      "return self.__rahmennummer"
    ],
    "solutionCode": "class Fahrrad:\n    def __init__(self, rahmennummer: str, gaenge: int = 7):\n        self.__rahmennummer = rahmennummer  # - bedeutet privat (__)\n        self.gaenge = gaenge                # + bedeutet public\n\n    def get_rahmennummer(self) -> str:\n        return self.__rahmennummer",
    "hint": "`-` bedeutet zwei Unterstriche (`self.__rahmennummer`). Der Getter liefert diesen Wert per `return` zurück.",
    "explanation": "Private Attribute beginnen mit `__`, öffentliche sind normal zugänglich, und Operationen werden als Methoden implementiert."
  },
  {
    "id": 105,
    "topic": 1,
    "type": "diagram_click",
    "title": "RAM-Modell: Zeiger & Aliasing",
    "prompt": "Gegeben ist: a = Auto() und b = a. Klicke im Speicher-Diagramm auf das reale Objekt im Heap, auf das beide Variablen zeigen:",
    "diagramType": "memory_pointer",
    "diagramConfig": {
      "stackVars": [
        {
          "name": "a",
          "id": "var_a",
          "pointsToId": "heap_car"
        },
        {
          "name": "b",
          "id": "var_b",
          "pointsToId": "heap_car"
        }
      ],
      "heapObjects": [
        {
          "id": "heap_car",
          "label": "Auto (Objekt #104)",
          "attrs": [
            "marke=\"BMW\"",
            "km=0"
          ]
        }
      ]
    },
    "targetHotspotId": "heap_car",
    "hint": "Variablen im Stack sind nur Zeiger. Das eigentliche Objekt existiert genau 1x im Heap.",
    "explanation": "Richtig! Beide Variablen \"a\" und \"b\" verweisen auf dieselbe Instanz im Heap. Ändert man b.km, ändert sich auch a.km!"
  },
  {
    "id": 106,
    "topic": 2,
    "type": "diagram_click",
    "title": "RAM-Modell: Wohin zeigt self?",
    "prompt": "Beim Aufruf von auto1.fahren() wird das Objekt übergeben. Klicke auf die Variable im Stack, die auf dasselbe Objekt wie self zeigt:",
    "diagramType": "memory_pointer",
    "diagramConfig": {
      "stackVars": [
        {
          "name": "auto1",
          "id": "var_car1",
          "pointsToId": "heap_car1"
        },
        {
          "name": "auto2",
          "id": "var_car2",
          "pointsToId": "heap_car2"
        },
        {
          "name": "self",
          "id": "var_self",
          "pointsToId": "heap_car1"
        }
      ],
      "heapObjects": [
        {
          "id": "heap_car1",
          "label": "Auto #1 (Heap)",
          "attrs": [
            "km=50"
          ]
        },
        {
          "id": "heap_car2",
          "label": "Auto #2 (Heap)",
          "attrs": [
            "km=120"
          ]
        }
      ]
    },
    "targetHotspotId": "var_car1",
    "hint": "Schau, auf welches Objekt self im Diagramm zeigt.",
    "explanation": "Genau! auto1 und self zeigen auf dasselbe Heap-Objekt. auto1.fahren() wird intern als Auto.fahren(self=auto1) aufgerufen."
  },
  {
    "id": 107,
    "topic": 3,
    "type": "diagram_click",
    "title": "UML: Privates Attribut identifizieren",
    "prompt": "Klicke im abgebildeten UML-Klassendiagramm auf das Attribut mit privater Sichtbarkeit (-):",
    "diagramType": "class_diagram",
    "diagramConfig": {
      "className": "Bankkonto",
      "attributes": [
        {
          "text": "+ kontonummer : str",
          "id": "attr_nr"
        },
        {
          "text": "- pin : int",
          "id": "attr_pin"
        },
        {
          "text": "# saldo : float",
          "id": "attr_saldo"
        }
      ],
      "methods": [
        {
          "text": "+ abheben(betrag: float) : bool",
          "id": "meth_withdraw"
        }
      ]
    },
    "targetHotspotId": "attr_pin",
    "hint": "+ steht für public, - für private, # für protected.",
    "explanation": "Perfekt! Das Minuszeichen (-) steht in der UML für private Sichtbarkeit. In Python wird dies mit zwei führenden Unterstrichen (__pin) umgesetzt."
  },
  {
    "id": 108,
    "topic": 6,
    "type": "diagram_click",
    "title": "UML: Abgeleitetes Attribut (/) erkennen",
    "prompt": "Ein Attribut wird zur Laufzeit dynamisch berechnet und nicht gespeichert. Klicke im Klassendiagramm auf dieses abgeleitete Attribut:",
    "diagramType": "class_diagram",
    "diagramConfig": {
      "className": "Person",
      "attributes": [
        {
          "text": "- geburtsdatum : Date",
          "id": "attr_birth"
        },
        {
          "text": "+ /alter : int",
          "id": "attr_derived_age"
        },
        {
          "text": "- name : str",
          "id": "attr_name"
        }
      ],
      "methods": [
        {
          "text": "+ get_name() : str",
          "id": "meth_get_name"
        }
      ]
    },
    "targetHotspotId": "attr_derived_age",
    "hint": "Abgeleitete Attribute werden in UML durch ein Satzzeichen vor dem Namen gekennzeichnet.",
    "explanation": "Richtig! Der Schrägstrich (/) kennzeichnet ein abgeleitetes Attribut, das dynamisch berechnet wird."
  },
  {
    "id": 109,
    "topic": 6,
    "type": "diagram_click",
    "title": "UML: Komposition (◆) erkennen",
    "prompt": "Ein Auto besteht aus einem Motor. Stirbt das Auto, wird der Motor mit zerstört (Existenzabhängigkeit). Klicke auf die Verbindung:",
    "diagramType": "relationship",
    "diagramConfig": {
      "classA": "Auto (Ganzes)",
      "subtextA": "Besitzer",
      "classB": "Motor (Teil)",
      "subtextB": "existenzabhängig",
      "currentSymbol": "composition"
    },
    "targetHotspotId": "relation-link",
    "hint": "Schwarze Raute = Komposition (strenge Bindung), weiße Raute = Aggregation (lose Bindung).",
    "explanation": "Genau! Die ausgefüllte Raute ◆ kennzeichnet eine Komposition. Die Teile können ohne das Ganze nicht existieren."
  },
  {
    "id": 110,
    "topic": 6,
    "type": "diagram_click",
    "title": "Use-Case: Akteur außerhalb der Systemgrenze",
    "prompt": "Akteure interagieren von außen mit dem System. Klicke im Diagramm auf den externen Akteur:",
    "diagramType": "use_case",
    "diagramConfig": {
      "actorName": "Kunde",
      "stereotype": "<<include>>"
    },
    "targetHotspotId": "actor-human",
    "hint": "Akteure werden als Strichmännchen gezeichnet und stehen IMMER außerhalb des Systemkastens.",
    "explanation": "Richtig! Akteure stehen ausnahmslos außerhalb der Systemgrenze, da sie die Umwelt des Systems darstellen."
  }
];

  window.TASK_DATABASE = {
    TOPICS,
    TASKS
  };
})();
