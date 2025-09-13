shape <- function(x, y) 10 + (x / 15)^2 + 15 * sin(y / 6) + (y / 20)^2

generation <- function(n) {
    range <- 150
    n <- floor(sqrt(n))
    noise <- 3
    errors <- data.frame(x = rnorm(n^2, 0, noise), y = rnorm(n^2, 0, 2 * noise), z = rnorm(n^2, 0, 5 * noise))
    x <- seq(-range, range, length.out = n)
    y <- seq(-range, range, length.out = n)
    sample_xy <- expand.grid(x = x, y = y)
    sample <- data.frame(x = sample_xy$x, y = sample_xy$y, z = shape(sample_xy$x, sample_xy$y))
    sample <- sample + errors
    sample[sample$x^2 + sample$y^2 < range^2, ]
}

points3d <- generation(2000)

save(points3d, file = "data/points3d.rda")