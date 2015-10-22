var fs = require('fs');
var yaml = require('js-yaml');

var Map = require('../runtime/Map');
var Region = require('../runtime/Region');
var Room = require('../runtime/Room');

module.exports = function(dirname, cb) {
	
	var mapData = _getRegions().reduce(function(m, region) {
		m[region] = _loadRegion(region);
		return m;
	}, {});

	var map = new Map();

	for (var regionId in mapData) {
		map.addRegion(new Region(regionId));
	}

	for (var regionId in mapData) {
		for (var roomId in mapData[regionId]) {
			var roomData = mapData[regionId][roomId];
			var room = new Room(roomId);
			room.setTitle(roomData.meta.title);
			room.setDescription(roomData.desc);
			for (var dir in roomData.meta.exits) {
				room.addExit(dir, roomData.meta.exits[dir]);
			}
			map.region(regionId).addRoom(room);
		}
	}

	// TODO: consistency checks

	setTimeout(function() { cb(null, map); }, 0);

	function _getRegions() {
		return fs.readdirSync(dirname + '/map').filter(function(r) {
			return fs.statSync(dirname + '/map/' + r).isDirectory();
		});
	}

	function _loadRegion(region) {
		return fs.readdirSync(dirname + '/map/' + region).filter(function(room) {
			return room.match(/\.room$/);
		}).reduce(function(m, room) {
			var roomName = room.replace('.room', '');
			m[roomName] = _loadRoom(region, roomName);
			return m;
		}, {});
	}

	function _loadRoom(region, room) {
		var roomContents = fs.readFileSync(dirname + '/map/' + region + '/' + room + '.room', 'utf8');
		var chunks = roomContents.split('\n---').map(c => c.trim());
		return {
			meta: yaml.safeLoad(chunks[0]),
			desc: chunks[1]
		};
	}

}
