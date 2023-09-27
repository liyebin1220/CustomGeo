/* var getScriptPromisify = (src) => {
    console.log(src)
    return new Promise((resolve) => {
      $.getScript(src, resolve);
    });
  }; */
(function() {
    // Declare for databinding props.
    var this_props = null
    // Declare apiKey as a global variable
    var apiKey = '20acc0972699ca4133fbee84646f41b9';
    // Replace with your AMap API key and security code
    var securityCode = 'e016b7c8a8df4e14e4e7ec322210f934';
    //parsing databinding start
    const parseMetadata = metadata => {
        const { dimensions: dimensionsMap, mainStructureMembers: measuresMap } = metadata
        const dimensions = []
        for (const key in dimensionsMap) {
          const dimension = dimensionsMap[key]
          dimensions.push({ key, ...dimension })
        }
        const measures = []
        for (const key in measuresMap) {
          const measure = measuresMap[key]
          measures.push({ key, ...measure })
        }
        console.log(metadata)
        console.log(dimensions)
        console.log(measures)
        console.log(dimensionsMap)
        console.log(measuresMap)
        return { dimensions, measures, dimensionsMap, measuresMap }
      }
    //parsing databinding end
    let tmpl = document.createElement('template');
    tmpl.innerHTML = `   
        
        <link rel="stylesheet" type="text/css" href="https://a.amap.com/jsapi_demos/static/demo-center/css/prety-json.css">
        <link rel="stylesheet" type="text/css" href="https://webapi.amap.com/ui/1.1/ui/geo/DistrictExplorer/examples/area.css">     
		<style>
          /* Add any custom CSS styles here */
          .map-container {
            background-color: #777799;
            border: 0cap;
            width: 1200px;
            height:900px
          }       
          .info hr {
            margin-right: 0;
            margin-left: 0;
            border-top-color: grey;
          }
          
          .info {
            padding: .75rem 1.25rem;
            margin-bottom: 1rem;
            border-radius: .25rem;
            position: fixed;
            bottom: 1rem;
            background-color: white;
            width: auto;
            min-width: 10rem;
            border-width: 0;
            left: 1rem;
            box-shadow: 0 2px 6px 0 rgba(114, 124, 245, .5);
          }
        </style>
        <div class="box">
            
            <div id="map-container" class="map-container" tabindex="0"></div>
            <div class="info">
                <h5>当前地图状态（Status）</h5>
                <p><span id="map-status">OK</span></p>
            </div>
        </div>    
    `;
    // Drawing the base boxes.

    class ClassAMap extends HTMLElement {

        constructor() {
            super() //调用父类HTMLElement构造函数，写在this 前面
            this._shadowRoot = this.attachShadow({mode: "open"});
            this._shadowRoot.appendChild(tmpl.content.cloneNode(true)); 
            var container = this._shadowRoot.getElementById('map-container')
            var map_status = this._shadowRoot.getElementById('map-status')
            console.log(map_status.innerText)

            this._props = {}
            this._amap = {}                        
            this.apikeyScriptLoad(container, map_status)          
        }
        //以下定义的方法均为实例方法，默认写入ClassAMap 的显示原型中。只能通过创建好的对象来访问
        
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
            this_props = this._props
        }       

        apikeyScriptLoad(container, map_status) {
            const apiScript = document.createElement('script');

            apiScript.src = 'https://webapi.amap.com/loader.js';
            apiScript.defer = true;
            apiScript.addEventListener('load', () => {
            AMapLoader.load({
                key: apiKey,
                "plugins": [],
                "AMapUI": {                                 // 是否加载 AMapUI，缺省不加载
                  "version": '1.1',                         // AMapUI 版本
                },
                dragEnable: true,
            }).then((AMap)=>{
                var  mapAMap = new AMap.Map(container, { 
                    viewMode: '2D',
                    zoom:4,
                    center: [116.397428, 39.90923],
                    resizeEnable: true
                });
                this._amap = mapAMap
                renderAMapDistrict(mapAMap) 
                          
              }
              
            )
          
          })  
            document.head.appendChild(apiScript);
            this._ready = true

            function renderAMapDistrict(map) {
                let { data, metadata } = this_props.myDataBinding
                const { dimensions, measures } = parseMetadata(metadata)
                console.log("dimensions: ", dimensions)
                console.log("measures", measures)
    
                const [dimension] = dimensions
                const [measure] = measures

                var colors = [
                    "#3366cc", "#dc3912", "#ff9900", "#109618", "#990099", "#0099c6", "#dd4477", "#66aa00",
                    "#b82e2e", "#316395", "#994499", "#22aa99", "#aaaa11", "#6633cc", "#e67300", "#8b0707",
                    "#651067", "#329262", "#5574a6", "#3b3eac"
                ];

                AMapUI.load(['ui/geo/DistrictExplorer', 'lib/$'], function(DistrictExplorer, $) {
                //---------------------------------------------------------------------
                var mapOpts = {}
                //---------------------------------------------------------------------

                    var districtExplorer = window.districtExplorer = new DistrictExplorer({
                        eventSupport: true, //打开事件支持
                        map: map
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
                    tipMarker.setMap(isHover ? map : null);
                    if (!feature) {
                        return;
                    }
                    var props = feature.properties;
                    //console.log(props.center)
                    
                    if (isHover) { 
                        //更新提示内容
                        $tipMarkerContent.html(props.adcode + ': ' + props.name);
                        //更新位置
                        tipMarker.setPosition(position || props.center);
                        mapOpts.lng = position.lng
                        mapOpts.lat = position.lat
                        mapOpts.adcode = props.adcode
                        mapOpts.name = props.name
                        map_status.innerHTML = `<p><h5>`+mapOpts.name+`</h5></p>
                                                <p><h5>`+mapOpts.adcode+`</h5></p>
                                                <p><h5>`+mapOpts.lng+`</h5></p>
                                                <p><h5>`+mapOpts.lat+`</h5></p>
                                                `
                    }

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
                        if(e.type === 'featureMouseout') {
                            mapOpts = {}
                            map_status.innerText = ''

                        }
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
                         //if (props.childrenNum = 0) {
                            //切换聚焦区域
                            switch2AreaNode(props.adcode);
                         //}

                         tipMarker.setPosition(e.originalEvent.lnglat);
                         const key = dimension.key;
                        console.log("dimension.key: ", dimension.key)
                        
                        const dimensionId = dimension.id;
                        console.log("dimension.id: ", dimension.id)
                        console.log("this_props: ", this_props)
                        console.log("this_props.myDataBinding: ", this_props.myDataBinding)
                        console.log("this_props.myDataBinding.data: ", this_props.myDataBinding.data)
                        console.log("props.adcode: ", props.adcode)
                        const selectedItem = this_props.myDataBinding.data.find(item => item[key].label === props.adcode.toString());
                        console.log("selectedItem: ", selectedItem)
                
                        const linkedAnalysis = this_props['dataBindings'].getDataBinding('myDataBinding').getLinkedAnalysis();
                        if (selectedItem) {
                          const selection = {};
                          selection[dimensionId] = selectedItem[key].id; //Creating an Object and grant a value selectedItem[key].id to item "dimensionId": product
                          console.log("selectedItem[key].id: ", selectedItem[key].id)
                          console.log("selection: ", selection)
                          linkedAnalysis.setFilters(selection)
                        } else {
                          linkedAnalysis.removeFilters();
                        }

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

                        //[函数定义]绘制某个区域的边界
                        function renderAreaPolygons(map, areaNode) {
                            //更新地图视野
                            map.setBounds(areaNode.getBounds(), null, null, true);
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

                        //[函数定义]切换区域后刷新显示内容
                        function refreshAreaNode(map, areaNode) {
                            districtExplorer.setHoverFeature(null);
                            renderAreaPolygons(map, areaNode);
                        }

                        //【函数定义】切换区域
                        function switch2AreaNode(adcode, callback) {
                            console.log("switch2AreaNode: ", adcode)
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
                                //渲染地图,刷新地图
                                refreshAreaNode(map, areaNode);
                                if (callback) {
                                    callback(null, areaNode);
                                }
                            });
                        }

                        //【函数定义】加载区域地图
                        function loadAreaNode(adcode, callback) {
                            districtExplorer.loadAreaNode(adcode, function(error, areaNode) {                    
                                if (error) {
                                    if (callback) {
                                        callback(error);
                                    }
                                    console.error(error);
                                    return;
                                }

                                if (callback) {
                                    callback(null, areaNode);
                                }
                            });
                        }
                        switch2AreaNode(100000);
                })
            }               
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

        onCustomWidgetAfterUpdate(changedProperties) 
        {
            if (("myDataBinding" in changedProperties)) {
                //this._updateData(changedProperties.myDataBinding)
            }
            console.log("changedProperties: ", changedProperties)     
        }
    }

    customElements.define('custom-amap-linkedana', ClassAMap)
})();