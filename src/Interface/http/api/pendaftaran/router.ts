import express from 'express';
import {PendaftaranRepositoryImpl}
  from '../../../../infrastructure/repository/PendaftaranRepositoryImpl';
import {prismaClient} from '../../../../infrastructure/database/prisma';
import {AddPendaftaranUsecase}
  from '../../../../application/usecase/pendaftaran/AddUsecase';
import {PendaftarRepositoryImpl}
  from '../../../../infrastructure/repository/PendaftarRepositoryImpl';
import {ProdiRepositoryImpl}
  from '../../../../infrastructure/repository/ProdiRepositoryImpl';
import {GetAllPendaftaranUsecase}
  from '../../../../application/usecase/pendaftaran/GetAllUsecase';
import {GetPendaftaranByIdUsecase}
  from '../../../../application/usecase/pendaftaran/GetByIdUsecase';
import {GetPendaftarByIdUsecase}
  from '../../../../application/usecase/pendaftar/GetById';
import {AkunRepositoryImpl}
  from '../../../../infrastructure/repository/AkunRepositoryImpl';
import {SekolahRepositoryImpl}
  from '../../../../infrastructure/repository/SekolahRepositoryImpl';
import {GetProdiByIdUsecase}
  from '../../../../application/usecase/prodi/GetByIdUsecase';
import {EditPendaftaranByIdUsecase}
  from '../../../../application/usecase/pendaftaran/EditByIdUsecase';
import {DeletePendaftaranByIdUsecase}
  from '../../../../application/usecase/pendaftaran/DeleteByIdUsecase';
import {EditStatusPendaftaranByIdUsecase}
  from '../../../../application/usecase/pendaftaran/EditStatusByIdUsecase';
import {ProcessAllPendaftaranUsecase}
  from '../../../../application/usecase/pendaftaran/ProcessAllUsecase';
import {PendaftaranHandler} from './handler';
import {authenticationMiddleware} from '../../middleware/authentication';
import {authorizationMiddleware} from '../../middleware/authorization';
import {Role} from '../../../../util/enum';

export function pendaftaranRouter() {
  // eslint-disable-next-line new-cap
  const router = express.Router();

  // repo
  const pendaftaranRepo = new PendaftaranRepositoryImpl(prismaClient);
  const pendaftarRepo = new PendaftarRepositoryImpl(prismaClient);
  const prodiRepo = new ProdiRepositoryImpl(prismaClient);
  const akunRepo = new AkunRepositoryImpl(prismaClient);
  const sekolahRepo = new SekolahRepositoryImpl(prismaClient);

  // usecase
  const getPendaftarByIdUsecase = new GetPendaftarByIdUsecase(
      pendaftarRepo,
      akunRepo,
      sekolahRepo,
  );
  const getProdiByIdUsecase = new GetProdiByIdUsecase(prodiRepo);

  const addPendaftaranUsecase = new AddPendaftaranUsecase(
      pendaftaranRepo,
      pendaftarRepo,
      prodiRepo,
  );
  const getAllPendaftaranUsecase = new GetAllPendaftaranUsecase(
      pendaftaranRepo,
  );
  const getPendaftaranByIdUsecase = new GetPendaftaranByIdUsecase(
      pendaftaranRepo,
      getPendaftarByIdUsecase,
      getProdiByIdUsecase,
  );
  const editPendaftaranByIdUsecase = new EditPendaftaranByIdUsecase(
      pendaftaranRepo,
  );
  const deletePendaftaranByIdUsecase = new DeletePendaftaranByIdUsecase(
      pendaftaranRepo,
  );
  const editStatusPendaftaranByIdUsecase = new EditStatusPendaftaranByIdUsecase(
      pendaftaranRepo,
      getProdiByIdUsecase,
  );
  const processAllPendaftaranUsecase = new ProcessAllPendaftaranUsecase(
      pendaftaranRepo,
  );

  const handler = new PendaftaranHandler(
      addPendaftaranUsecase,
      getAllPendaftaranUsecase,
      getPendaftaranByIdUsecase,
      editPendaftaranByIdUsecase,
      deletePendaftaranByIdUsecase,
      editStatusPendaftaranByIdUsecase,
      processAllPendaftaranUsecase,
  );

  // routes
  router.route('/pendaftaran')
      .post(
          authenticationMiddleware,
          authorizationMiddleware([Role.PENDAFTAR]),
          handler.add,
      )
      .get(
          authenticationMiddleware,
          authorizationMiddleware([
            Role.ADMIN,
            Role.OPERATOR,
            Role.PENDAFTAR,
            Role.SEKOLAH,
          ]),
          handler.getAll,
      );
  router.route('/pendaftaran/:id')
      .get(
          authenticationMiddleware,
          authorizationMiddleware([
            Role.ADMIN,
            Role.OPERATOR,
            Role.PENDAFTAR,
            Role.SEKOLAH,
          ]),
          handler.getById,
      )
      .put(
          authenticationMiddleware,
          authorizationMiddleware([Role.ADMIN, Role.PENDAFTAR]),
          handler.editById,
      )
      .delete(
          authenticationMiddleware,
          authorizationMiddleware([Role.ADMIN, Role.PENDAFTAR, Role.OPERATOR]),
          handler.deleteById,
      );
  router.route('/pendaftaran/proses')
      .patch(
          authenticationMiddleware,
          authorizationMiddleware([Role.OPERATOR]),
          handler.processAll,
      );
  router.route('/pendaftaran/:id/status')
      .patch(
          authenticationMiddleware,
          authorizationMiddleware([Role.ADMIN, Role.OPERATOR]),
          handler.editStatusById,
      );

  return router;
}
