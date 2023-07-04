/**
 * @typedef {object} TodoType
 * @property {string} title
 * @property {string} description
 * @property {boolean} is_complete
 * @property {number} user_id
 */

/**
 * @type {TodoType}
 * @property {number} id
 */
export class Todo {
    /**
     * @param {Object} data
     * @param {number} data.id
     * @param {string} data.title
     * @param {string} data.description
     * @param {boolean} data.is_complete
     * @param {number} data.user_id
     */
    constructor(data) {
        const { id, title, description, is_complete, user_id } = data

        this.id = id
        this.title = title
        this.description = description
        this.is_complete = Boolean(is_complete)
        this.user_id = user_id

        Object.freeze(this)
    }

    /**
     * @returns {object}
     */
    toJson() {
        return {
            id: this.id,
            title: this.title,
            description: this.description,
            is_complete: this.is_complete,
        }
    }

    /**
     * @param {TodoType} params
     * @returns {Todo}
     */
    copyWith(params) {
        return new Todo({
            id: this.id,
            title: params.title ?? this.title,
            description: params.description ?? this.description,
            is_complete: params.is_complete ?? this.is_complete,
            user_id: params.user_id ?? this.user_id,
        })
    }

    /**
     * @param {TodoType} params
     * @returns {object}
     */
    valuesDiffFrom({ title, description, is_complete }) {
        const diff = {
            title: this.title !== title ? title : undefined,
            description: this.description !== description ? description : undefined,
            is_complete: this.is_complete !== is_complete ? is_complete : undefined,
        }

        // Remove undefined values
        Object.keys(diff).forEach(key => diff[key] === undefined && delete diff[key])

        return diff
    }
}