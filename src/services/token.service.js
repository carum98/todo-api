import jwt from 'jsonwebtoken'
import config from '../config/token.conf.js'

import { RefreshToken } from './index.js'
import { User } from '../models/user.model.js'

/**
 * @param {User} user
 * @returns {Promise<{ token: string, refreshToken: string, expiredAt: number }>}
 */
async function generate(user) {
    const payload = {
        user_name: user.user_name,
    }

    const data = {
        token: token(payload),
        refreshToken: refreshToken(payload),
        expiredAt: Date.now() + config.token.expiresIn * 1000,
    }

    await RefreshToken.upsert({ 
        token: data.refreshToken, 
        user_id: user.id,
    })

    return data
}

/**
 * @param {object} payload 
 * @returns {string}
 */
function token(payload) {
    return jwt.sign(payload, config.token.secret, {
        expiresIn: config.token.expiresIn,
    })
}

/**
 * @param {object} payload 
 * @returns {string}
 */
function refreshToken(payload) {
    return jwt.sign(payload, config.refreshToken.secret, {
        expiresIn: config.refreshToken.expiresIn,
    })
}

/**
 * @param {string} token 
 * @returns {string | jwt.JwtPayload}
 */
function verify(token) {
    return jwt.verify(token, config.token.secret)
}

/**
 * @param {string} token 
 * @returns {string | jwt.JwtPayload}
 */
function verifyRefreshToken(token) {
    return jwt.verify(token, config.refreshToken.secret)
}

export default {
    generate,
    verify,
    verifyRefreshToken,
}