(function() {

    // Declare apiKey as a global variable
    var apiKey = '20acc0972699ca4133fbee84646f41b9';
    // Replace with your AMap API key and security code
    var securityCode = 'e016b7c8a8df4e14e4e7ec322210f934';

    var tmpAMap = null;

    var transformedData = null;

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
                        
            this.capitalScriptLoad()
            this.securityScriptLoad()
            this.apikeyScriptLoad()
        }

        capitalScriptLoad() {

            const capitalScript = document.createElement('script')
            capitalScript.type = "text/javascript"
            capitalScript.src = 'https://a.amap.com/jsapi_demos/static/resource/capitals.js';
            document.head.appendChild(capitalScript);
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
                key: apiKey
            })})

            document.head.appendChild(apiScript);

            this._ready = true
        }

        createAMapInstance() {
           var mapAMap = new AMap.Map(this._shadowRoot.getElementById('map-container'), { 
                        viewMode: '2D',
                        center: [116.397428, 39.90923],
                        zoom:4,
                        resizeEnable: true,
                        version: 2.0
                    });

            console.log("this._props: ", this._props)
            console.log("this._props.changedProperties: ", this._props.changedProperties)
            console.log(_props)
            console.log(changedProperties)
            //this._updateData(this._props.changedProperties.myDataBinding)
            var theDataBinding = this._props.myDataBinding
            
        
            console.log('theDataBinding:', theDataBinding);
            if (!theDataBinding) {
                console.error(this, 'theDataBinding is undefined');
            }
            if (!theDataBinding || !theDataBinding.data) {
                console.error(this, 'theDataBinding.data is undefined');
            }
            
            if (this._ready) {
                // Check if theDataBinding and theDataBinding.data are defined
                if (theDataBinding && Array.isArray(theDataBinding.data)) {
                    // Transform the data into the correct format
                    transformedData = theDataBinding.data.map(row => {
                        console.log('row:', row);
                        // Check if dimensions_0 and measures_0 are defined before trying to access their properties
                        if (row.dimensions_0 && row.measures_0) {
                            return {
                                dim_adcode: row.dimensions_0.label,
                                dim_province: row.dimensions_1.label,
                                dim_product: row.dimensions_2.label,
                                dim_city: row.dimensions_3.label,
                                kfg_sales_volumns: row.measures_0.raw,
                                kfg_lat: row.measures_1.raw,
                                kfg_log: row.measures_2.raw,
                                kfg_revenue: row.measures_3.raw
                            };
                        }
                    }).filter(Boolean);  // Filter out any undefined values
                    console.log("transformedData has been filled: ", transformedData)
                    for(var i = 0; i < transformedData.length; i += 1){
                        var center = new Array(transformedData[i].kfg_log, transformedData[i].kfg_lat) 
                        
                        var circleMarker = new AMap.CircleMarker({
                          center:center,
                          radius:10,
                          strokeColor:'white',
                          strokeWeight:2,
                          strokeOpacity:0.5,
                          fillColor:'rgba(0,0,255,1)',
                          fillOpacity:0.5,
                          zIndex:10,
                          bubble:true,
                          cursor:'pointer',
                          clickable: true
                        })
                        console.log("center: ", center)
                        console.log("revenue: ", transformedData[i].kfg_revenue)
                        circleMarker.setMap(tmpAMap)
                      }
                } else {
                    console.error('Data is not an array:', theDataBinding && theDataBinding.data);
                }
            }
        
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
                //this._updateData(changedProperties.myDataBinding)

            }
            console.log("changedProperties: ", changedProperties)       
        }

        _updateData(dataBinding) {
            console.log('dataBinding:', dataBinding);
            if (!dataBinding) {
                console.error(this, 'dataBinding is undefined');
            }
            if (!dataBinding || !dataBinding.data) {
                console.error(this, 'dataBinding.data is undefined');
            }
            
            if (this._ready) {
                // Check if dataBinding and dataBinding.data are defined
                if (dataBinding && Array.isArray(dataBinding.data)) {
                    // Transform the data into the correct format
                    transformedData = dataBinding.data.map(row => {
                        console.log('row:', row);
                        // Check if dimensions_0 and measures_0 are defined before trying to access their properties
                        if (row.dimensions_0 && row.measures_0) {
                            return {
                                dim_adcode: row.dimensions_0.label,
                                dim_province: row.dimensions_1.label,
                                dim_product: row.dimensions_2.label,
                                dim_city: row.dimensions_3.label,
                                kfg_sales_volumns: row.measures_0.raw,
                                kfg_lat: row.measures_1.raw,
                                kfg_log: row.measures_2.raw,
                                kfg_revenue: row.measures_3.raw
                            };
                        }
                    }).filter(Boolean);  // Filter out any undefined values
                    console.log("transformedData has been filled: ", transformedData)
                    for(var i = 0; i < transformedData.length; i += 1){
                        var center = new Array(transformedData[i].kfg_log, transformedData[i].kfg_lat) 
                        
                        var circleMarker = new AMap.CircleMarker({
                          center:center,
                          radius:10,
                          strokeColor:'white',
                          strokeWeight:2,
                          strokeOpacity:0.5,
                          fillColor:'rgba(0,0,255,1)',
                          fillOpacity:0.5,
                          zIndex:10,
                          bubble:true,
                          cursor:'pointer',
                          clickable: true
                        })
                        console.log("center: ", center)
                        console.log("revenue: ", transformedData[i].kfg_revenue)
                        circleMarker.setMap(tmpAMap)
                      }
                } else {
                    console.error('Data is not an array:', dataBinding && dataBinding.data);
                }
            }
        }
    }

    customElements.define('custom-base-amap-databinding', ClassAMap)
})();