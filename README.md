# IWangLang: Observation Visual Acuity

## 🚀 Quick Start

Install:

```bash
# npm
npm i @iwanglang/observation-visual-acuity

# yarn
yarn add @iwanglang/observation-visual-acuity

# jsr npm
npx jsr add @iwanglang/observation-visual-acuity

# jsr yarn
yarn dlx jsr add @iwanglang/observation-visual-acuity

```

Import:

```js
// ESM / Typescript
import { ObservationVisualAcuity } from "@iwanglang/observation-visual-acuity";

// CommonJS
const {
  ObservationVisualAcuity,
} = require("@iwanglang/observation-visual-acuity");
```

## 🥸 Get Visual Acuity Scale for create Chart

```typescript
import { ObservationVisualAcuity } from "@iwanglang/observation-visual-acuity";

const visualAcuity = new ObservationVisualAcuity();
const visualAcuityScaleFoot = visualAcuity.getSnellenChartScales("foot");
const visualAcuityScaleMetre = visualAcuity.getSnellenChartScales("metre");

console.log(visualAcuityScaleFoot[0]);
// { "display": "20/200", "numerator": 20, "denominator": 200, "LogMAR": 1.00 }

console.log(visualAcuityScaleMetre[0]);
// { "display": "6/60", "numerator": 6, "denominator": 60, "LogMAR": 1.00 }
```

use `getSnellenChartScales` function to get list of Visual Acuity Scale for prepare data of Visual Acuity that will save into server

|  Foot   | Metre | LogMAR |
| :-----: | :---: | :----: |
| 20/200  | 6/60  |  1.00  |
| 20/160  | 6/48  |  0.90  |
| 20/125  | 6/38  |  0.80  |
| 20/100  | 6/30  |  0.70  |
|  20/80  | 6/24  |  0.60  |
|  20/63  | 6/18  |  0.50  |
|  20/50  | 6/15  |  0.40  |
|  20/40  | 6/12  |  0.30  |
|  20/32  | 6/9.5 |  0.20  |
|  20/25  | 6/7.5 |  0.10  |
|  20/20  |  6/6  |  0.00  |
|  20/16  | 6/4.8 | −0.10  |
| 20/12.5 | 6/3.8 | −0.20  |
|  20/10  |  6/3  | −0.30  |
