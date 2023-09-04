(function()  {
    let tmpl = document.createElement('template');
    tmpl.innerHTML = `
		<style type="text/css">
			#allmap {
   				background-color: #ff00ff​;
   				width: 100%;
       			height: 100%;
       			
	   		}
		</style>
		
		<div id="allmap">
            		<table id="mytable">
            		</table>
        </div>
        <div id = "container"></div>
	 	
    `;

    customElements.define('com-sap-sample-geobaidu01', class GeoBaidu01 extends HTMLElement {


		constructor() {
			super(); 
			this._shadowRoot = this.attachShadow({mode: "open"});
			console.log("attachShadow in constructor");
            		this._shadowRoot.appendChild(tmpl.content.cloneNode(true));
			console.log("appendChild in constructor");
            		this._firstConnection = false;
			console.log("firstConnection is false");
		}

        //Fired when the widget is added to the html DOM of the page
        connectedCallback(){
            this._firstConnection = true;
		console.log("firstConnection");
            const resourceUrl = 'https://webapi.amap.com/loader.js';
		console.log("resourceUrl");
            const scriptElement = document.createElement('script');
		console.log("scriptElement");
            scriptElement.src = resourceUrl;

            scriptElement.addEventListener('load', () => {
		window._AMapSecurityConfig = {
                    securityJsCode:"e016b7c8a8df4e14e4e7ec322210f934",
                  }   
                AMapLoader.load({
                    key: '20acc0972699ca4133fbee84646f41b9',
                    version: '2.0', // or the version you need
                  }).then((AMap) => {

                  });
            });
		console.log("addEventListener end");
            this.shadowRoot.appendChild(scriptElement);
		console.log("appendChild");
            this.redraw();
		console.log("redraw");
        }

         //Fired when the widget is removed from the html DOM of the page (e.g. by hide)
        disconnectedCallback(){
        
        }

         //When the custom widget is updated, the Custom Widget SDK framework executes this function first
		onCustomWidgetBeforeUpdate(oChangedProperties) {

		}

        //When the custom widget is updated, the Custom Widget SDK framework executes this function after the update
		onCustomWidgetAfterUpdate(oChangedProperties) {
            if (this._firstConnection){
                this.redraw();
            }
        }
        
        //When the custom widget is removed from the canvas or the analytic application is closed
        onCustomWidgetDestroy(){
        }

        
        //When the custom widget is resized on the canvas, the Custom Widget SDK framework executes the following JavaScript function call on the custom widget
        // Commented out by default.  If it is enabled, SAP Analytics Cloud will track DOM size changes and call this callback as needed
        //  If you don't need to react to resizes, you can save CPU by leaving it uncommented.
        /*
        onCustomWidgetResize(width, height){
            redraw()
        }
        */

        redraw(){

   		
        	var mytable = this._shadowRoot.getElementById('mytable');
				
        	for(var i = 1; i <= 9; i++){
	            //create new tr tag
	            var tr = document.createElement('tr');
	            for(var j = 1; j <= i; j++){
	                //create new td tag
	                var td = document.createElement('td');
	                //add td to tr
	                td.innerText = i + "x" + j + "=" + (i * j);
	                tr.appendChild(td);
	            }
	            // add tr to table
	            mytable.appendChild(tr);
        	}
		
            const map = new AMap.Map('container', {
            viewMode: '2D',  // 默认使用 2D 模式
            zoom:11,  //初始化地图层级
            center: [116.397428, 39.90923]  //初始化地图中心点
            });
            
            
            // GL版命名空间为BMapGL
            // 按住鼠标右键，修改倾斜角和角度
            //var map = new BMapGL.Map(allmap);    // 创建Map实例
            //map.centerAndZoom(new BMapGL.Point(116.404, 39.915), 11);  // 初始化地图,设置中心点坐标和地图级别
            //map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放

        }
    });
})();
