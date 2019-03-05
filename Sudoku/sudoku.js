var sudoku = [];
var feld; //Feldgröße wird in setup() intialisiert
var selected = [0, 0];

function setup(){
	createCanvas(630, 630);
	background(255);
	
	makeSudoku(9, 9);
	feld = width / sudoku.length;
	drawSudoku();
	
}
/**Testet, ob alle Reihen, Spalten und Blöcke jede Zahl nur einmal enthalten
 * ist. Es wird dazu aus jedem Bereich eine Liste der Elemente erstellt, und
 * dann geprüft, ob jede Zahl in diser Liste ist.*/
function isSolved(){
	var elements = []; //Elemente eines Sektors
	//Pro Block
	for(var block_x = 0; block_x < sudoku.length; block_x += 3){
		for(var block_y = 0; block_y < sudoku[0].length; block_y += 3){
			
			//Jedes Element des Blockes
			for(var i = block_x; i < block_x + 3; i++){
				for(var j = block_y; j < block_y + 3; j++){
					elements.push(sudoku[i][j].getValue());
				}
			}
			//Jede Zahl überprüfen
			for(var i=1; i<=9; i++){
				if(!isElement(i, elements)){
					//Element nicht enthalten --> Nicht gelöst
					return false;
				}
			}
		}
	}
	
	//Pro Zeile; Es wird von oben nach unten geprüft
	elements = [];
	for(var y=0; y<sudoku[0].length; y++){
		
		//Jedes Element der Zeile
		for(var x=0; x<sudoku.length; x++){
			elements.push(sudoku[x][y].getValue());
		}
		//Jede Zahl überpüfen
		for(var i=1; i<=9; i++){
			if(!isElement(i, elements)){
				//Element nicht enthalten --> Nicht gelöst
				return false;
			}
		}
	}
	//Pro Spalte; Von links nach rechts
	elements = [];
	for(var x=0; x<sudoku.length; x++){
		
		//Jedes Element der Zeile
		for(var y=0; y<sudoku[0].length; y++){
			elements.push(sudoku[x][y].getValue());
		}
		//Jede Zahl überpüfen
		for(var i=1; i<=9; i++){
			if(!isElement(i, elements)){
				//Element nicht enthalten --> Nicht gelöst
				return false;
			}
		}
	}
	return true; //Kein Abbruch --> Soduko gelöst
}
/** Soll das Soduko lösen:
 * 	(1) Alle Eindeutigen Felder eintrage
 */
function solve(){
	var changed = true; //Speichert, ob was geändert wurde
	var dummy;
	
	while (changed){
		changed = false; //Schleifenende
		
		for(var i=0; i<sudoku.length; i++){
			for(var j=0; j<sudoku[i].length; j++){
				
				updateAll(); //Könnte auch in Field.blackSet... gemacht werden
				
				//Nur in leere Felder eintragen
				if(sudoku[i][j].getValue() == -1){
			
					dummy = sudoku[i][j].getValue();
					var poss = sudoku[i][j].getPossibles();
					
					//Werte setzen
					if(poss.length == 1){
						//Es bleibt nur eine Zahl
						setNum(i, j, poss[0], false);
						
					}else{ //Anderer Versuch: Durch Nachbarn bestimmen (Ausschlussverfahren)
						/**Fehler sind wahrscheinlich hier!*/
						setNum(i, j, sudoku[i][j].blackSetBlock(sudoku), false);
						setNum(i, j, sudoku[i][j].blackSetRow(sudoku), false);
						setNum(i, j, sudoku[i][j].blackSetColumn(sudoku), false);
					}
					if(dummy != sudoku[i][j].getValue()){
						changed = true;
					}
				}
			}
		}
		drawSudoku();
	}
}
function keyPressed() {
	if (key === '1') {
		input(1);
	} else if (key === '2') {
		input(2);
	} else if (key === '3') {
		input(3);
	} else if (key === '4') {
		input(4);
	} else if (key === '5') {
		input(5);
	} else if (key === '6') {
		input(6);
	} else if (key === '7') {
		input(7);
	} else if (key === '8') {
		input(8);
	} else if (key === '9') {
		input(9);
	}
}
/**#---------------------------------------------------#
 * #-Alle unteren Funktionen wurden schonbearbeitet.  -#
 * #-Sollten sie wieder editiert werden, so werden sie-#
 * #-ÜBER diesen Text gesetzt!						  -#
 * #---------------------------------------------------#
 */
 /** Nimmt die Eingabe der Buttons entgegen und setzt die Zahlen entsprechend*/
function input(num){
	setNum(selected[0], selected[1], num, true);
	updateButtons(selected[0], selected[1]);
	drawSudoku();
}
/** Setzt eine Nummer in ein Feld*/
function setNum(x, y, num, original){
	if(x >= 0 && x < sudoku.length && y >= 0 && y <= sudoku[0].length){
		sudoku[x][y].setValue(num);
		sudoku[x][y].setOriginal(original);
	}
}
/**Aktualisiert das gesamte Sudoku.
 * Notwendig für alle Funktionen, die mit dem Sudoku arbeiten.*/
function updateAll(){
	for(var i=0; i<sudoku.length; i++){
		for(var j=0; j<sudoku[i].length; j++){
			sudoku[i][j].updatePossibles(sudoku);
		}
	}
}
/** Setzt im gesamten Sudoku leere Felder*/
function clearAll(){
	if(confirm(unescape("M%F6chtest du wirklich alles l%F6schen?"))){
		for(var i=0; i<sudoku.length; i++){
			for(var j=0; j<sudoku[i].length; j++){
				setNum(i, j, -1, true);
			}
		}
		drawSudoku();
	}
}
/** Setzt die gelösten Felder zurück*/
function reset(){
	if(confirm(unescape("M%F6chtest du wirklich alles zur%FCcksetzen?"))){
		for(var i=0; i<sudoku.length; i++){
			for(var j=0; j<sudoku[i].length; j++){
				if( !sudoku[i][j].getOriginal()){
					setNum(i, j, -1, true);
				}
			}
		}
		drawSudoku();
	}
}
/**function mousePressed(){
	//Wurde der passende Knopf gedrückt?
	if (mouseButton == LEFT){
		//Feld auswählen
		if(mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height){
			selected = [Math.floor(mouseX/feld), Math.floor(mouseY/feld)]; //Integer zum Abrunden auf das Feldraster
			//Neue Auswahl akutalisieren
			updateButtons(selected[0], selected[1]);
		}
	}
	//Vorige Auswahl löschen
	drawSudoku();
	//Neue Auswahl einzeichnen
	stroke(0, 100, 255);
	strokeWeight(5);
	noFill();
	rect(selected[0] * feld, selected[1] * feld, feld, feld);
}*/
 /**Funktion aktualisiert die Buttons des Feldes (x,y), damit keine invaliden Zahlen eingegeben werden können*/
/**function updateButtons(x, y){
	
	updateAll();
	var valids;
	if(sudoku[x][y].getValue() != -1){
		//Zahl im Feld, nichts, mehr möglich
		valids = [];
	}else{
		//Möglichkeiten erhalten
		var valids = sudoku[x][y].getPossibles();
	}
	
	//Durchführen
	for(var i=1; i<=9; i++){
		if(isElement(i, valids)){
			//Zahl des Buttons ist möglich
			document.getElementById(i).disabled = false;
		}else{
			//Zahl kann nicht im Feld sein --> Button deaktivieren
			document.getElementById(i).disabled = true;
		}
	}
}
*/
/** Initialisiert das Sudoku-Array*/
function makeSudoku(rows, columns){
	//Erstelle das Sudoku-Array
	for(var i=0; i<columns; i++){
		sudoku.push([]);
		for(var j=0; j<rows; j++){
			sudoku[i].push(new Field(i, j));
		}
	}
}
/** Malt das Sudoku, die Zahlen mit einem bestimmten Grauton --> bessere Übersicht*/
function drawSudoku(){
	background(255);
	stroke(0);
	
	//draw lines
	strokeWeight(1);
	for(var i=0; i<sudoku.length; i++){
		line(0, i*feld, width, i*feld);
		line(i*feld, 0, i*feld, height);
	}
	strokeWeight(5);
	for(var i=0; i<=sudoku.length; i+=3){
		line(0, i*feld, width, i*feld);
		line(i*feld, 0, i*feld, height);
	}
	
	//draw nums
	textSize(30);
	strokeWeight(3);
	for(var i=0; i<sudoku.length; i++){
		for(var j=0; j<sudoku.length; j++){
			//Es ist eine Zahl im Feld
			if(sudoku[i][j].getValue() != -1){
				//Text zentrieren
				//Höhe und breite in das Feld hinein in Pixeln
				var val = sudoku[i][j].getValue();
				var h = (feld - textAscent()) / 2.0; //Höhe von unten (Nur textAscent, weil Zahlen nicht unter die Baseline gehen)
				var w = (feld - textWidth(val)) / 2.0; //Breite von links
				
				if(sudoku[i][j].getOriginal() != true){
					stroke(100);
				}else{
					stroke(0);
				}
				text(val, i*feld + w, j*feld + (feld - h)); 
			}
		}
	}
	//Auswahl weiterhin anzeigen
	noFill();
	stroke(0, 100, 255);
	strokeWeight(5);
	rect(selected[0] * feld, selected[1] * feld, feld, feld);
}
