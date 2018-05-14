// too muchconst
execSync = require('child_process').execSync;

execSync('curl -k --GET https://www.cia.gov/library/publications/resources/the-world-factbook/docs/notesanddefs.html > notesanddefs/notes_def.html');
