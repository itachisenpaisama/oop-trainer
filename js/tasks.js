/**
 * Python OOP & UML Trainer - Bottom-Up Task Database
 * Structured across 12 didactic levels: from RAM pointers to Exam Capstones.
 */
(function() {
  const TOPICS = {
    1: { id: 1, title: "1. Speicher, Referenzen & RAM", icon: "🧠" },
    2: { id: 2, title: "2. Funktionen vs. self", icon: "⚡" },
    3: { id: 3, title: "3. Konstruktor & Attribute", icon: "🏗️" },
    4: { id: 4, title: "4. Klassen- vs. Instanzdaten", icon: "📦" },
    5: { id: 5, title: "5. Kapselung & Getter/Setter", icon: "🛡️" },
    6: { id: 6, title: "6. Rückgaben & Type Hints", icon: "🔄" },
    7: { id: 7, title: "7. Vererbung & super()", icon: "🧬" },
    8: { id: 8, title: "8. Polymorphie & Overriding", icon: "🎭" },
    9: { id: 9, title: "9. UML-Klassendiagramme", icon: "📐" },
    10: { id: 10, title: "10. UML-Beziehungen (◇ vs. ◆)", icon: "🔗" },
    11: { id: 11, title: "11. UML Use-Case Diagramme", icon: "🎯" },
    12: { id: 12, title: "12. Klausur-Synthese & Boss", icon: "👑" }
  };

  const TASKS = [
    // =========================================================================
    // LEVEL 1: SPEICHER, REFERENZEN & RAM (ID 1 - 10)
    // =========================================================================
    {
      id: 1, topic: 1, type: "tf",
      title: "Variablen als Zettel im Speicher",
      prompt: "In Python speichert eine Variable wie `a = [10, 20]` nicht die Zahlen selbst in ihrer Tabellenzelle, sondern lediglich eine Referenz (die Speicheradresse / einen Pfeil) auf das Listen-Objekt im Heap.",
      answer: true,
      hint: "Überlege: Ist eine Variable eine Kiste mit dem Objekt oder ein Zettel mit der Hausnummer?",
      explanation: "Richtig! Variablen in Python sind Referenzen (Pfeile im Speicher). Sie zeigen auf Objekte im Heap-Arbeitsspeicher."
    },
    {
      id: 2, topic: 1, type: "diagram_click",
      title: "Speicher-Zeiger: Aliasing",
      prompt: "Gegeben ist: `a = Auto()` und `b = a`. Klicke in der Grafik auf das Element im RAM, das den eigentlichen Objektzustand speichert:",
      diagramType: "memory_pointer",
      diagramConfig: {
        stackVars: [
          { name: "a", id: "var_a", pointsToId: "heap_car" },
          { name: "b", id: "var_b", pointsToId: "heap_car" }
        ],
        heapObjects: [
          { id: "heap_car", label: "Auto (Objekt #104)", attrs: ["marke='BMW'", "km=0"] }
        ]
      },
      targetHotspotId: "heap_car",
      hint: "Links sind die Namen (Stack), rechts sind die realen Objekte im Arbeitsspeicher (Heap).",
      explanation: "Exakt! 'a' und 'b' sind nur zwei verschiedene Zeiger auf dasselbe physische Auto-Objekt im Heap. Ändert man b.km, ändert sich auch a.km!"
    },
    {
      id: 3, topic: 1, type: "tf",
      title: "Identität 'is' vs. Gleichheit '=='",
      prompt: "Wenn zwei verschiedene Objekte `auto1` und `auto2` exakt die gleichen Attributwerte besitzen (z. B. beide Farbe 'rot'), liefert `auto1 is auto2` immer True.",
      answer: false,
      hint: "'is' prüft, ob die Speicheradresse (id) identisch ist; '==' prüft den Inhalt.",
      explanation: "Falsch! '==' vergleicht die Werte, aber 'is' prüft die physische Identität im RAM (`id(auto1) == id(auto2)`). Zwei getrennte Autos an zwei Speicherstellen ergeben `auto1 is auto2 -> False`."
    },
    {
      id: 4, topic: 1, type: "cloze",
      title: "Speicheradresse ermitteln",
      prompt: "Mit welcher eingebauten Python-Funktion kann man die eindeutige Speicheradresse eines Objekts im RAM abfragen?",
      codeTemplate: "speicher_adresse = {{gap1}}(mein_objekt)",
      gaps: { gap1: "id" },
      hint: "Zwei Buchstaben, kurz für Identität.",
      explanation: "`id(objekt)` gibt die numerische Speicheradresse des Objekts im Arbeitsspeicher zurück."
    },
    {
      id: 5, topic: 1, type: "bughunt",
      title: "Bug-Hunter: Unbeabsichtigtes Aliasing",
      prompt: "In welchem Schritt wird fälschlicherweise kein neues Objekt erzeugt, sondern nur die Referenz kopiert? Klicke auf die fehlerhafte Zeile:",
      codeLines: [
        "liste1 = [1, 2, 3]",
        "liste2 = liste1",
        "liste2.append(99)",
        "print(liste1)"
      ],
      bugIndices: [1],
      hint: "Zeile 2 erzeugt keine Kopie der Liste, sondern lässt liste2 auf dasselbe Objekt zeigen.",
      explanation: "Zeile 2: `liste2 = liste1` kopiert nur den Zeiger! Um eine echte Kopie im RAM zu erzeugen, müsste man `liste1.copy()` oder `liste1[:]` schreiben."
    },
    {
      id: 6, topic: 1, type: "tf",
      title: "Garbage Collector",
      prompt: "Wenn kein einziger Zeiger im Stack mehr auf ein Objekt im Heap verweist, wird der Speicherplatz durch den Python Garbage Collector automatisch freigegeben.",
      answer: true,
      hint: "Reference Counting räumt verwaiste Objekte auf.",
      explanation: "Richtig! Sobald der Referenzzähler eines Objekts auf 0 fällt, räumt Pythons automatischer Müllsammler das Objekt aus dem RAM."
    },
    {
      id: 7, topic: 1, type: "cloze",
      title: "Objekt vs. Klasse",
      prompt: "Vervollständige den fundamentalen Unterschied bezüglich des Arbeitsspeichers:",
      codeTemplate: "Die {{gap1}} ist der Bauplan im Code,\nwährend das {{gap2}} das konkrete Ding im RAM ist.",
      gaps: { gap1: "Klasse", gap2: "Objekt" },
      hint: "Zuerst der Bauplan, dann das fertige Ding im Speicher.",
      explanation: "Die Klasse existiert als Typ-Definition; das Objekt (die Instanz) belegt echten dynamischen Heap-Speicher zur Laufzeit."
    },
    {
      id: 8, topic: 1, type: "write",
      title: "Code-Writing: Speichervergleich",
      prompt: "Schreibe eine Funktion `selbes_objekt(a, b) -> bool`, die prüft, ob `a` und `b` auf exakt denselben Speicherplatz zeigen (Identitätsprüfung mit dem Operator `is`).",
      starterCode: "def selbes_objekt(a, b) -> bool:\n    # Gib True zurück, wenn a und b im RAM identisch sind:\n    pass",
      expectedKeywords: ["return a is b"],
      solutionCode: "def selbes_objekt(a, b) -> bool:\n    return a is b",
      hint: "Verwende `return a is b`.",
      explanation: "Der Operator `is` prüft direkt, ob beide Operanden auf dieselbe Speicheradresse im Heap verweisen."
    },
    {
      id: 9, topic: 1, type: "tf",
      title: "Veränderbarkeit (Mutability)",
      prompt: "Strings und Integer sind in Python veränderbare (mutable) Objekte; wenn man `x = 5; x += 1` schreibt, wird die Zahl an derselben Speicheradresse überschrieben.",
      answer: false,
      hint: "Zahlen und Strings sind immutable (unveränderlich).",
      explanation: "Falsch! `int`, `str` und `tuple` sind unveränderlich (immutable). `x += 1` erzeugt im RAM ein völlig neues Integer-Objekt 6 und lässt x dorthin zeigen."
    },
    {
      id: 10, topic: 1, type: "cloze",
      title: "Instanziierungs-Syntax",
      prompt: "Vervollständige den Aufruf, um aus der Klasse `Konto` eine neue Instanz im Speicher anzulegen:",
      codeTemplate: "k1 = {{gap1}}()",
      gaps: { gap1: "Konto" },
      hint: "Der Klassenname mit Aufrufklammern.",
      explanation: "Das Aufrufen des Klassennamens mit Klammern `Konto()` instanziiert das Objekt im Heap."
    },

    // =========================================================================
    // LEVEL 2: FUNKTIONEN VS. METHODEN & DAS GEHEIMNIS VON SELF (ID 11 - 20)
    // =========================================================================
    {
      id: 11, topic: 2, type: "tf",
      title: "Was ist self?",
      prompt: "In Python ist `self` ein magisches, vom Compiler reserviertes Schlüsselwort und kann technisch unter keinen Umständen umbenannt werden.",
      answer: false,
      hint: "Gibt es das Wort self in der Python-Grammatik als reserviertes Keyword?",
      explanation: "Falsch! `self` ist kein reserviertes Schlüsselwort. Es ist lediglich der erste Parameter einer Instanzmethode. Man könnte es technisch 'x' nennen (auch wenn PEP8 ausnahmslos 'self' vorschreibt)."
    },
    {
      id: 12, topic: 2, type: "diagram_click",
      title: "Speicher: Wohin zeigt self?",
      prompt: "Der Aufruf `mein_auto.fahren()` übergibt das Objekt an die Methode. Klicke auf die Variable im Stack, die exakt denselben Zeiger wie `self` besitzt:",
      diagramType: "memory_pointer",
      diagramConfig: {
        stackVars: [
          { name: "mein_auto", id: "var_car", pointsToId: "heap_car1" },
          { name: "anderes_auto", id: "var_other", pointsToId: "heap_car2" },
          { name: "self", id: "var_self", pointsToId: "heap_car1" }
        ],
        heapObjects: [
          { id: "heap_car1", label: "Auto (Objekt #1)", attrs: ["km=50"] },
          { id: "heap_car2", label: "Auto (Objekt #2)", attrs: ["km=120"] }
        ]
      },
      targetHotspotId: "var_car",
      hint: "Schau dir an, auf welches Objekt 'self' im Diagramm zeigt, und welche andere Variable auf dasselbe Objekt zeigt.",
      explanation: "Genau! `mein_auto` und `self` zeigen auf dasselbe Heap-Objekt. `mein_auto.fahren()` wird intern übersetzt in `Auto.fahren(self=mein_auto)`."
    },
    {
      id: 13, topic: 2, type: "cloze",
      title: "Die interne Übersetzung von Methodenaufrufen",
      prompt: "Vervollständige die interne Äquivalenz: Der Aufruf `hund.bellen()` entspricht genau:",
      codeTemplate: "Hund.bellen({{gap1}})",
      gaps: { gap1: "hund" },
      hint: "Welches Objekt wird als self hineingereicht?",
      explanation: "`hund.bellen()` ist nur eleganter 'syntaktischer Zucker' für `Hund.bellen(hund)`. Das Objekt wird als 1. Parameter übergeben!"
    },
    {
      id: 14, topic: 2, type: "bughunt",
      title: "Bug-Hunter: Fehlendes self im Methodenkopf",
      prompt: "Finde die Zeile, die beim Aufruf von `b.tanken()` zu einem 'takes 0 positional arguments but 1 was given' TypeError führt:",
      codeLines: [
        "class Boot:",
        "    def __init__(self):",
        "        self.liter = 10",
        "    def tanken():",
        "        print('Vollgetankt')"
      ],
      bugIndices: [3],
      hint: "Instanzmethoden empfangen das aufrufende Objekt immer als ersten Parameter.",
      explanation: "Zeile 4: `def tanken():` muss `def tanken(self):` heißen. Da Python beim Aufruf `b.tanken()` das Objekt `b` übergibt, stürzt der Aufruf ab, wenn kein Parameter deklariert ist!"
    },
    {
      id: 15, topic: 2, type: "tf",
      title: "Methodenaufruf auf der Klasse selbst",
      prompt: "Der Aufruf `Auto.fahren(auto1)` ist in Python vollkommen legal und führt denselben Code aus wie `auto1.fahren()`.",
      answer: true,
      hint: "Erinnere dich an die Funktionsweise von self.",
      explanation: "Richtig! Beide Aufrufarten sind semantisch exakt identisch. Die Kurzform `auto1.fahren()` ist der OOP-Standard."
    },
    {
      id: 16, topic: 2, type: "write",
      title: "Code-Writing: Erste saubere Instanzmethode",
      prompt: "Definiere in der Klasse `Konto` eine Methode `anzeigen(self) -> str`. Sie soll den Text `'Konto aktiv'` per `return` zurückgeben.",
      starterCode: "class Konto:\n    # Implementiere anzeigen hier:\n",
      expectedKeywords: ["def anzeigen", "self", "return \"Konto aktiv\""],
      solutionCode: "class Konto:\n    def anzeigen(self) -> str:\n        return \"Konto aktiv\"",
      hint: "Achte auf `def anzeigen(self) -> str:` und `return 'Konto aktiv'`.",
      explanation: "Instanzmethoden erhalten immer `self` als 1. Argument und reichen ihr Ergebnis mit `return` nach draußen."
    },
    {
      id: 17, topic: 2, type: "tf",
      title: "Funktion vs. Methode",
      prompt: "Eine Methode ist nichts anderes als eine Funktion, die innerhalb des Rumpfes einer Klasse definiert ist und an Instanzen gebunden wird.",
      answer: true,
      hint: "Methode = Funktion im Kontext eines Objekts.",
      explanation: "Richtig! Außerhalb einer Klasse spricht man von Funktionen; innerhalb einer Klasse heißen sie Methoden (oder Operationen in der UML)."
    },
    {
      id: 18, topic: 2, type: "cloze",
      title: "Zugriff auf eigene Attribute in Methoden",
      prompt: "Wie greift eine Methode auf das Attribut `tempo` des aufrufenden Objekts zu?",
      codeTemplate: "def bremsen(self):\n    {{gap1}}.tempo = 0",
      gaps: { gap1: "self" },
      hint: "Über welche Referenz steuert die Methode das eigene Objekt?",
      explanation: "Innerhalb von Methoden greift man immer über `self.attribut` auf die Instanzdaten zu."
    },
    {
      id: 19, topic: 2, type: "bughunt",
      title: "Bug-Hunter: Ungebundene Variable in Methode",
      prompt: "Finde den Fehler, bei dem versucht wird, auf ein Attribut ohne `self.` zuzugreifen:",
      codeLines: [
        "class Spieler:",
        "    def __init__(self, punkte):",
        "        self.punkte = punkte",
        "    def print_punkte(self):",
        "        print(punkte)"
      ],
      bugIndices: [4],
      hint: "In Zeile 5 sucht Python nach einer lokalen Variable punkte, die in der Methode nicht existiert.",
      explanation: "Zeile 5: Ohne `self.` ist `punkte` nicht definiert (NameError). Es muss zwingend `print(self.punkte)` heißen."
    },
    {
      id: 20, topic: 2, type: "tf",
      title: "self bei Methodenverkettung",
      prompt: "Wenn eine Methode `return self` ausführt, kann der Aufrufer direkt weitere Methoden aneinanderhängen (Method Chaining, z. B. `auto.tanken().fahren()`).",
      answer: true,
      hint: "Wenn das Objekt zurückgegeben wird, kann darauf sofort die nächste Methode aufgerufen werden.",
      explanation: "Richtig! `return self` gibt die Instanz selbst zurück und erlaubt flüssige Verkettungen wie `obj.set_a(1).set_b(2)`."
    },

    // =========================================================================
    // LEVEL 3: KONSTRUKTOR & ATTRIBUTE (ID 21 - 32)
    // =========================================================================
    {
      id: 21, topic: 3, type: "tf",
      title: "Konstruktor-Aufgabe",
      prompt: "Die Methode `__init__` ist dafür zuständig, das Objekt im Speicher neu zu allozieren, nicht dafür, seine Attribute zu initialisieren.",
      answer: false,
      hint: "Überlege: Was macht __new__ und was macht __init__?",
      explanation: "Falsch! Die Allokation im Speicher erledigt `__new__`. `__init__` ist der Initialisierer – er belegt die Attribute des bereits erzeugten Objekts mit ihren Startwerten."
    },
    {
      id: 22, topic: 3, type: "cloze",
      title: "Feste Startwerte im Konstruktor",
      prompt: "Ein `Kunde` soll beim Erstellen immer den festen Status `aktiv = True` erhalten, ohne dass dieser Wert übergeben werden muss. Ergänze die Zeile:",
      codeTemplate: "class Kunde:\n    def __init__(self, name: str):\n        self.name = name\n        self.{{gap1}} = True",
      gaps: { gap1: "aktiv" },
      hint: "Der Attributname lautet aktiv.",
      explanation: "Feste Startzustände deklariert man direkt im Konstruktor an `self`, ohne sie als Parameter in die Klammer zu schreiben."
    },
    {
      id: 23, topic: 3, type: "bughunt",
      title: "Bug-Hunter: Lokale Variable statt Attribut",
      prompt: "Finde die 2 Fehler im folgenden Konstruktor (Zuweisung & Aufruf):",
      codeLines: [
        "class Artikel:",
        "    def __init__(self, preis):",
        "        preis = preis",
        "a = Artikel",
        "print(a.preis)"
      ],
      bugIndices: [2, 3],
      hint: "Zeile 3 vergisst self; Zeile 4 instanziiert nicht (Klammern fehlen).",
      explanation: "Zeile 3: Muss `self.preis = preis` heißen, sonst stirbt der Wert mit Funktionsende.\nZeile 4: Zur Objekterzeugung müssen Klammern und Argumente übergeben werden: `a = Artikel(19.99)`."
    },
    {
      id: 24, topic: 3, type: "write",
      title: "Code-Writing: Vollständiger Konstruktor",
      prompt: "Schreibe die Klasse `Produkt` mit einem Konstruktor, der `bezeichnung` (str) und `menge` (int, Standardwert 1) an `self` bindet.",
      starterCode: "# Schreibe hier die Klasse Produkt:\n",
      expectedKeywords: ["class Produkt", "def __init__", "self", "bezeichnung", "menge = 1"],
      solutionCode: "class Produkt:\n    def __init__(self, bezeichnung: str, menge: int = 1):\n        self.bezeichnung = bezeichnung\n        self.menge = menge",
      hint: "Achte auf `def __init__(self, bezeichnung: str, menge: int = 1):`.",
      explanation: "Standardwerte in Parametern ermöglichen flexible Aufrufe: `Produkt('Stift')` oder `Produkt('Heft', 5)`."
    },
    {
      id: 25, topic: 3, type: "tf",
      title: "Rückgabewert von __init__",
      prompt: "Die Methode `__init__` darf explizit `return self` zurückgeben, um Methodenketten zu ermöglichen.",
      answer: false,
      hint: "Achtung Klausurfalle! Was darf der Konstruktor zurückgeben?",
      explanation: "Falsch! `__init__` darf NIEMALS etwas anderes als `None` zurückgeben! Ein expliziter Return-Wert führt zu einem schweren `TypeError: __init__() should return None`."
    },
    {
      id: 26, topic: 3, type: "cloze",
      title: "Standardwert im Konstruktor",
      prompt: "Ergänze den Standardwert für `rabatt` mit 0.0 Prozent:",
      codeTemplate: "def __init__(self, preis: float, rabatt: float = {{gap1}}):\n    self.preis = preis\n    self.rabatt = rabatt",
      gaps: { gap1: "0.0" },
      hint: "Standardmäßig null Nachlass.",
      explanation: "Standardparameter werden mit `= wert` im Funktionskopf deklariert."
    },
    {
      id: 27, topic: 3, type: "tf",
      title: "Unabhängigkeit zweier Instanzen",
      prompt: "Werden mit `k1 = Konto('A')` und `k2 = Konto('B')` zwei Objekte erzeugt, besitzen beide ihre eigenen, völlig unabhängigen Kopien der Instanzattribute im RAM.",
      answer: true,
      hint: "Instanzdaten gehören exakt einem Objekt.",
      explanation: "Richtig! Instanzattribute sind strikt an ihre jeweilige Instanz im Heap gebunden."
    },
    {
      id: 28, topic: 3, type: "bughunt",
      title: "Bug-Hunter: Methodenaufruf vor Attributerstellung",
      prompt: "Finde die Zeile im Konstruktor, die fehlschlägt, weil auf ein Attribut zugegriffen wird, bevor es erzeugt wurde:",
      codeLines: [
        "class Rechner:",
        "    def __init__(self, x, y):",
        "        self.summe = self.x + self.y",
        "        self.x = x",
        "        self.y = y"
      ],
      bugIndices: [2],
      hint: "In Zeile 3 existieren self.x und self.y noch gar nicht an dem Objekt!",
      explanation: "Zeile 3: `self.summe = self.x + self.y` wirft einen AttributeError, weil `self.x` und `self.y` erst in Zeile 4 und 5 zugewiesen werden. Die Reihenfolge im Konstruktor ist strikt sequenziell!"
    },
    {
      id: 29, topic: 3, type: "write",
      title: "Code-Writing: Startzustand Liste",
      prompt: "Erstelle die Klasse `Warenkorb`. Der Konstruktor nimmt keine Argumente (außer `self`) entgegen und initialisiert `self.artikel = []` als leere Liste.",
      starterCode: "class Warenkorb:\n    # Initialisiere hier die leere Artikelliste:\n",
      expectedKeywords: ["def __init__(self)", "self.artikel = []"],
      solutionCode: "class Warenkorb:\n    def __init__(self):\n        self.artikel = []",
      hint: "Achte auf `self.artikel = []` oder `self.artikel = list()`.",
      explanation: "Jedes Warenkorb-Objekt erhält dadurch seine eigene leere Liste im RAM."
    },
    {
      id: 30, topic: 3, type: "tf",
      title: "Gefahr mutable Standardparameter",
      prompt: "Schreibt man `def __init__(self, artikel=[]): self.artikel = artikel`, teilen sich alle ohne Argument erstellten Warenkörbe dieselbe Liste im RAM!",
      answer: true,
      hint: "Standardparameter werden in Python zur Definitionszeit nur genau 1x erzeugt.",
      explanation: "Richtig! Dies ist eine berüchtigte Python-Falle: Mutable Default Arguments wie `[]` werden nur 1x im Speicher angelegt und von allen Instanzen ungewollt geteilt!"
    },

    // =========================================================================
    // LEVEL 4: KLASSEN- VS. INSTANZDATEN (ID 31 - 40)
    // =========================================================================
    {
      id: 31, topic: 4, type: "tf",
      title: "Klassenattribut Definition",
      prompt: "Ein Attribut, das direkt im Klassenrumpf außerhalb aller Methoden definiert wird, existiert für jedes Objekt separat als eigene Kopie.",
      answer: false,
      hint: "Überlege: Was ist ein Klassenattribut (static) im Unterschied zum Instanzattribut?",
      explanation: "Falsch! Das ist ein Klassenattribut. Es existiert genau einmal für die gesamte Klasse und wird von allen Instanzen gemeinsam genutzt."
    },
    {
      id: 32, topic: 4, type: "diagram_click",
      title: "UML: Statisches Klassenattribut erkennen",
      prompt: "Im abgebildeten UML-Klassendiagramm ist ein Element statisch (Klassenmerkmal). Klicke auf das statische Merkmal:",
      diagramType: "class_diagram",
      diagramConfig: {
        className: "Fahrzeug",
        attributes: [
          { text: "- fin : str", id: "attr_fin", isStatic: false },
          { text: "+ anzahl_raeder : int = 4", id: "attr_raeder", isStatic: true },
          { text: "- km_stand : float", id: "attr_km", isStatic: false }
        ],
        methods: [
          { text: "+ fahren(km: float) : void", id: "meth_drive", isStatic: false }
        ]
      },
      targetHotspotId: "attr_raeder",
      hint: "Statischer Code (Klassenattribute / Klassenmethoden) wird in der UML durch ein bestimmtes typografisches Merkmal gekennzeichnet.",
      explanation: "Perfekt! Statische Merkmale (Klassenattribute und Klassenmethoden) werden in UML-Klassendiagrammen immer UNTERSTRICHEN dargestellt!"
    },
    {
      id: 33, topic: 4, type: "cloze",
      title: "Klassenattribut Aufruf",
      prompt: "Über welches Element ruft man ein Klassenattribut sauber und direkt auf, ohne vorher ein Objekt instanziieren zu müssen?",
      codeTemplate: "class Datenbank:\n    TIMEOUT = 30\n\nzeit = {{gap1}}.TIMEOUT",
      gaps: { gap1: "Datenbank" },
      hint: "Der Name der Klasse.",
      explanation: "Klassenattribute können direkt über den Klassennamen (`Klasse.ATTRIBUT`) aufgerufen werden."
    },
    {
      id: 34, topic: 4, type: "bughunt",
      title: "Bug-Hunter: Instanzvariable überschreibt Klassenvariable",
      prompt: "In welcher Zeile wird unabsichtlich ein lokales Instanzattribut angeheftet, anstatt die gemeinsame Klassenvariable zu verändern?",
      codeLines: [
        "class Zaehler:",
        "    gesamt = 0",
        "z1 = Zaehler()",
        "z1.gesamt += 1",
        "print(Zaehler.gesamt)"
      ],
      bugIndices: [3],
      hint: "z1.gesamt += 1 weist z1 ein eigenes Attribut zu, lässt aber Zaehler.gesamt unberührt bei 0!",
      explanation: "Zeile 4: Durch `z1.gesamt += 1` erzeugt Python ein neues Instanzattribut auf `z1`. Das Klassenattribut `Zaehler.gesamt` bleibt unverändert bei 0! Richtig wäre: `Zaehler.gesamt += 1`."
    },
    {
      id: 35, topic: 4, type: "write",
      title: "Code-Writing: Instanzzähler als Klassenattribut",
      prompt: "Schreibe eine Klasse `Kunde`. Sie soll ein Klassenattribut `anzahl = 0` besitzen. Im Konstruktor soll `Kunde.anzahl` bei jedem Erstellen eines neuen Kunden um 1 erhöht werden.",
      starterCode: "class Kunde:\n    # Klassenattribut und Konstruktor hier definieren:\n",
      expectedKeywords: ["anzahl = 0", "def __init__(self)", "Kunde.anzahl += 1"],
      solutionCode: "class Kunde:\n    anzahl = 0\n    def __init__(self):\n        Kunde.anzahl += 1",
      hint: "Definiere `anzahl = 0` direkt unter dem Klassennamen und erhöhe im `__init__` mit `Kunde.anzahl += 1`.",
      explanation: "Da das Klassenattribut von allen Objekten geteilt wird, zählt `Kunde.anzahl` automatisch alle erzeugten Kunden mit."
    },

    // =========================================================================
    // LEVEL 5: KAPSELUNG & GETTER/SETTER (ID 41 - 52)
    // =========================================================================
    {
      id: 41, topic: 5, type: "tf",
      title: "Zweck der Kapselung",
      prompt: "Kapselung bedeutet, dass Attribute privatisiert werden, um sie vor unkontrollierten Außenänderungen (z. B. negatives Alter, falsche PIN) zu schützen.",
      answer: true,
      hint: "Kapselung = Geheimnisprinzip (Information Hiding).",
      explanation: "Richtig! Kapselung schützt die innere Datenintegrität des Objekts."
    },
    {
      id: 42, topic: 5, type: "diagram_click",
      title: "UML: Privates Attribut identifizieren",
      prompt: "Klicke im UML-Diagramm auf das Attribut, das mit privater Sichtbarkeit geschützt ist:",
      diagramType: "class_diagram",
      diagramConfig: {
        className: "Bankkonto",
        attributes: [
          { text: "+ kontonummer : str", id: "attr_nr" },
          { text: "- pin : int", id: "attr_pin" },
          { text: "# saldo : float", id: "attr_saldo" }
        ],
        methods: [
          { text: "+ abheben(betrag: float) : bool", id: "meth_withdraw" }
        ]
      },
      targetHotspotId: "attr_pin",
      hint: "'+' steht für public, '-' für private, '#' für protected.",
      explanation: "Perfekt! Das Minuszeichen '-' steht in der UML für private Sichtbarkeit. In Python wird dies mit zwei führenden Unterstrichen (`self.__pin`) umgesetzt."
    },
    {
      id: 43, topic: 5, type: "cloze",
      title: "Name Mangling in Python",
      prompt: "Wenn ein Attribut `self.__passwort` in der Klasse `User` heißt, benennt Python es intern um in: `_User{{gap1}}`",
      codeTemplate: "_User{{gap1}}",
      gaps: { gap1: "__passwort" },
      hint: "Der Attributname mit den zwei Unterstrichen.",
      explanation: "Python wendet 'Name Mangling' an und benennt private Attribute intern in `_Klassenname__attribut` um, um versehentliches Überschreiben zu verhindern."
    },
    {
      id: 44, topic: 5, type: "write",
      title: "Code-Writing: Setter mit Validierung",
      prompt: "Implementiere den Setter `set_gehalt(self, wert: float) -> None`. Er darf das private Attribut `self.__gehalt` nur aktualisieren, wenn `wert > 0` ist.",
      starterCode: "class Angestellter:\n    def __init__(self):\n        self.__gehalt = 2000.0\n\n    # Implementiere set_gehalt hier:\n",
      expectedKeywords: ["def set_gehalt", "self", "wert", "if wert > 0", "self.__gehalt = wert"],
      solutionCode: "class Angestellter:\n    def __init__(self):\n        self.__gehalt = 2000.0\n\n    def set_gehalt(self, wert: float) -> None:\n        if wert > 0:\n            self.__gehalt = wert",
      hint: "Prüfe mit `if wert > 0:` bevor du `self.__gehalt = wert` zuweist.",
      explanation: "Der Setter fungiert als 'Türsteher' und verhindert ungültige Daten (wie Gehälter unter 0)."
    },
    {
      id: 45, topic: 5, type: "bughunt",
      title: "Bug-Hunter: Getter mit print statt return",
      prompt: "Finde die 2 Fehler in dieser Kapselung:",
      codeLines: [
        "class Tresor:",
        "    def __init__(self, code):",
        "        self.__code = code",
        "    def get_code(self):",
        "        print(self.__code)",
        "    def set_code(self, c):",
        "        self.__code == c"
      ],
      bugIndices: [4, 6],
      hint: "Zeile 5 druckt nur auf die Konsole; Zeile 7 nutzt Vergleichsoperator == statt Zuweisung =.",
      explanation: "Zeile 5: Ein Getter muss `return self.__code` verwenden.\nZeile 7: Eine Zuweisung erfordert ein einfaches Gleichheitszeichen (`=`), kein `==`."
    },
    {
      id: 46, topic: 5, type: "cloze",
      title: "Protected Konvention in Python",
      prompt: "Wie viele führende Unterstriche signalisieren Entwicklern nach Konvention die Sichtbarkeit protected (geschützt für Subklassen)?",
      codeTemplate: "self.{{gap1}}wert = 10",
      gaps: { gap1: "_" },
      hint: "Genau ein einzelner Unterstrich.",
      explanation: "Ein einzelner Unterstrich `_attribut` bedeutet 'protected' (Konvention). Zwei Unterstriche `__attribut` bedeuten 'private' (Name Mangling)."
    },

    // =========================================================================
    // LEVEL 6: RÜCKGABEN & TYPE HINTS (ID 53 - 62)
    // =========================================================================
    {
      id: 53, topic: 6, type: "tf",
      title: "return vs. print",
      prompt: "Wenn eine Funktion `print(Ergebnis)` ausführt, aber kein `return` enthält, ist ihr tatsächlicher Rückgabewert `None`.",
      answer: true,
      hint: "Was liefert eine Funktion ohne return?",
      explanation: "Richtig! `print` schreibt nur Text in das Terminal. Der Aufrufer erhält `None` zurück."
    },
    {
      id: 54, topic: 6, type: "cloze",
      title: "Type Hint für void",
      prompt: "Wie lautet der offizielle Python Type Hint für eine Methode, die keinen Rückgabewert liefert (UML void)?",
      codeTemplate: "def starte_motor(self) -> {{gap1}}:\n    pass",
      gaps: { gap1: "None" },
      hint: "Pythons Begriff für 'Nichts'.",
      explanation: "`-> None` ist das Python-Äquivalent zum UML-Typ `void`."
    },
    {
      id: 55, topic: 6, type: "write",
      title: "Code-Writing: Berechnung mit sauberem Return",
      prompt: "Schreibe die Methode `gesamtbetrag(self) -> float`. Sie soll das Produkt aus `self.menge * self.stueckpreis` berechnen und per `return` zurückgeben.",
      starterCode: "class Posten:\n    def __init__(self, menge: int, stueckpreis: float):\n        self.menge = menge\n        self.stueckpreis = stueckpreis\n\n    # Implementiere gesamtbetrag hier:\n",
      expectedKeywords: ["def gesamtbetrag(self) -> float:", "return self.menge * self.stueckpreis"],
      solutionCode: "class Posten:\n    def __init__(self, menge: int, stueckpreis: float):\n        self.menge = menge\n        self.stueckpreis = stueckpreis\n\n    def gesamtbetrag(self) -> float:\n        return self.menge * self.stueckpreis",
      hint: "Multipliziere `self.menge * self.stueckpreis` und gib das Ergebnis mit `return` zurück.",
      explanation: "Saubere Methoden verwenden `return`, damit der berechnete Wert im Gesamtsystem weiterverarbeitet werden kann."
    },
    {
      id: 56, topic: 6, type: "bughunt",
      title: "Bug-Hunter: Toter Code nach Return",
      prompt: "Welche Zeile in dieser Methode wird niemals ausgeführt, weil sie nach einem Return steht? Klicke auf die Zeile:",
      codeLines: [
        "def berechne_rabatt(preis):",
        "    if preis > 100:",
        "        return preis * 0.9",
        "        print('Rabatt gewährt!')",
        "    return preis"
      ],
      bugIndices: [3],
      hint: "Ein 'return' beendet die Funktion sofort.",
      explanation: "Zeile 4: Nach Ausführung von `return` verlässt Python die Funktion augenblicklich. Der `print`-Befehl dahinter ist unerreichbar (Dead Code)."
    },

    // =========================================================================
    // LEVEL 7: VERERBUNG & SUPER() (ID 63 - 72)
    // =========================================================================
    {
      id: 63, topic: 7, type: "tf",
      title: "Vererbungssyntax in Python",
      prompt: "In Python notiert man die Elternklasse in runden Klammern direkt hinter dem Klassennamen der Subklasse: `class Subklasse(Elternklasse):`.",
      answer: true,
      hint: "In Java schreibt man extends, in Python runde Klammern.",
      explanation: "Richtig! `class Kind(Eltern):` erbt alle Eigenschaften und Methoden der Elternklasse."
    },
    {
      id: 64, topic: 7, type: "cloze",
      title: "super() Aufruf",
      prompt: "Mit welchem Funktionsaufruf ruft eine Subklasse den Konstruktor ihrer Elternklasse auf?",
      codeTemplate: "class Manager(Mitarbeiter):\n    def __init__(self, name: str, bonus: float):\n        {{gap1}}().__init__(name)\n        self.bonus = bonus",
      gaps: { gap1: "super" },
      hint: "Englisch für übergeordnet.",
      explanation: "`super().__init__(name)` delegiert die Initialisierung an die Elternklasse."
    },
    {
      id: 65, topic: 7, type: "bughunt",
      title: "Bug-Hunter: Falsches self in super()",
      prompt: "Finde die 2 Fehler im folgenden Vererbungsbeispiel:",
      codeLines: [
        "class Tier:",
        "    def __init__(self, name):",
        "        self.name = name",
        "class Hund(Tier):",
        "    def __init__(self, name, rasse):",
        "        super().__init__(self, name)",
        "        self.rasse = rasse"
      ],
      bugIndices: [5],
      hint: "Beim Aufruf von super().__init__() darf self NICHT nochmals als Argument übergeben werden!",
      explanation: "Zeile 6: `super()` bindet `self` bereits automatisch. Der Aufruf muss `super().__init__(name)` lauten – die explizite Übergabe von `self` führt zu einem TypeError!"
    },
    {
      id: 66, topic: 7, type: "write",
      title: "Code-Writing: Vollständige Subklasse",
      prompt: "Gegeben ist `class Geraet:\n    def __init__(self, marke: str):\n        self.marke = marke`. Erstelle die Subklasse `Laptop`, die von `Geraet` erbt, im Konstruktor `marke` (str) und `ram` (int) empfängt, den Elternkonstruktor mit `super().__init__(marke)` aufruft und `self.ram = ram` speichert.",
      starterCode: "class Geraet:\n    def __init__(self, marke: str):\n        self.marke = marke\n\n# Schreibe hier die Klasse Laptop:\n",
      expectedKeywords: ["class Laptop(Geraet):", "def __init__", "super().__init__(marke)", "self.ram = ram"],
      solutionCode: "class Laptop(Geraet):\n    def __init__(self, marke: str, ram: int):\n        super().__init__(marke)\n        self.ram = ram",
      hint: "Vererbung: `class Laptop(Geraet):`. Basis-Initialisierung: `super().__init__(marke)`.",
      explanation: "Subklassen spezialisieren das Verhalten und rufen gemeinsame Basislogik per `super()` auf."
    },

    // =========================================================================
    // LEVEL 8: POLYMORPHIE & OVERRIDING (ID 73 - 82)
    // =========================================================================
    {
      id: 73, topic: 8, type: "tf",
      title: "Methoden überschreiben (Overriding)",
      prompt: "Wenn eine Subklasse eine geerbte Methode mit exakt demselben Namen neu definiert, wird bei Aufrufen auf Subklassen-Objekten automatisch die neue, spezialisierte Version ausgeführt.",
      answer: true,
      hint: "Das ist die Essenz von Polymorphie und dynamischem Binden.",
      explanation: "Richtig! Beim Überschreiben verdeckt die Subklasse das alte Verhalten der Elternklasse."
    },
    {
      id: 74, topic: 8, type: "cloze",
      title: "Typprüfung mit isinstance",
      prompt: "Welche eingebaute Funktion prüft, ob ein Objekt eine Instanz einer bestimmten Klasse oder deren Subklassen ist?",
      codeTemplate: "ist_hund = {{gap1}}(mein_tier, Hund)",
      gaps: { gap1: "isinstance" },
      hint: "Zusammengesetzt aus 'is' und 'instance'.",
      explanation: "`isinstance(obj, Klasse)` berücksichtigt die gesamte Vererbungshierarchie."
    },
    {
      id: 75, topic: 8, type: "write",
      title: "Code-Writing: Polymorphe Methode",
      prompt: "Gegeben ist `class Figur:\n    def zeichnen(self) -> str:\n        return 'Figur'`. Erstelle die Subklasse `Kreis(Figur)`, die `zeichnen(self)` überschreibt und `'Kreis'` zurückgibt.",
      starterCode: "class Figur:\n    def zeichnen(self) -> str:\n        return 'Figur'\n\n# Schreibe hier Kreis:\n",
      expectedKeywords: ["class Kreis(Figur):", "def zeichnen(self)", "return \"Kreis\""],
      solutionCode: "class Kreis(Figur):\n    def zeichnen(self) -> str:\n        return \"Kreis\"",
      hint: "Erbe mit `class Kreis(Figur):` und implementiere `def zeichnen(self) -> str:`.",
      explanation: "Verschiedene Subklassen reagieren auf denselben Aufruf `obj.zeichnen()` mit ihrem eigenen spezifischen Verhalten."
    },

    // =========================================================================
    // LEVEL 9: UML-KLASSENDIAGRAMME (ID 83 - 92)
    // =========================================================================
    {
      id: 83, topic: 9, type: "diagram_click",
      title: "UML: Abgeleitetes Attribut (/) erkennen",
      prompt: "Ein Attribut wird zur Laufzeit dynamisch berechnet und nicht in der Datenbank gespeichert. Klicke im Klassendiagramm auf dieses abgeleitete Attribut:",
      diagramType: "class_diagram",
      diagramConfig: {
        className: "Person",
        attributes: [
          { text: "- geburtsdatum : Date", id: "attr_birth" },
          { text: "+ /alter : int", id: "attr_derived_age" },
          { text: "- name : str", id: "attr_name" }
        ],
        methods: [
          { text: "+ get_name() : str", id: "meth_get_name" }
        ]
      },
      targetHotspotId: "attr_derived_age",
      hint: "Abgeleitete Attribute werden in der UML durch ein vorangestelltes Satzzeichen markiert.",
      explanation: "Hervorragend! Der Schrägstrich `/` kennzeichnet ein abgeleitetes Attribut (derived attribute). Es wird zur Laufzeit berechnet (z. B. aus dem Geburtsdatum) und nicht dauerhaft gespeichert."
    },
    {
      id: 84, topic: 9, type: "cloze",
      title: "UML Sichtbarkeits-Symbole",
      prompt: "Ordne die UML-Symbole für Sichtbarkeiten zu: `+` = public, `-` = private, `{{gap1}}` = protected.",
      codeTemplate: "Protected = {{gap1}}",
      gaps: { gap1: "#" },
      hint: "Die Raute / das Doppelkreuz.",
      explanation: "`#` steht in der UML für protected, `+` für public, `-` für private."
    },
    {
      id: 85, topic: 9, type: "tf",
      title: "Objektdiagramm vs. Klassendiagramm",
      prompt: "Im UML-Objektdiagramm werden genau wie im Klassendiagramm alle Methoden der Klasse mit Rückgabewerten abgebildet.",
      answer: false,
      hint: "Achtung Klausurfalle! Enthalten Objektdiagramme Methoden?",
      explanation: "Falsch! In UML-Objektdiagrammen werden grundsätzlich KEINE Methoden dargestellt! Sie zeigen ausschließlich konkrete Attributwerte zur Laufzeit."
    },

    // =========================================================================
    // LEVEL 10: UML-BEZIEHUNGEN (ID 93 - 102)
    // =========================================================================
    {
      id: 93, topic: 10, type: "diagram_click",
      title: "Komposition (◆) erkennen",
      prompt: "Ein Gebäude besteht aus Räumen. Wird das Gebäude abgerissen, hören die Räume auf zu existieren (strenge Existenzabhängigkeit). Welche Rautenform gehört an die Seite des Gebäudes?",
      diagramType: "relationship",
      diagramConfig: {
        classA: "Gebäude (Ganzes)",
        subtextA: "Besitzer",
        classB: "Raum (Teil)",
        subtextB: "stirbt mit Gebäude",
        currentSymbol: "composition"
      },
      targetHotspotId: "relation-link",
      hint: "Ausgefüllte Raute = Komposition (strenge Bindung), leere Raute = Aggregation (lose Bindung).",
      explanation: "Perfekt! Die schwarze, ausgefüllte Raute ◆ steht für eine Komposition. Die Teile sind existenziell an das Ganze gebunden und sterben mit ihm."
    },
    {
      id: 94, topic: 10, type: "tf",
      title: "Wo steht die Raute in der UML?",
      prompt: "Bei Aggregation und Komposition steht die Raute immer auf der Seite des GANZEN (des Besitzers), niemals auf der Seite des Einzelteils.",
      answer: true,
      hint: "Klausurfalle: Raute beim Ganzen oder beim Teil?",
      explanation: "Richtig! Die Raute steht ausnahmslos IMMER beim Ganzen (dem Aggregat / Container)!"
    },
    {
      id: 95, topic: 10, type: "cloze",
      title: "Aggregation Begriff",
      prompt: "Wie nennt man die lose Teil-Ganzes-Beziehung (weiße Raute ◇), bei der die Teile unabhängig vom Ganzen weiter existieren können?",
      codeTemplate: "Lose Beziehung = {{gap1}}",
      gaps: { gap1: "Aggregation" },
      hint: "Gegenstück zur Komposition.",
      explanation: "Bei einer Aggregation (z. B. Verein ◇── Mitglied) existiert das Mitglied weiter, selbst wenn der Verein aufgelöst wird."
    },
    {
      id: 96, topic: 10, type: "tf",
      title: "Richtung des Vererbungspfeils",
      prompt: "Im UML-Klassendiagramm zeigt die geschlossene, leere Pfeilspitze der Generalisierung von der Subklasse nach oben zur Superklasse.",
      answer: true,
      hint: "Zeigt der Pfeil zum Kind oder zur Elternklasse?",
      explanation: "Richtig! Der Vererbungspfeil zeigt immer nach oben zur allgemeinen Superklasse!"
    },

    // =========================================================================
    // LEVEL 11: UML USE-CASE DIAGRAMME (ID 103 - 110)
    // =========================================================================
    {
      id: 103, topic: 11, type: "diagram_click",
      title: "Use-Case: Akteur-Position",
      prompt: "Im Anwendungsfalldiagramm interagieren Akteure mit dem System. Klicke auf den Akteur in der Grafik:",
      diagramType: "use_case",
      diagramConfig: {
        actorName: "Kunde",
        stereotype: "<<include>>"
      },
      targetHotspotId: "actor-human",
      hint: "Akteure werden als Strichmännchen gezeichnet und stehen IMMER außerhalb der Systemgrenze.",
      explanation: "Genau! Akteure stehen grundsätzlich AUSSERHALB der Systemgrenze, weil sie die externe Umwelt repräsentieren."
    },
    {
      id: 104, topic: 11, type: "cloze",
      title: "Include vs. Extend",
      prompt: "Welche Beziehung kennzeichnet einen obligatorischen Pflichtschritt, der bei jeder Ausführung des Basisfalls zwingend ausgeführt wird?",
      codeTemplate: "Pflichtschritt = <<{{gap1}}>>",
      gaps: { gap1: "include" },
      hint: "Englisch für 'einbinden'.",
      explanation: "`<<include>>` modelliert zwingend erforderliche Teilschritte (z. B. 'Überweisen' includes 'Authentifizieren')."
    },
    {
      id: 105, topic: 11, type: "tf",
      title: "Pfeilrichtung bei <<extend>>",
      prompt: "Bei einer `<<extend>>`-Beziehung zeigt die gestrichelte Pfeilspitze vom optionalen Erweiterungsfall ZURÜCK zum erweiterten Basisfall.",
      answer: true,
      hint: "Der Sonderfall klinkt sich rückwirkend am Extension Point ein.",
      explanation: "Richtig! Der Pfeil bei `<<extend>>` zeigt immer vom optionalen Sonderfall ZUM Basisfall!"
    },

    // =========================================================================
    // LEVEL 12: KLAUSUR-SYNTHESE & BOSS (ID 111 - 120)
    // =========================================================================
    {
      id: 111, topic: 12, type: "write",
      title: "Klausur-Endgegner: UML 1:1 in Python implementieren",
      prompt: "Gegeben ist die UML-Klasse:\n--------------------------\nKonto\n--------------------------\n- kontostand : float = 0.0\n+ inhaber : str\n--------------------------\n+ einzahlen(betrag: float) : void\n+ get_kontostand() : float\n--------------------------\nImplementiere diese Klasse 1:1 in Python. `einzahlen` soll `betrag` auf `self.__kontostand` addieren, wenn `betrag > 0`.",
      starterCode: "# Implementiere die Klasse Konto gemäß UML-Vorgabe:\n",
      expectedKeywords: ["class Konto", "def __init__", "self.__kontostand = 0.0", "self.inhaber", "def einzahlen", "def get_kontostand", "return self.__kontostand"],
      solutionCode: "class Konto:\n    def __init__(self, inhaber: str, start_stand: float = 0.0):\n        self.__kontostand = start_stand  # - privat (__)\n        self.inhaber = inhaber           # + public\n\n    def einzahlen(self, betrag: float) -> None:\n        if betrag > 0:\n            self.__kontostand += betrag\n\n    def get_kontostand(self) -> float:\n        return self.__kontostand",
      hint: "'-' bedeutet zwei Unterstriche (`self.__kontostand`), `+` bedeutet öffentlich (`self.inhaber`).",
      explanation: "Perfekte Klausurlösung: Private Felder geschützt, Methoden mit korrekten Type Hints und kontrollierter Zustandspflege."
    },
    {
      id: 112, topic: 12, type: "bughunt",
      title: "Boss-Bug: Gesamtsystem Vererbung & Kapselung",
      prompt: "Finde die 2 Zeilen, die zu fatalen Fehlern in dieser Hierarchie führen:",
      codeLines: [
        "class Basis:",
        "    def __init__(self):",
        "        self.__geheim = 42",
        "class Kind(Basis):",
        "    def zeige(self):",
        "        return self.__geheim",
        "k = Kind()",
        "print(k.zeige())"
      ],
      bugIndices: [5],
      hint: "Subklassen haben keinen direkten Zugriff auf mit __ geschützte private Attribute der Elternklasse!",
      explanation: "Zeile 6: `return self.__geheim` wirft einen AttributeError! Durch Name Mangling heißt das Attribut der Basisklasse `_Basis__geheim`. Die Subklasse kann nur über einen geerbten Getter darauf zugreifen!"
    }
  ];

  window.TASK_DATABASE = {
    TOPICS,
    TASKS
  };
})();
