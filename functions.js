
/**
 * getTarget()
 * Summary: Used to gather target from an event. Recently updated to support firefox.
 **/
function getTarget(e){
	if(!e){ e = window.event || event; }
 	if(e){
    	field = e.srcElement || e.target;
    	return field;
	}
 return false;
}
