/**
 * @typedef {object} TodoType
 * @property {string} title
 * @property {boolean} is_complete
 * @property {number} user_id
 * @property {number} list_id
 * @property {number} position
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
     * @param {boolean} data.is_complete
     * @param {number} data.user_id
     * @param {number} data.list_id
     * @param {number} data.position
     */
    constructor(data) {
        const { id, title, is_complete, user_id, list_id, position } = data

        this.id = id
        this.title = title
        this.is_complete = Boolean(is_complete)
        this.user_id = user_id
        this.list_id = list_id
        this.position = position

        Object.freeze(this)
    }

    /**
     * @returns {object}
     */
    toJson() {
        return {
            id: this.id,
            title: this.title,
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
            is_complete: params.is_complete ?? this.is_complete,
            user_id: params.user_id ?? this.user_id,
            list_id: params.list_id ?? this.list_id,
            position: params.position ?? this.position,
        })
    }

    /**
     * @param {Object} data
     * @param {string} [data.title]
     * @param {boolean} [data.is_complete]
     * @param {number} [data.position]
     * @returns {object}
     */
    valuesDiffFrom({ title, is_complete, position }) {
        const diff = {
            title: this.title !== title ? title : undefined,
            is_complete: this.is_complete !== is_complete ? is_complete : undefined,
            position: this.position !== position ? position : undefined,
        }

        // Remove undefined values
        Object.keys(diff).forEach(key => diff[key] === undefined && delete diff[key])

        return diff
    }
}