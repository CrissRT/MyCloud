import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import { makeZodI18nMap } from 'zod-i18n-map';

export const zodMiddleware = (req: Request, _res: Response, next: NextFunction) => {
  z.setErrorMap(makeZodI18nMap({ ns: 'zod', t: req.t }));
  next();
};
