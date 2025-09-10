library(concaveman)
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
data(points)
points3d <- data.frame(k = rep(1, 100), x = rnorm(100, 5, 6), y = rnorm(100, 5, 6), z = rnorm(100, 5, 6))
# points3d <- st_as_sf(points3d, coords = c("x", "y", "z"))
print("matrix:")
print(data.matrix(points3d[2:3]))
print("hull:")
hull <- concaveman(data.matrix(points3d[2:3]))
print(hull)
print("hull as df:")
hull <- data.frame(x = hull[, 1], y = hull[, 2])
print(hull)
polygons <- c(concaveman(data.matrix(points3d[2:3]))) %>% reduce(rbind)
print("test")
# polygons <- map(
#     unique(points3d[1:3]$k),
#     ~ concaveman(data.matrix(points3d[1:3][points$k %in% ., ]))
# ) %>%
#     map2(unique(points3d[1:3]$k), ~ mutate(.x, k = .y)) %>%
#     reduce(rbind)


# polygons <- map(
#     unique(points$k),
#     ~ concaveman(points[points$k %in% ., ])
# ) %>%
#     map2(unique(points$k), ~ mutate(.x, k = .y)) %>%
#     reduce(rbind)
s=tm_shape(st_as_sf(points3d[1:3], coords = c("x", "y"), crs = 4326)) +
    tm_dots(col = "red", size = 0.1) +
    tm_shape(st_as_sf(hull, coords = c("x", "y"), crs = 4326)) +
    tm_fill(col = "red", fill_alpha = 0.5) +
    tm_borders() + tm_legend_hide() +
    tm_layout(frame = FALSE)


hull$ID = rep(1, length(hull$x))
head(hull)

xys = st_as_sf(hull, coords=c("x","y"))

polys = xys %>% 
  dplyr::group_by(ID) %>% 
  dplyr::summarise() %>%
  st_cast("POLYGON")

plot(polys)

points(hull$y ~ hull$x)
# print("fff")
# plot(s)