module.exports = Room;

function Room(id) {
	this.id = id;
	this._region = null;
	this._title = '';
	this._description = '';
	this._exits = {};
}

Room.prototype.map = function() {
	return this._region.map();
}

Room.prototype.region = function() {
	return this._region;
}

Room.prototype.title = function() {
	return this._title;
}

Room.prototype.setTitle = function(title) {
	this._title = title;
}

Room.prototype.description = function() {
	return this._description;
}

Room.prototype.setDescription = function(desc) {
	this._description = desc;
}

Room.prototype.addExit = function(direction, room) {
	if (direction in this._exits) {
		throw new Error("duplicate exit: " + direction);
	}
	this._exits[direction] = room;
}

Room.prototype.exitDestination = function(direction) {
	return this.region().findRoom(this._exits[direction]);
}

Room.prototype.hasExit = function(direction) {
	return direction in this._exits;
}