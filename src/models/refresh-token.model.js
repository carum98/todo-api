/**
 * @typedef {object} RefreshTokenType
 * @property {string} token
 * @property {number} user_id
 */

/**
 * @type {RefreshTokenType}
 * @property {number} id
 */
export class RefreshToken {
    /**
     * @param {object} data 
     * @param {number} data.id
     * @param {string} data.token
     * @param {number} data.user_id
     */
    constructor(data) {
        const { id, token, user_id } = data

        this.id = id
        this.token = token
        this.user_id = user_id

        Object.freeze(this)
    }

    /**
     * @param {object} param
     * @param {string} [param.token]
     * @returns {RefreshToken}
     */
    copyWith({ token }) {
        return new RefreshToken({
            id: this.id,
            token: token ?? this.token,
            user_id: this.user_id,
        })
    }

    /**
     * @param {RefreshTokenType} param
     * @returns {object}
     */
    valuesDiffFrom({ token, user_id }) {
        const diff = {
            token: token ?? this.token,
            user_id: user_id ?? this.user_id,
        }

        // Remove undefined values
        Object.keys(diff).forEach(key => diff[key] === undefined && delete diff[key])

        return diff
    }
}