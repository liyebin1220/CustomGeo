    // Declare apiKey as a global variable
    var apiKey = '20acc0972699ca4133fbee84646f41b9';
    // Replace with your AMap API key and security code
    var securityCode = 'e016b7c8a8df4e14e4e7ec322210f934';

(function()  {
    var tmpl = document.createElement('template');
    tmpl.innerHTML = `
		<style>
          /* Add any custom CSS styles here */
        </style>
        <div id="map-container"></div>
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

                    // Create a script element for the security code
                var securityCodeScript = document.createElement('script');
                securityCodeScript.type = 'text/javascript';
                securityCodeScript.textContent = `
                window._AMapCbs = {
		    key: '${apiKey}',
		    code: '${securityCode}',
		  };
		  function loadAMap() {
		
		    var mapContainerEl = document.getElementById('map-container')
		    console.log(mapContainerEl + "has been retched.")
		    // Callback function to run when AMap is fully loaded
		    function onAMapLoaded() {
		      // The external script (AMap API) has loaded, and you can use AMap functionality here
		      var map = new AMap.Map(document.getElementById('map-container'), {
		        
		        // Map configuration options go here        
		        viewMode: '2D',
		        zoom:11,
		        center: [116.397428, 39.90923]
		      });
		      console.log("onAMapLoaded" + "has been executed.")
		    }
		
		    // Check if AMap is already loaded
		    if (typeof AMap !== 'undefined') {
		      onAMapLoaded();
		    } else {
		      // Create a script element for loading the AMap JavaScript API
		      var apiScript = document.createElement('script');
		      apiScript.src = 'https://webapi.amap.com/loader.js';
		      apiScript.async = true;
		      apiScript.addEventListener('load', () => {
		        // Load the AMap API
		        AMapLoader.load({
		          key: apiKey,
		          // Additional configuration options for AMap can be added here
		          callback: onAMapLoaded, // Specify the callback function
		        });
		      });
		
		      // Append the AMap API script element to the document body
		      document.body.appendChild(apiScript);
		    }
		  }
            `;
            // Append the security code script to the Shadow DOM
            this.shadowRoot.appendChild(securityCodeScript);

            // Load AMap after the security code script is executed
            this.shadowRoot.appendChild(document.createElement('script')).textContent = 'loadAMap();';

            }
        })
})(); 