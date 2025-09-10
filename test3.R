devtools::load_all("concaveman3d")
library(concaveman3d)
library(dplyr)
#>
#> Attaching package: 'dplyr'
#> The following objects are masked from 'package:stats':
#>
#>     filter, lag
#> The following objects are masked from 'package:base':
#>
#>     intersect, setdiff, setequal, union
library(purrr)
library(sf)
#> Linking to GEOS 3.8.0, GDAL 3.0.4, PROJ 6.3.1
library(tmap)
n <- 100000
# data(points3d)
points3d <- data.frame(k = rep(1, n), x = rnorm(n, 5, 6), y = rnorm(n, 5, 6), z = rnorm(n, 5, 6))
# points3d <- st_as_sf(points3d, coords = c("x", "y", "z"))
print(points3d)
hull <- concaveman3d(points3d[2:4],0)
# hull <- data.frame(x = hull[, 1], y = hull[, 2], z = hull[, 3])
print(hull)

plot(hull)
