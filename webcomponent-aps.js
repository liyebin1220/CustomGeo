(function () {
    var gPassedAPIkey;
    var gPassedSecurityKey;
    let tmpl = document.createElement("template");
    tmpl.innerHTML = `
      <style>
          fieldset {
              margin-bottom: 10px;
              border: 1px solid #afafaf;
              border-radius: 3px;
          }
          table {
              width: 100%;
          }
          input, textarea, select {
              font-family: "72",Arial,Helvetica,sans-serif;
              width: 100%;
              padding: 4px;
              box-sizing: border-box;
              border: 1px solid #bfbfbf;
          }
          input[type=checkbox] {
              width: inherit;
              margin: 6px 3px 6px 0;
              vertical-align: middle;
          }
          
      </style>
      <form id="form" autocomplete="off">
        <fieldset> 
          <legend>AMap Widget Properties</legend>
          <table>
            <tr>
              <td><label for="apikey">API Key:</label></td>
              <td><input id="apikey" name="apikey" type="text"></td>
            </tr>
            <tr>
              <td><label for="securityKey">securityKey:</label></td>
              <td><input id="securityKey" name="securityKey" type="text"></td>
            </tr>
            
          </table>
        </fieldset>
        <button type="submit" hidden>Submit</button>
      </form>
    `;

    class restAPIAps extends HTMLElement {
        constructor() {
            super();
            this._shadowRoot = this.attachShadow({ mode: "open" });
            this._shadowRoot.appendChild(tmpl.content.cloneNode(true));

            let form = this._shadowRoot.getElementById("form");
            form.addEventListener("submit", this._submit.bind(this));
            form.addEventListener("change", this._change.bind(this));
        }

        connectedCallback() {
        }

        _submit(e) {
            e.preventDefault();
            let properties = {};
            for (let name of restAPIAps.observedAttributes) {
                properties[name] = this[name];
            }
            console.log(properties);
            this._firePropertiesChanged(properties);
            return false;
            console.log("_submit(e) has been triggered")
        }
        _change(e) {
            this._changeProperty(e.target.name);
            console.log("_change(e) has been triggered")
        }
        _changeProperty(name) {
            let properties = {};
            properties[name] = this[name];
            this._firePropertiesChanged(properties);
            console.log("_changeProperty(name) has been triggered")
        }

        _firePropertiesChanged(properties) {
            this.dispatchEvent(new CustomEvent("propertiesChanged", {
                detail: {
                    properties: properties
                }
            }));
            console.log("_firePropertiesChanged(properties) has been triggered:", properties)
            console.log(this)
            //console.log("Trying to call onCustomWidgetAfterUpdate: ", this.onCustomWidgetAfterUpdate(properties))

        }

        get apikey() {
            console.log("will get apikey()")
            return this.getValue("apikey");
            
        }
        set apikey(value) {
            console.log("will set apikey")
            this.setValue("apikey", value);
            
        }

        get securityKey() {
            console.log("will get security key")
            return this.getValue("securityKey");
        }
        set securityKey(value) {
            console.log("will set security key")
            this.setValue("securityKey", value);
        
            
        } 
        

        getValue(id) {
            console.log("I don't know what's this: getValue(id)")
            return this._shadowRoot.getElementById(id).value;
        }
        setValue(id, value) {
            console.log("I don't know what's this: setValue(id)")
          console.log(id +":" + value);
            this._shadowRoot.getElementById(id).value = value;
        }

        static get observedAttributes() {
            console.log("static get observedAttributes()")
            return [
                "apikey",
                "securityKey"
            ];
        }

        attributeChangedCallback(name, oldValue, newValue) {
            console.log("attributeChangedCallback()")
            if (oldValue != newValue) {
                this[name] = newValue;
            }
        }
    }
    customElements.define("custom-base-amap-aps", restAPIAps);
})();