## mixtures data

library(jsonlite)
library(sf)

points <- fromJSON("./inst/extdata/points-1k.json")

means <- kmeans(points, centers = 10)

points <- tibble::tibble(x = points[, 1], y = points[, 2], k = means$cluster)

points <- st_as_sf(points, coords = c("x", "y"), crs = "+proj=longlat +datum=WGS84 +ellps=WGS84 +towgs84=0,0,0")

save(points, file = "./data/points.rda")


points3d <- fromJSON("./inst/extdata/points3d.json")

means <- kmeans(points3d, centers = 10)

points3d <- tibble::tibble(x = points3d[, 1], y = points3d[, 2], z = points3d[, 3], k = means$cluster)

points3d <- st_as_sf(points3d, coords = c("x", "y", "z"), crs = "+proj=longlat +datum=WGS84 +ellps=WGS84 +towgs84=0,0,0")

save(points3d, file = "./data/points3d.rda")
