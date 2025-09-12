devtools::load_all(".")
# library(concaveman3d)
# library("scatterplot3d")

# pdf("thesis/benchmark.pdf")

# par(mfrow = c(2, 2))

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

generation2 <- function(n) {
    n <- floor(sqrt(n))
    noise <- 2
    errors <- data.frame(x = rnorm(n^2, 0, noise), y = rnorm(n^2, 0, noise), z = rnorm(n^2, 0, 5 * noise))
    errors
}

number <- 1
total <- 0
run <- function(x) {
    cat("running", number, "time of", total, "with size:", x, "\n")
    number <<- number + 1
    sample <- generation(x)
    (system.time(hull <- concaveman3d(sample, 3.5, 15), gcFirst = TRUE))[["elapsed"]]
}

low <- 100
hi <- 2000

# priming the algorithm (triggering javascript compilation)
p <- generation(200)
for (i in 1:100) concaveman3d(p)


# running benchmark
sizes <- sort(rep(unique(floor(sqrt(seq(low, hi, length.out = (hi - low))))^2), 4))
total <<- length(sizes)
times <- unlist(lapply(sizes, run))
sample <- data.frame(sizes = sizes, times = times)

print(sample)

save(sample, file = "thesis/benchmark_data.rda")
