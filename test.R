se <- function(x) sd(x) / sqrt(length(x))

par(mfrow = c(2, 2))

error <- rnorm(100, 5, 5)
sample_z <- seq(0, 20, length.out = 100)
sample_y <- error + 4 + (sample_z * 2) + (0.2 * sample_z * sample_z)
sample <- data.frame(x = sample_z, y = sample_y)
print(sample)
linear_model <- lm(y ~ x, data = sample)
smoothed <- loess.smooth(x = sample$x, y = sample$y)

print(linear_model)
plot(sample$x,
    sample$y,
    abline(linear_model, col = "#108510"),
    main = "regression"
)
lines(smoothed, col = "#c62626")


fitted_y <- predict(linear_model)
print(fitted_y)
fit_vs_residuals <- data.frame(x = fitted_y, y = sample$y - fitted_y)
print(fit_vs_residuals)
plot(fit_vs_residuals$x, fit_vs_residuals$y, main = "residuals vs fitted")
fit_vs_squared <- data.frame(
    x = fit_vs_residuals$x,
    y = ifelse(fit_vs_residuals$y > 0, 1, -1) * sqrt(abs(fit_vs_residuals$y))
)

lines(fit_vs_squared, col = "#108510")
squared_smoothed <- loess.smooth(x = fit_vs_squared$x, y = fit_vs_squared$y)
lines(squared_smoothed, col = "#c62626")

fit_vs_standard <- data.frame(
    x = fit_vs_residuals$x,
    y = scale(fit_vs_residuals$y)
)
plot(fit_vs_standard$x,
    fit_vs_standard$y,
    main = "standard residuals vs fitted"
)
fit_vs_std_squared <- data.frame(
    x = fit_vs_standard$x,
    y = ifelse(fit_vs_standard$y > 0, 1, -1) * sqrt(abs(fit_vs_standard$y))
)

lines(fit_vs_std_squared, col = "#108510")
std_squared_smoothed <- loess.smooth(
    x = fit_vs_std_squared$x,
    y = fit_vs_std_squared$y
)
lines(std_squared_smoothed, col = "#c62626")


qqnorm(fit_vs_standard$y, pch = 1, frame = FALSE)
qqline(fit_vs_standard$y, col = "steelblue", lwd = 2)
