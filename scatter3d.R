devtools::load_all(".")
# library(concaveman3d)
library("scatterplot3d")


par(mfrow = c(1, 1))

shape <- function(x, y) 10 + (x / 15)^2 + 15 * sin(y / 6) + (y / 20)^2

generation <- function(n) {
    range <- 150
    n <- floor(sqrt(n))
    noise <- 3
    errors <- data.frame(x = rnorm(n^2, 0, noise), y = rnorm(n^2, 0, 2*noise), z = rnorm(n^2, 0, 5 * noise))
    x <- seq(-range, range, length.out = n)
    y <- seq(-range, range, length.out = n)
    sample_xy <- expand.grid(x = x, y = y)
    sample <- data.frame(x = sample_xy$x, y = sample_xy$y, z = shape(sample_xy$x, sample_xy$y))
    sample <- sample + errors
    sample[sample$x^2 + sample$y^2 < range^2, ]
}

generation2 <- function(n) {
    n <- floor(sqrt(n))
    noise <- 2
    errors <- data.frame(x = rnorm(n^2, 0, noise), y = rnorm(n^2, 0, noise), z = rnorm(n^2, 0, 5 * noise))
    errors
}

sample <- generation(3000)
print(sample)

scat <- scatterplot3d(sample$x, sample$y, sample$z, pch = 16, color = "steelblue")

hull <- concaveman3d(sample, 3.5, 15)

print(hull)
scat$points3d(hull$x1, hull$y1, hull$z1, pch = 16, col = "#ff000020")
scat$points3d(hull$x2, hull$y2, hull$z2, pch = 16, col = "#ff000020")
scat$points3d(hull$x3, hull$y3, hull$z3, pch = 16, col = "#ff000020")