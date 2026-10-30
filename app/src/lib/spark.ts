/** The sevIT spark: one four-point star cut diagonally into two halves (viewBox -1 -1 2 2). */
export const SPARK_TOP = 'M-0.067 -0.967 Q0.264 -0.473 0.767 -0.167 Q0.334 -0.143 0.187 0.233 Q0.053 -0.244 -0.253 -0.533 Q-0.017 -0.574 -0.067 -0.967Z';
export const SPARK_BOTTOM = 'M-0.767 0.12 Q-0.328 0.116 -0.167 -0.253 Q-0.044 0.226 0.267 0.52 Q0.011 0.561 0.033 0.967 Q-0.273 0.451 -0.767 0.12Z';
export const SPARK = SPARK_TOP + SPARK_BOTTOM;
/** Direction of the cut (unit vector, y down) and the normal pointing to the top half. */
export const CUT = { dx: 0.49, dy: 0.87, nx: 0.87, ny: -0.49 };
