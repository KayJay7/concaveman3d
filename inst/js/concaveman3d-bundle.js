var concaveman3d = (function () {
    'use strict';

    const EPSILON = 0.000001;

    /**
     * 3 Dimensional Vector
     */
    class Vec3 extends Float32Array {
        /**
        * The number of bytes in a {@link Vec3}.
        */
        static BYTE_LENGTH = 3 * Float32Array.BYTES_PER_ELEMENT;
        /**
        * Create a {@link Vec3}.
        */
        constructor(...values) {
            switch (values.length) {
                case 3:
                    super(values);
                    break;
                case 2:
                    super(values[0], values[1], 3);
                    break;
                case 1: {
                    const v = values[0];
                    if (typeof v === 'number') {
                        super([v, v, v]);
                    }
                    else {
                        super(v, 0, 3);
                    }
                    break;
                }
                default:
                    super(3);
                    break;
            }
        }
        //============
        // Attributes
        //============
        // Getters and setters to make component access read better.
        // These are likely to be a little bit slower than direct array access.
        /**
         * The x component of the vector. Equivalent to `this[0];`
         * @category Vector components
         */
        get x() { return this[0]; }
        set x(value) { this[0] = value; }
        /**
         * The y component of the vector. Equivalent to `this[1];`
         * @category Vector components
         */
        get y() { return this[1]; }
        set y(value) { this[1] = value; }
        /**
         * The z component of the vector. Equivalent to `this[2];`
         * @category Vector components
         */
        get z() { return this[2]; }
        set z(value) { this[2] = value; }
        // Alternate set of getters and setters in case this is being used to define
        // a color.
        /**
         * The r component of the vector. Equivalent to `this[0];`
         * @category Color components
         */
        get r() { return this[0]; }
        set r(value) { this[0] = value; }
        /**
         * The g component of the vector. Equivalent to `this[1];`
         * @category Color components
         */
        get g() { return this[1]; }
        set g(value) { this[1] = value; }
        /**
         * The b component of the vector. Equivalent to `this[2];`
         * @category Color components
         */
        get b() { return this[2]; }
        set b(value) { this[2] = value; }
        /**
         * The magnitude (length) of this.
         * Equivalent to `Vec3.magnitude(this);`
         *
         * Magnitude is used because the `length` attribute is already defined by
         * TypedArrays to mean the number of elements in the array.
         */
        get magnitude() {
            const x = this[0];
            const y = this[1];
            const z = this[2];
            return Math.sqrt(x * x + y * y + z * z);
        }
        /**
         * Alias for {@link Vec3.magnitude}
         */
        get mag() { return this.magnitude; }
        /**
         * The squared magnitude (length) of `this`.
         * Equivalent to `Vec3.squaredMagnitude(this);`
         */
        get squaredMagnitude() {
            const x = this[0];
            const y = this[1];
            const z = this[2];
            return x * x + y * y + z * z;
        }
        /**
         * Alias for {@link Vec3.squaredMagnitude}
         */
        get sqrMag() { return this.squaredMagnitude; }
        /**
         * A string representation of `this`
         * Equivalent to `Vec3.str(this);`
         */
        get str() {
            return Vec3.str(this);
        }
        //===================
        // Instances methods
        //===================
        /**
         * Copy the values from another {@link Vec3} into `this`.
         *
         * @param a the source vector
         * @returns `this`
         */
        copy(a) {
            this.set(a);
            return this;
        }
        /**
         * Adds a {@link Vec3} to `this`.
         * Equivalent to `Vec3.add(this, this, b);`
         *
         * @param b - The vector to add to `this`
         * @returns `this`
         */
        add(b) {
            this[0] += b[0];
            this[1] += b[1];
            this[2] += b[2];
            return this;
        }
        /**
         * Subtracts a {@link Vec3} from `this`.
         * Equivalent to `Vec3.subtract(this, this, b);`
         *
         * @param b - The vector to subtract from `this`
         * @returns `this`
         */
        subtract(b) {
            this[0] -= b[0];
            this[1] -= b[1];
            this[2] -= b[2];
            return this;
        }
        /**
         * Alias for {@link Vec3.subtract}
         */
        sub(b) { return this; }
        /**
         * Multiplies `this` by a {@link Vec3}.
         * Equivalent to `Vec3.multiply(this, this, b);`
         *
         * @param b - The vector to multiply `this` by
         * @returns `this`
         */
        multiply(b) {
            this[0] *= b[0];
            this[1] *= b[1];
            this[2] *= b[2];
            return this;
        }
        /**
         * Alias for {@link Vec3.multiply}
         */
        mul(b) { return this; }
        /**
         * Divides `this` by a {@link Vec3}.
         * Equivalent to `Vec3.divide(this, this, b);`
         *
         * @param b - The vector to divide `this` by
         * @returns `this`
         */
        divide(b) {
            this[0] /= b[0];
            this[1] /= b[1];
            this[2] /= b[2];
            return this;
        }
        /**
         * Alias for {@link Vec3.divide}
         */
        div(b) { return this; }
        /**
         * Scales `this` by a scalar number.
         * Equivalent to `Vec3.scale(this, this, b);`
         *
         * @param b - Amount to scale `this` by
         * @returns `this`
         */
        scale(b) {
            this[0] *= b;
            this[1] *= b;
            this[2] *= b;
            return this;
        }
        /**
         * Calculates `this` scaled by a scalar value then adds the result to `this`.
         * Equivalent to `Vec3.scaleAndAdd(this, this, b, scale);`
         *
         * @param b - The vector to add to `this`
         * @param scale - The amount to scale `b` by before adding
         * @returns `this`
         */
        scaleAndAdd(b, scale) {
            this[0] += b[0] * scale;
            this[1] += b[1] * scale;
            this[2] += b[2] * scale;
            return this;
        }
        /**
         * Calculates the euclidian distance between another {@link Vec3} and `this`.
         * Equivalent to `Vec3.distance(this, b);`
         *
         * @param b - The vector to calculate the distance to
         * @returns Distance between `this` and `b`
         */
        distance(b) {
            return Vec3.distance(this, b);
        }
        /**
         * Alias for {@link Vec3.distance}
         */
        dist(b) { return 0; }
        /**
         * Calculates the squared euclidian distance between another {@link Vec3} and `this`.
         * Equivalent to `Vec3.squaredDistance(this, b);`
         *
         * @param b The vector to calculate the squared distance to
         * @returns Squared distance between `this` and `b`
         */
        squaredDistance(b) {
            return Vec3.squaredDistance(this, b);
        }
        /**
         * Alias for {@link Vec3.squaredDistance}
         */
        sqrDist(b) { return 0; }
        /**
         * Negates the components of `this`.
         * Equivalent to `Vec3.negate(this, this);`
         *
         * @returns `this`
         */
        negate() {
            this[0] *= -1;
            this[1] *= -1;
            this[2] *= -1;
            return this;
        }
        /**
         * Inverts the components of `this`.
         * Equivalent to `Vec3.inverse(this, this);`
         *
         * @returns `this`
         */
        invert() {
            this[0] = 1.0 / this[0];
            this[1] = 1.0 / this[1];
            this[2] = 1.0 / this[2];
            return this;
        }
        /**
         * Sets each component of `this` to it's absolute value.
         * Equivalent to `Vec3.abs(this, this);`
         *
         * @returns `this`
         */
        abs() {
            this[0] = Math.abs(this[0]);
            this[1] = Math.abs(this[1]);
            this[2] = Math.abs(this[2]);
            return this;
        }
        /**
         * Calculates the dot product of this and another {@link Vec3}.
         * Equivalent to `Vec3.dot(this, b);`
         *
         * @param b - The second operand
         * @returns Dot product of `this` and `b`
         */
        dot(b) {
            return this[0] * b[0] + this[1] * b[1] + this[2] * b[2];
        }
        /**
         * Normalize `this`.
         * Equivalent to `Vec3.normalize(this, this);`
         *
         * @returns `this`
         */
        normalize() {
            return Vec3.normalize(this, this);
        }
        //================
        // Static methods
        //================
        /**
         * Creates a new, empty vec3
         * @category Static
         *
         * @returns a new 3D vector
         */
        static create() {
            return new Vec3();
        }
        /**
         * Creates a new vec3 initialized with values from an existing vector
         * @category Static
         *
         * @param a - vector to clone
         * @returns a new 3D vector
         */
        static clone(a) {
            return new Vec3(a);
        }
        /**
         * Calculates the magnitude (length) of a {@link Vec3}
         * @category Static
         *
         * @param a - Vector to calculate magnitude of
         * @returns Magnitude of a
         */
        static magnitude(a) {
            let x = a[0];
            let y = a[1];
            let z = a[2];
            return Math.sqrt(x * x + y * y + z * z);
        }
        /**
         * Alias for {@link Vec3.magnitude}
         * @category Static
         */
        static mag(a) { return 0; }
        /**
         * Alias for {@link Vec3.magnitude}
         * @category Static
         * @deprecated Use {@link Vec3.magnitude} to avoid conflicts with builtin `length` methods/attribs
         *
         * @param a - vector to calculate length of
         * @returns length of a
         */
        // @ts-ignore: Length conflicts with Function.length
        static length(a) { return 0; }
        /**
         * Alias for {@link Vec3.magnitude}
         * @category Static
         * @deprecated Use {@link Vec3.mag}
         */
        static len(a) { return 0; }
        /**
         * Creates a new vec3 initialized with the given values
         * @category Static
         *
         * @param x - X component
         * @param y - Y component
         * @param z - Z component
         * @returns a new 3D vector
         */
        static fromValues(x, y, z) {
            return new Vec3(x, y, z);
        }
        /**
         * Copy the values from one vec3 to another
         * @category Static
         *
         * @param out - the receiving vector
         * @param a - the source vector
         * @returns `out`
         */
        static copy(out, a) {
            out[0] = a[0];
            out[1] = a[1];
            out[2] = a[2];
            return out;
        }
        /**
         * Set the components of a vec3 to the given values
         * @category Static
         *
         * @param out - the receiving vector
         * @param x - X component
         * @param y - Y component
         * @param z - Z component
         * @returns `out`
         */
        static set(out, x, y, z) {
            out[0] = x;
            out[1] = y;
            out[2] = z;
            return out;
        }
        /**
         * Adds two {@link Vec3}s
         * @category Static
         *
         * @param out - The receiving vector
         * @param a - The first operand
         * @param b - The second operand
         * @returns `out`
         */
        static add(out, a, b) {
            out[0] = a[0] + b[0];
            out[1] = a[1] + b[1];
            out[2] = a[2] + b[2];
            return out;
        }
        /**
         * Subtracts vector b from vector a
         * @category Static
         *
         * @param out - the receiving vector
         * @param a - the first operand
         * @param b - the second operand
         * @returns `out`
         */
        static subtract(out, a, b) {
            out[0] = a[0] - b[0];
            out[1] = a[1] - b[1];
            out[2] = a[2] - b[2];
            return out;
        }
        /**
         * Alias for {@link Vec3.subtract}
         * @category Static
         */
        static sub(out, a, b) { return [0, 0, 0]; }
        ;
        /**
         * Multiplies two vec3's
         * @category Static
         *
         * @param out - the receiving vector
         * @param a - the first operand
         * @param b - the second operand
         * @returns `out`
         */
        static multiply(out, a, b) {
            out[0] = a[0] * b[0];
            out[1] = a[1] * b[1];
            out[2] = a[2] * b[2];
            return out;
        }
        /**
         * Alias for {@link Vec3.multiply}
         * @category Static
         */
        static mul(out, a, b) { return [0, 0, 0]; }
        /**
         * Divides two vec3's
         * @category Static
         *
         * @param out - the receiving vector
         * @param a - the first operand
         * @param b - the second operand
         * @returns `out`
         */
        static divide(out, a, b) {
            out[0] = a[0] / b[0];
            out[1] = a[1] / b[1];
            out[2] = a[2] / b[2];
            return out;
        }
        /**
         * Alias for {@link Vec3.divide}
         * @category Static
         */
        static div(out, a, b) { return [0, 0, 0]; }
        ;
        /**
         * Math.ceil the components of a vec3
         * @category Static
         *
         * @param out - the receiving vector
         * @param a - vector to ceil
         * @returns `out`
         */
        static ceil(out, a) {
            out[0] = Math.ceil(a[0]);
            out[1] = Math.ceil(a[1]);
            out[2] = Math.ceil(a[2]);
            return out;
        }
        /**
         * Math.floor the components of a vec3
         * @category Static
         *
         * @param out - the receiving vector
         * @param a - vector to floor
         * @returns `out`
         */
        static floor(out, a) {
            out[0] = Math.floor(a[0]);
            out[1] = Math.floor(a[1]);
            out[2] = Math.floor(a[2]);
            return out;
        }
        /**
         * Returns the minimum of two vec3's
         * @category Static
         *
         * @param out - the receiving vector
         * @param a - the first operand
         * @param b - the second operand
         * @returns `out`
         */
        static min(out, a, b) {
            out[0] = Math.min(a[0], b[0]);
            out[1] = Math.min(a[1], b[1]);
            out[2] = Math.min(a[2], b[2]);
            return out;
        }
        /**
         * Returns the maximum of two vec3's
         * @category Static
         *
         * @param out - the receiving vector
         * @param a - the first operand
         * @param b - the second operand
         * @returns `out`
         */
        static max(out, a, b) {
            out[0] = Math.max(a[0], b[0]);
            out[1] = Math.max(a[1], b[1]);
            out[2] = Math.max(a[2], b[2]);
            return out;
        }
        /**
         * symmetric round the components of a vec3
         * @category Static
         *
         * @param out - the receiving vector
         * @param a - vector to round
         * @returns `out`
         */
        /*static round(out: Vec3Like, a: Readonly<Vec3Like>): Vec3Like {
          out[0] = glMatrix.round(a[0]);
          out[1] = glMatrix.round(a[1]);
          out[2] = glMatrix.round(a[2]);
          return out;
        }*/
        /**
         * Scales a vec3 by a scalar number
         * @category Static
         *
         * @param out - the receiving vector
         * @param a - the vector to scale
         * @param scale - amount to scale the vector by
         * @returns `out`
         */
        static scale(out, a, scale) {
            out[0] = a[0] * scale;
            out[1] = a[1] * scale;
            out[2] = a[2] * scale;
            return out;
        }
        /**
         * Adds two vec3's after scaling the second operand by a scalar value
         * @category Static
         *
         * @param out - the receiving vector
         * @param a - the first operand
         * @param b - the second operand
         * @param scale - the amount to scale b by before adding
         * @returns `out`
         */
        static scaleAndAdd(out, a, b, scale) {
            out[0] = a[0] + b[0] * scale;
            out[1] = a[1] + b[1] * scale;
            out[2] = a[2] + b[2] * scale;
            return out;
        }
        /**
         * Calculates the euclidian distance between two vec3's
         * @category Static
         *
         * @param a - the first operand
         * @param b - the second operand
         * @returns distance between a and b
         */
        static distance(a, b) {
            const x = b[0] - a[0];
            const y = b[1] - a[1];
            const z = b[2] - a[2];
            return Math.sqrt(x * x + y * y + z * z);
        }
        /**
         * Alias for {@link Vec3.distance}
         */
        static dist(a, b) { return 0; }
        /**
         * Calculates the squared euclidian distance between two vec3's
         * @category Static
         *
         * @param a - the first operand
         * @param b - the second operand
         * @returns squared distance between a and b
         */
        static squaredDistance(a, b) {
            const x = b[0] - a[0];
            const y = b[1] - a[1];
            const z = b[2] - a[2];
            return x * x + y * y + z * z;
        }
        /**
         * Alias for {@link Vec3.squaredDistance}
         */
        static sqrDist(a, b) { return 0; }
        /**
         * Calculates the squared length of a vec3
         * @category Static
         *
         * @param a - vector to calculate squared length of
         * @returns squared length of a
         */
        static squaredLength(a) {
            const x = a[0];
            const y = a[1];
            const z = a[2];
            return x * x + y * y + z * z;
        }
        /**
         * Alias for {@link Vec3.squaredLength}
         */
        static sqrLen(a, b) { return 0; }
        /**
         * Negates the components of a vec3
         * @category Static
         *
         * @param out - the receiving vector
         * @param a - vector to negate
         * @returns `out`
         */
        static negate(out, a) {
            out[0] = -a[0];
            out[1] = -a[1];
            out[2] = -a[2];
            return out;
        }
        /**
         * Returns the inverse of the components of a vec3
         * @category Static
         *
         * @param out - the receiving vector
         * @param a - vector to invert
         * @returns `out`
         */
        static inverse(out, a) {
            out[0] = 1.0 / a[0];
            out[1] = 1.0 / a[1];
            out[2] = 1.0 / a[2];
            return out;
        }
        /**
         * Returns the absolute value of the components of a {@link Vec3}
         * @category Static
         *
         * @param out - The receiving vector
         * @param a - Vector to compute the absolute values of
         * @returns `out`
         */
        static abs(out, a) {
            out[0] = Math.abs(a[0]);
            out[1] = Math.abs(a[1]);
            out[2] = Math.abs(a[2]);
            return out;
        }
        /**
         * Normalize a vec3
         * @category Static
         *
         * @param out - the receiving vector
         * @param a - vector to normalize
         * @returns `out`
         */
        static normalize(out, a) {
            const x = a[0];
            const y = a[1];
            const z = a[2];
            let len = x * x + y * y + z * z;
            if (len > 0) {
                //TODO: evaluate use of glm_invsqrt here?
                len = 1 / Math.sqrt(len);
            }
            out[0] = a[0] * len;
            out[1] = a[1] * len;
            out[2] = a[2] * len;
            return out;
        }
        /**
         * Calculates the dot product of two vec3's
         * @category Static
         *
         * @param a - the first operand
         * @param b - the second operand
         * @returns dot product of a and b
         */
        static dot(a, b) {
            return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
        }
        /**
         * Computes the cross product of two vec3's
         * @category Static
         *
         * @param out - the receiving vector
         * @param a - the first operand
         * @param b - the second operand
         * @returns `out`
         */
        static cross(out, a, b) {
            const ax = a[0], ay = a[1], az = a[2];
            const bx = b[0], by = b[1], bz = b[2];
            out[0] = ay * bz - az * by;
            out[1] = az * bx - ax * bz;
            out[2] = ax * by - ay * bx;
            return out;
        }
        /**
         * Performs a linear interpolation between two vec3's
         * @category Static
         *
         * @param out - the receiving vector
         * @param a - the first operand
         * @param b - the second operand
         * @param t - interpolation amount, in the range [0-1], between the two inputs
         * @returns `out`
         */
        static lerp(out, a, b, t) {
            const ax = a[0];
            const ay = a[1];
            const az = a[2];
            out[0] = ax + t * (b[0] - ax);
            out[1] = ay + t * (b[1] - ay);
            out[2] = az + t * (b[2] - az);
            return out;
        }
        /**
         * Performs a spherical linear interpolation between two vec3's
         * @category Static
         *
         * @param out - the receiving vector
         * @param a - the first operand
         * @param b - the second operand
         * @param t - interpolation amount, in the range [0-1], between the two inputs
         * @returns `out`
         */
        static slerp(out, a, b, t) {
            const angle = Math.acos(Math.min(Math.max(Vec3.dot(a, b), -1), 1));
            const sinTotal = Math.sin(angle);
            const ratioA = Math.sin((1 - t) * angle) / sinTotal;
            const ratioB = Math.sin(t * angle) / sinTotal;
            out[0] = ratioA * a[0] + ratioB * b[0];
            out[1] = ratioA * a[1] + ratioB * b[1];
            out[2] = ratioA * a[2] + ratioB * b[2];
            return out;
        }
        /**
         * Performs a hermite interpolation with two control points
         * @category Static
         *
         * @param out - the receiving vector
         * @param a - the first operand
         * @param b - the second operand
         * @param c - the third operand
         * @param d - the fourth operand
         * @param t - interpolation amount, in the range [0-1], between the two inputs
         * @returns `out`
         */
        static hermite(out, a, b, c, d, t) {
            const factorTimes2 = t * t;
            const factor1 = factorTimes2 * (2 * t - 3) + 1;
            const factor2 = factorTimes2 * (t - 2) + t;
            const factor3 = factorTimes2 * (t - 1);
            const factor4 = factorTimes2 * (3 - 2 * t);
            out[0] = a[0] * factor1 + b[0] * factor2 + c[0] * factor3 + d[0] * factor4;
            out[1] = a[1] * factor1 + b[1] * factor2 + c[1] * factor3 + d[1] * factor4;
            out[2] = a[2] * factor1 + b[2] * factor2 + c[2] * factor3 + d[2] * factor4;
            return out;
        }
        /**
         * Performs a bezier interpolation with two control points
         * @category Static
         *
         * @param out - the receiving vector
         * @param a - the first operand
         * @param b - the second operand
         * @param c - the third operand
         * @param d - the fourth operand
         * @param t - interpolation amount, in the range [0-1], between the two inputs
         * @returns `out`
         */
        static bezier(out, a, b, c, d, t) {
            const inverseFactor = 1 - t;
            const inverseFactorTimesTwo = inverseFactor * inverseFactor;
            const factorTimes2 = t * t;
            const factor1 = inverseFactorTimesTwo * inverseFactor;
            const factor2 = 3 * t * inverseFactorTimesTwo;
            const factor3 = 3 * factorTimes2 * inverseFactor;
            const factor4 = factorTimes2 * t;
            out[0] = a[0] * factor1 + b[0] * factor2 + c[0] * factor3 + d[0] * factor4;
            out[1] = a[1] * factor1 + b[1] * factor2 + c[1] * factor3 + d[1] * factor4;
            out[2] = a[2] * factor1 + b[2] * factor2 + c[2] * factor3 + d[2] * factor4;
            return out;
        }
        /**
         * Generates a random vector with the given scale
         * @category Static
         *
         * @param out - the receiving vector
         * @param {Number} [scale] Length of the resulting vector. If omitted, a unit vector will be returned
         * @returns `out`
         */
        /*static random(out: Vec3Like, scale) {
          scale = scale === undefined ? 1.0 : scale;
      
          let r = glMatrix.RANDOM() * 2.0 * Math.PI;
          let z = glMatrix.RANDOM() * 2.0 - 1.0;
          let zScale = Math.sqrt(1.0 - z * z) * scale;
      
          out[0] = Math.cos(r) * zScale;
          out[1] = Math.sin(r) * zScale;
          out[2] = z * scale;
          return out;
        }*/
        /**
         * Transforms the vec3 with a mat4.
         * 4th vector component is implicitly '1'
         * @category Static
         *
         * @param out - the receiving vector
         * @param a - the vector to transform
         * @param m - matrix to transform with
         * @returns `out`
         */
        static transformMat4(out, a, m) {
            const x = a[0], y = a[1], z = a[2];
            const w = (m[3] * x + m[7] * y + m[11] * z + m[15]) || 1.0;
            out[0] = (m[0] * x + m[4] * y + m[8] * z + m[12]) / w;
            out[1] = (m[1] * x + m[5] * y + m[9] * z + m[13]) / w;
            out[2] = (m[2] * x + m[6] * y + m[10] * z + m[14]) / w;
            return out;
        }
        /**
         * Transforms the vec3 with a mat3.
         * @category Static
         *
         * @param out - the receiving vector
         * @param a - the vector to transform
         * @param m - the 3x3 matrix to transform with
         * @returns `out`
         */
        static transformMat3(out, a, m) {
            let x = a[0], y = a[1], z = a[2];
            out[0] = x * m[0] + y * m[3] + z * m[6];
            out[1] = x * m[1] + y * m[4] + z * m[7];
            out[2] = x * m[2] + y * m[5] + z * m[8];
            return out;
        }
        /**
         * Transforms the vec3 with a quat
         * Can also be used for dual quaternions. (Multiply it with the real part)
         * @category Static
         *
         * @param out - the receiving vector
         * @param a - the vector to transform
         * @param q - quaternion to transform with
         * @returns `out`
         */
        static transformQuat(out, a, q) {
            // benchmarks: https://jsperf.com/quaternion-transform-vec3-implementations-fixed
            const qx = q[0];
            const qy = q[1];
            const qz = q[2];
            const w2 = q[3] * 2;
            const x = a[0];
            const y = a[1];
            const z = a[2];
            // var qvec = [qx, qy, qz];
            // var uv = vec3.cross([], qvec, a);
            const uvx = (qy * z - qz * y);
            const uvy = (qz * x - qx * z);
            const uvz = (qx * y - qy * x);
            // var uuv = vec3.cross([], qvec, uv);
            // vec3.scale(uuv, uuv, 2);
            const uuvx = (qy * uvz - qz * uvy) * 2;
            const uuvy = (qz * uvx - qx * uvz) * 2;
            const uuvz = (qx * uvy - qy * uvx) * 2;
            // vec3.scale(uv, uv, 2 * w);
            // return vec3.add(out, a, vec3.add(out, uv, uuv));
            out[0] = x + (uvx * w2) + uuvx;
            out[1] = y + (uvy * w2) + uuvy;
            out[2] = z + (uvz * w2) + uuvz;
            return out;
        }
        /**
         * Rotate a 3D vector around the x-axis
         * @param out - The receiving vec3
         * @param a - The vec3 point to rotate
         * @param b - The origin of the rotation
         * @param rad - The angle of rotation in radians
         * @returns `out`
         */
        static rotateX(out, a, b, rad) {
            const by = b[1];
            const bz = b[2];
            //Translate point to the origin
            const py = a[1] - by;
            const pz = a[2] - bz;
            //perform rotation
            //translate to correct position
            out[0] = a[0];
            out[1] = (py * Math.cos(rad) - pz * Math.sin(rad)) + by;
            out[2] = (py * Math.sin(rad) + pz * Math.cos(rad)) + bz;
            return out;
        }
        /**
         * Rotate a 3D vector around the y-axis
         * @param out - The receiving vec3
         * @param a - The vec3 point to rotate
         * @param b - The origin of the rotation
         * @param rad - The angle of rotation in radians
         * @returns `out`
         */
        static rotateY(out, a, b, rad) {
            const bx = b[0];
            const bz = b[2];
            //Translate point to the origin
            const px = a[0] - bx;
            const pz = a[2] - bz;
            //perform rotation
            //translate to correct position
            out[0] = (pz * Math.sin(rad) + px * Math.cos(rad)) + bx;
            out[1] = a[1];
            out[2] = (pz * Math.cos(rad) - px * Math.sin(rad)) + bz;
            return out;
        }
        /**
         * Rotate a 3D vector around the z-axis
         * @param out - The receiving vec3
         * @param a - The vec3 point to rotate
         * @param b - The origin of the rotation
         * @param rad - The angle of rotation in radians
         * @returns `out`
         */
        static rotateZ(out, a, b, rad) {
            const bx = b[0];
            const by = b[1];
            //Translate point to the origin
            const px = a[0] - bx;
            const py = a[1] - by;
            //perform rotation
            //translate to correct position
            out[0] = (px * Math.cos(rad) - py * Math.sin(rad)) + bx;
            out[1] = (px * Math.sin(rad) + py * Math.cos(rad)) + by;
            out[2] = b[2];
            return out;
        }
        /**
         * Get the angle between two 3D vectors
         * @param a - The first operand
         * @param b - The second operand
         * @returns The angle in radians
         */
        static angle(a, b) {
            const ax = a[0];
            const ay = a[1];
            const az = a[2];
            const bx = b[0];
            const by = b[1];
            const bz = b[2];
            const mag = Math.sqrt((ax * ax + ay * ay + az * az) * (bx * bx + by * by + bz * bz));
            const cosine = mag && Vec3.dot(a, b) / mag;
            return Math.acos(Math.min(Math.max(cosine, -1), 1));
        }
        /**
         * Set the components of a vec3 to zero
         * @category Static
         *
         * @param out - the receiving vector
         * @returns `out`
         */
        static zero(out) {
            out[0] = 0.0;
            out[1] = 0.0;
            out[2] = 0.0;
            return out;
        }
        /**
         * Returns a string representation of a vector
         * @category Static
         *
         * @param a - vector to represent as a string
         * @returns string representation of the vector
         */
        static str(a) {
            return `Vec3(${a.join(', ')})`;
        }
        /**
         * Returns whether or not the vectors have exactly the same elements in the same position (when compared with ===)
         * @category Static
         *
         * @param a - The first vector.
         * @param b - The second vector.
         * @returns True if the vectors are equal, false otherwise.
         */
        static exactEquals(a, b) {
            return a[0] === b[0] && a[1] === b[1] && a[2] === b[2];
        }
        /**
         * Returns whether or not the vectors have approximately the same elements in the same position.
         * @category Static
         *
         * @param a - The first vector.
         * @param b - The second vector.
         * @returns True if the vectors are equal, false otherwise.
         */
        static equals(a, b) {
            const a0 = a[0];
            const a1 = a[1];
            const a2 = a[2];
            const b0 = b[0];
            const b1 = b[1];
            const b2 = b[2];
            return (Math.abs(a0 - b0) <= EPSILON * Math.max(1.0, Math.abs(a0), Math.abs(b0)) &&
                Math.abs(a1 - b1) <= EPSILON * Math.max(1.0, Math.abs(a1), Math.abs(b1)) &&
                Math.abs(a2 - b2) <= EPSILON * Math.max(1.0, Math.abs(a2), Math.abs(b2)));
        }
    }
    // Instance method alias assignments
    Vec3.prototype.sub = Vec3.prototype.subtract;
    Vec3.prototype.mul = Vec3.prototype.multiply;
    Vec3.prototype.div = Vec3.prototype.divide;
    Vec3.prototype.dist = Vec3.prototype.distance;
    Vec3.prototype.sqrDist = Vec3.prototype.squaredDistance;
    // Static method alias assignments
    Vec3.sub = Vec3.subtract;
    Vec3.mul = Vec3.multiply;
    Vec3.div = Vec3.divide;
    Vec3.dist = Vec3.distance;
    Vec3.sqrDist = Vec3.squaredDistance;
    Vec3.sqrLen = Vec3.squaredLength;
    Vec3.mag = Vec3.magnitude;
    Vec3.length = Vec3.magnitude;
    Vec3.len = Vec3.magnitude;

    function getDefaultExportFromCjs (x) {
    	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
    }

    var normalize_1$1;
    var hasRequiredNormalize$2;

    function requireNormalize$2 () {
    	if (hasRequiredNormalize$2) return normalize_1$1;
    	hasRequiredNormalize$2 = 1;
    	normalize_1$1 = normalize;

    	/**
    	 * Normalize a vec3
    	 *
    	 * @param {vec3} out the receiving vector
    	 * @param {vec3} a vector to normalize
    	 * @returns {vec3} out
    	 */
    	function normalize(out, a) {
    	    var x = a[0],
    	        y = a[1],
    	        z = a[2];
    	    var len = x*x + y*y + z*z;
    	    if (len > 0) {
    	        //TODO: evaluate use of glm_invsqrt here?
    	        len = 1 / Math.sqrt(len);
    	        out[0] = a[0] * len;
    	        out[1] = a[1] * len;
    	        out[2] = a[2] * len;
    	    }
    	    return out
    	}
    	return normalize_1$1;
    }

    var subtract_1;
    var hasRequiredSubtract;

    function requireSubtract () {
    	if (hasRequiredSubtract) return subtract_1;
    	hasRequiredSubtract = 1;
    	subtract_1 = subtract;

    	/**
    	 * Subtracts vector b from vector a
    	 *
    	 * @param {vec3} out the receiving vector
    	 * @param {vec3} a the first operand
    	 * @param {vec3} b the second operand
    	 * @returns {vec3} out
    	 */
    	function subtract(out, a, b) {
    	    out[0] = a[0] - b[0];
    	    out[1] = a[1] - b[1];
    	    out[2] = a[2] - b[2];
    	    return out
    	}
    	return subtract_1;
    }

    var cross_1;
    var hasRequiredCross;

    function requireCross () {
    	if (hasRequiredCross) return cross_1;
    	hasRequiredCross = 1;
    	cross_1 = cross;

    	/**
    	 * Computes the cross product of two vec3's
    	 *
    	 * @param {vec3} out the receiving vector
    	 * @param {vec3} a the first operand
    	 * @param {vec3} b the second operand
    	 * @returns {vec3} out
    	 */
    	function cross(out, a, b) {
    	    var ax = a[0], ay = a[1], az = a[2],
    	        bx = b[0], by = b[1], bz = b[2];

    	    out[0] = ay * bz - az * by;
    	    out[1] = az * bx - ax * bz;
    	    out[2] = ax * by - ay * bx;
    	    return out
    	}
    	return cross_1;
    }

    var getPlaneNormal$1;
    var hasRequiredGetPlaneNormal;

    function requireGetPlaneNormal () {
    	if (hasRequiredGetPlaneNormal) return getPlaneNormal$1;
    	hasRequiredGetPlaneNormal = 1;
    	var normalize = /*@__PURE__*/ requireNormalize$2();
    	var sub = /*@__PURE__*/ requireSubtract();
    	var cross = /*@__PURE__*/ requireCross();
    	var tmp = [0, 0, 0];

    	getPlaneNormal$1 = planeNormal;

    	function planeNormal (out, point1, point2, point3) {
    	  sub(out, point1, point2);
    	  sub(tmp, point2, point3);
    	  cross(out, out, tmp);
    	  return normalize(out, out)
    	}
    	return getPlaneNormal$1;
    }

    var getPlaneNormalExports = /*@__PURE__*/ requireGetPlaneNormal();
    var getPlaneNormal = /*@__PURE__*/getDefaultExportFromCjs(getPlaneNormalExports);

    var squaredLength_1;
    var hasRequiredSquaredLength;

    function requireSquaredLength () {
    	if (hasRequiredSquaredLength) return squaredLength_1;
    	hasRequiredSquaredLength = 1;
    	squaredLength_1 = squaredLength;

    	/**
    	 * Calculates the squared length of a vec3
    	 *
    	 * @param {vec3} a vector to calculate squared length of
    	 * @returns {Number} squared length of a
    	 */
    	function squaredLength(a) {
    	    var x = a[0],
    	        y = a[1],
    	        z = a[2];
    	    return x*x + y*y + z*z
    	}
    	return squaredLength_1;
    }

    var squared;
    var hasRequiredSquared;

    function requireSquared () {
    	if (hasRequiredSquared) return squared;
    	hasRequiredSquared = 1;
    	var subtract = /*@__PURE__*/ requireSubtract();
    	var cross = /*@__PURE__*/ requireCross();
    	var squaredLength = /*@__PURE__*/ requireSquaredLength();
    	var ab = [];
    	var ap = [];
    	var cr = [];

    	squared = function (p, a, b) {
    	  // // == vector solution
    	  // var normalize = require('gl-vec3/normalize')
    	  // var scaleAndAdd = require('gl-vec3/scaleAndAdd')
    	  // var dot = require('gl-vec3/dot')
    	  // var squaredDistance = require('gl-vec3/squaredDistance')
    	  // // n = vector `ab` normalized
    	  // var n = []
    	  // // projection = projection of `point` on `n`
    	  // var projection = []
    	  // normalize(n, subtract(n, a, b))
    	  // scaleAndAdd(projection, a, n, dot(n, p))
    	  // return squaredDistance(projection, p)

    	  // == parallelogram solution
    	  //
    	  //            s
    	  //      __a________b__
    	  //       /   |    /
    	  //      /   h|   /
    	  //     /_____|__/
    	  //    p
    	  //
    	  //  s = b - a
    	  //  area = s * h
    	  //  |ap x s| = s * h
    	  //  h = |ap x s| / s
    	  //
    	  subtract(ab, b, a);
    	  subtract(ap, p, a);
    	  var area = squaredLength(cross(cr, ap, ab));
    	  var s = squaredLength(ab);
    	  if (s === 0) {
    	    throw Error('a and b are the same point')
    	  }
    	  return area / s
    	};
    	return squared;
    }

    /*
     * point-line-distance
     *
     * Copyright (c) 2015 Mauricio Poppe
     * Licensed under the MIT license.
     */

    var pointLineDistance$1;
    var hasRequiredPointLineDistance;

    function requirePointLineDistance () {
    	if (hasRequiredPointLineDistance) return pointLineDistance$1;
    	hasRequiredPointLineDistance = 1;

    	var distanceSquared = /*@__PURE__*/ requireSquared();

    	pointLineDistance$1 = function (point, a, b) {
    	  return Math.sqrt(distanceSquared(point, a, b))
    	};
    	return pointLineDistance$1;
    }

    var pointLineDistanceExports = /*@__PURE__*/ requirePointLineDistance();
    var pointLineDistance = /*@__PURE__*/getDefaultExportFromCjs(pointLineDistanceExports);

    var orientation = {exports: {}};

    var twoProduct_1;
    var hasRequiredTwoProduct;

    function requireTwoProduct () {
    	if (hasRequiredTwoProduct) return twoProduct_1;
    	hasRequiredTwoProduct = 1;

    	twoProduct_1 = twoProduct;

    	var SPLITTER = +(Math.pow(2, 27) + 1.0);

    	function twoProduct(a, b, result) {
    	  var x = a * b;

    	  var c = SPLITTER * a;
    	  var abig = c - a;
    	  var ahi = c - abig;
    	  var alo = a - ahi;

    	  var d = SPLITTER * b;
    	  var bbig = d - b;
    	  var bhi = d - bbig;
    	  var blo = b - bhi;

    	  var err1 = x - (ahi * bhi);
    	  var err2 = err1 - (alo * bhi);
    	  var err3 = err2 - (ahi * blo);

    	  var y = alo * blo - err3;

    	  if(result) {
    	    result[0] = y;
    	    result[1] = x;
    	    return result
    	  }

    	  return [ y, x ]
    	}
    	return twoProduct_1;
    }

    var robustSum;
    var hasRequiredRobustSum;

    function requireRobustSum () {
    	if (hasRequiredRobustSum) return robustSum;
    	hasRequiredRobustSum = 1;

    	robustSum = linearExpansionSum;

    	//Easy case: Add two scalars
    	function scalarScalar(a, b) {
    	  var x = a + b;
    	  var bv = x - a;
    	  var av = x - bv;
    	  var br = b - bv;
    	  var ar = a - av;
    	  var y = ar + br;
    	  if(y) {
    	    return [y, x]
    	  }
    	  return [x]
    	}

    	function linearExpansionSum(e, f) {
    	  var ne = e.length|0;
    	  var nf = f.length|0;
    	  if(ne === 1 && nf === 1) {
    	    return scalarScalar(e[0], f[0])
    	  }
    	  var n = ne + nf;
    	  var g = new Array(n);
    	  var count = 0;
    	  var eptr = 0;
    	  var fptr = 0;
    	  var abs = Math.abs;
    	  var ei = e[eptr];
    	  var ea = abs(ei);
    	  var fi = f[fptr];
    	  var fa = abs(fi);
    	  var a, b;
    	  if(ea < fa) {
    	    b = ei;
    	    eptr += 1;
    	    if(eptr < ne) {
    	      ei = e[eptr];
    	      ea = abs(ei);
    	    }
    	  } else {
    	    b = fi;
    	    fptr += 1;
    	    if(fptr < nf) {
    	      fi = f[fptr];
    	      fa = abs(fi);
    	    }
    	  }
    	  if((eptr < ne && ea < fa) || (fptr >= nf)) {
    	    a = ei;
    	    eptr += 1;
    	    if(eptr < ne) {
    	      ei = e[eptr];
    	      ea = abs(ei);
    	    }
    	  } else {
    	    a = fi;
    	    fptr += 1;
    	    if(fptr < nf) {
    	      fi = f[fptr];
    	      fa = abs(fi);
    	    }
    	  }
    	  var x = a + b;
    	  var bv = x - a;
    	  var y = b - bv;
    	  var q0 = y;
    	  var q1 = x;
    	  var _x, _bv, _av, _br, _ar;
    	  while(eptr < ne && fptr < nf) {
    	    if(ea < fa) {
    	      a = ei;
    	      eptr += 1;
    	      if(eptr < ne) {
    	        ei = e[eptr];
    	        ea = abs(ei);
    	      }
    	    } else {
    	      a = fi;
    	      fptr += 1;
    	      if(fptr < nf) {
    	        fi = f[fptr];
    	        fa = abs(fi);
    	      }
    	    }
    	    b = q0;
    	    x = a + b;
    	    bv = x - a;
    	    y = b - bv;
    	    if(y) {
    	      g[count++] = y;
    	    }
    	    _x = q1 + x;
    	    _bv = _x - q1;
    	    _av = _x - _bv;
    	    _br = x - _bv;
    	    _ar = q1 - _av;
    	    q0 = _ar + _br;
    	    q1 = _x;
    	  }
    	  while(eptr < ne) {
    	    a = ei;
    	    b = q0;
    	    x = a + b;
    	    bv = x - a;
    	    y = b - bv;
    	    if(y) {
    	      g[count++] = y;
    	    }
    	    _x = q1 + x;
    	    _bv = _x - q1;
    	    _av = _x - _bv;
    	    _br = x - _bv;
    	    _ar = q1 - _av;
    	    q0 = _ar + _br;
    	    q1 = _x;
    	    eptr += 1;
    	    if(eptr < ne) {
    	      ei = e[eptr];
    	    }
    	  }
    	  while(fptr < nf) {
    	    a = fi;
    	    b = q0;
    	    x = a + b;
    	    bv = x - a;
    	    y = b - bv;
    	    if(y) {
    	      g[count++] = y;
    	    } 
    	    _x = q1 + x;
    	    _bv = _x - q1;
    	    _av = _x - _bv;
    	    _br = x - _bv;
    	    _ar = q1 - _av;
    	    q0 = _ar + _br;
    	    q1 = _x;
    	    fptr += 1;
    	    if(fptr < nf) {
    	      fi = f[fptr];
    	    }
    	  }
    	  if(q0) {
    	    g[count++] = q0;
    	  }
    	  if(q1) {
    	    g[count++] = q1;
    	  }
    	  if(!count) {
    	    g[count++] = 0.0;  
    	  }
    	  g.length = count;
    	  return g
    	}
    	return robustSum;
    }

    var twoSum;
    var hasRequiredTwoSum;

    function requireTwoSum () {
    	if (hasRequiredTwoSum) return twoSum;
    	hasRequiredTwoSum = 1;

    	twoSum = fastTwoSum;

    	function fastTwoSum(a, b, result) {
    		var x = a + b;
    		var bv = x - a;
    		var av = x - bv;
    		var br = b - bv;
    		var ar = a - av;
    		if(result) {
    			result[0] = ar + br;
    			result[1] = x;
    			return result
    		}
    		return [ar+br, x]
    	}
    	return twoSum;
    }

    var robustScale;
    var hasRequiredRobustScale;

    function requireRobustScale () {
    	if (hasRequiredRobustScale) return robustScale;
    	hasRequiredRobustScale = 1;

    	var twoProduct = /*@__PURE__*/ requireTwoProduct();
    	var twoSum = /*@__PURE__*/ requireTwoSum();

    	robustScale = scaleLinearExpansion;

    	function scaleLinearExpansion(e, scale) {
    	  var n = e.length;
    	  if(n === 1) {
    	    var ts = twoProduct(e[0], scale);
    	    if(ts[0]) {
    	      return ts
    	    }
    	    return [ ts[1] ]
    	  }
    	  var g = new Array(2 * n);
    	  var q = [0.1, 0.1];
    	  var t = [0.1, 0.1];
    	  var count = 0;
    	  twoProduct(e[0], scale, q);
    	  if(q[0]) {
    	    g[count++] = q[0];
    	  }
    	  for(var i=1; i<n; ++i) {
    	    twoProduct(e[i], scale, t);
    	    var pq = q[1];
    	    twoSum(pq, t[0], q);
    	    if(q[0]) {
    	      g[count++] = q[0];
    	    }
    	    var a = t[1];
    	    var b = q[1];
    	    var x = a + b;
    	    var bv = x - a;
    	    var y = b - bv;
    	    q[1] = x;
    	    if(y) {
    	      g[count++] = y;
    	    }
    	  }
    	  if(q[1]) {
    	    g[count++] = q[1];
    	  }
    	  if(count === 0) {
    	    g[count++] = 0.0;
    	  }
    	  g.length = count;
    	  return g
    	}
    	return robustScale;
    }

    var robustDiff;
    var hasRequiredRobustDiff;

    function requireRobustDiff () {
    	if (hasRequiredRobustDiff) return robustDiff;
    	hasRequiredRobustDiff = 1;

    	robustDiff = robustSubtract;

    	//Easy case: Add two scalars
    	function scalarScalar(a, b) {
    	  var x = a + b;
    	  var bv = x - a;
    	  var av = x - bv;
    	  var br = b - bv;
    	  var ar = a - av;
    	  var y = ar + br;
    	  if(y) {
    	    return [y, x]
    	  }
    	  return [x]
    	}

    	function robustSubtract(e, f) {
    	  var ne = e.length|0;
    	  var nf = f.length|0;
    	  if(ne === 1 && nf === 1) {
    	    return scalarScalar(e[0], -f[0])
    	  }
    	  var n = ne + nf;
    	  var g = new Array(n);
    	  var count = 0;
    	  var eptr = 0;
    	  var fptr = 0;
    	  var abs = Math.abs;
    	  var ei = e[eptr];
    	  var ea = abs(ei);
    	  var fi = -f[fptr];
    	  var fa = abs(fi);
    	  var a, b;
    	  if(ea < fa) {
    	    b = ei;
    	    eptr += 1;
    	    if(eptr < ne) {
    	      ei = e[eptr];
    	      ea = abs(ei);
    	    }
    	  } else {
    	    b = fi;
    	    fptr += 1;
    	    if(fptr < nf) {
    	      fi = -f[fptr];
    	      fa = abs(fi);
    	    }
    	  }
    	  if((eptr < ne && ea < fa) || (fptr >= nf)) {
    	    a = ei;
    	    eptr += 1;
    	    if(eptr < ne) {
    	      ei = e[eptr];
    	      ea = abs(ei);
    	    }
    	  } else {
    	    a = fi;
    	    fptr += 1;
    	    if(fptr < nf) {
    	      fi = -f[fptr];
    	      fa = abs(fi);
    	    }
    	  }
    	  var x = a + b;
    	  var bv = x - a;
    	  var y = b - bv;
    	  var q0 = y;
    	  var q1 = x;
    	  var _x, _bv, _av, _br, _ar;
    	  while(eptr < ne && fptr < nf) {
    	    if(ea < fa) {
    	      a = ei;
    	      eptr += 1;
    	      if(eptr < ne) {
    	        ei = e[eptr];
    	        ea = abs(ei);
    	      }
    	    } else {
    	      a = fi;
    	      fptr += 1;
    	      if(fptr < nf) {
    	        fi = -f[fptr];
    	        fa = abs(fi);
    	      }
    	    }
    	    b = q0;
    	    x = a + b;
    	    bv = x - a;
    	    y = b - bv;
    	    if(y) {
    	      g[count++] = y;
    	    }
    	    _x = q1 + x;
    	    _bv = _x - q1;
    	    _av = _x - _bv;
    	    _br = x - _bv;
    	    _ar = q1 - _av;
    	    q0 = _ar + _br;
    	    q1 = _x;
    	  }
    	  while(eptr < ne) {
    	    a = ei;
    	    b = q0;
    	    x = a + b;
    	    bv = x - a;
    	    y = b - bv;
    	    if(y) {
    	      g[count++] = y;
    	    }
    	    _x = q1 + x;
    	    _bv = _x - q1;
    	    _av = _x - _bv;
    	    _br = x - _bv;
    	    _ar = q1 - _av;
    	    q0 = _ar + _br;
    	    q1 = _x;
    	    eptr += 1;
    	    if(eptr < ne) {
    	      ei = e[eptr];
    	    }
    	  }
    	  while(fptr < nf) {
    	    a = fi;
    	    b = q0;
    	    x = a + b;
    	    bv = x - a;
    	    y = b - bv;
    	    if(y) {
    	      g[count++] = y;
    	    } 
    	    _x = q1 + x;
    	    _bv = _x - q1;
    	    _av = _x - _bv;
    	    _br = x - _bv;
    	    _ar = q1 - _av;
    	    q0 = _ar + _br;
    	    q1 = _x;
    	    fptr += 1;
    	    if(fptr < nf) {
    	      fi = -f[fptr];
    	    }
    	  }
    	  if(q0) {
    	    g[count++] = q0;
    	  }
    	  if(q1) {
    	    g[count++] = q1;
    	  }
    	  if(!count) {
    	    g[count++] = 0.0;  
    	  }
    	  g.length = count;
    	  return g
    	}
    	return robustDiff;
    }

    var hasRequiredOrientation;

    function requireOrientation () {
    	if (hasRequiredOrientation) return orientation.exports;
    	hasRequiredOrientation = 1;
    	(function (module) {

    		var twoProduct = /*@__PURE__*/ requireTwoProduct();
    		var robustSum = /*@__PURE__*/ requireRobustSum();
    		var robustScale = /*@__PURE__*/ requireRobustScale();
    		var robustSubtract = /*@__PURE__*/ requireRobustDiff();

    		var NUM_EXPAND = 5;

    		var EPSILON     = 1.1102230246251565e-16;
    		var ERRBOUND3   = (3.0 + 16.0 * EPSILON) * EPSILON;
    		var ERRBOUND4   = (7.0 + 56.0 * EPSILON) * EPSILON;

    		function orientation_3(sum, prod, scale, sub) {
    		  return function orientation3Exact(m0, m1, m2) {
    		    var p = sum(sum(prod(m1[1], m2[0]), prod(-m2[1], m1[0])), sum(prod(m0[1], m1[0]), prod(-m1[1], m0[0])));
    		    var n = sum(prod(m0[1], m2[0]), prod(-m2[1], m0[0]));
    		    var d = sub(p, n);
    		    return d[d.length - 1]
    		  }
    		}

    		function orientation_4(sum, prod, scale, sub) {
    		  return function orientation4Exact(m0, m1, m2, m3) {
    		    var p = sum(sum(scale(sum(prod(m2[1], m3[0]), prod(-m3[1], m2[0])), m1[2]), sum(scale(sum(prod(m1[1], m3[0]), prod(-m3[1], m1[0])), -m2[2]), scale(sum(prod(m1[1], m2[0]), prod(-m2[1], m1[0])), m3[2]))), sum(scale(sum(prod(m1[1], m3[0]), prod(-m3[1], m1[0])), m0[2]), sum(scale(sum(prod(m0[1], m3[0]), prod(-m3[1], m0[0])), -m1[2]), scale(sum(prod(m0[1], m1[0]), prod(-m1[1], m0[0])), m3[2]))));
    		    var n = sum(sum(scale(sum(prod(m2[1], m3[0]), prod(-m3[1], m2[0])), m0[2]), sum(scale(sum(prod(m0[1], m3[0]), prod(-m3[1], m0[0])), -m2[2]), scale(sum(prod(m0[1], m2[0]), prod(-m2[1], m0[0])), m3[2]))), sum(scale(sum(prod(m1[1], m2[0]), prod(-m2[1], m1[0])), m0[2]), sum(scale(sum(prod(m0[1], m2[0]), prod(-m2[1], m0[0])), -m1[2]), scale(sum(prod(m0[1], m1[0]), prod(-m1[1], m0[0])), m2[2]))));
    		    var d = sub(p, n);
    		    return d[d.length - 1]
    		  }
    		}

    		function orientation_5(sum, prod, scale, sub) {
    		  return function orientation5Exact(m0, m1, m2, m3, m4) {
    		    var p = sum(sum(sum(scale(sum(scale(sum(prod(m3[1], m4[0]), prod(-m4[1], m3[0])), m2[2]), sum(scale(sum(prod(m2[1], m4[0]), prod(-m4[1], m2[0])), -m3[2]), scale(sum(prod(m2[1], m3[0]), prod(-m3[1], m2[0])), m4[2]))), m1[3]), sum(scale(sum(scale(sum(prod(m3[1], m4[0]), prod(-m4[1], m3[0])), m1[2]), sum(scale(sum(prod(m1[1], m4[0]), prod(-m4[1], m1[0])), -m3[2]), scale(sum(prod(m1[1], m3[0]), prod(-m3[1], m1[0])), m4[2]))), -m2[3]), scale(sum(scale(sum(prod(m2[1], m4[0]), prod(-m4[1], m2[0])), m1[2]), sum(scale(sum(prod(m1[1], m4[0]), prod(-m4[1], m1[0])), -m2[2]), scale(sum(prod(m1[1], m2[0]), prod(-m2[1], m1[0])), m4[2]))), m3[3]))), sum(scale(sum(scale(sum(prod(m2[1], m3[0]), prod(-m3[1], m2[0])), m1[2]), sum(scale(sum(prod(m1[1], m3[0]), prod(-m3[1], m1[0])), -m2[2]), scale(sum(prod(m1[1], m2[0]), prod(-m2[1], m1[0])), m3[2]))), -m4[3]), sum(scale(sum(scale(sum(prod(m3[1], m4[0]), prod(-m4[1], m3[0])), m1[2]), sum(scale(sum(prod(m1[1], m4[0]), prod(-m4[1], m1[0])), -m3[2]), scale(sum(prod(m1[1], m3[0]), prod(-m3[1], m1[0])), m4[2]))), m0[3]), scale(sum(scale(sum(prod(m3[1], m4[0]), prod(-m4[1], m3[0])), m0[2]), sum(scale(sum(prod(m0[1], m4[0]), prod(-m4[1], m0[0])), -m3[2]), scale(sum(prod(m0[1], m3[0]), prod(-m3[1], m0[0])), m4[2]))), -m1[3])))), sum(sum(scale(sum(scale(sum(prod(m1[1], m4[0]), prod(-m4[1], m1[0])), m0[2]), sum(scale(sum(prod(m0[1], m4[0]), prod(-m4[1], m0[0])), -m1[2]), scale(sum(prod(m0[1], m1[0]), prod(-m1[1], m0[0])), m4[2]))), m3[3]), sum(scale(sum(scale(sum(prod(m1[1], m3[0]), prod(-m3[1], m1[0])), m0[2]), sum(scale(sum(prod(m0[1], m3[0]), prod(-m3[1], m0[0])), -m1[2]), scale(sum(prod(m0[1], m1[0]), prod(-m1[1], m0[0])), m3[2]))), -m4[3]), scale(sum(scale(sum(prod(m2[1], m3[0]), prod(-m3[1], m2[0])), m1[2]), sum(scale(sum(prod(m1[1], m3[0]), prod(-m3[1], m1[0])), -m2[2]), scale(sum(prod(m1[1], m2[0]), prod(-m2[1], m1[0])), m3[2]))), m0[3]))), sum(scale(sum(scale(sum(prod(m2[1], m3[0]), prod(-m3[1], m2[0])), m0[2]), sum(scale(sum(prod(m0[1], m3[0]), prod(-m3[1], m0[0])), -m2[2]), scale(sum(prod(m0[1], m2[0]), prod(-m2[1], m0[0])), m3[2]))), -m1[3]), sum(scale(sum(scale(sum(prod(m1[1], m3[0]), prod(-m3[1], m1[0])), m0[2]), sum(scale(sum(prod(m0[1], m3[0]), prod(-m3[1], m0[0])), -m1[2]), scale(sum(prod(m0[1], m1[0]), prod(-m1[1], m0[0])), m3[2]))), m2[3]), scale(sum(scale(sum(prod(m1[1], m2[0]), prod(-m2[1], m1[0])), m0[2]), sum(scale(sum(prod(m0[1], m2[0]), prod(-m2[1], m0[0])), -m1[2]), scale(sum(prod(m0[1], m1[0]), prod(-m1[1], m0[0])), m2[2]))), -m3[3])))));
    		    var n = sum(sum(sum(scale(sum(scale(sum(prod(m3[1], m4[0]), prod(-m4[1], m3[0])), m2[2]), sum(scale(sum(prod(m2[1], m4[0]), prod(-m4[1], m2[0])), -m3[2]), scale(sum(prod(m2[1], m3[0]), prod(-m3[1], m2[0])), m4[2]))), m0[3]), scale(sum(scale(sum(prod(m3[1], m4[0]), prod(-m4[1], m3[0])), m0[2]), sum(scale(sum(prod(m0[1], m4[0]), prod(-m4[1], m0[0])), -m3[2]), scale(sum(prod(m0[1], m3[0]), prod(-m3[1], m0[0])), m4[2]))), -m2[3])), sum(scale(sum(scale(sum(prod(m2[1], m4[0]), prod(-m4[1], m2[0])), m0[2]), sum(scale(sum(prod(m0[1], m4[0]), prod(-m4[1], m0[0])), -m2[2]), scale(sum(prod(m0[1], m2[0]), prod(-m2[1], m0[0])), m4[2]))), m3[3]), scale(sum(scale(sum(prod(m2[1], m3[0]), prod(-m3[1], m2[0])), m0[2]), sum(scale(sum(prod(m0[1], m3[0]), prod(-m3[1], m0[0])), -m2[2]), scale(sum(prod(m0[1], m2[0]), prod(-m2[1], m0[0])), m3[2]))), -m4[3]))), sum(sum(scale(sum(scale(sum(prod(m2[1], m4[0]), prod(-m4[1], m2[0])), m1[2]), sum(scale(sum(prod(m1[1], m4[0]), prod(-m4[1], m1[0])), -m2[2]), scale(sum(prod(m1[1], m2[0]), prod(-m2[1], m1[0])), m4[2]))), m0[3]), scale(sum(scale(sum(prod(m2[1], m4[0]), prod(-m4[1], m2[0])), m0[2]), sum(scale(sum(prod(m0[1], m4[0]), prod(-m4[1], m0[0])), -m2[2]), scale(sum(prod(m0[1], m2[0]), prod(-m2[1], m0[0])), m4[2]))), -m1[3])), sum(scale(sum(scale(sum(prod(m1[1], m4[0]), prod(-m4[1], m1[0])), m0[2]), sum(scale(sum(prod(m0[1], m4[0]), prod(-m4[1], m0[0])), -m1[2]), scale(sum(prod(m0[1], m1[0]), prod(-m1[1], m0[0])), m4[2]))), m2[3]), scale(sum(scale(sum(prod(m1[1], m2[0]), prod(-m2[1], m1[0])), m0[2]), sum(scale(sum(prod(m0[1], m2[0]), prod(-m2[1], m0[0])), -m1[2]), scale(sum(prod(m0[1], m1[0]), prod(-m1[1], m0[0])), m2[2]))), -m4[3]))));
    		    var d = sub(p, n);
    		    return d[d.length - 1]
    		  }
    		}

    		function orientation(n) {
    		  var fn =
    		    n === 3 ? orientation_3 :
    		    n === 4 ? orientation_4 : orientation_5;

    		  return fn(robustSum, twoProduct, robustScale, robustSubtract)
    		}

    		var orientation3Exact = orientation(3);
    		var orientation4Exact = orientation(4);

    		var CACHED = [
    		  function orientation0() { return 0 },
    		  function orientation1() { return 0 },
    		  function orientation2(a, b) {
    		    return b[0] - a[0]
    		  },
    		  function orientation3(a, b, c) {
    		    var l = (a[1] - c[1]) * (b[0] - c[0]);
    		    var r = (a[0] - c[0]) * (b[1] - c[1]);
    		    var det = l - r;
    		    var s;
    		    if(l > 0) {
    		      if(r <= 0) {
    		        return det
    		      } else {
    		        s = l + r;
    		      }
    		    } else if(l < 0) {
    		      if(r >= 0) {
    		        return det
    		      } else {
    		        s = -(l + r);
    		      }
    		    } else {
    		      return det
    		    }
    		    var tol = ERRBOUND3 * s;
    		    if(det >= tol || det <= -tol) {
    		      return det
    		    }
    		    return orientation3Exact(a, b, c)
    		  },
    		  function orientation4(a,b,c,d) {
    		    var adx = a[0] - d[0];
    		    var bdx = b[0] - d[0];
    		    var cdx = c[0] - d[0];
    		    var ady = a[1] - d[1];
    		    var bdy = b[1] - d[1];
    		    var cdy = c[1] - d[1];
    		    var adz = a[2] - d[2];
    		    var bdz = b[2] - d[2];
    		    var cdz = c[2] - d[2];
    		    var bdxcdy = bdx * cdy;
    		    var cdxbdy = cdx * bdy;
    		    var cdxady = cdx * ady;
    		    var adxcdy = adx * cdy;
    		    var adxbdy = adx * bdy;
    		    var bdxady = bdx * ady;
    		    var det = adz * (bdxcdy - cdxbdy)
    		            + bdz * (cdxady - adxcdy)
    		            + cdz * (adxbdy - bdxady);
    		    var permanent = (Math.abs(bdxcdy) + Math.abs(cdxbdy)) * Math.abs(adz)
    		                  + (Math.abs(cdxady) + Math.abs(adxcdy)) * Math.abs(bdz)
    		                  + (Math.abs(adxbdy) + Math.abs(bdxady)) * Math.abs(cdz);
    		    var tol = ERRBOUND4 * permanent;
    		    if ((det > tol) || (-det > tol)) {
    		      return det
    		    }
    		    return orientation4Exact(a,b,c,d)
    		  }
    		];

    		function slowOrient(args) {
    		  var proc = CACHED[args.length];
    		  if(!proc) {
    		    proc = CACHED[args.length] = orientation(args.length);
    		  }
    		  return proc.apply(undefined, args)
    		}

    		function proc (slow, o0, o1, o2, o3, o4, o5) {
    		  return function getOrientation(a0, a1, a2, a3, a4) {
    		    switch (arguments.length) {
    		      case 0:
    		      case 1:
    		        return 0;
    		      case 2:
    		        return o2(a0, a1)
    		      case 3:
    		        return o3(a0, a1, a2)
    		      case 4:
    		        return o4(a0, a1, a2, a3)
    		      case 5:
    		        return o5(a0, a1, a2, a3, a4)
    		    }

    		    var s = new Array(arguments.length);
    		    for (var i = 0; i < arguments.length; ++i) {
    		      s[i] = arguments[i];
    		    }
    		    return slow(s)
    		  }
    		}

    		function generateOrientationProc() {
    		  while(CACHED.length <= NUM_EXPAND) {
    		    CACHED.push(orientation(CACHED.length));
    		  }
    		  module.exports = proc.apply(undefined, [slowOrient].concat(CACHED));
    		  for(var i=0; i<=NUM_EXPAND; ++i) {
    		    module.exports[i] = CACHED[i];
    		  }
    		}

    		generateOrientationProc(); 
    	} (orientation));
    	return orientation.exports;
    }

    var monotoneConvexHull2d;
    var hasRequiredMonotoneConvexHull2d;

    function requireMonotoneConvexHull2d () {
    	if (hasRequiredMonotoneConvexHull2d) return monotoneConvexHull2d;
    	hasRequiredMonotoneConvexHull2d = 1;

    	monotoneConvexHull2d = monotoneConvexHull2D;

    	var orient = /*@__PURE__*/ requireOrientation()[3];

    	function monotoneConvexHull2D(points) {
    	  var n = points.length;

    	  if(n < 3) {
    	    var result = new Array(n);
    	    for(var i=0; i<n; ++i) {
    	      result[i] = i;
    	    }

    	    if(n === 2 &&
    	       points[0][0] === points[1][0] &&
    	       points[0][1] === points[1][1]) {
    	      return [0]
    	    }

    	    return result
    	  }

    	  //Sort point indices along x-axis
    	  var sorted = new Array(n);
    	  for(var i=0; i<n; ++i) {
    	    sorted[i] = i;
    	  }
    	  sorted.sort(function(a,b) {
    	    var d = points[a][0]-points[b][0];
    	    if(d) {
    	      return d
    	    }
    	    return points[a][1] - points[b][1]
    	  });

    	  //Construct upper and lower hulls
    	  var lower = [sorted[0], sorted[1]];
    	  var upper = [sorted[0], sorted[1]];

    	  for(var i=2; i<n; ++i) {
    	    var idx = sorted[i];
    	    var p   = points[idx];

    	    //Insert into lower list
    	    var m = lower.length;
    	    while(m > 1 && orient(
    	        points[lower[m-2]], 
    	        points[lower[m-1]], 
    	        p) <= 0) {
    	      m -= 1;
    	      lower.pop();
    	    }
    	    lower.push(idx);

    	    //Insert into upper list
    	    m = upper.length;
    	    while(m > 1 && orient(
    	        points[upper[m-2]], 
    	        points[upper[m-1]], 
    	        p) >= 0) {
    	      m -= 1;
    	      upper.pop();
    	    }
    	    upper.push(idx);
    	  }

    	  //Merge lists together
    	  var result = new Array(upper.length + lower.length - 2);
    	  var ptr    = 0;
    	  for(var i=0, nl=lower.length; i<nl; ++i) {
    	    result[ptr++] = lower[i];
    	  }
    	  for(var j=upper.length-2; j>0; --j) {
    	    result[ptr++] = upper[j];
    	  }

    	  //Return result
    	  return result
    	}
    	return monotoneConvexHull2d;
    }

    var monotoneConvexHull2dExports = /*@__PURE__*/ requireMonotoneConvexHull2d();
    var monotoneHull = /*@__PURE__*/getDefaultExportFromCjs(monotoneConvexHull2dExports);

    var dot_1;
    var hasRequiredDot;

    function requireDot () {
    	if (hasRequiredDot) return dot_1;
    	hasRequiredDot = 1;
    	dot_1 = dot;

    	/**
    	 * Calculates the dot product of two vec3's
    	 *
    	 * @param {vec3} a the first operand
    	 * @param {vec3} b the second operand
    	 * @returns {Number} dot product of a and b
    	 */
    	function dot(a, b) {
    	    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
    	}
    	return dot_1;
    }

    var dotExports = /*@__PURE__*/ requireDot();
    var dot = /*@__PURE__*/getDefaultExportFromCjs(dotExports);

    var scale_1;
    var hasRequiredScale;

    function requireScale () {
    	if (hasRequiredScale) return scale_1;
    	hasRequiredScale = 1;
    	scale_1 = scale;

    	/**
    	 * Scales a vec3 by a scalar number
    	 *
    	 * @param {vec3} out the receiving vector
    	 * @param {vec3} a the vector to scale
    	 * @param {Number} b amount to scale the vector by
    	 * @returns {vec3} out
    	 */
    	function scale(out, a, b) {
    	    out[0] = a[0] * b;
    	    out[1] = a[1] * b;
    	    out[2] = a[2] * b;
    	    return out
    	}
    	return scale_1;
    }

    var scaleExports = /*@__PURE__*/ requireScale();
    var scale = /*@__PURE__*/getDefaultExportFromCjs(scaleExports);

    var fromValues_1;
    var hasRequiredFromValues;

    function requireFromValues () {
    	if (hasRequiredFromValues) return fromValues_1;
    	hasRequiredFromValues = 1;
    	fromValues_1 = fromValues;

    	/**
    	 * Creates a new vec4 initialized with the given values
    	 *
    	 * @param {Number} x X component
    	 * @param {Number} y Y component
    	 * @param {Number} z Z component
    	 * @param {Number} w W component
    	 * @returns {vec4} a new 4D vector
    	 */
    	function fromValues (x, y, z, w) {
    	  var out = new Float32Array(4);
    	  out[0] = x;
    	  out[1] = y;
    	  out[2] = z;
    	  out[3] = w;
    	  return out
    	}
    	return fromValues_1;
    }

    var fromValuesExports = /*@__PURE__*/ requireFromValues();
    var fromValues = /*@__PURE__*/getDefaultExportFromCjs(fromValuesExports);

    var transformMat4_1;
    var hasRequiredTransformMat4;

    function requireTransformMat4 () {
    	if (hasRequiredTransformMat4) return transformMat4_1;
    	hasRequiredTransformMat4 = 1;
    	transformMat4_1 = transformMat4;

    	/**
    	 * Transforms the vec4 with a mat4.
    	 *
    	 * @param {vec4} out the receiving vector
    	 * @param {vec4} a the vector to transform
    	 * @param {mat4} m matrix to transform with
    	 * @returns {vec4} out
    	 */
    	function transformMat4 (out, a, m) {
    	  var x = a[0], y = a[1], z = a[2], w = a[3];
    	  out[0] = m[0] * x + m[4] * y + m[8] * z + m[12] * w;
    	  out[1] = m[1] * x + m[5] * y + m[9] * z + m[13] * w;
    	  out[2] = m[2] * x + m[6] * y + m[10] * z + m[14] * w;
    	  out[3] = m[3] * x + m[7] * y + m[11] * z + m[15] * w;
    	  return out
    	}
    	return transformMat4_1;
    }

    var transformMat4Exports = /*@__PURE__*/ requireTransformMat4();
    var transformMat4 = /*@__PURE__*/getDefaultExportFromCjs(transformMat4Exports);

    var fromRotationTranslation_1;
    var hasRequiredFromRotationTranslation;

    function requireFromRotationTranslation () {
    	if (hasRequiredFromRotationTranslation) return fromRotationTranslation_1;
    	hasRequiredFromRotationTranslation = 1;
    	fromRotationTranslation_1 = fromRotationTranslation;

    	/**
    	 * Creates a matrix from a quaternion rotation and vector translation
    	 * This is equivalent to (but much faster than):
    	 *
    	 *     mat4.identity(dest);
    	 *     mat4.translate(dest, vec);
    	 *     var quatMat = mat4.create();
    	 *     quat4.toMat4(quat, quatMat);
    	 *     mat4.multiply(dest, quatMat);
    	 *
    	 * @param {mat4} out mat4 receiving operation result
    	 * @param {quat4} q Rotation quaternion
    	 * @param {vec3} v Translation vector
    	 * @returns {mat4} out
    	 */
    	function fromRotationTranslation(out, q, v) {
    	    // Quaternion math
    	    var x = q[0], y = q[1], z = q[2], w = q[3],
    	        x2 = x + x,
    	        y2 = y + y,
    	        z2 = z + z,

    	        xx = x * x2,
    	        xy = x * y2,
    	        xz = x * z2,
    	        yy = y * y2,
    	        yz = y * z2,
    	        zz = z * z2,
    	        wx = w * x2,
    	        wy = w * y2,
    	        wz = w * z2;

    	    out[0] = 1 - (yy + zz);
    	    out[1] = xy + wz;
    	    out[2] = xz - wy;
    	    out[3] = 0;
    	    out[4] = xy - wz;
    	    out[5] = 1 - (xx + zz);
    	    out[6] = yz + wx;
    	    out[7] = 0;
    	    out[8] = xz + wy;
    	    out[9] = yz - wx;
    	    out[10] = 1 - (xx + yy);
    	    out[11] = 0;
    	    out[12] = v[0];
    	    out[13] = v[1];
    	    out[14] = v[2];
    	    out[15] = 1;
    	    
    	    return out;
    	}	return fromRotationTranslation_1;
    }

    var fromRotationTranslationExports = /*@__PURE__*/ requireFromRotationTranslation();
    var fromRotationTranslation = /*@__PURE__*/getDefaultExportFromCjs(fromRotationTranslationExports);

    var length_1;
    var hasRequiredLength;

    function requireLength () {
    	if (hasRequiredLength) return length_1;
    	hasRequiredLength = 1;
    	length_1 = length;

    	/**
    	 * Calculates the length of a vec3
    	 *
    	 * @param {vec3} a vector to calculate length of
    	 * @returns {Number} length of a
    	 */
    	function length(a) {
    	    var x = a[0],
    	        y = a[1],
    	        z = a[2];
    	    return Math.sqrt(x*x + y*y + z*z)
    	}
    	return length_1;
    }

    var normalize_1;
    var hasRequiredNormalize$1;

    function requireNormalize$1 () {
    	if (hasRequiredNormalize$1) return normalize_1;
    	hasRequiredNormalize$1 = 1;
    	normalize_1 = normalize;

    	/**
    	 * Normalize a vec4
    	 *
    	 * @param {vec4} out the receiving vector
    	 * @param {vec4} a vector to normalize
    	 * @returns {vec4} out
    	 */
    	function normalize (out, a) {
    	  var x = a[0],
    	    y = a[1],
    	    z = a[2],
    	    w = a[3];
    	  var len = x * x + y * y + z * z + w * w;
    	  if (len > 0) {
    	    len = 1 / Math.sqrt(len);
    	    out[0] = x * len;
    	    out[1] = y * len;
    	    out[2] = z * len;
    	    out[3] = w * len;
    	  }
    	  return out
    	}
    	return normalize_1;
    }

    /**
     * Normalize a quat
     *
     * @param {quat} out the receiving quaternion
     * @param {quat} a quaternion to normalize
     * @returns {quat} out
     * @function
     */

    var normalize$1;
    var hasRequiredNormalize;

    function requireNormalize () {
    	if (hasRequiredNormalize) return normalize$1;
    	hasRequiredNormalize = 1;
    	normalize$1 = /*@__PURE__*/ requireNormalize$1();
    	return normalize$1;
    }

    var setAxisAngle_1;
    var hasRequiredSetAxisAngle;

    function requireSetAxisAngle () {
    	if (hasRequiredSetAxisAngle) return setAxisAngle_1;
    	hasRequiredSetAxisAngle = 1;
    	setAxisAngle_1 = setAxisAngle;

    	/**
    	 * Sets a quat from the given angle and rotation axis,
    	 * then returns it.
    	 *
    	 * @param {quat} out the receiving quaternion
    	 * @param {vec3} axis the axis around which to rotate
    	 * @param {Number} rad the angle in radians
    	 * @returns {quat} out
    	 **/
    	function setAxisAngle (out, axis, rad) {
    	  rad = rad * 0.5;
    	  var s = Math.sin(rad);
    	  out[0] = s * axis[0];
    	  out[1] = s * axis[1];
    	  out[2] = s * axis[2];
    	  out[3] = Math.cos(rad);
    	  return out
    	}
    	return setAxisAngle_1;
    }

    var rotationTo_1;
    var hasRequiredRotationTo;

    function requireRotationTo () {
    	if (hasRequiredRotationTo) return rotationTo_1;
    	hasRequiredRotationTo = 1;
    	var vecDot = /*@__PURE__*/ requireDot();
    	var vecCross = /*@__PURE__*/ requireCross();
    	var vecLength = /*@__PURE__*/ requireLength();
    	var vecNormalize = /*@__PURE__*/ requireNormalize$2();

    	var quatNormalize = /*@__PURE__*/ requireNormalize();
    	var quatAxisAngle = /*@__PURE__*/ requireSetAxisAngle();

    	rotationTo_1 = rotationTo;

    	var tmpvec3 = [0, 0, 0];
    	var xUnitVec3 = [1, 0, 0];
    	var yUnitVec3 = [0, 1, 0];

    	/**
    	 * Sets a quaternion to represent the shortest rotation from one
    	 * vector to another.
    	 *
    	 * Both vectors are assumed to be unit length.
    	 *
    	 * @param {quat} out the receiving quaternion.
    	 * @param {vec3} a the initial vector
    	 * @param {vec3} b the destination vector
    	 * @returns {quat} out
    	 */
    	function rotationTo (out, a, b) {
    	  var dot = vecDot(a, b);
    	  if (dot < -0.999999) {
    	    vecCross(tmpvec3, xUnitVec3, a);
    	    if (vecLength(tmpvec3) < 0.000001) {
    	      vecCross(tmpvec3, yUnitVec3, a);
    	    }
    	    vecNormalize(tmpvec3, tmpvec3);
    	    quatAxisAngle(out, tmpvec3, Math.PI);
    	    return out
    	  } else if (dot > 0.999999) {
    	    out[0] = 0;
    	    out[1] = 0;
    	    out[2] = 0;
    	    out[3] = 1;
    	    return out
    	  } else {
    	    vecCross(tmpvec3, a, b);
    	    out[0] = tmpvec3[0];
    	    out[1] = tmpvec3[1];
    	    out[2] = tmpvec3[2];
    	    out[3] = 1 + dot;
    	    return quatNormalize(out, out)
    	  }
    	}
    	return rotationTo_1;
    }

    var rotationToExports = /*@__PURE__*/ requireRotationTo();
    var rotationTo = /*@__PURE__*/getDefaultExportFromCjs(rotationToExports);

    var browser = {exports: {}};

    /**
     * Helpers.
     */

    var ms;
    var hasRequiredMs;

    function requireMs () {
    	if (hasRequiredMs) return ms;
    	hasRequiredMs = 1;
    	var s = 1000;
    	var m = s * 60;
    	var h = m * 60;
    	var d = h * 24;
    	var w = d * 7;
    	var y = d * 365.25;

    	/**
    	 * Parse or format the given `val`.
    	 *
    	 * Options:
    	 *
    	 *  - `long` verbose formatting [false]
    	 *
    	 * @param {String|Number} val
    	 * @param {Object} [options]
    	 * @throws {Error} throw an error if val is not a non-empty string or a number
    	 * @return {String|Number}
    	 * @api public
    	 */

    	ms = function (val, options) {
    	  options = options || {};
    	  var type = typeof val;
    	  if (type === 'string' && val.length > 0) {
    	    return parse(val);
    	  } else if (type === 'number' && isFinite(val)) {
    	    return options.long ? fmtLong(val) : fmtShort(val);
    	  }
    	  throw new Error(
    	    'val is not a non-empty string or a valid number. val=' +
    	      JSON.stringify(val)
    	  );
    	};

    	/**
    	 * Parse the given `str` and return milliseconds.
    	 *
    	 * @param {String} str
    	 * @return {Number}
    	 * @api private
    	 */

    	function parse(str) {
    	  str = String(str);
    	  if (str.length > 100) {
    	    return;
    	  }
    	  var match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
    	    str
    	  );
    	  if (!match) {
    	    return;
    	  }
    	  var n = parseFloat(match[1]);
    	  var type = (match[2] || 'ms').toLowerCase();
    	  switch (type) {
    	    case 'years':
    	    case 'year':
    	    case 'yrs':
    	    case 'yr':
    	    case 'y':
    	      return n * y;
    	    case 'weeks':
    	    case 'week':
    	    case 'w':
    	      return n * w;
    	    case 'days':
    	    case 'day':
    	    case 'd':
    	      return n * d;
    	    case 'hours':
    	    case 'hour':
    	    case 'hrs':
    	    case 'hr':
    	    case 'h':
    	      return n * h;
    	    case 'minutes':
    	    case 'minute':
    	    case 'mins':
    	    case 'min':
    	    case 'm':
    	      return n * m;
    	    case 'seconds':
    	    case 'second':
    	    case 'secs':
    	    case 'sec':
    	    case 's':
    	      return n * s;
    	    case 'milliseconds':
    	    case 'millisecond':
    	    case 'msecs':
    	    case 'msec':
    	    case 'ms':
    	      return n;
    	    default:
    	      return undefined;
    	  }
    	}

    	/**
    	 * Short format for `ms`.
    	 *
    	 * @param {Number} ms
    	 * @return {String}
    	 * @api private
    	 */

    	function fmtShort(ms) {
    	  var msAbs = Math.abs(ms);
    	  if (msAbs >= d) {
    	    return Math.round(ms / d) + 'd';
    	  }
    	  if (msAbs >= h) {
    	    return Math.round(ms / h) + 'h';
    	  }
    	  if (msAbs >= m) {
    	    return Math.round(ms / m) + 'm';
    	  }
    	  if (msAbs >= s) {
    	    return Math.round(ms / s) + 's';
    	  }
    	  return ms + 'ms';
    	}

    	/**
    	 * Long format for `ms`.
    	 *
    	 * @param {Number} ms
    	 * @return {String}
    	 * @api private
    	 */

    	function fmtLong(ms) {
    	  var msAbs = Math.abs(ms);
    	  if (msAbs >= d) {
    	    return plural(ms, msAbs, d, 'day');
    	  }
    	  if (msAbs >= h) {
    	    return plural(ms, msAbs, h, 'hour');
    	  }
    	  if (msAbs >= m) {
    	    return plural(ms, msAbs, m, 'minute');
    	  }
    	  if (msAbs >= s) {
    	    return plural(ms, msAbs, s, 'second');
    	  }
    	  return ms + ' ms';
    	}

    	/**
    	 * Pluralization helper.
    	 */

    	function plural(ms, msAbs, n, name) {
    	  var isPlural = msAbs >= n * 1.5;
    	  return Math.round(ms / n) + ' ' + name + (isPlural ? 's' : '');
    	}
    	return ms;
    }

    var common;
    var hasRequiredCommon;

    function requireCommon () {
    	if (hasRequiredCommon) return common;
    	hasRequiredCommon = 1;
    	/**
    	 * This is the common logic for both the Node.js and web browser
    	 * implementations of `debug()`.
    	 */

    	function setup(env) {
    		createDebug.debug = createDebug;
    		createDebug.default = createDebug;
    		createDebug.coerce = coerce;
    		createDebug.disable = disable;
    		createDebug.enable = enable;
    		createDebug.enabled = enabled;
    		createDebug.humanize = /*@__PURE__*/ requireMs();
    		createDebug.destroy = destroy;

    		Object.keys(env).forEach(key => {
    			createDebug[key] = env[key];
    		});

    		/**
    		* The currently active debug mode names, and names to skip.
    		*/

    		createDebug.names = [];
    		createDebug.skips = [];

    		/**
    		* Map of special "%n" handling functions, for the debug "format" argument.
    		*
    		* Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
    		*/
    		createDebug.formatters = {};

    		/**
    		* Selects a color for a debug namespace
    		* @param {String} namespace The namespace string for the debug instance to be colored
    		* @return {Number|String} An ANSI color code for the given namespace
    		* @api private
    		*/
    		function selectColor(namespace) {
    			let hash = 0;

    			for (let i = 0; i < namespace.length; i++) {
    				hash = ((hash << 5) - hash) + namespace.charCodeAt(i);
    				hash |= 0; // Convert to 32bit integer
    			}

    			return createDebug.colors[Math.abs(hash) % createDebug.colors.length];
    		}
    		createDebug.selectColor = selectColor;

    		/**
    		* Create a debugger with the given `namespace`.
    		*
    		* @param {String} namespace
    		* @return {Function}
    		* @api public
    		*/
    		function createDebug(namespace) {
    			let prevTime;
    			let enableOverride = null;
    			let namespacesCache;
    			let enabledCache;

    			function debug(...args) {
    				// Disabled?
    				if (!debug.enabled) {
    					return;
    				}

    				const self = debug;

    				// Set `diff` timestamp
    				const curr = Number(new Date());
    				const ms = curr - (prevTime || curr);
    				self.diff = ms;
    				self.prev = prevTime;
    				self.curr = curr;
    				prevTime = curr;

    				args[0] = createDebug.coerce(args[0]);

    				if (typeof args[0] !== 'string') {
    					// Anything else let's inspect with %O
    					args.unshift('%O');
    				}

    				// Apply any `formatters` transformations
    				let index = 0;
    				args[0] = args[0].replace(/%([a-zA-Z%])/g, (match, format) => {
    					// If we encounter an escaped % then don't increase the array index
    					if (match === '%%') {
    						return '%';
    					}
    					index++;
    					const formatter = createDebug.formatters[format];
    					if (typeof formatter === 'function') {
    						const val = args[index];
    						match = formatter.call(self, val);

    						// Now we need to remove `args[index]` since it's inlined in the `format`
    						args.splice(index, 1);
    						index--;
    					}
    					return match;
    				});

    				// Apply env-specific formatting (colors, etc.)
    				createDebug.formatArgs.call(self, args);

    				const logFn = self.log || createDebug.log;
    				logFn.apply(self, args);
    			}

    			debug.namespace = namespace;
    			debug.useColors = createDebug.useColors();
    			debug.color = createDebug.selectColor(namespace);
    			debug.extend = extend;
    			debug.destroy = createDebug.destroy; // XXX Temporary. Will be removed in the next major release.

    			Object.defineProperty(debug, 'enabled', {
    				enumerable: true,
    				configurable: false,
    				get: () => {
    					if (enableOverride !== null) {
    						return enableOverride;
    					}
    					if (namespacesCache !== createDebug.namespaces) {
    						namespacesCache = createDebug.namespaces;
    						enabledCache = createDebug.enabled(namespace);
    					}

    					return enabledCache;
    				},
    				set: v => {
    					enableOverride = v;
    				}
    			});

    			// Env-specific initialization logic for debug instances
    			if (typeof createDebug.init === 'function') {
    				createDebug.init(debug);
    			}

    			return debug;
    		}

    		function extend(namespace, delimiter) {
    			const newDebug = createDebug(this.namespace + (typeof delimiter === 'undefined' ? ':' : delimiter) + namespace);
    			newDebug.log = this.log;
    			return newDebug;
    		}

    		/**
    		* Enables a debug mode by namespaces. This can include modes
    		* separated by a colon and wildcards.
    		*
    		* @param {String} namespaces
    		* @api public
    		*/
    		function enable(namespaces) {
    			createDebug.save(namespaces);
    			createDebug.namespaces = namespaces;

    			createDebug.names = [];
    			createDebug.skips = [];

    			const split = (typeof namespaces === 'string' ? namespaces : '')
    				.trim()
    				.replace(/\s+/g, ',')
    				.split(',')
    				.filter(Boolean);

    			for (const ns of split) {
    				if (ns[0] === '-') {
    					createDebug.skips.push(ns.slice(1));
    				} else {
    					createDebug.names.push(ns);
    				}
    			}
    		}

    		/**
    		 * Checks if the given string matches a namespace template, honoring
    		 * asterisks as wildcards.
    		 *
    		 * @param {String} search
    		 * @param {String} template
    		 * @return {Boolean}
    		 */
    		function matchesTemplate(search, template) {
    			let searchIndex = 0;
    			let templateIndex = 0;
    			let starIndex = -1;
    			let matchIndex = 0;

    			while (searchIndex < search.length) {
    				if (templateIndex < template.length && (template[templateIndex] === search[searchIndex] || template[templateIndex] === '*')) {
    					// Match character or proceed with wildcard
    					if (template[templateIndex] === '*') {
    						starIndex = templateIndex;
    						matchIndex = searchIndex;
    						templateIndex++; // Skip the '*'
    					} else {
    						searchIndex++;
    						templateIndex++;
    					}
    				} else if (starIndex !== -1) { // eslint-disable-line no-negated-condition
    					// Backtrack to the last '*' and try to match more characters
    					templateIndex = starIndex + 1;
    					matchIndex++;
    					searchIndex = matchIndex;
    				} else {
    					return false; // No match
    				}
    			}

    			// Handle trailing '*' in template
    			while (templateIndex < template.length && template[templateIndex] === '*') {
    				templateIndex++;
    			}

    			return templateIndex === template.length;
    		}

    		/**
    		* Disable debug output.
    		*
    		* @return {String} namespaces
    		* @api public
    		*/
    		function disable() {
    			const namespaces = [
    				...createDebug.names,
    				...createDebug.skips.map(namespace => '-' + namespace)
    			].join(',');
    			createDebug.enable('');
    			return namespaces;
    		}

    		/**
    		* Returns true if the given mode name is enabled, false otherwise.
    		*
    		* @param {String} name
    		* @return {Boolean}
    		* @api public
    		*/
    		function enabled(name) {
    			for (const skip of createDebug.skips) {
    				if (matchesTemplate(name, skip)) {
    					return false;
    				}
    			}

    			for (const ns of createDebug.names) {
    				if (matchesTemplate(name, ns)) {
    					return true;
    				}
    			}

    			return false;
    		}

    		/**
    		* Coerce `val`.
    		*
    		* @param {Mixed} val
    		* @return {Mixed}
    		* @api private
    		*/
    		function coerce(val) {
    			if (val instanceof Error) {
    				return val.stack || val.message;
    			}
    			return val;
    		}

    		/**
    		* XXX DO NOT USE. This is a temporary stub function.
    		* XXX It WILL be removed in the next major release.
    		*/
    		function destroy() {
    			console.warn('Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.');
    		}

    		createDebug.enable(createDebug.load());

    		return createDebug;
    	}

    	common = setup;
    	return common;
    }

    /* eslint-env browser */

    var hasRequiredBrowser;

    function requireBrowser () {
    	if (hasRequiredBrowser) return browser.exports;
    	hasRequiredBrowser = 1;
    	(function (module, exports) {
    		/**
    		 * This is the web browser implementation of `debug()`.
    		 */

    		exports.formatArgs = formatArgs;
    		exports.save = save;
    		exports.load = load;
    		exports.useColors = useColors;
    		exports.storage = localstorage();
    		exports.destroy = (() => {
    			let warned = false;

    			return () => {
    				if (!warned) {
    					warned = true;
    					console.warn('Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.');
    				}
    			};
    		})();

    		/**
    		 * Colors.
    		 */

    		exports.colors = [
    			'#0000CC',
    			'#0000FF',
    			'#0033CC',
    			'#0033FF',
    			'#0066CC',
    			'#0066FF',
    			'#0099CC',
    			'#0099FF',
    			'#00CC00',
    			'#00CC33',
    			'#00CC66',
    			'#00CC99',
    			'#00CCCC',
    			'#00CCFF',
    			'#3300CC',
    			'#3300FF',
    			'#3333CC',
    			'#3333FF',
    			'#3366CC',
    			'#3366FF',
    			'#3399CC',
    			'#3399FF',
    			'#33CC00',
    			'#33CC33',
    			'#33CC66',
    			'#33CC99',
    			'#33CCCC',
    			'#33CCFF',
    			'#6600CC',
    			'#6600FF',
    			'#6633CC',
    			'#6633FF',
    			'#66CC00',
    			'#66CC33',
    			'#9900CC',
    			'#9900FF',
    			'#9933CC',
    			'#9933FF',
    			'#99CC00',
    			'#99CC33',
    			'#CC0000',
    			'#CC0033',
    			'#CC0066',
    			'#CC0099',
    			'#CC00CC',
    			'#CC00FF',
    			'#CC3300',
    			'#CC3333',
    			'#CC3366',
    			'#CC3399',
    			'#CC33CC',
    			'#CC33FF',
    			'#CC6600',
    			'#CC6633',
    			'#CC9900',
    			'#CC9933',
    			'#CCCC00',
    			'#CCCC33',
    			'#FF0000',
    			'#FF0033',
    			'#FF0066',
    			'#FF0099',
    			'#FF00CC',
    			'#FF00FF',
    			'#FF3300',
    			'#FF3333',
    			'#FF3366',
    			'#FF3399',
    			'#FF33CC',
    			'#FF33FF',
    			'#FF6600',
    			'#FF6633',
    			'#FF9900',
    			'#FF9933',
    			'#FFCC00',
    			'#FFCC33'
    		];

    		/**
    		 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
    		 * and the Firebug extension (any Firefox version) are known
    		 * to support "%c" CSS customizations.
    		 *
    		 * TODO: add a `localStorage` variable to explicitly enable/disable colors
    		 */

    		// eslint-disable-next-line complexity
    		function useColors() {
    			// NB: In an Electron preload script, document will be defined but not fully
    			// initialized. Since we know we're in Chrome, we'll just detect this case
    			// explicitly
    			if (typeof window !== 'undefined' && window.process && (window.process.type === 'renderer' || window.process.__nwjs)) {
    				return true;
    			}

    			// Internet Explorer and Edge do not support colors.
    			if (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
    				return false;
    			}

    			let m;

    			// Is webkit? http://stackoverflow.com/a/16459606/376773
    			// document is undefined in react-native: https://github.com/facebook/react-native/pull/1632
    			// eslint-disable-next-line no-return-assign
    			return (typeof document !== 'undefined' && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance) ||
    				// Is firebug? http://stackoverflow.com/a/398120/376773
    				(typeof window !== 'undefined' && window.console && (window.console.firebug || (window.console.exception && window.console.table))) ||
    				// Is firefox >= v31?
    				// https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
    				(typeof navigator !== 'undefined' && navigator.userAgent && (m = navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/)) && parseInt(m[1], 10) >= 31) ||
    				// Double check webkit in userAgent just in case we are in a worker
    				(typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/));
    		}

    		/**
    		 * Colorize log arguments if enabled.
    		 *
    		 * @api public
    		 */

    		function formatArgs(args) {
    			args[0] = (this.useColors ? '%c' : '') +
    				this.namespace +
    				(this.useColors ? ' %c' : ' ') +
    				args[0] +
    				(this.useColors ? '%c ' : ' ') +
    				'+' + module.exports.humanize(this.diff);

    			if (!this.useColors) {
    				return;
    			}

    			const c = 'color: ' + this.color;
    			args.splice(1, 0, c, 'color: inherit');

    			// The final "%c" is somewhat tricky, because there could be other
    			// arguments passed either before or after the %c, so we need to
    			// figure out the correct index to insert the CSS into
    			let index = 0;
    			let lastC = 0;
    			args[0].replace(/%[a-zA-Z%]/g, match => {
    				if (match === '%%') {
    					return;
    				}
    				index++;
    				if (match === '%c') {
    					// We only are interested in the *last* %c
    					// (the user may have provided their own)
    					lastC = index;
    				}
    			});

    			args.splice(lastC, 0, c);
    		}

    		/**
    		 * Invokes `console.debug()` when available.
    		 * No-op when `console.debug` is not a "function".
    		 * If `console.debug` is not available, falls back
    		 * to `console.log`.
    		 *
    		 * @api public
    		 */
    		exports.log = console.debug || console.log || (() => {});

    		/**
    		 * Save `namespaces`.
    		 *
    		 * @param {String} namespaces
    		 * @api private
    		 */
    		function save(namespaces) {
    			try {
    				if (namespaces) {
    					exports.storage.setItem('debug', namespaces);
    				} else {
    					exports.storage.removeItem('debug');
    				}
    			} catch (error) {
    				// Swallow
    				// XXX (@Qix-) should we be logging these?
    			}
    		}

    		/**
    		 * Load `namespaces`.
    		 *
    		 * @return {String} returns the previously persisted debug modes
    		 * @api private
    		 */
    		function load() {
    			let r;
    			try {
    				r = exports.storage.getItem('debug') || exports.storage.getItem('DEBUG') ;
    			} catch (error) {
    				// Swallow
    				// XXX (@Qix-) should we be logging these?
    			}

    			// If debug isn't set in LS, and we're in Electron, try to load $DEBUG
    			if (!r && typeof process !== 'undefined' && 'env' in process) {
    				r = process.env.DEBUG;
    			}

    			return r;
    		}

    		/**
    		 * Localstorage attempts to return the localstorage.
    		 *
    		 * This is necessary because safari throws
    		 * when a user disables cookies/localstorage
    		 * and you attempt to access it.
    		 *
    		 * @return {LocalStorage}
    		 * @api private
    		 */

    		function localstorage() {
    			try {
    				// TVMLKit (Apple TV JS Runtime) does not have a window object, just localStorage in the global context
    				// The Browser also has localStorage in the global context.
    				return localStorage;
    			} catch (error) {
    				// Swallow
    				// XXX (@Qix-) should we be logging these?
    			}
    		}

    		module.exports = /*@__PURE__*/ requireCommon()(exports);

    		const {formatters} = module.exports;

    		/**
    		 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
    		 */

    		formatters.j = function (v) {
    			try {
    				return JSON.stringify(v);
    			} catch (error) {
    				return '[UnexpectedJSONParseError]: ' + error.message;
    			}
    		}; 
    	} (browser, browser.exports));
    	return browser.exports;
    }

    var browserExports = /*@__PURE__*/ requireBrowser();
    var $debug = /*@__PURE__*/getDefaultExportFromCjs(browserExports);

    class VertexList {
        head;
        tail;
        constructor() {
            this.head = null;
            this.tail = null;
        }
        clear() {
            this.head = this.tail = null;
        }
        /**
         * Inserts a `node` before `target`, it's assumed that
         * `target` belongs to this doubly linked list
         *
         * @param {Vertex} target
         * @param {Vertex} node
         */
        insertBefore(target, node) {
            node.prev = target.prev;
            node.next = target;
            if (!node.prev) {
                this.head = node;
            }
            else {
                node.prev.next = node;
            }
            target.prev = node;
        }
        /**
         * Inserts a `node` after `target`, it's assumed that
         * `target` belongs to this doubly linked list
         *
         * @param {Vertex} target
         * @param {Vertex} node
         */
        insertAfter(target, node) {
            node.prev = target;
            node.next = target.next;
            if (!node.next) {
                this.tail = node;
            }
            else {
                node.next.prev = node;
            }
            target.next = node;
        }
        /**
         * Appends a `node` to the end of this doubly linked list
         * Note: `node.next` will be unlinked from `node`
         * Note: if `node` is part of another linked list call `addAll` instead
         *
         * @param {Vertex} node
         */
        add(node) {
            if (!this.head) {
                this.head = node;
            }
            else {
                this.tail.next = node;
            }
            node.prev = this.tail;
            // since node is the new end it doesn't have a next node
            node.next = null;
            this.tail = node;
        }
        /**
         * Appends a chain of nodes where `node` is the head,
         * the difference with `add` is that it correctly sets the position
         * of the node list `tail` property
         *
         * @param {Vertex} node
         */
        addAll(node) {
            if (!this.head) {
                this.head = node;
            }
            else {
                this.tail.next = node;
            }
            node.prev = this.tail;
            // find the end of the list
            while (node.next) {
                node = node.next;
            }
            this.tail = node;
        }
        /**
         * Deletes a `node` from this linked list, it's assumed that `node` is a
         * member of this linked list
         *
         * @param {Vertex} node
         */
        remove(node) {
            if (!node.prev) {
                this.head = node.next;
            }
            else {
                node.prev.next = node.next;
            }
            if (!node.next) {
                this.tail = node.prev;
            }
            else {
                node.next.prev = node.prev;
            }
        }
        /**
         * Removes a chain of nodes whose head is `a` and whose tail is `b`,
         * it's assumed that `a` and `b` belong to this list and also that `a`
         * comes before `b` in the linked list
         *
         * @param {Vertex} a
         * @param {Vertex} b
         */
        removeChain(a, b) {
            if (!a.prev) {
                this.head = b.next;
            }
            else {
                a.prev.next = b.next;
            }
            if (!b.next) {
                this.tail = a.prev;
            }
            else {
                b.next.prev = a.prev;
            }
        }
        first() {
            return this.head;
        }
        isEmpty() {
            return !this.head;
        }
    }

    class Vertex {
        point;
        // index in the input array
        index;
        // next is a pointer to the next Vertex
        next;
        // prev is a pointer to the previous Vertex
        prev;
        // face is the face that's able to see this point
        face;
        constructor(point, index) {
            this.point = point;
            this.index = index;
            this.next = null;
            this.prev = null;
            this.face = null;
        }
    }

    var add_1;
    var hasRequiredAdd;

    function requireAdd () {
    	if (hasRequiredAdd) return add_1;
    	hasRequiredAdd = 1;
    	add_1 = add;

    	/**
    	 * Adds two vec3's
    	 *
    	 * @param {vec3} out the receiving vector
    	 * @param {vec3} a the first operand
    	 * @param {vec3} b the second operand
    	 * @returns {vec3} out
    	 */
    	function add(out, a, b) {
    	    out[0] = a[0] + b[0];
    	    out[1] = a[1] + b[1];
    	    out[2] = a[2] + b[2];
    	    return out
    	}
    	return add_1;
    }

    var addExports = /*@__PURE__*/ requireAdd();
    var add = /*@__PURE__*/getDefaultExportFromCjs(addExports);

    var subtractExports = /*@__PURE__*/ requireSubtract();
    var subtract = /*@__PURE__*/getDefaultExportFromCjs(subtractExports);

    var crossExports = /*@__PURE__*/ requireCross();
    var cross = /*@__PURE__*/getDefaultExportFromCjs(crossExports);

    var copy_1;
    var hasRequiredCopy;

    function requireCopy () {
    	if (hasRequiredCopy) return copy_1;
    	hasRequiredCopy = 1;
    	copy_1 = copy;

    	/**
    	 * Copy the values from one vec3 to another
    	 *
    	 * @param {vec3} out the receiving vector
    	 * @param {vec3} a the source vector
    	 * @returns {vec3} out
    	 */
    	function copy(out, a) {
    	    out[0] = a[0];
    	    out[1] = a[1];
    	    out[2] = a[2];
    	    return out
    	}
    	return copy_1;
    }

    var copyExports = /*@__PURE__*/ requireCopy();
    var copy = /*@__PURE__*/getDefaultExportFromCjs(copyExports);

    var lengthExports = /*@__PURE__*/ requireLength();
    var magnitude = /*@__PURE__*/getDefaultExportFromCjs(lengthExports);

    var scaleAndAdd_1;
    var hasRequiredScaleAndAdd;

    function requireScaleAndAdd () {
    	if (hasRequiredScaleAndAdd) return scaleAndAdd_1;
    	hasRequiredScaleAndAdd = 1;
    	scaleAndAdd_1 = scaleAndAdd;

    	/**
    	 * Adds two vec3's after scaling the second operand by a scalar value
    	 *
    	 * @param {vec3} out the receiving vector
    	 * @param {vec3} a the first operand
    	 * @param {vec3} b the second operand
    	 * @param {Number} scale the amount to scale b by before adding
    	 * @returns {vec3} out
    	 */
    	function scaleAndAdd(out, a, b, scale) {
    	    out[0] = a[0] + (b[0] * scale);
    	    out[1] = a[1] + (b[1] * scale);
    	    out[2] = a[2] + (b[2] * scale);
    	    return out
    	}
    	return scaleAndAdd_1;
    }

    var scaleAndAddExports = /*@__PURE__*/ requireScaleAndAdd();
    var scaleAndAdd = /*@__PURE__*/getDefaultExportFromCjs(scaleAndAddExports);

    var normalizeExports = /*@__PURE__*/ requireNormalize$2();
    var normalize = /*@__PURE__*/getDefaultExportFromCjs(normalizeExports);

    var distance_1;
    var hasRequiredDistance;

    function requireDistance () {
    	if (hasRequiredDistance) return distance_1;
    	hasRequiredDistance = 1;
    	distance_1 = distance;

    	/**
    	 * Calculates the euclidian distance between two vec3's
    	 *
    	 * @param {vec3} a the first operand
    	 * @param {vec3} b the second operand
    	 * @returns {Number} distance between a and b
    	 */
    	function distance(a, b) {
    	    var x = b[0] - a[0],
    	        y = b[1] - a[1],
    	        z = b[2] - a[2];
    	    return Math.sqrt(x*x + y*y + z*z)
    	}
    	return distance_1;
    }

    var distanceExports = /*@__PURE__*/ requireDistance();
    var distance = /*@__PURE__*/getDefaultExportFromCjs(distanceExports);

    var squaredDistance_1;
    var hasRequiredSquaredDistance;

    function requireSquaredDistance () {
    	if (hasRequiredSquaredDistance) return squaredDistance_1;
    	hasRequiredSquaredDistance = 1;
    	squaredDistance_1 = squaredDistance;

    	/**
    	 * Calculates the squared euclidian distance between two vec3's
    	 *
    	 * @param {vec3} a the first operand
    	 * @param {vec3} b the second operand
    	 * @returns {Number} squared distance between a and b
    	 */
    	function squaredDistance(a, b) {
    	    var x = b[0] - a[0],
    	        y = b[1] - a[1],
    	        z = b[2] - a[2];
    	    return x*x + y*y + z*z
    	}
    	return squaredDistance_1;
    }

    var squaredDistanceExports = /*@__PURE__*/ requireSquaredDistance();
    var squaredDistance = /*@__PURE__*/getDefaultExportFromCjs(squaredDistanceExports);

    const debug$2 = $debug('quickhull3d:halfedge');
    class HalfEdge {
        vertex;
        face;
        next;
        prev;
        opposite;
        constructor(vertex, face) {
            this.vertex = vertex;
            this.face = face;
            this.next = null;
            this.prev = null;
            this.opposite = null;
        }
        head() {
            return this.vertex;
        }
        tail() {
            return this.prev ? this.prev.vertex : null;
        }
        length() {
            if (this.tail()) {
                return distance(this.tail().point, this.head().point);
            }
            return -1;
        }
        lengthSquared() {
            if (this.tail()) {
                return squaredDistance(this.tail().point, this.head().point);
            }
            return -1;
        }
        setOpposite(edge) {
            const me = this;
            if (debug$2.enabled) {
                debug$2(`opposite ${me.tail().index} <--> ${me.head().index} between ${me.face.collectIndices()}, ${edge.face.collectIndices()}`);
            }
            this.opposite = edge;
            edge.opposite = this;
        }
    }

    const debug$1 = $debug('quickhull3d:face');
    var Mark;
    (function (Mark) {
        Mark[Mark["Visible"] = 0] = "Visible";
        Mark[Mark["NonConvex"] = 1] = "NonConvex";
        Mark[Mark["Deleted"] = 2] = "Deleted";
    })(Mark || (Mark = {}));
    class Face {
        normal;
        centroid;
        offset;
        outside;
        mark;
        edge;
        nVertices;
        area;
        constructor() {
            this.normal = [0, 0, 0];
            this.centroid = [0, 0, 0];
            // signed distance from face to the origin
            this.offset = 0;
            // pointer to the a vertex in a double linked list this face can see
            this.outside = null;
            this.mark = Mark.Visible;
            this.edge = null;
            this.nVertices = 0;
        }
        getEdge(i) {
            let it = this.edge;
            while (i > 0) {
                it = it.next;
                i -= 1;
            }
            while (i < 0) {
                it = it.prev;
                i += 1;
            }
            return it;
        }
        computeNormal() {
            const e0 = this.edge;
            const e1 = e0.next;
            let e2 = e1.next;
            const v2 = subtract([], e1.head().point, e0.head().point);
            const t = [];
            const v1 = [];
            this.nVertices = 2;
            this.normal = [0, 0, 0];
            // console.log(this.normal)
            while (e2 !== e0) {
                copy(v1, v2);
                subtract(v2, e2.head().point, e0.head().point);
                add(this.normal, this.normal, cross(t, v1, v2));
                e2 = e2.next;
                this.nVertices += 1;
            }
            this.area = magnitude(this.normal);
            // normalize the vector, since we've already calculated the area
            // it's cheaper to scale the vector using this quantity instead of
            // doing the same operation again
            this.normal = scale(this.normal, this.normal, 1 / this.area);
        }
        computeNormalMinArea(minArea) {
            this.computeNormal();
            if (this.area < minArea) {
                // compute the normal without the longest edge
                let maxEdge;
                let maxSquaredLength = 0;
                let edge = this.edge;
                // find the longest edge (in length) in the chain of edges
                do {
                    const lengthSquared = edge.lengthSquared();
                    if (lengthSquared > maxSquaredLength) {
                        maxEdge = edge;
                        maxSquaredLength = lengthSquared;
                    }
                    edge = edge.next;
                } while (edge !== this.edge);
                const p1 = maxEdge.tail().point;
                const p2 = maxEdge.head().point;
                const maxVector = subtract([], p2, p1);
                const maxLength = Math.sqrt(maxSquaredLength);
                // maxVector is normalized after this operation
                scale(maxVector, maxVector, 1 / maxLength);
                // compute the projection of maxVector over this face normal
                const maxProjection = dot(this.normal, maxVector);
                // subtract the quantity maxEdge adds on the normal
                scaleAndAdd(this.normal, this.normal, maxVector, -maxProjection);
                // renormalize `this.normal`
                normalize(this.normal, this.normal);
            }
        }
        computeCentroid() {
            this.centroid = [0, 0, 0];
            let edge = this.edge;
            do {
                add(this.centroid, this.centroid, edge.head().point);
                edge = edge.next;
            } while (edge !== this.edge);
            scale(this.centroid, this.centroid, 1 / this.nVertices);
        }
        computeNormalAndCentroid(minArea) {
            if (typeof minArea !== 'undefined') {
                this.computeNormalMinArea(minArea);
            }
            else {
                this.computeNormal();
            }
            this.computeCentroid();
            this.offset = dot(this.normal, this.centroid);
        }
        distanceToPlane(point) {
            return dot(this.normal, point) - this.offset;
        }
        /**
         * @private
         *
         * Connects two edges assuming that prev.head().point === next.tail().point
         *
         * @param {HalfEdge} prev
         * @param {HalfEdge} next
         */
        connectHalfEdges(prev, next) {
            let discardedFace;
            if (prev.opposite.face === next.opposite.face) {
                // `prev` is remove a redundant edge
                const oppositeFace = next.opposite.face;
                let oppositeEdge;
                if (prev === this.edge) {
                    this.edge = next;
                }
                if (oppositeFace.nVertices === 3) {
                    // case:
                    // remove the face on the right
                    //
                    //       /|\
                    //      / | \ the face on the right
                    //     /  |  \ --> opposite edge
                    //    / a |   \
                    //   *----*----*
                    //  /     b  |  \
                    //           ▾
                    //      redundant edge
                    //
                    // Note: the opposite edge is actually in the face to the right
                    // of the face to be destroyed
                    oppositeEdge = next.opposite.prev.opposite;
                    oppositeFace.mark = Mark.Deleted;
                    discardedFace = oppositeFace;
                }
                else {
                    // case:
                    //          t
                    //        *----
                    //       /| <- right face's redundant edge
                    //      / | opposite edge
                    //     /  |  ▴   /
                    //    / a |  |  /
                    //   *----*----*
                    //  /     b  |  \
                    //           ▾
                    //      redundant edge
                    oppositeEdge = next.opposite.next;
                    // make sure that the link `oppositeFace.edge` points correctly even
                    // after the right face redundant edge is removed
                    if (oppositeFace.edge === oppositeEdge.prev) {
                        oppositeFace.edge = oppositeEdge;
                    }
                    //       /|   /
                    //      / | t/opposite edge
                    //     /  | / ▴  /
                    //    / a |/  | /
                    //   *----*----*
                    //  /     b     \
                    oppositeEdge.prev = oppositeEdge.prev.prev;
                    oppositeEdge.prev.next = oppositeEdge;
                }
                //       /|
                //      / |
                //     /  |
                //    / a |
                //   *----*----*
                //  /     b  ▴  \
                //           |
                //     redundant edge
                next.prev = prev.prev;
                next.prev.next = next;
                //       / \  \
                //      /   \->\
                //     /     \<-\ opposite edge
                //    / a     \  \
                //   *----*----*
                //  /     b  ^  \
                next.setOpposite(oppositeEdge);
                oppositeFace.computeNormalAndCentroid();
            }
            else {
                // trivial case
                //        *
                //       /|\
                //      / | \
                //     /  |--> next
                //    / a |   \
                //   *----*----*
                //    \ b |   /
                //     \  |--> prev
                //      \ | /
                //       \|/
                //        *
                prev.next = next;
                next.prev = prev;
            }
            return discardedFace;
        }
        mergeAdjacentFaces(adjacentEdge, discardedFaces) {
            const oppositeEdge = adjacentEdge.opposite;
            const oppositeFace = oppositeEdge.face;
            discardedFaces.push(oppositeFace);
            oppositeFace.mark = Mark.Deleted;
            // find the chain of edges whose opposite face is `oppositeFace`
            //
            //                ===>
            //      \         face         /
            //       * ---- * ---- * ---- *
            //      /     opposite face    \
            //                <===
            //
            let adjacentEdgePrev = adjacentEdge.prev;
            let adjacentEdgeNext = adjacentEdge.next;
            let oppositeEdgePrev = oppositeEdge.prev;
            let oppositeEdgeNext = oppositeEdge.next;
            // left edge
            while (adjacentEdgePrev.opposite.face === oppositeFace) {
                adjacentEdgePrev = adjacentEdgePrev.prev;
                oppositeEdgeNext = oppositeEdgeNext.next;
            }
            // right edge
            while (adjacentEdgeNext.opposite.face === oppositeFace) {
                adjacentEdgeNext = adjacentEdgeNext.next;
                oppositeEdgePrev = oppositeEdgePrev.prev;
            }
            // adjacentEdgePrev  \         face         / adjacentEdgeNext
            //                    * ---- * ---- * ---- *
            // oppositeEdgeNext  /     opposite face    \ oppositeEdgePrev
            // fix the face reference of all the opposite edges that are not part of
            // the edges whose opposite face is not `face` i.e. all the edges that
            // `face` and `oppositeFace` do not have in common
            let edge;
            for (edge = oppositeEdgeNext; edge !== oppositeEdgePrev.next; edge = edge.next) {
                edge.face = this;
            }
            // make sure that `face.edge` is not one of the edges to be destroyed
            // Note: it's important for it to be a `next` edge since `prev` edges
            // might be destroyed on `connectHalfEdges`
            this.edge = adjacentEdgeNext;
            // connect the extremes
            // Note: it might be possible that after connecting the edges a triangular
            // face might be redundant
            let discardedFace;
            discardedFace = this.connectHalfEdges(oppositeEdgePrev, adjacentEdgeNext);
            if (discardedFace) {
                discardedFaces.push(discardedFace);
            }
            discardedFace = this.connectHalfEdges(adjacentEdgePrev, oppositeEdgeNext);
            if (discardedFace) {
                discardedFaces.push(discardedFace);
            }
            this.computeNormalAndCentroid();
            // TODO: additional consistency checks
            return discardedFaces;
        }
        collectIndices() {
            const indices = [];
            let edge = this.edge;
            do {
                indices.push(edge.head().index);
                edge = edge.next;
            } while (edge !== this.edge);
            return indices;
        }
        static fromVertices(vertices, minArea = 0) {
            const face = new Face();
            const e0 = new HalfEdge(vertices[0], face);
            let lastE = e0;
            for (let i = 1; i < vertices.length; i += 1) {
                const e = new HalfEdge(vertices[i], face);
                e.prev = lastE;
                lastE.next = e;
                lastE = e;
            }
            lastE.next = e0;
            e0.prev = lastE;
            face.edge = e0;
            face.computeNormalAndCentroid(minArea);
            if (debug$1.enabled) {
                debug$1('face created %j', face.collectIndices());
            }
            return face;
        }
        static createTriangle(v0, v1, v2, minArea = 0) {
            const face = new Face();
            const e0 = new HalfEdge(v0, face);
            const e1 = new HalfEdge(v1, face);
            const e2 = new HalfEdge(v2, face);
            // join edges
            e0.next = e2.prev = e1;
            e1.next = e0.prev = e2;
            e2.next = e1.prev = e0;
            // main half edge reference
            face.edge = e0;
            face.computeNormalAndCentroid(minArea);
            if (debug$1.enabled) {
                debug$1('face created %j', face.collectIndices());
            }
            return face;
        }
    }

    const debug = $debug('quickhull3d:quickhull');
    // merge types
    // non convex with respect to the large face
    var MergeType;
    (function (MergeType) {
        MergeType[MergeType["NonConvexWrtLargerFace"] = 0] = "NonConvexWrtLargerFace";
        MergeType[MergeType["NonConvex"] = 1] = "NonConvex";
    })(MergeType || (MergeType = {}));
    class QuickHull {
        // tolerance is the computed tolerance used for the merge.
        tolerance;
        // faces are the faces of the hull.
        faces;
        // newFaces are the new faces in an iteration of the quickhull algorithm.
        newFaces;
        // claimed are the vertices that have been claimed.
        claimed;
        // unclaimed are the vertices that haven't been claimed.
        unclaimed;
        // vertices are the points of the hull.
        vertices;
        discardedFaces;
        vertexPointIndices;
        constructor(points) {
            if (!Array.isArray(points)) {
                throw TypeError('input is not a valid array');
            }
            if (points.length < 4) {
                throw Error('cannot build a simplex out of <4 points');
            }
            this.tolerance = -1;
            this.faces = [];
            this.newFaces = [];
            // helpers
            //
            // let `a`, `b` be `Face` instances
            // let `v` be points wrapped as instance of `Vertex`
            //
            //     [v, v, ..., v, v, v, ...]
            //      ^             ^
            //      |             |
            //  a.outside     b.outside
            //
            this.claimed = new VertexList();
            this.unclaimed = new VertexList();
            // vertices of the hull(internal representation of points)
            this.vertices = [];
            for (let i = 0; i < points.length; i += 1) {
                this.vertices.push(new Vertex(points[i], i));
            }
            this.discardedFaces = [];
            this.vertexPointIndices = [];
        }
        addVertexToFace(vertex, face) {
            vertex.face = face;
            if (!face.outside) {
                this.claimed.add(vertex);
            }
            else {
                this.claimed.insertBefore(face.outside, vertex);
            }
            face.outside = vertex;
        }
        /**
         * Removes `vertex` for the `claimed` list of vertices, it also makes sure
         * that the link from `face` to the first vertex it sees in `claimed` is
         * linked correctly after the removal
         *
         * @param {Vertex} vertex
         * @param {Face} face
         */
        removeVertexFromFace(vertex, face) {
            if (vertex === face.outside) {
                // fix face.outside link
                if (vertex.next && vertex.next.face === face) {
                    // face has at least 2 outside vertices, move the `outside` reference
                    face.outside = vertex.next;
                }
                else {
                    // vertex was the only outside vertex that face had
                    face.outside = null;
                }
            }
            this.claimed.remove(vertex);
        }
        /**
         * Removes all the visible vertices that `face` is able to see which are
         * stored in the `claimed` vertext list
         *
         * @param {Face} face
         */
        removeAllVerticesFromFace(face) {
            if (face.outside) {
                // pointer to the last vertex of this face
                // [..., outside, ..., end, outside, ...]
                //          |           |      |
                //          a           a      b
                let end = face.outside;
                while (end.next && end.next.face === face) {
                    end = end.next;
                }
                this.claimed.removeChain(face.outside, end);
                //                            b
                //                       [ outside, ...]
                //                            |  removes this link
                //     [ outside, ..., end ] -┘
                //          |           |
                //          a           a
                end.next = null;
                return face.outside;
            }
        }
        /**
         * Removes all the visible vertices that `face` is able to see, additionally
         * checking the following:
         *
         * If `absorbingFace` doesn't exist then all the removed vertices will be
         * added to the `unclaimed` vertex list
         *
         * If `absorbingFace` exists then this method will assign all the vertices of
         * `face` that can see `absorbingFace`, if a vertex cannot see `absorbingFace`
         * it's added to the `unclaimed` vertex list
         *
         * @param {Face} face
         * @param {Face} [absorbingFace]
         */
        deleteFaceVertices(face, absorbingFace) {
            const faceVertices = this.removeAllVerticesFromFace(face);
            if (faceVertices) {
                if (!absorbingFace) {
                    // mark the vertices to be reassigned to some other face
                    this.unclaimed.addAll(faceVertices);
                }
                else {
                    // if there's an absorbing face try to assign as many vertices
                    // as possible to it
                    // the reference `vertex.next` might be destroyed on
                    // `this.addVertexToFace` (see VertexList#add), nextVertex is a
                    // reference to it
                    let nextVertex;
                    for (let vertex = faceVertices; vertex; vertex = nextVertex) {
                        nextVertex = vertex.next;
                        const distance = absorbingFace.distanceToPlane(vertex.point);
                        // check if `vertex` is able to see `absorbingFace`
                        if (distance > this.tolerance) {
                            this.addVertexToFace(vertex, absorbingFace);
                        }
                        else {
                            this.unclaimed.add(vertex);
                        }
                    }
                }
            }
        }
        /**
         * Reassigns as many vertices as possible from the unclaimed list to the new
         * faces
         *
         * @param {Faces[]} newFaces
         */
        resolveUnclaimedPoints(newFaces) {
            // cache next vertex so that if `vertex.next` is destroyed it's still
            // recoverable
            let vertexNext = this.unclaimed.first();
            for (let vertex = vertexNext; vertex; vertex = vertexNext) {
                vertexNext = vertex.next;
                let maxDistance = this.tolerance;
                let maxFace;
                for (let i = 0; i < newFaces.length; i += 1) {
                    const face = newFaces[i];
                    if (face.mark === Mark.Visible) {
                        const dist = face.distanceToPlane(vertex.point);
                        if (dist > maxDistance) {
                            maxDistance = dist;
                            maxFace = face;
                        }
                        if (maxDistance > 1000 * this.tolerance) {
                            break;
                        }
                    }
                }
                if (maxFace) {
                    this.addVertexToFace(vertex, maxFace);
                }
            }
        }
        /**
         * Checks if all the points belong to a plane (2d degenerate case)
         */
        allPointsBelongToPlane(v0, v1, v2) {
            const normal = getPlaneNormal([0, 0, 0], v0.point, v1.point, v2.point);
            const distToPlane = dot(normal, v0.point);
            for (const vertex of this.vertices) {
                const dist = dot(vertex.point, normal);
                if (Math.abs(dist - distToPlane) > this.tolerance) {
                    // A vertex is not part of the plane formed by ((v0 - v1) X (v0 - v2))
                    return false;
                }
            }
            return true;
        }
        /**
         * Computes the convex hull of a plane.
         */
        convexHull2d(v0, v1, v2) {
            const planeNormal = getPlaneNormal([0, 0, 0], v0.point, v1.point, v2.point);
            // To do the rotation let's use a quaternion
            // first let's find a target plane to rotate to e.g. the x-z plane with a normal equal to the y-axis
            let basisPlaneNormal = [0, 1, 0];
            // Create a quaternion that represents the rotation between normal and the basisPlaneNormal.
            const rotation = rotationTo([], planeNormal, basisPlaneNormal);
            // Create a vec3 that represents a translation from the plane to the origin.
            const translation = scale([], planeNormal, -dot(v0.point, planeNormal));
            // Create a rotation -> translation matrix from a quaternion and a vec3
            const matrix = fromRotationTranslation([], rotation, translation);
            const transformedVertices = [];
            for (const vertex of this.vertices) {
                const a = fromValues(vertex.point[0], vertex.point[1], vertex.point[2], 0);
                const aP = transformMat4([], a, matrix);
                // Make sure that the y value is close to 0
                if (debug.enabled) {
                    if (aP[1] > this.tolerance) {
                        debug(`ERROR: point ${aP} has an unexpected y value, it should be less than ${this.tolerance}`);
                    }
                }
                transformedVertices.push([aP[0], aP[2]]);
            }
            // 2d convex hull.
            const hull = monotoneHull(transformedVertices);
            // There's a single face with the indexes of the hull.
            const vertices = [];
            for (const i of hull) {
                vertices.push(this.vertices[i]);
            }
            const face = Face.fromVertices(vertices);
            this.faces = [face];
        }
        /**
         * Computes the extremes of a tetrahedron which will be the initial hull
         */
        computeTetrahedronExtremes() {
            const me = this;
            const min = [];
            const max = [];
            // min vertex on the x,y,z directions
            const minVertices = [];
            // max vertex on the x,y,z directions
            const maxVertices = [];
            // initially assume that the first vertex is the min/max
            for (let i = 0; i < 3; i += 1) {
                minVertices[i] = maxVertices[i] = this.vertices[0];
            }
            // copy the coordinates of the first vertex to min/max
            for (let i = 0; i < 3; i += 1) {
                min[i] = max[i] = this.vertices[0].point[i];
            }
            // compute the min/max vertex on all 6 directions
            for (let i = 1; i < this.vertices.length; i += 1) {
                const vertex = this.vertices[i];
                const point = vertex.point;
                // update the min coordinates
                for (let j = 0; j < 3; j += 1) {
                    if (point[j] < min[j]) {
                        min[j] = point[j];
                        minVertices[j] = vertex;
                    }
                }
                // update the max coordinates
                for (let j = 0; j < 3; j += 1) {
                    if (point[j] > max[j]) {
                        max[j] = point[j];
                        maxVertices[j] = vertex;
                    }
                }
            }
            // compute epsilon
            this.tolerance =
                3 *
                    Number.EPSILON *
                    (Math.max(Math.abs(min[0]), Math.abs(max[0])) +
                        Math.max(Math.abs(min[1]), Math.abs(max[1])) +
                        Math.max(Math.abs(min[2]), Math.abs(max[2])));
            if (debug.enabled) {
                debug('tolerance %d', me.tolerance);
            }
            // Find the two vertices with the greatest 1d separation
            // (max.x - min.x)
            // (max.y - min.y)
            // (max.z - min.z)
            let maxDistance = 0;
            let indexMax = 0;
            for (let i = 0; i < 3; i += 1) {
                const distance = maxVertices[i].point[i] - minVertices[i].point[i];
                if (distance > maxDistance) {
                    maxDistance = distance;
                    indexMax = i;
                }
            }
            const v0 = minVertices[indexMax];
            const v1 = maxVertices[indexMax];
            let v2, v3;
            // the next vertex is the one farthest to the line formed by `v0` and `v1`
            maxDistance = 0;
            for (let i = 0; i < this.vertices.length; i += 1) {
                const vertex = this.vertices[i];
                if (vertex !== v0 && vertex !== v1) {
                    const distance = pointLineDistance(vertex.point, v0.point, v1.point);
                    if (distance > maxDistance) {
                        maxDistance = distance;
                        v2 = vertex;
                    }
                }
            }
            // the next vertes is the one farthest to the plane `v0`, `v1`, `v2`
            // normalize((v2 - v1) x (v0 - v1))
            const normal = getPlaneNormal([0, 0, 0], v0.point, v1.point, v2.point);
            // distance from the origin to the plane
            const distPO = dot(v0.point, normal);
            maxDistance = -1;
            for (let i = 0; i < this.vertices.length; i += 1) {
                const vertex = this.vertices[i];
                if (vertex !== v0 && vertex !== v1 && vertex !== v2) {
                    const distance = Math.abs(dot(normal, vertex.point) - distPO);
                    if (distance > maxDistance) {
                        maxDistance = distance;
                        v3 = vertex;
                    }
                }
            }
            return [v0, v1, v2, v3];
        }
        /**
         * Compues the initial tetrahedron assigning to its faces all the points that
         * are candidates to form part of the hull
         */
        createInitialSimplex(v0, v1, v2, v3) {
            const normal = getPlaneNormal([0, 0, 0], v0.point, v1.point, v2.point);
            const distPO = dot(v0.point, normal);
            // initial simplex
            // Taken from http://everything2.com/title/How+to+paint+a+tetrahedron
            //
            //                              v2
            //                             ,|,
            //                           ,7``\'VA,
            //                         ,7`   |, `'VA,
            //                       ,7`     `\    `'VA,
            //                     ,7`        |,      `'VA,
            //                   ,7`          `\         `'VA,
            //                 ,7`             |,           `'VA,
            //               ,7`               `\       ,..ooOOTK` v3
            //             ,7`                  |,.ooOOT''`    AV
            //           ,7`            ,..ooOOT`\`           /7
            //         ,7`      ,..ooOOT''`      |,          AV
            //        ,T,..ooOOT''`              `\         /7
            //     v0 `'TTs.,                     |,       AV
            //            `'TTs.,                 `\      /7
            //                 `'TTs.,             |,    AV
            //                      `'TTs.,        `\   /7
            //                           `'TTs.,    |, AV
            //                                `'TTs.,\/7
            //                                     `'T`
            //                                       v1
            //
            const faces = [];
            if (dot(v3.point, normal) - distPO < 0) {
                // the face is not able to see the point so `planeNormal`
                // is pointing outside the tetrahedron
                faces.push(Face.createTriangle(v0, v1, v2), Face.createTriangle(v3, v1, v0), Face.createTriangle(v3, v2, v1), Face.createTriangle(v3, v0, v2));
                // set the opposite edge
                for (let i = 0; i < 3; i += 1) {
                    const j = (i + 1) % 3;
                    // join face[i] i > 0, with the first face
                    faces[i + 1].getEdge(2).setOpposite(faces[0].getEdge(j));
                    // join face[i] with face[i + 1], 1 <= i <= 3
                    faces[i + 1].getEdge(1).setOpposite(faces[j + 1].getEdge(0));
                }
            }
            else {
                // the face is able to see the point so `planeNormal`
                // is pointing inside the tetrahedron
                faces.push(Face.createTriangle(v0, v2, v1), Face.createTriangle(v3, v0, v1), Face.createTriangle(v3, v1, v2), Face.createTriangle(v3, v2, v0));
                // set the opposite edge
                for (let i = 0; i < 3; i += 1) {
                    const j = (i + 1) % 3;
                    // join face[i] i > 0, with the first face
                    faces[i + 1].getEdge(2).setOpposite(faces[0].getEdge((3 - i) % 3));
                    // join face[i] with face[i + 1]
                    faces[i + 1].getEdge(0).setOpposite(faces[j + 1].getEdge(1));
                }
            }
            // the initial hull is the tetrahedron
            for (let i = 0; i < 4; i += 1) {
                this.faces.push(faces[i]);
            }
            // initial assignment of vertices to the faces of the tetrahedron
            const vertices = this.vertices;
            for (let i = 0; i < vertices.length; i += 1) {
                const vertex = vertices[i];
                if (vertex !== v0 && vertex !== v1 && vertex !== v2 && vertex !== v3) {
                    let maxDistance = this.tolerance;
                    let maxFace;
                    for (let j = 0; j < 4; j += 1) {
                        const distance = faces[j].distanceToPlane(vertex.point);
                        if (distance > maxDistance) {
                            maxDistance = distance;
                            maxFace = faces[j];
                        }
                    }
                    if (maxFace) {
                        this.addVertexToFace(vertex, maxFace);
                    }
                }
            }
        }
        reindexFaceAndVertices() {
            // remove inactive faces
            const activeFaces = [];
            for (let i = 0; i < this.faces.length; i += 1) {
                const face = this.faces[i];
                if (face.mark === Mark.Visible) {
                    activeFaces.push(face);
                }
            }
            this.faces = activeFaces;
        }
        collectFaces(skipTriangulation) {
            const faceIndices = [];
            for (let i = 0; i < this.faces.length; i += 1) {
                if (this.faces[i].mark !== Mark.Visible) {
                    throw Error('attempt to include a destroyed face in the hull');
                }
                const indices = this.faces[i].collectIndices();
                if (skipTriangulation) {
                    faceIndices.push(indices);
                }
                else {
                    for (let j = 0; j < indices.length - 2; j += 1) {
                        faceIndices.push([indices[0], indices[j + 1], indices[j + 2]]);
                    }
                }
            }
            return faceIndices;
        }
        /**
         * Finds the next vertex to make faces with the current hull
         *
         * - let `face` be the first face existing in the `claimed` vertex list
         *  - if `face` doesn't exist then return since there're no vertices left
         *  - otherwise for each `vertex` that face sees find the one furthest away
         *  from `face`
         */
        nextVertexToAdd() {
            if (!this.claimed.isEmpty()) {
                let eyeVertex, vertex;
                let maxDistance = 0;
                const eyeFace = this.claimed.first().face;
                for (vertex = eyeFace.outside; vertex && vertex.face === eyeFace; vertex = vertex.next) {
                    const distance = eyeFace.distanceToPlane(vertex.point);
                    if (distance > maxDistance) {
                        maxDistance = distance;
                        eyeVertex = vertex;
                    }
                }
                return eyeVertex;
            }
        }
        /**
         * Computes a chain of half edges in ccw order called the `horizon`, for an
         * edge to be part of the horizon it must join a face that can see
         * `eyePoint` and a face that cannot see `eyePoint`
         *
         * @param {number[]} eyePoint - The coordinates of a point
         * @param {HalfEdge} crossEdge - The edge used to jump to the current `face`
         * @param {Face} face - The current face being tested
         * @param {HalfEdge[]} horizon - The edges that form part of the horizon in
         * ccw order
         */
        computeHorizon(eyePoint, crossEdge, face, horizon) {
            // moves face's vertices to the `unclaimed` vertex list
            this.deleteFaceVertices(face);
            face.mark = Mark.Deleted;
            let edge;
            if (!crossEdge) {
                edge = crossEdge = face.getEdge(0);
            }
            else {
                // start from the next edge since `crossEdge` was already analyzed
                // (actually `crossEdge.opposite` was the face who called this method
                // recursively)
                edge = crossEdge.next;
            }
            // All the faces that are able to see `eyeVertex` are defined as follows
            //
            //       v    /
            //           / <== visible face
            //          /
            //         |
            //         | <== not visible face
            //
            //  dot(v, visible face normal) - visible face offset > this.tolerance
            //
            do {
                const oppositeEdge = edge.opposite;
                const oppositeFace = oppositeEdge.face;
                if (oppositeFace.mark === Mark.Visible) {
                    if (oppositeFace.distanceToPlane(eyePoint) > this.tolerance) {
                        this.computeHorizon(eyePoint, oppositeEdge, oppositeFace, horizon);
                    }
                    else {
                        horizon.push(edge);
                    }
                }
                edge = edge.next;
            } while (edge !== crossEdge);
        }
        /**
         * Creates a face with the points `eyeVertex.point`, `horizonEdge.tail` and
         * `horizonEdge.tail` in ccw order
         *
         * @param {Vertex} eyeVertex
         * @param {HalfEdge} horizonEdge
         * @return {HalfEdge} The half edge whose vertex is the eyeVertex
         */
        addAdjoiningFace(eyeVertex, horizonEdge) {
            // all the half edges are created in ccw order thus the face is always
            // pointing outside the hull
            // edges:
            //
            //                  eyeVertex.point
            //                       / \
            //                      /   \
            //                  1  /     \  0
            //                    /       \
            //                   /         \
            //                  /           \
            //          horizon.tail --- horizon.head
            //                        2
            //
            const face = Face.createTriangle(eyeVertex, horizonEdge.tail(), horizonEdge.head());
            this.faces.push(face);
            // join face.getEdge(-1) with the horizon's opposite edge
            // face.getEdge(-1) = face.getEdge(2)
            face.getEdge(-1).setOpposite(horizonEdge.opposite);
            return face.getEdge(0);
        }
        /**
         * Adds horizon.length faces to the hull, each face will be 'linked' with the
         * horizon opposite face and the face on the left/right
         *
         * @param {Vertex} eyeVertex
         * @param {HalfEdge[]} horizon - A chain of half edges in ccw order
         */
        addNewFaces(eyeVertex, horizon) {
            this.newFaces = [];
            let firstSideEdge, previousSideEdge;
            for (let i = 0; i < horizon.length; i += 1) {
                const horizonEdge = horizon[i];
                // returns the right side edge
                const sideEdge = this.addAdjoiningFace(eyeVertex, horizonEdge);
                if (!firstSideEdge) {
                    firstSideEdge = sideEdge;
                }
                else {
                    // joins face.getEdge(1) with previousFace.getEdge(0)
                    sideEdge.next.setOpposite(previousSideEdge);
                }
                this.newFaces.push(sideEdge.face);
                previousSideEdge = sideEdge;
            }
            firstSideEdge.next.setOpposite(previousSideEdge);
        }
        /**
         * Computes the distance from `edge` opposite face's centroid to
         * `edge.face`
         *
         * @param {HalfEdge} edge
         */
        oppositeFaceDistance(edge) {
            // - A positive number when the centroid of the opposite face is above the
            //   face i.e. when the faces are concave
            // - A negative number when the centroid of the opposite face is below the
            //   face i.e. when the faces are convex
            return edge.face.distanceToPlane(edge.opposite.face.centroid);
        }
        /**
         * Merges a face with none/any/all its neighbors according to the strategy
         * used
         *
         * if `mergeType` is MERGE_NON_CONVEX_WRT_LARGER_FACE then the merge will be
         * decided based on the face with the larger area, the centroid of the face
         * with the smaller area will be checked against the one with the larger area
         * to see if it's in the merge range [tolerance, -tolerance] i.e.
         *
         *    dot(centroid smaller face, larger face normal) - larger face offset > -tolerance
         *
         * Note that the first check (with +tolerance) was done on `computeHorizon`
         *
         * If the above is not true then the check is done with respect to the smaller
         * face i.e.
         *
         *    dot(centroid larger face, smaller face normal) - smaller face offset > -tolerance
         *
         * If true then it means that two faces are non convex (concave), even if the
         * dot(...) - offset value is > 0 (that's the point of doing the merge in the
         * first place)
         *
         * If two faces are concave then the check must also be done on the other face
         * but this is done in another merge pass, for this to happen the face is
         * marked in a temporal NON_CONVEX state
         *
         * if `mergeType` is MERGE_NON_CONVEX then two faces will be merged only if
         * they pass the following conditions
         *
         *    dot(centroid smaller face, larger face normal) - larger face offset > -tolerance
         *    dot(centroid larger face, smaller face normal) - smaller face offset > -tolerance
         *
         * @param {Face} face
         * @param {MergeType} mergeType
         */
        doAdjacentMerge(face, mergeType) {
            let edge = face.edge;
            let convex = true;
            let it = 0;
            do {
                if (it >= face.nVertices) {
                    throw Error('merge recursion limit exceeded');
                }
                const oppositeFace = edge.opposite.face;
                let merge = false;
                // Important notes about the algorithm to merge faces
                //
                // - Given a vertex `eyeVertex` that will be added to the hull
                //   all the faces that cannot see `eyeVertex` are defined as follows
                //
                //      dot(v, not visible face normal) - not visible offset < tolerance
                //
                // - Two faces can be merged when the centroid of one of these faces
                // projected to the normal of the other face minus the other face offset
                // is in the range [tolerance, -tolerance]
                // - Since `face` (given in the input for this method) has passed the
                // check above we only have to check the lower bound e.g.
                //
                //      dot(v, not visible face normal) - not visible offset > -tolerance
                //
                if (mergeType === MergeType.NonConvex) {
                    if (this.oppositeFaceDistance(edge) > -this.tolerance ||
                        this.oppositeFaceDistance(edge.opposite) > -this.tolerance) {
                        merge = true;
                    }
                }
                else {
                    if (face.area > oppositeFace.area) {
                        if (this.oppositeFaceDistance(edge) > -this.tolerance) {
                            merge = true;
                        }
                        else if (this.oppositeFaceDistance(edge.opposite) > -this.tolerance) {
                            convex = false;
                        }
                    }
                    else {
                        if (this.oppositeFaceDistance(edge.opposite) > -this.tolerance) {
                            merge = true;
                        }
                        else if (this.oppositeFaceDistance(edge) > -this.tolerance) {
                            convex = false;
                        }
                    }
                }
                if (merge) {
                    debug('face merge');
                    // when two faces are merged it might be possible that redundant faces
                    // are destroyed, in that case move all the visible vertices from the
                    // destroyed faces to the `unclaimed` vertex list
                    const discardedFaces = face.mergeAdjacentFaces(edge, []);
                    for (let i = 0; i < discardedFaces.length; i += 1) {
                        this.deleteFaceVertices(discardedFaces[i], face);
                    }
                    return true;
                }
                edge = edge.next;
                it += 1;
            } while (edge !== face.edge);
            if (!convex) {
                face.mark = Mark.NonConvex;
            }
            return false;
        }
        /**
         * Adds a vertex to the hull with the following algorithm
         *
         * - Compute the `horizon` which is a chain of half edges, for an edge to
         *   belong to this group it must be the edge connecting a face that can
         *   see `eyeVertex` and a face which cannot see `eyeVertex`
         * - All the faces that can see `eyeVertex` have its visible vertices removed
         *   from the claimed VertexList
         * - A new set of faces is created with each edge of the `horizon` and
         *   `eyeVertex`, each face is connected with the opposite horizon face and
         *   the face on the left/right
         * - The new faces are merged if possible with the opposite horizon face first
         *   and then the faces on the right/left
         * - The vertices removed from all the visible faces are assigned to the new
         *   faces if possible
         *
         * @param {Vertex} eyeVertex
         */
        addVertexToHull(eyeVertex) {
            const horizon = [];
            this.unclaimed.clear();
            // remove `eyeVertex` from `eyeVertex.face` so that it can't be added to the
            // `unclaimed` vertex list
            this.removeVertexFromFace(eyeVertex, eyeVertex.face);
            this.computeHorizon(eyeVertex.point, null, eyeVertex.face, horizon);
            if (debug.enabled) {
                debug('horizon %j', horizon.map(function (edge) {
                    return edge.head().index;
                }));
            }
            this.addNewFaces(eyeVertex, horizon);
            debug('first merge');
            // first merge pass
            // Do the merge with respect to the larger face
            for (let i = 0; i < this.newFaces.length; i += 1) {
                const face = this.newFaces[i];
                if (face.mark === Mark.Visible) {
                    // eslint-disable-next-line
                    while (this.doAdjacentMerge(face, MergeType.NonConvexWrtLargerFace)) { }
                }
            }
            debug('second merge');
            // second merge pass
            // Do the merge on non convex faces (a face is marked as non convex in the
            // first pass)
            for (let i = 0; i < this.newFaces.length; i += 1) {
                const face = this.newFaces[i];
                if (face.mark === Mark.NonConvex) {
                    face.mark = Mark.Visible;
                    // eslint-disable-next-line
                    while (this.doAdjacentMerge(face, MergeType.NonConvexWrtLargerFace)) { }
                }
            }
            debug('reassigning points to newFaces');
            // reassign `unclaimed` vertices to the new faces
            this.resolveUnclaimedPoints(this.newFaces);
        }
        build() {
            let iterations = 0;
            let eyeVertex;
            const [v0, v1, v2, v3] = this.computeTetrahedronExtremes();
            if (this.allPointsBelongToPlane(v0, v1, v2)) {
                this.convexHull2d(v0, v1, v2);
                return this;
            }
            this.createInitialSimplex(v0, v1, v2, v3);
            while ((eyeVertex = this.nextVertexToAdd())) {
                iterations += 1;
                debug(`== iteration ${iterations} ==`);
                debug('next vertex to add = %d %j', eyeVertex.index, eyeVertex.point);
                this.addVertexToHull(eyeVertex);
                debug(`== end iteration ${iterations}`);
            }
            this.reindexFaceAndVertices();
            return this;
        }
    }

    function runner(points, options = {}) {
        const instance = new QuickHull(points);
        instance.build();
        return instance.collectFaces(options.skipTriangulation);
    }

    // import * as quickhull3d from "quickhull3d";
    function clamp(n, min, max) {
        return Math.min(Math.max(n, min), max);
    }
    function dotSquare(v) {
        return v.dot(v);
    }
    // export function min3(a: number, b: number, c: number) {
    //     return Math.min(a, Math.min(b, c));
    // }

    const vec3 = () => new Vec3([0, 0, 0]);
    function concaveman(inputPoints, concavity, lengthThreshold) {
        // a relative measure of concavity; higher value means simpler hull
        concavity = Math.max(0, concavity == undefined ? 2 : concavity);
        const sqConcavity = concavity ** 2;
        // when a segment goes below this length threshold, it won't be drilled down further
        lengthThreshold = lengthThreshold || 0;
        const sqLenThreshold = lengthThreshold ** 2;
        const points = inputPoints.map(point => new Vec3(point));
        // start with a convex hull of the points
        const faces = runner(points);
        const hullVertices = new Set();
        const pointAdjacentFaces = points.map(() => new Set());
        faces.forEach((face) => {
            face.forEach((point) => {
                hullVertices.add(point);
                pointAdjacentFaces[point].add(face);
            });
        });
        const internalPoints = (new Set(points.keys())).difference(hullVertices);
        const concaveHull = [];
        while (faces.length > 0) {
            const face = faces.shift();
            const point = findPoint(face, points, internalPoints, pointAdjacentFaces);
            if (point != null && decision(face, point, sqConcavity, sqLenThreshold, points)) {
                const newFaces = dig(face, point, hullVertices, internalPoints, pointAdjacentFaces);
                faces.concat(newFaces);
            }
            else {
                concaveHull.push([inputPoints[face[0]], inputPoints[face[1]], inputPoints[face[2]]]);
            }
        }
        return concaveHull;
    }
    function dig(face, point, hullVertices, internalPoints, pointAdjacentFaces) {
        face.forEach((point) => {
            pointAdjacentFaces[point].delete(face);
        });
        const newFaces = [
            [face[0], face[1], point],
            [face[1], face[2], point],
            [face[2], face[0], point],
        ];
        newFaces.forEach((face) => {
            face.forEach((point) => {
                pointAdjacentFaces[point].add(face);
            });
        });
        internalPoints.delete(point);
        hullVertices.add(point);
        return newFaces;
    }
    function decision(face, point, sqConcavity, sqLenThreshold, points) {
        const v1 = points[face[0]];
        const v2 = points[face[1]];
        const v3 = points[face[2]];
        const p = points[point];
        const sqL12 = v2.sqrDist(v1);
        const sqL23 = v3.sqrDist(v2);
        const sqL31 = v1.sqrDist(v3);
        const sqD1 = p.sqrDist(v1);
        const sqD2 = p.sqrDist(v2);
        const sqD3 = p.sqrDist(v3);
        const sqAvg = (sqL12 + sqL23 + sqL31) / 3;
        const sqDd = Math.min(sqD1, sqD2, sqD3);
        return (sqDd <= sqAvg / sqConcavity) && (sqAvg >= sqLenThreshold);
    }
    function findPoint(face, points, internalPoints, pointAdjacentFaces) {
        const v1 = points[face[0]];
        const v2 = points[face[1]];
        const v3 = points[face[2]];
        let closestPoint = null;
        let sqMinDist = 0;
        const adjacent = Array.from(pointAdjacentFaces[face[0]]
            .union(pointAdjacentFaces[face[1]])
            .union(pointAdjacentFaces[face[2]])
            .difference(new Set(face))
            .values()
            .map(face => [points[face[0]], points[face[1]], points[face[2]]]));
        internalPoints.forEach((candidate) => {
            const p = points[candidate];
            const sqDist = dTriangle(v1, v2, v3, p);
            if ((closestPoint == null || sqDist < sqMinDist) && adjacent.every(face => dTriangle(face[0], face[1], face[2], p) >= sqDist)) {
                closestPoint = candidate;
                sqMinDist = sqDist;
            }
        });
        return closestPoint;
    }
    function dTriangle(v1, v2, v3, p) {
        // prepare data
        const v12 = v2.sub(v1);
        const p1 = p.sub(v1);
        const v23 = v3.sub(v2);
        const p2 = p.sub(v2);
        const v31 = v1.sub(v3);
        const p3 = p.sub(v3);
        const nor = Vec3.cross(vec3(), v12, v31);
        if (Math.sign(Vec3.dot(Vec3.cross(vec3(), v12, nor), p1))
            + Math.sign(Vec3.dot(Vec3.cross(vec3(), v23, nor), p2))
            + Math.sign(Vec3.dot(Vec3.cross(vec3(), v31, nor), p3)) < 2) {
            // 3 edges
            return Math.min(dotSquare(v12.scale(clamp(v12.dot(p1) / dotSquare(v12), 0, 1)).sub(p1)), dotSquare(v23.scale(clamp(v23.dot(p2) / dotSquare(v23), 0, 1)).sub(p2)), dotSquare(v31.scale(clamp(v31.dot(p3) / dotSquare(v31), 0, 1)).sub(p3)));
        }
        else {
            // 1 face
            return nor.dot(p1) * nor.dot(p1) / dotSquare(nor);
        }
    }

    return concaveman;

})();
