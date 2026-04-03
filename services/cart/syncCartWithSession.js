/* * Sync cart expiration with session expiration
 * This ensures that when a user's session expires, their cart also expires, preventing stale carts from lingering in the database.
 * The syncCartWithSession function is called whenever we create or update a cart for a guest user (identified by sessionId).
 * It sets the cart's expiresAt field to match the session's expiration time.
 * This way, if the session expires, the cart will also be marked as expired and can be cleaned up by a background job or cron task.
 */
export const syncCartWithSession = (req, cart) => {
   // Sync cart expiration with session
    const sessionExpiry = req.session.cookie.expires;
    cart.expiresAt = new Date(sessionExpiry)
}