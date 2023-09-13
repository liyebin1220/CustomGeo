// Declare apiKey as a global variable
const apiKey = '20acc0972699ca4133fbee84646f41b9';
// Replace with your AMap API key and security code
const securityCode = 'e016b7c8a8df4e14e4e7ec322210f934';
var mapAMap = null;

(function() {

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
          .legend {
            width: 100px;
            position: absolute;
            left: 10px;
            bottom: 25px;
            background-color: #fff;
            border-radius: 5px;
            box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
            }
        
            .legend ul {
                overflow: hidden;
                list-style: none;
                margin: 0;
                padding: 0;
            }
        
            .legend ul li {
                float: left;
                height: 30px;
            }
        
            .legend ul li a {
                float: left;
                color: #555;
                font-size: 14px;
                text-decoration: none;
                height: 30px;
                line-height: 30px;
            }
        
            .legend ul li span {
                float: left;
                width: 14px;
                height: 14px;
                margin: 8px;
            }
        </style>
        <div id="btn" class="btn">
          <button id="btn1" class="drawAMap">Draw a map</button>
          <button id="btn2" class="drawAMap-district">District Map</button>
          <button id="btn3" class="drawAMap">Draw Map2.0</button>
          <button id="btn4" class="drawAMap">Init Map and UI</button>

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
            
            
            this.securityScriptLoad()
            this.apiScriptLoad()
            this.uiScriptLoad()
            this.initBtn(this)
            this.drawAMap()
        }

        securityScriptLoad() {

            const securityScript = document.createElement('script')
            securityScript.type = "text/javascript"
            securityScript.defer = true;
            securityScript.innerHTML = `
                window._AMapSecurityConfig = {
                securityJsCode: '${securityCode}',
              }
              console.log("Helloworld.")
              `
            console.log("securityScript has been created: ", securityScript)

            document.head.appendChild(securityScript);
        }

        apiScriptLoad() {
            const apiScript = document.createElement('script');

            apiScript.src = 'https://webapi.amap.com/loader.js';
            apiScript.defer = true;
            apiScript.addEventListener('load', () => {
            AMapLoader.load({
                key: apiKey,
                plugins: ['AMap.Scale','AMap.ToolBar','AMap.DistrictLayer', 'AMap.DistrictExplorer'],
            })})
            document.head.appendChild(apiScript);
        }

        uiScriptLoad() {
            
            const uiScript = document.createElement('script');
            uiScript.src = 'https://webapi.amap.com/ui/1.1/main.js?v=1.1.1';
            uiScript.defer = true;
            uiScript.addEventListener('load', () => {

                console.log("In uiScript: ", typeof AMapUI)
            })
            
            document.head.appendChild(uiScript);
        }

        initBtn(that) {

            const btnEl4 = this._shadowRoot.getElementById('btn4')

            btnEl4.onclick = function() {
                
               
                mapAMap = null;
                console.log("now your have clicked button 4.")  
                mapAMap = new AMap.Map(that._shadowRoot.getElementById('map-container'), { 
                        viewMode: '2D',
                        zoom:10,
                        center: [116.397428, 39.90923],
                        resizeEnable: true,                        
                    });
                console.log("mapAMap has been created: ", mapAMap)
                
                const uiScript = document.createElement('script');
                uiScript.src = 'https://webapi.amap.com/ui/1.1/main.js?v=1.1.1';
                uiScript.defer = true;
                uiScript.addEventListener('load', () => {
    
                console.log("AMapUI has been loaded: ", AMapUI)
                })
                
                document.head.appendChild(uiScript);
            
                };

                

            const btnEl1 = this._shadowRoot.getElementById('btn1')

            btnEl1.onclick = function() {
                
               
                mapAMap = null;
                console.log("now your have clicked button 1.")  
                mapAMap = new AMap.Map(that._shadowRoot.getElementById('map-container'), { 
                        viewMode: '2D',
                        zoom:10,
                        center: [116.397428, 39.90923],
                        resizeEnable: true,
                        version: 2.0
                    });
                
                };
            
            const btnEl2 = this._shadowRoot.getElementById('btn2')
                btnEl2.onclick = function() {

                

                //创建地图
                mapAMap = new AMap.Map(that._shadowRoot.getElementById('map-container'), {
                    zoom: 4
                });
                //just some colors
                var colors = [
                    "#3366cc", "#dc3912", "#ff9900", "#109618", "#990099", "#0099c6", "#dd4477", "#66aa00",
                    "#b82e2e", "#316395", "#994499", "#22aa99", "#aaaa11", "#6633cc", "#e67300", "#8b0707",
                    "#651067", "#329262", "#5574a6", "#3b3eac"
                ];
                                
                    AMapUI.load(['ui/geo/DistrictExplorer', 'lib/$'], function(DistrictExplorer, $) {

                        //创建一个实例
                        var districtExplorer = window.districtExplorer = new DistrictExplorer({
                            eventSupport: true, //打开事件支持
                            map: mapAMap
                        });
                
                        //当前聚焦的区域
                        var currentAreaNode = null;
                
                        //鼠标hover提示内容
                        var $tipMarkerContent = $('<div class="tipMarker top"></div>');
                
                        var tipMarker = new AMap.Marker({
                            content: $tipMarkerContent.get(0),
                            offset: new AMap.Pixel(0, 0),
                            bubble: true
                        });
                
                        //根据Hover状态设置相关样式
                        function toggleHoverFeature(feature, isHover, position) {
                
                            tipMarker.setMap(isHover ? mapAMap : null);
                
                            if (!feature) {
                                return;
                            }
                
                            var props = feature.properties;
                
                            if (isHover) {
                
                                //更新提示内容
                                $tipMarkerContent.html(props.adcode + ': ' + props.name);
                                //更新位置
                                tipMarker.setPosition(position || props.center);
                            }
                
                            $('#area-tree').find('h2[data-adcode="' + props.adcode + '"]').toggleClass('hover', isHover);
                
                            //更新相关多边形的样式
                            var polys = districtExplorer.findFeaturePolygonsByAdcode(props.adcode);
                            for (var i = 0, len = polys.length; i < len; i++) {
                
                                polys[i].setOptions({
                                    fillOpacity: isHover ? 0.5 : 0.2
                                });
                            }
                        }
                
                        //监听feature的hover事件
                        districtExplorer.on('featureMouseout featureMouseover', function(e, feature) {
                            toggleHoverFeature(feature, e.type === 'featureMouseover',
                                e.originalEvent ? e.originalEvent.lnglat : null);
                        });
                
                        //监听鼠标在feature上滑动
                        districtExplorer.on('featureMousemove', function(e, feature) {
                            //更新提示位置
                            tipMarker.setPosition(e.originalEvent.lnglat);
                        });
                
                        //feature被点击
                        districtExplorer.on('featureClick', function(e, feature) {
                
                            var props = feature.properties;
                            //如果存在子节点
                            // if (props.childrenNum > 0) {
                                //切换聚焦区域
                                switch2AreaNode(props.adcode);
                            // }
                        });
                
                        //外部区域被点击
                        districtExplorer.on('outsideClick', function(e) {
                
                            districtExplorer.locatePosition(e.originalEvent.lnglat, function(error, routeFeatures) {
                
                                if (routeFeatures && routeFeatures.length > 1) {
                                    //切换到省级区域
                                    switch2AreaNode(routeFeatures[1].properties.adcode);
                                } else {
                                    //切换到全国
                                    switch2AreaNode(100000);
                                }
                
                            }, {
                                levelLimit: 2
                            });
                        });
                
                        //绘制区域面板的节点
                        function renderAreaPanelNode(ele, props, color) {
                
                            var $box = $('<li/>').addClass('lv_' + props.level);
                
                            var $h2 = $('<h2/>').addClass('lv_' + props.level).attr({
                                'data-adcode': props.adcode,
                                'data-level': props.level,
                                'data-children-num': props.childrenNum || void(0),
                                'data-center': props.center.join(',')
                            }).html(props.name).appendTo($box);
                
                            if (color) {
                                $h2.css('borderColor', color);
                            }
                
                            //如果存在子节点
                            if (props.childrenNum > 0) {
                
                                //显示隐藏
                                $('<div class="showHideBtn"></div>').appendTo($box);
                
                                //子区域列表
                                $('<ul/>').addClass('sublist lv_' + props.level).appendTo($box);
                
                                $('<div class="clear"></div>').appendTo($box);
                
                                if (props.level !== 'country') {
                                    $box.addClass('hide-sub');
                                }
                            }
                
                            $box.appendTo(ele);
                        }
                
                
                        //填充某个节点的子区域列表
                        function renderAreaPanel(areaNode) {
                
                            var props = areaNode.getProps();
                
                            var $subBox = $('#area-tree').find('h2[data-adcode="' + props.adcode + '"]').siblings('ul.sublist');
                
                            if (!$subBox.length && props.childrenNum) {
                                //父节点不存在，先创建
                                renderAreaPanelNode($('#area-tree'), props);
                                $subBox = $('#area-tree').find('ul.sublist');
                            }
                            if ($subBox.attr('data-loaded') === 'rendered') {
                                return;
                            }
                
                            $subBox.attr('data-loaded', 'rendered');
                
                            var subFeatures = areaNode.getSubFeatures();
                
                            //填充子区域
                            for (var i = 0, len = subFeatures.length; i < len; i++) {
                                renderAreaPanelNode($subBox, areaNode.getPropsOfFeature(subFeatures[i]), colors[i % colors.length]);
                            }
                        }
                
                        //绘制某个区域的边界
                        function renderAreaPolygons(areaNode) {
                            //更新地图视野
                            mapAMap.setBounds(areaNode.getBounds(), null, null, true);
                
                            //清除已有的绘制内容
                            districtExplorer.clearFeaturePolygons();
                
                            //绘制子区域
                            districtExplorer.renderSubFeatures(areaNode, function(feature, i) {
                
                                var fillColor = colors[i % colors.length];
                                var strokeColor = colors[colors.length - 1 - i % colors.length];
                
                                return {
                                    cursor: 'default',
                                    bubble: true,
                                    strokeColor: strokeColor, //线颜色
                                    strokeOpacity: 1, //线透明度
                                    strokeWeight: 1, //线宽
                                    fillColor: fillColor, //填充色
                                    fillOpacity: 0.35, //填充透明度
                                };
                            });
                
                            //绘制父区域
                            districtExplorer.renderParentFeature(areaNode, {
                                cursor: 'default',
                                bubble: true,
                                strokeColor: 'black', //线颜色
                                strokeOpacity: 1, //线透明度
                                strokeWeight: 1, //线宽
                                fillColor: areaNode.getSubFeatures().length ? null : colors[0], //填充色
                                fillOpacity: 0.35, //填充透明度
                            });
                        }
                
                        //切换区域后刷新显示内容
                        function refreshAreaNode(areaNode) {
                
                            districtExplorer.setHoverFeature(null);
                
                            renderAreaPolygons(areaNode);
                
                            //更新选中节点的class
                            var $nodeEles = $('#area-tree').find('h2');
                
                            $nodeEles.removeClass('selected');
                
                            var $selectedNode = $nodeEles.filter('h2[data-adcode=' + areaNode.getAdcode() + ']').addClass('selected');
                
                            //展开下层节点
                            $selectedNode.closest('li').removeClass('hide-sub');
                
                            //折叠下层的子节点
                            $selectedNode.siblings('ul.sublist').children().addClass('hide-sub');
                        }
                
                        //切换区域
                        function switch2AreaNode(adcode, callback) {
                
                            if (currentAreaNode && ('' + currentAreaNode.getAdcode() === '' + adcode)) {
                                return;
                            }
                
                            loadAreaNode(adcode, function(error, areaNode) {
                
                                if (error) {
                
                                    if (callback) {
                                        callback(error);
                                    }
                
                                    return;
                                }
                
                                currentAreaNode = window.currentAreaNode = areaNode;
                
                                //设置当前使用的定位用节点
                                districtExplorer.setAreaNodesForLocating([currentAreaNode]);
                
                                refreshAreaNode(areaNode);
                
                                if (callback) {
                                    callback(null, areaNode);
                                }
                            });
                        }
                
                        //加载区域
                        function loadAreaNode(adcode, callback) {
                
                            districtExplorer.loadAreaNode(adcode, function(error, areaNode) {
                
                                if (error) {
                
                                    if (callback) {
                                        callback(error);
                                    }
                
                                    console.error(error);
                
                                    return;
                                }
                
                                renderAreaPanel(areaNode);
                
                                if (callback) {
                                    callback(null, areaNode);
                                }
                            });
                        }
                
                        $('#area-tree').on('mouseenter mouseleave', 'h2[data-adcode]', function(e) {
                
                            if (e.type === 'mouseleave') {
                                districtExplorer.setHoverFeature(null);
                                return;
                            }
                
                            var adcode = $(this).attr('data-adcode');
                
                            districtExplorer.setHoverFeature(currentAreaNode.getSubFeatureByAdcode(adcode));
                        });
                
                
                        $('#area-tree').on('click', 'h2', function() {
                            var adcode = $(this).attr('data-adcode');
                            switch2AreaNode(adcode);
                        });
                
                        $('#area-tree').on('click', '.showHideBtn', function() {
                
                            var $li = $(this).closest('li');
                
                            $li.toggleClass('hide-sub');
                
                            if (!$li.hasClass('hide-sub')) {
                
                                //子节点列表被展开
                                var $subList = $li.children('ul.sublist');
                
                                //尚未加载
                                if (!$subList.attr('data-loaded')) {
                
                                    $subList.attr('data-loaded', 'loading');
                
                                    $li.addClass('loading');
                
                                    //加载
                                    loadAreaNode($li.children('h2').attr('data-adcode'), function() {
                
                                        $li.removeClass('loading');
                                    });
                                }
                            }
                        });
                
                        //全国
                        switch2AreaNode(100000);
                        });
                  

                }
            
            const btnEl3 = this._shadowRoot.getElementById('btn3')

            btnEl3.onclick = function(mapAMap) {
                mapAMap = null;
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
                        version: 2.0
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
