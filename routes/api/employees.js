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
// import roles from "../../config/rolesList.js";
import verifyRoles from "../../middleware/verifyRoles.js";
import verifyJwt from "../../middleware/verifyJwt.js";
import Role from "../../model/Role.js";
import { roles } from "../../config/seedData.js";

// const roleValues = Object.values(roles)
const adminRole = roles.find(r => r.name === 'Admin')
const sellerRole = roles.find(r => r.name === 'Seller')

router.use(verifyJwt)

router
  .route("/")
  .get(getAllEmployees)
  .post(verifyRoles(adminRole.code, sellerRole.code), addEmployee);
// .put( verifyRoles(roles.Admin, roles.Editor), updateEmployee)
// .delete( verifyRoles(roles.Admin), deleteEmployee);

router
  .route("/:id")
  .get(getEmployee)
  .put(verifyRoles(adminRole.code, sellerRole.code), updateEmployee)
  .delete(verifyRoles(adminRole.code), deleteEmployee);

export default router;
