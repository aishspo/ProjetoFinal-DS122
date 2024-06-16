declare namespace Express {
    export interface Request {
      file?: any; // Altere 'any' para o tipo do arquivo que você espera receber
    }
  }
  