# Quick Start Guide - Testing Authentication

This guide will help you test the authentication system quickly.

## Prerequisites

1. **Strapi backend running** on `http://localhost:1337`
2. **At least one user created** in Strapi with Student or Teacher role

## Step 1: Create Environment Variables

You need to create a `.env.local` file. I couldn't create it automatically (it's git-ignored), so please run:

```bash
echo "NEXT_PUBLIC_STRAPI_URL=http://localhost:1337" > .env.local
```

## Step 2: Start the Frontend

```bash
npm run dev
```

The frontend will start at `http://localhost:3000`

## Step 3: Test the Login Flow

1. **Navigate to** `http://localhost:3000`
   - You should be automatically redirected to `/login` (because you're not authenticated)

2. **Enter credentials:**
   - Email: The email of the user you created in Strapi
   - Password: The password you set in Strapi

3. **Click "Log in"**
   - If successful, you'll be redirected to the home page (`/`)
   - You should see your user information displayed

4. **Test logout:**
   - Click the "Logout" button
   - You should be redirected back to `/login`

## Expected Behavior

### When Not Authenticated
- Accessing `/` → Redirects to `/login`
- Accessing any protected route → Redirects to `/login`

### When Authenticated
- Accessing `/login` → Redirects to `/`
- Accessing `/` → Shows your user information and logout button

### Login Errors
- Wrong credentials → Shows error message
- Network error → Shows error message
- Strapi not running → Shows error message

## Testing Different User Roles

1. **Create a Student user** in Strapi
2. **Log in** with Student credentials
3. **Check the home page** - Should display "Role: Student"
4. **Logout**
5. **Create a Teacher user** in Strapi
6. **Log in** with Teacher credentials
7. **Check the home page** - Should display "Role: Teacher"

## Troubleshooting

### "An unexpected error occurred" on login

Check:
1. Is Strapi running? (`cd Eden/backend && npm run dev`)
2. Is the user confirmed? (In Strapi: Content Manager → User → Check "Confirmed" is true)
3. Is the user blocked? (In Strapi: Content Manager → User → Check "Blocked" is false)

### Redirecting to login immediately after login

Check browser console for errors. This might indicate:
1. JWT token not being set correctly
2. CORS issues between frontend and backend
3. Token validation failing

### Cannot see brand-purple styles

The custom Tailwind colors are defined in your `tailwind.config.ts`. If they're not working, check:
1. The config file has the color defined
2. Run `npm run dev` again to rebuild the CSS

## Next Steps

Now that authentication is working, you can:

1. **Create protected pages** - Add new pages under `/app/(main)/`
2. **Add role-based content** - Show different content based on user role
3. **Create a password change form** - Use the `changePassword` function from `@/lib/strapi`
4. **Implement forgot password** - Create a forgot password page using the `forgotPassword` function

See `AUTHENTICATION.md` for more detailed documentation on how to use the authentication system.

