/**Bibliothek für nützliche Funktionen.
 * Programmiert von Tobias Goltermann.
 */

function sleep(milisecons){
	var start_d = new Date();
	
	do{
		current_d = new Date();
	}while(current_d - start_d < milisecons);
}

function isElement(element, list){
	for(var i=0; i<list.length; i++){
		if(element == list[i]){
			return true;
		}
	}
	return false;
}
