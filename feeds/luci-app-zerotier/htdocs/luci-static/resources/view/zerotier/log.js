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
	load: function() {
		poll.add(function () {
			return fs.read('/tmp/zero.log').then(function(res) {
				if (!res) {
					return '';
				}

				var info = res.trim();
				var view = document.getElementById('syslog');

				if (view) {
					view.innerHTML = info;
				}

				return info;
			}).catch(function() {
				var empty = document.getElementById('empty');
				var button = document.getElementById('download');
				var view = document.getElementById('logs');
				if (empty) {
					empty.innerHTML = _('Log file is empty.');
					empty.style.display = 'block';
					button.style.display = view.style.display = 'none';
				}

				return '';
			});
		});

		return Promise.resolve('');
	},
	render: function(info) {
		return E([], [
			E('h2', { 'class': 'section-title' }, _('ZeroTier')),
			E('div', { 'class': 'cbi-map-descr'}, _('ZeroTier is an open source, cross-platform and easy to use virtual LAN.')),
			E('div', { 'id': 'empty', 'class': 'cbi-map-descr', 'style': 'display: none;' }),
			E('div', { 'id': 'logs' }, [
				E('textarea', {
					'id': 'syslog',
					'class': 'cbi-input-textarea',
					'style': 'height: 500px; overflow-y: scroll;',
					'readonly': 'readonly',
					'wrap': 'off',
					'rows': 1
				}, [ info ])
			]),
			E('div', { 'id': 'download', 'class': 'cbi-page-actions' }, [
				E('button', {
					'id': 'download-log',
					'class': 'cbi-button cbi-button-save',
					'click': L.bind(this.handleDownloadLog, this),
					'style': 'margin-top: 8px;'
				}, _('Download Log'))
			])
		]);
	},

	handleDownloadLog: function() {
		var logs = document.getElementById('syslog').value;
		var blob = new Blob([logs], { type: 'text/plain' });
		var link = document.createElement('a');
		link.href = window.URL.createObjectURL(blob);
		link.download = 'zerotier.log';
		link.click();
	}
});
