// Declare apiKey as a global variable
var apiKey = '20acc0972699ca4133fbee84646f41b9';
// Replace with your AMap API key and security code
var securityCode = 'e016b7c8a8df4e14e4e7ec322210f934';
// Main AMap prepared
var mapAMap = null;

(function() {

    let tmpl = document.createElement('template');
    tmpl.innerHTML = `
		<style>
          /* Add any custom CSS styles here */
          .btn {
            background-color: #002f2f;
            border: 0cap;
            width: 1000px;
            height: 30px
          }
          .map-container {
            background-color: #ee2f2f;
            border: 0cap;
            width: 1000px;
            height:900px
          }
        </style>
        <div id="btn" class="btn">
          <button id="btn1" class="drawAMap">init Amap</button>
        </div>
        <div id="map-container" class="map-container"></div>
    `;
    // Drawing the base boxes.

    class ClassAMap extends HTMLElement {

        constructor() {
            super()
            this._shadowRoot = this.attachShadow({mode: "open"});
            this._shadowRoot.appendChild(tmpl.content.cloneNode(true)); 
            this._firstConnection = false
                        
            this.securityScriptLoad()
            this.apikeyScriptLoad()
            this.initBtn(this)
        }

        securityScriptLoad() {

            const securityScript = document.createElement('script')
            securityScript.type = "text/javascript"
            securityScript.defer = true;
            securityScript.innerHTML = `
                window._AMapSecurityConfig = {
                securityJsCode: '${securityCode}',
              }
            `

            document.head.appendChild(securityScript);
        }

        apikeyScriptLoad() {
            const apiScript = document.createElement('script');

            apiScript.src = 'https://webapi.amap.com/loader.js';
            apiScript.defer = true;
            apiScript.addEventListener('load', () => {
            AMapLoader.load({
                key: apiKey,
            })})

            document.head.appendChild(apiScript);
        }

        initBtn(that) {

            const btnEl1 = this._shadowRoot.getElementById('btn1')

            btnEl1.onclick = function() {                
               
                mapAMap = null;
                mapAMap = new AMap.Map(that._shadowRoot.getElementById('map-container'), { 
                        viewMode: '2D',
                        zoom:4,
                        resizeEnable: true,
                        version: 2.0
                    });
                };
            }
    }

    customElements.define('custom-base-amap', ClassAMap)
})();