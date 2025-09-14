library(concaveman)
library(dplyr)
library(purrr)
library(sf)
library(tmap)
data(points)

# pdf("thesis/polygons.pdf")

polygons <- concaveman(points)
polygons
#> Simple feature collection with 1 feature and 0 fields
#> geometry type:  POLYGON
#> dimension:      XY
#> bbox:           xmin: -122.0844 ymin: 37.3696 xmax: -122.0587 ymax: 37.3942
#> CRS:            +proj=longlat +datum=WGS84 +ellps=WGS84 +towgs84=0,0,0
#> # A tibble: 1 x 1
#>                                                                         polygons
#>                                                                    <POLYGON [°]>
#> 1 ((-122.0809 37.3736, -122.0813 37.3764, -122.0812 37.3767, -122.082 37.3772, …

polygons2 <- map(
    unique(points$k),
    ~ concaveman(points[points$k %in% ., ])
) %>%
    map2(unique(points$k), ~ mutate(.x, k = .y)) %>%
    reduce(rbind)

map <- tm_shape(polygons2) +
    tm_fill(fill = "k", fill_alpha = 0.5, fill.legend = tm_legend_hide()) +
    tm_borders() +
    tm_layout(frame = FALSE) +
    tm_shape(polygons2) +
    tm_dots(col = "green", size = 5) # , fill.legend = tm_legend_hide()) +

plot(map)

# dev.off()
