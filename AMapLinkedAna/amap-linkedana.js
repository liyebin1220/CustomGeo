(function() {

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
    // Declare apiKey as a global variable
    var apiKey = '20acc0972699ca4133fbee84646f41b9';
    // Replace with your AMap API key and security code
    var securityCode = 'e016b7c8a8df4e14e4e7ec322210f934';

    var tmpAMap = null;

    var transformedData = null;

    var theprops = null;

    let tmpl = document.createElement('template');
    tmpl.innerHTML = `
        <link rel="stylesheet" type="text/css" href="//webapi.amap.com/ui/1.1/ui/geo/DistrictExplorer/examples/area.css">
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
            this.uiScriptLoad()
            this.liteToolbarScriptLoad()
            this.securityScriptLoad()
            this.apikeyScriptLoad()
        }

        capitalScriptLoad() {

            const capitalScript = document.createElement('script')
            capitalScript.type = "text/javascript"
            capitalScript.src = 'https://a.amap.com/jsapi_demos/static/resource/capitals.js';
            document.head.appendChild(capitalScript);
        }
        uiScriptLoad() {

            const uiScript = document.createElement('script')
            uiScript.type = "text/javascript"
            uiScript.src = 'https://webapi.amap.com/ui/1.1/main.js?v=1.1.1';
            document.head.appendChild(uiScript);

            console.log("uiScriptLoad()")
        }
        liteToolbarScriptLoad() {

            const liteToolbarScript = document.createElement('script')
            liteToolbarScript.type = "text/javascript"
            liteToolbarScript.src = 'https://webapi.amap.com/demos/js/liteToolbar.js?v=1.0.11"';
            document.head.appendChild(liteToolbarScript);
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
            theprops = this._props;
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
                        center: [121.51194, 31.23921],
                        zoom:4
                    });

            var theDataBinding = this._props.myDataBinding
            
            if (!theDataBinding) {
                console.error(this, 'theDataBinding is undefined');
            }
            if (!theDataBinding || !theDataBinding.data) {
                console.error(this, 'theDataBinding.data is undefined');
            }
            
            if (this._ready) {
            //if (false) {
                // Check if theDataBinding and theDataBinding.data are defined
                if (theDataBinding && Array.isArray(theDataBinding.data)) {
                    // Transform the data into the correct format
                    transformedData = theDataBinding.data.map(row => {
                        //console.log('row:', row);
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
                    /* for(var i = 0; i < transformedData.length; i += 1){
                        var center = new Array(transformedData[i].kfg_log, transformedData[i].kfg_lat) 
                        
                        var circleMarker = new AMap.CircleMarker({
                          center:center,
                          radius:10 + transformedData[i].kfg_revenue/5000000,
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
                        circleMarker.setMap(mapAMap)
                      } */
                    } else {
                    console.error('Data is not an array:', theDataBinding && theDataBinding.data);
                }
            }
        
            tmpAMap = mapAMap;
        }

        createAMapDistrict() {

            let { data, metadata } = this._props.myDataBinding
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
                //创建一个实例
                var districtExplorer = window.districtExplorer = new DistrictExplorer({
                    eventSupport: true, //打开事件支持
                    map: tmpAMap
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
                    tipMarker.setMap(isHover ? tmpAMap : null);
                    if (!feature) {
                        return;
                    }
                    var props = feature.properties;
                    
                    if (isHover) { 
                        //更新提示内容
                        $tipMarkerContent.html(props.adcode + ': ' + props.name + "  营收:" + transformedData.find(object => object.dim_adcode === props.adcode.toString()).kfg_revenue);
                        //更新位置
                        tipMarker.setPosition(position || props.center);
                    }
                    /*$('#area-tree').find('h2[data-adcode="' + props.adcode + '"]').toggleClass('hover', isHover); */
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
                            //switch2AreaNode(props.adcode);
                        // }
                        const key = dimension.key;
                        console.log("dimension.key: ", dimension.key)
                        
                        const dimensionId = dimension.id;
                        console.log("dimension.id: ", dimension.id)
                
                        const selectedItem = theprops.myDataBinding.data.find(item => item[key].label === props.adcode);
                        console.log("selectedItem: ", selectedItem)
                
                        const linkedAnalysis = theprops['dataBindings'].getDataBinding('dataBinding').getLinkedAnalysis();
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
                            tmpAMap.setBounds(areaNode.getBounds(), null, null, true);

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

                        /* $('#area-tree').on('mouseenter mouseleave', 'h2[data-adcode]', function(e) {

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
                        }); */

                        //全国
                        switch2AreaNode(100000);
                    })   
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
            if (("myDataBinding" in changedProperties)) {
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
                          radius:10 + transformedData[i].kfg_revenue/5000000,
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

    customElements.define('custom-amap-linkedana', ClassAMap)
})();