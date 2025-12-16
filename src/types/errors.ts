export class StrapiApiError extends Error {
  constructor(message: string, public status: number) {
    super(message);
    this.name = 'StrapiApiError';
    this.status = status;
  }
}
