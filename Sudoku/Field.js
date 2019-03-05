function Field(x, y){
	this.x = x;
	this.y = y;
	this.value = -1;
	this.original = true;
	this.possibles = [1, 2, 3, 4, 5, 6, 7, 8, 9];
	this.blacklist = [];
	
//Getter und setter
	this.setOriginal = function(bool){
		this.original = bool;
	}
	this.getOriginal = function(){
		return this.original;
	}
	this.getPossibles = function(){
		return this.possibles;
	}
	this.getBlacklist = function(){
		return this.blacklist;
	}
	this.getValue = function(){
		return this.value;
	}
	this.setValue = function(value){
		this.value = value;
	}
	/**Funktion schaut, ob ein Wert in den Possibles in allen
	 * anderen Blacklists der freien Felder des Blockes enthalten ist.
	 * Denn dann ist der Wert des Feldes gesetzt.
	 * Gibt -1 (leeres Feld) als Standard*/
	this.blackSetBlock = function(sudoku){
		//Falls der Wert schon gesetzt ist (einfacher im 'if' von 'solve()')
		if(this.value != -1){
			return this.value;
		}
		
		var exists;
		
		for(var k=0; k<this.possibles.length; k++){
			exists = true; //Annahme, der Wert sei in allen blacklists enthalten
			
			//Alle Felder des Blocks testen
			for(var i = this.x - this.x % 3; i < this.x - this.x % 3 + 3; i++){
				for(var j = this.y - this.y % 3; j < this.y - this.y % 3 + 3; j++){
										
					//Nicht im eigenen Suchen und nur in leeren Feldern suchen --> Ausschluss
					if( !(i == this.x && j == this.y) && sudoku[i][j].getValue() == -1){
						if( !isElement(this.possibles[k], sudoku[i][j].getBlacklist()) ){
							//Wert nicht in blacklist enhalten --> kein Erfolg hier
							exists = false;
						}
					}
				}
			}
			if(exists){ //Kein Schleifenabbruch --> Wert eindeutig --> Ausgeben
				return this.possibles[k];
			}
		}
		//Kein Erfolg --> Kein Wert eindeutig --> Leeres Feld
		return -1;
	}
	/**Funktion funktioniert wie 'blackSetBlock()' durch Ausschlussprinzip.
	 * Hier wird die eigene Zeile betrachtet*/
	this.blackSetRow = function(sudoku){
		//Falls der Wert schon gesetzt ist (einfacher im 'if' von 'solve()')
		if(this.value != -1){
			return this.value;
		}
		
		var exists
		for(var k=0; k<this.possibles.length; k++){
			exists = true; //Annahme, der Wert sei in allen blacklists enthalten
			
			//Alle Felder der Zeile testen
			for(var i=0; i<sudoku.length; i++){
				
				//Nicht im eigenen Suchen und nur in leeren Feldern suchen --> Ausschluss
				if( i != this.x && sudoku[i][this.y].getValue() == -1){
					if( !isElement(this.possibles[k], sudoku[i][this.y].getBlacklist()) ){
						//Wert nicht in blacklist enhalten --> kein Erfolg hier
						exists = false;
					}
				}
			}
			if(exists){ //Kein Schleifenabbruch --> Wert eindeutig --> Ausgeben
				return this.possibles[k];
			}
		}
		//Kein Erfolg --> Kein Wert eindeutig --> Leeres Feld
		return -1;
	}
	/**Funktion funktioniert wie 'blackSetBlock()' durch Ausschlussprinzip.
	 * Hier wird die eigene Spalte betrachtet*/
	this.blackSetColumn = function(sudoku){
		//Falls der Wert schon gesetzt ist (einfacher im 'if' von 'solve()')
		if(this.value != -1){
			return this.value;
		}
		
		var exists
		for(var k=0; k<this.possibles.length; k++){
			exists = true; //Annahme, der Wert sei in allen blacklists enthalten
			
			//Alle Felder der Zeile testen
			for(var j=0; j<sudoku[this.x].length; j++){
				
				//Nicht im eigenen Suchen und nur in leeren Feldern suchen --> Ausschluss
				if( j != this.y && sudoku[this.x][j].getValue() == -1){
					if( !isElement(this.possibles[k], sudoku[this.x][j].getBlacklist()) ){
						//Wert nicht in blacklist enhalten --> kein Erfolg hier
						exists = false;
					}
				}
			}
			if(exists){ //Kein Schleifenabbruch --> Wert eindeutig --> Ausgeben
				return this.possibles[k];
			}
		}
		//Kein Erfolg --> Kein Wert eindeutig --> Leeres Feld
		return -1;
	}	
	/**Funktion sucht nach anderen Nummern in der gleichen Zeile, Spalte
	 * und im gleichen Block um die Möglichkeiten einer Nummer einzugrenzen*/
	this.updatePossibles = function(sudoku){
		//Listen resetten
		this.possibles = [];
		this.blacklist = [];
		
		//Suche in Zeile (gleiches y)
		for(var i=0; i<sudoku.length; i++){
			var val = sudoku[i][this.y].getValue();
			if (val != -1 && !isElement(val, this.blacklist)){
				//Kein doppeltes Element
				this.blacklist.push(val);
			}
		}
		//Suche in Spalte (gleiches x)
		for(var i=0; i<sudoku[this.x].length; i++){
			var val = sudoku[this.x][i].getValue();
			if (val != -1 && !isElement(val, this.blacklist)){
				//Kein doppeltes Element
				this.blacklist.push(val);
			}
		}
		/*Suche im Block:
		 * (1) Den momentanen Block erhalten (this.x / 3; this.y / 3)
		 * (2) Blockanfang berechnen: z.B. this.x - this.x % 3 --> blockanfang
		 * (3) ggf. blcklisten
		 */
		
		for(var i = this.x - this.x % 3; i < this.x - this.x % 3 + 3; i++){
			for(var j = this.y - this.y % 3; j < this.y - this.y % 3 + 3; j++){
				var val = sudoku[i][j].getValue();
				if (val != -1 && !isElement(val, this.blacklist)){
					//Kein doppeltes Element
					this.blacklist.push(val);
				}
			}
		}
		//Possible mit validen Elementen auffüllen
		for(var i = 1; i<= 9; i++){
			if(!isElement(i, this.blacklist)){
				this.possibles.push(i);
			}
		}
	}
}
