
describe('retrieve', function () {
    var spatial;
    beforeEach(function () {
        spatial = new SpatialHash();
    });

    afterEach(function () {
        spatial = null;
    });

    it("should be empty hash object", function () {
        expect(spatial.buckets).toBeDefined();
    });

    it("should return list with inserted object in current cell", function () {
        var object = {id: '1', x: 10, y: 10};
        spatial.insert(object);
        var objects = spatial.retrieve({x: 8, y: 8});
        expect(objects.length).toBeDefined();
        expect(objects.length === 1).toBeTruthy();
        expect(objects[0].id == object.id).toBeTruthy();
        expect(objects[0] == object).toBeTruthy();
    });

    it("should return all objects matching cell", function () {
        var object1 = {id: '1', x: 10, y:10};
        var object2 = {id: '2', x: 9, y: 9};
        spatial.insert(object1);
        spatial.insert(object2);
        var objects = spatial.retrieve({x: 9, y: 9});
        expect(objects.length).toBeDefined();
        expect(objects.length === 2).toBeTruthy();
    });

    it("should return empty list when objects doesn't match cell", function () {
        var object1 = {id: '1', x: 10, y:10};
        var object2 = {id: '2', x: 9, y: 9};
        spatial.insert(object1);
        spatial.insert(object2);
        var objects = spatial.retrieve({x: 90, y: 90});
        expect(objects.length).toBeDefined();
        expect(objects.length === 0).toBeTruthy();
    });

    it("should remove object by id", function () {
        var object1 = {id: 111, x: 10, y: 10};
        spatial.insert(object1);
        spatial.remove(111);
        var objects = spatial.retrieve({x: 10, y: 10});
        expect(objects.length === 0).toBeTruthy();
    })
});
