module.exports = Region;

function Region(id) {
	this.id = id;
	this._map = null;
	this._rooms = {};
}

Region.prototype.map = function() {
	return this._map;
}

Region.prototype.room = function(id) {
	if (!(id in this._rooms)) {
		throw new Error("unknown room: " + id);
	}
	return this._rooms[id];
}

Region.prototype.addRoom = function(room) {
	if (this._rooms[room.id]) {
		throw new Error("duplicate room: " + room.id);
	}
	this._rooms[room.id] = room;
	room._region = this;
}

Region.prototype.findRoom = function(id) {
	if (!id) throw new Error("cannot get room without ID");
	if (id.indexOf('.') >= 0) {
		return this._map.findRoom(id);
	} else {
		return this.room(id);
	}
}