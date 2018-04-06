//META{"name":"BetterEmoteSizes"}*//

class BetterEmoteSizes {
	
	constructor(){
		this.defaultSettings = {
			smallSize : 22,
			largeSize : 32,
			bdSize : 28,
			hoverSize : 2,
			transitionSpeed : 0.5
		};
		this.settings = this.defaultSettings;
	}
	
    getName() { return "Emote Zoom"; }
    getDescription() { return "Increases the size of emotes upon hovering over them."; }
    getVersion() { return "1.1.5"; }
    getAuthor() { return "Metalloriff"; }
	
	getSettingsPanel(){
		if(!$(".plugin-settings").length)
			setTimeout(e => { this.getSettingsPanel(e); }, 100);
		else
			this.createSettingsPanel();
	}

	createSettingsPanel(){
		var panel = $(".plugin-settings");
		if(panel.length){
			panel.append(`
				<h style="color: rgb(255, 255, 255); font-size: 30px; font-weight: bold;">Emote Zoom by Metalloriff</h>
				<br><br>

				<p style="color: rgb(255, 255, 255); font-size: 20px;">Small emote intial size (px):</p>
				<input id="ez-small-size" value="` + this.settings.smallSize + `" type="number" class="inputDefault-Y_U37D input-2YozMi size16-3IvaX_ multiInputField-3ZB4zY">

				<p style="color: rgb(255, 255, 255); font-size: 20px;">Large emote intial size (px):</p>
				<input id="ez-large-size" value="` + this.settings.largeSize + `" type="number" class="inputDefault-Y_U37D input-2YozMi size16-3IvaX_ multiInputField-3ZB4zY">

				<p style="color: rgb(255, 255, 255); font-size: 20px;">BD emote intial size (px):</p>
				<input id="ez-bd-size" value="` + this.settings.bdSize + `" type="number" class="inputDefault-Y_U37D input-2YozMi size16-3IvaX_ multiInputField-3ZB4zY">
				
				<p style="color: rgb(255, 255, 255); font-size: 20px;">Hover size multiplier:</p>
				<input id="ez-hover-size" value="` + this.settings.hoverSize + `" type="number" class="inputDefault-Y_U37D input-2YozMi size16-3IvaX_ multiInputField-3ZB4zY">

				<p style="color: rgb(255, 255, 255); font-size: 20px;">Transition speed (seconds):</p>
				<input id="ez-trans-speed" value="` + this.settings.transitionSpeed + `" type="number" class="inputDefault-Y_U37D input-2YozMi size16-3IvaX_ multiInputField-3ZB4zY">

				<div style="text-align: center;">
				<br>
				<button id="ez-reset-button" style="display: inline-block; margin-right: 25px;" type="button" class="button-2t3of8 lookFilled-luDKDo colorBrand-3PmwCE sizeMedium-2VGNaF grow-25YQ8u">
					<div class="contents-4L4hQM">Reset Settings</div>
				</button>
				<button id="ez-save-button" style="display: inline-block; margin-left: 25px;" type="button" class="button-2t3of8 lookFilled-luDKDo colorBrand-3PmwCE sizeMedium-2VGNaF grow-25YQ8u">
					<div class="contents-4L4hQM">Save and Apply</div>
				</button>
				</div>
			`);
			$("#ez-reset-button").on("click", () => {
				this.setings = this.defaultSettings;
				$("#ez-hover-size")[0].value = "2";
				$("#ez-trans-speed")[0].value = "0.5";
				$("#ez-small-size")[0].value = "22";
				$("#ez-large-size")[0].value = "32";
				$("#ez-bd-size")[0].value = "28";
			});
			$("#ez-save-button").on("click", () => {
				this.settings.hoverSize = $("#ez-hover-size")[0].value;
				this.settings.transitionSpeed = $("#ez-trans-speed")[0].value;
				this.settings.smallSize = $("#ez-small-size")[0].value;
				this.settings.largeSize = $("#ez-large-size")[0].value;
				this.settings.bdSize = $("#ez-bd-size")[0].value;
				this.saveSettings();
			});
		}else
			this.getSettingsPanel();
	}
	
	saveSettings(){
		PluginUtilities.saveSettings("BetterEmoteSizes", this.settings);
		this.update();
	}

    load() {}

    start(){
		var libraryScript = document.getElementById('zeresLibraryScript');
		if (!libraryScript) {
			libraryScript = document.createElement("script");
			libraryScript.setAttribute("type", "text/javascript");
			libraryScript.setAttribute("src", "https://rauenzi.github.io/BetterDiscordAddons/Plugins/PluginLibrary.js");
			libraryScript.setAttribute("id", "zeresLibraryScript");
			document.head.appendChild(libraryScript);
		}
		if (typeof window.ZeresLibrary !== "undefined") this.initialize();
		else libraryScript.addEventListener("load", () => { this.initialize(); });
	}
	
	initialize(){
		PluginUtilities.checkForUpdate(this.getName(), this.getVersion(), "https://github.com/Metalloriff/BetterDiscordPlugins/raw/master/BetterEmoteSizes.plugin.js");
		this.settings = PluginUtilities.loadSettings("BetterEmoteSizes", this.defaultSettings);
		this.update();
	}
	
	update(){
		BdApi.clearCSS("BetterEmoteSizes");
		BdApi.injectCSS("BetterEmoteSizes",
		`	.message-group .emoji, .emote {
				transform: scale(1);
				transition: transform ` + this.settings.transitionSpeed + `s;
			}

			.message-group .emoji:not(.jumboable) {
				min-height: ` + this.settings.smallSize + `px;
				min-width: ` + this.settings.smallSize + `px;
				height: ` + this.settings.smallSize + `px;
				width: ` + this.settings.smallSize + `px;
			}

			.message-group .emoji.jumboable {
				min-height: ` + this.settings.largeSize + `px;
				min-width: ` + this.settings.largeSize + `px;
				height: ` + this.settings.largeSize + `px;
				width: ` + this.settings.largeSize + `px;
			}

			.emote {
				height: ` + this.settings.bdSize + `px;
				width: ` + this.settings.bdSize + `px;
			}
			
			.message-group .emoji:hover, .emote:hover {
				transform: scale(` + this.settings.hoverSize + `);
				position: relative;
				z-index: 1;
			}
			
			.message-group.hide-overflow { overflow: visible; }
		`);
	}
	
    stop(){
		BdApi.clearCSS("BetterEmoteSizes");
	}
	
}
