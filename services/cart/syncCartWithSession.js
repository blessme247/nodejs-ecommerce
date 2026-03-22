export const syncCartWithSession = (req, cart) => {
   // Sync cart expiration with session
    const sessionExpiry = req.session.cookie.expires;
    cart.expiresAt = new Date(sessionExpiry)
}