const { describe, beforeEach, test, expect } = require('@playwright/test')

describe('Bloglist', () => {
	beforeEach(async ({ page, request }) => {
		await request.post('http:localhost:3003/api/testing/reset')
		await request.post('http://localhost:3003/api/users', {
			data: {
				name: 'root',
				username: 'root',
				password: 'password',
			},
		})

		await page.goto('http://localhost:5173')
	})
	test('login form is shown', async ({ page }) => {
		await page.goto('http://localhost:5173')

		const locator = await page.getByText('Log in to application')
		await expect(locator).toBeVisible()
		await expect(page.getByText('Log in to application')).toBeVisible()
	})

	test('login with correct credentials', async ({ page }) => {
		await page.goto('http://localhost:5173')

		await page.getByRole('textbox').first().fill('root')
		await page.getByRole('textbox').last().fill('password')
		await page.getByRole('button', { name: 'login' }).click()

		await expect(page.getByText('root logged in')).toBeVisible()
	})

	test('login fails with wrong credentials', async ({ page }) => {
		await page.getByTestId('username').fill('root')
		await page.getByTestId('password').fill('wrong')
		await page.getByRole('button', { name: 'login' })

		await expect(page.getByText('wrong username or password')).toBeVisible()
	})
})
