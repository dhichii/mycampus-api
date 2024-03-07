import express from 'express';
import multer from 'multer';
import {UniversitasHandler} from './handler';
import {AddUniversitasUsecase}
  from '../../../../application/usecase/universitas/AddUsecase';
import {UniversitasRepositoryImpl}
  from '../../../../infrastructure/repository/UniversitasRepositoryImpl';
import {prismaClient} from '../../../../infrastructure/database/prisma';
import {GetUniversitasByIdUsecase}
  from '../../../../application/usecase/universitas/GetByIdUsecase';
import {GetAllUniversitasUsecase}
  from '../../../../application/usecase/universitas/GetAllUsecase';
import {DeleteUniversitasByIdUsecase}
  from '../../../../application/usecase/universitas/DeleteByIdUsecase';
import {EditUniversitasByIdUsecase}
  from '../../../../application/usecase/universitas/EditByIdUsecase';
import {EditLogoUniversitasByIdUsecase}
  from '../../../../application/usecase/universitas/EditLogoByIdUsecase';
import {createMulterDiskStorage, createMulterFileFilter}
  from '../../../../util/multer';

export function universitasRouter() {
  // eslint-disable-next-line new-cap
  const router = express.Router();
  const path = 'public/';
  const storage = createMulterDiskStorage(path);
  const fileFilter = createMulterFileFilter([
    'image/png',
    'image/jpeg',
    'image/jpg',
  ]);
  const upload = multer({
    storage: storage, limits: {fileSize: 2000000}, fileFilter});

  // repo
  const universitasRepo = new UniversitasRepositoryImpl(prismaClient);

  // usecase
  const addUniversitasUsecase = new AddUniversitasUsecase(universitasRepo);
  const getAllUniversitasUsecase = new GetAllUniversitasUsecase(
      universitasRepo,
  );
  const getUniversitasByIdUsecase = new GetUniversitasByIdUsecase(
      universitasRepo,
  );
  const editUniversitasByIdUsecase =
    new EditUniversitasByIdUsecase(universitasRepo);
  const deleteUniversitasByIdUsecase =
    new DeleteUniversitasByIdUsecase(universitasRepo);
  const editLogoUniversitasByIdUsecase =
    new EditLogoUniversitasByIdUsecase(universitasRepo);

  // handler
  const handler = new UniversitasHandler(
      path,
      addUniversitasUsecase,
      getAllUniversitasUsecase,
      getUniversitasByIdUsecase,
      editUniversitasByIdUsecase,
      deleteUniversitasByIdUsecase,
      editLogoUniversitasByIdUsecase,
  );

  // routes
  router.route('/universitas')
      .post(upload.single('logo'), handler.add)
      .get(handler.getAll);
  router.route('/universitas/:id')
      .get(handler.getById)
      .put(upload.none(), handler.editById)
      .delete(handler.deleteById);
  router.route('/universitas/:id/logo')
      .patch(upload.single('logo'), handler.editLogoById);

  return router;
}
