module.exports = Map;

function Map() {
	this._regions = {};
}

Map.prototype.region = function(id) {
	if (!(id in this._regions)) {
		throw new Error("unknown region: " + id);
	}
	return this._regions[id];
}

Map.prototype.addRegion = function(region) {
	if (this._regions[region.id]) {
		throw new Error("duplicate region: " + region.id);
	}
	this._regions[region.id] = region;
	region._map = this;
}

Map.prototype.findRoom = function(id) {
	var chunks = id.split('.');
	if (chunks.length !== 2) {
		throw new Error("invalid fully-qualified room ID");
	}
	return this.region(chunks[0]).findRoom(chunks[1]);
}