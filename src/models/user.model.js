/**
 * @typedef {object} UserType
 * @property {string} name
 * @property {string} user_name
 * @property {string} password
 */

/**
 * @type {UserType}
 * @property {number} id
 */
export class User {
    /**
     * @param {Object} data
     * @param {number} data.id
     * @param {string} data.name
     * @param {string} data.user_name
     * @param {string} data.password
     */
    constructor(data) {
        const { id, name, user_name, password } = data

        this.id = id
        this.name = name
        this.user_name = user_name
        this.password = password

        Object.freeze(this)
    }

    /**
     * @returns {object}
     */
    toJson() {
        return {
            id: this.id,
            name: this.name,
            user_name: this.user_name,
        }
    }

    /**
     * @param {UserType} param
     * @returns {User}
     */
    copyWith({ name, user_name, password }) {
        return new User({
            id: this.id,
            name: name ?? this.name,
            user_name: user_name ?? this.user_name,
            password: password ?? this.password,
        })
    }
    
    /**
     * @param {UserType} param
     * @returns {object}
     */
    valuesDiffFrom({ name, user_name, password }) {
        const diff = {
            name: this.name !== name ? name : undefined,
            user_name: this.user_name !== user_name ? user_name : undefined,
            password: this.password !== password ? password : undefined,
        }

        // Remove undefined values
        Object.keys(diff).forEach(key => diff[key] === undefined && delete diff[key])

        return diff
    }
}