export interface RetryOnErrorParams {
  attempts?: number;
  backoffMS?: number;
  message: any;
}
