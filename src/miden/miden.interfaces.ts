// src/miden-test/miden-test.interface.ts

export interface TestResult {
  test: string;
  success: boolean;
  response?: any;
  error?: string;
  sentData: string;
}

export interface TestCase {
  name: string;
  data: string;
}

export interface TestDecodeResponse {
  success: boolean;
  rustServiceResponse?: any;
  error?: string;
  sentData?: any;
}

export interface TestBlockResponse {
  success: boolean;
  blockNumber: number;
  base64Data: string;
  rustServiceResponse?: any;
  error?: string;
}
