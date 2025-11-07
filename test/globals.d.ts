/**
 * @Update 2025 - Ajustado para supertest moderno e Node.js
 */
declare global {
  //eslint-disable-next-line no-var
  var testRequest: ReturnType<typeof import('supertest')>;
}

export {};
