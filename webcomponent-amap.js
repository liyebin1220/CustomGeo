// Declare apiKey as a global variable
const apiKey = '20acc0972699ca4133fbee84646f41b9';
// Replace with your AMap API key and security code
//const securityCode = 'e016b7c8a8df4e14e4e7ec322210f934';
var mapAMap = null;

(function() {

    //console.log("Now your are in webcomponenct-amap.")
    let tmpl = document.createElement('template');
    tmpl.innerHTML = `
		<style>
          /* Add any custom CSS styles here */
          .btn {
            background-color: #002f2f;
            border: 0cap;
            width: 100%;
            height: 50px
          }
          .map-container {
            background-color: #ee2f2f;
            border: 0cap;
            width: 100%;
            height:1000px
          }
        </style>
        <div id="btn" class="btn">
          <button id="btn1" class="drawAMap">Draw a map</button>
          <button id="btn2" class="drawAMap">Add DistrictLayer</button>
          <button id="btn3" class="drawAMap">Draw Map2.0</button>
        </div>
        <div id="map-container" class="map-container">
        </div>
    `;
    // Drawing the base boxes.

    class ClassAMap extends HTMLElement {

        constructor() {
            super()
            this._shadowRoot = this.attachShadow({mode: "open"});
            this._shadowRoot.appendChild(tmpl.content.cloneNode(true)); 
            this._firstConnection = false
            

            this.apiScriptLoad()
            this.initBtn(this)
            this.drawAMap()
        }

        apiScriptLoad() {
            window._AMapCbs = {
                key: '${apiKey}',
                code: '${securityCode}',
              };
            const apiScript = document.createElement('script');
            apiScript.src = 'https://webapi.amap.com/loader.js';
            apiScript.defer = true;
            apiScript.addEventListener('load', () => {
            AMapLoader.load({
                key: apiKey,
                plugins: ['AMap.Scale','AMap.ToolBar','AMap.DistrictLayer']
            })})
            document.head.appendChild(apiScript);
        }

        initBtn(that) {

            

            const btnEl1 = this._shadowRoot.getElementById('btn1')

            btnEl1.onclick = function() {
                
                mapAMap = new AMap.Map(that._shadowRoot.getElementById('map-container'), { 
                        viewMode: '2D',
                        zoom:10,
                        center: [116.397428, 39.90923],
                        resizeEnable: true
                    });
                
                };
            
            const btnEl2 = this._shadowRoot.getElementById('btn2')
                btnEl2.onclick = function() {
                    AMap.plugin('AMap.DistrictSearch', function() {
                        var districtSearch = new AMap.DistrictSearch()
                        mapAMap.addControl(districtSearch)
                    })
                }
            
            const btnEl3 = this._shadowRoot.getElementById('btn3')

            btnEl3.onclick = function(mapAMap) {
                console.log("now your have clicked button 3.")                
                var SOC = 'CHN'                
                var colors = {};
                var GDPSpeed = {
                    '520000':10,//贵州
                    '540000':10,//西藏
                    '530000':8.5,//云南 
                    '500000':8.5,//重庆
                    '360000':8.5,//江西
                    '340000':8.0,//安徽
                    '510000':7.5,//四川
                    '350000':8.5,//福建
                    '430000':8.0,//湖南
                    '420000':7.5, //湖北
                    '410000':7.5,//河南
                    '330000':7.0,//浙江
                    '640000':7.5,//宁夏
                    '650000':7.0,//新疆
                    '440000':7.0,//广东
                    '370000':7.0,//山东
                    '450000':7.3,//广西
                    '630000':7.0,//青海
                    '320000':7.0,//江苏
                    '140000':6.5,//山西
                    '460000':7,// 海南
                    '310000':6.5,//上海
                    '110000':6.5, // 北京
                    '130000':6.5, // 河北
                    '230000':6, // 黑龙江
                    '220000':6,// 吉林
                    '210000':6.5, //辽宁
                    '150000':6.5,//内蒙古
                    '120000':5,// 天津
                    '620000':6,// 甘肃
                    '610000':8.5,// 甘肃
                    '710000':6.64, //台湾
                    '810000':6.0, //香港
                    '820000':6.7 //澳门

                }
                var getColorByDGP = function(adcode){
                    if(!colors[adcode]){
                        var gdp = GDPSpeed[adcode];
                        if(!gdp){
                            colors[adcode] = 'rgb(227,227,227)'
                        }else{   
                            var rg = 255-Math.floor((gdp-5)/5*255);
                            colors[adcode] = 'rgb('+ rg +','+ rg +',255)';
                        }
                    }
                    return colors[adcode]
                }
                
                var disCountry = new AMap.DistrictLayer.Country({
                    zIndex:10,
                    SOC:'CHN',
                    depth:2,
                    styles:{
                        'nation-stroke':'#f09',
                        'coastline-stroke':[0.85, 0.63, 0.94, 1],
                        'province-stroke':'white',
                        'city-stroke': 'rgba(255,255,255,0.15)',//中国特有字段
                        'fill':function(props){//中国特有字段
                        return getColorByDGP(props.adcode_pro)
                        }
                    }
                })

                mapAMap = new AMap.Map(that._shadowRoot.getElementById('map-container'), {
                        zooms: [4, 8],
                        center:[104.188488,34.302032],
                        showIndoorMap:false,
                        zoom: 4,
                        isHotspot:false,
                        defaultCursor:'pointer',
                        touchZoomCenter:1,
                        pitch: 0,
                        layers:[
                            disCountry,
                            new AMap.TileLayer.RoadNet()
                        ],
                        viewMode:'2D',
                })
                mapAMap.addControl(new AMap.Scale());
                mapAMap.addControl(new AMap.ToolBar({liteStyle:true}));
                //document.getElementsByClassName('amap-mcode')[0].innerHTML = '-GS(2022)200号、GS(2021)648号'
                
                };

        }

        drawAMap() {
            if(typeof this.AMap === 'undefined') {
                console.log("Check AMap before use it: Not ready.")
            } else {
                console.log("Check AMap before use it:  " + this.AMap)
            }
        }

    }

        customElements.define('custom-amap', ClassAMap)
    


   
})();
