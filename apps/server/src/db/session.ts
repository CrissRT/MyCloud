import { Session, SessionCreate } from '@server/models';
import { prisma } from '@server/utils';

export const getSessionById = async (id: number) => {
  const session = await prisma.sessions.findUnique({ where: { id } });
  return session;
};

export const getSessionsByUserId = async (userId: number) => {
  const sessions = await prisma.sessions.findMany({ where: { userId } });
  if (!sessions || sessions.length === 0) return null;

  return sessions;
};

export const getSessionsByDeviceInfoAndIpAndUserId = async (deviceInfo: string, ip: string, userId: number) => {
  const sessions = await prisma.sessions.findMany({
    where: { deviceInfo, ip, userId }
  });
  if (!sessions || sessions.length === 0) return null;

  return sessions;
};

export const getSessionsByIp = async (ip: string) => {
  const sessions = await prisma.sessions.findMany({ where: { ip } });
  if (!sessions || sessions.length === 0) return null;

  return sessions;
};

export const getSessionsByDeviceInfo = async (deviceInfo: string) => {
  const sessions = await prisma.sessions.findMany({ where: { deviceInfo } });
  if (!sessions || sessions.length === 0) return null;

  return sessions;
};

export const createSession = async (data: SessionCreate) => {
  const session = await prisma.sessions.create({ data });
  return session;
};

export const updateSession = async (session: Session) => {
  const updatedSession = await prisma.sessions.update({
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
