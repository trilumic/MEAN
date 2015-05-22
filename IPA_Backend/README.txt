IPA_Backend
Zweck:
Backend-Teil der Applikation. Beinhaltet Datenbankanbindung, Verwaltung der Datenbankschemas für User und Projekte (erweiterbar) und die Verwaltung von Auth-Tokens.

Verwendung:
Zum Starten der Applikation müssen folgende Komponenten gestartet werden:
    1. MongoDB starten. Dazu muss die MongoDB installiert sein und eine Datenbank muss erstellt sein (Name ccyp, app.js Zeile 28)

    Beispiel für Startkommandos:
    cd "c:\Program Files\MongoDB 2.6 Standard\bin" //Wechsel ins Mongo-Verzeichnis
    mongod --dbpath c:\Users\michelt\mongo-data --logpath c:\dev\mongoLog\ccyp.log //Starten der DB mit Definition des Daten- und Logpaths

    2. Starten der Backend Node.js-Instanz:
    Besipiel:
    cd c:\dev\IPA_Backend //Wechsel ins Projektverzeichnis
    npm start //Starten mittels npm-Kommando