/**
 * Spatial Hash for 2-dimensional points optimization
 *
 * Bigger cell_size -> more object retrieved (less precise)
 *
 * Make sure that cell_size is equal or bigger than retrieving box
 */
(function (w) {
/**
 *
 * @params {Object} config {
 *      cell_size: <int> size of cells
 * }
 * @constructor
 */
function SpatialHash (config) {
    this.cell_size = config.cell_size || 50;
    this.middle_points = config.middle_points || false;
    this.buckets = {};
}

/** @param point {x, y} */
SpatialHash.prototype.insert = function (point) {
    var hash = this._hash(point);
    this.buckets[hash] = this.buckets[hash] || [];
    this.buckets[hash].push(point);
};

/** @param {Object} point {
 *    x <int> - coord
 *    y <int> - coord
 *    w <int> - width of the box
 *    h <int> - height of the box
 *  }
 *  Retrieves buckets for the given point or for all 4 points of bounding box if width/heights are set
 */
SpatialHash.prototype.retrieve = function (point) {
    point.w = point.w || 0;
    point.h = point.h || 0;
    var buckets = [],
        box, hash, bucket, doubleCmp = [],
        halfWidth, halfHeight;

    if (point.w || point.h) {
        halfWidth = point.w/ 2,
        halfHeight = point.h/ 2;
        box = [
            {x: point.x, y: point.y},
            // BOX POINTS
            {x: point.x - halfWidth, y: point.y - halfHeight }, //TOP LEFT
            {x: point.x - halfWidth, y: point.y + halfHeight }, //BOTTOM LEFT
            {x: point.x + halfWidth, y: point.y - halfHeight}, //TOP RIGHT
            {x: point.x + halfWidth, y: point.y + halfHeight} // BOTTOM RIGHT
        ];
        // MIDDLE POINTS (less speed but more precise)
        if (this.middle_points) {
            box.push({x: point.x - halfWidth, y: point.y}); // MIDDLE LEFT
            box.push({x: point.x + halfWidth, y: point.y}); // MIDDLE RIGHT
            box.push({x: point.x, y: point.y - halfHeight}); // TOP RIGHT
            box.push({x: point.x, y: point.y + halfHeight}); // BOTTOM RIGHT
        }
    } else {
        box = [{x: point.x, y: point.y}];
    }
    for (var i = 0; i < box.length; i++) {
        hash = this._hash(box[i]);
        // make sure there's no doubles
        if (doubleCmp.indexOf(hash) == -1) {
            doubleCmp.push(hash);
            bucket = this.buckets[hash];
            if (bucket) {
                buckets.push(bucket);
            }
        }
    }
    return buckets;
};

/** @param point {x, y} */
SpatialHash.prototype._hash = function (point) {
    return [int(point.x / this.cell_size),int(point.y / this.cell_size)].join('');
};

function int (value) {
    return parseInt(value, 10);
}
w.SpatialHash = SpatialHash;

}(window));