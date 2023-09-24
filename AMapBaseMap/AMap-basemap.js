(function() {

    // Declare apiKey as a global variable
    var apiKey = '20acc0972699ca4133fbee84646f41b9';
    // Replace with your AMap API key and security code
    var securityCode = 'e016b7c8a8df4e14e4e7ec322210f934';

    var mapAMap = null;


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
        <div id="root" style=width: 100%; height: 100%">
            <div id="map-container" class="map-container"></div>
        </div>
    `;
    // Drawing the base boxes.

    class ClassAMap extends HTMLElement {

        constructor() {
            super()
            this._shadowRoot = this.attachShadow({mode: "open"});
            this._shadowRoot.appendChild(tmpl.content.cloneNode(true)); 
            var container = this._shadowRoot.getElementById('map-container')
            this._props = {}
            this._amap = {}
  
            this.securityScriptLoad()
            this.apikeyScriptLoad(container)
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
  
        apikeyScriptLoad(container) {       

            const apiScript = document.createElement('script');
  
            apiScript.src = 'https://webapi.amap.com/loader.js';
            apiScript.defer = true;
            apiScript.addEventListener('load', () => {
            AMapLoader.load({
                key: apiKey,
                "plugins": [],
                "AMapUI": {             
                  "version": '1.1',   
                  "plugins":['overlay/SimpleMarker'], 
                },
            }).then((AMap)=>{
                mapAMap = new AMap.Map(container);
              })          
          })
  
            document.head.appendChild(apiScript);
  
            this._amap = mapAMap;
        }  
        createAMapInstance() {
           
        }
        resetAMapInstance_default() {
            this._amap.setLayers([new AMap.TileLayer()])                
        }
        resetAMapInstance_Satellite() {
            this._amap.setLayers([new AMap.TileLayer.Satellite()])  
        }
        resetAMapInstance_Satellite_RoadNet() {
            this._amap.setLayers([new AMap.TileLayer.Satellite(), new AMap.TileLayer.RoadNet()])    
        }
  
        onCustomWidgetBeforeUpdate(changedProperties)
        {
            this._props = { ...this._props, ...changedProperties };
        }
  
        onCustomWidgetAfterUpdate(changedProperties) 
        {
  
        }  
    }
    customElements.define('cust-base-amap', ClassAMap)
})();