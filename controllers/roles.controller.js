import Role from "../model/Role.js";

export const getRoles = async (req, res) => {
  try {
    const roles = await Role.find(
      { name: { $not: { $regex: /^admin$/i } } },
      { name: 1, _id: 1 },
    ).exec();

    if (!roles || roles.length === 0) {
      return res.status(404).json({
        message: "No roles found",
      });
    }

    return res.status(200).json({ data: roles });
  } catch (error) {
    console.log(error, "error in catch block");
    return res.status(500).json({ message: "Internal server error" });
  }
};

