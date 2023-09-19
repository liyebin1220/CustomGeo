(function() {

    // Declare apiKey as a global variable
    var apiKey = '20acc0972699ca4133fbee84646f41b9';
    // Replace with your AMap API key and security code
    var securityCode = 'e016b7c8a8df4e14e4e7ec322210f934';

    var isLoaded = false;

    var tmpAMap = null;

    let tmpl = document.createElement('template');
    tmpl.innerHTML = `
		<style>
          /* Add any custom CSS styles here */
          .map-container {
            background-color: #777799;
            border: 0cap;
            width: 1000px;
            height:900px
          }
        </style>

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
                plugins: ['AMap.Scale','AMap.ToolBar'],
            })})

            document.head.appendChild(apiScript);

            isLoaded = true;
        }

        createAMapInstance() {
           var mapAMap = new AMap.Map(this._shadowRoot.getElementById('map-container'), { 
                        viewMode: '2D',
                        center: [116.397428, 39.90923],
                        zoom:1,
                        resizeEnable: true,
                        version: 2.0
                    });
            tmpAMap = mapAMap;
        }
        resetAMapInstance_default() {
            tmpAMap.setLayers([new AMap.TileLayer()])                
        }
        resetAMapInstance_Satellite() {
            tmpAMap.setLayers([new AMap.TileLayer.Satellite()])  
        }
        resetAMapInstance_Satellite_RoadNet() {
            tmpAMap.setLayers([new AMap.TileLayer.Satellite(), new AMap.TileLayer.RoadNet()])    
        }

        onCustomWidgetBeforeUpdate(changedProperties)
        {
            this._props = { ...this._props, ...changedProperties };
        }

        onCustomWidgetAfterUpdate(changedProperties) 
        {
                    
            if ("securityCode" in changedProperties) {
                this.$securityCode = changedProperties["securityCode"];
            }
            securityCode = this.$securityCode; // place passed in value into global
    
            if ("apiKey" in changedProperties) {
                this.$apiKey = changedProperties["apiKey"];
            }
            apiKey = this.$apiKey; // place passed in value into global

            if ("isLoaded" in changedProperties) {
                this.$isLoaded = changedProperties["isLoaded"];
            }
            isLoaded = this.$isLoaded; // place passed in value into global
        }

        isLoaded() {
            console.log(isLoaded);
            return isLoaded;
        }
    }

    customElements.define('custom-base-amap', ClassAMap)
})();