shape <- function(x, y) 10 + (x / 15)^2 + 15 * sin(y / 6) + (y / 20)^2

generation <- function(n) {
    range <- 150
    noise <- 3
    population <- seq(-range, range, length.out = ceiling((sqrt(n)) * 2)) # n^2 - pi(n^2)/4
    population <- expand.grid(x = population, y = population)
    population$z <- shape(population$x, population$y)
    errors <- data.frame(x = rnorm(nrow(population), 0, noise), y = rnorm(nrow(population), 0, 2 * noise), z = rnorm(nrow(population), 0, 5 * noise))
    population <- population + errors
    population <- population[population$x^2 + population$y^2 < range^2, ]
    population[sample.int(nrow(population), n), ]
}

points3d <- generation(1000)

save(points3d, file = "data/points3d.rda")