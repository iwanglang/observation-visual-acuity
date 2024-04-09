import type { OperationOutcome as R4OperationOutcome, Bundle as R4Bundle, Observation as R4Observation } from 'fhir/r4';
import type { OperationOutcome as R5OperationOutcome, Bundle as R5Bundle, Observation as R5Observation } from 'fhir/r5';
import { FetchError, ofetch } from 'ofetch';

type Bundle = R4Bundle | R5Bundle;
type Observation = R4Observation | R5Observation;
type OperationOutcome = R4OperationOutcome | R5OperationOutcome;

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
  numerator?: number;
  denominator?: number;
  LogMAR: number;
}

/**
 * Interface representing the normalized visual acuity data.
 *
 * @interface VisualAcuityNormalization
 * @property {string} id - The identifier of the visual acuity data.
 * @property {string} patientReference - The reference to the patient resource.
 * @property {string} code - The SNOMED CT code for the visual acuity method.
 * @property {string} codeName - The display name of the visual acuity method.
 * @property {'left-eye' | 'right-eye'} bodySite - The body site of the visual acuity method.
 * @property {string} effectiveDateTime - The date and time when the visual acuity was taken.
 * @property {string} display - The display name of the visual acuity result.
 * @property {string | number} result - The visual acuity result.
 * @property {string} [unit] - The unit of the visual acuity result.
 */
export interface VisualAcuityNormalization {
  /** The identifier of the visual acuity data. */
  id: string;
  /** The reference to the patient resource. */
  patientReference: string;
  /** The SNOMED CT code for the visual acuity method. */
  code: string;
  /** The display name of the visual acuity method. */
  codeName: string | null;
  /** The body site of the visual acuity method. */
  bodySite: 'left-eye' | 'right-eye';
  /** The date and time when the visual acuity was taken. */
  effectiveDateTime: string;
  /** The display name of the visual acuity result. */
  display: string;
  /** The visual acuity result. */
  result: string | number;
  /** The unit of the visual acuity result. */
  unit?: string;
}


/**
 * Enumeration of SNOMED CT codes for visual acuity body site.
 *
 * @export
 * @enum {string}
 */
export enum SnomedCodeBodySite {
  LeftEyeStructure = '8966001',
  RightEyeStructure = '18944008',
}

/**
 * Value set for LogMAR visual acuity for the left or right eye.
 *
 * @enum {string}
 */
enum VisualAcuityMethodValueSet {
  LogMARVisualAcuityLeftEye = '413077008',
  LogMARVisualAcuityRightEye = '413078003'
}

/**
 * Generate a message based on the error object or provided errorMessage.
 *
 * @param {unknown} error - The error object to extract the message from.
 * @param {string} [errorMessage] - An optional error message to use if the error object does not provide one.
 * @return {string} The generated error message.
 */
function OperationOutcomeHelper(error: unknown, errorMessage?: string): string {
  if(error instanceof FetchError && Array.isArray(error?.response?._data?.issue)) return ((error as FetchError<OperationOutcome>)?.response?._data?.issue ?? []).flatMap((issue) => issue.diagnostics).join(', ');
  return (error as Error)?.message || errorMessage || 'Internal Server Error';
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

  private headers: Headers | undefined;

  private optotypesRead: number;
  
  private snellenChartScales: Record<'foot' | 'metre', SnellenChartScale[]> = {
    'foot': [
      { display: `20/20`, numerator: 20, denominator: 20, LogMAR: 0.00 },
      { display: `20/25`, numerator: 20, denominator: 25, LogMAR: 0.10 },
      { display: `20/32`, numerator: 20, denominator: 32, LogMAR: 0.20 },
      { display: `20/40`, numerator: 20, denominator: 40,  LogMAR: 0.30 },
      { display: `20/50`, numerator: 20, denominator: 50, LogMAR: 0.40 },
      { display: `20/63`, numerator: 20, denominator: 63, LogMAR: 0.50 },
      { display: `20/80`, numerator: 20, denominator: 80, LogMAR: 0.60 },
      { display: `20/100`, numerator: 20, denominator: 100, LogMAR: 0.70 },
      { display: `20/125`, numerator: 20, denominator: 125, LogMAR: 0.80 },
      { display: `20/160`, numerator: 20, denominator: 160, LogMAR: 0.90 },
      { display: `20/200`, numerator: 20, denominator: 200, LogMAR: 1.00 },
      { display: `20/250`, numerator: 20, denominator: 250, LogMAR: 1.10 },
      { display: `20/300`, numerator: 20, denominator: 300, LogMAR: 1.20 },
      { display: `20/400`, numerator: 20, denominator: 400, LogMAR: 1.30 },
      { display: `20/500`, numerator: 20, denominator: 500, LogMAR: 1.40 },
      { display: `20/600`, numerator: 20, denominator: 600, LogMAR: 1.50 },
      { display: `20/800`, numerator: 20, denominator: 800, LogMAR: 1.60 },
    ],
    'metre': [
      { display: `6/6`, numerator: 6, denominator: 6, LogMAR: 0.00 },
      { display: `6/7.5`, numerator: 6, denominator: 7.5, LogMAR: 0.10 },
      { display: `6/9.5`, numerator: 6, denominator: 9.5, LogMAR: 0.20 },
      { display: `6/12`, numerator: 6, denominator: 12, LogMAR: 0.30 },
      { display: `6/15`, numerator: 6, denominator: 15, LogMAR: 0.40 },
      { display: `6/19`, numerator: 6, denominator: 19, LogMAR: 0.50 },
      { display: `6/24`, numerator: 6, denominator: 24, LogMAR: 0.60 },
      { display: `6/30`, numerator: 6, denominator: 30, LogMAR: 0.70 },
      { display: `6/38`, numerator: 6, denominator: 38, LogMAR: 0.80 },
      { display: `6/48`, numerator: 6, denominator: 48, LogMAR: 0.90 },
      { display: `6/60`, numerator: 6, denominator: 60, LogMAR: 1.00 },
      { display: `6/76`, numerator: 6, denominator: 76, LogMAR: 1.10 },
      { display: `6/96`, numerator: 6, denominator: 96, LogMAR: 1.20 },
      { display: `6/120`, numerator: 6, denominator: 120, LogMAR: 1.30 },
      { display: `6/152`, numerator: 6, denominator: 152, LogMAR: 1.40 },
      { display: `6/192`, numerator: 6, denominator: 192, LogMAR: 1.50 },
      { display: `6/240`, numerator: 6, denominator: 240, LogMAR: 1.60 },
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
   */
  public initialisation(fhirServer: string, token: string) {
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
   * Set the headers for the request.
   *
   * @param {HeadersInit} headers - the headers to be set
   * @return {void} 
   */
  public setHearders(headers: Headers) {
    this.headers = headers;
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
  
  /**
   * Creates a LogMAR visual acuity resource for a given subject, body site, and LogMAR value.
   *
   * @param {string} subjectReference - The reference to the subject for whom the observation is being made.
   * @param {SnomedCodeBodySite} snomedCodeBodySite - The SNOMED code for the body site being observed.
   * @param {number} LogMAR - The LogMAR value representing visual acuity.
   * @return {Observation} The created LogMAR visual acuity resource.
   */
  private createLogMARVisualAcuityResource(subjectReference: string, encounterReference: string | undefined | null, snomedCodeBodySite: SnomedCodeBodySite, LogMAR: number): Observation {
    return {
      resourceType: 'Observation',
      status: 'final',
      category: [
        {
          coding: [
            {
              system : "http://terminology.hl7.org/CodeSystem/observation-category",
              code : "exam",
              display : "Exam"
            }
          ]
        }
      ],
      code: {
        coding: [
          {
            system: "http://snomed.info/sct",
            code: snomedCodeBodySite === SnomedCodeBodySite.LeftEyeStructure ? VisualAcuityMethodValueSet.LogMARVisualAcuityLeftEye : VisualAcuityMethodValueSet.LogMARVisualAcuityRightEye,
          }
        ],
      },
      subject: {
        reference: subjectReference,
      },
      encounter: encounterReference ? { reference: encounterReference } : undefined,
      bodySite: {
        coding: [
          {
            system: "http://snomed.info/sct",
            code: snomedCodeBodySite
          }
        ]
      },
      valueQuantity : {
        value : LogMAR,
        unit : "LogMAR"
      },
    }
  }

  /**
   * Creates a LogMAR visual acuity observation for a subject.
   *
   * @param {string} subjectReference - The reference to the subject
   * @param {SnomedCodeBodySite} snomedCodeBodySite - The SNOMED code for the body site
   * @param {number} LogMAR - The LogMAR value for visual acuity
   * @return {Promise<Observation>} The created Observation resource
   */
  public async createLogMARVisualAcuity(subjectReference: string, snomedCodeBodySite: SnomedCodeBodySite, LogMAR: number): Promise<Observation> {
    try{
      if(!this.fhirServer) throw new Error(`FHIR server not set`);
      let headers: HeadersInit = new Headers();
      const observationResource = await this.createLogMARVisualAcuityResource(subjectReference, undefined, snomedCodeBodySite, LogMAR);
      if(this.headers) headers = this.headers;
      if(this.token) headers.append('Authorization', this.token);
      const queryString = new URLSearchParams({
        category: `http://terminology.hl7.org/CodeSystem/observation-category|exam`,
      }).toString();
      const resource = await ofetch<Observation>(`/Observation?${queryString}`, {
        baseURL: this.fhirServer,
        retry: 3,
        retryDelay: 500,
        method: 'POST',
        headers: headers,
        body: observationResource,
      });
      return resource;
    }catch(error){
      throw new Error(OperationOutcomeHelper(error, `Can't create for resource Observation`));
    }
  }

  /**
   * Create or update LogMAR visual acuity observation for a subject.
   *
   * @param {string} subjectReference - The reference to the subject
   * @param {string | undefined | null} encounterReference - The reference to the encounter (optional)
   * @param {SnomedCodeBodySite} snomedCodeBodySite - The SNOMED code for the body site
   * @param {number} LogMAR - The LogMAR value for visual acuity
   * @return {Promise<Observation>} The created or updated observation resource
   */
  public async createOrUpdateLogMARVisualAcuity(subjectReference: string, snomedCodeBodySite: SnomedCodeBodySite, LogMAR: number): Promise<Observation> {
    try{
      if(!this.fhirServer) throw new Error(`FHIR server not set`);
      let headers: HeadersInit = new Headers();
      const observationResource = await this.createLogMARVisualAcuityResource(subjectReference, undefined, snomedCodeBodySite, LogMAR);
      if(this.headers) headers = this.headers;
      if(this.token) headers.append('Authorization', this.token);
      const queryString = new URLSearchParams({
        category: `http://terminology.hl7.org/CodeSystem/observation-category|exam`,
        subject: subjectReference,
      }).toString();
      const resource = await ofetch<Observation>(`/Observation?${queryString}`, {
        baseURL: this.fhirServer,
        retry: 3,
        retryDelay: 500,
        method: 'PUT',
        headers: headers,
        body: observationResource,
      });
      return resource;
    }catch(error){
      throw new Error(OperationOutcomeHelper(error, `Can't create for resource Observation`));
    }
  }

  /**
   * A function to create LogMAR Visual Acuity with Encounter.
   *
   * @param {string} subjectReference - reference to the subject
   * @param {string | undefined | null} encounterReference - reference to the encounter
   * @param {SnomedCodeBodySite} snomedCodeBodySite - SNOMED code for the body site
   * @param {number} LogMAR - LogMAR value for visual acuity
   * @return {Promise<Observation>} Promise that resolves to an Observation resource
   */
  public async createLogMARVisualAcuityWithEncounter(subjectReference: string, encounterReference: string | undefined | null, snomedCodeBodySite: SnomedCodeBodySite, LogMAR: number): Promise<Observation> {
    try{
      if(!this.fhirServer) throw new Error(`FHIR server not set`);
      let headers: HeadersInit = new Headers();
      const observationResource = await this.createLogMARVisualAcuityResource(subjectReference, encounterReference, snomedCodeBodySite, LogMAR);
      if(this.headers) headers = this.headers;
      if(this.token) headers.append('Authorization', this.token);
      const queryString = new URLSearchParams({
        category: `http://terminology.hl7.org/CodeSystem/observation-category|exam`,
      }).toString();
      const resource = await ofetch<Observation>(`/Observation?${queryString}`, {
        baseURL: this.fhirServer,
        retry: 3,
        retryDelay: 500,
        method: 'POST',
        headers: headers,
        body: observationResource,
      });
      return resource;
    }catch(error){
      throw new Error(OperationOutcomeHelper(error, `Can't create for resource Observation`));
    }
  }

  /**
   * A function to create or update LogMAR Visual Acuity with Encounter.
   *
   * @param {string} subjectReference - reference to the subject
   * @param {string | undefined | null} encounterReference - reference to the encounter
   * @param {SnomedCodeBodySite} snomedCodeBodySite - SNOMED code for the body site
   * @param {number} LogMAR - LogMAR value for visual acuity
   * @return {Promise<Observation>} Promise that resolves to an Observation resource
   */
  public async createOrUpdateLogMARVisualAcuityWithEncounter(subjectReference: string, encounterReference: string | undefined | null, snomedCodeBodySite: SnomedCodeBodySite, LogMAR: number): Promise<Observation> {
    try{
      if(!this.fhirServer) throw new Error(`FHIR server not set`);
      let headers: HeadersInit = new Headers();
      const observationResource = await this.createLogMARVisualAcuityResource(subjectReference, encounterReference, snomedCodeBodySite, LogMAR);
      if(this.headers) headers = this.headers;
      if(this.token) headers.append('Authorization', this.token);
      const queryString = new URLSearchParams({
        category: `http://terminology.hl7.org/CodeSystem/observation-category|exam`,
        subject: subjectReference,
      }).toString();
      const resource = await ofetch<Observation>(`/Observation?${queryString}`, {
        baseURL: this.fhirServer,
        retry: 3,
        retryDelay: 500,
        method: 'PUT',
        headers: headers,
        body: observationResource,
      });
      return resource;
    }catch(error){
      throw new Error(OperationOutcomeHelper(error, `Can't create for resource Observation`));
    }
  }

  /**
   * A function that normalizes observation data into a visual acuity normalization object.
   *
   * @param {Observation} observation - the observation data to be normalized
   * @return {VisualAcuityNormalization} the normalized visual acuity object
   */
  private observationNormalizationHelper(observation: Observation): VisualAcuityNormalization {
    return {
      id: observation?.id || ``,
      patientReference: observation?.subject?.reference ?? ``,
      code: observation?.code?.coding?.[0]?.code ?? ``,
      codeName: observation?.code?.coding?.[0]?.display ?? null,
      bodySite: observation?.bodySite?.coding?.[0]?.code === SnomedCodeBodySite.LeftEyeStructure ? 'left-eye' : 'right-eye',
      effectiveDateTime: observation?.effectiveDateTime ?? ``,
      display: (observation?.valueQuantity?.value !== undefined) && observation?.valueQuantity?.unit ? `${observation!.valueQuantity!.value} ${observation!.valueQuantity!.unit}` : ``,
      result: observation?.valueQuantity?.value ?? ``,
      unit: observation?.valueQuantity?.unit,
    }
  }

  /**
   * This function helps with observation normalization using a Snellen chart.
   *
   * @param {'foot' | 'metre'} unitChart - the unit of the Snellen chart
   * @param {Observation} observation - the observation to be normalized
   * @return {VisualAcuityNormalization} the normalized visual acuity
   */
  private observationNormalizationWithSnellenChartHelper(unitChart: 'foot' | 'metre', observation: Observation): VisualAcuityNormalization {
    const snellenChartScale = this.getSnellenChartScales(unitChart).find((item) => item.LogMAR === observation?.valueQuantity?.value);
    return {
      id: observation?.id || ``,
      patientReference: observation?.subject?.reference ?? ``,
      code: observation?.code?.coding?.[0]?.code ?? ``,
      codeName: observation?.code?.coding?.[0]?.display ?? null,
      bodySite: observation?.bodySite?.coding?.[0]?.code === SnomedCodeBodySite.LeftEyeStructure ? 'left-eye' : 'right-eye',
      effectiveDateTime: observation?.effectiveDateTime ?? ``,
      display: snellenChartScale ? snellenChartScale.display : (observation?.valueQuantity?.value !== undefined) && observation?.valueQuantity?.unit ? `${observation!.valueQuantity!.value} ${observation!.valueQuantity!.unit}` : ``,
      result: observation?.valueQuantity?.value ?? ``,
      unit: observation?.valueQuantity?.unit,
    }
  }

  /**
   * Retrieves the LogMAR visual acuity for a specific subject and body site using FHIR server.
   *
   * @param {string} subjectReference - The reference to the subject
   * @param {SnomedCodeBodySite} snomedCodeBodySite - The SNOMED code for the body site
   * @return {Promise<Observation[]>} An array of observations representing the LogMAR visual acuity
   */
  public async getLogMARVisualAcuity(subjectReference: string, snomedCodeBodySite: SnomedCodeBodySite) {
    try{
      if(!this.fhirServer) throw new Error(`FHIR server not set`);
      let headers: HeadersInit = new Headers();
      if(this.headers) headers = this.headers;
      if(this.token) headers.append('Authorization', this.token);
      const queryString = new URLSearchParams({
        category: `http://terminology.hl7.org/CodeSystem/observation-category|exam`,
        subject: subjectReference,
        code: snomedCodeBodySite === SnomedCodeBodySite.LeftEyeStructure ? VisualAcuityMethodValueSet.LogMARVisualAcuityLeftEye : VisualAcuityMethodValueSet.LogMARVisualAcuityRightEye,
      }).toString();
      const { entry } = await ofetch<R4Bundle<Observation> | R5Bundle<Observation>>(`/Observation?${queryString}`, {
        baseURL: this.fhirServer,
        retry: 3,
        retryDelay: 500,
        method: 'GET',
        headers: headers,
      });
      const observations = entry?.filter((BundleEntry) => BundleEntry?.resource)?.flatMap<Observation>((BundleEntry) => [BundleEntry.resource as Observation]) ?? [];
      const visualAcuityNormalization = await Promise.all(observations.map((observation) => this.observationNormalizationHelper(observation)));
      return visualAcuityNormalization;
    }catch(error){
      throw new Error(OperationOutcomeHelper(error, `Can't get VisualAcuity`));
    }
  }

  /**
   * A function to get LogMAR Visual Acuity with Snellen Chart.
   *
   * @param {'foot' | 'metre'} unitChart - the unit of the chart
   * @param {string} subjectReference - reference of the subject
   * @param {SnomedCodeBodySite} snomedCodeBodySite - the Snomed code of the body site
   * @return {Promise<visualAcuityNormalization>} the normalized visual acuity
   */
  public async getLogMARVisualAcuityWithSnellenChart(unitChart: 'foot' | 'metre', subjectReference: string, snomedCodeBodySite: SnomedCodeBodySite) {
    try{
      if(!this.fhirServer) throw new Error(`FHIR server not set`);
      let headers: HeadersInit = new Headers();
      if(this.headers) headers = this.headers;
      if(this.token) headers.append('Authorization', this.token);
      const queryString = new URLSearchParams({
        category: `http://terminology.hl7.org/CodeSystem/observation-category|exam`,
        subject: subjectReference,
        code: snomedCodeBodySite === SnomedCodeBodySite.LeftEyeStructure ? VisualAcuityMethodValueSet.LogMARVisualAcuityLeftEye : VisualAcuityMethodValueSet.LogMARVisualAcuityRightEye,
      }).toString();
      const { entry } = await ofetch<R4Bundle<Observation> | R5Bundle<Observation>>(`/Observation?${queryString}`, {
        baseURL: this.fhirServer,
        retry: 3,
        retryDelay: 500,
        method: 'GET',
        headers: headers,
      });
      const observations = entry?.filter((BundleEntry) => BundleEntry?.resource)?.flatMap<Observation>((BundleEntry) => [BundleEntry.resource as Observation]) ?? [];
      const visualAcuityNormalization = await Promise.all(observations.map((observation) => this.observationNormalizationWithSnellenChartHelper(unitChart, observation)));
      return visualAcuityNormalization;
    }catch(error){
      throw new Error(OperationOutcomeHelper(error, `Can't get VisualAcuity`));
    }
  }
}
