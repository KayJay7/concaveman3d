library(concaveman3d)
library(sf)
data(points)
context("main tests")

test_that("input and output formats works correctly", {
  expect_is(concaveman3d(sf::st_coordinates(points)), "matrix")
  expect_s3_class(concaveman3d(points), "sf")
  expect_s3_class(concaveman3d(sf::st_geometry(points)), "sfc")
  # input from classes that don't inherit from matrix, sf or SpatialPoints should throw an error
  expect_error(concaveman3d(array()))
})

test_that("outputs from methods are identical", {
  cc_m <- unname(concaveman3d(sf::st_coordinates(points)))
  cc_sf <- unname(sf::st_coordinates(concaveman3d(points))[,1:2])
  cc_sfc <- unname(sf::st_coordinates(concaveman3d(sf::st_geometry(points)))[,1:2])
  
  expect_identical(cc_sf, cc_m)
  expect_identical(cc_sfc, cc_m)
  expect_identical(cc_sf, cc_sfc)
})
