    // Declare apiKey as a global variable
    const apiKey = '20acc0972699ca4133fbee84646f41b9';
    // Replace with your AMap API key and security code
    const securityCode = 'e016b7c8a8df4e14e4e7ec322210f934';

(function()  {
    let tmpl = document.createElement('template');
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
                const securityCodeScript = document.createElement('script');
                securityCodeScript.type = 'text/javascript';
                securityCodeScript.textContent = `
                window._AMapCbs = {
                key: '${apiKey}',
                code: '${securityCode}',
                };
                function loadAMap() {
                // Check if AMap is already loaded
                if (typeof window.AMap !== 'undefined') {
                    // The external script (AMap API) has loaded, and you can use AMap functionality here
                    const map = new AMap.Map(document.getElementById('map-container'), {
                    // Map configuration options go here
                    });
                } else {
                    console.error('AMap is not defined. Please check your AMap API configuration.');
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
