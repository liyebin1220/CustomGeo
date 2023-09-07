    // Declare apiKey as a global variable
    const apiKey = '20acc0972699ca4133fbee84646f41b9';
    // Replace with your AMap API key and security code
    const securityCode = 'e016b7c8a8df4e14e4e7ec322210f934';

(function()  {
    let tmpl = document.createElement('template');
    tmpl.innerHTML = `
		<style>
          /* Add any custom CSS styles here */
          #map-container {
            width: 100%
            height: 100%
          }
        </style>
        <div id="map-container">
            <button class="drawAMap">Draw a map</button>
        </div>
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
            //this.redraw();
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
                const securityCodeScript = document.createElement('script');
                console.log("securityCodeScript has been created.")
                securityCodeScript.type = 'text/javascript';
                console.log("text/javascript has been assigned.")
                securityCodeScript.textContent = `
                window._AMapCbs = {
		    key: '${apiKey}',
		    code: '${securityCode}',
		  };
          console.log("obj _AMapCbs has been assigned.")
		  function loadAMap() {

            const btnEl = window.document.querySelector('.sapCustomWidgetWebComponent')._shadowRoot.getElementByClass('drawAMap')
                btnEl.onclick = function() {
                    const map = new AMap.Map(window.document.querySelector('.sapCustomWidgetWebComponent')._shadowRoot.getElementById('map-container'), {
                    
                        // Map configuration options go here        
                        viewMode: '2D',
                        zoom:11,
                        center: [116.397428, 39.90923]
                        });
                        console.log("Manually new an AMap" + "has been executed.")
                    }
                
		
		    const mapContainerEl = window.document.querySelector('.sapCustomWidgetWebComponent')._shadowRoot.getElementById('map-container')
		    console.log(mapContainerEl + "has been retched.")
		    // Callback function to run when AMap is fully loaded
		    function onAMapLoaded() {
		      // The external script (AMap API) has loaded, and you can use AMap functionality here
		      const map = new AMap.Map(window.document.querySelector('.sapCustomWidgetWebComponent')._shadowRoot.getElementById('map-container'), {
		        
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
              console.log("onAMapLoaded() has been executed when AMap is not undefined.")
		    } else {
		      // Create a script element for loading the AMap JavaScript API
		      const apiScript = document.createElement('script');
              console.log("apiScript has been created as AMap is undefined.")
		      apiScript.src = 'https://webapi.amap.com/loader.js';
              console.log("apiScript.src has been assigned.")
		      apiScript.async = true;
              console.log("apiScript.async has been assigned as true.")
		      apiScript.addEventListener('load', () => {
		        // Load the AMap API
		        AMapLoader.load({
		          key: apiKey,
		          // Additional configuration options for AMap can be added here
		          callback: onAMapLoaded, // Specify the callback function
		        });
                console.log("AMapLoader.load has been executed in listener.")
            
            });
		
		      // Append the AMap API script element to the document body
		      document.body.appendChild(apiScript);
              console.log("apiScript has been appended to body.")
		    }
		  }
            `;
            // Append the security code script to the Shadow DOM
            this.shadowRoot.appendChild(securityCodeScript);
            console.log("securityCodeScript has been appended to shadowroot.")

            // Load AMap after the security code script is executed
            this.shadowRoot.appendChild(document.createElement('script')).textContent = 'loadAMap();';
            console.log("loadAMap() has been appended to shadowroot.")

            

            }

            
        })
})(); 
