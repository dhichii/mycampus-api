import express from 'express';
import {SekolahRepositoryImpl}
  from '../../../../infrastructure/repository/SekolahRepositoryImpl';
import {prismaClient} from '../../../../infrastructure/database/prisma';
import {AddSekolahUsecase}
  from '../../../../application/usecase/sekolah/AddUsecase';
import {GetAllSekolahUsecase}
  from '../../../../application/usecase/sekolah/GetAllUsecase';
import {EditSekolahByIdUsecase}
  from '../../../../application/usecase/sekolah/EditByIdUsecase';
import {SekolahHandler} from './handler';
import {DeleteSekolahByIdUsecase}
  from '../../../../application/usecase/sekolah/DeleteByIdUsecase';

export function sekolahRouter() {
  // eslint-disable-next-line new-cap
  const router = express.Router();

  // repo
  const sekolahRepo = new SekolahRepositoryImpl(prismaClient);

  // usecase
  const addSekolahUsecase = new AddSekolahUsecase(sekolahRepo);
  const getAllSekolahUsecase = new GetAllSekolahUsecase(sekolahRepo);
  const editSekolahByIdUsecase = new EditSekolahByIdUsecase(sekolahRepo);
  const deleteSekolahByIdUsecase = new DeleteSekolahByIdUsecase(sekolahRepo);

  const handler = new SekolahHandler(
      addSekolahUsecase,
      getAllSekolahUsecase,
      editSekolahByIdUsecase,
      deleteSekolahByIdUsecase,
  );

  // routes
  router.route('/sekolah')
      .post(handler.add)
      .get(handler.getAll);
  router.route('/sekolah/:id')
      .put(handler.editById)
      .delete(handler.deleteById);

  return router;
}
