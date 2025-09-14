devtools::load_all(".")
# library(concaveman3d)
# library("scatterplot3d")

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

number <- 1
run <- function(x) {
    number <<- number + 1
    cat("running", number, "time of", count, "with size:", nrow(x), "\n")
    (system.time((hull <- concaveman3d(x, 3.5, 15)), gcFirst = TRUE))[["elapsed"]]
}

count <- 150
low <- 100
hi <- 2000

# warming up the JS engine
p <- generation(200)
for (i in 1:100) concaveman3d(p)

# running benchmark
sizes <- ceiling(seq(low, hi, length.out = count))
inputs <- lapply(sizes, generation)
times <- unlist(lapply(inputs, run))
sample <- data.frame(sizes = sizes, times = times)

save(sample, file = "thesis/benchmark_data_backup.rda")
save(inputs, sample, file = "thesis/benchmark_data.rda")
