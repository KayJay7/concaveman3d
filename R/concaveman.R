#' A 3D concave hull algorithm
#'
#' 3D implementation of the Park-Oh algorithm (https://jise.iis.sinica.edu.tw/JISESearch/fullText?pId=245&code=5A9B97538372AA1)
#'
#' @param points the points for which the concave hull must be computed. Can be represented as a matrix of coordinates or an `sf` object.
#' @param concavity a relative measure of concavity. 1 results in a relatively detailed shape, Infinity results in a convex hull. You can use values lower than 1, but they can produce pretty crazy shapes.
#' @param length_threshold when a segment length is under this threshold, it stops being considered for further detalization. Higher values result in simpler shapes.
#'
#' @return an object of the same class as `points`: a matrix of coordinates or a data.frame.
#' @examples
#' data(points)
#' polygons <- concaveman(points)
#'
#' @export
concaveman3d <- function(points, concavity, length_threshold) UseMethod("concaveman3d", points)

ctx <- V8::v8()
ctx$source(system.file("js", "static", "concaveman3d-bundle.js", package = "concaveman3d"))

interop <- function(points, concavity, length_threshold) {
    ctx$call("concaveman3d.concaveman3dInterop", as.matrix(points), concavity, length_threshold)
}

#' @export
#' @rdname concaveman3d
concaveman3d.matrix <- function(points, concavity = 2, length_threshold = 0) {
    interop(points, concavity, length_threshold)
}

#' @export
#' @rdname concaveman3d
concaveman3d.data.frame <- function(points, concavity = 2, length_threshold = 0) {
    result <- interop(points, concavity, length_threshold)
    data.frame(
        x1 = result[, 1, 1], y1 = result[, 1, 2], z1 = result[, 1, 3],
        x2 = result[, 2, 1], y2 = result[, 2, 2], z2 = result[, 2, 3],
        x3 = result[, 3, 1], y3 = result[, 3, 2], z3 = result[, 3, 3]
    )
}
