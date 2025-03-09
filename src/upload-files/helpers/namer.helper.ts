import { v4 as uuid } from 'uuid';

export const filrNamer = (
  req: Express.Request,
  file: Express.Multer.File,
  callBack: Function,
) => {
  if (!file) return callBack(new Error('file in empty'), false);
  const fileExten = file.mimetype.split('/')[1];
  const fileName = `${uuid()}.${fileExten}`;
  callBack(null, fileName);
};
