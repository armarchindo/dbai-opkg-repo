/* This is free software, licensed under the Apache License, Version 2.0
 *
 * Copyright (C) 2024 Hilman Maulana <hilman0.0maulana@gmail.com>
 */

'use strict';
'require view';
'require uci';
'require rpc';

var callServiceList = rpc.declare({
	object: 'service',
	method: 'list',
	params: ['name'],
	expect: { '': {} }
});

return view.extend({
	title: _('Application Status'),
	handleSaveApply: null,
	handleSave: null,
	handleReset: null,
	load: function () {
		var self = this;
		return uci.load('appstatus').then(function() {
			self.appstatus = uci.get('appstatus', 'config');
			var services = [];
			for (var key in self.appstatus) {
				if (self.appstatus.hasOwnProperty(key) && self.appstatus[key] === '1') {
					services.push(key);
				}
			}

			var serviceDetails = [];
			var promises = services.map(function(service) {
				return callServiceList(service).then(function(response) {
					var isRunning = false;
					try {
						if (service === 'cloudflared') {
							isRunning = response[service]['instances'][service]['running'];
						} else {
							isRunning = response[service]['instances']['instance1']['running'];
						}
					} catch (e) { }
					serviceDetails.push({ name: service, details: response, running: isRunning });
				});
			});

			return Promise.all(promises).then(function() {
				self.serviceDetails = serviceDetails;
			});
		});
	},
	render: function () {
		var table = E('table', { 'class': 'table' });
		var serviceNames = {
			'cloudflared': 'Cloudflared',
			'dockerd': 'Docker',
			'ngrokc': 'Ngrok',
			'samba4': 'Samba V4',
			'zerotier': 'ZeroTier'
		};
		for (var i = 0; i < this.serviceDetails.length; i++) {
			var serviceDetail = this.serviceDetails[i];
			if (serviceDetail.running === true) {
				var serviceName = serviceNames[serviceDetail.name] || serviceDetail.name;
				table.appendChild(E('tr', { 'class': 'tr' }, [E('td', { 'class': 'td left', 'width': '33%' }, [serviceName]), E('td', { 'class': 'td left' }, ['Running'])]));
			} else {
				var serviceName = serviceNames[serviceDetail.name] || serviceDetail.name;
				table.appendChild(E('tr', { 'class': 'tr' }, [E('td', { 'class': 'td left', 'width': '33%' }, [serviceName]), E('td', { 'class': 'td left' }, ['Stopped'])]));
			}
		}

		return table;
	}
});
