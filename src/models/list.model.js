/**
 * @typedef {object} ListType
 * @property {string} name
 * @property {string} color
 * @property {number} user_id
 * @property {Object} [count]
 * @property {number} count.total
 * @property {number} count.completed
 * @property {number} count.pending
 */

/**
 * @type {ListType}
 * @property {number} id
 */
export class List {
    /**
     * @param {Object} data
     * @param {number} data.id
     * @param {string} data.name
     * @param {string} data.color
     * @param {number} data.user_id
     * @param {number} [data.total_todos]
     * @param {number} [data.total_todos_completed]
     */
    constructor(data) {
        const { id, name, color, user_id, total_todos, total_todos_completed } = data

        this.id = id
        this.name = name
        this.color = color
        this.user_id = user_id
        this.count = total_todos != undefined && total_todos_completed != undefined 
            ? { total: total_todos, completed: total_todos_completed, pending: total_todos - total_todos_completed } 
            : undefined

        Object.freeze(this)
    }

    /**
     * @returns {object}
     */
    toJson() {
        return {
            id: this.id,
            name: this.name,
            color: this.color,
            count: {
                completed: this.count?.completed ?? 0,
                pending: this.count?.pending ?? 0,
                total: this.count?.total ?? 0,
            }
        }
    }

    /**
     * @param {ListType} param
     * @returns {List}
     */
    copyWith({ name, color, user_id }) {
        return new List({
            id: this.id,
            name: name ?? this.name,
            color: color ?? this.color,
            user_id: user_id ?? this.user_id,
        })
    }

    /**
     * @param {ListType} param
     * @returns {object}
     */
    valuesDiffFrom({ name, color, user_id }) {
        const diff = {
            name: name !== this.name ? name : undefined,
            color: color !== this.color ? color : undefined,
            user_id: user_id !== this.user_id ? user_id : undefined,
        }

        // Remove undefined values
        Object.keys(diff).forEach(key => diff[key] === undefined && delete diff[key])

        return diff
    }
}