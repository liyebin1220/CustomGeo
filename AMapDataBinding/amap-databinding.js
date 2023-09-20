(function() {

    // Declare apiKey as a global variable
    var apiKey = '20acc0972699ca4133fbee84646f41b9';
    // Replace with your AMap API key and security code
    var securityCode = 'e016b7c8a8df4e14e4e7ec322210f934';

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
            this._props = {}
                        
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
        onCustomWidgetBeforeUpdate(changedProperties)
        {
            this._props = { ...this._props, ...changedProperties };
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

            this._ready = true
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

        onCustomWidgetAfterUpdate(changedProperties) 
        {
            if ("myDataBinding" in changedProperties) {
                this._updateData(changedProperties.myDataBinding)
            }
            console.log("changedProperties: ", changedProperties)       
        }

        _updateData(dataBinding) {
            console.log('dataBinding:', dataBinding);
            if (!dataBinding) {
                console.error('dataBinding is undefined');
            }
            if (!dataBinding || !dataBinding.data) {
                console.error('dataBinding.data is undefined');
            }
            
            if (this._ready) {
                // Check if dataBinding and dataBinding.data are defined
                if (dataBinding && Array.isArray(dataBinding.data)) {
                    // Transform the data into the correct format
                    const transformedData = dataBinding.data.map(row => {
                        console.log('row:', row);
                        // Check if dimensions_0 and measures_0 are defined before trying to access their properties
                        if (row.dimensions_0 && row.measures_0) {
                            return {
                                dimension: row.dimensions_0.label,
                                measure: row.measures_0.raw
                            };
                        }
                    }).filter(Boolean);  // Filter out any undefined values
        
                    //this._renderChart(transformedData);
                    console.log(transformedData)
                } else {
                    console.error('Data is not an array:', dataBinding && dataBinding.data);
                }
            }
        }
    }

    customElements.define('custom-base-amap-databinding', ClassAMap)
})();