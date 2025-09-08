#' concaveman: A very fast 3D concave hull algorithm.
#'
#' This package is a simple R port (through [`V8`](https://github.com/KayJay7/concaveman3d) of a [JavaScript library by Vladimir Agafonkin](https://github.com/mapbox/concaveman).
#'
#'
#' @docType package
#' @name concaveman3d
NULL

## quiets concerns of R CMD check re: the .'s that appear in pipelines
if(getRversion() >= "2.15.1")  utils::globalVariables(c(".", "polygons"))

