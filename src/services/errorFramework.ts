export class AppError extends Error {
  constructor(message: string, public code: string = 'APP_ERROR') {
    super(message);
    this.name = 'AppError';
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 'VALIDATION_ERROR');
    this.name = 'ValidationError';
  }
}

export class AuthError extends AppError {
  constructor(message: string) {
    super(message, 'AUTH_ERROR');
    this.name = 'AuthError';
  }
}

export class PermissionError extends AppError {
  constructor(message: string) {
    super(message, 'PERMISSION_ERROR');
    this.name = 'PermissionError';
  }
}

export class WorkflowError extends AppError {
  constructor(message: string) {
    super(message, 'WORKFLOW_ERROR');
    this.name = 'WorkflowError';
  }
}
