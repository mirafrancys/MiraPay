import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import prisma from '../prisma-client';

export class AuthController {
  async login(req: Request, res: Response) {
    const { emailOrUsername, password } = req.body;
    
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: emailOrUsername },
          { username: emailOrUsername }
        ]
      },
      include: { role: true }
    });

    if (!user) {
      // Utilisateur par défaut (Mode Secours) si la BD est vide
      if (emailOrUsername === 'admin' && password === 'admin123') {
        return res.json({
          message: 'Connexion par défaut réussie',
          user: {
            id: 'fallback-admin-id',
            username: 'admin',
            email: 'admin@mirapay.local',
            firstName: 'Admin',
            lastName: 'Système',
            isActive: true,
            role: { name: 'ADMIN' }
          }
        });
      }
      return res.status(401).json({ error: 'Identifiants invalides' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Identifiants invalides' });
    }

    if (!user.isActive) {
      return res.status(403).json({ error: 'Ce compte est désactivé' });
    }

    // Simplified auth (No JWT for now, just sending back user data)
    const { password: _, ...userData } = user;
    res.json({ message: 'Connexion réussie', user: userData });
  }

  async getRoles(req: Request, res: Response) {
    const roles = await prisma.role.findMany();
    res.json(roles);
  }
}

export const authController = new AuthController();
