export function filter(
  req: Express.Request,
  file: Express.Multer.File,
  callBack: Function,
) {
  if (!file) return callBack(new Error('File is empty',),false);

  const fileExten = file.mimetype.split('/')[1]//el array es para acceder al segundo elemento del array que va devolver split osea la extencion
  const validExtenc = ['jpg','png','jpeg','gif']

  if(validExtenc.includes(fileExten)) return callBack(null,true)
  console.log(fileExten);

  callBack(null, true);
}
