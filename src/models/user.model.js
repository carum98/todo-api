export class User {
    constructor(data) {
        const { id, name, user_name, password } = data

        this.id = id
        this.name = name
        this.user_name = user_name
        this.password = password

        Object.freeze(this)
    }
}