// the smaller this number is, the faster everything moves
const METERS_PER_PIXEL = 1/24;

const METERS_PER_NAUTICAL_MILE = 1852;
const MPS_PER_KNOT = METERS_PER_NAUTICAL_MILE / (60 * 60);

export const PX_PER_KNOT = MPS_PER_KNOT / METERS_PER_PIXEL;
export const KNOTS_PER_PX = 1.0 / PX_PER_KNOT;

// console.log("KNOTS_PER_PX=", KNOTS_PER_PX);
// console.log("PX_PER_KNOT=", PX_PER_KNOT);