import { Request, Response, NextFunction } from 'express';
import { HttpError } from '../utils/http-error';

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  // Erreur personnalisée avec status code (ex: HttpError)
  if (err instanceof HttpError) {
    return res.status(err.statusCode).json({ error: err.message });
  }

  // Autres erreurs natives avec code de statut existant
  const status = err.status || err.statusCode || 500;
  
  // Dans tous les cas, on renvoie une réponse JSON
  res.status(status).json({ 
    error: err.message || 'Erreur Interne du Serveur'
  });
}
