var concaveman3d = (function () {
    'use strict';

    /**
     * Rearranges items so that all items in the [left, k] are the smallest.
     * The k-th element will have the (k - left + 1)-th smallest value in [left, right].
     *
     * @template T
     * @param {T[]} arr the array to partially sort (in place)
     * @param {number} k middle index for partial sorting (as defined above)
     * @param {number} [left=0] left index of the range to sort
     * @param {number} [right=arr.length-1] right index
     * @param {(a: T, b: T) => number} [compare = (a, b) => a - b] compare function
     */
    function quickselect(arr, k, left = 0, right = arr.length - 1, compare = defaultCompare) {

        while (right > left) {
            if (right - left > 600) {
                const n = right - left + 1;
                const m = k - left + 1;
                const z = Math.log(n);
                const s = 0.5 * Math.exp(2 * z / 3);
                const sd = 0.5 * Math.sqrt(z * s * (n - s) / n) * (m - n / 2 < 0 ? -1 : 1);
                const newLeft = Math.max(left, Math.floor(k - m * s / n + sd));
                const newRight = Math.min(right, Math.floor(k + (n - m) * s / n + sd));
                quickselect(arr, k, newLeft, newRight, compare);
            }

            const t = arr[k];
            let i = left;
            /** @type {number} */
            let j = right;

            swap(arr, left, k);
            if (compare(arr[right], t) > 0) swap(arr, left, right);

            while (i < j) {
                swap(arr, i, j);
                i++;
                j--;
                while (compare(arr[i], t) < 0) i++;
                while (compare(arr[j], t) > 0) j--;
            }

            if (compare(arr[left], t) === 0) swap(arr, left, j);
            else {
                j++;
                swap(arr, j, right);
            }

            if (j <= k) left = j + 1;
            if (k <= j) right = j - 1;
        }
    }

    /**
     * @template T
     * @param {T[]} arr
     * @param {number} i
     * @param {number} j
     */
    function swap(arr, i, j) {
        const tmp = arr[i];
        arr[i] = arr[j];
        arr[j] = tmp;
    }

    /**
     * @template T
     * @param {T} a
     * @param {T} b
     * @returns {number}
     */
    function defaultCompare(a, b) {
        return a < b ? -1 : a > b ? 1 : 0;
    }

    class RBush {
        constructor(maxEntries = 9) {
            // max entries in a node is 9 by default; min node fill is 40% for best performance
            this._maxEntries = Math.max(4, maxEntries);
            this._minEntries = Math.max(2, Math.ceil(this._maxEntries * 0.4));
            this.clear();
        }

        all() {
            return this._all(this.data, []);
        }

        search(bbox) {
            let node = this.data;
            const result = [];

            if (!intersects$1(bbox, node)) return result;

            const toBBox = this.toBBox;
            const nodesToSearch = [];

            while (node) {
                for (let i = 0; i < node.children.length; i++) {
                    const child = node.children[i];
                    const childBBox = node.leaf ? toBBox(child) : child;

                    if (intersects$1(bbox, childBBox)) {
                        if (node.leaf) result.push(child);
                        else if (contains(bbox, childBBox)) this._all(child, result);
                        else nodesToSearch.push(child);
                    }
                }
                node = nodesToSearch.pop();
            }

            return result;
        }

        collides(bbox) {
            let node = this.data;

            if (!intersects$1(bbox, node)) return false;

            const nodesToSearch = [];
            while (node) {
                for (let i = 0; i < node.children.length; i++) {
                    const child = node.children[i];
                    const childBBox = node.leaf ? this.toBBox(child) : child;

                    if (intersects$1(bbox, childBBox)) {
                        if (node.leaf || contains(bbox, childBBox)) return true;
                        nodesToSearch.push(child);
                    }
                }
                node = nodesToSearch.pop();
            }

            return false;
        }

        load(data) {
            if (!(data && data.length)) return this;

            if (data.length < this._minEntries) {
                for (let i = 0; i < data.length; i++) {
                    this.insert(data[i]);
                }
                return this;
            }

            // recursively build the tree with the given data from scratch using OMT algorithm
            let node = this._build(data.slice(), 0, data.length - 1, 0);

            if (!this.data.children.length) {
                // save as is if tree is empty
                this.data = node;

            } else if (this.data.height === node.height) {
                // split root if trees have the same height
                this._splitRoot(this.data, node);

            } else {
                if (this.data.height < node.height) {
                    // swap trees if inserted one is bigger
                    const tmpNode = this.data;
                    this.data = node;
                    node = tmpNode;
                }

                // insert the small tree into the large tree at appropriate level
                this._insert(node, this.data.height - node.height - 1, true);
            }

            return this;
        }

        insert(item) {
            if (item) this._insert(item, this.data.height - 1);
            return this;
        }

        clear() {
            this.data = createNode([]);
            return this;
        }

        remove(item, equalsFn) {
            if (!item) return this;

            let node = this.data;
            const bbox = this.toBBox(item);
            const path = [];
            const indexes = [];
            let i, parent, goingUp;

            // depth-first iterative tree traversal
            while (node || path.length) {

                if (!node) { // go up
                    node = path.pop();
                    parent = path[path.length - 1];
                    i = indexes.pop();
                    goingUp = true;
                }

                if (node.leaf) { // check current node
                    const index = findItem(item, node.children, equalsFn);

                    if (index !== -1) {
                        // item found, remove the item and condense tree upwards
                        node.children.splice(index, 1);
                        path.push(node);
                        this._condense(path);
                        return this;
                    }
                }

                if (!goingUp && !node.leaf && contains(node, bbox)) { // go down
                    path.push(node);
                    indexes.push(i);
                    i = 0;
                    parent = node;
                    node = node.children[0];

                } else if (parent) { // go right
                    i++;
                    node = parent.children[i];
                    goingUp = false;

                } else node = null; // nothing found
            }

            return this;
        }

        toBBox(item) { return item; }

        compareMinX(a, b) { return a.minX - b.minX; }
        compareMinY(a, b) { return a.minY - b.minY; }

        toJSON() { return this.data; }

        fromJSON(data) {
            this.data = data;
            return this;
        }

        _all(node, result) {
            const nodesToSearch = [];
            while (node) {
                if (node.leaf) result.push(...node.children);
                else nodesToSearch.push(...node.children);

                node = nodesToSearch.pop();
            }
            return result;
        }

        _build(items, left, right, height) {

            const N = right - left + 1;
            let M = this._maxEntries;
            let node;

            if (N <= M) {
                // reached leaf level; return leaf
                node = createNode(items.slice(left, right + 1));
                calcBBox(node, this.toBBox);
                return node;
            }

            if (!height) {
                // target height of the bulk-loaded tree
                height = Math.ceil(Math.log(N) / Math.log(M));

                // target number of root entries to maximize storage utilization
                M = Math.ceil(N / Math.pow(M, height - 1));
            }

            node = createNode([]);
            node.leaf = false;
            node.height = height;

            // split the items into M mostly square tiles

            const N2 = Math.ceil(N / M);
            const N1 = N2 * Math.ceil(Math.sqrt(M));

            multiSelect(items, left, right, N1, this.compareMinX);

            for (let i = left; i <= right; i += N1) {

                const right2 = Math.min(i + N1 - 1, right);

                multiSelect(items, i, right2, N2, this.compareMinY);

                for (let j = i; j <= right2; j += N2) {

                    const right3 = Math.min(j + N2 - 1, right2);

                    // pack each entry recursively
                    node.children.push(this._build(items, j, right3, height - 1));
                }
            }

            calcBBox(node, this.toBBox);

            return node;
        }

        _chooseSubtree(bbox, node, level, path) {
            while (true) {
                path.push(node);

                if (node.leaf || path.length - 1 === level) break;

                let minArea = Infinity;
                let minEnlargement = Infinity;
                let targetNode;

                for (let i = 0; i < node.children.length; i++) {
                    const child = node.children[i];
                    const area = bboxArea(child);
                    const enlargement = enlargedArea(bbox, child) - area;

                    // choose entry with the least area enlargement
                    if (enlargement < minEnlargement) {
                        minEnlargement = enlargement;
                        minArea = area < minArea ? area : minArea;
                        targetNode = child;

                    } else if (enlargement === minEnlargement) {
                        // otherwise choose one with the smallest area
                        if (area < minArea) {
                            minArea = area;
                            targetNode = child;
                        }
                    }
                }

                node = targetNode || node.children[0];
            }

            return node;
        }

        _insert(item, level, isNode) {
            const bbox = isNode ? item : this.toBBox(item);
            const insertPath = [];

            // find the best node for accommodating the item, saving all nodes along the path too
            const node = this._chooseSubtree(bbox, this.data, level, insertPath);

            // put the item into the node
            node.children.push(item);
            extend(node, bbox);

            // split on node overflow; propagate upwards if necessary
            while (level >= 0) {
                if (insertPath[level].children.length > this._maxEntries) {
                    this._split(insertPath, level);
                    level--;
                } else break;
            }

            // adjust bboxes along the insertion path
            this._adjustParentBBoxes(bbox, insertPath, level);
        }

        // split overflowed node into two
        _split(insertPath, level) {
            const node = insertPath[level];
            const M = node.children.length;
            const m = this._minEntries;

            this._chooseSplitAxis(node, m, M);

            const splitIndex = this._chooseSplitIndex(node, m, M);

            const newNode = createNode(node.children.splice(splitIndex, node.children.length - splitIndex));
            newNode.height = node.height;
            newNode.leaf = node.leaf;

            calcBBox(node, this.toBBox);
            calcBBox(newNode, this.toBBox);

            if (level) insertPath[level - 1].children.push(newNode);
            else this._splitRoot(node, newNode);
        }

        _splitRoot(node, newNode) {
            // split root node
            this.data = createNode([node, newNode]);
            this.data.height = node.height + 1;
            this.data.leaf = false;
            calcBBox(this.data, this.toBBox);
        }

        _chooseSplitIndex(node, m, M) {
            let index;
            let minOverlap = Infinity;
            let minArea = Infinity;

            for (let i = m; i <= M - m; i++) {
                const bbox1 = distBBox(node, 0, i, this.toBBox);
                const bbox2 = distBBox(node, i, M, this.toBBox);

                const overlap = intersectionArea(bbox1, bbox2);
                const area = bboxArea(bbox1) + bboxArea(bbox2);

                // choose distribution with minimum overlap
                if (overlap < minOverlap) {
                    minOverlap = overlap;
                    index = i;

                    minArea = area < minArea ? area : minArea;

                } else if (overlap === minOverlap) {
                    // otherwise choose distribution with minimum area
                    if (area < minArea) {
                        minArea = area;
                        index = i;
                    }
                }
            }

            return index || M - m;
        }

        // sorts node children by the best axis for split
        _chooseSplitAxis(node, m, M) {
            const compareMinX = node.leaf ? this.compareMinX : compareNodeMinX;
            const compareMinY = node.leaf ? this.compareMinY : compareNodeMinY;
            const xMargin = this._allDistMargin(node, m, M, compareMinX);
            const yMargin = this._allDistMargin(node, m, M, compareMinY);

            // if total distributions margin value is minimal for x, sort by minX,
            // otherwise it's already sorted by minY
            if (xMargin < yMargin) node.children.sort(compareMinX);
        }

        // total margin of all possible split distributions where each node is at least m full
        _allDistMargin(node, m, M, compare) {
            node.children.sort(compare);

            const toBBox = this.toBBox;
            const leftBBox = distBBox(node, 0, m, toBBox);
            const rightBBox = distBBox(node, M - m, M, toBBox);
            let margin = bboxMargin(leftBBox) + bboxMargin(rightBBox);

            for (let i = m; i < M - m; i++) {
                const child = node.children[i];
                extend(leftBBox, node.leaf ? toBBox(child) : child);
                margin += bboxMargin(leftBBox);
            }

            for (let i = M - m - 1; i >= m; i--) {
                const child = node.children[i];
                extend(rightBBox, node.leaf ? toBBox(child) : child);
                margin += bboxMargin(rightBBox);
            }

            return margin;
        }

        _adjustParentBBoxes(bbox, path, level) {
            // adjust bboxes along the given tree path
            for (let i = level; i >= 0; i--) {
                extend(path[i], bbox);
            }
        }

        _condense(path) {
            // go through the path, removing empty nodes and updating bboxes
            for (let i = path.length - 1, siblings; i >= 0; i--) {
                if (path[i].children.length === 0) {
                    if (i > 0) {
                        siblings = path[i - 1].children;
                        siblings.splice(siblings.indexOf(path[i]), 1);

                    } else this.clear();

                } else calcBBox(path[i], this.toBBox);
            }
        }
    }

    function findItem(item, items, equalsFn) {
        if (!equalsFn) return items.indexOf(item);

        for (let i = 0; i < items.length; i++) {
            if (equalsFn(item, items[i])) return i;
        }
        return -1;
    }

    // calculate node's bbox from bboxes of its children
    function calcBBox(node, toBBox) {
        distBBox(node, 0, node.children.length, toBBox, node);
    }

    // min bounding rectangle of node children from k to p-1
    function distBBox(node, k, p, toBBox, destNode) {
        if (!destNode) destNode = createNode(null);
        destNode.minX = Infinity;
        destNode.minY = Infinity;
        destNode.maxX = -Infinity;
        destNode.maxY = -Infinity;

        for (let i = k; i < p; i++) {
            const child = node.children[i];
            extend(destNode, node.leaf ? toBBox(child) : child);
        }

        return destNode;
    }

    function extend(a, b) {
        a.minX = Math.min(a.minX, b.minX);
        a.minY = Math.min(a.minY, b.minY);
        a.maxX = Math.max(a.maxX, b.maxX);
        a.maxY = Math.max(a.maxY, b.maxY);
        return a;
    }

    function compareNodeMinX(a, b) { return a.minX - b.minX; }
    function compareNodeMinY(a, b) { return a.minY - b.minY; }

    function bboxArea(a)   { return (a.maxX - a.minX) * (a.maxY - a.minY); }
    function bboxMargin(a) { return (a.maxX - a.minX) + (a.maxY - a.minY); }

    function enlargedArea(a, b) {
        return (Math.max(b.maxX, a.maxX) - Math.min(b.minX, a.minX)) *
               (Math.max(b.maxY, a.maxY) - Math.min(b.minY, a.minY));
    }

    function intersectionArea(a, b) {
        const minX = Math.max(a.minX, b.minX);
        const minY = Math.max(a.minY, b.minY);
        const maxX = Math.min(a.maxX, b.maxX);
        const maxY = Math.min(a.maxY, b.maxY);

        return Math.max(0, maxX - minX) *
               Math.max(0, maxY - minY);
    }

    function contains(a, b) {
        return a.minX <= b.minX &&
               a.minY <= b.minY &&
               b.maxX <= a.maxX &&
               b.maxY <= a.maxY;
    }

    function intersects$1(a, b) {
        return b.minX <= a.maxX &&
               b.minY <= a.maxY &&
               b.maxX >= a.minX &&
               b.maxY >= a.minY;
    }

    function createNode(children) {
        return {
            children,
            height: 1,
            leaf: true,
            minX: Infinity,
            minY: Infinity,
            maxX: -Infinity,
            maxY: -Infinity
        };
    }

    // sort an array so that items come in groups of n unsorted items, with groups sorted between each other;
    // combines selection algorithm with binary divide & conquer approach

    function multiSelect(arr, left, right, n, compare) {
        const stack = [left, right];

        while (stack.length) {
            right = stack.pop();
            left = stack.pop();

            if (right - left <= n) continue;

            const mid = left + Math.ceil((right - left) / n / 2) * n;
            quickselect(arr, mid, left, right, compare);

            stack.push(left, mid, mid, right);
        }
    }

    class TinyQueue {
        constructor(data = [], compare = (a, b) => (a < b ? -1 : a > b ? 1 : 0)) {
            this.data = data;
            this.length = this.data.length;
            this.compare = compare;

            if (this.length > 0) {
                for (let i = (this.length >> 1) - 1; i >= 0; i--) this._down(i);
            }
        }

        push(item) {
            this.data.push(item);
            this._up(this.length++);
        }

        pop() {
            if (this.length === 0) return undefined;

            const top = this.data[0];
            const bottom = this.data.pop();

            if (--this.length > 0) {
                this.data[0] = bottom;
                this._down(0);
            }

            return top;
        }

        peek() {
            return this.data[0];
        }

        _up(pos) {
            const {data, compare} = this;
            const item = data[pos];

            while (pos > 0) {
                const parent = (pos - 1) >> 1;
                const current = data[parent];
                if (compare(item, current) >= 0) break;
                data[pos] = current;
                pos = parent;
            }

            data[pos] = item;
        }

        _down(pos) {
            const {data, compare} = this;
            const halfLength = this.length >> 1;
            const item = data[pos];

            while (pos < halfLength) {
                let bestChild = (pos << 1) + 1; // initially it is the left child
                const right = bestChild + 1;

                if (right < this.length && compare(data[right], data[bestChild]) < 0) {
                    bestChild = right;
                }
                if (compare(data[bestChild], item) >= 0) break;

                data[pos] = data[bestChild];
                pos = bestChild;
            }

            data[pos] = item;
        }
    }

    function getDefaultExportFromCjs (x) {
    	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
    }

    var pointInPolygon$1 = {exports: {}};

    var flat;
    var hasRequiredFlat;

    function requireFlat () {
    	if (hasRequiredFlat) return flat;
    	hasRequiredFlat = 1;
    	flat = function pointInPolygonFlat (point, vs, start, end) {
    	    var x = point[0], y = point[1];
    	    var inside = false;
    	    if (start === undefined) start = 0;
    	    if (end === undefined) end = vs.length;
    	    var len = (end-start)/2;
    	    for (var i = 0, j = len - 1; i < len; j = i++) {
    	        var xi = vs[start+i*2+0], yi = vs[start+i*2+1];
    	        var xj = vs[start+j*2+0], yj = vs[start+j*2+1];
    	        var intersect = ((yi > y) !== (yj > y))
    	            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
    	        if (intersect) inside = !inside;
    	    }
    	    return inside;
    	};
    	return flat;
    }

    var nested;
    var hasRequiredNested;

    function requireNested () {
    	if (hasRequiredNested) return nested;
    	hasRequiredNested = 1;
    	// ray-casting algorithm based on
    	// https://wrf.ecse.rpi.edu/Research/Short_Notes/pnpoly.html

    	nested = function pointInPolygonNested (point, vs, start, end) {
    	    var x = point[0], y = point[1];
    	    var inside = false;
    	    if (start === undefined) start = 0;
    	    if (end === undefined) end = vs.length;
    	    var len = end - start;
    	    for (var i = 0, j = len - 1; i < len; j = i++) {
    	        var xi = vs[i+start][0], yi = vs[i+start][1];
    	        var xj = vs[j+start][0], yj = vs[j+start][1];
    	        var intersect = ((yi > y) !== (yj > y))
    	            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
    	        if (intersect) inside = !inside;
    	    }
    	    return inside;
    	};
    	return nested;
    }

    var hasRequiredPointInPolygon;

    function requirePointInPolygon () {
    	if (hasRequiredPointInPolygon) return pointInPolygon$1.exports;
    	hasRequiredPointInPolygon = 1;
    	var pointInPolygonFlat = /*@__PURE__*/ requireFlat();
    	var pointInPolygonNested = /*@__PURE__*/ requireNested();

    	pointInPolygon$1.exports = function pointInPolygon (point, vs, start, end) {
    	    if (vs.length > 0 && Array.isArray(vs[0])) {
    	        return pointInPolygonNested(point, vs, start, end);
    	    } else {
    	        return pointInPolygonFlat(point, vs, start, end);
    	    }
    	};
    	pointInPolygon$1.exports.nested = pointInPolygonNested;
    	pointInPolygon$1.exports.flat = pointInPolygonFlat;
    	return pointInPolygon$1.exports;
    }

    var pointInPolygonExports = /*@__PURE__*/ requirePointInPolygon();
    var pointInPolygon = /*@__PURE__*/getDefaultExportFromCjs(pointInPolygonExports);

    const epsilon = 1.1102230246251565e-16;
    const splitter = 134217729;
    const resulterrbound = (3 + 8 * epsilon) * epsilon;

    // fast_expansion_sum_zeroelim routine from oritinal code
    function sum(elen, e, flen, f, h) {
        let Q, Qnew, hh, bvirt;
        let enow = e[0];
        let fnow = f[0];
        let eindex = 0;
        let findex = 0;
        if ((fnow > enow) === (fnow > -enow)) {
            Q = enow;
            enow = e[++eindex];
        } else {
            Q = fnow;
            fnow = f[++findex];
        }
        let hindex = 0;
        if (eindex < elen && findex < flen) {
            if ((fnow > enow) === (fnow > -enow)) {
                Qnew = enow + Q;
                hh = Q - (Qnew - enow);
                enow = e[++eindex];
            } else {
                Qnew = fnow + Q;
                hh = Q - (Qnew - fnow);
                fnow = f[++findex];
            }
            Q = Qnew;
            if (hh !== 0) {
                h[hindex++] = hh;
            }
            while (eindex < elen && findex < flen) {
                if ((fnow > enow) === (fnow > -enow)) {
                    Qnew = Q + enow;
                    bvirt = Qnew - Q;
                    hh = Q - (Qnew - bvirt) + (enow - bvirt);
                    enow = e[++eindex];
                } else {
                    Qnew = Q + fnow;
                    bvirt = Qnew - Q;
                    hh = Q - (Qnew - bvirt) + (fnow - bvirt);
                    fnow = f[++findex];
                }
                Q = Qnew;
                if (hh !== 0) {
                    h[hindex++] = hh;
                }
            }
        }
        while (eindex < elen) {
            Qnew = Q + enow;
            bvirt = Qnew - Q;
            hh = Q - (Qnew - bvirt) + (enow - bvirt);
            enow = e[++eindex];
            Q = Qnew;
            if (hh !== 0) {
                h[hindex++] = hh;
            }
        }
        while (findex < flen) {
            Qnew = Q + fnow;
            bvirt = Qnew - Q;
            hh = Q - (Qnew - bvirt) + (fnow - bvirt);
            fnow = f[++findex];
            Q = Qnew;
            if (hh !== 0) {
                h[hindex++] = hh;
            }
        }
        if (Q !== 0 || hindex === 0) {
            h[hindex++] = Q;
        }
        return hindex;
    }

    function estimate(elen, e) {
        let Q = e[0];
        for (let i = 1; i < elen; i++) Q += e[i];
        return Q;
    }

    function vec(n) {
        return new Float64Array(n);
    }

    const ccwerrboundA = (3 + 16 * epsilon) * epsilon;
    const ccwerrboundB = (2 + 12 * epsilon) * epsilon;
    const ccwerrboundC = (9 + 64 * epsilon) * epsilon * epsilon;

    const B = vec(4);
    const C1 = vec(8);
    const C2 = vec(12);
    const D = vec(16);
    const u = vec(4);

    function orient2dadapt(ax, ay, bx, by, cx, cy, detsum) {
        let acxtail, acytail, bcxtail, bcytail;
        let bvirt, c, ahi, alo, bhi, blo, _i, _j, _0, s1, s0, t1, t0, u3;

        const acx = ax - cx;
        const bcx = bx - cx;
        const acy = ay - cy;
        const bcy = by - cy;

        s1 = acx * bcy;
        c = splitter * acx;
        ahi = c - (c - acx);
        alo = acx - ahi;
        c = splitter * bcy;
        bhi = c - (c - bcy);
        blo = bcy - bhi;
        s0 = alo * blo - (s1 - ahi * bhi - alo * bhi - ahi * blo);
        t1 = acy * bcx;
        c = splitter * acy;
        ahi = c - (c - acy);
        alo = acy - ahi;
        c = splitter * bcx;
        bhi = c - (c - bcx);
        blo = bcx - bhi;
        t0 = alo * blo - (t1 - ahi * bhi - alo * bhi - ahi * blo);
        _i = s0 - t0;
        bvirt = s0 - _i;
        B[0] = s0 - (_i + bvirt) + (bvirt - t0);
        _j = s1 + _i;
        bvirt = _j - s1;
        _0 = s1 - (_j - bvirt) + (_i - bvirt);
        _i = _0 - t1;
        bvirt = _0 - _i;
        B[1] = _0 - (_i + bvirt) + (bvirt - t1);
        u3 = _j + _i;
        bvirt = u3 - _j;
        B[2] = _j - (u3 - bvirt) + (_i - bvirt);
        B[3] = u3;

        let det = estimate(4, B);
        let errbound = ccwerrboundB * detsum;
        if (det >= errbound || -det >= errbound) {
            return det;
        }

        bvirt = ax - acx;
        acxtail = ax - (acx + bvirt) + (bvirt - cx);
        bvirt = bx - bcx;
        bcxtail = bx - (bcx + bvirt) + (bvirt - cx);
        bvirt = ay - acy;
        acytail = ay - (acy + bvirt) + (bvirt - cy);
        bvirt = by - bcy;
        bcytail = by - (bcy + bvirt) + (bvirt - cy);

        if (acxtail === 0 && acytail === 0 && bcxtail === 0 && bcytail === 0) {
            return det;
        }

        errbound = ccwerrboundC * detsum + resulterrbound * Math.abs(det);
        det += (acx * bcytail + bcy * acxtail) - (acy * bcxtail + bcx * acytail);
        if (det >= errbound || -det >= errbound) return det;

        s1 = acxtail * bcy;
        c = splitter * acxtail;
        ahi = c - (c - acxtail);
        alo = acxtail - ahi;
        c = splitter * bcy;
        bhi = c - (c - bcy);
        blo = bcy - bhi;
        s0 = alo * blo - (s1 - ahi * bhi - alo * bhi - ahi * blo);
        t1 = acytail * bcx;
        c = splitter * acytail;
        ahi = c - (c - acytail);
        alo = acytail - ahi;
        c = splitter * bcx;
        bhi = c - (c - bcx);
        blo = bcx - bhi;
        t0 = alo * blo - (t1 - ahi * bhi - alo * bhi - ahi * blo);
        _i = s0 - t0;
        bvirt = s0 - _i;
        u[0] = s0 - (_i + bvirt) + (bvirt - t0);
        _j = s1 + _i;
        bvirt = _j - s1;
        _0 = s1 - (_j - bvirt) + (_i - bvirt);
        _i = _0 - t1;
        bvirt = _0 - _i;
        u[1] = _0 - (_i + bvirt) + (bvirt - t1);
        u3 = _j + _i;
        bvirt = u3 - _j;
        u[2] = _j - (u3 - bvirt) + (_i - bvirt);
        u[3] = u3;
        const C1len = sum(4, B, 4, u, C1);

        s1 = acx * bcytail;
        c = splitter * acx;
        ahi = c - (c - acx);
        alo = acx - ahi;
        c = splitter * bcytail;
        bhi = c - (c - bcytail);
        blo = bcytail - bhi;
        s0 = alo * blo - (s1 - ahi * bhi - alo * bhi - ahi * blo);
        t1 = acy * bcxtail;
        c = splitter * acy;
        ahi = c - (c - acy);
        alo = acy - ahi;
        c = splitter * bcxtail;
        bhi = c - (c - bcxtail);
        blo = bcxtail - bhi;
        t0 = alo * blo - (t1 - ahi * bhi - alo * bhi - ahi * blo);
        _i = s0 - t0;
        bvirt = s0 - _i;
        u[0] = s0 - (_i + bvirt) + (bvirt - t0);
        _j = s1 + _i;
        bvirt = _j - s1;
        _0 = s1 - (_j - bvirt) + (_i - bvirt);
        _i = _0 - t1;
        bvirt = _0 - _i;
        u[1] = _0 - (_i + bvirt) + (bvirt - t1);
        u3 = _j + _i;
        bvirt = u3 - _j;
        u[2] = _j - (u3 - bvirt) + (_i - bvirt);
        u[3] = u3;
        const C2len = sum(C1len, C1, 4, u, C2);

        s1 = acxtail * bcytail;
        c = splitter * acxtail;
        ahi = c - (c - acxtail);
        alo = acxtail - ahi;
        c = splitter * bcytail;
        bhi = c - (c - bcytail);
        blo = bcytail - bhi;
        s0 = alo * blo - (s1 - ahi * bhi - alo * bhi - ahi * blo);
        t1 = acytail * bcxtail;
        c = splitter * acytail;
        ahi = c - (c - acytail);
        alo = acytail - ahi;
        c = splitter * bcxtail;
        bhi = c - (c - bcxtail);
        blo = bcxtail - bhi;
        t0 = alo * blo - (t1 - ahi * bhi - alo * bhi - ahi * blo);
        _i = s0 - t0;
        bvirt = s0 - _i;
        u[0] = s0 - (_i + bvirt) + (bvirt - t0);
        _j = s1 + _i;
        bvirt = _j - s1;
        _0 = s1 - (_j - bvirt) + (_i - bvirt);
        _i = _0 - t1;
        bvirt = _0 - _i;
        u[1] = _0 - (_i + bvirt) + (bvirt - t1);
        u3 = _j + _i;
        bvirt = u3 - _j;
        u[2] = _j - (u3 - bvirt) + (_i - bvirt);
        u[3] = u3;
        const Dlen = sum(C2len, C2, 4, u, D);

        return D[Dlen - 1];
    }

    function orient2d(ax, ay, bx, by, cx, cy) {
        const detleft = (ay - cy) * (bx - cx);
        const detright = (ax - cx) * (by - cy);
        const det = detleft - detright;

        const detsum = Math.abs(detleft + detright);
        if (Math.abs(det) >= ccwerrboundA * detsum) return det;

        return -orient2dadapt(ax, ay, bx, by, cx, cy, detsum);
    }

    function concaveman(points, concavity, lengthThreshold) {
        // a relative measure of concavity; higher value means simpler hull
        concavity = Math.max(0, concavity === undefined ? 2 : concavity);

        // when a segment goes below this length threshold, it won't be drilled down further
        lengthThreshold = lengthThreshold || 0;

        // start with a convex hull of the points
        const hull = fastConvexHull(points);

        // index the points with an R-tree
        const tree = new RBush(16);
        tree.toBBox = function (a) {
            return {
                minX: a[0],
                minY: a[1],
                maxX: a[0],
                maxY: a[1]
            };
        };
        tree.compareMinX = function (a, b) { return a[0] - b[0]; };
        tree.compareMinY = function (a, b) { return a[1] - b[1]; };

        tree.load(points);

        // turn the convex hull into a linked list and populate the initial edge queue with the nodes
        const queue = [];
        let last;
        for (let i = 0; i < hull.length; i++) {
            const p = hull[i];
            tree.remove(p);
            last = insertNode(p, last);
            queue.push(last);
        }

        // index the segments with an R-tree (for intersection checks)
        const segTree = new RBush(16);
        for (let i = 0; i < queue.length; i++) segTree.insert(updateBBox(queue[i]));

        const sqConcavity = concavity * concavity;
        const sqLenThreshold = lengthThreshold * lengthThreshold;

        // process edges one by one
        while (queue.length) {
            const node = queue.shift();
            const a = node.p;
            const b = node.next.p;

            // skip the edge if it's already short enough
            const sqLen = getSqDist(a, b);
            if (sqLen < sqLenThreshold) continue;

            const maxSqLen = sqLen / sqConcavity;

            // find the best connection point for the current edge to flex inward to
            const p = findCandidate(tree, node.prev.p, a, b, node.next.next.p, maxSqLen, segTree);

            // if we found a connection and it satisfies our concavity measure
            if (p && Math.min(getSqDist(p, a), getSqDist(p, b)) <= maxSqLen) {
                // connect the edge endpoints through this point and add 2 new edges to the queue
                queue.push(node);
                queue.push(insertNode(p, node));

                // update point and segment indexes
                tree.remove(p);
                segTree.remove(node);
                segTree.insert(updateBBox(node));
                segTree.insert(updateBBox(node.next));
            }
        }

        // convert the resulting hull linked list to an array of points
        let node = last;
        const concave = [];
        do {
            concave.push(node.p);
            node = node.next;
        } while (node !== last);

        concave.push(node.p);

        return concave;
    }

    function findCandidate(tree, a, b, c, d, maxDist, segTree) {
        const queue = new TinyQueue([], compareDist);
        let node = tree.data;

        // search through the point R-tree with a depth-first search using a priority queue
        // in the order of distance to the edge (b, c)
        while (node) {
            for (let i = 0; i < node.children.length; i++) {
                const child = node.children[i];

                const dist = node.leaf ? sqSegDist(child, b, c) : sqSegBoxDist(b, c, child);
                if (dist > maxDist) continue; // skip the node if it's farther than we ever need

                queue.push({
                    node: child,
                    dist
                });
            }

            while (queue.length && !queue.peek().node.children) {
                const item = queue.pop();
                const p = item.node;

                // skip all points that are as close to adjacent edges (a,b) and (c,d),
                // and points that would introduce self-intersections when connected
                const d0 = sqSegDist(p, a, b);
                const d1 = sqSegDist(p, c, d);
                if (item.dist < d0 && item.dist < d1 &&
                    noIntersections(b, p, segTree) &&
                    noIntersections(c, p, segTree)) return p;
            }

            node = queue.pop();
            if (node) node = node.node;
        }

        return null;
    }

    function compareDist(a, b) {
        return a.dist - b.dist;
    }

    // square distance from a segment bounding box to the given one
    function sqSegBoxDist(a, b, bbox) {
        if (inside(a, bbox) || inside(b, bbox)) return 0;
        const d1 = sqSegSegDist(a[0], a[1], b[0], b[1], bbox.minX, bbox.minY, bbox.maxX, bbox.minY);
        if (d1 === 0) return 0;
        const d2 = sqSegSegDist(a[0], a[1], b[0], b[1], bbox.minX, bbox.minY, bbox.minX, bbox.maxY);
        if (d2 === 0) return 0;
        const d3 = sqSegSegDist(a[0], a[1], b[0], b[1], bbox.maxX, bbox.minY, bbox.maxX, bbox.maxY);
        if (d3 === 0) return 0;
        const d4 = sqSegSegDist(a[0], a[1], b[0], b[1], bbox.minX, bbox.maxY, bbox.maxX, bbox.maxY);
        if (d4 === 0) return 0;
        return Math.min(d1, d2, d3, d4);
    }

    function inside(a, bbox) {
        return a[0] >= bbox.minX &&
               a[0] <= bbox.maxX &&
               a[1] >= bbox.minY &&
               a[1] <= bbox.maxY;
    }

    // check if the edge (a,b) doesn't intersect any other edges
    function noIntersections(a, b, segTree) {
        const minX = Math.min(a[0], b[0]);
        const minY = Math.min(a[1], b[1]);
        const maxX = Math.max(a[0], b[0]);
        const maxY = Math.max(a[1], b[1]);

        const edges = segTree.search({minX, minY, maxX, maxY});
        for (let i = 0; i < edges.length; i++) {
            if (intersects(edges[i].p, edges[i].next.p, a, b)) return false;
        }
        return true;
    }

    function cross(p1, p2, p3) {
        return orient2d(p1[0], p1[1], p2[0], p2[1], p3[0], p3[1]);
    }

    // check if the edges (p1,q1) and (p2,q2) intersect
    function intersects(p1, q1, p2, q2) {
        return p1 !== q2 && q1 !== p2 &&
            cross(p1, q1, p2) > 0 !== cross(p1, q1, q2) > 0 &&
            cross(p2, q2, p1) > 0 !== cross(p2, q2, q1) > 0;
    }

    // update the bounding box of a node's edge
    function updateBBox(node) {
        const p1 = node.p;
        const p2 = node.next.p;
        node.minX = Math.min(p1[0], p2[0]);
        node.minY = Math.min(p1[1], p2[1]);
        node.maxX = Math.max(p1[0], p2[0]);
        node.maxY = Math.max(p1[1], p2[1]);
        return node;
    }

    // speed up convex hull by filtering out points inside quadrilateral formed by 4 extreme points
    function fastConvexHull(points) {
        let left = points[0];
        let top = points[0];
        let right = points[0];
        let bottom = points[0];

        // find the leftmost, rightmost, topmost and bottommost points
        for (let i = 0; i < points.length; i++) {
            const p = points[i];
            if (p[0] < left[0]) left = p;
            if (p[0] > right[0]) right = p;
            if (p[1] < top[1]) top = p;
            if (p[1] > bottom[1]) bottom = p;
        }

        // filter out points that are inside the resulting quadrilateral
        const cull = [left, top, right, bottom];
        const filtered = cull.slice();
        for (let i = 0; i < points.length; i++) {
            if (!pointInPolygon(points[i], cull)) filtered.push(points[i]);
        }

        // get convex hull around the filtered points
        return convexHull(filtered);
    }

    // create a new node in a doubly linked list
    function insertNode(p, prev) {
        const node = {
            p,
            prev: null,
            next: null,
            minX: 0,
            minY: 0,
            maxX: 0,
            maxY: 0
        };

        if (!prev) {
            node.prev = node;
            node.next = node;

        } else {
            node.next = prev.next;
            node.prev = prev;
            prev.next.prev = node;
            prev.next = node;
        }
        return node;
    }

    // square distance between 2 points
    function getSqDist(p1, p2) {

        const dx = p1[0] - p2[0],
            dy = p1[1] - p2[1];

        return dx * dx + dy * dy;
    }

    // square distance from a point to a segment
    function sqSegDist(p, p1, p2) {

        let x = p1[0],
            y = p1[1],
            dx = p2[0] - x,
            dy = p2[1] - y;

        if (dx !== 0 || dy !== 0) {

            const t = ((p[0] - x) * dx + (p[1] - y) * dy) / (dx * dx + dy * dy);

            if (t > 1) {
                x = p2[0];
                y = p2[1];

            } else if (t > 0) {
                x += dx * t;
                y += dy * t;
            }
        }

        dx = p[0] - x;
        dy = p[1] - y;

        return dx * dx + dy * dy;
    }

    // segment to segment distance, ported from http://geomalgorithms.com/a07-_distance.html by Dan Sunday
    function sqSegSegDist(x0, y0, x1, y1, x2, y2, x3, y3) {
        const ux = x1 - x0;
        const uy = y1 - y0;
        const vx = x3 - x2;
        const vy = y3 - y2;
        const wx = x0 - x2;
        const wy = y0 - y2;
        const a = ux * ux + uy * uy;
        const b = ux * vx + uy * vy;
        const c = vx * vx + vy * vy;
        const d = ux * wx + uy * wy;
        const e = vx * wx + vy * wy;
        const D = a * c - b * b;

        let sN, tN;
        let sD = D;
        let tD = D;

        if (D === 0) {
            sN = 0;
            sD = 1;
            tN = e;
            tD = c;
        } else {
            sN = b * e - c * d;
            tN = a * e - b * d;
            if (sN < 0) {
                sN = 0;
                tN = e;
                tD = c;
            } else if (sN > sD) {
                sN = sD;
                tN = e + b;
                tD = c;
            }
        }

        if (tN < 0.0) {
            tN = 0.0;
            if (-d < 0.0) sN = 0.0;
            else if (-d > a) sN = sD;
            else {
                sN = -d;
                sD = a;
            }
        } else if (tN > tD) {
            tN = tD;
            if ((-d + b) < 0.0) sN = 0;
            else if (-d + b > a) sN = sD;
            else {
                sN = -d + b;
                sD = a;
            }
        }

        const sc = sN === 0 ? 0 : sN / sD;
        const tc = tN === 0 ? 0 : tN / tD;

        const cx = (1 - sc) * x0 + sc * x1;
        const cy = (1 - sc) * y0 + sc * y1;
        const cx2 = (1 - tc) * x2 + tc * x3;
        const cy2 = (1 - tc) * y2 + tc * y3;
        const dx = cx2 - cx;
        const dy = cy2 - cy;

        return dx * dx + dy * dy;
    }

    function compareByX(a, b) {
        return a[0] === b[0] ? a[1] - b[1] : a[0] - b[0];
    }

    function convexHull(points) {
        points.sort(compareByX);

        const lower = [];
        for (let i = 0; i < points.length; i++) {
            while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], points[i]) <= 0) {
                lower.pop();
            }
            lower.push(points[i]);
        }

        const upper = [];
        for (let ii = points.length - 1; ii >= 0; ii--) {
            while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], points[ii]) <= 0) {
                upper.pop();
            }
            upper.push(points[ii]);
        }

        upper.pop();
        lower.pop();
        return lower.concat(upper);
    }

    return concaveman;

})();
