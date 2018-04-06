//META{"name":"PermissionsViewer","pname":"PermissionsViewer"}*//

/* global DiscordPermissions:false, ReactUtilities:false, InternalUtilities:false, ColorUtilities:false, PluginUtilities:false, PluginSettings:false, BdApi:false */

class PermissionsViewer {
	getName() { return "PermissionsViewer"; }
	getShortName() { return "PermissionsViewer"; }
	getDescription() { return "Allows you to view a user's permissions. Thanks to Noodlebox for the idea! Support Server: bit.ly/ZeresServer"; }
	getVersion() { return "0.0.12"; }
	getAuthor() { return "Zerebos"; }
	
	constructor() {
		this.css = `/* PermissionsViewer */
		.member-perms-header {
			display: flex;
		}

		.member-perms {
			display: flex;
			flex-wrap: wrap;
			margin-top: 2px;
			max-height: 160px;
			overflow-y: auto;
		}
		
		.member-perms .member-perm {
			display: flex;
			align-items: center;
			font-size: 12px;
			font-weight: 600;
			border: 1px solid;
			border-radius: 11px;
			box-sizing: border-box;
			height: 22px;
			margin: 0 4px 4px 0;
			padding: 4px;
		}

		.member-perms .member-perm .perm-circle {
			border-radius: 50%;
			height: 12px;
			margin-right: 4px;
			width: 12px;
		}

		.member-perms .member-perm .name {
			margin-right: 4px;
			max-width: 200px;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}

		.perm-details-button {
			cursor: pointer;
			height: 12px;
		}

		.perm-details {
			flex: 1;
			display: flex;
			justify-content: flex-end;
		}

		.member-perm-details {
			cursor: pointer;
		}

		.member-perm-details-button {
			fill: #72767d;
			height: 10px;
		}

		/* Modal */

		@keyframes permissions-backdrop {
			to { opacity: 0.85; }
		}

		@keyframes permissions-modal-wrapper {
			to { transform: scale(1); opacity: 1; }
		}

		@keyframes permissions-backdrop-closing {
			to { opacity: 0; }
		}

		@keyframes permissions-modal-wrapper-closing {
			to { transform: scale(0.7); opacity: 0; }
		}

		#permissions-modal-wrapper .callout-backdrop {
			animation: permissions-backdrop 250ms ease;
			animation-fill-mode: forwards;
			opacity: 0;
			background-color: rgb(0, 0, 0);
			transform: translateZ(0px);
		}

		#permissions-modal-wrapper.closing .callout-backdrop {
			animation: permissions-backdrop-closing 200ms linear;
			animation-fill-mode: forwards;
			animation-delay: 50ms;
			opacity: 0.85;
		}

		#permissions-modal-wrapper.closing .modal-wrapper {
			animation: permissions-modal-wrapper-closing 250ms cubic-bezier(0.19, 1, 0.22, 1);
			animation-fill-mode: forwards;
			opacity: 1;
			transform: scale(1);
		}

		#permissions-modal-wrapper .modal-wrapper {
			animation: permissions-modal-wrapper 250ms cubic-bezier(0.175, 0.885, 0.32, 1.275);
			animation-fill-mode: forwards;
			transform: scale(0.7);
			transform-origin: 50% 50%;
			display: flex;
			align-items: center;
			box-sizing: border-box;
			contain: content;
			justify-content: center;
			top: 0;
			left: 0;
			bottom: 0;
			right: 0;
			opacity: 0;
			pointer-events: none;
			position: absolute;
			user-select: none;
			z-index: 1000;
		}

		#permissions-modal-wrapper .modal-body {
			background-color: #36393f;
			height: 440px;
			width: auto;
			/*box-shadow: 0 0 0 1px rgba(32,34,37,.6), 0 2px 10px 0 rgba(0,0,0,.2);*/
			flex-direction: row;
			overflow: hidden;
			display: flex;
			flex: 1;
			contain: layout;
			position: relative;
		}

		#permissions-modal-wrapper #permissions-modal {
			display: flex;
			contain: layout;
			flex-direction: column;
			pointer-events: auto;
			border: 1px solid rgba(28,36,43,.6);
			border-radius: 5px;
			box-shadow: 0 2px 10px 0 rgba(0,0,0,.2);
			overflow: hidden;
		}

		#permissions-modal-wrapper .header {
			background-color: #35393e;
			box-shadow: 0 2px 3px 0 rgba(0,0,0,.2);
			padding: 12px 20px;
			z-index: 1;
			color: #fff;
			font-size: 16px;
			font-weight: 700;
			line-height: 19px;
		}

		.role-side, .perm-side {
			flex-direction: column;
			padding-left: 6px;
		}

		.role-scroller, .perm-scroller {
			contain: layout;
			flex: 1;
			min-height: 1px;
			overflow-y: scroll;
		}

		#permissions-modal-wrapper .scroller-title {
			color: #fff;
			padding: 8px 0 4px 4px;
			margin-right: 8px;
			border-bottom: 1px solid rgba(0,0,0,0.3);
			display: none;
		}

		#permissions-modal-wrapper .role-side {
			width: 150px;
			background: #2f3136;
			flex: 0 0 auto;
			overflow: hidden;
			display: flex;
			height: 100%;
			min-height: 1px;
			position: relative;
		}

		#permissions-modal-wrapper .role-scroller {
			contain: layout;
			flex: 1;
			min-height: 1px;
			overflow-y: scroll;
			padding-top: 8px;
		}

		#permissions-modal-wrapper .role-item {
			border-radius: 2px;
			padding: 6px;
			margin-bottom: 5px;
			cursor: pointer;
			color: #dcddde;
		}

		#permissions-modal-wrapper .role-item:hover {
			background-color: rgba(0,0,0,0.1);
		}

		#permissions-modal-wrapper .role-item.selected {
			background-color: rgba(0,0,0,0.2);
		}

		#permissions-modal-wrapper .perm-side {
			width: 250px;
			background-color: #36393f;
			flex: 0 0 auto;
			display: flex;
			height: 100%;
			min-height: 1px;
			position: relative;
			padding-left: 10px;
		}

		#permissions-modal-wrapper .perm-item {
			box-shadow: inset 0 -1px 0 rgba(79,84,92,.3);
			box-sizing: border-box;
			height: 44px;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
			flex-direction: row;
			justify-content: flex-start;
			align-items: center;
			display: flex;
		}

		#permissions-modal-wrapper .perm-item.allowed svg {
			fill: #43B581;
		}

		#permissions-modal-wrapper .perm-item.denied svg {
			fill: #F04747;
		}

		#permissions-modal-wrapper .perm-name {
			display: inline;
			flex: 1;
			font-size: 16px;
			font-weight: 400;
			overflow: hidden;
			text-overflow: ellipsis;
			user-select: text;
			color: #dcddde;
			margin-left: 10px;
		}


		.member-perms::-webkit-scrollbar-thumb, .member-perms::-webkit-scrollbar-track,
		#permissions-modal-wrapper *::-webkit-scrollbar-thumb, #permissions-modal-wrapper *::-webkit-scrollbar-track {
			background-clip: padding-box;
			border-radius: 7.5px;
			border-style: solid;
			border-width: 3px;
			visibility: hidden;
		}

		.member-perms:hover::-webkit-scrollbar-thumb, .member-perms:hover::-webkit-scrollbar-track,
		#permissions-modal-wrapper *:hover::-webkit-scrollbar-thumb, #permissions-modal-wrapper *:hover::-webkit-scrollbar-track {
			visibility: visible;
		}

		.member-perms::-webkit-scrollbar-track,
		#permissions-modal-wrapper *::-webkit-scrollbar-track {
			border-width: initial;
			background-color: transparent;
			border: 2px solid transparent;
		}

		.member-perms::-webkit-scrollbar-thumb,
		#permissions-modal-wrapper *::-webkit-scrollbar-thumb {
			border: 2px solid transparent;
			border-radius: 4px;
			cursor: move;
			background-color: rgba(32,34,37,.6);
		}

		.member-perms::-webkit-scrollbar,
		#permissions-modal-wrapper *::-webkit-scrollbar {
			height: 8px;
			width: 8px;
		}
		`;

		this.listHTML = `<div class="member-perms-header bodyTitle-yehI7c marginBottom8-1mABJ4 size12-1IGJl9 weightBold-2qbcng ">
							<div class="member-perms-title">\${label}</div>
							<span class="perm-details">
								<svg name="Details" viewBox="0 0 24 24" class="bodyTitleIconForeground-itKW-t perm-details-button" fill="currentColor">
									<path d="M0 0h24v24H0z" fill="none"/>
									<path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
								</svg>
							</span>
						</div>
						<ul class="member-perms endBodySection-1WYzxu marginBottom20-2Ifj-2"></ul>`;
		
		this.itemHTML = `<component class="member-perm">
							<span class="name"></span>
						</component>`;
						
		this.itemHTML = `<li class="member-perm role-3rahR_">
							<div class="perm-circle roleCircle-3-vPZq"></div>
							<div class="name roleName-DUQZ9m"></div>
						</li>`;

		this.modalHTML = `<div id="permissions-modal-wrapper">
							<div class="callout-backdrop backdrop-2ohBEd"></div>
							<div class="modal-wrapper modal-2LIEKY">
								<div id="permissions-modal" class="inner-1_1f7b">
									<div class="header"><div class="title">\${header}</div></div>
									<div class="modal-body">
										<div class="role-side">
											<span class="scroller-title role-list-title">\${rolesLabel}</span>
											<div class="role-scroller">
							
											</div>
											<!--<div class="switch-wrapper">
												<span class="switch-label">Channel Overrides</span>
												<div class="switch">
													<input id="cmn-toggle-7" class="cmn-toggle cmn-toggle-yes-no" type="checkbox">
													<label for="cmn-toggle-7" data-on="on" data-off="off"></label>
												</div>
											</div>-->
										</div>
										<div class="perm-side">
											<span class="scroller-title perm-list-title">\${permissionsLabel}</span>
											<div class="perm-scroller">
							
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>`;
		
		this.modalButton = `<div class="role-item">
								<span class="role-name"></span>
							</div>`;

		this.permAllowedIcon = `<svg height="24" viewBox="0 0 24 24" width="24">
									<path d="M0 0h24v24H0z" fill="none"/>
									<path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
								</svg>`;

		this.permDeniedIcon = `<svg height="24" viewBox="0 0 24 24" width="24">
									<path d="M0 0h24v24H0z" fill="none"/>
									<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8 0-1.85.63-3.55 1.69-4.9L16.9 18.31C15.55 19.37 13.85 20 12 20zm6.31-3.1L7.1 5.69C8.45 4.63 10.15 4 12 4c4.42 0 8 3.58 8 8 0 1.85-.63 3.55-1.69 4.9z"/>
								</svg>`;

		this.modalItem = `<div class="perm-item">
							<span class="perm-name"></span>
						</div>`;

		this.contextItem = '<div class="item-1XYaYf"><span></span><div class="hint-3TJykr"></div></div>';

		this.initialized = false;
		this.defaultSettings = {plugin: {popouts: true, contextMenus: true}};
		this.settings = this.defaultSettings;

		this.popoutObserver = new MutationObserver((changes) => {
			for (let change in changes) this.observePopouts(changes[change]);
		});
		this.contextObserver = new MutationObserver((changes) => {
			for (let change in changes) this.observeContextMenus(changes[change]);
		});
	}
	
	load() {}
	unload() {}

	loadSettings() {
		this.settings = PluginUtilities.loadSettings(this.getShortName(), this.defaultSettings);
	}

	saveSettings() {
		PluginUtilities.saveSettings(this.getShortName(), this.settings);
	}
	
	start() {
		var libraryScript = document.getElementById('zeresLibraryScript');
		if (libraryScript) libraryScript.parentElement.removeChild(libraryScript);
		libraryScript = document.createElement("script");
		libraryScript.setAttribute("type", "text/javascript");
		libraryScript.setAttribute("src", "https://rauenzi.github.io/BetterDiscordAddons/Plugins/PluginLibrary.js");
		libraryScript.setAttribute("id", "zeresLibraryScript");
		document.head.appendChild(libraryScript);

		if (typeof window.ZeresLibrary !== "undefined") this.initialize();
		else libraryScript.addEventListener("load", () => { this.initialize(); });
	}
	
	initialize() {
		PluginUtilities.checkForUpdate(this.getName(), this.getVersion());
		BdApi.injectCSS(this.getShortName(), this.css);
		this.loadSettings();
		this.contextListener = () => {
			this.bindMenu(document.querySelector('.contextMenu-uoJTbz'));
		};

		this.GuildStore = InternalUtilities.WebpackModules.findByUniqueProperties(['getGuild']);
		this.SelectedGuildStore = InternalUtilities.WebpackModules.findByUniqueProperties(['getLastSelectedGuildId']);
		this.MemberStore = InternalUtilities.WebpackModules.findByUniqueProperties(['getMember']);
		this.UserStore = InternalUtilities.WebpackModules.findByUniqueProperties(['getCurrentUser']);
		this.PermissionsCalc = InternalUtilities.WebpackModules.findByUniqueProperties(['getHighestRole']);
		this.ChannelStore = InternalUtilities.WebpackModules.findByUniqueProperties(['getChannels', 'getDMFromUserId']);

		if (this.settings.plugin.popouts) this.bindPopouts();
		if (this.settings.plugin.contextMenus) this.bindContextMenus();
		this.initialized = true;
		PluginUtilities.showToast(this.getName() + " " + this.getVersion() + " has started.");
	}

	stop() {
		BdApi.clearCSS(this.getShortName());
		this.unbindPopouts();
		this.unbindContextMenus();
	}

	bindContextMenus() {
		this.contextObserver.observe(document.querySelector('#app-mount'), {childList: true, subtree: true});
	}

	unbindContextMenus() {
		this.contextObserver.disconnect();
	}

	observeContextMenus(e) {
		if (!e.addedNodes.length || !(e.addedNodes[0] instanceof Element) || !e.addedNodes[0].classList) return;
		let elem = e.addedNodes[0];
		let context = elem.classList.contains('contextMenu-uoJTbz') ? elem : elem.querySelector('.contextMenu-uoJTbz');
		if (!context) return;

		let isUserContext = ReactUtilities.getReactProperty(context, "return.memoizedProps.user");
		let isGuildContext = ReactUtilities.getReactProperty(context, "return.memoizedProps.guildId");
		if (!(isUserContext && isGuildContext)) return;

		let item = $(this.contextItem);
		item.find('span').text(this.strings.contextMenu.label);
		item.on("click." + this.getShortName(), () => {
			context.style.display = "none";

			let guildId = this.SelectedGuildStore.getGuildId();
			let user = this.MemberStore.getMember(guildId, isUserContext.id);
			let guild = this.GuildStore.getGuild(guildId);
			let name = user.nick ? user.nick : this.UserStore.getUser(user.userId).username;

			if (!user || !guild || !name) return;
			this.showModal(this.createModal(name, user, guild));
			
		});
		$(context).find('.item-1XYaYf').first().after(item);

	}

	bindPopouts() {
		this.popoutObserver.observe(document.querySelector('.popouts') || document.querySelector('#app-mount'), {childList: true, subtree: true});
	}

	unbindPopouts() {
		this.popoutObserver.disconnect();
	}
	
	observePopouts(e) {
		if (!e.addedNodes.length || !(e.addedNodes[0] instanceof Element) || !e.addedNodes[0].classList) return;
		let elem = e.addedNodes[0];
		let popout = elem.querySelector('[class*="userPopout-"]');
		if (!popout) return;

		let {user, guild, name} = this.getInfoFromPopout(popout);
		if (!user || !guild || !name) return;
		let modal = this.createModal(name, user, guild);

		let userRoles = user.roles.slice(0);
		userRoles.push(guild.id);
		let perms = user.userId == guild.ownerId ? DiscordPermissions.FullPermissions : 0;
		perms = 0;


		$('.root-uMQa_6').after(PluginUtilities.formatString(this.listHTML, {label: this.strings.popout.label}));
		
		userRoles.reverse();
		userRoles.forEach((role) => {
			perms = perms | guild.roles[role].permissions;
			let userPerms = new DiscordPermissions(perms);
			// console.log(guild.roles[role]);

			for (let perm of userPerms) {
				var permName = this.strings.permissions[perm].short;
				if (userPerms[perm] && !$('.member-perms').find(`[data-name="${permName}"]`).length) {
					let element = $(this.itemHTML);
					let roleColor = guild.roles[role].colorString;
					element.find('.name').text(permName);
					element.attr("data-name", permName);
					if (!roleColor) roleColor = "#B9BBBE";
					// element.css("color", roleColor);
					element.find('.perm-circle').css("background-color", ColorUtilities.rgbToAlpha(roleColor, 1));
					element.css("border-color", ColorUtilities.rgbToAlpha(roleColor, 0.6));
					$('.member-perms').append(element);
				}
			}
		});

		// $('.member-perms .member-perm').reverse();
		$('.member-perms').append($('.member-perms .member-perm').get().reverse());



		const maxHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
		let jPopout = $(elem).find('[class*="userPopout-"]');
		if (jPopout.offset().top + jPopout.outerHeight() >= maxHeight) {
			let shift = Math.round((jPopout.offset().top + jPopout.outerHeight() - maxHeight) + 20);
			popout.style.setProperty("transform", "translateY(-" + shift + "px)");
		}

		$('.perm-details-button').on('click', () => {
			this.showModal(modal);
		});
	}

	getInfoFromPopout(popout) {
		let user = ReactUtilities.getReactProperty(popout, 'return.memoizedProps.guildMember');
		let guild = ReactUtilities.getReactProperty(popout, 'return.memoizedProps.guild');
		let name = user && user.nick ? user.nick : ReactUtilities.getReactProperty(popout, 'return.memoizedProps.user.username');
		return {user: user, guild: guild, name: name};
	}

	showModal(modal) {
		$('[class*="userPopout-"]').hide();
		$('[class*="app-"').append(modal);
		// if (document.querySelector('.app-XZYfmp')) $('.app-XZYfmp').siblings('[class*="theme-"]:not(.popouts)').first().append(modal);
		// else $('.app').siblings('[class*="theme-"]').first().append(modal);
	}

	createModal(name, user, guild) {
		let modal = $(PluginUtilities.formatString(PluginUtilities.formatString(this.modalHTML, this.strings.modal), {name: name}));
		modal.find('.callout-backdrop').on('click', () => {
			modal.addClass('closing');
			setTimeout(() => { modal.remove(); }, 300);
		});

		//modal.find('#permissions-modal .title').text(PluginUtilities.formatString(this.strings.modal.header, {name: name}));

		let userRoles = user.roles.slice(0);
		let guildRoles = JSON.parse(JSON.stringify(guild.roles));
		userRoles.push(guild.id);
		userRoles.sort((a, b) => { return guildRoles[b].position - guildRoles[a].position; });

		if (user.userId == guild.ownerId) {
			userRoles.push(user.userId);
			guildRoles[user.userId] = {name: this.strings.modal.owner, permissions: DiscordPermissions.FullPermissions};
		}

		//let channelOverrides = this.getSelectedChannel().permissionOverwrites;

		for (let role of userRoles) {
			let item = $(this.modalButton);
			item.css("color", guildRoles[role].colorString);
			item.find('.role-name').text(guildRoles[role].name);
			modal.find('.role-scroller').append(item);
			item.on('click', () => {
				modal.find('.role-item').removeClass('selected');
				item.addClass('selected');
				let perms = new DiscordPermissions(guildRoles[role].permissions);
				// if (channelOverrides[role]) {
				// 	perms.allowPermission(channelOverrides[role].allow);
				// 	perms.denyPermission(channelOverrides[role].deny);
				// }
				let permList = modal.find('.perm-scroller');
				permList.empty();
				for (let perm of perms) {
					let element = $(this.modalItem);
					if (perms[perm]) {
						element.addClass('allowed');
						element.prepend(this.permAllowedIcon);
					}
					else {
						element.addClass('denied');
						element.prepend(this.permDeniedIcon);
					}
					element.find('.perm-name').text(this.strings.permissions[perm].name);
					permList.append(element);
				}
			});
		}

		modal.find('.role-item').first().click();

		return modal;
	}

	getSelectedChannel() {
		let selectedChannel = ReactUtilities.getReactProperty(document.querySelector(".channels-wrap") || document.querySelector('.channels-3g2vYe'), "child.memoizedState.selectedChannelId");
		return this.getTextChannels()[selectedChannel];
	}

	getTextChannels() {
		let reactChannels = ReactUtilities.getReactProperty(document.querySelector(".channels-wrap") || document.querySelector('.channels-3g2vYe'), "child.memoizedState.channels.0");
		let channels = {};

		for (let instance of reactChannels) {
			channels[instance.channel.id] = instance.channel;
		}

		return channels;
	}

	readablePermName(perm) {
		let rest = perm.slice(1);
		let first = perm[0].toUpperCase();
		rest = rest.replace(/([A-Z][a-z])|([A-Z][A-Z][A-Z])/g, " $&");
		return first + rest;
	}

	nativePermName(perm) {
		let rest = perm.slice(1);
		let first = perm[0].toUpperCase();
		rest = rest.replace(/([A-Z][a-z])|([A-Z][A-Z][A-Z])/g, "_$&");
		return (first + rest).toUpperCase();
	}

	getSettingsPanel() {
		var panel = $("<form>").addClass("form").css("width", "100%");
		if (this.initialized) this.generateSettings(panel);
		return panel[0];
	}

	generateSettings(panel) {
		
		new PluginSettings.ControlGroup(this.strings.settings.pluginOptions.label, () => {this.saveSettings();}, {shown: true}).appendTo(panel).append(
			new PluginSettings.Checkbox(this.strings.settings.pluginOptions.popouts.label, this.strings.settings.pluginOptions.popouts.description,
								this.settings.plugin.popouts, (checked) => {
									this.settings.plugin.popouts = checked;
									if (checked) this.bindPopouts();
									else this.unbindPopouts();
								}),
			new PluginSettings.Checkbox(this.strings.settings.pluginOptions.contextMenus.label, this.strings.settings.pluginOptions.contextMenus.description,
								this.settings.plugin.contextMenus, (checked) => {
									this.settings.plugin.contextMenus = checked;
									if (checked) this.bindContextMenus();
									else this.unbindContextMenus();
								})
		);
	}

	get strings() {
		let lang = "";
		if (document.documentElement.getAttribute('lang')) lang = document.documentElement.getAttribute('lang').split('-')[0];
		switch (lang) {
			case "es": // Spanish
				return {
					contextMenu: {
						label: "Permisos",
					},
					popout: {
						label: "Permisos",
					},
					modal: {
						header: "Permisos de ${name}",
						rolesLabel: "Roles",
						permissionsLabel: "Permisos",
						owner: "@propietario"
					},
					permissions: {
						administrator: {name: "Administrador", short: "Admin"},
						viewAuditLog: {name: "Ver el Registro de Auditoría", short: "Registro de Auditoría"},
						manageServer: {name: "Administrar el Servidor", short: "Administrar el Servidor"},
						manageRoles: {name: "Administrar Roles", short: "Administrar Roles"},
						manageChannels: {name: "Administrar Canales", short: "Administrar Canales"},
						kickMembers: {name: "Expulsar Miembros", short: "Expulsar"},
						banMembers: {name: "Bloquear Miembros", short: "Bloquear"},
						createInvite: {name: "Crear Invitación Instantánea", short: "Crear Invitación"},
						changeNickname: {name: "Cambiar Apodo", short: "Apodo"},
						manageNicknames: {name: "Administrar Apodos", short: "Administrar Apodos"},
						manageEmojis: {name: "Administrar Emojis", short: "Administrar Emojis"},
						manageWebhooks: {name: "Administrar Webhooks", short: "Administrar Webhooks"},
						readMessages: {name: "Leer Mensajes", short: "Leer"},
						sendTTSMessages: {name: "Enviar Mensajes de TTS", short: "TTS"},
						embedLinks: {name: "Insertar Enlaces", short: "Enlaces"},
						readMessageHistory: {name: "Leer el Historial de Mensajes", short: "Leer el Historial"},
						useExternalEmojis: {name: "Usar Emojis Externos", short: "Emojis Externos"},
						sendMessages: {name: "Enviar Mensajes", short: "Enviar"},
						manageMessages: {name: "Administrar Mensajes", short: "Administrar mensajes"},
						attachFiles: {name: "Adjuntar Archivos", short: "Adjuntar"},
						mentionEveryone: {name: "Mencionar a Todos", short: "Mencionar a todos"},
						addReactions: {name: "Añadir Reacciones", short: "Reacciones"},
						viewChannel: {name: "Ver Canales de Voz", short: "Ver Canales de Voz"},
						connect: {name: "Conectar", short: "Conectar"},
						muteMembers: {name: "Silenciar Miembros", short: "Silenciar"},
						moveMembers: {name: "Mover Miembros", short: "Mover"},
						speak: {name: "Hablar", short: "Hablar"},
						deafenMembers: {name: "Ensordecer Miembros", short: "Ensordecer"},
						useVoiceActivity: {name: "Usar la actividad de voz", short: "Actividad de Voz"},
					},
					settings: {
						pluginOptions: {
							label: "Opciones de Plugin",
							popouts: {
								label: "Mostrar en Popouts",
								description: "Mostrar los permisos de usuario en popouts como los roles."
							},
							contextMenus: {
								label: "Botón de menú contextual",
								description: "Añadir un botón para ver permisos en los menús contextuales."
							}
						}
					}
				};
			case "pt": // Portuguese
				return {
					contextMenu: {
						label: "Permissões",
					},
					popout: {
						label: "Permissões",
					},
					modal: {
						header: "Permissões de ${name}",
						rolesLabel: "Cargos",
						permissionsLabel: "Permissões",
						owner: "@dono"
					},
					permissions: {
						administrator: {name: "Administrador", short: "Administrador"},
						viewAuditLog: {name: "Ver Audit Log", short: "Audit Log"},
						manageServer: {name: "Gerenciar servidor", short: "Gerenciar servidor"},
						manageRoles: {name: "Gerenciar cargos", short: "Gerenciar cargos"},
						manageChannels: {name: "Gerenciar canais", short: "Gerenciar canais"},
						kickMembers: {name: "Expulsar membros", short: "Expulsar"},
						banMembers: {name: "Banir membros", short: "Banir"},
						createInvite: {name: "Criar convite instantâneo", short: "Criar convite"},
						changeNickname: {name: "Mudar apelido", short: "Apelido"},
						manageNicknames: {name: "Gerenciar apelidos", short: "Gerenciar apelidos"},
						manageEmojis: {name: "Gerenciar emojis", short: "Gerenciar emojis"},
						manageWebhooks: {name: "Gerenciar webhooks", short: "Gerenciar webhooks"},
						readMessages: {name: "Ler mensagens", short: "Ler"},
						sendTTSMessages: {name: "Enviar mensagens em TTS", short: "TTS"},
						embedLinks: {name: "Inserir links", short: "Links"},
						readMessageHistory: {name: "Ver histórico de mensagens", short: "Ver histórico"},
						useExternalEmojis: {name: "Usar emojis externos", short: "Emojis externos"},
						sendMessages: {name: "Enviar mensagens", short: "Enviar"},
						manageMessages: {name: "Gerenciar mensagens", short: "Gerenciar mensagens"},
						attachFiles: {name: "Anexar arquivos", short: "Anexar"},
						mentionEveryone: {name: "Mencionar todos", short: "Mencionar todos"},
						addReactions: {name: "Adicionar reações", short: "Reações"},
						viewChannel: {name: "Ver canais de voz", short: "Ver canais de voz"},
						connect: {name: "Conectar", short: "Conectar"},
						muteMembers: {name: "Silenciar membros", short: "Silenciar"},
						moveMembers: {name: "Mover membros", short: "Mover"},
						speak: {name: "Falar", short: "Falar"},
						deafenMembers: {name: "Ensurdecer membros", short: "Ensurdecer"},
						useVoiceActivity: {name: "Usar detecção de voz", short: "Detecção de voz"},
					},
					settings: {
						pluginOptions: {
							label: "Opções do Plugin",
							popouts: {
								label: "Mostrar em Popouts",
								description: "Mostrar as permissões em popouts como os cargos."
							},
							contextMenus: {
								label: "Botão do menu de contexto",
								description: "Adicionar um botão parar ver permissões ao menu de contexto."
							}
						}
					}
				};	
			case "de": // German
				return {
					contextMenu: {
						label: "Berechtigungen",
					},
					popout: {
						label: "Berechtigungen",
					},
					modal: {
						header: "${name}s Berechtigungen",
						rolesLabel: "Rollen",
						permissionsLabel: "Berechtigungen",
						owner: "@eigentümer"
					},
					permissions: {
						administrator: {name: "Administrator", short: "Administrator"},
						viewAuditLog: {name: "Audit-Log anzeigen", short: "Audit-Log"},
						manageServer: {name: "Server Verwalten", short: "Server Verwalten"},
						manageRoles: {name: "Rollen Verwalten", short: "Rollen Verwalten"},
						manageChannels: {name: "Kanäle Verwalten", short: "Kanäle Verwalten"},
						kickMembers: {name: "Mitglieder Kicken", short: "Kicken"},
						banMembers: {name: "Mitglieder Bannen", short: "Bannen"},
						createInvite: {name: "Soforteinladung Erstellen", short: "Soforteinladung erstellen"},
						changeNickname: {name: "Nickname ändern", short: "Nickname"},
						manageNicknames: {name: "Nicknamen Verwalten", short: "Nicknamen Verwalten"},
						manageEmojis: {name: "Emojis Verwalten", short: "Emojis Verwalten"},
						manageWebhooks: {name: "WebHooks Verwalten", short: "WebHooks Verwalten"},
						readMessages: {name: "Nachrichten Lesen", short: "Lesen"},
						sendTTSMessages: {name: "Verschicke Text-zu-Sprache-Nachrichten", short: "Text-zu-Sprache"},
						embedLinks: {name: "Links einbinden", short: "Einbinden"},
						readMessageHistory: {name: "Nachrichtenverlauf Lesen", short: "Nachrichtenverlauf lesen"},
						useExternalEmojis: {name: "Benutzerdefinierte Emojis verwenden", short: "Benutzerdefinierte Emojis verwenden"},
						sendMessages: {name: "Nachrichten Versenden", short: "Versenden"},
						manageMessages: {name: "Nachrichten Verwalten", short: "Nachrichten Verwalten"},
						attachFiles: {name: "Dateien Anhängen", short: "Anhängen"},
						mentionEveryone: {name: "Alle Erwähnen", short: "Alle erwähnen"},
						addReactions: {name: "Reaktionen hinzufügen", short: "Reaktionen hinzufügen"},
						viewChannel: {name: "Kanal Ansehen", short: "Kanal ansehen"},
						connect: {name: "Verbinden", short: "Verbinden"},
						muteMembers: {name: "Mitglieder Stumm Schalten", short: "Mitglieder stumm schalten"},
						moveMembers: {name: "Mitglieder verschieben", short: "Mitglieder verschieben"},
						speak: {name: "Sprechen", short: "Sprechen"},
						deafenMembers: {name: "Mitglieder taub schalten", short: "Mitglieder taub schalten"},
						useVoiceActivity: {name: "Sprachaktivierung verwenden", short: "Sprachaktivierung verwenden"},
					},
					settings: {
						pluginOptions: {
							label: "Plugin-Optionen",
							popouts: {
								label: "In Popouts anzeigen",
								description: "Zeigt die Gesamtberechtigungen eines Benutzers in seinem Popup ähnlich den Rollen an."
							},
							contextMenus: {
								label: "Kontextmenü-Schaltfläche",
								description: "Fügt eine Schaltfläche hinzu, um die Berechtigungen mithilfe von Kontextmenüs anzuzeigen."
							}
						}
					}
				};
			default: // English
				return {
					contextMenu: {
						label: "Permissions",
					},
					popout: {
						label: "Permissions",
					},
					modal: {
						header: "${name}'s Permissions",
						rolesLabel: "Roles",
						permissionsLabel: "Permissions",
						owner: "@owner"
					},
					permissions: {
						administrator: {name: "Administrator", short: "Admin"},
						viewAuditLog: {name: "View Audit Log", short: "Audit Log"},
						manageServer: {name: "Manage Server", short: "Manage Server"},
						manageRoles: {name: "Manage Roles", short: "Manage Roles"},
						manageChannels: {name: "Manage Channels", short: "Manage Channels"},
						kickMembers: {name: "Kick Members", short: "Kick"},
						banMembers: {name: "Ban Members", short: "Ban"},
						createInvite: {name: "Create Instant Invite", short: "Create Invite"},
						changeNickname: {name: "Change Nickname", short: "Nickname"},
						manageNicknames: {name: "Manage Nicknames", short: "Manage Nicknames"},
						manageEmojis: {name: "Manage Emojis", short: "Manage Emojis"},
						manageWebhooks: {name: "Manage Webhooks", short: "Manage Webhooks"},
						readMessages: {name: "Read Messages", short: "Read"},
						sendTTSMessages: {name: "Send TTS Messages", short: "TTS"},
						embedLinks: {name: "Embed Links", short: "Embeds"},
						readMessageHistory: {name: "Read Message History", short: "Read History"},
						useExternalEmojis: {name: "Use External Emojis", short: "External Emojis"},
						sendMessages: {name: "Send Messages", short: "Send"},
						manageMessages: {name: "Manage Messages", short: "Manage Messages"},
						attachFiles: {name: "Attach Files", short: "Attach"},
						mentionEveryone: {name: "Mention Everyone", short: "Mention Everyone"},
						addReactions: {name: "Add Reactions", short: "React"},
						viewChannel: {name: "View Voice Channels", short: "View Voice"},
						connect: {name: "Voice Connect", short: "Connect"},
						muteMembers: {name: "Mute Members", short: "Mute"},
						moveMembers: {name: "Move Members", short: "Move"},
						speak: {name: "Speak", short: "Speak"},
						deafenMembers: {name: "Deafen Members", short: "Deafen"},
						useVoiceActivity: {name: "Use Voice Activity", short: "Voice Activity"},
					},
					settings: {
						pluginOptions: {
							label: "Plugin Options",
							popouts: {
								label: "Show In Popouts",
								description: "Shows a user's total permissions in their popout similar to roles."
							},
							contextMenus: {
								label: "Context Menu Button",
								description: "Adds a button to view the permissions modal to select context menus."
							}
						}
					}
				};
		}

	}
}

//Permissions.can(DiscordConstants.Permissions.EMBED_LINKS, "219363409097916416", ChannelStore.getChannel("334930809289179137"))