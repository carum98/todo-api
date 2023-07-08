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
                description: 'test'
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
                description: 'test',
                list_id: listId
            }).set('Authorization', `Bearer ${token}`)

            expect(response.status).toBe(201)

            expect(response.body).toMatchObject({
                id: expect.any(Number),
                title: expect.any(String),
                description: expect.any(String),
                is_complete: expect.any(Boolean),
            })

            expect(response.body.is_complete).toBe(false)
        })
    })

    describe('Update', () => {
        test('should return 401 (invalid token)', async () => {
            const response = await request(app).put('/todos/1').send({
                title: 'test',
                description: 'test'
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
                description: 'test'
            }).set('Authorization', `Bearer ${token}`)

            expect(response.status).toBe(404)
        })

        test('should return 200 (todo updated)', async () => {
            const response = await request(app).put('/todos/1').send({
                title: 'test_updated',
                description: 'test_updated'
            }).set('Authorization', `Bearer ${token}`)

            expect(response.status).toBe(200)

            expect(response.body).toMatchObject({
                id: expect.any(Number),
                title: expect.any(String),
                description: expect.any(String),
                is_complete: expect.any(Boolean),
            })
            
            expect(response.body.title).toBe('test_updated')
            expect(response.body.description).toBe('test_updated')
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
})