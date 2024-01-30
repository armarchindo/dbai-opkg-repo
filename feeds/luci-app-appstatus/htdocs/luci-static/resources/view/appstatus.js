/* This is free software, licensed under the Apache License, Version 2.0
 *
 * Copyright (C) 2024 Hilman Maulana <hilman0.0maulana@gmail.com>
 */

'use strict';
'require view';
'require form';

return view.extend({
	render: function () {
		var m, s, o;
		m = new form.Map('appstatus', _('Application Status'), _('Shows status application information in Overview LuCI.'));

		s = m.section(form.TypedSection, 'appstatus');
		s.anonymous = true;

		// Tunnels application
		o = s.tab('ta', _('Tunnels'));
		o = s.taboption('ta', form.Flag, 'cloudflared', _('Cloudflared'));
		o.default = '1';
		o.rmempty = false;

		o = s.taboption('ta', form.Flag, 'zerotier', _('ZeroTier'));
		o.default = '1';
		o.rmempty = false;

		// Other application
		o = s.tab('oa', _('Other'));
		o = s.taboption('oa', form.Flag, 'dockerd', _('Docker'));
		o.default = '1';
		o.rmempty = false;

		o = s.taboption('oa', form.Flag, 'samba4', _('Samba'));
		o.default = '1';
		o.rmempty = false;

		return m.render();
	},
});