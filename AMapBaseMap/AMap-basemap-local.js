(function() {

    const apiKey = '20acc0972699ca4133fbee84646f41b9';

    let tmpl = document.createElement('template');
    tmpl.innerHTML = `
		<style>
          /* Add any custom CSS styles here */
          .map-container {
            background-color: #777799;
            border: 0cap;
            width: 1000px;
            height:600px
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
        <div id="root" style=width: 100%; height: 100%">
            <div id="map-container" class="map-container"></div>
        </div>
    `;
    // Drawing the base boxes.

    // contextMenu: right click menu
    class ContextMenu {
        constructor(map) {
            this.contextMenuPosition = null;
            this.content = []
            this.fillContent(map)
            //通过content自定义右键菜单内容
            this.contextMenu = new AMap.ContextMenu({isCustom: true, content: this.content.join('')});            

            this.openContextMenu(map)
        }

        fillContent(map) {
            let me = this
            console.log(this)
            this.content.push("<div class='context_menu'>");
            this.content.push(`  <p id='zoomIn' onclick=''>Zoom in</p>`);
            this.content.push("  <p id='zoomOut'onclick=''>Zoom out</p>");              
            this.content.push("</div>");           
        }

        openContextMenu(map) {
            let me = this
            map.on('rightclick', function(e){
                me.contextMenu.open(map, e.lnglat);
                me.contextMenuPosition = e.lnglat;
            })
        }  

        zoomMenu(map, tag) {
            if (tag === 0) {
                map.zoomOut();
            }
            if (tag === 1) {
                map.zoomIn();
            }

            this.contextMenu.close();
        }
    }
    //contextMenu: end

    class ClassAMap extends HTMLElement {

        constructor() {
            super()
            this._shadowRoot = this.attachShadow({mode: "open"});
            this._shadowRoot.appendChild(tmpl.content.cloneNode(true)); 

            const container = this._shadowRoot.getElementById('map-container')
            this.newAMap = null
            this.menu = null
            this.amapInit(container)

        }
  
        amapInit(container) {       
            //load AMap loader scripts with api key
            const apiScript = document.createElement('script');
  
            apiScript.src = 'https://webapi.amap.com/loader.js';
            apiScript.defer = true;
            document.head.appendChild(apiScript);

            apiScript.addEventListener('load', () => {
                AMapLoader.load({ // AMapLoader.load will return a new Promise object
                    key: apiKey,
                    "AMapUI": {             
                    "version": '1.1', 
                    },
                }).then(() => {
                    //AMap initialization
                    this.newAMap = new AMap.Map(container, {
                        zoom: 4,
                        resizeEnable: true
                    });
                    // AMap initialization - end
                    // Right click
                    this.menu = new ContextMenu(this.newAMap);
                    //
                })        
          })  
            

            //load AMap loader scripts with api key - end
        }   
    }
    customElements.define('cust-base-amap', ClassAMap)
})();