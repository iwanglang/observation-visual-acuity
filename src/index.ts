/**
 * An object representing a visual acuity scale.
 *
 * @property {string} display - The display name of the visual acuity scale.
 * @property {number} LogMAR - The LogMAR value of the visual acuity scale.
 */
interface VisualAcuityScale {
  display: string;
  snellenNumerator: number;
  snellenDenominator: number;
  LogMAR: number;
}

const visualAcuityScales: Record<'foot' | 'metre', VisualAcuityScale[]> = {
  'foot': [
    { display: `20/200`, snellenNumerator: 20, snellenDenominator: 200, LogMAR: 1.00 },
    { display: `20/160`, snellenNumerator: 20, snellenDenominator: 160, LogMAR: 0.90 },
    { display: `20/125`, snellenNumerator: 20, snellenDenominator: 125, LogMAR: 0.80 },
    { display: `20/100`, snellenNumerator: 20, snellenDenominator: 100, LogMAR: 0.70 },
    { display: `20/80`, snellenNumerator: 20, snellenDenominator: 80, LogMAR: 0.60 },
    { display: `20/63`, snellenNumerator: 20, snellenDenominator: 63, LogMAR: 0.50 },
    { display: `20/50`, snellenNumerator: 20, snellenDenominator: 50, LogMAR: 0.40 },
    { display: `20/40`, snellenNumerator: 20, snellenDenominator: 40,  LogMAR: 0.30 },
    { display: `20/32`, snellenNumerator: 20, snellenDenominator: 32, LogMAR: 0.20 },
    { display: `20/25`, snellenNumerator: 20, snellenDenominator: 25, LogMAR: 0.10 },
    { display: `20/20`, snellenNumerator: 20, snellenDenominator: 20, LogMAR: 0.00 },
    { display: `20/16`, snellenNumerator: 20, snellenDenominator: 16, LogMAR: -0.10 },
    { display: `20/12.5`, snellenNumerator: 20, snellenDenominator: 12.5, LogMAR: -0.20 },
    { display: `20/10`, snellenNumerator: 20, snellenDenominator: 10, LogMAR: -0.30 },
  ],
  'metre': [
    { display: `6/60`, snellenNumerator: 6, snellenDenominator: 60, LogMAR: 1.00 },
    { display: `6/48`, snellenNumerator: 6, snellenDenominator: 48, LogMAR: 0.90 },
    { display: `6/38`, snellenNumerator: 6, snellenDenominator: 38, LogMAR: 0.80 },
    { display: `6/30`, snellenNumerator: 6, snellenDenominator: 30, LogMAR: 0.70 },
    { display: `6/24`, snellenNumerator: 6, snellenDenominator: 24, LogMAR: 0.60 },
    { display: `6/18`, snellenNumerator: 6, snellenDenominator: 18, LogMAR: 0.50 },
    { display: `6/15`, snellenNumerator: 6, snellenDenominator: 15, LogMAR: 0.40 },
    { display: `6/12`, snellenNumerator: 6, snellenDenominator: 12, LogMAR: 0.30 },
    { display: `6/9.5`, snellenNumerator: 6, snellenDenominator: 9.5, LogMAR: 0.20 },
    { display: `6/7.5`, snellenNumerator: 6, snellenDenominator: 7.5, LogMAR: 0.10 },
    { display: `6/6`, snellenNumerator: 6, snellenDenominator: 6, LogMAR: 0.00 },
    { display: `6/4.8`, snellenNumerator: 6, snellenDenominator: 4.8, LogMAR: -0.10 },
    { display: `6/3.8`, snellenNumerator: 6, snellenDenominator: 3.8, LogMAR: -0.20 },
    { display: `6/3`, snellenNumerator: 6, snellenDenominator: 3, LogMAR: -0.30 },
  ]
};

/**
 * Returns an array of VisualAcuityScale objects based on the given unit.
 *
 * @param {string} unitChart - The unit of measurement for the visual acuity scales. Can be 'foot' or 'metre'.
 * @return {VisualAcuityScale[]} An array of VisualAcuityScale objects representing different visual acuity scales.
 */
export function getVisualAcuityScales(unitChart: 'foot' | 'metre'): VisualAcuityScale[] {
  return visualAcuityScales[unitChart];
}

/**
 * Converts a LogMAR value to the corresponding visual acuity scale based on the given unit chart.
 *
 * @param {number} logMAR - The LogMAR value to be converted.
 * @param {'foot' | 'metre'} unitChart - The unit chart to use for the conversion. Valid values are 'foot' and 'metre'.
 * @return {string | undefined} The corresponding visual acuity scale display value. Returns undefined if the LogMAR value is not found.
 */
export function convertLogMARToVisualAcuityScale(logMAR: number, unitChart: 'foot' | 'metre'): string {
  const visualAcuityScale = visualAcuityScales[unitChart].find(scale => scale.LogMAR === logMAR);
  if(!visualAcuityScale) throw new Error('LogMAR not found');
  return visualAcuityScale.display;
}

/**
 * Class for interacting with the ObservationVisualAcuity FHIR resource.
 *
 * @class
 * @classdesc Class for interacting with the ObservationVisualAcuity FHIR resource.
 */
export class ObservationVisualAcuity {
  /**
   * The URL of the FHIR server.
   * @private
   */
  private fhirServer: string;

  /**
   * The authentication token.
   * @private
   */
  private token: string;

  private optotypesRead: number;

  /**
   * Constructor for initializing the FHIR server and token.
   *
   * @param {string} fhirServer - the URL of the FHIR server
   * @param {string} token - the authentication token
   */
  constructor(fhirServer: string, token: string) {
    this.fhirServer = fhirServer;
    this.token = token;
    this.optotypesRead = -2;
  }

  /**
   * Converts Snellen's numerical aperture ratio (Snellen numerator/Snellen denominator)
   * to Log MAR (Logarithmic Magnitude of Acuity Ratio).
   * @summary LogMAR VA = 0.1 + LogMAR value of the best line read – 0.02 X (number of optotypes read)
   *
   * @param {number} snellenNumerator - The numerator of the Snellen aperture ratio.
   * @param {number} snellenDenominator - The denominator of the Snellen aperture ratio.
   * @return {number} The Logarithmic Magnitude of Acuity Ratio (Log MAR).
   */
  convertSnellenToLogMAR(snellenNumerator: number, snellenDenominator: number): number {
    return Number(((Math.log10((snellenDenominator/snellenNumerator)))-(this.optotypesRead*0.02)).toFixed(1));
  }

  /**
   * Sets the token for the class.
   *
   * @param {string} token - The token to be set.
   */
  public setToken(token: string) {
    this.token = token;
  }
}
