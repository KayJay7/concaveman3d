devtools::load_all(".")
# library(concaveman3d)
library("scatterplot3d")


par(mfrow = c(1, 1))

# se <- function(x) sd(x) / sqrt(length(x))
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
# plot( sample)
# plot_ly(sample$x, sample$y, sample$z)

scat <- scatterplot3d(sample$x, sample$y, sample$z, pch = 16, color = "steelblue")

hull <- concaveman3d(sample, 3.5, 15)

print(hull)
scat$points3d(hull$x1, hull$y1, hull$z1, pch = 16, col = "#ff000020")
scat$points3d(hull$x2, hull$y2, hull$z2, pch = 16, col = "#ff000020")
scat$points3d(hull$x3, hull$y3, hull$z3, pch = 16, col = "#ff000020")

# print(iris)
# plot_ly(sample, x = ~x, y = ~y, z = ~z, type = "scatter3d", mode = "markers")

# linear_model <- lm(y ~ x, data = sample)
# smoothed <- loess.smooth(x = sample$x, y = sample$y)

# print(linear_model)
# plot(sample$x,
#     sample$y,
#     abline(linear_model, col = "#108510"),
#     main = "regression"
# )
# lines(smoothed, col = "#c62626")


# fitted_y <- predict(linear_model)
# print(fitted_y)
# fit_vs_residuals <- data.frame(x = fitted_y, y = sample$y - fitted_y)
# print(fit_vs_residuals)
# plot(fit_vs_residuals$x, fit_vs_residuals$y, main = "residuals vs fitted")
# fit_vs_squared <- data.frame(
#     x = fit_vs_residuals$x,
#     y = ifelse(fit_vs_residuals$y > 0, 1, -1) * sqrt(abs(fit_vs_residuals$y))
# )

# lines(fit_vs_squared, col = "#108510")
# squared_smoothed <- loess.smooth(x = fit_vs_squared$x, y = fit_vs_squared$y)
# lines(squared_smoothed, col = "#c62626")

# fit_vs_standard <- data.frame(
#     x = fit_vs_residuals$x,
#     y = scale(fit_vs_residuals$y)
# )
# plot(fit_vs_standard$x,
#     fit_vs_standard$y,
#     main = "standard residuals vs fitted"
# )
# fit_vs_std_squared <- data.frame(
#     x = fit_vs_standard$x,
#     y = ifelse(fit_vs_standard$y > 0, 1, -1) * sqrt(abs(fit_vs_standard$y))
# )

# lines(fit_vs_std_squared, col = "#108510")
# std_squared_smoothed <- loess.smooth(
#     x = fit_vs_std_squared$x,
#     y = fit_vs_std_squared$y
# )
# lines(std_squared_smoothed, col = "#c62626")


# qqnorm(fit_vs_standard$y, pch = 1, frame = FALSE)
# qqline(fit_vs_standard$y, col = "steelblue", lwd = 2)
