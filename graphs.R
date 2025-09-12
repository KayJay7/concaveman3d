load(file = "thesis/benchmark_data.rda")

sample <- data.frame(x = sample$sizes, y = sample$times)
print(sample)

model <- lm(y ~ x, data = sample)
smoothed <- loess.smooth(x = sample$x, y = sample$y)

print(summary(model))
plot(sample$x,
    sample$y,
    abline(model, col = "#108510"),
    main = "regression"
)
lines(smoothed, col = "#c62626")


fitted_y <- predict(model)
# print(fitted_y)
fit_vs_residuals <- data.frame(x = fitted_y, y = sample$y - fitted_y)
print(fit_vs_residuals)
plot(fit_vs_residuals$x, fit_vs_residuals$y, main = "residuals vs fitted")
fit_vs_squared <- data.frame(
    x = fit_vs_residuals$x,
    y = ifelse(fit_vs_residuals$y > 0, 1, -1) * sqrt(abs(fit_vs_residuals$y))
)

# lines(fit_vs_squared, col = "#108510")
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

# lines(fit_vs_std_squared, col = "#108510")
std_squared_smoothed <- loess.smooth(
    x = fit_vs_std_squared$x,
    y = fit_vs_std_squared$y
)
lines(std_squared_smoothed, col = "#c62626")


qqnorm(fit_vs_standard$y, pch = 1, frame = FALSE)
qqline(fit_vs_standard$y, col = "steelblue", lwd = 2)

dev.off()
