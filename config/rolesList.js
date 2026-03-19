export const ROLES = {
     141920 : "Admin",
     251159 : "Seller",
     222519 : "Buyer",
    //  180269 : "Guest"
}

export const ROLE_CODES = {
    "Admin": 141920,
    "Seller": 251159,
    "Buyer": 222519,
    // "Guest": 180269
}


export const getRoleName = (role) => ROLES[role] || null
