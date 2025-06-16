import { prisma } from '@server/app';
import { Session, SessionCreate } from '@server/models';

export const getSessionById = async (id: number) => {
  const sessions = await prisma.sessions.findUnique({ where: { id } });
  return sessions;
};

export const getSessionsByUserId = async (userId: number) => {
  const sessions = await prisma.sessions.findMany({ where: { userId } });
  return sessions;
};

export const getSessionsByDeviceInfoAndIpAndUserId = async (deviceInfo: string, ip: string, userId: number) => {
  const sessions = await prisma.sessions.findMany({
    where: { deviceInfo, ip, userId }
  });
  return sessions;
};

export const getSessionsByIp = async (ip: string) => {
  const sessions = await prisma.sessions.findMany({ where: { ip } });
  return sessions;
};

export const getSessionsByDeviceInfo = async (deviceInfo: string) => {
  const sessions = await prisma.sessions.findMany({ where: { deviceInfo } });
  return sessions;
};

export const createSession = async (data: SessionCreate) => {
  const sessions = await prisma.sessions.create({ data });
  return sessions;
};

export const updateSession = async (sessions: Session) => {
  const updatedSession = await prisma.sessions.update({
    where: { id: sessions.id },
    data: {
      userId: sessions.userId,
      deviceInfo: sessions.deviceInfo,
      ip: sessions.ip,
      cookie: sessions.cookie,
      lastActive: sessions.lastActive,
      loginAttempts: sessions.loginAttempts,
      banDurationMinutes: sessions.banDurationMinutes,
      banStart: sessions.banStart
    }
  });
  return updatedSession;
};
