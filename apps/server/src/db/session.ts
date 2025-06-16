import { prisma } from '@server/app';
import { Session, SessionCreate } from '@shared/models';

export const getSessionById = async (id: number) => {
  const session: Session | null = await prisma.session.findUnique({ where: { id } });
  return session;
};

export const getSessionsByUserId = async (userId: number) => {
  const sessions: Session[] = await prisma.session.findMany({ where: { userId } });
  return sessions;
};

export const getSessionsByDeviceInfoAndIpAndUserId = async (deviceInfo: string, ip: string, userId: number) => {
  const sessions: Session[] = await prisma.session.findMany({
    where: { deviceInfo, ip, userId }
  });
  return sessions;
};

export const getSessionsByIp = async (ip: string) => {
  const sessions: Session[] = await prisma.session.findMany({ where: { ip } });
  return sessions;
};

export const getSessionsByDeviceInfo = async (deviceInfo: string) => {
  const sessions: Session[] = await prisma.session.findMany({ where: { deviceInfo } });
  return sessions;
};

export const createSession = async (data: SessionCreate) => {
  const session: Session = await prisma.session.create({ data });
  return session;
};

export const updateSession = async (session: Session) => {
  const updatedSession: Session = await prisma.session.update({
    where: { id: session.id },
    data: {
      userId: session.userId,
      deviceInfo: session.deviceInfo,
      ip: session.ip,
      cookie: session.cookie,
      lastActive: session.lastActive,
      loginAttempts: session.loginAttempts,
      banDurationMinutes: session.banDurationMinutes,
      banStart: session.banStart
    }
  });
  return updatedSession;
};
