export default class Footer {
    constructor(root) {
        const obj = root.getElementsByTagName('object')[0];
        
        obj.onload = function() {
        	const objDoc = obj.contentDocument;
            const path = objDoc.getElementsByTagName('path')[0];
            path.style.fill = '#fff';
        }
    }
}