export interface IStudent {
    id: number;
    name: string;
    user: {
      email: string;
    };
  }
  
  export interface DeleteResponse {
    message: string;
    error?: string;
  }
  