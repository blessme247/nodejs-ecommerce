import express from "express";
const router = express.Router();
import employeesController from "../../controllers/employees.controller.js";
const {
  getAllEmployees,
  addEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployee,
} = employeesController;
import roles from "../../config/rolesList.js";
import verifyRoles from "../../middleware/verifyRoles.js";
import verifyJwt from "../../middleware/verifyJwt.js";


router.use(verifyJwt)

router
  .route("/")
  .get(getAllEmployees)
  .post(verifyRoles(roles.Admin, roles.Editor), addEmployee);
// .put( verifyRoles(roles.Admin, roles.Editor), updateEmployee)
// .delete( verifyRoles(roles.Admin), deleteEmployee);

router
  .route("/:id")
  .get(getEmployee)
  .put(verifyRoles(roles.Admin, roles.Editor), updateEmployee)
  .delete(verifyRoles(roles.Admin), deleteEmployee);

export default router;
