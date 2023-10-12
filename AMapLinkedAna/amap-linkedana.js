/* var getScriptPromisify = (src) => {
    console.log(src)
    return new Promise((resolve) => {
      $.getScript(src, resolve);
    });
  }; */
(function() {
    // Declare for databinding props.
    var this_props = null
    // for context menu
    var menu = null
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
    // contextMenu: right click menu
    class ContextMenu {
        constructor(map, e) {
            this.content = []
            this.fillContent()
            //通过content自定义右键菜单内容
            this.contextMenu = new AMap.ContextMenu({isCustom: true, content: this.content.join('')});
        }

        fillContent() {
            this.content.push("<div class='context_menu'>");
            this.content.push("  <p id='drilldown' onclick='menu.drillDown()'>下钻(Drill Down)</p>");
            this.content.push("  <p id='drillup'onclick='menu.drillUp()'>上钻(Drill Up)</p>");              
            this.content.push("</div>");
        }

        openContextMenu(map, lnglat) {
            this.contextMenu.open(map, lnglat);
        }  
        drillDown() {
            console.log("drillDown in Class.")
        }

        drillUp() {
            console.log("drillUp in Class.")
        }
    }
    //contextMenu: end
    let tmpl = document.createElement('template');
    tmpl.innerHTML = `  
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
            bottom: 2rem;
            background-color: white;
            width: auto;
            min-width: 10rem;
            border-width: 0;
            left: 1rem;
            font-size: 9px;
            box-shadow: 0 2px 6px 0 rgba(114, 124, 245, .5);
        }
        .context_menu {
            position: fixed;
            min-width: 12rem;
            padding: 0;
            margin-bottom: 1rem;
            background-color: white;
            border-radius: .25rem;
            bottom: 2rem;
            width: 10rem;
            border-width: 0;
            right: 1rem;
            box-shadow: 0 2px 6px 0 rgba(114, 124, 245, .5);
        }
        .context_menu p{
            cursor: pointer;
            padding: 0.25rem 1.25rem;
            font-size: 9px;
            }

            .context_menu p:hover{
            background: #ccc;
            }

        </style>
        <div class="box">
            
            <div id="map-container" class="map-container" tabindex="0"></div>
            <div class="info">
                <h4> Status </h4>
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
                plugins:[],
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

                    //根据Hover状态设置相关样式
                function toggleHoverFeature(feature, isHover, position) {
                    if (!feature) {
                        return;
                    }
                    var props = feature.properties;
                    
                    if (isHover) { 
                        // feching data
                        const key = dimension.key;
                        const raw = measure.key;
                        const selectedItem = this_props.myDataBinding.data.find(item => item[key].label === props.adcode.toString());
                        if (selectedItem) {
                          mapOpts.revenue = Math.round(selectedItem[raw].raw)
                        } else {
                          mapOpts.revenue = 0
                        }
                        // feching data
                        //更新提示内容

                        mapOpts.adcode = props.adcode
                        mapOpts.name = props.name
                        map_status.innerHTML = `<p><h5>地区：`+mapOpts.name+`</h5></p>
                                                <p><h5>编码：`+mapOpts.adcode+`</h5></p>
                                                <p><h5>收入：`+mapOpts.revenue+`</h5></p>
                                                `
                    }
                    
                    //更新相关多边形的样式
                    var polys = districtExplorer.findFeaturePolygonsByAdcode(props.adcode);
                    for (var i = 0, len = polys.length; i < len; i++) {

                        let fillOpacity = polys[i].getOptions().fillOpacity                        

                        polys[i].setOptions({
                            fillOpacity: isHover ? fillOpacity * 1.5 : fillOpacity / 1.5
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
                        //目前没有滑动事件设置
                    });

                    //feature被点击
                    districtExplorer.on('featureClick', function(e, feature) {
                        if(menu) {
                            menu.contextMenu.close()
                            menu = null
                        }
                        window.menu = menu = new ContextMenu(map)
                        var props = feature.properties;
                        //如果存在子节点
                         //if (props.childrenNum = 0) {
                            //切换聚焦区域
                            //switch2AreaNode(props.adcode);
                         //}

                         //linked analysis block
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
                        //linked analysis block
                        // right click context menu
                        menu.openContextMenu(map,e.originalEvent.lnglat)

                            if (props.childrenNum >= 0) {
                                menu.drillDown = function() {                                
                                    switch2AreaNode(props.adcode);                               
                                    this.contextMenu.close();
                                };
                            } else {
                                console.log("initial a blank Func.")
                                menu.drillDown = function() {                                                            
                                    this.contextMenu.close();
                                }
                            }
                            var j = 1
                            var _adcode = null
                            districtExplorer.locatePosition(e.originalEvent.lnglat, function(error, routeFeatures) {
                                if (routeFeatures && routeFeatures.length > 1) {
                                    //切换
                                    if(props.adcode === routeFeatures[0].properties.adcode) {
                                        _adcode = routeFeatures[0].properties.adcode
                                  
                                    } else if(props.adcode === routeFeatures[1].properties.adcode) {
                                        _adcode = routeFeatures[0].properties.adcode

                                    } else if(props.adcode === routeFeatures[2].properties.adcode && currentAreaNode.adcode === routeFeatures[1].properties.adcode) {
                                        _adcode = routeFeatures[0].properties.adcode

                                    } else if(props.adcode === routeFeatures[3].properties.adcode && currentAreaNode.adcode === routeFeatures[2].properties.adcode) {
                                        _adcode = routeFeatures[1].properties.adcode

                                    } else if(props.adcode === routeFeatures[3].properties.adcode && currentAreaNode.adcode === routeFeatures[3].properties.adcode) {
                                        _adcode = routeFeatures[2].properties.adcode

                                    }                                     
                                } 
                            }, {
                                levelLimit: 4
                            });
                            menu.drillUp = function() {                                
                                switch2AreaNode(_adcode);
                                this.contextMenu.close();
                            }  
                        //right click context menu - end

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
                                // feching data
                                const props = feature.properties;
                                const key = dimension.key;
                                const raw = measure.key;
                                const selectedItem = this_props.myDataBinding.data.find(item => item[key].label === props.adcode.toString());
                                let revenue = 0
                                let fillOpacity = 0.2
                                if (selectedItem) {
                                    revenue = selectedItem[raw].raw
                                    fillOpacity = revenue / 100000000
                                } 
                                
                                // feching data
                                var fillColor = colors[1];
                                
                                var strokeColor = colors[colors.length - 1 - i % colors.length];
                                
                                return {
                                    cursor: 'default',
                                    bubble: true,
                                    strokeColor: strokeColor, //线颜色
                                    strokeOpacity: 1, //线透明度
                                    strokeWeight: 0.1, //线宽
                                    fillColor: fillColor, //填充色
                                    fillOpacity: fillOpacity, //填充透明度
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

                            map.setFitView(districtExplorer.getAllFeaturePolygons());
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