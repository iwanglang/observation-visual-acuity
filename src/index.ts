/**
 * Interface representing a visual acuity scale on a Snellen chart.
 *
 * @interface SnellenChartScale
 * @property {string} display - The display name of the visual acuity scale.
 * @property {number} numerator - The numerator of the Snellen aperture ratio.
 * @property {number} denominator - The denominator of the Snellen aperture ratio.
 * @property {number} LogMAR - The LogMAR value of the visual acuity scale.
 */
export interface SnellenChartScale {
  display: string;
  numerator: number;
  denominator: number;
  LogMAR: number;
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
  private fhirServer: string | undefined;

  /**
   * The authentication token.
   * @private
   */
  private token: string | undefined;

  private optotypesRead: number;

  private snellenChartScales: Record<'foot' | 'metre', SnellenChartScale[]> = {
    'foot': [
      { display: `20/200`, numerator: 20, denominator: 200, LogMAR: 1.00 },
      { display: `20/160`, numerator: 20, denominator: 160, LogMAR: 0.90 },
      { display: `20/125`, numerator: 20, denominator: 125, LogMAR: 0.80 },
      { display: `20/100`, numerator: 20, denominator: 100, LogMAR: 0.70 },
      { display: `20/80`, numerator: 20, denominator: 80, LogMAR: 0.60 },
      { display: `20/63`, numerator: 20, denominator: 63, LogMAR: 0.50 },
      { display: `20/50`, numerator: 20, denominator: 50, LogMAR: 0.40 },
      { display: `20/40`, numerator: 20, denominator: 40,  LogMAR: 0.30 },
      { display: `20/32`, numerator: 20, denominator: 32, LogMAR: 0.20 },
      { display: `20/25`, numerator: 20, denominator: 25, LogMAR: 0.10 },
      { display: `20/20`, numerator: 20, denominator: 20, LogMAR: 0.00 },
      { display: `20/16`, numerator: 20, denominator: 16, LogMAR: -0.10 },
      { display: `20/12.5`, numerator: 20, denominator: 12.5, LogMAR: -0.20 },
      { display: `20/10`, numerator: 20, denominator: 10, LogMAR: -0.30 },
    ],
    'metre': [
      { display: `6/60`, numerator: 6, denominator: 60, LogMAR: 1.00 },
      { display: `6/48`, numerator: 6, denominator: 48, LogMAR: 0.90 },
      { display: `6/38`, numerator: 6, denominator: 38, LogMAR: 0.80 },
      { display: `6/30`, numerator: 6, denominator: 30, LogMAR: 0.70 },
      { display: `6/24`, numerator: 6, denominator: 24, LogMAR: 0.60 },
      { display: `6/18`, numerator: 6, denominator: 18, LogMAR: 0.50 },
      { display: `6/15`, numerator: 6, denominator: 15, LogMAR: 0.40 },
      { display: `6/12`, numerator: 6, denominator: 12, LogMAR: 0.30 },
      { display: `6/9.5`, numerator: 6, denominator: 9.5, LogMAR: 0.20 },
      { display: `6/7.5`, numerator: 6, denominator: 7.5, LogMAR: 0.10 },
      { display: `6/6`, numerator: 6, denominator: 6, LogMAR: 0.00 },
      { display: `6/4.8`, numerator: 6, denominator: 4.8, LogMAR: -0.10 },
      { display: `6/3.8`, numerator: 6, denominator: 3.8, LogMAR: -0.20 },
      { display: `6/3`, numerator: 6, denominator: 3, LogMAR: -0.30 },
    ]
  };

  /**
   * Constructor for initializing the FHIR server and token.
   *
   * @param {string} fhirServer - the URL of the FHIR server
   * @param {string} token - the authentication token
   */
  constructor(fhirServer?: string, token?: string) {
    this.fhirServer = fhirServer;
    this.token = token;
    this.optotypesRead = -2;
  }

  /**
   * Initializes the FHIR server and token for the API.
   *
   * @param {string} fhirServer - The URL of the FHIR server.
   * @param {string} token - The authentication token.
   * @throws {Error} If the FHIR server URL or token is not provided.
   */
  public initialisation(fhirServer: string, token: string) {
    if (fhirServer === undefined) {
      throw new Error('FHIR server URL is required');
    }
    if (token === undefined) {
      throw new Error('Token is required');
    }
    this.fhirServer = fhirServer;
    this.token = token;
  }

  /**
   * Sets the token for the class.
   *
   * @param {string} token - The token to be set.
   */
  public setToken(token: string) {
    this.token = token;
  }

  
  /**
   * Returns an array of VisualAcuityScale objects based on the given unit.
   *
   * @param {string} unitChart - The unit of measurement for the visual acuity scales. Can be 'foot' or 'metre'.
   * @return {VisualAcuityScale[]} An array of VisualAcuityScale objects representing different visual acuity scales.
   */
  public getSnellenChartScales(unitChart: 'foot' | 'metre'): SnellenChartScale[] {
    return this.snellenChartScales[unitChart];
  }

  /**
   * Converts a LogMAR value to the corresponding visual acuity scale based on the given unit chart.
   *
   * @param {number} logMAR - The LogMAR value to be converted.
   * @param {'foot' | 'metre'} unitChart - The unit chart to use for the conversion. Valid values are 'foot' and 'metre'.
   * @return {string | undefined} The corresponding visual acuity scale display value. Returns undefined if the LogMAR value is not found.
   */
  public convertLogMARToSnellenChart(logMAR: number, unitChart: 'foot' | 'metre'): string {
    const snellenChartScale = this.snellenChartScales[unitChart].find(scale => scale.LogMAR === logMAR);
    if(!snellenChartScale) throw new Error('LogMAR not found');
    return snellenChartScale.display;
  }

  /**
   * Converts Snellen's numerical aperture ratio (Snellen numerator/Snellen denominator)
   * to Log MAR (Logarithmic Magnitude of Acuity Ratio).
   * @summary LogMAR VA = 0.1 + LogMAR value of the best line read – 0.02 X (number of optotypes read)
   *
   * @param {number} numerator - The numerator of the Snellen aperture ratio.
   * @param {number} denominator - The denominator of the Snellen aperture ratio.
   * @return {number} The Logarithmic Magnitude of Acuity Ratio (Log MAR).
   */
  public convertSnellenToLogMAR(numerator: number, denominator: number): number {
    if(denominator === 0) throw new Error('Denominator cannot be 0');
    return Number(((Math.log10((numerator/denominator)))-(this.optotypesRead*0.02)).toFixed(1));
  }
}
