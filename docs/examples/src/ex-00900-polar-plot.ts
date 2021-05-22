// ### Polar plot [(source)](https://github.com/wwwtyro/candygraph/blob/master/docs/examples/src/{{filename}})
// <canvas id="ex-00900" style="box-shadow: 0px 0px 8px #ccc;" width=384 height=384></canvas>

// skip-doc-start
import { CandyGraph } from "../../..";

export default async function PolarPlot(cg: CandyGraph) {
  // Generate some polar data.
  const rhos = [];
  const thetas = [];
  for (let rho = 0; rho <= 0.8; rho += 0.0001) {
    rhos.push(rho * 0.1 * Math.sin(rho * 1000) + rho);
    thetas.push(Math.PI * rho * 2 * Math.PI);
  }

  // Create a viewport. Units are in pixels.
  const viewport = { x: 0, y: 0, width: 384, height: 384 };

  // Create a polar coordinate system. The first two scales map input data to
  // polar distance and angle (in radians), the next two map the resulting
  // cartesian coordinates to pixels.
  const coords = cg.coordinate.polar(
    cg.scale.linear([0, 1], [0, 1]), // radial scale
    cg.scale.linear([0, 1], [0, 1]), // angular scale
    cg.scale.linear([-1.1, 1.1], [16, viewport.width - 16]), // x scale
    cg.scale.linear([-1.1, 1.1], [16, viewport.height - 16]) // y scale
  );

  const font = await cg.defaultFont;

  // Clear the viewport.
  cg.clear([1, 1, 1, 1]);

  // Create axis tick marks, labels, and radial grid lines.
  const axisLinePositions = [];
  const axisLineWidths = [];
  const axisLineColors = [];
  const axisLabels = [];
  for (let turn = 0; turn < 1.0; turn += 20 / 360) {
    const theta = turn * 2 * Math.PI;
    axisLinePositions.push(0, theta, 1.0, theta);
    axisLineWidths.push(1);
    axisLineColors.push(0.75, 0.75, 0.75, 1.0);
    axisLinePositions.push(0.93, theta, 1.0, theta);
    axisLineWidths.push(2);
    axisLineColors.push(0, 0, 0, 1.0);
    for (let i = 1; i <= 9; i++) {
      const phi = theta + (i * 2 * 2 * Math.PI) / 360;
      axisLinePositions.push(0.95, phi, 1.0, phi);
      axisLineWidths.push(1.0);
      axisLineColors.push(0, 0, 0, 1.0);
    }
    axisLabels.push(
      cg.text(font, Math.round(turn * 360).toString(), [1.05, theta], {
        anchor: turn < 0.25 || turn > 0.75 ? [-1, 0] : [1, 0],
        angle: turn < 0.25 || turn > 0.75 ? theta : theta + Math.PI,
      })
    );
  }

  // Create the circular grid lines.
  for (let turn = 0; turn < 1.0; turn += 0.001) {
    const theta0 = (turn + 0.0) * 2 * Math.PI;
    const theta1 = (turn + 0.001) * 2 * Math.PI;
    axisLinePositions.push(1.0, theta0, 1.0, theta1);
    axisLineWidths.push(1.0);
    axisLineColors.push(0, 0, 0, 1.0);
    axisLinePositions.push(0.25, theta0, 0.25, theta1);
    axisLineWidths.push(1.0);
    axisLineColors.push(0.75, 0.75, 0.75, 1.0);
    axisLinePositions.push(0.5, theta0, 0.5, theta1);
    axisLineWidths.push(1.0);
    axisLineColors.push(0.75, 0.75, 0.75, 1.0);
    axisLinePositions.push(0.75, theta0, 0.75, theta1);
    axisLineWidths.push(1.0);
    axisLineColors.push(0.75, 0.75, 0.75, 1.0);
  }

  // Render the a line strip representing the polar data.
  cg.render(coords, viewport, [
    cg.lineSegments(axisLinePositions, {
      widths: axisLineWidths,
      colors: axisLineColors,
    }),
    ...axisLabels,
    cg.lineStrip(rhos, thetas, {
      colors: [1, 0.5, 0, 1],
      widths: 2.5,
    }),
  ]);

  // Copy the plot to a new canvas and add it to the document.
  cg.copyTo(viewport, document.getElementById("ex-00900") as HTMLCanvasElement);
}
