(function()  {
    let tmpl = document.createElement('template');
    tmpl.innerHTML = `
		<style type="text/css">
			#allmap {
   				background-color: #ff00ff​;
   				width: 600px;
       				height: 400px;
       				margin:0;
	   		}
		</style>
		
		<div id="allmap">
            		<table id="mytable">
            		</table>
        	</div>
	 	<script​​>
   		var allmap = document.getElementById('allmap');
        	var mytable = document.getElementById('mytable');
		console.log(allmap);
        	console.log(mytable);

        	for(var i = 1; i <= 9; i++){
	            //create new tr tag
	            var tr = document.createElement('tr');
	            for(var j = 1; j <= i; j++){
	                //create new td tag
	                var td = document.createElement('td');
	                //add td to tr
	                td.innerText = i + "x" + j + "=" + (i * j);
	                tr.appendChild(td);
	            }
	            // add tr to table
	            mytable.appendChild(tr);
        	}
	 	</script>
    `;

    customElements.define('com-sap-sample-geobaidu01', class GeoBaidu01 extends HTMLElement {


		constructor() {
			super(); 
			this._shadowRoot = this.attachShadow({mode: "open"});
            		this._shadowRoot.appendChild(tmpl.content.cloneNode(true));
            		this._firstConnection = false;
		}

        //Fired when the widget is added to the html DOM of the page
        connectedCallback(){
            this._firstConnection = true;
            this.redraw();
        }

         //Fired when the widget is removed from the html DOM of the page (e.g. by hide)
        disconnectedCallback(){
        
        }

         //When the custom widget is updated, the Custom Widget SDK framework executes this function first
		onCustomWidgetBeforeUpdate(oChangedProperties) {

		}

        //When the custom widget is updated, the Custom Widget SDK framework executes this function after the update
		onCustomWidgetAfterUpdate(oChangedProperties) {
            if (this._firstConnection){
                this.redraw();
            }
        }
        
        //When the custom widget is removed from the canvas or the analytic application is closed
        onCustomWidgetDestroy(){
        }

        
        //When the custom widget is resized on the canvas, the Custom Widget SDK framework executes the following JavaScript function call on the custom widget
        // Commented out by default.  If it is enabled, SAP Analytics Cloud will track DOM size changes and call this callback as needed
        //  If you don't need to react to resizes, you can save CPU by leaving it uncommented.
        /*
        onCustomWidgetResize(width, height){
            redraw()
        }
        */

        redraw(){
		

        }
    });
})();
