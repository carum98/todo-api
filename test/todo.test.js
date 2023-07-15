import app from '../src/app.js'
import request from 'supertest'

describe('Todo', () => {
    let token = null
    let listId = null

    beforeAll(async () => {
        const response = await request(app).post('/register').send({
            name: 'test_todo',
            user_name: 'test_todo',
            password: 'test_todo'
        })

        token = response.body.token

        const list = await request(app).post('/lists').send({
            name: 'test',
            color: '#000000'
        })
        .set('Authorization', `Bearer ${token}`)

        listId = list.body.id
    })

    describe('Get', () => {
        test('should return 401 (invalid token)', async () => {
            const response = await request(app).get('/todos')

            expect(response.status).toBe(401)
        })

        test('should return 200 (todos found) Empty', async () => {
            const response = await request(app).get('/todos').set('Authorization', `Bearer ${token}`)

            expect(response.status).toBe(200)

            expect(response.body).toMatchObject({
                data: expect.any(Array)
            })

            expect(response.body.data).toHaveLength(0)
        })
    })

    describe('Create', () => {
        test('should return 401 (invalid token)', async () => {
            const response = await request(app).post('/todos').send({
                title: 'test',
            })

            expect(response.status).toBe(401)
        })

        test('should return 400 (invalid body)', async () => {
            const response = await request(app).post('/todos').set('Authorization', `Bearer ${token}`)

            expect(response.status).toBe(400)
        })

        test('should return 201 (todo created)', async () => {
            const response = await request(app).post('/todos').send({
                title: 'test',
                list_id: listId
            }).set('Authorization', `Bearer ${token}`)

            expect(response.status).toBe(201)

            expect(response.body).toMatchObject({
                id: expect.any(Number),
                title: expect.any(String),
                is_complete: expect.any(Boolean),
            })

            expect(response.body.is_complete).toBe(false)
        })
    })

    describe('Update', () => {
        test('should return 401 (invalid token)', async () => {
            const response = await request(app).put('/todos/1').send({
                title: 'test',
            })

            expect(response.status).toBe(401)
        })

        test('should return 400 (invalid body)', async () => {
            const response = await request(app).put('/todos/1').send({
                name: 'test',
            }).set('Authorization', `Bearer ${token}`)

            expect(response.status).toBe(400)
        })

        test('should return 404 (todo not found)', async () => {
            const response = await request(app).put('/todos/100').send({
                title: 'test',
            }).set('Authorization', `Bearer ${token}`)

            expect(response.status).toBe(404)
        })

        test('should return 200 (todo updated)', async () => {
            const response = await request(app).put('/todos/1').send({
                title: 'test_updated',
            }).set('Authorization', `Bearer ${token}`)

            expect(response.status).toBe(200)

            expect(response.body).toMatchObject({
                id: expect.any(Number),
                title: expect.any(String),
                is_complete: expect.any(Boolean),
            })
            
            expect(response.body.title).toBe('test_updated')
        })
    })

    describe('Delete', () => {
        test('should return 401 (invalid token)', async () => {
            const response = await request(app).delete('/todos/1')

            expect(response.status).toBe(401)
        })

        test('should return 404 (todo not found)', async () => {
            const response = await request(app).delete('/todos/100').set('Authorization', `Bearer ${token}`)

            expect(response.status).toBe(404)
        })

        test('should return 204 (todo deleted)', async () => {
            const response = await request(app).delete('/todos/1').set('Authorization', `Bearer ${token}`)

            expect(response.status).toBe(204)
        })
    })

    describe('Mark as complete', () => {
        test('should return 401 (invalid token)', async () => {
            const response = await request(app).put('/todos/1/complete')

            expect(response.status).toBe(401)
        })

        test('should return 404 (todo not found)', async () => {
            const response = await request(app).put('/todos/100/complete').set('Authorization', `Bearer ${token}`)

            expect(response.status).toBe(404)
        })

        test('should return 200 (todo updated)', async () => {
            // Create list
            const list = await request(app).post('/lists').send({
                name: 'test',
                color: '#000000'
            }).set('Authorization', `Bearer ${token}`)

            const listId = list.body.id

            expect(list.status).toBe(201)

            // Create todo
            const todo = await request(app).post('/todos').send({
                title: 'test',
                list_id: listId
            }).set('Authorization', `Bearer ${token}`)

            expect(todo.status).toBe(201)
            expect(todo.body.is_complete).toBe(false)

            const todoId = todo.body.id

            const response = await request(app).post(`/todos/${todoId}/complete`).set('Authorization', `Bearer ${token}`)

            expect(response.status).toBe(200)
            expect(response.body.is_complete).toBe(true)
        })
    })

    describe('Toggle complete', () => {
        test('should return 401 (invalid token)', async () => {
            const response = await request(app).put('/todos/1/toggle-complete')

            expect(response.status).toBe(401)
        })

        test('should return 404 (todo not found)', async () => {
            const response = await request(app).put('/todos/100/toggle-complete').set('Authorization', `Bearer ${token}`)

            expect(response.status).toBe(404)
        })

        test('should return 200 (todo updated)', async () => {
            // Create list
            const list = await request(app).post('/lists').send({
                name: 'test',
                color: '#000000'
            }).set('Authorization', `Bearer ${token}`)

            const listId = list.body.id

            expect(list.status).toBe(201)

            // Create todo
            const todo = await request(app).post('/todos').send({
                title: 'test',
                list_id: listId
            }).set('Authorization', `Bearer ${token}`)

            expect(todo.status).toBe(201)
            expect(todo.body.is_complete).toBe(false)

            const todoId = todo.body.id

            const response = await request(app).post(`/todos/${todoId}/toggle`).set('Authorization', `Bearer ${token}`)

            expect(response.status).toBe(200)
            expect(response.body.is_complete).toBe(true)

            const response2 = await request(app).post(`/todos/${todoId}/toggle`).set('Authorization', `Bearer ${token}`)

            expect(response2.status).toBe(200)
            expect(response2.body.is_complete).toBe(false)
        })
    })

    describe('Move', () => {
        let listId = null
        let todoId = null

        beforeAll(async () => {
            const response = await request(app).post('/lists').send({
                name: 'test',
                color: '#000000'
            })
            .set('Authorization', `Bearer ${token}`)

            listId = response.body.id

            const response1 = await request(app).post(`/lists/${listId}/todos`).send({
                title: 'test_1',
            }).set('Authorization', `Bearer ${token}`)

            todoId = response1.body.id

            await request(app).post(`/lists/${listId}/todos`).send({
                title: 'test_2',
            }).set('Authorization', `Bearer ${token}`)

            await request(app).post(`/lists/${listId}/todos`).send({
                title: 'test_3',
            }).set('Authorization', `Bearer ${token}`)
        })

        test('should return 401 (invalid token)', async () => {
            const response = await request(app).post(`/todos/${todoId}/move`)

            expect(response.status).toBe(401)
        })

        test('should return 404 (todo not found)', async () => {
            const response = await request(app).post('/todos/100/move')
            .send({
                position: 2
            })
            .set('Authorization', `Bearer ${token}`)

            expect(response.status).toBe(404)
        })

        test('should return 400 (invalid position)', async () => {
            const response = await request(app).post(`/todos/${todoId}/move`).send({
                position: 4
            }).set('Authorization', `Bearer ${token}`)

            expect(response.status).toBe(400)
        })

        test('should return 200 (todo moved)', async () => {
            const response = await request(app).get(`/lists/${listId}/todos`).set('Authorization', `Bearer ${token}`)

            expect(response.status).toBe(200)
            expect(response.body.data[0].title).toBe('test_1')
            expect(response.body.data[1].title).toBe('test_2')
            expect(response.body.data[2].title).toBe('test_3')

            const response2 = await request(app).post(`/todos/${todoId}/move`).send({
                position: 2
            }).set('Authorization', `Bearer ${token}`)

            expect(response2.status).toBe(200)

            const response3 = await request(app).get(`/lists/${listId}/todos`).set('Authorization', `Bearer ${token}`)
            
            expect(response3.status).toBe(200)

            console.log(response3.body)

            expect(response3.body.data[0].title).toBe('test_2')
            expect(response3.body.data[1].title).toBe('test_1')
            expect(response3.body.data[2].title).toBe('test_3')
        })
    })
})