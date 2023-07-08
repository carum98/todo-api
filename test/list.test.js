import app from '../src/app.js'
import request from 'supertest'

describe('List', () => {
    let token = null

    beforeAll(async () => {
        const response = await request(app).post('/register').send({
            name: 'test_list',
            user_name: 'test_list',
            password: 'test_list'
        })

        token = response.body.token
    })

    describe('Get', () => {
        test('should return 401 (invalid token)', async () => {
            const response = await request(app).get('/lists')

            expect(response.status).toBe(401)
        })

        test('should return 200 (lists found) Empty', async () => {
            const response = await request(app).get('/lists').set('Authorization', `Bearer ${token}`)

            expect(response.status).toBe(200)

            // Expect an object with a 'data' property that contains an array
            expect(response.body).toMatchObject({
                data: expect.any(Array)
            })
        })

        test('should return 200 (lists found) Not empty', async () => {
            await request(app).post('/lists').send({
                name: 'test',
                color: '#000000'
            })
            .set('Authorization', `Bearer ${token}`)

            const response = await request(app).get('/lists').set('Authorization', `Bearer ${token}`)

            expect(response.status).toBe(200)

            expect(response.body).toMatchObject({
                data: expect.arrayContaining([
                    expect.objectContaining({
                        id: expect.any(Number),
                        name: expect.any(String),
                        color: expect.any(String),
                    })
                ])
            })
        })

        test('should return 200 (lists found) - Different user', async () => {
            const user2 = await request(app).post('/register').send({
                name: 'test_list2',
                user_name: 'test_list2',
                password: 'test_list2'
            })

            const responseUser1 = await request(app).get('/lists')
                .set('Authorization', `Bearer ${token}`)

            const responseUser2 = await request(app).get('/lists')
                .set('Authorization', `Bearer ${user2.body.token}`)

            expect(responseUser1.status).toBe(200)
            expect(responseUser2.status).toBe(200)

            expect(responseUser1.body.data).toHaveLength(1)
            expect(responseUser2.body.data).toHaveLength(0)
        })
    })

    describe('Create', () => {
        test('should return 401 (invalid token)', async () => {
            const response = await request(app).post('/lists').send({
                name: 'test'
            })

            expect(response.status).toBe(401)
        })

        test('should return 400 (invalid data)', async () => {
            const response = await request(app).post('/lists').send({
                    name: 'test'
                })
                .set('Authorization', `Bearer ${token}`)

            expect(response.status).toBe(400)
        })

        test('should return 201 (list created)', async () => {
            const response = await request(app).post('/lists').send({
                name: 'test',
                color: '#000000'
            })
            .set('Authorization', `Bearer ${token}`)

            expect(response.status).toBe(201)

            expect(response.body).toMatchObject({
                id: expect.any(Number),
                name: expect.any(String),
                color: expect.any(String),
            })
        })
    })

    describe('Update', () => {
        test('should return 401 (invalid token)', async () => {
            const response = await request(app).put('/lists/1').send({
                name: 'test'
            })

            expect(response.status).toBe(401)
        })

        test('should return 404 (list not found)', async () => {
            const response = await request(app).put('/lists/99').send({
                    name: 'test'
                })
                .set('Authorization', `Bearer ${token}`)

            expect(response.status).toBe(404)
        })

        test('should return 400 (invalid data)', async () => {
            const response = await request(app).put('/lists/1').send({
                    name2: 'test'
                })
                .set('Authorization', `Bearer ${token}`)

            expect(response.status).toBe(400)
        })

        test('should return 200 (list updated)', async () => {
            const response = await request(app).put('/lists/1').send({
                    name: 'test_updated',
                    color: '#ffffff'
                })
                .set('Authorization', `Bearer ${token}`)

            expect(response.status).toBe(200)

            expect(response.body).toMatchObject({
                id: expect.any(Number),
                name: expect.any(String),
                color: expect.any(String),
            })

            expect(response.body).toMatchObject({
                name: 'test_updated',
                color: '#ffffff'
            })
        })
    })

    describe('Delete', () => {
        test('should return 401 (invalid token)', async () => {
            const response = await request(app).delete('/lists/1')

            expect(response.status).toBe(401)
        })

        test('should return 404 (list not found)', async () => {
            const response = await request(app).delete('/lists/99')
                .set('Authorization', `Bearer ${token}`)

            expect(response.status).toBe(404)
        })

        test('should return 204 (list deleted)', async () => {
            const response = await request(app).delete('/lists/1')
                .set('Authorization', `Bearer ${token}`)

            expect(response.status).toBe(204)
        })
    })
})