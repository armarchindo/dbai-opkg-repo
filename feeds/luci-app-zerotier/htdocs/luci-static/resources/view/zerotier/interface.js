/* This is free software, licensed under the Apache License, Version 2.0
 *
 * Copyright (C) 2024 Hilman Maulana <hilman0.0maulana@gmail.com>
 */

'use strict';
'require fs';
'require view';
'require poll';

return view.extend({
	handleSaveApply: null,
	handleSave: null,
	handleReset: null,
	load: function () {
		var interfaces;
		fs.exec('/sbin/ifconfig')
			.then(function (res) {
				if (!res) {
					return '';
				}

				interfaces = res.stdout.match(/zt[a-z0-9]+/g);
				if (!interfaces || interfaces.length === 0) {
					return 'No interface online.';
				}
			})
			.catch(function (error) {
				return 'Failed to execute'
			})
			.then(function (initError) {
				if (initError) {
					var empty = document.getElementById('zero-info');
					var table = document.getElementById('zero-table');
					if (empty) {
						empty.innerHTML = _('No interface online.');
						empty.style.display = 'block';
						table.style.display = 'none';
					}
					return initError;
				}

				poll.add(function () {
					var promises = interfaces.map(function (name) {
						return fs.exec('/sbin/ifconfig', [name]);
					});

					return Promise.all(promises).then(function (results) {
						var iconf = {};
						var lines = results[0].stdout.split('\n');
						lines.forEach(function (line) {
							iconf.name = interfaces[0];
							if (line.includes('HWaddr')) {
								iconf.mac = line.split('HWaddr')[1].trim().split(' ')[0];
							} else if (line.includes('inet addr:')) {
								iconf.ipv4 = line.split('inet addr:')[1].trim().split(' ')[0];
							} else if (line.includes('inet6 addr:')) {
								iconf.ipv6 = line.split('inet6 addr:')[1].trim().split('/')[0];
							} else if (line.includes('MTU:')) {
								iconf.mtu = line.split('MTU:')[1].trim().split(' ')[0];
							} else if (line.includes('RX bytes:')) {
								var rxMatch = line.match(/RX bytes:\d+ \(([\d.]+\s*[a-zA-Z]+)\)/);
								if (rxMatch && rxMatch[1]) {
									iconf.rxBytes = rxMatch[1];
								}
								var txMatch = line.match(/TX bytes:\d+ \(([\d.]+\s*[a-zA-Z]+)\)/);
								if (txMatch && txMatch[1]) {
									iconf.txBytes = txMatch[1];
								}
							}
						});

						var dname = document.getElementById('dname');
						var dmac = document.getElementById('dmac');
						var dip4 = document.getElementById('dip4');
						var dip6 = document.getElementById('dip6');
						var dmtu = document.getElementById('dmtu');
						var drx = document.getElementById('drx');
						var dtx = document.getElementById('dtx');
						if (dname) {
							dname.innerHTML = iconf.name;
						}
						if (dmac) {
							dmac.innerHTML = iconf.mac;
						}
						if (dip4) {
							dip4.innerHTML = iconf.ipv4;
						}
						if (dip6) {
							dip6.innerHTML = iconf.ipv6;
						}
						if (dmtu) {
							dmtu.innerHTML = iconf.mtu;
						}
						if (drx) {
							drx.innerHTML = iconf.rxBytes;
						}
						if (dtx) {
							dtx.innerHTML = iconf.txBytes;
						}

						return '';
					}).catch(function () {
						var empty = document.getElementById('zero-info');
						var table = document.getElementById('zero-table');
						if (empty) {
							empty.innerHTML = _('Failed to retrieve interface data.');
							empty.style.display = 'block';
							table.style.display = 'none';
						}

						return '';
					});
				});

				return Promise.resolve('');
			});
	},
	render: function (info) {
		return E([], [
			E('h2', { 'class': 'section-title' }, _('ZeroTier')),
			E('div', { 'class': 'cbi-map-descr' }, _('ZeroTier is an open source, cross-platform and easy to use virtual LAN.')),
			E('div', { 'id': 'zero-info', 'class': 'cbi-map-descr', 'style': 'display: none;' }),
			E('table', { 'id': 'zero-table', 'class': 'table'}, [
				E('th', { 'class': 'th', 'colspan': '2' }, _('Network Interface Information')),
				E('tr', { 'class': 'tr' }, [
					E('td', { 'class': 'td left', 'width': '25%' }, _('Interface Name')),
					E('td', { 'class': 'td left', 'width': '25%', 'id': 'dname' }, '')
				]),
				E('tr', { 'class': 'tr' }, [
					E('td', { 'class': 'td left', 'width': '25%' }, _('MAC Address')),
					E('td', { 'class': 'td left', 'width': '25%', 'id': 'dmac' }, '')
				]),
				E('tr', { 'class': 'tr' }, [
					E('td', { 'class': 'td left', 'width': '25%' }, _('IPv4 Address')),
					E('td', { 'class': 'td left', 'width': '25%', 'id': 'dip4' }, '')
				]),
				E('tr', { 'class': 'tr' }, [
					E('td', { 'class': 'td left', 'width': '25%' }, _('IPv6 Address')),
					E('td', { 'class': 'td left', 'width': '25%', 'id': 'dip6' }, '')
				]),
				E('tr', { 'class': 'tr' }, [
					E('td', { 'class': 'td left', 'width': '25%' }, _('MTU')),
					E('td', { 'class': 'td left', 'width': '25%', 'id': 'dmtu' }, '')
				]),
				E('tr', { 'class': 'tr' }, [
					E('td', { 'class': 'td left', 'width': '25%' }, _('Total Download')),
					E('td', { 'class': 'td left', 'width': '25%', 'id': 'drx' }, '')
				]),
				E('tr', { 'class': 'tr' }, [
					E('td', { 'class': 'td left', 'width': '25%' }, _('Total Upload')),
					E('td', { 'class': 'td left', 'width': '25%', 'id': 'dtx' }, '')
				]),
			])
		]);
	}
});
