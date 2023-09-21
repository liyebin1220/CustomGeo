(function () {
    var apiKey;
    var securityCode;

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
              <td><label for="apiKey">API Key:</label></td>
              <td><input id="apiKey" name="apiKey" type="text"></td>
            </tr>
            <tr>
              <td><label for="securityCode">securityCode:</label></td>
              <td><input id="securityCode" name="securityCode" type="text"></td>
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
            console.log("constructor")

            let form = this._shadowRoot.getElementById("form");
            form.addEventListener("submit", this._submit.bind(this));
            form.addEventListener("change", this._change.bind(this));
        }

        connectedCallback() {
        }

        _submit(e) {
            e.preventDefault();
            this.dispatchEvent(new CustomEvent("propertiesChanged", {
                detail: {
                    properties: {
                        apiKey: this.apiKey,
                        securityCode: this.securityCode
                    }
                }
            }))
        }
        _change(e) {
            e.preventDefault();
            this.dispatchEvent(new CustomEvent("propertiesChanged", {
                detail: {
                    properties: {
                        apiKey: this.apiKey,
                        securityCode: this.securityCode
                    }
                }
            }))
        }

        get apiKey() {
            console.log("will get apiKey()")
            return this._shadowRoot.getElementById("apiKey").value;           
        }
        set apiKey(newAPIKey) {
            console.log("will set apikey()")
            this._shadowRoot.getElementById("apiKey").value = newAPIKey;           
        }

        get securityCode() {
            console.log("will get Security Code")
            return this._shadowRoot.getElementById("securityCode").value; 
        }
        set securityCode(newSecurityCode) {
            console.log("will set Security Code")
            this._shadowRoot.getElementById("securityCode").value = newSecurityCode; 
        }   
    
    }
    customElements.define("custom-base-amap-builder", restAPIAps);
})();