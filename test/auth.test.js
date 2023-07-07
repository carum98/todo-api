import app from '../src/app.js'
import request from 'supertest'

describe('Authentification', () => {
    test('should return 401 (Unauthorized)', async () => {
        const response = await request(app).get('/users')

        expect(response.status).toBe(401)
    })

    describe('Register', () => {
        test('should return 400 (invalid data)', async () => {
            const response = await request(app).post('/register').send({
                name: 'test',
                user_name: 'test'
            })
    
            expect(response.status).toBe(400)
        })
    
        test('should return 201 (user created)', async () => {
            const response = await request(app).post('/register').send({
                name: 'test',
                user_name: 'test',
                password: 'test'
            })
    
            expect(response.status).toBe(201)
    
            expect(response.body).toMatchObject({
                token: expect.any(String),
                refreshToken: expect.any(String),
                expiredAt: expect.any(Number)
            })
        })
    
        test('should return 409 (user already exists)', async () => {
            const response = await request(app).post('/register').send({
                name: 'test',
                user_name: 'test',
                password: 'test'
            })
    
            expect(response.status).toBe(409)
        })
    })

    describe('Login', () => {
        test('should return 200 (user logged in)', async () => {
            const response = await request(app).post('/login').send({
                user_name: 'test',
                password: 'test'
            })
    
            expect(response.status).toBe(200)
    
            expect(response.body).toMatchObject({
                token: expect.any(String),
                refreshToken: expect.any(String),
                expiredAt: expect.any(Number)
            })
        })
    
        test('should return 401 (invalid password)', async () => {
            const response = await request(app).post('/login').send({
                user_name: 'test',
                password: 'test2'
            })
    
            expect(response.status).toBe(401)
        })
    
        test('should return 404 (user not found)', async () => {
            const response = await request(app).post('/login').send({
                user_name: 'test2',
                password: 'test'
            })
    
            expect(response.status).toBe(404)
        })
    
        test('should return 400 (invalid data)', async () => {
            const response = await request(app).post('/login').send({
                user_name: 'test'
            })
    
            expect(response.status).toBe(400)
        })
    })

    describe('Refresh token', () => {
        let refreshToken = null

        beforeAll(async () => {
            const response = await request(app).post('/login').send({
                user_name: 'test',
                password: 'test'
            })

            refreshToken = response.body.refreshToken
        })

        test('should return 400 (invalid data)', async () => {
            const response = await request(app).post('/refresh-token')

            expect(response.status).toBe(400)
        })

        test('should return 404 (refresh token not found)', async () => {
            const response = await request(app).post('/refresh-token').send({
                refresh: 'test'
            })

            expect(response.status).toBe(404)
        })

        test('should return 200 (token refreshed)', async () => {
            const response = await request(app).post('/refresh-token').send({
                refresh: refreshToken
            })

            expect(response.status).toBe(200)

            expect(response.body).toMatchObject({
                token: expect.any(String),
                refreshToken: expect.any(String),
                expiredAt: expect.any(Number)
            })
        })

        test('should return 404 (User not found)', async () => {
            const response = await request(app).post('/refresh-token').send({
                refresh: refreshToken + 'test'
            })

            expect(response.status).toBe(404)
        })
    })
})