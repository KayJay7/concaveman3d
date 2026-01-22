# concaveman3D

lorem ipsum

## Algorithm

The algorithm is based on ideas from the paper [A New Concave Hull
Algorithm and Concaveness Measure for n-dimensional
Datasets, 2012](http://www.iis.sinica.edu.tw/page/jise/2012/201205_10.pdf)
by Jin-Seo Park and Se-Jong Oh.

This implementation by Vladimir Agafonkin dramatically improves
performance over the one stated in the paper (`O(rn)`, where `r` is a
number of output points, to `O(n log n)`) by introducing a fast *k
nearest points to a segment* algorithm, a modification of a depth-first
kNN R-tree search using a priority queue.
